let words = [
	{ id: 1, kanji: "水", reading: "みず", romaji: "mizu", meaning: "water", part: "noun", category: "Everyday", level: "N5", example: "水をください。", translation: "Water, please." },
	{ id: 2, kanji: "ありがとう", reading: "ありがとう", romaji: "arigatou", meaning: "thank you", part: "expression", category: "Greetings", level: "N5", example: "ありがとう！助かりました。", translation: "Thank you! That was a big help." },
	{ id: 3, kanji: "食べる", reading: "たべる", romaji: "taberu", meaning: "to eat", part: "verb", category: "Food", level: "N5", example: "りんごを食べます。", translation: "I eat an apple." },
	{ id: 4, kanji: "猫", reading: "ねこ", romaji: "neko", meaning: "cat", part: "noun", category: "Animals", level: "N5", example: "猫がいます。", translation: "There is a cat." },
	{ id: 5, kanji: "こんにちは", reading: "こんにちは", romaji: "konnichiwa", meaning: "hello; good afternoon", part: "greeting", category: "Greetings", level: "N5", example: "こんにちは、田中さん。", translation: "Hello, Tanaka." },
	{ id: 6, kanji: "友達", reading: "ともだち", romaji: "tomodachi", meaning: "friend", part: "noun", category: "People", level: "N5", example: "友達と映画を見ます。", translation: "I watch a movie with a friend." },
	{ id: 7, kanji: "おいしい", reading: "おいしい", romaji: "oishii", meaning: "delicious", part: "い-adjective", category: "Food", level: "N5", example: "このケーキはおいしいです。", translation: "This cake is delicious." },
	{ id: 8, kanji: "学校", reading: "がっこう", romaji: "gakkou", meaning: "school", part: "noun", category: "Places", level: "N5", example: "学校へ行きます。", translation: "I’m going to school." },
	{ id: 9, kanji: "見る", reading: "みる", romaji: "miru", meaning: "to see; to watch", part: "verb", category: "Everyday", level: "N5", example: "テレビを見ます。", translation: "I watch TV." },
	{ id: 10, kanji: "時間", reading: "じかん", romaji: "jikan", meaning: "time; an hour", part: "noun", category: "Everyday", level: "N5", example: "時間がありますか。", translation: "Do you have time?" },
	{ id: 11, kanji: "きれい", reading: "きれい", romaji: "kirei", meaning: "beautiful; clean", part: "な-adjective", category: "Everyday", level: "N5", example: "きれいな花ですね。", translation: "What a beautiful flower." },
	{ id: 12, kanji: "勉強", reading: "べんきょう", romaji: "benkyou", meaning: "study; to study", part: "noun / する-verb", category: "Everyday", level: "N4", example: "毎日、日本語を勉強します。", translation: "I study Japanese every day." }
];

let categories = ["All words", ...new Set(words.map((word) => word.category))];
let grammarEntries = [];
const selectedGrammarIds = new Set();
const searchInput = document.querySelector("#search-input");
const wordGrid = document.querySelector("#word-grid");
const wordDetail = document.querySelector("#word-detail");
const categoryList = document.querySelector("#category-list");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const pageStatus = document.querySelector("#page-status");
const loadMoreButton = document.querySelector("#load-more");
const levelFilter = document.querySelector("#level-filter");
const favoritesToggle = document.querySelector("#favorites-toggle");
const savedCount = document.querySelector("#saved-count");
const grammarSearch = document.querySelector("#grammar-search");
const grammarLevelFilter = document.querySelector("#grammar-level-filter");
const grammarGrid = document.querySelector("#grammar-grid");
const grammarDetail = document.querySelector("#grammar-detail");
const grammarCount = document.querySelector("#grammar-count");
const grammarPageStatus = document.querySelector("#grammar-page-status");
const grammarLoadMoreButton = document.querySelector("#grammar-load-more");
const grammarEmpty = document.querySelector("#grammar-empty");
const worksheetSelectionStatus = document.querySelector("#worksheet-selection-status");
const worksheetSelectVisibleButton = document.querySelector("#worksheet-select-visible");
const worksheetClearSelectionButton = document.querySelector("#worksheet-clear-selection");
const worksheetGenerateButton = document.querySelector("#worksheet-generate");
const worksheetOutput = document.querySelector("#worksheet-output");
const vocabularyTab = document.querySelector("#vocabulary-tab");
const grammarTab = document.querySelector("#grammar-tab");
const practiceTab = document.querySelector("#practice-tab");
const conjugationTab = document.querySelector("#conjugation-tab");
const nominalConjugationTab = document.querySelector("#nominal-conjugation-tab");
const vocabularyPanel = document.querySelector("#vocabulary-panel");
const grammarPanel = document.querySelector("#grammar-panel");
const practicePanel = document.querySelector("#practice-panel");
const conjugationPanel = document.querySelector("#conjugation-panel");
const nominalConjugationPanel = document.querySelector("#nominal-conjugation-panel");
const practiceLevel = document.querySelector("#practice-level");
const practiceDueCount = document.querySelector("#practice-due-count");
const practiceNewCount = document.querySelector("#practice-new-count");
const practiceStreak = document.querySelector("#practice-streak");
const practiceQueueSummary = document.querySelector("#practice-queue-summary");
const startLearningButton = document.querySelector("#start-learning");
const startReviewingButton = document.querySelector("#start-reviewing");
const startCalibrationButton = document.querySelector("#start-calibration");
const startQuickCheckButton = document.querySelector("#start-quick-check");
const calibrationLastResult = document.querySelector("#calibration-last-result");
const practiceRequiredCheck = document.querySelector("#practice-required-check");
const practiceWelcome = document.querySelector("#practice-welcome");
const practiceSession = document.querySelector("#practice-session");
const practiceComplete = document.querySelector("#practice-complete");
const practiceCompleteSummary = document.querySelector("#practice-complete-summary");
const practiceCompleteKicker = document.querySelector("#practice-complete .practice-kicker");
const practiceCompleteTitle = document.querySelector("#practice-complete h3");
const calibrationResults = document.querySelector("#calibration-results");
const calibrationRecommendation = document.querySelector("#calibration-recommendation");
const calibrationScoreList = document.querySelector("#calibration-score-list");
const practiceSessionLabel = document.querySelector("#practice-session-label");
const practiceProgressBar = document.querySelector("#practice-progress-bar");
const practiceModeLabel = document.querySelector("#practice-mode-label");
const learningCard = document.querySelector("#learning-card");
const learningWord = document.querySelector("#learning-word");
const learningReading = document.querySelector("#learning-reading");
const learningRomaji = document.querySelector("#learning-romaji");
const learningMeaning = document.querySelector("#learning-meaning");
const learningExample = document.querySelector("#learning-example");
const learningNextButton = document.querySelector("#learning-next");
const typedReviewCard = document.querySelector("#typed-review-card");
const typedReviewPrompt = document.querySelector("#typed-review-prompt");
const typedReviewWord = document.querySelector("#typed-review-word");
const typedReviewReading = document.querySelector("#typed-review-reading");
const typedReviewExample = document.querySelector("#typed-review-example");
const answerForm = document.querySelector("#practice-answer-form");
const checkAnswerButton = document.querySelector("#check-answer-button");
const answerInput = document.querySelector("#practice-answer");
const answerFeedback = document.querySelector("#answer-feedback");
const wrongAnswerInfo = document.querySelector("#wrong-answer-info");
const practiceOverrideButton = document.querySelector("#practice-override");
const answerContinueButton = document.querySelector("#answer-continue");
const useCalibrationLevelButton = document.querySelector("#use-calibration-level");
const conjugationLevel = document.querySelector("#conjugation-level");
const conjugationIncludePrevious = document.querySelector("#conjugation-include-previous");
const conjugationPatternPicker = document.querySelector("#conjugation-pattern-picker");
const conjugationPatternOptions = document.querySelector("#conjugation-pattern-options");
const conjugationPatternSummary = document.querySelector("#conjugation-pattern-summary");
const conjugationSetup = document.querySelector("#conjugation-setup");
const conjugationMode = document.querySelector("#conjugation-mode");
const conjugationQuestionCount = document.querySelector("#conjugation-question-count");
const conjugationCountControl = document.querySelector("#conjugation-count-control");
const conjugationStartButton = document.querySelector("#conjugation-start");
const conjugationStatus = document.querySelector("#conjugation-status");
const conjugationSession = document.querySelector("#conjugation-session");
const conjugationComplete = document.querySelector("#conjugation-complete");
const conjugationCompleteTitle = document.querySelector("#conjugation-complete-title");
const conjugationLiveStats = document.querySelector("#conjugation-live-stats");
const conjugationLiveAccuracy = document.querySelector("#conjugation-live-accuracy");
const conjugationLiveAttempts = document.querySelector("#conjugation-live-attempts");
const conjugationLiveStreak = document.querySelector("#conjugation-live-streak");
const conjugationLiveBest = document.querySelector("#conjugation-live-best");
const conjugationLiveWorst = document.querySelector("#conjugation-live-worst");
const conjugationProgressLabel = document.querySelector("#conjugation-progress-label");
const conjugationProgressBar = document.querySelector("#conjugation-progress-bar");
const conjugationPatternName = document.querySelector("#conjugation-pattern-name");
const conjugationWord = document.querySelector("#conjugation-word");
const conjugationReading = document.querySelector("#conjugation-reading");
const conjugationMeaning = document.querySelector("#conjugation-meaning");
const conjugationAnswerForm = document.querySelector("#conjugation-answer-form");
const conjugationAnswer = document.querySelector("#conjugation-answer");
const conjugationCheckButton = document.querySelector("#conjugation-check");
const conjugationFeedback = document.querySelector("#conjugation-feedback");
const conjugationCorrection = document.querySelector("#conjugation-correction");
const conjugationTryAgainButton = document.querySelector("#conjugation-try-again");
const conjugationNextButton = document.querySelector("#conjugation-next");
const conjugationResult = document.querySelector("#conjugation-result");
const conjugationFinalAccuracy = document.querySelector("#conjugation-final-accuracy");
const conjugationFinalAttempts = document.querySelector("#conjugation-final-attempts");
const conjugationFinalBest = document.querySelector("#conjugation-final-best");
const conjugationFinalWorst = document.querySelector("#conjugation-final-worst");
const conjugationFinalCurrentStreak = document.querySelector("#conjugation-final-current-streak");
const conjugationFinalStreak = document.querySelector("#conjugation-final-streak");
const nominalConjugationLevel = document.querySelector("#nominal-conjugation-level");
const nominalConjugationType = document.querySelector("#nominal-conjugation-type");
const nominalIncludePrevious = document.querySelector("#nominal-include-previous");
const nominalConjugationPatternPicker = document.querySelector("#nominal-conjugation-pattern-picker");
const nominalConjugationPatternOptions = document.querySelector("#nominal-conjugation-pattern-options");
const nominalConjugationPatternSummary = document.querySelector("#nominal-conjugation-pattern-summary");
const nominalConjugationMode = document.querySelector("#nominal-conjugation-mode");
const nominalQuestionCount = document.querySelector("#nominal-question-count");
const nominalQuestionCountControl = document.querySelector("#nominal-question-count-control");
const nominalConjugationStartButton = document.querySelector("#nominal-conjugation-start");
const nominalConjugationStatus = document.querySelector("#nominal-conjugation-status");
const nominalConjugationSetup = document.querySelector("#nominal-conjugation-setup");
let selectedVerbPatternIds = null;
let selectedNominalPatternIds = null;

