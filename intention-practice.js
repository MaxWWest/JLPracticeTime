(function(root,factory){
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./drill-kit.js"),require("./discourse-scenes.js"));
 else root.IntentionPractice=factory(root.DrillKit,root.DiscourseScenes);
})(typeof globalThis==="object"?globalThis:this,function(k,data){
 "use strict";
 const unit="intention",version=k.version(unit),readings=data.readings;
 function create({aliases=[]}={}){
  function buildBank(){const bank=[];
   for(const s of data.actions){
    for(const [v,plan]of [true,false].entries())bank.push(k.cloze(unit,"intention-not-report","intention",s,v,plan?`You intend to ${s.actionEn}. State that intention.`:`You believe you already did this: ${s.actionEn}. State your belief, not a new intention.`,[{label:"Thought content",segments:[s.prefix,k.gap("Intention or belief",[plan?s.vol:s.ta],[s.vol,s.ta]),"と思います。"]}],"Volitional + と思います expresses an intention. たと思います expresses a belief about a past event. The thought construction itself can express either; the form inside it changes the meaning.",{plan}));
    bank.push(k.cloze(unit,"ongoing-intention","intention",s,0,`You have been thinking of doing this: ${s.actionEn}. Complete the intention expression.`,[{label:"Ongoing intention",segments:[s.prefix,s.vol,k.gap("Thinking",["と思っています"],["と思っています","と言われました"]),"。"]}],"ようと思っています presents an intention being held. It does not guarantee action, and it is not a rigidly stronger or weaker promise than つもりです.",{}));
    for(const [v,positive]of [true,false].entries()){
     bank.push(k.cloze(unit,"plan-polarity","plan",s,v,`Your plan for tomorrow is to ${positive?"":"NOT "}${s.actionEn}.`,[{label:"Plan",segments:["明日、",s.prefix,k.gap("Plan content",[positive?s.verb:s.nai],[s.verb,s.nai]),"つもりです。"]}],"The verb before つもり carries the plan's polarity. A plan is not a completed event or a guarantee.",{positive}));
     bank.push(k.choice(unit,"interpret-plan","interpretation",s,v,`明日、${s.prefix}${positive?s.verb:s.nai}つもりです。`,["The speaker intends to do it; it has not been guaranteed.","The speaker intends not to do it; inability is not stated.","The speaker has already done it.","The speaker says doing it is impossible."],positive?"The speaker intends to do it; it has not been guaranteed.":"The speaker intends not to do it; inability is not stated.","つもり describes the speaker's plan. Negative intention is not the same as inability; positive intention is not proof of execution.",{positive}));
    }
    bank.push(k.cloze(unit,"deny-intention","plan",s,0,`Deny having any intention to ${s.actionEn}. Do not say you have no ability to do it.`,[{label:"No intention",segments:[s.dict,k.gap("Intention denied",["つもりはありません","つもりはないです"],["つもりはありません","ことができません"]),"。"]}],"つもりはありません denies an intention. ことができません denies ability or possibility, which is a different claim.",{}));
    bank.push(k.choice(unit,"past-plan-not-outcome","interpretation",s,0,`${s.dict}つもりでした。`,["There was an intention; this sentence alone does not establish whether it was carried out.","It was definitely done.","It was definitely not done.","The speaker was unable to form a plan."],"There was an intention; this sentence alone does not establish whether it was carried out.","つもりでした reports a past intention. Context often supplies a changed plan, but failure is not logically guaranteed by this sentence alone.",{}));
    for(const [v,done]of [true,false].entries())bank.push(k.cloze(unit,'plan-versus-outcome','intention',s,v,done?`You planned to ${s.actionEn}, and you DID carry it out. Complete the actual outcome.`:`You planned to ${s.actionEn}, but you did NOT carry it out. Complete the actual outcome.`,[{label:'Plan and outcome',segments:[s.dict,'つもりでした。',s.prefix,k.gap('Actual outcome',[done?s.stem+'ました':s.nai.slice(0,-1)+'かったです'],[s.stem+'ました',s.nai.slice(0,-1)+'かったです']),'。']}],'つもりでした describes the past plan. The second sentence, not the plan expression, establishes whether the action actually occurred.',{done}));
   }return bank;
  }return k.engine(buildBank,readings,aliases);
 }
 return{version,create,readings,displayReadings:readings,selectQueue:(b,n,o)=>k.select(unit,b,n,o)};
});
