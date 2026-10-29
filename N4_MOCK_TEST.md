# N4 Grammar Mock Tests

## Scope

Grammar > N4 Mock Test is a separate assessment flow, not the old mixed-practice
queue. New attempts are assembled from an authored bank and contain 25 questions.
The three original fixed papers remain available only for saved attempts. The supplied textbook
pages informed the structure, not the wording:

- Questions 1-15: four-option grammar forms in short sentences/dialogues.
- Questions 16-20: four-part sentence composition; choose the part at the third,
  starred position.
- Questions 21-25: five numbered gaps in one coherent passage.

These are unofficial grammar-only practice papers, not a complete JLPT exam.
The 15/5/5 counts follow the supplied pages. No official grammar-only time limit,
scaled score, or pass prediction is claimed. The official item-type reference is
https://www.jlpt.jp/e/guideline/testsections.html.

## Content Rules

- The bank contains 150 short grammar items, 42 compositions, and 12 complete
  passages with five questions each (252 items total). This includes the revised
  original 75 items. Related authored variants share family tags; these are not
  252 independent grammar patterns or freely interchangeable vocabulary slots.
- Each item has four distinct options, one intended best answer and feedback.
- Short Japanese context serves the grammar decision. No pre-answer translation,
  grammar-topic label, explanation, feedback color or answer placeholder is shown.
- Composition slots must have one defensible starred answer. Movable phrases
  outside the tested sequence are anchored in the fixed prefix. Multiple possible
  orders are harmless only if the starred answer is unchanged.
- The passage section intentionally tests connected text, unlike the short form
  section. All five gaps remain visible, and selecting a gap opens its choices.
- Shared furigana plus scoped authored readings cover questions, choices and
  feedback. The existing global furigana toggle still applies.

## Fixed-Paper Revision (2026-10-29)

All 75 items have an explicit grammar focus, cognitive demand, practice destination,
and a rationale for each wrong choice. Weak items were revised rather than adding
more papers before checking this set. The comparison items now test direction and
the difference between relative and absolute claims; the trial-action item contrasts
four present-tense auxiliaries instead of giving itself away through past tense.
The passages are a personal account, an event notice and an email. Their gaps cover
sequence, funding and obligation, weather contingencies, reference to a situation,
benefit direction, an existing result and alternative plans.

The six-domain blueprint below is an authored coverage constraint, not empirical
difficulty calibration. Every paper also includes formation, meaning, composition
and discourse decisions. Counts may differ because each paper has different items.

| Domain | A | B | C |
| --- | ---: | ---: | ---: |
| Particles and comparisons | 4 | 3 | 4 |
| Time and action states | 6 | 3 | 6 |
| Intention and judgment | 4 | 6 | 3 |
| Connections between ideas | 4 | 6 | 6 |
| Who acts and who benefits | 3 | 2 | 3 |
| Sentence and quotation structure | 4 | 5 | 3 |

Editorial gate for any future item:

1. State the tested distinction before writing the choices.
2. Complete the sentence with every option; reject plausible competing answers.
3. Keep context only when it resolves the grammar decision.
4. Write a specific rationale for every distractor, including when it would fit.
5. Check tense, participant roles, scope and reference across the full passage.
6. For composition, consider movable phrases and alternate valid starred answers.
7. Check displayed readings, then test the item at desktop and mobile widths.

An automated answer-key check cannot establish linguistic uniqueness, calibrated
difficulty or predictive validity. Independent Japanese-teacher editorial review
and learner response data are still needed before making those stronger claims.
Do not describe these papers as official, certified, calibrated or a pass predictor.

## Generated Edition

The A/B/C selector is replaced with Generate a new test. Selection is seeded and
deterministic for a given history. It selects one intact passage, five compositions,
and fifteen forms (two formation decisions and thirteen meaning decisions).
All six grammar domains have 2-6 questions in every test. This is a coverage rule,
not empirical difficulty calibration. Options are balanced 6/6/6/7 across positions.

No two short questions from the same family appear within one test. Selection
prioritizes fewer previous appearances, then avoids families seen in the last three
completed attempts, then balances domain counts and uses least-recent exposure.
Coverage constraints can force a family to return sooner. Passages are selected by
fewest appearances, so all twelve appear before a repeat in a fresh saved history.
The latest 100 completed attempts are the exposure window; clearing browser data
also clears it. This is not adaptive performance-based selection.

