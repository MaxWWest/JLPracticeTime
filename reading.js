(() => {
	const $ = (selector) => document.querySelector(selector);
	const els = {
		setup: $("#rh-setup"), status: $("#rh-status"), session: $("#rh-session"), home: $("#rh-home"),
		correct: $("#rh-correct"), progress: $("#rh-progress"), hero: $("#rh-hero"), band: $("#rh-band"), body: $("#rh-body"),
		complete: $("#rh-complete"), title: $("#rh-complete-title"), result: $("#rh-result"), missed: $("#rh-missed"),
		again: $("#rh-again"), menu: $("#rh-menu"),
	};

	/* ---------- Mode 1: grammar stacking ---------- */
	const transforms = {
		a: { form: "〜た", name: "Past tense", cue: "completed or happened in the past" },
		b: { form: "〜ない", name: "Negative", cue: "does not do / is not" },
		c: { form: "〜たい", name: "Volition (want to)", cue: "wants to do the action" },
		d: { form: "〜かもしれない", name: "Inference", cue: "maybe / might be true" },
		e: { form: "〜てくれる", name: "Benefactive (granting a favor)", cue: "someone does it as a favor for the speaker side" },
		f: { form: "〜ておく", name: "Readiness", cue: "does it in advance / leaves it ready" },
		g: { form: "〜てください", name: "Request", cue: "asks someone to do it" },
		h: { form: "〜れる・られる", name: "Passive", cue: "is done to / receives the action" },
		i: { form: "可能動詞", name: "Possibility", cue: "can do / is able to do" },
		j: { form: "〜く／になる", name: "Change", cue: "becomes that way" },
		k: { form: "〜ので", name: "Cause / reason", cue: "because / since" },
		l: { form: "〜てもらう", name: "Benefactive (receiving a favor)", cue: "receives the action as a favor" },
		m: { form: "〜ないで", name: "Attendant circumstances (without doing)", cue: "without doing the action" },
	};
	const letters = Object.keys(transforms);
	const exclusiveGroups = [["e", "l"], ["h", "i"]];

	function verbForms(state) {
		const { text, type } = state;
		const prefixed = (prefix, forms) => Object.fromEntries(Object.entries(forms).map(([key, value]) => [key, prefix + value]));
		if (type === "suru") return prefixed(text.slice(0, -2), buildVerbForms({ kanji: "する", reading: "する" }));
		if (type === "kuru") return prefixed(text.slice(0, -2), buildVerbForms({ kanji: "くる", reading: "くる", posCodes: ["vk"] }));
		return buildVerbForms({ kanji: text, reading: text, posCodes: [type === "ichidan" ? "v1" : "v5r"] });
	}

	const adjectiveStem = (text) => (text === "いい" ? "よ" : text.slice(0, -1));
	const verb = (text, type) => ({ kind: "V", text, type });
	const adjective = (text) => ({ kind: "A", text });
	const final = (text, sub) => ({ kind: "F", text, sub });

	function applyTransform(state, letter, stepIndex, usedLetters) {
		if (state.kind === "V") {
			const forms = verbForms(state);
			const simpleVerb = state.type === "godan" || state.type === "suru";
			switch (letter) {
				case "a": return final(forms.past, "past");
				case "b": return adjective(forms.negative);
				case "c": return adjective(`${forms.masuStem}たい`);
				case "d": return final(`${state.text}かもしれない`, "d");
				case "e": return verb(`${forms.te}くれる`, "ichidan");
				case "f": return verb(`${forms.te}おく`, "godan");
				case "g": return final(`${forms.te}ください`, "end");
				// Ichidan passive and potential look identical, so they are only used on unambiguous verbs.
				case "h": return stepIndex === 0 && simpleVerb ? verb(forms.passive, "ichidan") : null;
				case "i": return simpleVerb && (stepIndex === 0 || usedLetters.at(-1) === "l") ? verb(forms.potential, "ichidan") : null;
				case "k": return final(`${state.text}ので`, "end");
				case "l": return verb(`${forms.te}もらう`, "godan");
				case "m": return final(`${forms.negative}で`, "end");
				default: return null;
			}
		}
		if (state.kind === "A") {
			const stem = adjectiveStem(state.text);
			switch (letter) {
				case "a": return final(`${stem}かった`, "past");
				case "b": return adjective(`${stem}くない`);
				case "d": return final(`${state.text}かもしれない`, "d");
				case "j": return verb(`${stem}くなる`, "godan");
				case "k": return final(`${state.text}ので`, "end");
				default: return null;
			}
		}
		if (state.sub === "past" && letter === "d") return final(`${state.text}かもしれない`, "d");
		if ((state.sub === "past" || state.sub === "d") && letter === "k") return final(`${state.text}ので`, "end");
		return null;
	}

	function generateChain(base, steps) {
		const search = (state, used, trail) => {
			if (trail.length === steps) return trail;
			for (const letter of shuffled(letters)) {
				if (used.includes(letter)) continue;
				if (exclusiveGroups.some((group) => group.includes(letter) && group.some((other) => used.includes(other)))) continue;
				const next = applyTransform(state, letter, used.length, used);
				if (!next) continue;
				const result = search(next, [...used, letter], [...trail, { letter, state: next }]);
				if (result) return result;
			}
			return null;
		};
		return search(base, [], []);
	}

	// Swap the kana stem for the word's kanji so the stacked form reads naturally.
	function kanjiForm(kana, word) {
		const reading = String(word.reading || "").replace(/[\s　]/g, "");
		const kanji = String(word.kanji || "");
		if (!kanji || kanji === reading) return kana;
		let suffix = 0;
		while (suffix < kanji.length && suffix < reading.length && kanji[kanji.length - 1 - suffix] === reading[reading.length - 1 - suffix]) suffix += 1;
		const readingPrefix = reading.slice(0, reading.length - suffix);
		if (!suffix || !readingPrefix || !kana.startsWith(readingPrefix)) return kana;
		return kanji.slice(0, kanji.length - suffix) + kana.slice(readingPrefix.length);
	}

	function baseVerbLabel(word) {
		const type = getVerbType(word);
		let text = String(word.kanji || word.reading || word.baseText || "").replace(/[\s　]/g, "");
		if (type === "suru" && text && !text.endsWith("する")) text += "する";
		if (type === "kuru" && text && !text.endsWith("くる")) text = text.endsWith("く") ? `${text.slice(0, -1)}くる` : `${text}くる`;
		return text;
	}

	function stackStepsHtml(chain, word) {
		return chain.map((step, index) => `<li><span class="rh-step-num">${"①②③④"[index]}</span><span lang="ja">${escapeHtml(kanjiForm(step.state.text, word))}</span><b>${step.letter}</b><small>${transforms[step.letter].name}: ${transforms[step.letter].cue}</small></li>`).join("");
	}

	function stackBaseChoices(answer, pool) {
		const distractors = shuffled(pool.map(baseVerbLabel).filter((choice) => choice && choice !== answer));
		return shuffled(Array.from(new Set([answer, ...distractors])).slice(0, 4));
	}

	function stackMeaningChoices(answerLetter) {
		const answer = transforms[answerLetter].cue;
		const distractors = shuffled(letters.filter((letter) => letter !== answerLetter).map((letter) => transforms[letter].cue));
		return shuffled(Array.from(new Set([answer, ...distractors])).slice(0, 4));
	}

	function chooseStackTask(chain) {
		const focus = $("#rh-stack-focus").value || "mixed";
		if (focus === "order" || focus === "base") return { type: focus };
		if (focus === "meaning") {
			const targetIndex = chain.length > 1 && Math.random() < .45 ? Math.floor(Math.random() * chain.length) : chain.length - 1;
			return { type: "meaning", targetIndex };
		}
		const mixed = ["order", "base", "meaning"];
		const type = mixed[Math.floor(Math.random() * mixed.length)];
		if (type !== "meaning") return { type };
		const targetIndex = chain.length > 1 && Math.random() < .45 ? Math.floor(Math.random() * chain.length) : chain.length - 1;
		return { type, targetIndex };
	}

	const breakRoleChoices = [
		"Reason / cause",
		"Time / sequence",
		"Condition",
		"Contrast / concession",
		"Purpose / goal",
		"Simultaneous action",
		"Without doing",
		"Listing / adding information",
		"Main-clause setup"
	];

	function sentenceBreakChunks(item) {
		const positions = [...item.breaks].sort((a, b) => a - b);
		const chunks = [];
		let start = 0;
		for (const end of positions) {
			chunks.push({ text: item.text.slice(start, end), start, end });
			start = end;
		}
		chunks.push({ text: item.text.slice(start), start, end: item.text.length });
		return chunks;
	}

	function classifyBreakRole(item, position) {
		const chunk = item.text.slice(0, position).split(/[。！？]/).at(-1) || item.text.slice(0, position);
		const trimmed = chunk.replace(/[、\s　]+$/g, "");
		if (/(ために|ように)$/.test(trimmed)) return { label: "Purpose / goal", explanation: "This chunk tells the purpose or intended outcome for the following action." };
		if (/(ので|から|ため|せいで|なくて|すぎて)$/.test(trimmed)) return { label: "Reason / cause", explanation: "This chunk explains why the following event or choice happens." };
		if (/(たら|なら|れば|と)$/.test(trimmed)) return { label: "Condition", explanation: "This chunk sets the condition for the following result or request." };
		if (/(けれども|けれど|けど|が|のに|ても|でも)$/.test(trimmed)) return { label: "Contrast / concession", explanation: "This chunk sets up a contrast, exception, or 'even though' relationship." };
		if (/(前に|あとで|てから|間に|間|とき|うちに|まで|までに)$/.test(trimmed)) return { label: "Time / sequence", explanation: "This chunk tells when something happens or in what order events happen." };
		if (/ながら$/.test(trimmed)) return { label: "Simultaneous action", explanation: "This chunk gives an action happening at the same time as the main action." };
		if (/(ないで|ずに)$/.test(trimmed)) return { label: "Without doing", explanation: "This chunk says the next action happens without doing this action." };
		if (/し$/.test(trimmed)) return { label: "Listing / adding information", explanation: "This chunk adds one reason or fact in a list." };
		if (/て$/.test(trimmed)) return { label: "Time / sequence", explanation: "This te-form chunk links actions in sequence or gives light cause/background." };
		return { label: "Main-clause setup", explanation: "This chunk prepares background information before the main clause." };
	}

	function breakRoleOptions(answer) {
		const distractors = shuffled(breakRoleChoices.filter((choice) => choice !== answer));
		return shuffled([answer, ...distractors.slice(0, 3)]);
	}

	function renderBreakGuideSentence(item, targetPosition = null) {
		const chunks = sentenceBreakChunks(item);
		return chunks.map((chunk, index) => {
			const isTarget = chunk.end === targetPosition;
			const slash = index < chunks.length - 1 ? `<span class="rh-answer-mark${isTarget ? " is-target" : ""}">/</span>` : "";
			return `${escapeHtml(chunk.text)}${slash}`;
		}).join("");
	}

	function chooseBreakTask() {
		const focus = $("#rh-break-focus").value || "mixed";
		if (focus === "mark" || focus === "main" || focus === "role") return { type: focus };
		const types = ["mark", "main", "role"];
		return { type: types[Math.floor(Math.random() * types.length)] };
	}

	const quoteVerbChoices = [
		"said / told",
		"thought / believed",
		"asked",
		"wrote / was written",
		"explained / taught / informed",
		"felt",
		"announced / reported"
	];

	const quoteForceChoices = [
		"Greeting / thanks",
		"Request / instruction",
		"Rule / prohibition",
		"Question / permission request",
		"Plan / intention",
		"Belief / guess",
		"Feeling / evaluation",
		"Information / announcement"
	];

	function quoteContent(item) {
		return item.text.slice(item.start, item.end);
	}

	function quoteReporter(item) {
		const before = item.text.slice(0, item.start);
		const patterns = [
			[/ニュースでは$/, "ニュース"],
			[/駅のアナウンスで$/, "駅のアナウンス"],
			[/メールには$/, "メール"],
			[/看板には$/, "看板"],
			[/店の紙には$/, "店の紙"],
			[/(.+?)は$/, 1],
			[/(.+?)が$/, 1],
			[/(.+?)では$/, 1],
			[/(.+?)で$/, 1]
		];
		for (const [pattern, capture] of patterns) {
			const match = before.match(pattern);
			if (!match) continue;
			return capture === 1 ? match[1].replace(/[、。]$/g, "") : capture;
		}
		return before.replace(/[、。にではがをと\s　]+$/g, "") || "the writer";
	}

	function quoteVerbInfo(item) {
		const after = item.text.slice(item.end);
		if (/と聞/.test(after)) return { label: "asked", explanation: "聞きました here reports a question or asks whether something is okay." };
		if (/と書/.test(after)) return { label: "wrote / was written", explanation: "書きました/書いてあります means the quoted content is written information." };
		if (/と思|と考|と信じ/.test(after)) return { label: "thought / believed", explanation: "思う, 考える, and 信じる report thoughts or beliefs, not spoken words." };
		if (/と感じ/.test(after)) return { label: "felt", explanation: "感じています reports the speaker's feeling or impression." };
		if (/と説明|と教え/.test(after)) return { label: "explained / taught / informed", explanation: "説明する/教える present the quote as information being explained or taught." };
		if (/アナウンス|ニュース|と言っていました/.test(item.text) && /(アナウンス|ニュース)/.test(item.text)) return { label: "announced / reported", explanation: "The source is an announcement/news report, so the quote is public information." };
		return { label: "said / told", explanation: "言う reports spoken content or what someone told another person." };
	}

	function quoteForceInfo(item) {
		const content = quoteContent(item);
		if (/(ありがとう|おはよう)/.test(content)) return { label: "Greeting / thanks", explanation: "The quoted words are a greeting or expression of thanks." };
		if (/(てはいけません|ないでください|止めないでください|とらないでください)/.test(content)) return { label: "Rule / prohibition", explanation: "The quote tells someone not to do something." };
		if (/(ください|なさい|聞いて|来て|書いて|持って|入れて|手を上げて|出してください|注文してください|待ちください|着なさい)/.test(content)) return { label: "Request / instruction", explanation: "The quote asks or tells someone to do something." };
		if (/(てもいい|迎えに行こうか|かどうか|ですか|ますか|か$)/.test(content)) return { label: "Question / permission request", explanation: "The quote asks a question or checks permission/uncertainty." };
		if (/(たい|つもり|行こう|帰ります|休みます|連絡する|遅れる|旅行したい|行けない)/.test(content)) return { label: "Plan / intention", explanation: "The quoted content describes someone's plan, intention, or future action." };
		if (/(かもしれない|だろう|にちがいない|はず|でしょう|成功する|役立ちそう|そうだ)/.test(content)) return { label: "Belief / guess", explanation: "The quote presents a guess, belief, expectation, or appearance-based judgment." };
		if (/(難しい|おもしろかった|心配|大丈夫|むり|よかった|便利になった|ほしい)/.test(content)) return { label: "Feeling / evaluation", explanation: "The quote expresses a feeling, desire, judgment, or evaluation." };
		return { label: "Information / announcement", explanation: "The quote gives factual information, a schedule, or a notice." };
	}

	function quoteChoiceOptions(answer, allChoices) {
		const distractors = shuffled(allChoices.filter((choice) => choice !== answer));
		return shuffled([answer, ...distractors.slice(0, 3)]);
	}

	function quoteReporterOptions(answer, bank) {
		const distractors = shuffled(bank.map(quoteReporter).filter((choice) => choice && choice !== answer));
		return shuffled(Array.from(new Set([answer, ...distractors])).slice(0, 4));
	}

	function renderQuoteGuideSentence(item, target = false) {
		return renderAnswerSentence(item, "quotes", target ? { ...item, targetQuote: true } : item);
	}

	function chooseQuoteTask() {
		const focus = $("#rh-quote-focus").value || "mixed";
		if (focus === "mark" || focus === "source" || focus === "verb" || focus === "force") return { type: focus };
		const types = ["mark", "source", "verb", "force"];
		return { type: types[Math.floor(Math.random() * types.length)] };
	}

	/* ---------- Sentence banks ---------- */
	// "/" marks a break; [ ] marks the quoted part.
	const breakBank = [
		["雨なので/今日はうちで映画を見ます。", "Because it's raining, I'll watch a movie at home today."],
		["試験に合格するために/毎日夜遅くまで勉強しています。", "To pass the exam, I study late every night."],
		["駅に着いたら/すぐに電話してください。", "Please call me as soon as you arrive at the station."],
		["薬を飲んだけれども/熱は下がりませんでした。", "I took medicine, but my fever didn't go down."],
		["出かける前に/窓を全部閉めてください。", "Please close all the windows before you go out."],
		["晩ごはんを食べてから/ゆっくりおふろに入ります。", "After dinner I'll take a relaxed bath."],
		["彼女はピアノもじょうずだし/絵もうまいです。", "She's good at piano, and she's good at drawing too."],
		["傘を持たないで/出かけてしまいました。", "I went out without taking an umbrella."],
		["急いでいたので/タクシーに乗りました。", "I was in a hurry, so I took a taxi."],
		["料理をしている間に/私は洗たくものをたたみました。", "While she was cooking, I folded the laundry."],
		["忘れ物をしないように/かばんの中をもう一度確認しました。", "I checked inside my bag again so as not to forget anything."],
		["春になると/公園にたくさん人が来ます。", "When spring comes, many people visit the park."],
		["このくつは安ければ/色ちがいも買いたいです。", "If these shoes are cheap, I'd like to buy other colors too."],
		["明日晴れたら/海へドライブに行きませんか。", "If it's sunny tomorrow, shall we go for a drive to the sea?"],
		["毎朝早く起きて/散歩をしてから/会社へ行きます。", "I get up early every morning, take a walk, and then go to work."],
		["先生の説明を聞いても/よくわからなかったので/友だちに教えてもらいました。", "Even after hearing the teacher's explanation I didn't understand, so my friend taught me."],
		["学生のとき/毎日アルバイトで忙しくて/ゆっくり本を読めませんでした。", "When I was a student I was busy with part-time work every day and couldn't read leisurely."],
		["日本に来てから/いろいろな人に会って/たくさん友だちができました。", "Since coming to Japan I've met many people and made lots of friends."],
		["暑かったので/窓を開けて/寝ました。", "It was hot, so I opened the window and slept."],
		["疲れているのに/夜おそくまで働きました。", "Even though I was tired, I worked until late at night."],
		["高いけれども/品質がいいので/買うことにしました。", "It's expensive, but the quality is good, so I decided to buy it."],
		["日本語を話すとき/ゆっくり話してください。", "When you speak Japanese, please speak slowly."],
		["眠くなったら/コーヒーを飲んでください。", "If you get sleepy, please drink some coffee."],
		["夏休みの間/ずっとアルバイトをしていました。", "I worked part-time the whole summer vacation."],
		["本を読んでいる間に/ねてしまいました。", "I fell asleep while I was reading."],
		["彼は何も言わないで/部屋を出て行きました。", "He left the room without saying anything."],
		["説明書を読めば/使い方がわかります。", "If you read the manual, you'll understand how to use it."],
		["明日雨なら/試合は中止です。", "If it rains tomorrow, the game is cancelled."],
		["手を洗ってから/食事をしてください。", "Please wash your hands and then eat."],
		["本を買うために/銀行でお金をおろして/本屋に行きました。", "To buy a book, I withdrew money at the bank and went to the bookstore."],
		["道がわからなくて/交番で聞きました。", "I didn't know the way, so I asked at the police box."],
		["眠れなかったから/朝まで映画を見ていました。", "I couldn't sleep, so I watched movies until morning."],
		["友だちにメールを送ったあとで/宿題を始めました。", "After sending my friend an email, I started my homework."],
		["勉強もしたし/運動もしたので/今日はよくねられます。", "I studied and I exercised, so I'll sleep well today."],
		["仕事が終わったら/スーパーで牛乳を買って/帰ります。", "After work ends, I will buy milk at the supermarket and go home."],
		["日本語は難しいけれど/毎日少しずつ勉強すれば/必ず上手になります。", "Japanese is difficult, but if you study little by little every day, you will definitely improve."],
		["電車が遅れたため/会議に間に合いませんでした。", "Because the train was delayed, I did not make it to the meeting on time."],
		["友だちを待っている間/駅のカフェで本を読んでいました。", "While I was waiting for my friend, I was reading at the station cafe."],
		["安くても/すぐ壊れるなら/買わないほうがいいです。", "Even if it is cheap, if it breaks quickly, it is better not to buy it."],
		["部屋が暗かったので/電気をつけて/窓を閉めました。", "The room was dark, so I turned on the light and closed the window."],
		["先生に質問したところ/丁寧に説明してくださいました。", "When I asked the teacher a question, they explained it carefully."],
		["パスポートを忘れないように/出かける前に/かばんに入れました。", "So I would not forget my passport, I put it in my bag before leaving."],
		["朝ご飯を食べずに/学校へ行ったので/お腹がすきました。", "I went to school without eating breakfast, so I got hungry."],
		["母が帰ってくるまで/弟とゲームをして待ちます。", "I will play games with my little brother and wait until my mother comes home."],
		["バスが来るまでに/コンビニで飲み物を買います。", "I will buy a drink at the convenience store by the time the bus comes."],
		["道を間違えたせいで/約束の時間に遅れました。", "Because I took the wrong road, I was late for the appointment."],
		["雨が降りそうなので/洗濯物を中に入れておきます。", "It looks like rain, so I will bring the laundry inside in advance."],
		["京都へ行ったことがあるから/道を少し知っています。", "Because I have been to Kyoto, I know the roads a little."],
		["授業中に眠くならないように/昨日は早く寝ました。", "I slept early yesterday so I would not get sleepy during class."],
		["この薬を飲めば/頭の痛みがよくなるそうです。", "I hear that if you take this medicine, your headache will improve."],
		["財布をなくしたと思って/かばんの中を全部調べました。", "Thinking I had lost my wallet, I checked everything inside my bag."],
		["静かな所で勉強したいので/図書館に行くことにしました。", "I want to study somewhere quiet, so I decided to go to the library."],
		["田中さんは忙しいのに/私の宿題を見てくれました。", "Even though Mr. Tanaka was busy, he looked over my homework for me."],
		["宿題が多くて/全部終わらなかったので/先生に謝りました。", "There was a lot of homework and I could not finish it all, so I apologized to the teacher."],
		["駅前の店は便利ですが/値段が少し高いです。", "The shop in front of the station is convenient, but the prices are a little high."],
		["風邪をひいているなら/無理をしないで/早く帰ってください。", "If you have a cold, please do not push yourself and go home early."],
		["この漢字は読めても/意味がわからないことがあります。", "Even if I can read this kanji, sometimes I do not know the meaning."],
		["旅行に行く前に/ホテルの場所を調べておきました。", "Before going on the trip, I looked up the hotel location in advance."],
		["コンサートが始まるまで/ロビーで友だちと話していました。", "Until the concert started, I was talking with my friend in the lobby."],
		["自転車で行けば/十五分ぐらいで着きます。", "If you go by bicycle, you will arrive in about fifteen minutes."],
		["暑すぎて/夜中に何度も目が覚めました。", "It was too hot, so I woke up many times during the night."],
		["先生が来る前に/黒板をきれいにしておきましょう。", "Before the teacher comes, let's clean the blackboard."],
		["このアプリを使うと/新しい単語を簡単に覚えられます。", "If you use this app, you can easily memorize new words."],
		["時間がなかったため/朝ご飯を食べないで家を出ました。", "Because I did not have time, I left home without eating breakfast."],
		["山田さんに聞いたら/駅までの道を教えてくれました。", "When I asked Mr. Yamada, he told me the way to the station."],
		["料理を作りながら/弟の宿題を見ていました。", "While cooking, I was checking my little brother's homework."],
		["予約していなかったので/レストランに入れませんでした。", "Because we had not made a reservation, we could not enter the restaurant."],
		["荷物が重ければ/駅のロッカーに入れてください。", "If your bags are heavy, please put them in a station locker."],
		["いい席を取りたいなら/早めに会場へ行ったほうがいいです。", "If you want to get good seats, you should go to the venue early."],
		["日本語でメールを書くとき/敬語を間違えないように気をつけます。", "When writing email in Japanese, I take care not to make mistakes with polite language."],
		["アルバイトが終わってから/友だちと映画を見に行きました。", "After my part-time job ended, I went to see a movie with a friend."],
		["使い方がわからなかったら/この番号に電話してください。", "If you do not know how to use it, please call this number."],
		["窓を開けたまま/出かけてしまいました。", "I accidentally went out with the window left open."],
		["毎日練習しているうちに/少しずつ話せるようになりました。", "While practicing every day, little by little I became able to speak."],
	].map(([marked, en]) => ({ ...parseMarked(marked, "/"), en }));

	const quoteBank = [
		["友だちは私に[おはよう]と言った。", "My friend said \"good morning\" to me."],
		["課長は[あしたは早く会社に来てほしい]と田中さんに言いました。", "The section chief told Mr. Tanaka that he wants him to come to the office early tomorrow."],
		["卒業式では[リサさんがスピーチをするだろう]と思っていた。", "I thought Lisa would give the speech at the graduation ceremony."],
		["母は[気をつけて行ってきなさい]と言って、私を送り出した。", "My mother said \"take care\" and sent me off."],
		["私は[この店のラーメンはおいしいにちがいない]と思った。", "I thought the ramen at this shop must be delicious."],
		["先生は学生たちに[来週テストをします]と言いました。", "The teacher told the students there will be a test next week."],
		["田中さんは電話で[あしたは休みます]と言いました。", "Mr. Tanaka said by phone that he'll be off tomorrow."],
		["弟は[ぼくも行きたい]と言ってなき出した。", "My little brother said he wanted to go too and started crying."],
		["私は[この仕事は私にはむりだ]と考えています。", "I think this job is impossible for me."],
		["医者は私に[しばらく運動をしてはいけません]と言いました。", "The doctor told me not to exercise for a while."],
		["山田さんは[来月日本に帰ります]と私に教えてくれました。", "Mr. Yamada told me he's returning to Japan next month."],
		["私は[ひとりでも大丈夫]と思っていたが、友だちが手伝ってくれた。", "I thought I'd be fine alone, but my friend helped me."],
		["看板には[ここで写真をとらないでください]と書いてありました。", "The sign said not to take photos here."],
		["昨日、友だちが[今度の日曜日、いっしょに映画を見に行こう]と言いました。", "Yesterday my friend said \"let's go see a movie together this Sunday.\""],
		["私は[明日は雨がふるかもしれない]と思って、かさを持って出かけた。", "I thought it might rain tomorrow, so I went out with an umbrella."],
		["父は[大学に行くなら、アルバイトをしなさい]と言いました。", "My father said, \"If you go to university, work part-time.\""],
		["店員さんは[少々お待ちください]と言って、奥へ行きました。", "The clerk said \"please wait a moment\" and went to the back."],
		["みんなは[この計画は成功する]と信じています。", "Everyone believes this plan will succeed."],
		["先生が[宿題は金曜日までに出してください]と言ったのを忘れていました。", "I forgot that the teacher said to hand in the homework by Friday."],
		["彼女は[ありがとう]と小さな声で言いました。", "She said \"thank you\" in a small voice."],
		["私は[明日は早く起きなければならない]と思いながらねました。", "I went to bed thinking I have to get up early tomorrow."],
		["先輩は[わからないことがあったら、いつでも聞いて]と言ってくれました。", "My senior told me to ask anytime if there's something I don't understand."],
		["父は[駅まで迎えに行こうか]と電話で言った。", "My father said on the phone, \"Shall I pick you up at the station?\""],
		["友だちは[このケーキを半分食べてもいい]と聞きました。", "My friend asked, \"May I eat half of this cake?\""],
		["先生は[漢字の宿題は明日までです]と黒板に書きました。", "The teacher wrote on the board that the kanji homework is due tomorrow."],
		["私は[この道をまっすぐ行けば駅に着くはずだ]と思いました。", "I thought that if I went straight on this road, I should arrive at the station."],
		["メールには[会議は三時から四時に変わりました]と書いてありました。", "The email said the meeting changed from three o'clock to four o'clock."],
		["店の人は[この券は今日だけ使えます]と言いました。", "The shop worker said this ticket can only be used today."],
		["祖母は[寒いからコートを着なさい]と私に言いました。", "My grandmother told me to wear a coat because it was cold."],
		["兄は[試験が終わったら旅行したい]と言っています。", "My older brother says he wants to travel after exams are over."],
		["私は[鍵をかけたかどうか心配だ]と思いながら駅へ行きました。", "I went to the station while thinking I was worried whether I locked the door."],
		["看板には[自転車をここに止めないでください]と書いてあります。", "The sign says not to park bicycles here."],
		["友だちは[駅に着いたら連絡する]と言っていました。", "My friend said they would contact me when they arrived at the station."],
		["医者は[薬を飲まなくてもいいです]と言いました。", "The doctor said I do not have to take medicine."],
		["私は[もう少し早く出ればよかった]と思いました。", "I thought I should have left a little earlier."],
		["母は[冷蔵庫にカレーがある]と言って出かけました。", "My mother said there was curry in the refrigerator and went out."],
		["子どもは[あの赤い風船がほしい]と言いました。", "The child said they wanted that red balloon."],
		["先生は[わからない人は手を上げてください]と言いました。", "The teacher said that people who do not understand should raise their hands."],
		["山田さんは[今日は残業しなければならない]と言っていました。", "Mr. Yamada said he has to work overtime today."],
		["私は[この本はN4の勉強に役立ちそうだ]と思いました。", "I thought this book looked useful for N4 study."],
		["店員は[サイズが合わなければ交換できます]と説明しました。", "The clerk explained that if the size does not fit, it can be exchanged."],
		["友だちは[道が混んでいるから少し遅れる]とメールしました。", "My friend emailed that they would be a little late because the roads were crowded."],
		["母は[雨が降りそうだから洗濯物を入れて]と言いました。", "My mother said to bring in the laundry because it looked like rain."],
		["駅のアナウンスで[次の電車は十番線から出ます]と言っていました。", "The station announcement said the next train leaves from platform ten."],
		["私は[日本語で電話するのはまだ難しい]と感じています。", "I feel that speaking on the phone in Japanese is still difficult."],
		["友だちは[この映画は思ったよりおもしろかった]と言いました。", "My friend said this movie was more interesting than expected."],
		["父は[新しい仕事に慣れるまで時間がかかる]と言っていました。", "My father said it takes time to get used to a new job."],
		["先生は[作文は短くてもいいです]と言いました。", "The teacher said the composition can be short."],
		["私は[財布を家に忘れたかもしれない]と思って、かばんを調べました。", "Thinking I might have forgotten my wallet at home, I checked my bag."],
		["受付の人は[ここに名前と電話番号を書いてください]と言いました。", "The receptionist said to write my name and phone number here."],
		["妹は[一人で電車に乗れる]と言っています。", "My little sister says she can ride the train by herself."],
		["ニュースでは[明日の朝は雪になるでしょう]と言っていました。", "The news said it will probably snow tomorrow morning."],
		["先輩は[失敗してももう一度やってみればいい]と言ってくれました。", "My senior told me that even if I fail, I can try again."],
		["私は[この町は前より便利になった]と思います。", "I think this town has become more convenient than before."],
		["店の紙には[お弁当は午後二時までに注文してください]と書いてありました。", "The shop paper said to order boxed lunches by two p.m."],
		["友だちは[忙しくてパーティーには行けない]と言いました。", "My friend said they are busy and cannot go to the party."],
	].map(([marked, en]) => ({ ...parseMarked(marked, "[]"), en }));

	const passageSources = [
		{
			title: "Library Notice",
			text: "市立図書館からのお知らせです。二階の読書室は、エアコン工事のため、来週の月曜日から水曜日まで使えません。本を借りたり返したりする一階のカウンターは、いつもどおり開いています。静かに勉強したい人は、となりの公民館の小さい部屋を使ってください。",
			en: "The second-floor reading room is closed for air-conditioner work, but the first-floor counter remains open.",
			questions: [
				{ prompt: "Why can people not use the second-floor reading room?", answer: "Because air-conditioner work is happening.", options: ["Because air-conditioner work is happening.", "Because the library is moving.", "Because all books are being counted.", "Because the first floor is closed."], explanation: "工事のため marks the reason: air-conditioner construction/repairs." },
				{ prompt: "What can visitors still do at the library?", answer: "Borrow and return books at the first-floor counter.", options: ["Borrow and return books at the first-floor counter.", "Study in the second-floor reading room.", "Use every room in the building.", "Enter only on Thursday."], explanation: "一階のカウンターはいつもどおり開いています." }
			]
		},
		{
			title: "Message From A Friend",
			text: "マックスさん、今日は先に映画館へ行ってください。私はアルバイトが五時までなので、少し遅れるかもしれません。チケットは私が予約しておきました。映画が始まる前に、入口の前で会いましょう。",
			en: "The friend may be late because of work, but already reserved the tickets.",
			questions: [
				{ prompt: "Why might the friend be late?", answer: "Because their part-time job ends at five.", options: ["Because their part-time job ends at five.", "Because they forgot the tickets.", "Because the movie starts late.", "Because they are buying food."], explanation: "アルバイトが五時までなので gives the reason." },
				{ prompt: "What has the friend already done?", answer: "Reserved the tickets.", options: ["Reserved the tickets.", "Watched the movie.", "Bought dinner.", "Gone home first."], explanation: "予約しておきました means it was reserved in advance." }
			]
		},
		{
			title: "Apartment Rule",
			text: "このアパートでは、夜十時を過ぎたら大きな音を出さないでください。特に洗濯機は音が大きいので、朝七時から夜九時までの間に使ってください。困ったことがあったら、管理人に電話してください。",
			en: "The apartment asks residents to avoid loud noise at night, especially washing machines.",
			questions: [
				{ prompt: "When should residents use the washing machine?", answer: "Between 7 a.m. and 9 p.m.", options: ["Between 7 a.m. and 9 p.m.", "After 10 p.m.", "Only before 7 a.m.", "Whenever there is trouble."], explanation: "朝七時から夜九時までの間に marks the allowed time." },
				{ prompt: "Who should residents contact if there is a problem?", answer: "The manager.", options: ["The manager.", "The post office.", "The neighbor upstairs.", "The washing machine company."], explanation: "管理人に電話してください gives the contact." }
			]
		},
		{
			title: "Class Email",
			text: "明日の日本語クラスは、先生の都合で三十分遅く始まります。十時ではなく、十時半に教室に来てください。宿題は授業の始めに集めますから、忘れないように持ってきてください。",
			en: "Tomorrow's Japanese class starts thirty minutes late, at 10:30.",
			questions: [
				{ prompt: "What time does class start tomorrow?", answer: "10:30.", options: ["10:30.", "10:00.", "9:30.", "Thirty minutes earlier than usual."], explanation: "十時ではなく、十時半 means not 10:00, but 10:30." },
				{ prompt: "When will homework be collected?", answer: "At the beginning of class.", options: ["At the beginning of class.", "After lunch.", "Next week.", "Before students enter the room."], explanation: "授業の始めに集めます gives the timing." }
			]
		},
		{
			title: "Diary",
			text: "昨日、はじめて一人で新幹線に乗った。少し心配だったが、駅の人が親切に教えてくれたので、無事に席まで行けた。窓から富士山が見えて、とてもうれしかった。",
			en: "The writer rode the shinkansen alone for the first time and saw Mt. Fuji.",
			questions: [
				{ prompt: "Why was the writer able to reach their seat safely?", answer: "Because station staff kindly helped.", options: ["Because station staff kindly helped.", "Because a friend bought the ticket.", "Because the train was empty.", "Because they had ridden many times before."], explanation: "駅の人が親切に教えてくれたので gives the reason." },
				{ prompt: "What made the writer happy?", answer: "Seeing Mt. Fuji from the window.", options: ["Seeing Mt. Fuji from the window.", "Getting a cheaper ticket.", "Meeting a teacher.", "Arriving earlier than planned."], explanation: "窓から富士山が見えて、とてもうれしかった." }
			]
		},
		{
			title: "Shop Notice",
			text: "本日は雨の日サービスとして、千円以上買ったお客様に小さいタオルを一枚差し上げます。ただし、数に限りがありますので、なくなったら終わりです。レジでこのお知らせを見たと言ってください。",
			en: "The shop gives a small towel to customers who spend at least 1,000 yen on rainy days while supplies last.",
			questions: [
				{ prompt: "Who can receive a towel?", answer: "Customers who buy 1,000 yen or more.", options: ["Customers who buy 1,000 yen or more.", "Everyone who enters the shop.", "Only people who bring an umbrella.", "Customers who buy exactly one towel."], explanation: "千円以上買ったお客様 means customers who bought 1,000 yen or more." },
				{ prompt: "What must customers say at the register?", answer: "That they saw this notice.", options: ["That they saw this notice.", "That they came yesterday.", "That they do not need a bag.", "That the towel is too small."], explanation: "このお知らせを見たと言ってください." }
			]
		},
		{
			title: "School Trip",
			text: "遠足の日は、学校に八時までに集まってください。バスは八時十五分に出発します。昼ご飯は公園で食べるので、お弁当と飲み物を持ってきてください。雨の場合は、体育館で映画を見ます。",
			en: "Students gather by 8:00, leave at 8:15, and bring lunch unless the rain plan happens.",
			questions: [
				{ prompt: "By when should students gather at school?", answer: "By 8:00.", options: ["By 8:00.", "At 8:15.", "After lunch.", "Only if it rains."], explanation: "八時までに means by 8:00." },
				{ prompt: "What happens if it rains?", answer: "They watch a movie in the gym.", options: ["They watch a movie in the gym.", "They eat lunch in the park.", "They leave by bus earlier.", "They cancel lunch."], explanation: "雨の場合は、体育館で映画を見ます." }
			]
		},
		{
			title: "Lost Item",
			text: "昨日の夕方、駅のベンチに黒いかばんを忘れました。中には日本語の教科書と青いノートが入っています。見つけた人は、駅の事務所まで持ってきてください。お礼をします。",
			en: "Someone lost a black bag on a station bench with textbooks and a blue notebook inside.",
			questions: [
				{ prompt: "Where was the bag forgotten?", answer: "On a station bench.", options: ["On a station bench.", "In a classroom.", "At the library counter.", "Inside a taxi."], explanation: "駅のベンチに黒いかばんを忘れました." },
				{ prompt: "What is inside the bag?", answer: "A Japanese textbook and a blue notebook.", options: ["A Japanese textbook and a blue notebook.", "A wallet and a phone.", "A towel and lunch.", "A ticket and an umbrella."], explanation: "中には日本語の教科書と青いノートが入っています." }
			]
		},
		{
			title: "Recipe Note",
			text: "このスープは、野菜を小さく切ってから、弱い火で二十分ぐらい煮ます。塩は最後に入れてください。最初に入れると、味が濃くなりすぎることがあります。",
			en: "For this soup, simmer chopped vegetables, then add salt at the end.",
			questions: [
				{ prompt: "When should the salt be added?", answer: "At the end.", options: ["At the end.", "Before cutting vegetables.", "At the very beginning.", "After eating."], explanation: "塩は最後に入れてください." },
				{ prompt: "Why should salt not be added first?", answer: "The flavor may become too strong.", options: ["The flavor may become too strong.", "The vegetables will not cook.", "The soup will become cold.", "It will take only five minutes."], explanation: "味が濃くなりすぎることがあります." }
			]
		},
		{
			title: "Work Schedule",
			text: "来週から店の開店時間が変わります。平日は今までどおり十時に開きますが、土曜日と日曜日は九時半に開きます。閉店時間は毎日八時です。",
			en: "The shop opens at 10:00 on weekdays and 9:30 on weekends; closing time stays 8:00 every day.",
			questions: [
				{ prompt: "What changes next week?", answer: "The weekend opening time.", options: ["The weekend opening time.", "The weekday closing time.", "The shop name.", "The location."], explanation: "土曜日と日曜日は九時半に開きます; weekdays stay the same." },
				{ prompt: "When does the shop close?", answer: "8:00 every day.", options: ["8:00 every day.", "9:30 on weekends.", "10:00 on weekdays.", "It is not written."], explanation: "閉店時間は毎日八時です." }
			]
		},
		{
			title: "Club Poster",
			text: "写真クラブでは、新しいメンバーを募集しています。カメラを持っていなくても参加できます。毎週金曜日の放課後に集まって、学校の近くで写真を撮ります。興味がある人は、佐藤先生に聞いてください。",
			en: "The photo club is recruiting and does not require owning a camera.",
			questions: [
				{ prompt: "Can someone join without a camera?", answer: "Yes, they can join.", options: ["Yes, they can join.", "No, a camera is required.", "Only teachers can join.", "Only on Saturdays."], explanation: "カメラを持っていなくても参加できます." },
				{ prompt: "Who should interested people ask?", answer: "Sato-sensei.", options: ["Sato-sensei.", "The station staff.", "A shop clerk.", "Their parents."], explanation: "佐藤先生に聞いてください." }
			]
		},
		{
			title: "Neighbor Note",
			text: "明日の午前中、引っ越しのため、トラックがアパートの前に止まります。少しうるさくなるかもしれません。できるだけ早く終わらせますので、ご迷惑をおかけしますが、よろしくお願いします。",
			en: "A moving truck will be in front of the apartment tomorrow morning and may be noisy.",
			questions: [
				{ prompt: "Why will there be a truck?", answer: "Because someone is moving.", options: ["Because someone is moving.", "Because road work is starting.", "Because a festival is happening.", "Because trash is being collected."], explanation: "引っ越しのため gives the reason." },
				{ prompt: "What does the writer say may happen?", answer: "It may become a little noisy.", options: ["It may become a little noisy.", "The apartment will close.", "The truck will stay all week.", "The rent will change."], explanation: "少しうるさくなるかもしれません." }
			]
		},
		{
			title: "Clinic Notice",
			text: "今週の土曜日は、先生が学会に出るため、午後の診察はありません。午前は九時から十二時までです。薬だけほしい人も、十二時までに来てください。",
			en: "The clinic has no Saturday afternoon appointments because the doctor attends a conference.",
			questions: [
				{ prompt: "Why is there no afternoon clinic?", answer: "The doctor is going to a conference.", options: ["The doctor is going to a conference.", "The building is closed for cleaning.", "There is no medicine.", "It is a national holiday."], explanation: "先生が学会に出るため." },
				{ prompt: "By when should people who only need medicine come?", answer: "By 12:00.", options: ["By 12:00.", "After noon.", "By 9:00 p.m.", "Next Monday."], explanation: "十二時までに来てください." }
			]
		},
		{
			title: "Weather Plan",
			text: "明日の花火大会は、雨でも行います。ただし、強い風が吹いた場合は中止になります。中止かどうかは、明日の午後三時に市のホームページで知らせます。",
			en: "The fireworks will happen in rain, but strong wind may cancel them; check the city website at 3 p.m.",
			questions: [
				{ prompt: "When will the fireworks be canceled?", answer: "If strong wind blows.", options: ["If strong wind blows.", "If it rains at all.", "If many people come.", "If the website is busy."], explanation: "強い風が吹いた場合は中止." },
				{ prompt: "Where can people check the decision?", answer: "On the city website.", options: ["On the city website.", "At the train station.", "In the school gym.", "At the library."], explanation: "市のホームページで知らせます." }
			]
		},
		{
			title: "Part-Time Job",
			text: "このカフェでは、土曜日と日曜日に働ける人を探しています。経験がなくても大丈夫ですが、日本語で簡単な会話ができる人がいいです。働きたい人は、写真を持って店に来てください。",
			en: "The cafe is looking for weekend workers; experience is not required, but simple Japanese conversation is preferred.",
			questions: [
				{ prompt: "What kind of person is the cafe looking for?", answer: "Someone who can work weekends.", options: ["Someone who can work weekends.", "Someone who can work only Mondays.", "Someone with many years of experience.", "Someone who cannot speak Japanese."], explanation: "土曜日と日曜日に働ける人." },
				{ prompt: "What should applicants bring?", answer: "A photo.", options: ["A photo.", "A textbook.", "A towel.", "A train ticket."], explanation: "写真を持って店に来てください." }
			]
		},
		{
			title: "Museum Guide",
			text: "この博物館では、フラッシュを使わなければ写真を撮ってもいいです。展示品に手を触れてはいけません。説明を聞きたい人は、入口でイヤホンガイドを借りることができます。",
			en: "Photos are allowed without flash; visitors must not touch exhibits and can borrow an audio guide.",
			questions: [
				{ prompt: "What kind of photos are allowed?", answer: "Photos without flash.", options: ["Photos without flash.", "Photos touching exhibits.", "Photos only outside.", "No photos at all."], explanation: "フラッシュを使わなければ写真を撮ってもいいです." },
				{ prompt: "What can visitors borrow at the entrance?", answer: "An audio guide.", options: ["An audio guide.", "A camera.", "A bicycle.", "A lunch box."], explanation: "入口でイヤホンガイドを借りることができます." }
			]
		},
		{
			title: "Email To Teacher",
			text: "先生、昨日から熱があるので、今日の授業を休ませていただきます。宿題は友だちに預けました。来週の授業までに、休んだところを自分で勉強しておきます。",
			en: "The student is absent because of a fever and has given homework to a friend.",
			questions: [
				{ prompt: "Why will the student miss class?", answer: "Because they have had a fever since yesterday.", options: ["Because they have had a fever since yesterday.", "Because they forgot homework.", "Because they are traveling.", "Because the class was canceled."], explanation: "昨日から熱があるので." },
				{ prompt: "What did the student do with the homework?", answer: "Left it with a friend.", options: ["Left it with a friend.", "Mailed it next week.", "Lost it at home.", "Gave it to the doctor."], explanation: "宿題は友だちに預けました." }
			]
		},
		{
			title: "Train Announcement",
			text: "ただいま事故のため、山川線は運転を見合わせています。駅員の案内にしたがって、バスまたは地下鉄をご利用ください。切符はそのまま使えます。",
			en: "The Yamakawa Line is stopped because of an accident; passengers can use bus or subway with the same ticket.",
			questions: [
				{ prompt: "Why is the train line stopped?", answer: "Because of an accident.", options: ["Because of an accident.", "Because of snow.", "Because it is too late.", "Because tickets changed."], explanation: "事故のため marks the reason." },
				{ prompt: "What can passengers do with their tickets?", answer: "Use them as they are.", options: ["Use them as they are.", "Throw them away.", "Exchange them tomorrow only.", "Use them only for taxis."], explanation: "切符はそのまま使えます." }
			]
		},
		{
			title: "Recycling Notice",
			text: "来月から、ごみの出し方が少し変わります。ペットボトルはラベルとふたを取ってから、透明な袋に入れてください。朝八時までに出してください。前の日の夜には出さないでください。",
			en: "Plastic bottles need labels and caps removed, then must be put out by 8 a.m.",
			questions: [
				{ prompt: "What should people do before putting out plastic bottles?", answer: "Remove the labels and caps.", options: ["Remove the labels and caps.", "Put them out the night before.", "Use a black bag.", "Take them to school."], explanation: "ラベルとふたを取ってから gives the first step." },
				{ prompt: "When should the trash be put out?", answer: "By 8 a.m.", options: ["By 8 a.m.", "The night before.", "After lunch.", "At any time."], explanation: "朝八時までに出してください." }
			]
		},
		{
			title: "Community Event",
			text: "日曜日に公園で小さな音楽会があります。入場料は無料ですが、いすの数が少ないので、座りたい人は早めに来てください。雨が降ったら、市民センターのホールで行います。",
			en: "A free concert will be held in the park, or at the citizen center if it rains.",
			questions: [
				{ prompt: "Why should people come early if they want to sit?", answer: "There are not many chairs.", options: ["There are not many chairs.", "Tickets are expensive.", "The concert starts at night.", "The park is far away."], explanation: "いすの数が少ないので gives the reason." },
				{ prompt: "Where is the concert if it rains?", answer: "At the citizen center hall.", options: ["At the citizen center hall.", "At the station.", "In a restaurant.", "At school."], explanation: "雨が降ったら、市民センターのホールで行います." }
			]
		},
		{
			title: "Host Family Note",
			text: "マックスさん、今日は七時ごろ帰ります。晩ご飯は冷蔵庫に入れてありますから、電子レンジで温めて食べてください。犬にはもうえさをあげましたが、水が少なかったら足してください。",
			en: "Dinner is in the fridge; the dog has been fed, but water may need to be added.",
			questions: [
				{ prompt: "What should Max do with dinner?", answer: "Heat it in the microwave and eat it.", options: ["Heat it in the microwave and eat it.", "Buy it at a convenience store.", "Feed it to the dog.", "Wait until seven to cook it."], explanation: "電子レンジで温めて食べてください." },
				{ prompt: "What might Max need to do for the dog?", answer: "Add water.", options: ["Add water.", "Give food again.", "Take it to the station.", "Wash it."], explanation: "水が少なかったら足してください." }
			]
		},
		{
			title: "Restaurant Reservation",
			text: "ご予約ありがとうございます。明日六時に四名様でお待ちしています。席は二時間までご利用いただけます。人数を変えたい場合は、今日の夜九時までにお電話ください。",
			en: "The reservation is for four people at 6:00; call by 9 tonight to change the number of people.",
			questions: [
				{ prompt: "How many people is the reservation for?", answer: "Four people.", options: ["Four people.", "Two people.", "Six people.", "Nine people."], explanation: "四名様 means four guests." },
				{ prompt: "By when should they call to change the number of people?", answer: "By 9 tonight.", options: ["By 9 tonight.", "At 6 tomorrow.", "After two hours.", "Next morning."], explanation: "今日の夜九時までにお電話ください." }
			]
		},
		{
			title: "Phone Plan Notice",
			text: "今月から学生プランの料金が安くなりました。学生証を見せると、毎月五百円安くなります。すでにこのプランを使っている人も、店で手続きをすれば新しい料金になります。",
			en: "The student phone plan is cheaper now, but existing users must complete a procedure at the shop.",
			questions: [
				{ prompt: "What must students show?", answer: "A student ID.", options: ["A student ID.", "A passport.", "A train ticket.", "A receipt."], explanation: "学生証を見せると." },
				{ prompt: "What about people already using the plan?", answer: "They can get the new price if they do the procedure at the shop.", options: ["They can get the new price if they do the procedure at the shop.", "They cannot use the cheaper price.", "They must buy a new phone.", "They automatically pay more."], explanation: "すでに...使っている人も、店で手続きをすれば新しい料金になります." }
			]
		},
		{
			title: "Study Group",
			text: "来週の読解勉強会では、N4の短い文章をたくさん読みます。辞書を使ってもいいですが、まず辞書を使わないで読んでみましょう。参加したい人は、金曜日までに名前を書いてください。",
			en: "The reading study group will read many short N4 passages and asks people to sign up by Friday.",
			questions: [
				{ prompt: "What will people do at the study group?", answer: "Read many short N4 passages.", options: ["Read many short N4 passages.", "Practice only kanji writing.", "Watch a movie.", "Take a speaking test."], explanation: "N4の短い文章をたくさん読みます." },
				{ prompt: "What should people try first?", answer: "Reading without a dictionary.", options: ["Reading without a dictionary.", "Writing their name in English.", "Calling the teacher.", "Using a dictionary first."], explanation: "まず辞書を使わないで読んでみましょう." }
			]
		},
		{
			title: "Delivery Note",
			text: "本日お荷物をお届けに来ましたが、ご不在でした。明日の午前中にもう一度来ます。時間を変えたい場合は、紙に書いてある番号に電話するか、ウェブサイトで申し込んでください。",
			en: "A delivery attempt failed because no one was home; another attempt is tomorrow morning unless changed.",
			questions: [
				{ prompt: "Why was the package not delivered today?", answer: "No one was home.", options: ["No one was home.", "The address was wrong.", "The package was too heavy.", "It was raining."], explanation: "ご不在でした means the recipient was absent/not home." },
				{ prompt: "How can the recipient change the time?", answer: "Call the number or apply on the website.", options: ["Call the number or apply on the website.", "Go to the library.", "Wait until next month.", "Write to the school."], explanation: "電話するか、ウェブサイトで申し込んでください." }
			]
		}
	];

	const passageBank = passageSources.flatMap((source) => source.questions.map((question) => ({
		...question,
		title: source.title,
		text: source.text,
		en: source.en,
		options: shuffled(question.options)
	})));

	const agentRoleLabels = {
		agent: "actual doer",
		receiver: "receiver of help/favor",
		affected: "person affected by the passive event",
		causer: "person who made/let it happen",
		object: "thing acted on",
		clue: "grammar clue",
		meaning: "role summary"
	};

	const agentPatternClues = {
		"てあげる": "〜てあげました",
		"てもらう": "〜てもらいました",
		"てくれる": "〜てくれました",
		passive: "〜られました",
		causative: "〜せました",
		"causative-passive": "〜させられました"
	};

	const agentScenarios = [
		{ pattern: "てあげる", sentence: "私は妹に重い箱を持ってあげました。", action: "carried the heavy box", agent: "私", receiver: "妹", object: "重い箱", parties: ["私", "妹", "重い箱", "母"], note: "In てあげる, the subject does the action for someone else." },
		{ pattern: "てあげる", sentence: "兄は弟に自転車の乗り方を教えてあげました。", action: "taught how to ride a bicycle", agent: "兄", receiver: "弟", object: "自転車の乗り方", parties: ["兄", "弟", "自転車", "先生"], note: "The person before は/が is usually the helper in てあげる." },
		{ pattern: "てあげる", sentence: "友だちは留学生に駅までの道を説明してあげました。", action: "explained the way to the station", agent: "友だち", receiver: "留学生", object: "駅までの道", parties: ["友だち", "留学生", "駅までの道", "駅員"], note: "説明してあげました means the friend did the explaining for the exchange student." },
		{ pattern: "てあげる", sentence: "私は祖母にスマホの使い方をゆっくり教えてあげました。", action: "explained how to use the smartphone", agent: "私", receiver: "祖母", object: "スマホの使い方", parties: ["私", "祖母", "スマホの使い方", "母"], note: "てあげる points from the helper toward the person helped." },
		{ pattern: "てあげる", sentence: "クラスの代表は新しい学生に学校の中を案内してあげました。", action: "showed someone around the school", agent: "クラスの代表", receiver: "新しい学生", object: "学校の中", parties: ["クラスの代表", "新しい学生", "学校の中", "先生"], note: "The representative is the helper; the new student receives the favor." },
		{ pattern: "てもらう", sentence: "私は先生に作文を直してもらいました。", action: "corrected the essay", agent: "先生", receiver: "私", object: "作文", parties: ["私", "先生", "作文", "友だち"], note: "In てもらう, the に person often does the action; the subject receives the favor." },
		{ pattern: "てもらう", sentence: "妹は私に荷物を持ってもらいました。", action: "carried the bags", agent: "私", receiver: "妹", object: "荷物", parties: ["妹", "私", "荷物", "母"], note: "妹 receives the favor; 私 is the one who carries." },
		{ pattern: "てもらう", sentence: "田中さんは店員に新しいサイズを探してもらいました。", action: "looked for a new size", agent: "店員", receiver: "田中さん", object: "新しいサイズ", parties: ["田中さん", "店員", "新しいサイズ", "友だち"], note: "The に person is the helper in this てもらう sentence." },
		{ pattern: "てもらう", sentence: "道が分からなかったので、私は駅員に出口を教えてもらいました。", action: "explained the exit", agent: "駅員", receiver: "私", object: "出口", parties: ["私", "駅員", "出口", "友だち"], note: "私は receives the favor; 駅員 is the person who explains." },
		{ pattern: "てもらう", sentence: "会議の前に、部長は山田さんに資料をコピーしてもらいました。", action: "copied the materials", agent: "山田さん", receiver: "部長", object: "資料", parties: ["部長", "山田さん", "資料", "会議"], note: "In てもらう, the person marked with に often performs the action." },
		{ pattern: "てくれる", sentence: "兄が私のパソコンを直してくれました。", action: "fixed the computer", agent: "兄", receiver: "私", object: "パソコン", parties: ["兄", "私", "パソコン", "店員"], note: "In てくれる, the subject does something for the speaker side." },
		{ pattern: "てくれる", sentence: "友だちが私に日本語のメールを書いてくれました。", action: "wrote the Japanese email", agent: "友だち", receiver: "私", object: "日本語のメール", parties: ["友だち", "私", "日本語のメール", "先生"], note: "友だち is the helper; 私 benefits from the action." },
		{ pattern: "てくれる", sentence: "母が弟に晩ご飯を作ってくれました。", action: "made dinner", agent: "母", receiver: "弟", object: "晩ご飯", parties: ["母", "弟", "晩ご飯", "父"], note: "The subject 母 performs the helpful action." },
		{ pattern: "てくれる", sentence: "朝、財布を忘れました。佐藤さんが駅まで届けてくれました。", action: "delivered the wallet", agent: "佐藤さん", receiver: "私", object: "財布", parties: ["佐藤さん", "私", "財布", "駅員"], note: "The receiver 私 is omitted, but てくれました shows the writer's side benefited." },
		{ pattern: "てくれる", sentence: "雨が降ってきたので、姉がかさを貸してくれました。", action: "lent the umbrella", agent: "姉", receiver: "私", object: "かさ", parties: ["姉", "私", "かさ", "母"], note: "てくれる marks 姉 as the person doing a helpful action for the writer." },
		{ pattern: "passive", sentence: "私は弟にケーキを食べられました。", action: "ate the cake", agent: "弟", affected: "私", object: "ケーキ", parties: ["私", "弟", "ケーキ", "母"], note: "In this passive sentence, 私 is affected; 弟 actually ate the cake." },
		{ pattern: "passive", sentence: "山田さんは犬に手をかまれました。", action: "bit the hand", agent: "犬", affected: "山田さん", object: "手", parties: ["山田さん", "犬", "手", "医者"], note: "The に marked noun can be the doer in passive sentences." },
		{ pattern: "passive", sentence: "私は知らない人に写真を撮られました。", action: "took the photo", agent: "知らない人", affected: "私", object: "写真", parties: ["私", "知らない人", "写真", "友だち"], note: "私 is the affected person; 知らない人 did the action." },
		{ pattern: "passive", sentence: "旅行中に、私は雨に降られて服がぬれました。", action: "rained on someone", agent: "雨", affected: "私", object: "服", parties: ["私", "雨", "服", "友だち"], note: "This passive shows the writer was negatively affected by rain." },
		{ pattern: "passive", sentence: "兄は友だちに大切な本をなくされました。", action: "lost the important book", agent: "友だち", affected: "兄", object: "大切な本", parties: ["兄", "友だち", "大切な本", "先生"], note: "The に person did the losing; 兄 is the one affected." },
		{ pattern: "passive", sentence: "発表の前に、私は先生に名前を呼ばれました。", action: "called the name", agent: "先生", affected: "私", object: "名前", parties: ["私", "先生", "名前", "発表"], note: "In passive sentences, the subject is often the person receiving or affected by the action." },
		{ pattern: "causative", sentence: "先生は学生に漢字を書かせました。", action: "wrote kanji", agent: "学生", causer: "先生", object: "漢字", parties: ["先生", "学生", "漢字", "友だち"], note: "In causative, the causer makes/lets someone else do the action." },
		{ pattern: "causative", sentence: "母は子どもに部屋を掃除させました。", action: "cleaned the room", agent: "子ども", causer: "母", object: "部屋", parties: ["母", "子ども", "部屋", "父"], note: "母 caused it; 子ども actually cleaned." },
		{ pattern: "causative", sentence: "店長はアルバイトにレジを手伝わせました。", action: "helped at the register", agent: "アルバイト", causer: "店長", object: "レジ", parties: ["店長", "アルバイト", "レジ", "お客さん"], note: "The person marked with に is made/allowed to do the action here." },
		{ pattern: "causative", sentence: "父は弟に犬の散歩をさせました。", action: "walked the dog", agent: "弟", causer: "父", object: "犬の散歩", parties: ["父", "弟", "犬の散歩", "犬"], note: "父 caused it; 弟 is the one who walked the dog." },
		{ pattern: "causative", sentence: "先生は学生に新しい文法を何度も練習させました。", action: "practiced the new grammar", agent: "学生", causer: "先生", object: "新しい文法", parties: ["先生", "学生", "新しい文法", "クラス"], note: "The teacher makes the students practice; the students perform the action." },
		{ pattern: "causative", sentence: "母は妹に好きな服を選ばせました。", action: "chose the clothes", agent: "妹", causer: "母", object: "好きな服", parties: ["母", "妹", "好きな服", "店員"], note: "Causative can also mean let someone do something; 妹 does the choosing." },
		{ pattern: "causative-passive", sentence: "私は父に庭を掃除させられました。", action: "cleaned the garden", agent: "私", causer: "父", object: "庭", parties: ["私", "父", "庭", "弟"], note: "Causative-passive often means the subject was made to do the action." },
		{ pattern: "causative-passive", sentence: "弟は先生に長い文を読ませられました。", action: "read the long sentence", agent: "弟", causer: "先生", object: "長い文", parties: ["弟", "先生", "長い文", "兄"], note: "弟 is made to read; 先生 is the causer." },
		{ pattern: "causative-passive", sentence: "学生たちはコーチに校庭を走らせられました。", action: "ran around the schoolyard", agent: "学生たち", causer: "コーチ", object: "校庭", parties: ["学生たち", "コーチ", "校庭", "先生"], note: "The students are the ones running; the coach makes them do it." },
		{ pattern: "causative-passive", sentence: "私は先輩に会議の資料を作らせられました。", action: "made the meeting materials", agent: "私", causer: "先輩", object: "会議の資料", parties: ["私", "先輩", "会議の資料", "部長"], note: "私は is forced to make the materials; 先輩 is the causer." },
		{ pattern: "causative-passive", sentence: "妹は母に苦手な野菜を食べさせられました。", action: "ate the disliked vegetables", agent: "妹", causer: "母", object: "苦手な野菜", parties: ["妹", "母", "苦手な野菜", "父"], note: "妹 performs the action unwillingly; 母 makes it happen." }
	];

	function agentQuestionOptions(answer, scenario) {
		return shuffled(Array.from(new Set([answer, ...scenario.parties.filter((item) => item !== answer), "だれも"]))).slice(0, 4);
	}

	function agentClueOptions(answer) {
		const clues = Object.values(agentPatternClues).filter((clue) => clue !== answer);
		return shuffled([answer, ...shuffled(clues).slice(0, 3)]);
	}

	function agentRoleSummary(scenario) {
		if (scenario.receiver) return `${scenario.agent} did it for ${scenario.receiver}.`;
		if (scenario.affected) return `${scenario.affected} was affected; ${scenario.agent} did it.`;
		if (scenario.causer) return `${scenario.causer} made or let ${scenario.agent} do it.`;
		return `${scenario.agent} did it.`;
	}

	function agentRoleSummaryOptions(scenario) {
		const answer = agentRoleSummary(scenario);
		const options = [answer];
		if (scenario.receiver) {
			options.push(`${scenario.receiver} did it for ${scenario.agent}.`);
			options.push(`${scenario.agent} was affected by ${scenario.receiver}.`);
			options.push(`${scenario.receiver} made ${scenario.agent} do it.`);
		} else if (scenario.affected) {
			options.push(`${scenario.agent} was affected; ${scenario.affected} did it.`);
			options.push(`${scenario.affected} did it for ${scenario.agent}.`);
			options.push(`${scenario.affected} made ${scenario.agent} do it.`);
		} else if (scenario.causer) {
			options.push(`${scenario.agent} made or let ${scenario.causer} do it.`);
			options.push(`${scenario.causer} did the action directly.`);
			options.push(`${scenario.agent} received a favor from ${scenario.causer}.`);
		}
		return shuffled(Array.from(new Set(options))).slice(0, 4);
	}

	function buildAgentQuestionBank() {
		return agentScenarios.flatMap((scenario) => {
			const clue = scenario.clue || agentPatternClues[scenario.pattern];
			const questions = [
				{
					role: "agent",
					prompt: "Who actually did the action?",
					subprompt: `Action: ${scenario.action}.`,
					answer: scenario.agent,
					explanation: `${scenario.note} The actual doer is ${scenario.agent}.`
				},
				{
					role: "object",
					prompt: "What was acted on?",
					subprompt: "Find the thing that receives the action.",
					answer: scenario.object,
					explanation: `The object or target of the action is ${scenario.object}.`
				},
				{
					role: "clue",
					prompt: "Which grammar clue helps you track the roles?",
					subprompt: "First spot the pattern, then decide whether は/が or に marks the doer.",
					answer: clue,
					options: agentClueOptions(clue),
					explanation: `${clue} is the key pattern here. ${scenario.note}`
				},
				{
					role: "meaning",
					prompt: "Which role summary matches the sentence?",
					subprompt: "Check who acts, who benefits or is affected, and who causes the action.",
					answer: agentRoleSummary(scenario),
					options: agentRoleSummaryOptions(scenario),
					explanation: `${scenario.note} ${agentRoleSummary(scenario)}`
				}
			];
			if (scenario.receiver) {
				questions.push({
					role: "receiver",
					prompt: "Who received the help or favor?",
					subprompt: "Look past who did it and find who benefited.",
					answer: scenario.receiver,
					explanation: `${scenario.receiver} receives the favor in this ${scenario.pattern} sentence.`
				});
			}
			if (scenario.affected) {
				questions.push({
					role: "affected",
					prompt: "Who was affected by the passive event?",
					subprompt: "This may be different from who actually did the action.",
					answer: scenario.affected,
					explanation: `${scenario.affected} is affected; ${scenario.agent} actually does the action.`
				});
			}
			if (scenario.causer) {
				questions.push({
					role: "causer",
					prompt: "Who made or let the action happen?",
					subprompt: "Find the causer, not the person who actually performed the action.",
					answer: scenario.causer,
					explanation: `${scenario.causer} is the causer; ${scenario.agent} performs the action.`
				});
			}
			return questions.map((question) => ({
				...question,
				level: "Level 1",
				pattern: scenario.pattern,
				sentence: scenario.sentence,
				options: question.options || agentQuestionOptions(question.answer, scenario)
			}));
		});
	}

	const moodLabels = {
		positive: "Positive (+)",
		negative: "Negative (-)"
	};

	const moodToneOptions = [
		"appreciative / helped",
		"relieved / safe",
		"approval / praise",
		"satisfied / pleased",
		"hopeful / looking forward",
		"regretful / troubled",
		"lonely / uneasy",
		"annoyed / affected",
		"disappointed",
		"physically uncomfortable",
		"inconvenienced"
	];

	const moodSignalOptions = [
		"received favor",
		"positive evaluation word",
		"relief or success phrase",
		"hope or excitement phrase",
		"regretful てしまう",
		"negative evaluation word",
		"passive annoyance",
		"too much / excessive action",
		"bad result phrase",
		"disappointment phrase"
	];

	const moodScenarios = [
		{ mood: "positive", category: "help received", sentence: "友だちが宿題を手伝ってくれました。", clue: "手伝ってくれました", explanation: "てくれました shows someone kindly did something for the writer's side, so the feeling is positive." },
		{ mood: "positive", category: "help received", sentence: "先生に作文を直してもらいました。", clue: "直してもらいました", explanation: "てもらいました often shows the writer received a favor; here the teacher corrected the essay." },
		{ mood: "positive", category: "help received", sentence: "兄が駅まで迎えに来てくれました。", clue: "来てくれました", explanation: "来てくれました frames the brother's action as helpful to the writer." },
		{ mood: "positive", category: "help received", sentence: "旅行の写真を見せてもらいました。", clue: "見せてもらいました", explanation: "The writer got to see the photos, so てもらいました points to a positive received favor." },
		{ mood: "positive", category: "help received", sentence: "店員さんが丁寧に説明してくれました。", clue: "説明してくれました", explanation: "丁寧に and てくれました both make the sentence feel appreciative." },
		{ mood: "positive", category: "help received", sentence: "みんなが応援してくれたので頑張れました。", clue: "応援してくれた", explanation: "Support from others helped the writer, so the evaluation is positive." },
		{ mood: "positive", category: "positive judgment", sentence: "この店の人はとても親切でした。", clue: "親切", explanation: "親切 is a positive judgment word." },
		{ mood: "positive", category: "positive judgment", sentence: "駅の前は明るくて安心しました。", clue: "安心しました", explanation: "安心しました shows relief or safety, so the mood is positive." },
		{ mood: "positive", category: "positive judgment", sentence: "山田さんは一生懸命練習しました。", clue: "一生懸命", explanation: "一生懸命 praises effort and gives a positive evaluation." },
		{ mood: "positive", category: "positive judgment", sentence: "この部屋は広くて使いやすいです。", clue: "使いやすい", explanation: "使いやすい means easy to use, a positive quality." },
		{ mood: "positive", category: "positive judgment", sentence: "新しいアプリは便利で助かります。", clue: "助かります", explanation: "助かります means it helps or is a relief, so the writer likes the situation." },
		{ mood: "positive", category: "positive judgment", sentence: "このケーキは甘すぎなくておいしいです。", clue: "おいしい", explanation: "Even with すぎない, the final judgment おいしい is clearly positive." },
		{ mood: "positive", category: "positive judgment", sentence: "図書館は静かで勉強しやすかったです。", clue: "勉強しやすかった", explanation: "しやすかった means it was easy to do the action, so this is a positive evaluation." },
		{ mood: "negative", category: "regret / mistake", sentence: "財布を落としてしまいました。", clue: "落としてしまいました", explanation: "てしまいました often shows regret when something bad happened." },
		{ mood: "negative", category: "regret / mistake", sentence: "電車を乗り間違えてしまいました。", clue: "間違えてしまいました", explanation: "間違えてしまいました means the writer made a mistake and regrets it." },
		{ mood: "negative", category: "regret / mistake", sentence: "テストの時間を忘れてしまいました。", clue: "忘れてしまいました", explanation: "Forgetting the test time with てしまいました is an unwanted event." },
		{ mood: "negative", category: "regret / mistake", sentence: "大事なメールを消してしまって困りました。", clue: "困りました", explanation: "困りました directly tells you the writer had a problem." },
		{ mood: "negative", category: "negative judgment", sentence: "この部屋は狭すぎます。", clue: "狭すぎます", explanation: "狭すぎます says the room is too narrow, a negative evaluation." },
		{ mood: "negative", category: "negative judgment", sentence: "夜の駅前はさびしい感じがしました。", clue: "さびしい", explanation: "さびしい is a negative feeling word here." },
		{ mood: "negative", category: "negative judgment", sentence: "隣の部屋がうるさくて眠れませんでした。", clue: "眠れませんでした", explanation: "The noise caused the writer not to sleep, so the mood is negative." },
		{ mood: "negative", category: "negative judgment", sentence: "新しい靴は小さくて足が痛くなりました。", clue: "痛くなりました", explanation: "痛くなりました shows a bad result." },
		{ mood: "negative", category: "negative judgment", sentence: "バスが遅れて、約束の時間に間に合いませんでした。", clue: "間に合いませんでした", explanation: "Not making it on time is an unwanted result." },
		{ mood: "negative", category: "passive annoyance", sentence: "母に日記を読まれてしまいました。", clue: "読まれてしまいました", explanation: "The passive plus てしまいました shows the writer was negatively affected." },
		{ mood: "negative", category: "passive annoyance", sentence: "雨に降られて服がぬれました。", clue: "雨に降られて", explanation: "This passive pattern often shows trouble caused by something outside the writer's control." },
		{ mood: "negative", category: "passive annoyance", sentence: "先生に大事なプリントをなくされました。", clue: "なくされました", explanation: "The passive shows the writer was affected by someone else's action." },
		{ mood: "negative", category: "passive annoyance", sentence: "友だちに約束を忘れられてしまいました。", clue: "忘れられてしまいました", explanation: "The passive plus てしまいました shows disappointment or trouble." },
		{ mood: "negative", category: "too much", sentence: "ケーキを食べすぎて気持ちが悪くなりました。", clue: "食べすぎて", explanation: "すぎて plus a bad result shows the writer thinks it was excessive." },
		{ mood: "negative", category: "too much", sentence: "買い物をしすぎて、お金がなくなりました。", clue: "しすぎて", explanation: "しすぎて causes a bad result, so the mood is negative." },
		{ mood: "positive", category: "help received", tone: "appreciative / helped", signal: "received favor", sentence: "駅で道に迷いましたが、知らない人が出口まで案内してくれました。", clue: "案内してくれました", explanation: "てくれました shows a helpful action for the writer, so the writer sounds appreciative." },
		{ mood: "positive", category: "help received", tone: "appreciative / helped", signal: "received favor", sentence: "風邪で休んだ日のノートを、クラスメートに見せてもらいました。", clue: "見せてもらいました", explanation: "てもらいました means the writer received a favor from a classmate." },
		{ mood: "positive", category: "help received", tone: "appreciative / helped", signal: "received favor", sentence: "荷物が多くて困っていたら、駅員さんが手伝ってくれました。", clue: "手伝ってくれました", explanation: "困っていたら sets up trouble, and てくれました shows someone helped." },
		{ mood: "positive", category: "relief / success", tone: "relieved / safe", signal: "relief or success phrase", sentence: "道を間違えましたが、時間に間に合ってほっとしました。", clue: "ほっとしました", explanation: "ほっとしました directly shows relief after a possible problem." },
		{ mood: "positive", category: "relief / success", tone: "relieved / safe", signal: "relief or success phrase", sentence: "試験は難しかったですが、合格できて安心しました。", clue: "安心しました", explanation: "安心しました shows relief and a positive outcome." },
		{ mood: "positive", category: "relief / success", tone: "relieved / safe", signal: "relief or success phrase", sentence: "台風の日でしたが、家族はみんな無事でした。", clue: "無事でした", explanation: "無事でした means everyone was safe, so the feeling is relief." },
		{ mood: "positive", category: "positive judgment", tone: "approval / praise", signal: "positive evaluation word", sentence: "新しい先生の説明は分かりやすくて助かります。", clue: "分かりやすくて", explanation: "分かりやすい and 助かります both signal a positive evaluation." },
		{ mood: "positive", category: "positive judgment", tone: "satisfied / pleased", signal: "positive evaluation word", sentence: "このホテルは駅から近いだけでなく、部屋もきれいでした。", clue: "きれいでした", explanation: "だけでなく adds another good point; きれいでした is positive." },
		{ mood: "positive", category: "positive judgment", tone: "satisfied / pleased", signal: "positive evaluation word", sentence: "思ったより安く買えたので、うれしかったです。", clue: "うれしかったです", explanation: "うれしかったです directly gives the writer's pleased feeling." },
		{ mood: "positive", category: "hope / anticipation", tone: "hopeful / looking forward", signal: "hope or excitement phrase", sentence: "来週の文化祭をとても楽しみにしています。", clue: "楽しみにしています", explanation: "楽しみにしています shows the writer is looking forward to it." },
		{ mood: "positive", category: "hope / anticipation", tone: "hopeful / looking forward", signal: "hope or excitement phrase", sentence: "日本で友だちに会える日が待ち遠しいです。", clue: "待ち遠しいです", explanation: "待ち遠しい means the writer can hardly wait, a positive anticipation." },
		{ mood: "positive", category: "effort praised", tone: "approval / praise", signal: "positive evaluation word", sentence: "妹は毎朝早く起きて、一生懸命ピアノを練習しています。", clue: "一生懸命", explanation: "一生懸命 praises effort, so the evaluation is positive." },
		{ mood: "negative", category: "regret / mistake", tone: "regretful / troubled", signal: "regretful てしまう", sentence: "急いでいたので、宿題を家に忘れてしまいました。", clue: "忘れてしまいました", explanation: "てしまいました shows the writer regrets the mistake." },
		{ mood: "negative", category: "regret / mistake", tone: "regretful / troubled", signal: "regretful てしまう", sentence: "メールの送り先を間違えてしまって、恥ずかしかったです。", clue: "間違えてしまって", explanation: "The mistake plus 恥ずかしかったです shows embarrassment and regret." },
		{ mood: "negative", category: "regret / mistake", tone: "regretful / troubled", signal: "regretful てしまう", sentence: "せっかく作った弁当を電車に置いてきてしまいました。", clue: "置いてきてしまいました", explanation: "せっかく plus てしまいました makes the loss feel regrettable." },
		{ mood: "negative", category: "negative judgment", tone: "lonely / uneasy", signal: "negative evaluation word", sentence: "新しい町には知っている人が一人もいなくて、心細かったです。", clue: "心細かったです", explanation: "心細かったです shows the writer felt uneasy or alone." },
		{ mood: "negative", category: "negative judgment", tone: "lonely / uneasy", signal: "negative evaluation word", sentence: "夜の道は暗くて、少し怖かったです。", clue: "怖かったです", explanation: "怖かったです directly shows fear or unease." },
		{ mood: "negative", category: "negative judgment", tone: "inconvenienced", signal: "negative evaluation word", sentence: "駅からホテルまで遠すぎて、とても不便でした。", clue: "不便でした", explanation: "不便でした is a negative evaluation of the situation." },
		{ mood: "negative", category: "passive annoyance", tone: "annoyed / affected", signal: "passive annoyance", sentence: "休みの日に、会社から電話をかけられてしまいました。", clue: "かけられてしまいました", explanation: "The passive plus てしまいました shows the writer was bothered by the call." },
		{ mood: "negative", category: "passive annoyance", tone: "annoyed / affected", signal: "passive annoyance", sentence: "電車の中で、知らない人に足をふまれました。", clue: "ふまれました", explanation: "The passive shows the writer was affected by someone else's action." },
		{ mood: "negative", category: "passive annoyance", tone: "annoyed / affected", signal: "passive annoyance", sentence: "楽しみにしていたケーキを弟に食べられてしまいました。", clue: "食べられてしまいました", explanation: "Passive plus てしまいました shows the writer was negatively affected." },
		{ mood: "negative", category: "too much", tone: "physically uncomfortable", signal: "too much / excessive action", sentence: "昨日、歩きすぎて足が痛いです。", clue: "歩きすぎて", explanation: "すぎて plus pain shows an excessive action with a bad result." },
		{ mood: "negative", category: "too much", tone: "physically uncomfortable", signal: "too much / excessive action", sentence: "辛い料理を食べすぎて、夜よく眠れませんでした。", clue: "食べすぎて", explanation: "Eating too much causes a bad physical result, so the mood is negative." },
		{ mood: "negative", category: "bad result", tone: "inconvenienced", signal: "bad result phrase", sentence: "バスが来なくて、授業に遅れてしまいました。", clue: "遅れてしまいました", explanation: "遅れてしまいました shows an unwanted result." },
		{ mood: "negative", category: "bad result", tone: "inconvenienced", signal: "bad result phrase", sentence: "コピー機がこわれていて、資料を準備できませんでした。", clue: "準備できませんでした", explanation: "できませんでした shows the writer could not complete the needed action." },
		{ mood: "negative", category: "disappointment", tone: "disappointed", signal: "disappointment phrase", sentence: "楽しみにしていた映画は、思ったほどおもしろくありませんでした。", clue: "思ったほどおもしろくありませんでした", explanation: "思ったほど...ありません shows the result did not meet expectations." },
		{ mood: "negative", category: "disappointment", tone: "disappointed", signal: "disappointment phrase", sentence: "旅行の日に雨が降って、少し残念でした。", clue: "残念でした", explanation: "残念でした directly marks disappointment." },
		{ mood: "negative", category: "disappointment", tone: "disappointed", signal: "disappointment phrase", sentence: "新しいレストランに行きましたが、料理が冷たくてがっかりしました。", clue: "がっかりしました", explanation: "がっかりしました directly shows disappointment." },
		{ mood: "negative", category: "restriction / lack", tone: "disappointed", signal: "bad result phrase", sentence: "財布には五百円しかなくて、ほしい本が買えませんでした。", clue: "買えませんでした", explanation: "しかない and 買えませんでした show a frustrating lack." }
	];

	function moodTone(scenario) {
		if (scenario.tone) return scenario.tone;
		if (scenario.category === "help received") return "appreciative / helped";
		if (scenario.category === "positive judgment") return scenario.clue.includes("安心") || scenario.clue.includes("助か") ? "relieved / safe" : "approval / praise";
		if (scenario.category === "regret / mistake") return "regretful / troubled";
		if (scenario.category === "passive annoyance") return "annoyed / affected";
		if (scenario.category === "too much") return "physically uncomfortable";
		return scenario.mood === "positive" ? "satisfied / pleased" : "disappointed";
	}

	function moodSignal(scenario) {
		if (scenario.signal) return scenario.signal;
		if (scenario.category === "help received") return "received favor";
		if (scenario.category === "positive judgment") return scenario.clue.includes("安心") || scenario.clue.includes("助か") ? "relief or success phrase" : "positive evaluation word";
		if (scenario.category === "regret / mistake") return "regretful てしまう";
		if (scenario.category === "negative judgment") return "negative evaluation word";
		if (scenario.category === "passive annoyance") return "passive annoyance";
		if (scenario.category === "too much") return "too much / excessive action";
		return "bad result phrase";
	}

	function moodClueOptions(answer) {
		const distractors = shuffled(moodScenarios.map((item) => item.clue).filter((clue) => clue !== answer)).slice(0, 3);
		return shuffled([answer, ...distractors]);
	}

	function moodToneQuestionOptions(answer) {
		return shuffled([answer, ...shuffled(moodToneOptions.filter((option) => option !== answer)).slice(0, 3)]);
	}

	function moodSignalQuestionOptions(answer) {
		return shuffled([answer, ...shuffled(moodSignalOptions.filter((option) => option !== answer)).slice(0, 3)]);
	}

	function buildMoodQuestionBank() {
		return moodScenarios.flatMap((scenario) => {
			const answer = moodLabels[scenario.mood];
			const tone = moodTone(scenario);
			const signal = moodSignal(scenario);
			return [
				{
					type: "mood",
					level: "Level 1",
					category: scenario.category,
					sentence: scenario.sentence,
					prompt: "What feeling or evaluation does the writer show?",
					answer,
					options: shuffled([moodLabels.positive, moodLabels.negative]),
					explanation: scenario.explanation
				},
				{
					type: "tone",
					level: "Level 1",
					category: scenario.category,
					sentence: scenario.sentence,
					prompt: "What specific feeling is closest to the writer's mood?",
					answer: tone,
					options: moodToneQuestionOptions(tone),
					explanation: `${scenario.explanation} The closest feeling is ${tone}.`
				},
				{
					type: "clue",
					level: "Level 1",
					category: scenario.category,
					sentence: scenario.sentence,
					prompt: `Which expression tells you the mood is ${answer}?`,
					answer: scenario.clue,
					options: moodClueOptions(scenario.clue),
					explanation: scenario.explanation
				},
				{
					type: "signal",
					level: "Level 1",
					category: scenario.category,
					sentence: scenario.sentence,
					prompt: "What kind of language is carrying the mood?",
					answer: signal,
					options: moodSignalQuestionOptions(signal),
					explanation: `${scenario.explanation} This is a ${signal} clue.`
				}
			];
		});
	}

	function parseMarked(marked, kind) {
		let plain = "";
		const marks = [];
		for (const char of marked) {
			if (kind === "/" && char === "/") marks.push(plain.length);
			else if (kind === "[]" && (char === "[" || char === "]")) marks.push(plain.length);
			else plain += char;
		}
		return kind === "/" ? { text: plain, breaks: marks } : { text: plain, start: marks[0], end: marks[1] };
	}

	/* ---------- Session state ---------- */
	let session = null;

	function showSetup() {
		els.setup.hidden = false;
		els.status.hidden = false;
		els.session.hidden = true;
		els.complete.hidden = true;
		document.body.classList.remove("reading-fullscreen");
	}

	function startSession(mode) {
		const count = Number($(`#rh-count-${mode}`).value) || 10;
		let pool = null;
		if (mode === "stack") {
			const levels = { N5: ["N5"], N4: ["N5", "N4"], N3: ["N5", "N4", "N3"] }[$("#rh-level").value];
			// Keep to everyday verbs: honorific and humble verbs make the stacked forms unnatural.
			pool = getConjugationWords("verb", levels).filter((word) => !/respectful|humble|honorific|polite|vulgar|archaic|colloquial/i.test(word.meaning || "") && String(word.reading || "").length <= 8);
			if (!pool.length) {
				els.status.textContent = "Verbs haven't loaded yet. Check your connection and try again in a moment.";
				return;
			}
		}
		const bank = mode === "breaks" ? breakBank : mode === "quotes" ? quoteBank : mode === "passages" ? passageBank : mode === "agents" ? buildAgentQuestionBank() : mode === "mood" ? buildMoodQuestionBank() : null;
		const items = bank ? shuffled(bank) : null;
		session = { mode, count: bank ? Math.min(count, bank.length) : count, pool, items, index: 0, correct: 0, answered: 0, missed: [], current: null, checked: false };
		els.status.textContent = "";
		els.setup.hidden = true;
		els.complete.hidden = true;
		els.session.hidden = false;
		document.body.classList.add("reading-fullscreen");
		nextQuestion();
	}

	function updateStats() {
		els.correct.textContent = `✓ ${session.correct}`;
		els.progress.textContent = `${Math.min(session.index, session.count)} / ${session.count}`;
	}

	function nextQuestion() {
		if (session.index >= session.count) return finishSession();
		session.checked = false;
		session.index += 1;
		updateStats();
		if (session.mode === "stack") renderStack();
		else if (session.mode === "passages") renderPassageQuestion();
		else if (session.mode === "agents") renderAgentQuestion();
		else if (session.mode === "mood") renderMoodQuestion();
		else if (session.mode === "breaks") renderBreakQuestion();
		else if (session.mode === "quotes") renderQuoteQuestion();
		else renderMarking();
		els.session.scrollTop = 0;
	}

	function recordResult(correct, missedLabel) {
		session.answered += 1;
		if (correct) session.correct += 1;
		else session.missed.push(missedLabel);
		session.checked = true;
		updateStats();
	}

	function finishSession() {
		const { mode, correct, answered, missed } = session;
		els.session.hidden = true;
		document.body.classList.remove("reading-fullscreen");
		els.complete.hidden = false;
		els.title.textContent = { stack: "Grammar stacking complete", breaks: "Sentence breaks complete", quotes: "Said & thought complete", agents: "Who did it complete", mood: "Narrator mood complete", passages: "Short passages complete" }[mode];
		const percent = answered ? Math.round((correct / answered) * 100) : 0;
		els.result.textContent = `${correct} of ${answered} correct (${percent}%).`;
		els.missed.innerHTML = missed.length
			? `<h4>To review</h4><ul>${missed.map((item) => `<li lang="ja">${item}</li>`).join("")}</ul>`
			: "<p>No mistakes — nicely done!</p>";
	}

	function leaveSession() {
		if (session && session.answered > 0) finishSession();
		else showSetup();
	}

	/* ---------- Mode 1 rendering ---------- */
	function renderStack() {
		const wordType = getVerbType;
		let word;
		let chain = null;
		const wantedSteps = Number($("#rh-steps").value) || 0;
		for (let attempt = 0; attempt < 30 && !chain; attempt += 1) {
			word = session.pool[Math.floor(Math.random() * session.pool.length)];
			const type = wordType(word);
			let text = String(word.reading || word.kanji).replace(/[\s　]/g, "");
			if (type === "suru" && !text.endsWith("する")) text += "する";
			if (type === "kuru" && !text.endsWith("くる")) text = `${text.slice(0, -1)}くる`;
			const steps = wantedSteps || 1 + Math.floor(Math.random() * 4);
			chain = generateChain(verb(text, type), steps);
			if (chain) word = { ...word, baseText: text };
		}
		if (!chain) return nextQuestion();
		const answer = chain.map((step) => step.letter);
		const finalText = kanjiForm(chain.at(-1).state.text, word);
		const task = chooseStackTask(chain);
		session.current = { word, chain, answer, entered: [], task, finalText };

		els.hero.innerHTML = `
			<p class="rh-hero-label">Starting verb</p>
			<p class="rh-from"><span lang="ja">${escapeHtml(baseVerbLabel(word))}</span>${word.kanji && word.reading !== word.kanji ? ` <small lang="ja">${escapeHtml(word.reading)}</small>` : ""} <small>${escapeHtml(word.meaning || "")}</small></p>
			<p class="rh-arrow" aria-hidden="true">↓</p>
			<p class="rh-target" lang="ja">${escapeHtml(finalText)}</p>`;
		if (task.type === "base") {
			const baseAnswer = baseVerbLabel(word);
			session.current.choiceAnswer = baseAnswer;
			els.band.textContent = "What base verb is hidden under this stack?";
			els.body.innerHTML = `
				<div class="rh-choice-list" role="group" aria-label="Base verb choices">
					${stackBaseChoices(baseAnswer, session.pool).map((option) => `<button type="button" class="rh-choice-option" data-choice="${escapeHtml(option)}"><span lang="ja">${escapeHtml(option)}</span></button>`).join("")}
				</div>
				<p class="answer-feedback rh-feedback" id="rh-feedback" aria-live="polite"></p>
				<div class="rh-hint-table"><h4>Goal</h4><p>Ignore the added endings and recover the dictionary-form verb that started the chain.</p></div>
				<button class="practice-start rh-next" id="rh-next" type="button" hidden>Next →</button>`;
			return;
		}
		if (task.type === "meaning") {
			const targetIndex = task.targetIndex ?? chain.length - 1;
			const target = chain[targetIndex];
			session.current.choiceAnswer = transforms[target.letter].cue;
			els.band.textContent = targetIndex === chain.length - 1 ? "What does the outermost grammar layer do?" : `What does layer ${targetIndex + 1} add to the meaning?`;
			els.body.innerHTML = `
				<div class="rh-choice-list" role="group" aria-label="Grammar meaning choices">
					${stackMeaningChoices(target.letter).map((option) => `<button type="button" class="rh-choice-option" data-choice="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join("")}
				</div>
				<p class="answer-feedback rh-feedback" id="rh-feedback" aria-live="polite"></p>
				<div class="rh-hint-table"><h4>Focus layer</h4><p><strong>${target.letter}.</strong> <span lang="ja">${escapeHtml(transforms[target.letter].form)}</span> · ${escapeHtml(transforms[target.letter].name)}</p></div>
				<button class="practice-start rh-next" id="rh-next" type="button" hidden>Next →</button>`;
			return;
		}
		els.band.textContent = chain.length === 1 ? "Which grammar was added?" : `Which ${chain.length} patterns were added, in order?`;
		els.body.innerHTML = `
			<form class="rh-answer" id="rh-answer-form" autocomplete="off">
				<input id="rh-answer-input" type="text" inputmode="text" aria-label="Pattern letters in order" placeholder="e.g. c + b + j" spellcheck="false">
				<button class="rh-icon-button" id="rh-undo" type="button" aria-label="Remove last letter" title="Remove last letter">⌫</button>
				<button class="rh-submit" id="rh-submit" type="submit" aria-label="Check answer">›</button>
			</form>
			<p class="answer-feedback rh-feedback" id="rh-feedback" aria-live="polite"></p>
			<div class="rh-table" id="rh-table" role="group" aria-label="Grammar patterns">
				${letters.map((letter) => `<button type="button" class="rh-table-item" data-letter="${letter}"><b>${letter}.</b><span lang="ja">${transforms[letter].form}</span><small>${transforms[letter].name}</small></button>`).join("")}
			</div>
			<button class="practice-start rh-next" id="rh-next" type="button" hidden>Next →</button>`;
		$("#rh-answer-input").focus();
	}

	function setEntered(entered) {
		session.current.entered = entered;
		$("#rh-answer-input").value = entered.join(" + ");
	}

	function checkStack() {
		const { chain, answer, entered, word } = session.current;
		const correct = entered.length === answer.length && entered.every((letter, index) => letter === answer[index]);
		const steps = stackStepsHtml(chain, word);
		const feedback = $("#rh-feedback");
		feedback.className = `answer-feedback rh-feedback ${correct ? "is-correct" : "is-incorrect"}`;
		feedback.innerHTML = `${correct ? "Correct!" : `Not quite. The answer is <strong>${answer.join(" + ")}</strong>.`}<ol class="rh-steps">${steps}</ol>`;
		$("#rh-answer-form").classList.add(correct ? "is-correct" : "is-incorrect");
		$("#rh-answer-input").readOnly = true;
		$("#rh-submit").disabled = true;
		$("#rh-undo").disabled = true;
		document.querySelectorAll(".rh-table-item").forEach((button) => { button.disabled = true; });
		const next = $("#rh-next");
		next.hidden = false;
		next.focus();
		const finalText = kanjiForm(chain.at(-1).state.text, word);
		recordResult(correct, `${escapeHtml(word.kanji || word.reading)} → ${escapeHtml(finalText)} (${answer.join(" + ")})`);
	}

	function checkStackChoice(choice) {
		const { chain, word, choiceAnswer, task, finalText } = session.current;
		const correct = choice === choiceAnswer;
		const feedback = $("#rh-feedback");
		feedback.className = `answer-feedback rh-feedback ${correct ? "is-correct" : "is-incorrect"}`;
		feedback.innerHTML = `${correct ? "Correct!" : `Not quite. The answer is <strong>${escapeHtml(choiceAnswer)}</strong>.`}
			<ol class="rh-steps">${stackStepsHtml(chain, word)}</ol>`;
		document.querySelectorAll(".rh-choice-option").forEach((button) => {
			button.disabled = true;
			const value = button.dataset.choice;
			button.classList.toggle("is-correct", value === choiceAnswer);
			button.classList.toggle("is-incorrect", value === choice && value !== choiceAnswer);
		});
		els.hero.classList.add(correct ? "is-correct" : "is-incorrect");
		const next = $("#rh-next");
		next.hidden = false;
		next.focus();
		const missedPrefix = task.type === "base" ? "base" : "meaning";
		recordResult(correct, `${missedPrefix}: ${escapeHtml(finalText)} → ${escapeHtml(choiceAnswer)}`);
	}

	function renderPassageQuestion() {
		const item = session.items[(session.index - 1) % session.items.length];
		session.current = { item, selected: null };
		els.hero.innerHTML = `
			<p class="rh-hero-label">${escapeHtml(item.title)}</p>
			<p class="rh-passage" lang="ja">${escapeHtml(item.text)}</p>`;
		els.band.textContent = item.prompt;
		els.body.innerHTML = `
			<div class="rh-choice-list" role="group" aria-label="Answer choices">
				${item.options.map((option) => `<button type="button" class="rh-choice-option" data-choice="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join("")}
			</div>
			<p class="answer-feedback rh-feedback" id="rh-feedback" aria-live="polite"></p>
			<div class="rh-hint-table"><h4>Passage gist</h4><p>${escapeHtml(item.en)}</p></div>
			<button class="practice-start rh-next" id="rh-next" type="button" hidden>Next →</button>`;
	}

	function checkPassageChoice(choice) {
		const { item } = session.current;
		const correct = choice === item.answer;
		session.current.selected = choice;
		const feedback = $("#rh-feedback");
		feedback.className = `answer-feedback rh-feedback ${correct ? "is-correct" : "is-incorrect"}`;
		feedback.innerHTML = `${correct ? "Correct!" : `Not quite. The answer is <strong>${escapeHtml(item.answer)}</strong>.`}
			<span class="rh-translation">${escapeHtml(item.explanation)}</span>`;
		document.querySelectorAll(".rh-choice-option").forEach((button) => {
			button.disabled = true;
			const value = button.dataset.choice;
			button.classList.toggle("is-correct", value === item.answer);
			button.classList.toggle("is-incorrect", value === choice && value !== item.answer);
		});
		els.hero.classList.add(correct ? "is-correct" : "is-incorrect");
		const next = $("#rh-next");
		next.hidden = false;
		next.focus();
		recordResult(correct, `${escapeHtml(item.title)}: ${escapeHtml(item.prompt)} → ${escapeHtml(item.answer)}`);
	}

	function renderAgentQuestion() {
		const item = session.items[(session.index - 1) % session.items.length];
		const answerLang = item.role === "meaning" ? "" : ' lang="ja"';
		session.current = { item, choiceAnswer: item.answer };
		els.hero.innerHTML = `
			<p class="rh-hero-label">Who did it? · ${escapeHtml(item.level)} · ${escapeHtml(item.pattern)}</p>
			<p class="rh-sentence" lang="ja">${escapeHtml(item.sentence)}</p>`;
		els.band.textContent = item.prompt;
		els.body.innerHTML = `
			<div class="rh-choice-list" role="group" aria-label="Agent role choices">
				${item.options.map((option) => `<button type="button" class="rh-choice-option" data-choice="${escapeHtml(option)}"><span${answerLang}>${escapeHtml(option)}</span></button>`).join("")}
			</div>
			<p class="answer-feedback rh-feedback" id="rh-feedback" aria-live="polite"></p>
			<div class="rh-hint-table"><h4>Reading move</h4><p>${escapeHtml(item.subprompt)} Pattern focus: ${escapeHtml(agentRoleLabels[item.role] || item.role)}.</p></div>
			<button class="practice-start rh-next" id="rh-next" type="button" hidden>Next →</button>`;
	}

	function checkAgentChoice(choice) {
		const { item, choiceAnswer } = session.current;
		const correct = choice === choiceAnswer;
		const feedback = $("#rh-feedback");
		const answerLang = item.role === "meaning" ? "" : ' lang="ja"';
		feedback.className = `answer-feedback rh-feedback ${correct ? "is-correct" : "is-incorrect"}`;
		feedback.innerHTML = `${correct ? "Correct!" : `Not quite. The answer is <strong${answerLang}>${escapeHtml(choiceAnswer)}</strong>.`}
			<span class="rh-answer-line" lang="ja">${escapeHtml(item.sentence)}</span>
			<span class="rh-translation">${escapeHtml(item.explanation)}</span>`;
		document.querySelectorAll(".rh-choice-option").forEach((button) => {
			button.disabled = true;
			const value = button.dataset.choice;
			button.classList.toggle("is-correct", value === choiceAnswer);
			button.classList.toggle("is-incorrect", value === choice && value !== choiceAnswer);
		});
		els.hero.classList.add(correct ? "is-correct" : "is-incorrect");
		const next = $("#rh-next");
		next.hidden = false;
		next.focus();
		recordResult(correct, `${escapeHtml(item.pattern)} · ${escapeHtml(item.role)}: ${escapeHtml(item.sentence)} → ${escapeHtml(choiceAnswer)}`);
	}

	function renderMoodQuestion() {
		const item = session.items[(session.index - 1) % session.items.length];
		session.current = { item, choiceAnswer: item.answer };
		els.hero.innerHTML = `
			<p class="rh-hero-label">Narrator mood · ${escapeHtml(item.level)} · ${escapeHtml(item.category)}</p>
			<p class="rh-sentence" lang="ja">${escapeHtml(item.sentence)}</p>`;
		els.band.textContent = item.prompt;
		els.body.innerHTML = `
			<div class="rh-choice-list" role="group" aria-label="Narrator mood choices">
				${item.options.map((option) => `<button type="button" class="rh-choice-option" data-choice="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join("")}
			</div>
			<p class="answer-feedback rh-feedback" id="rh-feedback" aria-live="polite"></p>
			<div class="rh-hint-table"><h4>Reading move</h4><p>Look for evaluation words, received favors, regretful てしまう, passive annoyance, or bad-result phrases.</p></div>
			<button class="practice-start rh-next" id="rh-next" type="button" hidden>Next →</button>`;
	}

	function checkMoodChoice(choice) {
		const { item, choiceAnswer } = session.current;
		const correct = choice === choiceAnswer;
		const feedback = $("#rh-feedback");
		feedback.className = `answer-feedback rh-feedback ${correct ? "is-correct" : "is-incorrect"}`;
		feedback.innerHTML = `${correct ? "Correct!" : `Not quite. The answer is <strong>${escapeHtml(choiceAnswer)}</strong>.`}
			<span class="rh-answer-line" lang="ja">${escapeHtml(item.sentence)}</span>
			<span class="rh-translation">${escapeHtml(item.explanation)}</span>`;
		document.querySelectorAll(".rh-choice-option").forEach((button) => {
			button.disabled = true;
			const value = button.dataset.choice;
			button.classList.toggle("is-correct", value === choiceAnswer);
			button.classList.toggle("is-incorrect", value === choice && value !== choiceAnswer);
		});
		els.hero.classList.add(correct ? "is-correct" : "is-incorrect");
		const next = $("#rh-next");
		next.hidden = false;
		next.focus();
		recordResult(correct, `${escapeHtml(item.category)}: ${escapeHtml(item.sentence)} → ${escapeHtml(choiceAnswer)}`);
	}

	function renderBreakQuestion() {
		const item = session.items[(session.index - 1) % session.items.length];
		const task = chooseBreakTask();
		if (task.type === "mark") return renderMarking(item, task);
		const chunks = sentenceBreakChunks(item);
		const answer = task.type === "main" ? chunks.at(-1).text : null;
		const targetBreak = task.type === "role" ? item.breaks[Math.floor(Math.random() * item.breaks.length)] : null;
		const role = targetBreak === null ? null : classifyBreakRole(item, targetBreak);
		session.current = { item, task, choiceAnswer: task.type === "main" ? answer : role.label, targetBreak };
		els.hero.innerHTML = `<p class="rh-hero-label">${task.type === "main" ? "Read the chunks, then find the core sentence" : "Read the highlighted slash"}</p><p class="rh-sentence" lang="ja">${renderBreakGuideSentence(item, targetBreak)}</p>`;
		els.band.textContent = task.type === "main" ? "Which chunk carries the main action or conclusion?" : "What job does this highlighted break do?";
		const options = task.type === "main"
			? shuffled(chunks.map((chunk) => chunk.text)).slice(0, 4)
			: breakRoleOptions(role.label);
		if (task.type === "main" && !options.includes(answer)) {
			options.pop();
			options.push(answer);
		}
		els.body.innerHTML = `
			<div class="rh-choice-list" role="group" aria-label="Sentence break choices">
				${shuffled(options).map((option) => `<button type="button" class="rh-choice-option" data-choice="${escapeHtml(option)}">${task.type === "main" ? `<span lang="ja">${escapeHtml(option)}</span>` : escapeHtml(option)}</button>`).join("")}
			</div>
			<p class="answer-feedback rh-feedback" id="rh-feedback" aria-live="polite"></p>
			<div class="rh-hint-table"><h4>${task.type === "main" ? "Reading move" : "Connector clue"}</h4><p>${task.type === "main" ? "Supporting chunks often come first. The main clause is usually the final chunk that completes the sentence." : escapeHtml(role.explanation)}</p></div>
			<button class="practice-start rh-next" id="rh-next" type="button" hidden>Next →</button>`;
	}

	function checkBreakChoice(choice) {
		const { item, task, choiceAnswer, targetBreak } = session.current;
		const correct = choice === choiceAnswer;
		const feedback = $("#rh-feedback");
		feedback.className = `answer-feedback rh-feedback ${correct ? "is-correct" : "is-incorrect"}`;
		feedback.innerHTML = `${correct ? "Correct!" : `Not quite. The answer is <strong>${escapeHtml(choiceAnswer)}</strong>.`}
			<span class="rh-answer-line" lang="ja">${renderBreakGuideSentence(item, targetBreak)}</span>
			<span class="rh-translation">${escapeHtml(task.type === "main" ? item.en : classifyBreakRole(item, targetBreak).explanation)}</span>`;
		document.querySelectorAll(".rh-choice-option").forEach((button) => {
			button.disabled = true;
			const value = button.dataset.choice;
			button.classList.toggle("is-correct", value === choiceAnswer);
			button.classList.toggle("is-incorrect", value === choice && value !== choiceAnswer);
		});
		els.hero.classList.add(correct ? "is-correct" : "is-incorrect");
		const next = $("#rh-next");
		next.hidden = false;
		next.focus();
		recordResult(correct, `${task.type}: ${renderBreakGuideSentence(item, targetBreak)} → ${escapeHtml(choiceAnswer)}`);
	}

	function renderQuoteQuestion() {
		const item = session.items[(session.index - 1) % session.items.length];
		const task = chooseQuoteTask();
		if (task.type === "mark") return renderMarking(item, task);
		const reporter = quoteReporter(item);
		const verb = quoteVerbInfo(item);
		const force = quoteForceInfo(item);
		const answer = task.type === "source" ? reporter : task.type === "verb" ? verb.label : force.label;
		const options = task.type === "source"
			? quoteReporterOptions(answer, quoteBank)
			: task.type === "verb"
				? quoteChoiceOptions(answer, quoteVerbChoices)
				: quoteChoiceOptions(answer, quoteForceChoices);
		session.current = { item, task, choiceAnswer: answer, reporter, verb, force };
		els.hero.innerHTML = `<p class="rh-hero-label">${task.type === "source" ? "Who owns this quote/thought?" : task.type === "verb" ? "How is the quote reported?" : "What is the quote doing?"}</p><p class="rh-sentence" lang="ja">${renderQuoteGuideSentence(item, true)}</p>`;
		els.band.textContent = task.type === "source" ? "Who said, thought, wrote, or reported it?" : task.type === "verb" ? "What kind of reporting verb follows the quote?" : "What is the force of the quoted content?";
		els.body.innerHTML = `
			<div class="rh-choice-list" role="group" aria-label="Quote choices">
				${options.map((option) => `<button type="button" class="rh-choice-option" data-choice="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join("")}
			</div>
			<p class="answer-feedback rh-feedback" id="rh-feedback" aria-live="polite"></p>
			<div class="rh-hint-table"><h4>Reading move</h4><p>${task.type === "source" ? "Look before the quote for は, が, では, で, or に. Signs and emails can also be the source." : task.type === "verb" ? "The verb after と tells whether this is speech, thought, writing, explanation, news, or a question." : "Read the quoted content itself: is it an instruction, rule, plan, guess, feeling, or information?"}</p></div>
			<button class="practice-start rh-next" id="rh-next" type="button" hidden>Next →</button>`;
	}

	function checkQuoteChoice(choice) {
		const { item, task, choiceAnswer, verb, force } = session.current;
		const correct = choice === choiceAnswer;
		const feedback = $("#rh-feedback");
		const explanation = task.type === "verb" ? verb.explanation : task.type === "force" ? force.explanation : `The source before the quote points to ${choiceAnswer}.`;
		feedback.className = `answer-feedback rh-feedback ${correct ? "is-correct" : "is-incorrect"}`;
		feedback.innerHTML = `${correct ? "Correct!" : `Not quite. The answer is <strong>${escapeHtml(choiceAnswer)}</strong>.`}
			<span class="rh-answer-line" lang="ja">${renderQuoteGuideSentence(item, true)}</span>
			<span class="rh-translation">${escapeHtml(explanation)}</span>`;
		document.querySelectorAll(".rh-choice-option").forEach((button) => {
			button.disabled = true;
			const value = button.dataset.choice;
			button.classList.toggle("is-correct", value === choiceAnswer);
			button.classList.toggle("is-incorrect", value === choice && value !== choiceAnswer);
		});
		els.hero.classList.add(correct ? "is-correct" : "is-incorrect");
		const next = $("#rh-next");
		next.hidden = false;
		next.focus();
		recordResult(correct, `${task.type}: ${renderQuoteGuideSentence(item, true)} → ${escapeHtml(choiceAnswer)}`);
	}

	/* ---------- Modes 2 & 3 rendering ---------- */
	function renderMarking(presetItem = null, presetTask = null) {
		const item = presetItem || session.items[(session.index - 1) % session.items.length];
		const isBreaks = session.mode === "breaks";
		session.current = { item, task: presetTask, breaks: new Set(), start: null, end: null };
		els.hero.innerHTML = `<p class="rh-hero-label">${isBreaks ? "Tap between words to add a /" : "Tap where the quote starts, then where it ends"}</p><p class="rh-sentence" id="rh-sentence" lang="ja"></p>`;
		els.band.textContent = isBreaks ? "Where are the breaks in this sentence?" : "What was said, thought or written?";
		els.body.innerHTML = `
			<div class="rh-actions">
				<button class="worksheet-control" id="rh-reset" type="button">Reset</button>
				<button class="practice-start rh-check" id="rh-check" type="button">Check</button>
			</div>
			<p class="answer-feedback rh-feedback" id="rh-feedback" aria-live="polite"></p>
			${isBreaks ? `<div class="rh-hint-table" lang="ja"><h4>Breaks often come after</h4><ul>
				<li>〜が／〜けれども</li><li>〜ないで／〜なくて</li><li>〜ので／〜から／〜ため(に)</li><li>〜前に／〜あとで／〜てから</li>
				<li>〜ために／〜ように</li><li>〜とき／〜間(に)</li><li>〜し</li><li>〜たら／〜と／〜ば／〜なら</li><li>〜て</li><li>〜ても／〜でも／〜のに</li></ul></div>` : `<div class="rh-hint-table"><h4>Look for</h4><p lang="ja">〜と言う／言った／言いました　〜と思う　〜と考える　〜と書いてある　〜と聞く</p><p>The quote ends just before the と. Don't include the と or the verb.</p></div>`}
			<button class="practice-start rh-next" id="rh-next" type="button" hidden>Next →</button>`;
		drawSentence();
	}

	function drawSentence(checked = false) {
		const { item } = session.current;
		const isBreaks = session.mode === "breaks";
		const chars = [...item.text];
		const marks = (position) => {
			if (isBreaks) return session.current.breaks.has(position) ? "/" : "";
			const parts = [];
			if (session.current.start === position) parts.push("「");
			if (session.current.end === position) parts.push("」");
			return parts.join("");
		};
		const gap = (position) => {
			const mark = marks(position);
			return `<button type="button" class="rh-gap${mark ? " is-marked" : ""}" data-gap="${position}" aria-label="${isBreaks ? "Break" : "Quote mark"} before character ${position + 1}" ${checked ? "disabled" : ""}>${mark}</button>`;
		};
		const firstGap = isBreaks ? 1 : 0;
		const lastGap = isBreaks ? chars.length - 1 : chars.length;
		$("#rh-sentence").innerHTML = chars.map((char, index) => `${index >= firstGap && index <= lastGap ? gap(index) : ""}<span class="rh-char">${escapeHtml(char)}</span>`).join("") + (lastGap === chars.length ? gap(chars.length) : "");
	}

	function placeQuoteMark(position) {
		const current = session.current;
		if (current.start === null || current.end !== null || position <= current.start) {
			current.start = position;
			current.end = null;
		} else {
			current.end = position;
		}
	}

	function renderAnswerSentence(item, kind, marks) {
		const chars = [...item.text];
		let out = "";
		chars.forEach((char, index) => {
			if (kind === "breaks" && marks.breaks.has(index) && index > 0) out += '<span class="rh-answer-mark">/</span>';
			const quoteClass = marks.targetQuote ? " rh-quote-target" : "";
			if (kind === "quotes" && marks.start === index) out += `<span class="rh-answer-mark${quoteClass}">「</span>`;
			if (kind === "quotes" && marks.end === index) out += `<span class="rh-answer-mark${quoteClass}">」</span>`;
			out += escapeHtml(char);
		});
		if (kind === "quotes" && marks.end === chars.length) out += `<span class="rh-answer-mark${marks.targetQuote ? " rh-quote-target" : ""}">」</span>`;
		return out;
	}

	function checkMarking() {
		const { item, breaks, start, end } = session.current;
		const isBreaks = session.mode === "breaks";
		const feedback = $("#rh-feedback");
		let correct;
		let detail;
		if (isBreaks) {
			const answer = new Set(item.breaks);
			const hit = [...breaks].filter((position) => answer.has(position)).length;
			const extra = breaks.size - hit;
			correct = hit === answer.size && extra === 0;
			detail = `${hit} of ${answer.size} breaks found${extra ? `, ${extra} extra` : ""}.`;
		} else {
			correct = start === item.start && end === item.end;
			detail = start === null || end === null ? "The quote needs a start 「 and an end 」." : correct ? "" : "Check where the quoted words begin and where the と follows.";
		}
		feedback.className = `answer-feedback rh-feedback ${correct ? "is-correct" : "is-incorrect"}`;
		feedback.innerHTML = `${correct ? "Correct!" : `Not quite. ${escapeHtml(detail)}`}
			<span class="rh-answer-line" lang="ja">${renderAnswerSentence(item, session.mode, isBreaks ? { breaks: new Set(item.breaks) } : item)}</span>
			<span class="rh-translation">${escapeHtml(item.en)}</span>`;
		drawSentence(true);
		els.hero.classList.add(correct ? "is-correct" : "is-incorrect");
		$("#rh-check").hidden = true;
		$("#rh-reset").hidden = true;
		const next = $("#rh-next");
		next.hidden = false;
		next.focus();
		const label = isBreaks ? renderAnswerSentence(item, "breaks", { breaks: new Set(item.breaks) }) : renderAnswerSentence(item, "quotes", item);
		recordResult(correct, label);
	}

	/* ---------- Events ---------- */
	els.setup.addEventListener("click", (event) => {
		const button = event.target.closest("[data-rh-start]");
		if (button) startSession(button.dataset.rhStart);
	});
	els.home.addEventListener("click", leaveSession);
	els.menu.addEventListener("click", showSetup);
	els.again.addEventListener("click", () => startSession(session.mode));

	els.session.addEventListener("click", (event) => {
		if (!session) return;
		els.hero.classList.remove("is-correct", "is-incorrect");
		const choice = event.target.closest(".rh-choice-option");
		if (choice && !session.checked) {
			if (session.mode === "passages") checkPassageChoice(choice.dataset.choice);
			else if (session.mode === "agents") checkAgentChoice(choice.dataset.choice);
			else if (session.mode === "mood") checkMoodChoice(choice.dataset.choice);
			else if (session.mode === "stack" && session.current.task?.type !== "order") checkStackChoice(choice.dataset.choice);
			else if (session.mode === "breaks" && session.current.task?.type !== "mark") checkBreakChoice(choice.dataset.choice);
			else if (session.mode === "quotes" && session.current.task?.type !== "mark") checkQuoteChoice(choice.dataset.choice);
			return;
		}
		const gap = event.target.closest(".rh-gap");
		if (gap && !session.checked) {
			const position = Number(gap.dataset.gap);
			if (session.mode === "breaks") {
				if (session.current.breaks.has(position)) session.current.breaks.delete(position);
				else session.current.breaks.add(position);
			} else {
				placeQuoteMark(position);
			}
			drawSentence();
			return;
		}
		const item = event.target.closest(".rh-table-item");
		if (item && !session.checked) {
			if (session.current.entered.length < 6) setEntered([...session.current.entered, item.dataset.letter]);
			$("#rh-answer-input").focus();
			return;
		}
		if (event.target.closest("#rh-undo")) setEntered(session.current.entered.slice(0, -1));
		if (event.target.closest("#rh-reset") && !session.checked) {
			Object.assign(session.current, { breaks: new Set(), start: null, end: null });
			drawSentence();
		}
		if (event.target.closest("#rh-check") && !session.checked) checkMarking();
		if (event.target.closest("#rh-next")) nextQuestion();
	});

	els.session.addEventListener("input", (event) => {
		if (event.target.id !== "rh-answer-input" || !session || session.checked) return;
		const typed = [...event.target.value.toLowerCase()].filter((char) => letters.includes(char)).slice(0, 6);
		setEntered(typed);
	});

	els.session.addEventListener("submit", (event) => {
		event.preventDefault();
		if (!session || session.checked || session.mode !== "stack") return;
		if (!session.current.entered.length) return;
		checkStack();
	});
})();
