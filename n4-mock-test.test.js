const test = require("node:test");
const assert = require("node:assert/strict");
const mock = require("./n4-mock-test.js");
const furigana = require("./furigana.js").create([...require("./particle-practice.js").readings,...mock.readings]);

const keys = {
    a:["に","を","までに","熱そうです","行ったことがありません","歩こう","あります","来なくてもいいです","届くか","泳げるように","持ちましょうか","ほど","おく","くれました","聞き","これが","早く","電話する","ように","使うか","という","洗ってから","もらいました","でも","作ろう"],
    b:["で","しか","食べる","降る","もいいですか","帰ったら","なければなりません","壊されました","ことになりました","みます","はず","寝た","食べないで","ために","のに","教えて","買うことが","ないのに","のは","撮る","来たとき","なくてもいい","決めてから","おかげで","話せるように"],
    c:["に","は","まで","終わった","遊びたがって","したり","どう読むか","勉強させました","ことにしました","しまいました","のかもしれません","見ませんか","ゆっくり","と","ほど","読むことが","コピーして","日本語を","出て","できる","ので","置くなら","測ってから","置いてあります","ように"]
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
    const state={version:mock.version,paperId:"a",seed:100,answers:{a1:"に",a4:"熱そうです"},flags:["a4"],index:3,elapsed:15600,submitted:false};
    const restored=mock.restore(JSON.stringify(state));
    assert.deepEqual(restored,state);
    assert.deepEqual(mock.createPaper(restored.paperId,restored.seed),paper);
    assert.equal(mock.restore(JSON.stringify({...state,submitted:true})).submitted,true);
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
