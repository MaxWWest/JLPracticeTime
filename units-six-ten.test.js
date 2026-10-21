const test = require('node:test');
const assert = require('node:assert/strict');
const core = require('./grammar-practice-core.js');
const { loadGrammarRuntime } = require('./grammar-audit.js');
const units = ['permission','desire','appearance','reason','purpose'];
const modules = Object.fromEntries(units.map(id=>[id,require(`./${id}-practice.js`)]));
const boss = require('./boss-six-ten.js');
const runtime = loadGrammarRuntime();

for (const unit of units) {
 const module = modules[unit], engine = module.create(), bank = engine.buildBank();
 test(`${unit}: every generated question grades its answers and rejects meaning-changing options`,()=>{
  assert.ok(bank.length >= 150);
  assert.equal(new Set(bank.map(q=>q.meta.id)).size,bank.length);
  for(const q of bank){
   assert.equal(q.meta.engine,module.version);
   assert.ok(q.prompt && q.subprompt && q.explanation);
   assert.doesNotMatch(q.prompt,/undefined|\[object Object\]/);
   if(q.fields){
    const values=q.fields.map(f=>f.answer);
    assert.ok(engine.grade(q,values).correct,q.meta.id);
    assert.ok(core.completeResponse(q).length>0);
    for(const [i,f]of q.fields.entries()){
     assert.equal(f.multiline,false);
     assert.equal(f.placeholder,undefined);
     assert.ok(f.options.length>=2);
     assert.equal(new Set(f.options).size,f.options.length);
     for(const answer of f.accepted){
      const input=[...values];input[i]=answer;
      assert.ok(engine.grade(q,input).correct,q.meta.id);
	     input[i]=engine.normalize(answer);
	     assert.doesNotMatch(input[i],/[一-龯]/,q.meta.id);
	     assert.ok(engine.grade(q,input).correct,q.meta.id);
     }
     for(const option of f.options){
      const input=[...values];input[i]=option;
      assert.equal(engine.grade(q,input).correct,f.accepted.some(a=>engine.normalize(a)===engine.normalize(option)),q.meta.id);
     }
    }
   }else{
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options).size,4);
    for(const option of q.options)assert.equal(engine.grade(q,option).correct,option===q.answer);
   }
  }
 });
 test(`${unit}: actual Review routing stays compact, varied and inside the new engine`,()=>{
  const source=runtime.buildGrammarPracticeBank(unit);
  assert.equal(source.length,bank.length);
  for(const count of [10,25,40])for(const seed of [11,42,99]){
   const queue=module.selectQueue(bank,count,{seed});
   assert.equal(queue.length,count,`${unit} ${count}`);
   assert.equal(new Set(queue.map(q=>q.meta.familyKey)).size,count);
   assert.ok(new Set(queue.map(q=>q.meta.task)).size>=4);
   assert.ok(queue.filter(q=>q.mode==='choice').length<=Math.floor(count/3));
   assert.ok(queue.filter(q=>q.fields).every(q=>q.meta.answerMode==='cloze'));
  }
  const routed=runtime.buildFocusedGrammarQueue(unit,source,'review',10);
  assert.equal(routed.length,10);
  assert.ok(routed.every(q=>q.meta.engine===module.version));
  const original=JSON.stringify(bank);
  const first=module.selectQueue(bank,10,{seed:123});
  const next=module.selectQueue(bank,10,{seed:123,recent:first.map(q=>q.meta.familyKey)});
  assert.ok(next.filter(q=>first.some(p=>p.meta.familyKey===q.meta.familyKey)).length<3);
  assert.equal(JSON.stringify(bank),original);
 });
}

