(function(root,factory){
	if(typeof module==="object"&&module.exports)module.exports=factory(require("./drill-kit.js"),require("./drill-lexicon.js"),require("./permission-practice.js"),require("./desire-practice.js"),require("./appearance-practice.js"),require("./reason-practice.js"),require("./purpose-practice.js"));
	else root.BossSixTen=factory(root.DrillKit,root.DrillLexicon,root.PermissionPractice,root.DesirePractice,root.AppearancePractice,root.ReasonPractice,root.PurposePractice);
})(typeof globalThis==="object"?globalThis:this,function(k,lex,permission,desire,appearance,reason,purpose){
	"use strict";
	const version="boss-06-10-v1",units=["permission","desire","appearance","reason","purpose"];
	const risks=[
		["コップが落ち","コップが落ちる","コップが落ちない","机の真ん中に置きます","the glass falling","put it in the middle of the table"],
		["荷物が倒れ","荷物が倒れる","荷物が倒れない","手で支えます","the parcel tipping over","support it with your hand"],
		["子どもが泣き","子どもが泣く","子どもが泣かない","優しく声をかけます","the child crying","speak gently to the child"],
		["枝が折れ","枝が折れる","枝が折れない","重い物を取り除きます","the branch breaking","remove the heavy object"],
		["本がぬれ","本がぬれる","本がぬれない","袋に入れます","the book getting wet","put the book in a bag"],
		["風船が飛んでいき","風船が飛んでいく","風船が飛んでいかない","ひもを持ちます","the balloon flying away","hold the string"]
	];
	const alternatePlans=[
		["手をけがしない","手袋をします","avoid injuring your hand","put on gloves"],
		["床に傷がつかない","下にマットを敷きます","avoid scratching the floor","put a mat underneath"],
		["子どもが安心する","そばに座ります","help the child feel reassured","sit beside the child"],
		["頭をけがしない","ヘルメットをかぶります","avoid a head injury","wear a helmet"],
		["文字が読める","ライトをつけます","make the letters readable","turn on a light"],
		["遠くからも見える","明るい色を選びます","make it visible from far away","choose a bright colour"]
	];
	const readings=[...lex.readings,...permission.readings,...desire.readings,...appearance.readings,...reason.readings,...purpose.readings,
		["行きました","いきました"],["行った","いった"],["言った","いった"],
		["準備","じゅんび"],["見学","けんがく"],["観察","かんさつ"],["安全","あんぜん"],["机","つくえ"],["真ん中","まんなか"],["置きます","おきます"],["手","て"],["支えます","ささえます"],["優しく","やさしく"],["声","こえ"],["重い","おもい"],["物","もの"],["取り除きます","とりのぞきます"],["風船","ふうせん"],["飛んでいき","とんでいき"],["飛んでいく","とんでいく"],["飛んでいかない","とんでいかない"],["持ちます","もちます"],["落ちない","おちない"],["倒れない","たおれない"],["泣かない","なかない"],["折れない","おれない"],["言いました","いいました"],
		["手袋","てぶくろ"],["床","ゆか"],["傷","きず"],["下","した"],["敷きます","しきます"],["安心","あんしん"],["座ります","すわります"],["頭","あたま"],["文字","もじ"],["読める","よめる"],["遠く","とおく"],["見える","みえる"],["明るい","あかるい"],["色","いろ"],["選びます","えらびます"],["会議中","かいぎちゅう"],["休み時間","やすみじかん"]];
	const pairs=()=>[[false,false],[false,true],[true,false],[true,true]];
	function writingAnswers(answer) {
		// Only expand endings used by these authored frames; preserve polarity and roles.
		let plain=answer.replace(/なければなりません/g,"なければならない").replace(/([てで])はいけません/g,"$1はいけない").replace(/なくてもいいです/g,"なくてもいい").replace(/たくないです/g,"たくない").replace(/たいです/g,"たい").replace(/そうです/g,"そうだ").replace(/言いました/g,"言った").replace(/行きました/g,"行った").replace(/なので/g,"だから");
		for(const a of lex.actions)plain=plain.replaceAll(a.stem+"ました",a.ta);
		const variants=[answer,plain,answer.replace(/なので/g,"だから"),answer.replace(/たくないです/g,"たくありません")];
		for(const text of [...variants])for(const a of lex.actions) {
			if(text.includes(a.prefix+a.stem+"たい")||text.includes(a.prefix+a.stem+"たく"))variants.push(text.replace(a.prefix+a.stem,a.noun+"が"+a.stem));
		}
		return k.unique(variants.flatMap(text=>[text,text.replace(/^私は/,"")]));
	}
	function create({aliases=[]}={}){
		function make(primary,secondary,family,v,prompt,facts,render,explanation){
			const variants=pairs().map(([first,second])=>({first,second}));
			const answer=render(facts),options=variants.map(render);
			const q={kind:"Combine the meanings",mode:"choice",prompt,subprompt:"Which message preserves BOTH facts?",band:"Keep both meanings.",options,answer,choiceFacts:variants,
				choiceFeedback:Object.fromEntries(options.filter(o=>o!==answer).map(o=>[o,explanation])),explanation,
				meta:{engine:version,sourceSessionId:primary,units:[primary,secondary],task:family,topic:primary,pattern:primary,difficulty:"boss",domain:family,familyKey:family,sceneKey:`${family}:${v}`,id:`${family}:${v}`,vocabulary:[],facts}};
			const accepted=writingAnswers(answer);
			q.writing={kind:"Final message",mode:"text",subprompt:"Write the Japanese message in the stated order, preserving both facts. The word bank supplies the vocabulary.",band:"Write the complete message.",fields:[k.field("Your message",accepted,options.filter(o=>o!==answer).map(o=>({accepted:writingAnswers(o),message:explanation})))],answer,accepted};
			return q;
		}
		function buildBank(){
			const bank=[];
			for(let i=0;i<6;i++)for(let v=0;v<4;v++){
				const first=v<2,second=v%2===0,facts={first,second};
				const a=lex.actions[i*4%lex.actions.length],b=lex.actions[(i*4+1)%lex.actions.length],c=lex.actions[(i*4+2)%lex.actions.length];
				let q=make("permission","desire",`wish-rule-${i}`,v,`You ${first?"want":"do not want"} to ${a.actionEn}.\nThe instructor says: ${a.prefix}${permission.forms(a,second?"forbidden":"unnecessary")[0]}。`,facts,
					f=>`私は${a.prefix}${desire.desire(a,f.first)}。${a.prefix}${permission.forms(a,f.second?"forbidden":"unnecessary")[0]}。`,"A personal wish does not change the rule. てはいけません forbids the action; なくてもいいです removes the requirement.");
				q.vocabulary=`${a.dict} (${a.actionEn})`;bank.push(q);
				q=make("desire","appearance",`wish-evidence-${i}`,v,`Your sister says she ${first?"wants":"does not want"} to ${b.actionEn}.\n${second?"After watching a demonstration, you judge that this task looks difficult.":"You have not seen the task; a teacher told you it is difficult."}`,facts,
					f=>`姉は「${b.prefix}${desire.desire(b,f.first)}」と言いました。${b.dict}のは${f.second?"難しそうです":"難しいそうです"}。`,"The quoted たい expresses your sister's wish. 難しそう gives an impression; 難しいそう reports what someone said. Keep both the wish and the evidence source.");
				q.vocabulary=`${b.dict} (${b.actionEn}) / 難しい (difficult)`;bank.push(q);
				const [stem,dict,negative,action,event,actionEn]=risks[i];
				const [altGoal,altAction,altGoalEn,altActionEn]=alternatePlans[i];
				q=make("appearance","purpose",`risk-goal-${i}`,v,`${first?"Present signs suggest":"Someone told you about"} ${event}.\n${second?`You ${actionEn} to PREVENT it.`:`Your plan is to ${altActionEn} to ${altGoalEn}.`}`,facts,
					f=>`${f.first?stem:dict}そうです。${f.second?negative:altGoal}ように、${f.second?action:altAction}。`,"Stem + そう is an appearance; plain form + そう is hearsay. The clause before ように names the chosen goal; the following action must preserve the stated plan.");
				q.vocabulary=`${dict} (${event}) / ${second?action:altAction} (${second?actionEn:altActionEn}) / ${second?negative:altGoal} (${second?"prevent that event":altGoalEn})`;bank.push(q);
				q=make("reason","permission",`cause-rule-${i}`,v,`The setting is ${first?"a meeting in progress":"a break"}. That is given as the REASON for the following instruction, not a contrast.\n${permission.meaning[second?"forbidden":"unnecessary"]}\nAction: ${c.actionEn}.`,facts,
					f=>`${f.first?"会議中":"休み時間"}なので、${c.prefix}${permission.forms(c,f.second?"forbidden":"unnecessary")[0]}。`,"Keep the stated reason and the rule distinct. Noun + なので connects the reason; optional and forbidden are not interchangeable.");
				q.vocabulary=`会議中 (during a meeting) / 休み時間 (break time) / ${c.dict} (${c.actionEn})`;
				q.writing.fields[0].accepted.push(q.answer.replace("なので","だから"));bank.push(q);
				const move=lex.actions.filter(x=>x.domain!=="bring")[i*4%28];
				q=make("purpose","desire",`wish-trip-${i}`,v,`You ${first?"want":"do not want"} to ${move.actionEn}.\n${second?`You went to ${move.place} for that purpose, but have not done the activity yet.`:`You already completed the activity at ${move.place}. Do not describe it as only the trip's intended purpose.`}`,facts,
					f=>`私は${move.prefix}${desire.desire(move,f.first)}。${f.second?`${move.place}へ${move.prefix}${move.stem}に行きました`:`${move.place}で${move.prefix}${move.stem}ました`}。`,"A wish does not establish an event. Movement-purpose に describes the trip's goal; a direct past-action statement reports completion.");
				q.vocabulary=`${move.dict} (${move.actionEn}) / ${move.place}`;bank.push(q);
			}
			return bank;
		}
		return k.engine(buildBank,readings,aliases);
	}
	function selectQueue(bank,count=10,{seed=Date.now(),recent=[]}={}){
		const rng=k.random(seed),history=new Set(recent.slice(-20).map(key=>key.replace(/:\d+$/,""))),queue=[];
		for(const unit of k.shuffle(units,rng)){
			const candidates=k.shuffle(bank.filter(q=>q.meta.sourceSessionId===unit),rng).sort((a,b)=>Number(history.has(a.meta.familyKey))-Number(history.has(b.meta.familyKey)));
			const used=new Set();
			for(const q of candidates){
				if(used.has(q.meta.familyKey))continue;
				used.add(q.meta.familyKey);
				const options=k.shuffle(q.options,rng);
				queue.push({...q,options,choiceFacts:options.map(o=>q.choiceFacts[q.options.indexOf(o)])});
				if(used.size===2)break;
			}
		}
		const ordered=k.shuffle(queue,rng).slice(0,Math.min(10,count));
		// A different pair of primary units supplies the writing finale across seeds.
		const writers=k.shuffle(units,rng).slice(0,2),final=[];
		for(const unit of writers){const at=ordered.findIndex(q=>q.meta.sourceSessionId===unit);if(at>=0){const [q]=ordered.splice(at,1);final.push({...q,...q.writing,fields:q.writing.fields.map(f=>({...f,accepted:[...f.accepted]})),meta:{...q.meta,answerMode:"full"}});}}
		return [...ordered,...final];
	}
	return{version,roundSize:10,create,readings,units,selectQueue};
});
