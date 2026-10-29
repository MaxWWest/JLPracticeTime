(function(root, factory) {
    if (typeof module === "object" && module.exports) module.exports = factory();
    else root.N4MockBank = factory();
})(typeof globalThis === "object" ? globalThis : this, function() {
    "use strict";
    const forms=[], orders=[], passages=[];
    // Variants are authored together: the grammar decision and distractor logic stay valid.
    function family(id,domain,unit,focus,options,explanation,reasons,prompts,demand="meaning") {
        prompts.forEach((variant,i)=>{
            const prompt=typeof variant==="string"?variant:variant.prompt;
            const choices=typeof variant==="string"?options:variant.options;
            forms.push({id:`g-${id}-${i+1}`,family:id,section:"form",topic:focus,prompt,
                options:choices,answer:choices[0],explanation,review:{domain,unit,focus,demand,
                    distractors:Object.fromEntries(choices.slice(1).map((o,j)=>[o,reasons[j]]))}});
        });
    }
    family("destination","relations","particles-de-ni","Destination, not action site",["に","で","を","と"],
        "に marks the destination of the object being moved, not the place where the activity occurs.",
        ["で marks the site or means of an action. Here the noun is where the object ends up.","を would mark the moved object, which already has を.","と would mark a partner or a quotation, not the destination."],[
        "飲み終わったコップを流し（　）置いてください。",
        "旅行の前に、パスポートをかばん（　）入れました。",
        "この写真を壁（　）貼ってください。"]);
    family("event-site","relations","particles-de-ni","Event site versus existence",["で","に","を","へ"],
        "で identifies where an organized event takes place, even when the predicate is あります.",
        ["に locates an existing person or object. This sentence announces an event.","を does not mark the location of an event with あります.","へ marks direction, not the site of this event."],[
        "来週の土曜日、学校の体育館（　）コンサートがあります。",
        "今夜は駅の前の広場（　）お祭りがあります。",
        "明日は三階の会議室（　）説明会があります。"]);
    family("route","relations","particles-wo-to","Route of movement",["を","に","が","と"],
        "を marks the route traversed with 渡る or 通る, not just a direct object.",
        ["に can mark a destination, but the noun here is the route being traversed.","が would make the route itself the subject of movement.","と marks a companion or a quotation, not a route."],[
        "川の向こうに行くために、あの橋（　）渡りましょう。",
        "駅に行くときは、いつもこの道（　）通ります。",
        "信号が青になってから、横断歩道（　）渡ってください。"]);
    family("limited-positive","relations","particles-mo-shika","Only with a negative predicate",["しか","も","でも","から"],
        "しか pairs with a negative predicate to affirm a restricted amount: only that much is available.",
        ["も with this negative predicate would deny even that amount, not affirm the small amount available.","でも does not express the intended upper limit with this negative predicate.","から marks a starting point or source, not a restricted quantity."],[
        "今日は三十分（　）勉強できません。明日はもっと時間があります。",
        "会議に出たのは田中さんと私です。二人（　）いませんでした。",
        "財布には五百円（　）残っていません。千円の本は買えません。"]);
    family("zero","relations","particles-mo-shika","Not even one",["も","しか","だけ","ずつ"],
        "One + counter + も with a negative predicate emphasizes zero, not a small positive amount.",
        ["一つしかない would mean there is one, not zero. The context explicitly rules out any.","だけ does not create the 'not even one' construction required here.","ずつ distributes an amount; it does not express total absence."],[
        "全員欠席したので、会議には一人（　）来ませんでした。",
        "問題が難しすぎて、一問（　）答えられませんでした。全部空白です。",
        "箱は空でした。中にはりんごが一つ（　）ありませんでした。"]);
    family("minimum","relations","particles-wa-ga","A minimum amount",["は","しか","だけ","ずつ"],
        "は after a quantity can establish a lower bound: at least that amount, possibly more.",
        ["しか requires a negative predicate and expresses an upper restriction, not this minimum.","だけ would restrict the amount to this quantity, contrary to the possibility of more.","ずつ means that amount each or at a time, not a lower bound."],[
        "駅まで歩くと、少なくとも三十分（　）かかります。道が混んでいたら、もっとかかります。",
        "旅行には少なくとも三万円（　）必要です。それより多くかかるかもしれません。",
        "この仕事には少なくとも二人（　）必要です。一人ではできません。三人いればもっと早いです。"]);
    family("deadline","time","time-simultaneous","Deadline versus continuation",["までに","まで","から","の間"],
        "までに gives the latest time by which one completed action must occur. Earlier completion is allowed.",
        ["まで describes continuation up to a time, not the completion deadline stated here.","から would make that time the beginning, reversing the requirement.","の間 describes an interval and does not set this completion deadline."],[
        "図書館の本は来週の月曜日（　）返してください。今日返してもかまいません。",
        "参加する人は十日（　）申し込んでください。十一日からは受け付けません。",
        "飛行機は九時に出ます。八時（　）空港に着くようにしてください。早く着いても大丈夫です。"]);
    family("continuation","time","time-simultaneous","Continuation to an endpoint",["まで","までに","から","ごろから"],
        "まで sets the endpoint of the continuing activity; までに would set a deadline for completion.",
        ["までに would require completion by the time, not staying or continuing until it.","から would start the activity at that time, whereas the context has it already underway.","ごろから would give an approximate starting time, not the endpoint."],[
        "まだ帰らないでください。先生が戻る（　）、ここで待っていてください。",
        "店はもう開いています。今日は午後八時（　）開いています。八時に閉めます。",
        "今から六時（　）図書館で勉強します。六時になったら帰ります。"]);
    family("about-to","time","time-simultaneous","About to start",["出かける","出かけた","出かけている","出かけていた"],
        "Dictionary form + ところです means the action is about to start; it has not happened yet.",
        ["たところです means just after the action, but the speaker is still preparing to leave.","ているところです describes an action in progress, not one that has yet to start.","ていた describes an earlier ongoing action, not the imminent departure."],[
        "A：もう家を出ましたか。\nB：いいえ、今から（　）ところです。靴を履いています。",
        "A：買い物は終わりましたか。\nB：まだです。これからスーパーへ（　）ところです。",
        "A：今、話してもいいですか。\nB：すみません。ちょうどこれから（　）ところなので、あとで電話します。"]);
    family("just-finished","time","time-simultaneous","Just completed",["終わった","終わる","終わっている","終わりたい"],
        "たところです locates the speaker immediately after a completed action.",
        ["るところです means about to finish, but the context says it has already ended.","ている focuses on an ongoing or resulting state, not the just-completed stage expressed here.","たい states a wish, not an actual completion."],[
        "A：まだ会議中ですか。\nB：いいえ、今（　）ところです。みんな帰り始めました。",
        "A：宿題はまだですか。\nB：ちょうど（　）ところです。これから休みます。",
        "A：映画はもう始まりましたか。\nB：始まったのではなく、今（　）ところです。もう見られません。"]);
    family("preparation","time","preparation-completion","Preparation in advance",["おきます","あります","ほしいです","くれます"],
        "ておく describes the speaker doing something now as preparation for a later need.",
        ["てある describes an already prepared result, not the speaker's upcoming action.","てほしい expresses wanting someone else to act; the speaker explicitly does it personally.","てくれる describes someone else's favor to the speaker, not the speaker's own preparation."],[
        "明日は早いので、これから自分で旅行の荷物をまとめて（　）。",
        "お客さんが来る前に、今から私が部屋を掃除して（　）。",
        "明日の会議で使うので、これから私が資料をコピーして（　）。"]);
    family("result-state","time","preparation-completion","Deliberately created result",["あります","みます","もらいます","おきます"],
        "An object marked が + transitive verb てある describes a result someone deliberately created.",
        ["てみる is a trial by an actor. The object here is not performing that action.","てもらう makes a beneficiary the subject, not the object deliberately arranged.","ておく describes an actor preparing something, normally with the object marked を, not this resulting-state construction."],[
        "明日の予定がカレンダーに書いて（　）。",
        "お客さんのために、机の上にお茶が用意して（　）。",
        "パーティーのために、部屋に花が飾って（　）。"]);
    family("sequence","time","time-simultaneous","Order of two actions",["てから","る前に","ないで","ながら"],
        "てから puts the first completed action before the second. The other connections change the order or omit that action.",
        ["前に reverses the stated order.","ないで would omit the first action instead of completing it first.","ながら expresses simultaneity, not one completed prerequisite followed by another action."],[
        {prompt:"まず手を洗います。その後で食べます。手を（　）、ご飯を食べましょう。",options:["洗ってから","洗う前に","洗わないで","洗いながら"]},
        {prompt:"まず先生に聞きます。その後で決めます。先生に（　）、決めます。",options:["聞いてから","聞く前に","聞かないで","聞きながら"]},
        {prompt:"まず切符を買います。その後で乗ります。切符を（　）、電車に乗ります。",options:["買ってから","買う前に","買わないで","買いながら"]}]);
    family("experience","time","ability-experience","Past experience",["ことがあります","つもりです","ようにします","はずです"],
        "Vた + ことがある reports a past experience. The response confirms an event in the speaker's life.",
        ["つもり expresses intention and does not attach to this past form to report an experience.","ようにする expresses an effort or arrangement, not the experience asked about.","はず expresses an expectation, not the direct personal recollection supplied here."],[
        "A：日本で働いたことがありますか。\nB：はい、一年間働いた（　）。",
        "A：着物を着たことがありますか。\nB：はい、友達の結婚式で着た（　）。",
        "A：この料理を作ったことがありますか。\nB：はい、家で何度か作った（　）。"]);
    family("self-decision","stance","intention-decision","Own decision",["ことにしました","ことになりました","ところでした","ことがあります"],
        "ことにする presents a decision as one's own choice. ことになる presents an arrangement or outcome instead.",
        ["ことになりました presents an arrangement or resulting decision rather than emphasizing the speaker's own choice here.","ところでした locates an action stage in the past, not a decision.","ことがあります reports occasional occurrences or experience, not this new choice."],[
        "いろいろ考えて、自分で決めました。来年は留学する（　）。",
        "誰かに言われたのではありません。自分で考えて、たばこをやめる（　）。",
        "健康のために自分で決めたことです。毎朝歩く（　）。"]);
    family("external-decision","stance","intention-decision","External arrangement",["ことになりました","つもりでした","ことができました","ところでした"],
        "ことになる reports an arrangement set by circumstances or an external decision.",
        ["つもりでした reports a past personal intention, not the announced external arrangement.","ことができました reports ability or successful completion, not a future arrangement.","ところでした describes a past action stage, not an institutional decision."],[
        "学校から連絡がありました。来週の授業はオンラインで行う（　）。",
        "会社の決定で、来月から制服を着る（　）。",
        "先生が日程を変えたので、試験は金曜日に受ける（　）。"]);
    family("volitional","stance","intention-decision","Volitional intention",["勉強しよう","勉強して","勉強したら","勉強すれば"],
        "The volitional form + と思っています expresses a plan or intention.",
        ["The て-form does not express the quoted intention in this construction.","たら introduces a condition and leaves the intended consequent missing.","ば introduces a condition, not the volitional intention quoted here."],[
        "来年の試験に向けて、毎朝（　）と思っています。",
        "仕事が終わったら、図書館で（　）と思っています。",
        "旅行の前に、その国の言葉を少し（　）と思っています。"],"formation");
    family("hearsay","stance","appearance-hearsay","Reported information",["だそうです","そうなです","そうでしたそうです","だったらそうです"],
        "Hearsay そうです takes the plain clause. A present affirmative noun predicate keeps だ: Nだそうです.",
        ["そうな modifies a following noun; そうなです is not the reported noun predicate.","This duplicates incompatible endings instead of attaching hearsay to a plain clause.","だったら introduces a condition, not the plain statement being reported."],[
        "先生から聞きました。明日は休み（　）。",
        "店の人が言っていました。このかばんは日本製（　）。",
        "田中さんに聞きました。あの方は医者（　）。"],"formation");
    family("appearance","stance","appearance-hearsay","Visible signs versus a report",["降りそうです","降るそうです","降ったそうです","降らないそうです"],
        "The speaker draws an impression from visible signs. 降りそう expresses impending appearance; plain form + そう reports information.",
        ["降るそうです reports someone else's information. Here the speaker is judging the sky directly.","降ったそうです reports past rain, not the speaker's impression about what will happen.","降らないそうです reports that it will not rain and does not match the darkening sky."],[
        "見てください。空が急に暗くなりました。もうすぐ雨が（　）。",
        "黒い雲がこちらに来ていますね。雨が（　）。早く帰りましょう。",
        "天気予報は聞いていませんが、この空を見ると、雨が（　）。"]);
    family("possibility","stance","certainty-possibility","An uncertain possibility",["かもしれません","に違いありません","ではありません","のはずがありません"],
        "かもしれません leaves a possibility open without claiming certainty or ruling it out.",
        ["に違いありません asserts strong certainty, contrary to the explicitly uncertain context.","ではありません denies the possibility instead of considering it.","はずがありません rejects the possibility, rather than leaving it open."],[
        "まだ確認していませんが、明日は休み（　）。学校に聞いてみます。",
        "はっきり分かりません。あそこにいる人は新しい先生（　）。",
        "田中さんの予定は知りませんが、今日は仕事（　）。電話してみます。"]);
    family("no-obligation","stance","permission-obligation","Optional, not forbidden",["なくてもいいです","なければなりません","てはいけません","ないといけません"],
        "なくてもいい permits not doing something. It neither requires the action nor prohibits it.",
        ["なければなりません makes the action mandatory, contrary to the stated choice.","てはいけません prohibits the action, but the context permits it.","ないといけません expresses an obligation, not an option."],[
        "制服は自由です。着てもいいですが、{着|き}（　）。",
        "この問題は練習です。答えてもいいですが、答え（　）。",
        "会議は自由参加です。出てもいいですが、{出|で}（　）。"]);
    family("prohibition","stance","permission-obligation","A prohibition",["てはいけません","なくてもいいです","てもかまいません","なければなりません"],
        "てはいけません forbids the action; it is not merely an absence of obligation.",
        ["なくてもいい allows omission but still permits the action, which is forbidden here.","てもかまいません grants permission, contradicting the rule.","なければなりません requires the action, reversing the rule."],[
        {prompt:"ここは撮影禁止です。写真を（　）。",options:["撮ってはいけません","撮らなくてもいいです","撮ってもかまいません","撮らなければなりません"]},
        {prompt:"この水は飲めません。絶対に（　）。",options:["飲んではいけません","飲まなくてもいいです","飲んでもかまいません","飲まなければなりません"]},
        {prompt:"テスト中は話さないでください。隣の人と（　）。",options:["話してはいけません","話さなくてもいいです","話してもかまいません","話さなければなりません"]}]);
    family("negative-advice","stance","advice","Advice against an action",["ないほうがいいです","なくてもいいです","なければなりません","ないつもりです"],
        "ないほうがいい recommends avoiding an action. It is advice, not a personal plan or removal of a requirement.",
        ["なくてもいい removes an obligation but does not recommend against doing it.","なければなりません requires the action, the opposite of this advice.","ないつもりです states the speaker's intention rather than advising the listener."],[
        "医者としての助言です。熱があるときは、お酒を飲ま（　）。",
        "道が凍っているので、急いで走ら（　）。転ぶと危ないですよ。",
        "明日は試験ですから、今夜は遅くまで起きてい（　）。早く寝ましょう。"]);
    family("premise","linking","conditionals","Advice on an existing plan",["なら","のに","ために","ながら"],
        "なら takes up a plan just mentioned as the premise for relevant advice or an offer.",
        ["のに expresses an unexpected contrast, not advice based on the stated plan.","ために expresses a purpose or cause, not 'if that is your plan.'", "ながら expresses simultaneity and does not attach to the dictionary form used here."],[
        "A：来月京都に行きます。\nB：京都に行く（　）、この地図を持っていくといいですよ。",
        "A：新しいパソコンを買いたいです。\nB：買う（　）、駅前の店が安いですよ。",
        "A：明日は山に登ります。\nB：山に登る（　）、今日は早く寝てください。"]);
    family("restricted-topic","relations","conditionals","Restricted topic with なら",["なら","までに","ながら","のに"],
        "なら singles out the named case: 'as for that / if you mean that.' It is not a claim about the entire broader category.",
        ["までに marks a completion deadline, not a restricted topic.","ながら does not attach to this noun as a topic marker.","のに expresses concession and cannot connect this bare noun to the ability statement in this way."],[
        "A：日本語の新聞が読めますか。\nB：まだ難しいです。ひらがな（　）読めます。",
        "A：今週、いつでも手伝えますか。\nB：毎日は無理ですが、日曜日（　）手伝えます。",
        "A：どんな料理でも作れますか。\nB：いいえ。カレー（　）作れますが、ほかはまだ難しいです。"]);
    family("discovery","linking","conditionals","Discovery after an event",["たら","ても","ながら","るなら"],
        "たら links a completed event to what the speaker discovered afterward.",
        ["ても expresses concession, not the straightforward discovery narrated here.","ながら would make the actions simultaneous and does not attach to this verb form.","るなら sets up a premise rather than narrating this past discovery; it also does not attach to this form."],[
        "昨日、窓を開け（　）、外に雪が積もっていました。",
        "今朝、かばんを開け（　）、知らない人の本が入っていました。",
        "昨日、久しぶりに先生を訪ね（　）、先生は留守でした。"]);
    family("concession","linking","concession","Unexpected outcome",["のに","ので","ために","ように"],
        "のに connects an expectation with a contrary result. The second clause is not the expected consequence.",
        ["ので would give the first fact as a reason for the second, losing the stated contrast.","ために would present a purpose or cause, not the unexpected outcome here.","ように expresses a purpose or manner, not this factual contrast."],[
        "何度も練習した（　）、本番ではうまくできませんでした。",
        "{十分|じゅうぶん}寝た（　）、まだ眠いです。",
        "天気予報では晴れると言っていた（　）、一日中雨でした。"]);
    family("purpose-prevention","linking","purpose","Avoiding an unwanted outcome",["ように","のに","ところで","まま"],
        "Negative verb + ように sets an outcome to avoid and motivates the preventive action.",
        ["のに states an unexpected contrast, not the preventive aim of the action.","ところで marks an action stage, not a goal to avoid.","まま describes an unchanged state, not the purpose of the preventive measure."],[
        "忘れない（　）、大切なことはメモしています。",
        "風邪をひかない（　）、暖かい服を着てください。",
        "電車に遅れない（　）、いつも早めに家を出ます。"]);
    family("without","linking","listing-simultaneous","Doing without another action",["ないで","なければ","ないなら","ないために"],
        "ないで joins an omitted action to what the person actually did, rather than setting a condition or purpose.",
        ["なければ is conditional, not a report that the first action was omitted.","ないなら takes nonperformance as a premise, not the actual accompanying circumstance.","ないために makes nonperformance a purpose or reason, not simply something omitted."],[
        "昨日は急いでいたので、朝ご飯を食べ（　）出かけました。",
        "昨日、名前を書か（　）答案を出してしまいました。",
        "今朝は傘を持た（　）家を出たので、雨にぬれました。"]);
    family("explanatory-noun","structure","explanations","Explanation after a noun",["なんです","のです","だんです","にんです"],
        "A noun or na-adjective takes な before explanatory んです: Nなんです.",
        ["のです after a bare noun lacks the required な for this explanatory predicate.","だ becomes な before んです; だんです is not the form.","に is not the connector before explanatory んです."],[
        "A：どうして図書館が閉まっているんですか。\nB：今日は休み（　）。",
        "A：どうして甘い物を食べないんですか。\nB：今、ダイエット中（　）。",
        "A：どうして病院に行くんですか。\nB：今日は検査の日（　）。"],"formation");
    family("embedded-whether","structure","quotation","Whether or not",["かどうか","ように","ために","つもりで"],
        "かどうか embeds a yes-no question as the content to check, ask or remain unsure about.",
        ["ように would express a goal or manner, not an unresolved yes-no question.","ために would express purpose or cause, not the content being checked.","つもりで describes intention, not uncertainty about whether a statement is true."],[
        "明日、店が開いている（　）、電話で確認します。",
        "このカードが使える（　）、店員に聞いてください。",
        "田中さんが会議に来る（　）、まだ分かりません。"]);
    family("nominal-perception","structure","nominalization","Direct perception of an event",["のを","ことに","ために","つもりで"],
        "の nominalizes a directly perceived event; を marks that event as the object of seeing or hearing.",
        ["ことに is not the event object required by 見る or 聞く here.","ために introduces a purpose or reason, not the observed event.","つもりで expresses intention or an assumed stance, not the perceived event."],[
        "駅で、先生が電車に乗る（　）見ました。",
        "隣の部屋で、子供が歌っている（　）聞きました。",
        "窓から、弟が庭を走っている（　）見ました。"]);
    family("favor-toward-me","roles","giving-receiving","A favor toward the speaker",["くれました","あげました","もらいました","さしあげました"],
        "The helper is the subject and the speaker receives the benefit, so てくれる fits this viewpoint.",
        ["てあげる describes a favor outward to someone else, not this helper-to-speaker viewpoint.","てもらう would make the beneficiary the subject and normally mark the helper に.","てさしあげる is a humble outward favor, not an incoming favor to the speaker."],[
        "私が困っていたとき、友達が私にお金を貸して（　）。",
        "道に迷った私に、近くの人が道を教えて（　）。",
        "私が病気だったので、姉が私のために料理を作って（　）。"]);
    family("receiving-help","roles","giving-receiving","Recipient as subject",["もらいました","くれました","あげました","さしあげました"],
        "The speaker receives the service; the helper is marked に. That viewpoint uses てもらう.",
        ["てくれる would make the helper the subject, but the sentence makes 私 the beneficiary and marks the helper に.","てあげる would make the speaker provide the service, reversing the roles.","てさしあげる is an outward humble favor, also reversing these roles."],[
        "私は先生に作文を直して（　）。",
        "私は駅員さんに切符の買い方を教えて（　）。",
        "私は友達に空港まで送って（　）。"]);
    family("offer","roles","invitations-offers","Offering one's own help",["ましょうか","ませんか","てください","たいですか"],
        "ましょうか offers the speaker's action to benefit the listener. The reply accepts that offer.",
        ["ませんか invites or asks the listener to act, rather than offering the speaker's help.","てください asks the listener to do the work, reversing the intended helper.","たいですか asks about the listener's desire, not the speaker's offer."],[
        {prompt:"A：荷物が多いですね。私が一つ（　）。\nB：ありがとうございます。お願いします。",options:["持ちましょうか","持ちませんか","持ってください","持ちたいですか"]},
        {prompt:"A：その漢字が分からないんですか。私が（　）。\nB：はい、お願いします。",options:["読みましょうか","読みませんか","読んでください","読みたいですか"]},
        {prompt:"A：手が離せないんですね。私がドアを（　）。\nB：助かります。お願いします。",options:["開けましょうか","開けませんか","開けてください","開けたいですか"]}]);

    function composition(id,domain,unit,focus,variants) {
        variants.forEach(([before,chunks,after,explanation],i)=>orders.push({id:`g-order-${id}-${i+1}`,family:`order-${id}`,
            section:"order",topic:focus,before,chunks,after,star:2,options:chunks,answer:chunks[2],explanation,
            review:{domain,unit,focus,demand:"composition",roles:chunks.map((chunk,j)=>`Part ${j+1} of the model sequence: ${chunk}.`)}}));
    }
    composition("purpose","linking","purpose","Purpose clause before an action",[
        ["予定を忘れないように、手帳に",["書いて","おく","ことに","しました"],"。","書いておく is advance preparation; ことにしました states the speaker's decision to do it."],
        ["日本の大学で",["勉強する","ために","日本語を","習って"],"います。","勉強するために forms the purpose clause. 日本語を is the object of 習っています."],
        ["子供を",["起こさない","ように","静かに","歩いて"],"ください。","起こさないように is the preventive aim. 静かに modifies 歩いてください."]]);
    composition("restricted","relations","particles-mo-shika","Only with negative ability",[
        ["この切符は駅の",["窓口で","しか","買うことが","できません"],"。","駅の modifies 窓口; でしか limits the place; 買うことができません supplies the negative ability required by しか."],
        ["この料理は夏に",["なると","ここでしか","食べることが","できません"],"。","夏になると gives the season; ここでしか limits the place; 食べることができません completes the negative ability."],
        ["今の私は",["ひらがなで","書いてある","本しか","読めません"],"。","ひらがなで書いてある modifies 本. 本しか読めません limits which books the speaker can read."]]);
    composition("question","structure","quotation","Embedded question",[
        ["先生に、この漢字を",["どう","読む","のか","聞きました"],"。","どう読むのか is the embedded question; 聞きました takes the whole question as its content."],
        ["明日の試験が",["何時に","始まるか","先生に","聞きます"],"。","何時に始まるか is the complete embedded question. 先生に marks whom the speaker will ask."],
        ["まだ、会議に誰が",["来る","か","分かって","いません"],"。","誰が来るか is the complete embedded question; 分かっていません says it is not known."]]);
    composition("comparison","relations","comparisons","Action comparisons",[
        ["私には、漢字を",["読む","より","書く","ほうが"],"難しいです。","読むより establishes the reference action; 書くほうが identifies the more difficult action."],
        ["この町では、バスに乗る",["より","歩く","ほうが","早い"],"です。","より ends the bus comparison standard; 歩くほうが identifies walking as faster."],
        ["この部屋は隣の部屋",["ほど","広く","ありません","が"],"、明るいです。","ほど requires the negative comparison 広くありません; が then connects the contrasting positive feature."]]);
    composition("change","time","change-habits","Change in ability or habit",[
        ["毎日練習して、",["自転車に","乗れる","ように","なりました"],"。","乗れる is potential; ようになりました marks gaining that ability."],
        ["日本に来てから、",["朝ご飯を","食べる","ように","なりました"],"。","食べるようになりました reports a new habit, not a completed single breakfast."],
        ["毎晩、薬を",["飲む","ことに","して","います"],"。","薬を飲む is the activity; ことにしています expresses a standing decision to maintain it."]]);
    composition("preparation","time","preparation-completion","Preparation and resulting state",[
        ["旅行の前に、ホテルを",["予約して","おいた","ほうが","いい"],"です。","予約しておいた combines preparation with the た form needed by affirmative advice ほうがいい."],
        ["机の上には、お客さんのために",["お茶が","用意して","ある","ので"],"、どうぞ。","お茶が用意してある describes the prepared result; ので connects it to the invitation."],
        ["明日の朝すぐ出られるように、",["荷物を","まとめて","おいて","ください"],"。","荷物を is the object; まとめておいてください requests preparation in advance."]]);
    composition("benefit","roles","giving-receiving","Beneficiary and action",[
        ["私は友達にこの",["写真を","撮って","もらった","ことが"],"あります。","撮ってもらった makes the speaker the recipient of the favor; ことがあります adds experience."],
        ["私のために、姉が",["作って","くれた","料理は","おいしかった"],"です。","作ってくれた is a relative clause modifying 料理; the sister's action benefits the speaker."],
        ["弟に、宿題を",["手伝って","ほしい","と","言われました"],"。","手伝ってほしい is the quoted wish; と marks the quote in the passive report 言われました."]]);
    composition("nominal","structure","nominalization","Nominalized clauses",[
        ["私が探して",["いる","のは","この","本"],"です。","探している is the clause; のは nominalizes and topicalizes it; この本 identifies what is sought."],
        ["私の仕事は、お客さんに",["商品の","使い方を","説明する","こと"],"です。","商品の modifies 使い方; 説明すること nominalizes the activity that defines the job."],
        ["昨日、駅で先生が",["切符を","買っている","のを","見ました"],"。","切符を買っている is the observed event; のを makes it the object of 見ました."]]);
    composition("intention","stance","intention-decision","Intention and a change of plan",[
        ["今年の夏は",["海に","行こう","と","思って"],"います。","行こう is volitional; と思っています marks an intention; 海に supplies its destination."],
        ["今日は出かける",["つもり","でした","が","やめました"],"。","つもりでした states the earlier plan; が introduces its cancellation."],
        ["来週から、この",["会社で","働く","ことに","なりました"],"。","この会社で modifies 働く; ことになりました reports the resulting arrangement."]]);

    function passage(id,title,paragraphs,items) {
        passages.push({id,title,paragraphs,questions:items.map(([domain,unit,focus,options,explanation,reasons],i)=>({
            id:`g-text-${id}-${i+21}`,family:`passage-${id}`,section:"text",topic:focus,options,answer:options[0],explanation,
            review:{domain,unit,focus,demand:"discourse",distractors:Object.fromEntries(options.slice(1).map((o,j)=>[o,reasons[j]]))}}))});
    }
    passage("library","図書館からのお知らせ",[
        "来月から、図書館は月曜日も開ける【21】。市が決めた新しい予定です。本を借りるにはカードが必要です。カードを持っていない人は、受付で作って【22】。",
        "本は二週間【23】返してください。二週間より前に返すこともできます。読んでいる途中なら、一度だけ期間を長くできます。",
        "ただし、ほかの人がその本を予約している【24】、期間を長くすることはできません。予約がある【25】、受付で確認してください。"
    ],[
        ["stance","decisions","Externally decided schedule",["ことになりました","つもりでした","ことがありました","ところでした"],"The city has decided a new opening schedule. ことになる presents that arrangement.",["This is a past intention, not the city's new arrangement.","This reports occasional past events, not the new schedule.","This reports a past action stage, not an external decision."]],
        ["roles","giving","Receiving a service",["もらえます","くれます","あげます","います"],"Visitors can have a card made at reception: 作ってもらえます keeps the visitor as recipient.",["くれる would make the helper the subject, not the cardless visitor.","あげる would make the visitor provide the service to someone else.","作っています would describe making it already, not the service available to a visitor."]],
        ["time","time","Return deadline",["以内に","の間","から","ずつ"],"以内に gives the permitted time within which to complete the return; earlier return is explicitly allowed.",["の間 would describe an interval, not a latest completion time.","から would begin the return period after two weeks.","ずつ distributes a quantity and does not set a return deadline."]],
        ["linking","conditionals","Conditional restriction",["場合は","のに","ための","ところを"],"An existing reservation is the condition under which renewal is unavailable.",["のに would make the ban surprising despite the reservation, rather than conditional on it.","ための requires a following noun and cannot link these clauses.","ところを is not the conditional restriction expressed here."]],
        ["structure","quotation","Checking whether",["かどうか","つもりか","ために","ように"],"The visitor checks the yes-no question of whether a reservation exists.",["つもり describes intention; a reservation cannot hold an intention.","ために would make a purpose instead of the question to check.","ように would mark a purpose or manner, not the information being checked."]]
    ]);
    passage("trip","旅行の準備",[
        "来週、初めて一人で旅行します。電車は二時間、バスは四時間かかります。つまり、【21】。今回は早く着きたいので、電車の切符を買いました。",
        "友達にホテルを紹介して【22】。でも、予約はまだしていません。部屋がなくなると困るので、今夜予約して【23】つもりです。",
        "天気予報では、旅行の日は晴れる【24】。雨の場合も楽しめるように、博物館の場所も調べました。友達から「その町に行く【25】、駅の近くのお菓子を食べてみて」と言われました。"
    ],[
        ["relations","comparison","Travel-time comparison",["バスは電車ほど早くありません","電車はバスほど早くありません","バスのほうが電車より早いです","電車とバスは同じくらい早いです"],"The bus takes longer: it is not as fast as the train. ほど with a negative predicate preserves that relationship.",["This makes the train slower, reversing the given journey times.","This makes the bus faster, reversing the given journey times.","This makes the journeys equally fast despite their different durations."]],
        ["roles","giving","Receiving an introduction",["もらいました","くれました","あげました","さしあげました"],"The writer receives the friend's help; 友達に marks the helper in てもらう.",["くれる would make the friend the subject, normally 友達が.","あげる reverses who is helping whom.","さしあげる is a humble outward favor, not receiving the friend's help."]],
        ["time","te-auxiliary","Advance preparation",["おく","ある","いた","くれた"],"予約しておく prepares for the later trip. The booking has not yet been made.",["てある describes an already prepared result, not the writer's planned action.","ていた moves the booking into a past ongoing state.","てくれた reports someone else's completed favor, not the writer's intention."]],
        ["stance","hearsay","Weather report",["そうです","ところです","つもりです","ことです"],"The plain clause 晴れる + そうです reports the forecast.",["ところです would locate an action stage, not report the forecast.","The weather cannot hold an intention.","ことです does not mark the reported forecast in this sentence."]],
        ["linking","tara-nara","Advice based on a plan",["なら","のに","ながら","ための"],"なら takes up the proposed trip as the premise for a recommendation.",["のに presents a surprising contrast, not advice on the plan.","ながら cannot attach to dictionary-form 行く and would express simultaneity.","ための modifies a following noun, which is absent here."]]
    ]);
    passage("repair","自転車の修理",[
        "昨日、自転車に乗ろうとしたら、タイヤの空気がありませんでした。自分では直せなかったので、店の人に直して【21】。",
        "修理には一時間かかると言われました。店の中で待つ【22】、近くの図書館で本を読んで待ちました。一時間後に戻ると、修理はもう【23】。すぐに乗って帰れました。",
        "店の人は「また空気が少なくなったら、乗らない【24】いいですよ」と言いました。今後は乗る前にタイヤを調べる【25】しました。"
    ],[
        ["roles","giving","Receiving repair help",["もらいました","くれました","あげました","みました"],"The shop worker provides the repair; the writer receives it through てもらう.",["くれる would make the worker the subject, not mark that helper に.","あげる would mean the writer repaired it for the worker.","てみる would mean trying the repair oneself, contrary to the stated inability."]],
        ["relations","comparison","Alternative to an action",["かわりに","ために","ように","前に"],"The writer waits at the library instead of inside the shop.",["Reading at the library is not a means to waiting inside the shop.","ように would make waiting inside the shop the goal, which the library choice replaces.","前に would imply later waiting in the shop; the account instead describes the library as the waiting place."]],
        ["time","te-auxiliary","Completed repair",["終わっていました","始めるところでした","始めようと思いました","終わる前でした"],"もう and the completed visit support finding the repair finished on return.",["This says the work was only about to begin, rather than already completed.","This introduces an actor's intention instead of the repair's state.","This places the repair before completion, contrary to もう in this account."]],
        ["stance","advice","Negative advice",["ほうが","ことが","ために","ところが"],"Vないほうがいい recommends not riding with low tire pressure.",["ことがいい is not the negative-advice construction.","ために marks purpose, not the recommended choice.","ところが is not the connector in Vないほうがいい."]],
        ["stance","decisions","Personal preventive decision",["ことに","ことが","ところに","ために"],"ことにしました marks the writer's decision to check before riding.",["ことがしました is not the decision construction.","ところに marks a time or place, not deciding on a routine.","ためにしました does not express adopting this routine."]]
    ]);
    passage("meal","昼ご飯の店",[
        "今日、同僚と昼ご飯を食べに行きました。いつもの店は休みだった【21】、新しい店に入りました。入口にはメニューが貼って【22】。",
        "私は{辛い|からい}料理が苦手です。店員に{辛く|からく}ない料理がある【23】聞くと、野菜のスープをすすめてくれました。",
        "スープは安い【24】、量が多くて驚きました。同僚は「全部食べられなければ、残して【25】よ」と言いました。でも、おいしかったので全部食べました。"
    ],[
        ["linking","reason","Reason for changing restaurants",["ので","のに","なら","ように"],"The usual restaurant being closed caused the choice of a different restaurant.",["のに would make entering a different shop contrary to expectation, rather than its natural consequence.","なら treats the closure as a premise, rather than narrating the known reason in this past account.","ように would mark a purpose or manner, not this factual reason."]],
        ["time","te-auxiliary","Displayed result",["ありました","いました","みました","もらいました"],"メニューが貼ってある describes the result of someone posting the menu.",["The menu is not performing 貼る; ている does not create this transitive result construction with メニューが.","The menu cannot try posting something.","The menu is not the beneficiary of a favor."]],
        ["structure","quotation","Embedded yes-no question",["かどうか","つもりか","ように","ために"],"The writer asks whether a non-spicy dish exists.",["A dish does not have an intention to exist.","ように would introduce a goal rather than the question being asked.","ために introduces purpose, not the content of the question."]],
        ["linking","concession","Unexpected value",["のに","ので","ために","ように"],"The writer finds the large portion surprising despite the low price.",["ので would make cheapness the reason for a large portion instead of the surprise expressed here.","ために would express cause or purpose, not the unexpected contrast.","ように does not link these facts as a concession."]],
        ["stance","permission","Permission to leave food",["もいいです","はいけません","みませんでした","おきました"],"The colleague permits leaving some food if the writer cannot finish.",["はいけません would prohibit leaving food, reversing the reassurance.","This reports not trying an action in the past, not permission.","This reports completed preparation, not permission."]]
    ]);
    passage("club","写真クラブ",[
        "大学に入ってから、写真クラブに参加しています。初めはカメラの使い方が分からなかったので、先輩に教えて【21】。今では自分で明るさを変えられる【22】なりました。",
        "先週は公園で写真を撮りました。公園に着い【23】、思っていたより人が多くて驚きました。人の顔が大きく写らない【24】気をつけました。",
        "来月は町の写真展に出す写真を選びます。先生には、上手な写真だけでなく、自分が好きな写真を選んで【25】と言われました。"
    ],[
        ["roles","giving","Learning through another's help",["もらいました","くれました","あげました","いました"],"先輩に marks the source of the help that the writer receives.",["くれる would make the senior the subject rather than mark them に.","あげる would reverse the direction of teaching.","教えていました makes the writer the teacher, contradicting the lack of knowledge."]],
        ["time","change","New ability",["ように","ことに","ために","ところに"],"Potential verb + ようになる expresses an acquired ability.",["ことになる reports an arrangement, not developing an ability.","ためになる does not express becoming able to adjust the camera.","ところになる is not the ability-change construction."]],
        ["linking","tara-nara","Discovery on arrival",["たら","ても","ながら","るなら"],"着いたら introduces the scene discovered after arriving.",["ても would introduce concession, not the straightforward arrival and discovery.","ながら does not attach to 着い and would imply simultaneity.","るなら does not attach to 着い and would set a hypothetical premise."]],
        ["linking","purpose","Preventive care",["ように","のに","ところで","ための"],"写らないように気をつける means taking care to avoid a particular outcome.",["のに would assert a contrary fact instead of the outcome to prevent.","ところで does not express the purpose of the care.","ための needs a following noun and cannot introduce 気をつけました here."]],
        ["roles","permission","Reported request",["ください","もらいました","くれました","しまいました"],"選んでください is the teacher's request, quoted with と言われました.",["This would quote the teacher as reporting receipt of a past selection, not requesting the writer's choice.","This would quote a completed favor, not an instruction for the upcoming exhibition.","This would quote a completed selection, contrary to the future choice."]]
    ]);
    passage("delivery","荷物についてのメール",[
        "山田さん、送ってくれた荷物が今日届きました。仕事から帰っ【21】、玄関に大きな箱がありました。開けてみると、故郷のお菓子が入っていました。",
        "日本に来てから、このお菓子を食べた【22】ので、とてもうれしかったです。明日、友達にも少し食べて【23】と思っています。",
        "箱の中には手紙も入っていました。忙しい【24】、送ってくれてありがとう。今度会うときには、私が料理を作ろう【25】。ぜひ家に来てください。"
    ],[
        ["linking","tara-nara","Discovery after returning",["たら","ても","ながら","るなら"],"帰ったら sets up the discovery made on arriving home.",["ても would make the discovery a concession instead of the sequence narrated.","ながら does not attach to 帰っ and would mean simultaneity.","るなら is not the form after 帰っ and would set a hypothetical plan."]],
        ["time","experience","No prior experience in this period",["ことがなかった","ことにした","ところだった","つもりだった"],"The writer had not eaten this sweet since coming to Japan, which explains the delight.",["ことにした is a decision, not the absence of earlier experience.","たところだった means just having eaten it, contrary to the reason for delight at receiving it.","たつもりだった means believing one had eaten it, not lacking the experience."]],
        ["roles","giving","Having friends try food",["もらおう","くれよう","あげよう","しまおう"],"The writer intends to have friends eat some: 友達にも食べてもらおう.",["くれる would require the friends as subject and does not fit this recipient-centered construction.","あげる would make the writer eat it for the friends, not have them try it.","しまう would make the writer finish eating; 友達にも does not supply the eater in that construction."]],
        ["linking","concession","Thanks despite a difficulty",["のに","ので","ために","ように"],"のに recognizes that the favor was done despite the recipient's busy schedule.",["ので would make busyness the reason for sending the package, rather than an obstacle overcome.","ために would present a cause or purpose, not this appreciative concession.","ように cannot connect the adjective to this expression of thanks."]],
        ["stance","intention","Voluntary future action",["と思っています","ようにしています","ことがあります","ところです"],"The volitional 作ろう + と思っています expresses the writer's plan to cook for the next visit.",["ようにする attaches to the dictionary or negative form, not the volitional, and describes an effort or routine.","ことがある takes a dictionary or past verb form, not the volitional intention.","ところです describes an action stage with a dictionary, progressive or past form, not the volitional."]]
    ]);
    passage("pool","プールを使う人へ",[
        "このプールは午前九時から午後六時【21】使えます。六時には建物を閉めますので、それまでに着替えを終えてください。",
        "プールに入る前に、必ずシャワーを浴び【22】。水着のほかに帽子も必要です。帽子を忘れた人は、受付で借りる【23】。",
        "プールの横は滑りやすいので、走っ【24】。また、一人で泳ぐことができない子供は、必ず大人と一緒に入ってください。どこまで泳げる【25】、係の人に伝えてください。"
    ],[
        ["time","time","Opening interval",["まで","までに","から","だけで"],"The sentence specifies the usable interval from nine until six, not a deadline for a single action.",["までに would set a completion deadline, not the period of availability.","から would start the availability at six instead of ending it.","だけで does not connect the start and end of this interval."]],
        ["stance","permission","Required preparation",["なければなりません","なくてもいいです","てはいけません","ないほうがいいです"],"The posted rule requires a shower before entering.",["This removes the shower requirement.","This prohibits showering, reversing the rule.","This advises against showering, also reversing the rule."]],
        ["structure","ability","Available facility",["ことができます","ことにしました","つもりでした","ところでした"],"ことができる expresses an available possibility for visitors.",["This reports a personal past decision instead of a service available to any visitor.","This reports a past intention, not the borrowing facility.","This reports a past action stage, not availability."]],
        ["stance","permission","Prohibition for safety",["てはいけません","てもいいです","てほしいです","てください"],"The slippery surface motivates a rule against running.",["This grants permission to run, contrary to the safety warning.","This expresses a wish for running, contrary to the warning.","This instructs visitors to run, the opposite of the rule."]],
        ["structure","quotation","Embedded extent question",["か","のに","ために","ように"],"どこまで泳げるか embeds the question of the child's swimming range as information to tell the attendant.",["のに makes a concession, not the information to convey.","ために introduces purpose rather than the embedded question.","ように would make a goal, not specify what to tell the attendant."]]
    ]);
    passage("move","引っ越した部屋",[
        "先月、駅の近くに引っ越しました。前の部屋から駅までは歩いて二十分でした。今はちょうど五分です。五分【21】かかりません。",
        "部屋は前より狭い【22】、窓が大きくて明るいです。引っ越す前に、友達に家具を運ぶのを手伝って【23】。お礼に晩ご飯をごちそうしました。",
        "荷物はもう全部片づけました。本棚には、本がきれいに並べて【24】。これからは、この部屋で毎晩日本語を【25】と思っています。"
    ],[
        ["relations","particles-mo-shika","Only a short time",["しか","も","まで","から"],"しか with a negative predicate affirms that the trip takes only five minutes.",["もかかりません would mean not even five minutes, not the stated five-minute journey.","まで does not create the limited-duration construction with かかりません.","から marks a starting point, not how little time the trip takes."]],
        ["linking","concession","Contrasting attributes",["ですが","ですから","ので","ように"],"The writer contrasts smaller size with the positive feature of brightness.",["ですから would claim the small size causes the large bright window.","ので would likewise make size the reason for brightness.","ように does not connect the factual contrast."]],
        ["roles","giving","Receiving moving help",["もらいました","くれました","あげました","さしあげました"],"友達に is the helper; the writer receives help and later thanks that friend.",["くれる would make the friend the subject, not mark the helper に.","あげる reverses the favor and conflicts with the writer giving thanks.","さしあげる also describes providing, not receiving, help."]],
        ["time","te-auxiliary","Result of arranging",["あります","います","みます","もらいます"],"本が並べてある describes books left arranged by someone's deliberate action.",["The books do not perform the transitive action 並べる.","The books cannot try arranging something.","The books are not recipients of a favor."]],
        ["stance","intention","Intended routine",["勉強しよう","勉強して","勉強すれば","勉強したら"],"The volitional 勉強しよう followed by と思っています expresses the intended future routine.",["The te-form cannot express the quoted intention in this construction.","ば introduces an unfinished condition, not an intention.","たら introduces an unfinished condition, not the volitional plan."]]
    ]);
    passage("work","初めてのアルバイト",[
        "今月からパン屋で働いています。初日は何をすればいい【21】分からず、緊張しました。店長が一つずつ教えて【22】ので、少しずつ慣れてきました。",
        "朝は、お客さんが来る前に袋を用意して【23】。忙しいときにすぐ使えるからです。パンを並べる仕事もします。",
        "この店では、売れ残ったパンを家に持って帰って【24】。店長が許可しています。ただし、店が閉まる【25】、売るためのパンは持ち出さないでください。"
    ],[
        ["structure","quotation","Embedded what-to-do question",["か","が","のに","ために"],"何をすればいいか embeds the question of what to do before 分からず.",["が marks a subject but does not close this embedded question.","のに makes a concession, not an unknown question.","ために introduces purpose rather than the unknown task."]],
        ["roles","giving","Help from the manager",["くれた","もらった","あげた","さしあげた"],"The manager is the subject and the writer benefits from being taught, so くれる fits.",["もらう would make the manager receive the teaching, reversing the roles.","あげる does not express the incoming favor toward the writer from this viewpoint.","さしあげる is humble outward giving, not the manager's incoming help."]],
        ["time","te-auxiliary","Advance preparation",["おきます","みました","もらいました","しまいました"],"ておく presents preparing bags in advance for the busy period as a routine.",["てみました is a past trial, not this routine preparation.","てもらいました reports a past favor instead of the writer's routine task.","てしまいました reports completed past action, not the preparation routine."]],
        ["stance","permission","Permission",["もいいです","はいけません","もよくないです","ほしくないです"],"The manager explicitly permits taking leftover bread home.",["This prohibits what the manager permits.","This denies permission, contradicting the following sentence.","This expresses a negative wish rather than the explicit permission."]],
        ["time","time","Before closing",["までは","までには","からは","ためには"],"までは contrasts the period before closing, when bread is still for sale, with afterward.",["までには would turn the clause into a completion deadline, not the period during which taking bread is forbidden.","からは would prohibit taking it after closing instead, reversing the contrast with leftovers.","ためには makes closing a purpose, not a time boundary."]]
    ]);
    const units={"time-simultaneous":"time","preparation-completion":"te-auxiliary","ability-experience":"experience","intention-decision":"decisions","appearance-hearsay":"appearance","certainty-possibility":"certainty","permission-obligation":"permission","listing-simultaneous":"particles-te-links","explanations":"particles-no-koto","nominalization":"particles-no-koto","giving-receiving":"giving","invitations-offers":"invitation","comparisons":"comparison","change-habits":"change"};
    for(const q of [...forms,...orders,...passages.flatMap(p=>p.questions)])q.review.unit=units[q.review.unit]||q.review.unit;
    const readings=[
        ["飲め","のめ"],["作れ","つくれ"],["出られ","でられ"],["着き","つき"],["持ち出さ","もちださ"],["少なく","すくなく"],
        ["流し","ながし"],["旅行","りょこう"],["貼","は"],["体育館","たいいくかん"],["広場","ひろば"],["三階","さんがい"],["会議室","かいぎしつ"],["説明会","せつめいかい"],["説明","せつめい"],
        ["向こう","むこう"],["渡","わた"],["通る","とおる"],["通り","とおり"],["信号","しんごう"],["青","あお"],["出た","でた"],["出す","だす"],["出して","だして"],["出かける","でかける"],["出かけた","でかけた"],
        ["五百円","ごひゃくえん"],["千円","せんえん"],["全員","ぜんいん"],["欠席","けっせき"],["難し","むずかし"],["一問","いちもん"],["空白","くうはく"],["混","こ"],["三万円","さんまんえん"],["必要","ひつよう"],["安心","あんしん"],
        ["十日","とおか"],["申し込","もうしこ"],["十一日","じゅういちにち"],["受け付け","うけつけ"],["着く","つく"],["大丈夫","だいじょうぶ"],["帰","かえ"],["戻る","もどる"],["閉","し"],["履","は"],["買い物","かいもの"],["見る","みる"],["見られ","みられ"],
        ["お茶","おちゃ"],["飾","かざ"],["ご飯","ごはん"],["聞か","きか"],["聞く","きく"],["一年間","いちねんかん"],["着物","きもの"],["着た","きた"],["結婚式","けっこんしき"],["作っ","つくっ"],["作り","つくり"],
        ["考え","かんがえ"],["留学","りゅうがく"],["授業","じゅぎょう"],["行う","おこなう"],["制服","せいふく"],["着る","きる"],["着て","きて"],["着なく","きなく"],["着な","きな"],["日程","にってい"],["向け","むけ"],["日本製","にほんせい"],["あの方","あのかた"],
        ["急に","きゅうに"],["暗く","くらく"],["黒い","くろい"],["雲","くも"],["自由","じゆう"],["撮影","さつえい"],["禁止","きんし"],["撮","と"],["飲ま","のま"],["飲む","のむ"],["絶対","ぜったい"],["助言","じょげん"],
        ["凍","こお"],["走","はし"],["転ぶ","ころぶ"],["危ない","あぶない"],["遅く","おそく"],["安い","やすい"],["山","やま"],["登","のぼ"],["今週","こんしゅう"],["積","つ"],["今朝","けさ"],["久しぶり","ひさしぶり"],["訪ね","たずね"],["留守","るす"],
        ["本番","ほんばん"],["眠い","ねむい"],["風邪","かぜ"],["服","ふく"],["早め","はやめ"],["書か","かか"],["答案","とうあん"],["甘い","あまい"],["甘い物","あまいもの"],["病院","びょういん"],["検査","けんさ"],["使え","つかえ"],["店員","てんいん"],
        ["子供","こども"],["迷","まよ"],["近く","ちかく"],["直し","なおし"],["直せ","なおせ"],["直す","なおす"],["駅員","えきいん"],["買い方","かいかた"],["多い","おおい"],["離せ","はなせ"],["手帳","てちょう"],["静か","しずか"],["明るい","あかるい"],["広く","ひろく"],
        ["乗れ","のれ"],["毎晩","まいばん"],["予約","よやく"],["伝","つた"],["探","さが"],["商品","しょうひん"],["使い方","つかいかた"],["今年","ことし"],["行こう","いこう"],["海","うみ"],["以内","いない"],["思い","おもい"],["先輩","せんぱい"],["写","うつ"],["気","き"],
        ["二週間","にしゅうかん"],["返す","かえす"],["期間","きかん"],["長く","ながく"],["準備","じゅんび"],["紹介","しょうかい"],["困る","こまる"],["博物館","はくぶつかん"],["場所","ばしょ"],["修理","しゅうり"],["乗ろう","のろう"],["乗ら","のら"],["空気","くうき"],
        ["待つ","まつ"],["待ち","まち"],["少なく","すくなく"],["今後","こんご"],["同僚","どうりょう"],["入口","いりぐち"],["苦手","にがて"],["量","りょう"],["驚き","おどろき"],["残","のこ"],["初め","はじめ"],["明るさ","あかるさ"],["大きく","おおきく"],
        ["写真展","しゃしんてん"],["選","えら"],["届き","とどき"],["大きな","おおきな"],["故郷","ふるさと"],["使い","つかい"],["建物","たてもの"],["着替え","きがえ"],["浴び","あび"],["水着","みずぎ"],["帽子","ぼうし"],["横","よこ"],["滑り","すべり"],["大人","おとな"],["係","かかり"],
        ["引っ越し","ひっこし"],["引っ越す","ひっこす"],["先月","せんげつ"],["狭い","せまい"],["お礼","おれい"],["晩ご飯","ばんごはん"],["片づけ","かたづけ"],["本棚","ほんだな"],["今月","こんげつ"],["パン屋","ぱんや"],["初日","しょにち"],["店長","てんちょう"],["慣","な"],["袋","ふくろ"],["許可","きょか"],["売る","うる"]
    ];
    return {forms,orders,passages,readings};
});
