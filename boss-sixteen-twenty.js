(function(root,factory){
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./drill-kit.js"),require("./discourse-scenes.js"),require("./concession-practice.js"));
 else root.BossSixteenTwenty=factory(root.DrillKit,root.DiscourseScenes,root.ConcessionPractice);
})(typeof globalThis==="object"?globalThis:this,function(k,data,concession){
 "use strict";
 const version="boss-16-20-v1",units=["concession","quotation","intention","hearsay","change"];
 const readings=[...data.readings,...concession.readings],displayReadings=readings;
 function writingAnswers(text){return k.unique([text,text.replace(/つもりです/g,"つもりだ").replace(/そうです/g,"そうだ").replace(/なりました/g,"なった").replace(/分かりません/g,"分からない"),text.replace(/かどうか/g,"か")]);}
 function create({aliases=[]}={}){
  function make(primary,secondary,family,v,prompt,facts,render,explanation,vocabulary){
   const variants=[[true,true],[true,false],[false,true],[false,false]].map(([first,second])=>({first,second})),options=variants.map(render),answer=render(facts);
   const q={kind:"Combine the meanings",mode:"choice",prompt,subprompt:"Which message preserves BOTH facts?",band:"Keep both meanings.",options,answer,vocabulary,choiceFacts:variants,explanation,
    choiceFeedback:Object.fromEntries(options.filter(o=>o!==answer).map(o=>[o,explanation])),
    meta:{engine:version,sourceSessionId:primary,units:[primary,secondary],task:family,topic:primary,pattern:primary,difficulty:"boss",domain:family,familyKey:family,sceneKey:`${family}:${v}`,id:`${family}:${v}`,vocabulary:[],facts}};
   q.writing={kind:"Final message",mode:"text",subprompt:"Write the message in the stated order using the requested constructions. Keep both meanings.",band:"Write the complete message.",answer,fields:[k.field("Your message",writingAnswers(answer),options.filter(o=>o!==answer).map(o=>({accepted:writingAnswers(o),message:explanation})))],accepted:writingAnswers(answer)};
   return q;
  }
  function buildBank(){const bank=[];
   for(let i=0;i<6;i++)for(let v=0;v<4;v++){
    const first=v<2,second=v%2===0,facts={first,second},a=data.actions[[0,5,8,13,21,29][i]],b=data.actions[[4,9,16,20,32,36][i]],s=concession.scenes[[0,1,2,3,12,13][i]],verb=i<4?"買う":"使う",nai=i<4?"買わない":"使わない";
    bank.push(make("concession","intention",`concession-plan-${i}`,v,
     `First: ${first?"EVEN IF":"BECAUSE"} the ${s.noun} is ${s.en}. Then: you intend ${second?"to":"NOT to"} ${i<4?"buy":"use"} it tomorrow. Use ${first?"ても":"から"} and つもり.`,facts,
     f=>`${s.noun}が${f.first?s.te+"ても":s.adj+"から"}、明日、${s.noun}を${f.second?verb:nai}つもりです。`,
     "ても keeps the intention despite the condition; から gives a reason for it. Independently, the verb before つもり tells us whether the intention is positive or negative.",`${s.noun} / ${s.adj} (${s.en}) / ${verb}`));
    bank.push(make("quotation","hearsay",`unknown-report-${i}`,v,
     `First: you do not know ${first?"WHETHER":"WHEN"} Tanaka will ${a.actionEn}. Then relay a report that the teacher will ${second?"":"NOT "}${b.actionEn} tomorrow. Use 分かりません and hearsay そうです.`,facts,
     f=>`田中さんが${f.first?"":"いつ"}${a.dict}${f.first?"かどうか":"か"}分かりません。先生は明日、${b.prefix}${f.second?b.verb:b.nai}そうです。`,
     "かどうか asks whether; いつ...か asks when. Neither supplies an answer. The second sentence independently preserves the polarity of the teacher's reported action.",`${a.dict} / ${b.dict}`));
    bank.push(make("intention","change",`plan-change-${i}`,v,
     `First: you intend ${first?"to":"NOT to"} ${a.actionEn} tomorrow (つもり). Then say you have ${second?"become ABLE to":"started regularly doing this:"} ${b.actionEn} (ようになりました).`,facts,
     f=>`明日、${a.prefix}${f.first?a.verb:a.nai}つもりです。${b.prefix}${f.second?b.potential:b.verb}ようになりました。`,
     "The first sentence is a plan, with its own polarity. The second describes an actual change: potential form marks ability, while ordinary dictionary form marks a new practice.",`${a.dict} / ${b.dict}`));
    bank.push(make("hearsay","concession",`report-regardless-${i}`,v,
     `First: relay that Tanaka will ${first?"":"NOT "}${a.actionEn} tomorrow (そうです). Then say you will ${i<4?"buy":"use"} the ${s.noun} ${second?"EVEN IF":"BECAUSE"} it is ${s.en} (${second?"ても":"から"}).`,facts,
     f=>`田中さんは明日、${a.prefix}${f.first?a.verb:a.nai}そうです。${s.noun}が${f.second?s.te+"ても":s.adj+"から"}、${i<4?"買います":"使います"}。`,
     "Keep the report's negation inside the clause before そうです. Separately, distinguish a result despite a condition from a result because of it.",`${a.dict} / ${s.noun} / ${s.adj}`));
    bank.push(make("change","quotation",`change-unknown-${i}`,v,
     `First: you have ${first?"become ABLE to":"started regularly doing this:"} ${a.actionEn} (ようになりました). Then say you do not know ${second?"WHETHER":"WHEN"} the teacher will ${b.actionEn} (分かりません).`,facts,
     f=>`${a.prefix}${f.first?a.potential:a.verb}ようになりました。先生が${f.second?"":"いつ"}${b.dict}${f.second?"かどうか":"か"}分かりません。`,
     "Ability and a new practice use different forms before ようになりました. In the second sentence, whether and when ask different questions; do not supply information the speaker says is unknown.",`${a.dict} / ${b.dict}`));
   }return bank.map(k.bossPrompt);
  }return k.engine(buildBank,readings,aliases);
 }
 function selectQueue(bank,count=10,{seed=Date.now(),recent=[]}={}){
  const rng=k.random(seed),history=new Set(recent.slice(-20).map(key=>key.replace(/:\d+$/,""))),queue=[];
  for(const unit of k.shuffle(units,rng)){
   const candidates=k.shuffle(bank.filter(q=>q.meta.sourceSessionId===unit),rng).sort((a,b)=>Number(history.has(a.meta.familyKey))-Number(history.has(b.meta.familyKey))),used=new Set();
   for(const q of candidates){if(used.has(q.meta.familyKey))continue;used.add(q.meta.familyKey);const options=k.shuffle(q.options,rng);queue.push({...q,options,choiceFacts:options.map(o=>q.choiceFacts[q.options.indexOf(o)])});if(used.size===2)break;}
  }
  const ordered=k.shuffle(queue,rng).slice(0,Math.min(10,count)),writers=k.shuffle(units,rng).slice(0,2),final=[];
  for(const unit of writers){const at=ordered.findIndex(q=>q.meta.sourceSessionId===unit);if(at>=0){const[q]=ordered.splice(at,1);final.push({...q,...q.writing,fields:q.writing.fields.map(f=>({...f,accepted:[...f.accepted]})),meta:{...q.meta,answerMode:"full"}});}}
  return [...ordered,...final];
 }
 return{version,roundSize:10,create,readings,displayReadings,units,selectQueue};
});
