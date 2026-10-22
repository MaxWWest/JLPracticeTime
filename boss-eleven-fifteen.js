(function(root,factory){
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./drill-kit.js"),require("./drill-lexicon.js"),require("./listing-practice.js"),require("./certainty-practice.js"),require("./advice-practice.js"),require("./conditional-scenes.js"));
 else root.BossElevenFifteen=factory(root.DrillKit,root.DrillLexicon,root.ListingPractice,root.CertaintyPractice,root.AdvicePractice,root.ConditionalScenes);
})(typeof globalThis==="object"?globalThis:this,function(k,lex,listing,certainty,advice,data){
 "use strict";
 const version="boss-11-15-v1",units=["listing","certainty","advice","conditionals","tara-nara"];
 const readings=[...listing.readings,...certainty.readings,...advice.readings,...data.readings,["明日","あした"],["連絡する","れんらくする"],["連絡した","れんらくした"],["連絡しない","れんらくしない"],["連絡して","れんらくして"],["手伝って","てつだって"],["先に","さきに"]];
 const displayReadings=[...listing.displayReadings,...certainty.displayReadings,...advice.displayReadings,...data.displayReadings,["明日","あした"],["連絡","れんらく"]];
 function writingAnswers(text){
  const plain=text.replace(/はずです/g,"はずだ").replace(/かもしれません/g,"かもしれない").replace(/ほうがいいです/g,"ほうがいい").replace(/しました/g,"した");
  return k.unique([text,plain,text.replace(/ほうがいいです/g,"ほうがいい")]);
 }
 function create({aliases=[]}={}){
  function make(primary,secondary,family,v,prompt,facts,render,explanation,vocabulary){
   const variants=[[true,true],[true,false],[false,true],[false,false]].map(([first,second])=>({first,second}));
   const options=variants.map(render),answer=render(facts);
   const q={kind:"Combine the meanings",mode:"choice",prompt,subprompt:"Which message preserves BOTH facts?",band:"Keep both meanings.",options,answer,vocabulary,choiceFacts:variants,explanation,
    choiceFeedback:Object.fromEntries(options.filter(o=>o!==answer).map(o=>[o,explanation])),
    meta:{engine:version,sourceSessionId:primary,units:[primary,secondary],task:family,topic:primary,pattern:primary,difficulty:"boss",domain:family,familyKey:family,sceneKey:`${family}:${v}`,id:`${family}:${v}`,vocabulary:[],facts}};
   q.writing={kind:"Final message",mode:"text",subprompt:"Write the message in the stated order, keeping both meanings. Use the supplied vocabulary.",band:"Write the complete message.",answer,fields:[k.field("Your message",writingAnswers(answer),options.filter(o=>o!==answer).map(o=>({accepted:writingAnswers(o),message:explanation})))],accepted:writingAnswers(answer)};
   return q;
  }
  function buildBank(){const bank=[];
   for(let i=0;i<6;i++)for(let v=0;v<4;v++){
    const first=v<2,second=v%2===0,facts={first,second},a=lex.actions[i*4],b=lex.actions[(i*4+5)%32],c=lex.actions[(i*4+10)%32];
    const s=data.conditions[[0,3,5,8,9,13][i]],conditionalAction=lex.actions[[26,15,8,0,27,5][i]];
    bank.push(make("listing","certainty",`examples-expectation-${i}`,v,
     `Yesterday: ${first?`give ${a.actionEn} and ${b.actionEn} as EXAMPLES, with no stated order`:`state that you FIRST did this: ${a.actionEn}; THEN this: ${b.actionEn}`}.\nTomorrow: ${second?"you EXPECT":"you merely consider it POSSIBLE that"} you will ${c.actionEn}.`,facts,
     f=>`昨日は${a.prefix}${f.first?a.ta+"り":a.te}、${f.first?b.prefix+b.ta+"りしました":"それから"+b.prefix+b.stem+"ました"}。明日は${c.dict}${f.second?"はずです":"かもしれません"}。`,
     "たり lists examples without specifying their order; て、それから states a sequence. はず presents an expectation, whereas かもしれません leaves a possibility open.",`${a.dict} / ${b.dict} / ${c.dict}`));
    bank.push(make("certainty","advice",`expectation-advice-${i}`,v,
     `First, say you expect Tanaka ${first?"to":"NOT to"} ${a.actionEn}.\nThen advise Tanaka ${second?"to do it":"to avoid doing it"}. An expectation and advice are separate claims.`,facts,
     f=>`田中さんは${a.prefix}${f.first?a.verb:a.nai}はずです。${a.prefix}${f.second?a.ta:a.nai}ほうがいいです。`,
     "The polarity before はず determines what is expected. たほうがいい recommends action; ないほうがいい recommends avoiding it. Advice need not match what you expect someone actually to do.",`${a.dict} (${a.actionEn})`));
    bank.push(make("advice","listing",`directive-examples-${i}`,v,
     `First, ${first?"give a firm parent-to-child instruction":"give a recommendation, not a command"} to ${a.actionEn}.\nThen describe yesterday: ${second?`give ${b.actionEn} and ${c.actionEn} as EXAMPLES`:`state FIRST: ${b.actionEn}; THEN: ${c.actionEn}`}.`,facts,
     f=>`${a.prefix}${f.first?a.stem+"なさい":a.ta+"ほうがいいです"}。昨日は${b.prefix}${f.second?b.ta+"り":b.te}、${f.second?c.prefix+c.ta+"りしました":"それから"+c.prefix+c.stem+"ました"}。`,
     "なさい gives a directive; たほうがいい gives advice. The second sentence independently distinguishes representative activities from an explicitly ordered sequence.",`${a.dict} / ${b.dict} / ${c.dict}`));
    bank.push(make("conditionals","advice",`condition-recommendation-${i}`,v,
     `Condition: ${first?s.en:`NOT (${s.en})`}. Under that condition, recommend ${second?"doing":"avoiding"} this: ${conditionalAction.actionEn}.`,facts,
     f=>`${f.first?s.yes:s.no}、${conditionalAction.prefix}${f.second?conditionalAction.ta:conditionalAction.nai}ほうがいいです。`,
     "There are two independent negatives to track: the condition and the advice. A negative condition does not automatically make the recommendation negative. State conditions can precede advice.",`${s.dict} (${s.en}) / ${conditionalAction.dict} (${conditionalAction.actionEn})`));
    bank.push(make("tara-nara","advice",`timing-advice-${i}`,v,
     `${first?`AFTER you ${a.actionEn}`:`If you plan to ${a.actionEn}, BEFORE doing it`}, advise ${second?"contacting me":"NOT contacting me"}.`,facts,
     f=>`${a.prefix}${f.first?a.ta+"ら":a.verb+"なら"}、${f.first?"":"先に"}私に連絡${f.second?"した":"しない"}ほうがいいです。`,
     "たら puts the follow-up after completion. なら takes the plan as a premise and permits preparation beforehand. Separately, したほうがいい recommends contacting; しないほうがいい recommends not contacting.",`${a.dict} (${a.actionEn}) / 私に連絡する (contact me)`));
   }return bank.map(k.bossPrompt);
  }return k.engine(buildBank,readings,aliases);
 }
 function selectQueue(bank,count=10,{seed=Date.now(),recent=[]}={}){
  const rng=k.random(seed),history=new Set(recent.slice(-20).map(key=>key.replace(/:\d+$/,""))),queue=[];
  for(const unit of k.shuffle(units,rng)){
   const candidates=k.shuffle(bank.filter(q=>q.meta.sourceSessionId===unit),rng).sort((a,b)=>Number(history.has(a.meta.familyKey))-Number(history.has(b.meta.familyKey)));
   const used=new Set();
   for(const q of candidates){
    if(used.has(q.meta.familyKey))continue;
    used.add(q.meta.familyKey);
    const options=k.shuffle(q.options,rng);
    queue.push({...q,options,choiceFacts:options.map(o=>q.choiceFacts[q.options.indexOf(o)])});
    if(used.size===2)break;
   }
  }
  const ordered=k.shuffle(queue,rng).slice(0,Math.min(10,count)),writers=k.shuffle(units,rng).slice(0,2),final=[];
  for(const unit of writers){const at=ordered.findIndex(q=>q.meta.sourceSessionId===unit);if(at>=0){const[q]=ordered.splice(at,1);final.push({...q,...q.writing,fields:q.writing.fields.map(f=>({...f,accepted:[...f.accepted]})),meta:{...q.meta,answerMode:"full"}});}}
  return [...ordered,...final];
 }
 return{version,roundSize:10,create,readings,displayReadings,units,selectQueue};
});
