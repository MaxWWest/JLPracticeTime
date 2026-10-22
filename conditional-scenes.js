(function(root,factory){
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./drill-lexicon.js"));
 else root.ConditionalScenes=factory(root.DrillLexicon);
})(typeof globalThis==="object"?globalThis:this,function(lex){
 "use strict";
 // Preparation belongs before the proposed action; follow-up belongs after it.
 const steps={
  read:["先に図書館で借りてください","感想を教えてください","borrow it from the library first","tell me your impressions","さきにとしょかんでかりてください","かんそうをおしえてください"],
  write:["先に内容を考えてください","先生に見せてください","think about the content first","show it to the teacher","さきにないようをかんがえてください","せんせいにみせてください"],
  use:["先に使い方を確認してください","元の場所に戻してください","check how to use it first","put it back where it belongs","さきにつかいかたをかくにんしてください","もとのばしょにもどしてください"],
  bring:["先にかばんに入れてください","机に置いてください","put it in your bag first","put it on the desk","さきにかばんにいれてください","つくえにおいてください"],
  borrow:["先に受付で聞いてください","大切に使ってください","ask at reception first","use it carefully","さきにうけつけできいてください","たいせつにつかってください"],
  eat:["先に手を洗ってください","テーブルを拭いてください","wash your hands first","wipe the table","さきにてをあらってください","てーぶるをふいてください"],
  buy:["先に値段を確認してください","レシートをもらってください","check the price first","get a receipt","さきにねだんをかくにんしてください","れしーとをもらってください"],
  send:["先に宛先を確認してください","私に知らせてください","check the address first","let me know","さきにあてさきをかくにんしてください","わたしにしらせてください"]
 };
 const plans=lex.actions.map(a=>({...a,before:steps[a.domain][0],after:steps[a.domain][1],beforeEn:steps[a.domain][2],afterEn:steps[a.domain][3]}));
 const discoveries=[
  ["店に行く","店に行った","休みでした","went to the shop and found it closed","みせにいく","みせにいった","やすみでした"],
  ["窓を開ける","窓を開けた","雪が降っていました","opened the window and found it was snowing","まどをあける","まどをあけた","ゆきがふっていました"],
  ["箱を開ける","箱を開けた","手紙が入っていました","opened the box and found a letter inside","はこをあける","はこをあけた","てがみがはいっていました"],
  ["家に帰る","家に帰った","友だちが待っていました","came home and found a friend waiting","いえにかえる","いえにかえった","ともだちがまっていました"],
  ["駅に着く","駅に着いた","電車はもう出ていました","arrived at the station and found the train had already left","えきにつく","えきについた","でんしゃはもうでていました"],
  ["かばんの中を見る","かばんの中を見た","財布がありませんでした","looked in the bag and found the wallet missing","かばんのなかをみる","かばんのなかをみた","さいふがありませんでした"],
  ["教室に入る","教室に入った","誰もいませんでした","entered the classroom and found nobody there","きょうしつにはいる","きょうしつにはいった","だれもいませんでした"],
  ["電話をかける","電話をかけた","先生が出ました","made the call and the teacher answered","でんわをかける","でんわをかけた","せんせいがでました"]
 ].map(([dict,ta,result,en,kd,kt,kr],i)=>({id:`discovery:${i}`,domain:"discovery",dict,ta,result,en,kd,kt,kr,words:[dict,result]}));
 const automatic=[
  ["このボタンを押す","このボタンを押せば","ドアが開きます","press this button","the door opens","このぼたんをおす","このぼたんをおせば","どあがあきます"],
  ["カードを入れる","カードを入れれば","画面が変わります","insert the card","the screen changes","かーどをいれる","かーどをいれれば","がめんがかわります"],
  ["春になる","春になれば","花が咲きます","spring comes","flowers bloom","はるになる","はるになれば","はながさきます"],
  ["スイッチを切る","スイッチを切れば","電気が消えます","turn off the switch","the light goes off","すいっちをきる","すいっちをきれば","でんきがきえます"],
  ["右に曲がる","右に曲がれば","駅が見えます","turn right","the station comes into view","みぎにまがる","みぎにまがれば","えきがみえます"],
  ["ふたを開ける","ふたを開ければ","音楽が流れます","open the lid","music plays","ふたをあける","ふたをあければ","おんがくがながれます"],
  ["この線を引く","この線を引けば","二つに分かれます","draw this line","it divides into two parts","このせんをひく","このせんをひけば","ふたつにわかれます"],
  ["朝になる","朝になれば","店が開きます","morning comes","the shop opens","あさになる","あさになれば","みせがあきます"]
 ].map(([dict,ba,result,en,resultEn,kd,kb,kr],i)=>({id:`automatic:${i}`,domain:"automatic",dict,ba,result,en,resultEn,kd,kb,kr,words:[dict,result]}));
 const conditions=[
  ["安い","安ければ","安くなければ","買います","cheap","buy it","やすい","やすければ","やすくなければ","かいます"],
  ["近い","近ければ","近くなければ","歩きます","nearby","walk","ちかい","ちかければ","ちかくなければ","あるきます"],
  ["涼しい","涼しければ","涼しくなければ","外で食べます","cool","eat outside","すずしい","すずしければ","すずしくなければ","そとでたべます"],
  ["軽い","軽ければ","軽くなければ","持っていきます","light","take it along","かるい","かるければ","かるくなければ","もっていきます"],
  ["広い","広ければ","広くなければ","ここを借ります","spacious","rent this place","ひろい","ひろければ","ひろくなければ","ここをかります"],
  ["新しい","新しければ","新しくなければ","使います","new","use it","あたらしい","あたらしければ","あたらしくなければ","つかいます"],
  ["早い","早ければ","早くなければ","間に合います","early","make it in time","はやい","はやければ","はやくなければ","まにあいます"],
  ["暖かい","暖かければ","暖かくなければ","出かけます","warm","go out","あたたかい","あたたかければ","あたたかくなければ","でかけます"],
  ["時間がある","時間があれば","時間がなければ","手伝います","have time","help","じかんがある","じかんがあれば","じかんがなければ","てつだいます"],
  ["お金がある","お金があれば","お金がなければ","旅行します","have money","travel","おかねがある","おかねがあれば","おかねがなければ","りょこうします"],
  ["席がある","席があれば","席がなければ","座れます","a seat is available","can sit","せきがある","せきがあれば","せきがなければ","すわれます"],
  ["分かる","分かれば","分からなければ","説明できます","understand","can explain","わかる","わかれば","わからなければ","せつめいできます"],
  ["必要だ","必要なら","必要でなければ","持っていきます","necessary","take it along","ひつようだ","ひつようなら","ひつようでなければ","もっていきます"],
  ["静かだ","静かなら","静かでなければ","勉強できます","quiet","can study","しずかだ","しずかなら","しずかでなければ","べんきょうできます"],
  ["学生だ","学生なら","学生でなければ","割引があります","a student","get a discount","がくせいだ","がくせいなら","がくせいでなければ","わりびきがあります"],
  ["会員だ","会員なら","会員でなければ","利用できます","a member","can use it","かいいんだ","かいいんなら","かいいんでなければ","りようできます"]
 ].map(([dict,yes,no,result,en,resultEn,kd,ky,kn,kr],i)=>({id:`condition:${i}`,domain:i<8?"adjective":i<12?"state":"copula",dict,yes,no,result,en,resultEn,kd,ky,kn,kr,words:[dict,result]}));
 const readings=[...lex.readings,...Object.values(steps).flatMap(([a,b,,,ka,kb])=>[[a,ka],[b,kb]]),...discoveries.flatMap(a=>[[a.dict,a.kd],[a.ta,a.kt],[a.result,a.kr]]),...automatic.flatMap(a=>[[a.dict,a.kd],[a.ba,a.kb],[a.result,a.kr]]),...conditions.flatMap(a=>[[a.dict,a.kd],[a.yes,a.ky],[a.no,a.kn],[a.result,a.kr]])];
 // Display entries are lexical units, not whole-clause answer-normalization aliases.
 const displayReadings=[...lex.readings,
  ["先","さき"],["内容","ないよう"],["考えて","かんがえて"],["使い方","つかいかた"],["確認","かくにん"],["元","もと"],["場所","ばしょ"],["戻して","もどして"],["感想","かんそう"],["教えて","おしえて"],["見せて","みせて"],["机","つくえ"],["置いて","おいて"],["大切","たいせつ"],["手","て"],["洗って","あらって"],["拭いて","ふいて"],["値段","ねだん"],["宛先","あてさき"],["知らせて","しらせて"],
  ["行く","いく"],["行った","いった"],["休み","やすみ"],["窓","まど"],["開ける","あける"],["開けた","あけた"],["開ければ","あければ"],["雪","ゆき"],["降って","ふって"],["箱","はこ"],["家","いえ"],["帰る","かえる"],["帰った","かえった"],["友だち","ともだち"],["待って","まって"],["駅","えき"],["着く","つく"],["着いた","ついた"],["電車","でんしゃ"],["出て","でて"],["中","なか"],["見る","みる"],["見た","みた"],["財布","さいふ"],["誰","だれ"],["電話","でんわ"],["出ました","でました"],
  ["押す","おす"],["押せば","おせば"],["開きます","あきます"],["入れれば","いれれば"],["画面","がめん"],["変わります","かわります"],["春","はる"],["花","はな"],["咲きます","さきます"],["切る","きる"],["切れば","きれば"],["電気","でんき"],["消えます","きえます"],["右","みぎ"],["曲がる","まがる"],["曲がれば","まがれば"],["見えます","みえます"],["音楽","おんがく"],["流れます","ながれます"],["線","せん"],["引く","ひく"],["引けば","ひけば"],["二つ","ふたつ"],["分かれます","わかれます"],["朝","あさ"],
  ...conditions.filter(s=>s.domain==="adjective").flatMap(s=>[[s.dict,s.kd],[s.yes,s.ky],[s.no,s.kn]]),
  ["歩きます","あるきます"],["外","そと"],["持っていきます","もっていきます"],["借ります","かります"],["間に合います","まにあいます"],["出かけます","でかけます"],["時間","じかん"],["お金","おかね"],["手伝います","てつだいます"],["手伝って","てつだって"],["旅行","りょこう"],["席","せき"],["座れます","すわれます"],["分かる","わかる"],["分かれば","わかれば"],["分からなければ","わからなければ"],["説明","せつめい"],["必要","ひつよう"],["静か","しずか"],["勉強","べんきょう"],["学生","がくせい"],["割引","わりびき"],["会員","かいいん"],["利用","りよう"]];
 return{plans,discoveries,automatic,conditions,readings,displayReadings};
});
