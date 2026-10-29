(function(root, factory) {
    if (typeof module === "object" && module.exports) module.exports = factory(require("./grammar-practice-core.js"));
    else root.N4MockV1 = factory(root.GrammarPracticeCore);
})(typeof globalThis === "object" ? globalThis : this, function(core) {
    "use strict";
    const version = "n4-mock-v1";
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
            form("a4","Appearance","湯気が出ています。このスープはまだ（　）ね。少し待ってから飲みましょう。",["熱そうです","熱いような","熱くそうです","熱いそうな"],"熱そうです","Visible signs of heat take the い-adjective stem + そうです: 熱そうです. A modifier ending in な needs a following noun; 熱くそう is not the appearance form."),
            form("a5","Experience","A：北海道に行ったことがありますか。\nB：いいえ、一度も（　）。",["行ったことがありません","行くことがあります","行ったところです","行くことにしました"],"行ったことがありません","一度も + negative experience means never having done it. A recent action or a new decision does not answer this experience question."),
            form("a6","Intention","明日から毎朝、駅まで（　）と思っています。",["歩こう","歩いて","歩いたら","歩けば"],"歩こう","The volitional form + と思っています expresses an intention: 歩こうと思っています."),
            form("a7","Resulting state","会議のために、机の上に資料が並べて（　）。",["あります","います","みます","しまいます"],"あります","資料が並べてあります describes the result of someone deliberately arranging the materials. The materials are not doing the arranging."),
            form("a8","No obligation","A：日曜日も会社に来なければなりませんか。\nB：いいえ、日曜日は（　）。",["来なくてもいいです","来てはいけませんでした","来なければなりません","来ないほうがよかったです"],"来なくてもいいです","来なくてもいい releases the obligation to come. It does not mean attendance is forbidden or give advice about a past action."),
            form("a9","Embedded question","荷物がいつ（　）、店に電話して聞いてみます。",["届くか","届くが","届いても","届けるのを"],"届くか","いつ届くか embeds the question 'when will it arrive?' as the content to ask about."),
            form("a10","Change in ability","去年は泳げませんでしたが、今は百メートル（　）なりました。",["泳げるように","泳ぐことに","泳いだように","泳げるために"],"泳げるように","Potential form + ようになる expresses a newly acquired ability. ことになる is an arrangement or decision, not this change in ability."),
            form("a11","Offer of help","A：その箱、重そうですね。私が（　）。\nB：ありがとうございます。お願いします。",["持ちましょうか","持ちませんか","持ってください","持ちたいですか"],"持ちましょうか","私が持ちましょうか offers the speaker's help. The other choices invite or ask the other person to carry it."),
            form("a12","Comparison","昨日は二十度でした。今日は十五度なので、昨日（　）暖かくありません。",["ほど","のほうが","のような","のために"],"ほど","ほど + negative expresses 'not as warm as yesterday.' It preserves the temperature relationship; のほうが would make yesterday the subject of the negative predicate."),
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
            "先週、友達と「おかずの時間」【21】料理教室に参加しました。野菜のスープを作りました。先生は「まず野菜を洗いましょう。その後で切ってください」と言いました。私たちは野菜を【22】、小さく切りました。",
            "私はにんじんをうまく切れなかったので、先生に切り方を教えて【23】。最初は難しかったですが、少しずつ上手になりました。できたスープはとてもおいしかったです。",
            "またこの教室に行きたいです。【24】、次の教室は私が働いている土曜日にあります。しばらくは行けないので、まず家で同じスープを【25】と思っています。"
        ]}},
        {id:"b",title:"Paper B",questions:[
            form("b1","Event location","来週、公園（　）町のお祭りがあります。",["で","に","を","へ"],"で","で marks the site of an event, even with あります. に would locate an object that exists there."),
            form("b2","Limited quantity","財布には百円（　）ありません。これでは切符が買えません。",["しか","だけ","でも","まで"],"しか","しか with a negative predicate means only that amount is available. だけありません would deny that particular amount rather than state the intended limit."),
            form("b3","Action stage","A：もう昼ご飯を食べましたか。\nB：いいえ、これから（　）ところです。",["食べる","食べた","食べている","食べていた"],"食べる","Dictionary form + ところです means about to do something. これから establishes that eating has not begun."),
            form("b4","Hearsay","天気予報によると、明日は雪が（　）そうです。",["降る","降ったら","降って","降れば"],"降る","Reported そうです attaches to a plain-form statement: 降るそうです. A te-form or conditional does not provide the complete statement being reported."),
            form("b5","Permission","A：この席は空いていますか。座って（　）。\nB：はい、どうぞ。",["もいいですか","はいけません","もかまいません","もよかったです"],"もいいですか","てもいいですか asks permission to sit and matches the reply granting permission. The other choices make statements rather than ask to use the seat."),
            form("b6","Condition and discovery","家に（　）、机の上に母からの手紙がありました。",["帰ったら","帰るなら","帰っても","帰りながら"],"帰ったら","たら links arriving home to the discovery of the letter. なら would set up a hypothetical topic, not narrate this discovery."),
            form("b7","Obligation","医者に「必ず食事の後に飲んでください」と言われました。この薬は食事の後に飲ま（　）。",["なければなりません","なくてもいいです","ないほうがいいです","ないつもりです"],"なければなりません","なければなりません expresses the doctor's explicit requirement. The alternatives remove the obligation or advise/intend not to take it."),
            form("b8","Passive viewpoint","私は弟に大切なカップを（　）。",["壊されました","壊しました","壊れました","壊れさせました"],"壊されました","The speaker is affected by the brother breaking the cup: 弟に marks the agent in the passive construction 壊されました."),
            form("b9","Arranged decision","会社の決定で、来月から大阪で働く（　）。",["ことになりました","ことがありました","のを見ました","ためになりました"],"ことになりました","ことになる expresses an arrangement decided externally. The company's decision supplies that context; this is not a past experience or an observed event."),
            form("b10","Trying an action","まだ食べたことがありません。どんな味か知りたいので、今からこのお菓子を一つ食べて（　）。",["みます","あります","いました","きました"],"みます","てみる means trying an action to find out its result. まだ and 今から establish a first trial that has not happened yet, ruling out past eating."),
            form("b11","Expectation","田中さんは昨日東京に着いたと言っていました。今は東京にいる（　）です。",["はず","つもり","ため","ところ"],"はず","はず expresses an evidence-based expectation. The speaker reasons from Tanaka's report of arriving yesterday."),
            form("b12","Advice","熱があるんですか。それなら、今日は早く（　）ほうがいいですよ。",["寝た","寝るの","寝て","寝よう"],"寝た","Affirmative advice uses Vたほうがいい. It recommends going to bed; this た does not describe a completed past action."),
            form("b13","Negative accompanying action","昨日は朝ご飯を（　）、学校に行きました。",["食べないで","食べませんで","食べないと","食べないなら"],"食べないで","ないで expresses going to school without eating breakfast. The conditional choices would describe a different relationship, not the narrated omitted action."),
            form("b14","Purpose","日本の大学で勉強する（　）、日本語を習っています。",["ために","ことに","ところに","ばかりに"],"ために","An intentional goal can use dictionary form + ために. Studying at a Japanese university is the reason for learning Japanese."),
            form("b15","Concession","この店は高い（　）、いつもたくさんのお客さんがいます。",["のに","ので","ために","ように"],"のに","のに presents a result contrary to expectation: despite the high prices, the shop is crowded."),
            order("b16","Giving and receiving","駅で、",["知らない人に","道を","教えて","もらいました"],"。","The recipient is the understood subject. The helper takes に, 道を is the object, and 教えてもらいました expresses receiving help."),
            order("b17","Only and potential","このパンは駅の前の",["店で","しか","買うことが","できません"],"。","駅の前の modifies 店. でしか plus a negative ability expression means the bread can be bought only at that shop."),
            order("b18","Concession and experience","今日は",["一度も","会ったことが","ないのに","名前を呼ばれました"],"。","一度も会ったことがない means never having met. のに contrasts that with unexpectedly being addressed by name."),
            order("b19","Explanatory focus","この町へ",["引っ越して","きた","のは","去年の春"],"です。","引っ越してきた is the completed move toward the present location. のは...です identifies when it happened."),
            order("b20","Nominalized preference","私の趣味は",["町の","写真を","撮る","こと"],"です。","町の modifies 写真; 写真を撮る is the activity; こと nominalizes it as the definition of the hobby."),
            text("b21","Relative time",["来たとき","来るつもり","来てほしい","来るために"],"来たとき","来たとき anchors the unfamiliarity to when the speaker arrived in the town. The lack of acquaintances is a situation at that time, not a purpose for coming."),
            text("b22","No obligation",["なくてもいい","なければならない","ないほうがいい","てはいけない"],"なくてもいい","お金を払わなくてもいい means no payment is required. The notice explicitly describes a free event."),
            text("b23","Sequence",["決めてから","決める前に","決めないで","決めるために"],"決めてから","The guide says to choose a route first and then depart, so 決めてから preserves the stated order."),
            text("b24","Result",["おかげで","せいで","のに","まま"],"おかげで","おかげで credits the walk for a welcome result: making friends. せいで blames a cause for an unwanted result, while のに would frame the outcome as contrary to expectation."),
            text("b25","Change in ability",["話せるように","話すことに","話したことに","話せるために"],"話せるように","Potential form + ようになる describes now being able to speak with ease, contrasting with initial nervousness.")
        ],passage:{title:"町の散歩会",paragraphs:[
            "私はこの町に【21】、知っている人が一人もいませんでした。ある日、図書館で散歩会のお知らせを見ました。「参加は無料です。お金を払わ【22】です」と書いてありました。そこで、参加することにしました。",
            "当日は、図書館の前に十人が集まりました。案内の人は「先に歩く道を決めましょう。それから出発します」と言いました。みんなで道を【23】、川に向かって歩き始めました。",
            "最初は緊張していましたが、同じ道を一緒に歩いた【24】、友達ができました。今では、町で会ったときにも気軽に【25】なりました。来月の散歩会も楽しみです。"
        ]}},
        {id:"c",title:"Paper C",questions:[
            form("c1","Recipient particle","この写真を先生（　）見せたいです。",["に","で","を","から"],"に","に marks the person to whom the picture is shown. The picture itself already takes を."),
            form("c2","Topic and contrast","肉は食べますが、魚（　）食べません。",["は","が","に","と"],"は","は explicitly contrasts fish with meat. The predicate 食べる and the established contrast support は here."),
            form("c3","Continuation endpoint","母が帰る（　）、家で弟と待っています。",["まで","までに","からに","だけに"],"まで","まで marks how long the waiting continues. までに would set a deadline for completing an event."),
            form("c4","Recent completion","A：もう宿題は終わりましたか。\nB：はい、今ちょうど（　）ところです。",["終わった","終わる","終わっている","終わり"],"終わった","Vたところです means just having finished. はい answers that the homework is complete."),
            form("c5","Third-person desire","弟はさっきから窓の外を見て、外で（　）います。",["遊びたがって","遊びたくて","遊びたかった","遊びたい"],"遊びたがって","たがっている describes observable signs of another person's desire. 遊びたがっています is formed from the masu-stem 遊び."),
            form("c6","Listing examples","日曜日は掃除をしたり、洗濯を（　）します。",["したり","しても","するなら","しながら"],"したり","たり...たりする lists representative activities. It does not specify that the actions happen simultaneously."),
            form("c7","Question quotation","この漢字の読み方が分かりません。（　）、先生に聞いてみます。",["どう読むか","どう読むのが","どう読むと","どう読むために"],"どう読むか","どう読むか embeds 'how to read it' as the content of the question to the teacher. か closes that embedded question without making it a separate sentence."),
            form("c8","Causative","母は弟を部屋で一時間（　）。",["勉強させました","勉強されました","勉強していました","勉強になりました"],"勉強させました","The mother makes the younger brother study. を marks the person caused to perform this intransitive activity; で marks its location."),
            form("c9","Personal decision","健康のために、これからは毎日階段を使う（　）。",["ことにしました","ことがありました","ことができました","ところでした"],"ことにしました","ことにする expresses one's own decision to adopt a practice. これからは points to the future routine, not a past experience, past ability or interrupted action."),
            form("c10","Regret and completion","大切な写真を間違えて消して（　）。もう元に戻せません。",["しまいました","おきました","みました","ありました"],"しまいました","てしまう can express regret about a completed action. 間違えて and the inability to restore the photo establish an unwanted result."),
            form("c11","Conjecture","誰もいない部屋から音がします。もしかしたら、窓が開いている（　）。",["のかもしれません","つもりです","ことにします","ためにします"],"のかもしれません","もしかしたら signals an uncertain explanation, completed by かもしれません. This is a guess about the window, not an intention or decision."),
            form("c12","Invitation","A：よかったら、今度一緒に映画を（　）。\nB：いいですね。行きましょう。",["見ませんか","見たことがあります","見てはいけません","見なくてもいいです"],"見ませんか","ませんか invites the listener to join the speaker. The response accepts that invitation."),
            form("c13","Adverb formation","もう少し（　）話していただけませんか。",["ゆっくり","ゆっくりな","ゆっくりだ","ゆっくりの"],"ゆっくり","ゆっくり functions directly as an adverb modifying 話す. It does not need な, だ or の before the verb."),
            form("c14","Automatic consequence","このボタンを押す（　）、ドアが開きます。",["と","のに","ための","ながら"],"と","と expresses the regular result of pressing the button. のに would present an unexpected contrast; ための needs a following noun, and ながら does not attach to 押す."),
            form("c15","Negative comparison","あの道は車が通らないので安全です。この道はあの道（　）安全ではありません。",["ほど","のほうが","だけを","にとって"],"ほど","ほど with a negative predicate means this road is not as safe as the other one. The opening sentence establishes the other road as safe; のほうが would incorrectly make that road the subject of the negative statement."),
            order("c16","Nominalization and ability","この図書館では、",["外国の","新聞を","読むことが","できます"],"。","外国の modifies 新聞, 新聞を読む is the activity, and ことができます expresses that it is possible."),
            order("c17","Deadline and preparation","明日までに会議で",["使う","資料を","コピーして","おいて"],"ください。","会議で使う modifies 資料. 資料を is the object of コピーしておく, the preparation requested by the deadline."),
            order("c18","Purpose","日本で",["働く","ために","日本語を","勉強しています"],"。","日本で働く is the intended goal. ために links that goal to the action taken, 日本語を勉強しています."),
            order("c19","Negative accompanying action","今日は",["傘を持たないで","外に","出て","しまいました"],"。","傘を持たないで means without taking an umbrella. 出てしまいました describes the completed, regretted departure. The first two phrases may move, but 出て must occupy ★."),
            order("c20","Hearsay","先生の話では、駅の前に",["新しい","図書館が","できる","そう"],"です。","新しい modifies 図書館. できるそうです reports what the teacher said about the library being built."),
            text("c21","Reason",["ので","のに","なら","ても"],"ので","ので links the small room as the reason for finding a new way to arrange it. のに would present an unexpected contrast."),
            text("c22","Conditional advice",["置くなら","置くと","置いても","置いたのに"],"置くなら","なら takes up the proposed placement as a topic for advice about what to do first. The advice is needed before placing the desk."),
            text("c23","Action sequence",["測ってから","測る前に","測らないで","測っても"],"測ってから","The writer follows the instruction to measure first and buy afterward, so 測ってから preserves the order."),
            text("c24","Resulting state",["置いてあります","置いていますか","置いてみます","置いておきませんか"],"置いてあります","置いてあります describes the desk now standing there as a result of deliberate placement. This is a statement of the resulting arrangement, not a question or a new plan."),
            text("c25","Beneficial change",["ように","ために","ことに","そうに"],"ように","集中できるようになりました describes acquiring the ability to concentrate in the improved environment.")
        ],passage:{title:"新しい机",paragraphs:[
            "私の部屋は小さい【21】、家具の置き方を変えることにしました。今までは食事も勉強も同じテーブルでしていましたが、勉強用の机がほしくなりました。",
            "窓のそばに机を置こうと思って、姉に相談しました。姉は「そこに【22】、買う前に窓の下の広さを測ったほうがいいよ」と言いました。私は姉のアドバイスに従って、広さを【23】、店に行きました。",
            "ちょうどいい大きさの机が見つかりました。今は窓のそばに机が【24】。昼間は明るくて、前より勉強に集中できる【25】なりました。夜もここで本を読むのを楽しみにしています。"
        ]}}
    ];
    // Authored display readings supplement shared vocabulary, independently of answer keys.
    const readings = [
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
    function createPaper(id, seed = Date.now()) {
        const paper = papers.find(p=>p.id===id);
        if (!paper) throw new Error("Unknown N4 paper");
        const rng=core.random(seed);
        const positions=core.shuffle(Array.from({length:25},(_,i)=>i%4),rng);
        return {...paper,seed,questions:paper.questions.map((q,i)=>{
            const options=core.shuffle(q.options.filter(v=>v!==q.answer),rng);
            options.splice(positions[i],0,q.answer);
            return {...q,number:i+1,options};
        })};
    }
    function score(paper, answers = {}) {
        const items=paper.questions.map(q=>({...q,selected:q.options.includes(answers[q.id])?answers[q.id]:null,correct:answers[q.id]===q.answer}));
        const correct=items.filter(q=>q.correct).length;
        return {items,correct,total:items.length,percent:Math.round(correct/items.length*100),
            unanswered:items.filter(q=>!q.selected).length,
            sections:sections.map(s=>({...s,correct:items.filter(q=>q.section===s.id && q.correct).length}))};
    }
    function restore(value) {
        try {
            const saved=JSON.parse(value);
            if(saved?.version!==version || !papers.some(p=>p.id===saved.paperId) || !Number.isSafeInteger(saved.seed))return null;
            const paper=createPaper(saved.paperId,saved.seed);
            const answers=Object.fromEntries(paper.questions.filter(q=>q.options.includes(saved.answers?.[q.id])).map(q=>[q.id,saved.answers[q.id]]));
            return {version,paperId:saved.paperId,seed:saved.seed,answers,
                flags:paper.questions.filter(q=>Array.isArray(saved.flags)&&saved.flags.includes(q.id)).map(q=>q.id),
                index:Number.isInteger(saved.index)?Math.max(0,Math.min(24,saved.index)):0,
                elapsed:typeof saved.elapsed==="number"&&Number.isFinite(saved.elapsed)?Math.max(0,saved.elapsed):0,
                submitted:saved.submitted===true};
        }catch{return null;}
    }
    return {version,sections,papers,readings,createPaper,score,restore};
});
