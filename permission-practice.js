(function(root, factory) {
	if (typeof module === "object" && module.exports) module.exports = factory(require("./drill-kit.js"), require("./drill-lexicon.js"));
	else root.PermissionPractice = factory(root.DrillKit, root.DrillLexicon);
})(typeof globalThis === "object" ? globalThis : this, function(k, lex) {
	"use strict";
	const unit = "permission", version = k.version(unit), readings = [...lex.readings,["広","ひろ"],["新し","あたらし"],["近","ちか"],["安","やす"],["静か","しずか"],["便利","べんり"],["学生","がくせい"],["会員","かいいん"]];
	const states = ["allowed", "forbidden", "unnecessary", "required"];
	const meaning = {
		allowed: "Doing it is permitted.", forbidden: "Doing it is forbidden.",
		unnecessary: "Not doing it is acceptable.", required: "Doing it is required."
	};
	function forms(a, state) {
		const n = a.nai.slice(0,-1);
		return {
			allowed: [`${a.te}もいいです`,`${a.te}もいい`],
			forbidden: [`${a.te}はいけません`,`${a.te}はいけない`,`${a.te}はだめです`],
			unnecessary: [`${n}くてもいいです`,`${n}くてもいい`],
			required: [`${n}ければなりません`,`${n}ければならない`,`${n}くてはいけません`,`${n}くてはいけない`]
		}[state];
	}
	function create({ aliases = [] } = {}) {
		function buildBank() {
			const bank = [];
			for (const a of lex.actions) for (const [v,state] of states.entries()) {
				const options = states.map(s => forms(a,s)[0]);
				const explanation = `${meaning[state]} Permission allows an action; obligation requires it. なくてもいい permits not doing it, while てはいけない forbids doing it.`;
				const row = { label: "Message", segments: [a.prefix,k.gap("Rule",forms(a,state),options),"。"] };
				bank.push(k.cloze(unit,"rule-report","four-meanings",a,v,`You are explaining the rule for this action: ${a.actionEn}.\n${meaning[state]}`,[row],explanation,{ state },"Convey exactly the stated rule."));
				bank.push(k.choice(unit,"interpret-rule","scope",a,v,`${a.prefix}${forms(a,state)[0]}。`,states.map(s=>meaning[s]),meaning[state],explanation,{state}));
				const other = states[(v+2)%4];
				bank.push(k.cloze(unit,"change-rule","rule-change",a,v,`Old notice: ${a.prefix}${forms(a,other)[0]}。\nThe new notice must say: ${meaning[state]}`,[row],"The new instruction replaces the old one. " + explanation,{state,old:other},"Complete the NEW notice."));
				const asked=state==="required"||state==="unnecessary"?"required":"allowed";
				const yes=state==="required"||state==="allowed";
				bank.push(k.cloze(unit,"answer-rule-question","reply",a,v,`A：${a.prefix}${forms(a,asked)[0]}か。`,
					[{label:"B's answer",segments:[yes?"はい、":"いいえ、",a.prefix,k.gap("Reply",forms(a,state),options),"。"]}],"A no-answer to 'must I?' removes necessity; a no-answer to 'may I?' denies permission. " + explanation,{state,asked,yes},"Complete B's reply consistently with はい or いいえ."));
			}
			const conditions = [
				["広い","広","spacious","ひろ"],["新しい","新し","new","あたらし"],["近い","近","nearby","ちか"],["安い","安","cheap","やす"],
				["静か","静か","quiet","しずか","na"],["便利","便利","convenient","べんり","na"],["学生","学生","a student","がくせい","noun"],["会員","会員","a member","かいいん","noun"]
			];
			for (const [word,stem,en,kana,type="i"] of conditions) for (const [v,required] of [false,true].entries()) {
				const prefix = type === "i" ? stem + "く" : stem + "で";
				const opts = [prefix+"なければなりません",prefix+"なくてもいいです",type === "i" ? stem+"くてもいいです" : stem+"でもいいです"];
				const scene = {id:`condition:${word}`,domain:type,words:[word]};
				bank.push(k.cloze(unit,"condition-rule","conditions",scene,v,`The condition is “${en}.” ${required ? "It is a requirement." : "It is NOT a requirement; failing to meet it is acceptable."}`,
					[{label:"Condition",segments:[k.gap("Condition",[opts[required?0:1]],opts),"。"]}],"Necessity and lack of necessity also apply to qualities and identities. Nouns and na-adjectives use で; i-adjectives use く before this negative construction.",{required,word}));
			}
			return bank;
		}
		return k.engine(buildBank, readings,aliases);
	}
	return {version,create,readings,forms,states,meaning,selectQueue:(bank,count,options)=>k.select(unit,bank,count,options)};
});
