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
		a: { form: "〜た", name: "Past tense" },
		b: { form: "〜ない", name: "Negative" },
		c: { form: "〜たい", name: "Volition (want to)" },
		d: { form: "〜かもしれない", name: "Inference" },
		e: { form: "〜てくれる", name: "Benefactive (granting a favor)" },
		f: { form: "〜ておく", name: "Readiness" },
		g: { form: "〜てください", name: "Request" },
		h: { form: "〜れる・られる", name: "Passive" },
		i: { form: "可能動詞", name: "Possibility" },
		j: { form: "〜く／になる", name: "Change" },
		k: { form: "〜ので", name: "Cause / reason" },
		l: { form: "〜てもらう", name: "Benefactive (receiving a favor)" },
		m: { form: "〜ないで", name: "Attendant circumstances (without doing)" },
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
	].map(([marked, en]) => ({ ...parseMarked(marked, "[]"), en }));

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
		const bank = mode === "breaks" ? breakBank : mode === "quotes" ? quoteBank : null;
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
		els.title.textContent = { stack: "Grammar stacking complete", breaks: "Sentence breaks complete", quotes: "Said & thought complete" }[mode];
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
		session.current = { word, chain, answer, entered: [] };
		const finalText = kanjiForm(chain.at(-1).state.text, word);

		els.hero.innerHTML = `
			<p class="rh-hero-label">Starting verb</p>
			<p class="rh-from"><span lang="ja">${escapeHtml(word.kanji || word.reading)}</span>${word.kanji && word.reading !== word.kanji ? ` <small lang="ja">${escapeHtml(word.reading)}</small>` : ""} <small>${escapeHtml(word.meaning || "")}</small></p>
			<p class="rh-arrow" aria-hidden="true">↓</p>
			<p class="rh-target" lang="ja">${escapeHtml(finalText)}</p>`;
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
		const steps = chain.map((step, index) => `<li><span class="rh-step-num">${"①②③④"[index]}</span><span lang="ja">${escapeHtml(kanjiForm(step.state.text, word))}</span><b>${step.letter}</b><small>${transforms[step.letter].name}</small></li>`).join("");
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

	/* ---------- Modes 2 & 3 rendering ---------- */
	function renderMarking() {
		const item = session.items[(session.index - 1) % session.items.length];
		const isBreaks = session.mode === "breaks";
		session.current = { item, breaks: new Set(), start: null, end: null };
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
			if (kind === "quotes" && marks.start === index) out += '<span class="rh-answer-mark">「</span>';
			if (kind === "quotes" && marks.end === index) out += '<span class="rh-answer-mark">」</span>';
			out += escapeHtml(char);
		});
		if (kind === "quotes" && marks.end === chars.length) out += '<span class="rh-answer-mark">」</span>';
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
