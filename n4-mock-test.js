(function(root, factory) {
    if (typeof module === "object" && module.exports) module.exports = factory(require("./grammar-practice-core.js"), require("./n4-mock-v1.js"), require("./n4-mock-review.js"));
    else root.N4MockTest = factory(root.GrammarPracticeCore, root.N4MockV1, root.N4MockReview);
})(typeof globalThis === "object" ? globalThis : this, function(core, legacy, review) {
    "use strict";
    const version = "n4-mock-v2";
    const sections = [
        {id:"form",title:"Grammar forms",count:15,instruction:"Choose the best expression for the blank."},
        {id:"order",title:"Sentence composition",count:5,instruction:"Arrange all four parts. Choose the part that belongs at ★."},
        {id:"text",title:"Text grammar",count:5,instruction:"Choose the expression that fits this gap and the passage."}
    ];
    function form(id,topic,prompt,options,answer,explanation) {
        return {id,section:"form",topic,prompt,options,answer,explanation};
    }
    function order(id,topic,before,chunks,after,explanation) {
        return {id,section:"order",topic,before,chunks,after,star:2,options:chunks,answer:chunks[2],explanation};
    }
    function text(id,topic,options,answer,explanation) {
        return {id,section:"text",topic,options,answer,explanation};
    }
    const papers = [
        {id:"a",title:"Paper A",questions:[
            form("a1","Destination particle","読み終わった本は、この箱（　）入れてください。",["に","で","を","と"],"に","に marks the container receiving the books. で would mark where an activity happens, not where the books are put."),
            form("a2","Departure particle","急いでバス（　）降りたので、傘を忘れてしまいました。",["を","に","が","と"],"を","降りる takes を for the vehicle being left. に would suit boarding with 乗る, not getting off."),
            form("a3","Deadline","レポートは金曜日（　）出してください。早く出してもかまいません。",["までに","まで","から","の間"],"までに","までに sets a deadline and permits earlier completion. まで describes continuation up to an endpoint."),
            form("a4","Appearance","湯気が出ていますね。このスープはまだ（　）。",["熱そうです","熱いそうです","熱くなさそうです","熱かったそうです"],"熱そうです","The speaker is judging the soup from visible steam. 熱そうです expresses that impression; 熱いそうです reports information from someone else. Nothing here supplies such a report."),
            form("a5","Experience","A：北海道に行ったことがありますか。\nB：いいえ、一度も（　）。",["行ったことがありません","行くことがあります","行ったところです","行くことにしました"],"行ったことがありません","一度も + negative experience means never having done it. A recent action or a new decision does not answer this experience question."),
            form("a6","Intention","明日から毎朝、駅まで（　）と思っています。",["歩こう","歩いて","歩いたら","歩けば"],"歩こう","The volitional form + と思っています expresses an intention: 歩こうと思っています."),
            form("a7","Resulting state","会議のために、机の上に資料が並べて（　）。",["あります","います","みます","しまいます"],"あります","資料が並べてあります describes the result of someone deliberately arranging the materials. The materials are not doing the arranging."),
            form("a8","No obligation","A：日曜日も会社に来なければなりませんか。\nB：いいえ、（　）。仕事が残っている人は来てもかまいません。",["来なくてもいいです","来てはいけません","来なければなりません","来ることになっています"],"来なくてもいいです","Attendance is optional: not coming is allowed, and coming is also allowed. なくてもいい removes an obligation; it does not forbid attendance."),
            form("a9","Embedded question","荷物がいつ（　）、店に電話して聞いてみます。",["届くか","届くが","届いても","届けるのを"],"届くか","いつ届くか embeds the question 'when will it arrive?' as the content to ask about."),
            form("a10","Change in ability","去年は泳げませんでしたが、今は百メートル（　）なりました。",["泳げるように","泳ぐことに","泳いだように","泳げるために"],"泳げるように","Potential form + ようになる expresses a newly acquired ability. ことになる is an arrangement or decision, not this change in ability."),
            form("a11","Offer of help","A：その箱、重そうですね。私が（　）。\nB：ありがとうございます。お願いします。",["持ちましょうか","持ちませんか","持ってください","持ちたいですか"],"持ちましょうか","私が持ちましょうか offers the speaker's help. The other choices invite or ask the other person to carry it."),
            form("a12","Comparison","昨日は二十度、今日は十五度です。今日は（　）。",["昨日ほど暖かくありません","昨日より暖かいです","昨日と同じくらい暖かいです","昨日ほど寒くありません"],"昨日ほど暖かくありません","Today is cooler. 昨日ほど暖かくありません preserves that relationship. Changing the adjective to 寒い while keeping the negative comparison reverses the relationship."),
            form("a13","Doing in advance","明日の朝は忙しいので、今夜のうちにお弁当を作って（　）つもりです。",["おく","ある","いるところ","くれる"],"おく","ておく expresses preparation in advance. The speaker plans to make tomorrow's lunch tonight."),
            form("a14","Giving and receiving","道が分からなくて困っていたら、知らない人が駅まで案内して（　）。",["くれました","あげました","もらいました","さしあげました"],"くれました","The stranger is the subject and the speaker receives the benefit, so 案内してくれました fits. もらう would make the recipient the subject."),
            form("a15","Simultaneous actions","音楽を（　）ながら、部屋を掃除しました。",["聞き","聞く","聞いて","聞いた"],"聞き","ながら attaches to the masu-stem, 聞き, to link two actions performed by the same person."),
            order("a16","Nominalization and experience","この本を",["読む","のは","これが","初めて"],"です。","読むのは makes reading the book the topic; これが identifies this occasion; 初めてです completes 'this is my first time.'"),
            order("a17","Purpose and prevention","バスに",["遅れない","ように","早く","家を出ました"],"。","遅れないように expresses the preventive aim. 早く modifies 家を出ました."),
            order("a18","Nominalized comparison","私には、手紙を",["書く","より","電話する","ほうが"],"楽です。","手紙を書く forms the first action, より marks the comparison standard, and 電話するほうが identifies the easier action."),
            order("a19","New ability","毎日練習して、",["漢字が","読める","ように","なりました"],"。","漢字が読める states the ability. ようになりました marks the change into being able to do it."),
            order("a20","Embedded question","先生に、",["この言葉を","どう","使うか","聞いてみます"],"。","どう使うか is the embedded question 'how to use it.' 聞いてみます follows that entire question."),
            text("a21","Reported name",["という","といったら","といっても","といえば"],"という","という connects a quoted name with the noun 教室: a class called おかずの時間."),
            text("a22","Sequence",["洗ってから","洗う前に","洗わないで","洗うところで"],"洗ってから","The vegetables were washed and then cut. てから gives that order; 前に reverses it and ないで says washing was omitted."),
            text("a23","Receiving help",["もらいました","あげました","くれました","いました"],"もらいました","The speaker receives the benefit from the teacher, marked with に: 先生に教えてもらいました."),
            text("a24","Contrasting facts",["でも","それで","だから","例えば"],"でも","The class was enjoyable, but the next class is on a work day. でも marks that obstacle, not a consequence or an example."),
            text("a25","Intention",["作ろう","作って","作れば","作られよう"],"作ろう","作ろうと思っています expresses the speaker's intention to make the dish at home.")
        ],passage:{title:"料理教室",paragraphs:[
            "先週、友達と「おかずの時間」【21】料理教室に参加しました。野菜のスープを作るために、畑から届いた野菜を使いました。土がついていたので、よく【22】、小さく切りました。",
            "私はにんじんをうまく切れなかったので、先生に切り方を教えて【23】。最初は難しかったですが、少しずつ上手になりました。できたスープはとてもおいしかったです。",
            "またこの教室に行きたいです。【24】、次の教室は私が働いている土曜日にあります。しばらくは行けないので、まず家で同じスープを【25】と思っています。"
        ]}},
        {id:"b",title:"Paper B",questions:[
            form("b1","Event location","来週、公園（　）町のお祭りがあります。",["で","に","を","へ"],"で","で marks the site of an event, even with あります. に would locate an object that exists there."),
            form("b2","Limited quantity","財布には百円（　）ありません。これでは切符が買えません。",["しか","だけ","でも","まで"],"しか","しか with a negative predicate means only that amount is available. だけありません would deny that particular amount rather than state the intended limit."),
            form("b3","Action stage","A：もう昼ご飯を食べましたか。\nB：いいえ、これから（　）ところです。",["食べる","食べた","食べている","食べていた"],"食べる","Dictionary form + ところです means about to do something. これから establishes that eating has not begun."),
            form("b4","Hearsay","田中さんから「試験に合格しました」とメールが来ました。田中さんは試験に（　）そうです。",["合格した","合格する","合格しなかった","合格したい"],"合格した","The message reports a completed event. Hearsay そうです retains the plain past form 合格した; it is not a prediction, a negative report or a wish."),
            form("b5","Permission","A：この席は空いていますか。座って（　）。\nB：はい、どうぞ。",["もいいですか","はいけません","もかまいません","もよかったです"],"もいいですか","てもいいですか asks permission to sit and matches the reply granting permission. The other choices make statements rather than ask to use the seat."),
            form("b6","Condition and discovery","家に（　）、机の上に母からの手紙がありました。",["帰ったら","帰るなら","帰っても","帰りながら"],"帰ったら","たら links arriving home to the discovery of the letter. なら would set up a hypothetical topic, not narrate this discovery."),
            form("b7","Obligation","医者に「必ず食事の後に飲んでください」と言われました。この薬は食事の後に飲ま（　）。",["なければなりません","なくてもいいです","ないほうがいいです","ないつもりです"],"なければなりません","なければなりません expresses the doctor's explicit requirement. The alternatives remove the obligation or advise/intend not to take it."),
            form("b8","Passive viewpoint","私は弟に大切なカップを（　）。",["壊されました","壊しました","壊れました","壊れさせました"],"壊されました","The speaker is affected by the brother breaking the cup: 弟に marks the agent in the passive construction 壊されました."),
            form("b9","Arranged decision","会社の決定で、来月から大阪で働く（　）。",["ことになりました","ことがありました","のを見ました","ためになりました"],"ことになりました","ことになる expresses an arrangement decided externally. The company's decision supplies that context; this is not a past experience or an observed event."),
            form("b10","Trying an action","このお菓子はどんな味でしょう。一つ食べて（　）。",["みます","おきます","あげます","もらいます"],"みます","The speaker wants to find out the taste by trying the food. てみる expresses that trial; ておく would make eating preparation for something later, and the benefit auxiliaries introduce a different participant relationship."),
            form("b11","Expectation","田中さんは昨日東京に着いたと言っていました。今は東京にいる（　）です。",["はず","つもり","ため","ところ"],"はず","はず expresses an evidence-based expectation. The speaker reasons from Tanaka's report of arriving yesterday."),
            form("b12","Advice","熱があるんですか。それなら、今日は早く（　）ほうがいいですよ。",["寝た","寝るの","寝て","寝よう"],"寝た","Affirmative advice uses Vたほうがいい. It recommends going to bed; this た does not describe a completed past action."),
            form("b13","Negative accompanying action","昨日は寝坊したので、朝ご飯を（　）学校に行きました。",["食べないで","食べないと","食べないなら","食べないために"],"食べないで","ないで links an omitted action with the action actually performed: going to school without breakfast. Not eating was not the purpose of going to school or a condition for going."),
            form("b14","Purpose","日本の大学で勉強する（　）、日本語を習っています。",["ために","ことに","ところに","ばかりに"],"ために","An intentional goal can use dictionary form + ために. Studying at a Japanese university is the reason for learning Japanese."),
            form("b15","Concession","この店は高い（　）、いつもたくさんのお客さんがいます。",["のに","ので","ために","ように"],"のに","のに presents a result contrary to expectation: despite the high prices, the shop is crowded."),
            order("b16","Giving and receiving","駅で、",["知らない人に","道を","教えて","もらいました"],"。","The recipient is the understood subject. The helper takes に, 道を is the object, and 教えてもらいました expresses receiving help."),
            order("b17","Only and potential","このパンは駅の前の",["店で","しか","買うことが","できません"],"。","駅の前の modifies 店. でしか plus a negative ability expression means the bread can be bought only at that shop."),
            order("b18","Concession and experience","今日は",["一度も","会ったことが","ないのに","名前を呼ばれました"],"。","一度も会ったことがない means never having met. のに contrasts that with unexpectedly being addressed by name."),
            order("b19","Explanatory focus","この町へ",["引っ越して","きた","のは","去年の春"],"です。","引っ越してきた is the completed move toward the present location. のは...です identifies when it happened."),
            order("b20","Nominalized preference","私の趣味は",["町の","写真を","撮る","こと"],"です。","町の modifies 写真; 写真を撮る is the activity; こと nominalizes it as the definition of the hobby."),
            text("b21","Reception period",["まで","までに","から","だけ"],"まで","The notice states the interval during which reception is open, from 9:30 until departure. まで marks the end of that interval, not a deadline for a completed action."),
            text("b22","No obligation",["払わなくてもかまいません","払わなければなりません","払ってはいけません","払わないと参加できません"],"払わなくてもかまいません","The city covers the cost, so participants are not required to pay. This is an absence of obligation, not a ban on paying or a payment requirement."),
            text("b23","Concession",["降っても","降らないと","降ったのに","降るために"],"降っても","The notice gives an indoor alternative even if it rains. 降っても leaves participation possible under that unfavorable condition."),
            text("b24","Embedded yes-no question",["かどうか","かもしれません","つもりで","ために"],"かどうか","持っているかどうか is the open question 'whether you have it.' This entire question becomes the object of 確認する; a conjecture, intention or purpose cannot fill that role."),
            text("b25","Reference to a situation",["その場合は","それなのに","それまでは","それとは反対に"],"その場合は","その場合は refers to the situation just introduced: participating with a friend. The next sentence gives an instruction for that case, not a contrast or an earlier time interval.")
        ],passage:{title:"散歩会のお知らせ",paragraphs:[
            "来月から、毎月第一土曜日に町の散歩会を{開き|ひらき}ます。初回は六月六日、午前十時に図書館の前から出発します。受付は九時半から出発の時間【21】です。",
            "参加費は市が出すので、参加する人はお金を【22】。歩く道はその日の朝に決めます。雨が【23】、屋根のある市場の中を歩きます。",
            "飲み物は用意しませんので、各自で持ってきてください。途中では買えません。出発する前に、飲み物を持っている【24】確認してください。友達との参加もできます。【25】、友達にもこのお知らせを見せてください。"
        ]}},
        {id:"c",title:"Paper C",questions:[
            form("c1","Recipient particle","この写真を先生（　）見せたいです。",["に","で","を","から"],"に","に marks the person to whom the picture is shown. The picture itself already takes を."),
            form("c2","Topic and contrast","肉は食べますが、魚（　）食べません。",["は","が","に","と"],"は","は explicitly contrasts fish with meat. The predicate 食べる and the established contrast support は here."),
            form("c3","Continuation endpoint","母が帰る（　）、家で弟と待っています。帰ってきたら、すぐ出かけます。",["まで","までに","前から","ように"],"まで","Waiting continues until the mother returns, and departure follows. まで sets that endpoint; までに would make her return a deadline for completing something."),
            form("c4","Recent completion","A：もう宿題は終わりましたか。\nB：はい、今ちょうど（　）ところです。",["終わった","終わる","終わっている","終わり"],"終わった","Vたところです means just having finished. はい answers that the homework is complete."),
            form("c5","Third-person desire","弟はさっきから窓の外を見て、外で（　）います。",["遊びたがって","遊びたくて","遊びたかった","遊びたい"],"遊びたがって","たがっている describes observable signs of another person's desire. 遊びたがっています is formed from the masu-stem 遊び."),
            form("c6","Listing examples","日曜日は掃除をしたり、洗濯を（　）します。",["したり","しても","するなら","しながら"],"したり","たり...たりする lists representative activities. It does not specify that the actions happen simultaneously."),
            form("c7","Question quotation","この漢字の読み方が分かりません。（　）、先生に聞いてみます。",["どう読むか","どう読むのが","どう読むと","どう読むために"],"どう読むか","どう読むか embeds 'how to read it' as the content of the question to the teacher. か closes that embedded question without making it a separate sentence."),
            form("c8","Causative","母は弟を部屋で一時間（　）。",["勉強させました","勉強されました","勉強していました","勉強になりました"],"勉強させました","The mother makes the younger brother study. を marks the person caused to perform this intransitive activity; で marks its location."),
            form("c9","Personal decision","健康のために、これからは毎日階段を使う（　）。",["ことにしました","ことがありました","ことができました","ところでした"],"ことにしました","ことにする expresses one's own decision to adopt a practice. これからは points to the future routine, not a past experience, past ability or interrupted action."),
            form("c10","Regret and completion","大切な写真を間違えて消して（　）。もう元に戻せません。",["しまいました","おきました","みました","ありました"],"しまいました","てしまう can express regret about a completed action. 間違えて and the inability to restore the photo establish an unwanted result."),
            form("c11","Conjecture","A：田中さんは休みですか。\nB：まだ連絡がないので分かりません。病気（　）。",["かもしれません","のはずがありません","ではありません","になりたいです"],"かもしれません","The speaker has no confirmation and offers illness as one possible explanation. かもしれません leaves that possibility open without asserting or ruling out illness."),
            form("c12","Invitation","A：よかったら、今度一緒に映画を（　）。\nB：いいですね。行きましょう。",["見ませんか","見てください","見てもいいですか","見ましょうかと言いました"],"見ませんか","ませんか invites the listener to join the speaker. The reply accepts a shared activity, not an instruction, a request for permission or a report of someone else's offer."),
            form("c13","Purpose and prevention","隣の部屋で赤ちゃんが寝ています。起こさない（　）、小さな声で話しましょう。",["ように","うちに","のに","まま"],"ように","起こさないように expresses the outcome to avoid: waking the baby. It connects that preventive aim to speaking quietly."),
            form("c14","Automatic consequence","このボタンを押す（　）、ドアが開きます。",["と","のに","ための","ながら"],"と","と expresses the regular result of pressing the button. のに would present an unexpected contrast; ための needs a following noun, and ながら does not attach to 押す."),
            form("c15","Negative comparison","この道はあの道ほど安全ではありません。つまり、（　）。",["あの道のほうが安全です","この道のほうが安全です","どちらの道も同じくらい安全です","どちらの道も安全ではありません"],"あの道のほうが安全です","Not as safe as the other road means the other road is safer. A relative comparison does not establish that both roads are unsafe."),
            order("c16","Nominalization and ability","この図書館では、",["外国の","新聞を","読むことが","できます"],"。","外国の modifies 新聞, 新聞を読む is the activity, and ことができます expresses that it is possible."),
            order("c17","Deadline and preparation","明日までに会議で",["使う","資料を","コピーして","おいて"],"ください。","会議で使う modifies 資料. 資料を is the object of コピーしておく, the preparation requested by the deadline."),
            order("c18","Action comparison","駅に行くなら、バスで行く",["より","歩く","ほうが","早い"],"です。","バスで行くより marks taking the bus as the standard. 歩くほうが marks walking as the faster action; 早い completes the comparison."),
            order("c19","Negative accompanying action","今日は",["傘を持たないで","外に","出て","しまいました"],"。","傘を持たないで means without taking an umbrella. 出てしまいました describes the completed, regretted departure. The first two phrases may move, but 出て must occupy ★."),
            order("c20","Hearsay","先生の話では、駅の前に",["新しい","図書館が","できる","そう"],"です。","新しい modifies 図書館. できるそうです reports what the teacher said about the library being built."),
            text("c21","Unexpected change",["のに","ので","なら","ために"],"のに","The writer went out expecting fine weather, but it rained. のに connects that disappointed expectation to the actual outcome."),
            text("c22","Receiving a favor",["くれて","あげて","もらって","くれると"],"くれて","The email thanks the reader for lending an umbrella to the writer: 貸してくれてありがとう. With もらう, the writer would instead say 貸してもらって助かりました."),
            text("c23","Resulting state",["かけてあります","かけてみます","かけようと思います","かけてほしいです"],"かけてあります","The umbrella is already hanging there after the writer deliberately put it there. The next sentence says it is already dry, supporting a present result rather than a future trial, plan or wish."),
            text("c24","Conditional topic",["行くなら","行ったのに","行っても","行くために"],"行くなら","なら takes up whether the reader plans to go as the condition for the writer's offer to return the umbrella there. It is not a purpose or a disappointed past expectation."),
            text("c25","Alternative",["行かない場合は","行かないために","行かないのに","行かないように"],"行かない場合は","This sentence supplies the alternative if the reader is not going to the library. Their plans are not yet known, so this is a condition, not an asserted cause or a purpose.")
        ],passage:{title:"借りた傘について",paragraphs:[
            "山田さん、昨日はありがとう。晴れると思って出かけた【21】、途中で雨が降ってきて困りました。私に傘を貸して【22】ありがとう。本当に助かりました。",
            "帰ってから傘を広げて、今は玄関に【23】。もう乾いています。",
            "明日の午後、図書館に【24】、そこで傘を返せます。【25】、夕方、家まで届けます。予定が決まったら教えてください。"
        ]}}
    ];
    // Authored display readings supplement shared vocabulary, independently of answer keys.
    const readings = [
        ["作る","つくる"],["畑","はたけ"],["土","つち"],["暖かい","あたたかい"],["寒","さむ"],
        ["第一","だいいち"],["開く","ひらく"],["初回","しょかい"],["六月","ろくがつ"],["六日","むいか"],["午前","ごぜん"],["集","あつ"],
        ["参加費","さんかひ"],["市","し"],["出す","だす"],["屋根","やね"],["市場","いちば"],["中","なか"],
        ["飲み物","のみもの"],["各自","かくじ"],["確認","かくにん"],["試験","しけん"],["合格","ごうかく"],["寝坊","ねぼう"],
        ["降ら","ふら"],["晴れる","はれる"],["出かけ","でかけ"],["貸し","かし"],["広げ","ひろげ"],["乾い","かわい"],["返せ","かえせ"],
        ["休み","やすみ"],["連絡","れんらく"],["隣","となり"],["赤ちゃん","あかちゃん"],["起こ","おこ"],["小さな","ちいさな"],
        ["行って","いって"],["行った","いった"],["行か","いか"],["場合","ばあい"],["乗っ","のっ"],["売れ","うれ"],["押し","おし"],["会い","あい"],
        ["受付","うけつけ"],["九時半","くじはん"],["予定","よてい"],["決まっ","きまっ"],["早い","はやい"],["反対","はんたい"],
        ["先週","せんしゅう"],["野菜","やさい"],["作り","つくり"],["作ろう","つくろう"],["作って","つくって"],["作れば","つくれば"],["作られ","つくられ"],
        ["洗い","あらい"],["洗う","あらう"],["洗わ","あらわ"],["後","あと"],["私たち","わたしたち"],["小さく","ちいさく"],["小さい","ちいさい"],
        ["切り","きり"],["切れ","きれ"],["切り方","きりかた"],["教え","おしえ"],["最初","さいしょ"],["難しかった","むずかしかった"],["上手","じょうず"],
        ["行き","いき"],["行く","いく"],["行った","いった"],["行け","いけ"],["働い","はたらい"],["働く","はたらく"],["土曜日","どようび"],["同じ","おなじ"],
        ["読み","よみ"],["読む","よむ"],["読め","よめ"],["箱","はこ"],["急い","いそい"],["降り","おり"],["降る","ふる"],["降れば","ふれば"],["忘れ","わすれ"],["乗る","のる"],
        ["出し","だし"],["出て","でて"],["出ました","でました"],["出ています","でています"],["早く","はやく"],["間","あいだ"],["湯気","ゆげ"],["待っ","まっ"],
        ["飲み","のみ"],["飲ん","のん"],["熱そう","あつそう"],["熱い","あつい"],["熱く","あつく"],["熱","ねつ"],["北海道","ほっかいどう"],
        ["歩こう","あるこう"],["歩けば","あるけば"],["歩く","あるく"],["歩き","あるき"],["資料","しりょう"],["並べ","ならべ"],["日曜日","にちようび"],
        ["会社","かいしゃ"],["来て","きて"],["荷物","にもつ"],["電話","でんわ"],["聞い","きい"],["聞き","きき"],["聞く","きく"],["届く","とどく"],["届い","とどい"],["届け","とどけ"],
        ["去年","きょねん"],["今","いま"],["泳げ","およげ"],["泳ぐ","およぐ"],["泳い","およい"],["百メートル","ひゃくめーとる"],["重そう","おもそう"],["持ち","もち"],["持っ","もっ"],
        ["昨日","きのう"],["二十度","にじゅうど"],["十五度","じゅうごど"],["暖かく","あたたかく"],["忙しい","いそがしい"],["弁当","べんとう"],
        ["案内","あんない"],["音楽","おんがく"],["掃除","そうじ"],["初めて","はじめて"],["遅れ","おくれ"],["毎日","まいにち"],["練習","れんしゅう"],
        ["漢字","かんじ"],["例えば","たとえば"],["前","まえ"],["町","まち"],["散歩会","さんぽかい"],["無料","むりょう"],["お金","おかね"],["払わ","はらわ"],
        ["書い","かい"],["書く","かく"],["当日","とうじつ"],["十人","じゅうにん"],["集まり","あつまり"],["先","さき"],["決め","きめ"],["川","かわ"],["向かっ","むかっ"],
        ["緊張","きんちょう"],["一緒","いっしょ"],["会っ","あっ"],["会う","あう"],["気軽","きがる"],["話せ","はなせ"],["話す","はなす"],["話","はなし"],["楽しみ","たのしみ"],
        ["財布","さいふ"],["百円","ひゃくえん"],["切符","きっぷ"],["買え","かえ"],["買う","かう"],["昼ご飯","ひるごはん"],["天気予報","てんきよほう"],
        ["席","せき"],["空い","あい"],["帰る","かえる"],["帰り","かえり"],["医者","いしゃ"],["言わ","いわ"],["言っ","いっ"],["薬","くすり"],
        ["壊さ","こわさ"],["壊し","こわし"],["決定","けってい"],["味","あじ"],["お菓子","おかし"],["着い","つい"],["朝ご飯","あさごはん"],
        ["習っ","ならっ"],["お客さん","おきゃくさん"],["呼ばれ","よばれ"],["引っ越して","ひっこして"],["新しい","あたらしい"],["家具","かぐ"],
        ["置き方","おきかた"],["勉強用","べんきょうよう"],["置こう","おこう"],["置く","おく"],["置い","おい"],["姉","あね"],["相談","そうだん"],
        ["下","した"],["広さ","ひろさ"],["測っ","はかっ"],["測る","はかる"],["測ら","はから"],["従っ","したがっ"],["大きさ","おおきさ"],["見つかり","みつかり"],
        ["昼間","ひるま"],["明るく","あかるく"],["集中","しゅうちゅう"],["夜","よる"],["見せ","みせ"],["見て","みて"],["見た","みた"],["見ま","みま"],["見な","みな"],
        ["肉","にく"],["宿題","しゅくだい"],["外","そと"],["洗濯","せんたく"],["調べ","しらべ"],["健康","けんこう"],["使う","つかう"],
        ["間違え","まちがえ"],["元","もと"],["戻せ","もどせ"],["音","おと"],["窓","まど"],["開い","あい"],["開き","あき"],["押す","おす"],["近い","ちかい"],
        ["外国","がいこく"],["新聞","しんぶん"],["食べ","たべ"],["降りそう","ふりそう"],["思っ","おもっ"],["願い","ねがい"],["読み方","よみかた"],["通ら","とおら"],["降った","ふった"],["車","くるま"],["人","ひと"]
    ];
    function createPaper(id, seed = Date.now(), contentVersion = version) {
        if (contentVersion === legacy.version) return {...legacy.createPaper(id, seed), version:legacy.version};
        if (contentVersion !== version) throw new Error("Unknown N4 content version");
        const paper = papers.find(p=>p.id===id);
        if (!paper) throw new Error("Unknown N4 paper");
        const rng=core.random(seed);
        const positions=core.shuffle(Array.from({length:25},(_,i)=>i%4),rng);
        return {...paper,version,seed,questions:paper.questions.map((q,i)=>{
            const options=core.shuffle(q.options.filter(v=>v!==q.answer),rng);
            options.splice(positions[i],0,q.answer);
            return {...q,number:i+1,options,review:review.items[q.id]};
        })};
    }
    function score(paper, answers = {}) {
        const items=paper.questions.map(q=>({...q,selected:q.options.includes(answers[q.id])?answers[q.id]:null,correct:answers[q.id]===q.answer}));
        const correct=items.filter(q=>q.correct).length;
        return {items,correct,total:items.length,percent:Math.round(correct/items.length*100),
            unanswered:items.filter(q=>!q.selected).length,
            sections:sections.map(s=>({...s,correct:items.filter(q=>q.section===s.id && q.correct).length})),
            domains:Object.entries(review.domains).map(([id,title])=>{
                const tested=items.filter(q=>q.review?.domain===id);
                return {id,title,total:tested.length,correct:tested.filter(q=>q.correct).length};
            }).filter(d=>d.total)};
    }
    function restore(value) {
        try {
            const saved=JSON.parse(value);
            if(![version,legacy.version].includes(saved?.version) || !papers.some(p=>p.id===saved.paperId) || !Number.isSafeInteger(saved.seed))return null;
            const paper=createPaper(saved.paperId,saved.seed,saved.version);
            const answers=Object.fromEntries(paper.questions.filter(q=>q.options.includes(saved.answers?.[q.id])).map(q=>[q.id,saved.answers[q.id]]));
            const timestamp=value=>Number.isSafeInteger(value)&&value>=0&&value<=8640000000000000?value:0;
            return {version:saved.version,paperId:saved.paperId,seed:saved.seed,answers,
                id:typeof saved.id==="string"&&/^[a-zA-Z0-9_-]{1,100}$/.test(saved.id)?saved.id:`${saved.version}-${saved.paperId}-${saved.seed}`,
                startedAt:timestamp(saved.startedAt),completedAt:saved.submitted===true?timestamp(saved.completedAt):0,
                flags:paper.questions.filter(q=>Array.isArray(saved.flags)&&saved.flags.includes(q.id)).map(q=>q.id),
                index:Number.isInteger(saved.index)?Math.max(0,Math.min(24,saved.index)):0,
                elapsed:typeof saved.elapsed==="number"&&Number.isFinite(saved.elapsed)?Math.max(0,saved.elapsed):0,
                submitted:saved.submitted===true};
        }catch{return null;}
    }
    const historyLimit=100;
    function createAttempt(paperId, seed=Date.now(), now=Date.now()) {
        return restore(JSON.stringify({version,paperId,seed,id:`${version}-${paperId}-${seed}-${now}`,
            startedAt:now,completedAt:0,answers:{},flags:[],index:0,elapsed:0,submitted:false}));
    }
    function remember(library, attempt) {
        if(!attempt?.submitted)return library;
        const clean=restore(JSON.stringify(attempt));
        if(!clean)return library;
        return {...library,history:[...library.history.filter(a=>a.id!==clean.id),clean].slice(-historyLimit)};
    }
    function restoreLibrary(value, oldValue=null) {
        let library;
        try {
            const saved=JSON.parse(value);
            if(saved?.schema===2 && Array.isArray(saved.history)){
                const history=saved.history.map(a=>restore(JSON.stringify(a))).filter(a=>a?.submitted);
                library={schema:2,active:restore(JSON.stringify(saved.active)),history:[]};
                for(const attempt of history)library=remember(library,attempt);
                return remember(library,library.active);
            }
        }catch{ /* Fall back to the previous single-attempt format without regrading it. */ }
        const active=restore(oldValue);
        return remember({schema:2,active,history:[]},active);
    }
    function answerFeedback(question, selected) {
        return question.review ? review.feedback(question,selected) : null;
    }
    return {version,sections,papers,readings:[...legacy.readings,...readings],createPaper,score,restore,
        review,answerFeedback,createAttempt,restoreLibrary,remember,historyLimit};
});
