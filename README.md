# Kotoba — Japanese Dictionary

A static Japanese vocabulary, grammar, and practice site.

## Furigana

`furigana.js` matches authored word readings using Japanese word boundaries,
with explicit irregular-verb and counter readings. The renderer draws on all
ten lesson reading lists plus the shared comparison vocabulary, and leaves
kana endings outside ruby. It does not infer readings for arbitrary unknown
words. Unknown compounds remain plain rather than receiving misleading
character-by-character readings. Ambiguous authored text can use
`{辛い|つらい}` or `{辛い|からい}` to select the intended reading.
These display annotations do not change answer grading.
Run `node --test furigana.test.js` for regression checks.

## Open the site

Open `index.html` in a browser or serve this directory with any static web server.
The root page forwards to `main.html`, which loads the site assets and remote JLPT
vocabulary and grammar datasets.

## Publish with GitHub Pages

1. Create a public GitHub repository and push the project files to its `main` branch.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and `/ (root)`, then save.
5. Wait for the Pages deployment. The site URL will be shown in the Pages settings.

The site uses no build step. Vocabulary and grammar datasets are loaded from the
OpenJLPT CDN, so those features require an internet connection. Saved words and
practice progress are stored in the current browser.

## Developer checks

Run `node grammar-audit.js` to audit generated grammar practice questions for
missing context, duplicated choices, answer/option mismatches, and format drift.
Use `node grammar-audit.js --session comparison` to inspect one session.

Run `node --test comparison-practice.test.js` for comparison logic, accepted
answers, question construction, session diversity, and Review/Boss routing.
With Playwright installed, run `node comparison-browser-test.js` for a complete
Review, Boss routing, answer feedback, and desktop/mobile layout checks.
Set `PLAYWRIGHT_CHANNEL=chrome` to use an installed Chrome instead of bundled
Chromium; `COMPARISON_TEST_URL` can point the browser checks at a deployed site.

See [COMPARISON_DESIGN.md](COMPARISON_DESIGN.md) for the comparison generator's
teaching rules, architecture, and extension checklist.

Run `node --test time-practice.test.js` for the Time unit's temporal reasoning,
grading, semantic constraints, diversity, and routing checks. The browser harness
also supports `GRAMMAR_TEST_UNIT=time node comparison-browser-test.js` and an
optional `GRAMMAR_TEST_URL` for deployment checks. See [TIME_DESIGN.md](TIME_DESIGN.md)
for this unit's grammar rules and extension requirements.

Session 03 has equivalent checks: `node --test invitation-practice.test.js` and
`GRAMMAR_TEST_UNIT=invitation node comparison-browser-test.js`. See
[INVITATION_DESIGN.md](INVITATION_DESIGN.md) for its intention/actor model,
accepted alternatives, twelve task formats, and compatibility constraints.

Units 04 and 05 now use contextual ability/perception and experience/recurrence
engines. Run `node --test ability-experience.test.js`; the browser harness accepts
`GRAMMAR_TEST_UNIT=ability` and `GRAMMAR_TEST_UNIT=experience`. See
[ABILITY_EXPERIENCE_DESIGN.md](ABILITY_EXPERIENCE_DESIGN.md) for teaching rules,
grading boundaries, diversity checks, and follow-on work.

## Boss 01-05 pilot

Boss 01-05 is now a ten-question cross-unit pilot, separate from focused Review.
Eight contextual choice questions lead into two one-sentence writing challenges,
without naming the target grammar in advance. Thirty situation families each
have four fact variants. Each round draws two families per unit and avoids the
previous two rounds' families. The writing finale draws from all five units.
Boss 06-10 follows the same ten-question format; later Boss blocks are unchanged.

Inspect [BOSS_PILOT_SAMPLE.md](BOSS_PILOT_SAMPLE.md) for Japanese questions with
English passages and an answer key. Regenerate it with
`node boss-pilot-preview.js --write`. See
[BOSS_PILOT_DESIGN.md](BOSS_PILOT_DESIGN.md) for coverage, limits, and extension rules.

