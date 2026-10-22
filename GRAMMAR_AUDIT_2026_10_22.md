# Grammar Learning Audit: October 22, 2026

## Scope and Result

Inspected all 25 core grammar banks, their lesson modules, shared selection and
grading, and all five Boss banks. Ran the existing 143 tests and structural audit
over 18,251 generated items across 30 sessions. Both passed.

The mechanical foundation is working. That is not sufficient evidence that all
25 units meet the same teaching standard. Units 1-5 have more developed meaning
and role variations; later blocks frequently multiply a small decision by many
nouns. The next pass should strengthen assessment, feedback, and coverage before
increasing generated-item counts.

This was a code/content audit plus runtime reproductions, not a native-teacher
review of every generated sentence or a fresh browser pass across all units.
No lesson behavior was changed during this audit.

## Confirmed Bugs

### 1. A valid causative-passive alternative fails Boss grading

Location: `boss-twentyone-twentyfive.js:13`.

Boss item `coercion-decision-0:0` accepts:

> 私は田中さんに本を読ませられる。新聞を読むことにしました。

Replacing 読ませられる with 読まされる receives `correct: false`, although
Review explicitly accepts both. The Japan Foundation documents these two forms:
[causative-passive forms](https://www.kyozai.jpf.go.jp/kyozai/material/BMA00076/ja/render.do).

Fix: derive Boss writing alternatives from the same checked form data as Review;
test standard and contracted forms through the actual Boss writing grader. Do
not solve this by globally normalizing unrelated verb endings.

### 2. Offered wrong options are described as unrecognized wording

Locations: `grammar-practice-core.js:67`, `drill-kit.js:14`, and newer lesson gaps.

Example: select あげました for a favor Tanaka did for you. Feedback says:
"This wording is not among the checked answers ... an unmatched answer is not
automatically bad Japanese." But this is a known, deliberately offered option.

Across Units 6-25, 4,185 generated dropdown fields have no authored contrast
feedback. These are lexical/generated instances, not 4,185 distinct mistakes.

Fix: reserve unknown-wording feedback for unrecognized typed answers. Each
offered distractor should explain its changed actor, polarity, timing, scope,
or speech act. For this example: "あげる presents a favor outward; here the
benefit comes to you, so use くれる with Tanaka as subject."

### 3. Some display readings still group whole phrases into ruby

Locations: `desire-practice.js:17`, `purpose-practice.js` readings, and the shared
display-reading aggregation in `script.js:293`.

Reproduced output:

```html
<ruby>仕事が見<rt>しごとがみ</rt></ruby>つかるといいですね。
<ruby>みんなに字が見<rt>みんなにじがみ</rt></ruby>えるように、
<ruby>大きく書<rt>おおきくか</rt></ruby>きます。
```

The pronunciation text is not necessarily wrong, but the grouping is confusing
and includes particles and kana in oversized ruby units.

Fix: keep grading aliases separate from word-level display readings throughout
Units 6-10, as newer modules already do. Validate the actual ruby boundaries,
not merely the presence of a reading over every kanji.

## Assessment Weaknesses

### Repetition is still present inside the larger banks

In Units 6-25, 55 of 127 task identifiers have only one canonical answer string
across all their generated variants. Some introductory attachment drills should
be predictable; this count is a review flag, not a claim that 55 tasks are wrong.

The strongest example is Unit 23: all nine task types have a fixed answer string
within the task. Changing the noun does not change the key actor/beneficiary
decision. Unit 17's question-content task always asks for TIME and answers いつ.
Unit 18 contrasts intention with a past belief while supplying 明日 in the frame,
making the tense clue enough to eliminate the distractor.

Improve with paired items: keep the vocabulary and visible answer frame similar,
then change one fact that changes the answer. For example, vary who did a favor,
whose perspective is retained, or whether a sentence reports words or an unknown
question. Include recognition and interpretation as well as guided construction.

### Boss prompts sometimes name the answer construction

Location: `boss-twentyone-twentyfive.js:19` and following structures.

Prompts explicitly name てくれる, てもらう, passive, causative-passive, or the exact
helper choices. Such guidance is useful during practice, but makes Boss less
effective at checking independent grammar selection.

Keep enough constraints to make writing assessable. For the eight choice items,
describe the intended event in concise English and let the learner identify the
construction. Add combined decisions within one coherent event, alongside the
current two mostly independent sentences. Avoid expanding Japanese setup text.

### Vocabulary coverage has split into parallel pools

The original grammar verb pool has 33 entries. The newer discourse/voice action
pool uses ten verbs. The active/passive/causative data omit bare する, bare 来る,
intransitive verbs, and several godan ending classes. The favor helper pool does
include する compounds, but these do not extend the voice exercises.

Fix: connect lesson-specific compatibility rules to the shared tagged pools.
Add checked inflections and semantic frames together, rather than allowing every
noun to pair with every verb. Include intransitive causatives, direct-person
passives, and public-event passives as separately authored compatible frames.

### Dropdown rendering bypasses furigana

Location: `script.js:7575`.

Native option text is escaped and rendered as plain Japanese, while surrounding
text uses the furigana renderer. The existing reading-coverage tests render the
option strings independently; they do not prove readings appear inside the
actual control. Consider concise kana support for kanji options, or accessible
option controls that can display ruby. Preserve keyboard and mobile usability.

## Unit-by-Unit Next Pass

These are recommended additions, not assertions that the existing items are all
incorrect. Priority reflects the current assessment weaknesses and user's goals.

| Unit | Best next improvement |
| --- | --- |
| 01 Comparison | Preserve the varied direction/role work; make near-equivalent distractors depend on direction, equality, or missing evidence rather than unrelated rules. |
| 02 Time | Keep overlap/stage/deadline contrasts; add matched boundary cases with minimal setup. |
| 03 Invitations | Keep participant changes; vary relationship/register while keeping invitations, suggestions, and offers distinguishable from the utterance. |
| 04 Ability | Broaden ability versus permission/opportunity and perception; keep contextual evidence short. |
| 05 Experience | More same-vocabulary contrasts between one dated event, experience, and occasional practice. |
| 06 Permission | Diagnose forbidden versus unnecessary specifically; reduce explicit rule-label dependence in later practice. |
| 07 Desire | Repair display ruby; vary whose wish is observed/reported and negative scope. |
| 08 Appearance | Rotate evidence source while preserving the same proposition; broaden negative variants with checked alternatives. |
| 09 Reasons | Give specific cause/contrast feedback and add edits that change the logical relationship with the same vocabulary. |
| 10 Purpose | Repair ruby; strengthen choosing between intentional goals and desired outcomes, not just purpose versus unrelated connectors. |
| 11 Listing | More example-list versus sequence versus parallel-reason minimal pairs; rotate inclusion and exclusion where meaningful. |
| 12 Certainty | Strengthen evidence-sensitive choices between possibility, expectation, and impression; reduce repeated abstract knowledge-limit answers. |
| 13 Advice | Keep recommendations versus directives; make both positive and negative recommendations plausible distractors. |
| 14 Conditionals | More short same-event comparisons with timing and speaker intention; continue accepting legitimate overlaps. |
| 15 Tara/Nara | Expand changes to timing with the same follow-up; reduce fixed-link noun variants. |
| 16 Concession | Vary whether the result holds regardless, follows because of a cause, or contradicts expectations; use short actual utterances. |
| 17 Quotation | Rotate who/what/where/when/whether and statement-versus-question frames; add noun/na-adjective embedding. |
| 18 Intention | Compare past/present intentions and actual outcomes without 明日 automatically eliminating the wrong option. |
| 19 Hearsay | Same proposition with different reported sources, tense, negation, and evidential stance; retain overlaps. |
| 20 Change | Add noun-state changes and ability/habit changes with more natural action-specific contexts. |
| 21 Decisions | More changes between personal choice and settled outcome using identical action vocabulary; reduce fixed noun-link drills. |
| 22 Te helpers | Add compatible mistakes, preparation, retained states, and neutral completion; vary the intended helper within similar frames. |
| 23 Giving | Highest redesign priority: rotate performers, receivers, beneficiaries, and viewpoint within the same task format. |
| 24 Passive | Add direct-person and public-event frames; avoid applying the possession template to every object. |
| 25 Causative | Add intransitive patterns and omitted-participant interpretation; cover する/来る and propagate accepted contractions into Boss. |

## Recommended Order

1. Correct the Boss alternative mismatch and known-option feedback; fix phrase
   ruby and inspect the real dropdown display.
2. Redesign fixed-answer task families in 17-19 and 21-25, starting with Giving.
   Preserve short responses and restrict full writing to Boss finales.
3. Extend semantic compatibility and inflection coverage from the shared pools.
4. Make Boss choice prompts require selecting the grammar, with concise meaning
   constraints rather than construction names.
5. Add regression cases where one changed fact must change the answer; measure
   semantic decisions separately from noun variants and generated-item counts.

No adaptive Review is proposed. Existing 10/25/40 Reviews, ten-question Boss
structure, and visible session statistics remain the starting point.

## Reproduction

```sh
node --test --test-reporter=dot '*.test.js'
node grammar-audit.js --strict
node grammar-learning-audit.js
```

The new inspection script prints all 25 unit profiles plus the three concrete
grading/display reproductions. It deliberately does not assign a numerical
"teacher quality" score from counts alone.
