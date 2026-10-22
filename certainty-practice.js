(function(root,factory){
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./drill-kit.js"),require("./drill-lexicon.js"));
 else root.CertaintyPractice=factory(root.DrillKit,root.DrillLexicon);
})(typeof globalThis==="object"?globalThis:this,function(k,lex){
 "use strict";
 const unit="certainty",version=k.version(unit);
 const states=[
  ["部屋は静か","quiet in the room","へやはしずか"],
  ["ホテルは便利","the hotel is convenient","ほてるはべんり"],
  ["かばんは丈夫","the bag is sturdy","かばんはじょうぶ"],
  ["先生は親切","the teacher is kind","せんせいはしんせつ"],
  ["あの人は学生","that person is a student","あのひとはがくせい"],
  ["今日は休み","today is a day off","きょうはやすみ"],
  ["田中さんは会員","Tanaka is a member","たなかさんはかいいん"],
  ["あの人は店員","that person is a shop assistant","あのひとはてんいん"]
 ].map(([text,en,kana],i)=>({id:`state:${i}`,domain:i<4?"na-adjective":"noun",words:[text],text,en,kana,type:i<4?"na":"noun"}));
 const adjectives=[
  ["部屋は広い","the room is spacious","へやはひろい"],["店は近い","the shop is nearby","みせはちかい"],
  ["料理はおいしい","the food is tasty","りょうりはおいしい"],["荷物は重い","the parcel is heavy","にもつはおもい"],
  ["靴は安い","the shoes are inexpensive","くつはやすい"],["朝は寒い","the morning is cold","あさはさむい"],
  ["道は狭い","the road is narrow","みちはせまい"],["試験は難しい","the exam is difficult","しけんはむずかしい"]
 ].map(([text,en,kana],i)=>({id:`adjective:${i}`,domain:"i-adjective",words:[text],text,en,kana,type:"i"}));
 const scenes=[...lex.actions.map(a=>({...a,text:a.dict,en:`someone will ${a.actionEn}`,type:"verb"})),...states,...adjectives];
 const readings=[...lex.readings,...states.map(s=>[s.text,s.kana]),...adjectives.flatMap(s=>[[s.text,s.kana],[s.text.slice(0,-1),s.kana.slice(0,-1)]]),["田中さん","たなかさん"]];
 const displayReadings=[...lex.readings,["部屋","へや"],["静か","しずか"],["便利","べんり"],["丈夫","じょうぶ"],["親切","しんせつ"],["人","ひと"],["学生","がくせい"],["今日","きょう"],["休み","やすみ"],["会員","かいいん"],["店員","てんいん"],["広い","ひろい"],["近い","ちかい"],["料理","りょうり"],["重い","おもい"],["安い","やすい"],["朝","あさ"],["寒い","さむい"],["道","みち"],["狭い","せまい"],["試験","しけん"],["難しい","むずかしい"],["断言","だんげん"]];
 function forms(s){
  const bare=s.text,negative=s.type==="verb"?s.prefix+s.nai:s.type==="i"?bare.slice(0,-1)+"くない":bare+"ではない";
  return{positive:bare,negative,expect:bare+(s.type==="na"?"な":s.type==="noun"?"の":""),seem:bare+(s.type==="na"?"な":s.type==="noun"?"の":""),casual:bare};
 }
 function create({aliases=[]}={}){
  function buildBank(){const bank=[];
   for(const s of scenes){const f=forms(s);
    for(const [v,positive]of [true,false].entries()){
     const p=positive?f.positive:f.negative;
     bank.push(k.cloze(unit,"leave-open","possibility",s,v,`Leave this possibility open, without presenting it as your expectation: ${positive?s.en:`NOT (${s.en})`}.`,[{label:"Possibility",segments:[p,k.gap("Commitment",["かもしれません"],["かもしれません",(positive?f.expect.slice(f.positive.length):"")+"はずです"]),"。"]}],"かもしれません leaves a possibility open. It does not claim that the event is expected, certain, or already observed.",{positive}));
     const prefix=s.prefix||"";
     bank.push(k.cloze(unit,"expected-not-proven","expectation",s,v,`Your reliable information leads you to EXPECT this, but you have not confirmed it: ${positive?s.en:`NOT (${s.en})`}.`,[{label:"Expectation",segments:[prefix,k.gap("Expected proposition",[(positive?f.expect:f.negative).slice(prefix.length)],[f.expect.slice(prefix.length),f.negative.slice(prefix.length)]),k.gap("Stance",["はずです"],["はずです","かもしれません"]),"。"]}],"はずです presents a reasoned expectation. It is not a guarantee, and a negative proposition before はず means that the speaker expects it NOT to be true.",{positive}));
     bank.push(k.choice(unit,"knowledge-boundary","interpretation",s,v,`${positive?f.expect:f.negative}はずです。`,["The speaker expects the positive proposition to be true, but has not guaranteed it.","The speaker expects the positive proposition NOT to be true, but has not guaranteed it.","The speaker has directly confirmed the event happened.","The listener is being ordered to make it happen."],positive?"The speaker expects the positive proposition to be true, but has not guaranteed it.":"The speaker expects the positive proposition NOT to be true, but has not guaranteed it.","Read the polarity before はず. An expectation based on information is different from confirmation or an instruction.",{positive}));
    }
    const head=s.type==="verb"?s.prefix:f.positive;
    const seeming=f.seem.slice(head.length)+"ようです",conversational=f.casual.slice(head.length)+"みたいです";
    const assertion=s.type==="verb"?s.stem+"ます":"です";
    bank.push(k.cloze(unit,"evidence-impression","inference",s,0,`Clues suggest this, but you cannot state it as a confirmed fact: ${s.en}. Use either the neutral or conversational 'seems' form.`,[{label:"Inference",segments:[head,k.gap("Evidence-based impression",[seeming,conversational],[seeming,conversational,assertion]),"。"]}],"ようです and みたいです can both express an inference from clues here. みたい is more conversational. Neither requires the speaker to guarantee the conclusion.",{}));
    bank.push(k.choice(unit,"read-impression","inference",s,0,`${f.seem}ようです。`,["Clues lead the speaker to this impression; it is not asserted as a verified fact.","The speaker guarantees that this is a verified fact.","The speaker is ordering the listener to do this.","The speaker has ruled out this possibility."],"Clues lead the speaker to this impression; it is not asserted as a verified fact.","In this use, ようです presents an inference. It does not encode a fixed numerical probability.",{}));
   }return bank;
  }return k.engine(buildBank,readings,aliases);
 }
 return{version,create,readings,displayReadings,scenes,forms,selectQueue:(bank,count,options)=>k.select(unit,bank,count,options)};
});
