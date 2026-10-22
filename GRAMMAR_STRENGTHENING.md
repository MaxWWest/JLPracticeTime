# Grammar Audit Follow-Up

Implemented October 22, 2026. The dated audit remains a record of the earlier
state; run `node grammar-learning-audit.js` for current reproductions.

## Correctness and Feedback

- Boss 21-25 writing now accepts the checked contracted causative-passive forms
  already accepted in Review, while rejecting a change to causative viewpoint.
- Shared grading recognizes an offered wrong option. It uses authored option
  feedback when available, otherwise the lesson's explanation. Unknown typed
  wording retains separate, limited-coverage feedback.
- Giving has specific feedback explaining the performer and benefit direction.
- Display-only readings are separated from grading aliases in Desire and Purpose.
  Grading phrases reintroduced by other banks are excluded from display lookup.
- Furigana tokens expose their full reading. Native dropdowns show kana beside
  kanji options while preserving the original Japanese answer values.

## Stronger Meaning Decisions

- Giving rotates performer, beneficiary, and viewpoint within the same task.
  The identical `私は田中さんに...` frame now requires あげました or もらいました
  depending on who acted for whom. Receiver-view rewrites rotate the two people.
  Respectful performer and humble receiver viewpoints both occur.
- Giving previously had nine task identifiers with one fixed answer each. It now
  has four role-sensitive task types with multiple answers, plus three simple
  introductory object-transfer types.
- Quotation questions rotate time, place, object, and actor, instead of always
  asking for time.
- Intention contrasts intention with past belief inside the same thought frame,
  without a fixed 明日 cue. Another task distinguishes the past plan from whether
  it was carried out.
- Hearsay-versus-appearance interpretation now changes the evidence source within
  the same task and vocabulary.
- Decisions now contrast a personal decision, settled arrangement, and actual
  completed event with the same answer frame and vocabulary.
- Open-ended computer/dictionary-use actions are excluded from exercises asking
  for full completion; trial and preparation remain available.

## Voice Coverage and Boss

Added authored frames for intransitive actions and the 行く, 来る, 待つ, 泳ぐ,
遊ぶ, 休む, する, and 話す inflections. Accepted causee marking is checked per
frame, including both に and を where the intransitive construction allows them.
Added direct-person passive questions with rotating affected person and doer.

Boss 11-15, 16-20, and 21-25 choice prompts now omit parenthetical construction
names and explicit Japanese form instructions. Full writing retains the needed
constraints. The eight-choice/two-final-writing structure remains intact.

## Verification

- 152 Node tests, including counterfactual role changes, valid Boss contractions,
  kana answers, voice roles, word-level ruby, and known-choice feedback.
- Full structural audit passed over roughly 19,000 generated items. This is a
  mechanical check, not a count of independent teaching situations.
- Desktop/mobile rounds passed for affected modules and Boss blocks, with
  deliberate errors and verified 8/10, 80% result screens.
- Actual native dropdown labels are checked for kana readings, and every tested
  task type is checked at 1440, 390, and 320 pixels for overflow/page errors.
- Browser regression checks passed for Units 1-5.

Further work remains in consolidating the parallel vocabulary pools, authoring
option-specific diagnoses beyond Giving, and expanding the still-predictable
introductory tasks. This pass addresses the reproduced bugs and several of the
largest assessment weaknesses; it does not certify every generated sentence as
equally natural or difficult. Changes are saved locally, awaiting publication.
