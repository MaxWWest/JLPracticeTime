# Reading Quality Pass

## Scope

This pass covers all eight Reading modes. It is a content and implementation
review, not independent certification by a Japanese-language teacher. It does
not certify the separate Listening or Grammar catalogs.

## Teaching Contract

- Test the intended interpretation, not a guessed keyword or a leaked answer.
- Use short original texts when a short text is enough.
- Give one supported answer among the offered choices. Do not put synonymous
  connectors or overlapping classifications in competition.
- Resolve references from the discourse, including whole events, non-nearest
  antecedents, and later explanations. Avoid absolute rules about ko/so words.
- Distinguish the narrator's attitude from a quoted person's emotion.
- Preserve furigana, selectable boundaries, mobile layout, and visible results.
- Explain the answer after grading. Do not reveal it in the setup.

## Modes Reviewed

| Mode | Changes and checks |
| --- | --- |
| Grammar stacking | Curated verb pool and coherent chains replace unrestricted combinations. Hidden-base and layer-meaning tasks no longer expose the answer. Unique final forms within a round; recent-form avoidance where capacity permits. |
| Sentence breaks | Authored role labels for all 74 texts, replacing suffix guesses. Cause, sequence, condition, and continuing state are distinguished. Every marking boundary tested with furigana enabled. |
| Said and thought | Authored source, reporting act, and communicative force for all 56 quotations. Omitted speakers remain unspecified. Permission, offers, desires, obligations, and invitations are separated. |
| Who did it? | Correct answer preserved when options are shuffled. Location/path and weather-caused trouble get appropriate prompts. Removed mechanical clue-label questions. |
| Narrator mood | Added 12 counterexamples and neutral/mixed outcomes. Passive, completion, effort, and favor forms do not automatically determine mood. Removed keyword-identification tasks. |
| Short passages | Retained the evidence-backed passage bank and skill filters. Shared selection prevents repeating the same source in one round. Results report actual answered counts and skill accuracy. |
| Reference tracking | 20 original texts, including noun, place, time, action, event, opinion, manner, and later specification. Exact target spans prevent highlighting an unrelated substring such as the suffix in よさそう. |
| Sentence connections | 20 original situations with three task variants each: 60 questions, not 60 independent situations. Cause/result, reasons, contrast, addition, sequence, alternatives, examples, responses, transitions, comparison, and summary. |

## Maintenance

Quotation annotations are keyed by exact quoted content. Clause-role entries
currently align positionally with the fixed `breakBank`; when reordering or
adding a sentence, update its role entry and review both together.

New questions should be manually read alongside every distractor. Schema tests
cannot prove a Japanese interpretation is unique. In particular, a contrast
connector can sometimes introduce an exception, so it must not be a distractor
against an equally valid alternative-method connector in those contexts.

The pools are finite. Filters cap a requested session at the number of distinct
eligible sources rather than repeating texts. Optional local history prefers
fresh sources; it is not adaptive review or a promise of unlimited novelty.

## Verification

- Full Node regression suite: 89 tests.
- Browser checks at 1440, 390, and 320 pixels.
- Real ten-question rounds in every mode, deliberately mixing two incorrect and
  eight correct answers, with visible 8/10 results.
- All 80 new questions rendered and graded at all three widths.
- All 74 clause and 56 quotation marking texts exercised with furigana on mobile.
- Checks for unique sources, answer availability, runtime errors, and overflow.

The browser audit exposes closure state only in its intercepted test response
via `reading-test-runtime.js`. Production does not load that helper or expose
the test API. Content assertions and browser execution complement, rather than
replace, editorial review and learner feedback.
