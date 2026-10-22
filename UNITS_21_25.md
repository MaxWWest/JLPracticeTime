# Units 21-25

The final five grammar Reviews and Boss now use dedicated generated banks.

- 21 Decisions: personal decisions, settled arrangements, noun choices,
  negative decisions, and decisions versus actual completion.
- 22 Te helpers: trials, preparation, maintaining states, complete actions,
  and the fact that completion does not necessarily express regret.
- 23 Giving: object transfer and favors; performer versus beneficiary;
  switching viewpoints while preserving the event; humble receiving.
- 24 Passive: object-topic and affected-owner perspectives, agent marking,
  active versus passive roles, and emotion that requires context.
- 25 Causative: causer versus performer, transitive causee marking,
  permission for one's own action versus requesting another person's help,
  causative-passive, and checked contracted forms.

`final-grammar-practice.js` extends the compatible action pool with explicitly
authored passive, causative, and causative-passive inflections. Giving excludes
the general eating/borrowing/buying action frames and adds compatible cleaning,
repair, and translation favors. Object-giving frames have their own families.

Reviews offer 10/25/40 items, with unique families within each round, task
balancing, recent-family rotation, and mostly short grammar selections.
The 1,376 items across the block include lexical and polarity variants; they
are not 1,376 independent scenarios.

Boss 21-25 now combines meanings within connected activities in five structures.
There are 20 compatible activities, with exclusions for ambiguous affected-owner
frames: 368 variants across 92 lexical families, not 92 independent story types.
Rounds contain eight choices followed by two complete-message writing items,
with two primary questions per unit and rotating writing targets. A round now
uses ten different noun/action pairs. See `ROLE_DRILL_DESIGN.md` for the latest
role-contrast changes and verification; the validation below records the original rollout.

Validation:

```sh
node --test '*.test.js'
node grammar-audit.js --session decisions,te-auxiliary,giving,passive,causative,boss-21-25 --strict
GRAMMAR_TEST_UNITS=decisions,te-auxiliary,giving,passive,causative,boss-21-25 node units-six-ten-browser-test.js
```

143 tests passed. The targeted audit found no issues. Browser checks completed
all six sessions at desktop/mobile sizes with deliberate mistakes and verified
8/10 and 80% result screens. Every task type was rendered at 1440, 390, and 320
pixels without overflow or page errors. Furigana coverage includes answer
options, and kana answers and legitimate checked alternatives are accepted.

These checks establish routing, grading, and rendering for the authored rules;
learner feedback remains useful for tuning difficulty and naturalness.
Publishing remains a separate step.
