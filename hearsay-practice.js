(function(root,factory){
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./drill-kit.js"),require("./discourse-scenes.js"));
 else root.HearsayPractice=factory(root.DrillKit,root.DiscourseScenes);
})(typeof globalThis==="object"?globalThis:this,function(k,data){
 "use strict";
 const unit="hearsay",version=k.version(unit);
 const states=[
  ["店","みせ","静か","しずか","na","quiet"],["部屋","へや","きれい","きれい","na","clean"],
  ["アプリ","あぷり","便利","べんり","na","convenient"],["図書館","としょかん","無料","むりょう","noun","free of charge"],
  ["パン","ぱん","おいしい","おいしい","i","delicious"],["時計","とけい","高い","たかい","i","expensive"],
  ["部屋","へや","広い","ひろい","i","spacious"],["駅","えき","遠い","とおい","i","far away"]
 ].map(([noun,kn,adj,ka,type,en],i)=>({id:`state:${i}`,domain:"state",noun,kn,adj,ka,type,en,words:[noun,adj]}));
 const readings=[...data.readings,...states.flatMap(s=>[[s.noun,s.kn],[s.adj,s.ka]]),["話","はなし"]];
 function create({aliases=[]}={}){
  function buildBank(){const bank=[];
   for(const s of data.actions){
    for(const [v,positive]of [true,false].entries()){
     bank.push(k.cloze(unit,"reported-polarity","hearsay",s,v,`You heard that Tanaka will ${positive?"":"NOT "}${s.actionEn} tomorrow. Relay the information, keeping its polarity.`,[{label:"What you heard",segments:["田中さんは明日、",s.prefix,k.gap("Reported action",[positive?s.verb:s.nai],[s.verb,s.nai]),"そうです。"]}],"The plain-form clause before hearsay そうです carries the reported content, including its negation. This relays information rather than confirming it first-hand.",{positive}));
     bank.push(k.cloze(unit,"past-or-future-report","reported-time",s,v,`Relay a report: ${positive?`Tanaka already did this yesterday: ${s.actionEn}`:`Tanaka will do this tomorrow: ${s.actionEn}`}.`,[{label:"Reported time",segments:["田中さんは",positive?"昨日、":"明日、",s.prefix,k.gap("Time of the reported action",[positive?s.ta:s.verb],[s.ta,s.verb]),"そうです。"]}],"The tense inside the reported clause identifies when the action occurs. そうです itself does not force the reported action into the present.",{past:positive}));
    }
    bank.push(k.cloze(unit,"speech-source","reported-speech",s,0,`Tanaka personally told you: “I will ${s.actionEn} tomorrow.” Report what Tanaka SAID, rather than merely describing their thoughts.`,[{label:"Reported speech",segments:["田中さんは明日、",s.dict,k.gap("Reporting frame",["と言っていました","と言いました"],["と言っていました","と思っています"]),"。"]}],"と言っていました attributes the statement to Tanaka. と思っています would instead describe Tanaka's thinking, not specifically report their words.",{}));
    bank.push(k.cloze(unit,"relay-information","hearsay",s,0,`You hear that Tanaka will ${s.actionEn} tomorrow. Relay this as information you have received, rather than asserting it as a directly verified fact.`,[{label:"Reported information",segments:["田中さんは明日、",s.dict,k.gap("Information from others",["そうです","らしいです"],["そうです","らしいです","ことができます"]),"。"]}],"Hearsay そうです and らしいです can both relay received information here. らしい is also used for inference in other contexts; it is not assigned a fixed confidence percentage.",{}));
    bank.push(k.choice(unit,"source-not-proof","interpretation",s,0,`先生の話では、田中さんは明日、${s.dict}そうです。`,["The speaker relays information from the teacher; actual completion is not established.","The speaker personally watched the completed action.","The speaker promises to perform the action.","Tanaka asks the teacher to act."],"The speaker relays information from the teacher; actual completion is not established.","話では identifies the source. Hearsay そうです reports content; it does not turn that source into proof that a future action will happen.",{}));
    for(const [v,heard]of [true,false].entries())bank.push(k.choice(unit,"hearsay-or-appearance","interpretation",s,v,`田中さんは${s.prefix}${heard?s.verb:s.stem}そうです。`,["The speaker has information that Tanaka will do it.","Tanaka looks about to do it, based only on appearance.","The speaker invites Tanaka to do it.","Tanaka is definitely unable to do it."],heard?"The speaker has information that Tanaka will do it.":"Tanaka looks about to do it, based only on appearance.","Dictionary form + そうです is hearsay. Verb stem + そうです is the different appearance/imminence construction. Read the attachment, not just そうです.",{heard}));
   }
   for(const s of states){
    bank.push(k.cloze(unit,"reported-state","hearsay",s,0,`Someone told you that ${s.noun} is ${s.en}. Relay the report using そうです, rather than describing its appearance.`,[{label:"Reported state",segments:[s.noun,"は",k.gap("Reported predicate",[s.adj+(s.type==="i"?"":"だ")],[s.adj+(s.type==="i"?"":"だ"),s.type==="i"?s.adj.slice(0,-1):s.adj]),"そうです。"]}],"Hearsay そう keeps the い of an i-adjective and requires だ after a noun or na-adjective. Appearance そう has a different attachment.",{}));
    bank.push(k.cloze(unit,"rashii-attachment","hearsay",s,0,`Relay that ${s.noun} is ${s.en}, this time with らしいです.`,[{label:"Apparently",segments:[s.noun,"は",k.gap("Predicate before らしい",[s.adj],[s.adj,s.type==="i"?s.adj.slice(0,-1):s.adj+"だ"]),"らしいです。"]}],"らしい follows i-adjectives unchanged but does not take present affirmative だ after nouns or na-adjectives. It can relay received information as well as express inference.",{}));
   }return bank;
  }return k.engine(buildBank,readings,aliases);
 }
 return{version,create,states,readings,displayReadings:readings,selectQueue:(b,n,o)=>k.select(unit,b,n,o)};
});
