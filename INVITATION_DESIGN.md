# Session 03: Invitations and Offers

Session 03 Review uses `invitation-practice.js`. Boss 01-05 now has a separate
[cross-unit pilot](BOSS_PILOT_DESIGN.md).
The older invitation, advanced, correction, and pitfall banks are not appended.
Adaptive review remains disabled. No new dependencies or build step are needed.

## Teaching Contract

- Assess the speech act, participants, and response: inviting, proposing shared
  action, offering one's own help, accepting, declining, delaying, or counterproposing.
- `ませんか` and shared-action `ましょうか` can both be valid invitations. Generic
  invitation production accepts both; it does not invent a universal distinction.
- `ましょう` can make a new proposal or accept an invitation. It does not require
  prior agreement, nor does it always mean that multiple people will act.
- `ましょうか` can mean "Shall I?" or "Shall we?" Context and participants decide.
  Paired interpretations can be solo/solo, joint/joint, or either mixed order.
- A proposed action is not necessarily an agreed action. Follow the response,
  including new dates and changes to who will help.
- `大丈夫です` and a thank-you are not automatic accept/refuse switches. The whole
  reply must establish the intention. Both acceptance and refusal examples use
  `大丈夫です` with disambiguating continuation.
- `てくれませんか` requests the listener's action. It is a relevant contrast to
  volunteering one's own action, not an unrelated grammar distractor.
- A task may explicitly request a question, a direct "let's" statement, or an
  overt participant phrase. A different grammatical sentence can fail that task
  without being described as universally incorrect Japanese.

## Four Layers

1. **Lexicon:** shared bilingual noun and conjugated verb pools, supplemented by
   local nouns and fully inflected `運ぶ` and `開ける`. Readings support kana/mixed
   spelling. There are 64 noun-action families across 13 frames and 56 distinct
   action nouns; this is a finite pool, not thousands of independent scenarios.
2. **Compatibility:** each frame has explicit noun edges and a shared/help/both
   capability. Lending and opening are help-only in this unit. Longer dialogues
   connect outings to maps, study to materials, and general plans to email;
   unrelated preparation nouns are not randomly attached.
3. **Conversation:** actions are combined with actors, date changes, response
   states, and social context. These facts are retained in metadata. Date order
   is shuffled independently of acceptance/refusal variants.
4. **Assessment:** twelve task adapters consume those facts. Text tasks supply
   action vocabulary, while learners produce the intention-bearing construction.
   Choice alternatives change a relevant actor, commitment, date, or speech act.

## Round Composition

A 25-item Review has two each of:

- invitation production;
- accepting a counterproposal;
- offering help;
- changing the actor in a rewrite;
- interpreting two contexts;
- choosing a shared-plan reply;
- interpreting a response to an offer;
- tracking a longer conversation's final agreement;
- declining and counter-inviting;
- restoring a missing invitation/offer;
- identifying whether an invitation has actually been accepted.

It also has three paired-message questions with separately graded fields.
Field order changes. The same ending can be valid in both fields if the actor
phrases express the distinct intentions.

One noun-action family appears at most once per round, even if another adapter
or a different reason/date could reuse it. Selection penalizes repeated domains,
vocabulary, adjacent task types, and the last 50 families seen. Correct-choice
positions are balanced and cannot form a three-position streak. Boss no longer
takes a five-question slice from this Review bank.

## Grading and Boundaries

Text checking uses explicit accepted realizations, not fuzzy matching or an LLM.
It accepts kana/mixed spelling, punctuation, supported word orders, time-topic
variants, destination `へ`/`に`, and both legitimate joint-invitation endings.
It retains the actor, action, date, and requested question/statement distinction.
It is not an unrestricted Japanese semantic grader: production tasks deliberately
request supplied action phrases and explicit participant wording.

No answer placeholders or prefilled text are generated. English translations and
explanations are stored for feedback; full Japanese solutions are not placed in
the pre-answer vocabulary strip. Manual retries use the same task with an unseen
action family, not a legacy item.

## Checks and Extension Rules

Run:

```sh
node --test comparison-practice.test.js time-practice.test.js invitation-practice.test.js
node grammar-audit.js --strict --max 10
GRAMMAR_TEST_UNIT=invitation PLAYWRIGHT_CHANNEL=chrome node comparison-browser-test.js
```

The browser test uses Playwright, checks a complete 25-answer round, the mixed
Boss, kana input, partial feedback, fresh retry, and every format at desktop and
390px/320px widths. Set `GRAMMAR_TEST_URL` for deployment verification.

When extending the bank, add compatible action edges before new templates.
Keep genuine solo/shared ambiguity out of single-answer choices unless the
context resolves it. Preserve task quotas, family-level deduplication, relevant
distractors, independently testable facts, and kana acceptance. Review sampled
dialogues for naturalness; passing structural tests is not a substitute for it.

## Reference Basis

Original generated content, not copied test questions. The teaching distinctions
were checked against these primary resources:

- [Japan Foundation, Irodori Elementary 1, Lesson 10](https://www.irodori.jpf.go.jp/assets/data/elementary01/pdf/Y_L10.pdf): offering assistance with `ましょうか`.
- [Japan Foundation, Grammar Explanations](https://www.jpf.go.jp/j/urawa/j_rsorcs/textbook/dl/setsumei/setsumei_all.pdf): invitations, accepting with `ましょう`, and contextual refusals.
- [Agency for Cultural Affairs, Daily-life Japanese II, Lesson 3](https://www.bunka.go.jp/seisaku/kokugo_nihongo/kyoiku/china_kikokusha/pdf/seikatsu_02/division_03.pdf): solo offers and shared proposals with `ましょうか`.

These are teaching references, not evidence that this generated unit has been
externally validated or calibrated to an official JLPT difficulty score.
