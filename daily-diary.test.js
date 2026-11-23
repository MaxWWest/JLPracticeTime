const test = require('node:test');
const assert = require('node:assert/strict');
const diary = require('./daily-diary.js');

test('each date gets exactly 5 grammar points, 10 distinct verbs and 10 distinct vocab words', () => {
    for (const level of ['N5', 'N4']) for (let i = 0; i < 370; i++) {
        const date = diary.shiftDate('2026-01-01', i);
        const prompts = diary.assignment(date, level);
        for (const [group, count] of Object.entries({ grammar: 5, verbs: 10, vocab: 10 })) {
            assert.equal(prompts[group].length, count);
            assert.equal(new Set(prompts[group].map(item => item.ja)).size, count);
            assert(prompts[group].every(item => item.meaning && item.ja));
        }
        assert(!prompts.verbs.some(verb => prompts.vocab.some(word => verb.ja === word.ja)));
        assert.deepEqual(prompts, diary.assignment(date, level));
        assert.notDeepEqual(prompts, diary.assignment(diary.shiftDate(date, 1), level));
    }
});

test('dates use Japan time and navigate month, year and leap boundaries', () => {
    assert.equal(diary.today(new Date('2026-11-23T14:59:59Z')), '2026-11-23');
    assert.equal(diary.today(new Date('2026-11-23T15:00:00Z')), '2026-11-24');
    assert.equal(diary.shiftDate('2026-12-31', 1), '2027-01-01');
    assert.equal(diary.shiftDate('2028-03-01', -1), '2028-02-29');
    assert.equal(diary.validDate('2026-02-30'), false);
    assert.equal(diary.validDate(''), false);
});

test('saved text, checklists, and original prompt snapshots survive loading separately by date', () => {
    const records = new Map();
    const storage = { getItem: key => records.get(key) ?? null };
    const date = '2026-11-23';
    const { entry } = diary.load(storage, date);
    entry.text = '今日は本を読みました。';
    entry.checked = [entry.prompts.grammar[0].id, entry.prompts.verbs[0].id];
    entry.prompts.grammar[0].meaning = 'Older saved explanation';
    records.set(diary.keyFor(date), JSON.stringify(entry));
    assert.deepEqual(diary.load(storage, date).entry, entry);
    assert.equal(diary.load(storage, '2026-11-24').entry.text, '');
});

test('corrupt or blocked storage is reported without destroying the existing record', () => {
    for (const raw of ['broken json', '{}', 'null', '{"date":"2026-11-23","text":"keep me","checked":[],"prompts":{}}']) {
        const storage = { getItem: () => raw, setItem: () => assert.fail('must not overwrite') };
        const result = diary.load(storage, '2026-11-23');
        assert(result.error);
        assert.equal(result.entry.prompts.grammar.length, 5);
    }
    assert(diary.load({ getItem() { throw Error('blocked'); } }, '2026-11-23').error);
});

test('sentence estimate handles Japanese punctuation, English punctuation, and unfinished lines', () => {
    assert.equal(diary.sentences(''), 0);
    assert.equal(diary.sentences('今日は晴れです。公園に行きました！楽しかったです。\nまた行きたいです。明日は雨です。'), 5);
    assert.equal(diary.sentences('First. Second! Third?'), 3);
    assert.equal(diary.sentences('   \nまだ書いています'), 1);
});


test('N5 stays foundational and N4 uses a separate, richer bank', () => {
    const basic = new Set(diary.banks.N5.grammar.map(item => item.id));
    for (const id of ['past', 'negativepast', 'placeaction', 'destination', 'tai']) assert(basic.has(id));
    for (const id of ['noni', 'teoku', 'teshimau', 'youninaru', 'kamoshirenai']) {
        assert(!basic.has(id));
        assert(diary.banks.N4.grammar.some(item => item.id === id));
    }
    assert.notDeepEqual(diary.assignment('2026-11-23', 'N5'), diary.assignment('2026-11-23', 'N4'));
    for (const bank of Object.values(diary.banks)) for (const items of Object.values(bank)) {
        assert.equal(new Set(items.map(item => item.id)).size, items.length);
        assert(items.every(item => item.ja && item.meaning));
    }
});

test('levels keep independent writing, checklists and prompt snapshots on the same date', () => {
    const records = new Map(), storage = { getItem: key => records.get(key) ?? null };
    const date = '2026-11-23';
    for (const level of ['N5', 'N4']) {
        const { entry } = diary.load(storage, date, level);
        entry.text = `${level} writing`;
        entry.checked = [entry.prompts.grammar[0].id];
        records.set(diary.keyFor(date, level), JSON.stringify(entry));
    }
    for (const level of ['N5', 'N4']) {
        const { entry, error } = diary.load(storage, date, level);
        assert.equal(error, null);
        assert.equal(entry.text, `${level} writing`);
        assert.equal(entry.level, level);
        assert.deepEqual(entry.checked, [entry.prompts.grammar[0].id]);
    }
});

test('legacy mixed entries load unchanged under N4, never replace N5, and remain untouched', () => {
    const date = '2026-11-23', records = new Map();
    const storage = { getItem: key => records.get(key) ?? null };
    const original = { ...diary.load(storage, date).entry, text: '以前の日記です。', checked: ['tai'] };
    delete original.level;
    original.prompts.grammar[0].meaning = 'Original saved prompt';
    const raw = JSON.stringify(original);
    records.set(diary.legacyKeyFor(date), raw);
    assert.equal(diary.load(storage, date, 'N5').entry.text, '');
    const migrated = diary.load(storage, date, 'N4');
    assert.equal(migrated.error, null);
    assert.deepEqual(migrated.entry, { ...original, level: 'N4', legacy: true });
    assert.equal(records.get(diary.legacyKeyFor(date)), raw);
    records.set(diary.keyFor(date, 'N4'), JSON.stringify({ ...migrated.entry, text: 'Updated writing' }));
    assert.equal(diary.load(storage, date, 'N4').entry.text, 'Updated writing');
    records.set(diary.keyFor(date, 'N4'), 'broken');
    assert(diary.load(storage, date, 'N4').error, 'a corrupt newer save must not silently revert to legacy');
});

test('corrupt legacy entries block N4 overwrites without affecting N5', () => {
    const storage = { getItem: key => key.startsWith('kotoba-diary-v1:') ? 'broken' : null };
    assert(diary.load(storage, '2026-11-23', 'N4').error);
    assert.equal(diary.load(storage, '2026-11-23', 'N5').error, null);
});
