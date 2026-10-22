(function(root,factory){
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./drill-lexicon.js"));
 else root.DiscourseScenes=factory(root.DrillLexicon);
})(typeof globalThis==="object"?globalThis:this,function(lex){
 "use strict";
 // Explicit inflections keep irregular verbs and their readings out of suffix guessing.
 const forms={
  "読む":["読もう","よもう","読める","よめる","読めない","よめない"],
  "書く":["書こう","かこう","書ける","かける","書けない","かけない"],
  "使う":["使おう","つかおう","使える","つかえる","使えない","つかえない"],
  "持ってくる":["持ってこよう","もってこよう","持ってこられる","もってこられる","持ってこられない","もってこられない"],
  "借りる":["借りよう","かりよう","借りられる","かりられる","借りられない","かりられない"],
  "食べる":["食べよう","たべよう","食べられる","たべられる","食べられない","たべられない"],
  "買う":["買おう","かおう","買える","かえる","買えない","かえない"],
  "送る":["送ろう","おくろう","送れる","おくれる","送れない","おくれない"],
  "洗う":["洗おう","あらおう","洗える","あらえる","洗えない","あらえない"],
  "作る":["作ろう","つくろう","作れる","つくれる","作れない","つくれない"]
 };
 const extra=[
  ["wash","洗う","洗い","洗って","洗わない","洗った","あらう","あらい","あらって","あらわない","あらった",[["皿","さら","wash the dishes"],["服","ふく","wash the clothes"],["靴下","くつした","wash the socks"],["タオル","たおる","wash the towel"]]],
  ["make","作る","作り","作って","作らない","作った","つくる","つくり","つくって","つくらない","つくった",[["朝ご飯","あさごはん","make breakfast"],["弁当","べんとう","make a packed lunch"],["スープ","すーぷ","make soup"],["カレー","かれー","make curry"]]]
 ];
 const extraActions=extra.flatMap(([domain,verb,stem,te,nai,ta,,,,,,nouns])=>nouns.map(([noun,reading,actionEn],i)=>({id:`${domain}:${i}`,domain,verb,stem,te,nai,ta,noun,reading,actionEn,prefix:noun+"を",dict:noun+"を"+verb,words:[noun,verb]})));
 const actions=[...lex.actions,...extraActions].map(a=>({...a,vol:forms[a.verb][0],potential:forms[a.verb][2],cannot:forms[a.verb][4]}));
 const readings=[...lex.readings,...Object.values(forms).flatMap(f=>[[f[0],f[1]],[f[2],f[3]],[f[4],f[5]],[f[4].slice(0,-1),f[5].slice(0,-1)]]),...extra.flatMap(f=>[...f[11].map(n=>[n[0],n[1]]),...[1,2,3,4,5].map(i=>[f[i],f[i+5]]),[f[4].slice(0,-1),f[9].slice(0,-1)]]),
  ["田中","たなか"],["先生","せんせい"],["私","わたし"],["明日","あした"],["昨日","きのう"],["毎日","まいにち"],["来年","らいねん"],["言って","いって"],["言いました","いいました"],["言われました","いわれました"],["思います","おもいます"],["思って","おもって"],["教えて","おしえて"],["分かりません","わかりません"],["分からない","わからない"],["調べます","しらべます"],["聞きました","ききました"],["前","まえ"],["今","いま"],["最近","さいきん"]];
 return{actions,readings,displayReadings:readings};
});
