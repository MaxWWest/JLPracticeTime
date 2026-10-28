# N4 Grammar Mock Tests

## Scope

Grammar > N4 Mock Test is a separate assessment flow, not the old mixed-practice
queue. Three original papers contain 25 questions each. The supplied textbook
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

- Each paper is fixed and authored. Retaking changes option positions, not the
  underlying questions. Papers A, B and C provide 75 original items.
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

## Implementation

- `n4-mock-test.js`: content, readings, seeded option randomization, scoring,
  validated state restoration. Correct option positions are balanced 6/6/6/7.
- `n4-mock-ui.js`: test setup, editable choices, review flags, navigation,
  submit confirmation, results and answer review.
- `n4-mock.css`: isolated responsive styles.
- `main.html` and `script.js`: final grammar subtab and panel registration.

The latest attempt is stored under `kotoba-n4-mock-v1` in localStorage, including
paper, seed, answers, flags, current question, elapsed time and submission state.
Reloading offers Resume test or View results. A new paper replaces the latest
completed attempt; this initial version does not keep a multi-attempt history.
Starting another paper is blocked while an attempt is unfinished.

Answers are not marked until the final confirmation. Submitting locks all answers.
Each item earns one raw point; unanswered items earn zero. Results include total
accuracy, section scores, omissions, elapsed time and per-question explanations.
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

The new unit tests check all 75 answer keys, paper structure, seeded shuffling,
raw/section scores, corrupted saves, kanji coverage and composition regressions.
These structural checks do not substitute for Japanese editorial review.

The browser test completes all three papers at 1440px, 390px and 320px, with wrong
and skipped answers, clearing/revising choices, review flags, save/reload/resume,
cancel/Escape/confirm submission, retained results, furigana toggle, overflow checks,
the direct URL and unavailable browser storage. Screenshots are saved in /tmp.
