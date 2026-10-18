# Grammar Quality Pass: Units 01-05

## Problems Found And Changed

1. Comparison frames placed stronger/weaker items by role. Even when the nouns
   changed, position could reveal the marker. Fixed chunks now use a lexical
   order independent of rank. Other frames require selecting the compared
   entities, with adjectives supplied. A redundant typed `ほど` blank is gone.
2. Simultaneous-action questions now use a short English situation to establish
   the main activity. Either compatible action can be primary; the learner must
   place it in the main clause, not copy a Japanese phrase from a long passage.
   Word-bank order is independent of this decision.
3. Invitation headings and field labels announced the desired intention.
   Compact labels are neutral, and brief English situations assign the two
   message intentions. Interpretation questions retain the actual Japanese
   turns without narration of what the speaker is about to say. Both valid
   joint-invitation endings remain accepted.
4. Current-habit versus occasional-omission headings revealed negation scope.
   These now share the same heading and response label.
5. Greedy scheduling could leave repeated question types adjacent at the end.
   A shared interleaving helper preserves the selected items and quotas while
   separating repeated types when feasible, before answer-position balancing.
6. Boss had only ten scenario families and two fixed writing families. It now
   has thirty families, four fact variants each, and eleven writing families
   spanning all five units. The previous two rounds' families are avoided.
7. Review had drifted toward passage comprehension. Ten-question rounds now
   contain at least seven compact grammar responses; the remaining choices
   check interpretation. Direct comparison transformations and interpretation
   use one comparison fact. Extended cross-unit reasoning belongs in Boss.
8. Compact instructions had overwritten the distinction between repairing a
   false draft and rewriting a correct sentence. Repairs now explicitly say
   "Correct the draft". "Reverse the relationship" is bold, underlined, and
   repeated in the instruction band. Scoped prompts only reference visible
   information. English production is labelled, with no stray adjective line.
9. The setup grid's CSS display rule overrode its hidden attribute, pushing
   results below the fold. Hidden setup now occupies no space, and completion
   scrolls to and focuses the results heading. Actual ten-question rounds are
   checked for accurate scores and in-viewport results on desktop and mobile.

## What The Checks Establish

`quality-practice.test.js` groups questions by their visible scaffolding, labels,
instructions, word bank and available options, excluding the passage. It finds
pairs where the scaffolding is identical but the passage changes the correct
response, and verifies that cross-submitting those responses fails. Option order
is compared as a set because actual option placement is independently shuffled.
This catches answer cues in labels and fixed ordering, not just invalid HTML.

Boss tests independently recompute claims from recorded facts, exercise all four
meaning variants, and check 120 successive rounds for family cooldown and writing
coverage. All checked writing answers have kana equivalents. Review retains
twelve task formats with weights favoring grammar use and compact controls.
The old minimum prompt-length assertion was removed: concise questions should
not need filler. Boss stays at eight choices plus two final
sentences, without appended retries or adaptive insertion.

## Limits

This does not prove every task is impossible to guess without reading, nor does
it calibrate official JLPT difficulty. Some exercises intentionally isolate a
construction; English-to-Japanese tasks intentionally provide target meaning.
Full-sentence grading still uses checked answers, not an unrestricted Japanese
parser. An unmatched paraphrase is reported as unmatched, not bad Japanese.
The new scenarios need learner testing, especially their length and distractors.
Units 06-25 and the later Boss blocks are outside this pass.

## Teaching References

Original situations, not copied test questions. The same-actor constraint for
simultaneous actions was checked against the Japan Foundation's
[ながら teaching note](https://www.kyozai.jpf.go.jp/kyozai/material/BMA00069/ja/render.do).
The experience distinction follows
[Marugoto's past-experience explanation](https://a2.marugotoweb.jp/ja/grammar/description/013.html).
These sources support grammar rules, not a claim that the generated items are
officially reviewed or certified at a particular exam difficulty.

## Reproduce

```sh
node --test '*practice.test.js' ability-experience.test.js
node grammar-audit.js --strict
node boss-pilot-preview.js --write
PLAYWRIGHT_CHANNEL=chrome node boss-browser-test.js
PLAYWRIGHT_CHANNEL=chrome node response-browser-test.js
PLAYWRIGHT_CHANNEL=chrome node review-feedback-browser-test.js
```

Playwright must be on the Node module path. The Review browser harness is
`comparison-browser-test.js`, with `GRAMMAR_TEST_UNIT` set to `comparison`, `time`,
`invitation`, `ability`, or `experience`. Set `GRAMMAR_TEST_URL` for live checks.
