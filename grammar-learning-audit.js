#!/usr/bin/env node
// Inspection metrics and concrete reproductions; counts are not teaching-quality scores.
const {loadGrammarRuntime}=require('./grammar-audit.js');
function inspect(){
 const api=loadGrammarRuntime();
 const ids=Object.keys(api.grammarPracticeSessions).filter(id=>!id.startsWith('family-')&&!id.startsWith('boss-')&&!['mixed-boss','mock-test'].includes(id)).slice(0,25);
 const units=ids.map(id=>{
  const bank=api.buildGrammarPracticeBank(id),tasks=new Map();let dropdowns=0,withoutContrastFeedback=0;
  for(const q of bank){
   const task=q.meta?.task||q.kind,profile=tasks.get(task)||{items:0,answers:new Set()};profile.items++;profile.answers.add(q.answer);tasks.set(task,profile);
   // Include compact specifications as well as already-compact newer banks.
   for(const f of q.responseSpec?.fields||q.fields||[])if(f.options){dropdowns++;if(!f.contrasts?.length)withoutContrastFeedback++;}
  }
  return{id,items:bank.length,families:new Set(bank.map(q=>q.meta?.familyKey)).size,tasks:tasks.size,dropdowns,withoutContrastFeedback,
   fixedCanonicalTasks:[...tasks].filter(([,p])=>p.answers.size===1).map(([task,p])=>({task,items:p.items})),
   taskProfiles:[...tasks].map(([task,p])=>({task,items:p.items,canonicalAnswers:p.answers.size}))};
 });
 const boss=require('./boss-twentyone-twentyfive.js').create();
 const q=boss.buildBank().find(q=>q.meta.sourceSessionId==='causative'&&q.meta.facts.first);
 const equivalent=q.answer.replace('読ませられました','読まされました');
 const giving=require('./final-grammar-practice.js').modules.giving.create();
 const favor=giving.buildBank().find(q=>q.meta.task==='favor-viewpoint'&&q.meta.facts.actor==='Tanaka'&&q.meta.facts.viewpoint==='くれました');
 return{units,notes:['Fixed answers are review flags, not proof that a task is invalid.','Items include lexical variants; family IDs do not establish independent semantic situations.','This inspection supplements the structural audit and does not certify naturalness.'],
  reproductions:{bossContractedForm:{id:q.meta.id,model:q.answer,equivalent,grade:boss.grade({...q,...q.writing},[equivalent])},
   knownDropdownMistake:{id:favor.meta.id,selected:'あげました',grade:giving.grade(favor,['あげました'])},
   ruby:['仕事が見つかるといいですね。','みんなに字が見えるように、大きく書きます。'].map(text=>({text,html:api.renderJapaneseTextWithFurigana(text)}))}};
}
if(require.main===module)console.log(JSON.stringify(inspect(),null,2));
module.exports={inspect};
