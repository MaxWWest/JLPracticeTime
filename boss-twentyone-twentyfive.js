(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory(require('./drill-kit.js'),require('./final-grammar-practice.js'));
 else root.BossTwentyoneTwentyfive=factory(root.DrillKit,root.FinalGrammarPractice);
})(typeof globalThis==='object'?globalThis:this,function(k,data){
 'use strict';
 const version='boss-21-25-v1',units=data.units,readings=data.readings,displayReadings=readings;
 const scenes=data.actions.filter(a=>['read','write','send','wash','make'].includes(a.domain));
 const past=verb=>verb.replace(/る$/,'ました');
 const meanings={
  decisions:[['the action is scheduled','you made the decision'],['the action prepares for later','the action is a trial']],
  'te-auxiliary':[['the action prepares for later','the action is a trial'],['you help Tanaka','Tanaka helps you']],
  giving:[['you help Tanaka','Tanaka helps you'],['the action is a trial','the action prepares for later']],
  passive:[['you cause Tanaka to act','you are affected by Tanaka acting'],['Tanaka is asked to act next','you ask permission to act next']],
  causative:[['you made your own earlier decision','Tanaka made you act'],['you decide not to act next time','you decide to act next time']]
 };
 function writingAnswers(answer){
  const standard=k.unique([answer,answer.replace(/しました/g,'した').replace(/なりました/g,'なった').replace(/くれました/g,'くれた').replace(/もらいました/g,'もらった').replace(/あげました/g,'あげた')]);
  return k.unique(standard.flatMap(text=>[text,...data.actions.filter(a=>a.shortForced).flatMap(a=>[[a.forced,a.shortForced],[past(a.forced),past(a.shortForced)]]).filter(([form])=>text.includes(form)).map(([form,short])=>text.replace(form,short))]));
 }
 function create({aliases=[]}={}){
  function buildBank(){const bank=[];
   for(const a of scenes)for(let v=0;v<4;v++){
    const facts={first:v<2,second:v%2===0};
    const add=(primary,secondary,id,prompt,render,explanation)=>{
     if(primary==='passive'&&['make','send'].includes(a.domain))return;
     const family=`${id}:${a.id}`,choiceFacts=[[true,true],[true,false],[false,true],[false,false]].map(([first,second])=>({first,second})),options=choiceFacts.map(render),answer=render(facts),accepted=writingAnswers(answer);
     const feedback=Object.fromEntries(options.map((option,i)=>[option,['first','second'].flatMap((key,j)=>choiceFacts[i][key]===facts[key]?[]:[`This says ${meanings[primary][j][Number(choiceFacts[i][key])]}; the situation says ${meanings[primary][j][Number(facts[key])]}.`]).join(' ')]));
     bank.push({kind:'Connected situation',mode:'choice',prompt,subprompt:'Which message preserves the whole situation?',band:'Keep the event and the people consistent.',options,answer,choiceFacts,explanation,vocabulary:`${a.dict} (${a.actionEn})`,
      choiceFeedback:feedback,
      meta:{engine:version,sourceSessionId:primary,units:[primary,secondary],task:id,topic:primary,pattern:primary,difficulty:'boss',domain:id,familyKey:family,actionKey:a.id,sceneKey:`${family}:${v}`,id:`${family}:${v}`,vocabulary:a.words,facts},
      writing:{kind:'Final message',mode:'text',band:'Write the complete message.',subprompt:'Use the supplied vocabulary and keep the event, people, and purpose consistent.',prompt,answer,accepted,fields:[k.field('Your message',accepted,options.filter(o=>o!==answer).map(o=>({accepted:writingAnswers(o),message:feedback[o]})))]}});
    };
    add('decisions','te-auxiliary','decision-helper',
     `You ${facts.first?'personally decided':'have been scheduled'} to ${a.actionEn}. You will ${facts.second?'try it once to see how it goes':'do it in advance for the next session'}.`,
     f=>`${a.dict}${f.first?'ことにしました':'ことになりました'}。${a.prefix}${a.te}${f.second?'みます':'おきます'}。`,
     'Keep the source of the decision and the purpose of that same action: a trial differs from preparation for later.');
    add('te-auxiliary','giving','helper-benefit',
     `${facts.second?'Tanaka helped you':'You helped Tanaka'} with this: ${a.actionEn}. The action was done ${facts.first?'as a trial to see how it would go':'in advance for the next session'}. Describe it with the performer as subject.`,
     f=>`${f.second?'田中さんが':'私は田中さんに'}${a.prefix}${a.te}${f.first?'みて':'おいて'}${f.second?'くれました':'あげました'}。`,
     'Both the helper and the direction of benefit belong to the same action. てみる describes a trial; ておく preparation. くれる directs the favor toward the speaker; あげる directs it outward.');
    add('giving','te-auxiliary','favor-view',
     `${facts.first?'Tanaka helped you':'You helped Tanaka'} with this: ${a.actionEn}. It was done ${facts.second?'in advance for the next session':'as a trial to see how it would go'}. Keep yourself as the sentence subject.`,
     f=>`私は田中さんに${a.prefix}${a.te}${f.second?'おいて':'みて'}${f.first?'もらいました':'あげました'}。`,
     'With 私 as subject, てもらう means Tanaka acts for you; てあげる means you act for Tanaka. Preserve why that same action was done.');
    add('passive','causative','voice-next-turn',
     `${facts.first?'Tanaka acted on your item unexpectedly':'You made Tanaka do this'}: ${a.actionEn}. Next time, ${facts.second?'ask Tanaka to let YOU do it':'ask TANAKA to do it'}. Describe what happened, then make the request.`,
     f=>`私は田中さんに${a.prefix}${past(f.first?a.passive:a.cause)}。次は${a.prefix}${f.second?a.causeTe:a.te}ください。`,
     'First preserve whether you were affected or caused Tanaka to act. The next request independently determines who will act: causative てください asks to be allowed to act yourself.');
    add('causative','decisions','control-next-time',
     `${facts.first?'Tanaka made you do this against your wishes':'You personally decided to do this'}: ${a.actionEn}. For next time, you have decided ${facts.second?'to do it':'NOT to do it'}. Describe the earlier control, then your next decision.`,
     f=>`${f.first?'私は田中さんに'+a.prefix+past(a.forced):a.dict+'ことにしました'}。次は${a.prefix}${f.second?a.verb:a.nai}ことにしました。`,
     'Being made to act and making your own decision differ in who controls the action. Preserve the independent positive or negative decision for next time.');
   }return bank;
  }return k.engine(buildBank,readings,aliases);
 }
 function selectQueue(bank,count=10,{seed=Date.now(),recent=[]}={}){
  const rng=k.random(seed),history=new Set(recent.slice(-20).map(x=>x.replace(/:\d+$/,''))),queue=[],actions=new Set();
  for(const unit of k.shuffle(units,rng)){
   const candidates=k.shuffle(bank.filter(q=>q.meta.sourceSessionId===unit),rng).sort((a,b)=>Number(history.has(a.meta.familyKey))-Number(history.has(b.meta.familyKey))),used=new Set();
   for(const q of candidates){if(used.has(q.meta.familyKey)||actions.has(q.meta.actionKey))continue;used.add(q.meta.familyKey);actions.add(q.meta.actionKey);const options=k.shuffle(q.options,rng);queue.push({...q,options,choiceFacts:options.map(o=>q.choiceFacts[q.options.indexOf(o)])});if(used.size===2)break;}
  }
  const ordered=k.shuffle(queue,rng).slice(0,Math.min(10,count)),final=[];
  for(const unit of k.shuffle(units,rng).slice(0,2)){const at=ordered.findIndex(q=>q.meta.sourceSessionId===unit);if(at>=0){const[q]=ordered.splice(at,1);final.push({...q,...q.writing,meta:{...q.meta,answerMode:'full'}});}}
  return [...ordered,...final];
 }
 return{version,units,readings,displayReadings,roundSize:10,create,scenes,selectQueue};
});
