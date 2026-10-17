/* Compatible activities -> ability/access/perception facts -> assessment. */
(function (root, factory) {
	if (typeof module === "object" && module.exports) module.exports = factory(require("./grammar-practice-core.js"));
	else root.AbilityPractice = factory(root.GrammarPracticeCore);
})(typeof globalThis === "object" ? globalThis : this, function (core) {
	"use strict";
	const version = "ability-v1";
	const extraNouns = [
		["新聞", "しんぶん", "the newspaper"], ["説明書", "せつめいしょ", "the instructions"], ["小説", "しょうせつ", "a novel"], ["記事", "きじ", "the article"], ["手紙", "てがみ", "a letter"], ["日記", "にっき", "a diary entry"], ["レポート", "れぽーと", "a report"], ["申込書", "もうしこみしょ", "an application form"], ["招待状", "しょうたいじょう", "an invitation"],
		["サンドイッチ", "さんどいっち", "sandwiches"], ["おにぎり", "おにぎり", "rice balls"], ["ケーキ", "けーき", "a cake"], ["弁当", "べんとう", "a packed lunch"], ["日本語", "にほんご", "Japanese"], ["英語", "えいご", "English"], ["中国語", "ちゅうごくご", "Chinese"], ["韓国語", "かんこくご", "Korean"], ["フランス語", "ふらんすご", "French"], ["スペイン語", "すぺいんご", "Spanish"],
		["ピアノ", "ぴあの", "the piano"], ["ギター", "ぎたー", "the guitar"], ["バイオリン", "ばいおりん", "the violin"], ["キーボード", "きーぼーど", "the keyboard"], ["パソコン", "ぱそこん", "the computer"], ["カメラ", "かめら", "the camera"], ["プリンター", "ぷりんたー", "the printer"], ["洗濯機", "せんたくき", "the washing machine"], ["電子レンジ", "でんしれんじ", "the microwave"], ["ミシン", "みしん", "the sewing machine"],
		["コピー", "こぴー", "photocopying"], ["印刷", "いんさつ", "printing"], ["予約", "よやく", "reservations"], ["支払い", "しはらい", "payment"], ["買い物", "かいもの", "shopping"], ["洗濯", "せんたく", "laundry"], ["料理", "りょうり", "cooking"], ["勉強", "べんきょう", "studying"], ["練習", "れんしゅう", "practice"], ["食事", "しょくじ", "dining"], ["相談", "そうだん", "consultation"], ["電話", "でんわ", "phone calls"],
		["山", "やま", "the mountain"], ["海", "うみ", "the sea"], ["橋", "はし", "the bridge"], ["時計", "とけい", "the clock"], ["看板", "かんばん", "the sign"], ["入口", "いりぐち", "the entrance"], ["出口", "でぐち", "the exit"], ["画面", "がめん", "the screen"], ["文字", "もじ", "the lettering"], ["建物", "たてもの", "the building"],
		["音楽", "おんがく", "the music"], ["アナウンス", "あなうんす", "the announcement"], ["放送", "ほうそう", "the broadcast"], ["先生の声", "せんせいのこえ", "the teacher's voice"], ["雨の音", "あめのおと", "the sound of rain"], ["電話の音", "でんわのおと", "the phone ringing"], ["車の音", "くるまのおと", "the sound of cars"], ["鳥の声", "とりのこえ", "birdsong"]
	];
	const extraVerbs = [{ ja: "弾く", en: "play", forms: { dictionary: "弾く", masuStem: "弾き", masu: "弾きます", ta: "弾いた", nai: "弾かない", potential: "弾ける" } }];
	const readings = [
		["機械", "きかい"], ["担当者", "たんとうしゃ"], ["相手", "あいて"], ["道具", "どうぐ"], ["材料", "ざいりょう"], ["会話", "かいわ"], ["楽器", "がっき"], ["課題", "かだい"], ["能力", "のうりょく"], ["活動", "かつどう"], ["内容", "ないよう"], ["充電", "じゅうでん"], ["残高", "ざんだか"], ["小銭", "こぜに"], ["食券", "しょっけん"],
		...extraNouns.map(([ja, kana]) => [ja, kana]), ["教科書", "きょうかしょ"], ["雑誌", "ざっし"], ["作文", "さくぶん"], ["読", "よ"], ["書", "か"], ["作", "つく"], ["話", "はな"], ["使", "つか"], ["弾", "ひ"], ["見", "み"], ["聞", "き"], ["出来", "でき"], ["事", "こと"],
		["私", "わたし"], ["田中", "たなか"], ["山田", "やまだ"], ["今日", "きょう"], ["今", "いま"], ["一人", "ひとり"], ["自分", "じぶん"], ["方法", "ほうほう"], ["成功", "せいこう"], ["失敗", "しっぱい"], ["結果", "けっか"], ["確認", "かくにん"], ["操作", "そうさ"], ["技能", "ぎのう"], ["利用", "りよう"], ["登録", "とうろく"], ["条件", "じょうけん"], ["休止", "きゅうし"], ["再開", "さいかい"], ["案内", "あんない"], ["現在", "げんざい"], ["以前", "いぜん"], ["会員", "かいいん"], ["必要", "ひつよう"], ["完了", "かんりょう"], ["変更", "へんこう"], ["席", "せき"], ["壁", "かべ"], ["音声", "おんせい"], ["映像", "えいぞう"], ["録音", "ろくおん"], ["写真", "しゃしん"], ["画集", "がしゅう"], ["再生", "さいせい"], ["途中", "とちゅう"], ["練習中", "れんしゅうちゅう"], ["記録", "きろく"], ["故障", "こしょう"], ["修理", "しゅうり"], ["受付", "うけつけ"], ["予約者", "よやくしゃ"]
	];
	const frames = [
		{ id: "reading", verb: "読む", en: "read", objects: ["新聞", "説明書", "小説", "記事", "教科書", "雑誌"] },
		{ id: "writing", verb: "書く", en: "write", objects: ["手紙", "日記", "レポート", "申込書", "招待状", "作文"] },
		{ id: "cooking", verb: "作る", en: "make", objects: ["カレー", "スープ", "サンドイッチ", "おにぎり", "ケーキ", "弁当"] },
		{ id: "language", verb: "話す", en: "speak", objects: ["日本語", "英語", "中国語", "韓国語", "フランス語", "スペイン語"] },
		{ id: "instrument", verb: "弾く", en: "play", objects: ["ピアノ", "ギター", "バイオリン", "キーボード"] },
		{ id: "equipment", verb: "使う", en: "use", objects: ["パソコン", "カメラ", "プリンター", "洗濯機", "電子レンジ", "ミシン"] }
	];
	const opportunities = {
		reading: ["読むものは手元にあります。", "読むものは人に貸していて、手元にありません。"],
		writing: ["紙とペンは用意してあります。", "紙もペンもなく、今日は用意できません。"],
		cooking: ["必要な材料は全部そろっています。", "必要な材料が足りず、今日は買いに行けません。"],
		language: ["今日はその言葉で会話する相手が来ます。", "今日はその言葉で会話する相手が来られません。"],
		instrument: ["練習室の楽器は使える状態です。", "練習室の楽器は壊れていて、使えません。"],
		equipment: ["使う機械は用意してあり、正常に動きます。", "使う機械は故障していて、動きません。"]
	};
	const services = [
		["コピー", "図書館のコピー機", "card"], ["印刷", "学校のプリンター", "card"], ["予約", "ホテルのサイト", "registration"], ["支払い", "店のレジ", "money"], ["買い物", "駅の売店", "money"], ["洗濯", "ホテルの洗濯室", "coins"], ["料理", "共同の台所", "ingredients"], ["勉強", "図書館の自習室", "reservation"], ["練習", "音楽教室の練習室", "reservation"], ["食事", "学校の食堂", "ticket"], ["相談", "市役所の窓口", "reservation"], ["電話", "駅の公衆電話", "card"]
	];
	const requirements = {
		card: ["残高のある専用カードが必要です。", "カードには十分な残高があります。", "カードの残高はゼロです。"],
		registration: ["事前の会員登録が必要です。", "登録は完了しています。", "登録はまだ済んでいません。"],
		money: ["ここでは現金だけ使えます。", "必要な現金は持っています。", "カードしか持っていません。"],
		coins: ["百円玉を用意してください。", "必要な枚数の百円玉があります。", "百円玉は一枚もありません。"],
		ingredients: ["材料は自分で持ってきてください。", "必要な材料は全部持ってきました。", "材料は何も持ってきていません。"],
		reservation: ["利用には事前の予約が必要です。", "今日の予約は取ってあります。", "予約はまだ取っていません。"],
		ticket: ["先に食券を買ってください。", "食券は買ってあります。", "食券はまだ買っていません。"]
	};
	const senses = [
		{ id: "sight", verb: "見る", percept: "見える", objects: ["山", "海", "橋", "時計", "看板", "入口", "出口", "画面", "文字", "建物"], positive: "目の前には何もじゃまなものがなく、はっきりしています。", negative: "間に壁があって、目で確認するのは無理です。" },
		{ id: "hearing", verb: "聞く", percept: "聞こえる", objects: ["音楽", "アナウンス", "放送", "先生の声", "雨の音", "電話の音", "車の音", "鳥の声"], positive: "まわりが静かで、その音がはっきり耳に入ってきます。", negative: "まわりがうるさくて、その音は全く耳に入ってきません。" }
	];
	const tasks = [
		{ id: "capability-report", label: "Report what is possible", topic: "potential", count: 2 },
		{ id: "rewrite-potential", label: "Keep the ability and the person", topic: "potential", count: 2 },
		{ id: "rewrite-koto", label: "Write the alternative construction", topic: "potential", count: 2 },
		{ id: "two-people", label: "Two people, two abilities", topic: "potential", count: 3 },
		{ id: "ability-evidence", label: "Separate skill from opportunity", topic: "scope", count: 2 },
		{ id: "feasible-service", label: "Read the service conditions", topic: "service", count: 2 },
		{ id: "service-report", label: "Update the visitor", topic: "service", count: 2 },
		{ id: "scope-change", label: "Use the current notice", topic: "service", count: 2 },
		{ id: "perception-report", label: "Report what reaches your senses", topic: "perception", count: 2 },
		{ id: "two-channels", label: "Two observations", topic: "perception", count: 2 },
		{ id: "access-perception", label: "Access is not perception", topic: "perception", count: 2 },
		{ id: "evidence-limit", label: "Do not add an unstated event", topic: "scope", count: 2 }
	];
	const endings = (stem, positive) => positive ? [stem + "ます。", stem + "る。"] : [stem + "ません。", stem + "ないです。", stem + "ない。"];
	function abilityAnswers(a, positive, form, person = "") {
		const particles = form === "potential" ? ["が", "を"] : ["を"];
		const predicate = form === "potential" ? endings(a.potential.slice(0, -1), positive) : endings("でき", positive);
		return particles.flatMap((particle) => predicate.flatMap((end) => {
			const body = `${a.word}${particle}${form === "koto" ? a.dictVerb + "ことが" : ""}${end}`;
			return person ? [`${person}は${body}`] : [body, `私は${body}`];
		}));
	}
	function create({ nounPools = {}, verbPool = [], aliases = [], seed = Date.now() } = {}) {
		const rng = core.random(seed), nouns = new Map(Object.values(nounPools).flat().map((n) => [n.ja, n]));
		extraNouns.forEach(([ja, kana, en]) => nouns.set(ja, { ja, kana, en }));
		const verbs = new Map([...verbPool, ...extraVerbs].map((v) => [v.ja, v]));
		const normalize = core.normalizer([...aliases, ...readings]), grade = core.grader(normalize);
		const actions = frames.flatMap((frame) => frame.objects.map((word) => {
			const noun = nouns.get(word), verb = verbs.get(frame.verb);
			if (!noun || !verb) throw new Error(`Missing ability vocabulary: ${word}/${frame.verb}`);
			return { id: `${frame.id}:${word}`, frame: frame.id, word, verb: frame.verb, dictVerb: verb.forms.dictionary, dict: word + "を" + verb.forms.dictionary, potential: verb.forms.potential, en: `${frame.en} ${noun.en}` };
		}));
		function q(task, a, v, content, facts) {
			const item = core.question(version, "ability", tasks, task, a, v, content, facts);
			if (item.fields) {
				const rows = item.fields.map((f, i) => {
					const person = task === "two-people" ? facts.order[i] : facts.person;
					const prefix = (person ? `${person}は` : "") + a.word;
					let options;
					if (a.potential) options = [true, false].flatMap((positive) => ["potential", "koto"].map((form) => abilityAnswers(a, positive, form, person)[0].slice(prefix.length).replace(/。$/, "")));
					else {
						const predicate = facts.sense ? senses.find((s) => s.id === facts.sense).percept.slice(0, -1) : "でき";
						options = [`が${predicate}ます`, `が${predicate}ません`];
					}
					return { label: f.label, segments: [prefix, core.tailField(f, prefix, options), "。"] };
				});
				const instruction = task === "rewrite-potential" ? "Keep the meaning using the short potential form." : task === "rewrite-koto" ? "Keep the meaning using the ことができる construction." : facts.sense ? "Complete each observation for the indicated situation, using direct perception." : task === "service-report" ? "Complete today's service update." : "Complete each person's ability report. Keep the positive or negative meaning from the context.";
				item.responseSpec = core.cloze(rows, instruction);
			}
			return item;
		}
		const vocabulary = (a) => `${a.word} (${nouns.get(a.word).en}) / ${a.dictVerb} (${verbs.get(a.verb).en})`;
		function abilityField(a, positive, form, person = "", label = "Your message") {
			return core.field(label, abilityAnswers(a, positive, form, person), [
				{ accepted: abilityAnswers(a, !positive, form, person), message: `Your sentence says this person ${positive ? "cannot" : "can"} do it. The supplied facts establish the opposite.` },
				{ accepted: abilityAnswers(a, positive, form === "potential" ? "koto" : "potential", person), message: `This preserves the ability, but this rewrite asks for ${form === "potential" ? "the short potential form" : "dictionary form + ことができます"}. It is not an incorrect way to express ability.` }
			]);
		}
		function skillQuestions(a, v) {
			const positive = v % 2 === 0, person = v < 2 ? "田中さん" : "山田さん", other = person === "田中さん" ? "山田さん" : "田中さん";
			const practice = `課題：${a.dict}\n${person}は練習を続けています。今は、${positive ? "人に手伝ってもらわなくても、自分の力でできます。" : "先生に手伝ってもらわないと、まだ自分の力ではできません。"}`;
			const result = { person, positive, action: a.id };
			const first = v % 2 ? other : person, second = first === person ? other : person;
			const otherPositive = v < 2;
			const statuses = { [first]: positive, [second]: otherPositive };
			const skill = v < 2, opportunity = v % 2 === 0;
			const conditions = opportunities[a.frame];
			const claims = [{ skill: true, opportunity: true }, { skill: true, opportunity: false }, { skill: false, opportunity: true }, { skill: false, opportunity: false }];
			const claimText = (f) => `やり方は${f.skill ? "分かっていて、一人でできる" : "まだ分からず、助けが必要"}。${conditions[f.opportunity ? 0 : 1]}`;
			const summary = { skill, opportunity };
			const evidenceClaims = ["can-event-unknown", "cannot-event-unknown", "completed-skill-unstated", "not-done-skill-unstated"];
			const evidenceTexts = ["できるという能力は分かるが、今日したかどうかは分からない。", "できないという能力の限界は分かるが、今日したかどうかは分からない。", "今日したことは分かるが、いつも一人でできるかどうかは分からない。", "今日はしなかったと分かるが、できないという意味ではない。"];
			const verb = verbs.get(a.verb).forms;
			const evidenceSource = v < 2 ? abilityAnswers(a, positive, "potential", person)[0] : `${person}は今日、${a.word}を${verb.masuStem}${v === 2 ? "ました" : "ませんでした"}。`;
			return [
				q("capability-report", a, v, { prompt: practice, subprompt: `Report ${person}'s current independent ability, not a completed event. Include their name; use a potential verb or ことができます.`, band: "Write a complete ability statement.", vocabulary: vocabulary(a), fields: [core.field("Current ability", [...abilityAnswers(a, positive, "potential", person), ...abilityAnswers(a, positive, "koto", person)], [{ accepted: [...abilityAnswers(a, !positive, "potential", person), ...abilityAnswers(a, !positive, "koto", person)], message: "The ability is reversed. Keep whether help is still necessary." }])], explanation: `The person ${positive ? "can now act independently" : "still needs help"}. Either potential or ことができます can express the requested ability.` }, result),
				q("rewrite-potential", a, v, { prompt: `次の人は来週の活動の準備をしています。\n${abilityAnswers(a, positive, "koto", person)[0]}\n${other}については、まだ確認していません。`, subprompt: `Rewrite only ${person}'s ability using a short potential verb. Keep their name and the positive/negative meaning.`, band: "Preserve who can do what.", vocabulary: vocabulary(a), fields: [abilityField(a, positive, "potential", person, "Rewritten ability")], explanation: "Potential verbs and dictionary form + ことができます can express the same ability. Both を and が are accepted with these transitive potential verbs; neither person nor polarity may change." }, result),
				q("rewrite-koto", a, v, { prompt: `活動を始める前に、担当者が確認しました。\n${abilityAnswers(a, positive, "potential", person)[0]}\nこれは今日したことの記録ではなく、能力についての話です。`, subprompt: `Keep ${person}'s ability and polarity. Use dictionary form + ことができます, including the person's name.`, band: "Rewrite the ability, not the event.", vocabulary: vocabulary(a), fields: [abilityField(a, positive, "koto", person, "Rewritten ability")], explanation: "The embedded action uses the dictionary form, retaining its object particle を. The negative, when needed, belongs on できません, not on the action before こと." }, result),
				q("two-people", a, v, { prompt: `二人が同じ活動について話しています。活動は「${a.dict}」です。\n${person}：${statuses[person] ? "もう一人でも大丈夫です。やり方を覚えました。" : "まだ一人では無理です。手伝ってください。"}\n${other}：${statuses[other] ? "私はやり方を覚えたので、助けはいりません。" : "私はまだ助けが必要です。"}`, subprompt: "Report each person's ability separately. Include the named person; either potential or ことができます is accepted. The abilities may agree or differ.", band: "Keep the two people distinct.", vocabulary: vocabulary(a), fields: [first, second].map((name) => core.field(name, [...abilityAnswers(a, statuses[name], "potential", name), ...abilityAnswers(a, statuses[name], "koto", name)], [{ accepted: [...abilityAnswers(a, !statuses[name], "potential", name), ...abilityAnswers(a, !statuses[name], "koto", name)], message: "This reverses this person's ability. Check whether they still need assistance." }])), explanation: "Read the replies for each person separately. A person's skill is different from whether they have already done the task today." }, { ...result, statuses, order: [first, second] }),
				q("ability-evidence", a, v, { prompt: `今日の予定：${a.dict}\n${person}は${skill ? "やり方を知っているので、一人でできます" : "まだやり方を覚えていないので、先生の助けが必要です"}。\n${conditions[opportunity ? 0 : 1]}`, subprompt: "Which summary keeps personal skill separate from today's conditions?", band: "Check both facts.", options: claims.map(claimText), answer: claimText(summary), choiceFacts: claims, explanation: "Having the skill does not guarantee an opportunity today. Suitable materials, equipment, or a conversation partner do not by themselves establish someone's skill." }, { ...result, ...summary }),
				q("evidence-limit", a, v, { prompt: `担当者のメモには、次の一文だけが書いてあります。\n「${evidenceSource}」\nほかの人が手伝ったかどうかなど、追加の説明はありません。`, subprompt: "Which conclusion preserves the distinction between ability and a particular event?", band: "Do not infer more than the statement gives you.", options: evidenceTexts, answer: evidenceTexts[v], choiceFacts: evidenceClaims, explanation: "A potential statement establishes ability or possibility, not today's event. An ordinary event report says what happened, but does not by itself establish a lasting independent skill. Not doing something does not prove inability." }, { ...result, conclusion: evidenceClaims[v] })
			];
		}
		function serviceQuestions(word, place, requirement, v) {
			const a = { id: `service:${word}`, frame: "service", word, verb: "する" }, positive = v % 2 === 0;
			const answers = (yes) => endings("でき", yes).flatMap((end) => ["", "ここでは", "今日は", "ここでは今日は", "今日はここで"].map((prefix) => `${prefix}${word}が${end}`));
			const notice = `${place}の案内\n${word}のサービス：${positive ? "今日は通常どおり利用できます。" : "今日は休止しています。明日、再開する予定です。"}`;
			const ready = v < 2, operating = positive, condition = requirements[requirement];
			const statuses = [{ ready: true, operating: true }, { ready: true, operating: false }, { ready: false, operating: true }, { ready: false, operating: false }];
			const choice = (f) => `利用に必要な準備は${f.ready ? "できている" : "まだできていない"}。サービスは${f.operating ? "利用できる状態だ" : "休止中だ"}。`;
			const pair = { ready, operating };
			const past = v < 2;
			const changeClaims = [{ past: true, now: true }, { past: true, now: false }, { past: false, now: true }, { past: false, now: false }];
			const changeText = (f) => `以前は${word}が${f.past ? "できました" : "できませんでした"}が、今日は${f.now ? "できます" : "できません"}。`;
			return [
				q("service-report", a, v, { prompt: notice + "\n友だちは今日の利用について知りたいと言っています。", subprompt: `Tell your friend whether ${nouns.get(word).en} is possible here today. Use the activity noun + ができます (or its negative). No need to copy the place name.`, band: "Report the current service.", vocabulary: `${word} (${nouns.get(word).en})`, fields: [core.field("Today's availability", answers(positive), [{ accepted: answers(!positive), message: "This reverses today's availability. Tomorrow's planned reopening does not change today's notice." }])], explanation: "An activity noun takes ができます to describe availability. This says what the place offers, not whether you personally have the skill." }, { positive, word }),
				q("feasible-service", a, v, { prompt: `${place}で${word}をしたいと思っています。\n案内：${condition[0]}${operating ? "今日は通常どおり利用できます。" : "今日は休止中です。準備ができていても利用できません。"}\n自分の状況：${condition[ready ? 1 : 2]}`, subprompt: "Which summary accurately preserves both the user's preparation and the service status?", band: "Do not confuse a requirement with availability.", options: statuses.map(choice), answer: choice(pair), choiceFacts: statuses, explanation: `The required preparation ${ready ? "is complete" : "is incomplete"}; the service ${operating ? "is operating" : "is suspended"}. Both conditions must be satisfied before using it.` }, pair),
				q("scope-change", a, v, { prompt: `${place}について、古い案内と今日の案内があります。\n以前：${word}のサービスは${past ? "利用可能でした" : "休止中でした"}。\n今日：${positive ? "通常どおり利用できます" : "休止中です"}。\n友だちは二つの案内を見て、いつ利用できるのか確認しています。`, subprompt: "Which statement preserves both the earlier and current availability? It may or may not have changed.", band: "Keep both time scopes.", options: changeClaims.map(changeText), answer: changeText({ past, now: positive }), choiceFacts: changeClaims, explanation: "The past potential predicate describes earlier availability; the present predicate describes today. Do not assume that a new notice necessarily reverses the old conditions." }, { past, now: positive, word })
			];
		}
		function perceptionQuestions(sense, word, v) {
			const a = { id: `perception:${word}`, frame: sense.id, word, verb: sense.verb };
			const positive = v % 2 === 0, earlier = v < 2;
			const answers = (yes) => endings(sense.percept.slice(0, -1), yes).flatMap((end) => ["", "ここから", "ここからは", "今は"].map((prefix) => `${prefix}${word}が${end}`));
			const observation = (yes) => yes ? sense.positive : sense.negative;
			const target = sense.id === "sight" ? `${word}の写真` : `${word}の録音`;
			const access = v < 2, perceived = positive;
			const claims = [{ access: true, perceived: true }, { access: true, perceived: false }, { access: false, perceived: true }, { access: false, perceived: false }];
			const text = (f) => `自分のアカウントでは${target}を${sense.id === "sight" ? "見る" : "聞く"}ことが${f.access ? "できる" : "できない"}。受付では${sense.id === "sight" ? "その写真" : word}が${sense.percept.slice(0, -1)}${f.perceived ? "る" : "ない"}。`;
			const reception = sense.id === "sight" ? (perceived ? "受付の画面は自分のほうを向いていて、写真ははっきりしています。" : "受付の画面は反対側を向いていて、写真の内容は確認できません。") : observation(perceived);
			return [
				q("perception-report", a, v, { prompt: `確認するもの：${word}\n友だちが、今ここから分かるかどうか聞いています。\n${observation(positive)}`, subprompt: `Describe current ${sense.id === "sight" ? "visibility using 見える" : "audibility using 聞こえる"}, not permission or an intentional action. Include the named thing.`, band: "Report the observation.", vocabulary: `${word} (${nouns.get(word).en})`, fields: [core.field("Current observation", answers(positive), [{ accepted: answers(!positive), message: "Your sentence reverses whether the sight or sound reaches you." }])], explanation: `${sense.percept} describes ${sense.id === "sight" ? "something being visible" : "a sound reaching your ears"}. The thing perceived takes が. A different access construction may be grammatical, but this task asks for direct perception.` }, { positive, sense: sense.id, word }),
				q("two-channels", a, v, { prompt: `同じ${word}について、場所を変えて確認しました。\n場面A：${observation(earlier)}\n場面B：${observation(positive)}`, subprompt: `Write one observation for each scene using ${sense.percept}. Include ${word}; the two answers may agree or differ.`, band: "Judge each scene independently.", vocabulary: `${word} (${nouns.get(word).en})`, fields: [earlier, positive].map((yes, i) => core.field(`Scene ${i ? "B" : "A"}`, answers(yes), [{ accepted: answers(!yes), message: "This reverses the observation in this scene. The two scenes do not necessarily have opposite answers." }])), explanation: "Read the evidence in each scene separately. There is no rule that one must be positive and the other negative." }, { observations: [earlier, positive], sense: sense.id, word }),
				q("access-perception", a, v, { prompt: `会員用の${sense.id === "sight" ? "写真" : "音声"}サービスで、${target}を調べています。\n自分のアカウント：登録が${access ? "完了しているので、利用できます" : "まだなので、利用できません"}。\n受付の人は、別の機械で同じものを${sense.id === "sight" ? "画面に出しました" : "再生しました"}。\n${reception}`, subprompt: "Keep access through your own account separate from what you perceive on the receptionist's machine.", band: "Which pair of facts is supported?", options: claims.map(text), answer: text({ access, perceived }), choiceFacts: claims, explanation: "Your registration controls access through your account. It does not determine whether you can perceive the receptionist's separate display or playback. Potential and perception describe different facts here." }, { access, perceived, sense: sense.id, word })
			];
		}
		function buildBank() {
			const bank = [];
			for (const a of core.shuffle(actions, rng)) for (let v = 0; v < 4; v++) bank.push(...skillQuestions(a, v));
			for (const [word, place, requirement] of services) for (let v = 0; v < 4; v++) bank.push(...serviceQuestions(word, place, requirement, v));
			for (const sense of senses) for (const word of sense.objects) for (let v = 0; v < 4; v++) bank.push(...perceptionQuestions(sense, word, v));
			return bank;
		}
		return { buildBank, grade, normalize, lexicon: { actions, nouns: [...nouns.values()], verbs: [...verbs.values()] } };
	}
	const selectQueue = (bank, count = 25, options) => core.selectQueue(bank, count, options, version, tasks);
	return { version, create, selectQueue, tasks, readings, frames, senses, services, abilityAnswers };
});
