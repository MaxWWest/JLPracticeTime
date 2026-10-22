# Grammar-first Reviews 11-15

Unit 10 already uses the new system and remains unchanged. Units 11-15 now bypass
the legacy extension banks and generic advanced packs. Listening is untouched.

## Review content

| Unit | Grammar distinctions | Task types | Families | Items |
| --- | --- | ---: | ---: | ---: |
| 11 Listing | supporting reasons, inclusion, representative actions, sequence and tense | 6 | 44 | 196 |
| 12 Possibility | open possibility, expectation, evidence-based inference and polarity | 5 | 48 | 384 |
| 13 Advice | recommendation versus avoidance, authority, warning and self-reminder | 7 | 40 | 216 |
| 14 Conditionals | future trigger, premise, condition polarity, regular result and overlap | 8 | 57 | 177 |
| 15 Tara/nara | preparation versus follow-up, future condition versus actual discovery | 6 | 40 | 184 |

These are finite authored combinations, not 1,157 independent scenarios.
Each family can produce several tasks or fact variants. Lexical variation uses
the existing compatible verb/object pool, plus checked state and event frames.
Review selects one item per family, balances tasks and topics, and deprioritizes
recent families. The 10/25/40-question options remain available. At least two
thirds of each round use short dropdown responses; there is no full writing in
Review, no answer placeholder, and no adaptive insertion.

Instructions are brief and primarily English. Japanese supplies the target
utterance or response frame rather than a paragraph narrating the intended answer.
Tasks change scope, polarity, commitment or timing, not merely noun recall.

## Boss 11-15

The separate Boss has five cross-unit structures, six lexical families each,
and four combinations of two independent facts: 120 variants, 30 families.
Each round uses two families per primary unit, eight choices followed by two
full-message responses. Lesson notes are hidden during the Boss.

- Examples or sequence, plus expectation or possibility.
- Expected polarity, plus advice to act or avoid acting.
- Directive or advice, plus examples or sequence.
- Positive or negative condition, plus positive or negative advice.
- Before-plan or after-completion timing, plus positive or negative advice.

Correct-answer positions and the units supplying the writing finale vary.
Recent families are deprioritized; this is freshness, not adaptive review.

## Teaching safeguards

- `し` can list parallel facts, including actions; it is not exclusively for
  adjectives. `たり` does not establish an exhaustive or ordered schedule.
- `はず` expresses an expectation, not a guarantee or an obligation.
  `かもしれない` has no fixed numerical probability.
- Both `ようです` and `みたいです` are accepted for the inference frames.
  Nouns, na-adjectives, i-adjectives and verbs use their respective attachments.
- The `た` in `たほうがいい` does not report a completed event.
  `ないと` warns about failing to act; it is not a prohibition.
- State conditions with `ば` can precede requests. The request example accepts
  both `あれば` and `あったら`.
- `たら` can introduce a future condition or a past discovery. `なら` takes a
  premise without requiring the proposed action to occur first.
- Narrative `と` and `たら` are both accepted for the authored discovery frames.
  Regular-result questions do not falsely exclude `ば` as a paraphrase.

Reference checks: [TUFS conditional grammar](https://www.coelang.tufs.ac.jp/mt/ja/gmod/contents/explanation/083.html),
[Japan Foundation on よう](https://www.jpf.go.jp/j/project/japanese/teach/tsushin/grammar/201307.html),
and [Japan Foundation on たら](https://www.kyozai.jpf.go.jp/kyozai/material/BTS00108/ja/render.do).
These inform the distinctions; they are not an independent teacher certification.

## Implementation and limits

`conditional-scenes.js` owns compatible preparations, follow-ups, conditions,
and discovery events. The five unit modules own their grammar tasks.
`boss-eleven-fifteen.js` owns the mixed assessment. Routing, history and stats
remain in `script.js`; mechanics reuse `drill-kit.js` and the shared core.

New modules expose lexical `displayReadings` separately from whole-clause
normalization aliases. This prevents a whole sentence from becoming one ruby
span while retaining kana answer matching. Native dropdowns remain plain text.

Writing accepts checked variants, kana and punctuation differences. It is not
an open-ended Japanese parser. Unrecognized paraphrases receive unmatched-answer
feedback, not a claim that they are ungrammatical. Extend the accepted variants
with real user-testing examples.

## Verification

```sh
node --test '*.test.js'
node grammar-audit.js --session listing,certainty,advice,conditionals,tara-nara,boss-11-15 --strict
GRAMMAR_TEST_UNITS=listing,certainty,advice,conditionals,tara-nara,boss-11-15 PLAYWRIGHT_CHANNEL=chrome node units-six-ten-browser-test.js
```

The reusable browser harness accepts `GRAMMAR_TEST_UNITS` and `GRAMMAR_TEST_URL`.
It completes each round at 1440px and 390px, deliberately misses two answers,
checks visible 8/10 and 80% results, and tests each task at 1440/390/320px.
Node tests check all accepted alternatives, changed-meaning options, kana,
actual routing, selection, overlap cases and independently derived Boss facts.
Display tests check kanji coverage and word-level ruby in the new content.
