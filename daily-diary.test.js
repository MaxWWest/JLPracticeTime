const test = require('node:test');
const assert = require('node:assert/strict');
const diary = require('./daily-diary.js');

test('each date gets exactly 5 grammar points, 10 distinct verbs and 10 distinct vocab words', () => {
    for (let i = 0; i < 370; i++) {
        const date = diary.shiftDate('2026-01-01', i);
        const prompts = diary.assignment(date);
        for (const [group, count] of Object.entries({ grammar: 5, verbs: 10, vocab: 10 })) {
            assert.equal(prompts[group].length, count);
            assert.equal(new Set(prompts[group].map(item => item.ja)).size, count);
            assert(prompts[group].every(item => item.meaning && item.ja));
        }
        assert(!prompts.verbs.some(verb => prompts.vocab.some(word => verb.ja === word.ja)));
        assert.deepEqual(prompts, diary.assignment(date));
        assert.notDeepEqual(prompts, diary.assignment(diary.shiftDate(date, 1)));
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
