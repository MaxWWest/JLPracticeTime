# Boss 01-05: Contextual Pilot

Boss 01-05 uses `boss-practice.js` and `boss-scenarios.js`, not a concatenation of
the five Review banks. Each bounded ten-question round has eight choices followed by two
one-sentence writing challenges. Focused Review retains its task mix and counts,
but uses sentence frames and short blanks instead of full-sentence copying.
Other Boss blocks are unchanged. Adaptive insertion remains disabled everywhere.

## Teaching Contract

- Before an answer, show a situation and a neutral task, not the source unit,
  target construction, rule notes, full English translation, or a solved example.
- Make the learner track relevant facts across concepts: an offer is not yet an
  assignment; skill is not access; a plan is not past experience; a deadline is
  not an activity endpoint; an earlier comparison need not hold now.
- All four choices concern the same situation. Distractors are grammatical
  messages that contradict an actor, relation, time, participation, or polarity.
- Exactly one whole message must be supported. A plausible Japanese sentence is
  not universally wrong merely because it fails this particular situation.
- Wrong-answer feedback translates the selected message and identifies the
  specific facts it contradicts. It does not explain an unrelated generic error.

## Four Layers

1. Lexicon: existing bilingual noun pools and conjugated verb entries, with small
   explicit supplements. Nouns remain separate from sentence structures.
2. Compatibility: narrow noun/action edges for study places, reading, preparing
   food, carrying items, outings, and equipment. A broad shared tag is not enough
   to make every verb/noun pairing natural.
3. Facts: each case records the relevant order, actors, availability, intervals,
   experience, agreement, and prices. Four variants change meaning-bearing facts.
4. Assessment: Japanese prompts and candidate claims are built from those facts.
   The answer is derived from the supported claim, then positions are shuffled
   together with their claim records. Feedback addresses each false component.

The fixed narrative rules are deliberate: this pilot tests cross-unit assessment,
not unrestricted story generation. Noun substitutions are lexical variation,
not new scenario families. Adding random nouns cannot substitute for new reasoning.

## Pilot Coverage

| Case | Primary unit | Integrated decision |
| --- | --- | --- |
| Study booking | Comparison | Two-link comparison and booking deadline |
| Hotel change | Comparison | Current prices versus past prices and vacancies |
| Reading handover | Time | Accepted/declined offer and duration/completion |
| Kitchen call | Time | Cooking stage and a feasible invitation response |
| Moving help | Invitation | Actor, shared work, ability or prior experience |
| Outing plan | Invitation | Counterproposal, availability and final participation |
| Equipment loan | Ability | Independent skill and a usable borrowing interval |
| Broadcast access | Ability | Account access and current audibility |
| First visit | Experience | Completed versus abandoned trip and a new invitation |
| Weekend meal | Experience | Never versus occasional omission and action comparison |
| Suitcase capacity | Comparison | Capacity versus weight and whether the actual load fits |
| Complete commute | Comparison | Total journey versus ride time and arrival deadline |
| Room perspective | Comparison | Speaker-specific evaluation versus actual visits |
| Incomplete ranking | Comparison | Unknown relation versus confirmed purchase agreement |
| Overlapping work | Time | Same-time actions, different actors, independent ability |
| Delivery cutoff | Time | Original dispatch cutoff versus final direct-collection plan |
| Progress correction | Time | Old message versus two current action stages |
| Two work limits | Time | Independent duration/completion commitments for two jobs |
| Declined help | Invitation | Polite refusal versus assignment and unaided ability |
| Pending invitation | Invitation | Counterproposal versus agreement and reply deadline |
| Tool offer | Invitation | Equipment owner versus accepted operator |
| Partial acceptance | Invitation | Separate replies to lunch and a visit, despite prior experience |
| Training update | Ability | Acquired skill versus an independently completed job |
| Alternative machine | Ability | One broken machine versus another option and listed cost |
| Voice and language | Ability | Current audibility versus language comprehension |
| Ingredients now | Ability | Cooking skill versus available ingredients and total cost |
| Single trip | Experience | One past visit versus monthly routine and new acceptance |
| Specific machine | Experience | Old-model experience versus this model and current ability |
| Reported visit | Experience | Diary writer versus quoted visitor and invitation response |
| Bounded diary | Experience | Recorded events, omissions, future plans and unknown history |

A round selects ten different families, two primary targets per unit. There are
six families per unit, thirty total, with 120 fact variants, not 120 independent
stories. Explicit どちら production remains in Review. Vocabulary substitutions
do not count as additional scenario families.

## Selection And UI

- Only a ten-question count is offered for Boss 01-05. Requests for longer rounds
  are capped instead of silently padding with old Review questions.
- Unit order varies, with no adjacent repeated primary unit. Answer positions
  are balanced and cannot form a three-position streak.
- Two eligible cases from different units finish the round as one-sentence
  writing challenges. Eleven families have writing versions across all five
  units. Selection favors fresh families and least-recently written units.
  Vocabulary is supplied, never a solved response or answer placeholder.
  Checked kana, particle and word-order alternatives are accepted. Unrecognized
  paraphrases are described as unmatched, not universally ungrammatical.
- The last fifty case/variant keys are kept locally under
  `boss-01-05-review-history-v1`. The previous twenty entries supply a two-round
  family cooldown: three consecutive rounds can cover all thirty families.
  Unseen fact variants are preferred when a family returns. Nouns can also change.
- This history is freshness tracking, not scoring-based adaptation. Starting a
  session records its selection even if the learner does not finish it.
- Boss deliberately offers no in-round retries, preserving the 8+2 boundary.
  Leaving Boss restores the normal Review notes and retry behavior.

## Inspect And Verify

`BOSS_PILOT_SAMPLE.md` is a reproducible ten-question preview with English beneath
each passage and an answer key at the end. Regenerate it after content changes:

```sh
node boss-pilot-preview.js --write
node --test *practice.test.js ability-experience.test.js
node grammar-audit.js --strict
PLAYWRIGHT_CHANNEL=chrome node boss-browser-test.js
```

Playwright must be installed or available through `NODE_PATH`. Set
`GRAMMAR_TEST_URL` to exercise the deployed site. The Boss harness checks actual
entry, a completed round with mixed correct/wrong answers, selected-answer
feedback, hidden hints, fresh second-round families, all 120 entries at
1440/390/320px, and restoration of focused Review.

Independent case-level tests check all claim combinations, routing, session
diversity over one hundred seeds, lexical variation, and preview consistency.
Those tests establish internal consistency, not native-speaker certification or
calibration to an official JLPT difficulty score. Editorial and learner review
are still necessary. Further expansion should add new reasoning families and
production tasks, not merely more nouns or clock values.

## Reference Basis

Original questions, informed by teaching references rather than copied exams:

- [Japan Foundation Irodori, Lesson 10](https://www.irodori.jpf.go.jp/assets/data/elementary01/pdf/Y_L10.pdf), offering assistance in context.
- [Marugoto, past experience](https://a2.marugotoweb.jp/en/grammar/description/013.html).
- [Official JLPT test sections](https://www.jlpt.jp/e/guideline/testsections.html), assessment context, not a difficulty certification.
