(function(root, factory) {
	if (typeof module === "object" && module.exports) module.exports = factory(require("./drill-kit.js"), require("./drill-lexicon.js"));
	else root.DesirePractice = factory(root.DrillKit, root.DrillLexicon);
})(typeof globalThis === "object" ? globalThis : this, function(k,lex) {
	"use strict";
	const unit="desire",version=k.version(unit);
	const hopes = [
		["雨が降る","雨が降らない","it rains","あめがふる","あめがふらない"],
		["天気がいい","天気がよくない","the weather is good","てんきがいい","てんきがよくない"],
		["部屋が静かだ","部屋が静かではない","the room is quiet","へやがしずかだ","へやがしずかではない"],
		["店が開いている","店が閉まっている","the shop is open","みせがあいている","みせがしまっている"],
		["切符が買える","切符が買えない","you can buy a ticket","きっぷがかえる","きっぷがかえない"],
		["席がある","席がない","there is a seat available","せきがある","せきがない"],
		["仕事が見つかる","仕事が見つからない","you find a job","しごとがみつかる","しごとがみつからない"],
		["電車に間に合う","電車に間に合わない","you catch the train in time","でんしゃにまにあう","でんしゃにまにあわない"]
	];
	const readings=[...lex.readings,...hopes.flatMap(([a,b,,ka,kb])=>[[a,ka],[b,kb]])];
	const displayReadings=[...lex.readings,["雨","あめ"],["降る","ふる"],["降らない","ふらない"],["天気","てんき"],["部屋","へや"],["静か","しずか"],["店","みせ"],["開いて","あいて"],["閉まって","しまって"],["買える","かえる"],["買えない","かえない"],["席","せき"],["仕事","しごと"],["見つかる","みつかる"],["見つからない","みつからない"],["電車","でんしゃ"],["間に合う","まにあう"],["間に合わない","まにあわない"]];
	function desire(a,positive=true) { return `${a.stem}${positive?"たいです":"たくないです"}`; }
	function create({aliases=[]}={}) {
		function buildBank() {
			const bank=[];
			for(const a of lex.actions) for(const [v,positive] of [true,false].entries()) {
				const forms=[desire(a,positive),`${a.stem}${positive?"たい":"たくない"}`, ...(!positive?[`${a.stem}たくありません`]:[])];
				const opts=[desire(a,true),desire(a,false),`${a.stem}ます`,`${a.stem}ません`];
				bank.push(k.cloze(unit,"personal-wish","personal",a,v,`Speak for yourself: you ${positive?"want":"do not want"} to ${a.actionEn}.`,[{label:"Your wish",segments:[a.prefix,k.gap("Desire",forms,opts),"。"]}],"たい expresses a wish, not an action already performed or a settled plan. Its negative is たくない.",{positive},"Express your wish, not a promise to act."));
				bank.push(k.choice(unit,"wish-not-event","scope",a,v,`私は${a.prefix}${desire(a,positive)}。`,["I want to do it; this does not establish that I did it.","I do not want to do it; this does not establish whether I did it.","I have already done it.","Someone has forbidden me from doing it."],positive?"I want to do it; this does not establish that I did it.":"I do not want to do it; this does not establish whether I did it.","A wish is different from an event, ability, permission, or obligation.",{positive}));
				bank.push(k.cloze(unit,"reported-wish","reported",a,v,`Yamada said, “I ${positive?"want":"do not want"} to ${a.actionEn}.” Report those words, not your own wish.`,[{label:"Report",segments:["山田さんは「",a.prefix,k.gap("Quoted wish",forms,opts),"」と言いました。"]}],"Inside a direct quotation, たい belongs to the quoted speaker. Third-person wishes are not restricted to たがる: quoting their own words is natural.",{positive},"Complete Yamada's quoted words."));
				if(positive) {
					bank.push(k.cloze(unit,"observed-wish","observed",a,v,`Your brother repeatedly asks to ${a.actionEn} and keeps preparing to do it. Describe the desire he is showing now.`,[{label:"Observation",segments:["弟は",a.prefix,k.gap("Observed wish",[`${a.stem}たがっています`,`${a.stem}たがっている`],[`${a.stem}たがっています`,`${a.te}います`,`${a.stem}たくありません`]),"。"]}],"たがっている reports outward signs of another person's current desire. It does not say that the action itself is in progress.",{positive},"Report his visible desire, not an action in progress."));
				}
			}
			for(const a of lex.actions.filter(a=>a.domain!=="write")) for(const [v,observed] of [false,true].entries()) {
				const answer=observed?"をほしがっています":"がほしいです";
				bank.push(k.cloze(unit,"wanted-thing","things",{...a,id:`thing:${a.noun}`},v,observed?`Your sister keeps pointing to ${a.en} and asking to have it. Describe her visible desire.`:`You want ${a.en} itself, not merely to use or buy it.`,[{label:"Wish",segments:[observed?"姉は":"私は",a.noun,k.gap("Wish",[answer,observed?"をほしがっている":"がほしい"],["がほしいです","をほしがっています","を買いました"]),"。"]}],observed?"Noun + をほしがっている reports the outward desire for an object.":"Noun + がほしい expresses the speaker's desire for the object. It does not assert a purchase.",{observed}));
			}
			for(const [i,[yes,no,en]] of hopes.entries()) for(const [v,positive] of [true,false].entries()) {
				const a={id:`hope:${i}`,domain:"outcome",words:[yes]};
				bank.push(k.cloze(unit,"hope-outcome","hope",a,v,`You are hoping that ${positive?en:`it will NOT be the case that ${en}`}. The outcome is not known yet.`,[{label:"Hope",segments:[k.gap("Hoped-for situation",[positive?yes:no],[yes,no]),k.gap("Ending",["といいです","といいですね","といいな"],["といいです","はずです","そうです"]),"。"]}],"といい expresses a hoped-for outcome, not a prediction or something you have heard. Preserve whether the desired outcome is positive or negative.",{positive},"Complete the hope without claiming the outcome is certain."));
			}
			return bank;
		}
		return k.engine(buildBank,readings,aliases);
	}
	return {version,create,readings,displayReadings,desire,hopes,selectQueue:(bank,count,options)=>k.select(unit,bank,count,options)};
});
