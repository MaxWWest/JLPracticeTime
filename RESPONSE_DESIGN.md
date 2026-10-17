# Compact Grammar Responses

## Scope

Units 01-05 Review and manual retries use compact responses. Boss 01-05 keeps
eight quick choices and ends with two short written sentences. No extra cases
are appended, counts stay at ten, and adaptive review remains off. Units 06-25
and their Boss blocks are not migrated by this change.

## Teaching Boundaries

- Comparisons: supply adjectives; assess particles and the direction of the
  relationship. Vary the order of the two comparison phrases. In negative
  frames, choose the topic and benchmark instead of typing their names.
- Time: choose the correct verb-stage chunk, arrange simultaneous actions around
  a typed link, or fill the duration/deadline marker. Do not quiz verb spelling.
- Invitations: select participants and the agreed day where relevant, then type
  the invitation, proposal or offer ending. Accept both natural joint invitation
  question forms when the context permits them.
- Ability: complete the ability, availability or perception predicate. Keep
  positive/negative and short-potential versus dictionary-form constructions
  distinct; supplying the object is not supplying the grammatical answer.
- Experience: choose the clause that distinguishes lifetime experience,
  recurrence and the two different scopes of negation.

Every control starts empty. Choices shuffle independently of their correct
value. No answer-shaped placeholders or preselected answers are used. Each gap
is labelled, graded and marked independently; after submission the feedback
reassembles the complete Japanese sentence. Enter advances between short typed
blanks, and IME confirmation must not submit the form.

## Implementation

Lesson engines author `responseSpec` using `GrammarPracticeCore.cloze`. Rows
contain literal Japanese plus field references, not text split by guessed
Japanese word boundaries. `gap` creates a short input or a dropdown; `tailField`
removes only an explicitly authored prefix from checked answers and contrasts.

The original full-answer records remain as a semantic reference and for tests.
Actual Review selection and manual retries call `compact`, which replaces the
response fields and instructions without changing the passage or target facts.
Boss production fields have no compact specification. `completeResponse`
reconstructs model and learner sentences for post-answer feedback.

## Verification

`response-practice.test.js` checks all compact frame constructions against the
original full-sentence grader, independent errors, kana acceptance, meaningful
contrasts, empty placeholders, unchanged twelve-task Review mixes and more than
60% less required typing in each upgraded unit's bank. This measures required
characters, not learner completion time or educational equivalence.

The existing Review browser harness covers all five units, full 25-question
rounds, manual retries and all twelve presentation types at 1440/390/320px.
The Boss harness covers the real 8+2 sequence, mixed-result scoring and all fact
variants. `response-browser-test.js` checks the longest dropdowns for clipping,
IME confirmation, Enter navigation and reassembled feedback. The task mix is
unchanged, but learner testing is still needed to
calibrate the difficulty of selecting clauses versus producing them unaided.
