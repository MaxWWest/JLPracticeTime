const test=require('node:test');
const assert=require('node:assert/strict');
const core=require('./grammar-practice-core.js');
const {loadGrammarRuntime}=require('./grammar-audit.js');
const units=['concession','quotation','intention','hearsay','change'];
const modules=Object.fromEntries(units.map(id=>[id,require(`./${id}-practice.js`)]));
const boss=require('./boss-sixteen-twenty.js');
const runtime=loadGrammarRuntime();
for(const unit of units){
 const mod=modules[unit],engine=mod.create(),bank=engine.buildBank();
 test(`${unit}: answers, checked alternatives and distractors`,()=>{
  assert.ok(bank.length>=200);
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
 test(`${unit}: Review routes only to new bank, diverse 10/25/40 queues`,()=>{
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
test('valid overlaps remain accepted; negative changes use なく, not な',()=>{
 const q=modules.quotation.create().buildBank();
 for(const item of q.filter(q=>q.meta.task==='report-or-question'))assert.deepEqual(item.fields[0].accepted,['かどうか','か']);
 for(const item of q.filter(q=>q.meta.task==='question-word'))assert.deepEqual(item.fields[0].accepted,['か']);
 for(const item of modules.hearsay.create().buildBank().filter(q=>q.meta.task==='relay-information'))assert.deepEqual(item.fields[0].accepted,['そうです','らしいです']);
 const data=require('./discourse-scenes.js');
 for(const item of modules.change.create().buildBank()){
  const a=data.actions.find(a=>item.meta.familyKey==='change:'+a.id);
  if(!a)continue;
  if(item.meta.task==='lost-ability')assert.equal(core.completeResponse(item),a.prefix+a.cannot.slice(0,-1)+'くなりました。');
  if(item.meta.task==='stopped-habit')assert.equal(core.completeResponse(item),a.prefix+a.nai.slice(0,-1)+'くなりました。');
 }
 const c=modules.concession.create().buildBank();
 assert.ok(c.some(q=>q.meta.task==='completed-despite'));
 assert.ok(c.some(q=>q.meta.task==='negative-premise'));
 for(const item of c.filter(q=>q.meta.task==='both-cases'))assert.match(core.completeResponse(item),/なくても/);
});
test('Boss options independently encode both facts; full writing preserves them',()=>{
 const engine=boss.create(),bank=engine.buildBank();
 assert.equal(bank.length,120);assert.equal(new Set(bank.map(q=>q.meta.familyKey)).size,30);
 const semanticFacts=(text,unit)=>{
  const [a,b]=text.split('。');
  switch(unit){
   case 'concession':return{first:a.includes('ても'),second:!a.includes('ないつもり')};
   case 'quotation':return{first:!a.includes('いつ'),second:!b.includes('ないそう')};
   case 'intention':return{first:!a.includes('ないつもり'),second:/[めけえれ]るよう/.test(b)};
   case 'hearsay':return{first:!a.includes('ないそう'),second:b.includes('ても')};
   case 'change':return{first:/[めけえれ]るよう/.test(a),second:!b.includes('いつ')};
  }
 };
 for(const q of bank){
  assert.equal(new Set(q.options).size,4);
  assert.deepEqual(semanticFacts(q.answer,q.meta.sourceSessionId),q.meta.facts,q.meta.id);
  q.options.forEach((o,i)=>assert.deepEqual(semanticFacts(o,q.meta.sourceSessionId),q.choiceFacts[i],o));
  const writing={...q,...q.writing};
  for(const answer of writing.fields[0].accepted){
   assert.ok(engine.grade(writing,[answer]).correct);
   const kana=engine.normalize(answer);assert.doesNotMatch(kana,/[一-龯]/,`${q.meta.id}: ${kana}`);
   assert.ok(engine.grade(writing,[kana]).correct);
  }
  for(const o of q.options.filter(o=>o!==q.answer))assert.equal(engine.grade(writing,[o]).correct,false);
 }
});
test('Boss covers all five units with eight choices and two final writing items',()=>{
 const bank=runtime.buildGrammarPracticeBank('boss-16-20'),first=boss.selectQueue(bank,25,{seed:4});
 assert.equal(first.length,10);assert.ok(first.slice(0,8).every(q=>q.mode==='choice'));
 assert.ok(first.slice(8).every(q=>q.mode==='text'&&q.meta.answerMode==='full'));
 for(const unit of units)assert.equal(first.filter(q=>q.meta.sourceSessionId===unit).length,2);
 for(const q of first)q.options.forEach((o,i)=>{const src=bank.find(b=>b.meta.id===q.meta.id);assert.deepEqual(q.choiceFacts[i],src.choiceFacts[src.options.indexOf(o)]);});
 const next=boss.selectQueue(bank,10,{seed:4,recent:first.map(q=>q.meta.sceneKey)});
 assert.ok(next.every(q=>!first.some(p=>p.meta.familyKey===q.meta.familyKey)));
 const routed=runtime.buildFocusedGrammarQueue('boss-16-20',bank,'boss',25);
 assert.equal(routed.length,10);assert.ok(routed.every(q=>q.meta.engine===boss.version));
});
test('new content has word-level furigana coverage',()=>{
 for(const id of [...units,'boss-16-20'])for(const q of runtime.buildGrammarPracticeBank(id)){
  const texts=[q.prompt,q.fields?core.completeResponse(q):q.answer,...(q.options||[]),...(q.fields||[]).flatMap(f=>f.options||[])];
  for(const text of texts){
   const html=runtime.renderJapaneseTextWithFurigana(text);
   assert.doesNotMatch(html.replace(/<ruby>.*?<\/ruby>/g,''),/[一-龯々]/,`${q.meta.id}: ${text}`);
  }
 }
 const html=runtime.renderJapaneseTextWithFurigana('写真を送ろうと思っています');
 assert.match(html,/<ruby>写真<rt>しゃしん<\/rt><\/ruby>/);
 assert.doesNotMatch(html,/<ruby>写真を/);
});