let activeCategory = "All words";
let selectedId = String(words[0].id);
let showFavoritesOnly = false;
const pageSize = 60;
let renderedLimit = pageSize;
const grammarPageSize = 24;
let grammarRenderedLimit = grammarPageSize;
let selectedGrammarId = null;
let savedWords = new Set();
const reviewStorageKey = "kotoba-review-progress-v1";
const streakStorageKey = "kotoba-practice-streak-v1";
const quickCheckStorageKey = "kotoba-quick-check-v1";
const calibrationStorageKey = "kotoba-calibration-result-v1";
const dailyNewLimit = 10;
const dailyReviewLimit = 30;
let reviewProgress = {};
let streakData = { count: 0, lastDate: "" };
let pendingQuickCheckIds = [];
let calibrationResult = null;
let calibrationScores = null;
let practiceQueue = [];
let practiceQueueIndex = 0;
let practiceSessionCompleted = 0;
let practiceMode = "";
let conjugationQueue = [];
let conjugationIndex = 0;
let conjugationAnswered = false;
let conjugationQuestionNumber = 1;
let conjugationStats = null;
let activeConjugationConfig = null;

try {
	savedWords = new Set(JSON.parse(localStorage.getItem("kotoba-saved-words") || "[]").map(String));
} catch {
	savedWords = new Set();
}

try {
	reviewProgress = JSON.parse(localStorage.getItem(reviewStorageKey) || "{}");
	streakData = { ...streakData, ...JSON.parse(localStorage.getItem(streakStorageKey) || "{}") };
	pendingQuickCheckIds = JSON.parse(localStorage.getItem(quickCheckStorageKey) || "[]").map(String);
	calibrationResult = JSON.parse(localStorage.getItem(calibrationStorageKey) || "null");
} catch {
	reviewProgress = {};
	pendingQuickCheckIds = [];
	calibrationResult = null;
}

function escapeHtml(value) {
	return String(value).replace(/[&<>"']/g, (character) => ({
		"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
	})[character]);
}

function activateTab(tabName) {
	const tabs = [
		{ name: "vocabulary", tab: vocabularyTab, panel: vocabularyPanel },
		{ name: "grammar", tab: grammarTab, panel: grammarPanel },
		{ name: "practice", tab: practiceTab, panel: practicePanel },
		{ name: "conjugation", tab: conjugationTab, panel: conjugationPanel },
		{ name: "nominal-conjugation", tab: nominalConjugationTab, panel: nominalConjugationPanel }
	];
	tabs.forEach(({ name, tab, panel }) => {
		const active = name === tabName;
		tab.classList.toggle("is-active", active);
		tab.setAttribute("aria-selected", String(active));
		tab.tabIndex = active ? 0 : -1;
		panel.hidden = !active;
		panel.setAttribute("aria-hidden", String(!active));
	});
}

function getVisibleWords() {
	const query = searchInput.value.trim().toLocaleLowerCase();
	return words.filter((word) => {
		const matchesQuery = !query || [word.kanji, word.reading, word.romaji, word.meaning, word.category]
			.some((value) => value.toLocaleLowerCase().includes(query));
		const matchesCategory = activeCategory === "All words" || word.category === activeCategory;
		const matchesLevel = levelFilter.value === "all" || word.level === levelFilter.value;
		const matchesFavorites = !showFavoritesOnly || savedWords.has(String(word.id));
		return matchesQuery && matchesCategory && matchesLevel && matchesFavorites;
	});
}

function categoryFromPartsOfSpeech(partsOfSpeech = []) {
	if (partsOfSpeech.some((part) => part.startsWith("v"))) return "Verbs";
	if (partsOfSpeech.some((part) => part.startsWith("adj"))) return "Adjectives";
	if (partsOfSpeech.some((part) => ["prt", "conj", "int", "exp", "aux", "ctr"].includes(part))) return "Expressions";
	if (partsOfSpeech.some((part) => part.startsWith("n"))) return "Nouns";
	return "Basics";
}

function renderJapaneseWithFurigana(example) {
	if (!example) return "";
	return example.furigana
		? escapeHtml(example.furigana).replace(/\{([^{}|]+)\|([^{}|]+)\}/g, "<ruby>$1<rt>$2</rt></ruby>")
		: escapeHtml(example.ja || "");
}

async function loadVocabulary() {
	const status = document.querySelector("#data-status");
	const levels = ["N5", "N4", "N3", "N2", "N1"];
	try {
		const posLabelsPromise = fetch("https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/pos.json")
			.then((response) => response.ok ? response.json() : {})
			.catch(() => ({}));
		const [datasets, posLabels] = await Promise.all([Promise.all(levels.map(async (level) => {
			const response = await fetch(`https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/vocab/${level.toLowerCase()}.json`);
			if (!response.ok) throw new Error(`${level} vocabulary request failed (${response.status})`);
			const dataset = await response.json();
			if (!Array.isArray(dataset) || dataset.length === 0) throw new Error(`The ${level} vocabulary dataset was empty.`);
			return dataset;
		})), posLabelsPromise]);
		words = datasets.flatMap((dataset, index) => dataset.map((entry) => {
			const category = categoryFromPartsOfSpeech(entry.pos);
			return {
				id: String(entry.id),
				kanji: entry.word,
				reading: entry.reading || entry.word,
				romaji: entry.romaji || "",
				meaning: Array.isArray(entry.meanings) ? entry.meanings.join("; ") : String(entry.meanings || ""),
				meaningAnswers: Array.isArray(entry.meanings) ? entry.meanings : [String(entry.meanings || "")],
				part: category,
				partsOfSpeech: (entry.pos || []).map((code) => posLabels[code] || code),
				posCodes: entry.pos || [],
				otherForms: entry.other_forms || [],
				otherReadings: entry.other_readings || [],
				pitchAccent: entry.pitch_accent ?? entry.pitchAccent ?? entry.accent_number ?? entry.accentNumber ?? entry.pitch?.accent ?? null,
				category,
				level: entry.level || levels[index],
				examples: entry.examples || []
			};
		}));
		categories = ["All words", ...new Set(words.map((word) => word.category))];
		activeCategory = "All words";
		selectedId = words[0].id;
		renderedLimit = pageSize;
		renderCategories();
		renderWords();
		status.textContent = `${words.length.toLocaleString()} vocabulary entries loaded across N5–N1. JLPT levels are community approximations.`;
		updatePracticeDashboard();
		updateConjugationSetup();
		updateNominalConjugationSetup();
	} catch (error) {
		status.textContent = `Could not load the full N1–N5 lists; showing the ${words.length} built-in sample words. Open this page through a local web server and check your internet connection to load all entries.`;
		console.warn("Could not load the JLPT vocabulary datasets:", error);
		updatePracticeDashboard();
		updateConjugationSetup();
		updateNominalConjugationSetup();
	}
}

async function loadGrammar() {
	const status = document.querySelector("#grammar-status");
	const levels = ["N5", "N4", "N3", "N2", "N1"];
	try {
		const datasets = await Promise.all(levels.map(async (level) => {
			const response = await fetch(`https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/grammar/${level.toLowerCase()}.json`);
			if (!response.ok) throw new Error(`${level} grammar request failed (${response.status})`);
			const dataset = await response.json();
			if (!Array.isArray(dataset)) throw new Error(`The ${level} grammar dataset was invalid.`);
			return dataset;
		}));
		grammarEntries = datasets.flat();
		selectedGrammarId = grammarEntries[0]?.id ?? null;
		renderGrammar();
		status.textContent = `${grammarEntries.length} grammar patterns loaded across N5–N1. OpenJLPT grammar explanations are community learning material.`;
	} catch (error) {
		status.textContent = "Could not load grammar data. Check your internet connection and reload the page.";
		console.warn("Could not load the JLPT grammar datasets:", error);
	}
}

function renderCategories() {
	categoryList.innerHTML = categories.map((category) => `
		<button class="category-chip" type="button" data-category="${escapeHtml(category)}" aria-pressed="${category === activeCategory}">
			${escapeHtml(category)}
		</button>
	`).join("");
}

function renderDetail(word) {
	if (!word) {
		wordDetail.innerHTML = "<p class=\"detail-meaning\">Choose a word to see its details.</p>";
		return;
	}
	const partLabels = word.partsOfSpeech?.length ? word.partsOfSpeech : [word.part];
	const alternateForms = (word.otherForms || []).map((form) => `<span lang="ja">${escapeHtml(form)}</span>`);
	const alternateReadings = (word.otherReadings || []).map((reading) => `<span lang="ja">${escapeHtml(reading)}</span>`);
	const pitchAccents = normalizePitchAccents(word.pitchAccent);
	const pitchAccentMarkup = pitchAccents.length
		? `<div class="pitch-accent-list"><p class="pitch-accent-label">PITCH ACCENT</p>${pitchAccents.map((accent) => renderPitchAccent(word.reading, accent)).join("")}</div>`
		: `<p class="pitch-accent-unavailable">Pitch-accent notation isn’t included for this word.</p>`;
	const examples = word.examples?.length ? word.examples : (word.example ? [{ ja: word.example, en: word.translation }] : []);
	const examplesMarkup = examples.map((example) => {
		const japanese = renderJapaneseWithFurigana(example);
		return `
			<div class="example-item">
				<p class="example-japanese" lang="ja">${japanese}</p>
				<p class="example-translation">${escapeHtml(example.en || "")}</p>
			</div>
		`;
	}).join("");
	wordDetail.innerHTML = `
		<h2 class="detail-kanji" id="detail-word" lang="ja">${escapeHtml(word.kanji)}</h2>
		<p class="detail-reading" lang="ja">${escapeHtml(word.reading)}</p>
		<span class="detail-romaji">${escapeHtml(word.romaji)}</span>
		<div class="pronunciation-row">
			<button class="pronunciation-button" type="button" data-pronounce="${escapeHtml(word.reading || word.kanji)}" aria-label="Listen to ${escapeHtml(word.kanji)} pronunciation"><span aria-hidden="true">♫</span> Listen</button>
			<span class="pronunciation-hint">Device Japanese voice</span>
		</div>
		${pitchAccentMarkup}
		<p class="pronunciation-status" id="pronunciation-status" aria-live="polite"></p>
		${alternateForms.length || alternateReadings.length ? `
			<div class="detail-alternates">
				${alternateForms.length ? `<p><span>Other forms</span>${alternateForms.join("、")}</p>` : ""}
				${alternateReadings.length ? `<p><span>Other readings</span>${alternateReadings.join("、")}</p>` : ""}
			</div>
		` : ""}
		<p class="detail-meaning">${escapeHtml(word.meaning)}</p>
		<p class="detail-part">${partLabels.map(escapeHtml).join(" · ")}</p>
		<p class="detail-level">JLPT ${escapeHtml(word.level)}</p>
		<div class="detail-divider"></div>
		<p class="example-label">IN A SENTENCE</p>
		${examplesMarkup || "<p class=\"example-translation\">No example sentence available.</p>"}
	`;
}

function normalizePitchAccents(value) {
	const values = Array.isArray(value) ? value : value == null ? [] : [value];
	return values.map((item) => {
		if (Number.isInteger(item)) return item;
		if (typeof item === "string" && /^\d+$/.test(item.trim())) return Number(item);
		if (item && typeof item === "object") {
			const accent = item.downstep ?? item.accent ?? item.drop ?? item.accent_number ?? item.accentNumber;
			if (Number.isInteger(accent)) return accent;
			if (typeof accent === "string" && /^\d+$/.test(accent.trim())) return Number(accent);
		}
		return null;
	}).filter((accent) => accent !== null && accent >= 0);
}

function splitMora(reading) {
	const smallKana = new Set(["ぁ", "ぃ", "ぅ", "ぇ", "ぉ", "ゃ", "ゅ", "ょ", "ゎ", "ゕ", "ゖ"]);
	const morae = [];
	for (const character of reading) {
		if (smallKana.has(character) && morae.length) morae[morae.length - 1] += character;
		else morae.push(character);
	}
	return morae;
}