test('conjugation and semantic edge cases are preserved',()=>{
 const actions=require('./drill-lexicon.js').actions;
 const de=modules.desire.create(),bank=de.buildBank();
 for(const a of actions){
  const q=bank.find(q=>q.meta.task==='observed-wish'&&q.meta.familyKey.endsWith(a.id));
  assert.ok(q.fields[0].options.includes(`${a.te}います`));
  assert.equal(de.grade(q,[`${a.te}います`]).correct,false);
 }
 assert.ok(!bank.some(q=>q.meta.task==='wanted-thing'&&q.prompt.includes('your name')));
 for(const q of modules.reason.create().buildBank().filter(q=>['connect-cause','reason-request'].includes(q.meta.task))){
  assert.equal(q.fields[0].accepted.length,2);
 }
 assert.equal(modules.appearance.forms('いい','よ',true,'seen'),'よさそうです');
 assert.equal(modules.appearance.forms('いい','よ',false,'seen'),'よくなさそうです');
 assert.equal(modules.appearance.forms('静か','静か',true,'heard'),'静かだそうです');
 assert.equal(modules.appearance.forms('静か','静か',false,'seen'),'静かではなさそうです');
 assert.equal(modules.reason.rows.length,modules.reason.contrasts.length);
 modules.reason.rows.forEach((row,i)=>assert.notEqual(row[1],modules.reason.contrasts[i]));
});

test('Boss choices preserve two independently checked facts; all writing alternatives preserve those facts',()=>{
 const engine=boss.create(),bank=engine.buildBank();
 assert.equal(bank.length,120);
 assert.equal(new Set(bank.map(q=>q.meta.familyKey)).size,30);
 for(const q of bank){
  assert.equal(new Set(q.options).size,4);
  const semanticFacts=text=>{
   switch(q.meta.sourceSessionId){
    case 'permission':return {first:!text.includes('たくない'),second:/[てで]はいけません/.test(text)};
    case 'desire':return {first:!text.includes('たくない'),second:text.includes('難しそう')};
    case 'appearance':return {first:!text.split('。')[0].match(/(落ちる|倒れる|泣く|折れる|ぬれる|飛んでいく)そう/),second:text.includes(['机の真ん中','手で支え','優しく声','重い物を取り除','袋に入れ','ひもを持ち'][Number(q.meta.familyKey.match(/\d+$/)[0])])};
    case 'reason':return {first:text.startsWith('会議中'),second:/[てで]はいけません/.test(text)};
    case 'purpose':return {first:!text.includes('たくない'),second:text.includes('に行きました')};
   }
  };
  assert.deepEqual(semanticFacts(q.answer),q.meta.facts,q.meta.id);
  assert.equal(q.options.filter(o=>JSON.stringify(semanticFacts(o))===JSON.stringify(q.meta.facts)).length,1);
  const writing={...q,...q.writing};
  for(const answer of writing.fields[0].accepted){
   assert.ok(engine.grade(writing,[answer]).correct);
   const kana=engine.normalize(answer);
   assert.doesNotMatch(kana,/[一-龯]/,`${q.meta.id}: ${kana}`);
   assert.ok(engine.grade(writing,[kana]).correct);
  }
  for(const o of q.options.filter(o=>o!==q.answer))assert.equal(engine.grade(writing,[o]).correct,false);
 }
});

test('Boss routing balances five units, reserves writing for the finale and rotates families',()=>{
 const bank=runtime.buildGrammarPracticeBank('boss-06-10');
 const first=boss.selectQueue(bank,25,{seed:4});
 assert.equal(first.length,10);
 assert.equal(first.slice(0,8).filter(q=>q.mode==='choice').length,8);
 assert.ok(first.slice(8).every(q=>q.mode==='text'&&q.meta.answerMode==='full'));
 for(const unit of units)assert.equal(first.filter(q=>q.meta.sourceSessionId===unit).length,2);
 for(const q of first)q.options.forEach((o,i)=>assert.deepEqual(q.choiceFacts[i],bank.find(b=>b.meta.id===q.meta.id).choiceFacts[bank.find(b=>b.meta.id===q.meta.id).options.indexOf(o)]));
 const next=boss.selectQueue(bank,10,{seed:4,recent:first.map(q=>q.meta.sceneKey)});
 assert.ok(next.every(q=>!first.some(p=>p.meta.familyKey===q.meta.familyKey)));
 const routed=runtime.buildFocusedGrammarQueue('boss-06-10',bank,'boss',25);
 assert.equal(routed.length,10);
 assert.ok(routed.every(q=>q.meta.engine===boss.version));
});
