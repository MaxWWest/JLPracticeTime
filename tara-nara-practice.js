(function(root,factory){
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./drill-kit.js"),require("./conditional-scenes.js"));
 else root.TaraNaraPractice=factory(root.DrillKit,root.ConditionalScenes);
})(typeof globalThis==="object"?globalThis:this,function(k,data){
 "use strict";
 const unit="tara-nara",version=k.version(unit),readings=data.readings;
 function create({aliases=[]}={}){
  function buildBank(){const bank=[];
   for(const s of data.plans){
    for(const [v,after]of [true,false].entries()){
     bank.push(k.cloze(unit,"plan-or-completion","timing",s,v,after?`Only AFTER you ${s.actionEn}, ${s.afterEn}.`:`If you plan to ${s.actionEn}, ${s.beforeEn}. The preparation must come BEFORE the planned action.`,[{label:"Timing",segments:[s.prefix,k.gap("Condition",[after?s.ta+"ら":s.verb+"なら"],[s.ta+"ら",s.verb+"なら"]),"、",after?s.after:s.before,"。"]}],after?"たら makes completion of the first action the point after which the follow-up is requested. A なら premise alone would not impose that order.":"なら responds to the plan as a premise, so the advice can be carried out before the planned action. たら would place the follow-up after completion.",{after}));
     bank.push(k.choice(unit,"read-the-order","interpretation",s,v,`${s.prefix}${after?s.ta+"ら":s.verb+"なら"}、${after?s.after:s.before}。`,["The requested follow-up comes after the first action is completed.","The plan is the premise for advice that should be carried out before it.","The first action has definitely already happened.","Both actions are prohibited."],after?"The requested follow-up comes after the first action is completed.":"The plan is the premise for advice that should be carried out before it.","Read the relationship, not just the verb ending. たら can mark a future completion point; なら can introduce advice based on a plan.",{after}));
    }
    bank.push(k.cloze(unit,"change-the-timing","transformation",s,0,`Change this from advice based on a plan to an explicit AFTER-completion request. Keep the follow-up unchanged.\n${s.dict}なら、${s.after}。`,[{label:"After completion",segments:[s.prefix,k.gap("New timing",[s.ta+"ら"],[s.ta+"ら",s.verb+"なら"]),"、",s.after,"。"]}],"The new たら version explicitly places the request after completion. The original なら version treated the action as a premise without independently specifying that timeline.",{}));
   }
   for(const s of data.discoveries){
    bank.push(k.cloze(unit,"actual-discovery","discovery",s,0,`Report what actually happened: you ${s.en}. Use an encounter/discovery construction, not advice about a proposed plan.`,[{label:"Discovery",segments:[k.gap("Actual encounter",[s.ta+"ら",s.dict+"と"],[s.ta+"ら",s.dict+"と",s.dict+"なら"]),"、",s.result,"。"]}],"With this past result, both たら and narrative と can report what was discovered on doing something. なら would instead introduce a premise; it is not the actual-event sequence requested here.",{}));
    bank.push(k.choice(unit,"past-or-future","time",s,0,`${s.ta}ら、${s.result}。`,["An actual past event led to encountering the stated result.","This is advice about a plan that has not been carried out.","The result is a command to the listener.","The result must happen before the first action."],"An actual past event led to encountering the stated result.","The past result and the encounter context establish the actual-event reading. たら by itself is not always past; future requests use it too.",{}));
    bank.push(k.cloze(unit,"discovery-paraphrase","overlap",s,0,`Keep this actual discovery, using と rather than たら.\n${s.ta}ら、${s.result}。`,[{label:"Same discovery",segments:[s.dict,k.gap("Narrative link",["と"],["と","なら"]),"、",s.result,"。"]}],"Narrative と can connect an action with the result encountered. Its uses are not limited to universal laws or automatic machines.",{}));
   }return bank;
  }return k.engine(buildBank,readings,aliases);
 }
 return{version,create,readings,displayReadings:data.displayReadings,selectQueue:(bank,count,options)=>k.select(unit,bank,count,options)};
});
