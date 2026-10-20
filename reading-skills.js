(function (root, factory) {
	const api = factory();
	if (typeof module === "object" && module.exports) module.exports = api;
	else root.ReadingSkills = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
	"use strict";

	// Original texts: the target can point to a noun, a whole event, or words still to come.
	const references = [
		["book-owner", "backward", "机の上に本とノートがある。本は姉から借りた。その本には、姉の名前が書いてある。", "その本", "姉から借りた本", ["ノート", "机", "姉の名前"], "その本 refers to the borrowed book, not the nearest noun 姉. The head noun 本 limits the referent."],
		["new-student", "backward", "教室で先生が新しい学生を紹介した。その人は、先月日本に来たばかりだそうだ。", "その人", "新しい学生", ["先生", "話している私", "先月"], "The teacher introduces a new student. その人 continues talking about that student, not the teacher who introduced them."],
		["meeting-place", "backward", "駅の近くに小さな公園がある。喫茶店はまだ開いていないので、そこで友だちを待つことにした。", "そこ", "駅の近くの公園", ["喫茶店の中", "駅のホーム", "友だちの家"], "The cafe is unavailable. そこ points back past that rejected option to the park."],
		["past-time", "backward", "去年の春、京都へ引っ越した。そのとき、弟はまだ高校生だった。今は大学に通っている。", "そのとき", "去年の春、京都へ引っ越したとき", ["弟が大学に入ったとき", "今", "来年の春"], "そのとき refers to the time of the move. The following 今 contrasts the brother's current status with that earlier time."],
		["borrowed-bag", "backward", "旅行の前に、母が大きなかばんを貸してくれた。私の小さいかばんは家に置いて、それを持って出かけた。", "それ", "母が貸してくれた大きなかばん", ["私の小さいかばん", "旅行の切符", "母の家"], "The small bag is explicitly left at home. それ is the larger borrowed bag, even though the small bag is mentioned more recently."],
		["whole-event", "backward", "弟が一人で晩ご飯を作って、片付けまでしてくれた。それがとてもうれしかった。", "それ", "弟が料理も片付けもしてくれたこと", ["晩ご飯の味だけ", "弟が一人で食べたこと", "台所の広さ"], "それ refers to the whole helpful event. まで adds the cleanup to the cooking, so reducing it to the food's taste misses the point."],
		["manner-reply", "backward", "店員にゆっくり話してもらったので、私もそう話すようにした。", "そう", "ゆっくり", ["大きな声で", "英語で", "店員の代わりに"], "そう modifies 話す and means 'in that way': slowly. It refers to manner, not the person speaking."],
		["agree-plan", "backward", "「明日はバスより電車で行くほうがよさそうですね。」「私もそう思います。」", "そう", "明日は電車で行くほうがよさそうだということ", ["明日はバスで行くほうがよさそうだということ", "明日はどこにも行かないということ", "電車がもう出たということ"], "そう stands for the first speaker's whole opinion. It does not merely refer to the noun 電車."],
		["refused-action", "backward", "友だちに、宿題を全部見せてほしいと言われた。でも、それはできないと答えた。", "それ", "宿題を全部見せること", ["宿題を自分ですること", "友だちに答えること", "学校へ行くこと"], "The refused action is showing all the homework. それ summarizes the requested action, not the reply itself."],
		["two-places", "backward", "姉は大阪、兄は福岡に住んでいる。夏休みは兄の家に泊まった。そこから海までは歩いて十分だった。", "そこ", "福岡にある兄の家", ["大阪にある姉の家", "海", "私の学校"], "The immediately established location is the brother's home in Fukuoka. The opening sentence tells you which city belongs to which sibling."],
		["previous-instruction", "backward", "先生に「答えを書く前に、最後まで読んでください」と言われた。そのとおりにしたら、前より間違いが少なくなった。", "そのとおり", "答えを書く前に最後まで読むこと", ["先に答えを書いてから読むこと", "間違いだけ読むこと", "先生に答えを書いてもらうこと"], "そのとおり means following the instruction just quoted, including the order of reading before answering."],
		["unwanted-result", "backward", "電車が止まって、約束の時間に間に合わなかった。そのため、友だちを長く待たせてしまった。", "その", "電車が止まって約束の時間に間に合わなかったこと", ["友だちが約束を忘れたこと", "友だちと早く会えたこと", "電車の切符を安く買えたこと"], "そのため points back to the preceding situation as the cause of making the friend wait."],
		["same-method", "backward", "父は毎日、知らない言葉を小さい紙に書いて覚えていた。私もその方法で漢字を覚えている。", "その方法", "小さい紙に書いて覚える方法", ["父に全部読んでもらう方法", "紙を使わずに聞くだけの方法", "漢字を一度だけ見る方法"], "その方法 packages the previously described procedure as a method. The object being learned can change while the method stays the same."],
		["shared-referent", "backward", "「昨日送った写真、見た？」「うん。それ、どこで撮ったの？」「駅前の公園だよ。」", "それ", "昨日送った写真", ["駅前の公園", "昨日送った手紙", "写真を見た人"], "それ refers to the photo in the previous turn. The park answers where it was taken; it is not what それ names."],
		["current-choice", "backward", "赤いシャツは安いが、少し小さい。青いシャツは高いが、サイズが合う。長く着たいので、こちらにした。", "こちら", "青いシャツ", ["赤いシャツ", "両方のシャツ", "前から持っているシャツ"], "The contrast and the reason for long-term wear support the blue shirt that fits. こちら is resolved from this context, not by assuming every demonstrative has a fixed noun."],
		["invitation-refusal", "backward", "「金曜日、一緒に映画を見ない？」「その日は、夜まで仕事があるんだ。」", "その日", "金曜日", ["映画を見た次の日", "今日だと必ず決まる", "土曜日"], "その日 repeats the day proposed in the invitation. Nothing makes it necessarily today."],
		["forward-quote", "forward", "先生はこう言った。「分からないときは、一人で悩まずに質問してください。」私は安心した。", "こう", "分からないときは、一人で悩まずに質問してください", ["私は安心した", "先生が何も言わなかったこと", "一人で考え続けること"], "こう introduces the words that follow. Search forward for the quoted message rather than backward for a noun."],
		["forward-reason", "forward", "私がこの町を好きな理由は、これです。困ったときに、近所の人がいつも助けてくれるからです。", "これ", "困ったときに近所の人が助けてくれること", ["町が大きいこと", "近所に人がいないこと", "引っ越したばかりであること"], "これ points forward to the explanation after it. The sentence names the reason before stating what it is."],
		["forward-plan", "forward", "来週はこのように進めます。月曜日に資料を読み、水曜日に話し合い、金曜日に発表します。", "このように", "資料を読んでから話し合い、最後に発表する順序で", ["最初に発表してから資料を読む順序で", "毎日同じ発表をする方法で", "水曜日だけ学校へ来る予定で"], "このように points ahead to the whole schedule, not only its first action."],
		["forward-request", "forward", "お願いしたいことは、一つだけあります。それは、使った道具を元の場所に戻すことです。", "それ", "使った道具を元の場所に戻すこと", ["新しい道具を買うこと", "道具を家に持ち帰ること", "道具を使わないこと"], "それ links to 一つだけあるお願い and is then specified by the following clause. Do not learn an absolute rule that それ can never be explained by later words."]
	].map(([id, direction, text, target, answer, wrong, explanation]) => ({
		id: `reference-${id}`, sourceId: `reference-${id}`, type: direction, title: "Reference tracking",
		text, target, targetStart: id === "agree-plan" ? text.indexOf("そう思います") : text.indexOf(target),
		prompt: `What does the highlighted ${target} refer to here?`,
		answer, options: [answer, ...wrong], explanation,
		evidence: [text], en: "", japaneseOptions: true
	}));

	// Each continuation is authored against a discourse relation. Synonymous
	// connectors are never competing choices in a single-answer question.
	const connectorRows = [
		["rain-walk", "それで", "雨が強くなってきました。", "散歩をやめて家に戻りました。", "Cause → result", ["それでも", "例えば", "または"], ["雨が強くても散歩を続けました。", "昨日も散歩をしました。", "散歩と買い物のどちらにしますか。"], "それで introduces a result caused by the rain; continuing despite the rain would require a concession instead."],
		["small-flat", "しかし", "この部屋は駅に近くて便利です。", "家賃が高すぎて、借りることはできません。", "Contrast / concession", ["だから", "例えば", "または"], ["駅まで五分で歩けます。", "通勤時間が短くなります。", "今日か明日、部屋を見に来てください。"], "しかし contrasts the convenient location with a drawback that prevents renting it."],
		["train-delay", "だから", "電車が止まっていて、再開まで一時間かかるそうです。", "今日はバスで会社へ行くことにします。", "Cause → result", ["それなのに", "なぜなら", "例えば"], ["電車はいつも時間どおりに来ます。", "昨日も会社で会議がありました。", "朝は牛乳かお茶を飲みます。"], "だから presents a decision based on the preceding problem. なぜなら would introduce its reason in the opposite direction."],
		["choose-cafe", "なぜなら", "今日は駅前のカフェで勉強しません。", "午後はとても混むからです。", "Claim ← reason", ["それで", "それでも", "または"], ["今日は図書館へ行きます。", "来週も勉強しましょう。", "コーヒーをもう一杯ください。"], "The decision comes first. なぜなら then supplies the reason, completed by からです."],
		["free-day", "それでも", "雨が降っていて、風も強かったです。", "楽しみにしていたので、試合を見に行きました。", "Contrast / concession", ["それで", "例えば", "または"], ["外に出るのをやめました。", "雨が降る前に帰りました。", "天気予報には気温も書いてあります。"], "それでも means despite those conditions; the visit goes against the expectation created by bad weather."],
		["shop-benefits", "それに", "この店の野菜は新鮮です。", "値段も安いので、よく買いに来ます。", "Adding information", ["しかし", "なぜなら", "または"], ["でも、値段が高すぎます。", "新鮮とはどういう意味ですか。", "野菜と肉のどちらか一つを選んでください。"], "それに adds a second positive reason. も supports the accumulation of advantages."],
		["trip-order", "それから", "ホテルに荷物を置きました。", "近くの美術館へ出かけました。", "Next event", ["なぜなら", "例えば", "または"], ["その前に、駅で切符を買いました。", "荷物は全部で二つありました。", "ホテルか旅館を選んでください。"], "それから advances the time line after leaving the luggage. A previous event would not fit this sequence."],
		["food-example", "例えば", "日本には、寒い日に食べたくなる料理がいろいろあります。", "鍋料理は、体が温まるので人気があります。", "Example", ["それでも", "だから", "または"], ["夏は冷たい飲み物をよく飲みます。", "寒い日には外へ行きません。", "料理は自分で作ってください。"], "例えば introduces one concrete member of the broader category, here 鍋料理."],
		["contact-choice", "または", "申し込みは電話で受け付けています。", "インターネットでも申し込めます。どちらか一つの方法でお願いします。", "Alternative", ["なぜなら", "例えば", "すると"], ["電話のあとで必ず書類も送ってください。", "電話で申し込むことはできません。", "電話をかけたので、申し込みが終わりました。"], "または offers another method. どちらか一つ makes these alternatives, not two required steps."],
		["door-response", "すると", "玄関のベルを押しました。", "中から人が出てきました。", "Triggered response", ["なぜなら", "例えば", "または"], ["ベルを押す前に家へ帰りました。", "玄関の色は白です。", "ベルか電話を一つ買ってください。"], "すると moves from an action to the response that followed it, rather than listing unrelated information."],
		["turn-question", "では", "私の町では、自転車で学校へ行く人が多いです。", "皆さんの町では、どうですか。", "Conversation transition", ["なぜなら", "それなのに", "例えば"], ["自転車を買ったからです。", "それでも学校へ行きます。", "例えば、私の町です。"], "では hands the conversation over to a new question based on the preceding topic; it need not mean an unrelated subject change."],
		["two-siblings", "反対に", "兄は休みの日も早く起きます。", "弟は昼まで寝ていることが多いです。", "Opposing comparison", ["だから", "例えば", "なぜなら"], ["兄は朝六時ごろ散歩します。", "兄も弟も毎朝五時に起きます。", "私は休日に本を買います。"], "反対に sets up an opposing tendency in the brother, not another example of the same tendency."],
		["summary-service", "このように", "この図書館では本を借りられます。新聞も読めますし、静かな自習室も使えます。", "本を借りる以外にも、いろいろな使い方があります。", "Summary", ["なぜなら", "または", "それなのに"], ["例えば、この図書館では本を借りられます。", "明日は雨が降るそうです。", "自習室か新聞のどちらかを買ってください。"], "このように gathers the listed services into a general conclusion rather than starting a new example."],
		["late-despite", "それなのに", "遅れないように、いつもより早く家を出ました。", "道が混んでいて、結局遅刻してしまいました。", "Contrast / concession", ["だから", "例えば", "または"], ["いつもより早く会社に着きました。", "明日は駅で会いましょう。", "家を出る前に朝ご飯を食べました。"], "それなのに marks an outcome contrary to the purpose of leaving early."],
		["appointment-reason", "なぜなら", "予約の時間より十五分早く来てください。", "最初に書類を書いていただく必要があるからです。", "Claim ← reason", ["それでも", "それから", "または"], ["それから診察が終わります。", "予約は取り消してもいいです。", "来週も同じ時間に来てください。"], "The second sentence explains why early arrival is requested; it does not describe the result of arriving early."],
		["extra-rule", "また", "図書館の中では、電話で話さないでください。", "食べ物を持ち込むこともできません。", "Adding information", ["なぜなら", "反対に", "すると"], ["ただし、電話は自由に使えます。", "図書館へ来たので本を借りました。", "電話を使わなかったからです。"], "また adds another rule. The two restrictions both apply; they are not alternatives."],
		["button-result", "すると", "画面の青いボタンを押してください。", "次のページが開きます。", "Triggered response", ["なぜなら", "または", "しかし"], ["その前に青いボタンを押しました。", "赤いボタンのほうが好きです。", "ボタンか画面のどちらかを選んでください。"], "すると predicts the response triggered by pressing the button."],
		["weekend-plan", "それから", "午前中に部屋を掃除します。", "昼ご飯を食べて、買い物に出かけます。", "Next event", ["なぜなら", "反対に", "例えば"], ["掃除を始める前に寝ました。", "部屋は掃除しやすい形です。", "掃除をする理由は、客が来るからです。"], "それから places the lunch and shopping after the morning cleaning."],
		["transport-example", "例えば", "車を使わずに旅行する方法もあります。", "電車なら、景色を見ながら移動できます。", "Example", ["なぜなら", "反対に", "または"], ["車はとても便利です。", "旅行をやめることにしました。", "方法はまだ一つもありません。"], "The train is a concrete example of travel without a car."],
		["two-options", "または", "申込書は受付に持ってきてください。", "郵便で送ってもかまいません。両方する必要はありません。", "Alternative", ["だから", "なぜなら", "例えば"], ["受付に出したあとで必ず郵便でも送ってください。", "申込書を書くことはできません。", "受付で名前を呼ばれました。"], "または presents delivery by post as an alternative to bringing the form; both are not required."]
	];
	const relations = [...new Set(connectorRows.map(row => row[4]))];
	const overlappingRelations = [
		["Contrast / concession", "Opposing comparison"],
		["Cause → result", "Triggered response", "Next event"]
	];
	const connections = connectorRows.flatMap(([id, connector, before, after, relation, wrongConnectors, wrongEndings, explanation]) => {
		const shared = { sourceId: `connection-${id}`, title: "Sentence connections", en: "", explanation, evidence: [before, `${connector}、${after}`] };
		return [
			{ ...shared, id: `${id}-connector`, type: "connector", text: `${before}\n＿＿、${after}`,
				prompt: "Which connector best fits the relationship?", answer: connector, options: [connector, ...wrongConnectors], japaneseOptions: true },
			{ ...shared, id: `${id}-continuation`, type: "continuation", text: `${before}\n${connector}、＿＿`,
				target: connector, targetStart: before.length + 1,
				prompt: "Which continuation fits this connector and the preceding sentence?", answer: after, options: [after, ...wrongEndings], japaneseOptions: true },
			{ ...shared, id: `${id}-relationship`, type: "relationship", text: `${before}\n${connector}、${after}`,
				target: connector, targetStart: before.length + 1,
				prompt: "What relationship does the highlighted connector express?",
				answer: relation, options: [relation, ...relations.filter(other => other !== relation &&
					!overlappingRelations.some(group => group.includes(relation) && group.includes(other))).slice(0, 3)] }
		];
	});
	return { references, connections };
});
