const test=require('node:test'),assert=require('node:assert/strict');
const core=require('./grammar-practice-core.js'),data=require('./final-grammar-practice.js');
const boss=require('./boss-twentyone-twentyfive.js');
test('one Japanese frame requires three different forms when control changes',()=>{
 for(const unit of ['passive','causative']){
  const e=data.modules[unit].create(),q=e.buildBank().filter(q=>q.meta.task==='same-frame-different-event'&&q.meta.familyKey.endsWith('read:本'));
  assert.equal(q.length,3);
  const frame=p=>p.responseRows[0].segments.map(s=>typeof s==='string'?s:'[blank]').join('');
  assert.equal(new Set(q.map(frame)).size,1);
  const expected={affected:'読まれました',causer:'読ませました',compelled:'読ませられました'};
  for(const item of q){assert.equal(item.fields[0].answer,expected[item.meta.facts.event]);
   for(const [event,answer]of Object.entries(expected))assert.equal(e.grade(item,[answer]).correct,event===item.meta.facts.event);
  }
 }
});
test('participant interpretation follows voice rather than the fixed 私は...に frame',()=>{
 const e=data.modules.passive.create();
 const items=e.buildBank().filter(q=>q.meta.task==='identify-voice-participants'&&q.meta.familyKey.endsWith('read:本'));
 const answers={affected:['田中さん','Not stated'],causer:['田中さん','私'],compelled:['私','田中さん']};
 for(const q of items){const expected=answers[q.meta.facts.event];assert.deepEqual(q.fields.map(f=>f.answer),expected);assert.ok(e.grade(q,expected).correct);
  for(const wrong of Object.values(answers).filter(a=>a!==expected))assert.equal(e.grade(q,wrong).correct,false);
 }
});
test('giver and recipient remain distinct with both counterpart names and viewpoints',()=>{
 const e=data.modules.giving.create(),b=e.buildBank().filter(q=>q.meta.task==='identify-favor-participants');
 assert.ok(b.some(q=>q.prompt.includes('佐藤さん')));
 for(const q of b){const tanaka=q.prompt.includes('田中さん'),other=tanaka?'田中さん':'佐藤さん',inward=q.prompt.endsWith('もらいました。');
  const expected=inward?[other,'私']:['私',other];
  assert.deepEqual(q.fields.map(f=>f.answer),expected);
  assert.ok(e.grade(q,expected).correct);assert.equal(e.grade(q,[...expected].reverse()).correct,false);
 }
});
test('request wording changes the requested performer using identical vocabulary',()=>{
 const e=data.modules.causative.create(),q=e.buildBank().filter(q=>q.meta.task==='request-performer'&&q.meta.familyKey.endsWith('read:本'));
 assert.equal(q.length,2);
 assert.equal(q.find(p=>p.prompt==='本を読ませてくれませんか。').answer,'私');
 assert.equal(q.find(p=>p.prompt==='本を読んでくれませんか。').answer,'相手');
});
test('Boss situations reuse the same action across their connected clauses, without construction hints',()=>{
 const bank=boss.create().buildBank();
 for(const q of bank){
  const a=boss.scenes.find(a=>a.id===q.meta.actionKey);assert.ok(a);
  assert.doesNotMatch(q.prompt,/[ぁ-龯]/);
  assert.ok(q.answer.includes(a.noun));
  for(const other of boss.scenes.filter(other=>other.noun!==a.noun))assert.ok(!q.answer.includes(other.prefix),q.meta.id);
 }
 const controlled=bank.find(q=>q.meta.task==='control-next-time'&&q.meta.actionKey==='read:本'&&q.meta.facts.first&&!q.meta.facts.second);
 assert.equal(controlled.answer,'私は田中さんに本を読ませられました。次は本を読まないことにしました。');
 const favor=bank.find(q=>q.meta.task==='favor-view'&&q.meta.actionKey==='read:本'&&q.meta.facts.first&&q.meta.facts.second);
 assert.equal(favor.answer,'私は田中さんに本を読んでおいてもらいました。');
});
test('Boss balances all five units and ten different activities across seeds and recent history',()=>{
 const bank=boss.create().buildBank();
 for(const seed of [4,11,42,99]){
  const first=boss.selectQueue(bank,10,{seed}),next=boss.selectQueue(bank,10,{seed,recent:first.map(q=>q.meta.sceneKey)});
  for(const queue of [first,next]){
   assert.equal(queue.length,10);assert.equal(new Set(queue.map(q=>q.meta.actionKey)).size,10);
   for(const unit of data.units)assert.equal(queue.filter(q=>q.meta.sourceSessionId===unit).length,2);
   assert.ok(queue.slice(0,8).every(q=>q.mode==='choice'));assert.ok(queue.slice(8).every(q=>q.meta.answerMode==='full'));
  }
  assert.ok(next.every(q=>!first.some(p=>p.meta.familyKey===q.meta.familyKey)));
 }
});
