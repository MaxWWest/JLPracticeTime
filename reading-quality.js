(function (root, factory) {
	const api = factory();
	if (typeof module === "object" && module.exports) module.exports = api;
	else root.ReadingQuality = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
	"use strict";

	const forceDescriptions = {
		greeting: ["Greeting / thanks", "The quoted words greet or thank someone."],
		request: ["Request / instruction", "The quoted speaker asks another person to act."],
		prohibition: ["Rule / prohibition", "The quoted speaker says an action must not be done."],
		permissionQuestion: ["Question / permission request", "The quoted speaker asks whether an action is allowed."],
		permission: ["Permission / no obligation", "The quote allows an action or removes a requirement; it does not require that action."],
		offer: ["Offer of help", "The quoted speaker offers to do the action for the listener."],
		plan: ["Plan / intention", "The quoted speaker states their intended future action."],
		wish: ["Desire / wish", "The quote states what someone wants; wanting is not a confirmed plan."],
		belief: ["Belief / guess", "The quote presents an expectation or uncertain judgment."],
		feeling: ["Feeling / evaluation", "The quoted words express a feeling or evaluate a situation."],
		obligation: ["Obligation", "The quoted speaker says an action is necessary, not merely desired."],
		advice: ["Advice", "The quote recommends a course of action."],
		information: ["Information / announcement", "The quote supplies a fact, schedule, ability, or situation."],
		refusal: ["Inability / refusal to attend", "The speaker says they cannot attend, rather than making a plan to attend."]
	};
	const reportingLabels = {
		say: "said / told", think: "thought / believed", ask: "asked",
		write: "wrote / was written", explain: "explained / taught / informed",
		feel: "felt", announce: "announced / reported"
	};
	const quoteRows = [
		["おはよう", "友だち", "say", "greeting"],
		["あしたは早く会社に来てほしい", "課長", "say", "request"],
		["リサさんがスピーチをするだろう", "考えた人（明示なし）", "think", "belief"],
		["気をつけて行ってきなさい", "母", "say", "request"],
		["この店のラーメンはおいしいにちがいない", "私", "think", "belief"],
		["来週テストをします", "先生", "say", "plan"],
		["あしたは休みます", "田中さん", "say", "plan"],
		["ぼくも行きたい", "弟", "say", "wish"],
		["この仕事は私にはむりだ", "私", "think", "feeling"],
		["しばらく運動をしてはいけません", "医者", "say", "prohibition"],
		["来月日本に帰ります", "山田さん", "explain", "plan"],
		["ひとりでも大丈夫", "私", "think", "feeling"],
		["ここで写真をとらないでください", "看板", "write", "prohibition"],
		["今度の日曜日、いっしょに映画を見に行こう", "友だち", "say", "request"],
		["明日は雨がふるかもしれない", "私", "think", "belief"],
		["大学に行くなら、アルバイトをしなさい", "父", "say", "request"],
		["少々お待ちください", "店員さん", "say", "request"],
		["この計画は成功する", "みんな", "think", "belief"],
		["宿題は金曜日までに出してください", "先生", "say", "request"],
		["ありがとう", "彼女", "say", "greeting"],
		["明日は早く起きなければならない", "私", "think", "obligation"],
		["わからないことがあったら、いつでも聞いて", "先輩", "say", "request"],
		["駅まで迎えに行こうか", "父", "say", "offer"],
		["このケーキを半分食べてもいいか", "友だち", "ask", "permissionQuestion"],
		["漢字の宿題は明日までです", "先生", "write", "information"],
		["この道をまっすぐ行けば駅に着くはずだ", "私", "think", "belief"],
		["会議は三時から四時に変わりました", "メール", "write", "information"],
		["この券は今日だけ使えます", "店の人", "say", "information"],
		["寒いからコートを着なさい", "祖母", "say", "request"],
		["試験が終わったら旅行したい", "兄", "say", "wish"],
		["鍵をかけたかどうか心配だ", "私", "think", "feeling"],
		["自転車をここに止めないでください", "看板", "write", "prohibition"],
		["駅に着いたら連絡する", "友だち", "say", "plan"],
		["薬を飲まなくてもいいです", "医者", "say", "permission"],
		["もう少し早く出ればよかった", "私", "think", "feeling"],
		["冷蔵庫にカレーがある", "母", "say", "information"],
		["あの赤い風船がほしい", "子ども", "say", "wish"],
		["わからない人は手を上げてください", "先生", "say", "request"],
		["今日は残業しなければならない", "山田さん", "say", "obligation"],
		["この本はN4の勉強に役立ちそうだ", "私", "think", "belief"],
		["サイズが合わなければ交換できます", "店員", "explain", "information"],
		["道が混んでいるから少し遅れる", "友だち", "write", "information"],
		["雨が降りそうだから洗濯物を入れて", "母", "say", "request"],
		["次の電車は十番線から出ます", "駅のアナウンス", "announce", "information"],
		["日本語で電話するのはまだ難しい", "私", "feel", "feeling"],
		["この映画は思ったよりおもしろかった", "友だち", "say", "feeling"],
		["新しい仕事に慣れるまで時間がかかる", "父", "say", "information"],
		["作文は短くてもいいです", "先生", "say", "permission"],
		["財布を家に忘れたかもしれない", "私", "think", "belief"],
		["ここに名前と電話番号を書いてください", "受付の人", "say", "request"],
		["一人で電車に乗れる", "妹", "say", "information"],
		["明日の朝は雪になるでしょう", "ニュース", "announce", "belief"],
		["失敗してももう一度やってみればいい", "先輩", "say", "advice"],
		["この町は前より便利になった", "私", "think", "feeling"],
		["お弁当は午後二時までに注文してください", "店の紙", "write", "request"],
		["忙しくてパーティーには行けない", "友だち", "say", "refusal"]
	];
	// Invitations are distinct from requests to perform work for another person.
	forceDescriptions.invitation = ["Invitation / joint proposal", "The speaker proposes doing something together with the listener."];
	quoteRows.find(row => row[0].includes("映画を見に行こう"))[3] = "invitation";
	const quotes = Object.fromEntries(quoteRows.map(([content, source, verb, force]) => [content, {
		source, verb: { label: reportingLabels[verb], explanation: `The reporting expression presents this as ${reportingLabels[verb]}. The quoted content and the reporting act are separate questions.` },
		force: { label: forceDescriptions[force][0], explanation: forceDescriptions[force][1] }
	}]));

	const roleInfo = {
		R: ["Reason / cause", "This clause gives the reason for the following event or decision."],
		P: ["Purpose / goal", "This clause gives the goal that the main action is intended to achieve."],
		T: ["Time / sequence", "This clause locates an event in time or links actions in order."],
		C: ["Condition", "This clause supplies a condition or repeated trigger for the following result."],
		X: ["Contrast / concession", "The following clause contrasts with this fact or goes against its expected result."],
		W: ["Without doing", "The main action happens without the action in this clause."],
		L: ["Listing / adding information", "This clause adds a fact or reason to a list."],
		S: ["Simultaneous action", "This action takes place alongside the main action."],
		B: ["Continuing state", "The main action happens while this state is left unchanged."]
	};
	// One entry for each marked clause in the existing, fixed sentence bank.
	const breakRoles = [
		"R","P","C","X","T","T","L","W","R","T","P","C","C","C","TT",
		"XR","TR","TT","RT","X","XR","T","C","T","T","W","C","C","T","PT",
		"R","R","T","LR","TT","XC","R","T","XC","RT","T","PT","WR","T","T",
		"R","R","R","P","C","R","R","X","RR","X","CW","X","T","T","C","R",
		"T","C","R","T","S","R","C","C","T","T","C","B","T"
	].map(codes => [...codes].map(code => ({ label: roleInfo[code][0], explanation: roleInfo[code][1] })));

	const moods = [
		{ mood: "positive", category: "completion without regret", tone: "satisfied / pleased", signal: "positive evaluation word", sentence: "宿題を全部やってしまったので、安心して遊べます。", clue: "安心して遊べます", explanation: "てしまう marks completion here. The writer is pleased to be finished; it does not automatically signal regret." },
		{ mood: "positive", category: "welcome passive", tone: "satisfied / pleased", signal: "positive evaluation word", sentence: "先生に作文をほめられて、とてもうれしかったです。", clue: "うれしかったです", explanation: "The passive ほめられる describes receiving praise. うれしかった explicitly makes the response positive." },
		{ mood: "negative", category: "unwanted advice", tone: "annoyed / affected", signal: "negative evaluation word", sentence: "友だちは何度も助言してくれますが、今は一人で決めたいので困っています。", clue: "困っています", explanation: "くれる acknowledges helpful intent, but 困っています and wanting to decide alone establish the writer's negative reaction." },
		{ mood: "mixed", category: "trade-off", tone: "mixed feelings", signal: "contrasting evaluations", sentence: "新しい部屋は広くてうれしいですが、駅から遠くなったのは残念です。", clue: "うれしいですが、駅から遠くなったのは残念", explanation: "The writer explicitly values the extra space and regrets the distance. Neither purely positive nor purely negative captures both." },
		{ mood: "neutral", category: "factual passive", tone: "no attitude established", signal: "factual report only", sentence: "この建物は三十年前に建てられました。今は市の事務所として使われています。", clue: "三十年前に建てられました", explanation: "These passive forms report construction and use. No pleasure, annoyance, or evaluation is stated." },
		{ mood: "neutral", category: "factual completion", tone: "no attitude established", signal: "factual report only", sentence: "資料は昨日、全部送ってしまいました。残りはありません。", clue: "全部送ってしまいました", explanation: "This reports completion. Without an evaluative cue, regret cannot be inferred just from てしまう." },
		{ mood: "positive", category: "changed expectation", tone: "relieved / safe", signal: "relief or success phrase", sentence: "試験に落ちたと思っていましたが、合格していたと分かってほっとしました。", clue: "ほっとしました", explanation: "The final discovery replaces the earlier worry. The writer's current feeling is relief." },
		{ mood: "negative", category: "changed expectation", tone: "disappointed", signal: "disappointment phrase", sentence: "旅行を楽しみにしていましたが、中止になってがっかりしています。", clue: "がっかりしています", explanation: "Earlier anticipation is not the current mood. Cancellation leads to explicit disappointment." },
		{ mood: "mixed", category: "help with cost", tone: "mixed feelings", signal: "contrasting evaluations", sentence: "兄が手伝ってくれて助かりました。でも、兄の大切な予定を変えさせたことは申し訳なく思います。", clue: "助かりました。でも", explanation: "The writer appreciates the help but feels apologetic about its cost to the brother. Both reactions matter." },
		{ mood: "neutral", category: "reported emotion", tone: "no attitude established", signal: "factual report only", sentence: "田中さんは「うれしいです」と言っていました。私はその言葉をノートに書きました。", clue: "田中さんは「うれしいです」と言っていました", explanation: "The happiness belongs to Tanaka. Recording the quote does not establish the narrator's own feeling." },
		{ mood: "positive", category: "useful negative", tone: "relieved / safe", signal: "relief or success phrase", sentence: "会議に出なくてもよくなったので、休む時間ができて助かりました。", clue: "助かりました", explanation: "The negative obligation form removes a burden. The explicit reaction is positive, not negative merely because なく appears." },
		{ mood: "negative", category: "effort not success", tone: "disappointed", signal: "disappointment phrase", sentence: "一生懸命練習しましたが、本番ではうまくできず、悔しかったです。", clue: "悔しかったです", explanation: "Effort does not guarantee a positive mood. The writer's explicit final response is frustration at the performance." }
	];

	const stackWords = [
		["書く","かく","to write","godan","N5"], ["読む","よむ","to read","godan","N5"],
		["買う","かう","to buy","godan","N5"], ["待つ","まつ","to wait","godan","N5"],
		["話す","はなす","to speak","godan","N5"], ["送る","おくる","to send","godan","N5"],
		["開ける","あける","to open","ichidan","N5"], ["閉める","しめる","to close","ichidan","N5"],
		["調べる","しらべる","to check","ichidan","N4"], ["運ぶ","はこぶ","to carry","godan","N4"],
		["直す","なおす","to repair","godan","N4"], ["説明する","せつめいする","to explain","suru","N4"],
		["確認する","かくにんする","to confirm","suru","N3"], ["準備する","じゅんびする","to prepare","suru","N3"]
	].map(([kanji, reading, meaning, type, level]) => ({ kanji, reading, meaning, type, level }));
	// These combinations have coherent scope. No unrestricted random morphology.
	const stackChains = ["a","b","c","d","e","f","g","h","i","k","l","m",
		"ba","ca","cb","cj","fa","fb","fg","ea","eb","la","lb","ia","ib","ha","ad",
		"cba","cja","bja","fba","eba","lba","lia","lib","had","fad","bad",
		"cbad","cjad","fbad","ebad","lbad","liba","liad","bjad"];
	return { quotes, reportingLabels, forceDescriptions, breakRoles, roleInfo, moods, stackWords, stackChains };
});
