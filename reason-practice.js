(function(root,factory){
	if(typeof module==="object"&&module.exports)module.exports=factory(require("./drill-kit.js"));else root.ReasonPractice=factory(root.DrillKit);
})(typeof globalThis==="object"?globalThis:this,function(k){
	"use strict";
	const unit="reason",version=k.version(unit);
	// reason, result, te-cause, semantic paraphrase; noun/na rows omit their copula.
	const rows=[
		["雨が降った","試合が中止になりました","雨が降って","rain caused the match cancellation"],
		["電車が止まった","遅刻しました","電車が止まって","the stopped train caused lateness"],
		["財布を忘れた","切符が買えませんでした","財布を忘れて","forgetting the wallet prevented buying a ticket"],
		["道に迷った","約束の時間に遅れました","道に迷って","getting lost caused the late arrival"],
		["友だちが来た","うれしかったです","友だちが来て","the friend's arrival made you happy"],
		["先生が教えてくれた","よく分かりました","先生が教えてくれて","the teacher's explanation helped you understand"],
		["バスが来なかった","会議に間に合いませんでした","バスが来なくて","the bus not coming caused you to miss the meeting"],
		["鍵をなくした","家に入れませんでした","鍵をなくして","losing the key prevented entering the house"],
		["漢字が多い","読めません","漢字が多くて","the number of kanji prevents you from reading it","i"],
		["音が小さい","聞こえません","音が小さくて","the low volume prevents you from hearing it","i"],
		["荷物が重い","一人では運べません","荷物が重くて","the weight prevents carrying the parcel alone","i"],
		["値段が高い","買えません","値段が高くて","the price prevents you from buying it","i"],
		["部屋が暑い","眠れません","部屋が暑くて","the heat prevents you from sleeping","i"],
		["店が遠い","歩いて行けません","店が遠くて","the distance prevents you from walking there","i"],
		["お金がない","旅行できません","お金がなくて","lack of money prevents you from travelling","i"],
		["時間がない","全部は終わりません","時間がなくて","lack of time prevents completing everything","i"],
		["体の調子が悪い","仕事ができません","体の調子が悪くて","feeling unwell prevents you from working","i"],
		["説明が難しい","分かりません","説明が難しくて","the difficult explanation prevents understanding","i"],
		["心配","眠れません","心配で","worry prevents you from sleeping","na"],
		["残念","何も言えません","残念で","disappointment leaves you unable to say anything","na"],
		["複雑","使えません","複雑で","complexity prevents you from using it","na"],
		["不便","困っています","不便で","inconvenience is causing you trouble","na"],
		["静か","よく眠れます","静かで","the quiet allows you to sleep well","na"],
		["簡単","すぐできます","簡単で","simplicity lets you do it quickly","na"],
		["病気","学校を休みました","病気で","illness caused you to miss school","noun"],
		["台風","電車が止まりました","台風で","the typhoon stopped the trains","noun"],
		["工事中","この道は通れません","工事中で","construction prevents passage along this road","noun"],
		["休み","先生はいません","休みで","the day off explains the teacher's absence","noun"],
		["満席","座れません","満席で","all seats being occupied prevents you from sitting","noun"],
		["渋滞","バスが動きません","渋滞で","traffic congestion prevents the bus from moving","noun"]
	];
	const contrasts=[
		"試合は予定どおり行われました","約束の時間に間に合いました","切符は友だちが買ってくれました","約束の時間に間に合いました",
		"うれしくありませんでした","よく分かりませんでした","会議に間に合いました","窓から家に入れました",
		"全部読めます","よく聞こえます","一人で運べます","買う人が多いです","よく眠れます","毎日歩いて行きます",
		"高い時計を買いました","ゆっくり休んでいます","仕事を続けています","よく分かります","よく眠れます","笑っています",
		"子どもでも使えます","人気があります","眠れません","誰もできません","学校へ行きました","電車は動いています",
		"この道は通れます","先生は学校にいます","予約を受け付けています","バスは予定どおり着きました"
	];
	const requests=[
		["寒い","窓を閉めてください","It is cold; ask someone to close the window."],
		["暑い","エアコンをつけてください","It is hot; ask someone to switch on the air conditioner."],
		["暗い","電気をつけてください","It is dark; ask someone to switch on the light."],
		["聞こえない","もう一度言ってください","You cannot hear; ask someone to say it again."],
		["よく見えない","もっと大きく書いてください","You cannot see well; ask for larger writing."],
		["字が読めない","読んでください","You cannot read the handwriting; ask someone to read it."],
		["手がぬれている","ドアを開けてください","Your hands are wet; ask someone to open the door."],
		["荷物が重い","手伝ってください","The luggage is heavy; ask for help."],
		["電池がない","充電器を貸してください","Your battery is flat; ask to borrow a charger."],
		["道が分からない","教えてください","You do not know the way; ask for directions."]
	];
	const readings=[["雨","あめ"],["降った","ふった"],["降って","ふって"],["試合","しあい"],["中止","ちゅうし"],["電車","でんしゃ"],["止まった","とまった"],["止まって","とまって"],["止まり","とまり"],["遅刻","ちこく"],["財布","さいふ"],["忘れた","わすれた"],["忘れて","わすれて"],["切符","きっぷ"],["買え","かえ"],["道","みち"],["迷った","まよった"],["迷って","まよって"],["約束","やくそく"],["時間","じかん"],["遅れ","おくれ"],["友だち","ともだち"],["来た","きた"],["来て","きて"],["来なかった","こなかった"],["来なくて","こなくて"],["先生","せんせい"],["教えて","おしえて"],["分かり","わかり"],["会議","かいぎ"],["間に合い","まにあい"],["鍵","かぎ"],["家","いえ"],["入れ","はいれ"],["漢字","かんじ"],["多い","おおい"],["多くて","おおくて"],["読め","よめ"],["音","おと"],["小さい","ちいさい"],["小さくて","ちいさくて"],["聞こえ","きこえ"],["荷物","にもつ"],["重い","おもい"],["重くて","おもくて"],["一人","ひとり"],["運べ","はこべ"],["値段","ねだん"],["高い","たかい"],["高くて","たかくて"],["部屋","へや"],["暑い","あつい"],["暑くて","あつくて"],["眠れ","ねむれ"],["店","みせ"],["遠い","とおい"],["遠くて","とおくて"],["歩いて","あるいて"],["行け","いけ"],["お金","おかね"],["旅行","りょこう"],["全部","ぜんぶ"],["終わり","おわり"],["体","からだ"],["調子","ちょうし"],["悪い","わるい"],["悪くて","わるくて"],["仕事","しごと"],["説明","せつめい"],["難しい","むずかしい"],["難しくて","むずかしくて"],["心配","しんぱい"],["残念","ざんねん"],["何も","なにも"],["言え","いえ"],["複雑","ふくざつ"],["使え","つかえ"],["不便","ふべん"],["困って","こまって"],["静か","しずか"],["簡単","かんたん"],["病気","びょうき"],["学校","がっこう"],["休み","やすみ"],["台風","たいふう"],["工事中","こうじちゅう"],["通れ","とおれ"],["満席","まんせき"],["座れ","すわれ"],["渋滞","じゅうたい"],["動き","うごき"]];
	function create({aliases=[]}={}){
		function buildBank(){
			const bank=[];
			rows.forEach(([reason,result,te,en,type="verb"],i)=>{
				const copula=["na","noun"].includes(type),scene={id:`cause:${i}`,domain:type,words:[reason,result]};
				const links=copula?["だから","なので"]:["から","ので"];
				bank.push(k.cloze(unit,"connect-cause","cause",scene,0,`Connect the cause and result: ${en}.`,[{label:"Explanation",segments:[reason,k.gap("Cause link",links,[...links,copula?"なのに":"のに",copula?"なら":"なら"]),"、",result,"。"]}],"から and ので both express cause here; both are accepted. Nouns and na-adjectives take だ before から and な before ので. Politeness alone does not make one universally correct.",{reason,result},"Keep the causal relationship. Either natural reason connector is accepted."));
				bank.push(k.cloze(unit,"focused-reason","reason-answer",scene,0,`${result}。\nどうしてですか。`,[{label:"Answer",segments:[reason,k.gap("Explanation ending",copula?["だからです","だから"]:["からです","から"],copula?["だからです","なのでした","なのに"]:["からです","のに","そうです"]),"。"]}],"からです presents the reason as the answer to why. The supplied first clause is the cause, not the result.",{reason,result},"Answer why, using the supplied reason."));
				bank.push(k.cloze(unit,"te-cause","cause-link",scene,0,`Express this cause and its non-volitional result with a て-form link: ${en}.`,[{label:"Cause and result",segments:[k.gap("Linked cause",[te],[te,reason,copula?reason+"な":reason+"の"]),"、",result,"。"]}],"The て/くて/で form can connect a cause to this result. The effect here is an emotion, state, consequence, or inability, not an instruction to the listener.",{reason,result}));
				const sentences=[`${reason}${links[0]}、${result}。`,`${reason}${copula?"なのに":"のに"}、${contrasts[i]}。`];
				for(const [v,contrast] of [false,true].entries())bank.push(k.choice(unit,"cause-or-contrast","relationship",scene,v,sentences[contrast?1:0],["The second clause is presented as a result of the first.","The second clause goes against an expectation from the first.","The first clause is the goal of the second.","The speaker is repeating someone else's report."],contrast?"The second clause goes against an expectation from the first.":"The second clause is presented as a result of the first.","から presents a reason. のに presents a result contrary to the expectation created by the first clause.",{contrast}));
			});
			requests.forEach(([cause,request,en],i)=>bank.push(k.cloze(unit,"reason-request","request",{id:`request:${i}`,domain:"request",words:[cause,request]},0,en,
				[{label:"Polite request",segments:[cause,k.gap("Reason link",["ので","から"],["ので","から","のに"]),"、",request,"。"]}],"Both ので and から can introduce a reason before a polite request. This is not a contrast, and politeness does not force just one reason connector.",{cause,request},"Give the reason for the request. Either natural reason connector is accepted.")));
			return bank;
		}
		return k.engine(buildBank,readings,aliases);
	}
	return{version,create,readings,rows,contrasts,requests,selectQueue:(bank,count,options)=>k.select(unit,bank,count,options)};
});
