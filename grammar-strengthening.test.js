const test=require('node:test'),assert=require('node:assert/strict');
const core=require('./grammar-practice-core.js'),data=require('./final-grammar-practice.js');
const runtime=require('./grammar-audit.js').loadGrammarRuntime();
test('offered mistakes get known-choice feedback while unmatched writing stays distinct',()=>{
 for(const id of ['permission','desire','appearance','reason','purpose','listing','certainty','advice','conditionals','tara-nara','concession','quotation','intention','hearsay','change','decisions','te-auxiliary','giving','passive','causative']){
  const e=runtime.getMeaningPracticeEngine(id);
  for(const q of e.buildBank())if(q.fields)for(const [i,f]of q.fields.entries())for(const o of f.options||[]){
   if(f.accepted.some(a=>e.normalize(a)===e.normalize(o)))continue;
   const input=q.fields.map(f=>f.answer);input[i]=o;const result=e.grade(q,input);
   assert.equal(result.correct,false);assert.doesNotMatch(result.feedback.join(' '),/not among the checked answers/,q.meta.id);
  }
 }
 const e=data.modules.giving.create(),q=e.buildBank().find(q=>q.meta.task==='favor-viewpoint');
 assert.match(e.grade(q,['あげました']).feedback.join(' '),/outward/);
 assert.match(e.grade(q,['unrecognized wording']).feedback.join(' '),/not among the checked answers/);
});
test('identical giving frames change answer when performer and beneficiary reverse',()=>{
 const e=data.modules.giving.create(),bank=e.buildBank().filter(q=>q.meta.task==='favor-viewpoint');
 const family=bank[0].meta.familyKey,items=bank.filter(q=>q.meta.familyKey===family);
 const receiver=items.find(q=>q.meta.facts.actor==='Tanaka'&&q.meta.facts.viewpoint==='もらいました');
 const giver=items.find(q=>q.meta.facts.actor==='you'&&q.meta.facts.viewpoint==='あげました');
 const frame=q=>q.responseRows[0].segments.map(s=>typeof s==='string'?s:'[blank]').join('');
 assert.equal(frame(receiver),frame(giver));
 assert.ok(e.grade(receiver,['もらいました']).correct);assert.equal(e.grade(receiver,['あげました']).correct,false);
 assert.ok(e.grade(giver,['あげました']).correct);assert.equal(e.grade(giver,['もらいました']).correct,false);
 const paired=e.buildBank().filter(q=>q.meta.task==='preserve-benefit');
 assert.ok(paired.some(q=>q.fields[0].answer==='私'));assert.ok(paired.some(q=>q.fields[0].answer==='田中さん'));
});
test('Boss accepts checked contractions and rejects a changed causative viewpoint',()=>{
 const boss=require('./boss-twentyone-twentyfive.js').create();
 for(const q of boss.buildBank().filter(q=>q.meta.sourceSessionId==='causative'&&q.meta.facts.first)){
  const action=data.actions.find(a=>a.id===q.meta.actionKey);
  if(!action?.shortForced)continue;
  const writing={...q,...q.writing};
  const forced=action.forced.replace(/る$/,'ました'),short=action.shortForced.replace(/る$/,'ました');
  assert.ok(boss.grade(writing,[q.answer.replace(forced,short)]).correct);
  assert.equal(boss.grade(writing,[q.answer.replace(forced,action.cause.replace(/る$/,'ました'))]).correct,false);
 }
});
test('voice coverage includes intransitives, irregular 来る/する, and several godan endings',()=>{
 const voices=require('./voice-scenes.js');
 assert.equal(voices.frames.length,8);assert.ok(voices.frames.some(s=>s.cause==='ここへ来させる'));
 assert.ok(voices.frames.some(s=>s.cause==='勉強させる'));
 const e=data.modules.causative.create();
 for(const q of e.buildBank().filter(q=>q.meta.task==='intransitive-roles')){
  assert.ok(e.grade(q,q.fields.map(f=>f.answer)).correct);
  const changed=q.fields.map(f=>f.answer),s=voices.frames.find(s=>q.meta.familyKey.endsWith(s.id));
  changed[1]=q.meta.facts.forced?s.cause:s.forced;
  assert.equal(e.grade(q,changed).correct,false);
 }
 assert.ok(data.modules.passive.create().buildBank().some(q=>q.meta.task==='person-passive'));
});
test('same thought frame can mean a new intention or a past-event belief',()=>{
 const e=require('./intention-practice.js').create(),b=e.buildBank().filter(q=>q.meta.task==='intention-not-report');
 const q=b[0],other=b.find(p=>p.meta.familyKey===q.meta.familyKey&&p.meta.facts.plan!==q.meta.facts.plan);
 assert.ok(other);assert.doesNotMatch(core.completeResponse(q),/明日/);
 assert.notEqual(q.answer,other.answer);assert.equal(e.grade(other,[q.answer]).correct,false);
});
test('hearsay and appearance are both tested within the same task and vocabulary',()=>{
 const b=require('./hearsay-practice.js').create().buildBank().filter(q=>q.meta.task==='hearsay-or-appearance');
 assert.equal(new Set(b.map(q=>q.answer)).size,2);
 const bq=b.filter(q=>q.meta.familyKey===b[0].meta.familyKey);assert.equal(new Set(bq.map(q=>q.meta.facts.heard)).size,2);
});
test('Boss choice prompts hide form hints; final writing retains necessary constraints',()=>{
 for(const name of ['boss-eleven-fifteen','boss-sixteen-twenty','boss-twentyone-twentyfive']){
  const bank=require('./'+name+'.js').create().buildBank();
  for(const q of bank){assert.doesNotMatch(q.prompt,/\([^)]*[ぁ-龯]/);assert.ok(q.writing.prompt);}
 }
});
test('ruby preserves word boundaries in the reproduced phrases; tokens expose kana for native controls',()=>{
 for(const text of ['仕事が見つかるといいですね。','部屋が静かだといいですね。','みんなに字が見えるように、大きく書きます。']){
  const html=runtime.renderJapaneseTextWithFurigana(text);
  assert.doesNotMatch(html,/<ruby>[^<]*(が|みんなに)[^<]*<rt>/);
  assert.doesNotMatch(html.replace(/<ruby>.*?<\/ruby>/g,''),/[一-龯]/);
 }
 const f=require('./furigana.js').create([['読ませる','よませる']]);
 assert.equal(f.tokens('読ませる')[0].reading,'よませる');
});
test('decisions distinguish settled plans from completed events; completion frames require bounded actions',()=>{
 const e=data.modules.decisions.create(),bank=e.buildBank().filter(q=>q.meta.task==='decision-or-event');
 const family=bank[0].meta.familyKey,items=bank.filter(q=>q.meta.familyKey===family);
 assert.equal(new Set(items.map(q=>q.meta.facts.stage)).size,3);
 assert.equal(new Set(items.map(q=>q.answer)).size,3);
 for(const q of items){assert.ok(e.grade(q,q.fields.map(f=>f.answer)).correct);for(const other of items.filter(p=>p!==q))assert.equal(e.grade(q,other.fields.map(f=>f.answer)).correct,false);}
 const helpers=data.modules['te-auxiliary'].create().buildBank();
 assert.ok(!helpers.some(q=>q.meta.domain==='use'&&(q.meta.task==='completed-helper'||q.meta.facts.goal==='finish')));
 assert.ok(helpers.some(q=>q.meta.domain==='read'&&q.meta.facts.goal==='finish'));
});
