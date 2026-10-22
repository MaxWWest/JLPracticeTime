const test=require('node:test');
const assert=require('node:assert/strict');
const core=require('./grammar-practice-core.js');
const {loadGrammarRuntime}=require('./grammar-audit.js');
const units=['listing','certainty','advice','conditionals','tara-nara'];
const modules=Object.fromEntries(units.map(id=>[id,require(`./${id}-practice.js`)]));
const boss=require('./boss-eleven-fifteen.js');
const runtime=loadGrammarRuntime();
for(const unit of units){
 const mod=modules[unit],engine=mod.create(),bank=engine.buildBank();
 test(`${unit}: generated answers, alternatives, readings and wrong choices`,()=>{
  assert.ok(bank.length>=150);
  assert.equal(new Set(bank.map(q=>q.meta.id)).size,bank.length);
  for(const q of bank){
   assert.equal(q.meta.engine,mod.version);
   assert.ok(q.prompt&&q.subprompt&&q.explanation);
   assert.doesNotMatch(JSON.stringify(q),/undefined|\[object Object\]/);
   if(q.fields){
    const values=q.fields.map(f=>f.answer);
    assert.ok(engine.grade(q,values).correct,q.meta.id);
    assert.ok(core.completeResponse(q));
    for(const[i,f]of q.fields.entries()){
     assert.equal(f.multiline,false);assert.equal(f.placeholder,undefined);
     assert.ok(f.options.length>=2);assert.equal(new Set(f.options).size,f.options.length);
     for(const answer of f.accepted){
      const input=[...values];input[i]=answer;
      assert.ok(engine.grade(q,input).correct,q.meta.id);
      input[i]=engine.normalize(answer);
      assert.doesNotMatch(input[i],/[一-龯]/,`${q.meta.id}: ${input[i]}`);
      assert.ok(engine.grade(q,input).correct,q.meta.id);
     }
     for(const option of f.options){const input=[...values];input[i]=option;
      assert.equal(engine.grade(q,input).correct,f.accepted.some(a=>engine.normalize(a)===engine.normalize(option)),q.meta.id);
     }
    }
   }else{
    assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);
    for(const option of q.options)assert.equal(engine.grade(q,option).correct,option===q.answer);
   }
  }
 });
 test(`${unit}: actual Review routing, 10/25/40 unique families and freshness`,()=>{
  const source=runtime.buildGrammarPracticeBank(unit);
  assert.equal(source.length,bank.length);
  for(const count of [10,25,40])for(const seed of [11,42,99]){
   const queue=mod.selectQueue(bank,count,{seed});
   assert.equal(queue.length,count);assert.equal(new Set(queue.map(q=>q.meta.familyKey)).size,count);
   assert.ok(new Set(queue.map(q=>q.meta.task)).size>=4);
   assert.ok(queue.filter(q=>q.mode==='choice').length<=Math.floor(count/3));
   assert.ok(queue.filter(q=>q.fields).every(q=>q.meta.answerMode==='cloze'));
  }
  const routed=runtime.buildFocusedGrammarQueue(unit,source,'review',10);
  assert.ok(routed.every(q=>q.meta.engine===mod.version));assert.equal(routed.length,10);
  const original=JSON.stringify(bank),first=mod.selectQueue(bank,10,{seed:123});
  const next=mod.selectQueue(bank,10,{seed:123,recent:first.map(q=>q.meta.familyKey)});
  assert.ok(next.filter(q=>first.some(p=>p.meta.familyKey===q.meta.familyKey)).length<3);
  assert.equal(JSON.stringify(bank),original);
 });
}
test('overlapping grammar is accepted and attachments are category-specific',()=>{
 const c=modules.certainty;
 assert.equal(c.forms({text:'学生',type:'noun'}).seem,'学生の');
 assert.equal(c.forms({text:'静か',type:'na'}).expect,'静かな');
 assert.equal(c.forms({text:'寒い',type:'i'}).negative,'寒くない');
 for(const q of c.create().buildBank().filter(q=>q.meta.task==='evidence-impression'))assert.equal(q.fields[0].accepted.length,2);
 const conditions=modules.conditionals.create().buildBank();
 assert.deepEqual(conditions.find(q=>q.meta.task==='state-with-request').fields[0].accepted,['あれば','あったら']);
 for(const q of modules['tara-nara'].create().buildBank().filter(q=>q.meta.task==='actual-discovery')){
  assert.ok(q.fields[0].accepted[0].endsWith('たら')||q.fields[0].accepted[0].endsWith('だら'));
  assert.ok(q.fields[0].accepted[1].endsWith('と'));
 }
 const plans=require('./conditional-scenes.js').plans;
 for(const q of modules['tara-nara'].create().buildBank().filter(q=>q.meta.task==='plan-or-completion')){
  const p=plans.find(s=>q.meta.familyKey.endsWith(s.id));
  assert.equal(q.fields[0].answer,q.meta.facts.after?p.ta+'ら':p.verb+'なら');
 }
});
test('Boss independently preserves each fact and grades writing without changing either',()=>{
 const engine=boss.create(),bank=engine.buildBank();
 assert.equal(bank.length,120);assert.equal(new Set(bank.map(q=>q.meta.familyKey)).size,30);
 const semanticFacts=(text,unit)=>{
  switch(unit){
   case 'listing':return{first:text.includes('りしました'),second:text.includes('はずです')};
   case 'certainty':return{first:!text.split('。')[0].includes('ないはず'),second:!text.split('。')[1].includes('ないほう')};
   case 'advice':return{first:text.includes('なさい'),second:text.includes('りしました')};
   case 'conditionals':return{first:!text.split('、')[0].includes('なければ'),second:!text.split('、')[1].includes('ないほう')};
   case 'tara-nara':return{first:!text.includes('なら'),second:text.includes('連絡した')};
  }
 };
 for(const q of bank){
  assert.equal(new Set(q.options).size,4);
  assert.deepEqual(semanticFacts(q.answer,q.meta.sourceSessionId),q.meta.facts,q.meta.id);
  q.options.forEach((o,i)=>assert.deepEqual(semanticFacts(o,q.meta.sourceSessionId),q.choiceFacts[i]));
  const writing={...q,...q.writing};
  for(const answer of writing.fields[0].accepted){
   assert.ok(engine.grade(writing,[answer]).correct);
   const kana=engine.normalize(answer);assert.doesNotMatch(kana,/[一-龯]/,`${q.meta.id}: ${kana}`);
   assert.ok(engine.grade(writing,[kana]).correct);
  }
  for(const o of q.options.filter(o=>o!==q.answer))assert.equal(engine.grade(writing,[o]).correct,false);
 }
});
test('Boss mixes five units and keeps full writing at the end',()=>{
 const bank=runtime.buildGrammarPracticeBank('boss-11-15'),first=boss.selectQueue(bank,25,{seed:4});
 assert.equal(first.length,10);assert.ok(first.slice(0,8).every(q=>q.mode==='choice'));
 assert.ok(first.slice(8).every(q=>q.mode==='text'&&q.meta.answerMode==='full'));
 for(const unit of units)assert.equal(first.filter(q=>q.meta.sourceSessionId===unit).length,2);
 for(const q of first)q.options.forEach((o,i)=>{const src=bank.find(b=>b.meta.id===q.meta.id);assert.deepEqual(q.choiceFacts[i],src.choiceFacts[src.options.indexOf(o)]);});
 const next=boss.selectQueue(bank,10,{seed:4,recent:first.map(q=>q.meta.sceneKey)});
 assert.ok(next.every(q=>!first.some(p=>p.meta.familyKey===q.meta.familyKey)));
 const routed=runtime.buildFocusedGrammarQueue('boss-11-15',bank,'boss',25);
 assert.equal(routed.length,10);assert.ok(routed.every(q=>q.meta.engine===boss.version));
});
test('new-unit display readings cover kanji without whole-clause ruby',()=>{
 for(const id of [...units,'boss-11-15'])for(const q of runtime.buildGrammarPracticeBank(id)){
  const texts=[q.prompt,q.fields?core.completeResponse(q):q.answer,...(q.options||[])];
  for(const text of texts){
   const html=runtime.renderJapaneseTextWithFurigana(text);
   assert.doesNotMatch(html.replace(/<ruby>.*?<\/ruby>/g,''),/[一-龯々]/,`${q.meta.id}: ${text}`);
  }
 }
 const html=runtime.renderJapaneseTextWithFurigana('かばんの中を見る');
 assert.match(html,/<ruby>中<rt>なか<\/rt><\/ruby>/);
 assert.match(html,/<ruby>見<rt>み<\/rt><\/ruby>る/);
 assert.doesNotMatch(html,/<ruby>かばん/);
});
