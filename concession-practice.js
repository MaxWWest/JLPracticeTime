(function(root,factory){
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./drill-kit.js"),require("./discourse-scenes.js"));
 else root.ConcessionPractice=factory(root.DrillKit,root.DiscourseScenes);
})(typeof globalThis==="object"?globalThis:this,function(k,data){
 "use strict";
 const unit="concession",version=k.version(unit);
 const groups=[
  ["price","高い","高く","高い","高ければ","expensive","買います","買いません","buy it",[["時計","とけい"],["かばん","かばん"],["カメラ","かめら"],["靴","くつ"]]],
  ["distance","遠い","遠く","遠い","遠ければ","far away","行きます","行きません","go there",[["図書館","としょかん"],["学校","がっこう"],["店","みせ"],["駅","えき"]]],
  ["small","狭い","狭く","狭い","狭ければ","small","使います","使いません","use it",[["部屋","へや"],["教室","きょうしつ"],["会議室","かいぎしつ"],["台所","だいどころ"]]],
  ["old","古い","古く","古い","古ければ","old","使います","使いません","use it",[["辞書","じしょ"],["自転車","じてんしゃ"],["机","つくえ"],["パソコン","ぱそこん"]]],
  ["difficult","難しい","難しく","難しい","難しければ","difficult","やります","やりません","do it",[["練習","れんしゅう"],["宿題","しゅくだい"],["仕事","しごと"],["問題","もんだい"]]],
  ["quiet","静か","静かで","静かな","静かなら","quiet","集中できません","集中できます","be able to concentrate",[["図書館","としょかん"],["部屋","へや"],["教室","きょうしつ"],["自習室","じしゅうしつ"]]],
  ["convenient","便利","便利で","便利な","便利なら","convenient","使いません","使います","use it",[["アプリ","あぷり"],["パソコン","ぱそこん"],["電子辞書","でんしじしょ"],["カメラ","かめら"]]],
  ["cheap","安い","安く","安い","安ければ","cheap","買いません","買います","buy it",[["シャツ","しゃつ"],["時計","とけい"],["靴","くつ"],["かばん","かばん"]]],
  ["delicious","おいしい","おいしく","おいしい","おいしければ","delicious","食べません","食べます","eat it",[["パン","ぱん"],["ケーキ","けーき"],["カレー","かれー"],["お菓子","おかし"]]],
  ["free","無料","無料で","無料な","無料なら","free of charge","使いません","使います","use it",[["アプリ","あぷり"],["駐車場","ちゅうしゃじょう"],["会議室","かいぎしつ"],["ロッカー","ろっかー"]]]
 ];
 const scenes=groups.flatMap(([domain,adj,te,noni,conditional,en,result,opposite,action,nouns])=>nouns.map(([noun,reading],i)=>({id:`${domain}:${i}`,domain,adj,te,noni,conditional,en,result,opposite,action,noun,reading,words:[noun,adj]})));
 const readings=[...data.readings,...scenes.map(s=>[s.noun,s.reading]),["高","たか"],["遠","とお"],["狭","せま"],["古","ふる"],["難","むずか"],["静か","しずか"],["便利","べんり"],["安","やす"],["無料","むりょう"],["買います","かいます"],["買いません","かいません"],["行きます","いきます"],["行きません","いきません"],["使います","つかいます"],["使いません","つかいません"],["食べます","たべます"],["食べません","たべません"],["集中","しゅうちゅう"],["知って","しって"],["答えません","こたえません"],["内容","ないよう"],["届きませんでした","とどきませんでした"],["汚れて","よごれて"]];
 function create({aliases=[]}={}){
  function buildBank(){const bank=[];
   for(const s of scenes){
    bank.push(k.cloze(unit,"regardless-or-condition","concession",s,0,`The decision stays the same EVEN IF it is ${s.en}. Complete the concession, not a condition that triggers the decision.`,[{label:"Regardless",segments:[s.noun,"が",k.gap("Concession",[s.te.endsWith("で")?s.te+"も":s.te+"ても"],[s.te.endsWith("で")?s.te+"も":s.te+"ても",s.conditional]),"、",s.result,"。"]}],"ても presents the result as holding despite the condition. A conditional such as ば or なら instead makes that condition the premise; it does not itself say 'regardless'.",{}));
    bank.push(k.cloze(unit,"factual-surprise","contrast",s,0,`It really IS ${s.en}. Express your surprise about the contrasting result using のに.`,[{label:"Unexpected result",segments:[s.noun,"が",k.gap("Actual fact + contrast",[s.noni+"のに"],[s.noni+"のに",s.adj+"から"]),"、",s.result,"。"]}],"のに presents an actual situation and an unexpected contrast. It is not a reason causing the second clause. Na-adjectives and nouns need な before のに.",{}));
    bank.push(k.cloze(unit,"reason-or-contrast","relationship",s,0,`Preserve the words, but change the relationship from 'because' to 'although'.`,[{label:"Although",segments:[s.noun,"が",s.noni,k.gap("Relationship",["のに"],["のに","ので"]),"、",s.result,"。"]}],"のに marks a contrast against expectations; ので gives a reason. The same vocabulary can express a different logical relationship.",{}));
    bank.push(k.choice(unit,"read-regardless","interpretation",s,0,`${s.noun}が${s.te.endsWith("で")?s.te+"も":s.te+"ても"}、${s.result}。`,["The stated result holds even under that condition; this alone does not tell us whether the condition is real.","The condition is definitely imaginary.","The result happens only because of that condition.","The condition guarantees the opposite result."],"The stated result holds even under that condition; this alone does not tell us whether the condition is real.","ても can be used for real or hypothetical situations. Its core contribution here is that the result holds despite the condition, not that the condition must be unreal.",{}));
    bank.push(k.choice(unit,"read-surprise","interpretation",s,0,`${s.noun}が${s.noni}のに、${s.result}。`,["The first fact is presented as true, and the second result contrasts with expectations.","The first clause is only a question.","The first clause is given as the straightforward cause of the result.","The result is a command to the listener."],"The first fact is presented as true, and the second result contrasts with expectations.","のに presents a factual contrast, often carrying surprise or dissatisfaction. The result is stated, not requested.",{}));
    bank.push(k.cloze(unit,"both-cases","concession",s,0,`The decision stays the same WHETHER OR NOT it is ${s.en}. Complete both sides of the concession.`,[{label:"Either way",segments:[s.noun,"が",s.te,k.gap("Positive case",[s.te.endsWith("で")?"も":"ても"],[s.te.endsWith("で")?"も":"ても","は"]),"、",s.te.endsWith("で")?s.adj+"でなく":s.adj.slice(0,-1)+"くなく",k.gap("Negative case",["ても"],["ても","ては"]),"、",s.result,"。"]}],"ても...なくても presents both possibilities with the same result. ては instead sets up a conditional or contrastive condition and does not express the requested 'either way' pairing.",{}));
   }
   for(const s of data.actions.filter(s=>["read","send","wash","eat"].includes(s.domain))){
    const result={read:"内容が分かりません。",send:"届きませんでした。",wash:"まだ汚れています。",eat:"まだおなかがすいています。"}[s.domain];
    bank.push(k.cloze(unit,"completed-despite","concession",s,0,`The action DID happen, but the result was unexpected. Use のに to connect that completed action to the result.`,[{label:"Despite completion",segments:[s.prefix,k.gap("Completed fact",[s.ta+"のに"],[s.ta+"のに",s.nai+"のに"]),"、",result]}],"たのに presents the completed action as a fact despite the contrasting result. ないのに would instead say that the action did not happen.",{}));
    bank.push(k.cloze(unit,"negative-premise","concession",s,0,`Express 'even WITHOUT doing this: ${s.actionEn}'. Keep the negative inside the concession.`,[{label:"Even without",segments:[s.prefix,k.gap("Negative concession",[s.nai.slice(0,-1)+"くても"],[s.nai.slice(0,-1)+"くても",s.te+"も"]),"、大丈夫です。"]}],"なくても means even if one does not act. ても would instead put the positive action inside the concession; it does not mean 'without'.",{}));
   }return bank;
  }return k.engine(buildBank,readings,aliases);
 }
 return{version,create,scenes,readings,displayReadings:readings,selectQueue:(b,n,o)=>k.select(unit,b,n,o)};
});
