# Units 16-20: Grammar-First Review

## Scope

This block replaces the legacy Review banks for Units 16-20 and the generic
Boss 16-20 route. It does not change listening, reading, or Units 21-25.
The changes are local; publishing is a separate step.

| Unit | Focus | Generated items | Lexical families | Task types |
| --- | --- | ---: | ---: | ---: |
| 16 Concession | ても, のに | 272 | 56 | 8 |
| 17 Quotation | と, か, かどうか | 320 | 40 | 6 |
| 18 Intention | volitional + と思う, つもり | 320 | 40 | 6 |
| 19 Hearsay | と言っていました, そう, らしい | 336 | 48 | 8 |
| 20 Change | する/なる, ようになる, なくなる | 264 | 48 | 7 |

These counts include lexical and polarity variants, not that many independently
authored situations. The shared action pool extends the existing compatible
verb/object data with explicit volitional and potential forms. It does not take
an unrestricted Cartesian product of nouns and verbs.

## Response Design

- Reviews use short grammar selections and interpretation questions, not full
  sentence transcription or long Japanese setup passages.
- Ten-, 25-, and 40-question queues select different families within each round,
  balance task types, and deprioritize recent families between rounds.
- At least two thirds of Review questions use compact response fields.
- Placeholders do not reveal answers. Options are shuffled on selection.
- Boss 16-20 has five cross-unit structures, six lexical families per structure,
  and four independent two-fact variants: 120 items over 30 families.
- Boss rounds have ten questions: eight meaning choices, then two complete
  messages. Each unit is the primary target twice; writing units rotate.
- Existing completion statistics remain visible. Adaptive Review stays disabled.

## Teaching Safeguards

- ても can describe real as well as hypothetical situations; のに presents a
  factual contrast. Concession is not automatically negative in its result.
- Both か and かどうか are accepted for the tested yes/no indirect questions.
  Question-word questions use か. Direct quotations retain the original speech.
- A plan is not proof of an event. Past つもり alone does not guarantee either
  fulfilment or failure. Intention expressions are not a fixed certainty scale.
- Hearsay そう and らしい are both accepted in the shared reporting context.
  Their noun/adjective attachment is tested separately. A report is not direct
  verification, and its tense and negation remain inside the reported content.
- なる describes a changed state; it does not assert that the change was
  spontaneous. Potential vs ordinary verbs distinguish ability from practice.
  Negative changes use なく, preserving ability vs habit scope.
- Full-message grading accepts checked kana and plain/polite alternatives;
  unlisted paraphrases retain the existing honest, limited-coverage feedback.

The lesson notes were corrected where they implied rigid distinctions or showed
the malformed formula `くても / でも + も`.

Reference checks: the Japan Foundation discusses overlapping intention forms in
[つもり (1)](https://www.jpf.go.jp/j/project/japanese/teach/tsushin/grammar/201212.html)
and overlapping reported-information uses in
[そうだ / ようだ / らしい (1)](https://www.jpf.go.jp/j/project/japanese/teach/tsushin/grammar/201012.html).
TUFS describes the regardless-of-condition meaning of
[ても](https://www.coelang.tufs.ac.jp/mt/ja/gmod/courses/c01/lesson21/step4/explanation/084.html).
These references inform the distinctions; they do not certify every generated item.

## Verification

```sh
node --test '*.test.js'
node grammar-audit.js --session concession,quotation,intention,hearsay,change,boss-16-20 --strict
GRAMMAR_TEST_UNITS=concession,quotation,intention,hearsay,change,boss-16-20 node units-six-ten-browser-test.js
```

The browser command requires Playwright and an installed browser; set
`PLAYWRIGHT_CHANNEL=chrome` when using the local Chrome installation.

- 130 Node tests passed, including routing, all checked answer alternatives,
  meaning-changing distractors, queue freshness, and independent Boss facts.
- All 1,632 new items pass the targeted structural audit. The combined Units
  6-20 and three Boss audit covers 4,433 items with no findings.
- Completed all six ten-question sessions on desktop and mobile, deliberately
  answering two incorrectly and checking the displayed 8/10 and 80% statistics.
- Rendered every task type at 1440, 390, and 320 pixels without overflow or
  browser errors; inspected mobile response and Boss-writing screenshots.
- Checked furigana coverage in prompts, answers, choices, and field options.
  Punctuation separates adjacent time expressions and nouns to avoid ambiguous
  tokenizer boundaries; no whole-clause ruby entries were added.

Automated checks validate the finite authored rules and rendering. They are not
a substitute for further learner testing of naturalness, difficulty, and variety.
