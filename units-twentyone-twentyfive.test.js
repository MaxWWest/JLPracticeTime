const test=require('node:test'),assert=require('node:assert/strict');
const k=require('./grammar-practice-core.js'),data=require('./final-grammar-practice.js'),boss=require('./boss-twentyone-twentyfive.js');
const runtime=require('./grammar-audit.js').loadGrammarRuntime();
for(const [unit,mod]of Object.entries(data.modules)){
 const engine=mod.create(),bank=engine.buildBank();
 test(`${unit}: alternatives preserve meaning and distractors change it`,()=>{
  assert.equal(new Set(bank.map(q=>q.meta.id)).size,bank.length);
  for(const q of bank){
   assert.doesNotMatch(JSON.stringify(q),/undefined|\[object Object\]/);
   if(q.fields){const values=q.fields.map(f=>f.answer);assert.ok(engine.grade(q,values).correct);
    for(const [i,f]of q.fields.entries()){
     assert.equal(f.multiline,false);assert.equal(f.placeholder,undefined);
     for(const a of f.accepted){const input=[...values];input[i]=a;assert.ok(engine.grade(q,input).correct);input[i]=engine.normalize(a);assert.doesNotMatch(input[i],/[一-龯]/);assert.ok(engine.grade(q,input).correct);}
     for(const a of f.options){const input=[...values];input[i]=a;assert.equal(engine.grade(q,input).correct,f.accepted.some(v=>engine.normalize(v)===engine.normalize(a)),q.meta.id);}
    }
   }else{assert.equal(new Set(q.options).size,4);for(const o of q.options)assert.equal(engine.grade(q,o).correct,o===q.answer);}
  }
 });
 test(`${unit}: actual route, fresh families and balanced short responses`,()=>{
  assert.equal(runtime.buildGrammarPracticeBank(unit).length,bank.length);
  for(const n of [10,25,40])for(const seed of [11,42,99]){const q=mod.selectQueue(bank,n,{seed});assert.equal(q.length,n);assert.equal(new Set(q.map(x=>x.meta.familyKey)).size,n);assert.ok(q.filter(x=>x.fields).length>=Math.ceil(n*2/3));assert.ok(new Set(q.map(x=>x.meta.task)).size>=4);}
  const first=mod.selectQueue(bank,10,{seed:41}),next=mod.selectQueue(bank,10,{seed:41,recent:first.map(q=>q.meta.familyKey)});assert.ok(next.filter(q=>first.some(p=>p.meta.familyKey===q.meta.familyKey)).length<3);
  assert.ok(runtime.buildFocusedGrammarQueue(unit,bank,'review',10).every(q=>q.meta.engine===mod.version));
 });
}
test('causative and passive performers remain distinct, including contracted forms',()=>{
 const s=data.actions.find(a=>a.verb==='読む');
 assert.equal(s.passive,'読まれる');assert.equal(s.cause,'読ませる');assert.equal(s.forced,'読ませられる');assert.equal(s.shortForced,'読まされる');
 const e=data.modules.causative.create(),q=e.buildBank().find(q=>q.meta.task==='forced-performer'&&q.meta.familyKey.endsWith(s.id));
 assert.ok(e.grade(q,['読ませられる']).correct);assert.ok(e.grade(q,['読まされる']).correct);assert.equal(e.grade(q,['読まれる']).correct,false);
 const g=data.modules.giving.create().buildBank();assert.ok(g.every(q=>!q.meta.familyKey.includes('eat:')));
});
test('Boss preserves two independent facts and reserves writing for the finale',()=>{
 const e=boss.create(),bank=e.buildBank();assert.equal(bank.length,368);
 const facts=(q,text)=>{
  const [a,b]=text.split('。');
  switch(q.meta.sourceSessionId){
   case 'decisions':return{first:a.endsWith('ことにしました'),second:b.endsWith('みます')};
   case 'te-auxiliary':return{first:a.includes('みて'),second:a.startsWith('田中さんが')};
   case 'giving':return{first:a.endsWith('もらいました'),second:a.includes('おいて')};
   case 'passive':return{first:!a.endsWith('せました'),second:b.includes('せてください')};
   case 'causative':return{first:a.endsWith('せられました'),second:!b.includes('ないこと')};
  }
 };
 for(const q of bank){assert.equal(new Set(q.options).size,4);assert.deepEqual(facts(q,q.answer),q.meta.facts,q.meta.id);q.options.forEach((o,i)=>assert.deepEqual(facts(q,o),q.choiceFacts[i],o));
  for(const a of q.writing.accepted){assert.ok(e.grade({...q,...q.writing},[a]).correct);assert.doesNotMatch(e.normalize(a),/[一-龯]/);}
  for(const o of q.options.filter(o=>o!==q.answer))assert.equal(e.grade({...q,...q.writing},[o]).correct,false);
 }
 const queue=boss.selectQueue(bank,25,{seed:4});assert.equal(queue.length,10);assert.ok(queue.slice(0,8).every(q=>q.mode==='choice'));assert.ok(queue.slice(8).every(q=>q.meta.answerMode==='full'));
 assert.equal(new Set(queue.map(q=>q.meta.actionKey)).size,10);
 for(const unit of data.units)assert.equal(queue.filter(q=>q.meta.sourceSessionId===unit).length,2);
 assert.ok(runtime.buildFocusedGrammarQueue('boss-21-25',bank,'boss',25).every(q=>q.meta.engine===boss.version));
});
test('display readings cover all new Japanese prompts, answers and options',()=>{
 for(const id of [...data.units,'boss-21-25'])for(const q of runtime.buildGrammarPracticeBank(id))for(const t of [q.prompt,q.fields?k.completeResponse(q):q.answer,...(q.options||[]),...(q.fields||[]).flatMap(f=>f.options||[])]){
  const html=runtime.renderJapaneseTextWithFurigana(t);assert.doesNotMatch(html.replace(/<ruby>.*?<\/ruby>/g,''),/[一-龯々]/,q.meta.id+': '+t);
 }
});
