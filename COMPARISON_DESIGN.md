# Comparison Practice

## Teaching Contract

The target is control of より, ほうが, ほど with negation, and どちら. Vocabulary
supports that target; it is not the hidden assessment. Written tasks supply the
relevant words, never the completed answer. No adjective-only or verb-only blanks
are allowed. Paired blanks and three-sentence tasks have separate labelled fields.

Difficulty comes from tracking the comparison base, direction, polarity, and
context, including chains, two competing qualities, changing times, and different
speakers. It does not come from rejecting valid word order or kana spelling.

Both BよりAのほうが and AのほうがBより are valid. Dictionary-form verbs attach
directly to ほう; nouns need の. Negative ほど comparisons put the benchmark
immediately BEFORE ほど. が/を questions use adjective subjects versus the object
of 選びます, not たい predicates where either particle can be possible.

## Four Layers

1. **Lexicon:** shared noun, adjective, and verb pools in `script.js`, with small
   additions in `comparison-practice.js`. Japanese, readings, English, and word
   forms are separate from modifiers and comparison structure.
2. **Compatibility:** semantic domains in `comparison-practice.js` narrow broad
   noun tags to meaningful comparisons. Action frames use valid arguments and
   particles. Do not assume every word sharing a broad tag is interchangeable.
3. **Meaning:** scenes contain explicit facts with two entities, a dimension,
   a scope, and optional equality. The relation graph follows transitive facts
   only within the same dimension and scope. Two items sharing a benchmark do
   not necessarily have an order or equal degree.
4. **Assessment:** task builders transform the same facts into prompts, answers,
   distractors, explanations, and field definitions. A separate queue selector
   balances tasks and avoids recycled underlying situations.

The engine is a pure browser/CommonJS module. `script.js` handles rendering,
navigation, and history. This engine supplies focused Review; Boss 01-05 now has
a separate [cross-unit pilot](BOSS_PILOT_DESIGN.md). Neither path appends legacy
comparison questions.

## Session Mix

A 25-question round contains:

| Task | Count |
| --- | ---: |
| Two linked grammar blanks after comparison chains | 3 |
| Preserve meaning using ほど | 3 |
| Preserve meaning using より and ほうが | 2 |
| Deliberately reverse the comparison | 2 |
| Determine direction, equality, or insufficient evidence | 2 |
| Infer a comparison from two statements | 3 |
| Preserve two different qualities simultaneously | 2 |
| Answer a contextual どちら dialogue | 2 |
| Express an English relationship in Japanese | 2 |
| Repair a grammatical but factually reversed comparison | 2 |
| Choose が/を from the predicate | 1 |
| Produce three equivalent comparison forms | 1 |

Question selection forbids duplicate scene keys and underlying noun-family keys
within a round. Recent families, adjacent formats, domains, adjectives, and
repeated short answers incur selection penalties. Multiple-choice answer
positions are balanced and cannot repeat three times in succession.

`comparison-review-history-v2` stores only the last 100 family keys for freshness.
This is not adaptive review: performance and missed answers do not insert extra
questions. A retry is added only when the learner explicitly requests it.

## Grading Boundaries

Accepted sentence forms are explicit. Longest-first reading normalization allows
kanji, kana, and mixed spelling, including 漢字/かんじ and 方/ほう. Whitespace and
punctuation are ignored. Supported plain/polite negatives and both comparison
orders are accepted. Relations, essential noun modifiers, and negation are not
deleted or fuzzy-matched. This is not an unrestricted Japanese-language parser;
new valid paraphrases need explicit variants and rejection tests for near misses.

## Extension Checklist

- Add each noun's reading and natural English phrase; keep modifiers separate.
- Confirm the property applies to every noun in the domain, and that a context
  makes any subjective preference explicit rather than asserting it universally.
- New action frames must use verbs from the shared pool with correct arguments.
- Keep enough information to solve the requested relationship, or explicitly
  offer "cannot determine". Do not infer equality from absence of evidence.
- Every distractor must answer the same question. Equivalent valid sentences
  must never compete as right versus wrong answers.
- Add a fact-level test, grading acceptance/rejection tests, and a full-session
  distribution check. Candidate count alone is not a diversity metric.
- Render the longest new prompt and answers at desktop and mobile widths.

## References And Limits

The [official JLPT N4 sample](https://www.jlpt.jp/samples/sample2018/pdf/N4G.pdf)
informs context-sensitive grammar assessment; questions here are original, not
copied exam items. The [Tae Kim comparison chapter](https://guidetojapanese.org/learn/grammar/comparison)
is a reference for comparison forms and attachment.

Automated checks establish structural invariants and answer-key consistency,
not native-speaker certification or a measured equivalence to JLPT difficulty.
Naturalness and actual challenge still need learner feedback and human review.
