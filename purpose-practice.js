(function(root,factory){
	if(typeof module==="object"&&module.exports)module.exports=factory(require("./drill-kit.js"),require("./drill-lexicon.js"));else root.PurposePractice=factory(root.DrillKit,root.DrillLexicon);
})(typeof globalThis==="object"?globalThis:this,function(k,lex){
	"use strict";
	const unit="purpose",version=k.version(unit);
	const outcomes=[
		["みんなに字が見える","大きく書きます","everyone can see the letters","make the letters large","みんなにじがみえる","おおきくかきます"],
		["後ろの人にも聞こえる","マイクを使います","people at the back can hear","use a microphone","うしろのひとにもきこえる","まいくをつかいます"],
		["子どもが眠れる","部屋を暗くします","the child can sleep","darken the room","こどもがねむれる","へやをくらくします"],
		["荷物がぬれない","袋に入れます","the parcel does not get wet","put it in a bag","にもつがぬれない","ふくろにいれます"],
		["鍵をなくさない","いつも同じ場所に置きます","you do not lose the key","always put it in the same place","かぎをなくさない","いつもおなじばしょにおきます"],
		["時間に遅れない","早く出発します","you are not late","leave early","じかんにおくれない","はやくしゅっぱつします"],
		["風が入る","窓を開けます","air comes in","open the window","かぜがはいる","まどをあけます"],
		["道に迷わない","地図を持っていきます","you do not get lost","take a map","みちにまよわない","ちずをもっていきます"],
		["友だちにも分かる","簡単な言葉で説明します","your friend also understands","explain in simple words","ともだちにもわかる","かんたんなことばでせつめいします"],
		["忘れない","手帳に書きます","you do not forget","write it in your planner","わすれない","てちょうにかきます"],
		["鳥が見える","窓の近くに座ります","you can see the birds","sit near the window","とりがみえる","まどのちかくにすわります"],
		["電車に間に合う","急いで歩きます","you catch the train in time","walk quickly","でんしゃにまにあう","いそいであるきます"]
	];
	const nounGoals=[["健康","毎日歩きます","health","けんこう","まいにちあるきます"],["試験","単語を覚えます","the exam","しけん","たんごをおぼえます"],["旅行","お金をためます","the trip","りょこう","おかねをためます"],["会議","資料を用意します","the meeting","かいぎ","しりょうをよういします"]];
	const readings=[...lex.readings,...outcomes.flatMap(([a,b,,,ka,kb])=>[[a,ka],[b,kb]]),...nounGoals.flatMap(([a,b,,ka,kb])=>[[a,ka],[b,kb]]),["早く","はやく"],["出かけます","でかけます"],["行きます","いきます"],["練習","れんしゅう"],["必要","ひつよう"],["道具","どうぐ"]];
	function create({aliases=[]}={}){
		function buildBank(){
			const bank=[];
			for(const a of lex.actions.filter(a=>a.domain!=="bring")){
				bank.push(k.cloze(unit,"movement-goal","movement",a,0,`You go to ${a.place} to ${a.actionEn}. The action is the purpose of the trip, not a completed event.`,[{label:"Trip",segments:[a.place+"へ",a.prefix,k.gap("Action form",[a.stem],[a.stem,a.verb,a.ta]),k.gap("Link",["に"],["に","から","まで"]),"行きます。"]}],"With movement-purpose に, use the verb's ます-stem before に. This expresses why you go, not that the intended activity has already happened.",{action:a.id},"Complete the purpose of the trip."));
				bank.push(k.cloze(unit,"intentional-goal","intention",a,0,`Your goal is to ${a.actionEn}. You leave early in order to do that.`,[{label:"Plan",segments:[a.dict,k.gap("Purpose link",["ために"],["ために","から","のに"]),"、早く出かけます。"]}],"Dictionary form + ために names an intentional goal. This does not assert that the goal has already been achieved. Some contexts also allow ように with a different emphasis; it is not offered as a supposedly ungrammatical distractor.",{action:a.id}));
				for(const [v,modify] of [false,true].entries())bank.push(k.cloze(unit,"purpose-attachment","attachment",a,v,modify?`Complete a noun phrase: preparations for this activity (${a.actionEn}).`:`Complete an action sentence: make preparations for this activity (${a.actionEn}).`,[{label:modify?"Noun phrase":"Action",segments:[a.dict,k.gap("Attachment",[modify?"ための":"ために"],["ための","ために"]),modify?"準備です。":"準備します。"]}],"ための modifies the following noun; ために modifies an action. The intended purpose stays the same, but the syntactic connection changes.",{modify}));
				bank.push(k.choice(unit,"goal-not-result","scope",a,0,`${a.place}へ${a.prefix}${a.stem}に行きました。`,["The trip happened with that purpose; success at the activity is not guaranteed.","The activity was definitely completed successfully.","The activity was forbidden.","The trip was only a hope and did not happen."],"The trip happened with that purpose; success at the activity is not guaranteed.","Past 行きました establishes the trip. Purpose に says what it was for, not whether that purpose was achieved.",{trip:true,success:"unknown"}));
			}
			for(const [i,[goal,action,goalEn,actionEn]]of outcomes.entries()){
				const scene={id:`outcome:${i}`,domain:"outcome",words:[goal,action]};
				bank.push(k.cloze(unit,"desired-outcome","outcome",scene,0,`You ${actionEn} so that ${goalEn}. The goal is not an already-established cause.`,[{label:"Purpose",segments:[goal,k.gap("Purpose",["ように"],["ように","から","のに"]),"、",action,"。"]}],"ように presents the desired outcome or prevention. The first clause is what the later action aims to make possible, not a result already known to be true.",{goal,action}));
				bank.push(k.choice(unit,"identify-goal","goal",scene,0,`${goal}ように、${action}。`,["The first clause is the goal; the second is the action taken toward it.","The second clause is the goal; the first is the action taken toward it.","Both clauses report completed, successful outcomes.","The first clause is an established cause, not an intended outcome."],"The first clause is the goal; the second is the action taken toward it.","The clause before ように states the intended outcome; the following clause states the means. The goal is not guaranteed to have been achieved.",{goal,action}));
			}
			for(const [i,[noun,action,en]]of nounGoals.entries())bank.push(k.cloze(unit,"noun-purpose","noun",{id:`noun:${noun}`,domain:"noun",words:[noun,action]},i,`You take this action for ${en}.`,[{label:"Purpose",segments:[noun,k.gap("Noun link",["のために"],["のために","ために","のための"]),"、",action,"。"]}],"A noun takes の before ために. The に form connects this purpose to an action; ための would instead modify a noun.",{noun}));
			return bank;
		}
		return k.engine(buildBank,readings,aliases);
	}
	return{version,create,readings,outcomes,nounGoals,selectQueue:(bank,count,options)=>k.select(unit,bank,count,options)};
});
