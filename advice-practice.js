(function(root,factory){
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./drill-kit.js"),require("./drill-lexicon.js"));
 else root.AdvicePractice=factory(root.DrillKit,root.DrillLexicon);
})(typeof globalThis==="object"?globalThis:this,function(k,lex){
 "use strict";
 const unit="advice",version=k.version(unit);
 const warnings=[
  ["急ぐ","急がない","電車に間に合いません","hurry","you will miss the train","いそぐ","いそがない","でんしゃにまにあいません"],
  ["保存する","保存しない","データが消えます","save it","the data will be lost","ほぞんする","ほぞんしない","でーたがきえます"],
  ["予約する","予約しない","席が取れません","reserve","you will not get a seat","よやくする","よやくしない","せきがとれません"],
  ["鍵をかける","鍵をかけない","心配です","lock it","you will worry","かぎをかける","かぎをかけない","しんぱいです"],
  ["練習する","練習しない","上手になりません","practise","you will not improve","れんしゅうする","れんしゅうしない","じょうずになりません"],
  ["充電する","充電しない","途中で使えなくなります","charge it","it will stop working partway through","じゅうでんする","じゅうでんしない","とちゅうでつかえなくなります"],
  ["番号を確認する","番号を確認しない","間違えるかもしれません","check the number","you might make a mistake","ばんごうをかくにんする","ばんごうをかくにんしない","まちがえるかもしれません"],
  ["水をやる","水をやらない","花が枯れます","water the flowers","the flowers will wither","みずをやる","みずをやらない","はながかれます"]
 ].map(([dict,nai,result,en,resultEn,kd,kn,kr],i)=>({id:`warning:${i}`,domain:"warning",dict,nai,result,en,resultEn,kd,kn,kr,words:[dict,result]}));
 const readings=[...lex.readings,...warnings.flatMap(s=>[[s.dict,s.kd],[s.nai,s.kn],[s.result,s.kr]])];
 const displayReadings=[...lex.readings,["急ぐ","いそぐ"],["急がない","いそがない"],["電車","でんしゃ"],["間に合いません","まにあいません"],["保存","ほぞん"],["消えます","きえます"],["予約","よやく"],["席","せき"],["取れません","とれません"],["鍵","かぎ"],["心配","しんぱい"],["練習","れんしゅう"],["上手","じょうず"],["充電","じゅうでん"],["途中","とちゅう"],["使えなく","つかえなく"],["番号","ばんごう"],["確認","かくにん"],["間違える","まちがえる"],["花","はな"],["枯れます","かれます"]];
 function create({aliases=[]}={}){
  function buildBank(){const bank=[];
   for(const s of lex.actions){
    for(const [v,positive]of [true,false].entries()){
     bank.push(k.cloze(unit,"recommend-or-avoid","advice",s,v,`Recommend ${positive?"doing":"avoiding"} this: ${s.actionEn}. Give advice, not a report about yesterday.`,[{label:"Recommendation",segments:[s.prefix,k.gap("Recommended action",[positive?s.ta:s.nai],[s.ta,s.nai]),"ほうがいいです。"]}],"たほうがいい recommends doing something; ないほうがいい recommends not doing it. The た-form in this advice pattern does not say that the action already happened.",{positive}));
     bank.push(k.choice(unit,"read-advice","interpretation",s,v,`${s.prefix}${positive?s.ta:s.nai}ほうがいいです。`,["The speaker recommends doing it; completion is not stated.","The speaker recommends avoiding it; completion is not stated.","The speaker confirms that it happened yesterday.","The speaker says doing it is impossible."],positive?"The speaker recommends doing it; completion is not stated.":"The speaker recommends avoiding it; completion is not stated.","ほうがいい gives advice. Read the verb's polarity; do not treat the た-form as a completed-event report.",{positive}));
    }
    bank.push(k.cloze(unit,"authority-instruction","instruction",s,0,`A parent gives a child a firm instruction to ${s.actionEn}. Complete the directive, rather than describing the parent's intention.`,[{label:"Instruction",segments:[s.prefix,s.stem,k.gap("Speech act",["なさい"],["なさい","たいです","ました"]),"。"]}],"Verb stem + なさい is a directive, often used by a parent or teacher. It is not a neutral polite request to a superior.",{}));
    bank.push(k.choice(unit,"who-must-act","instruction",s,0,`${s.prefix}${s.stem}なさい。`,["The listener is instructed to act.","The speaker is stating a personal wish.","The speaker is reporting a completed action.","The listener is being told the action is unnecessary."],"The listener is instructed to act.","なさい directs the listener. Its appropriateness depends on the relationship; it is not simply a more polite てください.",{}));
   }
   for(const s of warnings){
    bank.push(k.cloze(unit,"negative-condition","warning",s,0,`Warn about failing to ${s.en}: ${s.resultEn}.`,[{label:"Warning",segments:[k.gap("Condition",[s.nai+"と"],[s.nai+"と",s.dict+"と"]),"、",s.result,"。"]}],"ないと introduces the consequence of NOT acting. With an undesirable consequence, it often implies that action is needed; it is not a prohibition on the action.",{}));
    bank.push(k.choice(unit,"read-warning","warning",s,0,`${s.nai}と、${s.result}。`,[`Not acting leads to the stated consequence, so ${s.en} is encouraged.`,`Doing it leads to the stated consequence, so ${s.en} is forbidden.`,"The action was already completed.","The speaker says the outcome is unrelated to the action."],`Not acting leads to the stated consequence, so ${s.en} is encouraged.`,"The negative is inside the condition. 'If you do not...' is different from 'You must not...'.",{}));
    bank.push(k.cloze(unit,"self-reminder","necessity",s,0,`You remind yourself that you need to ${s.en}. Leave the unwanted consequence unspoken.`,[{label:"Self-reminder",segments:[s.nai,k.gap("Implied necessity",["と"],["と","ほうがいいです"]),"。"]}],"A sentence ending in ないと can leave an unwanted consequence understood: 'I need to...'. ないほうがいい instead advises against doing it.",{}));
   }return bank;
  }return k.engine(buildBank,readings,aliases);
 }
 return{version,create,readings,displayReadings,warnings,selectQueue:(bank,count,options)=>k.select(unit,bank,count,options)};
});
