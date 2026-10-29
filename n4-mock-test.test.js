const test = require("node:test");
const assert = require("node:assert/strict");
const mock = require("./n4-mock-test.js");
const furigana = require("./furigana.js").create([...require("./particle-practice.js").readings,...mock.readings]);

const legacyKeys = {
    a:["に","を","までに","熱そうです","行ったことがありません","歩こう","あります","来なくてもいいです","届くか","泳げるように","持ちましょうか","ほど","おく","くれました","聞き","これが","早く","電話する","ように","使うか","という","洗ってから","もらいました","でも","作ろう"],
    b:["で","しか","食べる","降る","もいいですか","帰ったら","なければなりません","壊されました","ことになりました","みます","はず","寝た","食べないで","ために","のに","教えて","買うことが","ないのに","のは","撮る","来たとき","なくてもいい","決めてから","おかげで","話せるように"],
    c:["に","は","まで","終わった","遊びたがって","したり","どう読むか","勉強させました","ことにしました","しまいました","のかもしれません","見ませんか","ゆっくり","と","ほど","読むことが","コピーして","日本語を","出て","できる","ので","置くなら","測ってから","置いてあります","ように"]
};
const keys = {
    a:["に","を","までに","熱そうです","行ったことがありません","歩こう","あります","来なくてもいいです","届くか","泳げるように","持ちましょうか","昨日ほど暖かくありません","おく","くれました","聞き","これが","早く","電話する","ように","使うか","という","洗ってから","もらいました","でも","作ろう"],
    b:["で","しか","食べる","合格した","もいいですか","帰ったら","なければなりません","壊されました","ことになりました","みます","はず","寝た","食べないで","ために","のに","教えて","買うことが","ないのに","のは","撮る","まで","払わなくてもかまいません","降っても","かどうか","その場合は"],
    c:["に","は","まで","終わった","遊びたがって","したり","どう読むか","勉強させました","ことにしました","しまいました","かもしれません","見ませんか","ように","と","あの道のほうが安全です","読むことが","コピーして","ほうが","出て","できる","のに","くれて","かけてあります","行くなら","行かない場合は"]
};

