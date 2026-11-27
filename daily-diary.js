(function (root, factory) {
    const api = factory(typeof module === 'object' && module.exports ? require('./daily-diary-packets.js') : root.DiaryPackets);
    if (typeof module === 'object' && module.exports) module.exports = api;
    else { root.DailyDiary = api; api.mount(); }
})(typeof globalThis === 'object' ? globalThis : this, function (packetLibrary) {
    'use strict';
    // Authored, offline bank. Stable IDs and saved snapshots preserve older assignments.
    const grammar = [
        ['tai', '〜たい', 'Want to do something', 'Verb ます-stem + たい', '週末は映画を見たいです。', 'I want to watch a movie this weekend.'],
        ['nagara', '〜ながら', 'Do two things at once', 'Verb ます-stem + ながら; both actions have the same subject', '音楽を聞きながら料理をしました。', 'I cooked while listening to music.'],
        ['tekara', '〜てから', 'After doing something', 'Verb て-form + から', '家に帰ってから、お茶を飲みました。', 'After coming home, I drank tea.'],
        ['maeni', '〜前に', 'Before doing something', 'Dictionary-form verb + 前に', '寝る前に本を読みました。', 'I read a book before going to bed.'],
        ['atode', '〜た後で', 'After doing something', 'Verb た-form + 後で', '仕事が終わった後で、散歩しました。', 'After work finished, I went for a walk.'],
        ['tari', '〜たり〜たりする', 'Give examples of activities', 'Verb た-form + り; finish the list with する', '日曜日は本を読んだり、料理をしたりしました。', 'On Sunday I did things like reading and cooking.'],
        ['kara', '〜から', 'Give a reason', 'Plain clause + から; nouns and な-adjectives use だから', '寒かったから、家にいました。', 'I stayed home because it was cold.'],
        ['node', '〜ので', 'Explain a reason', 'Plain clause + ので; nouns and な-adjectives use なので', '雨が降っていたので、バスに乗りました。', 'It was raining, so I took the bus.'],
        ['kedo', '〜けど', 'Contrast two ideas', 'Plain clause + けど; nouns and な-adjectives use だけど', '忙しかったけど、楽しかったです。', 'I was busy, but it was fun.'],
        ['noni', '〜のに', 'Describe an unexpected contrast', 'Plain clause + のに; nouns and な-adjectives use なのに', '早く寝たのに、まだ眠いです。', 'Even though I went to bed early, I am still sleepy.'],
        ['shi', '〜し', 'List reasons or qualities', 'Plain clause + し; nouns and な-adjectives use だし', 'この店は安いし、おいしいし、また来たいです。', 'This restaurant is cheap and tasty, so I want to come again.'],
        ['tsumori', '〜つもり', 'Describe an intention', 'Dictionary-form verb + つもりです', '明日は早く起きるつもりです。', 'I intend to get up early tomorrow.'],
        ['yotei', '〜予定', 'Describe a scheduled plan', 'Dictionary-form verb or noun + の, followed by 予定です', '土曜日に友達に会う予定です。', 'I am scheduled to meet a friend on Saturday.'],
        ['toomou', '〜と思う', 'Say what you think', 'Plain clause + と思う; nouns and な-adjectives keep だ', '明日はいい天気になると思います。', 'I think the weather will be good tomorrow.'],
        ['kamoshirenai', '〜かもしれない', 'Express a possibility', 'Plain form + かもしれない; omit だ after nouns and な-adjectives', '明日は雨が降るかもしれません。', 'It might rain tomorrow.'],
        ['teiru', '〜ている', 'Describe an ongoing action', 'Verb て-form + いる', '今、日本語を勉強しています。', 'I am studying Japanese now.'],
        ['temiru', '〜てみる', 'Try doing something', 'Verb て-form + みる', '新しい料理を作ってみました。', 'I tried making a new dish.'],
        ['teoku', '〜ておく', 'Do something in preparation', 'Verb て-form + おく', '明日の弁当を作っておきました。', 'I made tomorrow’s packed lunch in advance.'],
        ['teshimau', '〜てしまう', 'Finish an action, sometimes with regret', 'Verb て-form + しまう', '電車に傘を忘れてしまいました。', 'Unfortunately, I left my umbrella on the train.'],
        ['teii', '〜てもいい', 'Describe permission', 'Verb て-form + もいい', '今日は早く帰ってもいいと言われました。', 'I was told I could go home early today.'],
        ['nakutemoii', '〜なくてもいい', 'Say something is not necessary', 'Verb ない-form: replace ない with なくてもいい', '明日は早く起きなくてもいいです。', 'I do not have to get up early tomorrow.'],
        ['nakereba', '〜なければならない', 'Describe an obligation', 'Verb ない-form: replace ない with なければならない', '今夜は宿題をしなければなりません。', 'I have to do my homework tonight.'],
        ['kotogadekiru', '〜ことができる', 'Describe an ability', 'Dictionary-form verb + ことができる', '簡単な漢字を読むことができます。', 'I can read simple kanji.'],
        ['takotogaaru', '〜たことがある', 'Describe a past experience', 'Verb た-form + ことがある; use for life experience', '京都に行ったことがあります。', 'I have been to Kyoto.'],
        ['youninaru', '〜ようになる', 'Describe a change in ability or habit', 'Dictionary or potential form + ようになる', '毎日、日記を書くようになりました。', 'I have started writing a diary every day.'],
        ['younisuru', '〜ようにする', 'Make an effort to do something regularly', 'Dictionary-form verb + ようにする', '毎日、野菜を食べるようにしています。', 'I make an effort to eat vegetables every day.'],
        ['kotonisuru', '〜ことにする', 'Describe a decision', 'Dictionary-form verb + ことにする', '今日は家で勉強することにしました。', 'I decided to study at home today.'],
        ['hougaii', '〜たほうがいい', 'Give advice or reflect on a better choice', 'Verb た-form + ほうがいい', '今日は早く寝たほうがいいと思います。', 'I think I should go to bed early today.'],
        ['yori', '〜より〜のほうが', 'Compare two things', 'A より B のほうが + adjective', '昨日より今日のほうが暖かいです。', 'Today is warmer than yesterday.'],
        ['toki', '〜とき', 'Describe when something happens', 'Plain verb / い-adjective + とき; noun + のとき; な-adjective + なとき', '疲れたとき、お茶を飲みます。', 'When I am tired, I drink tea.']
    ].map(([id, ja, meaning, formation, example, translation]) => ({ id, ja, meaning, formation, example, translation }));
    const makeWords = (rows, prefix) => rows.trim().split('\n').map(line => {
        const [ja, reading, meaning] = line.split('|');
        return { id: `${prefix}:${ja}`, ja, reading, meaning };
    });
    const verbs = makeWords(`
行く|いく|to go
来る|くる|to come
帰る|かえる|to return home
歩く|あるく|to walk
走る|はしる|to run
食べる|たべる|to eat
飲む|のむ|to drink
作る|つくる|to make
買う|かう|to buy
使う|つかう|to use
見る|みる|to see; to watch
聞く|きく|to listen; to ask
読む|よむ|to read
書く|かく|to write
話す|はなす|to speak
会う|あう|to meet
待つ|まつ|to wait
起きる|おきる|to wake up
寝る|ねる|to sleep
働く|はたらく|to work
休む|やすむ|to rest
勉強する|べんきょうする|to study
練習する|れんしゅうする|to practice
料理する|りょうりする|to cook
掃除する|そうじする|to clean
洗う|あらう|to wash
忘れる|わすれる|to forget
覚える|おぼえる|to remember; to learn
考える|かんがえる|to think
選ぶ|えらぶ|to choose
持つ|もつ|to hold; to carry
送る|おくる|to send
借りる|かりる|to borrow
教える|おしえる|to teach; to tell
手伝う|てつだう|to help
遊ぶ|あそぶ|to play; to spend time together
乗る|のる|to ride; to board
降りる|おりる|to get off
始める|はじめる|to begin something
終わる|おわる|to finish
`, 'verb');
    const vocab = makeWords(`
朝|あさ|morning
昼|ひる|noon; daytime
夜|よる|night
今日|きょう|today
明日|あした|tomorrow
昨日|きのう|yesterday
週末|しゅうまつ|weekend
時間|じかん|time
天気|てんき|weather
雨|あめ|rain
風|かぜ|wind
空|そら|sky
家|いえ|home; house
部屋|へや|room
学校|がっこう|school
会社|かいしゃ|company
駅|えき|station
公園|こうえん|park
図書館|としょかん|library
店|みせ|shop
友達|ともだち|friend
家族|かぞく|family
先生|せんせい|teacher
仕事|しごと|work
宿題|しゅくだい|homework
予定|よてい|plan; schedule
約束|やくそく|promise; appointment
気持ち|きもち|feeling
本|ほん|book
映画|えいが|movie
音楽|おんがく|music
写真|しゃしん|photo
電車|でんしゃ|train
自転車|じてんしゃ|bicycle
傘|かさ|umbrella
弁当|べんとう|packed lunch
野菜|やさい|vegetables
果物|くだもの|fruit
お茶|おちゃ|tea
水|みず|water
新しい|あたらしい|new
忙しい|いそがしい|busy
楽しい|たのしい|fun; enjoyable
おいしい|おいしい|delicious
暖かい|あたたかい|warm
寒い|さむい|cold
静か|しずか|quiet (な-adjective)
大切|たいせつ|important (な-adjective)
ゆっくり|ゆっくり|slowly; at leisure
少し|すこし|a little
一緒に|いっしょに|together
たくさん|たくさん|a lot
`, 'vocab');
    // Teaching bands for this authored practice bank, not official JLPT lists.
    const n5Ids = new Set(['tai', 'maeni', 'kara', 'teiru', 'teii']);
    const n5Grammar = grammar.filter(item => n5Ids.has(item.id)).map(item => item.id === 'teii'
        ? { ...item, example: 'ここで写真を撮ってもいいです。', translation: 'It is okay to take photos here.' } : item).concat([
        ['past', '〜ました', 'Say what you did', 'Verb ます-form: replace ます with ました', '朝、パンを食べました。', 'I ate bread in the morning.'],
        ['negativepast', '〜ませんでした', 'Say what you did not do', 'Verb ます-form: replace ます with ませんでした', '今日はテレビを見ませんでした。', 'I did not watch TV today.'],
        ['adjectivepast', '〜かったです', 'Describe how something was', 'い-adjective: replace final い with かったです; いい becomes よかったです', '今日は暑かったです。', 'It was hot today.'],
        ['nounpast', '〜でした', 'Describe a past state', 'Noun or な-adjective stem + でした', '昨日は休みでした。', 'Yesterday was a day off.'],
        ['placeaction', '〜で', 'Say where an action happened', 'Place + で + action', '図書館で本を読みました。', 'I read a book at the library.'],
        ['destination', '〜に行く', 'Say where you went', 'Destination + に + 行く', '公園に行きました。', 'I went to the park.'],
        ['with', '〜と', 'Say who you did something with', 'Person + と + action', '友達と話しました。', 'I talked with a friend.'],
        ['also', '〜も', 'Add another person or thing', 'Use も instead of は or を to mean also or too', 'お茶も飲みました。', 'I also drank tea.'],
        ['existence', '〜があります／います', 'Say what is there', 'Place + に + thing + がある; use いる for people and animals', '公園に猫がいました。', 'There was a cat in the park.'],
        ['sequence', '〜て、〜', 'Connect actions in order', 'First verb in て-form, then the next action', '朝ご飯を食べて、学校に行きました。', 'I ate breakfast and went to school.'],
        ['adjectives', '〜くて／〜で', 'Connect descriptions', 'い-adjective: replace final い with くて; な-adjective stem + で', 'この店は安くて、おいしいです。', 'This restaurant is cheap and the food is tasty.']
    ].map(([id, ja, meaning, formation, example, translation]) => ({ id, ja, meaning, formation, example, translation })));
    const n4Verbs = makeWords(`
考える|かんがえる|to think
選ぶ|えらぶ|to choose
送る|おくる|to send
手伝う|てつだう|to help
始める|はじめる|to begin something
続ける|つづける|to continue something
決める|きめる|to decide
準備する|じゅんびする|to prepare
予約する|よやくする|to reserve
相談する|そうだんする|to consult
説明する|せつめいする|to explain
連絡する|れんらくする|to contact
間に合う|まにあう|to be on time
遅れる|おくれる|to be late
調べる|しらべる|to look up; to investigate
比べる|くらべる|to compare
片付ける|かたづける|to tidy up
見つける|みつける|to find
運ぶ|はこぶ|to carry; to transport
直す|なおす|to fix
`, 'verb');
    const n4Vocab = makeWords(`
予定|よてい|plan; schedule
約束|やくそく|promise; appointment
気持ち|きもち|feeling
週末|しゅうまつ|weekend
用事|ようじ|errand; something to do
都合|つごう|convenience; circumstances
理由|りゆう|reason
経験|けいけん|experience
習慣|しゅうかん|habit
生活|せいかつ|daily life
健康|けんこう|health
近所|きんじょ|neighborhood
途中|とちゅう|on the way
久しぶり|ひさしぶり|after a long time
最近|さいきん|recently
将来|しょうらい|future
必要|ひつよう|necessary (な-adjective)
残念|ざんねん|disappointing (な-adjective)
無理|むり|unreasonable; impossible (な-adjective)
十分|じゅうぶん|enough; sufficient
`, 'vocab');
    const banks = {
        N5: { grammar: n5Grammar, verbs: verbs.filter(item => !n4Verbs.some(word => word.id === item.id)), vocab: vocab.filter(item => !n4Vocab.some(word => word.id === item.id)) },
        N4: { grammar: grammar.filter(item => !n5Ids.has(item.id)), verbs: n4Verbs, vocab: n4Vocab }
    };
    const levelFor = level => level === 'N4' ? 'N4' : 'N5';
    const preferenceKey = 'kotoba-diary-level';
    function randomFor(seed) {
        let state = 2166136261;
        for (const ch of seed) state = Math.imul(state ^ ch.charCodeAt(0), 16777619);
        return () => {
            state += 0x6D2B79F5;
            let n = Math.imul(state ^ state >>> 15, 1 | state);
            n ^= n + Math.imul(n ^ n >>> 7, 61 | n);
            return ((n ^ n >>> 14) >>> 0) / 4294967296;
        };
    }
    function pick(pool, count, seed) {
        const shuffled = pool.slice(), random = randomFor(seed);
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, count).map(item => ({ ...item }));
    }
    function assignment(date, level = 'N5', mood) {
        level = levelFor(level);
        return {
            ...packetLibrary.build(date, level, n5Grammar, mood),
            verbs: pick(banks[level].verbs, 10, `${date}:${level}:verbs:v2`),
            vocab: pick(banks[level].vocab, 10, `${date}:${level}:vocab:v2`)
        };
    }
    function today(now = new Date()) {
        const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
        const get = type => parts.find(part => part.type === type).value;
        return `${get('year')}-${get('month')}-${get('day')}`;
    }
    function validDate(value) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
        const parsed = new Date(`${value}T12:00:00Z`);
        return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
    }
    function shiftDate(value, days) {
        const date = new Date(`${value}T12:00:00Z`);
        date.setUTCDate(date.getUTCDate() + days);
        return date.toISOString().slice(0, 10);
    }
    function sentences(text) { return text.split(/[。！？.!?]+(?:[」』”"]*)\s*|\n+/u).filter(part => part.trim()).length; }
    const legacyKeyFor = date => `kotoba-diary-v1:${date}`;
    const previousKeyFor = (date, level = 'N5') => `kotoba-diary-v2:${levelFor(level)}:${date}`;
    const keyFor = (date, level = 'N5') => `kotoba-diary-v3:${levelFor(level)}:${date}`;
    function blank(date, level) { return { date, level, prompts: assignment(date, level), text: '', checked: [], updatedAt: null }; }
    function validPoint(item, group) {
        return item && ['id', 'ja', 'meaning', ...(group === 'grammar' ? ['formation', 'example', 'translation'] : ['reading'])].every(key => typeof item[key] === 'string');
    }
    function validEntry(entry, date) {
        if (!(entry && entry.date === date && typeof entry.text === 'string' && Array.isArray(entry.checked) && entry.checked.every(id => typeof id === 'string') &&
            Object.entries({ grammar: 10, verbs: 10, vocab: 10 }).every(([group, count]) => {
                const items = entry.prompts?.[group];
                return Array.isArray(items) && (items.length === count || (group === 'grammar' && items.length === 5)) && new Set(items.map(item => item?.id)).size === items.length && items.every(item => validPoint(item, group));
            }))) return false;
        if (entry.prompts.format === undefined) return true; // v1/v2 saves, before packets.
        const { packets, stretchIds, grammar } = entry.prompts;
        if (entry.prompts.format !== 'packets-v1' || !Array.isArray(packets) || packets.length !== 2 ||
            !packets.every(packet => packet && ['id', 'title', 'description'].every(key => typeof packet[key] === 'string') && Array.isArray(packet.ids) && packet.ids.length === 4) ||
            !Array.isArray(stretchIds) || stretchIds.length !== 2) return false;
        const ids = [...packets.flatMap(packet => packet.ids), ...stretchIds];
        if (new Set(packets.map(packet => packet.id)).size !== 2 || new Set(ids).size !== 10 || ids.some((id, index) => id !== grammar[index]?.id)) return false;
        if (entry.previousGrammar && (!Array.isArray(entry.previousGrammar.points) || !entry.previousGrammar.points.every(point => validPoint(point, 'grammar')) ||
            !Array.isArray(entry.previousGrammar.checked) || !entry.previousGrammar.checked.every(id => typeof id === 'string'))) return false;
        if (entry.prompts.mood) {
            const mood = packetLibrary.normalizeMood(entry.prompts.mood);
            if (mood.rating !== entry.prompts.mood.rating || mood.emotion !== entry.prompts.mood.emotion) return false;
        }
        if (entry.moodSnapshots) {
            if (typeof entry.moodSnapshots !== 'object' || Array.isArray(entry.moodSnapshots)) return false;
            for (const [key, snapshot] of Object.entries(entry.moodSnapshots)) {
                if (!snapshot || !validEntry({date, text: '', checked: snapshot.checked, prompts: snapshot.prompts}, date)) return false;
                const mood = snapshot.prompts.mood;
                if (!mood || key !== `${mood.rating}:${mood.emotion}`) return false;
            }
        }
        return true;
    }
    function load(storage, date, level = 'N5') {
        level = levelFor(level);
        try {
            const saved = storage.getItem(keyFor(date, level));
            if (saved !== null) {
                const entry = JSON.parse(saved);
                if (!validEntry(entry, date) || entry.level !== level || entry.prompts.format !== 'packets-v1') throw new Error('invalid entry');
                if (level === 'N4' && !entry.prompts.mood) changeMood(entry, {});
                return { entry, error: null };
            }
            const previous = storage.getItem(previousKeyFor(date, level));
            const legacy = previous === null && level === 'N4' ? storage.getItem(legacyKeyFor(date)) : null;
            const raw = previous ?? legacy;
            if (raw === null) return { entry: blank(date, level), error: null };
            const old = JSON.parse(raw);
            if (!validEntry(old, date) || (legacy === null && old.level !== level)) throw new Error('invalid entry');
            const entry = blank(date, level);
            entry.text = old.text;
            entry.updatedAt = old.updatedAt || null;
            entry.prompts.verbs = old.prompts.verbs;
            entry.prompts.vocab = old.prompts.vocab;
            const currentIds = new Set(['grammar', 'verbs', 'vocab'].flatMap(group => entry.prompts[group].map(point => point.id)));
            entry.checked = old.checked.filter(id => currentIds.has(id));
            entry.previousGrammar = { points: old.prompts.grammar, checked: old.checked.filter(id => old.prompts.grammar.some(point => point.id === id)) };
            return { entry, error: null };
        } catch { return { entry: blank(date, level), error: 'This saved entry could not be read. Your existing save will not be overwritten. Download any new writing to keep it.' }; }
    }
    function changeMood(entry, mood) {
        if (entry.level !== 'N4') return;
        const next = packetLibrary.normalizeMood(mood);
        const current = entry.prompts.mood;
        entry.moodSnapshots ||= {};
        if (current) entry.moodSnapshots[`${current.rating}:${current.emotion}`] = {prompts: entry.prompts, checked: entry.checked.filter(id => entry.prompts.grammar.some(point => point.id === id))};
        else if (!entry.previousGrammar) entry.previousGrammar = {points: entry.prompts.grammar, checked: entry.checked.filter(id => entry.prompts.grammar.some(point => point.id === id))};
        const snapshot = entry.moodSnapshots[`${next.rating}:${next.emotion}`];
        const words = entry.checked.filter(id => [...entry.prompts.verbs, ...entry.prompts.vocab].some(point => point.id === id));
        entry.prompts = {...(snapshot?.prompts || assignment(entry.date, entry.level, next)), verbs: entry.prompts.verbs, vocab: entry.prompts.vocab};
        entry.checked = [...words, ...(snapshot?.checked || [])];
    }
    function usage(entry) {
        const count = ids => ids.filter(id => entry.checked.includes(id)).length;
        return {
            sentences: sentences(entry.text),
            packets: count(entry.prompts.packets.flatMap(packet => packet.ids)),
            stretch: count(entry.prompts.stretchIds),
            verbs: count(entry.prompts.verbs.map(item => item.id)),
            vocab: count(entry.prompts.vocab.map(item => item.id))
        };
    }
    function downloadText(entry) {
        const line = (item, checked = entry.checked) => `${checked.includes(item.id) ? '[x]' : '[ ]'} ${item.ja}${item.reading ? ` (${item.reading})` : ''} — ${item.meaning}`;
        const lookup = new Map(entry.prompts.grammar.map(item => [item.id, item]));
        return [`Kotoba daily diary · ${entry.date} · ${entry.level}`, ...(entry.prompts.mood ? [`Day: ${entry.prompts.mood.rating} · Feeling: ${entry.prompts.mood.emotion}`] : []), '', entry.text, '',
            ...entry.prompts.packets.flatMap(packet => [packet.title.toUpperCase() + ' · choose freely', packet.description, ...packet.ids.map(id => line(lookup.get(id))), '']),
            'OPTIONAL STRETCH POINTS', ...entry.prompts.stretchIds.map(id => line(lookup.get(id))), '',
            ...['verbs', 'vocab'].flatMap(group => [group.toUpperCase(), ...entry.prompts[group].map(item => line(item)), '']),
            ...(entry.previousGrammar ? ['PREVIOUS GRAMMAR ASSIGNMENT · preserved', ...entry.previousGrammar.points.map(item => line(item, entry.previousGrammar.checked))] : [])
        ].join('\n');
    }
    const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    function mount() {
        const panel = document.querySelector('#diary-panel');
        if (!panel) return;
        const el = id => document.querySelector(`#diary-${id}`);
        let storage;
        try { storage = window.localStorage; } catch { storage = { getItem() { throw new Error('unavailable'); } }; }
        const session = new Map();
        let currentDate = today(), currentLevel = 'N4', entry, readError;
        try {
            const preferred = storage.getItem(preferenceKey);
            currentLevel = preferred ? levelFor(preferred) : 'N4';
        } catch { /* The entry status reports unavailable storage. */ }
        const unsavedDates = new Set();
        function progress() {
            const counts = usage(entry);
            el('progress').innerHTML = [`${counts.sentences} sentence${counts.sentences === 1 ? '' : 's'} · aim for 5`, `Packet picks ${counts.packets}/8`, `Stretch ${counts.stretch}/2 · optional`, `Verbs ${counts.verbs}/3`, `Vocab ${counts.vocab}/3`].map(label => `<span>${label}</span>`).join('');
        }
        function promptMarkup(item, grammar = false) {
            return `<div class="diary-prompt"><label><input type="checkbox" value="${escape(item.id)}" ${entry.checked.includes(item.id) ? 'checked' : ''}><span><strong lang="ja">${escape(item.ja)}</strong>${item.reading ? `<span class="diary-reading" lang="ja">${escape(item.reading)}</span>` : ''}<span class="diary-meaning">${escape(item.meaning)}</span></span></label>${grammar ? `<details><summary>How to use it</summary><p>${escape(item.formation)}</p><p lang="ja">${escape(item.example)}</p><p>${escape(item.translation)}</p>${item.notes ? `<p>${escape(item.notes)}</p>` : ''}</details>` : ''}</div>`;
        }
        function save() {
            entry.text = el('entry').value;
            entry.updatedAt = new Date().toISOString();
            const key = keyFor(currentDate, currentLevel);
            session.set(key, { entry, error: readError });
            unsavedDates.add(key);
            if (readError) { el('save-status').textContent = readError; return; }
            try {
                storage.setItem(key, JSON.stringify(entry));
                unsavedDates.delete(key);
                el('save-status').textContent = 'Saved in this browser.';
            } catch {
                el('save-status').textContent = 'Could not save in this browser. Download your entry before leaving.';
            }
        }
        function render(date, level = currentLevel) {
            if (!validDate(date)) { el('date').value = currentDate; return; }
            currentDate = date; currentLevel = levelFor(level);
            const loaded = session.get(keyFor(date, currentLevel)) || load(storage, date, currentLevel);
            entry = loaded.entry; readError = loaded.error;
            el('date').value = date;
            el('level').value = currentLevel;
            el('level-note').textContent = currentLevel === 'N5'
                ? 'N5 · Two beginner packets, with two optional N4 stretch points.'
                : 'N4 · Two themed packets, with two optional stretch points. Pick what fits your story.';
            el('moods').hidden = currentLevel !== 'N4';
            const mood = entry.prompts.mood || packetLibrary.normalizeMood();
            for (const [group, choices] of [['rating', packetLibrary.ratings], ['emotion', packetLibrary.emotions]]) {
                el(group).innerHTML = choices.map(choice => `<button type="button" data-mood-group="${group}" data-mood="${choice.id}" aria-pressed="${mood[group] === choice.id}">${choice.face ? `<span aria-hidden="true" class="diary-face">${choice.face}</span>` : ''}<span>${choice.label}</span>${choice.english ? `<small>${choice.english}</small>` : ''}</button>`).join('');
            }
            el('date-title').textContent = `${currentLevel} · ` + new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));
            el('entry').value = entry.text;
            const lookup = new Map(entry.prompts.grammar.map(item => [item.id, item]));
            el('grammar').innerHTML = entry.prompts.packets.map((packet, index) => `<section class="diary-card diary-packet"><p class="diary-eyebrow">${entry.prompts.mood ? (index === 0 ? 'YOUR DAY' : 'YOUR FEELING') : `PACKET ${index + 1}`} · FOUR IDEAS TO DRAW FROM</p><h3>${escape(packet.title)}</h3><p class="diary-note">${escape(packet.description)}</p><div class="diary-word-list">${packet.ids.map(id => promptMarkup(lookup.get(id), true)).join('')}</div></section>`).join('') +
                `<section class="diary-card diary-stretch"><div class="diary-card-heading"><h3>Stretch a little</h3><span>2 optional challenges</span></div><p class="diary-note">Try one or both if they fit. These rotate separately from your packets; some are harder than typical N4 material.</p><div class="diary-word-list">${entry.prompts.stretchIds.map(id => promptMarkup(lookup.get(id), true)).join('')}</div></section>`;
            for (const group of ['verbs', 'vocab']) el(group).innerHTML = entry.prompts[group].map(item => promptMarkup(item)).join('');
            el('previous').disabled = currentDate === '0001-01-01';
            el('archive').hidden = !entry.previousGrammar;
            el('archive-items').innerHTML = entry.previousGrammar ? entry.previousGrammar.points.map(item => `<li>${entry.previousGrammar.checked.includes(item.id) ? '✓ ' : ''}<strong lang="ja">${escape(item.ja)}</strong> — ${escape(item.meaning)}</li>`).join('') : '';
            el('save-status').textContent = readError || (entry.updatedAt ? 'Saved entry loaded.' : 'Ready for today’s words. Your writing will save as you type.');
            // Persist the prompt snapshot even before writing starts.
            if (!readError) save();
            progress();
        }
        el('moods').addEventListener('click', event => {
            const button = event.target.closest('button[data-mood]');
            if (!button) return;
            const group = button.dataset.moodGroup, choice = button.dataset.mood;
            save();
            changeMood(entry, {...entry.prompts.mood, [group]: choice});
            save();
            render(currentDate);
            el(group).querySelector(`[data-mood="${choice}"]`).focus();
        });
        el('entry').addEventListener('input', () => { save(); progress(); });
        panel.addEventListener('change', event => {
            if (event.target.matches('input[type="checkbox"]')) {
                entry.checked = [...panel.querySelectorAll('input[type="checkbox"]:checked')].map(input => input.value);
                save(); progress();
            }
        });
        el('level').addEventListener('change', () => {
            const level = el('level').value;
            save();
            render(currentDate, level);
            try { storage.setItem(preferenceKey, currentLevel); }
            catch { el('save-status').textContent += ' Your level preference could not be saved.'; }
        });
        el('date').addEventListener('change', () => render(el('date').value));
        el('previous').addEventListener('click', () => render(shiftDate(currentDate, -1)));
        el('next').addEventListener('click', () => render(shiftDate(currentDate, 1)));
        el('today').addEventListener('click', () => render(today()));
        el('download').addEventListener('click', () => {
            const contents = downloadText(entry);
            const url = URL.createObjectURL(new Blob([contents], { type: 'text/plain;charset=utf-8' }));
            const link = document.createElement('a'); link.href = url; link.download = `kotoba-diary-${currentDate}-${currentLevel}.txt`; link.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        });
        window.addEventListener('beforeunload', event => {
            if ([...unsavedDates].some(date => session.get(date)?.entry.text.trim())) { event.preventDefault(); event.returnValue = ''; }
        });
        render(currentDate);
        if (new URLSearchParams(window.location.search).get('tab') === 'diary') document.querySelector('#diary-tab').click();
    }
    return { assignment, changeMood, today, validDate, shiftDate, sentences, load, validEntry, keyFor, previousKeyFor, legacyKeyFor, banks, usage, downloadText, packetLibrary, mount };
});
