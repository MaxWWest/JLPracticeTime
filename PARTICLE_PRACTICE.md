# Particle Practice

Grammar now has a separate Particle practice sub-tab. The 25 existing grammar
units and five Boss blocks keep their existing banks and routes.

## Scope

- Eight focused areas: de/ni; wo/to; mo/shika; dake/demo; wa/ga; no/koto;
  te/naide/nakute links; kara/made/madeni boundaries.
- Mixed practice uses the same checked frames, not another inflated content bank.
- 10- or 20-question rounds. Short dropdown blanks are the majority, with some
  interpretation choices. No full-sentence transcription or adaptive insertion.
- 374 authored frames cover 370 distinct completed sentences and produce 731
  question variants. These are not 731 independent grammar patterns: vocabulary
  variants share functional structures. Each focused area has 45-48 distinct
  sentences, enough for two nonoverlapping 20-question rounds.

## Teaching Constraints

The supplied study pages informed the coverage; the application uses its own
short prompts and examples, not scans or a transcription of the textbook.
Compatible object/verb combinations reuse DrillLexicon; particle-specific frames
own their meanings and feedback rather than freely combining incompatible words.

- State the intended meaning briefly in English, or show a Japanese utterance and
  ask what the particle contributes. Do not add unrelated reading passages.
- Event location can use de with aru; existence uses ni. Movement direction he
  is not incorrectly marked wrong by presenting it as a distractor for ni.
- The blooming-in-the-garden frame accepts both ni (location of a state) and de
  (site of the event). The explanation distinguishes perspectives, not correctness.
- Shika with a negative predicate expresses a positive restriction, while one +
  counter + mo + negative denies even that minimum. With discrete whole-item
  counts this means zero; a duration such as one hour can mean less than an hour.
- Wa/ga questions specify discourse focus or explicit contrast; feedback does
  not declare every alternative universally ungrammatical.
- Both no and koto are accepted before ga suki. Direct sensory perception and
  the activity predicate koto desu have separately authored frames.
- Nai-de for an omitted accompanying action is contrasted with nakute for a
  negative cause. Te links are identified separately from noun particles.
- Native dropdowns begin empty, contain no answer placeholders, and get
  option-specific feedback. Interpretation prompts name the construction being
  interpreted without duplicating the instruction in two places.

Reference checks: [Japan Foundation Marugoto grammar](https://a2.marugotoweb.jp/ja/grammar/index.html)
and [Japan Foundation departure wo](https://www.kyozai.jpf.go.jp/kyozai/material/BTS00042/ja/render.do).
These references supplement rather than replace the authored question checks.

## Integration

`particle-practice.js` exports focused engine adapters and a mixed adapter for
the existing grammar renderer, grading, freshness history and result diagnostics.
The same session/result DOM is mounted in the selected Grammar sub-tab. Starting,
leaving, completing and returning to ordinary Grammar practice are browser-tested.

Queue selection balances function families and avoids a constant blank answer.
Dropdown shuffling advances a seeded random stream across the round rather than
resetting it for each question. A completed sentence cannot recur within a round,
even when the alternative frame blanks a different particle. Selection exhausts
unseen sentences before releasing the least recently seen ones. The stored last
50 frame IDs remain compatible; history does not adapt to scores.

User-requested retries match both task and grammatical function. If all matching
sentences are already queued, the retry is unavailable rather than substituting
unrelated grammar. No retry is inserted automatically.

## Verification

- `node --test --test-reporter=dot *.test.js`
- `node grammar-audit.js --strict`
- `node particle-browser-test.js` with Playwright and Chrome available.
- All nine sessions completed at 1440px and 390px with deliberate wrong answers
  and visible 8/10, 80% stats; every variant rendered at 320px without overflow.
- Regression: a normal comparison round still completes after particle practice.
- Repeated 20-question rounds exclude the preceding round's completed sentences;
  seeded position tests detect systematic answer-position leaks.
- Real browser checks cover both accepted blooming answers, targeted/exhausted
  retries, and nan-demo in both the blank and completed sentence.
- Every authored particle sentence has ruby coverage for all kanji. Coverage does
  not itself certify pronunciation, so key counters and readings remain explicit.
  Exact-reading tests distinguish nan-demo from nani-ga; isolated nani is not
  globally changed to nan.
