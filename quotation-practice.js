(function(root,factory){
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./drill-kit.js"),require("./discourse-scenes.js"));
 else root.QuotationPractice=factory(root.DrillKit,root.DiscourseScenes);
})(typeof globalThis==="object"?globalThis:this,function(k,data){
 "use strict";
 const unit="quotation",version=k.version(unit),readings=[...data.readings,['何を','なにを']];
 function create({aliases=[]}={}){
  function buildBank(){const bank=[];
   for(const s of data.actions){
    bank.push(k.cloze(unit,"report-or-question","embedded-question",s,0,`You do NOT know whether Tanaka will ${s.actionEn}. Leave the yes/no question unresolved.`,[{label:"What is unknown?",segments:["田中さんが",s.dict,k.gap("Embedded question",["かどうか","か"],["かどうか","か","と"]),"分かりません。"]}],"かどうか explicitly means whether or not. Plain か also embeds a yes/no question here; both are accepted. と would not mark the unresolved question.",{}));
    bank.push(k.cloze(unit,"question-word","embedded-question",s,0,`Ask WHEN Tanaka will ${s.actionEn}, not whether it will happen.`,[{label:"Indirect question",segments:["田中さんがいつ",s.dict,k.gap("Question boundary",["か"],["か","かどうか","と"]),"教えてください。"]}],"いつ asks for a time. Use か to embed that question; かどうか would instead seek a yes/no answer and does not complete this WHEN question.",{}));
    bank.push(k.cloze(unit,"quote-boundary","quotation",s,0,`Report Tanaka's words. Keep the quoted request unchanged.`,[{label:"Report",segments:["田中さんは「",s.prefix,s.te,"ください」",k.gap("Quote marker",["と"],["と","かどうか","を"]),"言いました。"]}],"と marks what was said. A direct quotation can retain the original polite request; it is not converted into an embedded yes/no question.",{}));
    for(const [v,positive] of [true,false].entries()){
     bank.push(k.cloze(unit,"reported-polarity","quotation",s,v,`Tanaka said: “I will ${positive?"":"NOT "}${s.actionEn}.” Report that statement without changing its polarity.`,[{label:"Reported statement",segments:["田中さんは",s.prefix,k.gap("Reported content",[positive?s.verb:s.nai],[s.verb,s.nai]),"と言いました。"]}],"Negation belongs inside the quoted content. Saying that Tanaka said it does not independently confirm that the action happened.",{positive}));
     bank.push(k.choice(unit,"what-is-known","interpretation",s,v,positive?`田中さんが${s.dict}かどうか分かりません。`:`田中さんは「${s.prefix}${s.stem}ます」と言いました。`,["Whether Tanaka will act is unknown.","Tanaka said they would act; completion is not confirmed.","Tanaka has definitely completed the action.","Tanaka asked the listener to act."],positive?"Whether Tanaka will act is unknown.":"Tanaka said they would act; completion is not confirmed.","かどうか分かりません leaves a question unresolved. と言いました reports someone's statement, not independent proof of its fulfilment.",{unknown:positive}));
    }
    for(const [v,word]of ['いつ','どこで','何を','だれが'].entries()){
     const need=['the TIME','the PLACE','WHAT will be acted on','WHO will act'][v];
     bank.push(k.cloze(unit,"question-content","embedded-question",s,v,`Ask for ${need}. The action is ${s.verb}; the missing information is not a yes/no decision.`,[{label:"Missing information",segments:[v===3?'':'田中さんが',k.gap("Question content",[word],['いつ','どこで','何を','だれが']),v===2?s.verb:s.dict,'か教えてください。']}],"The question word identifies the missing information: time, place, object, or actor. か embeds the whole question.",{questionWord:word}));
    }
   }return bank;
  }return k.engine(buildBank,readings,aliases);
 }
 return{version,create,readings,displayReadings:readings,selectQueue:(b,n,o)=>k.select(unit,b,n,o)};
});
