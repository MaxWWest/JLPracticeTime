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
    const lookup = new Map([...lib.points, ...Object.values(lib.variantPoints)].map(point => [point.id, point]));
    const coverage = new Set([...Object.values(lib.moodPools).flatMap(packets => packets.flatMap(packet => packet.ids)), ...lib.stretchIds].map(id => `n4:${lookup.get(id).sourceId}`));
    assert.equal(Object.values(lib.moodPools).length, 9);
    assert(Object.values(lib.moodPools).every(packets => packets.length === 10 && packets.every(packet => new Set(packet.ids).size === 4)));
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

function assertFresh(left, right) {
    for (const group of ['grammar', 'verbs', 'vocab']) {
        const previous = new Set(left[group].map(item => item.id));
        assert.deepEqual(right[group].filter(item => previous.has(item.id)).map(item => item.id), [], `${group} must not repeat on adjacent dates`);
    }
}

test('calendar assignments never repeat any category on consecutive days, including leap and cycle boundaries', () => {
    for (const level of ['N5', 'N4']) {
        let previous = diary.assignment('2025-12-30', level);
        for (let i = 1; i <= 1200; i++) {
            const current = diary.assignment(diary.shiftDate('2025-12-30', i), level);
            assertFresh(previous, current);
            previous = current;
        }
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


test('every mood pairing offers three distinct safe themes per side, including changing mood between days', () => {
    const lib = diary.packetLibrary;
    for (const rating of lib.ratings) for (const emotion of lib.emotions) for (let day = 0; day < 30; day++) {
        const date = diary.shiftDate('2026-11-27', day);
        const prompts = diary.assignment(date, 'N4', {rating: rating.id, emotion: emotion.id});
        assert.equal(new Set(prompts.grammar.map(point => point.id)).size, 10);
        assertFresh(diary.assignment(diary.shiftDate(date, -1), 'N4'), prompts);
        const entry = {date, level: 'N4', text: '', checked: [], prompts};
        for (const group of ['rating', 'emotion']) {
            const options = diary.packetChoices(entry, group);
            assert.equal(options.length, 3);
            assert.equal(new Set(options.map(option => option.id)).size, 3);
            assert.equal(new Set(options.map(option => option.ids.slice().sort().join('|'))).size, 3);
            for (const option of options) {
                const selected = structuredClone(entry);
                assert(diary.choosePacket(selected, group, option.id));
                assert.equal(new Set(selected.prompts.grammar.map(point => point.id)).size, 10);
                assertFresh(diary.assignment(diary.shiftDate(date, -1), 'N4'), selected.prompts);
                assertFresh(selected.prompts, diary.assignment(diary.shiftDate(date, 1), 'N4'));
            }
        }
    }
});

test('changing moods preserves writing, words, checks, and saved packet snapshots', () => {
    const date = '2026-11-27';
    const {entry} = diary.load(emptyStorage, date, 'N4');
    entry.text = '今日は楽しかった。';
    const original = structuredClone(entry.prompts);
    entry.checked = [original.grammar[0].id, original.verbs[0].id];
    diary.changeMood(entry, {rating:'bad', emotion:'angry'});
    assert.equal(entry.text, '今日は楽しかった。');
    assert.deepEqual(entry.prompts.verbs, original.verbs);
    assert.deepEqual(entry.prompts.vocab, original.vocab);
    assert(entry.checked.includes(original.verbs[0].id));
    const saved = diary.load(stored(diary.keyFor(date, 'N4'), JSON.stringify(entry)), date, 'N4');
    assert.equal(saved.error, null);
    assert.deepEqual(saved.entry, entry);
    diary.changeMood(saved.entry, original.mood);
    assert.deepEqual(saved.entry.prompts, original);
    assert.deepEqual(saved.entry.checked.sort(), [original.grammar[0].id, original.verbs[0].id].sort());
    assert.match(diary.downloadText(entry), /Day: bad · Feeling: angry/);
});

test('existing themed saves migrate with their writing and earlier grammar preserved', () => {
    const date = '2026-11-27';
    const {entry} = diary.load(emptyStorage, date, 'N4');
    delete entry.prompts.mood;
    entry.text = 'Old writing';
    entry.checked = [entry.prompts.grammar[0].id];
    const raw = JSON.stringify(entry);
    const migrated = diary.load(stored(diary.keyFor(date, 'N4'), raw), date, 'N4');
    assert.equal(migrated.error, null);
    assert.equal(migrated.entry.text, entry.text);
    assert.deepEqual(migrated.entry.previousGrammar, {points:entry.prompts.grammar, checked:entry.checked});
    assert.deepEqual(migrated.entry.prompts.mood, {rating:'okay',emotion:'relaxed'});
});


test('new entries exclude both saved neighbors when opening dates in shuffled order', () => {
    for (const level of ['N5', 'N4']) {
        const records = new Map(), storage = {getItem: key => records.get(key) ?? null};
        // First create gaps, then fill them in reverse order.
        const order = [...Array.from({length: 31}, (_, i) => i * 2), ...Array.from({length: 30}, (_, i) => 59 - i * 2)];
        for (const i of order) {
            const date = diary.shiftDate('2028-02-01', i);
            const loaded = diary.load(storage, date, level);
            assert.equal(loaded.error, null);
            const entry = loaded.entry;
            const excluded = diary.adjacentExclusions(storage, date, level);
            if (level === 'N4') {
                diary.changeMood(entry, {rating: ['bad', 'okay', 'great'][i % 3], emotion: diary.packetLibrary.emotions[i % 6].id}, excluded);
                for (const group of ['rating', 'emotion']) {
                    const options = diary.packetChoices(entry, group, excluded);
                    assert.equal(options.length, 3);
                    assert(diary.choosePacket(entry, group, options[i % 3].id, excluded));
                }
            }
            records.set(diary.keyFor(date, level), JSON.stringify(entry));
            assert.deepEqual(diary.load(storage, date, level), {entry, error: null});
        }
        for (let i = 0; i < 60; i++) {
            const date = diary.shiftDate('2028-02-01', i);
            assertFresh(diary.load(storage, date, level).entry.prompts, diary.load(storage, diary.shiftDate(date, 1), level).entry.prompts);
        }
    }
});

test('old adjacent snapshots are excluded without modifying their saved prompts or writing', () => {
    for (const level of ['N5', 'N4']) {
        const records = new Map(), storage = {getItem: key => records.get(key) ?? null};
        const date = '2026-12-01';
        for (const [offset, sourceDate] of [[-1, '2026-11-20'], [1, '2026-11-25']]) {
            const neighbor = diary.load(emptyStorage, sourceDate, level).entry;
            neighbor.date = diary.shiftDate(date, offset);
            neighbor.text = 'Keep my old writing';
            records.set(diary.keyFor(neighbor.date, level), JSON.stringify(neighbor));
        }
        const before = [...records];
        const loaded = diary.load(storage, date, level);
        assert.equal(loaded.error, null);
        for (const [key, raw] of before) {
            assertFresh(JSON.parse(raw).prompts, loaded.entry.prompts);
            assert.equal(records.get(key), raw);
        }
    }
});

test('packet selection preserves the other packet, writing, words, and checkbox history', () => {
    const entry = diary.load(emptyStorage, '2026-11-28', 'N4').entry;
    entry.text = '今日の日記。';
    const original = structuredClone(entry.prompts), first = original.packets[0];
    entry.checked = [first.ids[0], original.verbs[0].id];
    const choice = diary.packetChoices(entry, 'rating')[1];
    assert(diary.choosePacket(entry, 'rating', choice.id));
    assert.equal(entry.text, '今日の日記。');
    assert.deepEqual(entry.prompts.packets[1], original.packets[1]);
    assert.deepEqual(entry.prompts.verbs, original.verbs);
    assert.deepEqual(entry.prompts.vocab, original.vocab);
    assert(diary.choosePacket(entry, 'rating', first.id));
    assert(entry.checked.includes(first.ids[0]));
    assert(entry.checked.includes(original.verbs[0].id));
    const saved = diary.load(stored(diary.keyFor(entry.date, 'N4'), JSON.stringify(entry)), entry.date, 'N4');
    assert.deepEqual(saved, {entry, error: null});
});

test('corrupt adjacent saves block generation and in-memory neighbors also prevent repeats', () => {
    const date = '2026-11-28';
    assert(diary.load(stored(diary.keyFor('2026-11-27', 'N4'), '{broken'), date, 'N4').error);
    const previous = diary.load(emptyStorage, '2026-11-27', 'N4').entry;
    const session = new Map([[diary.keyFor(previous.date, 'N4'), {entry: previous, error: null}]]);
    const current = diary.load(emptyStorage, date, 'N4', session);
    assert.equal(current.error, null);
    assertFresh(previous.prompts, current.entry.prompts);
});


test('two older ten-point N5 neighbors can span many starter packets without forcing repeats', () => {
    const date = '2026-11-28', records = new Map();
    for (const [offset, start] of [[-1, 0], [1, 10]]) {
        const neighborDate = diary.shiftDate(date, offset);
        const prompts = diary.assignment(neighborDate, 'N5');
        const old = {date: neighborDate, level: 'N5', text: 'Preserve', checked: [], prompts: {
            grammar: diary.banks.N5.grammar.slice(start, start + 10), verbs: prompts.verbs, vocab: prompts.vocab
        }};
        records.set(diary.previousKeyFor(neighborDate, 'N5'), JSON.stringify(old));
    }
    const storage = {getItem: key => records.get(key) ?? null};
    const result = diary.load(storage, date, 'N5');
    assert.equal(result.error, null);
    for (const raw of records.values()) assertFresh(JSON.parse(raw).prompts, result.entry.prompts);
});


test('changing only the feeling keeps the chosen day theme and its checked grammar', () => {
    const entry = diary.load(emptyStorage, '2026-11-28', 'N4').entry;
    diary.choosePacket(entry, 'rating', diary.packetChoices(entry, 'rating')[2].id);
    const dayPacket = structuredClone(entry.prompts.packets[0]);
    entry.checked = [dayPacket.ids[0]];
    diary.changeMood(entry, {...entry.prompts.mood, emotion: 'angry'});
    assert.deepEqual(entry.prompts.packets[0], dayPacket);
    assert(entry.checked.includes(dayPacket.ids[0]));
    assert.equal(new Set(entry.prompts.grammar.map(point => point.id)).size, 10);
    const feelingPacket = structuredClone(entry.prompts.packets[1]);
    diary.changeMood(entry, {...entry.prompts.mood, rating: 'bad'});
    assert.deepEqual(entry.prompts.packets[1], feelingPacket);
    assert.equal(new Set(entry.prompts.grammar.map(point => point.id)).size, 10);
});
