# Grammar-first Reviews 06-10

## Scope

Units 06-10 now bypass the old question banks and generic advanced packs.
Review uses short dropdown responses and interpretation, with vocabulary supplied
in the frame or choices. No adaptive questions are inserted. Listening and Units
11-25 are unchanged. Boss 06-10 is a separate ten-question cross-unit round.

| Unit | Main distinctions | Task types | Lexical/scene families | Items |
| --- | --- | ---: | ---: | ---: |
| 06 Permission | allowed, forbidden, unnecessary, required; replies to may/must; conditions | 5 | 40 | 528 |
| 07 Desire | personal/quoted/observed wants; objects; hoped-for outcomes versus events | 6 | 68 | 296 |
| 08 Appearance | appearance/hearsay, polarity, visible feelings, unchanged states | 7 | 49 | 252 |
| 09 Reasons | causal links, focused why-answers, te-causes, contrast, polite requests | 5 | 40 | 160 |
| 10 Purpose | movement purpose, intention, noun attachment, intended outcomes versus achievement | 7 | 44 | 168 |

These are finite, authored combinations, not that many independent situations.
For example, a verb/object pair can support several tasks and polarity variants.
A Review round draws only one item per family, balances task/topic/lexical usage,
and prefers families not in recent local history. Repeat avoidance is a preference
across rounds, not a promise of unlimited novelty. All five support 10/25/40 items.
Ten-question Reviews contain at least seven compact responses.

## Implementation

- `drill-lexicon.js`: eight verb frames, four compatible objects each, explicit
  inflections and readings. No suffix guessing for irregular verbs.
- `drill-kit.js`: thin adapter around `grammar-practice-core.js` for selection,
  cloze construction, normalization and grading.
- One `*-practice.js` module per unit owns its meanings, forms and explanations.
- `boss-six-ten.js`: five cross-unit structures, six lexical families per
  structure, four combinations of two facts per family (120 variants).
- `script.js`: routing, rendering, optional freshness history and session stats.

Boss selects two families per primary unit: eight choices, then two writing
items. Each question combines two units. The final messages preserve two facts;
not every message needs two sentences. Hints naming the grammar and lesson notes
are withheld. The last twenty families are deprioritized on subsequent rounds.

## Teaching safeguards

- A no-answer to "must I?" is not the same as a no-answer to "may I?".
- Desire does not establish ability, permission or completion. Direct quotations
  can use another speaker's own `たい`; `たがっている` reports visible desire.
- Appearance and hearsay use different attachments; both evidence source and
  polarity can change. `いい` has the irregular appearance form `よさそう`.
- `まま` describes an unchanged state, not simultaneous ongoing actions.
- Both `から` and `ので` are accepted when either expresses the supplied reason,
  including before polite requests. Contrasts have separately authored outcomes.
- Purpose does not guarantee achievement. `ための` and `ために` are distinguished
  by what they modify. Potential/negative goals use clear `ように` frames without
  presenting every `ために` alternative as categorically ungrammatical.

The overlap between purpose constructions is discussed in the
[Japan Foundation's grammar commentary](https://www.jpf.go.jp/j/project/japanese/teach/tsushin/grammar/201310.html).
The design also follows its discussion of
[desire expressions](https://www.jpf.go.jp/j/project/japanese/teach/tsushin/grammar/201507.html).
These references inform the rules; they are not an endorsement or an independent
teacher certification of this generated content.

## Grading limits

Review choices are finite and checked. Kana, whitespace and punctuation normalize
without erasing negation. Writing accepts authored alternatives, including some
plain-form endings, omitted initial 私は, and から/ので variants. It is not an
open-ended Japanese parser: an unrecognized paraphrase is described as unmatched,
not automatically ungrammatical. Keep extending accepted variants from user tests.

## Verification

```sh
node --test *.test.js
node grammar-audit.js --session permission
PLAYWRIGHT_CHANNEL=chrome node units-six-ten-browser-test.js
PLAYWRIGHT_CHANNEL=chrome node review-feedback-browser-test.js
PLAYWRIGHT_CHANNEL=chrome node boss-browser-test.js
```

`units-six-ten.test.js` checks every item, supported alternatives, incorrect
options, kana normalization, actual routing, 10/25/40-item selection, family
freshness and independently derived Boss meanings. Browser checks complete
all six rounds at desktop/mobile sizes with deliberate wrong answers, verify
visible 8/10 and 80% results, and render every task type at 1440/390/320px.
Set `GRAMMAR_TEST_URL` to repeat the browser checks against the deployed site.
