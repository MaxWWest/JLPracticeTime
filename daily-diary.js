(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else { root.DailyDiary = api; api.mount(); }
})(typeof globalThis === 'object' ? globalThis : this, function () {
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
    function assignment(date) {
        return { grammar: pick(grammar, 5, `${date}:grammar:v1`), verbs: pick(verbs, 10, `${date}:verbs:v1`), vocab: pick(vocab, 10, `${date}:vocab:v1`) };
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
    const keyFor = date => `kotoba-diary-v1:${date}`;
    function blank(date) { return { date, prompts: assignment(date), text: '', checked: [], updatedAt: null }; }
    function validEntry(entry, date) {
        return entry && entry.date === date && typeof entry.text === 'string' && Array.isArray(entry.checked) &&
            Object.entries({ grammar: 5, verbs: 10, vocab: 10 }).every(([group, count]) => {
                const items = entry.prompts?.[group];
                return Array.isArray(items) && items.length === count && new Set(items.map(item => item?.id)).size === count &&
                    items.every(item => item && ['id', 'ja', 'meaning', ...(group === 'grammar' ? ['formation', 'example', 'translation'] : ['reading'])].every(key => typeof item[key] === 'string'));
            });
    }
    function load(storage, date) {
        try {
            const raw = storage.getItem(keyFor(date));
            if (!raw) return { entry: blank(date), error: null };
            const entry = JSON.parse(raw);
            if (!validEntry(entry, date)) throw new Error('invalid entry');
            return { entry, error: null };
        } catch { return { entry: blank(date), error: 'This saved entry could not be read. Your existing save will not be overwritten. Download any new writing to keep it.' }; }
    }
    const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    function mount() {
        const panel = document.querySelector('#diary-panel');
        if (!panel) return;
        const el = id => document.querySelector(`#diary-${id}`);
        let storage;
        try { storage = window.localStorage; } catch { storage = { getItem() { throw new Error('unavailable'); } }; }
        const session = new Map();
        let currentDate = today(), entry, readError;
        const unsavedDates = new Set();
        function progress() {
            const counts = ['grammar', 'verbs', 'vocab'].map(group => entry.prompts[group].filter(item => entry.checked.includes(item.id)).length);
            const count = sentences(entry.text);
            el('progress').innerHTML = [`${count} sentence${count === 1 ? '' : 's'} · aim for 5`, `Grammar ${counts[0]}/5`, `Verbs ${counts[1]}/3`, `Vocab ${counts[2]}/3`].map(label => `<span>${label}</span>`).join('');
            if (entry.text.trim() && counts[0] === 5 && counts[1] >= 3 && counts[2] >= 3) el('progress').insertAdjacentHTML('beforeend', '<strong>All usage goals checked!</strong>');
        }
        function save() {
            entry.text = el('entry').value;
            entry.updatedAt = new Date().toISOString();
            session.set(currentDate, { entry, error: readError });
            unsavedDates.add(currentDate);
            if (readError) { el('save-status').textContent = readError; return; }
            try {
                storage.setItem(keyFor(currentDate), JSON.stringify(entry));
                unsavedDates.delete(currentDate);
                el('save-status').textContent = 'Saved in this browser.';
            } catch {
                el('save-status').textContent = 'Could not save in this browser. Download your entry before leaving.';
            }
        }
        function render(date) {
            if (!validDate(date)) { el('date').value = currentDate; return; }
            currentDate = date;
            const loaded = session.get(date) || load(storage, date);
            entry = loaded.entry; readError = loaded.error;
            el('date').value = date;
            el('date-title').textContent = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));
            el('entry').value = entry.text;
            for (const group of ['grammar', 'verbs', 'vocab']) {
                el(group).innerHTML = entry.prompts[group].map(item => `<div class="diary-prompt"><label><input type="checkbox" value="${escape(item.id)}" ${entry.checked.includes(item.id) ? 'checked' : ''}><span><strong lang="ja">${escape(item.ja)}</strong>${item.reading ? `<span class="diary-reading" lang="ja">${escape(item.reading)}</span>` : ''}<span class="diary-meaning">${escape(item.meaning)}</span></span></label>${group === 'grammar' ? `<details><summary>How to use it</summary><p>${escape(item.formation)}</p><p lang="ja">${escape(item.example)}</p><p>${escape(item.translation)}</p></details>` : ''}</div>`).join('');
            }
            el('save-status').textContent = readError || (entry.updatedAt ? 'Saved entry loaded.' : 'Ready for today’s words. Your writing will save as you type.');
            // Persist the prompt snapshot even before writing starts.
            if (!readError) save();
            progress();
        }
        el('entry').addEventListener('input', () => { save(); progress(); });
        panel.addEventListener('change', event => {
            if (event.target.matches('input[type="checkbox"]')) {
                entry.checked = [...panel.querySelectorAll('input[type="checkbox"]:checked')].map(input => input.value);
                save(); progress();
            }
        });
        el('date').addEventListener('change', () => render(el('date').value));
        el('previous').addEventListener('click', () => render(shiftDate(currentDate, -1)));
        el('next').addEventListener('click', () => render(shiftDate(currentDate, 1)));
        el('today').addEventListener('click', () => render(today()));
        el('download').addEventListener('click', () => {
            const contents = [`Kotoba daily diary · ${currentDate}`, '', entry.text, '', ...['grammar', 'verbs', 'vocab'].flatMap(group => [group.toUpperCase(), ...entry.prompts[group].map(item => `${entry.checked.includes(item.id) ? '[x]' : '[ ]'} ${item.ja}${item.reading ? ` (${item.reading})` : ''} — ${item.meaning}`), ''])].join('\n');
            const url = URL.createObjectURL(new Blob([contents], { type: 'text/plain;charset=utf-8' }));
            const link = document.createElement('a'); link.href = url; link.download = `kotoba-diary-${currentDate}.txt`; link.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        });
        window.addEventListener('beforeunload', event => {
            if ([...unsavedDates].some(date => session.get(date)?.entry.text.trim())) { event.preventDefault(); event.returnValue = ''; }
        });
        render(currentDate);
        if (new URLSearchParams(window.location.search).get('tab') === 'diary') document.querySelector('#diary-tab').click();
    }
    return { assignment, today, validDate, shiftDate, sentences, load, validEntry, keyFor, mount };
});