for (const p of mock.papers) {
    test(p.title+": 15 forms, 5 compositions, 5 linked gaps and independent answer key",()=>{
        assert.equal(p.questions.length,25);
        assert.deepEqual(p.questions.map(q=>q.answer),keys[p.id]);
        assert.equal(new Set(p.questions.map(q=>q.id)).size,25);
        assert.deepEqual(p.questions.map(q=>q.section),[...Array(15).fill("form"),...Array(5).fill("order"),...Array(5).fill("text")]);
        assert.deepEqual([...p.passage.paragraphs.join("").matchAll(/【(\d+)】/g)].map(m=>+m[1]),[21,22,23,24,25]);
        for(const q of p.questions){
            assert.equal(q.options.length,4);
            assert.equal(new Set(q.options).size,4);
            assert.equal(q.options.filter(o=>o===q.answer).length,1);
            assert.ok(q.explanation.length>40);
            assert.ok(q.topic);
            if(q.section==="form")assert.equal(q.prompt.match(/（　）/g)?.length,1);
            if(q.section==="order"){
                assert.equal(q.chunks.length,4);
                assert.equal(q.answer,q.chunks[q.star]);
                assert.equal(q.star,2);
            }
        }
    });
    test(p.title+": all correct, blank, invalid and mixed submissions have exact raw totals",()=>{
        const paper=mock.createPaper(p.id,17);
        const answers=Object.fromEntries(paper.questions.map((q,i)=>[q.id,keys[p.id][i]]));
        assert.equal(mock.score(paper,answers).correct,25);
        assert.equal(mock.score(paper,answers).percent,100);
        assert.equal(mock.score(paper).unanswered,25);
        assert.equal(mock.score(paper).correct,0);
        answers[paper.questions[0].id]=paper.questions[0].options.find(o=>o!==paper.questions[0].answer);
        answers[paper.questions[1].id]=paper.questions[1].options.find(o=>o!==paper.questions[1].answer);
        delete answers[paper.questions[23].id];
        answers[paper.questions[24].id]="not an option";
        const score=mock.score(paper,answers);
        assert.equal(score.correct,21);
        assert.equal(score.percent,84);
        assert.equal(score.unanswered,2);
        assert.deepEqual(score.sections.map(s=>s.correct),[13,5,3]);
    });
    test(p.title+": deterministic, balanced option shuffling does not mutate authored content",()=>{
        const before=JSON.stringify(p);
        const layouts=new Set();
        for(let seed=1;seed<=100;seed++){
            const paper=mock.createPaper(p.id,seed);
            assert.deepEqual(paper,mock.createPaper(p.id,seed));
            assert.deepEqual(paper.questions.map(q=>q.number),Array.from({length:25},(_,i)=>i+1));
            const positions=paper.questions.map(q=>q.options.indexOf(q.answer));
            assert.deepEqual([0,1,2,3].map(i=>positions.filter(n=>n===i).length).sort(),[6,6,6,7]);
            for(let i=0;i<25;i++)assert.deepEqual([...paper.questions[i].options].sort(),[...p.questions[i].options].sort());
            layouts.add(JSON.stringify(positions));
        }
        assert.equal(layouts.size,100);
        assert.equal(JSON.stringify(p),before);
    });
    test(p.title+": every displayed kanji has an authored/shared reading",()=>{
        const strings=[p.passage.title,...p.passage.paragraphs,...p.questions.flatMap(q=>[q.prompt,q.before,q.after,q.explanation,...q.options].filter(Boolean))];
        for(const string of strings){
            const missing=furigana.tokens(string).filter(t=>!t.reading&&/[一-龯々]/.test(t.text));
            assert.deepEqual(missing,[],string);
        }
    });
}
test("Context-sensitive furigana distinguishes snow falling from getting off a bus",()=>{
    assert.match(furigana.render("降りた"),/<rt>お<\/rt>/);
    assert.match(furigana.render("{降り|ふり}"),/<rt>ふり<\/rt>/);
    assert.match(furigana.render("降れば"),/<rt>ふ<\/rt>/);
    assert.match(furigana.render("一人"),/<rt>ひとり<\/rt>/);
    assert.match(furigana.render("知らない人"),/人<rt>ひと<\/rt>/);
    assert.match(furigana.render("十人"),/<rt>じゅうにん<\/rt>/);
    assert.match(furigana.render("二十度"),/<rt>にじゅうど<\/rt>/);
    assert.match(furigana.render("来なければ"),/<rt>こ<\/rt>/);
});
test("Restoring an attempt preserves choices, flags, progress and option order",()=>{
    const paper=mock.createPaper("a",100);
    const state={...mock.createAttempt("a",100,1000),answers:{a1:"に",a4:"熱そうです"},flags:["a4"],index:3,elapsed:15600};
    const restored=mock.restore(JSON.stringify(state));
    assert.deepEqual(restored,state);
    assert.deepEqual(mock.createPaper(restored.paperId,restored.seed),paper);
    assert.equal(mock.restore(JSON.stringify({...state,submitted:true})).submitted,true);
});
test("Every revised item has a valid practice destination and specific feedback for each wrong choice",()=>{
    const fs=require("node:fs");
    const html=fs.readFileSync(require("node:path").join(__dirname,"main.html"),"utf8");
    const units=new Set([...html.matchAll(/data-gp-start="([^"]+)"/g)].map(m=>m[1]));
    Object.keys(require("./particle-practice.js").modules).forEach(id=>units.add(id));
    assert.equal(Object.keys(mock.review.items).length,75);
    for(const p of mock.papers)for(const q of mock.createPaper(p.id,10).questions){
        assert.ok(mock.review.domains[q.review.domain]);
        assert.ok(units.has(q.review.unit),q.id+" practice destination");
        assert.equal(mock.answerFeedback(q,q.answer),null);
        assert.equal(mock.answerFeedback(q,null),null);
        for(const wrong of q.options.filter(o=>o!==q.answer)){
            const feedback=mock.answerFeedback(q,wrong);
            assert.ok(feedback?.length>40,q.id+": "+wrong);
            assert.deepEqual(furigana.tokens(feedback).filter(t=>!t.reading&&/[一-龯々]/.test(t.text)),[],feedback);
        }
        if(q.section!=="order"){
            assert.deepEqual(Object.keys(q.review.distractors).sort(),q.options.filter(o=>o!==q.answer).sort());
            assert.ok(q.review.example && q.review.translation);
            assert.deepEqual(furigana.tokens(q.review.example).filter(t=>!t.reading&&/[一-龯々]/.test(t.text)),[],q.review.example);
        }
    }
});
test("Each paper covers all six domains with bounded concentration and explicit cognitive demands",()=>{
    for(const p of mock.papers){
        const paper=mock.createPaper(p.id,7),score=mock.score(paper);
        assert.equal(score.domains.length,6);
        assert.equal(score.domains.reduce((sum,d)=>sum+d.total,0),25);
        assert.ok(score.domains.every(d=>d.total>=2&&d.total<=6),p.id);
        const demands=paper.questions.map(q=>q.review.demand);
        assert.equal(demands.filter(d=>d==="composition").length,5);
        assert.equal(demands.filter(d=>d==="discourse").length,5);
        assert.ok(demands.filter(d=>d==="meaning").length>=9);
        assert.ok(demands.filter(d=>d==="formation").length>=1);
    }
});
test("Migration preserves both unfinished and completed original papers without regrading",()=>{
    const original=require("./n4-mock-v1.js");
    const digest=value=>require("node:crypto").createHash("sha256").update(JSON.stringify(value)).digest("hex");
    assert.equal(digest(original.papers),"032c30fef3f85d420e37d826681020e32ef749b49326016e48d7666a501fc181");
    assert.equal(digest(original.papers.map(p=>original.createPaper(p.id,92))),"db96365e82c377f6d0b90b40d00bd4e3c268d9998693650bebbaaf0595c8d90c");
    for(const p of mock.papers){
        const original=mock.createPaper(p.id,92,"n4-mock-v1");
        assert.deepEqual(original.questions.map(q=>q.answer),legacyKeys[p.id]);
        const old={version:"n4-mock-v1",paperId:p.id,seed:92,index:12,elapsed:25000,flags:[p.id+"12"],answers:Object.fromEntries(original.questions.map(q=>[q.id,q.answer]))};
        for(const submitted of [false,true]){
            const library=mock.restoreLibrary(null,JSON.stringify({...old,submitted}));
            assert.equal(library.active.version,"n4-mock-v1");
            assert.deepEqual(library.active.answers,old.answers);
            assert.equal(library.active.index,12);
            assert.equal(library.history.length,submitted?1:0);
            assert.equal(mock.score(mock.createPaper(p.id,92,library.active.version),library.active.answers).correct,25);
            assert.equal(mock.answerFeedback(original.questions[0],"invalid"),null);
        }
    }
});
test("History keeps snapshots, deduplicates, caps retention, and tolerates corrupt entries",()=>{
    let library=mock.restoreLibrary(null);
    for(let i=0;i<110;i++){
        const a={...mock.createAttempt("b",i,1000+i),submitted:true,completedAt:2000+i,answers:{b1:"で"}};
        library=mock.remember(library,a);
        a.answers.b1="に";
    }
    assert.equal(library.history.length,mock.historyLimit);
    assert.equal(library.history[0].seed,10);
    assert.equal(library.history[0].answers.b1,"で");
    library.active=library.history.at(-1);
    const restored=mock.restoreLibrary(JSON.stringify({...library,history:[null,{},...library.history,library.active]}));
    assert.deepEqual(restored,library);
    assert.equal(mock.restoreLibrary(JSON.stringify({schema:2,active:null,history:[]}),JSON.stringify(library.active)).active,null);
    assert.equal(mock.restoreLibrary("broken",JSON.stringify(library.active)).active.id,library.active.id);
    assert.equal(mock.restoreLibrary(JSON.stringify({schema:2,active:{version:"unknown"},history:[]})).active,null);
});
test("Updated options avoid the old tense giveaway and generic adverb quiz",()=>{
    const q=id=>mock.papers.flatMap(p=>p.questions).find(q=>q.id===id);
    assert.deepEqual(q("b10").options,["みます","おきます","あげます","もらいます"]);
    assert.equal(q("c13").topic,"Purpose and prevention");
    assert.ok(q("a8").options.every(o=>!o.includes("でした")));
    assert.ok(q("a12").options.every(o=>o.length>5));
    assert.ok(q("c15").options.includes("どちらの道も安全ではありません"));
    assert.match(mock.papers[2].passage.paragraphs[0],/貸して【22】ありがとう/);
    assert.match(furigana.render(mock.papers[1].passage.paragraphs[0]),/<rt>ひらき<\/rt>/);
});
test("Corrupt or older storage cannot inject answers, flags or invalid navigation",()=>{
    for(const value of [null,"bad","null","[]",'{"version":"old"}','{"version":"n4-mock-v1","paperId":"missing","seed":4}'])assert.equal(mock.restore(value),null);
    const cleaned=mock.restore(JSON.stringify({version:mock.version,paperId:"b",seed:7,answers:{b1:"forged",b2:"しか",a1:"に"},flags:["a1","b1","b1","bad"],index:1000,elapsed:-55,submitted:"true"}));
    assert.deepEqual(cleaned.answers,{b2:"しか"});
    assert.deepEqual(cleaned.flags,["b1"]);
    assert.equal(cleaned.index,24);
    assert.equal(cleaned.elapsed,0);
    assert.equal(cleaned.submitted,false);
    assert.throws(()=>mock.createPaper("missing"),/Unknown/);
});
test("Composition regressions anchor movable phrases outside the four slots",()=>{
    const find=id=>mock.papers.flatMap(p=>p.questions).find(q=>q.id===id);
    assert.equal(find("a18").before,"私には、手紙を");
    assert.equal(find("b17").before,"このパンは駅の前の");
    assert.equal(find("c17").before,"明日までに会議で");
    assert.equal(find("c20").before,"先生の話では、駅の前に");
});
