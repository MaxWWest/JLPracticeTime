# Role Contrasts and Connected Boss Situations

## What the Learner Must Decide

The same `私は田中さんに本を...` frame now describes three different events:

- 読まれました: Tanaka reads the speaker's book, affecting the speaker.
- 読ませました: the speaker causes Tanaka to read it.
- 読ませられました / 読まされました: Tanaka makes the speaker read it.

The short English event changes; the Japanese people and object stay fixed.
Companion interpretation items ask who performs and who causes the action.
"Not stated" is a real option when a passive sentence does not identify a causer.

Giving interpretation similarly asks who acts and who benefits. It varies
あげる/もらう and the counterpart, Tanaka or Sato. Permission requests alternate
between asking the listener to act and asking to be allowed to act personally.
Retired the fixed-answer `read-owner-passive`, `read-causative`, and
`read-permission` task families in favor of these contrasts.

The fields remain short selections. No noun transcription or extra Japanese
narration is needed. Existing roles and voice forms remain available for practice.

## Boss 21-25

Each item now concerns one compatible activity:

1. Deciding or being scheduled to do it, then trying it or preparing it.
2. Doing it as a trial or in advance, as a favor in either direction.
3. Receiving or providing that favor from the speaker-subject viewpoint.
4. Being affected or causing someone to act, then requesting who should act next.
5. Being compelled or making a personal decision, then deciding what to do next time.

The two facts are assessed within that event. Wrong-option coaching identifies
which fact changed, rather than repeating one general explanation for all errors.
Choice prompts do not name the required construction. Full writing retains the
same concise event constraints and supplied vocabulary.

Twenty authored compatible actions give 368 variants over 92 lexical families.
There are five semantic structures, not 92 independently authored stories.
Creating an item and sending something are excluded from affected-owner Boss
frames to avoid unclear ownership and recipient interpretations. Role drills
likewise use a restricted set of compatible actions.

Boss selection enforces ten different action keys per round, two primary items
from each of Units 21-25, eight choices, and two final writing items. Recent
families are deprioritized. Checked contracted causative-passive forms remain
accepted in writing.

## Verification

Regression coverage includes identical frames with changed answers, actor versus
beneficiary/controller, request-performer reversals, preservation of both Boss
facts, no repeated Boss action keys, queue balance, grading, kana alternatives,
and word-level reading coverage. Browser checks cover desktop, 390px and 320px
layouts, dropdown readings, deliberate errors, and end-of-round statistics.

Commands:

```sh
node --test '*.test.js'
node grammar-audit.js --strict
GRAMMAR_TEST_UNITS=giving,passive,causative,boss-21-25 node units-six-ten-browser-test.js
```