function renderPitchAccent(reading, downstep) {
	const morae = splitMora(reading);
	const contour = morae.map((mora, index) => {
		const high = downstep === 0 ? index > 0 : index < downstep;
		return `<span class="pitch-mora ${high ? "is-high" : "is-low"}" lang="ja"><span>${escapeHtml(mora)}</span><i aria-hidden="true"></i></span>`;
	}).join("");
	const kind = downstep === 0 ? "Heiban · flat" : downstep === 1 ? "Atamadaka · head-high" : `Nakadaka · drop after mora ${downstep}`;
	return `<div class="pitch-accent-entry"><div class="pitch-contour" aria-label="${escapeHtml(kind)}">${contour}<span class="pitch-particle ${downstep === 0 ? "is-high" : "is-low"}" aria-hidden="true">が</span></div><span class="pitch-accent-kind">${escapeHtml(kind)} (${downstep})</span></div>`;
}

function speakJapanese(text) {
	const status = document.querySelector("#pronunciation-status");
	if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
		status.textContent = "Speech playback isn’t supported by this browser.";
		return;
	}
	window.speechSynthesis.cancel();
	status.textContent = "Playing device-generated Japanese pronunciation. Pitch accent may vary by voice.";
	const utterance = new SpeechSynthesisUtterance(text);
	utterance.lang = "ja-JP";
	utterance.rate = 0.85;
	const japaneseVoice = window.speechSynthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith("ja"));
	if (japaneseVoice) utterance.voice = japaneseVoice;
	utterance.onerror = () => { status.textContent = "Couldn’t play the device’s Japanese voice."; };
	utterance.onend = () => { status.textContent = "Pronunciation finished. Device voices may not match standard Japanese pitch accent."; };
	window.speechSynthesis.speak(utterance);
}

function getVisibleGrammar() {
	const query = grammarSearch.value.trim().toLocaleLowerCase();
	return grammarEntries.filter((entry) => {
		const searchable = [entry.pattern, entry.reading, entry.romaji, entry.meaning, entry.formation, entry.notes, ...(entry.tags || [])];
		const matchesQuery = !query || searchable.some((value) => String(value || "").toLocaleLowerCase().includes(query));
		const matchesLevel = grammarLevelFilter.value === "all" || entry.level === grammarLevelFilter.value;
		return matchesQuery && matchesLevel;
	});
}

