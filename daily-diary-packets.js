// N4 learning content adapted from OpenJLPT, CC BY-SA 4.0.
// https://github.com/evanclan/OpenJLPT — snapshot retrieved 2026-11-27.
// Grouping, selection, and presentation adapted for Kotoba. See README attribution.
(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.DiaryPackets = factory();
})(typeof globalThis === 'object' ? globalThis : this, function () {
    'use strict';
    const points = [
  {
    "id": "n4:ageru-kureru-morau",
    "sourceId": "ageru-kureru-morau",
    "ja": "あげる / くれる / もらう",
    "meaning": "give (to someone else); give (to me or my group); receive",
    "formation": "Noun (receiver) + に + Noun + を + あげる / Noun (giver) + が + Noun + を + くれる / Noun (giver) + に + Noun + を + もらう",
    "example": "私は弟に古いゲームをあげた。",
    "translation": "I gave my old game to my little brother.",
    "notes": "くれる is used only when the receiver is the speaker or someone in the speaker's group. With もらう the giver can be marked with に or から."
  },
  {
    "id": "n4:te-ageru",
    "sourceId": "te-ageru",
    "ja": "〜てあげる",
    "meaning": "do something for someone (as a favor)",
    "formation": "Verb-te + あげる",
    "example": "妹の宿題を手伝ってあげました。",
    "translation": "I helped my little sister with her homework.",
    "notes": "Said directly to a superior it can sound condescending; use the humble お〜しましょうか (お持ちしましょうか) instead."
  },
  {
    "id": "n4:te-kureru",
    "sourceId": "te-kureru",
    "ja": "〜てくれる",
    "meaning": "someone does something for me (or my group)",
    "formation": "Verb-te + くれる",
    "example": "友達が引っ越しを手伝ってくれた。",
    "translation": "A friend helped me move.",
    "notes": "The subject is the person doing the favor; the one who benefits is the speaker or someone close to them."
  },
  {
    "id": "n4:te-morau",
    "sourceId": "te-morau",
    "ja": "〜てもらう",
    "meaning": "have someone do something (for me); get someone to do",
    "formation": "Verb-te + もらう",
    "example": "先輩にレポートを見てもらった。",
    "translation": "I had a senior student look over my report.",
    "notes": "The receiver of the favor is the subject, and the person who does the action is marked with に."
  },
  {
    "id": "n4:te-kudasaru-te-itadaku",
    "sourceId": "te-kudasaru-te-itadaku",
    "ja": "〜てくださる / 〜ていただく",
    "meaning": "(honorific) someone kindly does for me; (humble) I receive the favor of someone doing",
    "formation": "Verb-te + くださる / Verb-te + いただく",
    "example": "先生が私の作文を直してくださいました。",
    "translation": "My teacher kindly corrected my essay.",
    "notes": "くださる is the honorific version of くれる (ます-form: くださいます); いただく is the humble version of もらう."
  },
  {
    "id": "n4:te-iku",
    "sourceId": "te-iku",
    "ja": "〜ていく",
    "meaning": "do something and go; go on doing (from now into the future)",
    "formation": "Verb-te + いく",
    "example": "雨が降りそうだから、傘を持っていきます。",
    "translation": "It looks like rain, so I'll take an umbrella.",
    "notes": "Movement or change away from the speaker, or from now toward the future. Compare 〜てくる."
  },
  {
    "id": "n4:te-kuru",
    "sourceId": "te-kuru",
    "ja": "〜てくる",
    "meaning": "do something and come back; come doing; (change) up to now; start to",
    "formation": "Verb-te + くる",
    "example": "ちょっとコンビニに行ってきます。",
    "translation": "I'm just popping out to the convenience store.",
    "notes": "Movement or change toward the speaker, or from the past up to now. 行ってきます literally means 'I'll go and come back.'"
  },
  {
    "id": "n4:te-shimau-chau",
    "sourceId": "te-shimau-chau",
    "ja": "〜てしまう / 〜ちゃう",
    "meaning": "finish completely; do by accident; end up doing (with regret)",
    "formation": "Verb-te + しまう",
    "example": "電車に傘を忘れてしまいました。",
    "translation": "I left my umbrella on the train.",
    "notes": "In speech 〜てしまう contracts to 〜ちゃう, and 〜でしまう to 〜じゃう (飲んじゃう)."
  },
  {
    "id": "n4:te-oku",
    "sourceId": "te-oku",
    "ja": "〜ておく",
    "meaning": "do in advance (to prepare); do and leave as is",
    "formation": "Verb-te + おく",
    "example": "旅行の前に、ホテルを予約しておきます。",
    "translation": "I'll book the hotel before the trip.",
    "notes": "In casual speech 〜ておく often becomes 〜とく (買っとく), and 〜でおく becomes 〜どく (読んどく)."
  },
  {
    "id": "n4:te-miru",
    "sourceId": "te-miru",
    "ja": "〜てみる",
    "meaning": "try doing (to see what it is like)",
    "formation": "Verb-te + みる",
    "example": "このシャツ、着てみてもいいですか。",
    "translation": "May I try this shirt on?",
    "notes": "Means trying something out to see the result, not making an effort to do something difficult."
  },
  {
    "id": "n4:te-aru",
    "sourceId": "te-aru",
    "ja": "〜てある",
    "meaning": "has been done (and stays that way); resulting state of a deliberate action",
    "formation": "Verb-te + ある",
    "example": "入り口に地図がはってあります。",
    "translation": "There's a map put up at the entrance.",
    "notes": "Used with transitive verbs, and the object usually takes が. It implies someone did it on purpose, unlike 〜ている with intransitive verbs (窓が開いている)."
  },
  {
    "id": "n4:toki",
    "sourceId": "toki",
    "ja": "〜とき",
    "meaning": "when; at the time when",
    "formation": "Verb-plain / i-Adj / na-Adj + な / Noun + の + とき",
    "example": "子どものとき、よく川で泳ぎました。",
    "translation": "When I was a child, I often swam in the river.",
    "notes": "The verb's tense shows the order: 行くとき means before or on the way (the going isn't finished yet); 行ったとき means after arriving. Often written 時 in kanji."
  },
  {
    "id": "n4:aida-aida-ni",
    "sourceId": "aida-aida-ni",
    "ja": "〜間 / 〜間に",
    "meaning": "while; during (the whole time); at some point during",
    "formation": "Verb-te + いる / Verb-dict / Noun + の + 間（に）",
    "example": "夏休みの間、祖父の家にいました。",
    "translation": "I stayed at my grandfather's house during the summer vacation.",
    "notes": "間 means the action continues through the whole period; 間に means it happens at some point within the period."
  },
  {
    "id": "n4:sou-da-appearance",
    "sourceId": "sou-da-appearance",
    "ja": "〜そうだ（appearance）",
    "meaning": "looks like; seems; looks about to",
    "formation": "Verb-stem / i-Adj stem / na-Adj + そうだ",
    "example": "そのカレー、辛そうだね。",
    "translation": "That curry looks spicy.",
    "notes": "A judgment from what you see. いい → よさそう, ない → なさそう. Not used with adjectives for plainly visible traits (赤い, かわいい); かわいそう means 'pitiful'."
  },
  {
    "id": "n4:sou-da-hearsay",
    "sourceId": "sou-da-hearsay",
    "ja": "〜そうだ（hearsay）",
    "meaning": "I heard that; they say that",
    "formation": "Verb-plain / i-Adj + そうだ / na-Adj + だ + そうだ / Noun + だ + そうだ",
    "example": "天気予報では、明日は雪が降るそうです。",
    "translation": "The weather forecast says it will snow tomorrow.",
    "notes": "Attaches to full plain forms, unlike the 'looks like' そうだ, which attaches to stems. It has no past or negative form."
  },
  {
    "id": "n4:rashii",
    "sourceId": "rashii",
    "ja": "〜らしい（hearsay/conjecture）",
    "meaning": "apparently; it seems; I hear",
    "formation": "Verb-plain / i-Adj / na-Adj / Noun + らしい",
    "example": "駅の近くに新しいカフェができたらしい。",
    "translation": "Apparently a new café has opened near the station.",
    "notes": "Based on something heard or read, so the speaker sounds a little detached. The 'typical of' らしい (男らしい) is a separate N3 point."
  },
  {
    "id": "n4:you-da",
    "sourceId": "you-da",
    "ja": "〜ようだ",
    "meaning": "it seems; it appears (judging from evidence)",
    "formation": "Verb-plain / i-Adj + ようだ / na-Adj + な + ようだ / Noun + の + ようだ",
    "example": "誰もいないようですね。",
    "translation": "It seems nobody's here.",
    "notes": "A somewhat formal way to state a judgment from what you observe or feel; みたいだ is the casual equivalent. The 'like, as if' use is covered at N3."
  },
  {
    "id": "n4:mitai",
    "sourceId": "mitai",
    "ja": "〜みたい",
    "meaning": "seems like; looks like; like (casual)",
    "formation": "Verb-plain / i-Adj / na-Adj / Noun + みたい",
    "example": "隣の部屋に誰か来たみたい。",
    "translation": "Sounds like someone has come to the room next door.",
    "notes": "Casual equivalent of ようだ. It attaches directly to nouns and na-adjectives (静かみたい) without な or の. Before a noun it becomes みたいな."
  },
  {
    "id": "n4:sugiru",
    "sourceId": "sugiru",
    "ja": "〜すぎる",
    "meaning": "too; too much; excessively",
    "formation": "Verb-stem / i-Adj stem / na-Adj + すぎる",
    "example": "ゆうべ飲みすぎて、頭が痛い。",
    "translation": "I drank too much last night, and now I have a headache.",
    "notes": "Conjugates like a Group 2 verb (すぎた, すぎて). いい → よすぎる, and the adjective ない → なさすぎる."
  },
  {
    "id": "n4:kata",
    "sourceId": "kata",
    "ja": "〜方",
    "meaning": "how to; way of doing",
    "formation": "Verb-stem + 方",
    "example": "この機械の使い方を教えてください。",
    "translation": "Please show me how to use this machine.",
    "notes": "The result is a noun, so the object takes の instead of を (日本語の話し方). With する-verbs: 勉強のしかた."
  },
  {
    "id": "n4:chuu-juu",
    "sourceId": "chuu-juu",
    "ja": "〜中",
    "meaning": "in the middle of; during (ちゅう); throughout; all over (じゅう)",
    "formation": "Noun + 中",
    "example": "父は今、電話中です。",
    "translation": "My father is on the phone right now.",
    "notes": "ちゅう marks an ongoing activity or a period (会議中, 午前中, 今週中); じゅう means 'throughout' a time or place (一日中, 世界中)."
  },
  {
    "id": "n4:tsumori",
    "sourceId": "tsumori",
    "ja": "〜つもり",
    "meaning": "intend to; plan to",
    "formation": "Verb-dict / Verb-nai + つもり",
    "example": "夏休みは北海道を旅行するつもりです。",
    "translation": "I intend to travel around Hokkaido during the summer break.",
    "notes": "States a firm personal intention. 〜つもりはない means 'have no intention of'. Asking a superior 〜つもりですか can sound blunt."
  },
  {
    "id": "n4:yotei",
    "sourceId": "yotei",
    "ja": "〜予定",
    "meaning": "plan to; be scheduled to",
    "formation": "Verb-dict + 予定 / Noun + の + 予定",
    "example": "来月、大阪に引っ越す予定です。",
    "translation": "I'm planning to move to Osaka next month.",
    "notes": "Refers to a fixed schedule or arrangement, often involving other people; more objective than つもり."
  },
  {
    "id": "n4:koto-ni-suru",
    "sourceId": "koto-ni-suru",
    "ja": "〜ことにする",
    "meaning": "decide to",
    "formation": "Verb-dict / Verb-nai + ことにする",
    "example": "健康のために、毎朝歩くことにした。",
    "translation": "I decided to walk every morning for my health.",
    "notes": "A decision made by the speaker; compare 〜ことになる. 〜ことにしている (N3) means 'make it a rule to'."
  },
  {
    "id": "n4:koto-ni-naru",
    "sourceId": "koto-ni-naru",
    "ja": "〜ことになる",
    "meaning": "it has been decided that; it turns out that",
    "formation": "Verb-dict / Verb-nai + ことになる",
    "example": "来年の春から、名古屋の店で働くことになりました。",
    "translation": "It's been decided that I'll work at the Nagoya store from next spring.",
    "notes": "Presents a decision as made by others or by circumstances. People also use it for their own decisions to sound less assertive."
  },
  {
    "id": "n4:koto-ga-dekiru",
    "sourceId": "koto-ga-dekiru",
    "ja": "〜ことができる",
    "meaning": "can; be able to; be possible to",
    "formation": "Verb-dict + ことができる",
    "example": "この図書館では、本を二週間借りることができます。",
    "translation": "At this library, you can borrow books for two weeks.",
    "notes": "A bit more formal than the potential form. Also used for what is possible or allowed (ここでたばこを吸うことはできません)."
  },
  {
    "id": "n4:eru-rareru-potential",
    "sourceId": "eru-rareru-potential",
    "ja": "〜える / 〜られる（potential）",
    "meaning": "can; be able to (potential form)",
    "formation": "Verb-dict (Group 1: final u → e) + る / Verb-nai stem + られる (Group 2)",
    "example": "私は漢字が二百ぐらい読めます。",
    "translation": "I can read about two hundred kanji.",
    "notes": "Irregular: する → できる, 来る → 来られる. The object often takes が instead of を. In casual speech Group 2 verbs often drop ら (見れる)."
  },
  {
    "id": "n4:reru-rareru-passive",
    "sourceId": "reru-rareru-passive",
    "ja": "〜れる / 〜られる（passive）",
    "meaning": "be done (by someone); passive voice",
    "formation": "Verb-nai stem + れる (Group 1) / Verb-nai stem + られる (Group 2)",
    "example": "先生に作文をほめられました。",
    "translation": "My essay was praised by my teacher.",
    "notes": "Irregular: する → される, 来る → 来られる. The doer is marked with に. Often shows that the subject was troubled by someone's action (雨に降られた)."
  },
  {
    "id": "n4:seru-saseru",
    "sourceId": "seru-saseru",
    "ja": "〜せる / 〜させる",
    "meaning": "make someone do; let someone do (causative)",
    "formation": "Verb-nai stem + せる (Group 1) / Verb-nai stem + させる (Group 2)",
    "example": "母は毎日弟に野菜を食べさせる。",
    "translation": "My mother makes my little brother eat vegetables every day.",
    "notes": "Irregular: する → させる, 来る → 来させる. With intransitive verbs the person takes を; with transitive verbs, に. Context decides 'make' or 'let'."
  },
  {
    "id": "n4:serareru-saserareru",
    "sourceId": "serareru-saserareru",
    "ja": "〜せられる / 〜させられる",
    "meaning": "be made to do (against one's will)",
    "formation": "Verb-nai stem + せられる (Group 1; short form される) / Verb-nai stem + させられる (Group 2)",
    "example": "子どものころ、母に毎日ピアノを練習させられた。",
    "translation": "When I was a child, my mother made me practice the piano every day.",
    "notes": "Irregular: する → させられる, 来る → 来させられる. The short Group 1 form (待たされる) is common in speech, but not with verbs ending in す (話させられる)."
  },
  {
    "id": "n4:ou-you",
    "sourceId": "ou-you",
    "ja": "〜おう / 〜よう",
    "meaning": "let's (casual); I'll (volitional form)",
    "formation": "Verb-dict (Group 1: final u → o) + う / Verb-stem + よう (Group 2)",
    "example": "疲れたね。少し休もう。",
    "translation": "That was tiring, huh? Let's take a short break.",
    "notes": "Irregular: する → しよう, 来る → 来よう. The plain equivalent of 〜ましょう."
  },
  {
    "id": "n4:you-to-omou",
    "sourceId": "you-to-omou",
    "ja": "〜(よ)うと思う",
    "meaning": "be thinking of doing; plan to",
    "formation": "Verb-volitional + と思う",
    "example": "今年の夏は海に行こうと思っています。",
    "translation": "I'm thinking of going to the beach this summer.",
    "notes": "〜と思う often reports a decision made just now; 〜と思っている shows a plan held for some time. Softer than つもり."
  },
  {
    "id": "n4:e-ro",
    "sourceId": "e-ro",
    "ja": "〜え / 〜ろ",
    "meaning": "do it! (imperative form; blunt command)",
    "formation": "Verb-dict (Group 1: final u → e) / Verb-stem + ろ (Group 2)",
    "example": "早く起きろ！遅刻するぞ。",
    "translation": "Get up already! You'll be late.",
    "notes": "Irregular: する → しろ, 来る → 来い, くれる → くれ. Very blunt; heard mainly from men, on signs, in emergencies and in cheering (がんばれ)."
  },
  {
    "id": "n4:na-prohibition",
    "sourceId": "na-prohibition",
    "ja": "〜な（prohibition）",
    "meaning": "don't! (strong prohibition)",
    "formation": "Verb-dict + な",
    "example": "危ないから、この川では泳ぐな。",
    "translation": "It's dangerous, so don't swim in this river.",
    "notes": "Very strong and blunt. Do not confuse it with the sentence-ending な that expresses feeling (いいな)."
  },
  {
    "id": "n4:nasai",
    "sourceId": "nasai",
    "ja": "〜なさい",
    "meaning": "do (instruction from a parent, teacher, etc.)",
    "formation": "Verb-stem + なさい",
    "example": "もう九時よ。早く寝なさい。",
    "translation": "It's already nine. Go to bed now.",
    "notes": "Softer than the imperative form but still a firm instruction; used by parents, teachers and in exam directions, never toward superiors."
  },
  {
    "id": "n4:ba",
    "sourceId": "ba",
    "ja": "〜ば",
    "meaning": "if",
    "formation": "Verb-ba / i-Adj stem + ければ / na-Adj + なら / Noun + なら",
    "example": "この道をまっすぐ行けば、駅に着きます。",
    "translation": "If you go straight along this road, you'll reach the station.",
    "notes": "Focuses on the condition needed for a result. When the main clause is a request or invitation, たら is usually more natural unless the ば-clause is a state (ある, いる, adjectives)."
  },
  {
    "id": "n4:tara",
    "sourceId": "tara",
    "ja": "〜たら",
    "meaning": "if; when; after",
    "formation": "Verb-ta + ら / i-Adj stem + かったら / na-Adj + だったら / Noun + だったら",
    "example": "駅に着いたら、電話してください。",
    "translation": "Please call me when you get to the station.",
    "notes": "The most versatile conditional and very common in speech. With events certain to happen it means 'when/after'."
  },
  {
    "id": "n4:nara",
    "sourceId": "nara",
    "ja": "〜なら",
    "meaning": "if (it's the case that); if you're talking about",
    "formation": "Verb-plain / i-Adj / na-Adj / Noun + なら",
    "example": "京都へ行くなら、秋がいいですよ。",
    "translation": "If you're going to Kyoto, autumn is a good time.",
    "notes": "Takes up what the listener said or a situation assumed to be true, then gives advice or an opinion. Unlike たら, the main action can come before the なら-clause."
  },
  {
    "id": "n4:to",
    "sourceId": "to",
    "ja": "〜と（conditional）",
    "meaning": "when; if; whenever (natural or automatic result)",
    "formation": "Verb-dict / Verb-nai / i-Adj + と / na-Adj + だ + と / Noun + だ + と",
    "example": "このボタンを押すと、お茶が出ます。",
    "translation": "When you press this button, tea comes out.",
    "notes": "For natural results, how machines work, directions and habits. The main clause cannot be a request, wish or invitation."
  },
  {
    "id": "n4:te-mo-de-mo",
    "sourceId": "te-mo-de-mo",
    "ja": "〜ても / 〜でも",
    "meaning": "even if; even though",
    "formation": "Verb-te + も / i-Adj-ku + ても / na-Adj + でも / Noun + でも",
    "example": "雨が降っても、試合はあります。",
    "translation": "Even if it rains, the game will go ahead.",
    "notes": "With question words or いくら it means 'no matter ...' (何を食べても, いくら待っても)."
  },
  {
    "id": "n4:noni-although",
    "sourceId": "noni-although",
    "ja": "〜のに（although）",
    "meaning": "although; even though (with surprise or dissatisfaction)",
    "formation": "Verb-plain / i-Adj + のに / na-Adj + な + のに / Noun + な + のに",
    "example": "一生懸命勉強したのに、試験に落ちてしまった。",
    "translation": "Even though I studied really hard, I failed the exam.",
    "notes": "Carries surprise, disappointment or complaint. The main clause cannot be a request or intention; use けど or ても there."
  },
  {
    "id": "n4:noni-purpose",
    "sourceId": "noni-purpose",
    "ja": "〜のに（purpose）",
    "meaning": "for; in order to (with use, time or cost)",
    "formation": "Verb-dict + のに / Noun + に",
    "example": "このかばんは旅行に行くのに便利です。",
    "translation": "This bag is handy for traveling.",
    "notes": "Usually followed by words like 使う, いい, 便利, 必要 or かかる. With a noun, just に is used (旅行に便利)."
  },
  {
    "id": "n4:node",
    "sourceId": "node",
    "ja": "〜ので",
    "meaning": "because; since",
    "formation": "Verb-plain / i-Adj + ので / na-Adj + な + ので / Noun + な + ので",
    "example": "頭が痛いので、今日は早く帰ります。",
    "translation": "I have a headache, so I'm going home early today.",
    "notes": "Sounds softer and more objective than から, so it is preferred when giving reasons politely or apologizing."
  },
  {
    "id": "n4:te-reason",
    "sourceId": "te-reason",
    "ja": "〜て（reason）",
    "meaning": "because; so (cause of a feeling or state)",
    "formation": "Verb-te / i-Adj stem + くて / na-Adj + で / Noun + で",
    "example": "ニュースを聞いて、びっくりしました。",
    "translation": "I was surprised to hear the news.",
    "notes": "The second part is usually a feeling, a potential form or a result, not a request or intention (use から or ので for those). Negative: 〜なくて (会えなくて寂しい)."
  },
  {
    "id": "n4:shi",
    "sourceId": "shi",
    "ja": "〜し",
    "meaning": "and what's more; and besides (listing reasons)",
    "formation": "Verb-plain / i-Adj + し / na-Adj + だ + し / Noun + だ + し",
    "example": "この部屋は広いし、駅から近いし、とても気に入っています。",
    "translation": "This apartment is spacious and close to the station, so I really like it.",
    "notes": "Lists several reasons or points. A single し hints that there are other reasons too."
  },
  {
    "id": "n4:kedo-keredomo",
    "sourceId": "kedo-keredomo",
    "ja": "〜けど / 〜けれども",
    "meaning": "but; although; (soft lead-in)",
    "formation": "Sentence + けど / けれども",
    "example": "この店は高いけど、おいしい。",
    "translation": "This place is expensive, but the food is good.",
    "notes": "More conversational than が; けれども is a little more formal than けど. Often used as a soft lead-in before a question or request."
  },
  {
    "id": "n4:tame-ni",
    "sourceId": "tame-ni",
    "ja": "〜ために",
    "meaning": "in order to; for (the sake of); because of",
    "formation": "Verb-dict / Verb-ta / Noun + の + ために",
    "example": "日本の大学に入るために、毎日勉強しています。",
    "translation": "I study every day in order to get into a Japanese university.",
    "notes": "For purpose, the verb must be something the subject can control (compare 〜ように). The 'because of' use sounds fairly formal."
  },
  {
    "id": "n4:you-ni",
    "sourceId": "you-ni",
    "ja": "〜ように（purpose）",
    "meaning": "so that; in order that",
    "formation": "Verb-dict / Verb-nai + ように",
    "example": "後ろの人にも聞こえるように、大きな声で話してください。",
    "translation": "Please speak loudly so that the people in the back can hear too.",
    "notes": "Used with verbs the subject can't directly control: potential forms, 分かる, 見える, negatives. For deliberate actions use ために."
  },
  {
    "id": "n4:you-ni-suru",
    "sourceId": "you-ni-suru",
    "ja": "〜ようにする",
    "meaning": "try to; make sure to; make a habit of",
    "formation": "Verb-dict / Verb-nai + ようにする",
    "example": "毎日野菜を食べるようにしています。",
    "translation": "I make a point of eating vegetables every day.",
    "notes": "〜ようにしている describes a habit you keep up. Compare 〜ようになる, a change that comes about."
  },
  {
    "id": "n4:you-ni-naru",
    "sourceId": "you-ni-naru",
    "ja": "〜ようになる",
    "meaning": "come to; reach the point where (change in ability or habit)",
    "formation": "Verb-dict / Verb-nai + ようになる",
    "example": "練習して、自転車に乗れるようになりました。",
    "translation": "After practicing, I became able to ride a bike.",
    "notes": "Often used with potential verbs. For 'no longer', 〜なくなる is usually more natural than 〜ないようになる."
  },
  {
    "id": "n4:te-hoshii",
    "sourceId": "te-hoshii",
    "ja": "〜てほしい",
    "meaning": "want someone to do",
    "formation": "Verb-te + ほしい / Verb-nai + で + ほしい",
    "example": "もう少しゆっくり話してほしいです。",
    "translation": "I'd like you to speak a little more slowly.",
    "notes": "The person you want to act is marked with に. Said to a superior it can sound demanding; 〜ていただきたいです is more polite."
  },
  {
    "id": "n4:tagaru",
    "sourceId": "tagaru",
    "ja": "〜たがる",
    "meaning": "(someone else) wants to",
    "formation": "Verb-stem + たがる",
    "example": "子どもたちは外で遊びたがっている。",
    "translation": "The children want to play outside.",
    "notes": "Used for other people, since you can't directly know their wishes. Current wishes are usually expressed with 〜たがっている."
  },
  {
    "id": "n4:garu",
    "sourceId": "garu",
    "ja": "〜がる",
    "meaning": "(someone else) feels; shows signs of feeling",
    "formation": "i-Adj stem / na-Adj + がる",
    "example": "妹は暗い所を怖がる。",
    "translation": "My little sister is scared of dark places.",
    "notes": "Turns feeling adjectives (怖い, 寂しい, ほしい) into verbs describing how others seem to feel. The object of the feeling takes を."
  },
  {
    "id": "n4:kamo-shirenai",
    "sourceId": "kamo-shirenai",
    "ja": "〜かもしれない",
    "meaning": "might; may; possibly",
    "formation": "Verb-plain / i-Adj / na-Adj / Noun + かもしれない",
    "example": "午後から雨が降るかもしれません。",
    "translation": "It might rain in the afternoon.",
    "notes": "About 50% certainty or less. In casual speech it is often shortened to かも."
  },
  {
    "id": "n4:darou",
    "sourceId": "darou",
    "ja": "〜だろう",
    "meaning": "probably; I suppose (plain form of でしょう)",
    "formation": "Verb-plain / i-Adj / na-Adj / Noun + だろう",
    "example": "明日はたぶん晴れるだろう。",
    "translation": "It will probably be sunny tomorrow.",
    "notes": "Common in writing and in men's casual speech; でしょう is the polite form. Often used with たぶん or きっと, or as 〜だろうと思う."
  },
  {
    "id": "n4:hazu-da",
    "sourceId": "hazu-da",
    "ja": "〜はずだ",
    "meaning": "should be; is expected to (based on reasoning)",
    "formation": "Verb-plain / i-Adj + はずだ / na-Adj + な + はずだ / Noun + の + はずだ",
    "example": "荷物は明日届くはずです。",
    "translation": "The package should arrive tomorrow.",
    "notes": "A confident expectation based on facts or logic, not a guess. It does not mean 'should' as a duty."
  },
  {
    "id": "n4:hazu-ga-nai",
    "sourceId": "hazu-ga-nai",
    "ja": "〜はずがない",
    "meaning": "can't be; there's no way that",
    "formation": "Verb-plain / i-Adj + はずがない / na-Adj + な + はずがない / Noun + の + はずがない",
    "example": "あんなにまじめな人がうそをつくはずがない。",
    "translation": "There's no way someone that earnest would lie.",
    "notes": "Strong denial based on reasoning. 〜ないはずだ ('should not be') is a milder expectation."
  },
  {
    "id": "n4:n-desu-no-desu",
    "sourceId": "n-desu-no-desu",
    "ja": "〜んです / 〜のです",
    "meaning": "it's that ...; (explaining or asking for an explanation)",
    "formation": "Verb-plain / i-Adj + んです / na-Adj + な + んです / Noun + な + んです",
    "example": "どうしたんですか。顔色が悪いですよ。",
    "translation": "What's the matter? You look pale.",
    "notes": "Adds a sense of explaining a situation or asking for the background. Casual forms are 〜んだ and 〜の. Overusing it can sound pushy."
  },
  {
    "id": "n4:ka-dou-ka",
    "sourceId": "ka-dou-ka",
    "ja": "〜かどうか",
    "meaning": "whether or not",
    "formation": "Verb-plain / i-Adj / na-Adj / Noun + かどうか",
    "example": "明日行けるかどうか、まだ分かりません。",
    "translation": "I don't know yet whether I can go tomorrow.",
    "notes": "Embeds a yes-no question in a sentence. For questions with a question word, use 〜か alone (何時に来るか)."
  },
  {
    "id": "n4:ka-embedded-question",
    "sourceId": "ka-embedded-question",
    "ja": "〜か（embedded question）",
    "meaning": "embedded question (what, where, who, etc.)",
    "formation": "Question word + ... + Verb-plain / i-Adj / na-Adj / Noun + か",
    "example": "会議が何時に始まるか、教えてください。",
    "translation": "Please tell me what time the meeting starts.",
    "notes": "After a noun or na-adjective, だ is dropped (誰の傘か知らない)."
  },
  {
    "id": "n4:to-omou",
    "sourceId": "to-omou",
    "ja": "〜と思う",
    "meaning": "I think that",
    "formation": "Verb-plain / i-Adj + と思う / na-Adj + だ + と思う / Noun + だ + と思う",
    "example": "この映画はきっと人気が出ると思う。",
    "translation": "I'm sure this movie will become popular.",
    "notes": "Japanese usually negates the quoted clause (来ないと思う) rather than 思う. For another person's opinion, use 〜と思っている."
  },
  {
    "id": "n4:to-iu-say",
    "sourceId": "to-iu-say",
    "ja": "〜と言う",
    "meaning": "say that; tell (quotation)",
    "formation": "「Sentence」 + と言う / Sentence (plain) + と言う",
    "example": "先生は「明日はテストがあります」と言いました。",
    "translation": "The teacher said, \"There's a test tomorrow.\"",
    "notes": "Direct quotes go inside 「」; indirect quotes use plain forms. 〜と言っていた is common when passing on what someone said."
  },
  {
    "id": "n4:shika-nai",
    "sourceId": "shika-nai",
    "ja": "〜しか〜ない",
    "meaning": "only; nothing but",
    "formation": "Noun + しか + Verb-nai",
    "example": "財布に五百円しかない。",
    "translation": "I only have 500 yen in my wallet.",
    "notes": "Always paired with a negative verb. Compared with だけ, it stresses that the amount is small or not enough."
  },
  {
    "id": "n4:bakari",
    "sourceId": "bakari",
    "ja": "〜ばかり",
    "meaning": "nothing but; only; all",
    "formation": "Noun + ばかり",
    "example": "弟は肉ばかり食べて、野菜を食べない。",
    "translation": "My little brother eats nothing but meat and won't touch vegetables.",
    "notes": "Often implies there is too much of one thing. 〜てばかりいる (N3) and 〜たばかり ('just did') are separate points."
  },
  {
    "id": "n4:ta-bakari",
    "sourceId": "ta-bakari",
    "ja": "〜たばかり",
    "meaning": "have just done",
    "formation": "Verb-ta + ばかり",
    "example": "日本に来たばかりなので、まだ日本語がよく分かりません。",
    "translation": "I've only just come to Japan, so I don't understand Japanese well yet.",
    "notes": "Shows the speaker feels little time has passed, even if it was weeks ago. 〜たところ refers to only moments ago."
  },
  {
    "id": "n4:tokoro-da",
    "sourceId": "tokoro-da",
    "ja": "〜ところだ",
    "meaning": "be about to; be in the middle of; have just done",
    "formation": "Verb-dict / Verb-te + いる / Verb-ta + ところだ",
    "example": "今から出かけるところです。",
    "translation": "I'm just about to go out.",
    "notes": "Dictionary form: about to. 〜ているところ: in the middle of. 〜たところ: just finished. It pinpoints the stage of an action."
  },
  {
    "id": "n4:yasui-nikui",
    "sourceId": "yasui-nikui",
    "ja": "〜やすい / 〜にくい",
    "meaning": "easy to; hard to",
    "formation": "Verb-stem + やすい / Verb-stem + にくい",
    "example": "このペンは書きやすいです。",
    "translation": "This pen is easy to write with.",
    "notes": "Both conjugate like i-adjectives. やすい can also mean 'tends to' (この服は汚れやすい)."
  },
  {
    "id": "n4:hajimeru-owaru-tsuzukeru",
    "sourceId": "hajimeru-owaru-tsuzukeru",
    "ja": "〜始める / 〜終わる / 〜続ける",
    "meaning": "start doing; finish doing; keep doing",
    "formation": "Verb-stem + 始める / Verb-stem + 終わる / Verb-stem + 続ける",
    "example": "去年からギターを習い始めました。",
    "translation": "I started learning guitar last year.",
    "notes": "〜終わる is used with actions that have a clear end (読む, 食べる, 書く). 〜終える is a more formal alternative."
  },
  {
    "id": "n4:dasu",
    "sourceId": "dasu",
    "ja": "〜出す",
    "meaning": "suddenly start doing; burst out",
    "formation": "Verb-stem + 出す",
    "example": "赤ちゃんが急に泣き出した。",
    "translation": "The baby suddenly burst out crying.",
    "notes": "Implies a sudden, often uncontrolled start. Unlike 〜始める, it is not used for planned actions or in requests."
  },
  {
    "id": "n4:hodo-nai",
    "sourceId": "hodo-nai",
    "ja": "〜ほど〜ない",
    "meaning": "not as ... as",
    "formation": "Noun / Verb-plain + ほど + i-Adj-ku + ない / na-Adj + ではない",
    "example": "今年の夏は去年ほど暑くない。",
    "translation": "This summer isn't as hot as last year.",
    "notes": "The item before ほど is the standard of comparison. Always followed by a negative."
  },
  {
    "id": "n4:nakanaka-nai",
    "sourceId": "nakanaka-nai",
    "ja": "なかなか〜ない",
    "meaning": "not easily; just won't; not readily",
    "formation": "なかなか + Verb-nai",
    "example": "バスがなかなか来ない。",
    "translation": "The bus just isn't coming.",
    "notes": "Shows that something doesn't happen as quickly or easily as hoped. With a positive form, なかなか means 'quite' (なかなかおいしい)."
  },
  {
    "id": "n4:zutsu",
    "sourceId": "zutsu",
    "ja": "〜ずつ",
    "meaning": "each; at a time; little by little",
    "formation": "Noun (quantity) + ずつ",
    "example": "りんごを一人に二つずつ配った。",
    "translation": "I handed out two apples to each person.",
    "notes": ""
  },
  {
    "id": "n4:mo-emphasis",
    "sourceId": "mo-emphasis",
    "ja": "〜も（emphasis）",
    "meaning": "as many as; as much as; (with a negative) not even one",
    "formation": "Noun (number + counter) + も",
    "example": "昨日は十時間も寝てしまった。",
    "translation": "I slept for a whole ten hours yesterday.",
    "notes": "Shows the speaker feels the amount is large. With 一 + counter and a negative verb, it means 'not even one'."
  },
  {
    "id": "n4:made-ni",
    "sourceId": "made-ni",
    "ja": "〜までに",
    "meaning": "by (a deadline); before",
    "formation": "Noun / Verb-dict + までに",
    "example": "レポートは金曜日までに出してください。",
    "translation": "Please hand in the report by Friday.",
    "notes": "までに marks a deadline for a one-time action; まで marks how long something continues (六時まで働く)."
  },
  {
    "id": "n4:koto-ga-aru",
    "sourceId": "koto-ga-aru",
    "ja": "〜ことがある",
    "meaning": "sometimes; there are times when",
    "formation": "Verb-dict / Verb-nai + ことがある",
    "example": "忙しいときは、朝ご飯を食べないことがあります。",
    "translation": "When I'm busy, I sometimes skip breakfast.",
    "notes": "Takes the dictionary or ない form. With the past form (〜たことがある) it means 'have done before' instead."
  },
  {
    "id": "n4:nai-to-ikenai-nakucha",
    "sourceId": "nai-to-ikenai-nakucha",
    "ja": "〜ないといけない / 〜なくちゃ",
    "meaning": "have to; must (conversational)",
    "formation": "Verb-nai + といけない / Verb-nai stem + なくちゃ",
    "example": "明日は早いから、もう寝ないといけない。",
    "translation": "I have an early start tomorrow, so I need to go to bed now.",
    "notes": "Everyday alternatives to なければならない. なくちゃ comes from なくては; なきゃ (from なければ) is also very common."
  },
  {
    "id": "n4:sasete-kudasai",
    "sourceId": "sasete-kudasai",
    "ja": "〜させてください",
    "meaning": "please let me (do)",
    "formation": "Verb-nai stem + せてください (Group 1) / Verb-nai stem + させてください (Group 2)",
    "example": "少し考えさせてください。",
    "translation": "Please let me think about it for a bit.",
    "notes": "Built on the causative て-form (する → させて). 〜させていただけませんか is more polite."
  },
  {
    "id": "n4:sonkeigo",
    "sourceId": "sonkeigo",
    "ja": "尊敬語",
    "meaning": "honorific verbs; respectful language for others' actions",
    "formation": "いらっしゃる（行く・来る・いる） / 召し上がる（食べる・飲む） / おっしゃる（言う） / なさる（する） / ご覧になる（見る） / くださる（くれる）",
    "example": "社長は何時ごろいらっしゃいますか。",
    "translation": "Around what time will the company president be here?",
    "notes": "Raises the actions of people you respect, such as customers, teachers and superiors. Never use it for your own actions."
  },
  {
    "id": "n4:kenjougo",
    "sourceId": "kenjougo",
    "ja": "謙譲語",
    "meaning": "humble verbs; modest language for one's own actions",
    "formation": "参る（行く・来る） / おる（いる） / いただく（食べる・飲む・もらう） / 申す（言う） / いたす（する） / 拝見する（見る） / 伺う（聞く・訪ねる）",
    "example": "明日の午後、そちらに伺います。",
    "translation": "I'll come to your office tomorrow afternoon.",
    "notes": "Lowers your own actions, or your group's, toward someone you respect. 参る, おる, 申す and いたす also make speech sound formal in general."
  },
  {
    "id": "n4:o-ni-naru",
    "sourceId": "o-ni-naru",
    "ja": "お〜になる",
    "meaning": "(honorific) someone respected does",
    "formation": "お + Verb-stem + になる",
    "example": "先生はもうお帰りになりました。",
    "translation": "The teacher has already gone home.",
    "notes": "Not used with one-syllable stems (見る, 寝る) or verbs that have special forms (行く → いらっしゃる). する-nouns take ご + Noun + になる (ご利用になる)."
  },
  {
    "id": "n4:o-suru",
    "sourceId": "o-suru",
    "ja": "お〜する",
    "meaning": "(humble) I do (for someone respected)",
    "formation": "お + Verb-stem + する / ご + Noun + する",
    "example": "重そうですね。お持ちしましょうか。",
    "translation": "That looks heavy. Shall I carry it for you?",
    "notes": "Only for actions that affect or benefit the other person. お〜いたします is even more formal."
  },
  {
    "id": "n4:de-gozaimasu",
    "sourceId": "de-gozaimasu",
    "ja": "〜でございます",
    "meaning": "is; am; are (very polite copula)",
    "formation": "Noun / na-Adj + でございます",
    "example": "お手洗いはあちらでございます。",
    "translation": "The restroom is over there.",
    "notes": "The very polite version of です, typical of shop and hotel staff speaking to customers. ございます on its own is the polite form of あります."
  },
  {
    "id": "n4:te-mo-kamawanai",
    "sourceId": "te-mo-kamawanai",
    "ja": "〜ても構わない",
    "meaning": "don't mind if; it's fine if",
    "formation": "Verb-te + も構わない / i-Adj-ku + ても構わない / na-Adj + でも構わない / Noun + でも構わない",
    "example": "ここに荷物を置いても構いませんか。",
    "translation": "Do you mind if I leave my bags here?",
    "notes": "A little more formal than 〜てもいい. 〜なくても構わない means 'it's fine not to'."
  },
  {
    "id": "n4:no-koto-nominalizer",
    "sourceId": "no-koto-nominalizer",
    "ja": "〜の / 〜こと（nominalizer）",
    "meaning": "the act of doing (turns a verb phrase into a noun)",
    "formation": "Verb-plain + の / Verb-plain + こと",
    "example": "私は写真を撮るのが好きです。",
    "translation": "I like taking photos.",
    "notes": "の is preferred with perception verbs (見る, 聞こえる) and in casual speech; こと is needed before です/だ and in set patterns such as 〜ことができる."
  },
  {
    "id": "n4:ba-yokatta",
    "sourceId": "ba-yokatta",
    "ja": "〜ばよかった",
    "meaning": "should have (done); I wish I had",
    "formation": "Verb-ba + よかった / Verb-nai stem + なければよかった",
    "example": "もっと早く家を出ればよかった。",
    "translation": "I should have left home earlier.",
    "notes": "Expresses regret about the past. 〜たらよかった is a common conversational alternative."
  },
  {
    "id": "n4:tara-dou",
    "sourceId": "tara-dou",
    "ja": "〜たらどう",
    "meaning": "why don't you ...?; how about ...?",
    "formation": "Verb-ta + らどう",
    "example": "疲れているなら、少し休んだらどう？",
    "translation": "If you're tired, why not rest a bit?",
    "notes": "Often shortened to 〜たら？. Can sound pushy toward superiors; 〜たらいかがですか is the polite version."
  },
  {
    "id": "n4:hou-ga-ii",
    "sourceId": "hou-ga-ii",
    "ja": "〜ほうがいい",
    "meaning": "had better; should",
    "formation": "Verb-ta / Verb-nai + ほうがいい",
    "example": "熱があるなら、病院に行ったほうがいいですよ。",
    "translation": "If you have a fever, you'd better go to the hospital.",
    "notes": "For advice, the past form (行ったほうがいい) is the usual choice and sounds stronger. The negative uses the ない form, not the past."
  },
  {
    "id": "n4:toka-toka",
    "sourceId": "toka-toka",
    "ja": "〜とか〜とか",
    "meaning": "things like A and B; A, B and so on (casual)",
    "formation": "Noun + とか + Noun + とか / Verb-dict + とか + Verb-dict + とか",
    "example": "冷蔵庫に卵とか牛乳とかが入っています。",
    "translation": "There are things like eggs and milk in the fridge.",
    "notes": "More casual than 〜や〜など, and it can also list verbs or whole phrases."
  },
  {
    "id": "n4:nado",
    "sourceId": "nado",
    "ja": "〜など",
    "meaning": "etc.; and so on; such as",
    "formation": "Noun + など",
    "example": "机の上に本やノートなどがあります。",
    "translation": "On the desk there are books, notebooks and so on.",
    "notes": "Often paired with や (AやBなど). After a single noun it softens a suggestion."
  },
  {
    "id": "n4:de-mo-suggestion",
    "sourceId": "de-mo-suggestion",
    "ja": "〜でも（suggestion）",
    "meaning": "or something (softening a suggestion)",
    "formation": "Noun + でも",
    "example": "ちょっと休んで、コーヒーでも飲みませんか。",
    "translation": "Why don't we take a break and have a coffee or something?",
    "notes": "Offers one example while leaving other options open, which makes invitations and advice sound less pushy."
  },
  {
    "id": "n4:sa",
    "sourceId": "sa",
    "ja": "〜さ",
    "meaning": "-ness (turns an adjective into a noun of degree)",
    "formation": "i-Adj stem + さ / na-Adj + さ",
    "example": "この橋の長さはどのくらいですか。",
    "translation": "How long is this bridge?",
    "notes": "いい becomes よさ. Common for measurements (高さ, 重さ, 大きさ, 長さ)."
  },
  {
    "id": "n4:me",
    "sourceId": "me",
    "ja": "〜目",
    "meaning": "-th (ordinal: first, second, third ...)",
    "formation": "Noun (number + counter) + 目",
    "example": "右から三つ目の建物が図書館です。",
    "translation": "The third building from the right is the library.",
    "notes": ""
  },
  {
    "id": "n4:oki-ni",
    "sourceId": "oki-ni",
    "ja": "〜おきに",
    "meaning": "every other; at intervals of",
    "formation": "Noun (number + counter) + おきに",
    "example": "このバスは十五分おきに来ます。",
    "translation": "This bus comes every fifteen minutes.",
    "notes": "With days (一日おき) it skips one unit, meaning 'every other day'. With minutes or distances it usually just means 'every X'."
  },
  {
    "id": "n4:ku-suru-ni-suru",
    "sourceId": "ku-suru-ni-suru",
    "ja": "〜くする / 〜にする（make）",
    "meaning": "make (something) ...; change something to a state",
    "formation": "i-Adj-ku + する / na-Adj + に + する / Noun + に + する",
    "example": "テレビの音を小さくしてください。",
    "translation": "Please turn the TV down.",
    "notes": "Someone deliberately changes something. Compare 〜くなる / 〜になる, where the change happens by itself."
  },
  {
    "id": "n4:ga-suru",
    "sourceId": "ga-suru",
    "ja": "〜がする",
    "meaning": "(a smell, sound, taste or feeling) is perceived",
    "formation": "Noun + がする",
    "example": "台所からいいにおいがする。",
    "translation": "There's a nice smell coming from the kitchen.",
    "notes": "Used with におい, 音, 声, 味 and 気 (〜気がする: 'have a feeling that')."
  },
  {
    "id": "n4:kana-kashira",
    "sourceId": "kana-kashira",
    "ja": "〜かな / 〜かしら",
    "meaning": "I wonder",
    "formation": "Verb-plain / i-Adj / na-Adj / Noun + かな / かしら",
    "example": "明日は晴れるかな。",
    "translation": "I wonder if it'll be sunny tomorrow.",
    "notes": "A soft question, often said to oneself. かしら sounds feminine and a little old-fashioned. 〜ないかな can express a wish (早く来ないかな)."
  },
  {
    "id": "n4:te-kuremasen-ka-te-itadakemasen-ka",
    "sourceId": "te-kuremasen-ka-te-itadakemasen-ka",
    "ja": "〜てくれませんか / 〜ていただけませんか",
    "meaning": "could you please ...? (polite request)",
    "formation": "Verb-te + くれませんか / Verb-te + いただけませんか",
    "example": "すみません、写真を撮ってくれませんか。",
    "translation": "Excuse me, could you take my picture?",
    "notes": "Softer than 〜てください. Politeness rises from 〜てくれませんか to 〜てもらえませんか to 〜ていただけませんか."
  },
  {
    "id": "n4:naide",
    "sourceId": "naide",
    "ja": "〜ないで",
    "meaning": "without doing; instead of doing",
    "formation": "Verb-nai + で",
    "example": "今朝は朝ご飯を食べないで学校に行った。",
    "translation": "This morning I went to school without eating breakfast.",
    "notes": "〜ずに (N3) means the same but is more formal. Differs from 〜なくて, which gives a reason."
  }
];
    const n4Packets = [
  {
    "id": "off-script",
    "title": "A day that went sideways",
    "description": "Unexpected changes, small mishaps, and how things turned out.",
    "ids": [
      "n4:hazu-da",
      "n4:noni-although",
      "n4:te-shimau-chau",
      "n4:koto-ni-naru"
    ]
  },
  {
    "id": "small-wins",
    "title": "Small wins",
    "description": "Trying something, gaining confidence, and keeping a good habit.",
    "ids": [
      "n4:te-miru",
      "n4:koto-ga-dekiru",
      "n4:you-ni-naru",
      "n4:you-ni-suru"
    ]
  },
  {
    "id": "kindness",
    "title": "Little kindnesses",
    "description": "Gifts and favors between you and the people around you.",
    "ids": [
      "n4:ageru-kureru-morau",
      "n4:te-ageru",
      "n4:te-kureru",
      "n4:te-morau"
    ]
  },
  {
    "id": "looking-ahead",
    "title": "Something to look forward to",
    "description": "Intentions, scheduled plans, and getting ready.",
    "ids": [
      "n4:tsumori",
      "n4:yotei",
      "n4:you-to-omou",
      "n4:te-oku"
    ]
  },
  {
    "id": "ordinary-day",
    "title": "An ordinary day",
    "description": "What you were doing, when it happened, and your usual routines.",
    "ids": [
      "n4:toki",
      "n4:aida-aida-ni",
      "n4:chuu-juu",
      "n4:koto-ga-aru"
    ]
  },
  {
    "id": "overheard",
    "title": "Something I heard",
    "description": "A conversation, a bit of news, and your own thoughts about it.",
    "ids": [
      "n4:sou-da-hearsay",
      "n4:rashii",
      "n4:to-iu-say",
      "n4:to-omou"
    ]
  },
  {
    "id": "noticing",
    "title": "Little things I noticed",
    "description": "How things looked, sounded, smelled, or seemed to you.",
    "ids": [
      "n4:sou-da-appearance",
      "n4:you-da",
      "n4:mitai",
      "n4:ga-suru"
    ]
  },
  {
    "id": "wondering",
    "title": "Still wondering",
    "description": "Possibilities, predictions, and things you are unsure about.",
    "ids": [
      "n4:kamo-shirenai",
      "n4:darou",
      "n4:hazu-ga-nai",
      "n4:kana-kashira"
    ]
  },
  {
    "id": "reasons",
    "title": "There was a reason",
    "description": "Explain a choice or feeling, then add another side to it.",
    "ids": [
      "n4:node",
      "n4:te-reason",
      "n4:shi",
      "n4:kedo-keredomo"
    ]
  },
  {
    "id": "what-if",
    "title": "If things go that way",
    "description": "Possible outcomes and what changes under different conditions.",
    "ids": [
      "n4:ba",
      "n4:tara",
      "n4:nara",
      "n4:to"
    ]
  },
  {
    "id": "making-it-work",
    "title": "Making it work",
    "description": "A goal, an obstacle, something necessary, and what is still okay.",
    "ids": [
      "n4:te-mo-de-mo",
      "n4:tame-ni",
      "n4:nai-to-ikenai-nakucha",
      "n4:te-mo-kamawanai"
    ]
  },
  {
    "id": "people",
    "title": "Reading the room",
    "description": "What people seem to want or feel, and what you wish they would do.",
    "ids": [
      "n4:te-hoshii",
      "n4:tagaru",
      "n4:garu",
      "n4:n-desu-no-desu"
    ]
  },
  {
    "id": "learning",
    "title": "Learning the ropes",
    "description": "Figuring out how to do something, keeping at it, and finding the tricky parts.",
    "ids": [
      "n4:kata",
      "n4:yasui-nikui",
      "n4:hajimeru-owaru-tsuzukeru",
      "n4:nakanaka-nai"
    ]
  },
  {
    "id": "moments",
    "title": "Right in the middle of it",
    "description": "Something just finished, something underway, or a sudden change.",
    "ids": [
      "n4:ta-bakari",
      "n4:tokoro-da",
      "n4:dasu",
      "n4:te-kuru"
    ]
  },
  {
    "id": "balance",
    "title": "Too much, too little",
    "description": "Compare amounts and describe habits that feel out of balance.",
    "ids": [
      "n4:sugiru",
      "n4:shika-nai",
      "n4:bakari",
      "n4:hodo-nai"
    ]
  },
  {
    "id": "steady",
    "title": "Little by little",
    "description": "Small steps, repeated routines, milestones, and surprising amounts.",
    "ids": [
      "n4:zutsu",
      "n4:mo-emphasis",
      "n4:me",
      "n4:oki-ni"
    ]
  },
  {
    "id": "practical",
    "title": "Getting things done",
    "description": "Useful tools, deadlines, small changes, and things you skipped.",
    "ids": [
      "n4:noni-purpose",
      "n4:made-ni",
      "n4:ku-suru-ni-suru",
      "n4:naide"
    ]
  },
  {
    "id": "hindsight",
    "title": "With hindsight",
    "description": "A decision, something you wish you had done, and advice for next time.",
    "ids": [
      "n4:koto-ni-suru",
      "n4:ba-yokatta",
      "n4:tara-dou",
      "n4:hou-ga-ii"
    ]
  },
  {
    "id": "possibilities",
    "title": "A few nice possibilities",
    "description": "Casual invitations and examples of things you could do.",
    "ids": [
      "n4:ou-you",
      "n4:toka-toka",
      "n4:nado",
      "n4:de-mo-suggestion"
    ]
  },
  {
    "id": "instructions",
    "title": "Words that stuck with me",
    "description": "Recall instructions from a teacher, parent, sign, or story. Quote blunt forms rather than using them as polite requests.",
    "ids": [
      "n4:e-ro",
      "n4:na-prohibition",
      "n4:nasai",
      "n4:to-iu-say"
    ]
  },
  {
    "id": "sorting",
    "title": "Sorting out my thoughts",
    "description": "An unanswered question, something you are weighing, and what matters to you.",
    "ids": [
      "n4:ka-dou-ka",
      "n4:ka-embedded-question",
      "n4:no-koto-nominalizer",
      "n4:sa"
    ]
  },
  {
    "id": "changing",
    "title": "Things are changing",
    "description": "How a habit has developed and how you hope it will continue.",
    "ids": [
      "n4:te-iku",
      "n4:te-kuru",
      "n4:you-ni-naru",
      "n4:you-ni-suru"
    ]
  }
];
    const n5Packets = [
  {
    "id": "n5-out-and-about",
    "title": "Out and about",
    "description": "Where you went, who was there, and what you did.",
    "ids": [
      "past",
      "placeaction",
      "with",
      "sequence"
    ]
  },
  {
    "id": "n5-cozy",
    "title": "A cozy little day",
    "description": "Describe a place, its atmosphere, and how your day felt.",
    "ids": [
      "nounpast",
      "adjectivepast",
      "adjectives",
      "existence"
    ]
  },
  {
    "id": "n5-routine",
    "title": "My daily rhythm",
    "description": "Things you did before something else, things underway, and things you skipped.",
    "ids": [
      "maeni",
      "teiru",
      "negativepast",
      "also"
    ]
  },
  {
    "id": "n5-wishes",
    "title": "Little wishes",
    "description": "Where you want to go, why, and what you can get permission to do.",
    "ids": [
      "tai",
      "kara",
      "teii",
      "destination"
    ]
  }
];
    const stretchIds = ["n4:te-kudasaru-te-itadaku", "n4:te-aru", "n4:eru-rareru-potential", "n4:reru-rareru-passive", "n4:seru-saseru", "n4:serareru-saserareru", "n4:you-ni", "n4:sasete-kudasai", "n4:sonkeigo", "n4:kenjougo", "n4:o-ni-naru", "n4:o-suru", "n4:de-gozaimasu", "n4:te-kuremasen-ka-te-itadakemasen-ka"];
    const byId = new Map(points.map(point => [point.id, point]));
    const epoch = Date.UTC(2026, 10, 27);
    const mod = (n, size) => ((n % size) + size) % size;
    function shuffled(items, seed) {
        let state = 2166136261;
        for (const char of seed) state = Math.imul(state ^ char.charCodeAt(0), 16777619);
        const copy = items.slice();
        for (let i = copy.length - 1; i > 0; i--) {
            state += 0x6D2B79F5;
            let n = Math.imul(state ^ state >>> 15, 1 | state);
            n ^= n + Math.imul(n ^ n >>> 7, 61 | n);
            const j = Math.floor(((n ^ n >>> 14) >>> 0) / 4294967296 * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }
    function pairDeck(deck) {
        if (!deck.length) return [];
        const [first, ...rest] = deck;
        for (let index = 0; index < rest.length; index++) {
            const second = rest[index];
            if (first.ids.some(id => second.ids.includes(id))) continue;
            const tail = pairDeck(rest.filter((_, i) => i !== index));
            if (tail) return [[first, second], ...tail];
        }
        return null;
    }
    function build(date, level, n5Grammar) {
        const day = Math.floor((Date.parse(`${date}T00:00:00Z`) - epoch) / 86400000);
        if (!Number.isFinite(day)) throw new Error('Invalid diary date');
        const catalog = level === 'N4' ? n4Packets : n5Packets;
        const daysPerCycle = catalog.length / 2;
        const cycle = Math.floor(day / daysPerCycle);
        const pairs = pairDeck(shuffled(catalog, `${level}:packets:v1:${cycle}`));
        if (!pairs) throw new Error('Packet catalog cannot be paired without repeats');
        const lookup = level === 'N4' ? byId : new Map(n5Grammar.map(point => [point.id, point]));
        const packets = pairs[mod(day, daysPerCycle)].map(packet => ({
            id: packet.id, title: packet.title, description: packet.description,
            ids: packet.ids.slice()
        }));
        const challengeDays = stretchIds.length / 2;
        const challengeCycle = Math.floor(day / challengeDays);
        const challengeDeck = shuffled(stretchIds, `stretch:v1:${challengeCycle}`);
        const start = mod(day, challengeDays) * 2;
        const stretch = challengeDeck.slice(start, start + 2).map(id => ({ ...byId.get(id) }));
        return { format: 'packets-v1', packets, stretchIds: stretch.map(point => point.id), grammar: [...packets.flatMap(packet => packet.ids.map(id => ({ ...lookup.get(id) }))), ...stretch] };
    }
    const coverage = {
        sourceCount: points.length,
        includedCount: new Set([...n4Packets.flatMap(packet => packet.ids), ...stretchIds]).size,
        packetCount: n4Packets.length,
        packetCycleDays: n4Packets.length / 2,
        stretchCount: stretchIds.length,
        stretchCycleDays: stretchIds.length / 2
    };
    return { build, coverage, n4Packets, n5Packets, points, stretchIds };
});
