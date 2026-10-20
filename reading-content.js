(function (root, factory) {
	"use strict";
	const api = factory();
	if (typeof module === "object" && module.exports) module.exports = api;
	else root.ReadingContent = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
	"use strict";

	function question(type, prompt, answer, evidence, explanation, distractors) {
		return {
			type, prompt, answer, evidence, explanation,
			options: [answer, ...distractors.map(([text]) => text)],
			distractorFeedback: Object.fromEntries(distractors)
		};
	}

	// Evidence is authored with each question, not inferred from keywords.
	const passages = [
		{
			id: "umbrella-message", level: 1, title: "A message before leaving",
			text: "駅まで来たけれど、かさを忘れたことに気づいた。今は晴れている。でも、帰るころには雨になるらしい。まだ時間があるので、取りに戻ることにした。",
			en: "The writer notices their missing umbrella at the station and returns for it because rain is expected later.",
			questions: [
				question("inference", "What can we conclude about the writer's decision?", "They are preparing for the trip home, not the current weather.",
					["今は晴れている。", "帰るころには雨になるらしい。"], "It is sunny now, but the forecast for the return trip motivates fetching the umbrella.", [
						["They need shelter from rain already falling.", "今は晴れている says it is sunny now."],
						["They have decided not to go out today.", "取りに戻る means returning to fetch something, not canceling the outing."],
						["They missed their train and must go home.", "No missed train is mentioned; there is still time."]
					]),
				question("reference", "What will the writer go back to get?", "The umbrella.",
					["かさを忘れたことに気づいた。", "取りに戻ることにした。"], "The object of 取りに is omitted. The forgotten umbrella supplies it.", [
						["A train ticket.", "No ticket is mentioned."],
						["Their remaining time.", "時間 is time available, not the object to fetch."],
						["A weather report.", "The forecast explains the decision; it is not what was forgotten."]
					]),
				question("reason", "Which two facts make going back sensible?", "Rain is expected later, and there is still time.",
					["帰るころには雨になるらしい。", "まだ時間があるので"], "The forecast creates the need; having time makes the detour possible.", [
						["It is raining now, and the station is closed.", "It is sunny now, and no station closure is stated."],
						["The writer is late, and the umbrella is broken.", "Neither being late nor a broken umbrella is stated."],
						["It will be sunny later, and the train has left.", "Rain, not sunshine, is expected later."]
					])
			]
		},
		{
			id: "bread-reservation", level: 1, title: "Bakery notice",
			text: "食パンは午後二時に焼き上がります。予約した方の分は、六時まで取っておきます。予約していない方も買えますが、売り切れることがあります。",
			en: "Bread is ready at 2 p.m. Reserved loaves are held until 6; unreserved customers risk a sellout.",
			questions: [
				question("inference", "You cannot arrive until 5 p.m. Which plan best avoids a wasted trip?", "Reserve a loaf before visiting.",
					["予約した方の分は、六時まで取っておきます。", "売り切れることがあります。"], "A reservation holds your loaf until 6, covering a 5 p.m. visit.", [
						["Arrive at 5 without reserving because bread is guaranteed.", "Walk-in customers can buy bread, but it can sell out."],
						["Wait until after 6 because reservations last all evening.", "The stated hold ends at 6."],
						["Avoid the shop because only reserved customers can buy.", "予約していない方も買えます allows walk-in purchases."]
					]),
				question("reference", "What does 予約した方の分 refer to?", "The bread set aside for customers with reservations.",
					["食パンは午後二時に焼き上がります。", "予約した方の分は、六時まで取っておきます。"], "分 means the portion allocated to those customers, not a unit of time here.", [
						["The minutes needed to bake the bread.", "分 refers to an allocation here; the phrase is about customers who reserved."],
						["All bread left after 6.", "The passage describes reserved bread before the hold expires."],
						["The customers who bake bread at home.", "予約した方 means customers who made reservations."]
					]),
				question("purpose", "What is the main purpose of this notice?", "Explain when bread is ready and how reservations affect availability.",
					["食パンは午後二時に焼き上がります。", "予約していない方も買えますが、売り切れることがあります。"], "The notice connects baking time with reserved and walk-in availability.", [
						["Announce that the bakery is closing permanently.", "No permanent closure is mentioned."],
						["Ask customers to collect all orders at exactly 2.", "Two is the ready time, not a mandatory pickup appointment."],
						["Explain how to bake bread in six hours.", "The numbers describe pickup times, not a recipe."]
					])
			]
		},
		{
			id: "notebook-return", level: 1, title: "After class",
			text: "由美：昨日貸したノート、今日使いたいんだけど。\n健：ごめん、家に置いてきちゃった。昼休みに取りに帰るよ。\n由美：午後の授業に間に合えば大丈夫。",
			en: "Ken forgot Yumi's notebook at home and will fetch it at lunch; Yumi needs it for the afternoon class.",
			questions: [
				question("inference", "How does Yumi respond to Ken's plan?", "She accepts it provided the notebook arrives in time for the afternoon class.",
					["昼休みに取りに帰るよ。", "午後の授業に間に合えば大丈夫。"], "間に合えば makes her acceptance conditional on the class deadline.", [
						["She requires him to return it immediately before lunch.", "She allows time until the afternoon class."],
						["She says she no longer needs the notebook today.", "今日使いたい and the afternoon deadline show she still needs it."],
						["She asks him to keep it until tomorrow.", "Tomorrow is not offered as an acceptable return time."]
					]),
				question("reference", "Who lent the notebook, and who must fetch it?", "Yumi lent it; Ken must fetch it.",
					["由美：昨日貸したノート", "健：ごめん、家に置いてきちゃった。"], "Yumi describes lending it. Ken apologizes for leaving it at his home.", [
						["Ken lent it; Yumi must fetch it.", "This reverses the lender and borrower."],
						["Yumi lent it; their teacher must fetch it.", "No teacher is involved in fetching it."],
						["Ken lent it; their teacher must fetch it.", "Both the lender and the person fetching it are wrong."]
					]),
				question("sequence", "Which order matches the exchange?", "Yumi lent it yesterday; Ken left it at home; he plans to fetch it at lunch.",
					["昨日貸したノート", "家に置いてきちゃった。昼休みに取りに帰るよ。"], "昨日 locates the loan in the past, while 帰るよ states Ken's upcoming action.", [
						["Ken fetched it at lunch yesterday and has already returned it.", "The lunch trip is a plan, not a completed return."],
						["Yumi will lend it after today's afternoon class.", "The loan already happened yesterday."],
						["Ken will buy a new notebook after class.", "He plans to retrieve the existing notebook, not buy another."]
					])
			]
		},
		{
			id: "seat-offer", level: 1, title: "On the train",
			text: "電車で、荷物をたくさん持った人に席をゆずろうとした。「ありがとうございます。でも、次で降りますから」と言われたので、そのまま座っていた。",
			en: "The writer offers a seat, but the other passenger politely declines because they are getting off at the next stop.",
			questions: [
				question("inference", "What does the passenger mean by でも、次で降りますから?", "Thank you, but I do not need the seat.",
					["席をゆずろうとした。", "でも、次で降りますから"], "The reason after でも functions as a polite refusal without explicitly saying no.", [
						["Please carry my bags off the train.", "No request to carry the bags is made."],
						["Please stand up so I can sit down.", "The writer remains seated because the offer is declined."],
						["You should get off at the next stop.", "The passenger describes their own plan, not the writer's."]
					]),
				question("reference", "Who remained seated at the end?", "The writer.",
					["と言われたので、そのまま座っていた。"], "と言われた reports what the writer was told; the omitted subject of 座っていた remains the writer.", [
						["The passenger carrying many bags.", "That passenger declined the offered seat."],
						["Both passengers.", "The text does not say the other passenger sat down."],
						["The train driver.", "The driver is not part of this exchange."]
					]),
				question("reason", "Why did the offer not lead to a seat change?", "The passenger was about to leave the train.",
					["次で降りますから", "そのまま座っていた。"], "The short remaining journey explains the refusal and the writer's decision to stay seated.", [
						["The writer changed their mind before offering.", "The passenger's reply shows the offer was communicated."],
						["The bags were too heavy to move.", "Bag weight is not given as the reason."],
						["The passenger did not hear the offer.", "The passenger answered with thanks and a reason."]
					])
			]
		},
		{
			id: "practice-location", level: 1, title: "Two club messages",
			text: "午前の連絡：今日は公園で練習します。雨なら体育館に来てください。\n午後の連絡：体育館が使えなくなりました。今日は雨なので、練習は明日にします。",
			en: "An initial rain plan used the gym, but a later message postpones practice because the gym is unavailable.",
			questions: [
				question("inference", "It is raining today. What should members do now?", "Wait until tomorrow for practice.",
					["体育館が使えなくなりました。", "練習は明日にします。"], "The afternoon update supersedes the morning rain plan.", [
						["Go to the gym today.", "That was the earlier backup plan; the gym is now unavailable."],
						["Go to the park today despite the rain.", "Today's practice has been postponed."],
						["Stop attending the club permanently.", "The delay is until tomorrow, not a permanent cancellation."]
					]),
				question("purpose", "Why was the second message necessary?", "The original backup location was no longer available.",
					["雨なら体育館に来てください。", "体育館が使えなくなりました。"], "The gym was the rain alternative, so losing it requires a new plan.", [
						["To confirm that the gym plan was unchanged.", "The second message explicitly changes that plan."],
						["To invite people to a different club.", "Both messages concern the same practice."],
						["To explain that the rain had stopped.", "The update says 今日は雨なので."]
					]),
				question("sequence", "Which plan came first?", "Practice in the park, using the gym if it rained.",
					["午前の連絡：今日は公園で練習します。雨なら体育館に来てください。"], "午前 precedes 午後; the conditional location plan belongs to the morning message.", [
						["Postpone practice until tomorrow.", "That is the afternoon update."],
						["Cancel all practices this month.", "No monthly cancellation is mentioned."],
						["Practice in the gym regardless of weather.", "The gym was only the rainy-weather alternative."]
					])
			]
		},
		{
			id: "jacket-return", level: 1, title: "At a clothing shop",
			text: "店員：サイズはいかがですか。\n客：大きさはちょうどいいんですが、もう少し明るい色はありますか。\n店員：同じサイズなら、こちらの青もあります。\n客：では、それを着てみてもいいですか。",
			en: "The customer likes the fit but wants a brighter color and asks to try the blue version in the same size.",
			questions: [
				question("inference", "What does the customer want to change?", "The color, but not the size.",
					["大きさはちょうどいいんですが、もう少し明るい色はありますか。"], "ちょうどいい approves the fit; が introduces the remaining preference.", [
						["The size, but not the color.", "The customer explicitly says the size is right."],
						["Both the size and the price.", "No price concern is mentioned."],
						["The shop, because nothing fits.", "The customer continues trying an option in this shop."]
					]),
				question("reference", "What does それ refer to in the final line?", "The blue item offered by the clerk.",
					["こちらの青もあります。", "それを着てみてもいいですか。"], "それ points back to the new blue option, not the original item.", [
						["The original item the customer already tried.", "The request follows the clerk's introduction of the blue alternative."],
						["An item in a larger size.", "The clerk offers the same size."],
						["The receipt.", "No receipt has been mentioned, and 着る is to wear."]
					]),
				question("purpose", "What is the customer doing in the final line?", "Asking permission to try the alternative before deciding.",
					["それを着てみてもいいですか。"], "着てみる is trying it on; てもいいですか asks permission, not a purchase commitment.", [
						["Confirming that they have already bought it.", "The customer is asking to try it, not confirming payment."],
						["Asking the clerk to wear it.", "The omitted wearer is the customer asking permission."],
						["Rejecting the alternative without trying it.", "They specifically request a try-on."]
					])
			]
		},
		{
			id: "library-extension", level: 2, title: "Library rule and message",
			text: "貸出案内：本は二週間借りられます。次に予約している人がいなければ、一度だけ、一週間延長できます。延長したい場合は、返す日までに手続きしてください。\n図書館からのメール：お借りになっている本に予約が入りました。金曜日までにお返しください。",
			en: "Loans can be extended only once and only with no waiting reservation. This borrower must return the reserved book by Friday.",
			questions: [
				question("inference", "You have never extended this loan. Can you now keep the book for an extra week?", "No; another reader has reserved this book.",
					["次に予約している人がいなければ", "お借りになっている本に予約が入りました。"], "Being a first extension is not enough: both the one-extension limit and the no-reservation condition must be satisfied.", [
						["Yes; unused extensions are always available.", "The no-reservation condition still applies."],
						["Yes, as long as you apply before Friday.", "Applying on time does not remove another reader's reservation."],
						["No; the library never permits extensions.", "The general rule does allow them when its conditions are met."]
					]),
				question("reference", "In the loan rule, who is 次に予約している人?", "Another reader waiting to borrow the same book.",
					["次に予約している人がいなければ、一度だけ、一週間延長できます。"], "The restriction protects the next reader waiting for this loaned book.", [
						["The current borrower renewing their own loan.", "The condition concerns someone waiting after the current borrower."],
						["A librarian reserving a room.", "The rule is about borrowing books, not room reservations."],
						["Anyone who visits the library next Friday.", "A specific reservation, not simply visiting, matters."]
					]),
				question("purpose", "What does the email add to the general rule?", "It tells this borrower that the condition for extension is not met.",
					["お借りになっている本に予約が入りました。金曜日までにお返しください。"], "The email supplies the book-specific reservation fact and return deadline.", [
						["It cancels the extension policy for every book.", "The email concerns this borrower's book, not all loans."],
						["It confirms that an extension has been granted.", "It asks for return, not an extension."],
						["It invites the borrower to reserve a different book.", "No new reservation invitation appears."]
					])
			]
		},
		{
			id: "workshop-plans", level: 2, title: "Choosing a workshop",
			text: "料理教室の案内\n土曜クラス：午前十時から十二時まで。道具は教室で用意します。申し込みは木曜日まで。\n日曜クラス：午後一時から三時まで。自分の包丁を持ってきてください。申し込みは金曜日まで。\n美香のメモ：土曜日は十一時まで仕事。日曜日は空いている。今日は金曜日。包丁は持っている。",
			en: "Mika is checking two workshops against her schedule, the application deadlines, and the required equipment.",
			questions: [
				question("inference", "Which class can Mika still apply for and attend in full?", "The Sunday class.",
					["申し込みは金曜日まで。", "土曜日は十一時まで仕事。日曜日は空いている。今日は金曜日。"], "Sunday fits her availability and its deadline is today. Saturday's deadline has passed and work overlaps.", [
						["The Saturday class.", "Its Thursday deadline has passed, and she works until 11 during the class."],
						["Either class.", "Saturday fails both timing checks."],
						["Neither class.", "She is free Sunday, owns a knife, and can still apply on Friday."]
					]),
				question("inference", "What must Mika bring to the class that fits her plans?", "Her own knife.",
					["日曜クラス", "自分の包丁を持ってきてください。", "日曜日は空いている。"], "Choose the feasible class first, then apply its equipment requirement; Saturday's equipment rule does not transfer.", [
						["Nothing, because all classes provide tools.", "Only Saturday explicitly provides tools."],
						["A knife for the Saturday instructor.", "She can attend Sunday, and the knife is for her own use."],
						["Proof that she worked on Saturday.", "No proof of work is required."]
					]),
				question("sequence", "What should Mika do today if she wants to attend?", "Apply for Sunday before its deadline passes.",
					["申し込みは金曜日まで。", "今日は金曜日。"], "Her free day is Sunday, but the application deadline is Friday, today.", [
						["Wait until Sunday to apply at the door.", "The application deadline comes before the class."],
						["Apply for Saturday after work tomorrow.", "Saturday's application deadline has already passed."],
						["Ask the instructor to move both classes.", "The published Sunday option already fits; no change is needed."]
					])
			]
		},
		{
			id: "unexpected-gift", level: 2, title: "A birthday present",
			text: "誕生日に姉から時計をもらった。前に、店で「これ、いいね」と言ったのを覚えていてくれたらしい。実は、自分でも同じ物を買おうと思っていた。高かっただろうに、姉は値段のことは何も言わなかった。大事に使いたい。",
			en: "The writer is touched that their sister remembered a watch they liked and gave it as a birthday present.",
			questions: [
				question("inference", "What most clearly makes this gift personally meaningful?", "The sister seems to have remembered the writer's earlier interest.",
					["「これ、いいね」と言ったのを覚えていてくれたらしい。", "自分でも同じ物を買おうと思っていた。"], "The remembered comment and the writer's own purchase plan show the choice matched a real wish.", [
						["The sister told the writer its exact high price.", "She said nothing about the price."],
						["The writer had already bought the same watch.", "買おうと思っていた is a prior intention, not a completed purchase."],
						["The watch was chosen without knowing the writer's tastes.", "The writer infers that the sister remembered their preference."]
					]),
				question("reference", "What does 同じ物 refer to?", "The same watch as the gift.",
					["姉から時計をもらった。", "自分でも同じ物を買おうと思っていた。"], "The watch is the item previously discussed and now received.", [
						["A different birthday present for the sister.", "The writer had wanted the watch for themselves."],
						["The shop where they spoke.", "物 refers to the item, not the shop."],
						["The price tag.", "The planned purchase concerns the watch, not its label."]
					]),
				question("purpose", "Which summary best captures the writer's attitude?", "Appreciation for a thoughtful gift they intend to treasure.",
					["覚えていてくれたらしい。", "大事に使いたい。"], "くれた frames the remembered kindness positively; 大事に使いたい states how the writer values the gift.", [
						["Annoyance at receiving an unwanted duplicate.", "They had planned to buy one but had not yet done so."],
						["Suspicion that the sister paid too little.", "高かっただろう suggests the opposite price assumption."],
						["A request for the sister to exchange the gift.", "No exchange is requested; the writer intends to use it carefully."]
					])
			]
		},
		{
			id: "room-change", level: 2, title: "An updated meeting notice",
			text: "最初のお知らせ：金曜日の説明会は三階の会議室で行います。\n追加のお知らせ：参加する人が増えたため、場所を一階のホールに変えます。開始時間は予定どおり午後二時です。受付は一時半からです。前のお知らせを受け取った方にも、この変更を伝えてください。",
			en: "The briefing moves from the third-floor meeting room to the first-floor hall, keeping its 2 p.m. start.",
			questions: [
				question("inference", "A friend only saw the first notice. Which correction do they need?", "Go to the first-floor hall; the 2 p.m. start is unchanged.",
					["場所を一階のホールに変えます。", "開始時間は予定どおり午後二時です。"], "The update changes location but explicitly preserves the start time.", [
						["Go to the third floor at 1:30 for the new start time.", "The third-floor location is obsolete; 1:30 is reception, not the start."],
						["Go to the first floor at 1:30 because the briefing starts early.", "Reception opens at 1:30, but the briefing still starts at 2."],
						["Stay home because too many participants caused cancellation.", "The event is moved, not canceled."]
					]),
				question("reference", "What is この変更 in the last sentence?", "The change of venue.",
					["場所を一階のホールに変えます。", "この変更を伝えてください。"], "The only changed arrangement is the room; the start time remains as planned.", [
						["The change from Friday to another day.", "Friday is not changed."],
						["The change from 2 p.m. to 1:30 p.m. for the start.", "These are different activities' times, not an earlier start."],
						["The cancellation of reception.", "Reception is still scheduled."]
					]),
				question("purpose", "Why ask readers to pass on the update?", "Some participants may still be relying on the old location.",
					["前のお知らせを受け取った方にも、この変更を伝えてください。"], "The request specifically targets people who received the earlier notice.", [
						["To recruit more participants because too few signed up.", "Attendance increased rather than being too low."],
						["To ask everyone to choose a new start time.", "The start time is already confirmed."],
						["To tell people not to attend reception.", "The notice gives reception's time, not a ban on attending."]
					])
			]
		},
		{
			id: "camera-loan", level: 2, title: "Before a school trip",
			text: "修学旅行で写真を撮りたくて、兄にカメラを貸してほしいと頼んだ。兄はその日に仕事で使うと言った。でも、友だちに聞いてくれて、別のカメラを借りられることになった。使い方も兄が教えてくれたので、安心して持っていけそうだ。",
			en: "The brother cannot lend his own camera, but arranges another loan through a friend and teaches the writer how to use it.",
			questions: [
				question("inference", "How did the brother help despite needing his own camera?", "He asked a friend about another camera and taught the writer how to use it.",
					["兄はその日に仕事で使うと言った。", "友だちに聞いてくれて", "使い方も兄が教えてくれた"], "His own camera is unavailable, but he still helps arrange and explain the alternative.", [
						["He canceled his work and lent his own camera.", "No canceled work is stated; a different camera becomes available."],
						["He bought the writer a new camera.", "借りられる indicates a loan, not a purchase."],
						["He refused to help any further.", "The following sentences describe his help."]
					]),
				question("reference", "Who is the omitted subject of 友だちに聞いてくれて?", "The brother.",
					["兄はその日に仕事で使うと言った。でも、友だちに聞いてくれて"], "The established subject continues after でも; くれて describes his help toward the writer.", [
						["The writer.", "The writer benefits from the brother asking; くれて points to help received."],
						["The school teacher.", "No teacher is introduced."],
						["The friend lending the camera.", "The friend is the person asked, marked by に."]
					]),
				question("reason", "Why does the writer now feel ready to take the camera?", "A camera has been arranged and the brother explained its use.",
					["別のカメラを借りられることになった。", "使い方も兄が教えてくれたので"], "Both availability and knowing how to operate it remove the practical worries.", [
						["The writer has decided not to take photographs.", "The original photography plan is still going ahead."],
						["The brother will go on the trip to take every photo.", "The brother is working that day; joining the trip is not stated."],
						["The writer has used this camera for years.", "The passage describes receiving instruction, not years of experience."]
					])
			]
		},
		{
			id: "cafe-tradeoff", level: 2, title: "Choosing where to study",
			text: "駅前のカフェは安いけれど、午後はいつも混んでいる。図書館は静かだが、今日は五時に閉まる。明日の試験の勉強を七時までしたいので、少し遠いが、九時まで開いている市民センターへ行くことにした。",
			en: "The writer chooses the farther community center because they need to study until seven and the library closes at five.",
			questions: [
				question("inference", "Which priority best explains the final choice?", "Having enough time to study into the evening.",
					["七時までしたいので", "九時まで開いている市民センターへ行くことにした。"], "The required study period rules out the library; the writer accepts distance to get sufficient opening hours.", [
						["Being as close to the station as possible.", "They deliberately choose somewhere farther away."],
						["Paying the lowest price mentioned.", "The cafe is cheap, but it is not chosen."],
						["Finishing all study before five.", "They want to continue until seven."]
					]),
				question("reason", "Why isn't the library sufficient, even though it is quiet?", "It closes before the writer wants to finish studying.",
					["今日は五時に閉まる。", "七時までしたいので"], "Combine the 5 p.m. closing time with the desired 7 p.m. finish.", [
						["It is described as noisier than the cafe.", "The library is explicitly quiet."],
						["It is closed for the entire day.", "It closes at five, not all day."],
						["It is farther away than the community center.", "That comparison of distances is not given."]
					]),
				question("purpose", "Why mention that the community center is 少し遠い?", "To show a drawback the writer accepts to meet their study needs.",
					["少し遠いが、九時まで開いている"], "が contrasts the inconvenience of distance with the useful later closing time.", [
						["To explain why the writer rejects the community center.", "The writer chooses it despite the distance."],
						["To say it is closer than the cafe.", "The text does not make that claim."],
						["To announce that it closes earlier than the library.", "It closes at nine, later than the library's five."]
					])
			]
		}
	];

	function buildBank(sources) {
		return sources.flatMap(source => source.questions.map((item, index) => ({
			...item, id: `${source.id}:${index}`, sourceId: source.id,
			title: source.title, text: source.text, en: source.en, level: source.level
		})));
	}

	function sourceKey(item) {
		return item.sourceId || item.text || item.sentence;
	}

	function skillKey(item) {
		return item.balanceKey || item.type || item.role || "interpretation";
	}

	function shuffle(items, random = Math.random) {
		const copy = [...items];
		for (let i = copy.length - 1; i > 0; i--) {
			const j = Math.floor(random() * (i + 1));
			[copy[i], copy[j]] = [copy[j], copy[i]];
		}
		return copy;
	}

	// One question per source per round; exhaust unseen sources before recent ones.
	function selectSession(bank, count, recent = [], random = Math.random) {
		let remaining = shuffle(bank, random);
		const seen = new Set(recent);
		const usedSkills = new Map();
		const selected = [];
		while (remaining.length && selected.length < count) {
			const fresh = remaining.filter(item => !seen.has(sourceKey(item)));
			const candidates = fresh.length ? fresh : remaining;
			const leastUsed = Math.min(...candidates.map(item => usedSkills.get(skillKey(item)) || 0));
			const item = candidates.find(candidate => (usedSkills.get(skillKey(candidate)) || 0) === leastUsed);
			selected.push({ ...item, options: item.options ? shuffle(item.options, random) : item.options });
			usedSkills.set(skillKey(item), (usedSkills.get(skillKey(item)) || 0) + 1);
			remaining = remaining.filter(candidate => sourceKey(candidate) !== sourceKey(item));
		}
		return selected;
	}

	return { passages, buildBank, sourceKey, skillKey, selectSession };
});
