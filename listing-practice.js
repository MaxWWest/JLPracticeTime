(function(root,factory){
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./drill-kit.js"),require("./drill-lexicon.js"));else root.ListingPractice=factory(root.DrillKit,root.DrillLexicon);
})(typeof globalThis==="object"?globalThis:this,function(k,lex){
 "use strict";
 const unit="listing",version=k.version(unit);
 const qualities=[
  ["店","近い","安い","nearby","inexpensive","みせ","ちかい","やすい"],
  ["部屋","広い","明るい","spacious","bright","へや","ひろい","あかるい"],
  ["かばん","軽い","丈夫だ","light","sturdy","かばん","かるい","じょうぶだ"],
  ["ホテル","静かだ","便利だ","quiet","convenient","ほてる","しずかだ","べんりだ"],
  ["料理","おいしい","安い","delicious","inexpensive","りょうり","おいしい","やすい"],
  ["図書館","近い","静かだ","nearby","quiet","としょかん","ちかい","しずかだ"],
  ["先生","親切だ","説明が上手だ","kind","good at explaining","せんせい","しんせつだ","せつめいがじょうずだ"],
  ["自転車","新しい","軽い","new","light","じてんしゃ","あたらしい","かるい"],
  ["電車","速い","便利だ","fast","convenient","でんしゃ","はやい","べんりだ"],
  ["靴","安い","丈夫だ","inexpensive","sturdy","くつ","やすい","じょうぶだ"],
  ["公園","広い","きれいだ","spacious","beautiful","こうえん","ひろい","きれいだ"],
  ["仕事","面白い","勉強になる","interesting","educational","しごと","おもしろい","べんきょうになる"]
 ];
 const readings=[...lex.readings,...qualities.flatMap(([n,a,b,,,kn,ka,kb])=>[[n,kn],[a,ka],[b,kb]]),["昨日","きのう"],["休日","きゅうじつ"],["選びました","えらびました"],["気に入っています","きにいっています"]];
 const englishNouns=["shop","room","bag","hotel","dish","library","teacher","bicycle","train","pair of shoes","park","job"];
 const displayReadings=[...readings.filter(([word])=>word!=="説明が上手だ"),["説明","せつめい"],["上手","じょうず"]];
 const pairs=lex.actions.map((a,i)=>({id:`activities:${i}`,domain:a.domain,words:[a.noun,lex.actions[(i+5)%32].noun],a,b:lex.actions[(i+5)%32]}));
 function create({aliases=[]}={}){
  function buildBank(){
   const bank=[];
   for(const scene of pairs){const {a,b}=scene;
    for(const [v,past]of [false,true].entries()){
     bank.push(k.cloze(unit,"sample-actions","examples",scene,v,`${past?'Yesterday, you did':'On days off, you do'} things such as ${a.actionEn} and ${b.actionEn}. Give examples, not a complete ordered schedule.`,[{label:"Activities",segments:[past?"昨日は":"休日は",a.prefix,k.gap("First example",[a.ta+"り"],[a.ta+"り",a.te]),"、",b.prefix,k.gap("Second example",[b.ta+"り"],[b.ta+"り",b.te]),k.gap("Time",[past?"しました":"します"],["します","しました"]),"。"]}],"たり lists representative activities. The final する carries the sentence's tense; the た inside たり does not itself make the whole sentence past.",{past}));
     bank.push(k.choice(unit,"read-examples","scope",scene,v,`${past?'昨日は':'休日は'}${a.prefix}${a.ta}り、${b.prefix}${b.ta}り${past?'しました':'します'}。`,["These are examples of yesterday's activities; order and completeness are not stated.","These are examples of usual day-off activities; order and completeness are not stated.","Only these two activities happened, necessarily in this order.","Neither of these activities happens."],past?"These are examples of yesterday's activities; order and completeness are not stated.":"These are examples of usual day-off activities; order and completeness are not stated.","Representative listing does not mean 'only these' or establish a strict sequence. Read the final tense.",{past}));
    }
    bank.push(k.cloze(unit,"sequence-not-examples","sequence",scene,0,`State yesterday's order: FIRST ${a.actionEn}; THEN ${b.actionEn}. Do not merely list examples.`,[{label:"Sequence",segments:[a.prefix,k.gap("Sequence link",[a.te],[a.te,a.ta+"り"]),"、それから",b.prefix,b.stem,"ました。"]}],"The て-form with それから presents the stated order. A たり list alone does not establish that order.",{}));
   }
   qualities.forEach(([noun,a,b,ae,be],i)=>{
    const scene={id:`reasons:${i}`,domain:"qualities",words:[noun,a,b]};
    bank.push(k.cloze(unit,"stack-reasons","reasons",scene,0,`${noun}: ${ae} and ${be}. Present both as supporting reasons, without implying this is an exhaustive list.`,[{label:"Reasons",segments:[noun+"は",k.gap("First reason",[a+"し"],[a+"し",(a.endsWith("だ")?a.slice(0,-1)+"な":a)+"のに"]),"、",k.gap("Additional reason",[b+"し"],[b+"し",b+"かどうか"]),"、気に入っています。"]}],"し adds parallel reasons. Nouns and na-adjectives retain だ before し. The reasons can support a conclusion without claiming that no other reasons exist.",{noun}));
    bank.push(k.choice(unit,"reason-scope","interpretation",scene,0,`${noun}は${a}し、${b}し、気に入っています。`,["Two supporting reasons are given; other reasons are not ruled out.","The first reason happened before the second as two completed actions.","The two qualities are both denied.","These must be the only possible reasons."],"Two supporting reasons are given; other reasons are not ruled out.","し accumulates information or reasons. It does not impose a sequence or an exhaustive inventory.",{}));
    bank.push(k.cloze(unit,"add-another","parallel",scene,0,`Both this ${englishNouns[i]} and that one are ${ae}. Include this one as well, rather than contrasting it with the other.`,[{label:"Also",segments:["あちらも",a.endsWith("だ")?a.slice(0,-1)+"です":a+"です","。こちら",k.gap("Inclusion",["も"],["も","だけ","しか"]),a,"し、",b,"し、いいですね。"]}],"も includes another item in the same description. だけ restricts the set; しか requires a negative predicate and is not interchangeable here.",{}));
   });
   return bank;
  }
  return k.engine(buildBank,readings,aliases);
 }
 return{version,create,readings,displayReadings,pairs,qualities,selectQueue:(bank,count,options)=>k.select(unit,bank,count,options)};
});
