const test = require('node:test');
const assert = require('node:assert/strict');
const diary = require('./daily-diary.js');
const source = require('./daily-diary-n4-coverage.json');
const emptyStorage = { getItem: () => null };
const stored = (key, value) => ({ getItem: candidate => candidate === key ? value : null });

test('every date has two distinct four-point packets and two distinct stretch points', () => {
    for (const level of ['N5', 'N4']) for (let i = -365; i < 365; i++) {
        const date = diary.shiftDate('2026-11-27', i), prompts = diary.assignment(date, level);
        assert.equal(prompts.packets.length, 2);
        assert.notEqual(prompts.packets[0].id, prompts.packets[1].id);
        assert(prompts.packets.every(packet => packet.ids.length === 4));
        assert.equal(prompts.stretchIds.length, 2);
        assert.equal(new Set([...prompts.packets.flatMap(packet => packet.ids), ...prompts.stretchIds]).size, 10);
        for (const [group, count] of Object.entries({ grammar: 10, verbs: 10, vocab: 10 })) {
            assert.equal(prompts[group].length, count);
            assert.equal(new Set(prompts[group].map(item => item.id)).size, count);
            assert(prompts[group].every(item => item.meaning && item.ja));
        }
        assert(!prompts.verbs.some(verb => prompts.vocab.some(word => verb.ja === word.ja)));
        assert.deepEqual(prompts, diary.assignment(date, level));
        assert.notDeepEqual(prompts, diary.assignment(diary.shiftDate(date, 1), level));
    }
});

test('all 98 source entries are accounted for in curated packets or the stretch pool', () => {
    const lib = diary.packetLibrary;
    const inventory = new Set(source.sourceIds.map(id => `n4:${id}`));
    const coverage = new Set([...lib.n4Packets.flatMap(packet => packet.ids), ...lib.stretchIds]);
    assert.equal(inventory.size, 98);
    assert.deepEqual(coverage, inventory);
    assert.deepEqual(new Set(lib.points.map(point => point.id)), inventory);
    assert.equal(lib.coverage.includedCount, lib.coverage.sourceCount);
    assert(lib.points.every(point => point.formation && point.example && point.translation));
    assert(lib.n4Packets.every(packet => packet.ids.length === 4));
    const stretchLabels = lib.points.filter(point => lib.stretchIds.includes(point.id)).map(point => point.ja).join(' ');
    assert.match(stretchLabels, /passive/);
    assert.match(stretchLabels, /〜せる/);
    assert.match(stretchLabels, /〜せられる/);
});

test('shuffled cycles cover every packet and stretch point without relying on chance', () => {
    for (let cycle = -4; cycle <= 4; cycle++) {
        const packets = new Set(), stretch = new Set();
        for (let day = 0; day < 11; day++) {
            const daily = diary.assignment(diary.shiftDate('2026-11-27', cycle * 11 + day), 'N4');
            daily.packets.forEach(packet => { assert(!packets.has(packet.id)); packets.add(packet.id); });
        }
        for (let day = 0; day < 7; day++) {
            const daily = diary.assignment(diary.shiftDate('2026-11-27', cycle * 7 + day), 'N4');
            daily.stretchIds.forEach(id => { assert(!stretch.has(id)); stretch.add(id); });
        }
        assert.equal(packets.size, 22);
        assert.equal(stretch.size, 14);
    }
});

test('Japan dates, year boundaries, leap days, and sentence estimates', () => {
    assert.equal(diary.today(new Date('2026-11-23T14:59:59Z')), '2026-11-23');
    assert.equal(diary.today(new Date('2026-11-23T15:00:00Z')), '2026-11-24');
    assert.equal(diary.shiftDate('2026-12-31', 1), '2027-01-01');
    assert.equal(diary.shiftDate('2028-03-01', -1), '2028-02-29');
    assert.equal(diary.validDate('2026-02-30'), false);
    assert.equal(diary.validDate(''), false);
    assert.equal(diary.sentences(''), 0);
    assert.equal(diary.sentences('晴れです。歩きました！楽しいです。\n帰りました。寝ます。'), 5);
});

