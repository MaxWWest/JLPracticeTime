(function(root, factory) {
    const api = factory();
    if (typeof module === "object" && module.exports) module.exports = api;
    else root.N4MockReview = api;
})(typeof globalThis === "object" ? globalThis : this, function() {
    "use strict";
    const domains = {
        relations: "Particles and comparisons",
        time: "Time and action states",
        stance: "Intention and judgment",
        linking: "Connections between ideas",
        roles: "Who acts and who benefits",
        structure: "Sentence and quotation structure"
    };
    function item(domain, unit, focus, example, translation, distractors, demand = "meaning") {
        return {domain, unit, focus, example, translation, distractors, demand};
    }
    const items = {
        a1: item("relations","particles-de-ni","Destination versus action location",
            "この部屋で、本を箱に入れます。","I put books in a box in this room.", {
                "で":"This would mark the box as the site or means of the activity, not the destination of the books.",
                "を":"This would make the box the object being put somewhere. Here it is the container receiving the books.",
                "と":"This connects a companion or a quoted expression; neither is the role of the box."
            }),
        a2: item("relations","particles-wo-to","Leaving versus boarding a vehicle",
            "バスに乗って、駅でバスを降ります。","I board the bus and get off it at the station.", {
                "に":"This marks the vehicle boarded with 乗る. 降りる describes leaving it.",
                "が":"This would make the bus the subject of getting off, rather than the vehicle the person leaves.",
                "と":"This suggests a companion; the bus is the departure point, not a fellow traveler."
            }),
        a3: item("time","time","Deadline versus duration",
            "五時まで待ちます。五時までに来てください。","I will wait until five. Please arrive by five.", {
                "まで":"This marks continuation until Friday. Submitting the report is a completion required by a deadline.",
                "から":"This starts the submission period on Friday instead of making Friday its deadline.",
                "の間":"This does not form a duration expression with 金曜日 here. It also misses the deadline allowing earlier submission."
            }),
        a4: item("stance","appearance","Visible impression versus reported information",
            "おいしそうです。おいしいそうです。","It looks tasty. / I hear it is tasty.", {
                "熱いそうです":"This reports that someone says the soup is hot. The prompt presents a judgment from visible steam, not a report.",
                "熱くなさそうです":"This means it does not look hot, the opposite of the impression supported by the steam.",
                "熱かったそうです":"This reports that it was hot. It changes both the source of evidence and the time."
            }),
        a5: item("time","experience","Life experience versus a recent action",
            "まだ行ったことがありません。来月行くことにしました。","I have never been. I decided to go next month.", {
                "行くことがあります":"This means going there sometimes; it contradicts both いいえ and 一度も.",
                "行ったところです":"This means having just gone. That is a recent completed action, not the denial of any experience.",
                "行くことにしました":"This is a decision to go. It neither answers the experience question nor completes 一度も naturally."
            }),
        a6: item("stance","intention","Volitional intention",
            "歩こうと思っています。","I intend to walk.", {
                "歩いて":"The te-form links actions; it does not express the intended action before と思っています.",
                "歩いたら":"This introduces 'if/when I walk.' It leaves the intended main action unstated.",
                "歩けば":"This is a conditional, not the volitional form used for the speaker's plan."
            }, "formation"),
        a7: item("time","te-auxiliary","Prepared result versus an ongoing action",
            "先生が資料を並べています。資料が並べてあります。","The teacher is arranging the materials. / The materials have been arranged.", {
                "います":"With transitive 並べる, this would make the materials do the arranging. Here they are the things already arranged.",
                "みます":"This expresses trying the act of arranging, not the resulting prepared layout.",
                "しまいます":"This presents completion or regret about arranging; it does not describe materials in a resulting state with が."
            }),
        a8: item("stance","permission","Optional versus forbidden",
            "来なくてもいいです。でも、来てもいいです。","You do not have to come, but you may.", {
                "来てはいけません":"This forbids coming, but the next sentence explicitly allows it.",
                "来なければなりません":"This requires attendance, contradicting the answer いいえ.",
                "来ることになっています":"This describes an arrangement to attend, not the optional attendance explained in the next sentence."
            }),
        a9: item("structure","quotation","Embedding a question",
            "いつ来るか、教えてください。","Please tell me when you will come.", {
                "届くが":"が connects a contrast; it does not close the embedded 'when' question.",
                "届いても":"This means even if it arrives. It changes the question into a concession.",
                "届けるのを":"届ける is transitive: someone delivers something. 荷物が届く describes the package arriving, and the embedded question needs か."
            }, "formation"),
        a10: item("time","change","Acquired ability versus a decision",
            "泳げるようになりました。泳ぐことにしました。","I became able to swim. / I decided to swim.", {
                "泳ぐことに":"This describes an arrangement to swim, not the ability gained since last year.",
                "泳いだように":"This means 'as if/as one swam'; it does not express a newly acquired ability.",
                "泳げるために":"ために marks a purpose or reason, not the change construction ようになる."
            }),
        a11: item("roles","invitation","Offering your help versus asking for theirs",
            "私が持ちましょうか。持ってください。","Shall I carry it? / Please carry it.", {
                "持ちませんか":"This normally invites the listener to carry it; the speaker is offering to take the task.",
                "持ってください":"This asks the listener to do the carrying, reversing the intended helper.",
                "持ちたいですか":"This asks about a desire to carry it, not an offer of assistance."
            }),
        a12: item("relations","comparison","Preserving comparison direction",
            "今日は昨日より寒いです。","Today is colder than yesterday.", {
                "昨日より暖かいです":"This makes today warmer, reversing the temperatures given.",
                "昨日と同じくらい暖かいです":"This states equal warmth, but the temperatures differ.",
                "昨日ほど寒くありません":"Not as cold means warmer. Replacing warm with cold while keeping the negative reverses the comparison."
            }),
        a13: item("time","te-auxiliary","Preparation in advance",
            "明日のために、今夜作っておきます。","I will make it tonight in preparation for tomorrow.", {
                "ある":"てある describes an existing deliberate result; it is not the speaker's planned preparatory action before つもりです.",
                "いるところ":"This describes being in the middle of making it, not planning to prepare it tonight.",
                "くれる":"This would make someone else the giver of a benefit. The speaker is stating their own preparation."
            }),
        a14: item("roles","giving","Helper as subject versus recipient as subject",
            "先生が教えてくれました。先生に教えてもらいました。","The teacher helped me learn. / I received the teacher's help.", {
                "あげました":"This directs the benefit away from the subject toward someone else; it misses the speaker as the grateful beneficiary.",
                "もらいました":"This requires the recipient to be the subject. Here the stranger, marked with が, is the helper.",
                "さしあげました":"This is a humble giving expression, not receiving the stranger's help. Politeness does not repair the reversed viewpoint."
            }),
        a15: item("linking","time","The stem before simultaneous ながら",
            "音楽を聞きながら歩きます。","I walk while listening to music.", {
                "聞く":"ながら attaches to 聞き, not the dictionary form 聞く.",
                "聞いて":"The te-form can link actions, but it cannot be placed immediately before this ながら.",
                "聞いた":"The past form does not attach to simultaneous ながら."
            }, "formation"),
        a21: item("structure","quotation","Naming a class","「空」という店です。","It is a shop called Sora.", {
            "といったら":"This introduces a reaction or topic ('speaking of'), not a name modifying 教室.",
            "といっても":"This qualifies a previous statement ('although I say that'), not the name of the class.",
            "といえば":"This changes to a related topic, whereas the quoted words name this class."
        }, "discourse"),
        a22: item("linking","particles-te-links","Sequence inferred from the situation","洗ってから食べます。","I wash it before eating it.", {
            "洗う前に":"This puts cutting before washing, leaving the dirt in place while cutting.",
            "洗わないで":"This says the vegetables were cut without washing, contrary to the stated reason for washing them.",
            "洗うところで":"This describes being just about to wash, not completing washing before cutting."
        }, "discourse"),
        a23: item("roles","giving","The teacher as the source of help","先生に教えてもらいました。","I received instruction from the teacher.", {
            "あげました":"This makes the writer the person teaching the teacher, reversing who needed help.",
            "くれました":"For the teacher to be the helper-subject, the sentence needs 先生が, not the recipient construction 先生に.",
            "いました":"This makes the writer the person teaching the teacher continuously, not receiving instruction."
        }, "discourse"),
        a24: item("linking","concession","An obstacle to an intention","行きたいです。でも、仕事があります。","I want to go, but I have work.", {
            "それで":"This would make the work-day schedule a consequence of wanting to attend. The relationship is an obstacle instead.",
            "だから":"This marks a conclusion or result, but the schedule contrasts with the writer's wish.",
            "例えば":"The schedule is not an example of wanting to attend; it explains why the writer cannot."
        }, "discourse"),
        a25: item("stance","intention","A new plan after an obstacle","家で作ろうと思います。","I intend to make it at home.", {
            "作って":"This te-form does not express an intention before と思っています.",
            "作れば":"This gives a condition, leaving its consequence unstated instead of expressing a plan.",
            "作られよう":"This is a passive volitional form; the writer intends to make the soup, not to be made."
        }, "discourse")
    };
    Object.assign(items, {
        b1: item("relations","particles-de-ni","Event site versus existence","公園に木があります。公園でお祭りがあります。","There is a tree in the park. / A festival takes place in the park.", {
            "に":"に locates something that exists. Here あります refers to an event taking place, whose site takes で.",
            "を":"を can mark a route or object, but the park is the site of the festival.",
            "へ":"へ marks a direction of movement; this sentence announces where an event occurs."
        }),
        b2: item("relations","particles-mo-shika","Only with a negative predicate","百円だけあります。百円しかありません。","I have only one hundred yen. Both sentences express that limit.", {
            "だけ":"だけ works with an affirmative predicate for this meaning. だけありません denies an amount rather than stating only that amount is available.",
            "でも":"Even one hundred yen being unavailable would mean the speaker does not have that amount, rather than having only that much.",
            "まで":"まで marks a limit or extent, but it does not form the intended 'only this amount' construction with ありません."
        }),
        b3: item("time","time","About to versus doing versus just finished","食べるところです。食べているところです。食べたところです。","I am about to eat. / I am eating. / I have just eaten.", {
            "食べた":"This means just having eaten, contradicting いいえ and これから.",
            "食べている":"This places eating in progress, but これから says it is about to begin.",
            "食べていた":"This describes an earlier ongoing action, not the upcoming meal."
        }),
        b4: item("structure","hearsay","Keeping the tense of a report","合格したそうです。合格するそうです。","I hear they passed. / I hear they will pass.", {
            "合格する":"This changes a report of passing into a nonpast statement.",
            "合格しなかった":"This reports failure to pass, reversing the message.",
            "合格したい":"This reports wanting to pass, not having passed."
        }),
        b5: item("stance","permission","Asking for permission","ここに座ってもいいですか。はい、どうぞ。","May I sit here? Yes, go ahead.", {
            "はいけません":"This prohibits sitting rather than asking permission.",
            "もかまいません":"This grants permission in a statement. The person wanting the seat needs to ask for it.",
            "もよかったです":"This is a statement about past permission, not a present request to use the seat."
        }),
        b6: item("linking","tara-nara","Discovery on arrival","家に帰ったら、手紙がありました。","When I got home, I found a letter.", {
            "帰るなら":"This sets up a hypothetical plan to return home; it does not narrate the completed arrival and discovery.",
            "帰っても":"This would introduce an unexpected persistence despite returning. No such concession is established; the sentence narrates what was found on arrival.",
            "帰りながら":"This means while returning, before arriving home, not finding a letter on the desk after arrival."
        }),
        b7: item("stance","permission","Required versus optional","飲まなければなりません。飲まなくてもいいです。","You must take it. / You do not have to take it.", {
            "なくてもいいです":"This removes the obligation, contrary to the doctor's 必ず.",
            "ないほうがいいです":"This advises not taking the medicine after meals, reversing the instruction.",
            "ないつもりです":"This states an intention not to take it, rather than the doctor's requirement."
        }),
        b8: item("roles","passive","Affected person's viewpoint","弟がカップを壊しました。私は弟にカップを壊されました。","My brother broke a cup. / I was affected by my brother breaking my cup.", {
            "壊しました":"This would make 私 the person who broke it, not the affected owner.",
            "壊れました":"壊れる describes the cup breaking intransitively. It cannot take カップを as its object.",
            "壊れさせました":"This is causative rather than passive: causing something to break, not being affected by the brother's action."
        }),
        b9: item("stance","decisions","An externally decided arrangement","大阪で働くことになりました。","It has been decided that I will work in Osaka.", {
            "ことがありました":"This recalls past occasions, not the new assignment beginning next month.",
            "のを見ました":"This says the speaker saw someone working there, not that the company assigned the speaker to work there.",
            "ためになりました":"ためになる means being beneficial. It does not express a company arrangement in this frame."
        }),
        b10: item("time","te-auxiliary","Trial versus preparation or a favor","食べてみます。食べておきます。","I will try eating it. / I will eat in advance.", {
            "おきます":"This makes eating preparation for a later need. Here eating is a way to discover the taste.",
            "あげます":"This frames eating as a favor to someone else, but the speaker is investigating the taste.",
            "もらいます":"This means having someone else eat it for you, not tasting it yourself."
        }),
        b11: item("stance","certainty","Expectation based on evidence","もう着いたはずです。","I expect they have already arrived.", {
            "つもり":"This concerns someone's intention, not the speaker's inference from the arrival report.",
            "ため":"ため describes a purpose or cause; it does not express an expectation.",
            "ところ":"いるところです presents a current situation directly, not a reasoned expectation from someone else's report."
        }),
        b12: item("stance","advice","Affirmative advice uses the past form","早く寝たほうがいいです。","You should go to bed early.", {
            "寝るの":"The nominalized form 寝るの does not attach directly to ほうが in this advice construction.",
            "寝て":"The te-form does not fit before ほうがいい. Affirmative advice takes the past form 寝た.",
            "寝よう":"This is a volitional form; the advice frame needs 寝た."
        }, "formation"),
        b13: item("linking","particles-te-links","Omitted action versus condition or purpose","朝ご飯を食べないで出かけました。","I went out without eating breakfast.", {
            "食べないと":"This introduces a condition: if one does not eat. The sentence describes a completed morning, not a conditional consequence.",
            "食べないなら":"This takes not eating as a hypothetical topic, rather than an omitted action accompanying the departure.",
            "食べないために":"This makes avoiding breakfast the purpose of going to school. Oversleeping explains an omission, not that goal."
        }),
        b14: item("linking","purpose","An intentional goal","大学で勉強するために、お金をためています。","I am saving money in order to study at university.", {
            "ことに":"ことに can participate in decision expressions, but it does not connect this goal to 習っています.",
            "ところに":"This introduces a situation at a particular moment, not an ongoing purpose.",
            "ばかりに":"This blames a cause for an unfortunate result. Learning Japanese is a means toward the stated goal."
        }),
        b15: item("linking","concession","Counterexpectation versus reason","高いのに、よく売れます。","It sells well despite being expensive.", {
            "ので":"This presents high prices as the reason for the crowds. The ordinary relationship here is unexpected contrast, not an established cause.",
            "ために":"This would also make the high prices the cause. The sentence contrasts cost with popularity.",
            "ように":"This links an aim or manner, not the contrast between high prices and many customers."
        }),
        b21: item("time","time","Opening interval versus completion deadline","受付は九時から十時までです。","Reception is open from nine until ten.", {
            "までに":"This marks a completion deadline. The notice describes the whole reception interval, not an action to complete by ten.",
            "から":"This would start reception at departure, but its start is already given as 9:30.",
            "だけ":"This restricts to only the departure time, not the stated interval starting half an hour earlier."
        }, "discourse"),
        b22: item("stance","permission","Funding removes an obligation","お金を払わなくてもかまいません。","It is fine not to pay.", {
            "払わなければなりません":"This makes participants pay despite the city covering the participation cost.",
            "払ってはいけません":"This forbids payment. The notice explains that payment is unnecessary, not prohibited.",
            "払わないと参加できません":"This makes payment a prerequisite for joining, contrary to city funding."
        }, "discourse"),
        b23: item("linking","concession","A plan that remains possible in rain","雨が降っても、出かけます。","I will go out even if it rains.", {
            "降らないと":"This makes not raining the condition for the covered route. The roof is the alternative for rainy weather.",
            "降ったのに":"This reports an unexpected result after actual rain, rather than planning for possible future rain.",
            "降るために":"This makes rain a purpose or cause in a frame that instead needs a concession."
        }, "discourse"),
        b24: item("structure","quotation","Whether versus a statement","あるかどうか確認します。","I will check whether it is there.", {
            "かもしれません":"This closes a conjecture ('might have it'); it cannot serve as the embedded question before 確認してください.",
            "つもりで":"This means acting with an intention or assumption, not checking whether something is true.",
            "ために":"This supplies a purpose or reason, not the content to be checked."
        }, "discourse"),
        b25: item("structure","conditionals","Referring back to a whole situation","友達と行く場合は、その友達にも知らせてください。","If you go with a friend, please tell that friend too.", {
            "それなのに":"This introduces a result contrary to expectation. Informing the friend is a sensible instruction for joint participation, not a surprising contrast.",
            "それまでは":"This refers to a preceding time interval. The prior sentence introduces a possible situation, not a time endpoint.",
            "それとは反対に":"This introduces the opposite case. Showing the notice to the friend supports joint participation rather than opposing it."
        }, "discourse")
    });
    Object.assign(items, {
        c1: item("relations","particles-de-ni","Recipient versus object","先生に写真を見せます。","I show the teacher a photo.", {
            "で":"This marks a means or action site, not the person shown the picture.",
            "を":"The photo already takes を as what is shown. The teacher is the recipient, not a second object.",
            "から":"This marks a source, reversing the direction: the teacher is being shown the photo."
        }),
        c2: item("relations","particles-wa-ga","Contrasting two topics","肉は食べますが、魚は食べません。","I eat meat, but not fish.", {
            "が":"With 食べる here, が would make fish the subject doing the eating, not the contrasting food avoided.",
            "に":"Fish is neither a destination nor a recipient of the eating.",
            "と":"This marks a companion or a list; it does not contrast fish with the previous food."
        }),
        c3: item("time","time","An activity continuing until an endpoint","帰るまで待ちます。帰るまでに終えます。","I wait until they return. / I finish by the time they return.", {
            "までに":"This sets a completion deadline. The waiting lasts throughout the interval and ends at the return.",
            "前から":"This says waiting starts before the return but gives no endpoint; the next sentence identifies the return as the endpoint.",
            "ように":"This makes the mother's return the aim of waiting, rather than the endpoint of the wait."
        }),
        c4: item("time","time","Just completed versus about to finish","終わったところです。終わるところです。","I have just finished. / I am just about to finish.", {
            "終わる":"This means completion is imminent, contradicting はい in response to whether the homework is finished.",
            "終わっている":"This does not express just completing the event. The intended stage uses Vたところ.",
            "終わり":"The masu-stem cannot express this action stage before ところです."
        }),
        c5: item("stance","desire","Observable desire of another person","弟は遊びたがっています。","My brother is showing that he wants to play.", {
            "遊びたくて":"This links a desire as a cause or accompanying state; it does not form the observed-desire predicate before います.",
            "遊びたかった":"This is a past desire and cannot be followed directly by います.",
            "遊びたい":"たい behaves like an i-adjective; it cannot attach directly to います."
        }, "formation"),
        c6: item("linking","listing","Representative actions, not simultaneous actions","掃除をしたり、洗濯をしたりします。","I do things such as cleaning and laundry.", {
            "しても":"This introduces a concession instead of completing the representative たり list.",
            "するなら":"This introduces a condition rather than another listed activity.",
            "しながら":"This expresses simultaneous action, not the second member of the たり...たり list."
        }, "formation"),
        c7: item("structure","quotation","The scope of an embedded question","どう読むか分かりません。","I do not know how to read it.", {
            "どう読むのが":"This leaves a nominalized subject without a predicate; it does not close the embedded question.",
            "どう読むと":"This creates a conditional rather than marking what will be asked.",
            "どう読むために":"This treats the phrase as a purpose, not the unknown pronunciation."
        }, "formation"),
        c8: item("roles","causative","Causing another person to act","母は弟を勉強させました。弟は勉強しました。","Mother made my brother study. / My brother studied.", {
            "勉強されました":"This is passive or honorific, not the causative needed to make the brother study.",
            "勉強していました":"This makes the mother the person studying and leaves 弟を without a suitable role.",
            "勉強になりました":"This means something was educational. It does not mean making someone study."
        }),
        c9: item("stance","decisions","Personal decision versus experience","毎日歩くことにしました。","I decided to walk every day.", {
            "ことがありました":"This recalls past occasions, not adopting a routine from now on.",
            "ことができました":"This reports past ability or success, not a decision.",
            "ところでした":"This describes having been just about to act, not choosing an ongoing routine."
        }),
        c10: item("time","te-auxiliary","An unintended completed action","間違えて消してしまいました。","I accidentally deleted it.", {
            "おきました":"This frames deletion as deliberate preparation, conflicting with the mistake and regret.",
            "みました":"This frames deletion as a deliberate trial, not an accident.",
            "ありました":"てある presents a result as deliberately arranged. Here 間違えて identifies an unintended deletion, and the sentence reports that mishap."
        }),
        c11: item("stance","certainty","Possibility without certainty","病気かもしれません。病気ではありません。","They may be ill. / They are not ill.", {
            "のはずがありません":"This confidently rules out illness, whereas the speaker says they do not know.",
            "ではありません":"This asserts that the person is not ill, unsupported by the lack of contact.",
            "になりたいです":"This means wanting to become ill. It is a desire, not a possible explanation for absence."
        }),
        c12: item("roles","invitation","An invitation to a shared activity","一緒に見ませんか。いいですね。","Would you like to watch together? That sounds good.", {
            "見てください":"This tells the listener to watch, rather than inviting them into a joint plan.",
            "見てもいいですか":"This asks the listener's permission to watch; it does not invite them to join.",
            "見ましょうかと言いました":"This reports an earlier utterance, rather than making the invitation being accepted now."
        }),
        c13: item("linking","purpose","Preventing an unwanted outcome","忘れないように、メモします。","I make a note so that I will not forget.", {
            "うちに":"This means during the time before waking the baby, rather than making quiet speech the means of avoiding it.",
            "のに":"This introduces a contrast ('although we do not wake the baby'), not the aim of speaking quietly.",
            "まま":"This describes maintaining a state, but does not connect speaking softly to a preventive goal as ように does."
        }),
        c14: item("linking","conditionals","A regular consequence","押すと、開きます。","When you press it, it opens.", {
            "のに":"This presents opening as contrary to expectation, not the regular operation of the button.",
            "ための":"This modifies a following noun; the next clause is a complete result statement.",
            "ながら":"This would require 押し and link simultaneous actions by the same actor, not a door responding to a button."
        }, "formation"),
        c15: item("relations","comparison","Relative safety is not absolute safety","この道よりあの道のほうが安全です。","The other road is safer than this one.", {
            "この道のほうが安全です":"This reverses which road is safer: it makes this road safer, while the original ranks it below the other road.",
            "どちらの道も同じくらい安全です":"This asserts equality; ほど...ない explicitly describes an inequality.",
            "どちらの道も安全ではありません":"This judges both roads unsafe. The original comparison only ranks their safety."
        }),
        c21: item("linking","concession","Expectation versus outcome","晴れると思ったのに、雨でした。","I thought it would be sunny, but it rained.", {
            "ので":"This makes expecting sunshine the cause of the rain, not an expectation contradicted by it.",
            "なら":"This makes the completed departure a hypothetical topic rather than contrasting it with what happened.",
            "ために":"This makes the departure a cause or purpose for the rain, not a disappointed expectation."
        }, "discourse"),
        c22: item("roles","giving","Thanking the helper directly","貸してくれてありがとう。","Thank you for lending it to me.", {
            "あげて":"This turns the action toward giving someone else a favor, whereas the writer thanks the reader for helping the writer.",
            "もらって":"This makes someone receive the favor. Here 私に marks the recipient and the reader is the lender being thanked; use 貸してくれてありがとう.",
            "くれると":"This introduces 'if you lend it' rather than connecting the already completed favor to thanks."
        }, "discourse"),
        c23: item("time","te-auxiliary","An existing deliberate result","ここにかけてあります。","It has been hung here.", {
            "かけてみます":"This proposes trying to hang it, whereas 今は describes its present location after the writer has dried it.",
            "かけようと思います":"This states a future intention, not the current arrangement.",
            "かけてほしいです":"This asks for someone else to hang it, not where the writer has put it."
        }, "discourse"),
        c24: item("linking","tara-nara","Taking up someone else's plan","図書館に行くなら、そこで会いましょう。","If you are going to the library, let us meet there.", {
            "行ったのに":"This describes a disappointed expectation after a past visit; tomorrow's plan has not happened.",
            "行っても":"This makes going a concession, not the condition that makes the library handoff convenient.",
            "行くために":"This would make returning the umbrella a means of going to the library. The intended relationship is conditional."
        }, "discourse"),
        c25: item("linking","conditionals","Following two alternative plans","行く場合は、そこで。行かない場合は、家で。","If you go, there; if you do not, at home.", {
            "行かないために":"This treats not going as an established cause or an aim. The reader has not yet decided, so the writer gives a conditional alternative.",
            "行かないのに":"This means despite not going, making the delivery an unexpected contrast rather than a conditional plan.",
            "行かないように":"This makes preventing a trip to the library the purpose of delivery, rather than accommodating either of the reader's possible plans."
        }, "discourse")
    });
    // Composition feedback identifies the selected chunk's role, not just its index.
    const compositions = {
        a16:["structure","particles-no-koto","Nominalizing an activity",["Verb forming the activity","Topic marker for that activity","Focus on this occasion","First-time predicate"]],
        a17:["linking","purpose","A preventive purpose",["The outcome to avoid","Purpose connector","Adverb modifying departure","The action taken"]],
        a18:["relations","comparison","Comparing two actions",["Completes the first action","Marks the comparison standard","The preferred action","Marks the preferred side"]],
        a19:["time","change","A change in ability",["The thing that can be read","The potential verb","Connects the ability to a change","The change predicate"]],
        a20:["structure","quotation","Embedding how to do something",["Object of the embedded action","Question word inside the embedded question","Closes that question with か","The act of asking"]],
        b16:["roles","giving","Receiving help",["The source of help","What was taught","The helper's action in te-form","The recipient's receiving verb"]],
        b17:["relations","particles-mo-shika","A restricted place with negative ability",["Completes the location phrase","Restricts that location","Nominalizes buying for ability","The required negative ability predicate"]],
        b18:["linking","concession","Experience within a concession",["Not even once, paired with a negative","Experience phrase","Negates experience and introduces contrast","The unexpected passive result"]],
        b19:["structure","particles-no-koto","Focusing the time of an event",["Move linked to a directional auxiliary","Completed movement toward here","Turns the whole event into a topic","The time identified by the sentence"]],
        b20:["structure","particles-no-koto","Defining a hobby",["Modifies the following noun","Object of taking","The action being nominalized","Nominalizer defining the hobby"]],
        c16:["structure","ability","The structure of ability",["Modifies the following noun","Object of reading","Nominalized activity before できる","Ability predicate"]],
        c17:["time","te-auxiliary","Preparation for an upcoming meeting",["Modifies the materials","Object of copying","The action in te-form","Preparation auxiliary"]],
        c18:["relations","comparison","Comparing travel actions",["Marks the bus journey as the standard","The faster action","Marks the faster side","The comparison predicate"]],
        c19:["time","te-auxiliary","A completed action with regret",["Omitted accompanying action","Destination of departure","Te-form leading into completion","Regretted completion"]],
        c20:["structure","hearsay","Reporting a future event",["Modifies the following noun","Subject of the reported event","Plain verb before hearsay そう","Hearsay marker"]]
    };
    for (const [id,[domain,unit,focus,roles]] of Object.entries(compositions)) {
        items[id] = {domain,unit,focus,roles,demand:"composition"};
    }
    function feedback(question, selected) {
        const note = items[question.id];
        if (!note || !selected || selected === question.answer) return null;
        if (note.roles) {
            const index = question.chunks.indexOf(selected);
            if (index < 0) return null;
            return `${note.roles[index]}. In the model order it occupies position ${index+1}; ★ is position 3: ${note.roles[2].toLowerCase()}. ${question.explanation}`;
        }
        return note.distractors[selected] || null;
    }
    return {domains, items, feedback};
});
