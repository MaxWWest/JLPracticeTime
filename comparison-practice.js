/* Comparison facts, question construction, and grading are deliberately independent of the UI. */
(function (root, factory) {
	const api = factory();
	if (typeof module === "object" && module.exports) module.exports = api;
	else root.ComparisonPractice = api;
})(typeof globalThis === "object" ? globalThis : this, function () {
	"use strict";

	const version = "comparison-v2";
	const extraNouns = {
		buildings: [["旅館", "りょかん", "the inn"]],
		rooms: [["自習室", "じしゅうしつ", "the study room"]],
		objects: [["スーツケース", "スーツケース", "the suitcase"], ["タブレット", "タブレット", "the tablet"], ["ノートパソコン", "ノートパソコン", "the laptop"], ["カメラ", "カメラ", "the camera"], ["問題集", "もんだいしゅう", "the exercise book"]],
		clothing: [["ジャケット", "ジャケット", "the jacket"], ["セーター", "セーター", "the sweater"]],
		food: [["ラーメン", "ラーメン", "the ramen"], ["うどん", "うどん", "the udon"]]
	};
	const extraAdjectives = [
		{ adj: "暖かい", neg: "暖かく", kana: "あたたかい", base: "warm", comparative: "warmer", tags: ["clothing"] },
		{ adj: "おもしろい", neg: "おもしろく", kana: "おもしろい", base: "interesting", comparative: "more interesting", tags: ["study", "schedule"] },
		{ adj: "読みやすい", neg: "読みやすく", kana: "よみやすい", base: "easy to read", comparative: "easier to read", tags: ["objects", "study"] },
		{ adj: "集中しやすい", neg: "集中しやすく", kana: "しゅうちゅうしやすい", base: "easy to concentrate", comparative: "easier to concentrate", tags: ["study"] },
		{ adj: "楽", neg: "楽では", kana: "らく", base: "easy", comparative: "easier", tags: ["transport", "study"] }
	];
	const readings = [
		["大き", "おおき"], ["今", "いま"], ["友だち", "ともだち"],
		["集中しやす", "しゅうちゅうしやす"], ["暖か", "あたたか"], ["楽しい", "たのしい"], ["楽しく", "たのしく"],
		["会議室", "かいぎしつ"], ["自習室", "じしゅうしつ"], ["問題集", "もんだいしゅう"], ["旅館", "りょかん"],
		["銀行", "ぎんこう"], ["自転車", "じてんしゃ"], ["体育館", "たいいくかん"], ["教室", "きょうしつ"],
		["財布", "さいふ"], ["勉強する", "べんきょうする"], ["練習する", "れんしゅうする"], ["電話する", "でんわする"],
		["走る", "はしる"], ["書く", "かく"], ["買う", "かう"], ["選びます", "えらびます"], ["使う", "つかう"],
		["泊まる", "とまる"], ["見た", "みた"], ["借りた", "かりた"], ["買った", "かった"], ["使っている", "つかっている"],
		["先月", "せんげつ"], ["今月", "こんげつ"], ["平日", "へいじつ"], ["日曜日", "にちようび"], ["午前", "ごぜん"], ["午後", "ごご"], ["朝", "あさ"], ["夜", "よる"],
		["駅前", "えきまえ"], ["近く", "ちかく"], ["東", "ひがし"], ["西", "にし"], ["南", "みなみ"], ["北", "きた"],
		["赤い", "あかい"], ["青い", "あおい"], ["黒い", "くろい"], ["先に", "さきに"], ["後で", "あとで"],
		["田中", "たなか"], ["山田", "やまだ"], ["佐藤", "さとう"], ["方", "ほう"]
	];
	const modifiers = {
		lodging: [["駅前の", "near the station"], ["海の近くの", "near the sea"], ["空港の近くの", "near the airport"]],
		color: [["赤い", "red"], ["青い", "blue"], ["黒い", "black"]],
		owner: [["私の", "mine"], ["兄の", "my older brother's"], ["姉の", "my older sister's"]],
		lesson: [["昨日の", "yesterday's"], ["今日の", "today's"], ["先週の", "last week's"]],
		meeting: [["午前の", "the morning"], ["午後の", "the afternoon"], ["昨日の", "yesterday's"]],
		movie: [["昨日見た", "seen yesterday"], ["先週見た", "seen last week"], ["今日見た", "seen today"]],
		book: [["昨日買った", "bought yesterday"], ["図書館で借りた", "borrowed from the library"], ["今使っている", "currently in use"]],
		park: [["東の", "in the east"], ["西の", "in the west"], ["南の", "in the south"]]
	};

	// Narrow semantic cohorts refine the shared tags: a suitcase has weight; an ebook does not.
	const domains = [
		{ id: "lodging", nouns: ["ホテル", "旅館"], modifiers: "lodging", sameNoun: true, adjectives: ["安い", "広い", "静か", "きれい"], intro: "来月、友だちと旅行に行くので、泊まる場所を探しています。", en: "I am looking for somewhere to stay because I am travelling with a friend next month." },
		{ id: "study-spaces", nouns: ["図書館", "自習室", "喫茶店", "教室"], adjectives: ["静か", "明るい", "広い", "近い"], intro: "明日の試験のために勉強したいので、使える場所を調べました。", en: "I checked the available places because I want to study for tomorrow's exam." },
		{ id: "meeting-spaces", nouns: ["会議室", "教室", "事務所", "体育館"], adjectives: ["広い", "明るい", "静か"], intro: "週末にみんなで集まることになりました。場所を決める前に、次のメモを読みます。", en: "We have arranged to get together this weekend. We read these notes before deciding where." },
		{ id: "luggage", nouns: ["かばん", "リュック", "スーツケース"], modifiers: "color", adjectives: ["軽い", "安い", "大きい"], intro: "旅行の荷物を準備しています。店でいくつかの商品を持ってみて、比べました。", en: "I am preparing luggage for a trip. I tried holding several items in the shop to compare them." },
		{ id: "clothes", nouns: ["コート", "ジャケット", "セーター"], modifiers: "color", adjectives: ["暖かい", "軽い", "安い"], intro: "来週は寒くなるそうです。出かけるときに着る物を店で比べています。", en: "I hear it will get cold next week. I am comparing clothes to wear when going out." },
		{ id: "devices", nouns: ["スマホ", "タブレット", "ノートパソコン", "カメラ"], modifiers: "owner", sameNoun: true, adjectives: ["軽い", "安い", "小さい", "便利"], intro: "旅行に持って行く物を決めるために、家族が持っている物を比べました。", en: "I compared the devices owned by my family to decide what to take on a trip." },
		{ id: "books", nouns: ["教科書", "辞書", "問題集", "雑誌"], modifiers: "book", adjectives: ["読みやすい", "軽い", "難しい"], intro: "日本語の勉強に使う本を決めたいので、手元にある本を少しずつ読んでみました。", en: "I want to decide which books to use for studying Japanese, so I tried reading a little of each book I have available." },
		{ id: "drinks", nouns: ["お茶", "コーヒー", "ジュース", "牛乳"], adjectives: ["甘い", "安い"], intro: "この店には飲み物がいろいろあります。友だちと少しずつ飲んで、メニューも見ました。", en: "This shop has a range of drinks. A friend and I tasted a little of each and looked at the menu." },
		{ id: "meals", nouns: ["カレー", "スープ", "ラーメン", "うどん"], adjectives: ["辛い", "安い"], intro: "昼休みに同じ店で食事をしました。次に注文するときのために、メモを残しました。", en: "We ate at the same restaurant at lunchtime and made notes for our next order." },
		{ id: "lessons", nouns: ["授業"], modifiers: "lesson", sameNoun: true, adjectives: ["長い", "難しい", "楽しい"], intro: "今週は試験があるので、授業の内容と時間をノートで確認しています。", en: "Because there is an exam this week, I am checking the class content and duration in my notes." },
		{ id: "meetings", nouns: ["会議", "説明会"], modifiers: "meeting", sameNoun: true, adjectives: ["長い", "おもしろい"], intro: "仕事の予定を立てるために、参加した会の時間と内容をまとめています。", en: "I am summarizing the length and content of the sessions I attended to plan my work." },
		{ id: "movies", nouns: ["映画"], modifiers: "movie", sameNoun: true, adjectives: ["長い", "おもしろい"], intro: "最近、映画を何本か見ました。友だちに聞かれたので、感想をまとめています。", en: "I have seen several films recently and am summarizing my impressions because a friend asked." },
		{ id: "errands", nouns: ["銀行", "郵便局", "病院", "学校", "駅"], adjectives: ["近い", "大きい", "古い"], intro: "引っ越したばかりなので、新しい家の近くを歩いて調べました。距離は家から比べています。", en: "Having just moved, I walked around to learn the area. All distances are measured from my home." },
		{ id: "shops", nouns: ["スーパー", "コンビニ", "デパート"], adjectives: ["広い", "近い", "にぎやか"], intro: "母に買い物を頼まれました。家から行ける店について、前に書いたメモを見ています。", en: "My mother asked me to do some shopping. I am reading my earlier notes about shops reachable from home." },
		{ id: "parks", nouns: ["公園"], modifiers: "park", sameNoun: true, adjectives: ["広い", "静か", "きれい", "近い"], intro: "日曜日に家族と出かける予定です。家の近くの公園について調べています。", en: "We plan to go out as a family on Sunday. I am looking into parks near home." },
		{ id: "transport", nouns: ["バス", "電車", "地下鉄", "タクシー"], adjectives: ["安い", "速い", "便利"], intro: "今日は駅から会社へ行きます。同じ時間に出発する場合について、交通案内を読みました。", en: "Today I am travelling from the station to the office. I read the transport information for departures at the same time." }
	];
	const variableDimensions = new Set(["安い", "静か", "便利", "にぎやか", "速い"]);
	const subjectiveDimensions = new Set(["便利", "難しい", "楽しい", "おもしろい", "読みやすい", "集中しやすい", "楽"]);
	const scopes = [
		{ a: "平日", b: "日曜日", aEn: "on weekdays", bEn: "on Sundays" },
		{ a: "朝", b: "夜", aEn: "in the morning", bEn: "at night" }
	];
	const tasks = [
		{ id: "paired-blanks", label: "Two-part comparison", count: 3 },
		{ id: "rewrite-hodo", label: "Keep the meaning", count: 3 },
		{ id: "rewrite-hou", label: "Keep the meaning", count: 2 },
		{ id: "opposite", label: "Reverse the comparison", count: 2 },
		{ id: "meaning", label: "Follow the evidence", count: 2 },
		{ id: "inference", label: "Connect the comparisons", count: 3 },
		{ id: "tradeoff", label: "Two different qualities", count: 2 },
		{ id: "dialogue", label: "Continue the conversation", count: 2 },
		{ id: "production", label: "Express the meaning", count: 2 },
		{ id: "repair", label: "Correct the comparison", count: 2 },
		{ id: "particles", label: "Comparison and choice", count: 1 },
		{ id: "three-forms", label: "Three ways to compare", count: 1 }
	];

	function rngFromSeed(seed) {
		let value = seed >>> 0;
		return () => {
			value += 0x6D2B79F5;
			let t = Math.imul(value ^ value >>> 15, value | 1);
			t ^= t + Math.imul(t ^ t >>> 7, t | 61);
			return ((t ^ t >>> 14) >>> 0) / 4294967296;
		};
	}
	function shuffle(items, rng) {
		const copy = [...items];
		for (let i = copy.length - 1; i > 0; i--) {
			const j = Math.floor(rng() * (i + 1));
			[copy[i], copy[j]] = [copy[j], copy[i]];
		}
		return copy;
	}
	const pick = (items, rng) => items[Math.floor(rng() * items.length)];
	const unique = (items) => [...new Set(items)];
	const upper = (value) => value[0].toUpperCase() + value.slice(1);
	const nominal = (entity) => entity.type === "action" ? `${entity.ja}の` : entity.ja;
	const hou = (entity) => `${entity.ja}${entity.type === "action" ? "" : "の"}ほう`;

	function ending(dimension, negative = false, past = false) {
		if (negative) return `${dimension.neg}ありません${past ? "でした" : ""}`;
		if (!past) return `${dimension.adj}です`;
		return dimension.neg.endsWith("では") ? `${dimension.adj}でした` : `${dimension.adj.slice(0, -1)}かったです`;
	}

	function sentence(more, less, dimension, form = "yori-hou", past = false) {
		const positive = ending(dimension, false, past);
		if (form === "hodo") return `${nominal(less)}は${more.ja}ほど${ending(dimension, true, past)}。`;
		if (form === "hodo-front") return `${more.ja}ほど${nominal(less)}は${ending(dimension, true, past)}。`;
		if (form === "hou-yori") return `${hou(more)}が${less.ja}より${positive}。`;
		if (form === "topic-yori") return `${nominal(more)}は${less.ja}より${positive}。`;
		return `${less.ja}より${hou(more)}が${positive}。`;
	}

	function sentenceAnswers(more, less, dimension, target) {
		const forms = target === "hodo" ? ["hodo", "hodo-front"] : target === "topic-yori" ? ["topic-yori"] : ["yori-hou", "hou-yori"];
		const answers = [];
		for (const form of forms) {
			const text = sentence(more, less, dimension, form);
			answers.push(text, text.replace(/より/g, "よりも"));
			if (target === "hodo") {
				if (dimension.neg.endsWith("では")) {
					answers.push(text.replace("ではありません", "ではないです"), text.replace("ではありません", "じゃありません"), text.replace("ではありません", "じゃないです"), text.replace("ではありません", "ではない"), text.replace("ではありません", "じゃない"));
				} else answers.push(text.replace("ありません", "ないです"), text.replace("ありません", "ない"));
			} else answers.push(text.replace(/です。$/, dimension.neg.endsWith("では") ? "だ。" : "。"));
		}
		// Explicit action nominalization is also grammatical; do not insert の before dictionary-form ほう.
		if (more.type === "action" && target === "hodo") {
			const asNoun = (entity) => ({ ...entity, ja: `${entity.ja}こと`, type: "noun" });
			answers.push(...sentenceAnswers(asNoun(more), asNoun(less), dimension, target));
		}
		return unique(answers);
	}

	function relationEnglish(more, less, dimension, past = false) {
		if (dimension.adj === "集中しやすい") return `It is easier to concentrate when ${more.en} than when ${less.en}.`;
		return `${upper(more.en)} ${past ? "was" : "is"} ${dimension.comparative} than ${less.en}.`;
	}

	// Only traverse facts for the requested quality and scope. Sharing a benchmark does not order two items.
	function compare(facts, a, b, dimension, scope = "default") {
		if (a === b) return "equal";
		const relevant = facts.filter((f) => f.dimension === dimension && f.scope === scope);
		function reaches(from, to) {
			const pending = [{ id: from, strict: false }];
			const seen = new Set();
			while (pending.length) {
				const current = pending.shift();
				const key = `${current.id}:${current.strict}`;
				if (seen.has(key)) continue;
				seen.add(key);
				if (current.id === to) return current.strict ? "more" : "equal";
				for (const fact of relevant) {
					if (fact.more === current.id) pending.push({ id: fact.less, strict: current.strict || !fact.equal });
					if (fact.equal && fact.less === current.id) pending.push({ id: fact.more, strict: current.strict });
				}
			}
			return null;
		}
		return reaches(a, b) || (reaches(b, a) === "more" ? "less" : "unknown");
	}

	function create({ nounPools, adjectivePool, verbPool, aliases = [], seed = Date.now() } = {}) {
		const rng = rngFromSeed(seed);
		const nouns = new Map(Object.values(nounPools || {}).flat().map((n) => [n.ja, { ...n, type: "noun", root: n.ja }]));
		Object.values(extraNouns).flat().forEach(([ja, kana, en]) => nouns.set(ja, { ja, kana, en, type: "noun", root: ja }));
		const adjectives = new Map([...(adjectivePool || []), ...extraAdjectives].map((d) => [d.adj, d]));
		const verbs = new Map((verbPool || []).map((v) => [v.ja, v]));
		const aliasMap = new Map([...aliases, ...readings, ...Object.values(extraNouns).flat().map(([ja, kana]) => [ja, kana])]);
		const orderedAliases = [...aliasMap].sort((a, b) => b[0].length - a[0].length);
		const escaped = orderedAliases.map(([word]) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
		const aliasPattern = new RegExp(escaped.join("|"), "g");
		function normalize(value) {
			return String(value || "").normalize("NFKC").replace(aliasPattern, (word) => aliasMap.get(word))
				.replace(/[ァ-ヶ]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60))
				.replace(/[\s。、，,.!！？「」『』"'()（）]/g, "").toLowerCase();
		}
		function entity(word, modifier) {
			const found = nouns.get(word);
			if (!found) throw new Error(`Comparison noun is missing: ${word}`);
			if (!modifier) return { ...found };
			const bare = found.en.replace(/^the /, "");
			const [prefix, en] = modifier;
			const before = /'s$|^the morning$|^the afternoon$|^red$|^blue$|^black$/.test(en);
			const english = en === "mine" ? `my ${bare}` : /^(red|blue|black)$/.test(en) ? `the ${en} ${bare}` : before ? `${en} ${bare}` : `the ${bare} ${en}`;
			return { ...found, ja: prefix + found.ja, en: english };
		}
		function domainEntities(domain) {
			const words = shuffle(domain.nouns, rng);
			const mods = domain.modifiers ? shuffle(modifiers[domain.modifiers], rng) : [];
			return Array.from({ length: 3 }, (_, i) => entity(domain.sameNoun ? words[0] : words[i % words.length], mods[i]));
		}
		function fact(more, less, dimension, scope = "default", equal = false) {
			return { more: more.ja, less: less.ja, dimension: dimension.adj, scope, equal };
		}
		function renderFact(f, entities, past = false, form) {
			const more = entities.find((e) => e.ja === f.more);
			const less = entities.find((e) => e.ja === f.less);
			const dimension = adjectives.get(f.dimension);
			if (f.equal) return `${more.ja}と${less.ja}は同じくらい${ending(dimension, false, past)}。`;
			return sentence(more, less, dimension, form || pick(["yori-hou", "hou-yori", "hodo", "topic-yori"], rng), past);
		}
		function makeScene(domain, structure, iteration) {
			const entities = domainEntities(domain);
			const [a, b, c] = shuffle(entities, rng);
			const ds = shuffle(domain.adjectives.map((word) => adjectives.get(word)), rng);
			let dimension = ds[0];
			let target = { more: a, less: c, dimension, scope: "default" };
			let facts = [];
			let context = domain.intro;
			let contextEn = domain.en;
			let queryPair = [a, c];
			let conclusion = "more";
			let presentation = { intro: context, introEn: domain.en, prefixes: [], past: [] };
			if (structure === "chain") {
				facts = [fact(a, b, dimension), fact(b, c, dimension)];
				context += "\n" + shuffle(facts, rng).map((f) => renderFact(f, entities)).join("\n");
			} else if (structure === "tradeoff") {
				facts = [fact(a, b, dimension), fact(b, a, ds[1])];
				target.less = b;
				context += "\n" + shuffle(facts, rng).map((f) => renderFact(f, entities)).join("\n");
			} else if (structure === "condition" || structure === "change" || structure === "perspective") {
				const eligible = ds.filter((d) => (structure === "perspective" ? subjectiveDimensions : variableDimensions).has(d.adj));
				if (!eligible.length) return null;
				dimension = pick(eligible, rng);
				const s = structure === "perspective" ? { a: "田中さん", b: "山田さん", aEn: "for Tanaka", bEn: "for Yamada" } : structure === "change" ? { a: "先月", b: "今月", aEn: "last month", bEn: "this month" } : pick(scopes, rng);
				const first = fact(a, b, dimension, s.a);
				const second = fact(b, a, dimension, s.b);
				facts = [first, second];
				const qualifier = structure === "perspective" ? "には" : "は";
				const setup = structure === "perspective" ? "田中さんと山田さんに感想を聞きました。" : structure === "change" ? "先月のメモだけでは分からないので、今月の情報も確認しました。" : "利用する時間も考えて、次の情報を確認しました。";
				presentation = { intro: `${domain.intro}\n${setup}`, introEn: domain.en, prefixes: [`${s.a}${qualifier}、`, `${s.b}${qualifier}、`], past: [structure === "change", false] };
				context = presentation.intro + "\n" + facts.map((f, index) => presentation.prefixes[index] + renderFact(f, entities, presentation.past[index])).join("\n");
				const setupEn = structure === "perspective" ? "I asked Tanaka and Yamada for their impressions." : structure === "change" ? "Last month's notes are not enough, so I also checked this month's information." : "I checked this information, taking the time of use into account.";
				contextEn = `${domain.en} ${setupEn} ${upper(s.aEn)}: ${relationEnglish(a, b, dimension, structure === "change")} ${upper(s.bEn)}: ${relationEnglish(b, a, dimension)}`;
				const chooseFirst = structure !== "change" && rng() < 0.5;
				target = { more: chooseFirst ? a : b, less: chooseFirst ? b : a, dimension, scope: chooseFirst ? s.a : s.b };
			} else if (structure === "evidence") {
				const variant = iteration % 4;
				queryPair = [b, c];
				facts = variant === 0 ? [fact(b, a, dimension), fact(c, a, dimension)]
					: variant === 1 ? [fact(b, a, dimension), fact(a, c, dimension)]
						: variant === 2 ? [fact(c, a, dimension), fact(a, b, dimension)]
							: [fact(b, c, dimension, "default", true), fact(c, a, dimension)];
				conclusion = compare(facts, b.ja, c.ja, dimension.adj);
				target = conclusion === "less" ? { more: c, less: b, dimension, scope: "default" } : { more: b, less: c, dimension, scope: "default" };
				context += "\n" + shuffle(facts, rng).map((f) => renderFact(f, entities)).join("\n");
			}
			if (!["condition", "change", "perspective"].includes(structure)) {
				contextEn += " " + facts.map((f) => f.equal ? `${upper(entities.find((e) => e.ja === f.more).en)} and ${entities.find((e) => e.ja === f.less).en} are equally ${dimension.base}.` : relationEnglish(entities.find((e) => e.ja === f.more), entities.find((e) => e.ja === f.less), adjectives.get(f.dimension))).join(" ");
			}
			const lexical = unique(facts.flatMap((f) => [f.more, f.less]).map((name) => entities.find((e) => e.ja === name).root)).sort();
			return { entities, target, facts, context, contextEn, presentation, structure, domain: domain.id, queryPair, conclusion,
				familyKey: `${domain.id}:${lexical.join("|")}`, sceneKey: `${domain.id}:${facts.map((f) => `${f.more}>${f.less}:${f.dimension}:${f.scope}:${f.equal}`).sort().join("|")}` };
		}

		function actionScenes() {
			const result = [];
			const places = ["図書館", "学校", "銀行", "郵便局", "病院", "駅", "公園", "映画館"];
			const studyPlaces = ["図書館", "自習室", "喫茶店", "教室", "事務所"];
			const people = ["母", "父", "兄", "姉", "先生", "友だち"];
			const action = (ja, en, word) => ({ ja, en, root: word, type: "action" });
			const verb = (ja) => {
				if (!verbs.has(ja)) throw new Error(`Comparison verb is missing: ${ja}`);
				return verbs.get(ja).forms.dictionary;
			};
			for (let i = 0; i < 48; i++) {
				let entities, dimension, context, contextEn, domain;
				if (i % 4 === 0) {
					const place = entity(pick(places, rng));
					const vehicles = shuffle(["バス", "電車", "タクシー", "地下鉄"], rng).slice(0, 2).map((n) => entity(n));
					entities = vehicles.map((v) => action(`${v.ja}で${place.ja}まで${verb("行く")}`, `going to ${place.en} by ${v.en.replace(/^the /, "")}`, `${v.root}:${place.root}`));
					dimension = pick([adjectives.get("便利"), adjectives.get("楽")], rng);
					context = `今日は荷物が多いので、${place.ja}まで行く方法を考えています。`;
					contextEn = `Because I have a lot of luggage today, I am considering how to get to ${place.en}.`;
					domain = "travel-actions";
				} else if (i % 4 === 1) {
					const locations = shuffle(studyPlaces, rng).slice(0, 2).map((n) => entity(n));
					const v = pick(["勉強する", "練習する"], rng);
					entities = locations.map((p) => action(`${p.ja}で${verb(v)}`, `${v === "勉強する" ? "studying" : "practising"} at ${p.en}`, p.root));
					dimension = adjectives.get("集中しやすい");
					context = "明日は日本語の試験なので、今日は勉強する場所を決めたいです。";
					contextEn = "Because I have a Japanese exam tomorrow, I want to decide where to study today.";
					domain = "study-actions";
				} else if (i % 4 === 2) {
					const p = entity(pick(people, rng));
					entities = [action(`${p.ja}に${verb("電話する")}`, `calling ${p.en}`, `${p.root}:call`), action(`${p.ja}にメールを${verb("書く")}`, `writing an email to ${p.en}`, `${p.root}:email`)];
					dimension = pick([adjectives.get("便利"), adjectives.get("楽")], rng);
					context = `予定が変わったので、${p.ja}に知らせなければなりません。`;
					contextEn = `My plans have changed, so I need to let ${p.en} know.`;
					domain = "contact-actions";
				} else {
					const object = entity(pick(["辞書", "教科書", "かばん", "シャツ", "コート", "カメラ"], rng));
					entities = [action(`店で${object.ja}を${verb("買う")}`, `buying ${object.en} in a shop`, `${object.root}:shop`), action(`インターネットで${object.ja}を${verb("買う")}`, `buying ${object.en} online`, `${object.root}:online`)];
					dimension = pick([adjectives.get("便利"), adjectives.get("楽")], rng);
					context = `${object.ja}が必要になったので、買い方を考えています。`;
					contextEn = `I need ${object.en}, so I am considering how to buy it.`;
					domain = "shopping-actions";
				}
				const [more, less] = shuffle(entities, rng);
				const facts = [fact(more, less, dimension)];
				const presentation = { intro: context, introEn: contextEn, prefixes: ["私には、"], past: [] };
				context += `\n私には、${renderFact(facts[0], entities)}`;
				const meaning = relationEnglish(more, less, dimension);
				contextEn += ` For me, ${meaning[0].toLowerCase() + meaning.slice(1)}`;
				result.push({ entities, facts, target: { more, less, dimension, scope: "default" }, context, contextEn, presentation, domain, structure: "action-reason", conclusion: "more", queryPair: entities,
					familyKey: `${domain}:${entities.map((e) => e.root).sort().join("|")}`, sceneKey: `${domain}:${entities.map((e) => e.ja).sort().join("|")}:${more.ja}:${dimension.adj}` });
			}
			return result;
		}

		function proof(scene) {
			const { more, less, dimension, scope } = scene.target;
			if (scene.conclusion === "unknown") return `Both items are compared with the same third item. Their order relative to each other is not stated. Do not infer equality from missing information.`;
			if (scene.conclusion === "equal") return `同じくらい explicitly states an equal degree of ${dimension.base}. Neither side has more of that quality.`;
			return `${scope === "default" ? "" : `Use the comparison for ${scope}. `}${relationEnglish(more, less, dimension)} ${scene.structure === "chain" ? "Follow both comparisons through the middle item. " : ""}The item immediately before より is the comparison base; the item before ほうが has more of the named quality. In a ほど negative comparison, the benchmark immediately before ほど has more of that quality.`;
		}
		function vocabulary(scene, targetOnly = false) {
			const used = new Set([scene.target.more.ja, scene.target.less.ja, ...(targetOnly ? [] : scene.facts.flatMap((f) => [f.more, f.less]))]);
			const entities = scene.entities.filter((e) => used.has(e.ja));
			return [...entities.map((e) => `${e.ja} (${e.en})`), `${scene.target.dimension.adj} (${scene.target.dimension.base})`].join(" / ");
		}
		function contextInForm(scene, form) {
			const { intro, prefixes, past } = scene.presentation;
			return intro + "\n" + scene.facts.map((f, i) => (prefixes[i] || "") + renderFact(f, scene.entities, past[i], form)).join("\n");
		}
		function buildQuestion(scene, task, variant) {
			const { more, less, dimension, scope } = scene.target;
			const targetForm = variant % 2 ? "hodo" : "hou";
			const scopeCue = scope === "default" ? "" : `Use only the information for ${scope}. `;
			const q = { kind: task.label, prompt: scene.context, subprompt: "", band: "", mode: "choice", answer: "", explanation: proof(scene),
				meta: { engine: version, task: task.id, structure: scene.structure, domain: scene.domain, sceneKey: scene.sceneKey, familyKey: scene.familyKey, difficulty: "hard", pattern: "より・ほうが・ほど", sourceSessionId: "comparison", vocabulary: unique(scene.entities.map((e) => e.root)), adjective: dimension.adj, facts: scene.facts, target: scene.target } };
			function fields(items) {
				q.mode = "text";
				q.fields = items.map((item, i) => ({ id: `part-${i + 1}`, label: item.label, accepted: item.accepted, answer: item.accepted[0], multiline: item.multiline !== false }));
				q.answer = q.fields.map((field) => field.answer).join(" / ");
				q.accepted = [q.answer];
				q.vocabulary = vocabulary(scene, ["production", "three-forms", "particles"].includes(task.id));
			}
			function writing(label, form, high = more, low = less) {
				const answers = sentenceAnswers(high, low, dimension, form);
				const person = scene.structure === "perspective" ? scope : scene.structure === "action-reason" ? "私" : null;
				const prefixes = person ? [`${person}には、`, `${person}にとって、`, `${person}にとっては、`] : scope === "default" ? [] : [`${scope}は、`];
				fields([{ label, accepted: [...answers, ...prefixes.flatMap((prefix) => answers.map((answer) => prefix + answer))] }]);
			}
			if (task.id === "paired-blanks") {
				if (scene.structure !== "chain") return null;
				const pattern = variant % 6;
				const pairs = [["より", "のほうが"], ["のほうが", "より"], ["は", "ほど"], ["ほど", "は"], ["は", "より"], ["より", "は"]];
				const pair = pairs[pattern];
				const a = [0, 2, 5].includes(pattern) ? less.ja : more.ja;
				const b = [0, 2, 5].includes(pattern) ? more.ja : less.ja;
				q.prompt += `\n\n${a}【1】${b}【2】${ending(dimension, pattern === 2 || pattern === 3)}。`;
				q.subprompt = `${scopeCue}Complete the final comparison so it agrees with the passage.`;
				q.band = pattern < 2 ? "Use より and のほうが." : "Use は with より or ほど.";
				fields(pair.map((part, i) => ({ label: `Blank ${i + 1}`, multiline: false, accepted: part === "より" ? [part, "よりも"] : [part] })));
			} else if (task.id === "rewrite-hodo" || task.id === "rewrite-hou" || task.id === "opposite") {
				const form = task.id === "rewrite-hodo" ? "hodo" : task.id === "rewrite-hou" ? "hou" : targetForm;
				const sourceForm = form === "hodo" ? (variant % 2 ? "hou-yori" : "yori-hou") : "hodo";
				q.prompt = contextInForm(scene, sourceForm);
				const terms = shuffle([more.ja, less.ja], rng).join(" and ");
				q.subprompt = task.id === "opposite" ? `${scopeCue}Compare ${terms}, but reverse their relationship from the passage. Keep ${dimension.adj}.` : `${scopeCue}Compare ${terms} in one sentence, keeping the passage's meaning and the adjective ${dimension.adj}.`;
				q.band = form === "hodo" ? "Use ほど with a negative ending." : "Use より and ほうが. Either word order is accepted.";
				writing("Rewritten comparison", form, task.id === "opposite" ? less : more, task.id === "opposite" ? more : less);
				if (task.id === "opposite") q.explanation = `This exercise deliberately reverses the original claim: ${relationEnglish(less, more, dimension)} ${q.answer}`;
			} else if (task.id === "production") {
				q.prompt = `${scene.context.split("\n")[0]}\n\n${relationEnglish(more, less, dimension)}`;
				q.subprompt = `Express the English comparison using the supplied Japanese words. ${scope === "default" ? "" : "The comparison concerns " + scope + "."}`;
				q.band = targetForm === "hodo" ? "Use ほど with a negative ending." : "Use より and ほうが. Either word order is accepted.";
				writing("Japanese comparison", targetForm);
			} else if (task.id === "repair") {
				q.prompt = contextInForm(scene, targetForm === "hodo" ? "topic-yori" : "hodo") + `\n\n書いた文：${sentence(less, more, dimension, targetForm === "hodo" ? "hodo" : "hou-yori")}`;
				q.subprompt = `${scopeCue}The last sentence is grammatical, but it contradicts the information above. Correct its comparison; keep ${dimension.adj}.`;
				q.band = targetForm === "hodo" ? "Keep the ほど pattern." : "Keep より and ほうが. Either order is accepted.";
				writing("Corrected comparison", targetForm);
			} else if (task.id === "three-forms") {
				q.prompt = `${relationEnglish(more, less, dimension)}\n\n${more.ja} / ${less.ja}\n${dimension.adj}`;
				q.subprompt = "Express this one relationship in each of the three forms.";
				q.band = "Keep the meaning in all three sentences.";
				fields([
					{ label: "1. A は B より ...", accepted: sentenceAnswers(more, less, dimension, "topic-yori") },
					{ label: "2. より + ほうが (either order)", accepted: sentenceAnswers(more, less, dimension, "hou") },
					{ label: "3. A は B ほど ...", accepted: sentenceAnswers(more, less, dimension, "hodo") }
				]);
			} else if (task.id === "particles") {
				if (!["luggage", "clothes", "devices", "books", "drinks", "meals"].includes(scene.domain) || !["安い", "軽い", "暖かい", "便利", "読みやすい"].includes(dimension.adj)) return null;
				const reasonPredicate = `${dimension.adj}${dimension.neg.endsWith("では") ? "だ" : ""}`;
				const adjectiveClause = `${hou(more)}【${variant % 2 ? 2 : 1}】${less.ja}より${reasonPredicate}`;
				const choiceClause = `${hou(more)}【${variant % 2 ? 1 : 2}】選びます`;
				q.prompt = variant % 2 ? `${choiceClause}。理由は、${adjectiveClause}からです。` : `${adjectiveClause}から、${choiceClause}。`;
				q.subprompt = "Complete both sentences.";
				q.band = "Fill each blank with が or を.";
				fields((variant % 2 ? ["を", "が"] : ["が", "を"]).map((part, i) => ({ label: `Blank ${i + 1}`, accepted: [part], multiline: false })));
				q.explanation = "が marks the subject of the adjective comparison. を marks the object of 選びます. The predicate determines the particle after ほう; ほう does not always take が.";
			} else if (task.id === "meaning") {
				if (scene.structure !== "evidence") return null;
				const [a, b] = scene.queryPair;
				q.subprompt = `${a.ja}と${b.ja}と、どちらが${dimension.adj}ですか。`;
				q.band = "Choose only what the passage establishes.";
				q.options = [a.ja, b.ja, "同じくらいです。", "この情報だけでは分かりません。"];
				q.answer = q.options[{ more: 0, less: 1, equal: 2, unknown: 3 }[scene.conclusion]];
			} else if (task.id === "inference") {
				if (scene.structure !== "chain") return null;
				const third = scene.entities.find((e) => e.ja !== more.ja && e.ja !== less.ja);
				const options = [
					{ more, less }, { more: less, less: more }, { more: third, less: more }, { more: less, less: third }
				];
				q.options = options.map((o, i) => sentence(o.more, o.less, dimension, i % 2 === variant % 2 ? "hodo" : "hou-yori"));
				q.answer = q.options[0];
				q.claims = options.map((o) => [fact(o.more, o.less, dimension)]);
				q.subprompt = "Which comparison follows from both statements?";
				q.band = "Choose the supported sentence.";
			} else if (task.id === "tradeoff") {
				if (scene.structure !== "tradeoff") return null;
				const other = adjectives.get(scene.facts[1].dimension);
				const clauses = [[true, true], [true, false], [false, true], [false, false]];
				q.claims = clauses.map(([first, second]) => [fact(first ? more : less, first ? less : more, dimension), fact(second ? less : more, second ? more : less, other)]);
				q.options = q.claims.map((claims) => claims.map((f, i) => sentence(scene.entities.find((e) => e.ja === f.more), scene.entities.find((e) => e.ja === f.less), adjectives.get(f.dimension), i ? "hodo" : "hou-yori")).join("\n"));
				q.answer = q.options[0];
				q.subprompt = "Which pair of sentences preserves BOTH comparisons?";
				q.band = "Track each quality separately.";
				q.explanation += ` Also: ${relationEnglish(less, more, other)} One item can have more of one quality and less of another.`;
			} else if (task.id === "dialogue") {
				if (!["condition", "change", "perspective", "tradeoff"].includes(scene.structure)) return null;
				const ordered = shuffle([more, less], rng);
				q.prompt += `\n\nA：${scope === "default" ? "" : scope + "についてですが、"}${ordered[0].ja}と${ordered[1].ja}と、どちらが${dimension.adj}ですか。\nB：＿＿＿＿`;
				q.subprompt = "Choose B's reply using the relevant information above.";
				q.band = "Answer this comparison question.";
				q.options = [`${hou(more)}が${ending(dimension)}。`, `${hou(less)}が${ending(dimension)}。`, `どちらも同じくらい${ending(dimension)}。`, "この情報だけでは分かりません。"];
				q.answer = q.options[0];
			} else return null;
			if (!q.answer) return null;
			q.english = scene.contextEn;
			if (task.id === "production") q.english = `${scene.presentation.introEn}\n${relationEnglish(more, less, dimension)}`;
			if (task.id === "three-forms") q.english = relationEnglish(more, less, dimension);
			if (task.id === "particles") q.english = `${relationEnglish(more, less, dimension)} For that reason, I will choose ${more.en}.`;
			if (task.id === "repair") q.english += ` Written sentence (to correct): ${relationEnglish(less, more, dimension)}`;
			q.meta.id = `${scene.sceneKey}:${task.id}:${variant % 6}`;
			return q;
		}

		function buildBank() {
			const scenes = [];
			for (let i = 0; i < 8; i++) {
				for (const domain of domains) {
					for (const structure of ["chain", "tradeoff", "condition", "change", "perspective", "evidence"]) {
						const scene = makeScene(domain, structure, i);
						if (scene) scenes.push(scene);
					}
				}
			}
			scenes.push(...actionScenes());
			const questions = [];
			const seen = new Set();
			for (const [index, scene] of shuffle(scenes, rng).entries()) {
				for (const task of tasks) {
					if (scene.structure === "evidence" && task.id !== "meaning") continue;
					const question = buildQuestion(scene, task, index);
					if (!question || seen.has(question.meta.id)) continue;
					seen.add(question.meta.id);
					questions.push(question);
				}
			}
			return questions;
		}

		function grade(question, values) {
			if (question.mode === "choice") return { correct: values === question.answer, parts: [] };
			const input = Array.isArray(values) ? values : [values];
			const parts = question.fields.map((field, i) => field.accepted.some((answer) => normalize(answer) === normalize(input[i])));
			return { correct: input.length === question.fields.length && parts.every(Boolean), parts };
		}
		return { buildBank, grade, normalize, lexicon: { nouns: [...nouns.values()], adjectives: [...adjectives.values()] } };
	}

	function selectQueue(bank, count = 25, { seed = Date.now(), recent = [] } = {}) {
		const rng = rngFromSeed(seed);
		const candidates = shuffle(bank.filter((q) => q.meta?.engine === version), rng);
		const sceneKeys = new Set();
		const families = new Set();
		const recentKeys = new Set(recent);
		const usage = { task: new Map(), structure: new Map(), domain: new Map(), adjective: new Map(), vocabulary: new Map(), answer: new Map() };
		const queue = [];
		const bump = (map, key) => map.set(key, (map.get(key) || 0) + 1);
		const targetCount = Math.min(count, candidates.length);
		const quotas = new Map(tasks.map((task) => [task.id, Math.max(1, Math.ceil(task.count * targetCount / 25))]));
		while (queue.length < targetCount) {
			const last = queue.at(-1);
			let best, bestScore = Infinity;
			for (const q of candidates) {
				const m = q.meta;
				if (sceneKeys.has(m.sceneKey) || families.has(m.familyKey)) continue;
				const taskUse = usage.task.get(m.task) || 0;
				let score = taskUse / quotas.get(m.task) * 100;
				if (taskUse >= quotas.get(m.task)) score += 1000;
				if (last?.meta.task === m.task) score += 400;
				if (last?.meta.structure === m.structure) score += 120;
				if (last?.meta.domain === m.domain) score += 100;
				if (recentKeys.has(m.sceneKey) || recentKeys.has(m.familyKey)) score += 180;
				score += (usage.structure.get(m.structure) || 0) * 18 + (usage.domain.get(m.domain) || 0) * 22 + (usage.adjective.get(m.adjective) || 0) * 9;
				score += m.vocabulary.reduce((sum, word) => sum + (usage.vocabulary.get(word) || 0) * 5, 0);
				if (q.fields && q.fields.every((f) => !f.multiline)) score += (usage.answer.get(q.answer) || 0) * 25;
				if (score < bestScore) { best = q; bestScore = score; }
			}
			if (!best) break;
			queue.push({ ...best, options: best.options ? [...best.options] : undefined });
			sceneKeys.add(best.meta.sceneKey);
			families.add(best.meta.familyKey);
			for (const key of ["task", "structure", "domain", "adjective"]) bump(usage[key], best.meta[key]);
			for (const word of best.meta.vocabulary) bump(usage.vocabulary, word);
			bump(usage.answer, best.answer);
		}
		const positions = [0, 0, 0, 0];
		let lastPosition = -1, run = 0;
		for (const q of queue.filter((item) => item.mode === "choice")) {
			const allowed = shuffle([0, 1, 2, 3], rng).filter((i) => run < 2 || i !== lastPosition);
			const position = allowed.sort((a, b) => positions[a] - positions[b])[0];
			const wrong = shuffle(q.options.filter((o) => o !== q.answer), rng);
			wrong.splice(position, 0, q.answer);
			q.options = wrong;
			positions[position]++;
			run = lastPosition === position ? run + 1 : 1;
			lastPosition = position;
		}
		return queue;
	}

	return { version, create, selectQueue, compare, sentence, sentenceAnswers, tasks, domains, readings, extraNouns, extraAdjectives };
});