Snapshots contain the exact prompts, passage, options, answer keys and feedback
for the attempt. A seed alone would not preserve those after a bank edit, so resume
and historical scoring use the snapshot, never regenerate against current content.
An exposure count on results distinguishes exact previously seen items; related
variants can still feel familiar, and the count is not a claim about unfamiliar grammar.

## Implementation

- `n4-mock-test.js`: content, readings, seeded option randomization, scoring,
  validated state restoration for the revised fixed papers.
- `n4-mock-bank.js`: additional reviewed families, compositions, nine new passages,
  per-distractor feedback and scoped display readings.
- `n4-mock-generator.js`: balanced assembly, exposure tracking, full snapshots,
  validation and migration across the three content versions.
- `n4-mock-review.js`: item-level teaching notes, grammar domains, contrast examples,
  wrong-choice feedback and links to existing practice units.
- `n4-mock-v1.js`: frozen original content/runtime for saved original-edition attempts.
  Do not edit its question wording, option order, answer keys or shuffle behavior.
- `n4-mock-ui.js`: test setup, editable choices, review flags, navigation,
  submit confirmation, results and answer review.
- `n4-mock.css`: isolated responsive styles.
- `main.html` and `script.js`: final grammar subtab and panel registration.

The library is stored under `kotoba-n4-mock-v3` in localStorage: an active attempt
and the latest 100 completed attempts. Each has a stable id, content version, paper,
seed, answers, flags, position, elapsed time and available start/completion timestamps.
Original `kotoba-n4-mock-v1` and revised `kotoba-n4-mock-v2` saves migrate without
deletion or regrading. They continue to use their fixed questions; dates not originally
recorded remain unknown. New attempts use the generated edition. Reviewing a historical attempt never
replaces the active attempt. Starting another paper is blocked while one is unfinished.
Storage failure leaves the in-memory attempt usable and displays a warning.

Answers are not marked until the final confirmation. Submitting locks all answers.
Each item earns one raw point; unanswered items earn zero. Results include total
accuracy, section scores, omissions, elapsed time and per-question explanations.
Revised results also show per-domain correct/tested counts (not mastery ratings),
feedback for the selected wrong answer, short contrast examples, expandable notes
on other choices, and optional ten-question practice in the corresponding existing
unit. Practice is learner-initiated; it does not inject adaptive questions into a test.
History and exposure labels distinguish repeated questions from first recorded appearances.
Tests are newly assembled from finite authored content, not unlimited freshly authored questions.
Composition review shows the whole ordered sentence; passage review fills all gaps.
Elapsed time pauses when the tab/panel is hidden or the learner exits the test.
This is a client-side study tool, not a secure proctored assessment.

The URL parameter `?mock=n4` opens the new subtab directly. Existing practice,
Boss and particle sessions keep their own queues and progress.

## Verification

```sh
node --test *.test.js
node grammar-audit.js --strict
NODE_PATH=/path/to/node_modules node n4-mock-browser-test.js
NODE_PATH=/path/to/node_modules node particle-browser-test.js
```

The unit tests check all 75 revised and original answer keys, paper structure, seeded
shuffling, raw/section/domain scores, corrupted saves, history limits, migration,
wrong-choice feedback coverage, practice destinations, readings and composition
regressions.
These structural checks do not substitute for Japanese editorial review.

The generator tests cover 500 deterministic seeds, 180 history-aware generations,
domain limits, family uniqueness, full display readings, feedback, content-update
snapshot stability, both fixed-edition migrations and corrupt snapshot rejection.
The browser test completes three generated tests at 1440px, 390px and 320px, with wrong
and skipped answers, clearing/revising choices, review flags, save/reload/resume,
cancel/Escape/confirm submission, retained results, furigana toggle, overflow checks,
the direct URL and unavailable browser storage. They also check original-edition
resume/scoring, history review while a new attempt is unfinished, wrong-choice notes
and launching relevant practice without losing the active mock attempt.
Screenshots are saved in /tmp.