Run `node --test boss-practice.test.js` and, with Playwright available,
`PLAYWRIGHT_CHANNEL=chrome node boss-browser-test.js`. The browser test supports
`GRAMMAR_TEST_URL` and checks scoring, selected-answer feedback, hidden hints,
variant freshness, and every pilot item at desktop and mobile widths.

## Compact Review Answers

Review in Units 01-10 uses short grammar blanks and dropdowns inside explicit
Japanese sentence frames. Names, objects and unrelated vocabulary are supplied;
grammar choices, meaning, roles and polarity are still assessed. Full-sentence
writing is reserved for the last two questions of Boss 01-05 and Boss 06-10.
Later Boss blocks and legacy units are unchanged.

See [RESPONSE_DESIGN.md](RESPONSE_DESIGN.md). Run
`node --test response-practice.test.js` to check reconstructed sentences, kana,
independent blank grading, typing reduction and the Boss writing boundary.

Review favors using and interpreting the grammar over reading long setups.
Ten-question rounds contain at least seven compact grammar responses, with
brief context and clearly distinguished keep/reverse/correct instructions.

See [QUALITY_PASS.md](QUALITY_PASS.md) for counterfactual and grammar-first
regression tests. Run `node --test quality-practice.test.js` for neutral labels,
meaning-sensitive answers, scenario rotation, writing coverage, and kana
acceptance. `node review-feedback-browser-test.js` completes ten-question rounds
for all five units at desktop and mobile sizes, checking scores and visible
results rather than merely checking whether the result elements exist.

## Units 06-10

Permission, desire, appearance, reasons and purpose use separate grammar-first
generators with brief contexts, meaning-sensitive options, checked conjugations,
and 10/25/40-question Reviews. Boss 06-10 combines two units per item and ends
with two short writing challenges. These routes exclude the old question packs.

See [UNITS_06_10.md](UNITS_06_10.md) for coverage, finite variety, grammar rules
and grading limits. Run `node --test units-six-ten.test.js` and
`PLAYWRIGHT_CHANNEL=chrome node units-six-ten-browser-test.js` for generation,
grading, freshness, scoring and desktop/mobile checks. The browser test accepts
`GRAMMAR_TEST_URL` for live verification. Listening is unchanged.

## Reading Comprehension Expansion

`reading-content.js` adds 12 authored passages (six compact, six longer) and
36 questions to the existing reading bank. These include paired notices,
polite refusals, omitted subjects, referents, practical constraints, and
contrasting information. Reference tracking and purpose/interpretation can be
selected independently. Every new question has exact passage evidence and
feedback for each distractor. The legacy detail questions remain available.

Bank-backed reading modes now select at most one question per source in a round,
balance question skills where the filtered bank permits, shuffle choices at
session start, and prefer sources not among the last 60 answered in that mode.
This history is optional local browser storage, not adaptive difficulty.
Requested counts are capped at the number of distinct eligible sources; the
progress counter displays the actual count. Empty filters no longer fall back
to unrelated content. Grammar stacking uses curated verbs and reviewed chains,
with duplicate final forms excluded from a round.

Results show accuracy by reading skill and explanatory missed-item feedback.
Answer-revealing pattern, mood, and clause-role hints are withheld until grading.
Dialogue and paired-notice line breaks are preserved.

Run `node --test reading-content.test.js` for content integrity and selection
tests. With Playwright available, run
`PLAYWRIGHT_CHANNEL=chrome node reading-browser-test.js` for all 36 new questions,
normal ten-question selection, the other bank-backed modes, and visible results
at 1440, 390, and 320 pixels. `READING_TEST_URL` can point at the deployed page.

## Eight-Mode Reading Quality Pass

`reading-skills.js` adds Reference Tracking (20 original texts) and Sentence
Connections (20 situations, each with connector, continuation, and relationship
tasks). A round never repeats a situation just to ask its other task variants.
`reading-quality.js` supplies authored quotation analyses, clause roles,
context-sensitive mood counterexamples, and reviewed stacking combinations.

See `READING_QUALITY.md` for the audit scope, safeguards, and verification.
Run `node --test reading-content.test.js reading-quality.test.js` and, with
Playwright available, `PLAYWRIGHT_CHANNEL=chrome node reading-quality-browser-test.js`.