function renderGrammarDetail(entry) {
	if (!entry) {
		grammarDetail.innerHTML = "<p class=\"grammar-detail-empty\">Select a pattern to explore its meaning and examples.</p>";
		return;
	}
	const examplesMarkup = (entry.examples || []).map((example) => `
		<div class="example-item">
			<p class="example-japanese" lang="ja">${renderJapaneseWithFurigana(example)}</p>
			<p class="example-translation">${escapeHtml(example.en || "")}</p>
		</div>
	`).join("");
	grammarDetail.innerHTML = `
		<h3 class="grammar-detail-pattern" id="grammar-detail-pattern" lang="ja">${escapeHtml(entry.pattern)}</h3>
		${entry.reading ? `<p class="grammar-detail-reading" lang="ja">${escapeHtml(entry.reading)}</p>` : ""}
		<p class="grammar-detail-romaji">${escapeHtml(entry.romaji || "")}</p>
		<p class="grammar-detail-meaning">${escapeHtml(entry.meaning || "")}</p>
		<p class="grammar-detail-level">JLPT ${escapeHtml(entry.level)}</p>
		${entry.formation ? `<div class="grammar-formation"><span>FORMATION</span><p lang="ja">${escapeHtml(entry.formation)}</p></div>` : ""}
		${entry.tags?.length ? `<div class="grammar-tags">${entry.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
		${entry.notes ? `<div class="grammar-notes"><span>USAGE NOTE</span><p>${escapeHtml(entry.notes)}</p></div>` : ""}
		${examplesMarkup ? `<div class="grammar-examples"><p class="example-label">EXAMPLES</p>${examplesMarkup}</div>` : ""}
	`;
}

function updateWorksheetSelection() {
	const count = selectedGrammarIds.size;
	worksheetSelectionStatus.textContent = `${count} grammar point${count === 1 ? "" : "s"} selected`;
	worksheetGenerateButton.disabled = count === 0;
	worksheetClearSelectionButton.disabled = count === 0;
}

function renderGrammar() {
	const visibleEntries = getVisibleGrammar();
	if (!visibleEntries.some((entry) => entry.id === selectedGrammarId)) {
		selectedGrammarId = visibleEntries[0]?.id ?? null;
	}
	const displayedEntries = visibleEntries.slice(0, grammarRenderedLimit);
	grammarCount.textContent = `${visibleEntries.length.toLocaleString()} ${visibleEntries.length === 1 ? "pattern" : "patterns"}`;
	grammarEmpty.hidden = visibleEntries.length > 0;
	grammarGrid.hidden = visibleEntries.length === 0;
	grammarGrid.innerHTML = displayedEntries.map((entry) => `
		<article class="grammar-card-wrapper">
			<label class="grammar-worksheet-select"><input type="checkbox" data-worksheet-grammar="${escapeHtml(entry.id)}" ${selectedGrammarIds.has(entry.id) ? "checked" : ""}><span>Add to worksheet</span></label>
			<button class="grammar-card${entry.id === selectedGrammarId ? " is-selected" : ""}" type="button" data-grammar-id="${escapeHtml(entry.id)}" aria-pressed="${entry.id === selectedGrammarId}">
				<span class="grammar-card-top"><span class="grammar-pattern" lang="ja">${escapeHtml(entry.pattern)}</span><span class="word-level">${escapeHtml(entry.level)}</span></span>
				<span class="grammar-card-reading">${escapeHtml(entry.romaji || entry.reading || "")}</span>
				<span class="grammar-card-meaning">${escapeHtml(entry.meaning || "")}</span>
			</button>
		</article>
	`).join("");
	grammarPageStatus.textContent = visibleEntries.length > displayedEntries.length
		? `Showing ${displayedEntries.length} of ${visibleEntries.length.toLocaleString()} matching patterns`
		: "";
	grammarLoadMoreButton.hidden = visibleEntries.length <= displayedEntries.length;
	renderGrammarDetail(grammarEntries.find((entry) => entry.id === selectedGrammarId));
	updateWorksheetSelection();
}

function resetAndRenderGrammar() {
	grammarRenderedLimit = grammarPageSize;
	renderGrammar();
}

function renderGrammarWorksheet(entries) {
	const worksheetItems = entries.map((entry) => {
		const examples = (entry.examples || []).filter((example) => example?.ja && example?.en).slice(0, 2);
		return { entry, examples };
	});
	const questions = worksheetItems.flatMap(({ entry, examples }) => examples.length
		? examples.map((example) => ({ entry, prompt: example.en, answer: example.ja }))
		: [{ entry, prompt: `Write an original Japanese sentence using ${entry.pattern}.`, answer: "" }]);
	const today = new Date().toLocaleDateString();
	const questionMarkup = questions.map(({ entry, prompt }, index) => `
		<article class="worksheet-question">
			<p class="worksheet-question-number">${index + 1}. <span lang="ja">${escapeHtml(entry.pattern)}</span> · JLPT ${escapeHtml(entry.level)}</p>
			<p class="worksheet-prompt">${escapeHtml(prompt)}</p>
			<div class="worksheet-answer-lines" aria-hidden="true"></div>
			<div class="worksheet-answer-lines" aria-hidden="true"></div>
		</article>
	`).join("");
	const answerMarkup = questions.map(({ entry, prompt, answer }, index) => `
		<article class="worksheet-answer">
			<p><strong>${index + 1}. <span lang="ja">${escapeHtml(entry.pattern)}</span></strong> — ${escapeHtml(prompt)}</p>
			<p class="worksheet-answer-text" lang="ja">${answer ? escapeHtml(answer) : "Original answer; check that it uses the grammar point correctly."}</p>
		</article>
	`).join("");
	worksheetOutput.innerHTML = `
		<div class="worksheet-actions">
			<p>Worksheet generated with ${entries.length} selected grammar point${entries.length === 1 ? "" : "s"}.</p>
			<div><button class="worksheet-control" id="worksheet-close" type="button">Close worksheet</button><button class="practice-start" id="worksheet-print" type="button">Print worksheet</button></div>
		</div>
		<div class="worksheet-page">
			<header class="worksheet-header">
				<p class="eyebrow section-eyebrow">KOTOBA · GRAMMAR PRACTICE</p>
				<h2>Grammar worksheet</h2>
				<p>Translate each prompt into Japanese using the indicated grammar point.</p>
				<div class="worksheet-student-line"><span>Name:</span><span>Date: ${escapeHtml(today)}</span></div>
			</header>
			${questionMarkup}
		</div>
		<div class="worksheet-page worksheet-answer-key">
			<header class="worksheet-header">
				<p class="eyebrow section-eyebrow">KOTOBA · ANSWER KEY</p>
				<h2>Suggested answers</h2>
				<p>These are the source example sentences. Other correct translations may also be possible.</p>
			</header>
			${answerMarkup}
		</div>
	`;
	worksheetOutput.hidden = false;
	worksheetOutput.scrollIntoView({ behavior: "smooth", block: "start" });
}

function getTodayKey() {
	const now = new Date();
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function addDays(date, days) {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

function getPracticeWords() {
	return words.filter((word) => practiceLevel.value === "all" || word.level === practiceLevel.value);
}

function getPracticePlan() {
	const now = Date.now();
	const today = getTodayKey();
	const pool = getPracticeWords();
	const due = pool.filter((word) => {
		const progress = reviewProgress[word.id];
		return progress && !progress.needsQuickCheck && progress.dueAt <= now;
	}).sort((a, b) => reviewProgress[a.id].dueAt - reviewProgress[b.id].dueAt);
	const newWordsToday = Object.values(reviewProgress).filter((entry) => entry.learnedOn === today).length;
	const remainingNew = Math.max(0, dailyNewLimit - newWordsToday);
	const newWords = pool.filter((word) => !reviewProgress[word.id]).slice(0, remainingNew);
	return { due, newWords, remainingNew, poolLength: pool.length, pendingCheckCount: pendingQuickCheckIds.length };
}

function updatePracticeDashboard() {
	const plan = getPracticePlan();
	practiceDueCount.textContent = plan.due.length.toLocaleString();
	practiceNewCount.textContent = plan.newWords.length.toLocaleString();
	const today = getTodayKey();
	const yesterday = addDays(new Date(), -1);
	const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
	if (streakData.lastDate && streakData.lastDate !== today && streakData.lastDate !== yesterdayKey) {
		streakData.count = 0;
		streakData.lastDate = "";
		try { localStorage.setItem(streakStorageKey, JSON.stringify(streakData)); } catch { /* Storage may be disabled. */ }
	}
	practiceStreak.textContent = String(streakData.count || 0);
	practiceStreak.nextElementSibling.textContent = (streakData.count || 0) === 1 ? "day" : "days";
	const hasPendingCheck = plan.pendingCheckCount > 0;
	const calibrationReady = ["N5", "N4", "N3", "N2", "N1"].every((level) => words.filter((word) => word.level === level).length >= 10);
	practiceRequiredCheck.hidden = !hasPendingCheck;
	startQuickCheckButton.hidden = !hasPendingCheck;
	startLearningButton.disabled = words.length === 0 || plan.newWords.length === 0 || hasPendingCheck;
	startReviewingButton.disabled = plan.due.length === 0 || hasPendingCheck;
	startCalibrationButton.disabled = !calibrationReady || hasPendingCheck;
	startCalibrationButton.title = calibrationReady ? "Take a 50-word vocabulary placement check" : "Load all five level lists to start calibration";
	calibrationLastResult.textContent = calibrationResult
		? `Last estimate: JLPT ${calibrationResult.recommendation} · ${new Date(calibrationResult.completedAt).toLocaleDateString()}`
		: "The placement check asks 10 random words from each level and won’t change your review progress.";
	practiceQueueSummary.textContent = hasPendingCheck
		? `${plan.pendingCheckCount} newly learned ${plan.pendingCheckCount === 1 ? "word is" : "words are"} waiting for a quick check.`
		: plan.due.length || plan.newWords.length
			? `${plan.due.length} ${plan.due.length === 1 ? "review" : "reviews"} due · ${plan.newWords.length} new ${plan.newWords.length === 1 ? "word" : "words"} ready. About ${Math.max(1, Math.ceil((plan.due.length + plan.newWords.length) / 10))} ${Math.ceil((plan.due.length + plan.newWords.length) / 10) === 1 ? "minute" : "minutes"}.`
		: plan.poolLength === 0
			? "The word list is still loading."
			: plan.remainingNew === 0
				? "You’re caught up for today. Come back when your next reviews are due."
				: "All caught up for now. Your next set of new words is ready tomorrow.";
}

function beginPracticeSession(mode, queue) {
	practiceMode = mode;
	practiceQueue = queue;
	practiceQueueIndex = 0;
	practiceSessionCompleted = 0;
	practiceWelcome.hidden = true;
	practiceComplete.hidden = true;
	calibrationResults.hidden = true;
	practiceSession.hidden = false;
	practiceModeLabel.textContent = mode === "learning" ? "LEARNING NEW WORDS" : mode === "quickcheck" ? "REQUIRED QUICK CHECK" : mode === "calibration" ? "LEVEL CALIBRATION" : "REVIEWING WORDS";
	document.querySelector("#practice-exit").hidden = mode === "quickcheck";
	if (practiceQueue.length === 0) {
		finishPractice();
		return;
	}
	if (mode === "learning") showLearningCard();
	else showTypedReviewCard();
}

function startLearning() {
	const plan = getPracticePlan();
	if (plan.pendingCheckCount || !plan.newWords.length) return;
	beginPracticeSession("learning", plan.newWords.map((word) => ({ word })));
}

function startReviewing() {
	const plan = getPracticePlan();
	if (plan.pendingCheckCount || !plan.due.length) return;
	beginPracticeSession("reviewing", plan.due.slice(0, dailyReviewLimit).map((word) => ({ word, missed: false })));
}

function shuffled(items) {
	const result = [...items];
	for (let index = result.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(Math.random() * (index + 1));
		[result[index], result[swapIndex]] = [result[swapIndex], result[index]];
	}
	return result;
}

function startCalibration() {
	if (pendingQuickCheckIds.length) return;
	const levels = ["N5", "N4", "N3", "N2", "N1"];
	if (levels.some((level) => words.filter((word) => word.level === level).length < 10)) return;
	calibrationScores = Object.fromEntries(levels.map((level) => [level, { correct: 0, total: 10 }]));
	const queue = levels.flatMap((level) => shuffled(words.filter((word) => word.level === level)).slice(0, 10).map((word) => ({ word, missed: false })));
	beginPracticeSession("calibration", queue);
}

function startQuickCheck() {
	const queue = pendingQuickCheckIds.map((id) => words.find((word) => String(word.id) === id)).filter(Boolean).map((word) => ({ word }));
	if (!queue.length) return;
	beginPracticeSession("quickcheck", queue);
}

function showLearningCard() {
	const card = practiceQueue[practiceQueueIndex];
	if (!card) {
		finishLearningPhase();
		return;
	}
	practiceSessionLabel.textContent = `CARD ${practiceQueueIndex + 1} OF ${practiceQueue.length}`;
	practiceProgressBar.style.width = `${(practiceQueueIndex / practiceQueue.length) * 100}%`;
	learningWord.textContent = card.word.kanji;
	learningReading.textContent = card.word.reading;
	learningRomaji.textContent = card.word.romaji;
	learningMeaning.textContent = card.word.meaning;
	const example = card.word.examples?.[0] || (card.word.example ? { ja: card.word.example, en: card.word.translation } : null);
	learningExample.innerHTML = example ? `<p class="example-japanese" lang="ja">${renderJapaneseWithFurigana(example)}</p><p class="example-translation">${escapeHtml(example.en || "")}</p>` : "<p class=\"example-translation\">No example sentence available.</p>";
	learningCard.hidden = false;
	typedReviewCard.hidden = true;
	learningNextButton.textContent = practiceQueueIndex === practiceQueue.length - 1 ? "Finish lesson and start quick check" : "Got it — next word";
}

function finishLearningPhase() {
	const today = getTodayKey();
	const tomorrow = addDays(new Date(), 1).getTime();
	pendingQuickCheckIds = shuffled(practiceQueue.map(({ word }) => String(word.id)));
	pendingQuickCheckIds.forEach((id) => {
		reviewProgress[id] = {
			intervalDays: 0,
			repetitions: 0,
			dueAt: tomorrow,
			learnedOn: today,
			lastReviewed: "",
			needsQuickCheck: true
		};
	});
	persistPracticeProgress();
	updatePracticeDashboard();
	startQuickCheck();
}

function showTypedReviewCard() {
	const card = practiceQueue[practiceQueueIndex];
	if (!card) {
		if (practiceMode === "quickcheck") finishQuickCheck();
		else if (practiceMode === "calibration") finishCalibration();
		else finishPractice();
		return;
	}
	practiceSessionLabel.textContent = `CARD ${practiceQueueIndex + 1} OF ${practiceQueue.length}`;
	practiceProgressBar.style.width = `${(practiceQueueIndex / practiceQueue.length) * 100}%`;
	practicePromptText(card);
	typedReviewWord.textContent = card.word.kanji;
	typedReviewReading.textContent = card.word.reading;
	const example = card.word.examples?.[0] || (card.word.example ? { ja: card.word.example, en: card.word.translation } : null);
	typedReviewExample.innerHTML = example ? `<p class="example-japanese" lang="ja">${renderJapaneseWithFurigana(example)}</p><p class="example-translation">${escapeHtml(example.en || "")}</p>` : "";
	typedReviewExample.hidden = true;
	answerFeedback.textContent = "Type any one English meaning; capitalization and punctuation do not matter.";
	answerFeedback.className = "answer-feedback";
	answerInput.value = "";
	answerInput.disabled = false;
	checkAnswerButton.disabled = false;
	checkAnswerButton.textContent = "Check answer";
	wrongAnswerInfo.hidden = true;
	wrongAnswerInfo.innerHTML = "";
	practiceOverrideButton.hidden = true;
	answerContinueButton.hidden = true;
	learningCard.hidden = true;
	typedReviewCard.hidden = false;
	answerInput.focus();
}

function practicePromptText(card) {
	typedReviewPrompt.textContent = practiceMode === "quickcheck"
		? "Quick check: type the English meaning. After a wrong answer, mark it correct or move on to review it soon."
		: practiceMode === "calibration"
			? `Placement check · JLPT ${card.word.level}: type the English meaning. After a wrong answer, mark it correct or move on without credit.`
		: "Review: type the English meaning from memory.";
}

function normalizeAnswer(value) {
	return String(value).toLocaleLowerCase().trim().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ");
}

function acceptedAnswers(word) {
	const variants = word.meaningAnswers?.length ? word.meaningAnswers : String(word.meaning || "").split(";");
	return variants.map(normalizeAnswer).filter(Boolean);
}

const conjugationPatterns = {
	N5: [
		{ id: "polite", label: "Polite non-past · ます", description: "Make the verb polite (ます form).", build: (form) => form.masuStem + "ます" },
		{ id: "polite-negative", label: "Polite negative · ません", description: "Say that you do not do the action politely.", build: (form) => form.masuStem + "ません" },
		{ id: "polite-past", label: "Polite past · ました", description: "Say that you did the action politely.", build: (form) => form.masuStem + "ました" },
		{ id: "polite-past-negative", label: "Polite past negative · ませんでした", description: "Say that you did not do the action politely.", build: (form) => form.masuStem + "ませんでした" },
		{ id: "plain-negative", label: "Plain negative · ない", description: "Change the dictionary verb to its plain negative form.", build: (form) => form.negative },
		{ id: "plain-past", label: "Plain past · た", description: "Change the dictionary verb to its plain past form.", build: (form) => form.past },
		{ id: "te", label: "て-form", description: "Make the verb’s て-form.", build: (form) => form.te },
		{ id: "tai", label: "Want to · たい", description: "Attach たい to the verb’s ます-stem.", build: (form) => form.masuStem + "たい" },
		{ id: "polite-volitional", label: "Let’s · ましょう", description: "Make a polite suggestion with ましょう.", build: (form) => form.masuStem + "ましょう" }
	],
	N4: [
		{ id: "potential", label: "Potential · can do", description: "Express ability: 'can do the action'.", build: (form) => form.potential },
		{ id: "passive", label: "Passive · be done to", description: "Change the verb to its passive form.", build: (form) => form.passive },
		{ id: "causative", label: "Causative · make/let do", description: "Change the verb to its causative form.", build: (form) => form.causative },
		{ id: "volitional", label: "Plain volitional · よう / おう", description: "Make a casual 'let’s' or 'I will' form.", build: (form) => form.volitional },
		{ id: "conditional-ba", label: "Conditional · ば", description: "Make the conditional 'if' form with ば.", build: (form) => form.conditionalBa },
		{ id: "conditional-tara", label: "Conditional · たら", description: "Make the conditional 'if/when' form with たら.", build: (form) => form.past + "ら" },
		{ id: "imperative", label: "Imperative · command", description: "Make the direct command form.", build: (form) => form.imperative },
		{ id: "negative-request", label: "Please don’t · ないでください", description: "Make a polite negative request.", build: (form) => form.negative + "でください" }
	],
	N3: [
		{ id: "causative-passive", label: "Causative-passive", description: "Express being made or forced to do something.", build: (form) => form.causativePassive },
		{ id: "zuni", label: "Without doing · ずに", description: "Attach ずに to express doing something without another action.", build: (form) => form.zuni },
		{ id: "te-oku", label: "Do in advance · ておく", description: "Attach おく to the て-form to express preparation.", build: (form) => form.te + "おく" },
		{ id: "te-shimau", label: "Do completely / accidentally · てしまう", description: "Attach しまう to the て-form.", build: (form) => form.te + "しまう" },
		{ id: "sou", label: "Looks about to · そう", description: "Attach そう to the verb’s ます-stem.", build: (form) => form.masuStem + "そう" },
		{ id: "you-to-suru", label: "Try to do · ようとする", description: "Attach とする to the plain volitional form.", build: (form) => form.volitional + "とする" }
	],
	N2: [
		{ id: "zaru", label: "Have no choice but to · ざるを得ない", description: "Attach ざるを得ない to the negative verb stem.", build: (form) => form.zaru },
		{ id: "zuniha", label: "Cannot help doing · ずにはいられない", description: "Attach ずにはいられない to the negative stem.", build: (form) => form.zuni + "はいられない" },
		{ id: "te-tamaranai", label: "Extremely · てたまらない", description: "Attach たまらない to the て-form.", build: (form) => form.te + "たまらない" },
		{ id: "nai-koto-niha", label: "Unless · ないことには", description: "Attach ことには to the plain negative form.", build: (form) => form.negative + "ことには" },
		{ id: "te-wa-irarenai", label: "Cannot afford to · てはいられない", description: "Attach はいられない to the て-form.", build: (form) => form.te + "はいられない" },
		{ id: "te-kara-de-nai-to", label: "Must do before · てからでないと", description: "Attach からでないと to the て-form.", build: (form) => form.te + "からでないと" }
	],
	N1: [
		{ id: "zuniha-okanai", label: "Cannot help but · ずにはおかない", description: "Attach ずにはおかない to express an inevitable response or result.", build: (form) => form.zuni + "はおかない" },
		{ id: "te-yamanai", label: "Cannot stop · てやまない", description: "Attach やまない to the て-form.", build: (form) => form.te + "やまない" },
		{ id: "n-ga-tameni", label: "For the purpose of · んがために", description: "Attach んがために to the classical negative-volitional stem.", build: (form) => form.nVolitional + "がために" },
		{ id: "nai-mademo", label: "Even without · ないまでも", description: "Attach までも to the plain negative form.", build: (form) => form.negative + "までも" },
		{ id: "te-koso", label: "Precisely because · てこそ", description: "Attach こそ to the て-form.", build: (form) => form.te + "こそ" },
		{ id: "you-ga", label: "No matter how much · ようが", description: "Attach が to the plain volitional form.", build: (form) => form.volitional + "が" }
	]
};

const nominalConjugationPatterns = {
	"i-adjective": {
		N5: [
			{ id: "positive", label: "Positive", build: (form) => form.positive },
			{ id: "negative", label: "Negative", build: (form) => form.negative },
			{ id: "past", label: "Past", build: (form) => form.past },
			{ id: "te", label: "て-form", build: (form) => form.te }
		],
		N4: [
			{ id: "past-negative", label: "Past negative", build: (form) => form.pastNegative },
			{ id: "conditional", label: "Conditional", build: (form) => form.conditional },
			{ id: "adverb", label: "Adverb form", build: (form) => form.adverb },
			{ id: "polite-positive", label: "Polite positive", build: (form) => form.politePositive }
		]
	},
	"na-adjective": {
		N5: [
			{ id: "positive", label: "Positive", build: (form) => form.positive },
			{ id: "negative", label: "Negative", build: (form) => form.negative },
			{ id: "past", label: "Past", build: (form) => form.past },
			{ id: "past-negative", label: "Past negative", build: (form) => form.pastNegative },
			{ id: "polite-positive", label: "Polite positive", build: (form) => form.politePositive },
			{ id: "polite-negative", label: "Polite negative", build: (form) => form.politeNegative }
		],
		N4: [
			{ id: "te", label: "て-form", build: (form) => form.te },
			{ id: "conditional", label: "Conditional", build: (form) => form.conditional },
			{ id: "adverb", label: "Adverb form", build: (form) => form.adverb }
		]
	},
	noun: {
		N5: [
			{ id: "positive", label: "Positive", build: (form) => form.positive },
			{ id: "negative", label: "Negative", build: (form) => form.negative },
			{ id: "past", label: "Past", build: (form) => form.past },
			{ id: "past-negative", label: "Past negative", build: (form) => form.pastNegative },
			{ id: "polite-positive", label: "Polite positive", build: (form) => form.politePositive },
			{ id: "polite-negative", label: "Polite negative", build: (form) => form.politeNegative }
		],
		N4: [
			{ id: "conditional", label: "Conditional", build: (form) => form.conditional },
			{ id: "conditional-tara", label: "Conditional past", build: (form) => form.past + "ら" }
		]
	}
};

const godanRows = {
	"う": ["わ", "い", "え", "お"], "く": ["か", "き", "け", "こ"], "ぐ": ["が", "ぎ", "げ", "ご"],
	"す": ["さ", "し", "せ", "そ"], "つ": ["た", "ち", "て", "と"], "ぬ": ["な", "に", "ね", "の"],
	"ぶ": ["ば", "び", "べ", "ぼ"], "む": ["ま", "み", "め", "も"], "る": ["ら", "り", "れ", "ろ"]
};

function getVerbType(word) {
	const codes = word.posCodes || [];
	if (word.kanji === "する" && word.reading === "する") return "suru";
	if (codes.some((code) => code.startsWith("vs"))) return null;
	if (codes.includes("vk")) return "kuru";
	if (codes.some((code) => code.startsWith("v1"))) return "ichidan";
	if (codes.some((code) => code.startsWith("v5"))) return "godan";
	if (word.part === "Verbs" || word.part === "verb") return word.reading?.endsWith("る") ? "ichidan" : "godan";
	return null;
}

function getConjugationWordType(word) {
	if (getVerbType(word)) return "verb";
	const codes = word.posCodes || [];
	if (codes.includes("adj-i") || codes.includes("adj-ix")) return "i-adjective";
	if (codes.includes("adj-na")) return "na-adjective";
	if (!codes.some((code) => code.startsWith("vs")) && codes.some((code) => code === "n" || code.startsWith("n-") || code === "num" || code === "pn")) return "noun";
	return null;
}

function buildNominalForms(word, type) {
	const base = String(word.reading || word.kanji).replace(/[\s　]/g, "");
	if (type === "i-adjective") {
		const stem = base === "いい" || base === "よい" ? "よ" : base.endsWith("い") ? base.slice(0, -1) : base;
		return {
			base,
			positive: base,
			negative: `${stem}くない`,
			past: `${stem}かった`,
			pastNegative: `${stem}くなかった`,
			te: `${stem}くて`,
			conditional: `${stem}ければ`,
			adverb: `${stem}く`,
			politePositive: `${base}です`
		};
	}
	if (type === "na-adjective" || type === "noun") {
		return {
			base,
			positive: `${base}だ`,
			negative: `${base}じゃない`,
			past: `${base}だった`,
			pastNegative: `${base}じゃなかった`,
			politePositive: `${base}です`,
			politeNegative: `${base}じゃありません`,
			te: `${base}で`,
			conditional: `${base}なら`,
			adverb: `${base}に`
		};
	}
	return null;
}

function buildConjugationForms(word, type) {
	return type === "verb" ? buildVerbForms(word) : buildNominalForms(word, type);
}

function buildVerbForms(word) {
	const type = getVerbType(word);
	if (!type) return null;
	let base = String(word.reading || word.kanji).replace(/[\s　]/g, "");
	if (type === "suru" && !base.endsWith("する")) base += "する";
	if (type === "kuru" && !base.endsWith("くる")) base = base.slice(0, -1) + "くる";

	if (type === "suru") {
		const stem = base.slice(0, -2);
		return { base, masuStem: stem + "し", negative: stem + "しない", past: stem + "した", te: stem + "して", potential: stem + "できる", passive: stem + "される", causative: stem + "させる", causativePassive: stem + "させられる", volitional: stem + "しよう", nVolitional: stem + "せん", conditionalBa: stem + "すれば", imperative: stem + "しろ", zuni: stem + "せずに", zaru: stem + "せざるを得ない" };
	}
	if (type === "kuru") {
		const stem = base.slice(0, -2);
		return { base, masuStem: stem + "き", negative: stem + "こない", past: stem + "きた", te: stem + "きて", potential: stem + "こられる", passive: stem + "こられる", causative: stem + "こさせる", causativePassive: stem + "こさせられる", volitional: stem + "こよう", nVolitional: stem + "こん", conditionalBa: stem + "くれば", imperative: stem + "こい", zuni: stem + "こずに", zaru: stem + "こざるを得ない" };
	}
	if (type === "ichidan") {
		if (!base.endsWith("る")) return null;
		const stem = base.slice(0, -1);
		return { base, masuStem: stem, negative: stem + "ない", past: stem + "た", te: stem + "て", potential: stem + "られる", passive: stem + "られる", causative: stem + "させる", causativePassive: stem + "させられる", volitional: stem + "よう", nVolitional: stem + "ん", conditionalBa: stem + "れば", imperative: stem + "ろ", zuni: stem + "ずに", zaru: stem + "ざるを得ない" };
	}

	const ending = base.slice(-1);
	const row = godanRows[ending];
	if (!row) return null;
	const stem = base.slice(0, -1);
	const [aRow, iRow, eRow, oRow] = row;
	let teSuffix;
	if (ending === "う" || ending === "つ" || ending === "る") teSuffix = "って";
	else if (ending === "む" || ending === "ぶ" || ending === "ぬ") teSuffix = "んで";
	else if (ending === "く") teSuffix = base === "いく" ? "って" : "いて";
	else if (ending === "ぐ") teSuffix = "いで";
	else teSuffix = "して";
	const negativeStem = stem + aRow;
	const past = teSuffix.endsWith("て") ? stem + teSuffix.slice(0, -1) + "た" : stem + teSuffix.slice(0, -1) + "だ";
	const honorificRuVerbs = ["いらっしゃる", "おっしゃる", "なさる", "くださる", "ござる"];
	const masuStem = stem + (ending === "る" && honorificRuVerbs.includes(base) ? "い" : iRow);
	return { base, masuStem, negative: base === "ある" ? "ない" : negativeStem + "ない", past, te: stem + teSuffix, potential: stem + eRow + "る", passive: negativeStem + "れる", causative: negativeStem + "せる", causativePassive: negativeStem + "せられる", volitional: stem + oRow + "う", nVolitional: negativeStem + "ん", conditionalBa: stem + eRow + "ば", imperative: stem + eRow, zuni: negativeStem + "ずに", zaru: negativeStem + "ざるを得ない" };
}

function getConjugationLevelPool(level = conjugationLevel.value, includePrevious = conjugationIncludePrevious.checked) {
	const levels = ["N5", "N4", "N3", "N2", "N1"];
	const index = levels.indexOf(level);
	return includePrevious ? levels.slice(0, index + 1) : [level];
}

function getConjugationPatterns(type = "verb", level = conjugationLevel.value, includePrevious = conjugationIncludePrevious.checked) {
	const levels = getConjugationLevelPool(level, includePrevious);
	const patternsByLevel = type === "verb" ? conjugationPatterns : nominalConjugationPatterns[type] || {};
	return levels.flatMap((sourceLevel) => (patternsByLevel[sourceLevel] || []).map((pattern) => ({
		...pattern,
		id: `${sourceLevel}:${pattern.id}`,
		sourceLevel,
		label: includePrevious ? `${pattern.label.split(" · ")[0]} (${sourceLevel})` : pattern.label
	})));
}

function getConjugationWords(type, levels) {
	return words.filter((word) => levels.includes(word.level) && getConjugationWordType(word) === type && buildConjugationForms(word, type));
}

function getConjugationPatternPreview(pattern, type, candidateWords) {
	const word = candidateWords.find((item) => item.level === pattern.sourceLevel && buildConjugationForms(item, type));
	if (!word) return "";
	const form = buildConjugationForms(word, type);
	return `${form.base} → ${pattern.build(form)}`;
}

function renderConjugationPatternPicker(patterns, options, summary, selectedIds, type, candidateWords) {
	const availableIds = patterns.map((pattern) => pattern.id);
	const selected = selectedIds === null
		? availableIds
		: selectedIds.filter((id) => availableIds.includes(id));
	options.innerHTML = patterns.map((pattern) => `
		<label>
			<input type="checkbox" value="${escapeHtml(pattern.id)}" ${selected.includes(pattern.id) ? "checked" : ""}>
			<span class="conjugation-pattern-option-copy">
				<span>${escapeHtml(pattern.label)}</span>
				<span class="conjugation-pattern-preview" lang="ja">${escapeHtml(getConjugationPatternPreview(pattern, type, candidateWords))}</span>
			</span>
		</label>
	`).join("");
	updateConjugationPatternSummary(selected.length, patterns.length, summary);
	return selectedIds === null ? null : selected;
}

function updateConjugationPatternSummary(selectedCount, totalCount, summary) {
	summary.textContent = selectedCount === totalCount
		? `All ${totalCount} forms selected`
		: `${selectedCount} of ${totalCount} forms selected`;
}

function getSelectedConjugationPatternIds(options) {
	return [...options.querySelectorAll("input:checked")].map((input) => input.value);
}

function updateConjugationSetup(renderPicker = true) {
	const level = conjugationLevel.value;
	const levels = getConjugationLevelPool();
	const patterns = getConjugationPatterns("verb");
	const verbs = getConjugationWords("verb", levels);
	if (renderPicker) {
		selectedVerbPatternIds = renderConjugationPatternPicker(patterns, conjugationPatternOptions, conjugationPatternSummary, selectedVerbPatternIds, "verb", verbs);
	}
	const selectedPatterns = getSelectedConjugationPatternIds(conjugationPatternOptions);
	updateConjugationPatternSummary(selectedPatterns.length, patterns.length, conjugationPatternSummary);
	conjugationStartButton.disabled = verbs.length === 0 || selectedPatterns.length === 0;
	conjugationCountControl.hidden = conjugationMode.value === "endless";
	conjugationStartButton.textContent = conjugationMode.value === "endless"
		? "Start endless practice →"
		: `Start ${Math.min(Number(conjugationQuestionCount.value), verbs.length)} questions →`;
	conjugationStatus.textContent = verbs.length
		? selectedPatterns.length
			? `${verbs.length.toLocaleString()} verbs across ${levels.join(", ")}. Practice uses ${selectedPatterns.length} selected form${selectedPatterns.length === 1 ? "" : "s"}. ${conjugationMode.value === "endless" ? "Live stats update with every answer." : "Your stats appear at the end."}`
			: "Select at least one verb form to start practice."
		: "Verb data is still loading or unavailable for this level.";
}

function updateNominalConjugationSetup(renderPicker = true) {
	const type = nominalConjugationType.value;
	const level = nominalConjugationLevel.value;
	const levels = getConjugationLevelPool(level, nominalIncludePrevious.checked);
	const patterns = getConjugationPatterns(type, level, nominalIncludePrevious.checked);
	const pool = getConjugationWords(type, levels);
	if (renderPicker) {
		selectedNominalPatternIds = renderConjugationPatternPicker(patterns, nominalConjugationPatternOptions, nominalConjugationPatternSummary, selectedNominalPatternIds, type, pool);
	}
	const selectedPatterns = getSelectedConjugationPatternIds(nominalConjugationPatternOptions);
	updateConjugationPatternSummary(selectedPatterns.length, patterns.length, nominalConjugationPatternSummary);
	nominalConjugationStartButton.disabled = pool.length === 0 || selectedPatterns.length === 0;
	nominalQuestionCountControl.hidden = nominalConjugationMode.value === "endless";
	nominalConjugationStartButton.textContent = nominalConjugationMode.value === "endless"
		? "Start endless practice →"
		: `Start ${Math.min(Number(nominalQuestionCount.value), pool.length)} questions →`;
	const typeLabel = nominalConjugationType.options[nominalConjugationType.selectedIndex].textContent;
	nominalConjugationStatus.textContent = pool.length
		? selectedPatterns.length
			? `${pool.length.toLocaleString()} ${typeLabel.toLowerCase()} across ${levels.join(", ")}. Practice uses ${selectedPatterns.length} selected form${selectedPatterns.length === 1 ? "" : "s"}. ${nominalConjugationMode.value === "endless" ? "Live stats update with every answer." : "Your stats appear at the end."}`
			: "Select at least one form to start practice."
		: `No ${typeLabel.toLowerCase()} found for these levels.`;
}

function makeConjugationQuestion(word, pattern, type = "verb") {
	return { word, pattern, type, answer: pattern.build(buildConjugationForms(word, type)), missed: false };
}

function startConjugationPractice() {
	startConjugationSession({
		type: "verb",
		level: conjugationLevel.value,
		includePrevious: conjugationIncludePrevious.checked,
		patternIds: getSelectedConjugationPatternIds(conjugationPatternOptions),
		mode: conjugationMode.value,
		questionCount: Number(conjugationQuestionCount.value),
		setup: conjugationSetup,
		panel: conjugationPanel
	});
}

function startNominalConjugationPractice() {
	startConjugationSession({
		type: nominalConjugationType.value,
		level: nominalConjugationLevel.value,
		includePrevious: nominalIncludePrevious.checked,
		patternIds: getSelectedConjugationPatternIds(nominalConjugationPatternOptions),
		mode: nominalConjugationMode.value,
		questionCount: Number(nominalQuestionCount.value),
		setup: nominalConjugationSetup,
		panel: nominalConjugationPanel
	});
}

function startConjugationSession(config) {
	activeConjugationConfig = config;
	const { type, level, includePrevious, patternIds, mode, questionCount, panel } = config;
	const patterns = getConjugationPatterns(type, level, includePrevious).filter((pattern) => patternIds.includes(pattern.id));
	if (!patterns.length) return;
	const pool = shuffled(getConjugationWords(type, getConjugationLevelPool(level, includePrevious)));
	if (!pool.length) return;
	const roundSize = mode === "endless" ? 1 : Math.min(questionCount, pool.length);
	const selectedWords = pool.slice(0, roundSize);
	const patternSequence = [];
	while (patternSequence.length < selectedWords.length) patternSequence.push(...shuffled(patterns));
	conjugationQueue = shuffled(selectedWords.map((word, index) => makeConjugationQuestion(word, patternSequence[index], type)));
	if (!conjugationQueue.length) return;
	conjugationIndex = 0;
	conjugationQuestionNumber = 1;
	conjugationStats = { attempts: 0, correct: 0, streak: 0, bestStreak: 0, questionsAnswered: 0, patterns: {} };
	config.setup.hidden = true;
	conjugationComplete.hidden = true;
	conjugationCompleteTitle.textContent = "Practice complete";
	panel.append(conjugationSession, conjugationComplete);
	conjugationSession.hidden = false;
	conjugationLiveStats.hidden = mode !== "endless";
	updateConjugationStats();
	showConjugationQuestion();
}

function showConjugationQuestion() {
	const question = conjugationQueue[conjugationIndex];
	if (!question) {
		finishConjugationPractice();
		return;
	}
	const pattern = question.pattern;
	conjugationAnswered = false;
	conjugationProgressLabel.textContent = activeConjugationConfig.mode === "endless"
		? `QUESTION ${conjugationQuestionNumber} · ENDLESS`
		: `QUESTION ${conjugationIndex + 1} OF ${conjugationQueue.length}`;
	conjugationProgressBar.parentElement.hidden = activeConjugationConfig.mode === "endless";
	if (activeConjugationConfig.mode !== "endless") conjugationProgressBar.style.width = `${(conjugationIndex / conjugationQueue.length) * 100}%`;
	conjugationPatternName.textContent = pattern.label.split(" · ")[0];
	conjugationPatternName.className = `conjugation-pattern-name ${conjugationFormTone(pattern.id.split(":").pop())}`;
	const suruVerb = question.type === "verb" && getVerbType(question.word) === "suru";
	conjugationWord.textContent = suruVerb && !question.word.kanji.endsWith("する") ? `${question.word.kanji}する` : question.word.kanji;
	conjugationReading.textContent = suruVerb && !question.word.reading.endsWith("する") ? `${question.word.reading}する` : question.word.reading;
	conjugationMeaning.textContent = question.word.meaning;
	conjugationAnswer.value = "";
	conjugationAnswer.disabled = false;
	conjugationCheckButton.disabled = false;
	conjugationCheckButton.textContent = "Check answer";
	conjugationFeedback.textContent = "";
	conjugationFeedback.className = "answer-feedback";
	conjugationCorrection.hidden = true;
	conjugationTryAgainButton.hidden = true;
	conjugationNextButton.hidden = true;
	conjugationAnswer.focus();
}

function hiraganaAnswer(value) {
	return normalizeAnswer(value).replace(/[ァ-ヶ]/g, (character) => String.fromCharCode(character.charCodeAt(0) - 0x60));
}

function checkConjugationAnswer(event) {
	event.preventDefault();
	const question = conjugationQueue[conjugationIndex];
	if (!question || conjugationAnswered || !conjugationAnswer.value.trim()) return;
	conjugationAnswered = true;
	if (!question.hasAnswered) {
		question.hasAnswered = true;
		conjugationStats.questionsAnswered += 1;
	}
	conjugationAnswer.disabled = true;
	conjugationCheckButton.disabled = true;
	const isCorrect = hiraganaAnswer(conjugationAnswer.value) === question.answer;
	recordConjugationAttempt(question.pattern, isCorrect);
	if (isCorrect) {
		conjugationFeedback.textContent = "Correct — nice conjugation!";
		conjugationFeedback.className = "answer-feedback is-correct";
		conjugationNextButton.hidden = false;
		conjugationNextButton.focus();
	} else {
		question.missed = true;
		conjugationFeedback.textContent = "Not quite. Study the form, then try typing it once more or move on.";
		conjugationFeedback.className = "answer-feedback is-incorrect";
		conjugationCorrection.innerHTML = `<span>Correct form</span><strong lang="ja">${escapeHtml(question.answer)}</strong>`;
		conjugationCorrection.hidden = false;
		conjugationTryAgainButton.hidden = false;
		conjugationNextButton.hidden = false;
		conjugationNextButton.focus();
	}
}

function conjugationFormTone(patternId) {
	const negative = ["polite-negative", "polite-past-negative", "plain-negative", "negative-request", "zuni", "zaru", "zuniha", "nai-koto-niha", "nai-mademo", "te-wa-irarenai", "zuniha-okanai"];
	const past = ["polite-past", "polite-past-negative", "plain-past", "conditional-tara"];
	const future = ["volitional", "polite-volitional", "tai", "you-to-suru", "n-ga-tameni", "you-ga"];
	const polite = ["polite", "polite-positive", "polite-negative", "polite-past", "polite-past-negative", "negative-request"];
	if (negative.includes(patternId)) return "form-tone-negative";
	if (past.includes(patternId)) return "form-tone-past";
	if (future.includes(patternId)) return "form-tone-future";
	if (polite.includes(patternId)) return "form-tone-polite";
	return "form-tone-casual";
}

function getConjugationFormStats() {
	const forms = Object.values(conjugationStats?.patterns || {}).filter((form) => form.attempts > 0);
	if (!forms.length) return { best: null, worst: null };
	const rate = (form) => form.correct / form.attempts;
	return {
		best: forms.reduce((best, form) => rate(form) > rate(best) ? form : best),
		worst: forms.reduce((worst, form) => rate(form) < rate(worst) ? form : worst)
	};
}

function formatFormStat(form) {
	return form ? `${form.label} · ${Math.round((form.correct / form.attempts) * 100)}%` : "—";
}

function updateConjugationStats() {
	if (!conjugationStats) return;
	const accuracy = conjugationStats.attempts ? Math.round((conjugationStats.correct / conjugationStats.attempts) * 100) : 0;
	const { best, worst } = getConjugationFormStats();
	conjugationLiveAccuracy.textContent = `${accuracy}%`;
	conjugationLiveAttempts.textContent = String(conjugationStats.attempts);
	conjugationLiveStreak.textContent = String(conjugationStats.streak);
	conjugationLiveBest.textContent = formatFormStat(best);
	conjugationLiveWorst.textContent = formatFormStat(worst);
}

function recordConjugationAttempt(pattern, isCorrect) {
	conjugationStats.attempts += 1;
	if (isCorrect) {
		conjugationStats.correct += 1;
		conjugationStats.streak += 1;
		conjugationStats.bestStreak = Math.max(conjugationStats.bestStreak, conjugationStats.streak);
	} else {
		conjugationStats.streak = 0;
	}
	const patternStats = conjugationStats.patterns[pattern.id] || { id: pattern.id, label: pattern.label, attempts: 0, correct: 0 };
	patternStats.attempts += 1;
	if (isCorrect) patternStats.correct += 1;
	conjugationStats.patterns[pattern.id] = patternStats;
	if (activeConjugationConfig.mode === "endless") updateConjugationStats();
}

function retryConjugationQuestion() {
	conjugationAnswered = false;
	conjugationAnswer.value = "";
	conjugationAnswer.disabled = false;
	conjugationCheckButton.disabled = false;
	conjugationCorrection.hidden = true;
	conjugationTryAgainButton.hidden = true;
	conjugationNextButton.hidden = true;
	conjugationFeedback.textContent = "Try the hiragana form again.";
	conjugationAnswer.focus();
}

function nextConjugationQuestion() {
	if (activeConjugationConfig.mode === "endless") {
		conjugationQuestionNumber += 1;
		const { type, level, includePrevious, patternIds } = activeConjugationConfig;
		const levels = getConjugationLevelPool(level, includePrevious);
		const pool = getConjugationWords(type, levels);
		const patterns = getConjugationPatterns(type, level, includePrevious).filter((item) => patternIds.includes(item.id));
		const pattern = patterns[Math.floor(Math.random() * patterns.length)];
		const previousId = conjugationQueue[0]?.word.id;
		const candidates = pool.filter((word) => word.id !== previousId);
		const word = candidates[Math.floor(Math.random() * candidates.length)] || pool[0];
		conjugationQueue = [makeConjugationQuestion(word, pattern, type)];
		conjugationIndex = 0;
	} else {
		conjugationIndex += 1;
		conjugationQuestionNumber += 1;
	}
	showConjugationQuestion();
}

function finishConjugationPractice() {
	conjugationSession.hidden = true;
	conjugationComplete.hidden = false;
	conjugationLiveStats.hidden = true;
	conjugationProgressBar.parentElement.hidden = false;
	conjugationProgressBar.style.width = "100%";
	const accuracy = conjugationStats.attempts ? Math.round((conjugationStats.correct / conjugationStats.attempts) * 100) : 0;
	const { best, worst } = getConjugationFormStats();
	conjugationCompleteTitle.textContent = activeConjugationConfig.mode === "endless" ? "Endless practice ended" : "Practice complete";
	const selectedPatternCount = activeConjugationConfig.patternIds.length;
	const patternSummary = `${selectedPatternCount} selected form${selectedPatternCount === 1 ? "" : "s"}`;
	const questionsCompleted = conjugationStats.questionsAnswered;
	const typeLabel = { verb: "verbs", "i-adjective": "い-adjectives", "na-adjective": "な-adjectives", noun: "nouns" }[activeConjugationConfig.type];
	conjugationResult.textContent = `${activeConjugationConfig.level} ${typeLabel} · ${patternSummary} · ${questionsCompleted} question${questionsCompleted === 1 ? "" : "s"}`;
	conjugationFinalAccuracy.textContent = `${accuracy}% (${conjugationStats.correct}/${conjugationStats.attempts})`;
	conjugationFinalAttempts.textContent = String(conjugationStats.attempts);
	conjugationFinalBest.textContent = formatFormStat(best);
	conjugationFinalWorst.textContent = formatFormStat(worst);
	conjugationFinalCurrentStreak.textContent = String(conjugationStats.streak);
	conjugationFinalStreak.textContent = String(conjugationStats.bestStreak);
}

function exitConjugationPractice() {
	finishConjugationPractice();
}

function renderWrongAnswerInfo(word) {
	const example = word.examples?.[0] || (word.example ? { ja: word.example, en: word.translation } : null);
	const partsOfSpeech = word.partsOfSpeech?.length ? word.partsOfSpeech : [word.part || word.category];
	wrongAnswerInfo.innerHTML = `
		<p class="wrong-info-label">WORD INFO</p>
		<div class="wrong-info-facts">
			<p><span>Reading</span><span lang="ja">${escapeHtml(word.reading || "")}</span></p>
			${word.romaji ? `<p><span>Romaji</span><span>${escapeHtml(word.romaji)}</span></p>` : ""}
			<p><span>Meaning</span><span>${escapeHtml(word.meaning || "")}</span></p>
			<p><span>Part of speech</span><span>${partsOfSpeech.map(escapeHtml).join(" · ")}</span></p>
			<p><span>Level</span><span>JLPT ${escapeHtml(word.level || "")}</span></p>
		</div>
		${example ? `<div class="wrong-info-example"><p class="example-japanese" lang="ja">${renderJapaneseWithFurigana(example)}</p><p class="example-translation">${escapeHtml(example.en || "")}</p></div>` : ""}
	`;
	wrongAnswerInfo.hidden = false;
}

function markPracticeDay() {
	const today = getTodayKey();
	if (streakData.lastDate !== today) {
		const yesterday = addDays(new Date(), -1);
		const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
		streakData.count = streakData.lastDate === yesterdayKey ? streakData.count + 1 : 1;
		streakData.lastDate = today;
	}
	practiceSessionCompleted += 1;
}

function persistPracticeProgress() {
	try {
		localStorage.setItem(reviewStorageKey, JSON.stringify(reviewProgress));
		localStorage.setItem(streakStorageKey, JSON.stringify(streakData));
		localStorage.setItem(quickCheckStorageKey, JSON.stringify(pendingQuickCheckIds));
	} catch {
		// Practice still works for this session if local storage is unavailable.
	}
	updatePracticeDashboard();
}

function setReviewSchedule(word, missed) {
	const today = getTodayKey();
	const previous = reviewProgress[word.id] || { intervalDays: 0, repetitions: 0 };
	const intervalDays = missed ? 0 : (previous.intervalDays ? previous.intervalDays * 2 : 1);
	reviewProgress[word.id] = {
		...previous,
		intervalDays,
		repetitions: missed ? 0 : (previous.repetitions || 0) + 1,
		dueAt: missed ? Date.now() + 10 * 60 * 1000 : addDays(new Date(), intervalDays).getTime(),
		lastReviewed: today,
		needsQuickCheck: false
	};
	markPracticeDay();
	persistPracticeProgress();
}

function checkPracticeAnswer(event) {
	event.preventDefault();
	const card = practiceQueue[practiceQueueIndex];
	if (card && ["quickcheck", "calibration"].includes(practiceMode) && answerInput.disabled) {
		moveOnWithoutCredit();
		return;
	}
	if (!card || !answerInput.value.trim()) return;
	if (!acceptedAnswers(card.word).includes(normalizeAnswer(answerInput.value))) {
		const overrideOnly = ["quickcheck", "calibration"].includes(practiceMode);
		answerFeedback.textContent = practiceMode === "quickcheck"
			? "Incorrect. Override — I was correct marks this right; Move on records it wrong and schedules an early review."
			: practiceMode === "calibration"
				? "Incorrect. Override — I was correct gives credit; Move on records this as incorrect."
				: "Not quite. Try again; you need the correct meaning to complete this review.";
	answerFeedback.className = "answer-feedback is-incorrect";
	answerInput.value = "";
		if (practiceMode === "reviewing" || practiceMode === "calibration") card.missed = true;
		if (practiceMode === "reviewing" || practiceMode === "calibration") renderWrongAnswerInfo(card.word);
		practiceOverrideButton.hidden = !["quickcheck", "calibration"].includes(practiceMode);
		if (overrideOnly) {
			answerInput.disabled = true;
			checkAnswerButton.textContent = "Move on";
			practiceOverrideButton.focus();
		}
		if (practiceMode === "reviewing") {
		card.missed = true;
		const progress = reviewProgress[card.word.id];
		if (progress) {
			progress.dueAt = Date.now() + 10 * 60 * 1000;
			persistPracticeProgress();
		}
	}
	if (!overrideOnly) answerInput.focus();
	return;
	}
	answerFeedback.textContent = "Correct!";
	answerFeedback.className = "answer-feedback is-correct";
	answerInput.disabled = true;
	checkAnswerButton.disabled = true;
	practiceOverrideButton.hidden = true;
	answerContinueButton.hidden = false;
	typedReviewExample.hidden = false;
}

function continueAfterCorrectAnswer() {
	const card = practiceQueue[practiceQueueIndex];
	if (!card) return;
	if (practiceMode === "quickcheck") {
		const progress = reviewProgress[card.word.id];
		if (progress) {
			progress.needsQuickCheck = true;
			progress.quickCheckPassed = true;
			progress.quickCheckOverridden = false;
		}
		markPracticeDay();
		persistPracticeProgress();
	} else if (practiceMode === "reviewing") {
		setReviewSchedule(card.word, card.missed);
	} else if (practiceMode === "calibration") {
		if (!card.missed) calibrationScores[card.word.level].correct += 1;
	}
	practiceQueueIndex += 1;
	if (practiceMode === "learning") showLearningCard();
	else showTypedReviewCard();
}

function overridePracticeAnswer() {
	const card = practiceQueue[practiceQueueIndex];
	if (!card || !["quickcheck", "calibration"].includes(practiceMode) || practiceOverrideButton.hidden) return;
	if (practiceMode === "quickcheck") {
		const progress = reviewProgress[card.word.id];
		if (progress) {
			progress.quickCheckOverridden = false;
			progress.needsQuickCheck = true;
		}
	}
	card.missed = false;
	continueAfterCorrectAnswer();
}

function moveOnWithoutCredit() {
	const card = practiceQueue[practiceQueueIndex];
	if (!card || !["quickcheck", "calibration"].includes(practiceMode)) return;
	card.missed = true;
	if (practiceMode === "quickcheck") {
		const progress = reviewProgress[card.word.id];
		if (progress) {
			progress.quickCheckOverridden = true;
			progress.needsQuickCheck = true;
		}
		markPracticeDay();
		persistPracticeProgress();
	}
	practiceQueueIndex += 1;
	showTypedReviewCard();
}

function finishQuickCheck() {
	const overriddenCount = pendingQuickCheckIds.filter((id) => reviewProgress[id]?.quickCheckOverridden).length;
	pendingQuickCheckIds.forEach((id) => {
		const progress = reviewProgress[id];
		if (!progress) return;
		progress.needsQuickCheck = false;
		progress.quickCheckPassed = !progress.quickCheckOverridden;
		progress.intervalDays = progress.quickCheckOverridden ? 0 : 1;
		progress.repetitions = progress.quickCheckOverridden ? 0 : 1;
		progress.dueAt = progress.quickCheckOverridden ? Date.now() + 10 * 60 * 1000 : addDays(new Date(), 1).getTime();
		progress.quickCheckOverridden = false;
		progress.lastReviewed = getTodayKey();
	});
	pendingQuickCheckIds = [];
	persistPracticeProgress();
	const completionMessage = overriddenCount
		? `Quick check complete. ${overriddenCount} overridden ${overriddenCount === 1 ? "word is" : "words are"} scheduled to return soon.`
		: "Quick check passed! Your new words are now in your review schedule.";
	finishPractice(completionMessage);
}

function finishPractice(message) {
	practiceSession.hidden = true;
	practiceWelcome.hidden = true;
	practiceComplete.hidden = false;
	practiceCompleteKicker.textContent = "DAILY PRACTICE COMPLETE";
	practiceCompleteTitle.textContent = "Nice work showing up.";
	calibrationResults.hidden = true;
	practiceProgressBar.style.width = "100%";
	practiceCompleteSummary.textContent = message || `${practiceSessionCompleted} ${practiceSessionCompleted === 1 ? "word" : "words"} reviewed. Your schedule is saved on this device.`;
	updatePracticeDashboard();
}

function finishCalibration() {
	const levels = ["N5", "N4", "N3", "N2", "N1"];
	const recommendation = levels.find((level) => calibrationScores[level].correct < 7) || "N1";
	calibrationResult = { recommendation, scores: calibrationScores, completedAt: new Date().toISOString() };
	try { localStorage.setItem(calibrationStorageKey, JSON.stringify(calibrationResult)); } catch { /* The result remains available for this visit. */ }
	practiceSession.hidden = true;
	practiceWelcome.hidden = true;
	practiceComplete.hidden = false;
	practiceCompleteKicker.textContent = "PLACEMENT CHECK COMPLETE";
	practiceCompleteTitle.textContent = `Suggested starting level: ${recommendation}`;
	practiceCompleteSummary.textContent = "Here’s how you did on the vocabulary sample for each level.";
	calibrationRecommendation.textContent = levels.every((level) => calibrationScores[level].correct >= 7)
		? "You met the 7/10 target at every level; N1 is suggested."
		: `JLPT ${recommendation} is the first level below the 7/10 target.`;
	calibrationScoreList.innerHTML = levels.map((level) => `
		<div class="calibration-score-row"><span>JLPT ${level}</span><strong>${calibrationScores[level].correct}/10</strong><div class="calibration-score-track"><span style="width:${calibrationScores[level].correct * 10}%"></span></div></div>
	`).join("");
	calibrationResults.hidden = false;
	practiceProgressBar.style.width = "100%";
	updatePracticeDashboard();
}

function exitPractice() {
	if (practiceMode === "quickcheck" && !practiceSession.hidden) return;
	practiceSession.hidden = true;
	practiceComplete.hidden = true;
	practiceWelcome.hidden = false;
	calibrationResults.hidden = true;
	practiceMode = "";
	updatePracticeDashboard();
}

function renderWords() {
	const visibleWords = getVisibleWords();
	const selectedStillVisible = visibleWords.some((word) => word.id === selectedId);
	if (!selectedStillVisible && visibleWords.length) selectedId = visibleWords[0].id;
	const displayedWords = visibleWords.slice(0, renderedLimit);

	resultCount.textContent = `${visibleWords.length} ${visibleWords.length === 1 ? "word" : "words"}`;
	emptyState.hidden = visibleWords.length > 0;
	wordGrid.hidden = visibleWords.length === 0;
	wordGrid.innerHTML = displayedWords.map((word) => `
		<article class="word-card${word.id === selectedId ? " is-selected" : ""}" data-word-id="${escapeHtml(word.id)}" tabindex="0" aria-label="${escapeHtml(word.kanji)}, ${escapeHtml(word.meaning)}">
			<div class="word-card-top">
				<div>
					<h3 class="word-japanese" lang="ja">${escapeHtml(word.kanji)}</h3>
					<p class="word-reading" lang="ja">${escapeHtml(word.reading)} · ${escapeHtml(word.romaji)}</p>
				</div>
				<button class="save-word${savedWords.has(String(word.id)) ? " is-saved" : ""}" type="button" data-save-id="${escapeHtml(word.id)}" aria-label="${savedWords.has(String(word.id)) ? "Remove" : "Save"} ${escapeHtml(word.kanji)}" aria-pressed="${savedWords.has(String(word.id))}">${savedWords.has(String(word.id)) ? "♥" : "♡"}</button>
			</div>
			<p class="word-meaning">${escapeHtml(word.meaning)}</p>
			<div class="word-meta"><span class="word-category">${escapeHtml(word.category)}</span><span class="word-level">${escapeHtml(word.level)}</span></div>
		</article>
	`).join("");
	pageStatus.textContent = visibleWords.length > displayedWords.length
		? `Showing ${displayedWords.length.toLocaleString()} of ${visibleWords.length.toLocaleString()} matching words`
		: "";
	loadMoreButton.hidden = visibleWords.length <= displayedWords.length;

	renderDetail(words.find((word) => word.id === selectedId && visibleWords.some((visible) => visible.id === word.id)));
	savedCount.textContent = String(savedWords.size);
	favoritesToggle.setAttribute("aria-pressed", String(showFavoritesOnly));
}

function resetAndRenderWords() {
	renderedLimit = pageSize;
	renderWords();
}

function saveFavorites() {
	try {
		localStorage.setItem("kotoba-saved-words", JSON.stringify([...savedWords]));
	} catch {
		// Favorites still work for this page view when browser storage is unavailable.
	}
}

categoryList.addEventListener("click", (event) => {
	const button = event.target.closest("[data-category]");
	if (!button) return;
	activeCategory = button.dataset.category;
	renderCategories();
	resetAndRenderWords();
});

wordDetail.addEventListener("click", (event) => {
	const button = event.target.closest("[data-pronounce]");
	if (button) speakJapanese(button.dataset.pronounce);
});

wordGrid.addEventListener("click", (event) => {
	const saveButton = event.target.closest("[data-save-id]");
	if (saveButton) {
		const id = saveButton.dataset.saveId;
		if (savedWords.has(id)) savedWords.delete(id);
		else savedWords.add(id);
		saveFavorites();
		renderWords();
		return;
	}
	const card = event.target.closest("[data-word-id]");
	if (!card) return;
	selectedId = card.dataset.wordId;
	renderWords();
});

wordGrid.addEventListener("keydown", (event) => {
	if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-word-id]")) {
		event.preventDefault();
		selectedId = event.target.dataset.wordId;
		renderWords();
	}
});

searchInput.addEventListener("input", resetAndRenderWords);
document.querySelector("#search-form").addEventListener("submit", (event) => event.preventDefault());
levelFilter.addEventListener("change", resetAndRenderWords);
favoritesToggle.addEventListener("click", () => {
	showFavoritesOnly = !showFavoritesOnly;
	resetAndRenderWords();
});

document.querySelectorAll(".suggestion").forEach((button) => {
	button.addEventListener("click", () => {
		searchInput.value = button.dataset.query;
		searchInput.focus();
		resetAndRenderWords();
	});
});

loadMoreButton.addEventListener("click", () => {
	renderedLimit += pageSize;
	renderWords();
});

grammarSearch.addEventListener("input", resetAndRenderGrammar);
grammarLevelFilter.addEventListener("change", resetAndRenderGrammar);
grammarGrid.addEventListener("click", (event) => {
	const card = event.target.closest("[data-grammar-id]");
	if (!card) return;
	selectedGrammarId = card.dataset.grammarId;
	renderGrammar();
});
grammarLoadMoreButton.addEventListener("click", () => {
	grammarRenderedLimit += grammarPageSize;
	renderGrammar();
});
grammarGrid.addEventListener("change", (event) => {
	const checkbox = event.target.closest("[data-worksheet-grammar]");
	if (!checkbox) return;
	if (checkbox.checked) selectedGrammarIds.add(checkbox.dataset.worksheetGrammar);
	else selectedGrammarIds.delete(checkbox.dataset.worksheetGrammar);
	updateWorksheetSelection();
});
worksheetSelectVisibleButton.addEventListener("click", () => {
	getVisibleGrammar().forEach((entry) => selectedGrammarIds.add(entry.id));
	renderGrammar();
});
worksheetClearSelectionButton.addEventListener("click", () => {
	selectedGrammarIds.clear();
	renderGrammar();
});
worksheetGenerateButton.addEventListener("click", () => {
	const selectedEntries = grammarEntries.filter((entry) => selectedGrammarIds.has(entry.id));
	if (selectedEntries.length) renderGrammarWorksheet(selectedEntries);
});
worksheetOutput.addEventListener("click", (event) => {
	if (event.target.closest("#worksheet-close")) {
		worksheetOutput.hidden = true;
		return;
	}
	if (event.target.closest("#worksheet-print")) {
		document.body.classList.add("printing-worksheet");
		window.print();
	}
});
window.addEventListener("afterprint", () => document.body.classList.remove("printing-worksheet"));

document.querySelector("#clear-filters").addEventListener("click", () => {
	searchInput.value = "";
	activeCategory = "All words";
	levelFilter.value = "all";
	showFavoritesOnly = false;
	renderCategories();
	resetAndRenderWords();
});

vocabularyTab.addEventListener("click", () => activateTab("vocabulary"));
grammarTab.addEventListener("click", () => activateTab("grammar"));
practiceTab.addEventListener("click", () => activateTab("practice"));
conjugationTab.addEventListener("click", () => activateTab("conjugation"));
nominalConjugationTab.addEventListener("click", () => activateTab("nominal-conjugation"));
document.querySelector(".content-tabs").addEventListener("keydown", (event) => {
	const tabs = [
		{ tab: vocabularyTab, name: "vocabulary" },
		{ tab: grammarTab, name: "grammar" },
		{ tab: practiceTab, name: "practice" },
		{ tab: conjugationTab, name: "conjugation" },
		{ tab: nominalConjugationTab, name: "nominal-conjugation" }
	];
	if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
	event.preventDefault();
	const currentIndex = tabs.findIndex(({ tab }) => tab === event.target);
	const nextIndex = event.key === "Home" ? 0
		: event.key === "End" ? tabs.length - 1
			: (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
	const { tab: nextTab, name } = tabs[nextIndex];
	nextTab.focus();
	activateTab(name);
});

practiceLevel.addEventListener("change", updatePracticeDashboard);
startLearningButton.addEventListener("click", startLearning);
startReviewingButton.addEventListener("click", startReviewing);
startCalibrationButton.addEventListener("click", startCalibration);
startQuickCheckButton.addEventListener("click", startQuickCheck);
learningNextButton.addEventListener("click", () => {
	practiceQueueIndex += 1;
	showLearningCard();
});
answerForm.addEventListener("submit", checkPracticeAnswer);
practiceOverrideButton.addEventListener("click", overridePracticeAnswer);
answerContinueButton.addEventListener("click", continueAfterCorrectAnswer);
useCalibrationLevelButton.addEventListener("click", () => {
	if (!calibrationResult) return;
	practiceLevel.value = calibrationResult.recommendation;
	exitPractice();
});
conjugationLevel.addEventListener("change", updateConjugationSetup);
conjugationIncludePrevious.addEventListener("change", updateConjugationSetup);
conjugationPatternOptions.addEventListener("change", () => {
	const selected = getSelectedConjugationPatternIds(conjugationPatternOptions);
	selectedVerbPatternIds = selected.length === conjugationPatternOptions.querySelectorAll("input").length ? null : selected;
	updateConjugationSetup(false);
});
conjugationPatternPicker.addEventListener("click", (event) => {
	const action = event.target.closest("[data-pattern-action]")?.dataset.patternAction;
	if (!action) return;
	if (action === "select-all") {
		selectedVerbPatternIds = null;
	} else if (action === "clear") {
		selectedVerbPatternIds = [];
	} else {
		return;
	}
	updateConjugationSetup();
});
conjugationMode.addEventListener("change", () => updateConjugationSetup(false));
conjugationQuestionCount.addEventListener("change", () => updateConjugationSetup(false));
conjugationStartButton.addEventListener("click", startConjugationPractice);
nominalConjugationLevel.addEventListener("change", updateNominalConjugationSetup);
nominalConjugationType.addEventListener("change", updateNominalConjugationSetup);
nominalIncludePrevious.addEventListener("change", updateNominalConjugationSetup);
nominalConjugationPatternOptions.addEventListener("change", () => {
	const selected = getSelectedConjugationPatternIds(nominalConjugationPatternOptions);
	selectedNominalPatternIds = selected.length === nominalConjugationPatternOptions.querySelectorAll("input").length ? null : selected;
	updateNominalConjugationSetup(false);
});
nominalConjugationPatternPicker.addEventListener("click", (event) => {
	const action = event.target.closest("[data-pattern-action]")?.dataset.patternAction;
	if (!action) return;
	if (action === "select-all") {
		selectedNominalPatternIds = null;
	} else if (action === "clear") {
		selectedNominalPatternIds = [];
	} else {
		return;
	}
	updateNominalConjugationSetup();
});
nominalConjugationMode.addEventListener("change", () => updateNominalConjugationSetup(false));
nominalQuestionCount.addEventListener("change", () => updateNominalConjugationSetup(false));
nominalConjugationStartButton.addEventListener("click", startNominalConjugationPractice);
conjugationAnswerForm.addEventListener("submit", checkConjugationAnswer);
conjugationTryAgainButton.addEventListener("click", retryConjugationQuestion);
conjugationNextButton.addEventListener("click", nextConjugationQuestion);
document.querySelector("#conjugation-exit").addEventListener("click", exitConjugationPractice);
document.querySelector("#conjugation-again").addEventListener("click", () => {
	conjugationComplete.hidden = true;
	activeConjugationConfig?.setup && (activeConjugationConfig.setup.hidden = false);
});
document.querySelector("#practice-again").addEventListener("click", exitPractice);
document.querySelector("#practice-exit").addEventListener("click", exitPractice);

document.addEventListener("keydown", (event) => {
	if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
		event.preventDefault();
		searchInput.focus();
	}
	if (event.key === "Escape" && document.activeElement === searchInput) {
		searchInput.value = "";
		resetAndRenderWords();
		searchInput.blur();
	}
});

renderCategories();
renderWords();
activateTab("vocabulary");
updatePracticeDashboard();
updateConjugationSetup();
updateNominalConjugationSetup();
loadVocabulary();
loadGrammar();
