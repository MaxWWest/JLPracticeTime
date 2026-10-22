(function(root,factory){
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./drill-kit.js"),require("./discourse-scenes.js"));
 else root.ChangePractice=factory(root.DrillKit,root.DiscourseScenes);
})(typeof globalThis==="object"?globalThis:this,function(k,data){
 "use strict";
 const unit="change",version=k.version(unit);
 const states=[
  ["音","おと","小さい","ちいさい","小さく","ちいさく","the sound","quieter"],
  ["部屋","へや","明るい","あかるい","明るく","あかるく","the room","brighter"],
  ["字","じ","大きい","おおきい","大きく","おおきく","the lettering","larger"],
  ["スープ","すーぷ","温かい","あたたかい","温かく","あたたかく","the soup","warmer"],
  ["髪","かみ","短い","みじかい","短く","みじかく","the hair","shorter"],
  ["部屋","へや","きれい","きれい","きれいに","きれいに","the room","clean"],
  ["教室","きょうしつ","静か","しずか","静かに","しずかに","the classroom","quiet"],
  ["説明","せつめい","簡単","かんたん","簡単に","かんたんに","the explanation","simple"]
 ].map(([noun,kn,adj,ka,form,kf,en,result],i)=>({id:`state:${i}`,domain:"state",noun,adj,form,en,result,kn,ka,kf,words:[noun,adj]}));
 const readings=[...data.readings,...states.flatMap(s=>[[s.noun,s.kn],[s.adj,s.ka],[s.form,s.kf]]),["毎朝","まいあさ"],["練習","れんしゅう"]];
 function create({aliases=[]}={}){
  function buildBank(){const bank=[];
   for(const s of data.actions){
    bank.push(k.cloze(unit,"ability-or-habit","change",s,0,`You have gained the ABILITY to ${s.actionEn}. Do not merely report a new habit.`,[{label:"New ability",segments:[s.prefix,k.gap("Ability",[s.potential],[s.potential,s.verb]),"ようになりました。"]}],"Potential form + ようになりました describes becoming able to do something. Dictionary form + ようになりました generally describes starting to do it as a habit or new practice.",{}));
    bank.push(k.cloze(unit,"new-habit","change",s,0,`You already could do this; recently you have started doing it as a regular practice: ${s.actionEn}. Report the new practice, not a newly gained ability.`,[{label:"New habit",segments:["最近、",s.prefix,k.gap("Practice",[s.verb],[s.verb,s.potential]),"ようになりました。"]}],"The ordinary dictionary form describes the new practice. The potential form would foreground a change in ability instead.",{}));
    bank.push(k.cloze(unit,"lost-ability","negative-change",s,0,`You used to be ABLE to ${s.actionEn}, but can no longer do so. This is not simply a choice to stop.`,[{label:"Ability lost",segments:[s.prefix,k.gap("What stopped?",[s.cannot.slice(0,-1)+"く"],[s.cannot.slice(0,-1)+"く",s.nai.slice(0,-1)+"く"]),"なりました。"]}],"Potential negative + なくなりました means becoming unable to do it. Ordinary negative + なくなりました says the action stopped, without itself asserting inability.",{}));
    bank.push(k.cloze(unit,"stopped-habit","negative-change",s,0,`You no longer DO this: ${s.actionEn}. You still can, so do not claim lost ability.`,[{label:"Habit stopped",segments:[s.prefix,k.gap("No longer doing",[s.nai.slice(0,-1)+"く"],[s.nai.slice(0,-1)+"く",s.cannot.slice(0,-1)+"く"]),"なりました。"]}],"Ordinary ない becomes なく before なりました. This describes cessation of the action, not necessarily loss of the ability to do it.",{}));
    for(const [v,ability]of [true,false].entries()){
     bank.push(k.choice(unit,"interpret-change","interpretation",s,v,`${ability?"":"最近、"}${s.prefix}${ability?s.potential:s.verb}ようになりました。`,["The speaker became able to do it; a completed instance is not stated.","The speaker started doing it regularly; a new ability is not the focus.","The speaker can no longer do it.","The speaker has only made a future plan."],ability?"The speaker became able to do it; a completed instance is not stated.":"The speaker started doing it regularly; a new ability is not the focus.","The form before ようになりました distinguishes a change in ability from a new practice. Neither is merely a future intention.",{ability}));
    }
   }
   for(const s of states){
    for(const [v,agent]of [true,false].entries()){
     bank.push(k.cloze(unit,"make-or-become","state-change",s,v,agent?`Say that YOU made ${s.en} ${s.result}.`:`Say that ${s.en} BECAME ${s.result}; do not name who caused it.`,[{label:"Change of state",segments:[s.noun,k.gap("State or affected object",[agent?"を":"が"],["を","が"]),s.form,k.gap("Cause or result",[agent?"しました":"なりました"],["しました","なりました"]),"。"]}],"を...する presents an agent making a change. が...なる describes the resulting change of state. なる does not imply that no one deliberately caused it.",{agent}));
    }
    bank.push(k.cloze(unit,"adjective-attachment","state-change",s,0,`Describe ${s.en} becoming ${s.result}. Complete the change construction.`,[{label:"State ending",segments:[s.noun,"が",k.gap("Adjective connection",[s.form],[s.form,s.adj+"に",s.adj+"く"].filter((x,i,a)=>a.indexOf(x)===i)),"なりました。"]}],"I-adjectives change い to く before なる. Na-adjectives take に; きれい is a na-adjective despite ending in the sound い.",{}));
   }return bank;
  }return k.engine(buildBank,readings,aliases);
 }
 return{version,create,states,readings,displayReadings:readings,selectQueue:(b,n,o)=>k.select(unit,b,n,o)};
});
