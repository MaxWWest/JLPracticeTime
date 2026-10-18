/* Additional Boss situations. Each evaluator derives the answer from recorded facts. */
(function (root, factory) {
	if (typeof module === "object" && module.exports) module.exports = factory(require("./comparison-practice.js"));
	else root.BossScenarios = factory(root.ComparisonPractice);
})(typeof globalThis === "object" ? globalThis : this, function (comparison) {
	"use strict";
	const definitions = [
		["suitcase-capacity", "comparison", "ability", "capacity versus weight", f => ({ larger: f.capacity.red > f.capacity.blue ? "red" : "blue", fits: f.capacity.red >= f.required })],
		["commute-total", "comparison", "time", "whole journey versus one segment", f => ({ faster: f.trainRide + f.trainWalk < f.busRide + f.busWalk ? "train" : "bus", onTime: f.trainRide + f.trainWalk <= f.remaining })],
		["room-perspective", "comparison", "experience", "different people's evaluations", f => ({ quieter: f.satoQuiet, visited: f.satoVisited })],
		["incomplete-ranking", "comparison", "invitation", "partial order versus an agreed plan", f => ({ relation: f.link, agreed: f.accepted })],
		["overlapping-work", "time", "ability", "simultaneous actions and their actors", f => ({ simultaneous: f.writer === f.reader && f.overlap, capable: f.independent })],
		["delivery-cutoff", "time", "ability", "dispatch deadline versus arrival", f => ({ accepted: f.handedIn <= f.cutoff, arrives: f.arrivalDay === "today" })],
		["progress-correction", "time", "invitation", "two action stages after an old message", f => ({ packing: f.packed ? "after" : "during", departure: f.departNow ? "before" : "tomorrow" })],
		["reservation-limits", "time", "ability", "two assignments with different time commitments", f => ({ cleaning: f.continuousClean ? "duration" : "deadline", reception: f.continuousDesk ? "duration" : "deadline" })],
		["declined-help", "invitation", "ability", "polite reply versus accepted help", f => ({ helper: f.accepted ? "sato" : "tanaka", capable: f.canCarry })],
		["pending-invitation", "invitation", "time", "counterproposal versus confirmed agreement", f => ({ day: f.newDay, confirmed: f.confirmed })],
		["tool-offer", "invitation", "ability", "lending a tool versus doing the task", f => ({ actor: f.helperActs ? "sato" : "tanaka", tool: f.canLend ? "sato" : "tanaka" })],
		["partial-acceptance", "invitation", "experience", "accepting only part of an invitation", f => ({ lunch: f.lunch, museum: f.museum })],
		["training-update", "ability", "experience", "acquired skill versus a completed job", f => ({ capable: f.passedSolo, done: f.todayDone })],
		["alternative-machine", "ability", "comparison", "one broken machine versus another option", f => ({ possible: f.alternativeWorking, cheaper: f.schoolCost < f.shopCost ? "school" : "shop" })],
		["voice-and-language", "ability", "time", "audibility versus understanding a language", f => ({ audible: f.sound, understands: f.knowsLanguage })],
		["ingredients-now", "ability", "comparison", "cooking skill versus today's ingredients", f => ({ now: f.ingredientsReady, cheaper: f.homeCost < f.shopCost ? "home" : "shop" })],
		["single-trip", "experience", "invitation", "one past event versus a regular habit", f => ({ regular: f.repeat, accepted: f.accepted })],
		["specific-machine", "experience", "ability", "general skill versus this model", f => ({ tried: f.usedThis, capable: f.canOperate })],
		["reported-visit", "experience", "invitation", "whose past event was reported", f => ({ narrator: f.narratorWent, accepted: f.accepted })],
		["bounded-diary", "experience", "time", "a limited diary versus lifetime history", f => ({ pattern: !f.days.length ? "plan" : f.days.every(Boolean) ? "all" : f.days.some(Boolean) ? "some" : "none" })]
	];
	const cases = definitions.map(([id, unit, secondary, pattern]) => ({ id, unit, secondary, pattern, format: "Read the situation" }));
	const evaluators = new Map(definitions.map(([id, , , , evaluate]) => [id, evaluate]));
	const conclusion = (id, facts) => evaluators.get(id)?.(facts);
	const readings = [["東の部屋", "ひがしのへや"], ["西の部屋", "にしのへや"], ["会社", "かいしゃ"], ["着き", "つき"], ["荷物", "にもつ"], ["詰め", "つめ"], ["出発", "しゅっぱつ"], ["掃除", "そうじ"], ["仕事", "しごと"], ["十五", "じゅうご"], ["使った", "つかった"], ["使う", "つかう"], ["使え", "つかえ"], ["作る", "つくる"], ["作れ", "つくれ"], ["行き", "いき"], ["行く", "いく"], ["行った", "いった"], ["一人", "ひとり"], ["二人", "ふたり"], ["型", "かた"], ["今", "いま"], ["家", "いえ"], ["部屋", "へや"], ["早く", "はやく"], ["明日", "あした"],
		["宅配便", "たくはいびん"], ["当日", "とうじつ"], ["翌日", "よくじつ"], ["直接", "ちょくせつ"], ["手元", "てもと"], ["印刷", "いんさつ"], ["点検", "てんけん"], ["理解", "りかい"], ["締め切り", "しめきり"], ["割引", "わりびき"], ["割合", "わりあい"], ["判断", "はんだん"], ["録音", "ろくおん"], ["台車", "だいしゃ"], ["手続き", "てつづき"], ["提出", "ていしゅつ"], ["音量", "おんりょう"], ["言語", "げんご"], ["内容", "ないよう"], ["展示", "てんじ"], ["記録", "きろく"], ["以前", "いぜん"], ["実際", "じっさい"], ["想像", "そうぞう"], ["見学", "けんがく"]];
	const pairs = (a, b) => a.flatMap(x => b.map(y => [x, y]));
	const bools = [true, false];
	const choice = (claims, ja, en) => ({ claims, ja, en });
	const record = (facts, prompt, promptEnglish, subprompt, explanation, choices, conflicts, words = [], writing) => ({ facts, content: { prompt, promptEnglish, subprompt, explanation, writing }, choices, conflicts, words });
	const sentence = (subprompt, accepted, vocabulary) => ({ subprompt, accepted: [...new Set(accepted.flatMap(text => [
		text, text.replace(/ことがあります。$/, "ことがある。"), text.replace(/ことがありません。$/, "ことがないです。"), text.replace(/ことがありません。$/, "ことがない。"),
		text.replace(/(使え|作れ)ます。$/, "$1る。"), text.replace(/(使え|作れ)ません。$/, "$1ないです。"), text.replace(/(使え|作れ)ません。$/, "$1ない。")
	]))], vocabulary, includeChoiceAnswer: false });
	function build(id, v, { action }) {
		const x = v % 2 === 0, y = v < 2;
		switch (id) {
			case "suitcase-capacity": {
				const capacity = { red: x ? 40 : 20, blue: x ? 20 : 40 }, required = y ? 15 : 45, name = { red: "赤いかばん", blue: "青いかばん" };
				return record({ capacity, required },
					`旅行の荷物を入れるかばんを選んでいます。赤いかばんも青いかばんも、何も入れなければ重さは二キロです。\n中に入る量は、赤いかばんが${capacity.red}リットル、青いかばんが${capacity.blue}リットルです。今回の荷物は全部で${required}リットルで、どちらのかばんにも合う形です。荷物を二つに分けることはできません。`,
					`You need a bag for a trip. Both empty bags weigh two kilograms, but the red bag holds ${capacity.red} litres and the blue one ${capacity.blue}. Your luggage takes ${required} litres and is shaped to fit either bag if there is enough capacity. It cannot be divided.`,
					"Which statement compares capacity and correctly checks the red bag?",
					"Equal empty weight does not imply equal capacity. Compare how much each bag holds, then check the red bag against the actual load.",
					pairs(["red", "blue"], bools).map(([larger, fits]) => choice({ larger, fits }, `${name[larger]}のほうが、もう一つのかばんよりたくさん入ります。今回の荷物を全部、赤いかばんに入れることが${fits ? "できます" : "できません"}。`, `The ${larger} bag holds more; the entire load ${fits ? "can" : "cannot"} fit in the red bag.`)),
					{ larger: `Capacity is red ${capacity.red} L versus blue ${capacity.blue} L; the two-kilogram weight is not the comparison being asked.`, fits: `The red bag holds ${capacity.red} L and this load needs ${required} L. The luggage cannot be split.` }, Object.values(name));
			}
			case "commute-total": {
				const f = { trainRide: 15, trainWalk: x ? 5 : 25, busRide: 25, busWalk: 5, remaining: y ? 45 : 18 };
					const faster = x ? "train" : "bus", modes = { train: "電車", bus: "バス" }, other = x ? "バス" : "電車";
				return record(f,
					`家から会社へ行きます。電車に乗っている時間は十五分ですが、駅までと駅から歩く時間が合わせて${f.trainWalk}分かかります。バスに乗る時間は二十五分で、歩く時間は全部で五分です。\nどちらも今すぐ出発でき、待つ時間はありません。会議が始まるまで、あと${f.remaining}分です。開始時刻には会社に着いていなければなりません。`,
					`From home to work, the train ride takes 15 minutes plus ${f.trainWalk} minutes of walking in total. The bus takes 25 minutes plus five minutes of walking. Both routes can start now with no waiting. The meeting starts in ${f.remaining} minutes; you must arrive by then.`,
					"Which message compares the complete journeys and checks the train route against the meeting time?",
					`Include walking: train ${15 + f.trainWalk} minutes, bus 30. A shorter ride alone does not mean a shorter journey. Arrival must be no later than the meeting start.`,
					pairs(["train", "bus"], bools).map(([route, onTime]) => choice({ faster: route, onTime }, `${modes[route]}で行くほうが、もう一つの行き方より早く会社に着きます。電車なら会議が始まるまでに${onTime ? "着けます" : "着けません"}。`, `The ${route} route reaches work sooner overall; the train ${onTime ? "will" : "will not"} get you there by the meeting.`)),
					{ faster: "Compare the ride plus all walking, not just the time spent on the vehicle.", onTime: `The train journey takes ${15 + f.trainWalk} minutes, but only ${f.remaining} minutes remain.` }, ["電車", "バス", "会社"],
					sentence("Compare the two complete journeys in one sentence, stating which reaches work sooner. Include both ways of travelling.", [
						`${modes[faster]}で行くほうが${other}で行くより早く会社に着きます。`, `${other}で行くより${modes[faster]}で行くほうが早く会社に着きます。`, `${modes[faster]}で行ったほうが${other}で行くより早く会社に着きます。`, `${other}で行くほうは${modes[faster]}で行くほど早く会社に着きません。`
					], "電車 (train) / バス (bus) / 会社に着く (arrive at work) / 早く (sooner)"));
			}
			case "room-perspective": {
				const satoQuiet = x ? "east" : "west", name = { east: "東の部屋", west: "西の部屋" }, quiet = name[satoQuiet], louder = name[x ? "west" : "east"];
				const comparisons = ["hou", "hodo", "topic-yori"].flatMap(form => comparison.sentenceAnswers({ ja: quiet, type: "noun" }, { ja: louder, type: "noun" }, { adj: "静か", neg: "静かでは" }, form));
				return record({ satoQuiet, satoVisited: y },
					`二つの部屋について、田中さんと佐藤さんの意見を聞きました。田中さんは、東の部屋のほうが西の部屋より静かだと言います。\n佐藤さんは「私には、${louder}は${quiet}ほど静かではありません」と言いました。佐藤さんは${y ? "前に両方の部屋で勉強しました" : "まだどちらの部屋にも入っていません。録音された音を聞いて判断しました"}。二人の話を混ぜないでメモします。`,
					`Tanaka considers the east room quieter. Sato says the ${x ? "west" : "east"} room is not as quiet as the ${satoQuiet} room to Sato. Sato ${y ? "has studied in both rooms before" : "has never entered either room and judged from sound recordings"}. Keep each person's account separate.`,
					"Which note preserves Sato's view and what Sato has actually done?",
					"An evaluation belongs to its speaker. Hearing a recording can support an opinion but does not establish a visit to either room.",
					pairs(["east", "west"], bools).map(([quieter, visited]) => choice({ quieter, visited }, `佐藤さんには${name[quieter]}のほうが静かで、佐藤さんは両方の部屋に入ったことが${visited ? "あります" : "ありません"}。`, `To Sato, the ${quieter} room is quieter, and Sato ${visited ? "has entered both rooms" : "has never entered either room"}.`)),
					{ quieter: `Sato calls ${louder} less quiet than ${quiet}; Tanaka's opinion cannot replace Sato's.`, visited: y ? "Sato explicitly studied in both rooms, so a visit is established." : "Sato explicitly judged recordings without entering either room." }, Object.values(name),
					sentence("Report only Sato's comparison in one sentence. Name Sato and both rooms, retaining the quietness comparison.", ["佐藤さんには", "佐藤さんにとって", "佐藤さんにとっては"].flatMap(prefix => comparisons.map(text => prefix + text)), "佐藤さん (Sato) / 東の部屋 (east room) / 西の部屋 (west room) / 静か (quiet)"));
			}
			case "incomplete-ranking": {
				const link = x ? "unknown" : "a-cheaper";
				return record({ link, accepted: y },
					`旅行の切符を調べています。Aの切符はBより安く、Cの切符もBほど高くありません。${x ? "AとCの値段はまだ分かりません。割引の割合も書いてありません" : "さらに調べると、AはCより千円安いと分かりました"}。\n田中：「Aを買いませんか。」\n山田：「${y ? "そうですね。Aを買いましょう" : "もう少し調べたいので、まだ決めないでください"}。」`,
					`Ticket A is cheaper than B, and C is also cheaper than B. ${x ? "No prices or discount rates establish how A compares with C." : "Further research shows A is 1,000 yen cheaper than C."} Tanaka proposes A. Yamada ${y ? "agrees to buy A" : "asks to research more before deciding"}.`,
					"What can you conclude about A versus C and the decision to buy A?",
					"Two items being cheaper than B does not rank those two against each other. Separately, a proposal becomes an agreement only when the reply accepts it.",
					pairs(["unknown", "a-cheaper"], bools).map(([relation, agreed]) => choice({ relation, agreed }, `${relation === "unknown" ? "AとCはどちらが安いか、まだ分かりません" : "CはAほど安くありません"}。二人はAを買うことに${agreed ? "しました" : "まだしていません"}。`, `${relation === "unknown" ? "A versus C is still unknown" : "A is cheaper than C"}; the two ${agreed ? "have" : "have not"} agreed to buy A.`)),
					{ relation: x ? "Both prices are below B, with no evidence ordering A and C. Unknown does not mean equal." : "The later information explicitly places A below C in price.", agreed: y ? "Yamada explicitly agrees to buy A." : "Yamada explicitly asks not to decide yet; Tanaka's invitation is not an agreement." }, ["切符"]);
			}
			case "overlapping-work": {
				const writer = "田中", reader = x ? "田中" : "山田";
				return record({ writer, reader, overlap: true, independent: y },
					`十時から十時十分まで、田中さんがパソコンにメモを書きました。同じ十分間、${reader}さんが説明書を声に出して読みました。\n${x ? "田中さんは一人で、読むことと書くことを同時に続けました" : "田中さんはメモを書くことだけ、山田さんは読むことだけを担当しました"}。\n田中さんは${y ? "説明書なしでも一人で機械を使えます" : "説明書を読んでも、まだ一人では機械を使えません"}。`,
					`From 10:00 to 10:10 Tanaka writes notes, while ${x ? "Tanaka also reads the instructions aloud, doing both at once" : "Yamada reads aloud; each person performs only their own task"}. Despite this record, Tanaka ${y ? "can operate the machine alone without instructions" : "still cannot operate the machine independently"}.`,
					"Which report correctly describes Tanaka's actions and current ability?",
					"Matching times do not make two people's actions one person's simultaneous actions. The separate statement about independent operation controls the ability claim.",
					pairs(bools, bools).map(([simultaneous, capable]) => choice({ simultaneous, capable }, `${simultaneous ? "田中さんは説明書を読みながらメモを書きました" : "山田さんが説明書を読んでいる間、田中さんはメモを書きました"}。田中さんは一人で機械を使うことが${capable ? "できます" : "できません"}。`, `${simultaneous ? "Tanaka wrote notes while also reading aloud" : "Tanaka wrote notes while Yamada read aloud"}; Tanaka ${capable ? "can" : "cannot"} operate the machine independently.`)),
					{ simultaneous: x ? "Tanaka performed both actions at once; Yamada was not the reader." : "Yamada read and Tanaka wrote. A single-subject simultaneous-action report would assign both to Tanaka.", capable: `The final sentence explicitly says Tanaka ${y ? "can" : "cannot"} operate the machine independently.` }, ["説明書", "メモ", "機械"]);
			}
			case "delivery-cutoff": {
				const f = { handedIn: x ? 14 : 16, cutoff: 15, arrivalDay: y ? "today" : "tomorrow" };
				return record(f,
					`宅配便で荷物を送ります。受付の人は「当日の便に載せる荷物は十五時までに渡してください。それより後は翌日の便です」と言いました。\n荷物を渡したのは${f.handedIn}時でした。その後、届け先を近くの店に変え、店の人が直接取りに来ることになりました。店の人は「${y ? "今日" : "明日"}の十八時に店に持ち帰ります」と約束しました。宅配便の条件と、最後の受け取り方を区別します。`,
					`The courier accepts parcels for today's run only if handed in by 15:00; yours was handed in at ${f.handedIn}:00. Afterwards the destination changed to a nearby shop whose employee will collect it directly and bring it to the shop at 18:00 ${f.arrivalDay}. Distinguish the courier cutoff from the final collection arrangement.`,
					"Which update correctly checks the original cutoff and the final arrival day?",
					"Meeting a dispatch cutoff and arriving on a particular day are different claims. The final direct-collection arrangement, not the original courier schedule, determines arrival.",
					pairs(bools, bools).map(([accepted, arrives]) => choice({ accepted, arrives }, `宅配便の締め切りには${accepted ? "間に合いました" : "間に合いませんでした"}。最後の約束では、店の人は${arrives ? "今日" : "明日"}荷物を持ち帰れます。`, `The parcel ${accepted ? "met" : "missed"} the courier cutoff; under the final arrangement the employee can bring it to the shop ${arrives ? "today" : "tomorrow"}.`)),
					{ accepted: `The hand-in time is ${f.handedIn}:00 and the cutoff is 15:00; the later collection change does not rewrite that fact.`, arrives: `The shop employee explicitly promised direct collection and arrival ${f.arrivalDay}, independently of the courier service.` }, ["荷物", "店"]);
			}
			case "progress-correction": {
				const pack = x ? "荷物を詰めたところです" : "荷物を詰めているところです", leave = y ? "出発するところです" : "出発するのは明日です";
				return record({ packed: x, departNow: y },
					`三十分前、友だちに「これから旅行の荷物を詰めます」と送りました。今は${x ? "最後の物を入れて、たった今かばんを閉めました" : "まだ半分しか入っていなくて、かばんに物を入れ続けています"}。\n友だち：「今から一緒に駅へ行きませんか。」\n${y ? "あなた：いいですね。荷物はこのまま家に置いて、今すぐ駅へ向かいます" : "あなた：今日は出かけません。駅へ向かうのは明日の朝です"}。今の状況を家族に伝えます。`,
					`Thirty minutes ago you said you would start packing. Now ${x ? "you have just put in the last item and closed the bag" : "you are halfway through and still packing"}. A friend invites you to the station. You ${y ? "accept and will leave immediately, leaving the bag at home" : "say you will not go out today and will leave tomorrow morning"}. Update your family now.`,
					"Which update matches both the packing now and the departure arrangement?",
					"An earlier plan to begin packing does not describe its current stage. Departure is a separate action, determined by the response to the invitation.",
					pairs(["after", "during"], ["before", "tomorrow"]).map(([packing, departure]) => choice({ packing, departure }, `荷物を${packing === "after" ? "詰めた" : "詰めている"}ところで、${departure === "before" ? "今から出発するところです" : "出発するのは明日です"}。`, `I ${packing === "after" ? "have just finished packing" : "am still packing"}, and ${departure === "before" ? "am just about to leave" : "will leave tomorrow"}.`)),
					{ packing: `The current record is ${x ? "the bag just closed with everything inside" : "packing still in progress"}, not the thirty-minute-old message.`, departure: y ? "You accepted going now and explicitly said you would leave immediately." : "You explicitly declined going today and said departure is tomorrow." }, ["荷物", "駅"],
					sentence("Write one update covering the current packing stage and when you are leaving. Connect the two parts in one sentence.", [
						`${pack.replace(/です$/, "で")}、${y ? "今から" : ""}${leave}。`, `${pack.replace(/です$/, "が")}、${y ? "今から" : ""}${leave}。`
					], "荷物を詰める・詰めて・詰めた (pack) / 出発する (leave)"));
			}
			case "reservation-limits": {
				const clean = x ? "まで" : "までに", desk = y ? "まで" : "までに";
				return record({ continuousClean: x, continuousDesk: y },
					`今日、受付と会議室の仕事を担当します。どちらの仕事も一人でできますが、時間の条件が違います。\n受付の仕事は${y ? "十四時から十五時まで続け、十五時に次の人と交代します。残った分は次の人がします" : "十五時には全部終わっている必要があります。十四時半に終えたら、別の仕事に移ってかまいません"}。\n会議室は十六時から掃除します。${x ? "十七時まで掃除を続けます。全部は終わらないので、残りは明日します" : "十七時には全部きれいになっている必要があります。早く終わったら帰れます"}。`,
					`You can independently handle both reception and meeting-room cleaning. Reception ${y ? "continues from 14:00 until a 15:00 handover, leaving remaining work to the next person" : "must be complete by 15:00; finishing at 14:30 permits switching to other work"}. Cleaning begins at 16:00 and ${x ? "continues until 17:00, leaving some for tomorrow" : "must be complete by 17:00; an early finish permits going home"}.`,
					"Which note preserves the required commitment for each job?",
					"Check each job separately: an activity maintained to a handover time differs from a job that must already be complete by a deadline. The two jobs need not use the same construction.",
					pairs(["duration", "deadline"], ["duration", "deadline"]).map(([cleaning, reception]) => choice({ cleaning, reception }, `会議室を十七時${cleaning === "duration" ? "まで" : "までに"}掃除し、受付の仕事を十五時${reception === "duration" ? "まで" : "までに"}します。`, `I will ${cleaning === "duration" ? "continue cleaning the meeting room until" : "complete the meeting-room cleaning by"} 17:00 and ${reception === "duration" ? "continue reception work until" : "complete reception work by"} 15:00.`)),
					{ cleaning: x ? "Cleaning explicitly continues to 17:00 with some left for tomorrow, so completion by 17:00 is not promised." : "The whole room must already be clean at 17:00, and an early finish is allowed.", reception: y ? "Reception work continues to the handover, with unfinished work passed on; it is a duration, not a completion promise." : "Reception work must be complete by 15:00, and switching away earlier is explicitly allowed." }, ["会議室", "受付", "掃除"],
					sentence("Write one note covering both jobs and their time requirements. Name each job and its time.", [
						`会議室を十七時${clean}掃除し、受付の仕事を十五時${desk}します。`, `受付の仕事を十五時${desk}して、会議室を十七時${clean}掃除します。`
					], "会議室を掃除する (clean the meeting room) / 受付の仕事をする (work at reception)"));
			}
			case "declined-help": {
				const a = action("moving");
				return record({ accepted: x, canCarry: y },
					`田中さんが${a.word}を運ぼうとしています。佐藤さんは${y ? "一人で運べる重さだと確認しました" : "一人では重すぎますが、台車を使えば運べます"}。\n佐藤：「私が運びましょうか。」\n田中：「${x ? "助かります。では、お願いします。私はここで待ちます" : "大丈夫です。自分で運びますから、佐藤さんは先に行ってください"}。」\nこの後、二人が同時に運ぶ予定はありません。`,
					`Tanaka is about to carry a ${a.en}. Sato ${y ? "has checked they can carry it alone" : "cannot carry it unaided but can move it with a trolley"}. Sato offers help. Tanaka ${x ? "accepts and will wait" : "politely declines and says Tanaka will do it, asking Sato to go ahead"}. They will not carry it together.`,
					"Which note correctly distinguishes the agreed helper from unaided ability?",
					"The reply decides whether an offer is accepted. Having the ability to help does not itself make the helper responsible, and using a trolley is not unaided carrying.",
					pairs(["sato", "tanaka"], bools).map(([helper, capable]) => choice({ helper, capable }, `運ぶことになったのは${helper === "sato" ? "佐藤" : "田中"}さんです。佐藤さんは台車なしで一人で運ぶことが${capable ? "できます" : "できません"}。`, `${helper === "sato" ? "Sato" : "Tanaka"} will move it; Sato ${capable ? "can" : "cannot"} carry it alone without a trolley.`)),
					{ helper: x ? "Tanaka explicitly accepts Sato's offer and says Tanaka will wait." : "Tanaka says they will do it themselves and asks Sato to go ahead, declining the offer.", capable: `Sato ${y ? "can carry it unaided" : "needs a trolley"}; the acceptance decision does not change that ability.` }, [a.word, a.verb]);
			}
			case "pending-invitation": {
				const a = action("outing"), newDay = x ? "土曜日" : "日曜日", dayEn = x ? "Saturday" : "Sunday";
				return record({ newDay, confirmed: y },
					`田中：金曜日、一緒に${a.stem}ませんか。\n山田：金曜日は仕事です。${newDay}なら空いています。${newDay}にしませんか。\n田中：${y ? `では、${newDay}に行きましょう。十時に駅で会いましょう` : "まだ予定を確認していません。明日の昼までに返事をします。今はまだ約束できません"}。\n山田：分かりました。\n友だちが「二人の予定は決まった？」と聞いています。`,
					`Tanaka invites Yamada to the ${a.en} on Friday. Yamada is working and counterproposes ${dayEn}. Tanaka ${y ? `agrees to go on ${dayEn} and meet at ten` : "has not checked their schedule, promises a reply by tomorrow noon, and says they cannot commit yet"}. A friend asks whether the plan is settled.`,
					"Which report preserves the proposed date and the state of the agreement?",
					"A counterproposal names a possible replacement date. A promise to reply by a deadline is not yet an agreement to attend.",
					pairs(["土曜日", "日曜日"], bools).map(([day, confirmed]) => choice({ day, confirmed }, `山田さんは${day}にしませんかと聞きました。二人の予定は${confirmed ? "もう決まりました" : "まだ決まっていません"}。`, `Yamada proposed ${day === "土曜日" ? "Saturday" : "Sunday"}; the shared plan ${confirmed ? "is settled" : "is still unconfirmed"}.`)),
					{ day: `Yamada proposed ${dayEn}, replacing Friday; the other weekend day is not mentioned as the proposal.`, confirmed: y ? "Tanaka accepted the new date and set a meeting time, confirming the plan." : "Tanaka explicitly cannot commit yet. A deadline for a later reply does not confirm attendance." }, [a.word, a.verb],
					sentence("Write Yamada's replacement invitation in one question. Include the proposed day, destination, and doing it together.", [
						`${newDay}に一緒に${a.stem}ませんか。`, `${newDay}、一緒に${a.stem}ませんか。`, `一緒に${newDay}に${a.stem}ませんか。`, `${newDay}に一緒に${a.stem}ましょうか。`
					], `${a.word} (${a.en}) / 行く・行き (go) / 一緒に (together)`));
			}
			case "tool-offer": {
				const a = action("equipment");
				return record({ helperActs: x, canLend: y },
					`田中さんは${a.word}を使う作業をしなければなりません。佐藤さんは操作が得意です。佐藤さんの${a.word}は${y ? "今日使えます。田中さんの物は今日は手元にありません" : "壊れていて今日は使えません。田中さんの物なら使えます"}。\n佐藤：「${x ? "操作は私が代わりにしましょうか" : "機械の用意は手伝いますが、操作は田中さんがしてください"}。」\n田中：「はい、お願いします。${x ? "私は隣で見ています" : "操作は私がします"}。」\n使える物を一台だけ用意します。`,
					`Tanaka needs to work with a ${a.en}; Sato is skilled at operating it. Sato's machine ${y ? "works today, while Tanaka's is not available" : "is broken, while Tanaka's is usable"}. Sato ${x ? "offers to operate it instead; Tanaka accepts and will watch" : "offers help preparing equipment but asks Tanaka to operate it; Tanaka agrees"}. Only the usable owner's machine is prepared.`,
					"Which plan keeps the equipment owner separate from the person doing the work?",
					"The person offering equipment or preparation help is not necessarily the operator. The accepted proposal assigns the action; equipment condition assigns which machine to use.",
					pairs(["sato", "tanaka"], ["sato", "tanaka"]).map(([actor, tool]) => choice({ actor, tool }, `${actor === "sato" ? "佐藤" : "田中"}さんが、${tool === "sato" ? "佐藤" : "田中"}さんの${a.word}を使って作業します。`, `${actor === "sato" ? "Sato" : "Tanaka"} will do the work using ${tool === "sato" ? "Sato" : "Tanaka"}'s ${a.en}.`)),
					{ actor: `The accepted exchange explicitly assigns operation to ${x ? "Sato" : "Tanaka"}; owning or preparing a tool is a different role.`, tool: `The passage designates ${y ? "Sato's" : "Tanaka's"} machine as the one available for this task.` }, [a.word, a.verb]);
			}
			case "partial-acceptance": {
				const a = action("outing");
				return record({ lunch: x, museum: y },
					`田中：明日、昼ご飯を食べてから、一緒に${a.stem}ませんか。\n山田：そこには前に行ったことがあります。でも、今回は${y ? "もう一度見たいので、見学には参加します" : "見学はやめておきます"}。昼ご飯は${x ? "一緒に食べましょう" : "別の約束があるので、一緒には食べられません"}。\n田中：分かりました。参加するところだけ一緒にしましょう。\n山田：お願いします。`,
					`Tanaka invites Yamada to lunch followed by a visit to the ${a.en}. Yamada has been there before, ${y ? "wants to visit again" : "declines the visit this time"}, and ${x ? "accepts lunch together" : "has another commitment for lunch and declines it"}. Tanaka agrees to share only the activities Yamada accepts.`,
					"Which plan preserves the reply to each part of the invitation?",
					"Past experience does not settle whether someone wants to go again. Read the separate answers about lunch and the visit; accepting one part need not accept both.",
					pairs(bools, bools).map(([lunch, museum]) => choice({ lunch, museum }, `山田さんは昼ご飯を田中さんと${lunch ? "一緒に食べます" : "一緒には食べません"}。その後の見学には${museum ? "参加します" : "参加しません"}。`, `Yamada ${lunch ? "will" : "will not"} share lunch with Tanaka and ${museum ? "will" : "will not"} join the visit afterwards.`)),
					{ lunch: `Yamada explicitly ${x ? "accepts" : "declines"} sharing lunch; that reply is separate from the visit.`, museum: `Yamada explicitly ${y ? "wants to visit again" : "declines the visit this time"}, despite having visited before.` }, [a.word, a.verb]);
			}
			case "training-update": {
				const a = action("equipment");
				return record({ passedSolo: x, todayDone: y },
					`先月、田中さんは${a.word}を一人で使えませんでした。今週練習して、今日の最後のテストでは${x ? "先生の助けなしで全部操作できました" : "途中から先生の助けが必要でした。まだ一人では全部できません"}。\nテストとは別に、今日の仕事の資料も用意しなければなりません。資料の作業は${y ? "もう全部終わり、提出しました" : "まだ始めていません"}。今の様子を伝えます。`,
					`Last month Tanaka could not operate the ${a.en} alone. After training, today's final test ${x ? "was completed independently" : "still required help; independent operation is not yet possible"}. Separately, today's documents ${y ? "have already been finished and submitted" : "have not even been started"}. Report the present state.`,
					"Which report distinguishes current skill from today's separate work?",
					"Update ability from the latest independent test. Neither the old lack of skill nor the new training result alone tells you whether a different job was completed.",
					pairs(bools, bools).map(([capable, done]) => choice({ capable, done }, `田中さんは今、一人で${a.word}を使うことが${capable ? "できます" : "できません"}。今日の資料は${done ? "もう提出しました" : "まだ作り始めていません"}。`, `Tanaka ${capable ? "can" : "cannot"} now use the ${a.en} independently; today's documents ${done ? "have been submitted" : "have not been started"}.`)),
					{ capable: x ? "The latest test was completed without help, establishing present independent ability." : "The latest test still required help; practice does not yet establish independent ability.", done: y ? "The separate document task is explicitly finished and submitted." : "The separate document task explicitly has not begun; skill is not completion." }, [a.word, a.verb],
					sentence("Report Tanaka's current independent ability in one sentence, naming Tanaka and the equipment. Do not report the separate document task.", [
						`田中さんは今、一人で${a.word}を使うことが${x ? "できます" : "できません"}。`, `田中さんは一人で${a.word}を使うことが${x ? "できます" : "できません"}。`, `田中さんは今、一人で${a.word}を${x ? "使えます" : "使えません"}。`, `田中さんは一人で${a.word}が${x ? "使えます" : "使えません"}。`, `田中さんは一人で${a.word}を${x ? "使えます" : "使えません"}。`
					], `${a.word} (${a.en}) / 使う (use) / 一人で (independently)`));
			}
			case "alternative-machine": {
				const schoolCost = y ? 100 : 300, shopCost = y ? 200 : 150;
				return record({ alternativeWorking: x, schoolCost, shopCost },
					`自分のプリンターは壊れているので、家では資料を印刷できません。学校のプリンターは${x ? "動いていて、今から予約なしで使えます" : "点検中で、今日は使えません"}。店のプリンターは使えます。\n同じ資料を全部印刷する料金は、学校では${schoolCost}円、店では${shopCost}円です。料金表は今日も有効です。自分の技術には問題がありません。`,
					`Your own printer is broken. The school printer ${x ? "works and can be used now without booking" : "is under maintenance and unavailable today"}; the shop's printer works. Printing the same documents costs ${schoolCost} yen at school and ${shopCost} yen at the shop, under the current price list. You have the necessary skill.`,
					"Which report separates the available alternative from its listed price?",
					"A broken home printer does not make every other printer unusable. Compare the same print job's prices separately from whether the school machine works today.",
					pairs(bools, ["school", "shop"]).map(([possible, cheaper]) => choice({ possible, cheaper }, `今日は学校で印刷することが${possible ? "できます" : "できません"}。料金は${cheaper === "school" ? "学校のほうが店より" : "店のほうが学校より"}安いです。`, `Printing at school ${possible ? "is" : "is not"} possible today; the listed price is lower at the ${cheaper}.`)),
					{ possible: `The school machine is explicitly ${x ? "working and available" : "unavailable for maintenance"}; the home machine is a separate device.`, cheaper: `The same job costs ${schoolCost} yen at school and ${shopCost} yen at the shop, irrespective of today's availability.` }, ["プリンター", "資料", "学校", "店"]);
			}
			case "voice-and-language": {
				return record({ sound: x, knowsLanguage: y },
					`今、ラジオで外国語の放送を聞いています。田中さんはその言語を${y ? "長く勉強して、話の内容を理解できます" : "全く勉強したことがなく、話の内容は理解できません"}。\nさっきスピーカーの状態を確認しました。今は${x ? "音量が十分で、話す声ははっきり耳に入ります" : "音量がゼロになっていて、話す声は全く耳に入りません"}。放送はまだ続いています。`,
					`A foreign-language radio programme is still playing. Tanaka ${y ? "has studied the language and can understand it" : "has never studied it and cannot understand it"}. After checking the speaker, the current volume ${x ? "makes the voice clearly audible" : "is zero, so no voice reaches the listener"}. Distinguish sound from language ability.`,
					"Which statement distinguishes what reaches Tanaka's ears now from language comprehension?",
					"Hearing a voice and understanding its language are independent. Knowing a language does not make a muted speaker audible; clear sound does not confer language knowledge.",
					pairs(bools, bools).map(([audible, understands]) => choice({ audible, understands }, `今、放送の声は${audible ? "聞こえます" : "聞こえません"}。田中さんはその言語を理解することが${understands ? "できます" : "できません"}。`, `The voice ${audible ? "is" : "is not"} audible now; Tanaka ${understands ? "can" : "cannot"} understand that language.`)),
					{ audible: `The current speaker setting ${x ? "makes the voice clear" : "is silent"}; use the present state of the sound.`, understands: `The passage explicitly says Tanaka ${y ? "knows" : "does not know"} the language, independently of speaker volume.` }, ["放送", "声", "外国語"]);
			}
			case "ingredients-now": {
				const a = action("meal"), homeCost = y ? 300 : 800, shopCost = y ? 500 : 600;
				return record({ ingredientsReady: x, homeCost, shopCost },
					`田中さんは${a.word}を作るのが得意で、何度も一人で作っています。今日は${x ? "材料が全部そろっていて、台所も使えます" : "必要な材料が一つありません。店は閉まっていて、代わりになる物もないので、今は作れません"}。\n同じ量を作る材料の値段は全部で${homeCost}円、出来上がった物を買えば${shopCost}円です。材料の値段には、家にある物の分も含みます。`,
					`Tanaka is skilled at making ${a.en} and has done so independently many times. Today ${x ? "all ingredients and the kitchen are available" : "one essential ingredient is missing, shops are shut, and there is no substitute, so cooking now is impossible"}. All ingredients for the same amount cost ${homeCost} yen, including those already at home; buying it ready-made costs ${shopCost} yen.`,
					"Which report correctly separates today's feasibility from the total cost?",
					"Past success establishes skill, not today's access to essential ingredients. Compare total costs for the same amount; ingredients already at home still count in this stated comparison.",
					pairs(bools, ["home", "shop"]).map(([now, cheaper]) => choice({ now, cheaper }, `田中さんは今、家で${a.word}を作ることが${now ? "できます" : "できません"}。同じ量なら${cheaper === "home" ? "買うより作るほうが" : "作るより買うほうが"}安いです。`, `Tanaka ${now ? "can" : "cannot"} make it at home now; ${cheaper === "home" ? "making it" : "buying it"} is cheaper for the same amount.`)),
					{ now: x ? "All ingredients and the kitchen are available, and Tanaka has the necessary skill." : "A required ingredient is unavailable with no substitute; existing skill cannot remove that constraint.", cheaper: `Making the same amount costs ${homeCost} yen in total, versus ${shopCost} yen to buy it.` }, [a.word, a.verb],
					sentence("Report whether Tanaka can make the food at home now, naming Tanaka and the food. Limit your sentence to today's situation.", [
						`田中さんは今、家で${a.word}を作ることが${x ? "できます" : "できません"}。`, `今、田中さんは家で${a.word}を作ることが${x ? "できます" : "できません"}。`, `田中さんは今、家で${a.word}を${x ? "作れます" : "作れません"}。`, `田中さんは今、家で${a.word}が${x ? "作れます" : "作れません"}。`
					], `${a.word} (${a.en}) / 作る (make) / 今 (now) / 家で (at home)`));
			}
			case "single-trip": {
				const a = action("outing");
				return record({ repeat: x, accepted: y },
					`田中さんは、その${a.word}に${x ? "毎月一回行っています。先月も行きました" : "去年一回だけ行きました。それより前も後も行っていません"}。\n山田：「今度の日曜日、一緒に行きませんか。」\n田中：「${y ? "いいですね。一緒に行きましょう" : "その日は仕事なので、今回はやめておきます"}。」\n山田さんは、前に行ったことがあるなら毎月行っているのだろうと思っていました。`,
					`Tanaka ${x ? `visits this ${a.en} once every month and went last month too` : `visited this ${a.en} exactly once last year, never before or since`}. Yamada invites Tanaka for next Sunday and Tanaka ${y ? "accepts" : "declines because of work"}. Yamada had assumed any previous visit meant a monthly habit.`,
					"Which correction distinguishes the past pattern from the new invitation?",
					"One previous visit establishes experience but not a monthly routine. The current reply, not the previous visit pattern, determines participation next Sunday.",
					pairs(bools, bools).map(([regular, accepted]) => choice({ regular, accepted }, `田中さんは${a.word}に${regular ? "毎月行っています" : "一回だけ行ったことがあります"}。今度の日曜日は山田さんと${accepted ? "一緒に行きます" : "一緒には行きません"}。`, `Tanaka ${regular ? "goes every month" : "has visited exactly once"}; next Sunday Tanaka ${accepted ? "will" : "will not"} go with Yamada.`)),
					{ regular: x ? "Tanaka explicitly goes monthly; this is more than a single lifetime visit." : "The account explicitly limits the visit to one occasion; experience alone is not a habit.", accepted: `Tanaka ${y ? "accepted" : "declined"} this particular invitation, independently of past frequency.` }, [a.word, a.verb]);
			}
			case "specific-machine": {
				const a = action("equipment");
				return record({ usedThis: x, canOperate: y },
					`田中さんは古い${a.word}を何年も使っています。今日、学校に新しい型の${a.word}が届きました。新しい型について、田中さんは「${x ? "先週、店でこの型を一度操作しました" : "写真で見ただけで、まだ一度も操作していません"}」と言います。\n操作方法は${y ? "古い型と全く同じなので、説明を読んで一人で操作できると確認しました" : "古い型と違うので、まだ一人では操作できません"}。`,
					`Tanaka has used an old ${a.en} for years. A new model arrives at school. Tanaka ${x ? "operated this model once at a shop last week" : "has only seen photographs and has never operated this model"}. ${y ? "The controls are identical to the old model, and Tanaka has confirmed from the instructions that independent operation is possible" : "The controls differ and Tanaka cannot yet operate it alone"}.`,
					"Which report keeps this model's history separate from current ability?",
					"Experience with the old machine is not experience with this model. Conversely, familiar controls can make operation possible before the first actual use.",
					pairs(bools, bools).map(([tried, capable]) => choice({ tried, capable }, `田中さんはこの型を使ったことが${tried ? "あります" : "ありません"}。今、一人で使うことが${capable ? "できます" : "できません"}。`, `Tanaka ${tried ? "has" : "has never"} used this model and ${capable ? "can" : "cannot"} operate it alone now.`)),
					{ tried: x ? "Tanaka operated this exact model at the shop last week." : "Tanaka has only seen photos of this model; years using the old model do not count as using this one.", capable: `The final statement explicitly says independent operation is ${y ? "possible" : "not yet possible"}, separately from past use.` }, [a.word, a.verb],
					sentence("Report whether Tanaka has used this model before, in one sentence. Name Tanaka and refer to this model, not the old machine.", [
						`田中さんはこの型を使ったことが${x ? "あります" : "ありません"}。`, `田中さんはこの型の${a.word}を使ったことが${x ? "あります" : "ありません"}。`, ...(!x ? [`田中さんはこの型を使ったことがないです。`, `田中さんはこの型を一度も使ったことがありません。`] : [])
					], `この型 (this model) / ${a.word} (${a.en}) / 使う・使った (use)`));
			}
			case "reported-visit": {
				const a = action("outing");
				return record({ narratorWent: x, accepted: y },
					`佐藤さんの日記を読みます。\n「昨日、田中さんから${a.word}の話を聞いた。田中さんは先月行ったそうだ。私は${x ? "去年そこへ行っているので、同じ展示の話をした" : "まだ一度も行っていないので、田中さんの写真を見せてもらった"}。\n田中さんが『来週、一緒に行きませんか』と誘ってくれた。私は『${y ? "ぜひ一緒に行きましょう" : "来週は忙しいので、今回は行けません"}』と答えた。」`,
					`In Sato's diary, Tanaka describes visiting the ${a.en} last month. Sato ${x ? "went there last year and discusses the same exhibits" : "has never been and looks at Tanaka's photographs"}. Tanaka invites Sato next week, and Sato ${y ? "accepts" : "declines because of other commitments"}. Track the diary writer rather than the quoted visitor.`,
					"Which statement correctly reports Sato's own history and response?",
					"A reported visit belongs to the person who made it. Looking at someone else's photos does not establish the diary writer's own visit, and an invitation is separate from history.",
					pairs(bools, bools).map(([narrator, accepted]) => choice({ narrator, accepted }, `佐藤さんはその${a.word}に行ったことが${narrator ? "あります" : "ありません"}。来週は田中さんと${accepted ? "一緒に行きます" : "一緒には行きません"}。`, `Sato ${narrator ? "has" : "has never"} visited it and ${accepted ? "will" : "will not"} join Tanaka next week.`)),
					{ narrator: x ? "Sato, the diary writer, explicitly visited last year; Tanaka's visit is a separate event." : "Sato explicitly has never visited; the photos and last month's visit belong to Tanaka.", accepted: `Sato's final reply explicitly ${y ? "accepts" : "declines"} joining next week.` }, [a.word, a.verb],
					sentence("Write one sentence about Sato's own past visits to this place. Name Sato and the destination; leave out next week's plan.", [
						`佐藤さんはその${a.word}に行ったことが${x ? "あります" : "ありません"}。`, `佐藤さんは${a.word}に行ったことが${x ? "あります" : "ありません"}。`, ...(!x ? [`佐藤さんはその${a.word}に一度も行ったことがありません。`, `佐藤さんはその${a.word}に行ったことがないです。`] : [])
					], `${a.word} (${a.en}) / 行く・行った (go)`));
			}
			case "bounded-diary": {
				const days = [[true, true, true], [true, false, true], [false, false, false], []][v];
				const f = { days };
				return record(f,
					`${days.length ? `田中さんが駅で自転車を借りたかどうかの記録が三日分だけ残っています。月曜日は${days[0] ? "借りました" : "借りませんでした"}。火曜日は${days[1] ? "借りました" : "借りませんでした"}。水曜日は${days[2] ? "借りました" : "借りませんでした"}。記録は水曜日の夜までです` : "田中さんのメモには『来週の月曜日から水曜日まで、毎日駅で自転車を借りる予定です』とあります。今日はまだ前の週の日曜日です。実際に借りた日の記録はありません"}。\nそれより前や後については何も書かれていません。担当者は「書かれていない日のことは想像しないでください」と言いました。`,
					`${days.length ? `Only three days of Tanaka's station bicycle-rental record remain: Monday ${days[0] ? "borrowed a bicycle" : "did not borrow one"}, Tuesday ${days[1] ? "borrowed one" : "did not"}, Wednesday ${days[2] ? "borrowed one" : "did not"}. The record ends Wednesday night.` : "Tanaka plans to borrow a bicycle at the station every day from next Monday through Wednesday. It is still the preceding Sunday, and there is no record of an actual rental."} There is no information about other dates; do not invent missing history.`,
					"Which conclusion stays within what this limited record establishes?",
					"One recorded event proves it has happened at least once. No event in three recorded days cannot prove it has never happened in a lifetime. Describe frequency only within the recorded period.",
					[
						choice({ pattern: "all" }, "記録の三日間は毎日借りました。駅で自転車を借りたことがあると分かります。", "A bicycle was borrowed on all three recorded days, establishing past experience."),
						choice({ pattern: "some" }, "記録の三日間には借りない日もありましたが、借りたこともあると分かります。", "There were both rentals and days without them in the three recorded days, establishing past experience."),
						choice({ pattern: "none" }, "記録の三日間は借りませんでしたが、それ以前に借りたことがあるかどうかは分かりません。", "No bicycle was borrowed on the three recorded days; earlier lifetime experience remains unknown."),
						choice({ pattern: "plan" }, "これからの予定だけなので、実際に借りたことがあるかどうかは分かりません。", "This is only a future plan, so actual past experience is not established.")
					],
					{ pattern: days.length ? `The recorded days contain ${days.filter(Boolean).length} actual rentals out of three. This bounded record says nothing about unrecorded dates.` : "These are next week's plans, not completed rentals. A future intention cannot establish an actual past event." }, ["自転車", "記録"]);
			}
			default: throw new Error(`Unknown expanded Boss scenario: ${id}`);
		}
	}
	return { cases, conclusion, build, readings };
});
