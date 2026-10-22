(function(root,factory){
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./drill-kit.js"),require("./conditional-scenes.js"));
 else root.ConditionalsPractice=factory(root.DrillKit,root.ConditionalScenes);
})(typeof globalThis==="object"?globalThis:this,function(k,data){
 "use strict";
 const unit="conditionals",version=k.version(unit),readings=[...data.readings,["時間","じかん"],["手伝って","てつだって"]];
 function create({aliases=[]}={}){
  function buildBank(){const bank=[];
   for(const s of data.plans){
    bank.push(k.cloze(unit,"future-trigger","sequence",s,0,`Ask someone to ${s.afterEn} AFTER they ${s.actionEn}. The first action has not happened yet.`,[{label:"Future condition",segments:[s.prefix,k.gap("When completed",[s.ta+"ら"],[s.ta+"ら",s.verb+"前に"]),"、",s.after,"。"]}],"たら can set a future condition: once the first action is completed, do the follow-up. It does not mean the first action has already happened.",{}));
    bank.push(k.choice(unit,"not-yet-a-fact","interpretation",s,0,`${s.prefix}${s.ta}ら、${s.after}。`,["The follow-up is requested after the first action; the first action need not have happened yet.","The first action is confirmed to have happened yesterday.","The follow-up must happen before the first action.","The speaker says neither action is possible."],"The follow-up is requested after the first action; the first action need not have happened yet.","A future たら condition is not a past-event report merely because its form contains た.",{}));
    bank.push(k.cloze(unit,"assumed-plan","premise",s,0,`Someone plans to ${s.actionEn}. Advise them to ${s.beforeEn}, BEFORE carrying out that plan.`,[{label:"Advice on a plan",segments:[s.dict,k.gap("Given that plan",["なら"],["なら","と"]),"、",s.before,"。"]}],"なら takes the proposed plan as a premise. Preparation can happen before that plan is carried out. と does not normally introduce this kind of preparatory request.",{}));
   }
   for(const s of data.conditions){
    for(const [v,positive]of [true,false].entries()){
     bank.push(k.cloze(unit,"condition-polarity","condition",s,v,`Express this conditional rule, not a statement that the condition is already true: ${positive?`if ${s.en}`:`if it is NOT the case that: ${s.en}`}, ${s.resultEn}.`,[{label:"Condition",segments:[k.gap("Required condition",[positive?s.yes:s.no],[s.yes,s.no]),"、",s.result,"。"]}],"The condition's polarity determines when the result is offered. A conditional statement alone does not establish that its condition holds.",{positive}));
     bank.push(k.choice(unit,"conditional-limits","inference",s,v,`${positive?s.yes:s.no}、${s.result}。`,["It gives a result under a condition; it does not by itself confirm that condition or describe every other case.","It proves that the condition is currently true.","It proves the result is impossible in every other situation.","It reports a completed sequence of events yesterday."],"It gives a result under a condition; it does not by itself confirm that condition or describe every other case.","Do not turn 'if' into 'only if' or assume the condition has already been met.",{positive}));
    }
   }
   for(const s of data.automatic){
    bank.push(k.cloze(unit,"regular-result","consequence",s,0,`Describe the regular link between "${s.en}" and "${s.resultEn}", not an unexpected contrast.`,[{label:"Regular consequence",segments:[s.dict,k.gap("Result link",["と"],["と","のに"]),"、",s.result,"。"]}],"と presents the regular result here; のに would mark a contrast against expectation. Other conditional constructions can also describe regular results in suitable contexts.",{}));
    bank.push(k.choice(unit,"same-conditional","overlap",s,0,`${s.dict}と、${s.result}。\nWhich version can also express this conditional relationship?`,[`${s.ba}、${s.result}。`,`${s.dict}のに、${s.result}。`,`${s.dict}かどうか分かりません。`,`${s.dict}な。`],`${s.ba}、${s.result}。`,"ば can also express this condition-result relationship. と is not the only grammatical way to express a recurring result.",{}));
   }
   // State conditions can legitimately precede requests; avoid an absolute ban on ば.
   const s={id:"state-request",domain:"state",words:["時間","手伝う"]};
   bank.push(k.cloze(unit,"state-with-request","condition",s,0,"Ask for help IF the other person has time, not because you know they have time.",[{label:"Conditional request",segments:["時間が",k.gap("If available",["あれば","あったら"],["あれば","あったら","あるので"]),"、手伝ってください。"]}],"Both あれば and あったら work here. A state condition can precede a request; 'ば can never be followed by a request' would be a false rule.",{}));
   return bank;
  }return k.engine(buildBank,readings,aliases);
 }
 return{version,create,readings,displayReadings:data.displayReadings,selectQueue:(bank,count,options)=>k.select(unit,bank,count,options)};
});
