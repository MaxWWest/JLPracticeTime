# Units 04 and 05

These modules replace the old question banks for Review and their portions of
Boss 01-05. Adaptive insertion remains disabled. No answer is prefilled or shown
as a placeholder; multipart responses use independently graded fields.

## Four layers

1. Shared noun/verb pools, supplemented by bilingual lexical entries and readings.
2. Narrow compatibility frames: languages with speaking, instruments with playing,
   destinations with travel, food with eating, services with activity nouns.
3. Explicit facts: ability versus resources; preparation versus service status;
   access versus perception; lifetime history versus recurrence versus a dated event.
4. Assessment: prompts, supported claims, accepted sentences and known contrasts.

`grammar-practice-core.js` shares normalization, field grading, seeded selection,
and answer-position balancing for these two modules. It does not decide grammar
or infer arbitrary Japanese meanings. Existing lesson modules remain independent.

## Teaching boundaries

- Transitive potential verbs accept both object が and を in supported sentences.
- A requested rewrite can reject a construction without claiming it is bad Japanese.
- 見える / 聞こえる describe perception. Potential forms can describe access or
  possibility; do not claim the distinction is universally mechanical. Tasks
  requesting a perception construction say so, and access questions separate
  account permissions from a different machine's display/playback.
- An ability statement does not prove a particular event occurred. Conversely,
  not doing something does not prove inability.
- たことがありません and ないことがあります have different scopes of negation.
- A short record with no occurrences does not prove no lifetime experience.
- Experience constructions are not categorically forbidden with time expressions.
  Tasks about a specific event ask for a direct report of that event.
- Sometimes doing and sometimes omitting an action can both describe the same
  mixed pattern. They must not be competing allegedly exclusive interpretations.

## Session mix

Each unit has twelve task formats. Eleven receive two questions per 25-item
Review, and the two-person/two-meaning written task receives three.

Unit 04: contextual ability reports, two equivalent-construction rewrites,
two people's abilities, skill/resources, service requirements, service updates,
time-scoped notices, perception reports, paired observations, access/perception,
and limits of evidence about actual events.

Unit 05: experience reports, occasional actions, occasional omissions, paired
history/habit messages, scope of negation, experience versus today's plan,
specific-event reports, meaning repair, two-person accounts, first-experience
updates, limits of short records, and deliberate changes of meaning.

Underlying action families cannot repeat within a round. The selector penalizes
recent families, adjacent formats, repeated domains, and repeated vocabulary.
The last 50 families persist locally for freshness only, not adaptive scoring.
Question count alone is not a measure of diversity: tests inspect the 25-item mix,
four positive/negative combinations, domain spread, and five-item Boss slices.

## Grading and feedback

Kana, kanji, mixed spelling, punctuation, supported particles, and plain/polite
endings are normalized or explicitly enumerated. Meaning-bearing negation,
people, and verb forms are not removed or fuzzy matched.

Known alternative meanings receive specific feedback. Unrecognized sentences
receive a bounded explanation that they are outside the checked answers, not a
claim that they are necessarily ungrammatical. This is not an unrestricted parser.
More paraphrases need explicit acceptance and near-miss rejection tests.

## Checks and references

Run `node --test *practice.test.js ability-experience.test.js` and
`node grammar-audit.js --strict`. The Playwright harness accepts
`GRAMMAR_TEST_UNIT=ability` or `GRAMMAR_TEST_UNIT=experience`; it checks a complete
Review, Boss routing, kana input, partial feedback, manual retry and all formats
at desktop and narrow mobile widths.

Teaching references, not copied question banks:
- [Japan Foundation grammar explanation index](https://www.jpf.go.jp/j/urawa/j_rsorcs/textbook/s_koumoku.html)
- [Marugoto: past experience](https://a2.marugotoweb.jp/en/grammar/description/013.html)
- [Official JLPT test structure](https://www.jlpt.jp/e/guideline/testsections.html)

Automated invariants do not certify native naturalness or prove JLPT difficulty.
Actual learner feedback still matters. Next planned work is richer answer-specific
feedback across earlier modules and Boss tasks requiring grammar selection;
cross-unit integrated passages, listening, and a mistake notebook are not part
of this release.
