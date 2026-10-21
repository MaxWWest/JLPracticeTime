(function(root,factory){
	if(typeof module==="object"&&module.exports)module.exports=factory(require("./drill-kit.js"),require("./drill-lexicon.js"));
	else root.AppearancePractice=factory(root.DrillKit,root.DrillLexicon);
})(typeof globalThis==="object"?globalThis:this,function(k,lex){
	"use strict";
	const unit="appearance",version=k.version(unit);
	const adjectives=[
		["おいしい","おいし","delicious","おいしい","ケーキ","パン","料理"],
		["重い","重","heavy","おもい","箱","荷物","かばん"],
		["難しい","難し","difficult","むずかしい","問題","試験","仕事"],
		["高い","高","expensive","たかい","時計","靴","自転車"],
		["暑い","暑","hot","あつい","部屋","教室","会場"],
		["静か","静か","quiet","しずか","図書館","公園","町"],
		["便利","便利","convenient","べんり","アプリ","道具","パソコン"],
		["いい","よ","good","いい","天気","景色","部屋"]
	];
	const states=[
		["窓を","開けた","開けない","寝ました","opened the window","まどを","あけた","あけない","ねました"],
		["電気を","つけた","つけない","出かけました","switched on the light","でんきを","つけた","つけない","でかけました"],
		["ドアを","閉めた","閉めない","会議を始めました","closed the door","どあを","しめた","しめない","かいぎをはじめました"],
		["靴を","履いた","履かない","部屋に入りました","put on shoes","くつを","はいた","はかない","へやにはいりました"],
		["コートを","着た","着ない","写真を撮りました","put on a coat","こーとを","きた","きない","しゃしんをとりました"],
		["エアコンを","つけた","つけない","休みました","switched on the air conditioner","えあこんを","つけた","つけない","やすみました"],
		["眼鏡を","かけた","かけない","眠ってしまいました","put on glasses","めがねを","かけた","かけない","ねむってしまいました"],
		["帽子を","かぶった","かぶらない","食事をしました","put on a hat","ぼうしを","かぶった","かぶらない","しょくじをしました"]
	];
	const events=[
		["雨が","降り","降る","rain","あめが","ふり","ふる"],
		["雪が","降り","降る","snow","ゆきが","ふり","ふる"],
		["コップが","落ち","落ちる","the glass falling","こっぷが","おち","おちる"],
		["枝が","折れ","折れる","the branch breaking","えだが","おれ","おれる"],
		["子どもが","泣き","泣く","the child crying","こどもが","なき","なく"],
		["荷物が","倒れ","倒れる","the parcel tipping over","にもつが","たおれ","たおれる"]
	];
	const feelings=[["寒","さむ","cold"],["暑","あつ","hot"],["怖","こわ","afraid"],["寂し","さびし","lonely"],["恥ずかし","はずかし","embarrassed"]];
	const qualities=[["古い","","old","ふるい"],["冷たい","","cold to the touch","つめたい"],["静か","な","quiet","しずか"],["きれい","な","clean","きれい"],["空っぽ","な","empty","からっぽ"],["先月","の","last month's state","せんげつ"]];
	const readings=[...lex.readings,...adjectives.flatMap(([word,stem,,kana])=>[[word,kana],[stem,word==="いい"?"よ":word.endsWith("い")?kana.slice(0,-1):kana]]),
		...states.flatMap(([p,a,b,c,,kp,ka,kb,kc])=>[[p,kp],[a,ka],[b,kb],[c,kc]]),...events.flatMap(([p,s,d,,kp,ks,kd])=>[[p,kp],[s,ks],[d,kd]]),...feelings.map(([s,r])=>[s,r]),
		...qualities.map(([word,,,kana])=>[word,kana]),["料理","りょうり"],["箱","はこ"],["問題","もんだい"],["試験","しけん"],["仕事","しごと"],["部屋","へや"],["会場","かいじょう"],["公園","こうえん"],["町","まち"],["道具","どうぐ"],["天気","てんき"],["景色","けしき"]];
	function forms(word,stem,positive,source){
		const na=["静か","便利"].includes(word);
		if(source==="heard")return `${positive?(na?word+"だ":word):(na?word+"ではない":stem+"くない")}そうです`;
		return `${positive?(word==="いい"?"よさ":stem):(na?stem+"ではなさ":stem+"くなさ")}そうです`;
	}
	function create({aliases=[]}={}){
		function buildBank(){
			const bank=[];
			for(const [word,stem,en,,...nouns] of adjectives)for(const noun of nouns)for(let v=0;v<4;v++){
				const positive=v%2===0,source=v<2?"seen":"heard",scene={id:`quality:${noun}:${word}`,domain:"quality",words:[noun,word]};
				const options=["seen","heard"].flatMap(s=>[true,false].map(p=>forms(word,stem,p,s)));
				const prompt=source==="seen"?`You are judging ${noun} from its appearance, not repeating a report. It looks ${positive?en:`not ${en}`}.`:`You have not seen ${noun}. Someone told you it is ${positive?en:`not ${en}`}. Pass on that report.`;
				const explanation="Appearance そう attaches to an adjective stem; hearsay そう follows a plain clause. Na-adjectives need だ for positive hearsay. Preserve the source and the negative meaning.";
				bank.push(k.cloze(unit,"source-and-quality","appearance",scene,v,prompt,[{label:"Report",segments:[noun+"は",k.gap("Predicate",[forms(word,stem,positive,source)],options),"。"]}],explanation,{source,positive}));
				bank.push(k.choice(unit,"interpret-source","source",scene,v,`${noun}は${forms(word,stem,positive,source)}。`,["It looks that way; a positive quality is suggested.","It looks that way; the positive quality seems absent.","Someone reported the positive quality.","Someone reported that the positive quality is absent."],options.indexOf(forms(word,stem,positive,source))===0?"It looks that way; a positive quality is suggested.":options.indexOf(forms(word,stem,positive,source))===1?"It looks that way; the positive quality seems absent.":source==="heard"&&positive?"Someone reported the positive quality.":"Someone reported that the positive quality is absent.",explanation,{source,positive}));
			}
			for(const [i,[prefix,stem,dict,en]]of events.entries())for(const [v,heard]of [false,true].entries()){
				const opts=[stem+"そうです",dict+"そうです",stem+"そうもありません"];
				bank.push(k.cloze(unit,"event-evidence","event",{id:`event:${i}`,domain:"event",words:[dict]},v,heard?`You were told about ${en}; you have not witnessed it. Relay the report.`:`Present signs suggest ${en} is about to happen. You are not quoting anyone.`,[{label:"Report",segments:[prefix,k.gap("Evidence",[opts[heard?1:0]],opts),"。"]}],"Verb stem + そう describes an apparent impending event. Dictionary form + そう relays a report; the extra verb ending changes the evidence source.",{heard}));
			}
			for(const [i,[prefix,done,notDone,main,en]]of states.entries())for(const [v,positive]of [true,false].entries()){
				const scene={id:`state:${i}`,domain:"unchanged",words:[prefix,done]};
				bank.push(k.cloze(unit,"unchanged-state","mama",scene,v,`You ${positive?en:`did NOT ${en.replace(/^(opened|closed|washed|switched on|put on)/,m=>({opened:"open",closed:"close",washed:"wash","switched on":"switch on","put on":"put on"}[m]))}`}. No change to that condition occurred before the next action.`,[{label:"Unchanged condition",segments:[prefix,k.gap("State",[positive?done:notDone],[done,notDone]),k.gap("Link",["まま"],["まま","ところで","ために"]),"、",main,"。"]}],"たまま retains the state resulting from doing the action. ないまま proceeds without doing it. Neither means that both activities are ongoing together.",{positive},"Keep the condition unchanged into the next action."));
				bank.push(k.choice(unit,"read-state","mama-scope",scene,v,`${prefix}${positive?done:notDone}まま、${main}。`,["The action was done, and its resulting state remained.","The next action happened without doing the first action.","Both actions were happening simultaneously throughout.","The first action is only a future goal."],positive?"The action was done, and its resulting state remained.":"The next action happened without doing the first action.","まま describes an unchanged condition. Check た versus ない before まま.",{positive}));
			}
			for(const [stem,kana,en]of feelings)for(const [v,current]of [true,false].entries()){
				bank.push(k.cloze(unit,"visible-feeling","feelings",{id:`feeling:${stem}`,domain:"feelings",words:[stem]},v,`Describe your brother's outward signs of feeling ${en}: ${current?"focus on what he is showing right now":"describe his usual tendency, rather than one ongoing episode"}.`,[{label:"Observation",segments:["弟は",stem,k.gap("Observation",[current?"がっています":"がります"],["がっています","がります"]),"。"]}],"がっている focuses on an ongoing display of feeling; がる can describe a habitual tendency. This is a viewpoint contrast, not a ban on quoting another person's own feelings.",{current}));
			}
			for(const [word,link,en] of qualities)bank.push(k.cloze(unit,"state-attachment","mama",{id:`quality-state:${word}`,domain:"state",words:[word]},0,`The state is still ${en}; it has not changed.`,[{label:"Unchanged state",segments:[k.gap("State phrase",[word+link+"まま"],[word+"まま",word+"なまま",word+"のまま"]),"です。"]}],"Before まま, i-adjectives remain unchanged, na-adjectives take な, and nouns take の. This describes a continuing state, not a new event.",{word,link}));
			return bank;
		}
		return k.engine(buildBank,readings,aliases);
	}
	return {version,create,readings,states,events,forms,selectQueue:(bank,count,options)=>k.select(unit,bank,count,options)};
});
