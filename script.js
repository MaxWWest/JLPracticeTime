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
const readingTab = document.querySelector("#reading-tab");
const speakingTab = document.querySelector("#speaking-tab");
const vocabularyPanel = document.querySelector("#vocabulary-panel");
const grammarPanel = document.querySelector("#grammar-panel");
const grammarPracticePanel = document.querySelector("#grammar-practice-panel");
const practicePanel = document.querySelector("#practice-panel");
const conjugationPanel = document.querySelector("#conjugation-panel");
const pitchPanel = document.querySelector("#pitch-panel");
const readingPanel = document.querySelector("#reading-panel");
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
const conjugationLiveBreakdown = document.querySelector("#conjugation-live-breakdown");
const conjugationBreakdown = document.querySelector("#conjugation-breakdown");
const conjugationCompleteTitle = document.querySelector("#conjugation-complete-title");
const conjugationLiveCorrect = document.querySelector("#conjugation-live-correct");
const conjugationLiveRemaining = document.querySelector("#conjugation-live-remaining");
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
const gpEls = Object.fromEntries(["setup", "count", "start", "status", "session", "session-notes", "session-note-panel", "home", "correct", "progress", "hero", "type", "prompt", "subprompt", "band", "body", "complete", "result", "final-accuracy", "final-correct", "final-bank", "missed", "again"].map((id) => [id, document.querySelector(`#gp-${id}`)]));
const gpState = { bank: [], queue: [], index: 0, correct: 0, missed: [], answered: false };

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
		{ name: "vocabulary", tab: vocabularyTab, panels: [vocabularyPanel, practicePanel] },
		{ name: "grammar", tab: grammarTab, panels: [grammarPanel, grammarPracticePanel, conjugationPanel, nominalConjugationPanel] },
		{ name: "reading", tab: readingTab, panels: [readingPanel] },
		{ name: "speaking", tab: speakingTab, panels: [pitchPanel], onActivate: updatePitchSetup }
	];
	const activeTab = tabs.find(({ name }) => name === tabName) || tabs[0];
	const activePanels = new Set(activeTab.panels);
	document.body.dataset.activeSection = activeTab.name;
	tabs.forEach(({ name, tab }) => {
		const active = name === activeTab.name;
		tab.classList.toggle("is-active", active);
		tab.setAttribute("aria-selected", String(active));
		tab.tabIndex = active ? 0 : -1;
	});
	[vocabularyPanel, practicePanel, grammarPanel, grammarPracticePanel, conjugationPanel, nominalConjugationPanel, readingPanel, pitchPanel].forEach((panel) => {
		const active = activePanels.has(panel);
		panel.hidden = !active;
		panel.setAttribute("aria-hidden", String(!active));
	});
	activeTab.onActivate?.();
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
		const pitchPromise = fetch("pitch-data.json").then((response) => response.ok ? response.json() : {}).catch(() => ({}));
		const [datasets, posLabels, pitchData] = await Promise.all([Promise.all(levels.map(async (level) => {
			const response = await fetch(`https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/vocab/${level.toLowerCase()}.json`);
			if (!response.ok) throw new Error(`${level} vocabulary request failed (${response.status})`);
			const dataset = await response.json();
			if (!Array.isArray(dataset) || dataset.length === 0) throw new Error(`The ${level} vocabulary dataset was empty.`);
			return dataset;
		})), posLabelsPromise, pitchPromise]);
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
				pitchAccent: entry.pitch_accent ?? entry.pitchAccent ?? entry.accent_number ?? entry.accentNumber ?? entry.pitch?.accent ?? pitchData[String(entry.id)] ?? null,
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
		updatePitchSetup();
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
		? `<div class="pitch-accent-list"><p class="pitch-accent-label">PITCH ACCENT <span class="pitch-help" tabindex="0" role="button" aria-label="What do the pitch accent terms mean?"><span aria-hidden="true">?</span><span class="pitch-help-tip" role="tooltip"><strong>Reading the pattern</strong>The line shows each sound as high or low. The が after the word shows what a following particle does.<strong>Heiban (0)</strong>Flat: low then high, with no drop.<strong>Atamadaka (1)</strong>Head-high: first sound high, then drops.<strong>Nakadaka (2+)</strong>Middle-high: rises, then drops before the last sound.<strong>Odaka</strong>Tail-high: stays high through the last sound, drops on the particle.<strong>Number</strong>The sound after which the pitch drops; 0 means it never drops.</span></span></p>${pitchAccents.map((accent) => renderPitchAccent(word.reading, accent)).join("")}</div>`
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

function renderPitchContour(reading, downstep) {
	const morae = splitMora(reading);
	return morae.map((mora, index) => {
		const high = downstep === 0 ? index > 0 : index < downstep;
		return `<span class="pitch-mora ${high ? "is-high" : "is-low"}" lang="ja"><span>${escapeHtml(mora)}</span><i aria-hidden="true"></i></span>`;
	}).join("");
}

function renderPitchAccent(reading, downstep) {
	const morae = splitMora(reading);
	const contour = renderPitchContour(reading, downstep);
	const kind = downstep === 0 ? "Heiban · flat" : downstep === 1 ? "Atamadaka · head-high" : downstep === morae.length ? "Odaka · drop after last mora" : `Nakadaka · drop after mora ${downstep}`;
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
	const tokens = query.split(/[\s、。，,.…・〜~～]+/).filter(Boolean);
	// Negative polite endings are stored as ない in the dataset.
	const scored = [];
	for (const entry of grammarEntries) {
		if (grammarLevelFilter.value !== "all" && entry.level !== grammarLevelFilter.value) continue;
		if (!tokens.length) {
			scored.push({ entry, score: 0 });
			continue;
		}
		const searchable = [entry.pattern, entry.reading, entry.romaji, entry.meaning, entry.formation, entry.notes, ...(entry.tags || [])]
			.map((value) => String(value || "").toLocaleLowerCase())
			.join(" ");
		if (searchable.includes(query)) {
			scored.push({ entry, score: tokens.length + 1 });
			continue;
		}
		const score = tokens.filter((token) => (token === "ません" ? ["ません", "ない"] : [token]).some((term) => searchable.includes(term))).length;
		if (score) scored.push({ entry, score });
	}
	if (tokens.length > 1) scored.sort((x, y) => y.score - x.score);
	return scored.map((item) => item.entry);
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
	worksheetGenerateButton.disabled = count === 0 || getSelectedWorksheetTypes().size === 0;
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

function shuffled(list) {
	const copy = [...list];
	for (let index = copy.length - 1; index > 0; index -= 1) {
		const swap = Math.floor(Math.random() * (index + 1));
		[copy[index], copy[swap]] = [copy[swap], copy[index]];
	}
	return copy;
}

function blankGrammarInSentence(entry, sentence) {
	const chunks = String(entry.pattern || "")
		.split(/[〜~～/／・\s]+/)
		.map((chunk) => chunk.trim())
		.filter(Boolean)
		.sort((left, right) => right.length - left.length);
	for (const chunk of chunks) {
		const candidates = chunk.length > 2 ? [chunk, chunk.slice(0, -1)] : [chunk];
		for (const candidate of candidates) {
			if (candidate && sentence.includes(candidate)) {
				const start = sentence.indexOf(candidate);
				let end = start + candidate.length;
				// Include any trailing kana so conjugated endings are blanked too.
				while (candidate !== chunk && end < sentence.length && /[ぁ-ん]/.test(sentence[end]) && end - start < chunk.length) end += 1;
				return { blanked: `${sentence.slice(0, start)}＿＿＿＿${sentence.slice(end)}`, answer: sentence.slice(start, end) };
			}
		}
	}
	return null;
}

function splitSentenceChunks(sentence) {
	const text = sentence.replace(/[。！？]$/, "");
	const chunks = [];
	let current = "";
	for (let index = 0; index < text.length; index += 1) {
		const char = text[index];
		const previous = text[index - 1] || "";
		const next = text[index + 1];
		current += char;
		if (!next) continue;
		const afterWord = previous && !/[ぁ-ん]/.test(previous) && /[はがをにでともへの]/.test(char);
		const afterClause = /[てで]/.test(char) && /[ぁ-ん]/.test(previous) && !/[はがをにでともへ]/.test(next);
		if (/[、，]/.test(char)) {
			chunks.push(current.replace(/[、，]$/, ""));
			current = "";
		} else if (afterWord || afterClause) {
			chunks.push(current);
			current = "";
		}
	}
	if (current) chunks.push(current);
	return chunks.filter(Boolean);
}

const worksheetTypeOrder = [
	["choice", "Choose the meaning", "Circle the letter of the correct meaning."],
	["identify", "Which grammar pattern?", "Circle the letter of the grammar point used in the sentence."],
	["fill", "Fill in the blank", "Write the missing grammar in the blank."],
	["reorder", "Put the sentence in order", "Arrange the pieces into a natural Japanese sentence."],
	["truefalse", "True or false", "Does the English translation match the Japanese sentence? Circle T or F."],
	["match", "Matching", "Write the letter of the meaning that matches each pattern."],
	["translate", "Translate into Japanese", "Use the grammar point shown beside each sentence."],
	["jp2en", "Translate into English", "Write the meaning of each sentence in English."],
	["write", "Make your own sentence", "Write an original sentence for each grammar point."],
];

function getSelectedWorksheetTypes() {
	return new Set([...document.querySelectorAll("[data-ws-type]:checked")].map((input) => input.dataset.wsType));
}

function renderGrammarWorksheet(entries) {
	const today = new Date().toLocaleDateString();
	const letters = ["A", "B", "C", "D", "E", "F"];
	const enabled = getSelectedWorksheetTypes();
	const usage = new Map();
	const examplesOf = (entry) => (entry.examples || []).filter((example) => example?.ja && example?.en);
	// Prefer the example that has been used the least so far so each type draws on different sentences.
	const pickExample = (entry, predicate = () => true) => {
		const candidates = shuffled(examplesOf(entry).filter(predicate)).sort((left, right) => (usage.get(left.ja) || 0) - (usage.get(right.ja) || 0));
		const chosen = candidates[0];
		if (chosen) usage.set(chosen.ja, (usage.get(chosen.ja) || 0) + 1);
		return chosen;
	};
	const sameLevel = (entry) => grammarEntries.filter((candidate) => candidate.id !== entry.id && candidate.level === entry.level && candidate.meaning && candidate.pattern);
	const lengthSetting = Number(document.querySelector("#worksheet-length")?.value) || 0;
	const perType = lengthSetting ? Math.max(1, Math.round(lengthSetting / Math.max(1, enabled.size))) : 0;
	const order = shuffled(entries);
	// Cycle through the points so longer worksheets reuse them with different example sentences.
	const slots = (extra = 1) => Array.from({ length: perType || entries.length * extra }, (_, index) => order[index % order.length]);
	const uniqueSlots = () => (perType ? order.slice(0, perType) : entries);
	const lines = (count) => Array.from({ length: count }, () => '<div class="worksheet-answer-lines" aria-hidden="true"></div>').join("");
	const questionBlock = (number, body) => `<article class="worksheet-question"><div class="ws-q-row"><b>${number}.</b><div>${body}</div></div></article>`;

	let number = 0;
	const sections = [];
	const answerRows = [];
	const addAnswer = (html) => answerRows.push(`<li><b>${number}.</b> ${html}</li>`);

	const builders = {
		choice() {
			return uniqueSlots().filter((entry) => entry.meaning).map((entry) => {
				const options = shuffled([entry, ...shuffled(sameLevel(entry).filter((candidate) => candidate.meaning !== entry.meaning)).slice(0, 3)]);
				number += 1;
				addAnswer(`${letters[options.indexOf(entry)]} <span>${escapeHtml(entry.meaning)}</span>`);
				return questionBlock(number, `<p class="ws-q">What does <span class="ws-pattern" lang="ja">${escapeHtml(entry.pattern)}</span> mean?</p><ul class="ws-options">${options.map((option, index) => `<li><span class="ws-bubble">${letters[index]}</span>${escapeHtml(option.meaning)}</li>`).join("")}</ul>`);
			}).join("");
		},
		identify() {
			return slots().map((entry) => {
				const example = pickExample(entry);
				if (!example) return "";
				const options = shuffled([entry, ...shuffled(sameLevel(entry)).slice(0, 3)]);
				number += 1;
				addAnswer(`${letters[options.indexOf(entry)]} <span lang="ja">${escapeHtml(entry.pattern)}</span>`);
				return questionBlock(number, `<p class="ws-q"><span class="ws-jp" lang="ja">${escapeHtml(example.ja)}</span></p><ul class="ws-options">${options.map((option, index) => `<li><span class="ws-bubble">${letters[index]}</span><span lang="ja">${escapeHtml(option.pattern)}</span></li>`).join("")}</ul>`);
			}).join("");
		},
		fill() {
			return slots().map((entry) => {
				let blank = null;
				const example = pickExample(entry, (candidate) => (blank = blankGrammarInSentence(entry, candidate.ja)));
				if (!example) return "";
				blank = blankGrammarInSentence(entry, example.ja);
				number += 1;
				addAnswer(`<span lang="ja">${escapeHtml(blank.answer)}</span> <small lang="ja">${escapeHtml(example.ja)}</small>`);
				return questionBlock(number, `<p class="ws-q"><span class="ws-jp" lang="ja">${escapeHtml(blank.blanked)}</span></p><p class="ws-hint">${escapeHtml(example.en)} <em>(${escapeHtml(entry.pattern)})</em></p>`);
			}).join("");
		},
		reorder() {
			return slots().map((entry) => {
				const example = pickExample(entry, (candidate) => {
					const count = splitSentenceChunks(candidate.ja).length;
					return count >= 3 && count <= 8;
				});
				if (!example) return "";
				number += 1;
				addAnswer(`<span lang="ja">${escapeHtml(example.ja)}</span>`);
				return questionBlock(number, `<p class="ws-q">${shuffled(splitSentenceChunks(example.ja)).map((chunk) => `<span class="ws-chip" lang="ja">${escapeHtml(chunk)}</span>`).join("")}</p><p class="ws-hint">${escapeHtml(example.en)}</p>${lines(1)}`);
			}).join("");
		},
		truefalse() {
			const foreign = shuffled(entries.flatMap(examplesOf).concat(grammarEntries.filter((entry) => entries.some((selected) => selected.level === entry.level)).flatMap(examplesOf)));
			const truths = shuffled(entries.map((_, index) => index % 2 === 0));
			const usedWrong = new Set();
			return slots().map((entry, index) => {
				const example = pickExample(entry);
				if (!example) return "";
				const wrong = foreign.find((candidate) => candidate.ja !== example.ja && !examplesOf(entry).includes(candidate) && !usedWrong.has(candidate.en));
				if (wrong) usedWrong.add(wrong.en);
				const isTrue = !wrong || truths[index];
				number += 1;
				addAnswer(isTrue ? "T" : `F <small>${escapeHtml(example.en)}</small>`);
				return questionBlock(number, `<p class="ws-q"><span class="ws-jp" lang="ja">${escapeHtml(example.ja)}</span></p><p class="ws-hint">${escapeHtml(isTrue ? example.en : wrong.en)}</p><p class="ws-tf"><span class="ws-bubble">T</span><span class="ws-bubble">F</span></p>`);
			}).join("");
		},
		match() {
			const pool = uniqueSlots().filter((entry) => entry.meaning);
			if (!pool.length) return "";
			const blocks = [];
			for (let start = 0; start < pool.length; start += 5) blocks.push(pool.slice(start, start + 5));
			return blocks.map((block) => {
				const items = block.length >= 3 ? block : [...block, ...shuffled(sameLevel(block[0]).filter((candidate) => !block.includes(candidate))).slice(0, 3 - block.length)];
				const meanings = shuffled(items);
				const rows = items.map((entry) => {
					number += 1;
					addAnswer(`${letters[meanings.indexOf(entry)]} <span lang="ja">${escapeHtml(entry.pattern)}</span>`);
					return `<li><b>${number}.</b><span lang="ja">${escapeHtml(entry.pattern)}</span><i></i></li>`;
				}).join("");
				return `<article class="worksheet-question ws-match"><ul class="ws-match-left">${rows}</ul><ul class="ws-match-right">${meanings.map((entry, index) => `<li><span class="ws-bubble">${letters[index]}</span>${escapeHtml(entry.meaning)}</li>`).join("")}</ul></article>`;
			}).join("");
		},
		translate() {
			return slots(2).map((entry) => {
				const examples = [pickExample(entry)].filter(Boolean);
				return [...new Set(examples)].map((example) => {
					number += 1;
					addAnswer(`<span lang="ja">${escapeHtml(example.ja)}</span>`);
					return questionBlock(number, `<p class="ws-q">${escapeHtml(example.en)} <em class="ws-tag" lang="ja">${escapeHtml(entry.pattern)}</em></p>${lines(2)}`);
				}).join("");
			}).join("");
		},
		jp2en() {
			return slots().map((entry) => {
				const example = pickExample(entry);
				if (!example) return "";
				number += 1;
				addAnswer(escapeHtml(example.en));
				return questionBlock(number, `<p class="ws-q"><span class="ws-jp" lang="ja">${escapeHtml(example.ja)}</span></p>${lines(1)}`);
			}).join("");
		},
		write() {
			return uniqueSlots().map((entry) => {
				number += 1;
				addAnswer("<span>Answers will vary — check the grammar point is used correctly.</span>");
				return questionBlock(number, `<p class="ws-q">Write your own sentence using <span class="ws-pattern" lang="ja">${escapeHtml(entry.pattern)}</span>.</p>${lines(2)}`);
			}).join("");
		},
	};

	for (const [key, title, instruction] of worksheetTypeOrder) {
		if (!enabled.has(key)) continue;
		const body = builders[key]();
		if (!body) continue;
		sections.push(`<section class="ws-section"><h3><span>Exercise ${sections.length + 1} · ${title}</span></h3><p class="ws-instruction">${instruction}</p>${body}</section>`);
	}

	const referenceMarkup = entries.map((entry) => {
		const example = examplesOf(entry)[0];
		return `
		<article class="ws-ref">
			<div class="ws-ref-head"><h4 lang="ja">${escapeHtml(entry.pattern)}</h4><span class="ws-level">${escapeHtml(entry.level)}</span></div>
			<p class="ws-ref-meaning">${escapeHtml(entry.meaning || "")}</p>
			${entry.formation ? `<p class="ws-ref-formation"><b>Formation</b> <span lang="ja">${escapeHtml(entry.formation)}</span></p>` : ""}
			${example ? `<p class="ws-ref-example" lang="ja">${renderJapaneseWithFurigana(example)}</p><p class="ws-ref-translation">${escapeHtml(example.en)}</p>` : ""}
			${entry.notes ? `<p class="ws-ref-note">${escapeHtml(entry.notes)}</p>` : ""}
		</article>`;
	}).join("");
	const patternTags = entries.map((entry) => `<span class="ws-tag-pill" lang="ja">${escapeHtml(entry.pattern)}</span>`).join("");
	worksheetOutput.innerHTML = `
		<div class="worksheet-actions">
			<p>Worksheet generated with ${entries.length} selected grammar point${entries.length === 1 ? "" : "s"}. <button class="worksheet-control" id="worksheet-regenerate" type="button">Shuffle new worksheet</button></p>
			<div><button class="worksheet-control" id="worksheet-close" type="button">Close worksheet</button><button class="practice-start" id="worksheet-print" type="button">Print worksheet</button></div>
		</div>
		<div class="worksheet-page">
			<header class="worksheet-header ws-banner">
				<div><p class="eyebrow section-eyebrow">KOTOBA · GRAMMAR PRACTICE</p><h2>文法ワークシート</h2><p class="ws-subtitle">Grammar worksheet</p></div>
				<div class="ws-fields"><span>Name</span><span>Date <b>${escapeHtml(today)}</b></span><span>Score <b>&nbsp;&nbsp;&nbsp;/ ${number}</b></span></div>
			</header>
			<div class="ws-tags">${patternTags}</div>
			<section class="ws-section"><h3><span>Grammar review</span></h3><div class="ws-ref-grid">${referenceMarkup}</div></section>
			${sections.join("")}
		</div>
		<div class="worksheet-page worksheet-answer-key">
			<header class="worksheet-header ws-banner">
				<div><p class="eyebrow section-eyebrow">KOTOBA · ANSWER KEY</p><h2>解答</h2><p class="ws-subtitle">Other correct translations may also be possible.</p></div>
			</header>
			<ol class="ws-answers">${answerRows.join("")}</ol>
		</div>
	`;
	worksheetOutput.dataset.entryIds = entries.map((entry) => entry.id).join("|");
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

function normalizeJapaneseAnswer(value) {
	return String(value).trim().replace(/[。、，,.!！？\s　]/g, "").replace(/[ァ-ヶ]/g, (character) => String.fromCharCode(character.charCodeAt(0) - 0x60));
}

const comparisonScenarios = [
	{ lesser: "バス", greater: "電車", lesserEn: "the bus", greaterEn: "the train", adj: "速い", neg: "速く", base: "fast", comparative: "faster" },
	{ lesser: "自転車", greater: "車", lesserEn: "the bicycle", greaterEn: "the car", adj: "速い", neg: "速く", base: "fast", comparative: "faster" },
	{ lesser: "京都", greater: "東京", lesserEn: "Kyoto", greaterEn: "Tokyo", adj: "大きい", neg: "大きく", base: "large", comparative: "larger" },
	{ lesser: "東京", greater: "京都", lesserEn: "Tokyo", greaterEn: "Kyoto", adj: "古い", neg: "古く", base: "old", comparative: "older" },
	{ lesser: "沖縄", greater: "北海道", lesserEn: "Okinawa", greaterEn: "Hokkaido", adj: "寒い", neg: "寒く", base: "cold", comparative: "colder" },
	{ lesser: "秋", greater: "夏", lesserEn: "autumn", greaterEn: "summer", adj: "暑い", neg: "暑く", base: "hot", comparative: "hotter" },
	{ lesser: "ひらがな", greater: "漢字", lesserEn: "hiragana", greaterEn: "kanji", adj: "難しい", neg: "難しく", base: "difficult", comparative: "more difficult" },
	{ lesser: "漢字", greater: "ひらがな", lesserEn: "kanji", greaterEn: "hiragana", adj: "易しい", neg: "易しく", base: "easy", comparative: "easier" },
	{ lesser: "ノート", greater: "辞書", lesserEn: "the notebook", greaterEn: "the dictionary", adj: "重い", neg: "重く", base: "heavy", comparative: "heavier" },
	{ lesser: "辞書", greater: "ノート", lesserEn: "the dictionary", greaterEn: "the notebook", adj: "軽い", neg: "軽く", base: "light", comparative: "lighter" },
	{ lesser: "地下鉄", greater: "タクシー", lesserEn: "the subway", greaterEn: "the taxi", adj: "高い", neg: "高く", base: "expensive", comparative: "more expensive" },
	{ lesser: "タクシー", greater: "地下鉄", lesserEn: "the taxi", greaterEn: "the subway", adj: "安い", neg: "安く", base: "cheap", comparative: "cheaper" },
	{ lesser: "この道", greater: "あの道", lesserEn: "this road", greaterEn: "that road", adj: "狭い", neg: "狭く", base: "narrow", comparative: "narrower" },
	{ lesser: "あの道", greater: "この道", lesserEn: "that road", greaterEn: "this road", adj: "広い", neg: "広く", base: "wide", comparative: "wider" },
	{ lesser: "昨日", greater: "今日", lesserEn: "yesterday", greaterEn: "today", adj: "忙しい", neg: "忙しく", base: "busy", comparative: "busier" },
	{ lesser: "古いスマホ", greater: "新しいスマホ", lesserEn: "the old phone", greaterEn: "the new phone", adj: "新しい", neg: "新しく", base: "new", comparative: "newer" },
	{ lesser: "この川", greater: "あの川", lesserEn: "this river", greaterEn: "that river", adj: "長い", neg: "長く", base: "long", comparative: "longer" },
	{ lesser: "あの橋", greater: "この橋", lesserEn: "that bridge", greaterEn: "this bridge", adj: "短い", neg: "短く", base: "short", comparative: "shorter" },
	{ lesser: "駅", greater: "学校", lesserEn: "the station", greaterEn: "the school", adj: "遠い", neg: "遠く", base: "far away", comparative: "farther away" },
	{ lesser: "前のテスト", greater: "このテスト", lesserEn: "the previous test", greaterEn: "this test", adj: "難しい", neg: "難しく", base: "difficult", comparative: "more difficult" },
	{ lesser: "このテスト", greater: "前のテスト", lesserEn: "this test", greaterEn: "the previous test", adj: "易しい", neg: "易しく", base: "easy", comparative: "easier" },
	{ lesser: "昼", greater: "朝", lesserEn: "noon", greaterEn: "morning", adj: "早い", neg: "早く", base: "early", comparative: "earlier" },
	{ lesser: "朝", greater: "夜", lesserEn: "morning", greaterEn: "night", adj: "遅い", neg: "遅く", base: "late", comparative: "later" }
];

function comparisonSentences(item) {
	return {
		yori: `${item.greater}は${item.lesser}より${item.adj}です。`,
		hou: `${item.lesser}より${item.greater}のほうが${item.adj}です。`,
		hodo: `${item.lesser}は${item.greater}ほど${item.neg}ありません。`,
		question: `${item.lesser}と${item.greater}と、どちらが${item.adj}ですか。`,
		response: `${item.greater}のほうが${item.adj}です。`,
		shorterHou: `${item.greater}のほうが${item.adj}です。`,
		taiQuestion: `${item.lesser}と${item.greater}と、どちらを選びたいですか。`,
		taiAnswer: `${item.greater}のほうを選びたいです。`,
		hoshiiQuestion: `${item.lesser}と${item.greater}と、どちらがほしいですか。`,
		hoshiiAnswer: `${item.greater}のほうがほしいです。`
	};
}

function makeChoiceQuestion({ kind, prompt, subprompt, band, options, answer, explanation }) {
	return { kind, mode: "choice", prompt, subprompt, band, options: shuffled(options), answer, explanation };
}

function sentenceCase(text) {
	return text ? text[0].toLocaleUpperCase() + text.slice(1) : "";
}

function hasJapanese(value) {
	return /[ぁ-んァ-ヶ一-龯]/.test(String(value));
}

function jpLangAttribute(value) {
	return hasJapanese(value) ? " lang=\"ja\"" : "";
}

const comparisonQuestionTemplates = {
	yori: [
		(item, forms, reverseForms, englishYori) => makeChoiceQuestion({
			kind: "より",
			prompt: englishYori,
			subprompt: "Pick the sentence that says A is more adjective than B.",
			band: "Choose the natural より sentence.",
			answer: forms.yori,
			options: [forms.yori, reverseForms.yori, forms.hodo, forms.question],
			explanation: `より marks the comparison base: ${item.lesser}より = compared with ${item.lesser}.`
		}),
		(item, forms, reverseForms) => makeChoiceQuestion({
			kind: "より",
			prompt: `友だちに「${item.greater} is ${item.comparative}」と言いたいです。`,
			subprompt: `The comparison base is ${item.lesserEn}.`,
			band: "Choose the sentence that keeps the base after より.",
			answer: forms.yori,
			options: [forms.yori, reverseForms.yori, forms.hou, `${item.lesser}は${item.greater}より${item.adj}です。`],
			explanation: `${item.lesser}より means “than ${item.lesserEn},” so ${item.greater} is the main topic.`
		}),
		(item, forms, reverseForms, englishYori) => makeChoiceQuestion({
			kind: "より",
			prompt: `Read the note: 「${forms.shorterHou}」`,
			subprompt: "Which より sentence keeps the same meaning?",
			band: "Choose the equivalent より sentence.",
			answer: forms.yori,
			options: [forms.yori, reverseForms.yori, forms.hodo, englishYori],
			explanation: `${forms.shorterHou} and ${forms.yori} both say ${englishYori}`
		})
	],
	hou: [
		(item, forms, reverseForms, englishYori) => makeChoiceQuestion({
			kind: "のほう",
			prompt: englishYori,
			subprompt: "Use より...のほう to put the stronger item after のほう.",
			band: "Choose the sentence with より...のほう.",
			answer: forms.hou,
			options: [forms.hou, reverseForms.hou, forms.yori, `${item.greater}より${item.lesser}のほうが${item.adj}です。`],
			explanation: `${item.greater} is the stronger side, so it goes before のほうが.`
		}),
		(item, forms, reverseForms) => makeChoiceQuestion({
			kind: "のほう",
			prompt: `A: ${item.lesser}と${item.greater}と、どちらが${item.adj}ですか。`,
			subprompt: `B should answer: ${item.greaterEn}.`,
			band: "Choose the shortest natural answer.",
			answer: forms.shorterHou,
			options: [forms.shorterHou, `${item.lesser}のほうが${item.adj}です。`, reverseForms.hou, forms.hodo],
			explanation: "When the two choices are already known, のほうが can answer the comparison question by itself."
		}),
		(item, forms, reverseForms, englishYori) => makeChoiceQuestion({
			kind: "のほう",
			prompt: `Complete the idea: ${item.lesser}より＿＿＿＿。`,
			subprompt: englishYori,
			band: "Choose what belongs after より.",
			answer: `${item.greater}のほうが${item.adj}です。`,
			options: [`${item.greater}のほうが${item.adj}です。`, `${item.lesser}のほうが${item.adj}です。`, reverseForms.response, `${item.greater}ほど${item.neg}ありません。`],
			explanation: `The item before のほうが is the one with more of the quality: ${item.greater}.`
		})
	],
	hodo: [
		(item, forms, _reverseForms, _englishYori, englishHodo) => ({
			kind: "ほど",
			mode: "text",
			prompt: `${item.lesser}は${item.greater}ほど＿＿＿＿。`,
			subprompt: englishHodo,
			band: "Type the negative adjective ending.",
			answer: `${item.neg}ありません`,
			accepted: [`${item.neg}ありません`, `${item.neg}ないです`],
			explanation: `ほど pairs with a negative ending: ${forms.hodo}`
		}),
		(item, forms, _reverseForms, _englishYori, englishHodo) => makeChoiceQuestion({
			kind: "ほど",
			prompt: `日記: ${item.lesser}は思ったよりよかった。でも、${item.greater}ほど＿＿＿＿。`,
			subprompt: englishHodo,
			band: "Choose the ending that makes ほど work.",
			answer: `${item.neg}ありません`,
			options: [`${item.neg}ありません`, item.adj, `${item.adj}です`, `${item.neg}あります`],
			explanation: "ほど needs a negative predicate when it means “not as ... as.”"
		}),
		(item, forms, reverseForms) => makeChoiceQuestion({
			kind: "ほど",
			prompt: forms.hodo,
			subprompt: "Which sentence says almost the same thing?",
			band: "Match ほど...ません to より...のほう.",
			answer: forms.hou,
			options: [forms.hou, reverseForms.hou, reverseForms.hodo, forms.question],
			explanation: `${forms.hodo} means the same basic comparison as ${forms.hou}`
		})
	],
	dochira: [
		(item, forms, _reverseForms, englishYori) => makeChoiceQuestion({
			kind: "どちら",
			prompt: forms.question,
			subprompt: `Answer: ${englishYori}`,
			band: "Choose the correct answer to the どちら question.",
			answer: forms.response,
			options: [forms.response, `${item.lesser}のほうが${item.adj}です。`, forms.hodo, forms.yori],
			explanation: "どちら asks which of the two has more of the quality. Answer with のほうが."
		}),
		(item, forms) => makeChoiceQuestion({
			kind: "のほうを",
			prompt: forms.taiQuestion,
			subprompt: `You want to choose ${item.greaterEn}.`,
			band: "For たい with an action verb, choose のほうを.",
			answer: forms.taiAnswer,
			options: [forms.taiAnswer, forms.response, forms.hoshiiAnswer, `${item.lesser}のほうを選びたいです。`],
			explanation: "With 選びたい, the preferred item is the object of the verb, so のほうを is natural."
		}),
		(item, forms) => makeChoiceQuestion({
			kind: "ほしい",
			prompt: forms.hoshiiQuestion,
			subprompt: `You want ${item.greaterEn}.`,
			band: "For ほしい, choose のほうが.",
			answer: forms.hoshiiAnswer,
			options: [forms.hoshiiAnswer, forms.taiAnswer, `${item.greater}のほうをほしいです。`, `${item.lesser}のほうがほしいです。`],
			explanation: "ほしい describes the wanted thing with が. Use を with an action verb like 選びたい, 買いたい, or ください."
		})
	],
	meaning: [
		(item, forms, _reverseForms, englishYori, englishHodo) => makeChoiceQuestion({
			kind: "meaning",
			prompt: forms.hodo,
			subprompt: "Read the sentence and choose the meaning.",
			band: "What does this ほど...ません sentence mean?",
			answer: englishHodo,
			options: [englishHodo, englishYori, sentenceCase(`${item.greaterEn} is not as ${item.base} as ${item.lesserEn}.`), sentenceCase(`${item.lesserEn} and ${item.greaterEn} are equally ${item.base}.`)],
			explanation: "ほど with a negative means 'not as ... as'."
		}),
		(item, forms, _reverseForms, englishYori) => makeChoiceQuestion({
			kind: "meaning",
			prompt: `会話: 「${forms.question}」「${forms.response}」`,
			subprompt: "Choose what the speaker decided.",
			band: "Read the short exchange.",
			answer: englishYori,
			options: [englishYori, sentenceCase(`${item.lesserEn} is ${item.comparative} than ${item.greaterEn}.`), sentenceCase(`The speaker wants both ${item.lesserEn} and ${item.greaterEn}.`), sentenceCase(`The speaker says neither one is ${item.base}.`)],
			explanation: `${forms.response} points to ${item.greater} as the stronger choice.`
		}),
		(item, forms, _reverseForms, _englishYori, _englishHodo) => makeChoiceQuestion({
			kind: "meaning",
			prompt: `店で: 「${forms.taiAnswer}」`,
			subprompt: "Choose the best meaning.",
			band: "Read the contextual sentence.",
			answer: sentenceCase(`I want to choose ${item.greaterEn}.`),
			options: [sentenceCase(`I want to choose ${item.greaterEn}.`), sentenceCase(`I want ${item.greaterEn}.`), sentenceCase(`${item.greaterEn} is more ${item.base}.`), sentenceCase(`I do not want ${item.lesserEn}.`)],
			explanation: "のほうを can mark the preferred object when the verb is an action like 選ぶ."
		})
	]
};

function makeTextQuestion({ kind, prompt, subprompt, band, answer, accepted, explanation, placeholder }) {
	return { kind, mode: "text", prompt, subprompt, band, answer, accepted: accepted || [answer], explanation, placeholder };
}

const nagaraScenarios = [
	{ stem: "音楽を聞き", sideEn: "listening to music", main: "料理を作ります", mainEn: "cook", natural: "音楽を聞きながら料理を作ります。" },
	{ stem: "テレビを見", sideEn: "watching TV", main: "ご飯を食べます", mainEn: "eat dinner", natural: "テレビを見ながらご飯を食べます。" },
	{ stem: "辞書を使い", sideEn: "using a dictionary", main: "日本語の本を読みます", mainEn: "read a Japanese book", natural: "辞書を使いながら日本語の本を読みます。" },
	{ stem: "メモを取り", sideEn: "taking notes", main: "先生の話を聞きます", mainEn: "listen to the teacher", natural: "メモを取りながら先生の話を聞きます。" },
	{ stem: "歩き", sideEn: "walking", main: "友だちと話しました", mainEn: "talked with my friend", natural: "歩きながら友だちと話しました。" },
	{ stem: "アルバイトをし", sideEn: "working a part-time job", main: "大学に通いました", mainEn: "went to college", natural: "アルバイトをしながら大学に通いました。" },
	{ stem: "説明を聞き", sideEn: "listening to the explanation", main: "機械を動かしてください", mainEn: "operate the machine", natural: "説明を聞きながら機械を動かしてください。" },
	{ stem: "地図を見", sideEn: "looking at the map", main: "駅まで歩きました", mainEn: "walked to the station", natural: "地図を見ながら駅まで歩きました。" },
	{ stem: "コーヒーを飲み", sideEn: "drinking coffee", main: "メールを書いています", mainEn: "am writing email", natural: "コーヒーを飲みながらメールを書いています。" },
	{ stem: "歌い", sideEn: "singing", main: "部屋を掃除しました", mainEn: "cleaned my room", natural: "歌いながら部屋を掃除しました。" },
	{ stem: "写真を見せ", sideEn: "showing photos", main: "旅行の話をしました", mainEn: "talked about the trip", natural: "写真を見せながら旅行の話をしました。" },
	{ stem: "泣き", sideEn: "crying", main: "手紙を読みました", mainEn: "read the letter", natural: "泣きながら手紙を読みました。" }
];

const tokoroScenarios = [
	{ dict: "出かける", teiru: "出かけている", ta: "出かけた", actionEn: "leave", setupBefore: "くつをはいて、かばんを持ちました。", setupDuring: "今、玄関でくつをはいています。", setupAfter: "今、家を出ました。" },
	{ dict: "昼ご飯を食べる", teiru: "昼ご飯を食べている", ta: "昼ご飯を食べた", actionEn: "eat lunch", setupBefore: "テーブルに座って、はしを持ちました。", setupDuring: "今、食堂でご飯を食べています。", setupAfter: "今、ご飯が終わりました。" },
	{ dict: "宿題を始める", teiru: "宿題をしている", ta: "宿題をした", actionEn: "start homework", setupBefore: "ノートを開きました。", setupDuring: "今、机で宿題をしています。", setupAfter: "今、宿題が終わりました。" },
	{ dict: "駅に着く", teiru: "駅に着いている", ta: "駅に着いた", actionEn: "arrive at the station", setupBefore: "もうすぐ駅です。", setupDuring: "今、駅のホームにいます。", setupAfter: "今、駅に着きました。" },
	{ dict: "会議を始める", teiru: "会議をしている", ta: "会議を始めた", actionEn: "start the meeting", setupBefore: "みんな席に座りました。", setupDuring: "今、会議室で話しています。", setupAfter: "今、会議が始まりました。" },
	{ dict: "電話をかける", teiru: "電話をかけている", ta: "電話をかけた", actionEn: "make a phone call", setupBefore: "番号を押しました。", setupDuring: "今、電話で話しています。", setupAfter: "今、電話をかけました。" },
	{ dict: "映画を見る", teiru: "映画を見ている", ta: "映画を見た", actionEn: "watch a movie", setupBefore: "映画館で席に座りました。", setupDuring: "今、映画館で映画を見ています。", setupAfter: "今、映画を見終わりました。" },
	{ dict: "本を読む", teiru: "本を読んでいる", ta: "本を読んだ", actionEn: "read a book", setupBefore: "本を開きました。", setupDuring: "今、図書館で本を読んでいます。", setupAfter: "今、本を読み終わりました。" },
	{ dict: "お風呂に入る", teiru: "お風呂に入っている", ta: "お風呂に入った", actionEn: "take a bath", setupBefore: "お湯を入れました。", setupDuring: "今、お風呂に入っています。", setupAfter: "今、お風呂から出ました。" },
	{ dict: "レポートを書く", teiru: "レポートを書いている", ta: "レポートを書いた", actionEn: "write the report", setupBefore: "パソコンを開きました。", setupDuring: "今、レポートを書いています。", setupAfter: "今、レポートを書き終わりました。" },
	{ dict: "寝る", teiru: "寝ている", ta: "寝た", actionEn: "sleep", setupBefore: "電気を消しました。", setupDuring: "今、弟は寝ています。", setupAfter: "弟は今、寝たばかりです。" },
	{ dict: "料理を作る", teiru: "料理を作っている", ta: "料理を作った", actionEn: "cook", setupBefore: "野菜を切りました。", setupDuring: "今、台所で料理を作っています。", setupAfter: "今、料理ができました。" }
];

const limitScenarios = [
	{ limit: "五時", continuous: "図書館で勉強します", instant: "レポートを出してください", untilEn: "I will study at the library until five.", byEn: "Please submit the report by five." },
	{ limit: "日曜日", continuous: "この本を借りています", instant: "この本を返してください", untilEn: "I am borrowing this book until Sunday.", byEn: "Please return this book by Sunday." },
	{ limit: "会議が終わる", continuous: "ここで待っています", instant: "資料をコピーしてください", untilEn: "I will wait here until the meeting ends.", byEn: "Please copy the materials by the time the meeting ends." },
	{ limit: "友だちが来る", continuous: "部屋をそのままにしておきます", instant: "部屋を片づけてください", untilEn: "I will leave the room as it is until my friend comes.", byEn: "Please clean the room by the time my friend comes." },
	{ limit: "旅行の日", continuous: "お金を貯めます", instant: "ホテルを予約します", untilEn: "I will save money until the trip day.", byEn: "I will reserve the hotel by the trip day." },
	{ limit: "授業が始まる", continuous: "教室で友だちと話します", instant: "宿題を出します", untilEn: "I will talk with friends in the classroom until class starts.", byEn: "I will turn in the homework by the time class starts." },
	{ limit: "雨がやむ", continuous: "店の中にいます", instant: "買い物を終わらせます", untilEn: "I will stay inside the store until the rain stops.", byEn: "I will finish shopping by the time the rain stops." },
	{ limit: "母が帰る", continuous: "妹と遊びます", instant: "晩ご飯を作ります", untilEn: "I will play with my little sister until my mother comes home.", byEn: "I will make dinner by the time my mother comes home." },
	{ limit: "十時", continuous: "起きています", instant: "メールを送ります", untilEn: "I will stay awake until ten.", byEn: "I will send the email by ten." },
	{ limit: "来月", continuous: "日本語を勉強します", instant: "申し込みます", untilEn: "I will study Japanese until next month.", byEn: "I will apply by next month." },
	{ limit: "バスが来る", continuous: "ベンチに座っています", instant: "切符を買います", untilEn: "I will sit on the bench until the bus comes.", byEn: "I will buy a ticket by the time the bus comes." },
	{ limit: "二十日", continuous: "このアパートに住みます", instant: "お金を払います", untilEn: "I will live in this apartment until the twentieth.", byEn: "I will pay the money by the twentieth." }
];

const timeQuestionTemplates = {
	nagara: [
		(item) => makeChoiceQuestion({ kind: "ながら", prompt: `I ${item.mainEn} while ${item.sideEn}.`, subprompt: "Choose the sentence with the side action before ながら.", band: "Choose the natural ながら sentence.", answer: item.natural, options: [item.natural, `${item.main}ながら${item.stem}ます。`, `${item.stem}ところ${item.main}。`, `${item.stem}まで${item.main}。`], explanation: "The secondary simultaneous action uses the ます-stem + ながら, then the main action follows." }),
		(item) => makeTextQuestion({ kind: "ながら", prompt: `＿＿＿＿ながら${item.main}。`, subprompt: `Fill in: while ${item.sideEn}.`, band: "Type the ます-stem phrase before ながら.", answer: item.stem, placeholder: "例: 音楽を聞き", explanation: `Use the verb stem: ${item.natural}` }),
		(item) => makeChoiceQuestion({ kind: "ながら", prompt: item.natural, subprompt: "Choose the meaning.", band: "Read the sentence.", answer: sentenceCase(`I ${item.mainEn} while ${item.sideEn}.`), options: [sentenceCase(`I ${item.mainEn} while ${item.sideEn}.`), sentenceCase(`I ${item.mainEn} after ${item.sideEn}.`), sentenceCase(`I ${item.mainEn} by the time I finish ${item.sideEn}.`), sentenceCase(`I am about to ${item.mainEn}.`)], explanation: "ながら marks two actions happening at the same time." }),
		(item) => makeChoiceQuestion({ kind: "ながら", prompt: `日記: ${item.natural}`, subprompt: "What is the main action?", band: "Do a quick reading check.", answer: item.main, options: [item.main, `${item.stem}ます`, "もう終わりました", "これから始めます"], explanation: "The main action is usually the clause after ながら." }),
		(item) => makeTextQuestion({ kind: "ながら", prompt: `${item.stem}＿＿${item.main}。`, subprompt: "Fill the grammar connector for two simultaneous actions.", band: "Type the connector.", answer: "ながら", placeholder: "ながら", explanation: "Use ながら after the ます-stem to show two actions at the same time." }),
		(item) => makeChoiceQuestion({ kind: "ながら", prompt: `会話: 「何をしながら${item.main}か。」`, subprompt: `Answer: while ${item.sideEn}.`, band: "Choose the answer that keeps the side action before ながら.", answer: `${item.stem}ながら${item.main}。`, options: [`${item.stem}ながら${item.main}。`, `${item.main}ながら${item.stem}ます。`, `${item.stem}までに${item.main}。`, `${item.stem}ところです。`], explanation: "The action before ながら is the accompanying action." }),
		(item) => makeChoiceQuestion({ kind: "ながら", prompt: `友だちの作文: ${item.natural}`, subprompt: "Which part tells what was happening at the same time?", band: "Find the side action.", answer: `${item.stem}ながら`, options: [`${item.stem}ながら`, item.main, "ところです", "までに"], explanation: "The phrase ending in ながら gives the simultaneous side action." }),
		(item) => makeChoiceQuestion({ kind: "ながら", prompt: `Class note: ${item.stem}ながら＿＿＿＿。`, subprompt: `Complete it with the main action: ${item.mainEn}.`, band: "Choose the main clause.", answer: `${item.main}。`, options: [`${item.main}。`, `${item.stem}ます。`, "ところです。", "までにします。"], explanation: "ながら attaches to the side action; the main action follows it." }),
		(item) => makeChoiceQuestion({ kind: "ながら", prompt: `Which sentence is NOT natural for “while ${item.sideEn}, I ${item.mainEn}”?`, subprompt: "Watch the verb form before ながら.", band: "Choose the sentence with the wrong form.", answer: `${item.stem}ますながら${item.main}。`, options: [`${item.stem}ますながら${item.main}。`, item.natural, `${item.stem}ながら、${item.main}。`, `${item.stem}ながら${item.main}。`], explanation: "ながら attaches to the ます-stem, not the full ます form." }),
		(item) => makeTextQuestion({ kind: "ながら", prompt: `I ${item.mainEn} while ${item.sideEn}.`, subprompt: "Type the full Japanese sentence.", band: "Build the whole ながら sentence.", answer: item.natural, placeholder: "例: 音楽を聞きながら料理を作ります。", explanation: `The full sentence is ${item.natural}` })
	],
	tokoro: [
		(item) => makeChoiceQuestion({ kind: "ところ", prompt: `${item.dict}ところです。`, subprompt: `The speaker is about to ${item.actionEn}.`, band: "Choose the matching stage.", answer: "just before / about to start", options: ["just before / about to start", "in the middle of the action", "just after finishing", "a deadline"], explanation: "Dictionary form + ところです means the action is just about to happen." }),
		(item) => makeChoiceQuestion({ kind: "ところ", prompt: `${item.teiru}ところです。`, subprompt: `The speaker is in the middle of ${item.actionEn}.`, band: "Choose the matching stage.", answer: "in the middle of the action", options: ["in the middle of the action", "just before / about to start", "just after finishing", "until an endpoint"], explanation: "ている + ところです means the action is currently in progress." }),
		(item) => makeChoiceQuestion({ kind: "ところ", prompt: `${item.ta}ところです。`, subprompt: `The speaker just ${item.actionEn}.`, band: "Choose the matching stage.", answer: "just after finishing", options: ["just after finishing", "in the middle of the action", "just before / about to start", "by a deadline"], explanation: "た-form + ところです means the action has just finished." }),
		(item) => makeChoiceQuestion({ kind: "ところ", prompt: `Context: ${item.setupBefore}`, subprompt: "What should you say if the action is about to happen?", band: "Choose the ところ sentence.", answer: `${item.dict}ところです。`, options: [`${item.dict}ところです。`, `${item.teiru}ところです。`, `${item.ta}ところです。`, `${item.dict}までです。`], explanation: "The setup points to the moment right before the action, so use dictionary form + ところです." }),
		(item) => makeChoiceQuestion({ kind: "ところ", prompt: `Context: ${item.setupDuring}`, subprompt: "Which sentence matches the current action?", band: "Choose the in-progress form.", answer: `${item.teiru}ところです。`, options: [`${item.teiru}ところです。`, `${item.dict}ところです。`, `${item.ta}ところです。`, `${item.teiru}までにです。`], explanation: "For an action in progress, use ている + ところです." }),
		(item) => makeChoiceQuestion({ kind: "ところ", prompt: `Context: ${item.setupAfter}`, subprompt: "Which sentence means it just happened?", band: "Choose the just-finished form.", answer: `${item.ta}ところです。`, options: [`${item.ta}ところです。`, `${item.teiru}ところです。`, `${item.dict}ところです。`, `${item.ta}までです。`], explanation: "For a freshly completed action, use た-form + ところです." }),
		(item) => makeTextQuestion({ kind: "ところ", prompt: `今から${item.dict}＿＿＿＿。`, subprompt: `The speaker is about to ${item.actionEn}.`, band: "Type the ending.", answer: "ところです", placeholder: "ところです", explanation: "Dictionary form + ところです shows the moment just before starting." }),
		(item) => makeTextQuestion({ kind: "ところ", prompt: `今、${item.teiru}＿＿＿＿。`, subprompt: `The speaker is in the middle of ${item.actionEn}.`, band: "Type the ending.", answer: "ところです", placeholder: "ところです", explanation: "ている + ところです shows the action is happening right now." }),
		(item) => makeTextQuestion({ kind: "ところ", prompt: `今、${item.ta}＿＿＿＿。`, subprompt: `The speaker just finished: ${item.actionEn}.`, band: "Type the ending.", answer: "ところです", placeholder: "ところです", explanation: "た-form + ところです shows something just happened." }),
		(item) => makeChoiceQuestion({ kind: "ところ", prompt: `電話: 「もしもし、今いい？」 「ごめん、${item.teiru}ところです。」`, subprompt: "What is happening?", band: "Read the short conversation.", answer: "The speaker is in the middle of the action.", options: ["The speaker is in the middle of the action.", "The speaker is about to start later.", "The speaker finished a long time ago.", "The speaker has a deadline."], explanation: "今 plus ているところです points to an action currently in progress." }),
		(item) => makeChoiceQuestion({ kind: "ところ", prompt: `Narration: ${item.setupBefore} 「今から＿＿＿＿。」`, subprompt: `Say “I am just about to ${item.actionEn}.”`, band: "Choose the form before ところです.", answer: item.dict, options: [item.dict, item.teiru, item.ta, `${item.dict}まで`], explanation: "Use the dictionary form before ところです for the moment just before an action." }),
		(item) => makeChoiceQuestion({ kind: "ところ", prompt: `Narration: ${item.setupAfter} 「ちょうど＿＿＿＿。」`, subprompt: `Say “I just ${item.actionEn}.”`, band: "Choose the form before ところです.", answer: item.ta, options: [item.ta, item.teiru, item.dict, `${item.ta}までに`], explanation: "Use the た-form before ところです for the moment just after an action." })
	],
	limit: [
		(item) => makeChoiceQuestion({ kind: "まで", prompt: `${item.limit}まで${item.continuous}。`, subprompt: "Choose the meaning.", band: "Read まで as a continuing limit.", answer: item.untilEn, options: [item.untilEn, item.byEn, "The action has just started.", "Two actions happen at the same time."], explanation: "まで follows a time limit for a continuing action or state." }),
		(item) => makeChoiceQuestion({ kind: "までに", prompt: `${item.limit}までに${item.instant}。`, subprompt: "Choose the meaning.", band: "Read までに as a deadline.", answer: item.byEn, options: [item.byEn, item.untilEn, "The action is happening now.", "The action was just completed."], explanation: "までに marks the deadline by which a short action should happen." }),
		(item) => makeTextQuestion({ kind: "まで", prompt: `${item.limit}＿＿${item.continuous}。`, subprompt: item.untilEn, band: "Type まで or までに.", answer: "まで", placeholder: "まで / までに", explanation: "Use まで with a continuing action or state." }),
		(item) => makeTextQuestion({ kind: "までに", prompt: `${item.limit}＿＿${item.instant}。`, subprompt: item.byEn, band: "Type まで or までに.", answer: "までに", placeholder: "まで / までに", explanation: "Use までに with a deadline for completing an action." }),
		(item) => makeChoiceQuestion({ kind: "まで vs までに", prompt: `先生: ${item.limit}＿＿${item.instant}。`, subprompt: "The teacher is setting a deadline.", band: "Choose the right particle.", answer: "までに", options: ["までに", "まで", "ながら", "ところ"], explanation: "A deadline for doing something uses までに." }),
		(item) => makeChoiceQuestion({ kind: "まで vs までに", prompt: `予定: ${item.limit}＿＿${item.continuous}。`, subprompt: "The action continues until that point.", band: "Choose the right particle.", answer: "まで", options: ["まで", "までに", "ながら", "ところ"], explanation: "A continuing action or state uses まで." }),
		(item) => makeChoiceQuestion({ kind: "まで", prompt: item.untilEn, subprompt: "Choose the Japanese sentence.", band: "Look for the continuing action.", answer: `${item.limit}まで${item.continuous}。`, options: [`${item.limit}まで${item.continuous}。`, `${item.limit}までに${item.continuous}。`, `${item.limit}まで${item.instant}。`, `${item.limit}ながら${item.continuous}。`], explanation: "The English “until” plus a continuing action maps to まで." }),
		(item) => makeChoiceQuestion({ kind: "までに", prompt: item.byEn, subprompt: "Choose the Japanese sentence.", band: "Look for the deadline action.", answer: `${item.limit}までに${item.instant}。`, options: [`${item.limit}までに${item.instant}。`, `${item.limit}まで${item.instant}。`, `${item.limit}までに${item.continuous}。`, `${item.limit}ところ${item.instant}。`], explanation: "The English “by” plus a one-time action maps to までに." }),
		(item) => makeChoiceQuestion({ kind: "まで vs までに", prompt: `Which sentence sounds like a deadline?`, subprompt: `${item.limit} is the time limit.`, band: "Choose the sentence with までに.", answer: `${item.limit}までに${item.instant}。`, options: [`${item.limit}までに${item.instant}。`, `${item.limit}まで${item.continuous}。`, `${item.limit}ながら${item.continuous}。`, `${item.limit}ところです。`], explanation: "までに tells you the action should be completed no later than that time." }),
		(item) => makeChoiceQuestion({ kind: "まで vs までに", prompt: `Which sentence sounds like something continues?`, subprompt: `${item.limit} is the endpoint.`, band: "Choose the sentence with まで.", answer: `${item.limit}まで${item.continuous}。`, options: [`${item.limit}まで${item.continuous}。`, `${item.limit}までに${item.instant}。`, `${item.limit}ながら${item.instant}。`, `${item.limit}ところです。`], explanation: "まで marks the endpoint of a continuing action or state." }),
		(item) => makeTextQuestion({ kind: "まで", prompt: `A: いつまで？ B: ${item.limit}＿＿${item.continuous}。`, subprompt: "Answer with a continuing limit.", band: "Type まで or までに.", answer: "まで", placeholder: "まで", explanation: "Use まで when answering how long something continues." }),
		(item) => makeTextQuestion({ kind: "までに", prompt: `A: いつ出せばいいですか。 B: ${item.limit}＿＿${item.instant}。`, subprompt: "Answer with a deadline.", band: "Type まで or までに.", answer: "までに", placeholder: "までに", explanation: "Use までに when the action must be done by a deadline." })
	]
};

const invitationScenarios = [
	{ stem: "テニスをし", mashou: "テニスをしましょう", actionEn: "play tennis", context: "日曜日、ひまですか。", natural: "一緒にテニスをしませんか。", accept: "いいですね。テニスをしましょう。", decline: "すみません、日曜日はちょっと..." },
	{ stem: "映画を見", mashou: "映画を見ましょう", actionEn: "watch a movie", context: "新しい映画がありますよ。", natural: "一緒に映画を見ませんか。", accept: "いいですね。映画を見ましょう。", decline: "すみません、今日はちょっと..." },
	{ stem: "昼ご飯を食べ", mashou: "昼ご飯を食べましょう", actionEn: "eat lunch", context: "もう十二時ですね。", natural: "一緒に昼ご飯を食べませんか。", accept: "いいですね。食べましょう。", decline: "すみません、まだ仕事があります。" },
	{ stem: "図書館へ行き", mashou: "図書館へ行きましょう", actionEn: "go to the library", context: "明日、試験があります。", natural: "一緒に図書館へ行きませんか。", accept: "いいですね。行きましょう。", decline: "すみません、家で勉強します。" },
	{ stem: "日本語を勉強し", mashou: "日本語を勉強しましょう", actionEn: "study Japanese", context: "宿題がむずかしいですね。", natural: "一緒に日本語を勉強しませんか。", accept: "いいですね。勉強しましょう。", decline: "すみません、今日は疲れました。" },
	{ stem: "コーヒーを飲み", mashou: "コーヒーを飲みましょう", actionEn: "drink coffee", context: "少し休みたいです。", natural: "一緒にコーヒーを飲みませんか。", accept: "いいですね。飲みましょう。", decline: "すみません、コーヒーは苦手です。" },
	{ stem: "散歩し", mashou: "散歩しましょう", actionEn: "take a walk", context: "天気がいいですね。", natural: "一緒に散歩しませんか。", accept: "いいですね。散歩しましょう。", decline: "すみません、足が痛いです。" },
	{ stem: "買い物に行き", mashou: "買い物に行きましょう", actionEn: "go shopping", context: "駅の近くに新しい店があります。", natural: "一緒に買い物に行きませんか。", accept: "いいですね。行きましょう。", decline: "すみません、今日はお金がありません。" },
	{ stem: "晩ご飯を作り", mashou: "晩ご飯を作りましょう", actionEn: "make dinner", context: "冷蔵庫に野菜があります。", natural: "一緒に晩ご飯を作りませんか。", accept: "いいですね。作りましょう。", decline: "すみません、料理はあまりできません。" },
	{ stem: "カラオケに行き", mashou: "カラオケに行きましょう", actionEn: "go to karaoke", context: "今週はよくがんばりましたね。", natural: "一緒にカラオケに行きませんか。", accept: "いいですね。行きましょう。", decline: "すみません、明日は早いです。" },
	{ stem: "写真を撮り", mashou: "写真を撮りましょう", actionEn: "take a photo", context: "桜がきれいですね。", natural: "一緒に写真を撮りませんか。", accept: "いいですね。撮りましょう。", decline: "すみません、写真はちょっと..." },
	{ stem: "駅まで歩き", mashou: "駅まで歩きましょう", actionEn: "walk to the station", context: "バスはまだ来ません。", natural: "一緒に駅まで歩きませんか。", accept: "いいですね。歩きましょう。", decline: "すみません、タクシーで行きたいです。" },
	{ stem: "新しい店に入り", mashou: "新しい店に入りましょう", actionEn: "go into the new shop", context: "あの店はおもしろそうです。", natural: "一緒に新しい店に入りませんか。", accept: "いいですね。入りましょう。", decline: "すみません、時間がありません。" },
	{ stem: "先生に聞き", mashou: "先生に聞きましょう", actionEn: "ask the teacher", context: "この文法がわかりません。", natural: "一緒に先生に聞きませんか。", accept: "いいですね。聞きましょう。", decline: "すみません、あとで聞きます。" },
	{ stem: "公園で休み", mashou: "公園で休みましょう", actionEn: "rest in the park", context: "たくさん歩きましたね。", natural: "一緒に公園で休みませんか。", accept: "いいですね。休みましょう。", decline: "すみません、すぐ帰ります。" },
	{ stem: "宿題をし", mashou: "宿題をしましょう", actionEn: "do homework", context: "明日までの宿題があります。", natural: "一緒に宿題をしませんか。", accept: "いいですね。しましょう。", decline: "すみません、もう終わりました。" },
	{ stem: "旅行の計画を立て", mashou: "旅行の計画を立てましょう", actionEn: "make travel plans", context: "夏休みに旅行したいですね。", natural: "一緒に旅行の計画を立てませんか。", accept: "いいですね。立てましょう。", decline: "すみません、まだ予定がわかりません。" },
	{ stem: "英語で話し", mashou: "英語で話しましょう", actionEn: "speak in English", context: "会話の練習をしたいです。", natural: "一緒に英語で話しませんか。", accept: "いいですね。話しましょう。", decline: "すみません、日本語で話したいです。" }
];

const sharedSuggestionScenarios = [
	{ stem: "帰り", mashou: "帰りましょう", question: "帰りましょうか", actionEn: "go home", context: "もう五時ですね。", natural: "そろそろ帰りましょう。", consent: "そろそろ帰りましょうか。", response: "そうですね。帰りましょう。" },
	{ stem: "休み", mashou: "休みましょう", question: "休みましょうか", actionEn: "take a break", context: "少し疲れましたね。", natural: "少し休みましょう。", consent: "少し休みましょうか。", response: "そうですね。休みましょう。" },
	{ stem: "始め", mashou: "始めましょう", question: "始めましょうか", actionEn: "start", context: "みんな来ました。", natural: "始めましょう。", consent: "始めましょうか。", response: "はい、始めましょう。" },
	{ stem: "行き", mashou: "行きましょう", question: "行きましょうか", actionEn: "go", context: "電車の時間です。", natural: "行きましょう。", consent: "行きましょうか。", response: "はい、行きましょう。" },
	{ stem: "注文し", mashou: "注文しましょう", question: "注文しましょうか", actionEn: "order", context: "メニューを決めました。", natural: "注文しましょう。", consent: "注文しましょうか。", response: "はい、注文しましょう。" },
	{ stem: "練習し", mashou: "練習しましょう", question: "練習しましょうか", actionEn: "practice", context: "発表は明日です。", natural: "もう一度練習しましょう。", consent: "もう一度練習しましょうか。", response: "はい、練習しましょう。" },
	{ stem: "待ち", mashou: "待ちましょう", question: "待ちましょうか", actionEn: "wait", context: "友だちはまだ来ません。", natural: "ここで待ちましょう。", consent: "ここで待ちましょうか。", response: "そうですね。待ちましょう。" },
	{ stem: "タクシーを呼び", mashou: "タクシーを呼びましょう", question: "タクシーを呼びましょうか", actionEn: "call a taxi", context: "雨が強いです。", natural: "タクシーを呼びましょう。", consent: "タクシーを呼びましょうか。", response: "そうですね。呼びましょう。" },
	{ stem: "早く寝", mashou: "早く寝ましょう", question: "早く寝ましょうか", actionEn: "go to bed early", context: "明日は朝が早いです。", natural: "今日は早く寝ましょう。", consent: "今日は早く寝ましょうか。", response: "そうですね。寝ましょう。" },
	{ stem: "もう一度読み", mashou: "もう一度読みましょう", question: "もう一度読みましょうか", actionEn: "read it one more time", context: "意味が少しむずかしいです。", natural: "もう一度読みましょう。", consent: "もう一度読みましょうか。", response: "はい、読みましょう。" },
	{ stem: "地図を見", mashou: "地図を見ましょう", question: "地図を見ましょうか", actionEn: "look at the map", context: "道がわかりません。", natural: "地図を見ましょう。", consent: "地図を見ましょうか。", response: "そうですね。見ましょう。" },
	{ stem: "窓を閉め", mashou: "窓を閉めましょう", question: "窓を閉めましょうか", actionEn: "close the window", context: "少し寒いですね。", natural: "窓を閉めましょう。", consent: "窓を閉めましょうか。", response: "はい、閉めましょう。" },
	{ stem: "水を買い", mashou: "水を買いましょう", question: "水を買いましょうか", actionEn: "buy water", context: "山に登る前です。", natural: "水を買いましょう。", consent: "水を買いましょうか。", response: "はい、買いましょう。" },
	{ stem: "ここに座り", mashou: "ここに座りましょう", question: "ここに座りましょうか", actionEn: "sit here", context: "席が二つあります。", natural: "ここに座りましょう。", consent: "ここに座りましょうか。", response: "そうですね。座りましょう。" },
	{ stem: "次の駅で降り", mashou: "次の駅で降りましょう", question: "次の駅で降りましょうか", actionEn: "get off at the next station", context: "次が目的地です。", natural: "次の駅で降りましょう。", consent: "次の駅で降りましょうか。", response: "はい、降りましょう。" },
	{ stem: "先生を手伝い", mashou: "先生を手伝いましょう", question: "先生を手伝いましょうか", actionEn: "help the teacher", context: "先生が重い箱を持っています。", natural: "先生を手伝いましょう。", consent: "先生を手伝いましょうか。", response: "そうですね。手伝いましょう。" }
];

const offerScenarios = [
	{ stem: "荷物を持ち", actionEn: "carry your bags", context: "荷物が重そうですね。", natural: "荷物を持ちましょうか。", accept: "ありがとうございます。お願いします。", decline: "大丈夫です。ありがとうございます。" },
	{ stem: "窓を開け", actionEn: "open the window", context: "暑そうですね。", natural: "窓を開けましょうか。", accept: "はい、お願いします。", decline: "いいえ、大丈夫です。" },
	{ stem: "窓を閉め", actionEn: "close the window", context: "寒そうですね。", natural: "窓を閉めましょうか。", accept: "はい、お願いします。", decline: "いいえ、まだ大丈夫です。" },
	{ stem: "電気をつけ", actionEn: "turn on the light", context: "部屋が暗いですね。", natural: "電気をつけましょうか。", accept: "はい、お願いします。", decline: "いいえ、大丈夫です。" },
	{ stem: "写真を撮り", actionEn: "take a photo", context: "みんなで写真を撮りたいですか。", natural: "写真を撮りましょうか。", accept: "ありがとうございます。お願いします。", decline: "大丈夫です。自分で撮ります。" },
	{ stem: "駅まで送り", actionEn: "take you to the station", context: "雨が降っていますね。", natural: "駅まで送りましょうか。", accept: "ありがとうございます。お願いします。", decline: "大丈夫です。歩いて行きます。" },
	{ stem: "地図を書き", actionEn: "draw a map", context: "道がわかりにくいですね。", natural: "地図を書きましょうか。", accept: "ありがとうございます。お願いします。", decline: "大丈夫です。スマホで見ます。" },
	{ stem: "予約し", actionEn: "make a reservation", context: "そのレストランは人気です。", natural: "予約しましょうか。", accept: "はい、お願いします。", decline: "いいえ、あとでします。" },
	{ stem: "コピーし", actionEn: "make copies", context: "資料が足りませんね。", natural: "コピーしましょうか。", accept: "はい、お願いします。", decline: "いいえ、もうしました。" },
	{ stem: "説明し", actionEn: "explain it", context: "この問題がむずかしそうですね。", natural: "説明しましょうか。", accept: "はい、お願いします。", decline: "大丈夫です。もう一度読みます。" },
	{ stem: "水を持って来", actionEn: "bring water", context: "のどがかわきましたか。", natural: "水を持って来ましょうか。", accept: "ありがとうございます。お願いします。", decline: "大丈夫です。ありがとうございます。" },
	{ stem: "傘を貸し", actionEn: "lend you an umbrella", context: "傘を忘れたんですか。", natural: "傘を貸しましょうか。", accept: "ありがとうございます。お願いします。", decline: "大丈夫です。駅で買います。" },
	{ stem: "医者を呼び", actionEn: "call a doctor", context: "顔色が悪いですよ。", natural: "医者を呼びましょうか。", accept: "はい、お願いします。", decline: "大丈夫です。少し休みます。" },
	{ stem: "かばんを預かり", actionEn: "hold your bag", context: "トイレに行きたいんですね。", natural: "かばんを預かりましょうか。", accept: "ありがとうございます。お願いします。", decline: "大丈夫です。持って行きます。" },
	{ stem: "ドアを開け", actionEn: "open the door", context: "手がふさがっていますね。", natural: "ドアを開けましょうか。", accept: "ありがとうございます。お願いします。", decline: "大丈夫です。開けられます。" },
	{ stem: "メールを書き", actionEn: "write the email", context: "日本語のメールがむずかしいですか。", natural: "メールを書きましょうか。", accept: "はい、お願いします。", decline: "大丈夫です。自分で書いてみます。" },
	{ stem: "席を探し", actionEn: "look for seats", context: "店が混んでいますね。", natural: "席を探しましょうか。", accept: "はい、お願いします。", decline: "大丈夫です。少し待ちます。" },
	{ stem: "先生に電話し", actionEn: "call the teacher", context: "先生に急いで知らせたいですね。", natural: "先生に電話しましょうか。", accept: "はい、お願いします。", decline: "いいえ、メールします。" }
];

const invitationQuestionTemplates = {
	masenka: [
		(item) => makeChoiceQuestion({ kind: "ませんか", prompt: `Invite a friend to ${item.actionEn}.`, subprompt: item.context, band: "Choose the polite invitation.", answer: item.natural, options: [item.natural, `一緒に${item.stem}ましょうか。`, `${item.stem}ません。`, `${item.stem}ましたか。`], explanation: "Use ませんか to politely invite someone to do something with you." }),
		(item) => makeTextQuestion({ kind: "ませんか", prompt: `一緒に${item.stem}＿＿＿＿。`, subprompt: `Invite someone to ${item.actionEn}.`, band: "Type the invitation ending.", answer: "ませんか", placeholder: "ませんか", explanation: `The invitation is ${item.natural}` }),
		(item) => makeChoiceQuestion({ kind: "ませんか", prompt: item.natural, subprompt: "What is the speaker doing?", band: "Read the intent.", answer: "inviting the listener to do something together", options: ["inviting the listener to do something together", "saying they will not do it", "offering to do it alone for the listener", "reporting what already happened"], explanation: "In this pattern, the negative question is a soft invitation, not a refusal." }),
		(item) => makeChoiceQuestion({ kind: "ませんか", prompt: `A: ${item.natural} B: ＿＿＿＿`, subprompt: "Choose a natural positive response.", band: "Respond to the invitation.", answer: item.accept, options: [item.accept, item.decline, "いいえ、しましょう。", "お願いします。持ちます。"], explanation: "A positive response to an invitation often agrees and repeats the action with ましょう." }),
		(item) => makeChoiceQuestion({ kind: "ませんか", prompt: `A: ${item.natural} B: ＿＿＿＿`, subprompt: "Choose a natural soft refusal.", band: "Decline politely.", answer: item.decline, options: [item.decline, item.accept, "はい、お願いします。", `${item.mashou}か。`], explanation: "A soft refusal often starts with すみません and gives a short reason or trails off." }),
		(item) => makeChoiceQuestion({ kind: "ませんか", prompt: `Context: ${item.context}`, subprompt: `You want to invite the listener to ${item.actionEn}, not decide for them.`, band: "Choose ませんか, not ましょう.", answer: item.natural, options: [item.natural, `${item.mashou}。`, `${item.mashou}か。`, `${item.stem}ません。`], explanation: "ませんか leaves room for the other person to accept or decline." }),
		(item) => makeChoiceQuestion({ kind: "ませんか", prompt: `Which sentence is the invitation?`, subprompt: `Target action: ${item.actionEn}.`, band: "Find the ませんか pattern.", answer: item.natural, options: [item.natural, `${item.mashou}。`, `${item.stem}ません。`, `${item.stem}ませんでした。`], explanation: "The invitation form is ます-stem + ませんか." }),
		(item) => makeTextQuestion({ kind: "ませんか", prompt: `Invite someone: ${item.actionEn}.`, subprompt: "Type the full Japanese sentence with 一緒に.", band: "Build the whole invitation.", answer: item.natural, placeholder: "例: 一緒に映画を見ませんか。", explanation: `Use the ます-stem plus ませんか: ${item.natural}` }),
		(item) => makeChoiceQuestion({ kind: "ませんか", prompt: `友だち: 「${item.context}」`, subprompt: "You want to suggest doing something together.", band: "Choose the most natural next line.", answer: item.natural, options: [item.natural, `${item.stem}ましょうか。`, `${item.stem}ところです。`, `${item.stem}ながら。`], explanation: "For an invitation to do something together, ませんか is natural and polite." }),
		(item) => makeChoiceQuestion({ kind: "ませんか", prompt: `${item.stem}ませんか。`, subprompt: "Which ending makes this an invitation?", band: "Identify the grammar.", answer: "ませんか", options: ["ませんか", "ましょうか", "ました", "ながら"], explanation: "ませんか can mean “won't you / shall we” as an invitation." }),
		(item) => makeChoiceQuestion({ kind: "ませんか vs ましょうか", prompt: `Context: ${item.context}`, subprompt: `You want to invite the listener to ${item.actionEn}, not offer to do it for them.`, band: "Choose ませんか.", answer: item.natural, options: [item.natural, `${item.stem}ましょうか。`, `${item.mashou}。`, `${item.stem}ません。`], explanation: "Use ませんか when you are inviting the listener to join the action." }),
		(item) => makeChoiceQuestion({ kind: "ませんか vs ましょうか", prompt: `Which sentence is an invitation, not “Shall I do it?”`, subprompt: `Target action: ${item.actionEn}.`, band: "Separate invitation from offer.", answer: item.natural, options: [item.natural, `${item.stem}ましょうか。`, `${item.mashou}。`, `${item.stem}ませんでした。`], explanation: "ませんか asks the listener to consider doing the action together." }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: `「${item.natural}」「${item.accept}」`, subprompt: "What happened in this exchange?", band: "Read the invitation dialogue.", answer: "The speaker invited the listener, and the listener accepted.", options: ["The speaker invited the listener, and the listener accepted.", "The speaker offered to do it alone for the listener.", "The speaker refused the invitation.", "The speaker asked whether the action had finished."], explanation: "An invitation with ませんか can be accepted with いいですね and a ましょう response." }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: `「${item.natural}」「${item.decline}」`, subprompt: "What happened in this exchange?", band: "Read the invitation dialogue.", answer: "The speaker invited the listener, and the listener declined politely.", options: ["The speaker invited the listener, and the listener declined politely.", "The speaker offered help, and the listener accepted.", "Both people decided to start immediately.", "The listener asked for a favor."], explanation: "A reply beginning with すみません usually softens a refusal here." })
	],
	mashou: [
		(item) => makeChoiceQuestion({ kind: "ましょう", prompt: `Context: ${item.context}`, subprompt: `Suggest: “Let's ${item.actionEn}.”`, band: "Choose the shared suggestion.", answer: `${item.natural}`, options: [`${item.natural}`, `${item.stem}ませんか。`, `${item.stem}ました。`, `${item.stem}ません。`], explanation: "ましょう is a direct “let's...” suggestion." }),
		(item) => makeTextQuestion({ kind: "ましょう", prompt: `${item.stem}＿＿＿＿。`, subprompt: `Say “Let's ${item.actionEn}.”`, band: "Type the suggestion ending.", answer: "ましょう", placeholder: "ましょう", explanation: `Use ます-stem + ましょう: ${item.mashou}。` }),
		(item) => makeChoiceQuestion({ kind: "ましょう", prompt: item.natural, subprompt: "Choose the meaning.", band: "Read the sentence.", answer: sentenceCase(`Let's ${item.actionEn}.`), options: [sentenceCase(`Let's ${item.actionEn}.`), sentenceCase(`Won't you ${item.actionEn}?`), sentenceCase(`I will not ${item.actionEn}.`), sentenceCase(`I just ${item.actionEn}.`)], explanation: "ましょう means the speaker is suggesting the action together." }),
		(item) => makeChoiceQuestion({ kind: "ましょうか", prompt: item.consent, subprompt: "What nuance does か add here?", band: "Read the softer suggestion.", answer: "It asks for the listener's agreement before acting together.", options: ["It asks for the listener's agreement before acting together.", "It means the speaker refuses.", "It means the action just finished.", "It means the listener must do it alone."], explanation: "ましょうか can soften a shared suggestion by checking the listener's agreement." }),
		(item) => makeChoiceQuestion({ kind: "ましょう", prompt: `A: ${item.consent} B: ＿＿＿＿`, subprompt: "Choose a natural agreement.", band: "Respond to a shared suggestion.", answer: item.response, options: [item.response, "いいえ、お願いします。", `${item.stem}ませんでした。`, "ありがとうございます。大丈夫です。"], explanation: "A shared suggestion can be accepted with そうですね / はい plus ましょう." }),
		(item) => makeChoiceQuestion({ kind: "ましょうか", prompt: `Context: ${item.context}`, subprompt: `Ask if you and the listener should ${item.actionEn}.`, band: "Choose the agreement-checking form.", answer: `${item.consent}`, options: [`${item.consent}`, `${item.stem}ません。`, `${item.stem}ところです。`, `${item.stem}までに。`], explanation: "ましょうか is useful when checking whether to do an action together." }),
		(item) => makeChoiceQuestion({ kind: "ましょう", prompt: `Which one is strongest as “Let's ${item.actionEn}”?`, subprompt: "No special politeness puzzle here; just choose ましょう.", band: "Spot the direct suggestion.", answer: `${item.mashou}。`, options: [`${item.mashou}。`, `${item.stem}ませんか。`, `${item.stem}ません。`, `${item.stem}ましたか。`], explanation: "ましょう is the direct “let's do it” form." }),
		(item) => makeTextQuestion({ kind: "ましょうか", prompt: `${item.stem}＿＿＿＿。`, subprompt: `Ask “Shall we ${item.actionEn}?”`, band: "Type the softer suggestion ending.", answer: "ましょうか", placeholder: "ましょうか", explanation: `Use ます-stem + ましょうか: ${item.question}。` }),
		(item) => makeChoiceQuestion({ kind: "ませんか vs ましょうか", prompt: `Context: ${item.context}`, subprompt: `You and the listener are deciding whether to ${item.actionEn} together.`, band: "Choose the agreement-checking form.", answer: item.consent, options: [item.consent, `${item.stem}ませんか。`, `${item.mashou}。`, `${item.stem}ません。`], explanation: "Use ましょうか when checking agreement about a shared action." }),
		(item) => makeChoiceQuestion({ kind: "ませんか vs ましょうか", prompt: `Which sentence asks “Shall we ${item.actionEn}?”`, subprompt: "The action is shared, and the speaker is checking agreement.", band: "Choose ましょうか.", answer: `${item.question}。`, options: [`${item.question}。`, `${item.stem}ませんか。`, `${item.mashou}。`, `${item.stem}ませんでした。`], explanation: "ましょうか can mean “Shall we...?” when both people would do the action." }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: `「${item.consent}」「${item.response}」`, subprompt: "What happened in this exchange?", band: "Read the shared-suggestion dialogue.", answer: "The speaker checked agreement, and both people decided to do it.", options: ["The speaker checked agreement, and both people decided to do it.", "The speaker invited the listener to a future event.", "The speaker offered to do it alone.", "The listener refused the offer."], explanation: "ましょうか checks agreement; the response confirms the shared action." }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: item.natural, subprompt: "What is the speaker saying?", band: "Read the direct suggestion.", answer: sentenceCase(`Let's ${item.actionEn}.`), options: [sentenceCase(`Let's ${item.actionEn}.`), sentenceCase(`Won't you ${item.actionEn}?`), sentenceCase(`Shall I ${item.actionEn} for you?`), sentenceCase(`I did not ${item.actionEn}.`)], explanation: "ましょう is the direct “let's...” form." })
	],
	offer: [
		(item) => makeChoiceQuestion({ kind: "ましょうか", prompt: `Offer: “Shall I ${item.actionEn}?”`, subprompt: item.context, band: "Choose the offer of help.", answer: item.natural, options: [item.natural, `${item.stem}ませんか。`, `${item.stem}ましょう。`, `${item.stem}ましたか。`], explanation: "ましょうか can offer to do something for the listener: “Shall I...?”" }),
		(item) => makeTextQuestion({ kind: "ましょうか", prompt: `${item.stem}＿＿＿＿。`, subprompt: `Offer to ${item.actionEn}.`, band: "Type the offer ending.", answer: "ましょうか", placeholder: "ましょうか", explanation: `The offer is ${item.natural}` }),
		(item) => makeChoiceQuestion({ kind: "ましょうか", prompt: item.natural, subprompt: "Choose the meaning.", band: "Read the offer.", answer: sentenceCase(`Shall I ${item.actionEn}?`), options: [sentenceCase(`Shall I ${item.actionEn}?`), sentenceCase(`Won't you ${item.actionEn}?`), sentenceCase(`Let's not ${item.actionEn}.`), sentenceCase(`I just ${item.actionEn}.`)], explanation: "When the speaker can do the action for someone, ましょうか often means “Shall I...?”" }),
		(item) => makeChoiceQuestion({ kind: "ましょうか", prompt: `A: ${item.natural} B: ＿＿＿＿`, subprompt: "Choose a natural acceptance.", band: "Accept the offer.", answer: item.accept, options: [item.accept, item.decline, `${item.stem}ませんか。`, "いいですね。しましょう。"], explanation: "Offers of help are often accepted with お願いします." }),
		(item) => makeChoiceQuestion({ kind: "ましょうか", prompt: `A: ${item.natural} B: ＿＿＿＿`, subprompt: "Choose a natural polite refusal.", band: "Decline the offer.", answer: item.decline, options: [item.decline, item.accept, "はい、しましょう。", `${item.stem}ませんでした。`], explanation: "大丈夫です is a common soft refusal for an offer of help." }),
		(item) => makeChoiceQuestion({ kind: "ませんか vs ましょうか", prompt: `Context: ${item.context}`, subprompt: `You are offering to ${item.actionEn} for the listener.`, band: "Choose ましょうか, not ませんか.", answer: item.natural, options: [item.natural, `${item.stem}ませんか。`, `${item.stem}ましょう。`, `${item.stem}ません。`], explanation: "For “Shall I do it for you?”, use ましょうか." }),
		(item) => makeChoiceQuestion({ kind: "ましょうか", prompt: `Which sentence offers help?`, subprompt: `Target action: ${item.actionEn}.`, band: "Find the offer.", answer: item.natural, options: [item.natural, `${item.stem}ませんか。`, `${item.stem}ませんでした。`, `${item.stem}ながら。`], explanation: "The offer uses ます-stem + ましょうか." }),
		(item) => makeTextQuestion({ kind: "ましょうか", prompt: `Offer help: ${item.actionEn}.`, subprompt: "Type the full Japanese sentence.", band: "Build the whole offer.", answer: item.natural, placeholder: "例: 荷物を持ちましょうか。", explanation: `Use ましょうか for the offer: ${item.natural}` }),
		(item) => makeChoiceQuestion({ kind: "ましょうか", prompt: `A: ${item.context} B: ＿＿＿＿`, subprompt: "Choose the helpful reply.", band: "Pick the offer.", answer: item.natural, options: [item.natural, `${item.stem}ませんか。`, "いいですね。", `${item.stem}ところです。`], explanation: "The context calls for offering your help, so ましょうか fits." }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: `「${item.natural}」「${item.accept}」`, subprompt: "What happened in this exchange?", band: "Read the short dialogue.", answer: "The speaker offered help, and the listener accepted.", options: ["The speaker offered help, and the listener accepted.", "The speaker invited the listener to do it together.", "The speaker refused to help.", "The listener said the action was already finished."], explanation: "ましょうか plus お願いします is a common offer-and-acceptance exchange." }),
		(item) => makeChoiceQuestion({ kind: "ませんか vs ましょうか", prompt: `Which sentence means “Shall I ${item.actionEn}?”`, subprompt: "The speaker will do the action for the listener.", band: "Choose the offer form.", answer: item.natural, options: [item.natural, `${item.stem}ませんか。`, `${item.stem}ましょう。`, `${item.stem}ません。`], explanation: "When the speaker offers their own help, ましょうか is the natural choice." }),
		(item) => makeChoiceQuestion({ kind: "ませんか vs ましょうか", prompt: `A: ${item.context} B: ＿＿＿＿`, subprompt: "Choose the line that offers help, not an invitation.", band: "Contrast the two question forms.", answer: item.natural, options: [item.natural, `${item.stem}ませんか。`, `${item.stem}ましょう。`, `${item.stem}ましたか。`], explanation: "ませんか invites the listener; ましょうか offers or checks agreement." }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: `「${item.natural}」「${item.decline}」`, subprompt: "What happened in this exchange?", band: "Read the offer dialogue.", answer: "The speaker offered help, and the listener declined politely.", options: ["The speaker offered help, and the listener declined politely.", "The speaker invited the listener to join.", "Both people agreed to do it together.", "The speaker said they would not do it."], explanation: "大丈夫です often politely declines an offer of help." }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: item.natural, subprompt: "What is the speaker doing?", band: "Read the offer.", answer: "offering to do the action for the listener", options: ["offering to do the action for the listener", "inviting the listener to do it together", "saying the action is impossible", "asking if the listener already did it"], explanation: "ましょうか often means “Shall I...?” when the speaker can help." })
	]
};

const potentialScenarios = [
	{ subject: "ジョーさん", object: "日本語", verbPlain: "話す", masu: "話します", potential: "話せます", negative: "話せません", actionEn: "speak Japanese", context: "三年間勉強しました。", natural: "ジョーさんは日本語が話せます。", cannot: "ジョーさんはまだ日本語が話せません。" },
	{ subject: "妹", object: "漢字", verbPlain: "読む", masu: "読みます", potential: "読めます", negative: "読めません", actionEn: "read kanji", context: "小学校でたくさん練習しました。", natural: "妹は漢字が読めます。", cannot: "妹はまだ漢字が読めません。" },
	{ subject: "私", object: "この漢字", verbPlain: "書く", masu: "書きます", potential: "書けます", negative: "書けません", actionEn: "write this kanji", context: "昨日、何回も練習しました。", natural: "私はこの漢字が書けます。", cannot: "私はまだこの漢字が書けません。" },
	{ subject: "姉", object: "ピアノ", verbPlain: "弾く", masu: "弾きます", potential: "弾けます", negative: "弾けません", actionEn: "play piano", context: "子どもの時から習っています。", natural: "姉はピアノが弾けます。", cannot: "姉はまだピアノが弾けません。" },
	{ subject: "父", object: "寿司", verbPlain: "作る", masu: "作ります", potential: "作れます", negative: "作れません", actionEn: "make sushi", context: "料理の仕事をしていました。", natural: "父は寿司が作れます。", cannot: "父はまだ寿司が作れません。" },
	{ subject: "はなちゃん", object: "一人で服", verbPlain: "着る", masu: "着ます", potential: "着られます", negative: "着られません", actionEn: "get dressed by herself", context: "もう四歳です。", natural: "はなちゃんは一人で服が着られます。", cannot: "はなちゃんはまだ一人で服が着られません。" },
	{ subject: "私", object: "辛い料理", verbPlain: "食べる", masu: "食べます", potential: "食べられます", negative: "食べられません", actionEn: "eat spicy food", context: "辛い物が好きです。", natural: "私は辛い料理が食べられます。", cannot: "私は辛い料理が食べられません。" },
	{ subject: "弟", object: "ブラックコーヒー", verbPlain: "飲む", masu: "飲みます", potential: "飲めます", negative: "飲めません", actionEn: "drink black coffee", context: "苦い味にも慣れました。", natural: "弟はブラックコーヒーが飲めます。", cannot: "弟はブラックコーヒーが飲めません。" },
	{ subject: "友だち", object: "この歌", verbPlain: "歌う", masu: "歌います", potential: "歌えます", negative: "歌えません", actionEn: "sing this song", context: "カラオケが大好きです。", natural: "友だちはこの歌が歌えます。", cannot: "友だちはまだこの歌が歌えません。" },
	{ subject: "田中さん", object: "英語のメール", verbPlain: "書く", masu: "書きます", potential: "書けます", negative: "書けません", actionEn: "write email in English", context: "会社で英語を使っています。", natural: "田中さんは英語のメールが書けます。", cannot: "田中さんは英語のメールが書けません。" },
	{ subject: "母", object: "きれいな写真", verbPlain: "撮る", masu: "撮ります", potential: "撮れます", negative: "撮れません", actionEn: "take nice photos", context: "新しいカメラを買いました。", natural: "母はきれいな写真が撮れます。", cannot: "母はまだきれいな写真が撮れません。" },
	{ subject: "兄", object: "車", verbPlain: "運転する", masu: "運転します", potential: "運転できます", negative: "運転できません", actionEn: "drive a car", context: "去年、免許を取りました。", natural: "兄は車が運転できます。", cannot: "兄はまだ車が運転できません。" },
	{ subject: "学生", object: "この本", verbPlain: "読む", masu: "読みます", potential: "読めます", negative: "読めません", actionEn: "read this book", context: "ふりがながたくさんあります。", natural: "学生はこの本が読めます。", cannot: "学生はまだこの本が読めません。" },
	{ subject: "子ども", object: "重いドア", verbPlain: "開ける", masu: "開けます", potential: "開けられます", negative: "開けられません", actionEn: "open the heavy door", context: "大きくなって、力も強くなりました。", natural: "子どもは重いドアが開けられます。", cannot: "子どもはまだ重いドアが開けられません。" },
	{ subject: "私", object: "この問題", verbPlain: "解く", masu: "解きます", potential: "解けます", negative: "解けません", actionEn: "solve this problem", context: "先生に説明してもらいました。", natural: "私はこの問題が解けます。", cannot: "私はまだこの問題が解けません。" },
	{ subject: "サムさん", object: "重い荷物", verbPlain: "持つ", masu: "持ちます", potential: "持てます", negative: "持てません", actionEn: "carry heavy bags", context: "サムさんは力があります。", natural: "サムさんは重い荷物が持てます。", cannot: "サムさんは重い荷物が持てません。" },
	{ subject: "祖母", object: "パソコン", verbPlain: "使う", masu: "使います", potential: "使えます", negative: "使えません", actionEn: "use a computer", context: "毎日メールを書いています。", natural: "祖母はパソコンが使えます。", cannot: "祖母はまだパソコンが使えません。" },
	{ subject: "学生たち", object: "この部屋", verbPlain: "予約する", masu: "予約します", potential: "予約できます", negative: "予約できません", actionEn: "reserve this room", context: "学生証があれば大丈夫です。", natural: "学生たちはこの部屋が予約できます。", cannot: "学生たちはこの部屋が予約できません。" }
];

const dekiruScenarios = [
	{ place: "このコンビニでは", noun: "買い物", verbPlain: "買い物をする", actionEn: "shop", context: "二十四時間開いています。", natural: "このコンビニでは買い物ができます。", verbNatural: "このコンビニでは買い物をすることができます。", cannot: "このコンビニでは買い物ができません。" },
	{ place: "この建物の中では", noun: "食事", verbPlain: "食事をする", actionEn: "eat", context: "一階に食堂があります。", natural: "この建物の中では食事ができます。", verbNatural: "この建物の中では食事をすることができます。", cannot: "この建物の中では食事ができません。" },
	{ place: "図書館では", noun: "勉強", verbPlain: "勉強する", actionEn: "study", context: "静かな席があります。", natural: "図書館では勉強ができます。", verbNatural: "図書館では勉強することができます。", cannot: "図書館では勉強ができません。" },
	{ place: "駅の機械では", noun: "切符の予約", verbPlain: "切符を予約する", actionEn: "reserve tickets", context: "新しい機械があります。", natural: "駅の機械では切符の予約ができます。", verbNatural: "駅の機械では切符を予約することができます。", cannot: "駅の機械では切符の予約ができません。" },
	{ place: "このアプリでは", noun: "日本語の練習", verbPlain: "日本語を練習する", actionEn: "practice Japanese", context: "毎日問題が出ます。", natural: "このアプリでは日本語の練習ができます。", verbNatural: "このアプリでは日本語を練習することができます。", cannot: "このアプリでは日本語の練習ができません。" },
	{ place: "この部屋では", noun: "会議", verbPlain: "会議をする", actionEn: "hold a meeting", context: "大きいテーブルがあります。", natural: "この部屋では会議ができます。", verbNatural: "この部屋では会議をすることができます。", cannot: "この部屋では会議ができません。" },
	{ place: "受付では", noun: "コピー", verbPlain: "コピーをする", actionEn: "make copies", context: "一枚十円です。", natural: "受付ではコピーができます。", verbNatural: "受付ではコピーをすることができます。", cannot: "受付ではコピーができません。" },
	{ place: "このサイトでは", noun: "ホテルの予約", verbPlain: "ホテルを予約する", actionEn: "reserve a hotel", context: "空いている部屋を調べられます。", natural: "このサイトではホテルの予約ができます。", verbNatural: "このサイトではホテルを予約することができます。", cannot: "このサイトではホテルの予約ができません。" },
	{ place: "この教室では", noun: "発表の練習", verbPlain: "発表の練習をする", actionEn: "practice presentations", context: "スクリーンがあります。", natural: "この教室では発表の練習ができます。", verbNatural: "この教室では発表の練習をすることができます。", cannot: "この教室では発表の練習ができません。" },
	{ place: "この店では", noun: "カードで支払い", verbPlain: "カードで払う", actionEn: "pay by card", context: "現金がなくても大丈夫です。", natural: "この店ではカードで支払いができます。", verbNatural: "この店ではカードで払うことができます。", cannot: "この店ではカードで支払いができません。" },
	{ place: "公園では", noun: "サッカー", verbPlain: "サッカーをする", actionEn: "play soccer", context: "広い場所があります。", natural: "公園ではサッカーができます。", verbNatural: "公園ではサッカーをすることができます。", cannot: "公園ではサッカーができません。" },
	{ place: "この博物館では", noun: "写真撮影", verbPlain: "写真を撮る", actionEn: "take photos", context: "フラッシュを使わなければ大丈夫です。", natural: "この博物館では写真撮影ができます。", verbNatural: "この博物館では写真を撮ることができます。", cannot: "この博物館では写真撮影ができません。" },
	{ place: "この学校では", noun: "留学の相談", verbPlain: "留学の相談をする", actionEn: "ask about study abroad", context: "相談室があります。", natural: "この学校では留学の相談ができます。", verbNatural: "この学校では留学の相談をすることができます。", cannot: "この学校では留学の相談ができません。" },
	{ place: "ここでは", noun: "自転車の修理", verbPlain: "自転車を修理する", actionEn: "repair bicycles", context: "小さい店ですが、道具があります。", natural: "ここでは自転車の修理ができます。", verbNatural: "ここでは自転車を修理することができます。", cannot: "ここでは自転車の修理ができません。" },
	{ place: "このプールでは", noun: "水泳", verbPlain: "泳ぐ", actionEn: "swim", context: "朝七時から使えます。", natural: "このプールでは水泳ができます。", verbNatural: "このプールでは泳ぐことができます。", cannot: "このプールでは水泳ができません。" },
	{ place: "電話では", noun: "申し込み", verbPlain: "申し込む", actionEn: "apply", context: "名前と電話番号を言ってください。", natural: "電話では申し込みができます。", verbNatural: "電話では申し込むことができます。", cannot: "電話では申し込みができません。" }
];

const perceptionScenarios = [
	{ target: "海", sense: "見えます", negative: "見えません", potential: "見られます", actionEn: "see the ocean", context: "いい部屋ですね。窓から", natural: "窓から海が見えます。", blocked: "めがねがありませんから、よく海が見えません。", source: "窓から" },
	{ target: "富士山", sense: "見えます", negative: "見えません", potential: "見られます", actionEn: "see Mt. Fuji", context: "今日は空気がきれいです。ここから", natural: "ここから富士山が見えます。", blocked: "雲が多いですから、富士山が見えません。", source: "ここから" },
	{ target: "星", sense: "見えます", negative: "見えません", potential: "見られます", actionEn: "see the stars", context: "今夜は空が暗いです。", natural: "星がよく見えます。", blocked: "町の明かりで星が見えません。", source: "" },
	{ target: "黒板の字", sense: "見えます", negative: "見えません", potential: "見られます", actionEn: "see the writing on the board", context: "前の席に座りました。", natural: "前の席から黒板の字がよく見えます。", blocked: "一番後ろの席から黒板の字が見えません。", source: "前の席から" },
	{ target: "出口", sense: "見えます", negative: "見えません", potential: "見られます", actionEn: "see the exit", context: "人が少なくなりました。", natural: "出口が見えます。", blocked: "人が多くて出口が見えません。", source: "" },
	{ target: "駅の看板", sense: "見えます", negative: "見えません", potential: "見られます", actionEn: "see the station sign", context: "もう駅の近くです。", natural: "駅の看板が見えます。", blocked: "暗くて駅の看板が見えません。", source: "" },
	{ target: "小さい文字", sense: "見えます", negative: "見えません", potential: "見られます", actionEn: "see small letters", context: "めがねをかけると", natural: "めがねをかけると小さい文字が見えます。", blocked: "字が小さくて小さい文字が見えません。", source: "めがねをかけると" },
	{ target: "花火", sense: "見えます", negative: "見えません", potential: "見られます", actionEn: "see the fireworks", context: "屋上に上がりました。", natural: "屋上から花火が見えます。", blocked: "建物が高くて花火が見えません。", source: "屋上から" },
	{ target: "風の音", sense: "聞こえます", negative: "聞こえません", potential: "聞けます", actionEn: "hear the wind", context: "窓を開けると", natural: "風の音が聞こえます。", blocked: "窓を閉めると風の音が聞こえません。", source: "" },
	{ target: "鳥の声", sense: "聞こえます", negative: "聞こえません", potential: "聞けます", actionEn: "hear birds", context: "朝、庭から", natural: "庭から鳥の声が聞こえます。", blocked: "雨の日は鳥の声が聞こえません。", source: "庭から" },
	{ target: "先生の声", sense: "聞こえます", negative: "聞こえません", potential: "聞けます", actionEn: "hear the teacher's voice", context: "後ろの席ですが", natural: "先生の声がよく聞こえます。", blocked: "後ろの席では先生の声がよく聞こえません。", source: "" },
	{ target: "電車の音", sense: "聞こえます", negative: "聞こえません", potential: "聞けます", actionEn: "hear the train", context: "駅が近いので", natural: "電車の音が聞こえます。", blocked: "窓を閉めると電車の音が聞こえません。", source: "" },
	{ target: "音楽", sense: "聞こえます", negative: "聞こえません", potential: "聞けます", actionEn: "hear music", context: "となりの部屋から", natural: "となりの部屋から音楽が聞こえます。", blocked: "部屋が静かで音楽が聞こえません。", source: "となりの部屋から" },
	{ target: "赤ちゃんの声", sense: "聞こえます", negative: "聞こえません", potential: "聞けます", actionEn: "hear the baby", context: "二階から", natural: "二階から赤ちゃんの声が聞こえます。", blocked: "ドアを閉めると赤ちゃんの声が聞こえません。", source: "二階から" },
	{ target: "アナウンス", sense: "聞こえます", negative: "聞こえません", potential: "聞けます", actionEn: "hear the announcement", context: "駅のホームで", natural: "駅のホームでアナウンスが聞こえます。", blocked: "人が多くてアナウンスが聞こえません。", source: "駅のホームで" },
	{ target: "川の音", sense: "聞こえます", negative: "聞こえません", potential: "聞けます", actionEn: "hear the river", context: "橋の上から", natural: "橋の上から川の音が聞こえます。", blocked: "車が多くて川の音が聞こえません。", source: "橋の上から" }
];

const abilityQuestionTemplates = {
	potential: [
		(item) => makeChoiceQuestion({ kind: "〜(られ)ます", prompt: `Context: ${item.context}`, subprompt: `Say that ${item.subject} can ${item.actionEn}.`, band: "Choose the potential sentence.", answer: item.natural, options: [item.natural, `${item.subject}は${item.object}を${item.masu}。`, `${item.subject}は${item.object}が${item.negative}。`, `${item.subject}は${item.object}を${item.verbPlain}ことです。`], explanation: "The potential form expresses ability; with object-like nouns, を often changes to が." }),
		(item) => makeTextQuestion({ kind: "〜(られ)ます", prompt: `${item.subject}は${item.object}が＿＿＿＿。`, subprompt: `Fill in “can ${item.actionEn}.”`, band: "Type the potential verb.", answer: item.potential, placeholder: "例: 話せます", explanation: `Use the potential form: ${item.natural}` }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: item.natural, subprompt: "Choose the meaning.", band: "Read the potential sentence.", answer: sentenceCase(`${item.subject.replace("は", "")} can ${item.actionEn}.`), options: [sentenceCase(`${item.subject.replace("は", "")} can ${item.actionEn}.`), sentenceCase(`${item.subject.replace("は", "")} usually ${item.actionEn}.`), sentenceCase(`${item.subject.replace("は", "")} just finished ${item.actionEn}.`), sentenceCase(`${item.subject.replace("は", "")} is invited to ${item.actionEn}.`)], explanation: "Potential verbs show ability or possibility." }),
		(item) => makeChoiceQuestion({ kind: "〜(られ)ません", prompt: `Context: ${item.context}`, subprompt: `Now say that ${item.subject} cannot ${item.actionEn}.`, band: "Choose the negative potential sentence.", answer: item.cannot, options: [item.cannot, item.natural, `${item.subject}は${item.object}を${item.masu}ません。`, `${item.subject}は${item.object}ができます。`], explanation: "Negative potential uses the potential verb plus ません." }),
		(item) => makeTextQuestion({ kind: "〜(られ)ません", prompt: `${item.subject}はまだ${item.object}が＿＿＿＿。`, subprompt: `Fill in “cannot ${item.actionEn} yet.”`, band: "Type the negative potential verb.", answer: item.negative, placeholder: "例: 話せません", explanation: `Use the negative potential form: ${item.negative}` }),
		(item) => makeChoiceQuestion({ kind: "が with potential", prompt: `${item.subject}は${item.object}＿＿${item.potential}。`, subprompt: "Choose the common particle for an object-like noun with a potential verb.", band: "Pick the particle.", answer: "が", options: ["が", "を", "に", "で"], explanation: "With potential verbs, the object marker often changes from を to が." }),
		(item) => makeChoiceQuestion({ kind: "potential form", prompt: item.verbPlain, subprompt: `Which form means “can ${item.actionEn}”?`, band: "Choose the potential form.", answer: item.potential, options: [item.potential, item.masu, item.negative, `${item.verbPlain}ところです`], explanation: "The potential form changes by verb type: 話す→話せます, 食べる→食べられます, する→できます." }),
		(item) => makeChoiceQuestion({ kind: "〜ことができます", prompt: item.natural, subprompt: "Choose a slightly more formal sentence with the same basic meaning.", band: "Match potential to ことができます.", answer: `${item.subject}は${item.object}を${item.verbPlain}ことができます。`, options: [`${item.subject}は${item.object}を${item.verbPlain}ことができます。`, `${item.subject}は${item.object}を${item.verbPlain}ところです。`, `${item.subject}は${item.object}を${item.verbPlain}ながらです。`, `${item.subject}は${item.object}を${item.verbPlain}までです。`], explanation: "Verb dictionary form + ことができます is a slightly more formal ability pattern." }),
		(item) => makeTextQuestion({ kind: "〜(られ)ます", prompt: `Type: “${item.subject.replace("は", "")} can ${item.actionEn}.”`, subprompt: "Use the potential verb and が.", band: "Build the whole sentence.", answer: item.natural, placeholder: "例: ジョーさんは日本語が話せます。", explanation: `The full sentence is ${item.natural}` }),
		(item) => makeChoiceQuestion({ kind: "potential vs habit", prompt: `Which sentence says ability, not just a present/future action?`, subprompt: `Target action: ${item.actionEn}.`, band: "Choose the potential sentence.", answer: item.natural, options: [item.natural, `${item.subject}は${item.object}を${item.masu}。`, `${item.subject}は${item.object}を${item.masu}か。`, `${item.subject}は${item.object}を${item.masu}ながら。`], explanation: "The potential verb, not the normal ます form, says “can.”" })
	],
	dekiru: [
		(item) => makeChoiceQuestion({ kind: "〜ができます", prompt: `Context: ${item.context}`, subprompt: `${sentenceCase(`You can ${item.actionEn} there.`)}`, band: "Choose noun + ができます.", answer: item.natural, options: [item.natural, `${item.place}${item.noun}をできます。`, `${item.place}${item.noun}がします。`, `${item.place}${item.noun}ところです。`], explanation: "Noun + ができます expresses that the action/service is possible." }),
		(item) => makeTextQuestion({ kind: "〜ができます", prompt: `${item.place}${item.noun}が＿＿＿＿。`, subprompt: `${sentenceCase(`You can ${item.actionEn}.`)}`, band: "Type できます or できません.", answer: item.natural.includes("できません") ? "できません" : "できます", placeholder: "できます", explanation: `Use noun + ができます/できません: ${item.natural}` }),
		(item) => makeChoiceQuestion({ kind: "〜ことができます", prompt: `Context: ${item.context}`, subprompt: `${sentenceCase(`You can ${item.actionEn}.`)}`, band: "Choose verb dictionary form + ことができます.", answer: item.verbNatural, options: [item.verbNatural, `${item.place}${item.verbPlain}ことです。`, `${item.place}${item.verbPlain}ながらできます。`, `${item.place}${item.verbPlain}までできます。`], explanation: "Use dictionary-form verb + ことができます for a slightly more formal ability/permission pattern." }),
		(item) => makeTextQuestion({ kind: "〜ことができます", prompt: `${item.place}${item.verbPlain}＿＿＿＿。`, subprompt: `${sentenceCase(`You can ${item.actionEn}.`)}`, band: "Type ことができます or ことができません.", answer: item.verbNatural.includes("できません") ? "ことができません" : "ことができます", placeholder: "ことができます", explanation: `Attach ことができます to the dictionary-form verb: ${item.verbNatural}` }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: item.natural, subprompt: "Choose the meaning.", band: "Read the できます sentence.", answer: sentenceCase(`You can ${item.actionEn} there.`), options: [sentenceCase(`You can ${item.actionEn} there.`), sentenceCase(`You must ${item.actionEn} there.`), sentenceCase(`You just ${item.actionEn} there.`), sentenceCase(`You are invited to ${item.actionEn} there.`)], explanation: "できます expresses possibility, permission, or ability depending on context." }),
		(item) => makeChoiceQuestion({ kind: "〜ができません", prompt: `Which sentence says you cannot ${item.actionEn} there?`, subprompt: item.context, band: "Choose the negative できる pattern.", answer: item.cannot, options: [item.cannot, item.natural, `${item.place}${item.noun}をできません。`, `${item.place}${item.noun}ませんか。`], explanation: "The negative is できません; keep the noun marked with が." }),
		(item) => makeChoiceQuestion({ kind: "が with できます", prompt: `${item.place}${item.noun}＿＿できます。`, subprompt: "Choose the particle for noun + できます.", band: "Pick the particle.", answer: "が", options: ["が", "を", "に", "で"], explanation: "Use noun + ができます." }),
		(item) => makeChoiceQuestion({ kind: "pattern choice", prompt: `Which sentence uses the verb pattern correctly?`, subprompt: `Target: can ${item.actionEn}.`, band: "Choose ことができます.", answer: item.verbNatural, options: [item.verbNatural, `${item.place}${item.verbPlain}ができます。`, `${item.place}${item.verbPlain}をできます。`, `${item.place}${item.verbPlain}ことです。`], explanation: "With verbs, use dictionary form + ことができます." }),
		(item) => makeTextQuestion({ kind: "〜ができます", prompt: `Type: “You can ${item.actionEn} there.”`, subprompt: "Use the noun + ができます pattern.", band: "Build the whole sentence.", answer: item.natural, placeholder: "例: このコンビニでは買い物ができます。", explanation: `The full sentence is ${item.natural}` }),
		(item) => makeChoiceQuestion({ kind: "〜(られ)ます vs できます", prompt: item.verbNatural, subprompt: "What pattern is being used?", band: "Identify the ability pattern.", answer: "verb dictionary form + ことができます", options: ["verb dictionary form + ことができます", "verb potential + が", "natural perception with 聞こえます", "invitation with ませんか"], explanation: "This sentence uses a dictionary-form verb before ことができます." })
	],
	perception: [
		(item) => makeChoiceQuestion({ kind: "見えます・聞こえます", prompt: `Context: ${item.context}＿＿＿＿。`, subprompt: `${sentenceCase(`You can naturally ${item.actionEn}.`)}`, band: "Choose the natural perception sentence.", answer: item.natural, options: [item.natural, `${item.source}${item.target}が${item.potential}。`, `${item.source}${item.target}を${item.sense}。`, `${item.source}${item.target}ができます。`], explanation: "見えます and 聞こえます express what naturally comes into view or earshot." }),
		(item) => makeTextQuestion({ kind: "見えます・聞こえます", prompt: `${item.source}${item.target}が＿＿＿＿。`, subprompt: `${sentenceCase(`Naturally ${item.actionEn}.`)}`, band: "Type 見えます/聞こえます or the negative.", answer: item.natural.includes("ません") ? item.negative : item.sense, placeholder: "見えます / 聞こえます", explanation: `Use natural perception: ${item.natural}` }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: item.natural, subprompt: "Choose the meaning.", band: "Read the perception sentence.", answer: sentenceCase(`You can naturally ${item.actionEn}.`), options: [sentenceCase(`You can naturally ${item.actionEn}.`), sentenceCase(`You are allowed to ${item.actionEn}.`), sentenceCase(`You invite someone to ${item.actionEn}.`), sentenceCase(`You finished trying to ${item.actionEn}.`)], explanation: "見えます/聞こえます is about natural perception, not permission." }),
		(item) => makeChoiceQuestion({ kind: "見えません・聞こえません", prompt: item.blocked, subprompt: "What does the sentence express?", band: "Read the negative perception.", answer: sentenceCase(`You cannot naturally ${item.actionEn}.`), options: [sentenceCase(`You cannot naturally ${item.actionEn}.`), sentenceCase(`You refuse to ${item.actionEn}.`), sentenceCase(`You are not invited to ${item.actionEn}.`), sentenceCase(`You just learned to ${item.actionEn}.`)], explanation: "The negative form says the sight or sound does not reach you naturally." }),
		(item) => makeTextQuestion({ kind: "見えません・聞こえません", prompt: `${item.source}${item.target}が＿＿＿＿。`, subprompt: `${sentenceCase(`Cannot naturally ${item.actionEn}.`)}`, band: "Type the negative perception form.", answer: item.negative, placeholder: "見えません / 聞こえません", explanation: `Use the negative perception form: ${item.negative}` }),
		(item) => makeChoiceQuestion({ kind: "見える vs 見られる", prompt: `The point is natural perception, not permission or intentional watching.`, subprompt: `${sentenceCase(`Naturally ${item.actionEn}.`)}`, band: "Choose 見えます/聞こえます.", answer: `${item.target}が${item.sense}。`, options: [`${item.target}が${item.sense}。`, `${item.target}が${item.potential}。`, `${item.target}を${item.sense}。`, `${item.target}ができます。`], explanation: "Use 見えます/聞こえます for what naturally reaches the eyes or ears." }),
		(item) => makeChoiceQuestion({ kind: "が with perception", prompt: `${item.target}＿＿${item.sense}。`, subprompt: "Choose the particle for natural perception.", band: "Pick the particle.", answer: "が", options: ["が", "を", "に", "で"], explanation: "The thing perceived is marked with が: 海が見えます, 音が聞こえます." }),
		(item) => makeChoiceQuestion({ kind: "見えます・聞こえます", prompt: `Which one fits ${item.target}?`, subprompt: item.sense === "見えます" ? "It is something visual." : "It is a sound.", band: "Choose the right perception verb.", answer: item.sense, options: [item.sense, item.sense === "見えます" ? "聞こえます" : "見えます", "できます", "ましょうか"], explanation: "Use 見えます for sights and 聞こえます for sounds." }),
		(item) => makeTextQuestion({ kind: "見えます・聞こえます", prompt: `Type: “${sentenceCase(`I can naturally ${item.actionEn}.`)}”`, subprompt: "Use が and the natural perception verb.", band: "Build the whole sentence.", answer: item.natural, placeholder: "例: 窓から海が見えます。", explanation: `The full sentence is ${item.natural}` }),
		(item) => makeChoiceQuestion({ kind: "perception vs ability", prompt: `Which sentence is about natural perception?`, subprompt: `${item.target} reaches your eyes/ears without trying.`, band: "Choose the perception sentence.", answer: item.natural, options: [item.natural, `${item.source}${item.target}が${item.potential}。`, `${item.source}${item.target}を${item.potential}。`, `${item.source}${item.target}ができます。`], explanation: "Potential forms like 見られます/聞けます focus on ability or permission; 見えます/聞こえます focus on natural perception." }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: `A: ${item.context}${item.target}が${item.sense}か。 B: はい、よく${item.sense}。`, subprompt: "What are they talking about?", band: "Read the dialogue.", answer: "Whether the thing naturally reaches sight or hearing.", options: ["Whether the thing naturally reaches sight or hearing.", "Whether someone has permission to look or listen.", "Whether someone wants to invite a friend.", "Whether an action continues until a deadline."], explanation: "見えます/聞こえます asks whether something is naturally visible or audible." }),
		(item) => makeChoiceQuestion({ kind: "見えます・聞こえます", prompt: `Context: ${item.blocked}`, subprompt: "Choose the matching short sentence.", band: "Use the negative perception form.", answer: `${item.target}が${item.negative}。`, options: [`${item.target}が${item.negative}。`, `${item.target}が${item.potential}。`, `${item.target}を${item.negative}。`, `${item.target}ができません。`], explanation: "Use が plus the negative perception form when sight or sound does not reach you." })
	]
};

const pastExperienceScenarios = [
	{ subject: "私", ta: "テレビドラマに出た", dict: "テレビドラマに出る", actionEn: "appear in a TV drama", context: "前に一度", natural: "私は前に一度テレビドラマに出たことがあります。", never: "私はテレビドラマに出たことがありません。", frequency: "一度" },
	{ subject: "田中さん", ta: "入院した", dict: "入院する", actionEn: "be hospitalized", context: "子どものころ", natural: "田中さんは子どものころ入院したことがあります。", never: "田中さんは入院したことがありません。", frequency: "一度" },
	{ subject: "私", ta: "富士山に登った", dict: "富士山に登る", actionEn: "climb Mt. Fuji", context: "学生の時", natural: "私は学生の時、富士山に登ったことがあります。", never: "私は富士山に登ったことがありません。", frequency: "一度" },
	{ subject: "姉", ta: "歌舞伎を見た", dict: "歌舞伎を見る", actionEn: "see kabuki", context: "東京で", natural: "姉は東京で歌舞伎を見たことがあります。", never: "姉は歌舞伎を見たことがありません。", frequency: "一度" },
	{ subject: "弟", ta: "納豆を食べた", dict: "納豆を食べる", actionEn: "eat natto", context: "日本で", natural: "弟は日本で納豆を食べたことがあります。", never: "弟は納豆を食べたことがありません。", frequency: "何度か" },
	{ subject: "友だち", ta: "新幹線に乗った", dict: "新幹線に乗る", actionEn: "ride the shinkansen", context: "旅行で", natural: "友だちは旅行で新幹線に乗ったことがあります。", never: "友だちは新幹線に乗ったことがありません。", frequency: "何度も" },
	{ subject: "母", ta: "着物を着た", dict: "着物を着る", actionEn: "wear a kimono", context: "若いころ", natural: "母は若いころ着物を着たことがあります。", never: "母は着物を着たことがありません。", frequency: "何度か" },
	{ subject: "父", ta: "マラソンを走った", dict: "マラソンを走る", actionEn: "run a marathon", context: "三十歳の時", natural: "父は三十歳の時、マラソンを走ったことがあります。", never: "父はマラソンを走ったことがありません。", frequency: "一度" },
	{ subject: "私", ta: "京都へ行った", dict: "京都へ行く", actionEn: "go to Kyoto", context: "修学旅行で", natural: "私は修学旅行で京都へ行ったことがあります。", never: "私は京都へ行ったことがありません。", frequency: "一度" },
	{ subject: "サムさん", ta: "日本語でスピーチをした", dict: "日本語でスピーチをする", actionEn: "give a speech in Japanese", context: "去年", natural: "サムさんは去年、日本語でスピーチをしたことがあります。", never: "サムさんは日本語でスピーチをしたことがありません。", frequency: "一度" },
	{ subject: "山田さん", ta: "外国で働いた", dict: "外国で働く", actionEn: "work abroad", context: "前に", natural: "山田さんは前に外国で働いたことがあります。", never: "山田さんは外国で働いたことがありません。", frequency: "一度" },
	{ subject: "兄", ta: "財布をなくした", dict: "財布をなくす", actionEn: "lose a wallet", context: "一度", natural: "兄は一度財布をなくしたことがあります。", never: "兄は財布をなくしたことがありません。", frequency: "一度" },
	{ subject: "祖母", ta: "飛行機に乗った", dict: "飛行機に乗る", actionEn: "ride an airplane", context: "何度も", natural: "祖母は何度も飛行機に乗ったことがあります。", never: "祖母は飛行機に乗ったことがありません。", frequency: "何度も" },
	{ subject: "学生たち", ta: "ボランティアをした", dict: "ボランティアをする", actionEn: "volunteer", context: "夏休みに", natural: "学生たちは夏休みにボランティアをしたことがあります。", never: "学生たちはボランティアをしたことがありません。", frequency: "何度か" },
	{ subject: "先生", ta: "本を書いた", dict: "本を書く", actionEn: "write a book", context: "若いころ", natural: "先生は若いころ本を書いたことがあります。", never: "先生は本を書いたことがありません。", frequency: "一度" },
	{ subject: "私", ta: "茶道を習った", dict: "茶道を習う", actionEn: "learn tea ceremony", context: "高校の時", natural: "私は高校の時、茶道を習ったことがあります。", never: "私は茶道を習ったことがありません。", frequency: "少し" },
	{ subject: "彼女", ta: "雪を見た", dict: "雪を見る", actionEn: "see snow", context: "北海道で", natural: "彼女は北海道で雪を見たことがあります。", never: "彼女は雪を見たことがありません。", frequency: "一度" },
	{ subject: "子どもたち", ta: "キャンプをした", dict: "キャンプをする", actionEn: "go camping", context: "去年の夏", natural: "子どもたちは去年の夏、キャンプをしたことがあります。", never: "子どもたちはキャンプをしたことがありません。", frequency: "一度" }
];

const occasionalEventScenarios = [
	{ subject: "母", dict: "人の名前を忘れる", nai: "人の名前を忘れない", eventEn: "forget people's names", context: "このごろ", natural: "母はこのごろ人の名前を忘れることがあります。", negativeNatural: "母は人の名前を忘れないこともあります。" },
	{ subject: "雪の日", dict: "道で滑る", nai: "道で滑らない", eventEn: "slip on the road", context: "雪の日は", natural: "雪の日は道で滑ることがあります。", negativeNatural: "雪の日でも道で滑らないこともあります。" },
	{ subject: "サラ", dict: "ぼくの話を聞いていない", nai: "ぼくの話を聞く", eventEn: "not listen to me", context: "ときどき", natural: "サラはときどきぼくの話を聞いていないことがあります。", negativeNatural: "サラはぼくの話を聞くこともあります。" },
	{ subject: "私", dict: "朝ご飯を食べない", nai: "朝ご飯を食べる", eventEn: "not eat breakfast", context: "時間がないとき", natural: "私は時間がないとき、朝ご飯を食べないこともあります。", negativeNatural: "私は朝ご飯を食べることもあります。" },
	{ subject: "電車", dict: "遅れる", nai: "遅れない", eventEn: "be late", context: "雨の日", natural: "雨の日は電車が遅れることがあります。", negativeNatural: "雨の日でも電車が遅れないこともあります。" },
	{ subject: "この店", dict: "早く閉まる", nai: "早く閉まらない", eventEn: "close early", context: "日曜日", natural: "この店は日曜日、早く閉まることがあります。", negativeNatural: "この店は日曜日でも早く閉まらないこともあります。" },
	{ subject: "弟", dict: "宿題を忘れる", nai: "宿題を忘れない", eventEn: "forget homework", context: "忙しい日", natural: "弟は忙しい日、宿題を忘れることがあります。", negativeNatural: "弟は宿題を忘れないこともあります。" },
	{ subject: "パソコン", dict: "急に止まる", nai: "急に止まらない", eventEn: "suddenly stop", context: "古いので", natural: "このパソコンは古いので、急に止まることがあります。", negativeNatural: "このパソコンは急に止まらないこともあります。" },
	{ subject: "祖父", dict: "薬を飲み忘れる", nai: "薬を飲み忘れない", eventEn: "forget to take medicine", context: "たまに", natural: "祖父はたまに薬を飲み忘れることがあります。", negativeNatural: "祖父は薬を飲み忘れないこともあります。" },
	{ subject: "私", dict: "電気を消し忘れる", nai: "電気を消し忘れない", eventEn: "forget to turn off the light", context: "疲れていると", natural: "私は疲れていると、電気を消し忘れることがあります。", negativeNatural: "私は電気を消し忘れないこともあります。" },
	{ subject: "子ども", dict: "夜中に泣く", nai: "夜中に泣かない", eventEn: "cry in the middle of the night", context: "小さい子どもは", natural: "小さい子どもは夜中に泣くことがあります。", negativeNatural: "小さい子どもでも夜中に泣かないこともあります。" },
	{ subject: "山の天気", dict: "急に変わる", nai: "急に変わらない", eventEn: "change suddenly", context: "山では", natural: "山では天気が急に変わることがあります。", negativeNatural: "山では天気が急に変わらないこともあります。" },
	{ subject: "猫", dict: "一日中寝ている", nai: "一日中寝ていない", eventEn: "sleep all day", context: "うちの猫は", natural: "うちの猫は一日中寝ていることがあります。", negativeNatural: "うちの猫は一日中寝ていないこともあります。" },
	{ subject: "メール", dict: "届かない", nai: "届く", eventEn: "not arrive", context: "インターネットが悪いと", natural: "インターネットが悪いと、メールが届かないことがあります。", negativeNatural: "インターネットが悪くてもメールが届くこともあります。" },
	{ subject: "私", dict: "駅まで歩く", nai: "駅まで歩かない", eventEn: "walk to the station", context: "天気がいい日は", natural: "天気がいい日は駅まで歩くことがあります。", negativeNatural: "天気がいい日でも駅まで歩かないこともあります。" },
	{ subject: "犬", dict: "知らない人にほえる", nai: "知らない人にほえない", eventEn: "bark at strangers", context: "うちの犬は", natural: "うちの犬は知らない人にほえることがあります。", negativeNatural: "うちの犬は知らない人にほえないこともあります。" },
	{ subject: "この道", dict: "夜とても暗くなる", nai: "夜暗くならない", eventEn: "get very dark at night", context: "この道は", natural: "この道は夜とても暗くなることがあります。", negativeNatural: "この道は夜暗くならないこともあります。" },
	{ subject: "会議", dict: "長くなる", nai: "長くならない", eventEn: "run long", context: "月曜日の会議は", natural: "月曜日の会議は長くなることがあります。", negativeNatural: "月曜日の会議は長くならないこともあります。" }
];

const experienceQuestionTemplates = {
	past: [
		(item) => makeChoiceQuestion({ kind: "〜たことがあります", prompt: `Say that ${item.subject} has experience: ${item.actionEn}.`, subprompt: item.context, band: "Choose た-form + ことがあります.", answer: item.natural, options: [item.natural, `${item.subject}は${item.context}${item.dict}ことがあります。`, `${item.subject}は${item.context}${item.ta}ところです。`, `${item.subject}は${item.context}${item.dict}ことができます。`], explanation: "Past experience uses the た-form before ことがあります." }),
		(item) => makeTextQuestion({ kind: "〜たことがあります", prompt: `${item.subject}は${item.context}${item.ta}＿＿＿＿。`, subprompt: `Has experience: ${item.actionEn}.`, band: "Type ことがあります.", answer: "ことがあります", placeholder: "ことがあります", explanation: `Use た-form + ことがあります: ${item.natural}` }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: item.natural, subprompt: "Choose the meaning.", band: "Read the past-experience sentence.", answer: `Past experience: ${item.actionEn}.`, options: [`Past experience: ${item.actionEn}.`, `Occasionally happens: ${item.actionEn}.`, `Happening right now: ${item.actionEn}.`, `Ability: can ${item.actionEn}.`], explanation: "This pattern talks about an experience sometime in the past." }),
		(item) => makeChoiceQuestion({ kind: "〜たことがありません", prompt: `A: ${item.ta}ことがありますか。 B: ＿＿＿＿`, subprompt: `Answer: No, never ${item.actionEn}.`, band: "Choose the negative experience reply.", answer: item.never, options: [item.never, item.natural, `${item.subject}は${item.dict}ことがあります。`, `${item.subject}は${item.ta}ところです。`], explanation: "Use た-form + ことがありません to say “have never.”" }),
		(item) => makeTextQuestion({ kind: "〜たことがありません", prompt: `${item.subject}は${item.ta}＿＿＿＿。`, subprompt: `Has never ${item.actionEn}.`, band: "Type ことがありません.", answer: "ことがありません", placeholder: "ことがありません", explanation: `Never-had-experience form: ${item.never}` }),
		(item) => makeChoiceQuestion({ kind: "frequency + experience", prompt: `Which word sounds natural with ${item.ta}ことがあります?`, subprompt: "Past experience often pairs with frequency words.", band: "Choose the experience frequency word.", answer: item.frequency, options: [item.frequency, "いつも", "たいてい", "毎朝"], explanation: "一度, 何度か, and 何度も often appear with past-experience sentences." }),
		(item) => makeChoiceQuestion({ kind: "recent past vs experience", prompt: `Which sentence is NOT natural for a simple recent event?`, subprompt: `The event happened yesterday, so avoid たことがあります.`, band: "Spot the misuse.", answer: `昨日${item.ta}ことがあります。`, options: [`昨日${item.ta}ことがあります。`, `昨日${item.ta}。`, `昨日${item.ta}んです。`, `昨日${item.ta}ので、疲れました。`], explanation: "たことがあります is for past experience, not a simple recent event like yesterday." }),
		(item) => makeChoiceQuestion({ kind: "form before ことがあります", prompt: item.dict, subprompt: "Which form belongs before ことがあります for past experience?", band: "Choose the た-form.", answer: item.ta, options: [item.ta, item.dict, `${item.dict}ない`, `${item.dict}ます`], explanation: "Past experience uses the た-form before ことがあります." }),
		(item) => makeTextQuestion({ kind: "〜たことがあります", prompt: `Type: “${item.subject} has ${item.actionEn} before.”`, subprompt: "Use たことがあります.", band: "Build the whole sentence.", answer: item.natural, placeholder: "例: 私は富士山に登ったことがあります。", explanation: `The full sentence is ${item.natural}` }),
		(item) => makeChoiceQuestion({ kind: "〜たことがあります vs 〜ことがあります", prompt: `Which sentence means “has done it before”?`, subprompt: `Target action: ${item.actionEn}.`, band: "Choose past experience, not occasional occurrence.", answer: item.natural, options: [item.natural, `${item.subject}は${item.dict}ことがあります。`, `${item.subject}は${item.dict}こともあります。`, `${item.subject}は${item.ta}ことができます。`], explanation: "た-form + ことがあります means past experience; dictionary form + ことがあります means something sometimes happens." })
	],
	occasional: [
		(item) => makeChoiceQuestion({ kind: "〜ことがあります", prompt: `Context: ${item.context}`, subprompt: `${sentenceCase(`Sometimes ${item.eventEn}.`)}`, band: "Choose dictionary/ない-form + ことがあります.", answer: item.natural, options: [item.natural, `${item.subject}は${item.dict}たことがあります。`, `${item.subject}は${item.dict}ところです。`, `${item.subject}は${item.dict}ことができます。`], explanation: "Dictionary form or ない-form + ことがあります means something sometimes happens." }),
		(item) => makeTextQuestion({ kind: "〜ことがあります", prompt: `${item.context}${item.dict}＿＿＿＿。`, subprompt: `${sentenceCase(`Sometimes ${item.eventEn}.`)}`, band: "Type ことがあります.", answer: "ことがあります", placeholder: "ことがあります", explanation: `Use dictionary/ない-form + ことがあります: ${item.natural}` }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: item.natural, subprompt: "Choose the meaning.", band: "Read the occasional-event sentence.", answer: sentenceCase(`Sometimes ${item.eventEn}.`), options: [sentenceCase(`Sometimes ${item.eventEn}.`), sentenceCase(`Has ${item.eventEn} before.`), sentenceCase(`Just ${item.eventEn}.`), sentenceCase(`Can ${item.eventEn}.`)], explanation: "This pattern means an unusual or occasional thing may happen." }),
		(item) => makeChoiceQuestion({ kind: "〜こともあります", prompt: item.negativeNatural, subprompt: "What nuance does も add?", band: "Read the variation.", answer: "That also sometimes happens.", options: ["That also sometimes happens.", "It happened once in the past.", "It never happens.", "It is happening right now."], explanation: "〜こともあります means “there are also times when...”" }),
		(item) => makeTextQuestion({ kind: "〜こともあります", prompt: `${item.nai}＿＿＿＿。`, subprompt: "Say that this also sometimes happens.", band: "Type こともあります.", answer: "こともあります", placeholder: "こともあります", explanation: `Use こともあります for “also sometimes”: ${item.negativeNatural}` }),
		(item) => makeChoiceQuestion({ kind: "frequency + ことがあります", prompt: `Which frequency word fits an occasional-event sentence?`, subprompt: item.natural, band: "Avoid words meaning “always.”", answer: "ときどき", options: ["ときどき", "いつも", "毎日必ず", "たいてい"], explanation: "Use ことがあります for occasional or unusual events, not things that always happen." }),
		(item) => makeChoiceQuestion({ kind: "いつも vs ことがあります", prompt: `Which sentence sounds wrong because it says “always” with ことがあります?`, subprompt: "This pattern is not for very frequent events.", band: "Spot the misuse.", answer: `いつも${item.dict}ことがあります。`, options: [`いつも${item.dict}ことがあります。`, `ときどき${item.dict}ことがあります。`, `たまに${item.dict}ことがあります。`, `${item.context}${item.dict}ことがあります。`], explanation: "ことがあります is for occasional or unusual events; いつも does not fit." }),
		(item) => makeChoiceQuestion({ kind: "form before ことがあります", prompt: item.dict, subprompt: "For an occasional event, which form goes before ことがあります?", band: "Choose dictionary/ない-form, not た-form.", answer: item.dict, options: [item.dict, `${item.dict}た`, `${item.dict}ました`, `${item.dict}ところ`], explanation: "Occasional events use dictionary form or ない-form before ことがあります." }),
		(item) => makeTextQuestion({ kind: "〜ことがあります", prompt: `Type: “Sometimes ${item.eventEn}.”`, subprompt: "Use ことがあります.", band: "Build the whole sentence.", answer: item.natural, placeholder: "例: 母は人の名前を忘れることがあります。", explanation: `The full sentence is ${item.natural}` }),
		(item) => makeChoiceQuestion({ kind: "〜たことがあります vs 〜ことがあります", prompt: `Which sentence means something sometimes happens, not past experience?`, subprompt: item.context, band: "Choose occasional occurrence.", answer: item.natural, options: [item.natural, `${item.subject}は${item.dict}たことがあります。`, `${item.subject}は${item.dict}ことができます。`, `${item.subject}は${item.dict}ところです。`], explanation: "Dictionary/ない-form + ことがあります means an occasional event; た-form + ことがあります means past experience." })
	]
};

const allowBanScenarios = [
	{ type: "verb", te: "ここに座って", plain: "ここに座る", permit: "ここに座ってもいいです。", prohibit: "ここに座ってはいけません。", permitEn: "You may sit here.", prohibitEn: "You must not sit here.", permitContext: "このいすは空いています。", prohibitContext: "ここは先生の席です。", request: "ここに座ってもいいですか。", permitResponse: "ええ、どうぞ。", prohibitResponse: "すみません、ここはだめです。" },
	{ type: "verb", te: "写真を撮って", plain: "写真を撮る", permit: "写真を撮ってもいいです。", prohibit: "写真を撮ってはいけません。", permitEn: "You may take photos.", prohibitEn: "You must not take photos.", permitContext: "この美術館ではカメラが使えます。", prohibitContext: "この部屋は撮影禁止です。", request: "写真を撮ってもいいですか。", permitResponse: "はい、大丈夫です。", prohibitResponse: "いいえ、撮らないでください。" },
	{ type: "verb", te: "辞書を使って", plain: "辞書を使う", permit: "辞書を使ってもいいです。", prohibit: "辞書を使ってはいけません。", permitEn: "You may use a dictionary.", prohibitEn: "You must not use a dictionary.", permitContext: "練習問題ですから、辞書を見ても大丈夫です。", prohibitContext: "テスト中です。", request: "辞書を使ってもいいですか。", permitResponse: "はい、使ってください。", prohibitResponse: "いいえ、使ってはいけません。" },
	{ type: "verb", te: "スマホを見て", plain: "スマホを見る", permit: "スマホを見てもいいです。", prohibit: "スマホを見てはいけません。", permitEn: "You may look at your phone.", prohibitEn: "You must not look at your phone.", permitContext: "休み時間です。", prohibitContext: "授業中です。", request: "スマホを見てもいいですか。", permitResponse: "今ならいいですよ。", prohibitResponse: "今は見ないでください。" },
	{ type: "verb", te: "名前を書いて", plain: "名前を書く", permit: "名前を書いてもいいです。", prohibit: "名前を書いてはいけません。", permitEn: "You may write your name.", prohibitEn: "You must not write your name.", permitContext: "この紙は練習用です。", prohibitContext: "このアンケートは名前を書かないで出します。", request: "名前を書いてもいいですか。", permitResponse: "はい、お願いします。", prohibitResponse: "いいえ、書かないでください。" },
	{ type: "verb", te: "先に帰って", plain: "先に帰る", permit: "先に帰ってもいいです。", prohibit: "先に帰ってはいけません。", permitEn: "You may go home first.", prohibitEn: "You must not go home first.", permitContext: "用事があるなら大丈夫です。", prohibitContext: "まだ会議が終わっていません。", request: "先に帰ってもいいですか。", permitResponse: "はい、お疲れさまです。", prohibitResponse: "いいえ、最後までいてください。" },
	{ type: "i-adjective", te: "狭くて", plain: "狭い", permit: "狭くてもいいです。", prohibit: "狭くてはいけません。", permitEn: "It is okay if it is narrow.", prohibitEn: "It must not be narrow.", permitContext: "安い部屋を探しています。", prohibitContext: "みんなで使う教室ですから、十分な広さが必要です。", request: "部屋は狭くてもいいですか。", permitResponse: "はい、安ければ大丈夫です。", prohibitResponse: "いいえ、狭くてはいけません。" },
	{ type: "i-adjective", te: "短くて", plain: "短い", permit: "短くてもいいです。", prohibit: "短くてはいけません。", permitEn: "It is okay if it is short.", prohibitEn: "It must not be short.", permitContext: "答えは一文だけで大丈夫です。", prohibitContext: "作文は二百字以上必要です。", request: "答えは短くてもいいですか。", permitResponse: "はい、一文でいいです。", prohibitResponse: "いいえ、短くてはいけません。" },
	{ type: "na-adjective", te: "静かで", plain: "静か", permit: "静かでもいいです。", prohibit: "静かではいけません。", permitEn: "It is okay if it is quiet.", prohibitEn: "It must not be quiet.", permitContext: "小さい会なので、にぎやかでなくても大丈夫です。", prohibitContext: "子どものイベントですから、暗く静かな雰囲気は合いません。", request: "会場は静かでもいいですか。", permitResponse: "はい、落ち着いた場所がいいです。", prohibitResponse: "いいえ、静かではいけません。" },
	{ type: "na-adjective", te: "簡単で", plain: "簡単", permit: "簡単でもいいです。", prohibit: "簡単ではいけません。", permitEn: "It is okay if it is simple.", prohibitEn: "It must not be simple.", permitContext: "はじめての練習です。", prohibitContext: "これは上級者向けの問題です。", request: "問題は簡単でもいいですか。", permitResponse: "はい、最初は簡単でいいです。", prohibitResponse: "いいえ、簡単ではいけません。" },
	{ type: "noun", te: "鉛筆で", plain: "鉛筆", permit: "鉛筆でもいいです。", prohibit: "鉛筆ではいけません。", permitEn: "A pencil is okay.", prohibitEn: "A pencil is not allowed.", permitContext: "練習プリントです。", prohibitContext: "正式な書類です。", request: "鉛筆でもいいですか。", permitResponse: "はい、鉛筆で大丈夫です。", prohibitResponse: "いいえ、ペンで書いてください。" },
	{ type: "noun", te: "Tシャツで", plain: "Tシャツ", permit: "Tシャツでもいいです。", prohibit: "Tシャツではいけません。", permitEn: "A T-shirt is okay.", prohibitEn: "A T-shirt is not allowed.", permitContext: "今日はカジュアルな集まりです。", prohibitContext: "面接の日です。", request: "Tシャツでもいいですか。", permitResponse: "はい、楽な服でいいです。", prohibitResponse: "いいえ、Tシャツではいけません。" }
];

const noNeedMustScenarios = [
	{ type: "verb", negativeTe: "薬を飲まなくて", nakereba: "薬を飲まなければ", plain: "薬を飲む", noNeed: "薬を飲まなくてもいいです。", must: "薬を飲まなければなりません。", noNeedEn: "You do not have to take medicine.", mustEn: "You must take medicine.", noNeedContext: "もう熱がありません。", mustContext: "医者に言われました。", wrongPositive: "薬を飲んで" },
	{ type: "verb", negativeTe: "明日来なくて", nakereba: "明日来なければ", plain: "明日来る", noNeed: "明日来なくてもいいです。", must: "明日来なければなりません。", noNeedEn: "You do not have to come tomorrow.", mustEn: "You must come tomorrow.", noNeedContext: "明日の授業は休みです。", mustContext: "大事なテストがあります。", wrongPositive: "明日来て" },
	{ type: "verb", negativeTe: "宿題を出さなくて", nakereba: "宿題を出さなければ", plain: "宿題を出す", noNeed: "宿題を出さなくてもいいです。", must: "宿題を出さなければなりません。", noNeedEn: "You do not have to turn in the homework.", mustEn: "You must turn in the homework.", noNeedContext: "今日は練習だけです。", mustContext: "成績に入ります。", wrongPositive: "宿題を出して" },
	{ type: "verb", negativeTe: "メールを書かなくて", nakereba: "メールを書かなければ", plain: "メールを書く", noNeed: "メールを書かなくてもいいです。", must: "メールを書かなければなりません。", noNeedEn: "You do not have to write an email.", mustEn: "You must write an email.", noNeedContext: "電話で話しました。", mustContext: "先生に連絡してください。", wrongPositive: "メールを書いて" },
	{ type: "verb", negativeTe: "予約しなくて", nakereba: "予約しなければ", plain: "予約する", noNeed: "予約しなくてもいいです。", must: "予約しなければなりません。", noNeedEn: "You do not have to make a reservation.", mustEn: "You must make a reservation.", noNeedContext: "平日の昼は空いています。", mustContext: "週末はとても混みます。", wrongPositive: "予約して" },
	{ type: "verb", negativeTe: "電車に乗らなくて", nakereba: "電車に乗らなければ", plain: "電車に乗る", noNeed: "電車に乗らなくてもいいです。", must: "電車に乗らなければなりません。", noNeedEn: "You do not have to take the train.", mustEn: "You must take the train.", noNeedContext: "駅まで歩けます。", mustContext: "バスはもうありません。", wrongPositive: "電車に乗って" },
	{ type: "i-adjective", negativeTe: "駅に近くなくて", nakereba: "駅に近くなければ", plain: "駅に近い", noNeed: "駅に近くなくてもいいです。", must: "駅に近くなければなりません。", noNeedEn: "It does not have to be near the station.", mustEn: "It must be near the station.", noNeedContext: "車があります。", mustContext: "毎日電車で通います。", wrongPositive: "駅に近くて" },
	{ type: "i-adjective", negativeTe: "広くなくて", nakereba: "広くなければ", plain: "広い", noNeed: "広くなくてもいいです。", must: "広くなければなりません。", noNeedEn: "It does not have to be spacious.", mustEn: "It must be spacious.", noNeedContext: "一人で住みます。", mustContext: "五人で使います。", wrongPositive: "広くて" },
	{ type: "i-adjective", negativeTe: "新しくなくて", nakereba: "新しくなければ", plain: "新しい", noNeed: "新しくなくてもいいです。", must: "新しくなければなりません。", noNeedEn: "It does not have to be new.", mustEn: "It must be new.", noNeedContext: "中古でも大丈夫です。", mustContext: "プレゼントなので新品を買います。", wrongPositive: "新しくて" },
	{ type: "na-adjective", negativeTe: "静かでなくて", nakereba: "静かでなければ", plain: "静か", noNeed: "静かでなくてもいいです。", must: "静かでなければなりません。", noNeedEn: "It does not have to be quiet.", mustEn: "It must be quiet.", noNeedContext: "友だちと話す場所を探しています。", mustContext: "試験会場です。", wrongPositive: "静かで" },
	{ type: "noun", negativeTe: "学生でなくて", nakereba: "学生でなければ", plain: "学生", noNeed: "学生でなくてもいいです。", must: "学生でなければなりません。", noNeedEn: "You do not have to be a student.", mustEn: "You must be a student.", noNeedContext: "だれでも参加できます。", mustContext: "学生だけの割引です。", wrongPositive: "学生で" },
	{ type: "noun", negativeTe: "日本人でなくて", nakereba: "日本人でなければ", plain: "日本人", noNeed: "日本人でなくてもいいです。", must: "日本人でなければなりません。", noNeedEn: "You do not have to be Japanese.", mustEn: "You must be Japanese.", noNeedContext: "この大会はだれでも出られます。", mustContext: "この手続きは日本国籍の人だけです。", wrongPositive: "日本人で" }
];

const permissionQuestionTemplates = {
	allowBan: [
		(item) => makeChoiceQuestion({ kind: "〜てもいいです", prompt: `Context: ${item.permitContext}`, subprompt: item.permitEn, band: "Choose the permission or concession sentence.", answer: item.permit, options: [item.permit, item.prohibit, `${item.te}もいけません。`, `${item.te}なければなりません。`], explanation: "〜てもいいです means the action or condition is allowed, acceptable, or okay." }),
		(item) => makeChoiceQuestion({ kind: "〜てはいけません", prompt: `Context: ${item.prohibitContext}`, subprompt: item.prohibitEn, band: "Choose the prohibition sentence.", answer: item.prohibit, options: [item.prohibit, item.permit, `${item.te}もいいではありません。`, `${item.te}なくてもいいです。`], explanation: "〜てはいけません expresses prohibition: must not / not allowed." }),
		(item) => makeTextQuestion({ kind: "〜てもいいです", prompt: `${item.te}＿＿＿＿。`, subprompt: item.permitEn, band: "Type the permission ending.", answer: "もいいです", accepted: ["もいいです", "もいいです。"], placeholder: "もいいです", explanation: `Attach もいいです after the te-like form: ${item.permit}` }),
		(item) => makeTextQuestion({ kind: "〜てはいけません", prompt: `${item.te}＿＿＿＿。`, subprompt: item.prohibitEn, band: "Type the prohibition ending.", answer: "はいけません", accepted: ["はいけません", "はいけません。"], placeholder: "はいけません", explanation: `Attach はいけません after the te-like form: ${item.prohibit}` }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: item.permit, subprompt: "Choose the meaning.", band: "Read the permission sentence.", answer: item.permitEn, options: [item.permitEn, item.prohibitEn, "You do not have to do it.", "You must do it."], explanation: "〜てもいいです gives permission or says a condition is acceptable." }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: item.prohibit, subprompt: "Choose the meaning.", band: "Read the prohibition sentence.", answer: item.prohibitEn, options: [item.prohibitEn, item.permitEn, "You do not have to do it.", "You should try doing it."], explanation: "〜てはいけません says something is not allowed." }),
		(item) => makeChoiceQuestion({ kind: "form before てもいい", prompt: `${item.plain} → ＿＿＿＿もいいです。`, subprompt: `Use the ${item.type} form before もいいです.`, band: "Choose the te-like form.", answer: item.te, options: [item.te, item.plain, `${item.te}は`, `${item.plain}て`], explanation: "Use verb て-form, i-adjective 〜くて, or na-adjective/noun + で before もいいです." }),
		(item) => makeChoiceQuestion({ kind: "てもいい vs てはいけません", prompt: `A: ${item.request} B: ${item.permitResponse}`, subprompt: "What did B say?", band: "Read the permission dialogue.", answer: "It is allowed.", options: ["It is allowed.", "It is forbidden.", "It is required.", "It is already finished."], explanation: "A question with てもいいですか asks for permission; どうぞ or 大丈夫です accepts it." }),
		(item) => makeChoiceQuestion({ kind: "てもいい vs てはいけません", prompt: `A: ${item.request} B: ${item.prohibitResponse}`, subprompt: "What did B say?", band: "Read the refusal dialogue.", answer: "It is not allowed.", options: ["It is not allowed.", "It is allowed.", "It is optional.", "It is past experience."], explanation: "A negative response to てもいいですか often means the action is not allowed." }),
		(item) => makeChoiceQuestion({ kind: "pitfall · てもいい", prompt: `Which ending means “it is okay even if...” or “you may...”?`, subprompt: item.permitEn, band: "Choose the permissive ending.", answer: "てもいいです", options: ["てもいいです", "てはいけません", "なければなりません", "たことがあります"], explanation: "てもいいです is permission or concession; てはいけません is prohibition." })
	],
	noNeedMust: [
		(item) => makeChoiceQuestion({ kind: "〜なくてもいいです", prompt: `Context: ${item.noNeedContext}`, subprompt: item.noNeedEn, band: "Choose lack of necessity.", answer: item.noNeed, options: [item.noNeed, item.must, `${item.wrongPositive}はいけません。`, `${item.negativeTe}はいけません。`], explanation: "〜なくてもいいです means it is okay not to do it, or it does not have to be that way." }),
		(item) => makeChoiceQuestion({ kind: "〜なければなりません", prompt: `Context: ${item.mustContext}`, subprompt: item.mustEn, band: "Choose obligation.", answer: item.must, options: [item.must, item.noNeed, `${item.wrongPositive}もいいです。`, `${item.negativeTe}もいいです。`], explanation: "〜なければなりません expresses necessity or obligation: must / have to." }),
		(item) => makeTextQuestion({ kind: "〜なくてもいいです", prompt: `${item.negativeTe}＿＿＿＿。`, subprompt: item.noNeedEn, band: "Type the lack-of-necessity ending.", answer: "もいいです", accepted: ["もいいです", "もいいです。"], placeholder: "もいいです", explanation: `Negative te-like form + もいいです means “do not have to”: ${item.noNeed}` }),
		(item) => makeTextQuestion({ kind: "〜なければなりません", prompt: `${item.nakereba}＿＿＿＿。`, subprompt: item.mustEn, band: "Type the obligation ending.", answer: "なりません", accepted: ["なりません", "なりません。"], placeholder: "なりません", explanation: `Use なければなりません for obligation: ${item.must}` }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: item.noNeed, subprompt: "Choose the meaning.", band: "Read the lack-of-necessity sentence.", answer: item.noNeedEn, options: [item.noNeedEn, item.mustEn, "You must not do it.", "You may do it if you want."], explanation: "〜なくてもいいです does not mean “must not.” It means “do not have to.”" }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: item.must, subprompt: "Choose the meaning.", band: "Read the obligation sentence.", answer: item.mustEn, options: [item.mustEn, item.noNeedEn, "You must not do it.", "You already did it."], explanation: "〜なければなりません is a double-negative style pattern that means “must.”" }),
		(item) => makeChoiceQuestion({ kind: "form before なくてもいい", prompt: `${item.plain} → ＿＿＿＿もいいです。`, subprompt: "Choose the negative te-like form.", band: "Build なくてもいいです.", answer: item.negativeTe, options: [item.negativeTe, item.wrongPositive, item.nakereba, item.plain], explanation: "Before もいいです, use the negative te-like form: 〜なくて or noun/na-adjective + でなくて." }),
		(item) => makeChoiceQuestion({ kind: "form before なければ", prompt: `${item.plain} → ＿＿＿＿なりません。`, subprompt: "Choose the conditional obligation form.", band: "Build なければなりません.", answer: item.nakereba, options: [item.nakereba, item.negativeTe, item.wrongPositive, item.plain], explanation: "Use 〜なければ + なりません to express obligation." }),
		(item) => makeChoiceQuestion({ kind: "pitfall · なくてもいい", prompt: `Which sentence means “do not have to,” not “must not”?`, subprompt: item.noNeedEn, band: "Separate optional from forbidden.", answer: item.noNeed, options: [item.noNeed, `${item.wrongPositive}はいけません。`, item.must, `${item.wrongPositive}もいいです。`], explanation: "なくてもいい says the negative choice is allowed; てはいけません forbids the positive action." }),
		(item) => makeChoiceQuestion({ kind: "pitfall · なければ", prompt: `Which sentence means “must / have to”?`, subprompt: item.mustEn, band: "Choose the obligation pattern.", answer: item.must, options: [item.must, item.noNeed, `${item.wrongPositive}はいけません。`, `${item.negativeTe}もいいです。`], explanation: "なければなりません literally sounds negative, but the meaning is obligation." })
	]
};

const desireNounScenarios = [
	{ subject: "私は", subjectEn: "I", noun: "自分の部屋", nounEn: "my own room", natural: "私は自分の部屋がほしいです。", question: "何がほしいですか。", answer: "自分の部屋がほしいです。", thirdSubject: "妹", thirdEn: "my little sister", thirdNatural: "妹は自分の部屋をほしがっています。", context: "今、兄弟と同じ部屋を使っています。" },
	{ subject: "私は", subjectEn: "I", noun: "新しいパソコン", nounEn: "a new computer", natural: "私は新しいパソコンがほしいです。", question: "何がほしいですか。", answer: "新しいパソコンがほしいです。", thirdSubject: "弟", thirdEn: "my little brother", thirdNatural: "弟は新しいパソコンをほしがっています。", context: "古いパソコンがよく止まります。" },
	{ subject: "私は", subjectEn: "I", noun: "大きいかばん", nounEn: "a big bag", natural: "私は大きいかばんがほしいです。", question: "旅行の前に何がほしいですか。", answer: "大きいかばんがほしいです。", thirdSubject: "母", thirdEn: "my mother", thirdNatural: "母は大きいかばんをほしがっています。", context: "来月、旅行に行きます。" },
	{ subject: "私は", subjectEn: "I", noun: "安いチケット", nounEn: "a cheap ticket", natural: "私は安いチケットがほしいです。", question: "何がほしいですか。", answer: "安いチケットがほしいです。", thirdSubject: "友だち", thirdEn: "my friend", thirdNatural: "友だちは安いチケットをほしがっています。", context: "コンサートに行きたいです。" },
	{ subject: "私は", subjectEn: "I", noun: "静かな席", nounEn: "a quiet seat", natural: "私は静かな席がほしいです。", question: "図書館で何がほしいですか。", answer: "静かな席がほしいです。", thirdSubject: "田中さん", thirdEn: "Tanaka", thirdNatural: "田中さんは静かな席をほしがっています。", context: "図書館が少しうるさいです。" },
	{ subject: "私は", subjectEn: "I", noun: "日本語の本", nounEn: "a Japanese book", natural: "私は日本語の本がほしいです。", question: "本屋で何がほしいですか。", answer: "日本語の本がほしいです。", thirdSubject: "姉", thirdEn: "my older sister", thirdNatural: "姉は日本語の本をほしがっています。", context: "読む練習をしたいです。" },
	{ subject: "私は", subjectEn: "I", noun: "水", nounEn: "water", natural: "私は水がほしいです。", question: "暑い日に何がほしいですか。", answer: "水がほしいです。", thirdSubject: "犬", thirdEn: "the dog", thirdNatural: "犬は水をほしがっています。", context: "とても暑いです。" },
	{ subject: "私は", subjectEn: "I", noun: "休み", nounEn: "a day off", natural: "私は休みがほしいです。", question: "忙しい時、何がほしいですか。", answer: "休みがほしいです。", thirdSubject: "父", thirdEn: "my father", thirdNatural: "父は休みをほしがっています。", context: "毎日仕事で忙しいです。" },
	{ subject: "私は", subjectEn: "I", noun: "もっと時間", nounEn: "more time", natural: "私はもっと時間がほしいです。", question: "テストの前に何がほしいですか。", answer: "もっと時間がほしいです。", thirdSubject: "学生", thirdEn: "the student", thirdNatural: "学生はもっと時間をほしがっています。", context: "まだ勉強が終わっていません。" },
	{ subject: "私は", subjectEn: "I", noun: "温かいコート", nounEn: "a warm coat", natural: "私は温かいコートがほしいです。", question: "冬に何がほしいですか。", answer: "温かいコートがほしいです。", thirdSubject: "子ども", thirdEn: "the child", thirdNatural: "子どもは温かいコートをほしがっています。", context: "外は寒いです。" }
];

const desireActionScenarios = [
	{ subject: "私は", subjectEn: "I", object: "本", stem: "読み", verbEn: "read a book", natural: "私は本が読みたいです。", altNatural: "私は本を読みたいです。", negative: "私は本を読みたくないです。", thirdSubject: "妹", thirdEn: "my little sister", thirdNatural: "妹は本を読みたがっています。", context: "週末はゆっくりしたいです。" },
	{ subject: "私は", subjectEn: "I", object: "薬", stem: "飲み", verbEn: "take medicine", natural: "私は薬を飲みたいです。", altNatural: "私は薬が飲みたいです。", negative: "私は薬を飲みたくないです。", thirdSubject: "弟", thirdEn: "my little brother", thirdNatural: "弟は薬を飲みたがっています。", context: "頭が痛いです。" },
	{ subject: "私は", subjectEn: "I", object: "日本語", stem: "勉強し", verbEn: "study Japanese", natural: "私は日本語を勉強したいです。", altNatural: "私は日本語が勉強したいです。", negative: "私は日本語を勉強したくないです。", thirdSubject: "友だち", thirdEn: "my friend", thirdNatural: "友だちは日本語を勉強したがっています。", context: "日本に留学したいです。" },
	{ subject: "私は", subjectEn: "I", object: "新幹線", stem: "乗り", verbEn: "ride the shinkansen", natural: "私は新幹線に乗りたいです。", altNatural: "私は新幹線が乗りたいです。", negative: "私は新幹線に乗りたくないです。", thirdSubject: "子ども", thirdEn: "the child", thirdNatural: "子どもは新幹線に乗りたがっています。", context: "東京へ旅行します。" },
	{ subject: "私は", subjectEn: "I", object: "映画", stem: "見", verbEn: "watch a movie", natural: "私は映画が見たいです。", altNatural: "私は映画を見たいです。", negative: "私は映画を見たくないです。", thirdSubject: "姉", thirdEn: "my older sister", thirdNatural: "姉は映画を見たがっています。", context: "新しい映画が始まりました。" },
	{ subject: "私は", subjectEn: "I", object: "寿司", stem: "食べ", verbEn: "eat sushi", natural: "私は寿司が食べたいです。", altNatural: "私は寿司を食べたいです。", negative: "私は寿司を食べたくないです。", thirdSubject: "父", thirdEn: "my father", thirdNatural: "父は寿司を食べたがっています。", context: "お腹がすきました。" },
	{ subject: "私は", subjectEn: "I", object: "海", stem: "見", verbEn: "see the ocean", natural: "私は海が見たいです。", altNatural: "私は海を見たいです。", negative: "私は海を見たくないです。", thirdSubject: "母", thirdEn: "my mother", thirdNatural: "母は海を見たがっています。", context: "いい天気です。" },
	{ subject: "私は", subjectEn: "I", object: "家", stem: "帰り", verbEn: "go home", natural: "私は家に帰りたいです。", altNatural: "私は家が帰りたいです。", negative: "私は家に帰りたくないです。", thirdSubject: "学生", thirdEn: "the student", thirdNatural: "学生は家に帰りたがっています。", context: "授業が終わりました。" },
	{ subject: "私は", subjectEn: "I", object: "ゲーム", stem: "し", verbEn: "play games", natural: "私はゲームがしたいです。", altNatural: "私はゲームをしたいです。", negative: "私はゲームをしたくないです。", thirdSubject: "弟", thirdEn: "my little brother", thirdNatural: "弟はゲームをしたがっています。", context: "宿題が終わりました。" },
	{ subject: "私は", subjectEn: "I", object: "温泉", stem: "入り", verbEn: "go into a hot spring", natural: "私は温泉に入りたいです。", altNatural: "私は温泉が入りたいです。", negative: "私は温泉に入りたくないです。", thirdSubject: "祖母", thirdEn: "my grandmother", thirdNatural: "祖母は温泉に入りたがっています。", context: "旅行先に温泉があります。" }
];

const hopeSituationScenarios = [
	{ plain: "いい仕事が見つかる", hoped: "いい仕事が見つかるといいです。", hopedEn: "I hope I find a good job.", context: "来月から就職活動をします。", wrongPast: "いい仕事が見つかったといいです。", wrongVolitional: "いい仕事を見つけようといいです。" },
	{ plain: "運動会の日、雨が降らない", hoped: "運動会の日、雨が降らないといいです。", hopedEn: "I hope it does not rain on sports day.", context: "土曜日は運動会です。", wrongPast: "雨が降らなかったといいです。", wrongVolitional: "雨が降らないでしょうといいです。" },
	{ plain: "風邪が早く治る", hoped: "風邪が早く治るといいです。", hopedEn: "I hope the cold gets better soon.", context: "友だちが風邪をひきました。", wrongPast: "風邪が早く治ったといいです。", wrongVolitional: "風邪を治そうといいです。" },
	{ plain: "部屋がもっと広い", hoped: "部屋がもっと広いといいです。", hopedEn: "I hope the room is more spacious.", context: "アパートを探しています。", wrongPast: "部屋がもっと広かったといいです。", wrongVolitional: "部屋がもっと広くしようといいです。" },
	{ plain: "ホームステイの家族が親切だ", hoped: "ホームステイの家族が親切だといいです。", hopedEn: "I hope the host family is kind.", context: "来月、ホームステイをします。", wrongPast: "ホームステイの家族が親切だったといいです。", wrongVolitional: "ホームステイの家族が親切でといいです。" },
	{ plain: "試験が簡単だ", hoped: "試験が簡単だといいです。", hopedEn: "I hope the exam is easy.", context: "明日は試験です。", wrongPast: "試験が簡単だったといいです。", wrongVolitional: "試験が簡単でといいです。" },
	{ plain: "バスがすぐ来る", hoped: "バスがすぐ来るといいです。", hopedEn: "I hope the bus comes soon.", context: "寒い所で待っています。", wrongPast: "バスがすぐ来たといいです。", wrongVolitional: "バスが来ようといいです。" },
	{ plain: "先生が元気だ", hoped: "先生が元気だといいです。", hopedEn: "I hope the teacher is well.", context: "先生は昨日休みました。", wrongPast: "先生が元気だったといいです。", wrongVolitional: "先生が元気でといいです。" },
	{ plain: "チケットがまだある", hoped: "チケットがまだあるといいです。", hopedEn: "I hope tickets are still available.", context: "人気のコンサートです。", wrongPast: "チケットがまだあったといいです。", wrongVolitional: "チケットがありたいといいです。" },
	{ plain: "道が込んでいない", hoped: "道が込んでいないといいです。", hopedEn: "I hope the roads are not crowded.", context: "空港へ行きます。", wrongPast: "道が込んでいなかったといいです。", wrongVolitional: "道が込まないでしょうといいです。" }
];

const desireQuestionTemplates = {
	noun: [
		(item) => makeChoiceQuestion({ kind: "〜がほしいです", prompt: `Context: ${item.context}`, subprompt: `${item.subjectEn} want${item.subjectEn === "I" ? "" : "s"} ${item.nounEn}.`, band: "Choose noun + がほしいです.", answer: item.natural, options: [item.natural, `${item.subject}${item.noun}をほしいです。`, `${item.subject}${item.noun}がほしがります。`, `${item.subject}${item.noun}をたいです。`], explanation: "Use noun + がほしいです to talk about the speaker's wanted thing." }),
		(item) => makeTextQuestion({ kind: "〜がほしいです", prompt: `${item.subject}${item.noun}＿＿＿＿。`, subprompt: `Say “want ${item.nounEn}.”`, band: "Type がほしいです.", answer: "がほしいです", accepted: ["がほしいです", "がほしいです。"], placeholder: "がほしいです", explanation: `Use が before ほしい: ${item.natural}` }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: item.natural, subprompt: "Choose the meaning.", band: "Read the desire sentence.", answer: `${item.subjectEn} want${item.subjectEn === "I" ? "" : "s"} ${item.nounEn}.`, options: [`${item.subjectEn} want${item.subjectEn === "I" ? "" : "s"} ${item.nounEn}.`, `${item.subjectEn} want${item.subjectEn === "I" ? "" : "s"} to use ${item.nounEn}.`, `${item.subjectEn} must have ${item.nounEn}.`, `${item.subjectEn} had ${item.nounEn} before.`], explanation: "ほしい is for wanting a noun, not an action." }),
		(item) => makeChoiceQuestion({ kind: "〜ほしがります", prompt: `Observation: ${item.thirdEn} keeps talking about ${item.nounEn}.`, subprompt: `Say that ${item.thirdEn} seems to want it.`, band: "Choose third-person desire.", answer: item.thirdNatural, options: [item.thirdNatural, `${item.thirdSubject}は${item.noun}がほしいです。`, `${item.thirdSubject}は${item.noun}をたいです。`, `${item.thirdSubject}は${item.noun}がほしがっています。`], explanation: "For a third person's visible desire, use noun + を + ほしがっています." }),
		(item) => makeTextQuestion({ kind: "〜ほしがります", prompt: `${item.thirdSubject}は${item.noun}を＿＿＿＿。`, subprompt: `${item.thirdEn} seems to want ${item.nounEn}.`, band: "Type ほしがっています.", answer: "ほしがっています", accepted: ["ほしがっています", "ほしがっています。", "ほしがります"], placeholder: "ほしがっています", explanation: `Third-person desire uses ほしがる: ${item.thirdNatural}` }),
		(item) => makeChoiceQuestion({ kind: "particle · ほしい", prompt: `${item.subject}${item.noun}＿＿ほしいです。`, subprompt: "Choose the usual particle with ほしい.", band: "Pick the particle.", answer: "が", options: ["が", "を", "に", "で"], explanation: "The wanted noun is usually marked with が when using ほしいです." }),
		(item) => makeChoiceQuestion({ kind: "particle · ほしがる", prompt: `${item.thirdSubject}は${item.noun}＿＿ほしがっています。`, subprompt: "Choose the particle for third-person ほしがる.", band: "Pick the particle.", answer: "を", options: ["を", "が", "に", "で"], explanation: "ほしがる behaves more like a verb, so the wanted thing is often marked with を." }),
		(item) => makeChoiceQuestion({ kind: "ほしい vs たい", prompt: `Which sentence wants a thing, not an action?`, subprompt: item.nounEn, band: "Choose ほしい.", answer: item.natural, options: [item.natural, `${item.subject}${item.noun}を買いたいです。`, `${item.subject}${item.noun}ができます。`, `${item.subject}${item.noun}をほしがります。`], explanation: "Use ほしい for wanted nouns; use たい for wanted actions." })
	],
	action: [
		(item) => makeChoiceQuestion({ kind: "〜たいです", prompt: `Context: ${item.context}`, subprompt: `${item.subjectEn} want${item.subjectEn === "I" ? "" : "s"} to ${item.verbEn}.`, band: "Choose verb stem + たいです.", answer: item.natural, options: [item.natural, `${item.subject}${item.object}がほしいです。`, `${item.subject}${item.object}をたがります。`, `${item.subject}${item.object}を${item.stem}ほしいです。`], explanation: "Use the ます-stem + たいです to say the speaker wants to do an action." }),
		(item) => makeTextQuestion({ kind: "〜たいです", prompt: `${item.subject}${item.object}${item.natural.includes("が") ? "が" : item.natural.includes("に") ? "に" : "を"}${item.stem}＿＿＿＿。`, subprompt: `Want to ${item.verbEn}.`, band: "Type たいです.", answer: "たいです", accepted: ["たいです", "たいです。"], placeholder: "たいです", explanation: `Use verb stem + たいです: ${item.natural}` }),
		(item) => makeChoiceQuestion({ kind: "〜たくないです", prompt: `Which sentence means “do not want to ${item.verbEn}”?`, subprompt: "Choose the negative of たい.", band: "Choose たくないです.", answer: item.negative, options: [item.negative, item.natural, item.thirdNatural, `${item.subject}${item.object}がほしくないです。`], explanation: "The negative of たいです is たくないです." }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: item.natural, subprompt: "Choose the meaning.", band: "Read the たい sentence.", answer: `${item.subjectEn} want${item.subjectEn === "I" ? "" : "s"} to ${item.verbEn}.`, options: [`${item.subjectEn} want${item.subjectEn === "I" ? "" : "s"} to ${item.verbEn}.`, `${item.subjectEn} want${item.subjectEn === "I" ? "" : "s"} ${item.object}.`, `${item.subjectEn} must ${item.verbEn}.`, `${item.subjectEn} is allowed to ${item.verbEn}.`], explanation: "たい attaches to a verb stem and means “want to do.”" }),
		(item) => makeChoiceQuestion({ kind: "〜たがります", prompt: `Observation: ${item.thirdEn} looks eager to ${item.verbEn}.`, subprompt: "Choose third-person action desire.", band: "Choose たがっています/たがります.", answer: item.thirdNatural, options: [item.thirdNatural, `${item.thirdSubject}は${item.object}が${item.stem}たいです。`, `${item.thirdSubject}は${item.object}がほしいです。`, `${item.thirdSubject}は${item.object}を${item.stem}たいです。`], explanation: "For a third person's visible desire to do an action, use verb stem + たがる." }),
		(item) => makeTextQuestion({ kind: "〜たがります", prompt: `${item.thirdSubject}は${item.object}を${item.stem}＿＿＿＿。`, subprompt: `${item.thirdEn} seems to want to ${item.verbEn}.`, band: "Type たがっています.", answer: "たがっています", accepted: ["たがっています", "たがっています。", "たがります"], placeholder: "たがっています", explanation: `Third-person action desire uses たがる: ${item.thirdNatural}` }),
		(item) => item.natural.includes(`${item.object}に`)
			? makeChoiceQuestion({ kind: "particle · たい", prompt: `${item.subject}${item.object}＿＿${item.stem}たいです。`, subprompt: `Choose the particle for “want to ${item.verbEn}.”`, band: "Keep the verb's required particle.", answer: "に", options: ["に", "が", "を", "で"], explanation: "たい attaches to the verb stem, but verbs like 乗る, 帰る, and 入る still keep their needed particle." })
			: makeChoiceQuestion({ kind: "particle · たい", prompt: item.natural, subprompt: "Which alternate particle is often also possible with object-like nouns and たい?", band: "Notice を/が flexibility.", answer: item.altNatural, options: [item.altNatural, item.thirdNatural, `${item.subject}${item.object}をほしいです。`, `${item.subject}${item.object}がたがっています。`], explanation: "With many object-like nouns and たい, を sometimes changes to が; both can appear depending on verb and nuance." }),
		(item) => makeChoiceQuestion({ kind: "たい vs ほしい", prompt: `Which sentence wants to do an action?`, subprompt: item.verbEn, band: "Choose たい.", answer: item.natural, options: [item.natural, `${item.subject}${item.object}がほしいです。`, `${item.thirdSubject}は${item.object}をほしがっています。`, `${item.object}があるといいです。`], explanation: "Use たい for wanting to do an action; use ほしい for wanting a thing." })
	],
	hope: [
		(item) => makeChoiceQuestion({ kind: "〜といいです", prompt: `Context: ${item.context}`, subprompt: item.hopedEn, band: "Choose the hoped-for situation.", answer: item.hoped, options: [item.hoped, item.wrongPast, item.wrongVolitional, `${item.plain}たいです。`], explanation: "Plain non-past form + といいです expresses a hoped-for situation." }),
		(item) => makeTextQuestion({ kind: "〜といいです", prompt: `${item.plain}＿＿＿＿。`, subprompt: item.hopedEn, band: "Type といいです.", answer: "といいです", accepted: ["といいです", "といいです。"], placeholder: "といいです", explanation: `Use plain non-past + といいです: ${item.hoped}` }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: item.hoped, subprompt: "Choose the meaning.", band: "Read the hope sentence.", answer: item.hopedEn, options: [item.hopedEn, "I want to do it myself.", "Someone seems to want it.", "It is forbidden."], explanation: "といいです is for hopes about a situation, often one the speaker cannot fully control." }),
		(item) => makeChoiceQuestion({ kind: "form before といい", prompt: `${item.plain}＿＿いいです。`, subprompt: "Choose the connector for a hoped-for situation.", band: "Build といいです.", answer: "と", options: ["と", "が", "を", "で"], explanation: "Use plain form + といいです." }),
		(item) => makeChoiceQuestion({ kind: "pitfall · といい", prompt: `Which sentence sounds wrong for a future hope?`, subprompt: "Avoid past form before といいです in this pattern.", band: "Spot the form problem.", answer: item.wrongPast, options: [item.wrongPast, item.hoped, `${item.plain}といいですね。`, `${item.plain}といいなあ。`], explanation: "For this N4 hope pattern, use plain non-past forms, not た/なかった forms." }),
		(item) => makeChoiceQuestion({ kind: "nuance · といい", prompt: item.hoped, subprompt: "What kind of thing is the speaker expressing?", band: "Read the nuance.", answer: "A hope about a situation.", options: ["A hope about a situation.", "A direct request.", "A third-person observed desire.", "A prohibition."], explanation: "といいです expresses a hoped-for outcome or situation." })
	]
};

function buildDesirePitfallQuestions() {
	return [
		...desireNounScenarios.flatMap((item) => [
			makeChoiceQuestion({ kind: "pitfall · ほしい", prompt: `${item.subject}${item.noun}＿＿ほしいです。`, subprompt: "Wanted nouns usually take が.", band: "Choose the particle.", answer: "が", options: ["が", "を", "に", "で"], explanation: "Use が for the wanted noun with ほしいです." }),
			makeChoiceQuestion({ kind: "pitfall · third person", prompt: `Which sentence is better when you observe ${item.thirdEn}'s desire?`, subprompt: item.nounEn, band: "Use ほしがる for third person.", answer: item.thirdNatural, options: [item.thirdNatural, `${item.thirdSubject}は${item.noun}がほしいです。`, `${item.thirdSubject}は${item.noun}たいです。`, `${item.thirdSubject}は${item.noun}がほしがっています。`], explanation: "Use ほしがる for visible third-person desire; it often takes を." }),
			makeChoiceQuestion({ kind: "nuance · ほしい", prompt: item.natural, subprompt: "What is being wanted?", band: "Thing or action?", answer: "A thing.", options: ["A thing.", "An action.", "A prohibition.", "A past experience."], explanation: "ほしい attaches to nouns, so it wants a thing." })
		]),
		...desireActionScenarios.flatMap((item) => [
			makeChoiceQuestion({ kind: "pitfall · たい", prompt: `Which form attaches to a verb stem to mean “want to ${item.verbEn}”?`, subprompt: item.stem, band: "Choose たい.", answer: `${item.stem}たいです`, options: [`${item.stem}たいです`, `${item.stem}ほしいです`, `${item.stem}といいです`, `${item.stem}ことがあります`], explanation: "たい attaches to the ます-stem of a verb." }),
			makeChoiceQuestion({ kind: "pitfall · third person", prompt: `Which sentence is better when you observe ${item.thirdEn}'s desire?`, subprompt: item.verbEn, band: "Use たがる for third person.", answer: item.thirdNatural, options: [item.thirdNatural, `${item.thirdSubject}は${item.object}が${item.stem}たいです。`, `${item.thirdSubject}は${item.object}がほしいです。`, `${item.thirdSubject}は${item.object}を${item.stem}たかったです。`], explanation: "Use たがる when describing a third person's visible desire to do something." }),
			makeChoiceQuestion({ kind: "nuance · たくない", prompt: item.negative, subprompt: "What does たくない mean?", band: "Read the negative desire.", answer: `Does not want to ${item.verbEn}.`, options: [`Does not want to ${item.verbEn}.`, `Must not ${item.verbEn}.`, `Does not have to ${item.verbEn}.`, `Hopes to ${item.verbEn}.`], explanation: "たくない is the negative of たい, not prohibition or lack of necessity." })
		]),
		...hopeSituationScenarios.flatMap((item) => [
			makeChoiceQuestion({ kind: "pitfall · といい", prompt: item.hoped, subprompt: "Which pattern is this?", band: "Separate hope from personal desire.", answer: "Plain form + といいです.", options: ["Plain form + といいです.", "Noun + がほしいです.", "Verb stem + たいです.", "Verb stem + たがります."], explanation: "といいです expresses a hope about a situation." }),
			makeChoiceQuestion({ kind: "pitfall · といい form", prompt: `Choose the natural hope sentence.`, subprompt: item.hopedEn, band: "Avoid past/volitional forms.", answer: item.hoped, options: [item.hoped, item.wrongPast, item.wrongVolitional, `${item.plain}ほしいです。`], explanation: "For this pattern, use plain non-past form before といいです." })
		])
	];
}

const souAppearanceScenarios = [
	{ type: "verb", subject: "コップ", stem: "落ち", plain: "落ちる", appearance: "コップが落ちそうです。", negative: "コップは落ちそうもありません。", meaning: "The cup looks like it will fall.", negativeMeaning: "The cup does not look like it will fall.", context: "テーブルの端にあります。", wrongPlain: "コップが落ちるそうです。", wrongNegative: "コップが落ちなさそうです。" },
	{ type: "verb", subject: "雨", stem: "降り", plain: "降る", appearance: "雨が降りそうです。", negative: "雨は降りそうもありません。", meaning: "It looks like it will rain.", negativeMeaning: "It does not look like it will rain.", context: "空が暗くなりました。", wrongPlain: "雨が降るそうです。", wrongNegative: "雨が降らなさそうです。" },
	{ type: "verb", subject: "赤ちゃん", stem: "泣き", plain: "泣く", appearance: "赤ちゃんが泣きそうです。", negative: "赤ちゃんは泣きそうもありません。", meaning: "The baby looks like it will cry.", negativeMeaning: "The baby does not look like it will cry.", context: "赤ちゃんの顔が赤くなりました。", wrongPlain: "赤ちゃんが泣くそうです。", wrongNegative: "赤ちゃんが泣かなそうです。" },
	{ type: "verb", subject: "電車", stem: "出発し", plain: "出発する", appearance: "電車が出発しそうです。", negative: "電車は出発しそうもありません。", meaning: "The train looks like it will depart.", negativeMeaning: "The train does not look like it will depart.", context: "ドアが閉まりました。", wrongPlain: "電車が出発するそうです。", wrongNegative: "電車が出発しなさそうです。" },
	{ type: "i-adjective", subject: "ケーキ", stem: "おいし", plain: "おいしい", appearance: "ケーキはおいしそうです。", negative: "ケーキはおいしくなさそうです。", meaning: "The cake looks delicious.", negativeMeaning: "The cake does not look delicious.", context: "ケーキにいちごがのっています。", wrongPlain: "ケーキはおいしいそうです。", wrongNegative: "ケーキはおいしそうもありません。" },
	{ type: "i-adjective", subject: "田中さん", stem: "眠", plain: "眠い", appearance: "田中さんは眠そうです。", negative: "田中さんは眠くなさそうです。", meaning: "Tanaka looks sleepy.", negativeMeaning: "Tanaka does not look sleepy.", context: "田中さんは何度もあくびをしています。", wrongPlain: "田中さんは眠いそうです。", wrongNegative: "田中さんは眠そうもありません。" },
	{ type: "i-adjective", subject: "この問題", stem: "難し", plain: "難しい", appearance: "この問題は難しそうです。", negative: "この問題は難しくなさそうです。", meaning: "This problem looks difficult.", negativeMeaning: "This problem does not look difficult.", context: "問題文がとても長いです。", wrongPlain: "この問題は難しいそうです。", wrongNegative: "この問題は難しそうもありません。" },
	{ type: "i-adjective", subject: "そのかばん", stem: "重", plain: "重い", appearance: "そのかばんは重そうです。", negative: "そのかばんは重くなさそうです。", meaning: "That bag looks heavy.", negativeMeaning: "That bag does not look heavy.", context: "友だちは両手で持っています。", wrongPlain: "そのかばんは重いそうです。", wrongNegative: "そのかばんは重そうもありません。" },
	{ type: "exception", subject: "天気", stem: "よさ", plain: "いい", appearance: "天気はよさそうです。", negative: "天気はよくなさそうです。", meaning: "The weather looks good.", negativeMeaning: "The weather does not look good.", context: "空が明るいです。", wrongPlain: "天気はいいそうです。", wrongNegative: "天気はいいそうではありません。" },
	{ type: "exception", subject: "時間", stem: "なさ", plain: "ない", appearance: "時間はなさそうです。", negative: "時間はありそうもありません。", meaning: "It looks like there is no time.", negativeMeaning: "It does not look like there will be time.", context: "もう電車が来ます。", wrongPlain: "時間はないそうです。", wrongNegative: "時間はなくなさそうです。" },
	{ type: "na-adjective", subject: "ジョンさん", stem: "しんぱい", plain: "しんぱい", appearance: "ジョンさんはしんぱいそうです。", negative: "ジョンさんはしんぱいではなさそうです。", meaning: "John looks worried.", negativeMeaning: "John does not look worried.", context: "ジョンさんは電話で小さい声で話しています。", wrongPlain: "ジョンさんはしんぱいだそうです。", wrongNegative: "ジョンさんはしんぱいそうもありません。" },
	{ type: "na-adjective", subject: "この町", stem: "静か", plain: "静か", appearance: "この町は静かそうです。", negative: "この町は静かではなさそうです。", meaning: "This town looks quiet.", negativeMeaning: "This town does not look quiet.", context: "駅の前にも人が少ないです。", wrongPlain: "この町は静かだそうです。", wrongNegative: "この町は静かそうもありません。" }
];

const visibleEmotionScenarios = [
	{ subject: "母", subjectEn: "my mother", stem: "さびし", emotionEn: "lonely", current: "母はさびしがっています。", tendency: "母は一人でいるとさびしがります。", contextNow: "父が出張で、家に母だけがいます。", contextHabit: "父が出張の時はいつも電話をします。" },
	{ subject: "子どもたち", subjectEn: "the children", stem: "おもしろ", emotionEn: "interested / amused", current: "子どもたちはおもしろがっています。", tendency: "子どもたちはこのゲームをおもしろがります。", contextNow: "子どもたちは新しいゲームで遊んでいます。", contextHabit: "このゲームを見せると、いつも喜びます。" },
	{ subject: "弟", subjectEn: "my little brother", stem: "こわ", emotionEn: "scared", current: "弟はこわがっています。", tendency: "弟はこわい話をこわがります。", contextNow: "弟はこわい映画を見ています。", contextHabit: "こわい話をすると、弟は部屋を出ます。" },
	{ subject: "犬", subjectEn: "the dog", stem: "暑", emotionEn: "hot", current: "犬は暑がっています。", tendency: "犬は夏になると暑がります。", contextNow: "犬は日なたで口を開けています。", contextHabit: "夏はいつも冷たい床で寝ます。" },
	{ subject: "赤ちゃん", subjectEn: "the baby", stem: "眠た", emotionEn: "sleepy", current: "赤ちゃんは眠たがっています。", tendency: "赤ちゃんは夕方になると眠たがります。", contextNow: "赤ちゃんは目をこすっています。", contextHabit: "夕方になると、いつも泣きます。" },
	{ subject: "妹", subjectEn: "my little sister", stem: "恥ずかし", emotionEn: "embarrassed", current: "妹は恥ずかしがっています。", tendency: "妹は人の前で話すのを恥ずかしがります。", contextNow: "妹はみんなの前に立っています。", contextHabit: "発表の時はいつも顔が赤くなります。" },
	{ subject: "学生たち", subjectEn: "the students", stem: "いや", emotionEn: "reluctant", current: "学生たちはいやがっています。", tendency: "学生たちは難しい宿題をいやがります。", contextNow: "先生がたくさん宿題を出しました。", contextHabit: "宿題が多いと、いつも文句を言います。" },
	{ subject: "友だち", subjectEn: "my friend", stem: "寒", emotionEn: "cold", current: "友だちは寒がっています。", tendency: "友だちは冬になると寒がります。", contextNow: "友だちはコートを着ても震えています。", contextHabit: "冬はいつもストーブの近くにいます。" }
];

const mamaScenarios = [
	{ form: "窓を開けた", natural: "窓を開けたまま寝ました。", meaning: "I slept with the window left open.", context: "昨日、窓を閉めませんでした。", wrong: "窓を開けてから寝ました。", state: "the window stayed open" },
	{ form: "手を洗わない", natural: "手を洗わないまま食べてはいけません。", meaning: "You must not eat with your hands still unwashed.", context: "ご飯の前です。", wrong: "手を洗わなくて食べてはいけません。", state: "hands stayed unwashed" },
	{ form: "電気をつけた", natural: "電気をつけたまま出かけました。", meaning: "I went out with the light left on.", context: "家を出たあとで気がつきました。", wrong: "電気をつけてから出かけました。", state: "the light stayed on" },
	{ form: "くつをはいた", natural: "くつをはいたまま部屋に入りました。", meaning: "I entered the room with my shoes still on.", context: "急いでいました。", wrong: "くつをはいて部屋に入りました。", state: "shoes stayed on" },
	{ form: "ドアを閉めない", natural: "ドアを閉めないまま出かけました。", meaning: "I went out without closing the door.", context: "朝、とても急いでいました。", wrong: "ドアを閉めなくて出かけました。", state: "the door stayed unclosed" },
	{ form: "冷たい", natural: "料理は冷たいままです。", meaning: "The food is still cold.", context: "電子レンジを使いませんでした。", wrong: "料理は冷たくままです。", state: "the food stayed cold" },
	{ form: "静かな", natural: "部屋は静かなままです。", meaning: "The room is still quiet.", context: "みんな帰りました。", wrong: "部屋は静かままです。", state: "the room stayed quiet" },
	{ form: "先月の", natural: "カレンダーが先月のままです。", meaning: "The calendar is still on last month.", context: "今日は四月一日です。", wrong: "カレンダーが先月ままです。", state: "the calendar stayed on last month" },
	{ form: "古い", natural: "パスワードは古いままです。", meaning: "The password is still old.", context: "まだ変えていません。", wrong: "パスワードは古くままです。", state: "the password stayed old" },
	{ form: "空の", natural: "コップは空のままです。", meaning: "The cup is still empty.", context: "だれも水を入れませんでした。", wrong: "コップは空ままです。", state: "the cup stayed empty" }
];

function souStemOptions(item) {
	if (item.type === "verb") return [item.stem, item.plain, `${item.stem}て`, `${item.stem}ます`];
	if (item.type === "i-adjective") return [item.stem, item.plain, `${item.stem}く`, `${item.stem}かった`];
	if (item.type === "exception" && item.plain === "いい") return [item.stem, item.plain, "よく", "よい"];
	if (item.type === "exception" && item.plain === "ない") return [item.stem, item.plain, "なく", "ないで"];
	return [item.stem, `${item.stem}な`, `${item.stem}だ`, `${item.stem}では`];
}

function visibleFeelingPlain(item) {
	return item.stem === "いや" ? "いやです" : `${item.stem}いです`;
}

function visibleFeelingMama(item) {
	return item.stem === "いや" ? `${item.subject}はいやなままです。` : `${item.subject}は${item.stem}いままです。`;
}

const appearanceQuestionTemplates = {
	sou: [
		(item) => makeChoiceQuestion({ kind: "〜そうです", prompt: `Context: ${item.context}`, subprompt: item.meaning, band: "Choose the appearance/inference sentence.", answer: item.appearance, options: [item.appearance, item.wrongPlain, item.negative, item.wrongNegative], explanation: "〜そうです describes what seems likely from appearance or circumstances." }),
		(item) => makeTextQuestion({ kind: "〜そうです", prompt: `${item.subject}は${item.stem}＿＿＿＿。`, subprompt: item.meaning, band: "Type そうです.", answer: "そうです", accepted: ["そうです", "そうです。"], placeholder: "そうです", explanation: `Attach そうです to the correct stem: ${item.appearance}` }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: item.appearance, subprompt: "Choose the meaning.", band: "Read the そうです sentence.", answer: item.meaning, options: [item.meaning, item.negativeMeaning, "Someone said this happened.", "The state was left unchanged."], explanation: "This そうです is appearance/inference, not hearsay." }),
		(item) => makeChoiceQuestion({ kind: "〜そうもありません", prompt: `Context: It does not look that way.`, subprompt: item.negativeMeaning, band: "Choose the negative form.", answer: item.negative, options: [item.negative, item.appearance, item.wrongNegative, item.wrongPlain], explanation: item.type === "verb" ? "For verbs, 〜そうもありません is a common negative form." : "For adjectives and nouns, use 〜くなさそう or 〜ではなさそう." }),
		(item) => makeChoiceQuestion({ kind: "form before そう", prompt: `${item.plain} → ＿＿＿＿そうです。`, subprompt: `Build: ${item.meaning}`, band: "Choose the form before そうです.", answer: item.stem, options: souStemOptions(item), explanation: "Use the verb stem, i-adjective stem, or na-adjective/noun stem before appearance そうです." }),
		(item) => makeChoiceQuestion({ kind: "pitfall · そう", prompt: `Which sentence is appearance/inference, not hearsay?`, subprompt: item.meaning, band: "Choose appearance そう.", answer: item.appearance, options: [item.appearance, item.wrongPlain, `${item.subject}はそうです。`, `${item.subject}のままです。`], explanation: "Appearance そう attaches to stems. Plain-form + そう is a different hearsay pattern." })
	],
	gari: [
		(item) => makeChoiceQuestion({ kind: "〜がっています", prompt: `Context: ${item.contextNow}`, subprompt: `${item.subjectEn} looks ${item.emotionEn} now.`, band: "Choose current visible emotion.", answer: item.current, options: [item.current, item.tendency, `${item.subject}は${item.stem}そうです。`, `${item.subject}は${visibleFeelingPlain(item)}。`], explanation: "〜がっています describes a third person's visible current feeling or desire." }),
		(item) => makeChoiceQuestion({ kind: "〜がります", prompt: `Context: ${item.contextHabit}`, subprompt: `${item.subjectEn} generally tends to feel ${item.emotionEn}.`, band: "Choose general tendency.", answer: item.tendency, options: [item.tendency, item.current, `${item.subject}は${item.stem}そうです。`, `${item.subject}は${visibleFeelingPlain(item)}。`], explanation: "〜がります describes a general tendency, not only the current moment." }),
		(item) => makeTextQuestion({ kind: "〜がっています", prompt: `${item.subject}は${item.stem}＿＿＿＿。`, subprompt: `${item.subjectEn} looks ${item.emotionEn} now.`, band: "Type がっています.", answer: "がっています", accepted: ["がっています", "がっています。"], placeholder: "がっています", explanation: `Use がっています for current visible feeling: ${item.current}` }),
		(item) => makeTextQuestion({ kind: "〜がります", prompt: `${item.subject}は${item.stem}＿＿＿＿。`, subprompt: `${item.subjectEn} generally tends to feel ${item.emotionEn}.`, band: "Type がります.", answer: "がります", accepted: ["がります", "がります。"], placeholder: "がります", explanation: `Use がります for a general tendency: ${item.tendency}` }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: item.current, subprompt: "Choose the meaning.", band: "Read the visible feeling sentence.", answer: `${item.subjectEn} visibly seems ${item.emotionEn} now.`, options: [`${item.subjectEn} visibly seems ${item.emotionEn} now.`, `${item.subjectEn} always does this as a habit.`, `${item.subjectEn} looks like it will happen.`, `${item.subjectEn} left something unchanged.`], explanation: "〜がっています focuses on visible current emotion or wish." }),
		(item) => makeChoiceQuestion({ kind: "pitfall · がる", prompt: `Which sentence fits “right now” better?`, subprompt: item.contextNow, band: "Choose がっています.", answer: item.current, options: [item.current, item.tendency, visibleFeelingMama(item), `${item.subject}は${item.stem}くなさそうです。`], explanation: "For the current visible state, use 〜がっています." })
	],
	mama: [
		(item) => makeChoiceQuestion({ kind: "〜まま", prompt: `Context: ${item.context}`, subprompt: item.meaning, band: "Choose the unchanged-state sentence.", answer: item.natural, options: [item.natural, item.wrong, `${item.form}そうです。`, `${item.form}がっています。`], explanation: "〜まま means a state continues unchanged." }),
		(item) => makeTextQuestion({ kind: "〜まま", prompt: `${item.form}＿＿＿＿。`, subprompt: item.meaning, band: "Type まま plus the ending if needed.", answer: "まま", accepted: ["まま", "ままです", "ままです。"], placeholder: "まま", explanation: `Use まま after the unchanged state: ${item.natural}` }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: item.natural, subprompt: "Choose the meaning.", band: "Read the まま sentence.", answer: item.meaning, options: [item.meaning, "It looks like it will happen.", "Someone seems to feel that way.", "The speaker wants that thing."], explanation: "まま describes a state that was not changed." }),
		(item) => makeChoiceQuestion({ kind: "unchanged state", prompt: item.natural, subprompt: "What stayed unchanged?", band: "Identify the state.", answer: item.state, options: [item.state, "a visible emotion", "a future event", "a wanted object"], explanation: "The phrase before まま names the state that remained unchanged." }),
		(item) => makeChoiceQuestion({ kind: "form before まま", prompt: `${item.form}＿＿`, subprompt: "Choose the unchanged-state grammar.", band: "Build まま.", answer: "まま", options: ["まま", "そう", "がって", "たい"], explanation: "Use まま after verbs, adjectives, or noun + の to show the state continues." }),
		(item) => makeChoiceQuestion({ kind: "pitfall · まま", prompt: `Which sentence has the correct form before まま?`, subprompt: item.meaning, band: "Spot the form error.", answer: item.natural, options: [item.natural, item.wrong, `${item.form}ところです。`, `${item.form}ことがあります。`], explanation: "Nouns take のまま, na-adjectives take なまま, and verbs/adjectives keep their plain forms." })
	]
};

function buildAppearancePitfallQuestions() {
	return [
		...souAppearanceScenarios.flatMap((item) => [
			makeChoiceQuestion({ kind: "pitfall · そう", prompt: `Which sentence uses appearance そう correctly?`, subprompt: item.meaning, band: "Avoid plain-form hearsay そう.", answer: item.appearance, options: [item.appearance, item.wrongPlain, item.wrongNegative, `${item.subject}は${item.plain}ままです。`], explanation: "Appearance そう uses stems: 降りそう, おいしそう, 静かそう." }),
			makeChoiceQuestion({ kind: "pitfall · negative そう", prompt: `Which sentence is the natural negative?`, subprompt: item.negativeMeaning, band: "Choose the negative そう form.", answer: item.negative, options: [item.negative, item.wrongNegative, item.appearance, item.wrongPlain], explanation: "Verb negatives often use そうもありません; adjective/noun negatives use なさそう or ではなさそう." })
		]),
		...visibleEmotionScenarios.flatMap((item) => [
			makeChoiceQuestion({ kind: "pitfall · がっています", prompt: `Which pattern reports a visible third-person feeling now?`, subprompt: item.contextNow, band: "Choose current visible feeling.", answer: item.current, options: [item.current, item.tendency, `${item.subject}は${item.stem}そうです。`, `${item.subject}は${visibleFeelingPlain(item)}。`], explanation: "Use がっています for visible current third-person feelings." }),
			makeChoiceQuestion({ kind: "pitfall · がります", prompt: `Which pattern reports a general tendency?`, subprompt: item.contextHabit, band: "Choose general tendency.", answer: item.tendency, options: [item.tendency, item.current, `${item.subject}は${item.stem}そうです。`, visibleFeelingMama(item)], explanation: "Use がります for a general tendency." })
		]),
		...mamaScenarios.flatMap((item) => [
			makeChoiceQuestion({ kind: "pitfall · まま", prompt: `Which sentence means the state did not change?`, subprompt: item.state, band: "Choose まま.", answer: item.natural, options: [item.natural, item.wrong, `${item.form}そうです。`, `${item.form}がります。`], explanation: "まま shows a state remained unchanged." })
		])
	];
}

const karaReasonScenarios = [
	{ cause: "用事があります", plainCause: "用事がある", result: "今日は先に帰ります", natural: "用事がありますから、今日は先に帰ります。", karaDesu: "今日は先に帰ります。用事があるからです。", meaning: "I will go home first today because I have something to do.", context: "A friend asks why you are leaving early.", directResult: "先に帰ってもいいですか", commandNatural: "用事がありますから、先に帰ってもいいですか。", wrongNode: "用事がありますので、先に帰れ。" },
	{ cause: "あぶない", plainCause: "あぶない", result: "さわらないでください", natural: "あぶないから、さわらないでください。", karaDesu: "さわらないでください。あぶないからです。", meaning: "Do not touch it because it is dangerous.", context: "A child is about to touch a hot pan.", directResult: "さわらないで", commandNatural: "あぶないから、さわらないで。", wrongNode: "あぶないので、さわれ。" },
	{ cause: "練習が足りなかった", plainCause: "練習が足りなかった", result: "スピーチが上手にできませんでした", natural: "練習が足りなかったから、スピーチが上手にできませんでした。", karaDesu: "スピーチが上手にできませんでした。練習が足りなかったからです。", meaning: "The speech did not go well because there was not enough practice.", context: "You are explaining why the speech went badly.", directResult: "もう一度練習します", commandNatural: "練習が足りなかったから、もう一度練習します。", wrongNode: "練習が足りなかったので、もう一度練習しろ。" },
	{ cause: "明日はテストです", plainCause: "明日はテストだ", result: "今晩は勉強します", natural: "明日はテストですから、今晩は勉強します。", karaDesu: "今晩は勉強します。明日はテストだからです。", meaning: "I will study tonight because there is a test tomorrow.", context: "You are turning down an invitation.", directResult: "遊びに行けません", commandNatural: "明日はテストですから、遊びに行けません。", wrongNode: "明日はテストなので、遊びに行け。" },
	{ cause: "時間がありません", plainCause: "時間がない", result: "タクシーで行きましょう", natural: "時間がありませんから、タクシーで行きましょう。", karaDesu: "タクシーで行きましょう。時間がないからです。", meaning: "Let's go by taxi because there is no time.", context: "You need to hurry to the station.", directResult: "急ぎましょう", commandNatural: "時間がありませんから、急ぎましょう。", wrongNode: "時間がありませんので、急げ。" },
	{ cause: "薬を飲みました", plainCause: "薬を飲んだ", result: "もう大丈夫です", natural: "薬を飲みましたから、もう大丈夫です。", karaDesu: "もう大丈夫です。薬を飲んだからです。", meaning: "I am okay now because I took medicine.", context: "Someone is worried about you.", directResult: "心配しないでください", commandNatural: "薬を飲みましたから、心配しないでください。", wrongNode: "薬を飲みましたので、心配しろ。" },
	{ cause: "道がこんでいました", plainCause: "道がこんでいた", result: "遅れました", natural: "道がこんでいましたから、遅れました。", karaDesu: "遅れました。道がこんでいたからです。", meaning: "I was late because the roads were crowded.", context: "You are explaining why you arrived late.", directResult: "電話しました", commandNatural: "道がこんでいましたから、電話しました。", wrongNode: "道がこんでいましたので、待て。" },
	{ cause: "雨が強い", plainCause: "雨が強い", result: "今日は出かけません", natural: "雨が強いから、今日は出かけません。", karaDesu: "今日は出かけません。雨が強いからです。", meaning: "I will not go out today because the rain is heavy.", context: "You decide to stay home.", directResult: "窓を閉めてください", commandNatural: "雨が強いから、窓を閉めてください。", wrongNode: "雨が強いので、窓を閉めろ。" }
];

const nodeReasonScenarios = [
	{ base: "頭が痛い", connector: "ので", result: "今日は休みます", natural: "頭が痛いので、今日は休みます。", meaning: "I will rest today because my head hurts.", context: "You politely explain your absence.", wrongForm: "頭が痛いなので、今日は休みます。", wrongUse: "頭が痛いので、休め。" },
	{ base: "この子はまだ五さい", connector: "なので", result: "バス代はかかりません", natural: "この子はまだ五さいなので、バス代はかかりません。", meaning: "The child is still five, so there is no bus fare.", context: "A parent explains at the bus counter.", wrongForm: "この子はまだ五さいので、バス代はかかりません。", wrongUse: "この子はまだ五さいなので、払え。" },
	{ base: "雨が降っていた", connector: "ので", result: "今日は散歩に行きませんでした", natural: "雨が降っていたので、今日は散歩に行きませんでした。", meaning: "I did not go for a walk today because it was raining.", context: "You explain yesterday's plan.", wrongForm: "雨が降っていたなので、今日は散歩に行きませんでした。", wrongUse: "雨が降っていたので、散歩に行け。" },
	{ base: "会議があります", connector: "ので", result: "少し遅れます", natural: "会議がありますので、少し遅れます。", meaning: "I will be a little late because I have a meeting.", context: "You send a polite message to a teacher.", wrongForm: "会議がありますなので、少し遅れます。", wrongUse: "会議がありますので、待て。" },
	{ base: "ここは静か", connector: "なので", result: "勉強しやすいです", natural: "ここは静かなので、勉強しやすいです。", meaning: "This place is quiet, so it is easy to study.", context: "You explain why you like the library.", wrongForm: "ここは静かので、勉強しやすいです。", wrongUse: "ここは静かなので、勉強しろ。" },
	{ base: "明日は試験", connector: "なので", result: "早く寝ます", natural: "明日は試験なので、早く寝ます。", meaning: "I will sleep early because tomorrow is an exam.", context: "You politely explain your plan.", wrongForm: "明日は試験ので、早く寝ます。", wrongUse: "明日は試験なので、早く寝ろ。" },
	{ base: "パソコンが故障した", connector: "ので", result: "メールを送れませんでした", natural: "パソコンが故障したので、メールを送れませんでした。", meaning: "I could not send the email because my computer broke.", context: "You explain a problem at work.", wrongForm: "パソコンが故障したなので、メールを送れませんでした。", wrongUse: "パソコンが故障したので、メールを送れ。" },
	{ base: "駅から遠い", connector: "ので", result: "タクシーで行きましょう", natural: "駅から遠いので、タクシーで行きましょう。", meaning: "Since it is far from the station, let's go by taxi.", context: "You make a polite suggestion.", wrongForm: "駅から遠いなので、タクシーで行きましょう。", wrongUse: "駅から遠いので、歩け。" }
];

const teCauseScenarios = [
	{ form: "仕事がたくさんあって", base: "仕事がたくさんある", result: "たいへんでした", natural: "仕事がたくさんあって、たいへんでした。", meaning: "It was hard because there was a lot of work.", context: "You describe why yesterday was hard.", category: "state + emotion", wrongForm: "仕事がたくさんあるで、たいへんでした。", wrongVolition: "仕事がたくさんあって、早く帰りましょう。" },
	{ form: "友だちがいなくて", base: "友だちがいない", result: "さびしいです", natural: "友だちがいなくて、さびしいです。", meaning: "I am lonely because my friends are not here.", context: "You describe how you feel.", category: "negative state + emotion", wrongForm: "友だちがいないで、さびしいです。", wrongVolition: "友だちがいなくて、遊びに行きましょう。" },
	{ form: "心配で", base: "心配だ", result: "よく眠れませんでした", natural: "心配で、よく眠れませんでした。", meaning: "I could not sleep well because I was worried.", context: "You describe last night.", category: "na-adjective + impossibility", wrongForm: "心配くて、よく眠れませんでした。", wrongVolition: "心配で、電話しましょう。" },
	{ form: "教えてくれて", base: "教えてくれる", result: "ありがとう", natural: "教えてくれて、ありがとう。", meaning: "Thank you for teaching me.", context: "You thank someone for helping.", category: "thanks", wrongForm: "教えてくれるで、ありがとう。", wrongVolition: "教えてくれて、勉強しましょう。" },
	{ form: "遅れて", base: "遅れる", result: "すみませんでした", natural: "遅れて、すみませんでした。", meaning: "I am sorry for being late.", context: "You apologize after arriving late.", category: "apology", wrongForm: "遅れるで、すみませんでした。", wrongVolition: "遅れて、急ぎましょう。" },
	{ form: "寒くて", base: "寒い", result: "外に出たくありません", natural: "寒くて、外に出たくありません。", meaning: "I do not want to go outside because it is cold.", context: "You explain why you want to stay in.", category: "i-adjective + feeling", wrongForm: "寒いで、外に出たくありません。", wrongVolition: "寒くて、窓を閉めましょう。" },
	{ form: "部屋が静かで", base: "部屋が静かだ", result: "よく勉強できます", natural: "部屋が静かで、よく勉強できます。", meaning: "I can study well because the room is quiet.", context: "You describe a good study place.", category: "na-adjective + possibility", wrongForm: "部屋が静かくて、よく勉強できます。", wrongVolition: "部屋が静かで、勉強してください。" },
	{ form: "お金がなくて", base: "お金がない", result: "買えませんでした", natural: "お金がなくて、買えませんでした。", meaning: "I could not buy it because I had no money.", context: "You explain why you did not buy something.", category: "negative state + impossibility", wrongForm: "お金がないで、買えませんでした。", wrongVolition: "お金がなくて、買いましょう。" },
	{ form: "漢字が多くて", base: "漢字が多い", result: "読めませんでした", natural: "漢字が多くて、読めませんでした。", meaning: "I could not read it because there were many kanji.", context: "You explain a reading problem.", category: "i-adjective + impossibility", wrongForm: "漢字が多いで、読めませんでした。", wrongVolition: "漢字が多くて、読んでください。" },
	{ form: "プレゼントをもらって", base: "プレゼントをもらう", result: "うれしかったです", natural: "プレゼントをもらって、うれしかったです。", meaning: "I was happy because I received a present.", context: "You describe why you felt happy.", category: "event + emotion", wrongForm: "プレゼントをもらうで、うれしかったです。", wrongVolition: "プレゼントをもらって、買いに行きましょう。" },
	{ form: "電車が止まって", base: "電車が止まる", result: "学校に行けませんでした", natural: "電車が止まって、学校に行けませんでした。", meaning: "I could not go to school because the train stopped.", context: "You explain why you missed school.", category: "event + impossibility", wrongForm: "電車が止まるで、学校に行けませんでした。", wrongVolition: "電車が止まって、学校に行きましょう。" },
	{ form: "赤ちゃんが泣いて", base: "赤ちゃんが泣く", result: "寝られませんでした", natural: "赤ちゃんが泣いて、寝られませんでした。", meaning: "I could not sleep because the baby cried.", context: "You explain why you are tired.", category: "event + perception/problem", wrongForm: "赤ちゃんが泣くで、寝られませんでした。", wrongVolition: "赤ちゃんが泣いて、寝ましょう。" }
];

const reasonQuestionTemplates = {
	kara: [
		(item) => makeChoiceQuestion({ kind: "〜から", prompt: `Context: ${item.context}`, subprompt: item.meaning, band: "Choose the direct reason sentence.", answer: item.natural, options: [item.natural, item.karaDesu, `${item.cause}まで、${item.result}。`, `${item.cause}ながら、${item.result}。`], explanation: "〜から gives a direct reason or cause before the result." }),
		(item) => makeTextQuestion({ kind: "〜から", prompt: `${item.cause}＿＿、${item.result}。`, subprompt: item.meaning, band: "Type から.", answer: "から", accepted: ["から"], placeholder: "から", explanation: `Use から after the reason: ${item.natural}` }),
		(item) => makeChoiceQuestion({ kind: "〜からです", prompt: `どうしてですか。`, subprompt: item.meaning, band: "Choose the answer that explains the reason.", answer: item.karaDesu, options: [item.karaDesu, item.natural, `${item.result}。${item.plainCause}のでです。`, `${item.plainCause}ままです。`], explanation: "〜からです is often used after the result when answering why." }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: item.natural, subprompt: "Choose the meaning.", band: "Read the reason sentence.", answer: item.meaning, options: [item.meaning, "The result happened before the reason.", "The speaker is comparing two things.", "The state stayed unchanged."], explanation: "The clause before から gives the reason for the clause after it." }),
		(item) => makeChoiceQuestion({ kind: "nuance · から", prompt: item.commandNatural, subprompt: "What does から feel like here?", band: "Read the direct reason.", answer: "A direct or emphatic reason.", options: ["A direct or emphatic reason.", "A softer written explanation.", "A past experience.", "A simultaneous side action."], explanation: "から can sound direct and works naturally before requests, suggestions, or commands." }),
		(item) => makeChoiceQuestion({ kind: "pitfall · から/ので", prompt: `Which sentence is better before a direct request or command?`, subprompt: item.context, band: "Choose the more direct reason marker.", answer: item.commandNatural, options: [item.commandNatural, item.wrongNode, `${item.plainCause}からです、${item.directResult}。`, `${item.plainCause}まま、${item.directResult}。`], explanation: "ので is softer and is not normally used before blunt commands. から handles direct requests more easily." })
	],
	node: [
		(item) => makeChoiceQuestion({ kind: "〜ので", prompt: `Context: ${item.context}`, subprompt: item.meaning, band: "Choose the polite reason sentence.", answer: item.natural, options: [item.natural, item.wrongForm, item.wrongUse, `${item.base}からです。`], explanation: "ので gives a softer or more polite reason than から." }),
		(item) => makeTextQuestion({ kind: "〜ので", prompt: `${item.base}＿＿、${item.result}。`, subprompt: item.meaning, band: `Type ${item.connector}.`, answer: item.connector, accepted: [item.connector], placeholder: item.connector, explanation: item.connector === "なので" ? "Nouns and na-adjectives take な before ので." : "Verbs and i-adjectives attach directly to ので." }),
		(item) => makeChoiceQuestion({ kind: "form before ので", prompt: `${item.base} + ので`, subprompt: "Choose the natural connection.", band: "Watch noun/na-adjective + な.", answer: `${item.base}${item.connector}`, options: [`${item.base}${item.connector}`, `${item.base}から`, `${item.base}で`, `${item.base}まま`], explanation: item.connector === "なので" ? "Use な before ので after nouns and na-adjectives." : "Plain verbs and i-adjectives can attach directly to ので." }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: item.natural, subprompt: "Choose the meaning.", band: "Read the polite reason sentence.", answer: item.meaning, options: [item.meaning, "The speaker is inviting someone.", "The speaker is reporting hearsay.", "The speaker left the state unchanged."], explanation: "The clause before ので gives a reason in a softer explanatory tone." }),
		(item) => makeChoiceQuestion({ kind: "nuance · ので", prompt: item.natural, subprompt: "Why use ので here?", band: "Choose the nuance.", answer: "It sounds softer or more polite than から.", options: ["It sounds softer or more polite than から.", "It makes the sentence negative.", "It means the reason is unknown.", "It means the action is simultaneous."], explanation: "ので often feels more polite or objective than から." }),
		(item) => makeChoiceQuestion({ kind: "pitfall · ので", prompt: `Which sentence misuses ので with a blunt command?`, subprompt: "ので is not the normal choice before direct imperatives.", band: "Find the bad fit.", answer: item.wrongUse, options: [item.wrongUse, item.natural, item.wrongForm, `${item.base}${item.connector}、すみません。`], explanation: "Avoid using ので before blunt commands like 行け, 読め, or 待て." })
	],
	te: [
		(item) => makeChoiceQuestion({ kind: "〜て/〜くて/〜で", prompt: `Context: ${item.context}`, subprompt: item.meaning, band: "Choose the cause-result sentence.", answer: item.natural, options: [item.natural, item.wrongForm, item.wrongVolition, `${item.base}からです。`], explanation: "The te-like cause pattern often leads to emotions, perception, inability, apologies, or thanks." }),
		(item) => makeTextQuestion({ kind: "〜て/〜くて/〜で", prompt: `＿＿＿＿、${item.result}。`, subprompt: item.meaning, band: "Type the cause in te-like form.", answer: item.form, accepted: [item.form], placeholder: item.form, explanation: `Use the te-like cause form: ${item.natural}` }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: item.natural, subprompt: "Choose the meaning.", band: "Read the cause-result sentence.", answer: item.meaning, options: [item.meaning, "The speaker wants to do the action.", "The sentence is a comparison.", "The action is about to begin."], explanation: "The first phrase gives the cause for the feeling, problem, apology, or thanks." }),
		(item) => makeChoiceQuestion({ kind: "reason result type", prompt: item.natural, subprompt: "What kind of result follows the reason?", band: "Notice common て-cause endings.", answer: item.category, options: [item.category, "direct command", "comparison question", "past experience"], explanation: "Reason て/くて/で is common with feelings, perceptions, impossibility, apologies, and thanks." }),
		(item) => makeChoiceQuestion({ kind: "pitfall · て cause", prompt: `Which sentence has a natural result after the reason て/くて/で?`, subprompt: item.context, band: "Avoid volitional/request endings.", answer: item.natural, options: [item.natural, item.wrongVolition, item.wrongForm, `${item.form}、${item.result}ましょう。`], explanation: "This て-cause pattern usually does not lead directly into the speaker's intention, a request, or an invitation." }),
		(item) => makeChoiceQuestion({ kind: "form before cause", prompt: `${item.base} → ＿＿＿＿、${item.result}。`, subprompt: item.meaning, band: "Choose the cause form.", answer: item.form, options: [item.form, item.base, `${item.base}ので`, `${item.base}まま`], explanation: "Use verb/adjective/noun te-like forms: て, なくて, くて, or で." })
	]
};

function buildReasonPitfallQuestions() {
	return [
		...karaReasonScenarios.flatMap((item) => [
			makeChoiceQuestion({ kind: "pitfall · からです", prompt: `Which answer best explains “why”?`, subprompt: item.context, band: "Use からです after the result.", answer: item.karaDesu, options: [item.karaDesu, `${item.plainCause}のでです。`, `${item.result}からです。`, `${item.plainCause}ところです。`], explanation: "When answering why, give the reason before からです." }),
			makeChoiceQuestion({ kind: "nuance · direct reason", prompt: item.commandNatural, subprompt: "Why does から work here?", band: "Read the direct request.", answer: "It can naturally support direct requests or suggestions.", options: ["It can naturally support direct requests or suggestions.", "It is only used in written apologies.", "It requires noun + な.", "It marks a simultaneous action."], explanation: "から is the flexible, direct reason marker." })
		]),
		...nodeReasonScenarios.flatMap((item) => [
			makeChoiceQuestion({ kind: "pitfall · な before ので", prompt: `Which connection is correct?`, subprompt: item.meaning, band: "Check whether な is needed.", answer: `${item.base}${item.connector}`, options: [`${item.base}${item.connector}`, item.wrongForm.replace(`、${item.result}。`, ""), `${item.base}て`, `${item.base}ながら`], explanation: item.connector === "なので" ? "Nouns and na-adjectives need な before ので." : "Verbs and i-adjectives do not add な before ので." }),
			makeChoiceQuestion({ kind: "pitfall · ので command", prompt: `Which sentence should you avoid?`, subprompt: "A blunt command after ので sounds unnatural.", band: "Find the bad fit.", answer: item.wrongUse, options: [item.wrongUse, item.natural, `${item.base}${item.connector}、すみません。`, `${item.base}${item.connector}、困っています。`], explanation: "Use から more readily before direct commands or strong requests." })
		]),
		...teCauseScenarios.flatMap((item) => [
			makeChoiceQuestion({ kind: "pitfall · て result", prompt: `Which result naturally follows reason て/くて/で?`, subprompt: item.meaning, band: "Choose emotion, impossibility, thanks, or apology.", answer: item.natural, options: [item.natural, item.wrongVolition, `${item.form}、${item.result}ください。`, `${item.form}、${item.result}ましょう。`], explanation: "Reason て/くて/で is especially common before non-volitional results like emotions and inability." })
		])
	];
}

const movementPurposeScenarios = [
	{ purpose: "散歩", movement: "行きました", natural: "父は公園へ散歩に行きました。", meaning: "My father went to the park for a walk.", context: "父は公園へ行きました。目的は散歩です。", wrongTame: "父は公園へ散歩のために行きました。", wrongYouni: "父は公園へ散歩ように行きました。", wrongForm: "父は公園へ散歩を行きました。", base: "noun purpose", motion: "行きました" },
	{ purpose: "取り", movement: "帰ります", natural: "うちにさいふを取りに帰ります。", meaning: "I will go home to get my wallet.", context: "うちにさいふを忘れました。", wrongTame: "うちにさいふを取るために帰ります。", wrongYouni: "うちにさいふを取るように帰ります。", wrongForm: "うちにさいふを取ってに帰ります。", base: "verb stem purpose", motion: "帰ります" },
	{ purpose: "迎え", movement: "来ます", natural: "友だちがうちに迎えに来ます。", meaning: "My friend will come to my house to pick me up.", context: "明日、友だちは私を迎えます。", wrongTame: "友だちがうちに迎えるために来ます。", wrongYouni: "友だちがうちに迎えるように来ます。", wrongForm: "友だちがうちに迎えてに来ます。", base: "verb stem purpose", motion: "来ます" },
	{ purpose: "本を借り", movement: "行きます", natural: "図書館へ本を借りに行きます。", meaning: "I will go to the library to borrow books.", context: "図書館へ行きます。目的は本を借りることです。", wrongTame: "図書館へ本を借りるために行きます。", wrongYouni: "図書館へ本を借りるように行きます。", wrongForm: "図書館へ本を借りてに行きます。", base: "verb stem purpose", motion: "行きます" },
	{ purpose: "お弁当を買い", movement: "行きます", natural: "コンビニへお弁当を買いに行きます。", meaning: "I will go to the convenience store to buy lunch.", context: "昼ご飯がありません。", wrongTame: "コンビニへお弁当を買うために行きます。", wrongYouni: "コンビニへお弁当を買うように行きます。", wrongForm: "コンビニへお弁当を買ってに行きます。", base: "verb stem purpose", motion: "行きます" },
	{ purpose: "母を送り", movement: "行きます", natural: "駅まで母を送りに行きます。", meaning: "I will go to the station to see my mother off.", context: "母は駅から電車に乗ります。", wrongTame: "駅まで母を送るために行きます。", wrongYouni: "駅まで母を送るように行きます。", wrongForm: "駅まで母を送ってに行きます。", base: "verb stem purpose", motion: "行きます" },
	{ purpose: "友だちを迎え", movement: "行きます", natural: "空港へ友だちを迎えに行きます。", meaning: "I will go to the airport to meet my friend.", context: "友だちが飛行機で来ます。", wrongTame: "空港へ友だちを迎えるために行きます。", wrongYouni: "空港へ友だちを迎えるように行きます。", wrongForm: "空港へ友だちを迎えてに行きます。", base: "verb stem purpose", motion: "行きます" },
	{ purpose: "忘れ物を取り", movement: "戻ります", natural: "家へ忘れ物を取りに戻ります。", meaning: "I will return home to get something I forgot.", context: "学校へ行く途中で忘れ物に気づきました。", wrongTame: "家へ忘れ物を取るために戻ります。", wrongYouni: "家へ忘れ物を取るように戻ります。", wrongForm: "家へ忘れ物を取ってに戻ります。", base: "verb stem purpose", motion: "戻ります" },
	{ purpose: "日本語を勉強し", movement: "来ました", natural: "日本へ日本語を勉強しに来ました。", meaning: "I came to Japan to study Japanese.", context: "留学生が来日した目的を話しています。", wrongTame: "日本へ日本語を勉強するために来ました。", wrongYouni: "日本へ日本語を勉強するように来ました。", wrongForm: "日本へ日本語を勉強してに来ました。", base: "verb stem purpose", motion: "来ました" },
	{ purpose: "昼ご飯を食べ", movement: "行きます", natural: "近くの店へ昼ご飯を食べに行きます。", meaning: "I will go to a nearby restaurant to eat lunch.", context: "おなかがすきました。", wrongTame: "近くの店へ昼ご飯を食べるために行きます。", wrongYouni: "近くの店へ昼ご飯を食べるように行きます。", wrongForm: "近くの店へ昼ご飯を食べてに行きます。", base: "verb stem purpose", motion: "行きます" }
];

const tamePurposeScenarios = [
	{ purpose: "けっこんする", connector: "ために", action: "いろいろ準備をしています", natural: "けっこんするために、いろいろ準備をしています。", modifier: "これはけっこんするためのチェックリストです。", noun: "チェックリスト", meaning: "I am making many preparations in order to get married.", context: "目的をはっきり説明します。", wrongNi: "けっこんしに、いろいろ準備をしています。", wrongYouni: "けっこんするように、いろいろ準備をしています。", wrongNo: "けっこんするためにチェックリストです。" },
	{ purpose: "日本語を勉強する", connector: "ために", action: "日本に留学します", natural: "日本語を勉強するために、日本に留学します。", modifier: "これは日本語を勉強するためのアプリです。", noun: "アプリ", meaning: "I will study abroad in Japan in order to study Japanese.", context: "留学の目的を説明します。", wrongNi: "日本語を勉強しに、日本に留学します。", wrongYouni: "日本語を勉強するように、日本に留学します。", wrongNo: "日本語を勉強するためにアプリです。" },
	{ purpose: "会議に出る", connector: "ために", action: "東京へ行きました", natural: "会議に出るために、東京へ行きました。", modifier: "これは会議に出るための資料です。", noun: "資料", meaning: "I went to Tokyo in order to attend a meeting.", context: "東京へ行った目的を説明します。", wrongNi: "会議に出に、東京へ行きました。", wrongYouni: "会議に出るように、東京へ行きました。", wrongNo: "会議に出るために資料です。" },
	{ purpose: "漢字を練習する", connector: "ために", action: "この本を使っています", natural: "漢字を練習するために、この本を使っています。", modifier: "これは漢字を練習するための本です。", noun: "本", meaning: "I use this book in order to practice kanji.", context: "本の使い道を説明します。", wrongNi: "漢字を練習しに、この本を使っています。", wrongYouni: "漢字を練習できるように、この本を使っています。", wrongNo: "漢字を練習するために本です。" },
	{ purpose: "新しい仕事を探す", connector: "ために", action: "毎日新聞を読んでいます", natural: "新しい仕事を探すために、毎日新聞を読んでいます。", modifier: "これは新しい仕事を探すためのサイトです。", noun: "サイト", meaning: "I read the newspaper every day in order to find a new job.", context: "新聞を読む目的を説明します。", wrongNi: "新しい仕事を探しに、毎日新聞を読んでいます。", wrongYouni: "新しい仕事を探すように、毎日新聞を読んでいます。", wrongNo: "新しい仕事を探すためにサイトです。" },
	{ purpose: "健康", connector: "のために", action: "毎朝走っています", natural: "健康のために、毎朝走っています。", modifier: "これは健康のためのアプリです。", noun: "アプリ", meaning: "I run every morning for my health.", context: "毎朝走る目的を説明します。", wrongNi: "健康に、毎朝走っています。", wrongYouni: "健康になるように、毎朝走っています。", wrongNo: "健康のためにアプリです。" },
	{ purpose: "試験", connector: "のために", action: "単語を覚えています", natural: "試験のために、単語を覚えています。", modifier: "これは試験のためのノートです。", noun: "ノート", meaning: "I am memorizing vocabulary for the exam.", context: "単語を覚える目的を説明します。", wrongNi: "試験に、単語を覚えています。", wrongYouni: "試験できるように、単語を覚えています。", wrongNo: "試験のためにノートです。" },
	{ purpose: "家を買う", connector: "ために", action: "お金をためています", natural: "家を買うために、お金をためています。", modifier: "これは家を買うための計画です。", noun: "計画", meaning: "I am saving money in order to buy a house.", context: "お金をためる目的を説明します。", wrongNi: "家を買いに、お金をためています。", wrongYouni: "家を買えるように、お金をためています。", wrongNo: "家を買うために計画です。" },
	{ purpose: "会社を大きくする", connector: "ために", action: "新しい人を雇いました", natural: "会社を大きくするために、新しい人を雇いました。", modifier: "これは会社を大きくするための計画です。", noun: "計画", meaning: "We hired new people in order to grow the company.", context: "人を雇った目的を説明します。", wrongNi: "会社を大きくしに、新しい人を雇いました。", wrongYouni: "会社を大きくするように、新しい人を雇いました。", wrongNo: "会社を大きくするために計画です。" },
	{ purpose: "旅行", connector: "のために", action: "新しいかばんを買いました", natural: "旅行のために、新しいかばんを買いました。", modifier: "これは旅行のためのかばんです。", noun: "かばん", meaning: "I bought a new bag for the trip.", context: "かばんを買った目的を説明します。", wrongNi: "旅行に、新しいかばんを買いました。", wrongYouni: "旅行するように、新しいかばんを買いました。", wrongNo: "旅行のためにかばんです。" }
];

const youniPurposeScenarios = [
	{ goal: "話がよく聞こえる", action: "前のほうに座りましょう", natural: "話がよく聞こえるように、前のほうに座りましょう。", meaning: "Let's sit toward the front so we can hear the talk well.", context: "後ろの席では先生の声が聞こえません。", wrongTame: "話がよく聞こえるために、前のほうに座りましょう。", wrongNi: "話がよく聞こえに、前のほうに座りましょう。", resultType: "potential or perception" },
	{ goal: "いい風が入る", action: "窓を大きく開けました", natural: "いい風が入るように、窓を大きく開けました。", meaning: "I opened the window wide so that a nice breeze would come in.", context: "部屋が暑いです。", wrongTame: "いい風が入るために、窓を大きく開けました。", wrongNi: "いい風が入りに、窓を大きく開けました。", resultType: "non-volitional outcome" },
	{ goal: "学校に遅れない", action: "早く家を出ました", natural: "学校に遅れないように、早く家を出ました。", meaning: "I left home early so that I would not be late for school.", context: "雪の日です。", wrongTame: "学校に遅れないために、早く家を出ました。", wrongNi: "学校に遅れないに、早く家を出ました。", resultType: "negative prevention" },
	{ goal: "けがをしない", action: "気をつけてね", natural: "けがをしないように、気をつけてね。", meaning: "Be careful so that you do not get hurt.", context: "子どもが走っています。", wrongTame: "けがをしないために、気をつけてね。", wrongNi: "けがをしないに、気をつけてね。", resultType: "negative prevention" },
	{ goal: "子どもが寝られる", action: "部屋を暗くしました", natural: "子どもが寝られるように、部屋を暗くしました。", meaning: "I made the room dark so that the child could sleep.", context: "子どもは明るい部屋では寝られません。", wrongTame: "子どもが寝るために、部屋を暗くしました。", wrongNi: "子どもが寝に、部屋を暗くしました。", resultType: "third-person possibility" },
	{ goal: "みんなに見える", action: "字を大きく書きました", natural: "みんなに見えるように、字を大きく書きました。", meaning: "I wrote the letters large so everyone could see them.", context: "後ろの人にも見せたいです。", wrongTame: "みんなに見るために、字を大きく書きました。", wrongNi: "みんなに見えに、字を大きく書きました。", resultType: "potential or perception" },
	{ goal: "忘れない", action: "メモをしました", natural: "忘れないように、メモをしました。", meaning: "I took notes so that I would not forget.", context: "大切な予定があります。", wrongTame: "忘れないために、メモをしました。", wrongNi: "忘れないに、メモをしました。", resultType: "negative prevention" },
	{ goal: "試験に合格できる", action: "毎日勉強しています", natural: "試験に合格できるように、毎日勉強しています。", meaning: "I study every day so that I can pass the exam.", context: "合格する可能性を高くしたいです。", wrongTame: "試験に合格するために、毎日勉強しています。", wrongNi: "試験に合格できに、毎日勉強しています。", resultType: "potential outcome" },
	{ goal: "赤ちゃんが起きない", action: "静かに話しました", natural: "赤ちゃんが起きないように、静かに話しました。", meaning: "I spoke quietly so that the baby would not wake up.", context: "赤ちゃんが寝ています。", wrongTame: "赤ちゃんが起きないために、静かに話しました。", wrongNi: "赤ちゃんが起きないに、静かに話しました。", resultType: "third-person negative outcome" },
	{ goal: "道に迷わない", action: "地図を見ました", natural: "道に迷わないように、地図を見ました。", meaning: "I looked at a map so that I would not get lost.", context: "初めて行く場所です。", wrongTame: "道に迷わないために、地図を見ました。", wrongNi: "道に迷わないに、地図を見ました。", resultType: "negative prevention" },
	{ goal: "かぜをひかない", action: "コートを着ました", natural: "かぜをひかないように、コートを着ました。", meaning: "I wore a coat so that I would not catch a cold.", context: "外はとても寒いです。", wrongTame: "かぜをひかないために、コートを着ました。", wrongNi: "かぜをひかないに、コートを着ました。", resultType: "negative prevention" },
	{ goal: "日本語が上手になる", action: "毎日練習します", natural: "日本語が上手になるように、毎日練習します。", meaning: "I practice every day so that my Japanese will improve.", context: "自然な変化を目標にしています。", wrongTame: "日本語が上手になるために、毎日練習します。", wrongNi: "日本語が上手になりに、毎日練習します。", resultType: "desired change" }
];

function tameReasonDistractor(item) {
	return `${item.purpose}${item.connector === "のために" ? "なので" : "ので"}、${item.action}。`;
}

const purposeQuestionTemplates = {
	movement: [
		(item) => makeChoiceQuestion({ kind: "〜に", prompt: `Context: ${item.context}`, subprompt: item.meaning, band: "Choose the movement-purpose sentence.", answer: item.natural, options: [item.natural, item.wrongTame, item.wrongYouni, item.wrongForm], explanation: "For everyday movement purpose, use noun or verb stem + に before 行く, 来る, 帰る, or 戻る." }),
		(item) => makeTextQuestion({ kind: "〜に", prompt: `${item.purpose}＿＿${item.movement}。`, subprompt: item.meaning, band: "Type に.", answer: "に", accepted: ["に"], placeholder: "に", explanation: `Use に after the movement purpose: ${item.natural}` }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: item.natural, subprompt: "Choose the meaning.", band: "Read the movement-purpose sentence.", answer: item.meaning, options: [item.meaning, "The speaker hopes an outcome will happen.", "The sentence gives a reason for an apology.", "The state remains unchanged."], explanation: "The phrase before に gives the purpose of movement." }),
		(item) => makeChoiceQuestion({ kind: "motion verb", prompt: item.natural, subprompt: "Which part makes 〜に natural here?", band: "Find the movement verb.", answer: item.motion, options: [item.motion, "ために", "ように", "からです"], explanation: "This purpose に usually appears with limited movement verbs such as 行く, 来る, 帰る, and 戻る." }),
		(item) => makeChoiceQuestion({ kind: "form before に", prompt: `${item.purpose}＿＿${item.movement}。`, subprompt: "Build the movement-purpose form.", band: "Choose the particle.", answer: "に", options: ["に", "ために", "ように", "ので"], explanation: "Use に after a noun or ます-stem purpose before a movement verb." }),
		(item) => makeChoiceQuestion({ kind: "pitfall · movement purpose", prompt: `Which sentence is the most natural light/everyday movement purpose?`, subprompt: item.context, band: "Choose noun/stem + に + motion verb.", answer: item.natural, options: [item.natural, item.wrongTame, item.wrongYouni, `${item.purpose}から、${item.movement}。`], explanation: "ために can be grammatical, but N4 movement-purpose に is the natural lightweight pattern for going/coming/returning to do something." })
	],
	tame: [
		(item) => makeChoiceQuestion({ kind: "〜ために", prompt: `Context: ${item.context}`, subprompt: item.meaning, band: "Choose the intentional-purpose sentence.", answer: item.natural, options: [item.natural, item.wrongNi, item.wrongYouni, item.wrongNo], explanation: "ために explains the purpose of an intentional action. The subject is normally the same before and after." }),
		(item) => makeTextQuestion({ kind: "〜ために", prompt: `${item.purpose}＿＿、${item.action}。`, subprompt: item.meaning, band: `Type ${item.connector}.`, answer: item.connector, accepted: [item.connector], placeholder: item.connector, explanation: item.connector === "のために" ? "Use noun + のために for purpose." : "Use dictionary-form verb + ために for purpose." }),
		(item) => makeChoiceQuestion({ kind: "〜ための", prompt: `Which sentence modifies a noun with purpose?`, subprompt: `${item.noun} for this purpose.`, band: "Choose ための + noun.", answer: item.modifier, options: [item.modifier, item.wrongNo, item.natural, item.wrongYouni], explanation: "Use ための before a noun: 勉強するための本, 健康のためのアプリ." }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: item.natural, subprompt: "Choose the meaning.", band: "Read the purpose sentence.", answer: item.meaning, options: [item.meaning, "The speaker is describing a natural ability.", "The speaker is going somewhere for a light errand.", "The speaker is apologizing for a cause."], explanation: "ために states the purpose or goal behind the action." }),
		(item) => makeChoiceQuestion({ kind: "form before ため", prompt: `${item.purpose} + ために`, subprompt: "Choose the natural connection.", band: "Watch noun + の.", answer: `${item.purpose}${item.connector}`, options: [`${item.purpose}${item.connector}`, `${item.purpose}に`, `${item.purpose}ように`, `${item.purpose}から`], explanation: item.connector === "のために" ? "Nouns need の before ために." : "Verbs use dictionary form before ために." }),
		(item) => makeChoiceQuestion({ kind: "pitfall · ために", prompt: `Which sentence uses ために for an intentional purpose?`, subprompt: item.context, band: "Choose same-subject purpose.", answer: item.natural, options: [item.natural, item.wrongYouni, item.wrongNi, tameReasonDistractor(item)], explanation: "Use ために when the action is done intentionally for a purpose." })
	],
	youni: [
		(item) => makeChoiceQuestion({ kind: "〜ように", prompt: `Context: ${item.context}`, subprompt: item.meaning, band: "Choose the outcome/wish sentence.", answer: item.natural, options: [item.natural, item.wrongTame, item.wrongNi, `${item.goal}から、${item.action}。`], explanation: "ように marks a desired outcome, often with potential, non-volitional, negative, or third-person clauses." }),
		(item) => makeTextQuestion({ kind: "〜ように", prompt: `${item.goal}＿＿、${item.action}。`, subprompt: item.meaning, band: "Type ように.", answer: "ように", accepted: ["ように"], placeholder: "ように", explanation: `Use ように for the hoped-for outcome: ${item.natural}` }),
		(item) => makeChoiceQuestion({ kind: "meaning", prompt: item.natural, subprompt: "Choose the meaning.", band: "Read the outcome-purpose sentence.", answer: item.meaning, options: [item.meaning, "The speaker went somewhere to do a light errand.", "The sentence modifies a noun with ための.", "The first phrase gives a direct reason."], explanation: "The clause before ように is the outcome the speaker wants to make possible." }),
		(item) => makeChoiceQuestion({ kind: "ように result type", prompt: item.natural, subprompt: "Why is ように natural here?", band: "Identify the kind of outcome.", answer: item.resultType, options: [item.resultType, "same-subject volitional action", "comparison base", "past experience"], explanation: "ように is common when the desired result is potential, non-volitional, negative, or about someone else." }),
		(item) => makeChoiceQuestion({ kind: "form before ように", prompt: `${item.goal}＿＿、${item.action}。`, subprompt: "Choose the correct connector.", band: "Build ように.", answer: "ように", options: ["ように", "ために", "に", "ほど"], explanation: "Use plain non-past or negative form before ように." }),
		(item) => makeChoiceQuestion({ kind: "pitfall · ように", prompt: `Which sentence uses ように for a desired outcome?`, subprompt: item.context, band: "Do not force ために onto potential/non-volitional outcomes.", answer: item.natural, options: [item.natural, item.wrongTame, item.wrongNi, `${item.goal}まま、${item.action}。`], explanation: "Use ように when the goal is for a state, ability, perception, negative prevention, or third-person outcome to happen." })
	]
};

function buildPurposePitfallQuestions() {
	return [
		...movementPurposeScenarios.flatMap((item) => [
			makeChoiceQuestion({ kind: "pitfall · に vs ために", prompt: `Which sentence best fits a light movement purpose?`, subprompt: item.meaning, band: "Choose 〜に + movement verb.", answer: item.natural, options: [item.natural, item.wrongTame, item.wrongYouni, item.wrongForm], explanation: "Movement-purpose に is compact and natural with errands like buying, borrowing, meeting, returning, and walking." }),
			makeChoiceQuestion({ kind: "nuance · movement verb", prompt: item.natural, subprompt: "What kind of verb usually follows this に?", band: "Recognize the motion pattern.", answer: "A movement verb such as 行く, 来る, 帰る, or 戻る.", options: ["A movement verb such as 行く, 来る, 帰る, or 戻る.", "A feeling adjective such as うれしい.", "A comparison adjective such as 高い.", "A past-experience verb such as あります."], explanation: "This に expresses the purpose of movement." })
		]),
		...tamePurposeScenarios.flatMap((item) => [
			makeChoiceQuestion({ kind: "pitfall · ための", prompt: `Which sentence correctly says “${item.noun} for this purpose”?`, subprompt: item.context, band: "Choose ための before a noun.", answer: item.modifier, options: [item.modifier, item.wrongNo, item.natural, item.wrongNi], explanation: "Use ための when the purpose phrase modifies a noun." }),
			makeChoiceQuestion({ kind: "pitfall · same subject", prompt: item.natural, subprompt: "What is important about ために here?", band: "Read the intentional-purpose relation.", answer: "The same person or group intentionally does the action for that purpose.", options: ["The same person or group intentionally does the action for that purpose.", "The result is an uncontrollable natural change.", "The action is only a light errand with a motion verb.", "The sentence means because."], explanation: "ために usually links an intentional purpose to an intentional action by the same subject." })
		]),
		...youniPurposeScenarios.flatMap((item) => [
			makeChoiceQuestion({ kind: "pitfall · ように vs ために", prompt: `Which sentence is best for a desired outcome rather than a direct action purpose?`, subprompt: item.meaning, band: "Choose ように.", answer: item.natural, options: [item.natural, item.wrongTame, item.wrongNi, `${item.goal}ための${item.action}。`], explanation: "ように fits outcomes like can hear, does not get hurt, someone else can sleep, or a state changes." }),
			makeChoiceQuestion({ kind: "nuance · ように", prompt: item.natural, subprompt: "What does ように point to?", band: "Read the intended outcome.", answer: "The hoped-for state or result.", options: ["The hoped-for state or result.", "The place someone moves toward.", "The reason for an apology.", "The stronger item in a comparison."], explanation: "ように marks the state/result the speaker is trying to make happen." })
		])
	];
}

function buildPermissionPitfallQuestions() {
	return [
		...allowBanScenarios.flatMap((item) => [
			makeChoiceQuestion({ kind: "pitfall · permission", prompt: item.permit, subprompt: "What is the force of this sentence?", band: "Do not confuse permission with obligation.", answer: "Allowed / okay.", options: ["Allowed / okay.", "Forbidden.", "Required.", "No past experience."], explanation: "てもいいです gives permission or says the condition is acceptable." }),
			makeChoiceQuestion({ kind: "pitfall · prohibition", prompt: item.prohibit, subprompt: "What is the force of this sentence?", band: "Do not soften a ban into permission.", answer: "Forbidden / not allowed.", options: ["Forbidden / not allowed.", "Optional.", "Required.", "Already finished."], explanation: "てはいけません is a prohibition pattern." }),
			makeChoiceQuestion({ kind: "nuance · question", prompt: item.request, subprompt: "What is the speaker doing?", band: "Read the permission request.", answer: "Asking whether it is allowed.", options: ["Asking whether it is allowed.", "Saying they must do it.", "Saying they do not have to do it.", "Reporting a past experience."], explanation: "てもいいですか asks for permission." })
		]),
		...noNeedMustScenarios.flatMap((item) => [
			makeChoiceQuestion({ kind: "pitfall · no need", prompt: item.noNeed, subprompt: "What is the force of this sentence?", band: "Do not read it as prohibition.", answer: "Not necessary.", options: ["Not necessary.", "Forbidden.", "Required.", "Just finished."], explanation: "なくてもいいです means the negative choice is acceptable, not that the action is banned." }),
			makeChoiceQuestion({ kind: "pitfall · obligation", prompt: item.must, subprompt: "What is the force of this sentence?", band: "Read the double-negative meaning.", answer: "Required / must.", options: ["Required / must.", "Not necessary.", "Forbidden.", "Allowed either way."], explanation: "なければなりません means something must happen or must be true." }),
			makeChoiceQuestion({ kind: "nuance · optional vs allowed", prompt: `Which pair is closest in meaning?`, subprompt: item.noNeedEn, band: "Match the optional meaning.", answer: `${item.noNeed} = It is okay not to.`, options: [`${item.noNeed} = It is okay not to.`, `${item.noNeed} = It is forbidden.`, `${item.must} = It is optional.`, `${item.must} = It is not allowed.`], explanation: "なくてもいいです removes necessity; なければなりません creates necessity." })
		])
	];
}

function buildComparisonPitfallQuestions() {
	return comparisonScenarios.flatMap((item) => {
		const forms = comparisonSentences(item);
		const reverseForms = comparisonSentences({ ...item, lesser: item.greater, greater: item.lesser, lesserEn: item.greaterEn, greaterEn: item.lesserEn });
		return [
			makeChoiceQuestion({ kind: "nuance · より", prompt: forms.yori, subprompt: "Which item is the comparison base after より?", band: "Read the direction of comparison.", answer: item.lesser, options: [item.lesser, item.greater, item.adj, "どちら"], explanation: "The noun after より is the thing being compared against, not the stronger item." }),
			makeChoiceQuestion({ kind: "pitfall · ほど", prompt: `${item.lesser}は${item.greater}ほど＿＿＿＿。`, subprompt: "ほど needs a negative predicate in this comparison pattern.", band: "Choose the natural ending.", answer: `${item.neg}ありません`, options: [`${item.neg}ありません`, `${item.adj}です`, `${item.neg}あります`, `${item.adj}ありません`], explanation: "ほど in “not as ... as” sentences pairs with a negative ending." }),
			makeChoiceQuestion({ kind: "pitfall · のほう", prompt: `${item.greaterEn} is ${item.comparative} than ${item.lesserEn}.`, subprompt: "Which sentence keeps the stronger side before のほう?", band: "Avoid reversing the comparison.", answer: forms.hou, options: [forms.hou, reverseForms.hou, forms.hodo, `${item.greater}より${item.lesser}のほうが${item.adj}です。`], explanation: "The stronger item goes before のほうが." }),
			makeChoiceQuestion({ kind: "nuance · のほうを", prompt: forms.taiQuestion, subprompt: `You want to choose ${item.greaterEn}.`, band: "Choose the action-verb answer.", answer: forms.taiAnswer, options: [forms.taiAnswer, forms.hoshiiAnswer, `${item.greater}のほうが選びたいです。`, `${item.greater}ほど選びたいです。`], explanation: "With an action verb like 選びたい, the preferred thing can be marked with を." }),
			makeChoiceQuestion({ kind: "nuance · ほしい", prompt: forms.hoshiiQuestion, subprompt: `You want ${item.greaterEn}.`, band: "Choose the ほしい answer.", answer: forms.hoshiiAnswer, options: [forms.hoshiiAnswer, forms.taiAnswer, `${item.greater}のほうをほしいです。`, `${item.greater}よりほしいです。`], explanation: "ほしい describes the wanted thing with が, not を." })
		];
	});
}

function buildTimePitfallQuestions() {
	return [
		...nagaraScenarios.flatMap((item) => [
			makeChoiceQuestion({ kind: "pitfall · ながら", prompt: `＿＿＿＿ながら${item.main}。`, subprompt: `Fill in: while ${item.sideEn}.`, band: "Choose the form before ながら.", answer: item.stem, options: [item.stem, `${item.stem}ます`, `${item.stem}て`, `${item.stem}た`], explanation: "ながら attaches to the ます-stem, not the full ます form or て-form." }),
			makeChoiceQuestion({ kind: "pitfall · ながら", prompt: `Which sentence has the wrong ながら form?`, subprompt: `Target meaning: while ${item.sideEn}, ${item.mainEn}.`, band: "Find the form error.", answer: `${item.stem}ますながら${item.main}。`, options: [`${item.stem}ますながら${item.main}。`, item.natural, `${item.stem}ながら、${item.main}。`, `${item.stem}ながら${item.main}。`], explanation: "Do not put ます before ながら." }),
			makeChoiceQuestion({ kind: "nuance · ながら", prompt: item.natural, subprompt: "Which action is the main action?", band: "Do not overread the side action.", answer: item.main, options: [item.main, `${item.stem}ます`, "両方とも終わりました", "まだ始まりません"], explanation: "The main action is usually the clause after ながら." })
		]),
		...tokoroScenarios.flatMap((item) => [
			makeChoiceQuestion({ kind: "pitfall · ところ", prompt: `今から＿＿＿＿ところです。`, subprompt: `The action is about to start: ${item.actionEn}.`, band: "Choose the form before ところです.", answer: item.dict, options: [item.dict, item.teiru, item.ta, `${item.dict}た`], explanation: "Dictionary form + ところです means just before starting." }),
			makeChoiceQuestion({ kind: "pitfall · ところ", prompt: `今、＿＿＿＿ところです。`, subprompt: `The action is in progress: ${item.actionEn}.`, band: "Choose the form before ところです.", answer: item.teiru, options: [item.teiru, item.dict, item.ta, `${item.dict}まで`], explanation: "ている + ところです means the action is happening now." }),
			makeChoiceQuestion({ kind: "pitfall · ところ", prompt: `ちょうど＿＿＿＿ところです。`, subprompt: `The action just finished: ${item.actionEn}.`, band: "Choose the form before ところです.", answer: item.ta, options: [item.ta, item.teiru, item.dict, `${item.ta}までに`], explanation: "た-form + ところです means just after finishing." })
		]),
		...limitScenarios.flatMap((item) => [
			makeChoiceQuestion({ kind: "pitfall · まで", prompt: `${item.limit}＿＿${item.continuous}。`, subprompt: "The action continues until the endpoint.", band: "Choose まで or までに.", answer: "まで", options: ["まで", "までに", "ながら", "ところ"], explanation: "Use まで for a continuing action or state." }),
			makeChoiceQuestion({ kind: "pitfall · までに", prompt: `${item.limit}＿＿${item.instant}。`, subprompt: "The action must be completed by the deadline.", band: "Choose まで or までに.", answer: "までに", options: ["までに", "まで", "ながら", "ところ"], explanation: "Use までに for a deadline for a short action." }),
			makeChoiceQuestion({ kind: "nuance · まで/までに", prompt: `Which sentence is about a deadline, not duration?`, subprompt: item.byEn, band: "Find the deadline sentence.", answer: `${item.limit}までに${item.instant}。`, options: [`${item.limit}までに${item.instant}。`, `${item.limit}まで${item.continuous}。`, `${item.limit}まで${item.instant}。`, `${item.limit}ながら${item.instant}。`], explanation: "までに means “by” a time limit; まで means “until” for duration." })
		])
	];
}

function buildInvitationPitfallQuestions() {
	return [
		...invitationScenarios.flatMap((item) => [
			makeChoiceQuestion({ kind: "pitfall · ませんか", prompt: item.natural, subprompt: "What does this usually mean here?", band: "Do not read it as a simple negative.", answer: "A polite invitation.", options: ["A polite invitation.", "The speaker will not do it.", "The listener already did it.", "The speaker is offering to do it alone."], explanation: "ませんか is grammatically negative, but it often functions as a soft invitation." }),
			makeChoiceQuestion({ kind: "nuance · response", prompt: `A: ${item.natural} B: ＿＿＿＿`, subprompt: "Choose the response that accepts an invitation, not an offer of help.", band: "Match the dialogue role.", answer: item.accept, options: [item.accept, "はい、お願いします。", "大丈夫です。ありがとうございます。", `${item.stem}ませんでした。`], explanation: "Invitations are often accepted with いいですね or ましょう; お願いします fits offers of help more naturally." }),
			makeChoiceQuestion({ kind: "pitfall · ませんか/ましょうか", prompt: `Which one invites the listener to ${item.actionEn} together?`, subprompt: "Choose the invitation, not an offer.", band: "Separate the two questions.", answer: item.natural, options: [item.natural, `${item.stem}ましょうか。`, `${item.mashou}。`, `${item.stem}ません。`], explanation: "ませんか invites the listener; ましょうか often checks agreement or offers help." })
		]),
		...sharedSuggestionScenarios.flatMap((item) => [
			makeChoiceQuestion({ kind: "pitfall · ましょう", prompt: item.natural, subprompt: "Which nuance is strongest?", band: "Read the direct suggestion.", answer: "A direct “let's...” suggestion.", options: ["A direct “let's...” suggestion.", "A past experience.", "A refusal.", "A natural perception."], explanation: "ましょう is more direct than ましょうか." }),
			makeChoiceQuestion({ kind: "nuance · ましょうか", prompt: item.consent, subprompt: "What does か add?", band: "Read the softer suggestion.", answer: "It checks the listener's agreement.", options: ["It checks the listener's agreement.", "It makes the sentence past tense.", "It means the speaker cannot do it.", "It means the listener did it before."], explanation: "ましょうか can soften a shared suggestion." })
		]),
		...offerScenarios.flatMap((item) => [
			makeChoiceQuestion({ kind: "pitfall · offer", prompt: `A: ${item.context} B: ＿＿＿＿`, subprompt: `Offer to ${item.actionEn}.`, band: "Choose the offer, not the invitation.", answer: item.natural, options: [item.natural, `${item.stem}ませんか。`, `${item.stem}ましょう。`, `${item.stem}ませんでした。`], explanation: "For “Shall I do it for you?”, use ましょうか." }),
			makeChoiceQuestion({ kind: "nuance · response", prompt: `A: ${item.natural} B: ＿＿＿＿`, subprompt: "Choose the response that accepts help.", band: "Match offer and response.", answer: item.accept, options: [item.accept, "いいですね。しましょう。", `${item.stem}ませんか。`, "すみません、今日はちょっと..."], explanation: "Offers of help are naturally accepted with お願いします or ありがとうございます." })
		])
	];
}

function buildAbilityPitfallQuestions() {
	return [
		...potentialScenarios.flatMap((item) => [
			makeChoiceQuestion({ kind: "pitfall · potential が", prompt: `${item.subject}は${item.object}＿＿${item.potential}。`, subprompt: "Potential verbs often change the object marker.", band: "Choose the particle.", answer: "が", options: ["が", "を", "に", "で"], explanation: "With potential verbs, the object-like noun is often marked with が." }),
			makeChoiceQuestion({ kind: "pitfall · potential", prompt: `Which sentence means ability?`, subprompt: `Target: can ${item.actionEn}.`, band: "Choose the potential form.", answer: item.natural, options: [item.natural, `${item.subject}は${item.object}を${item.masu}。`, `${item.subject}は${item.object}を${item.masu}か。`, `${item.subject}は${item.object}を${item.masu}ところです。`], explanation: "The normal ます form describes doing the action; the potential form describes ability." })
		]),
		...dekiruScenarios.flatMap((item) => [
			makeChoiceQuestion({ kind: "pitfall · できます", prompt: `${item.place}${item.noun}＿＿できます。`, subprompt: "Noun + できます needs が.", band: "Choose the particle.", answer: "が", options: ["が", "を", "に", "まで"], explanation: "Use noun + ができます, not noun + をできます." }),
			makeChoiceQuestion({ kind: "pitfall · ことができます", prompt: `Which sentence correctly uses a verb before ことができます?`, subprompt: `Target: can ${item.actionEn}.`, band: "Choose the verb pattern.", answer: item.verbNatural, options: [item.verbNatural, `${item.place}${item.verbPlain}ができます。`, `${item.place}${item.verbPlain}をできます。`, `${item.place}${item.verbPlain}できます。`], explanation: "Use dictionary-form verb + ことができます." })
		]),
		...perceptionScenarios.flatMap((item) => [
			makeChoiceQuestion({ kind: "pitfall · perception", prompt: `Which sentence is natural perception, not intentional ability/permission?`, subprompt: `${item.target} naturally reaches the eyes or ears.`, band: "Choose 見えます/聞こえます.", answer: item.natural, options: [item.natural, `${item.source}${item.target}が${item.potential}。`, `${item.source}${item.target}を${item.potential}。`, `${item.source}${item.target}ができます。`], explanation: "見えます/聞こえます describe what naturally comes into view or earshot." }),
			makeChoiceQuestion({ kind: "pitfall · perception が", prompt: `${item.target}＿＿${item.sense}。`, subprompt: "Natural perception uses が for the thing perceived.", band: "Choose the particle.", answer: "が", options: ["が", "を", "に", "で"], explanation: "Say 海が見えます and 音が聞こえます." })
		])
	];
}

function buildExperiencePitfallQuestions() {
	return [
		...pastExperienceScenarios.flatMap((item) => [
			makeChoiceQuestion({ kind: "pitfall · たことがあります", prompt: `Which sentence is past experience?`, subprompt: `Target: has ${item.actionEn} before.`, band: "Choose the た-form pattern.", answer: item.natural, options: [item.natural, `${item.subject}は${item.dict}ことがあります。`, `${item.subject}は${item.dict}こともあります。`, `${item.subject}は${item.ta}ところです。`], explanation: "Past experience requires た-form + ことがあります." }),
			makeChoiceQuestion({ kind: "pitfall · recent past", prompt: `Which sentence misuses たことがあります for a simple recent event?`, subprompt: "The event happened yesterday.", band: "Find the unnatural sentence.", answer: `昨日${item.ta}ことがあります。`, options: [`昨日${item.ta}ことがあります。`, `昨日${item.ta}。`, `昨日${item.ta}んです。`, `昨日${item.ta}ので、疲れました。`], explanation: "Use たことがあります for experience, not a plain recent event like yesterday." }),
			makeChoiceQuestion({ kind: "nuance · frequency", prompt: `Which word naturally fits ${item.ta}ことがあります?`, subprompt: "Past experience pairs with count/frequency words.", band: "Choose the experience cue.", answer: item.frequency, options: [item.frequency, "いつも", "毎朝", "たいてい"], explanation: "一度, 何度か, and 何度も are natural with past-experience sentences." })
		]),
		...occasionalEventScenarios.flatMap((item) => [
			makeChoiceQuestion({ kind: "pitfall · ことがあります", prompt: `Which sentence means something sometimes happens?`, subprompt: item.context, band: "Choose dictionary/ない-form + ことがあります.", answer: item.natural, options: [item.natural, `${item.subject}は${item.dict}たことがあります。`, `${item.subject}は${item.dict}ところです。`, `${item.subject}は${item.dict}ことができます。`], explanation: "Occasional events use dictionary form or ない-form before ことがあります." }),
			makeChoiceQuestion({ kind: "pitfall · いつも", prompt: `Which sentence sounds wrong because the event is too frequent?`, subprompt: "ことがあります is not for “always.”", band: "Spot the misuse.", answer: `いつも${item.dict}ことがあります。`, options: [`いつも${item.dict}ことがあります。`, `ときどき${item.dict}ことがあります。`, `たまに${item.dict}ことがあります。`, `${item.context}${item.dict}ことがあります。`], explanation: "Use ことがあります for occasional or unusual events, not something that always happens." }),
			makeChoiceQuestion({ kind: "nuance · こともあります", prompt: item.negativeNatural, subprompt: "What does も add?", band: "Read the occasional variation.", answer: "There are also times when this happens.", options: ["There are also times when this happens.", "It has never happened.", "It happened once long ago.", "It is happening right now."], explanation: "こともあります means “there are also times when...”" })
		])
	];
}

function makeVarietyChoiceQuestion(config) {
	return makeChoiceQuestion({
		...config,
		options: Array.from(new Set(config.options))
	});
}

function buildComparisonVarietyQuestions() {
	return comparisonScenarios.flatMap((item) => {
		const forms = comparisonSentences(item);
		const reverseForms = comparisonSentences({ ...item, lesser: item.greater, greater: item.lesser, lesserEn: item.greaterEn, greaterEn: item.lesserEn });
		const englishYori = sentenceCase(`${item.greaterEn} is ${item.comparative} than ${item.lesserEn}.`);
		const englishHodo = sentenceCase(`${item.lesserEn} is not as ${item.base} as ${item.greaterEn}.`);
		return [
			makeVarietyChoiceQuestion({ kind: "variety · comparison rewrite", prompt: `Rewrite without changing meaning: ${forms.hodo}`, subprompt: englishHodo, band: "Choose the より...のほう equivalent.", answer: forms.hou, options: [forms.hou, reverseForms.hou, forms.yori, `${item.greater}は${item.lesser}ほど${item.neg}ありません。`], explanation: "AはBほど...ません means Bのほうが...です." }),
			makeVarietyChoiceQuestion({ kind: "variety · dialogue", prompt: `A: ${forms.question} B: ＿＿＿＿`, subprompt: `Answer that ${item.greaterEn} is ${item.comparative}.`, band: "Choose the most natural short answer.", answer: forms.shorterHou, options: [forms.shorterHou, `${item.lesser}のほうが${item.adj}です。`, forms.hodo, reverseForms.shorterHou], explanation: "Answer どちら questions with the chosen side + のほうが." }),
			makeVarietyChoiceQuestion({ kind: "variety · false friend", prompt: `Which sentence is grammatically correct and means “${englishYori}”?`, subprompt: "Watch より direction and ほど negativity.", band: "Choose the correct comparison.", answer: forms.yori, options: [forms.yori, `${item.lesser}は${item.greater}ほど${item.adj}です。`, reverseForms.yori, `${item.greater}ほど${item.lesser}は${item.neg}ありません。`], explanation: "より marks the base; ほど needs a negative ending." }),
			makeVarietyChoiceQuestion({ kind: "variety · particle with desire", prompt: `A: ${forms.taiQuestion} B: ＿＿＿＿`, subprompt: `Choose ${item.greaterEn} with 選びたい.`, band: "Choose のほうを for the action verb.", answer: forms.taiAnswer, options: [forms.taiAnswer, forms.hoshiiAnswer, `${item.greater}のほうが選びたいです。`, `${item.greater}のほうをほしいです。`], explanation: "選びたい keeps an object-like noun with を; ほしい takes が." })
		];
	});
}

function buildTimeVarietyQuestions() {
	return [
		...nagaraScenarios.flatMap((item) => [
			makeVarietyChoiceQuestion({ kind: "variety · ながら same subject", prompt: "Which sentence clearly has one person doing two actions at the same time?", subprompt: `Target: while ${item.sideEn}, ${item.mainEn}.`, band: "Choose ながら.", answer: item.natural, options: [item.natural, `${item.stem}ところです。`, `${item.stem}まで${item.main}。`, `${item.main}までに${item.stem}ます。`], explanation: "ながら links two simultaneous actions by the same person." }),
			makeVarietyChoiceQuestion({ kind: "variety · ながら repair", prompt: `${item.stem}ますながら${item.main}。`, subprompt: "Repair the form before ながら.", band: "Choose the corrected sentence.", answer: item.natural, options: [item.natural, `${item.stem}てながら${item.main}。`, `${item.stem}たながら${item.main}。`, `${item.stem}までながら${item.main}。`], explanation: "Drop ます before ながら." })
		]),
		...tokoroScenarios.flatMap((item) => [
			makeVarietyChoiceQuestion({ kind: "variety · stage sequence", prompt: `Put the stages in order for ${item.actionEn}.`, subprompt: "Before, during, just after.", band: "Choose the correct sequence.", answer: `${item.dict}ところ → ${item.teiru}ところ → ${item.ta}ところ`, options: [`${item.dict}ところ → ${item.teiru}ところ → ${item.ta}ところ`, `${item.ta}ところ → ${item.teiru}ところ → ${item.dict}ところ`, `${item.teiru}ところ → ${item.dict}ところ → ${item.ta}ところ`, `${item.dict}ところ → ${item.ta}ところ → ${item.teiru}ところ`], explanation: "Dictionary form = about to, ている = in progress, た-form = just finished." }),
			makeVarietyChoiceQuestion({ kind: "variety · ところ context", prompt: `A: もう${item.actionEn}ましたか。 B: ${item.setupAfter}`, subprompt: "Choose the sentence that fits just finished.", band: "Choose たところです.", answer: `${item.ta}ところです。`, options: [`${item.ta}ところです。`, `${item.teiru}ところです。`, `${item.dict}ところです。`, `${item.ta}までにです。`], explanation: "A just-finished context uses たところです." })
		]),
		...limitScenarios.flatMap((item) => [
			makeVarietyChoiceQuestion({ kind: "variety · deadline vs duration", prompt: "Which pair is correctly matched?", subprompt: "まで = until, までに = by.", band: "Choose the accurate pair.", answer: `${item.limit}まで = duration / ${item.limit}までに = deadline`, options: [`${item.limit}まで = duration / ${item.limit}までに = deadline`, `${item.limit}まで = deadline / ${item.limit}までに = duration`, `${item.limit}まで = simultaneous action / ${item.limit}までに = just finished`, `${item.limit}まで = comparison / ${item.limit}までに = invitation`], explanation: "まで marks an endpoint for continuing; までに marks completion by a deadline." }),
			makeVarietyChoiceQuestion({ kind: "variety · までに natural verb", prompt: `${item.limit}までに＿＿＿＿。`, subprompt: "Choose the short/completion action.", band: "Match までに with completion.", answer: item.instant, options: [item.instant, item.continuous, "ここにいます", "待っています"], explanation: "までに pairs best with an action that can be completed." })
		])
	];
}

function buildInvitationVarietyQuestions() {
	return [
		...invitationScenarios.flatMap((item) => [
			makeVarietyChoiceQuestion({ kind: "variety · invitation role", prompt: `A: ${item.natural}`, subprompt: "Who is expected to do the action?", band: "Read the invitation role.", answer: "The speaker and listener together.", options: ["The speaker and listener together.", "Only the speaker as help.", "Only the listener as an order.", "Nobody; it is a refusal."], explanation: "ませんか invites the listener to join the action." }),
			makeVarietyChoiceQuestion({ kind: "variety · invitation response", prompt: `A: ${item.natural} B: ${item.decline}`, subprompt: "What did B do?", band: "Read the response.", answer: "B declined softly.", options: ["B declined softly.", "B accepted enthusiastically.", "B offered help.", "B asked for permission."], explanation: "すみません...ちょっと is a common soft refusal." })
		]),
		...sharedSuggestionScenarios.flatMap((item) => [
			makeVarietyChoiceQuestion({ kind: "variety · direct vs soft suggestion", prompt: `Context: ${item.context}`, subprompt: `The plan is basically agreed: ${item.actionEn}.`, band: "Choose direct ましょう.", answer: item.natural, options: [item.natural, item.consent, `${item.stem}ませんか。`, `${item.stem}ません。`], explanation: "ましょう is direct; ましょうか checks agreement." }),
			makeVarietyChoiceQuestion({ kind: "variety · agreement check", prompt: item.consent, subprompt: "What would a natural agreeing response look like?", band: "Choose response.", answer: item.response, options: [item.response, "はい、お願いします。", "すみません、今日はちょっと...", "いいえ、できませんでした。"], explanation: "Shared suggestions accept with そうですね/はい + ましょう." })
		]),
		...offerScenarios.flatMap((item) => [
			makeVarietyChoiceQuestion({ kind: "variety · offer role", prompt: `A: ${item.context} B: ${item.natural}`, subprompt: "Who will likely do the action?", band: "Read the offer role.", answer: "The speaker offers to do it for the listener.", options: ["The speaker offers to do it for the listener.", "The listener invites the speaker.", "Both already did it.", "The speaker refuses."], explanation: "ましょうか can mean “Shall I...?” as an offer." }),
			makeVarietyChoiceQuestion({ kind: "variety · offer response", prompt: `A: ${item.natural} B: ${item.accept}`, subprompt: "What kind of response is this?", band: "Classify the response.", answer: "Accepting help.", options: ["Accepting help.", "Declining an invitation.", "Setting a deadline.", "Describing ability."], explanation: "お願いします accepts an offer of help." })
		])
	];
}

function buildAbilityVarietyQuestions() {
	return [
		...potentialScenarios.flatMap((item) => [
			makeVarietyChoiceQuestion({ kind: "variety · potential repair", prompt: `${item.subject}は${item.object}を${item.potential}。`, subprompt: "Repair the common particle pattern.", band: "Choose が with potential.", answer: item.natural, options: [item.natural, `${item.subject}は${item.object}を${item.masu}。`, `${item.subject}は${item.object}が${item.masu}。`, `${item.subject}は${item.object}をできます。`], explanation: "Potential verbs often mark the object-like noun with が." }),
			makeVarietyChoiceQuestion({ kind: "variety · ability question", prompt: `A: ${item.subject}は${item.object}が${item.potential}か。 B: はい、${item.context}`, subprompt: "What is A asking?", band: "Read the potential question.", answer: `Whether ${item.subject.replace("は", "")} can ${item.actionEn}.`, options: [`Whether ${item.subject.replace("は", "")} can ${item.actionEn}.`, `Whether ${item.subject.replace("は", "")} already ${item.actionEn}.`, `Whether ${item.subject.replace("は", "")} wants ${item.object}.`, `Whether ${item.object} is visible.`], explanation: "Potential questions ask about ability or possibility." })
		]),
		...dekiruScenarios.flatMap((item) => [
			makeVarietyChoiceQuestion({ kind: "variety · noun vs verb ability", prompt: "Which pair is correct?", subprompt: `Target: can ${item.actionEn}.`, band: "Match noun and verb patterns.", answer: `${item.noun}ができます / ${item.verbPlain}ことができます`, options: [`${item.noun}ができます / ${item.verbPlain}ことができます`, `${item.noun}をできます / ${item.verbPlain}ができます`, `${item.noun}にできます / ${item.verbPlain}をできます`, `${item.noun}できます / ${item.verbPlain}できます`], explanation: "Nouns use ができます; verbs use dictionary form + ことができます." }),
			makeVarietyChoiceQuestion({ kind: "variety · place possibility", prompt: `Context: ${item.context}`, subprompt: "Choose the sentence that describes what the place allows.", band: "Choose できます.", answer: item.natural, options: [item.natural, item.verbNatural, `${item.place}${item.noun}をします。`, `${item.place}${item.noun}が見えます。`], explanation: "Place + noun + ができます describes an available service/activity." })
		]),
		...perceptionScenarios.flatMap((item) => [
			makeVarietyChoiceQuestion({ kind: "variety · perception cue", prompt: `Context: ${item.context}`, subprompt: `${item.target} naturally reaches eyes/ears.`, band: "Choose natural perception.", answer: item.natural, options: [item.natural, `${item.source}${item.target}が${item.potential}。`, `${item.source}${item.target}を${item.sense}。`, `${item.source}${item.target}ができます。`], explanation: "Use 見えます/聞こえます for natural perception." }),
			makeVarietyChoiceQuestion({ kind: "variety · perception blocked", prompt: item.blocked, subprompt: "What is blocked?", band: "Read the negative perception sentence.", answer: `Natural ${item.sense === "見えます" ? "sight" : "hearing"}.`, options: [`Natural ${item.sense === "見えます" ? "sight" : "hearing"}.`, "Permission to do an action.", "A past experience.", "An invitation."], explanation: "見えません/聞こえません says the sight or sound does not naturally reach you." })
		])
	];
}

function buildExperienceVarietyQuestions() {
	return [
		...pastExperienceScenarios.flatMap((item) => [
			makeVarietyChoiceQuestion({ kind: "variety · experience question", prompt: `A: ${item.ta}ことがありますか。`, subprompt: `Answer yes for ${item.subject}.`, band: "Choose the experience answer.", answer: item.natural, options: [item.natural, item.never, `${item.subject}は${item.dict}ことがあります。`, `昨日${item.ta}。`], explanation: "Past experience uses た-form + ことがあります." }),
			makeVarietyChoiceQuestion({ kind: "variety · never", prompt: `Which sentence means “has never ${item.actionEn}”?`, subprompt: "Choose たことがありません.", band: "Choose never-experience.", answer: item.never, options: [item.never, item.natural, `${item.subject}は${item.dict}ことがありません。`, `${item.subject}は${item.ta}ところではありません。`], explanation: "Never-experience uses た-form + ことがありません." })
		]),
		...occasionalEventScenarios.flatMap((item) => [
			makeVarietyChoiceQuestion({ kind: "variety · sometimes vs experience", prompt: `Which sentence means “sometimes ${item.eventEn}”?`, subprompt: item.context, band: "Choose occasional occurrence.", answer: item.natural, options: [item.natural, `${item.subject}は${item.dict}たことがあります。`, item.negativeNatural, `${item.subject}は${item.dict}ことができます。`], explanation: "Dictionary/ない-form + ことがあります means something sometimes happens." }),
			makeVarietyChoiceQuestion({ kind: "variety · frequency cue", prompt: "Which cue best fits an occasional-event sentence?", subprompt: item.natural, band: "Choose a not-too-frequent cue.", answer: "たまに", options: ["たまに", "いつも", "毎日必ず", "一度だけ経験として"], explanation: "たまに/ときどき fit occasional ことがあります; いつも does not." })
		])
	];
}

function buildComparisonPracticeBank() {
	const bank = [];
	for (const item of comparisonScenarios) {
		const forms = comparisonSentences(item);
		const reverseForms = comparisonSentences({ ...item, lesser: item.greater, greater: item.lesser, lesserEn: item.greaterEn, greaterEn: item.lesserEn });
		const englishYori = sentenceCase(`${item.greaterEn} is ${item.comparative} than ${item.lesserEn}.`);
		const englishHodo = sentenceCase(`${item.lesserEn} is not as ${item.base} as ${item.greaterEn}.`);
		Object.values(comparisonQuestionTemplates).forEach((templates) => {
			templates.forEach((template) => bank.push(template(item, forms, reverseForms, englishYori, englishHodo)));
		});
	}
	return [...bank, ...buildComparisonPitfallQuestions(), ...buildComparisonVarietyQuestions()];
}

function buildTimePracticeBank() {
	return [
		...nagaraScenarios.flatMap((item) => timeQuestionTemplates.nagara.map((template) => template(item))),
		...tokoroScenarios.flatMap((item) => timeQuestionTemplates.tokoro.map((template) => template(item))),
		...limitScenarios.flatMap((item) => timeQuestionTemplates.limit.map((template) => template(item))),
		...buildTimePitfallQuestions(),
		...buildTimeVarietyQuestions()
	];
}

function buildInvitationPracticeBank() {
	return [
		...invitationScenarios.flatMap((item) => invitationQuestionTemplates.masenka.map((template) => template(item))),
		...sharedSuggestionScenarios.flatMap((item) => invitationQuestionTemplates.mashou.map((template) => template(item))),
		...offerScenarios.flatMap((item) => invitationQuestionTemplates.offer.map((template) => template(item))),
		...buildInvitationPitfallQuestions(),
		...buildInvitationVarietyQuestions()
	];
}

function buildAbilityPracticeBank() {
	return [
		...potentialScenarios.flatMap((item) => abilityQuestionTemplates.potential.map((template) => template(item))),
		...dekiruScenarios.flatMap((item) => abilityQuestionTemplates.dekiru.map((template) => template(item))),
		...perceptionScenarios.flatMap((item) => abilityQuestionTemplates.perception.map((template) => template(item))),
		...buildAbilityPitfallQuestions(),
		...buildAbilityVarietyQuestions()
	];
}

function buildExperiencePracticeBank() {
	return [
		...pastExperienceScenarios.flatMap((item) => experienceQuestionTemplates.past.map((template) => template(item))),
		...occasionalEventScenarios.flatMap((item) => experienceQuestionTemplates.occasional.map((template) => template(item))),
		...buildExperiencePitfallQuestions(),
		...buildExperienceVarietyQuestions()
	];
}

function buildPermissionPracticeBank() {
	return [
		...allowBanScenarios.flatMap((item) => permissionQuestionTemplates.allowBan.map((template) => template(item))),
		...noNeedMustScenarios.flatMap((item) => permissionQuestionTemplates.noNeedMust.map((template) => template(item))),
		...buildPermissionPitfallQuestions()
	];
}

function buildDesirePracticeBank() {
	return [
		...desireNounScenarios.flatMap((item) => desireQuestionTemplates.noun.map((template) => template(item))),
		...desireActionScenarios.flatMap((item) => desireQuestionTemplates.action.map((template) => template(item))),
		...hopeSituationScenarios.flatMap((item) => desireQuestionTemplates.hope.map((template) => template(item))),
		...buildDesirePitfallQuestions()
	];
}

function buildAppearancePracticeBank() {
	return [
		...souAppearanceScenarios.flatMap((item) => appearanceQuestionTemplates.sou.map((template) => template(item))),
		...visibleEmotionScenarios.flatMap((item) => appearanceQuestionTemplates.gari.map((template) => template(item))),
		...mamaScenarios.flatMap((item) => appearanceQuestionTemplates.mama.map((template) => template(item))),
		...buildAppearancePitfallQuestions()
	];
}

function buildReasonPracticeBank() {
	return [
		...karaReasonScenarios.flatMap((item) => reasonQuestionTemplates.kara.map((template) => template(item))),
		...nodeReasonScenarios.flatMap((item) => reasonQuestionTemplates.node.map((template) => template(item))),
		...teCauseScenarios.flatMap((item) => reasonQuestionTemplates.te.map((template) => template(item))),
		...buildReasonPitfallQuestions()
	];
}

function buildPurposePracticeBank() {
	return [
		...movementPurposeScenarios.flatMap((item) => purposeQuestionTemplates.movement.map((template) => template(item))),
		...tamePurposeScenarios.flatMap((item) => purposeQuestionTemplates.tame.map((template) => template(item))),
		...youniPurposeScenarios.flatMap((item) => purposeQuestionTemplates.youni.map((template) => template(item))),
		...buildPurposePitfallQuestions()
	];
}

const grammarPracticeRuleNotes = {
	comparison: {
		title: "Comparison patterns",
		intro: "These patterns all compare two things, but the direction of the sentence changes depending on which marker you use. The main skill is tracking which noun is stronger, which noun is the base, and whether the ending needs to be positive or negative.",
		sections: [
			{
				heading: "A より B のほうが adjective",
				pattern: "AよりBのほうが大きいです。",
				points: [
					"A is the comparison base. B is the side that has more of the quality.",
					"のほう points to the chosen or stronger side. If you reverse A and B, the meaning reverses.",
					"This is natural when the speaker is making a clear comparison, preference, or recommendation."
				],
				examples: ["バスより電車のほうが速いです。", "映画より本のほうがおもしろいです。"]
			},
			{
				heading: "A は B ほど negative",
				pattern: "AはBほど高くありません。",
				points: [
					"ほど in this N4 pattern means A is not as adjective as B.",
					"The predicate must be negative: 高くありません, 静かではありません, 好きではありません.",
					"The noun after ほど is the stronger benchmark."
				],
				examples: ["今日は昨日ほど寒くありません。", "この店はあの店ほど有名ではありません。"]
			},
			{
				heading: "A と B と どちら",
				pattern: "AとBとどちらがいいですか。",
				points: [
					"Use this to ask which of two things has more of a quality.",
					"Answer with the chosen side plus のほう: Bのほうがいいです.",
					"どっち is casual; どちら is safer for polite practice."
				],
				examples: ["日本語と英語とどちらが難しいですか。", "コーヒーとお茶とどちらが好きですか。"]
			},
			{
				heading: "のほうを with たい, のほうが with ほしい",
				pattern: "赤いののほうを買いたいです。 / 赤いののほうがほしいです。",
				points: [
					"たい behaves like an adjective, but the wanted action still has an object, so のほうを can sound natural with verbs like 選びたい or 買いたい.",
					"ほしい describes the wanted thing itself, so the wanted item is usually marked with が.",
					"This is a fringe but useful distinction: action desire often allows を, wanted object takes が."
				],
				examples: ["大きいかばんのほうを使いたいです。", "新しいスマホのほうがほしいです。"]
			}
		],
		pitfalls: [
			"Do not read より as marking the stronger item. It marks the base of comparison.",
			"Do not use a positive ending after ほど in this pattern.",
			"Do not answer a どちら question with only はい or いいえ."
		]
	},
	time: {
		title: "ながら, ところです, まで, までに",
		intro: "This session separates simultaneous actions, stages of an action, and time limits. The common trap is translating English first and choosing the wrong Japanese time marker.",
		sections: [
			{
				heading: "ます-stem + ながら",
				pattern: "音楽を聞きながら料理を作ります。",
				points: [
					"ながら attaches to the ます-stem: 聞き, 食べ, 見, 勉強し.",
					"The action after ながら is usually the main action.",
					"Use it when the same person does both actions at the same time."
				],
				examples: ["テレビを見ながらご飯を食べます。", "メモを取りながら先生の話を聞きます。"]
			},
			{
				heading: "ところです shows the action stage",
				pattern: "食べるところです / 食べているところです / 食べたところです",
				points: [
					"Dictionary form + ところです means just about to do the action.",
					"ている + ところです means currently in the middle of the action.",
					"た-form + ところです means just finished the action."
				],
				examples: ["今から出かけるところです。", "今、宿題をしているところです。", "今、駅に着いたところです。"]
			},
			{
				heading: "まで means until",
				pattern: "五時まで待ちます。",
				points: [
					"まで marks the endpoint of a continuous action or state.",
					"The action lasts until that time, place, or event.",
					"It often pairs with verbs like 待つ, 働く, 勉強する, いる."
				],
				examples: ["会議が終わるまでここにいます。", "夜十時まで勉強しました。"]
			},
			{
				heading: "までに means by",
				pattern: "五時までに出してください。",
				points: [
					"までに marks a deadline for a short action or completion.",
					"The action can happen any time before the deadline.",
					"It often pairs with verbs like 出す, 帰る, 終わる, 送る, 払う."
				],
				examples: ["金曜日までにレポートを出します。", "八時までに帰ってください。"]
			}
		],
		pitfalls: [
			"Do not say 聞きますながら. Drop ます before ながら.",
			"Do not use までに for something that continues the whole time.",
			"Do not use まで for a deadline if the action only needs to be completed once."
		]
	},
	invitation: {
		title: "ませんか, ましょう, ましょうか",
		intro: "These forms all point toward doing an action, but they differ in who is being invited, how direct the suggestion is, and whether the speaker is offering help.",
		sections: [
			{
				heading: "ませんか for polite invitations",
				pattern: "いっしょに昼ご飯を食べませんか。",
				points: [
					"Although the form is negative, it often functions as a soft invitation.",
					"It is useful when inviting someone to do something together.",
					"Because it is softer than ましょう, it leaves the listener room to decline."
				],
				examples: ["週末、映画を見ませんか。", "いっしょに日本語を勉強しませんか。"]
			},
			{
				heading: "ましょう for direct shared action",
				pattern: "行きましょう。",
				points: [
					"ましょう means let's do it.",
					"It is more direct than ませんか and assumes the shared action is basically agreed on.",
					"It also appears as a natural accepting response to an invitation."
				],
				examples: ["A: コーヒーを飲みませんか。 B: いいですね。飲みましょう。", "時間ですから、帰りましょう。"]
			},
			{
				heading: "ましょうか for offers or checking agreement",
				pattern: "手伝いましょうか。",
				points: [
					"With actions the speaker will do for someone, ましょうか often means Shall I...?",
					"With shared actions, it can ask for agreement: Shall we...?",
					"The response changes by role: offers often take お願いします; invitations often take いいですね or そうしましょう."
				],
				examples: ["荷物を持ちましょうか。", "そろそろ行きましょうか。"]
			}
		],
		pitfalls: [
			"Do not translate ませんか as a simple refusal in invitation dialogues.",
			"Do not answer an offer of help with いいですね when お願いします is the natural acceptance.",
			"Do not use ましょう when you need to politely ask whether the listener wants to do it."
		]
	},
	ability: {
		title: "Potential, できます, 見えます, 聞こえます",
		intro: "This session compares three ways to talk about possibility: personal ability, a situation that allows something, and natural perception. The particle が appears often, but for slightly different reasons.",
		sections: [
			{
				heading: "Potential verbs",
				pattern: "日本語が話せます。 / 漢字が読めません。",
				points: [
					"Potential forms express can do: 話す becomes 話せます, 食べる becomes 食べられます, する becomes できます.",
					"Object-like nouns often change from を to が with potential verbs.",
					"Potential is about ability or possibility, not just doing the action."
				],
				examples: ["ジョーさんは中国語が話せます。", "妹はまだ一人で服が着られません。"]
			},
			{
				heading: "Noun + ができます",
				pattern: "このコンビニでは買い物ができます。",
				points: [
					"Use noun + ができます for activities, services, or things that are possible.",
					"Do not mark the noun with を in this pattern.",
					"It often describes what a place, machine, event, or situation allows."
				],
				examples: ["ここでコピーができます。", "このアプリで予約ができます。"]
			},
			{
				heading: "Verb dictionary form + ことができます",
				pattern: "この部屋で勉強することができます。",
				points: [
					"This is a slightly more formal way to say that an action is possible.",
					"The verb before こと must be dictionary form.",
					"It can sound more official than the short potential form."
				],
				examples: ["図書館でパソコンを使うことができます。", "オンラインで申し込むことができます。"]
			},
			{
				heading: "見えます and 聞こえます",
				pattern: "窓から海が見えます。 / 鳥の声が聞こえます。",
				points: [
					"These describe natural perception: something comes into view or reaches your ears.",
					"They are different from 見られます and 聞けます, which focus more on ability, permission, or intentional access.",
					"The thing perceived is marked with が."
				],
				examples: ["ここから富士山が見えます。", "となりの部屋から音楽が聞こえます。"]
			}
		],
		pitfalls: [
			"Do not use をできます. Use noun + ができます or verb + ことができます.",
			"Do not confuse 見えます with 見られます when the meaning is natural visibility.",
			"Do not use a normal ます verb when the meaning is can do."
		]
	},
	experience: {
		title: "たことがあります and ことがあります",
		intro: "These two patterns look almost identical, but the verb form before こと changes the meaning completely. た-form points to past experience. Dictionary or ない-form points to something that sometimes happens.",
		sections: [
			{
				heading: "た-form + ことがあります",
				pattern: "富士山に登ったことがあります。",
				points: [
					"Use this for life experience: has done before.",
					"It often appears with 一度, 何度か, 何度も, or questions like したことがありますか.",
					"It is not for a normal recent past event with a clear time like yesterday."
				],
				examples: ["日本で納豆を食べたことがあります。", "歌舞伎を見たことがありません。"]
			},
			{
				heading: "Dictionary or ない-form + ことがあります",
				pattern: "朝ご飯を食べないことがあります。",
				points: [
					"Use this when something sometimes happens.",
					"It fits occasional or unusual events, not things that always happen.",
					"The form before こと is not past tense unless you mean life experience."
				],
				examples: ["母は人の名前を忘れることがあります。", "忙しい日は昼ご飯を食べないことがあります。"]
			},
			{
				heading: "こともあります",
				pattern: "時間がないときは食べないこともあります。",
				points: [
					"も adds the feeling of also or there are also times when.",
					"It is useful when contrasting the usual habit with occasional exceptions.",
					"It does not mean never and it does not mean a one-time past experience."
				],
				examples: ["いつもは七時に起きますが、休みの日は十時まで寝ることもあります。", "雪の日は電車が遅れることもあります。"]
			}
		],
		pitfalls: [
			"Do not use たことがあります for a specific event like 昨日映画を見ました.",
			"Do not use dictionary form + ことがあります when you mean past experience.",
			"Do not pair いつも with ことがあります; use ときどき or たまに."
		]
	},
	permission: {
		title: "Permission, prohibition, lack of necessity, obligation",
		intro: "These patterns are easy to mix up because they all use negative-looking or te-form pieces. Focus on the final expression: てもいい gives permission, てはいけません forbids, なくてもいい removes necessity, and なければなりません creates obligation.",
		sections: [
			{
				heading: "Te-like form + もいいです",
				pattern: "ここに座ってもいいです。 / 狭くてもいいです。 / 鉛筆でもいいです。",
				points: [
					"Use this for permission: you may do something.",
					"It can also mean concession: it is okay even if something is true.",
					"The form before it is verb て-form, i-adjective 〜くて, or na-adjective/noun + で."
				],
				examples: ["写真を撮ってもいいです。", "部屋は狭くてもいいです。", "鉛筆でもいいです。"]
			},
			{
				heading: "Te-like form + はいけません",
				pattern: "川に行ってはいけません。 / Tシャツではいけません。",
				points: [
					"This expresses prohibition: must not, may not, or is not allowed.",
					"With nouns and na-adjectives, use ではいけません.",
					"The は contrasts with もいいです: allowed vs forbidden."
				],
				examples: ["テスト中に辞書を使ってはいけません。", "入試の服はTシャツではいけません。"]
			},
			{
				heading: "Negative te-like form + もいいです",
				pattern: "薬を飲まなくてもいいです。 / 駅に近くなくてもいいです。",
				points: [
					"This means the action or condition is not necessary.",
					"It does not mean must not. It means it is okay not to.",
					"For verbs, use ない-form without い + くて: 飲まない becomes 飲まなくて."
				],
				examples: ["明日来なくてもいいです。", "ホテルは駅に近くなくてもいいです。", "学生でなくてもいいです。"]
			},
			{
				heading: "なければなりません",
				pattern: "メールを書かなければなりません。 / 静かでなければなりません。",
				points: [
					"This means must or have to.",
					"It looks negative, but the whole pattern creates obligation.",
					"For nouns and na-adjectives, use でなければなりません."
				],
				examples: ["宿題を出さなければなりません。", "部屋は広くなければなりません。", "学生でなければなりません。"]
			}
		],
		pitfalls: [
			"Do not confuse なくてもいいです with てはいけません. One means optional; the other means forbidden.",
			"Do not confuse てもいいです with なければなりません. One allows; the other requires.",
			"For i-adjectives, use 〜くて / 〜くなくて / 〜くなければ, not 〜いで."
		]
	},
	desire: {
		title: "Desires and hopes",
		intro: "This lesson separates direct personal desire from observed third-person desire and broader hopes about situations. Use ほしい for things, たい for actions, ほしがる/たがる for what another person appears to want, and といいです for hoped-for outcomes.",
		sections: [
			{
				heading: "Noun + がほしいです",
				pattern: "私は自分の部屋がほしいです。",
				points: [
					"Use ほしいです when the speaker wants a thing.",
					"The wanted noun is usually marked with が.",
					"ほしい behaves like an adjective, so its negative is ほしくないです."
				],
				examples: ["新しいパソコンがほしいです。", "水がほしいです。", "もっと時間がほしいです。"]
			},
			{
				heading: "Verb stem + たいです",
				pattern: "本が読みたいです。 / 薬を飲みたくないです。",
				points: [
					"Use the ます-stem of a verb plus たいです when the speaker wants to do an action.",
					"Object marker を sometimes changes to が with たい.",
					"The negative is たくないです, not たいではありません."
				],
				examples: ["映画が見たいです。", "寿司を食べたいです。", "今日は勉強したくないです。"]
			},
			{
				heading: "ほしがります and たがります",
				pattern: "弟は新しいパソコンをほしがっています。 / 子どもは新幹線に乗りたがっています。",
				points: [
					"Use these when describing a third person's visible desire.",
					"ほしがる is for wanting a thing and often takes を.",
					"たがる is for wanting to do an action and attaches to the verb stem."
				],
				examples: ["犬は水をほしがっています。", "友だちは日本語を勉強したがっています。"]
			},
			{
				heading: "Plain form + といいです",
				pattern: "いい仕事が見つかるといいです。",
				points: [
					"Use といいです for a hoped-for situation or outcome.",
					"It often attaches to non-volitional verbs, potential forms, adjectives, nouns, or third-person situations.",
					"For this N4 pattern, use plain non-past forms, not た or なかった."
				],
				examples: ["雨が降らないといいです。", "ホームステイの家族が親切だといいです。", "チケットがまだあるといいですね。"]
			}
		],
		pitfalls: [
			"Do not use ほしい for actions. Use verb stem + たいです.",
			"Do not directly state another person's private desire with ほしい/たい when you mean visible behavior; use ほしがる/たがる.",
			"Do not put past forms like 見つかった before といいです for this future hope pattern."
		]
	},
	appearance: {
		title: "Appearance, visible feelings, and unchanged states",
		intro: "This lesson groups three patterns that all depend on observation. そうです says something looks likely or appears a certain way, がっています/がります reports another person's visible feeling or tendency, and まま says a state remains unchanged.",
		sections: [
			{
				heading: "Stem + そうです",
				pattern: "コップが落ちそうです。 / ケーキはおいしそうです。",
				points: [
					"Use appearance そうです when you judge from what you can see or from present circumstances.",
					"With verbs, attach to the ます-stem: 落ちそう, 降りそう, 泣きそう.",
					"With i-adjectives, drop い: おいしそう, 難しそう, 重そう."
				],
				examples: ["雨が降りそうです。", "この問題は難しそうです。", "ジョンさんはしんぱいそうです。"]
			},
			{
				heading: "Negative そう forms",
				pattern: "雨は降りそうもありません。 / 静かではなさそうです。",
				points: [
					"Verb negatives often use 〜そうもありません: 降りそうもありません.",
					"i-adjective negatives use 〜くなさそうです: おいしくなさそうです.",
					"na-adjectives and nouns use 〜ではなさそうです. The special forms いい and ない become よさそう and なさそう."
				],
				examples: ["時間はなさそうです。", "天気はよくなさそうです。", "この町は静かではなさそうです。"]
			},
			{
				heading: "がっています and がります",
				pattern: "母はさびしがっています。 / 犬は夏になると暑がります。",
				points: [
					"Use がっています for a third person's visible current feeling or wish.",
					"Use がります for a general tendency: someone tends to feel or act that way.",
					"Do not use plain さびしいです or こわいです to directly state another person's private feeling unless you have a reason."
				],
				examples: ["子どもたちはおもしろがっています。", "弟はこわい話をこわがります。", "妹は恥ずかしがっています。"]
			},
			{
				heading: "Plain state + まま",
				pattern: "窓を開けたまま寝ました。 / カレンダーが先月のままです。",
				points: [
					"まま means the state before it continues without changing.",
					"Verbs use plain forms before まま: 開けたまま, 洗わないまま.",
					"i-adjectives stay plain, na-adjectives take な, and nouns take の: 古いまま, 静かなまま, 空のまま."
				],
				examples: ["電気をつけたまま出かけました。", "手を洗わないまま食べてはいけません。", "部屋は静かなままです。"]
			}
		],
		pitfalls: [
			"Do not confuse appearance そうです with hearsay plain-form + そうです. 降りそうです means looks like rain; 降るそうです means I heard it will rain.",
			"Do not use そうもありません for adjective negatives like おいしい; use おいしくなさそうです.",
			"Do not use がります for a current visible moment when がっています is needed.",
			"Do not forget な before まま for na-adjectives or の before まま for nouns."
		]
	},
	reason: {
		title: "Reasons and causes",
		intro: "This lesson separates three ways to explain why something happens. から gives a direct reason, ので gives a softer or more polite reason, and て/くて/で links a cause to feelings, perception, inability, apologies, and thanks.",
		sections: [
			{
				heading: "Plain or polite form + から",
				pattern: "用事がありますから、今日は先に帰ります。",
				points: [
					"から gives a clear reason or cause before the result.",
					"It can attach to plain forms or polite forms.",
					"It is more direct than ので and works naturally before requests, suggestions, and commands."
				],
				examples: ["あぶないから、さわらないでください。", "時間がありませんから、タクシーで行きましょう。", "雨が強いから、今日は出かけません。"]
			},
			{
				heading: "Reason + からです",
				pattern: "スピーチが上手にできませんでした。練習が足りなかったからです。",
				points: [
					"Use からです when the result is already stated and you are explaining why.",
					"The reason comes before からです.",
					"It often answers どうしてですか or gives a focused explanation."
				],
				examples: ["遅れました。道がこんでいたからです。", "今晩は勉強します。明日はテストだからです。"]
			},
			{
				heading: "Plain form + ので",
				pattern: "頭が痛いので、今日は休みます。 / 試験なので、早く寝ます。",
				points: [
					"ので gives a softer, more polite, or more objective reason than から.",
					"Verbs and i-adjectives attach directly to ので.",
					"Nouns and na-adjectives need な before ので: 試験なので, 静かなので."
				],
				examples: ["雨が降っていたので、散歩に行きませんでした。", "会議がありますので、少し遅れます。", "ここは静かなので、勉強しやすいです。"]
			},
			{
				heading: "て, くて, で for cause",
				pattern: "友だちがいなくて、さびしいです。 / 心配で、眠れませんでした。",
				points: [
					"This cause pattern often leads to feelings, perception, inability, apologies, or thanks.",
					"Use verb て-form, i-adjective くて, na-adjective/noun で, and negative なくて.",
					"It usually does not lead straight into the speaker's intention, a request, an invitation, or a command."
				],
				examples: ["遅れて、すみませんでした。", "教えてくれて、ありがとう。", "漢字が多くて、読めませんでした。"]
			}
		],
		pitfalls: [
			"Do not forget な before ので after nouns or na-adjectives.",
			"Do not use ので before blunt commands like 待て or 読め.",
			"Do not use reason て/くて/で before volitional endings such as ましょう or direct requests.",
			"Do not put the result before からです; the reason belongs before からです."
		]
	},
	purpose: {
		title: "Purpose and intended outcomes",
		intro: "These patterns all translate loosely as purpose, but they do different jobs. に is for the purpose of movement, ため(に) is for intentional purpose, and ように is for making a state, ability, negative prevention, or third-person outcome happen.",
		sections: [
			{
				heading: "Noun or verb stem + に",
				pattern: "公園へ散歩に行きました。 / さいふを取りに帰ります。",
				points: [
					"Use this for the purpose of movement.",
					"The phrase before に is a noun or a ます-stem: 散歩に, 買いに, 取りに.",
					"It usually comes before limited movement verbs such as 行く, 来る, 帰る, and 戻る."
				],
				examples: ["図書館へ本を借りに行きます。", "友だちがうちに迎えに来ます。", "家へ忘れ物を取りに戻ります。"]
			},
			{
				heading: "Verb dictionary form + ために",
				pattern: "日本語を勉強するために、日本に留学します。",
				points: [
					"Use ために when someone intentionally does an action for a purpose.",
					"The verb before ために is dictionary form, not ます-stem.",
					"The subject is normally the same before and after ために."
				],
				examples: ["家を買うために、お金をためています。", "会議に出るために、東京へ行きました。", "漢字を練習するために、この本を使っています。"]
			},
			{
				heading: "Noun + のために / ための + noun",
				pattern: "健康のために走ります。 / 漢字を練習するための本です。",
				points: [
					"Nouns need の before ために: 健康のために, 試験のために.",
					"Use ための when the purpose phrase modifies a noun.",
					"ための is common for tools, books, plans, apps, notes, and other things made for a purpose."
				],
				examples: ["試験のために、単語を覚えています。", "これは旅行のためのかばんです。", "これは会社を大きくするための計画です。"]
			},
			{
				heading: "Plain form + ように",
				pattern: "話が聞こえるように前に座ります。 / 遅れないように早く出ます。",
				points: [
					"Use ように when the goal is for a state or outcome to happen.",
					"It often follows potential verbs, perception verbs, non-volitional verbs, negative forms, or third-person subjects.",
					"It is useful for prevention: けがをしないように, 忘れないように, 起きないように."
				],
				examples: ["いい風が入るように、窓を開けました。", "みんなに見えるように、字を大きく書きました。", "子どもが寝られるように、部屋を暗くしました。"]
			}
		],
		pitfalls: [
			"Do not use movement-purpose に unless there is a movement verb like 行く, 来る, 帰る, or 戻る.",
			"Do not put a ます-stem before ために when the purpose is a full action; use dictionary form.",
			"Do not forget の before ために or ための after nouns.",
			"Do not use ために when the goal is a potential, non-volitional, negative-prevention, or third-person outcome; ように is usually the safer N4 pattern."
		]
	}
};

function renderGrammarPracticeRuleNotes(sessionId) {
	const note = grammarPracticeRuleNotes[sessionId];
	if (!note) return "";
	return `
		<div class="gp-note-head">
			<span>Rule notes</span>
			<h5>${escapeHtml(note.title)}</h5>
			<p>${escapeHtml(note.intro)}</p>
		</div>
		<div class="gp-note-grid">
			${note.sections.map((section) => `
				<section class="gp-note-section">
					<h6>${escapeHtml(section.heading)}</h6>
					<p class="gp-note-pattern" lang="ja">${escapeHtml(section.pattern)}</p>
					<ul>${section.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>
					<div class="gp-note-examples">
						${section.examples.map((example) => `<p lang="ja">${escapeHtml(example)}</p>`).join("")}
					</div>
				</section>
			`).join("")}
		</div>
		<div class="gp-note-pitfalls">
			<strong>Common traps</strong>
			<ul>${note.pitfalls.map((pitfall) => `<li>${escapeHtml(pitfall)}</li>`).join("")}</ul>
		</div>
	`;
}

function hydrateGrammarPracticeNotes() {
	document.querySelectorAll("[data-gp-note-tip]").forEach((tip) => {
		tip.innerHTML = renderGrammarPracticeRuleNotes(tip.dataset.gpNoteTip);
	});
}

function closeGrammarPracticeNotes(exceptButton = null) {
	document.querySelectorAll("[data-gp-notes]").forEach((button) => {
		if (button === exceptButton) return;
		button.setAttribute("aria-expanded", "false");
		const tip = document.querySelector(`#${button.getAttribute("aria-controls")}`);
		if (tip) tip.hidden = true;
	});
}

function toggleGrammarPracticeNotes(button) {
	const tip = document.querySelector(`#${button.getAttribute("aria-controls")}`);
	if (!tip) return;
	const willOpen = tip.hidden;
	closeGrammarPracticeNotes(button);
	tip.hidden = !willOpen;
	button.setAttribute("aria-expanded", String(willOpen));
}

const grammarPracticeSessions = {
	comparison: {
		title: "Session 01 · Comparison patterns",
		label: "SESSION 01 · COMPARISONS",
		buildBank: buildComparisonPracticeBank
	},
	time: {
		title: "Session 02 · Time and simultaneous actions",
		label: "SESSION 02 · TIME PATTERNS",
		buildBank: buildTimePracticeBank
	},
	invitation: {
		title: "Session 03 · Invitations and offers",
		label: "SESSION 03 · INVITATIONS",
		buildBank: buildInvitationPracticeBank
	},
	ability: {
		title: "Session 04 · Ability and perception",
		label: "SESSION 04 · ABILITY",
		buildBank: buildAbilityPracticeBank
	},
	experience: {
		title: "Session 05 · Experience and occasional events",
		label: "SESSION 05 · EXPERIENCE",
		buildBank: buildExperiencePracticeBank
	},
	permission: {
		title: "Session 06 · Permission and obligation",
		label: "SESSION 06 · PERMISSION",
		buildBank: buildPermissionPracticeBank
	},
	desire: {
		title: "Session 07 · Desires and hopes",
		label: "SESSION 07 · DESIRE",
		buildBank: buildDesirePracticeBank
	},
	appearance: {
		title: "Session 08 · Appearance and unchanged states",
		label: "SESSION 08 · APPEARANCE",
		buildBank: buildAppearancePracticeBank
	},
	reason: {
		title: "Session 09 · Reasons and causes",
		label: "SESSION 09 · REASONS",
		buildBank: buildReasonPracticeBank
	},
	purpose: {
		title: "Session 10 · Purpose and intended outcomes",
		label: "SESSION 10 · PURPOSE",
		buildBank: buildPurposePracticeBank
	}
};

function buildGrammarPracticeBank(sessionId = gpState.sessionId || "comparison") {
	return (grammarPracticeSessions[sessionId] || grammarPracticeSessions.comparison).buildBank();
}

function startGrammarPractice(sessionId = "comparison", questionCount = Number(gpEls.count.value)) {
	const session = grammarPracticeSessions[sessionId] || grammarPracticeSessions.comparison;
	gpState.sessionId = sessionId;
	gpState.sessionTitle = session.title;
	gpState.sessionLabel = session.label;
	gpState.bank = session.buildBank();
	gpState.queue = shuffled(gpState.bank).slice(0, Math.min(questionCount, gpState.bank.length));
	gpState.index = 0;
	gpState.correct = 0;
	gpState.missed = [];
	gpState.answered = false;
	gpEls["session-notes"].dataset.gpNotes = sessionId;
	gpEls["session-notes"].setAttribute("aria-expanded", "false");
	gpEls["session-note-panel"].innerHTML = renderGrammarPracticeRuleNotes(sessionId);
	gpEls["session-note-panel"].hidden = true;
	gpEls.setup.hidden = true;
	gpEls.status.hidden = true;
	gpEls.complete.hidden = true;
	gpEls.session.hidden = false;
	showGrammarPracticeQuestion();
}

function showGrammarPracticeQuestion() {
	const question = gpState.queue[gpState.index];
	if (!question) {
		finishGrammarPractice();
		return;
	}
	gpState.answered = false;
	gpEls.hero.className = "gp-hero";
	gpEls.type.textContent = `${gpState.sessionLabel || "GRAMMAR PRACTICE"} · ${question.kind}`;
	gpEls.prompt.textContent = question.prompt;
	gpEls.subprompt.textContent = question.subprompt;
	gpEls.band.textContent = question.band;
	gpEls.progress.textContent = `${gpState.index + 1} / ${gpState.queue.length}`;
	gpEls.correct.textContent = `✓ ${gpState.correct}`;
	if (question.mode === "text") {
		gpEls.body.innerHTML = `
			<form class="gp-answer" id="gp-answer-form">
				<label class="visually-hidden" for="gp-answer-input">Type the missing Japanese</label>
					<input id="gp-answer-input" type="text" lang="ja" autocomplete="off" placeholder="${escapeHtml(question.placeholder || "例: 高くありません")}" required>
				<button type="submit" aria-label="Check answer">›</button>
			</form>
			<p class="rh-feedback" id="gp-feedback" aria-live="polite"></p>
			<div class="gp-explanation" id="gp-explanation" hidden></div>
		`;
		gpEls.body.querySelector("input").focus();
		return;
	}
	gpEls.body.innerHTML = `
			<div class="gp-options">
				${question.options.map((option, index) => {
					const lang = jpLangAttribute(option);
					return `<button type="button" data-gp-choice="${index}"><span>${String.fromCharCode(65 + index)}</span><span${lang}>${escapeHtml(option)}</span></button>`;
				}).join("")}
			</div>
		<p class="rh-feedback" id="gp-feedback" aria-live="polite"></p>
		<div class="gp-explanation" id="gp-explanation" hidden></div>
	`;
}

function answerGrammarPractice(value) {
	const question = gpState.queue[gpState.index];
	if (!question || gpState.answered) return;
	gpState.answered = true;
	const normalized = normalizeJapaneseAnswer(value);
	const accepted = question.accepted || [question.answer];
	const isCorrect = accepted.some((answer) => normalized === normalizeJapaneseAnswer(answer));
	if (isCorrect) gpState.correct += 1;
	else gpState.missed.push(question);
	gpEls.correct.textContent = `✓ ${gpState.correct}`;
	gpEls.hero.classList.add(isCorrect ? "is-correct" : "is-incorrect");
	const feedback = gpEls.body.querySelector("#gp-feedback");
	const explanation = gpEls.body.querySelector("#gp-explanation");
	feedback.textContent = isCorrect ? "Correct." : "Not quite.";
	feedback.className = `rh-feedback ${isCorrect ? "is-correct" : "is-incorrect"}`;
	explanation.hidden = false;
	explanation.innerHTML = `
		<p><span>Answer</span><strong${jpLangAttribute(question.answer)}>${escapeHtml(question.answer)}</strong></p>
		<p>${escapeHtml(question.explanation)}</p>
		<button class="practice-start rh-next" type="button" id="gp-next">Next <span aria-hidden="true">→</span></button>
	`;
	if (question.mode === "choice") {
		gpEls.body.querySelectorAll("[data-gp-choice]").forEach((button) => {
			button.disabled = true;
			const option = question.options[Number(button.dataset.gpChoice)];
			button.classList.toggle("is-correct", option === question.answer);
			button.classList.toggle("is-incorrect", option === value && !isCorrect);
		});
	} else {
		const form = gpEls.body.querySelector(".gp-answer");
		form.classList.add(isCorrect ? "is-correct" : "is-incorrect");
		form.querySelectorAll("input, button").forEach((control) => { control.disabled = true; });
	}
	gpEls.body.querySelector("#gp-next").focus();
}

function nextGrammarPracticeQuestion() {
	gpState.index += 1;
	showGrammarPracticeQuestion();
}

function finishGrammarPractice() {
	const answered = gpState.index + (gpState.answered ? 1 : 0);
	const total = Math.max(answered, gpState.queue.length);
	const accuracy = total ? Math.round((gpState.correct / total) * 100) : 0;
	gpEls.session.hidden = true;
	gpEls.complete.hidden = false;
	gpEls.result.textContent = `${gpState.sessionTitle || "Grammar session"} · ${gpState.correct} of ${total} correct`;
	gpEls["final-accuracy"].textContent = `${accuracy}%`;
	gpEls["final-correct"].textContent = `${gpState.correct}/${total}`;
	gpEls["final-bank"].textContent = `${gpState.bank.length} items`;
	gpEls.missed.innerHTML = gpState.missed.length
		? `<h4>Review these patterns</h4>${gpState.missed.slice(0, 6).map((question) => `<div class="pitch-missed-item"><span>${escapeHtml(question.kind)}</span><span lang="ja">${escapeHtml(question.answer)}</span><small>${escapeHtml(question.explanation)}</small></div>`).join("")}`
		: "";
}

function exitGrammarPractice() {
	if (!gpEls.session.hidden && gpState.answered) {
		finishGrammarPractice();
		return;
	}
	gpEls.session.hidden = true;
	gpEls.complete.hidden = true;
	gpEls.setup.hidden = false;
	gpEls.status.hidden = false;
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
		{ id: "conditional-ba", label: "Conditional 1 · ば", description: "Make the conditional 'if' form with ば.", build: (form) => form.conditionalBa },
		{ id: "conditional-tara", label: "Conditional 2 · たら", description: "Make the conditional 'if/when' form with たら.", build: (form) => form.past + "ら" },
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
			{ id: "conditional", label: "Conditional 1", build: (form) => form.conditional },
			{ id: "conditional-tara", label: "Conditional 2 · past", build: (form) => form.past + "ら" }
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
	const answer = pattern.build(buildConjugationForms(word, type));
	return { word, pattern, type, answer, kanjiAnswer: toKanjiConjugation(word, type, answer), missed: false };
}

function toKanjiConjugation(word, type, answer) {
	let kanji = String(word.kanji || "").replace(/[\s　]/g, "");
	let reading = String(word.reading || "").replace(/[\s　]/g, "");
	if (!kanji || !reading || kanji === reading || !/[\u4e00-\u9fff]/.test(kanji)) return "";
	if (type === "verb") {
		const verbType = getVerbType(word);
		if (verbType === "suru" && !reading.endsWith("する")) { reading += "する"; if (!kanji.endsWith("する")) kanji += "する"; }
		if (verbType === "kuru" && kanji.startsWith("来") && /^[くきこ]/.test(answer)) return "来" + answer.slice(1);
	}
	let tail = 0;
	while (tail < reading.length && tail < kanji.length - 1 && reading[reading.length - 1 - tail] === kanji[kanji.length - 1 - tail] && /[\u3040-\u309f]/.test(kanji[kanji.length - 1 - tail])) tail += 1;
	const readingPrefix = reading.slice(0, reading.length - tail);
	const kanjiPrefix = kanji.slice(0, kanji.length - tail);
	if (!answer.startsWith(readingPrefix)) return "";
	return kanjiPrefix + answer.slice(readingPrefix.length);
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

function ensureIrregularVerbs(selectedWords, pool, questionCount) {
	const required = questionCount >= 30 ? ["suru", "kuru"] : questionCount >= 20 ? ["irregular"] : [];
	const matches = (word, kind) => kind === "irregular" ? ["suru", "kuru"].includes(getVerbType(word)) : getVerbType(word) === kind;
	const protectedWords = new Set();
	required.forEach((kind) => {
		let word = selectedWords.find((item) => matches(item, kind));
		if (!word) {
			word = pool.find((item) => matches(item, kind));
			if (!word) return;
			const slot = selectedWords.findIndex((item) => !protectedWords.has(item) && !["suru", "kuru"].includes(getVerbType(item)));
			if (slot === -1) return;
			selectedWords[slot] = word;
		}
		protectedWords.add(word);
	});
}

let conjugationSinceSuru = 0;
let conjugationSinceKuru = 0;

function trackIrregularVerb(word) {
	const verbType = getVerbType(word);
	conjugationSinceSuru = verbType === "suru" ? 0 : conjugationSinceSuru + 1;
	conjugationSinceKuru = verbType === "kuru" ? 0 : conjugationSinceKuru + 1;
}

function pickEndlessWord(type, pool, previousId) {
	if (type === "verb") {
		const forced = conjugationSinceKuru >= 48 ? "kuru" : conjugationSinceSuru >= 48 ? "suru" : null;
		const match = forced && pool.find((word) => getVerbType(word) === forced && word.id !== previousId);
		if (match) return match;
	}
	const candidates = pool.filter((word) => word.id !== previousId);
	return candidates[Math.floor(Math.random() * candidates.length)] || pool[0];
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
	if (type === "verb" && mode !== "endless") ensureIrregularVerbs(selectedWords, pool, questionCount);
	const patternSequence = [];
	while (patternSequence.length < selectedWords.length) patternSequence.push(...shuffled(patterns));
	conjugationQueue = shuffled(selectedWords.map((word, index) => makeConjugationQuestion(word, patternSequence[index], type)));
	if (!conjugationQueue.length) return;
	conjugationIndex = 0;
	conjugationQuestionNumber = 1;
	conjugationSinceSuru = 0;
	conjugationSinceKuru = 0;
	if (mode === "endless") trackIrregularVerb(conjugationQueue[0].word);
	conjugationStats = { attempts: 0, correct: 0, streak: 0, bestStreak: 0, questionsAnswered: 0, patterns: {}, groups: {} };
	config.setup.hidden = true;
	conjugationComplete.hidden = true;
	conjugationCompleteTitle.textContent = "Practice complete";
	panel.append(conjugationSession, conjugationComplete);
	conjugationSession.hidden = false;
	conjugationLiveStats.hidden = false;
	document.body.classList.add("conjugation-fullscreen");
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
	updateConjugationStats();
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
	conjugationCheckButton.textContent = "›";
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
	const typed = hiraganaAnswer(conjugationAnswer.value);
	const isCorrect = typed === question.answer || (question.kanjiAnswer && typed === hiraganaAnswer(question.kanjiAnswer));
	recordConjugationAttempt(question.pattern, isCorrect, question);
	if (isCorrect) {
		conjugationFeedback.textContent = "Correct — nice conjugation!";
		conjugationFeedback.className = "answer-feedback is-correct";
		conjugationNextButton.hidden = false;
		conjugationNextButton.focus();
	} else {
		question.missed = true;
		conjugationFeedback.textContent = "Not quite. Study the form, then try typing it once more or move on.";
		conjugationFeedback.className = "answer-feedback is-incorrect";
		conjugationCorrection.innerHTML = `<span>Correct form</span><strong lang="ja">${escapeHtml(question.answer)}${question.kanjiAnswer ? ` (${escapeHtml(question.kanjiAnswer)})` : ""}</strong>`;
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
	conjugationLiveCorrect.textContent = String(conjugationStats.correct);
	conjugationLiveRemaining.textContent = activeConjugationConfig.mode === "endless" ? "∞" : String(Math.max(0, conjugationQueue.length - conjugationIndex));
	conjugationLiveAttempts.textContent = String(conjugationStats.attempts);
	conjugationLiveStreak.textContent = String(conjugationStats.streak);
	conjugationLiveBest.textContent = formatFormStat(best);
	conjugationLiveWorst.textContent = formatFormStat(worst);
	renderConjugationBreakdown(conjugationLiveBreakdown, "No mistakes yet — keep going!");
}

const verbGroups = [
	{ id: "group1", label: "Group 1 (godan)" },
	{ id: "group2", label: "Group 2 (ichidan)" },
	{ id: "group3", label: "Group 3 (irregular)" }
];

function getVerbGroupId(word) {
	const type = getVerbType(word);
	return type === "godan" ? "group1" : type === "ichidan" ? "group2" : type ? "group3" : null;
}

function recordConjugationAttempt(pattern, isCorrect, question) {
	const groupId = question?.type === "verb" ? getVerbGroupId(question.word) : null;
	if (groupId) {
		const group = conjugationStats.groups[groupId] || { attempts: 0, correct: 0 };
		group.attempts += 1;
		if (isCorrect) group.correct += 1;
		conjugationStats.groups[groupId] = group;
	}
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
	if (groupId) {
		patternStats.groups = patternStats.groups || {};
		const patternGroup = patternStats.groups[groupId] || { attempts: 0, correct: 0 };
		patternGroup.attempts += 1;
		if (isCorrect) patternGroup.correct += 1;
		patternStats.groups[groupId] = patternGroup;
	}
	conjugationStats.patterns[pattern.id] = patternStats;
	updateConjugationStats();
}

function retryConjugationQuestion() {
	conjugationAnswered = false;
	conjugationAnswer.value = "";
	conjugationAnswer.disabled = false;
	conjugationCheckButton.disabled = false;
	conjugationCorrection.hidden = true;
	conjugationTryAgainButton.hidden = true;
	conjugationNextButton.hidden = true;
	conjugationFeedback.textContent = "Try the form again (hiragana or kanji).";
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
		const word = pickEndlessWord(type, pool, previousId);
		trackIrregularVerb(word);
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
	document.body.classList.remove("conjugation-fullscreen");
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
	renderConjugationBreakdown();
}

function renderConjugationBreakdown(target = conjugationBreakdown, emptyMessage = "No mistakes this session — nothing to work on!") {
	const percent = (item) => `${Math.round((item.correct / item.attempts) * 100)}%`;
	const worst = Object.values(conjugationStats.patterns)
		.filter((form) => form.attempts > 0 && form.correct < form.attempts)
		.sort((a, b) => (a.correct / a.attempts) - (b.correct / b.attempts) || b.attempts - a.attempts)
		.slice(0, 3);
	target.innerHTML = `
		<section><h4>Top 3 to work on</h4>${worst.length
			? `<ol>${worst.map((form) => {
				const groupDetail = verbGroups.filter((group) => form.groups?.[group.id]).map((group) => `<span>${group.label.split(" ")[0]} ${group.label.split(" ")[1]} · ${percent(form.groups[group.id])} <small>(${form.groups[group.id].correct}/${form.groups[group.id].attempts})</small></span>`).join("");
				return `<li><div class="conjugation-breakdown-form"><span>${escapeHtml(form.label)}</span><strong>${percent(form)} <small>(${form.correct}/${form.attempts})</small></strong></div>${groupDetail ? `<div class="conjugation-breakdown-groups">${groupDetail}</div>` : ""}</li>`;
			}).join("")}</ol>`
			: `<p>${emptyMessage}</p>`}</section>`;
}

function exitConjugationPractice() {
	if (conjugationStats.attempts > 0) {
		finishConjugationPractice();
		return;
	}
	conjugationSession.hidden = true;
	document.body.classList.remove("conjugation-fullscreen");
	activeConjugationConfig.setup.hidden = false;
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
		renderWrongAnswerInfo(card.word);
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
document.querySelector("#worksheet-types").addEventListener("change", updateWorksheetSelection);
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
	if (event.target.closest("#worksheet-regenerate")) {
		const ids = new Set((worksheetOutput.dataset.entryIds || "").split("|"));
		renderGrammarWorksheet(grammarEntries.filter((entry) => ids.has(entry.id)));
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
readingTab.addEventListener("click", () => activateTab("reading"));
speakingTab.addEventListener("click", () => activateTab("speaking"));
document.querySelector(".content-tabs").addEventListener("keydown", (event) => {
	const tabs = [
		{ tab: vocabularyTab, name: "vocabulary" },
		{ tab: grammarTab, name: "grammar" },
		{ tab: readingTab, name: "reading" },
		{ tab: speakingTab, name: "speaking" }
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
hydrateGrammarPracticeNotes();
gpEls.setup.addEventListener("click", (event) => {
	const noteButton = event.target.closest("[data-gp-notes]");
	if (noteButton) {
		toggleGrammarPracticeNotes(noteButton);
		return;
	}
	const startButton = event.target.closest("[data-gp-start]");
	if (!startButton) return;
	const card = startButton.closest("[data-gp-session-card]");
	const count = Number(card?.querySelector("select")?.value || gpEls.count.value);
	startGrammarPractice(startButton.dataset.gpStart, count);
});
document.addEventListener("click", (event) => {
	if (event.target.closest("[data-gp-notes], [data-gp-note-tip], #gp-session-note-panel")) return;
	closeGrammarPracticeNotes();
});
gpEls.home.addEventListener("click", exitGrammarPractice);
gpEls["session-notes"].addEventListener("click", () => toggleGrammarPracticeNotes(gpEls["session-notes"]));
gpEls.again.addEventListener("click", () => {
	gpEls.complete.hidden = true;
	gpEls.setup.hidden = false;
	gpEls.status.hidden = false;
});
gpEls.body.addEventListener("click", (event) => {
	const next = event.target.closest("#gp-next");
	if (next) {
		nextGrammarPracticeQuestion();
		return;
	}
	const choice = event.target.closest("[data-gp-choice]");
	if (choice) {
		const question = gpState.queue[gpState.index];
		answerGrammarPractice(question.options[Number(choice.dataset.gpChoice)]);
	}
});
gpEls.body.addEventListener("submit", (event) => {
	if (!event.target.matches("#gp-answer-form")) return;
	event.preventDefault();
	const input = event.target.querySelector("input");
	if (input.value.trim()) answerGrammarPractice(input.value);
});

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") closeGrammarPracticeNotes();
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


const pitchState = { queue: [], index: 0, correct: 0, missed: [], answered: false };
const pitchEls = Object.fromEntries(["level", "include-previous", "count", "start", "status", "setup", "session", "progress-label", "end", "word", "reading", "meaning", "options", "feedback", "next", "complete", "result", "missed", "again"].map((id) => [id, document.querySelector(`#pitch-${id}`)]));

function getPitchWords() {
	const levels = getConjugationLevelPool(pitchEls.level.value, pitchEls["include-previous"].checked);
	return words.filter((word) => levels.includes(word.level) && splitMora(word.reading || "").length >= 2 && normalizePitchAccents(word.pitchAccent).length);
}

function updatePitchSetup() {
	const count = getPitchWords().length;
	pitchEls.status.textContent = count ? `${count.toLocaleString()} words with pitch data at this level.` : "No words with pitch data are loaded for this level yet.";
	pitchEls.start.disabled = !count;
}

function startPitchPractice() {
	const pool = shuffled(getPitchWords());
	if (!pool.length) return;
	Object.assign(pitchState, { queue: pool.slice(0, Math.min(Number(pitchEls.count.value), pool.length)), index: 0, correct: 0, missed: [], answered: false });
	pitchEls.setup.hidden = true;
	pitchEls.status.hidden = true;
	pitchEls.complete.hidden = true;
	pitchEls.session.hidden = false;
	showPitchQuestion();
}

function showPitchQuestion() {
	const word = pitchState.queue[pitchState.index];
	const accents = normalizePitchAccents(word.pitchAccent);
	const moraCount = splitMora(word.reading).length;
	const wrong = shuffled(Array.from({ length: moraCount + 1 }, (_, index) => index).filter((index) => !accents.includes(index))).slice(0, 3);
	const options = shuffled([accents[0], ...wrong]);
	pitchState.answered = false;
	pitchEls["progress-label"].textContent = `QUESTION ${pitchState.index + 1} OF ${pitchState.queue.length}`;
	pitchEls.word.textContent = word.kanji;
	pitchEls.reading.textContent = word.reading;
	pitchEls.meaning.textContent = word.meaning;
	pitchEls.options.innerHTML = options.map((downstep) => `<button type="button" class="pitch-option" data-downstep="${downstep}"><span class="pitch-contour">${renderPitchContour(word.reading, downstep)}<span class="pitch-particle ${downstep === 0 ? "is-high" : "is-low"}" aria-hidden="true">が</span></span></button>`).join("");
	pitchEls.feedback.textContent = "Which pitch pattern is correct?";
	pitchEls.feedback.className = "answer-feedback";
	pitchEls.next.hidden = true;
}

function answerPitchQuestion(button) {
	if (pitchState.answered) return;
	pitchState.answered = true;
	const word = pitchState.queue[pitchState.index];
	const accents = normalizePitchAccents(word.pitchAccent);
	const chosen = Number(button.dataset.downstep);
	const isCorrect = accents.includes(chosen);
	pitchEls.options.querySelectorAll(".pitch-option").forEach((option) => {
		option.disabled = true;
		if (accents.includes(Number(option.dataset.downstep))) option.classList.add("is-correct");
	});
	if (isCorrect) pitchState.correct += 1;
	else {
		button.classList.add("is-incorrect");
		pitchState.missed.push(word);
	}
	const kinds = accents.map((accent) => accent === 0 ? "Heiban (0)" : accent === 1 ? "Atamadaka (1)" : accent === splitMora(word.reading).length ? `Odaka (${accent})` : `Nakadaka (${accent})`).join(", ");
	pitchEls.feedback.textContent = isCorrect ? `Correct — ${kinds}.` : `Not quite. The pattern is ${kinds}.`;
	pitchEls.feedback.className = `answer-feedback ${isCorrect ? "is-correct" : "is-incorrect"}`;
	pitchEls.next.hidden = false;
	pitchEls.next.focus();
}

function nextPitchQuestion() {
	pitchState.index += 1;
	pitchState.answered = false;
	if (pitchState.index >= pitchState.queue.length) finishPitchPractice();
	else showPitchQuestion();
}

function finishPitchPractice() {
	const total = pitchState.index + (pitchState.answered ? 1 : 0);
	pitchEls.session.hidden = true;
	pitchEls.complete.hidden = false;
	pitchEls.result.textContent = `${pitchState.correct} of ${total} correct${total ? ` · ${Math.round((pitchState.correct / total) * 100)}%` : ""}`;
	pitchEls.missed.innerHTML = pitchState.missed.length
		? `<h4>Review these</h4>${pitchState.missed.map((word) => `<div class="pitch-missed-item"><span lang="ja">${escapeHtml(word.kanji)} · ${escapeHtml(word.reading)}</span>${normalizePitchAccents(word.pitchAccent).map((accent) => `<span class="pitch-contour">${renderPitchContour(word.reading, accent)}</span>`).join("")}</div>`).join("")}`
		: "";
}

pitchEls.level.addEventListener("change", updatePitchSetup);
pitchEls["include-previous"].addEventListener("change", updatePitchSetup);
pitchEls.start.addEventListener("click", startPitchPractice);
pitchEls.options.addEventListener("click", (event) => {
	const button = event.target.closest(".pitch-option");
	if (button) answerPitchQuestion(button);
});
pitchEls.next.addEventListener("click", nextPitchQuestion);
pitchEls.end.addEventListener("click", finishPitchPractice);
pitchEls.again.addEventListener("click", () => {
	pitchEls.complete.hidden = true;
	pitchEls.setup.hidden = false;
	pitchEls.status.hidden = false;
	updatePitchSetup();
});


function positionPitchHelp(help) {
	const tip = help.querySelector(".pitch-help-tip");
	if (!tip) return;
	tip.style.display = "block";
	const anchor = help.getBoundingClientRect();
	const tipRect = tip.getBoundingClientRect();
	const margin = 8;
	const below = anchor.bottom + 7;
	const top = below + tipRect.height <= window.innerHeight - margin ? below : Math.max(margin, anchor.top - 7 - tipRect.height);
	const left = Math.min(Math.max(margin, anchor.left - 6), window.innerWidth - tipRect.width - margin);
	tip.style.top = `${top}px`;
	tip.style.left = `${left}px`;
}

function hidePitchHelp(help) {
	const tip = help.querySelector(".pitch-help-tip");
	if (tip) tip.style.display = "";
}

document.addEventListener("mouseover", (event) => {
	const help = event.target.closest?.(".pitch-help");
	if (help) positionPitchHelp(help);
});
document.addEventListener("mouseout", (event) => {
	const help = event.target.closest?.(".pitch-help");
	if (help && !help.contains(event.relatedTarget)) hidePitchHelp(help);
});
document.addEventListener("focusin", (event) => {
	const help = event.target.closest?.(".pitch-help");
	if (help) positionPitchHelp(help);
});
document.addEventListener("focusout", (event) => {
	const help = event.target.closest?.(".pitch-help");
	if (help) hidePitchHelp(help);
});
window.addEventListener("scroll", () => document.querySelectorAll(".pitch-help-tip").forEach((tip) => { tip.style.display = ""; }), { passive: true });

for (const session of [practiceSession, pitchEls.session, gpEls.session]) {
	new MutationObserver(() => {
		document.body.classList.toggle("practice-fullscreen", !practiceSession.hidden || !pitchEls.session.hidden || !gpEls.session.hidden);
	}).observe(session, { attributes: true, attributeFilter: ["hidden"] });
}