test('packet snapshots, writing, and checks persist independently by date and level', () => {
    const date = '2026-11-27', records = new Map();
    const storage = { getItem: key => records.get(key) ?? null };
    for (const level of ['N5', 'N4']) {
        const { entry } = diary.load(storage, date, level);
        entry.text = `${level} writing`;
        entry.checked = [entry.prompts.grammar[0].id, entry.prompts.stretchIds[0]];
        entry.prompts.packets[0].title = 'Original saved theme';
        entry.prompts.grammar[0].meaning = 'Original saved explanation';
        records.set(diary.keyFor(date, level), JSON.stringify(entry));
        assert.deepEqual(diary.load(storage, date, level), { entry, error: null });
        assert.equal(diary.load(storage, '2026-11-28', level).entry.text, '');
    }
    assert.equal(diary.load(storage, date, 'N5').entry.text, 'N5 writing');
    assert.equal(diary.load(storage, date, 'N4').entry.text, 'N4 writing');
});

test('five- and ten-point old saves retain text, words, and an exact archive without changing old storage', () => {
    for (const level of ['N5', 'N4']) for (const count of [5, 10]) for (const legacy of [false, true]) {
        if (legacy && level !== 'N4') continue;
        const date = '2026-11-25';
        const old = diary.load(emptyStorage, date, level).entry;
        old.prompts = { grammar: old.prompts.grammar.slice(0, count), verbs: old.prompts.verbs, vocab: old.prompts.vocab };
        old.text = '大切な日記です。';
        old.checked = [old.prompts.grammar[0].id, old.prompts.verbs[0].id];
        if (legacy) delete old.level;
        const oldKey = legacy ? diary.legacyKeyFor(date) : diary.previousKeyFor(date, level);
        const raw = JSON.stringify(old), storage = stored(oldKey, raw);
        const { entry, error } = diary.load(storage, date, level);
        assert.equal(error, null);
        assert.equal(entry.text, old.text);
        assert.deepEqual(entry.prompts.verbs, old.prompts.verbs);
        assert.deepEqual(entry.prompts.vocab, old.prompts.vocab);
        assert.deepEqual(entry.previousGrammar, { points: old.prompts.grammar, checked: [old.prompts.grammar[0].id] });
        assert(entry.checked.includes(old.prompts.verbs[0].id));
        assert.equal(entry.prompts.packets.length, 2);
        assert.equal(entry.prompts.stretchIds.length, 2);
        assert.equal(storage.getItem(oldKey), raw);
        assert.deepEqual(diary.load(stored(diary.keyFor(date, level), JSON.stringify(entry)), date, level), { entry, error: null });
        assert.match(diary.downloadText(entry), /PREVIOUS GRAMMAR ASSIGNMENT/);
    }
});

test('corrupt current or old saves are reported; no silent fallback overwrites', () => {
    const date = '2026-11-27';
    for (const raw of ['broken json', '{}', 'null']) {
        for (const key of [diary.keyFor(date, 'N4'), diary.previousKeyFor(date, 'N4'), diary.legacyKeyFor(date)]) {
            const result = diary.load(stored(key, raw), date, 'N4');
            assert(result.error);
            assert.equal(result.entry.prompts.grammar.length, 10);
        }
    }
    const entry = diary.load(emptyStorage, date, 'N4').entry;
    entry.prompts.packets[1].ids[0] = entry.prompts.packets[0].ids[0];
    assert(diary.load(stored(diary.keyFor(date, 'N4'), JSON.stringify(entry)), date, 'N4').error);
    assert(diary.load({ getItem() { throw Error('blocked'); } }, date).error);
    assert.equal(diary.load(stored(diary.legacyKeyFor(date), 'broken'), date, 'N5').error, null);
});

test('usage keeps optional stretch separate and downloads preserve the packet grouping', () => {
    const entry = diary.load(emptyStorage, '2026-11-27', 'N4').entry;
    entry.text = '今日は勉強しました。';
    entry.checked = [entry.prompts.packets[0].ids[0], entry.prompts.stretchIds[0], entry.prompts.verbs[0].id];
    assert.deepEqual(diary.usage(entry), { sentences: 1, packets: 1, stretch: 1, verbs: 1, vocab: 0 });
    const output = diary.downloadText(entry);
    assert(output.includes(entry.prompts.packets[0].title.toUpperCase()));
    assert(output.includes(entry.prompts.packets[1].title.toUpperCase()));
    assert(output.includes('OPTIONAL STRETCH POINTS'));
    assert(output.includes('[x] '));
    assert(output.includes(entry.text));
});
