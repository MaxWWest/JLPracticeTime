(function(root, factory) {
    if (typeof module === "object" && module.exports) module.exports = factory(require("./drill-kit.js"), require("./drill-lexicon.js"));
    else root.ParticlePractice = factory(root.DrillKit, root.DrillLexicon);
})(typeof globalThis === "object" ? globalThis : this, function(k, lex) {
    "use strict";
    const topics = [
        { id: "de-ni", title: "Place, means and destination", particles: "で・に", detail: "Action site, existence, destination, recipient, means and cause." },
        { id: "wo-to", title: "Objects, routes and partners", particles: "を・と", detail: "Objects, movement, departure, companions and quotations." },
        { id: "mo-shika", title: "Addition and limits", particles: "も・しか", detail: "Also, surprisingly many, not even one, and only." },
        { id: "dake-demo", title: "Only, even and suggestions", particles: "だけ・でも", detail: "Restriction, extreme examples, small amounts and casual suggestions." },
        { id: "wa-ga", title: "Topic, focus and contrast", particles: "は・が", detail: "Established topics, new subjects, contrast and focused answers." },
        { id: "no-koto", title: "Noun links and nominalizers", particles: "の・こと", detail: "Possession, explanation, activities and directly perceived events." },
        { id: "te-links", title: "Linking actions and states", particles: "て・ないで・なくて", detail: "Sequence, method, accompanying states and negative causes." },
        { id: "boundaries", title: "Starting points and deadlines", particles: "から・まで・までに", detail: "From, until, by a deadline, and distance versus direction." }
    ].map(topic => ({ ...topic, unit: `particles-${topic.id}` }));
    const mixed = { id: "mixed", unit: "particles-mixed", title: "Mixed particle practice", particles: "助詞", detail: "All eight areas." };
    const readings = [...lex.readings,
        ["銀行","ぎんこう"],["公園","こうえん"],["駅","えき"],["駅前","えきまえ"],["家","いえ"],["机","つくえ"],["上","うえ"],
        ["壁","かべ"],["黒板","こくばん"],["庭","にわ"],["花","はな"],["池","いけ"],["魚","さかな"],["住んで","すんで"],
        ["会議","かいぎ"],["試合","しあい"],["事故","じこ"],["火事","かじ"],["地震","じしん"],["雪","ゆき"],["病気","びょうき"],
        ["鉛筆","えんぴつ"],["紙","かみ"],["木","き"],["日本語","にほんご"],["英語","えいご"],["中国語","ちゅうごくご"],
        ["近所","きんじょ"],["電車","でんしゃ"],["地下鉄","ちかてつ"],["飛行機","ひこうき"],["乗ります","のります"],
        ["降ります","おります"],["出ます","でます"],["渡ります","わたります"],["歩きます","あるきます"],["橋","はし"],["道","みち"],
        ["玄関","げんかん"],["部屋","へや"],["国","くに"],["空港","くうこう"],["友達","ともだち"],["母","はは"],["父","ちち"],
        ["行きます","いきます"],["行きません","いきません"],["帰ります","かえります"],["待ちます","まちます"],["始まります","はじまります"],
        ["終わります","おわります"],["返します","かえします"],["渡します","わたします"],["書きました","かきました"],
        ["読みました","よみました"],["飲みます","のみます"],["飲みません","のみません"],["作ります","つくります"],
        ["買いました","かいました"],["会います","あいます"],["話します","はなします"],["言いました","いいました"],["思います","おもいます"],
        ["来ました","きました"],["来ませんでした","きませんでした"],["残って","のこって"],["枚","まい"],["冊","さつ"],["人","にん"],
        ["時間","じかん"],["円","えん"],["分","ふん"],["一度","いちど"],["何度","なんど"],["一人","ひとり"],["一枚","いちまい"],
        ["何","なに"],["何でも","なんでも"],["誰","だれ"],["全部","ぜんぶ"],["三つ","みっつ"],["二つ","ふたつ"],["一つ","ひとつ"],["少し","すこし"],
        ["子ども","こども"],["初心者","しょしんしゃ"],["簡単","かんたん"],["問題","もんだい"],["分かります","わかります"],
        ["知って","しって"],["選んで","えらんで"],["好き","すき"],["暑い","あつい"],["寒い","さむい"],["夏","なつ"],["冬","ふゆ"],
        ["春","はる"],["秋","あき"],["足","あし"],["頭","あたま"],["痛い","いたい"],["髪","かみ"],["長い","ながい"],["料理","りょうり"],
        ["得意","とくい"],["趣味","しゅみ"],["仕事","しごと"],["理由","りゆう"],["運転","うんてん"],["映画","えいが"],
        ["見ました","みました"],["見えます","みえます"],["聞こえます","きこえます"],["聞きました","ききました"],["声","こえ"],
        ["赤い","あかい"],["青い","あおい"],["妹","いもうと"],["弟","おとうと"],["本当","ほんとう"],["大切","たいせつ"],
        ["忘れない","わすれない"],["起きて","おきて"],["浴びます","あびます"],["朝","あさ"],["勉強","べんきょう"],
        ["砂糖","さとう"],["入れて","いれて"],["入れないで","いれないで"],["使って","つかって"],["使わないで","つかわないで"],
        ["歩いて","あるいて"],["寝て","ねて"],["寝ないで","ねないで"],["食べて","たべて"],["食べないで","たべないで"],
        ["食べなくて","たべなくて"],["持たないで","もたないで"],["出かけました","でかけました"],["困って","こまって"],
        ["会えなくて","あえなくて"],["残念","ざんねん"],["悲しい","かなしい"],["眠れなくて","ねむれなくて"],["疲れて","つかれて"],
        ["お腹","おなか"],["明日","あした"],["今日","きょう"],["毎朝","まいあさ"],["九時","くじ"],["五時","ごじ"],
        ["八時","はちじ"],["十時","じゅうじ"],["七時","しちじ"],["六時","ろくじ"],["月曜日","げつようび"],["金曜日","きんようび"],
        ["来週","らいしゅう"],["来月","らいげつ"],["来年","らいねん"],["三月","さんがつ"],["四月","しがつ"],["夏休み","なつやすみ"],
        ["出発","しゅっぱつ"],["受付","うけつけ"],["提出","ていしゅつ"],["到着","とうちゃく"],["大阪","おおさか"],["京都","きょうと"],
        ["一冊","いっさつ"],["一円","いちえん"],["日","ひ"],["返し","かえし"],["家族","かぞく"],["自分","じぶん"],
        ["折り紙","おりがみ"],["丸い","まるい"],["四角い","しかくい"],["形","かたち"],["顔","かお"],["比較","ひかく"],["咲いて","さいて"],
        ["遅い","おそい"],["来た","きた"],["勉強し","べんきょうし"],["話し","はなし"],
        ["お祭り","おまつり"],["止まりました","とまりました"],["背","せ"],["高い","たかい"],["卵","たまご"],["空","そら"],
        ["飛びます","とびます"],["年","とし"],["三時間","さんじかん"],["五時間","ごじかん"],["一万円","いちまんえん"],["百人","ひゃくにん"],
        ["参加","さんか"],["役","やく"],["立ちたい","たちたい"],["鳥","とり"],["猫","ねこ"],["犬","いぬ"],["飛んで","とんで"],
        ["走って","はしって"],["泣いて","ないて"],["雨","あめ"],["鳴いて","ないて"],["歌って","うたって"],["降って","ふって"],
        ["撮る","とる"],["眠れなかった","ねむれなかった"],["九時","くじ"],
        ["読ん","よん"],["書い","かい"],["買っ","かっ"],["洗っ","あらっ"],["使わ","つかわ"],["飲ま","のま"],["持た","もた"],
        ["起き","おき"],["眠れ","ねむれ"],["会え","あえ"],["歩い","あるい"],["使っ","つかっ"],["話し","はなし"],["帰っ","かえっ"],
        ["開け","あけ"],["入ります","はいります"],["休みます","やすみます"],["働きます","はたらきます"],["多く","おおく"],
        ["東京","とうきょう"],["始めます","はじめます"],["置きます","おきます"],["手","て"],["洗って","あらって"],["食事","しょくじ"],
        ["切って","きって"],["待ち合わせます","まちあわせます"],["話し合いました","はなしあいました"],["座って","すわって"],
        ["飛びません","とびません"],["面接","めんせつ"],["覚めます","さめます"],["横断歩道","おうだんほどう"],
        ["渡って","わたって"],["通って","とおって"],["大学","だいがく"],["卒業","そつぎょう"],["働き始めました","はたらきはじめました"],
        ["休めません","やすめません"],["散歩","さんぽ"],["お酒","おさけ"],["暇","ひま"],["泳げます","およげます"],["泳げません","およげません"],
        ["鳴って","なって"],["消えました","きえました"],["虹","にじ"],["渡る","わたる"],["閉める","しめる"],["目標","もくひょう"],
        ["遊び","あそび"],["脱が","ぬが"],["階段","かいだん"],["上がりました","あがりました"],["困りました","こまりました"],
        ["勝て","かて"],["住所","じゅうしょ"],["鍋","なべ"],["歯","は"],["磨きます","みがきます"],["日本","にほん"],
        ["夕方","ゆうがた"],["月末","げつまつ"],["家賃","やちん"],["払って","はらって"],["昼休み","ひるやすみ"],["戻って","もどって"],
        ["消して","けして"],["運転免許","うんてんめんきょ"],["取ります","とります"],["閉まる","しまる"],["済ませます","すませます"],
        ["通います","かよいます"],["受け付けます","うけつけます"]
    ];
    const records = [];
    // Each frame owns its intended meaning, accepted alternatives, and contrast feedback.
    function frame(topic, id, before, after, answer, meanings, explanation, cue, accepted = [answer]) {
        records.push({ topic, id, before, after, answer, meanings, explanation, cue, accepted });
    }
    const f = frame;
    const location = { "で": "The place where the activity or event happens.", "に": "The location where someone or something exists, or a destination." };
    for (const [place, en] of [["図書館","the library"],["教室","the classroom"],["公園","the park"],["家","home"]]) {
        f("de-ni",`action:${place}`,place,"本を読みます。","で",location,"で marks the site of reading, not the book's destination.",`You read a book at ${en}.`);
        f("de-ni",`exist:${place}`,place,"友達がいます。","に",location,"に locates the person with います. An activity site would use で.",`Your friend is at ${en}.`);
        f("de-ni",`destination:${place}`,place,"行きます。","に",location,"に marks the destination. へ also works for direction, but is not one of these two choices.",`You go to ${en}.`);
    }
    for (const [noun, en] of [["バス","bus"],["電車","train"],["地下鉄","subway"],["自転車","bicycle"]])
        f("de-ni",`transport:${noun}`,noun,"学校に行きます。","で",{"で":"The vehicle is the means of transport.","に":"The vehicle is the destination or the thing boarded."},"で marks how you travel; に with 乗る marks what you board.",`You travel to school by ${en}.`);
    for (const [surface, en] of [["紙","paper"],["黒板","the blackboard"],["壁","the wall"]])
        f("de-ni",`surface:${surface}`,surface,"名前を書きました。","に",{"に":"The name ends up on this surface.","で":"This is where the writing activity happens or what is used to write."},"に marks the surface receiving the writing. Compare 紙に書く and 鉛筆で書く.",`You wrote your name on ${en}.`);
    for (const [tool,en] of [["鉛筆","a pencil"],["ペン","a pen"],["パソコン","a computer"]])
        f("de-ni",`tool:${tool}`,tool,"手紙を書きました。","で",{"で":"The item is the writing tool.","に":"The item is the destination or recipient."},"で marks a tool or means, not a receiving surface.",`You wrote a letter using ${en}.`);
    for (const name of ["田中さん","先生","友達"])
        f("de-ni",`recipient:${name}`,`${name}`,"本を返します。","に",{"に":"The person receives the returned book.","で":"The preceding noun is a means, cause or action site."},"に marks the recipient of 返す.","Mark who receives the returned book.");
    f("de-ni","event","公園","お祭りがあります。","で",location,"An event taking place uses で, even with あります. Existence of an object uses に.","A festival takes place in the park.");
    f("de-ni","cause","雪","電車が止まりました。","で",{"で":"Snow caused the train to stop.","に":"Snow is a location or target."},"で can mark a cause, not only an action location.","Snow caused the train to stop.");
    f("de-ni","clock","九時","授業が始まります。","に",{"に":"Nine o'clock is the starting time.","で":"Nine o'clock is a means or a cause."},"に marks a specific time point.","Class starts at nine.");
    f("de-ni","scope","クラス","田中さんがいちばん背が高いです。","で",{"で":"The comparison is within this class.","に":"The class is a destination or time point."},"で sets the scope of a superlative.","Tanaka is tallest within the class.");
    f("de-ni","material","紙","折り紙を作ります。","で",{"で":"Paper is the material used to make it.","に":"Paper is a destination or receiving surface."},"で can mark a directly used material as well as a tool.","You make origami out of paper.");
    f("de-ni","board","バス","乗ります。","に",{"に":"The bus is the vehicle you board.","で":"The bus is used as a means, but this does not fit 乗る."},"乗る takes に for the vehicle boarded; travel by bus is バスで行く.","You board the bus.");
    f("de-ni","live","大阪","住んでいます。","に",location,"住む locates a continuing residence with に. It is not treated like the action site of 読む.","You live in Osaka.");
    f("de-ni","manifest","庭","花が咲いています。","に",{...location,"を":"The garden is a traversed route or an object."},"Both に and で work here: に locates the flowers in their blooming state; で presents the garden as the site of blooming. を does not fit 咲く.","Flowers are in bloom in the garden. Either location perspective is accepted.",["に","で"]);

    for (const a of lex.actions.filter(a => ["read","write","buy","eat"].includes(a.domain)))
        f("wo-to",`object:${a.id}`,a.noun,`${a.stem}ます。`,"を",{"を":"The noun is the object of the action.","と":"The noun is a companion or quoted content."},"を marks the direct object. と would not mark what is read, written, bought or eaten.",`Mark the object: ${a.actionEn}.`);
    for (const [place,verb,en] of [["橋","渡ります","You cross the bridge."],["公園","歩きます","You walk through the park."],["道","歩きます","You walk along the road."],["空","飛びます","You fly through the sky."]])
        f("wo-to",`route:${place}`,place,`${verb}。`,"を",{"を":"The place is the route traversed.","と":"The place is a companion or counterpart."},"を can mark a route, not just an object being acted on.",en);
    for (const [noun,verb] of [["電車","降ります"],["バス","降ります"],["家","出ます"],["部屋","出ます"]])
        f("wo-to",`depart:${noun}`,noun,`${verb}。`,"を",{"を":"The noun is the place or vehicle being left.","と":"The noun is an accompanying partner."},"を marks departure with 出る and 降りる. It is not the destination.","Mark the place or vehicle you leave.");
    for (const person of ["友達","母","父","田中さん"])
        f("wo-to",`partner:${person}`,person,"映画を見ました。","と",{"と":"The person watched the film together with the speaker.","を":"The person is an object of an action."},"と marks a companion; the film itself is marked by を.","You watched the film together with this person.");
    for (const quote of ["ありがとう","また明日","おはよう","大丈夫です"])
        f("wo-to",`quote:${quote}`,`「${quote}」`,"言いました。","と",{"と":"The words are quoted as what was said.","を":"The phrase is an ordinary direct object, without a quotation marker."},"と closes a quotation before 言う.","Complete the quotation marker.");
    f("wo-to","list","パン","卵を買いました。","と",{"と":"Bread and eggs are linked as purchased items.","を":"Bread is separately marked as an object before another unlinked object."},"と joins nouns in a complete list; the final noun takes を.","You bought bread and eggs.");
    f("wo-to","same","私は田中さん","同じ年です。","と",{"と":"Tanaka is the person used as the comparison standard.","を":"Tanaka is the object of an action."},"と marks the counterpart with 同じ.","You are the same age as Tanaka.");
    for (const shape of ["丸い形","四角い形","赤い顔","悲しい顔"])
        f("wo-to",`state:${shape}`,shape,"しています。","を",{"を":"The noun phrase describes the shape or appearance the subject has.","と":"The noun phrase is quoted or treated as a partner."},"Noun phrase + をしています can describe an appearance or shape; を is not limited to ordinary objects.","Describe the subject's shape or appearance.");

    for (const a of lex.actions.filter(a => ["read","eat","buy"].includes(a.domain))) {
        const past = {read:"read",eat:"ate",buy:"bought"}[a.domain];
        f("mo-shika",`also:${a.id}`,a.noun,`${a.stem}ました。`,"も",{"も":"This item is added to something else already mentioned.","しか":"This is the only item, excluding the others."},"も adds an item and replaces object を. しか expresses restriction and requires a negative predicate.",`You ${past} ${a.en} too, in addition to the other items.`);
        f("mo-shika",`only:${a.id}`,a.noun,`${a.stem}ませんでした。`,"しか",{"しか":"This was the only item acted on; other items were excluded.","も":"This item was not acted on either."},"しか with a negative predicate means 'only'. も with a negative predicate means 'not ... either'.",`You ${past} only ${a.en}; nothing else.`);
    }
    for (const [quantity,tail] of [["一人","来ませんでした。"],["一枚","残っていません。"],["一冊","ありません。"],["一度","行ったことがありません。"]])
        f("mo-shika",`zero:${quantity}`,quantity,tail,"も",{"も":"The amount is zero: not even one.","しか":"The amount is one, and no more than one."},"One + counter + も + negative emphasizes zero. One + counter + しか + negative means one, not zero.","Express zero, not one.");
    for (const quantity of ["三時間","五時間","一万円","百人"])
        f("mo-shika",`large:${quantity}`,quantity,quantity === "百人" ? "来ました。" : "かかりました。","も",{"も":"The quantity is presented as surprisingly large.","しか":"The quantity is presented as limited, requiring a negative ending."},"も emphasizes a large quantity. しか cannot pair with this positive predicate.","Present this quantity as surprisingly large.");
    f("mo-shika","nobody","誰","来ませんでした。","も",{"も":"Nobody came.","しか":"An identified person is the only one who came."},"誰も with a negative predicate means nobody.","Nobody came.");
    f("mo-shika","nowhere","どこへ","行きませんでした。","も",{"も":"The speaker went nowhere.","しか":"Only an identified destination was visited."},"The directional particle can remain before も: どこへも.","You did not go anywhere.");
    for (const place of ["図書館","教室","家","公園"])
        f("mo-shika",`stacked:${place}`,`${place}で`,"勉強しません。","しか",{"しか":"This is the only place where the speaker studies.","も":"The speaker does not study here either."},"The case particle remains before しか: でしか. The negative predicate still expresses a positive restriction, 'only here'.","You study in this place and nowhere else.");

    for (const a of lex.actions.filter(a => ["read","eat","buy"].includes(a.domain)))
        f("dake-demo",`only:${a.id}`,a.noun,`${a.stem}ました。`,"だけ",{"だけ":"This was the only item involved.","でも":"This is an example or an unexpected inclusion, not an exclusive limit."},"だけ excludes other items. It does not require a negative predicate.",`You ${{read:"read",eat:"ate",buy:"bought"}[a.domain]} only ${a.en}.`);
    for (const [noun,en] of [["お茶","tea"],["コーヒー","coffee"],["ジュース","juice"],["水","water"]])
        f("dake-demo",`suggest:${noun}`,noun,"飲みませんか。","でも",{"でも":"The drink is a casual example, leaving other options open.","だけ":"The invitation is restricted to this drink alone."},"Noun + でも makes a light suggestion such as 'tea or something'. It does not mean 'even if' here.",`Suggest ${en} or something; do not exclude other drinks.`);
    for (const [person,en] of [["子ども","a child"],["初心者","a beginner"],["私","me"],["弟","my younger brother"]])
        f("dake-demo",`even:${person}`,`この問題は${person}`,"分かります。","でも",{"でも":"Even this person can understand it; others are not excluded.","だけ":"Only this person can understand it."},"でも includes an extreme or unexpected example. だけ excludes everyone else.",`Even ${en} can understand this problem.`);
    for (const [q,tail,en] of [["誰","参加できます。","Anyone can participate."],["いつ","来てください。","Come at any time."],["何","食べられます。","I can eat anything."],["どこへ","行けます。","I can go anywhere."]])
        f("dake-demo",`any:${q}`,q === "何" ? "{何|なん}" : q,tail,"でも",{"でも":"There is no restriction within the question-word category.","だけ":"Only a specified item would be permitted, not any item."},"Question word + でも gives an unrestricted choice with an appropriate affirmative or invitation.",en);
    for (const [amount,tail,en] of [["一分","長く寝たいです。","Even one more minute of sleep would help."],["一円","安いほうがいいです。","Even one yen cheaper would be better."],["少し","役に立ちたいです。","I want to help, even if only a little."],["一人","多く来てほしいです。","I hope even one more person comes."]])
        f("dake-demo",`minimum:${amount}`,amount,tail,"でも",{"でも":"Even a very small improvement would be welcome.","だけ":"The amount is an exact exclusive limit."},"でも can express a minimal concession: even this small amount would be worthwhile.",en);

    for (const [person,who] of [["田中さん","Tanaka"],["山田さん","Yamada"],["先生","the teacher"],["私","you"]]) {
        f("wa-ga",`focus:${person}`,`A：誰が本を読みましたか。\nB：${person}`,"読みました。","が",{"が":"The reply identifies who performed the action.","は":"The reply makes that person a topic or contrast instead of giving neutral who-focus."},"が directly fills the missing subject in 誰が. は can introduce a contrast, but that is not the requested neutral answer.",`Answer the who-question neutrally: ${who}.`);
        const otherPerson = person === "私" ? "母" : person;
        f("wa-ga",`contrast:${otherPerson}`,otherPerson,"来ますが、私は来ません。","は",{"は":"The two people are explicitly contrasted.","が":"The first person is presented as the subject without explicitly marking that contrast."},"は highlights the requested contrast. が is not universally ungrammatical; it changes how the information is framed.","Explicitly mark the contrast between the two people.");
    }
    for (const [noun,en,tail] of [["鳥","a bird","飛んでいます。"],["猫","a cat","寝ています。"],["犬","a dog","走っています。"],["子ども","a child","泣いています。"]])
        f("wa-ga",`new:${noun}`,`あ、${noun}`,tail,"が",{"が":"An unintroduced subject is noticed in the scene.","は":"The noun is treated as an established topic or a contrast."},"が introduces what has just been noticed. は would bring in topical or contrastive framing.",`You notice ${en} for the first time. Report it without contrasting it with anything.`);
    for (const [noun,predicate] of [["頭","痛いです。"],["足","痛いです。"],["髪","長いです。"],["料理","得意です。"]])
        f("wa-ga",`attribute:${noun}`,`田中さんは${noun}`,predicate,"が",{"が":"The noun identifies the body part, attribute or skill within the topic.","は":"The attribute itself is additionally contrasted with other attributes."},"In a neutral は...が description, は marks the person and が marks the attribute. A second は adds a contrast not requested here.","Describe Tanaka neutrally, without contrasting body parts or skills.");
    for (const [q,tail] of [["誰","来ましたか。"],["何","見えますか。"],["どの人","先生ですか。"],["どの料理","好きですか。"]])
        f("wa-ga",`question:${q}`,q,tail,"が",{"が":"The question asks which subject or target fills the missing information.","は":"The question word would be incorrectly set up as the known topic here."},"These neutral question-word subjects or preference targets take が, not topic は.","Complete the neutral information question.");
    for (const [season,en] of [["夏","summer"],["冬","winter"],["春","spring"],["秋","autumn"]])
        f("wa-ga",`topic:${season}`,season,"好きですが、雨の日は好きではありません。","は",{"は":"The season is a topic contrasted with something else.","が":"The season is the preference target without explicit topical contrast."},"は explicitly frames a contrast. A neutral preference can use が, but explicit contrast is requested here.",`As for ${en}, you like it, but you do not like rainy days. Mark the contrast.`);

    for (const a of lex.actions.filter(a => ["read","write","eat","buy"].includes(a.domain)))
        f("no-koto",`activity:${a.id}`,a.dict,"が好きです。","の",{"の":"The action is treated as an activity that is liked.","こと":"The action is treated as an activity that is liked.","と":"The action is quoted, rather than nominalized."},"Both の and こと can nominalize an activity before が好きです. Neither is globally the only correct nominalizer.","Make the activity the object of a preference. Either natural nominalizer is accepted.",["の","こと"]);
    for (const [person,action] of [["友達","歩いている"],["母","料理している"],["父","本を読んでいる"],["田中さん","走っている"]])
        f("no-koto",`see:${person}`,`${person}が${action}`,"を見ました。","の",{"の":"The speaker directly saw the event taking place.","こと":"An abstract fact is nominalized; it is not the direct perception construction here."},"Directly seeing an event uses のを見ました. こと is not interchangeable in this sensory construction.","You directly saw the action happening.");
    for (const [clause,en] of [["猫が鳴いている","a cat meowing"],["母が歌っている","your mother singing"],["雨が降っている","rain falling"],["子どもが話している","a child talking"]])
        f("no-koto",`hear:${clause}`,clause,"が聞こえます。","の",{"の":"The ongoing sound is directly audible.","こと":"The content is presented as an abstract fact, not an audible event."},"Use の with directly perceived events: のが聞こえます.",`You can directly hear ${en}.`);
    for (const [verb,en] of [["本を読む","reading books"],["映画を見る","watching films"],["料理を作る","cooking"],["写真を撮る","taking photos"]])
        f("no-koto",`hobby:${verb}`,`趣味は${verb}`,"です。","こと",{"こと":"The sentence identifies the hobby as an activity.","の":"This would form an explanatory のです ending, not the requested hobby definition."},"The predicate defining the hobby is Vることです. This is different from an explanatory Vるのです.",`Define your hobby as ${en}.`);
    for (const [noun,en] of [["田中さん","Tanaka"],["先生","the teacher"],["妹","your younger sister"],["友達","your friend"]])
        f("no-koto",`possess:${noun}`,`これは${noun}`,"本です。","の",{"の":"The person is linked to the book as its owner.","こと":"こと means a matter or fact; it cannot directly link this owner and noun."},"Noun + の + noun links the owner to the thing owned.",`The book belongs to ${en}.`);
    f("no-koto","explain","頭が痛いんです。昨日、よく眠れなかった","です。","の",{"の":"The speaker explains the reason behind the current situation.","こと":"The clause becomes a fact nominalization, not this explanatory ending."},"Plain clause + のです provides an explanation. In speech it often contracts to んです.","Complete the explanatory ending, without changing the fixed です.");
    for (const noun of ["先生","自分","学校","家族"])
        f("no-koto",`about:${noun}`,`${noun}の`,"を話しました。","こと",{"こと":"The speaker talked about matters concerning this person or thing.","の":"の alone would not complete Nのことを in this frame."},"Nのこと refers to matters about N. This is not the same pattern as possessive NのN.","Complete the expression meaning 'matters about this person or thing'.");

    // Supply lexical stems: the answer tests the link, not recall of a verb.
    for (const [stem,tail,en] of [
        ["朝ご飯を食べ","学校に行きます。","You go to school without eating breakfast."],
        ["砂糖を入れ","コーヒーを飲みます。","You drink coffee without adding sugar."],
        ["辞書を使わ","本を読みます。","You read without using a dictionary."],
        ["水を飲ま","寝ました。","You went to bed without drinking water."],
        ["傘を持た","出かけました。","You went out without taking an umbrella."]
    ]) f("te-links",`without:${stem}`,stem,`、${tail}`,"ないで",{"ないで":"The first action is not done while the main action goes ahead.","なくて":"The nonoccurrence is presented as a cause, not the requested manner."},"ないで expresses doing B without doing A. なくて instead links a negative state or cause in these contrasts.",en);
    for (const [stem,tail,en] of [
        ["手を洗っ","食事をします。","First wash your hands, then eat."],
        ["朝六時に起き","シャワーを浴びます。","You get up at six, then take a shower."],
        ["切符を買っ","電車に乗ります。","First buy a ticket, then board the train."]
    ]) f("te-links",`sequence:${stem}`,stem,`、${tail}`,"て",{"て":"The first action happens before the next action.","ても":"The next action holds even if the first action happens."},"て links the actions in sequence. ても makes a concession instead.",en);
    for (const [stem,tail,en] of [["よく眠れ","疲れています。","Being unable to sleep well is why you are tired."],["友達に会え","残念です。","You are disappointed because you cannot meet your friend."],["お金が","困っています。","Having no money is why you are in difficulty."],["朝ご飯を食べ","お腹がすいています。","Not eating breakfast is why you are hungry."]])
        f("te-links",`cause:${stem}`,stem,`、${tail}`,"なくて",{"なくて":"The negative state is linked as the reason for the following feeling or state.","ないで":"The main action is carried out without doing the first action."},"なくて links a negative cause to a feeling or state. ないで normally presents an omitted action accompanying another action.",en);
    for (const [method,end,tail,en] of [["歩い","て","学校に行きます。","You go to school on foot."],["鉛筆を使っ","て","名前を書きます。","You write your name using a pencil."],["日本語を話し","て","練習します。","You practice by speaking Japanese."],["大きな声で読ん","で","覚えます。","You memorize by reading aloud."]])
        f("te-links",`method:${method}`,method,tail,end,{[end]:"This completes the te-form and states the method used.",[end+"も"]:"This completes a concessive form: even if the action happens."},"The te-form can express a method, not only a sequence. Here the link is part of a conjugated verb, not a noun particle.",en);
    for (const [stem,end,tail,en] of [["本を読ん","で","寝ます。","Read the book, then go to bed."],["メールを書い","て","送ります。","Write the email, then send it."],["家に帰っ","て","休みます。","Return home, then rest."],["ドアを開け","て","部屋に入ります。","Open the door, then enter the room."]]) {
        f("te-links",`then:${stem}`,stem,`、${tail}`,end,{[end]:"The first action precedes the second.",[end+"も"]:"The second happens even if the first happens."},"Complete the te-form link to sequence the two actions, rather than make a concession.",en);
    }

    for (const time of ["五時","八時","十時","金曜日"]) {
        f("boundaries",`until:${time}`,time,"待ちます。","まで",{"まで":"Waiting continues until this time.","までに":"This is a deadline for completing something before or at the time.","から":"Waiting starts at this time."},"まで gives the endpoint of a continuing action. までに gives a completion deadline.","You keep waiting until the specified time.");
        f("boundaries",`by:${time}`,time,"本を返してください。","までに",{"までに":"The return must be completed no later than this time.","まで":"An activity continues until this time.","から":"The action starts from this time."},"までに marks the deadline for a one-time return; it does not mean keep returning until then.","The book must be returned by this deadline, possibly earlier.");
        f("boundaries",`start:${time}`,time,"受付を始めます。","から",{"から":"Reception starts from this time.","まで":"Reception continues up to this endpoint.","までに":"Reception must start no later than this deadline."},"から identifies the starting boundary. までに would allow the start to be earlier.","Reception starts at this time, not earlier.");
    }
    for (const [start,end] of [["九時","五時"],["月曜日","金曜日"],["三月","四月"],["今日","来週"]])
        f("boundaries",`range:${start}`,`${start}から${end}`,"働きます。","まで",{"まで":"The work continues through the interval to its endpoint.","までに":"A task must be finished by a deadline rather than continuing through an interval."},"から...まで sets a range. The requested continuous period is not a completion deadline.","State the full interval during which you work.");
    for (const [from,to] of [["家","駅"],["学校","図書館"],["東京","大阪"],["京都","東京"]]) {
        f("boundaries",`origin:${from}`,from,`${to}まで行きます。`,"から",{"から":"The noun is the journey's starting point.","まで":"The noun is the journey's endpoint."},"から marks where a journey begins; まで marks its endpoint.","Mark the journey's origin.");
        f("boundaries",`endpoint:${from}`,`${from}から${to}`,"行きます。","まで",{"まで":"The noun sets how far the journey goes.","までに":"The noun is incorrectly used as a time deadline."},"まで can mark a spatial endpoint. に is also possible for a destination, but is not offered in this contrast.","Mark how far the journey goes, not a deadline.");
    }

    // Additional frames vary predicates and relationships, not just noun substitutions.
    function extend(topic, domain, rows, answer, meanings, explanation) {
        rows.forEach(([before,after,cue],i)=>f(topic,`${domain}:extra-${i}`,before,after,answer,meanings,explanation,cue));
    }
    extend("de-ni","action",[
        ["台所","野菜を切っています。","You are cutting vegetables in the kitchen."],
        ["駅前","友達と待ち合わせます。","You meet up with a friend in front of the station."],
        ["体育館","試合があります。","A match takes place in the gym."],
        ["会議室","新しい計画を話し合いました。","You discussed the new plan in the meeting room."]
    ],"で",location,"で marks where an activity or event takes place, including an event described with あります.");
    extend("de-ni","destination",[
        ["いす","座ってください。","Please sit down on the chair."],
        ["かばん","本を入れました。","You put the book into the bag."],
        ["壁","写真をかけました。","You hung the photo on the wall."],
        ["駅","着いたら電話してください。","Call when you arrive at the station."]
    ],"に",location,"に marks the endpoint or target of sitting, placing, hanging or arriving. で would mark an activity site instead.");
    extend("de-ni","cause",[
        ["病気","学校を休みました。","Illness was the reason you missed school."],
        ["台風","飛行機が飛びませんでした。","The typhoon caused the flight not to operate."]
    ],"で",{"で":"The noun gives the cause.","に":"The noun is a destination or time point."},"で can attach a noun naming a cause to the result.");
    extend("de-ni","clock",[
        ["来週の月曜日","面接があります。","The interview is on Monday next week."],
        ["毎朝七時","目が覚めます。","You wake up at seven every morning."]
    ],"に",{"に":"This is the time when the event happens.","で":"This would mark a means, cause or endpoint, not the requested time point."},"に marks the specified time point. It does not mean an action continues until that time.");

    extend("wo-to","route",[
        ["横断歩道","渡ってください。","Please cross at the pedestrian crossing."],
        ["トンネル","通って駅に行きます。","You pass through the tunnel to reach the station."]
    ],"を",{"を":"The place is the path traversed.","と":"The noun is a partner or quotation."},"Movement through or across a place can take route を.");
    extend("wo-to","depart",[
        ["大学","卒業して、働き始めました。","You graduated from university and started working."],
        ["タクシー","降りたら、財布がありませんでした。","After getting out of the taxi, you noticed your wallet was missing."]
    ],"を",{"を":"The noun is the institution or vehicle being left.","と":"The noun is an accompanying partner."},"を marks departure, including leaving an institution with 卒業する.");
    extend("wo-to","partner",[
        ["先生","相談してから決めます。","You will decide after consulting with your teacher."],
        ["友達","約束をしました。","You made an agreement with a friend."]
    ],"と",{"と":"The person is the other party in the interaction.","を":"The person is marked as an object, not the partner."},"と marks the other party in a mutual interaction such as consultation or an agreement.");
    extend("wo-to","quote",[
        ["明日は雨だ","思います。","You think it will rain tomorrow."],
        ["この花は「さくら」","いいます。","This flower is called sakura."]
    ],"と",{"と":"The preceding words give a thought or a name.","を":"The words are treated as an ordinary object, without marking their content."},"と marks quoted or thought content and the name used with いう.");

    extend("mo-shika","zero",[
        ["財布には一円","入っていません。","There is not even one yen in the wallet."],
        ["テストでは一つ","間違えませんでした。","You did not get even one answer wrong."],
        ["今日は一回","電話がありませんでした。","There was not even one phone call today."],
        ["昨日は一時間","寝ていません。","You did not sleep even one hour yesterday."]
    ],"も",{"も":"Not even one: the stated minimum was not reached.","しか":"Only one: that amount occurred, but no more."},"One + counter + も + negative denies even that minimum. しか + negative would affirm a limited amount instead.");
    extend("mo-shika","stacked",[
        ["この話は母に","話していません。","You have told only your mother about this."],
        ["駅まで","行きませんでした。","You went only as far as the station."],
        ["日曜日に","休めません。","Sunday is the only day you can take off."],
        ["この店で","買えません。","This is the only shop where it can be bought."]
    ],"しか",{"しか":"The preceding person, endpoint, time or place is the only one.","も":"That person, endpoint, time or place is also denied."},"Case particles such as に, まで and で remain before しか. The negative predicate expresses a positive restriction: only this.");

    extend("dake-demo","only",[
        ["午前中","働きます。","You work only during the morning."],
        ["名前","書いてください。","Write only your name, nothing else."],
        ["見る","で、買いません。","You will only look, not buy."],
        ["必要な物","持って行きます。","You will take only the things you need."],
        ["一回","説明します。","You will explain exactly once, not repeatedly."],
        ["今日は私","家にいます。","Only you are at home today."]
    ],"だけ",{"だけ":"This is an exclusive limit.","でも":"This includes an example without excluding other possibilities."},"だけ restricts the scope to the item, amount or activity mentioned. It can follow a noun or a dictionary-form verb.");
    extend("dake-demo","suggest",[
        ["公園に","行きませんか。","Suggest going to the park or somewhere, leaving the destination open."],
        ["音楽","聞きましょうか。","Suggest listening to music or something."],
        ["雑誌","読んで待っていてください。","Suggest reading a magazine or something while waiting."],
        ["週末は映画","見ようかな。","You are considering a film or something for the weekend."],
        ["サンドイッチ","作りましょうか。","Offer to make sandwiches or something; other foods are possible."],
        ["先生に","聞いてみましょう。","Suggest asking the teacher or someone like that."]
    ],"でも",{"でも":"This is a suggested example, not the sole permitted choice.","だけ":"This would limit the action to this item or person alone."},"でも offers an example casually. A case particle can remain before it, as in 公園にでも or 先生にでも.");
    extend("dake-demo","even",[
        ["雨の日","散歩します。","You take a walk even on rainy days, not only on rainy days."],
        ["一人","大丈夫です。","You will be fine even alone."],
        ["忙しい人","参加できます。","Even busy people can participate."],
        ["この店は夜","開いています。","The shop is open even at night."],
        ["このかばんは子ども","持てます。","Even a child can carry this bag."],
        ["初めて","簡単に作れます。","You can make it easily even on your first try."]
    ],"でも",{"でも":"This includes an unexpected or less favorable case.","だけ":"This excludes all other cases."},"でも includes the stated case without limiting the claim to it. だけ would make it exclusive.");

    const focusMeanings = {"が":"This identifies the answer to the subject question.","は":"This introduces a topic or contrast rather than neutral subject focus."};
    extend("wa-ga","focus",[
        ["A：誰がケーキを作りましたか。\nB：妹","作りました。","Answer who made the cake, without adding a contrast."],
        ["A：誰が窓を開けましたか。\nB：私","開けました。","Identify yourself as the person who opened the window."],
        ["A：何が壊れましたか。\nB：時計","壊れました。","Identify what broke: the clock."],
        ["A：どのバスが空港に行きますか。\nB：このバス","行きます。","Identify this bus as the answer to the question."],
        ["A：誰が先に着きましたか。\nB：山田さん","先に着きました。","Answer who arrived first, neutrally."],
        ["A：どれがいちばん安いですか。\nB：これ","いちばん安いです。","Identify which one is cheapest, neutrally."]
    ],"が",focusMeanings,"が supplies the focused answer to the question. は would add a different topic or contrastive framing.");
    extend("wa-ga","contrast",[
        ["コーヒー","飲みますが、お酒は飲みません。","Explicitly contrast coffee, which you drink, with alcohol, which you do not."],
        ["漢字","読めますが、書けません。","As for kanji, you can read it but cannot write it. Make kanji the topic."],
        ["今日は忙しいですが、明日","暇です。","Explicitly contrast tomorrow with today."],
        ["この本","読みましたが、その本はまだです。","Explicitly contrast this book with the other one."],
        ["朝ご飯","食べましたが、昼ご飯はまだです。","Explicitly contrast breakfast with lunch."],
        ["弟","泳げますが、私は泳げません。","Explicitly contrast your brother's ability with yours."]
    ],"は",{"は":"This marks the requested topic or contrast.","が":"This would focus or describe a subject instead of explicitly marking that topic or contrast."},"は marks the stated topic or contrast. Other particles may produce grammatical sentences in other contexts; this task asks for explicit topical framing.");
    extend("wa-ga","new",[
        ["あ、バス","来ました。","You have just spotted the bus arriving. Report the event neutrally."],
        ["あ、窓","開いています。","You have just noticed an open window. Report it without contrast."],
        ["あ、電話","鳴っています。","You suddenly notice the telephone ringing. Report what is happening."],
        ["あ、財布","落ちています。","You notice a wallet lying on the ground for the first time."],
        ["あ、電気","消えました。","The lights suddenly went out. Report the new event."],
        ["あ、虹","出ています。","You have just noticed a rainbow. Announce the sight without contrast."]
    ],"が",{"が":"This presents a newly noticed subject or event.","は":"This would treat the noun as a topic or contrast."},"が suits a neutral report of a newly noticed scene. は adds topical or contrastive framing.");
    extend("wa-ga","attribute",[
        ["この部屋は窓","大きいです。","Describe the room's windows neutrally, without contrasting its features."],
        ["この店はパン","おいしいです。","Describe the bread at this shop neutrally, without contrasting products."],
        ["弟は目","青いです。","Describe your brother's eye color, without contrasting body parts."],
        ["私は冷たい水","ほしいです。","State what you want neutrally: cold water."],
        ["駅からは海","見えます。","State what is visible from the station, without contrast."],
        ["妹はピアノ","弾けます。","State your sister's piano-playing ability without contrasting instruments."]
    ],"が",{"が":"This marks the attribute, desired thing, perceived object or ability target.","は":"This would explicitly topicalize or contrast that item."},"が fits this neutral description. A second は would add contrast; the task does not request it.");

    extend("no-koto","see",[
        ["子どもが道を渡る","を見ました。","You directly saw a child cross the road."],
        ["バスが出発する","を見ました。","You directly saw the bus depart."],
        ["友達が窓を閉める","を見ました。","You directly saw your friend close the window."],
        ["雪が降っている","が見えます。","You can directly see the snow falling."]
    ],"の",{"の":"This nominalizes a directly perceived event.","こと":"This treats the clause as an abstract fact instead."},"Direct visual perception of an event uses の with 見る or 見える, rather than abstract こと.");
    extend("no-koto","hobby",[
        ["私の仕事は荷物を運ぶ","です。","Define your job as carrying luggage."],
        ["毎日の楽しみは犬と遊ぶ","です。","Define your daily pleasure as playing with your dog."],
        ["今年の目標は日本語で手紙を書く","です。","Define this year's goal as writing a letter in Japanese."],
        ["大切なのは毎日続ける","です。","Identify what matters as continuing every day."]
    ],"こと",{"こと":"This defines the preceding topic as an activity or practice.","の":"This would produce an explanatory のです rather than the requested definition."},"Vることです identifies the activity constituting the topic. An explanatory のです serves a different function.");

    extend("te-links","without",[
        ["窓を開け","寝ます。","You sleep without opening the window."],
        ["宿題をし","遊びに行きました。","You went out to play without doing your homework."],
        ["だれにも言わ","帰りました。","You went home without telling anyone."],
        ["テレビをつけ","食事をしました。","You ate without turning on the television."],
        ["靴を脱が","部屋に入りました。","You entered the room without taking your shoes off."],
        ["エレベーターを使わ","階段で上がりました。","You went upstairs using the stairs, without using the elevator."]
    ],"ないで",{"ないで":"The main action is performed without doing the first action.","なくて":"The negative clause is linked as a cause or state instead."},"ないで marks an omitted action accompanying what the person does. The requested meaning is 'without doing', not 'because it did not happen'.");
    extend("te-links","cause",[
        ["鍵が見つから","困っています。","You are in difficulty because you cannot find your key."],
        ["漢字が読め","困りました。","Being unable to read the kanji caused difficulty."],
        ["バスが来","心配になりました。","The bus not coming made you worried."],
        ["予定が分から","困っています。","Not knowing the schedule is causing difficulty."],
        ["だれもけがをし","よかったです。","You are relieved because nobody was injured."],
        ["試合に勝て","残念でした。","You were disappointed because you could not win the match."]
    ],"なくて",{"なくて":"The negative fact is the cause of the following feeling or state.","ないで":"An action is omitted while another is carried out."},"なくて links a negative cause to a feeling or state. Here the task is to express why the feeling arose.");
    extend("te-links","sequence",[
        ["電車を降り","バスに乗りました。","You got off the train, then boarded a bus."],
        ["住所を確認し","手紙を送りました。","You checked the address, then sent the letter."],
        ["野菜を切っ","鍋に入れます。","First cut the vegetables, then put them in the pot."],
        ["顔を洗っ","歯を磨きます。","You wash your face, then brush your teeth."]
    ],"て",{"て":"The first action happens, followed by the second.","ても":"The second action holds even if the first happens."},"The te-form connects the actual sequence of actions. ても would express a concession instead.");
    extend("te-links","method",[
        ["地図を見","駅まで行きました。","You used a map to find your way to the station."],
        ["スマホを使っ","写真を撮りました。","You took the photo using a smartphone."],
        ["友達に聞い","住所を調べました。","You found out the address by asking a friend."],
        ["何度も書い","漢字を覚えます。","You memorize kanji by writing it repeatedly."]
    ],"て",{"て":"The first action is the means used to accomplish the second.","ても":"The second holds even if the first action occurs."},"The te-form can express the method used, not just chronological order. ても adds a concessive meaning not requested here.");
    extend("te-links","state",[
        ["帽子をかぶっ","外で待っています。","You are waiting outside with your hat on."],
        ["眼鏡をかけ","本を読みます。","You read with your glasses on."],
        ["窓を開け","寝ました。","You slept with the window open."],
        ["いすに座っ","話を聞きました。","You listened while seated in a chair."]
    ],"て",{"て":"The first action establishes the state accompanying the second.","ても":"The second holds even if the first action happens."},"A te-form can describe the state in which the main activity is done. It need not mean two separate successive activities.");
    extend("te-links","parallel",[
        ["母は料理をし","父は皿を洗いました。","Your mother cooked and your father washed the dishes. Link the two facts, without concession."],
        ["授業は九時に始まっ","三時に終わります。","Class starts at nine and ends at three. Link the two schedule facts."]
    ],"て",{"て":"This connects the two facts without a concessive relationship.","ても":"This says the second holds even if the first is true."},"The te-form can connect parallel facts, including clauses with different subjects. Here there is no 'even if' meaning.");

    const boundaryMeanings = {"まで":"An activity or state continues up to this endpoint.","までに":"Completion must happen no later than this deadline.","から":"This is the starting point."};
    extend("boundaries","until",[
        ["夜十一時","勉強しました。","You kept studying until eleven at night."],
        ["来月","日本にいます。","You will stay in Japan until next month."],
        ["雨がやむ","ここで待ちましょう。","Keep waiting here until the rain stops."],
        ["母が帰る","テレビを見ていました。","You kept watching TV until your mother returned."],
        ["夏休みが終わる","店で働きます。","You will work at the shop until the summer vacation ends."],
        ["明日の朝","電気をつけておきます。","Keep the light on until tomorrow morning."],
        ["十時","この部屋が使えます。","The room remains available until ten."],
        ["夕方","雨が降っていました。","It kept raining until evening."],
        ["先生が来る","静かに待っていてください。","Keep waiting quietly until the teacher comes."],
        ["試験が終わる","スマホは使えません。","You cannot use your phone until the exam ends."]
    ],"まで",boundaryMeanings,"まで marks the endpoint of a continuing activity or state, not a deadline for completing one event.");
    extend("boundaries","by",[
        ["明日","レポートを出してください。","Submit the report by tomorrow; earlier is fine."],
        ["出発する","切符を買っておきます。","Buy the ticket before departure, not while traveling."],
        ["会議が始まる","資料をコピーしてください。","Have the copies ready by the start of the meeting."],
        ["寝る","宿題を終わらせます。","Finish the homework by bedtime."],
        ["月末","家賃を払ってください。","Pay the rent no later than the end of the month."],
        ["昼休みが終わる","戻ってください。","Return no later than the end of lunch break."],
        ["先生が来る","黒板を消してください。","Erase the board before the teacher arrives."],
        ["来年の春","運転免許を取ります。","Obtain your driving license by next spring; earlier is fine."],
        ["今日の午後三時","返事をください。","Give your reply no later than three this afternoon."],
        ["店が閉まる","買い物を済ませます。","Finish the shopping before the shop closes."]
    ],"までに",boundaryMeanings,"までに sets a completion deadline. The event can happen earlier; it does not continue throughout the interval.");
    extend("boundaries","start",[
        ["四月","新しい学校に通います。","You start attending the new school in April, not before."],
        ["来週","毎日運動するつもりです。","You intend to exercise daily starting next week."],
        ["今日","予約を受け付けます。","Reservations open today, not earlier."],
        ["午後一時","会議を始めます。","The meeting starts at one in the afternoon, not earlier."]
    ],"から",boundaryMeanings,"から marks when an activity begins. A deadline with までに would allow an earlier start.");
    extend("boundaries","origin",[
        ["空港","ホテルまでバスで行きます。","Mark the airport as the starting point of the bus trip."],
        ["窓","海が見えます。","The sea can be seen from the window. Mark the viewpoint."],
        ["この駅","歩いて十分です。","It is a ten-minute walk from this station."],
        ["山の上","写真を撮りました。","You took the photo from the mountaintop. Mark the point from which it was taken."]
    ],"から",{"から":"This is the starting point or viewpoint.","まで":"This would mark a destination or endpoint."},"から can mark a spatial source or viewpoint, as well as the beginning of a trip.");

    function buildBank(topicId) {
        return records.filter(r => topicId === "mixed" || r.topic === topicId).flatMap(r => {
            const unit = `particles-${topicId}`;
            const scene = { id: `${r.topic}:${r.id}`, domain: `${r.topic}:${r.id.split(":")[0]}`, words: [r.before] };
            const options = Object.keys(r.meanings);
            const gap = k.gap("Particle or link",r.accepted,options);
            gap.optionFeedback = Object.fromEntries(options.filter(p => !r.accepted.includes(p)).map(p => [p,`${r.meanings[p]} ${r.explanation}`]));
            const q = k.cloze(unit,"choose-link",r.topic,scene,0,r.cue,[{label:"Complete the Japanese",segments:[r.before,gap,r.after]}],r.explanation,{recordId:r.id,topic:r.topic},"Choose the particle or link that conveys the stated meaning.");
            q.kind = "Choose the particle";
            q.meta.familyLabel = "Particles";
            q.meta.pattern = topics.find(t=>t.id===r.topic).particles;
            q.meta.pitfall = topics.find(t=>t.id===r.topic).title;
            q.meta.sentenceKey = `${r.before}${r.answer}${r.after}`.replace(/\{([^|{}]+)\|[^{}]+\}/g,"$1");
            if (r.accepted.length > 1) return [q];
            const meanings = k.unique(Object.values(r.meanings));
            const interpret = k.choice(unit,"interpret-link",r.topic,scene,1,`${r.before}${r.answer}${r.after}`,meanings,r.meanings[r.answer],r.explanation,{recordId:r.id,topic:r.topic},`What does ${r.answer} express here?`);
            interpret.subprompt = "";
            interpret.kind = "Interpret the particle";
            interpret.meta = {...interpret.meta,familyLabel:q.meta.familyLabel,pattern:q.meta.pattern,pitfall:q.meta.pitfall,sentenceKey:q.meta.sentenceKey};
            return [q,interpret];
        });
    }
    function select(unit, bank, count, options = {}) {
        const seed = options.seed ?? Date.now();
        options = {...options,seed};
        // Different gaps in the same sentence still count as a repeated sentence.
        // Exhaust unseen sentences first, then release the least recently seen ones.
        const recent = new Map((options.recent || []).map((key,i)=>[key,i]));
        const groups = new Map();
        for (const q of k.shuffle(bank,k.random(seed))) {
            const key = q.meta.sentenceKey;
            if (!groups.has(key)) groups.set(key,{family:q.meta.familyKey,last:-1,items:[]});
            const group = groups.get(key);
            group.last = Math.max(group.last,recent.get(q.meta.familyKey) ?? -1);
            if (q.meta.familyKey === group.family) group.items.push(q);
        }
        const ordered = [...groups.values()].sort((a,b)=>a.last-b.last);
        const freshCount = ordered.filter(g=>g.last<0).length;
        const eligible = ordered.slice(0,Math.max(count,freshCount)).flatMap(g=>g.items);
        const queue = k.select(unit,eligible,count,options);
        const blanks = queue.filter(q=>q.fields);
        // Meaning balance alone can put every こと answer in interpretation items.
        // Keep a short round from accidentally teaching one constant blank answer.
        if (blanks.length > 1 && new Set(blanks.map(q=>q.answer)).size === 1) {
            const recent = new Set(options.recent || []);
            const used = new Set(queue.map(q=>q.meta.familyKey));
            const candidates = k.shuffle(eligible.filter(q=>q.fields && q.answer!==blanks[0].answer && !used.has(q.meta.familyKey)),k.random(seed));
            candidates.sort((a,b)=>Number(recent.has(a.meta.familyKey))-Number(recent.has(b.meta.familyKey)));
            if (candidates.length) queue[queue.indexOf(blanks.at(-1))] = k.select(unit,[candidates[0]],1,options)[0];
        }
        return queue;
    }
    function selectRetry(unit, question, bank, used, options = {}) {
        const usedSentences = new Set(bank.filter(q=>used.has(q.meta.familyKey)).map(q=>q.meta.sentenceKey));
        usedSentences.add(question.meta.sentenceKey);
        const candidates = bank.filter(q=>q.meta.domain===question.meta.domain && q.meta.task===question.meta.task
            && !used.has(q.meta.familyKey) && !usedSentences.has(q.meta.sentenceKey));
        return select(unit,candidates,1,options)[0] || null;
    }
    const modules = Object.fromEntries([...topics,mixed].map(topic => [topic.unit,{
        version:k.version(topic.unit),readings,
        create:({aliases=[]}={})=>k.engine(()=>buildBank(topic.id),readings,aliases),
        selectQueue:(bank,count,options={})=>select(topic.unit,bank,count,options),
        selectRetry:(question,bank,used,options={})=>selectRetry(topic.unit,question,bank,used,options)
    }]));
    return {topics,mixed,modules,readings,records,buildBank};
});
