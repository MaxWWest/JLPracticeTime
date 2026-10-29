const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const model=require("./n4-mock-generator.js"),fixed=require("./n4-mock-test.js");
const ruby=require("./furigana.js").create([...require("./particle-practice.js").readings,...model.readings]);
const all=[...model.bank.forms,...model.bank.orders,...model.bank.passages.flatMap(p=>p.questions)];
test("Expanded bank contains 150 forms, 42 compositions, 12 intact passages with feedback",()=>{
    assert.deepEqual([model.bank.forms.length,model.bank.orders.length,model.bank.passages.length],[150,42,12]);
    assert.equal(new Set(all.map(q=>q.id)).size,252);
    const html=fs.readFileSync(path.join(__dirname,"main.html"),"utf8");
    const units=new Set([...html.matchAll(/data-gp-start="([^"]+)"/g)].map(m=>m[1]));
    Object.keys(require("./particle-practice.js").modules).forEach(id=>units.add(id));
    for(const q of all){
        assert.ok(units.has(q.review.unit),q.id+" destination "+q.review.unit);
        assert.equal(new Set(q.options).size,4,q.id);
        assert.ok(q.options.includes(q.answer));
        assert.ok(q.explanation.length>35);
        if(q.section==="form")assert.equal(q.prompt.match(/（　）/g)?.length,1,q.id);
        if(q.section==="order")assert.equal(q.answer,q.chunks[2]);
        else assert.deepEqual(Object.keys(q.review.distractors).sort(),q.options.filter(o=>o!==q.answer).sort(),q.id);
        for(const option of q.options){
            assert.equal(Boolean(model.answerFeedback(q,option)),option!==q.answer,q.id);
        }
    }
    for(const p of model.bank.passages){
        assert.equal(p.questions.length,5);
        assert.deepEqual([...p.paragraphs.join("").matchAll(/【(\d+)】/g)].map(m=>+m[1]),[21,22,23,24,25]);
    }
});
test("New content and wrong-choice explanations have complete display readings",()=>{
    const strings=[...all.flatMap(q=>[q.prompt,q.before,q.after,q.explanation,...q.options,...Object.values(q.review.distractors||{})].filter(Boolean)),...model.bank.passages.flatMap(p=>[p.title,...p.paragraphs])];
    const missing=[];
    for(const s of strings)for(const t of ruby.tokens(s))if(!t.reading&&/[一-龯々]/.test(t.text))missing.push([t.text,s]);
    assert.deepEqual(missing,[]);
    assert.match(ruby.render("{十分|じゅうぶん}寝た"),/<rt>じゅうぶん<\/rt>/);
    assert.match(ruby.render("{辛い|からい}料理"),/<rt>からい<\/rt>/);
});
test("Seeded generation is stable, diverse, balanced, and does not mutate the bank",()=>{
    const before=JSON.stringify(model.bank),sets=new Set();
    for(let seed=0;seed<500;seed++){
        const paper=model.generate(seed);
        assert.ok(model.validPaper(paper),seed);
        assert.deepEqual(paper,model.generate(seed));
        assert.deepEqual(paper.questions.map(q=>q.section),[...Array(15).fill("form"),...Array(5).fill("order"),...Array(5).fill("text")]);
        assert.equal(new Set(paper.questions.slice(0,20).map(q=>q.family)).size,20);
        const score=model.score(paper,Object.fromEntries(paper.questions.map(q=>[q.id,q.answer])));
        assert.equal(score.correct,25);
        assert.equal(score.domains.length,6);
        assert.ok(score.domains.every(d=>d.total>=2&&d.total<=6));
        assert.equal(paper.questions.filter(q=>q.section==="form"&&q.review.demand==="formation").length,2);
        assert.deepEqual([0,1,2,3].map(pos=>paper.questions.filter(q=>q.options.indexOf(q.answer)===pos).length).sort(),[6,6,6,7]);
        sets.add(paper.questions.map(q=>q.id).sort().join(","));
    }
    assert.equal(sets.size,500);
    assert.equal(JSON.stringify(model.bank),before);
});
test("History favors unseen questions, cools down related variants and exhausts passages before repeating",()=>{
    for(let run=0;run<12;run++){
        let library=model.restoreLibrary(null);const passages=new Set(),sets=new Set();
        for(let i=0;i<15;i++){
            const a=model.createAttempt(library,run*1000+i,10000+i),p=a.paper;
            assert.ok(a);
            if(i<3)assert.equal(p.exposure.previouslySeen,0);
            if(i<12){assert.equal(p.exposure.passageSeen,false);assert.ok(!passages.has(p.passage.id));}
            if(i===12)assert.equal(p.exposure.passageSeen,true);
            if(i===1){
                const recent=new Set(library.history[0].paper.questions.slice(0,20).map(q=>q.family));
                // At most a small number of unavoidable coverage/formation collisions.
                assert.ok(p.questions.slice(0,20).filter(q=>recent.has(q.family)).length<=2);
            }
            assert.ok(model.score(p).domains.every(d=>d.total>=2&&d.total<=6));
            passages.add(p.passage.id);sets.add(p.questions.map(q=>q.id).sort().join(","));
            a.submitted=true;library=model.remember(library,a);
        }
        assert.equal(sets.size,15);
    }
});
test("Snapshot survives content updates and preserves exact questions, options, score and progress",()=>{
    const a=model.createAttempt(model.restoreLibrary(null),120,1000);
    a.answers[a.paper.questions[0].id]=a.paper.questions[0].answer;a.flags=[a.paper.questions[2].id];a.index=7;a.elapsed=12345;
    const saved=JSON.stringify(a),original=model.bank.forms[0].prompt;
    model.bank.forms[0].prompt="Future editorial change";
    try{assert.deepEqual(model.restore(saved),a);assert.deepEqual(model.paperForAttempt(model.restore(saved)),a.paper);}finally{model.bank.forms[0].prompt=original;}
    const restored=model.restore(saved);assert.equal(model.score(restored.paper,restored.answers).correct,1);
    const copy=model.paperForAttempt(restored);copy.questions[0].options.reverse();assert.deepEqual(model.restore(saved),a);
    assert.throws(()=>model.createAttempt({active:a,history:[]}),/Finish/);
});
test("Both fixed editions migrate unchanged alongside generated snapshots",()=>{
    for(const version of ["n4-mock-v1","n4-mock-v2"]){
        const p=fixed.createPaper("b",77,version);
        const a=fixed.restore(JSON.stringify({version,paperId:"b",seed:77,answers:Object.fromEntries(p.questions.map(q=>[q.id,q.answer])),submitted:true}));
        const l=model.restoreLibrary(null,JSON.stringify({schema:2,active:a,history:[a]}));
        assert.deepEqual(model.paperForAttempt(l.active),p);assert.equal(model.score(p,l.active.answers).correct,25);
        const fresh=model.createAttempt(l,31,1000);assert.equal(fresh.version,model.version);fresh.submitted=true;
        const mixed=model.remember({...l,active:fresh},fresh);
        assert.deepEqual(model.restoreLibrary(JSON.stringify(mixed)),mixed);
    }
    const empty={schema:3,active:null,history:[]};
    assert.deepEqual(model.restoreLibrary(JSON.stringify(empty),JSON.stringify({schema:2,active:fixed.createAttempt("a",1,1),history:[]})),empty);
});
test("Invalid snapshots fail safely and answer/navigation fields are sanitized",()=>{
    const a=model.createAttempt(model.restoreLibrary(null),12,1000);
    for(const mutate of [p=>p.questions.pop(),p=>p.questions[0].options.pop(),p=>p.questions[0].answer="invalid",p=>p.questions[15].chunks.reverse(),p=>p.passage.paragraphs=["【21】"],p=>p.questions[0].review=null,p=>p.questions[0].number=9]){
        const broken=JSON.parse(JSON.stringify(a));mutate(broken.paper);assert.equal(model.restore(JSON.stringify(broken)),null);
    }
    const cleaned=model.restore(JSON.stringify({...a,index:100,elapsed:-2,answers:{bad:"bad"},flags:["bad",a.paper.questions[0].id,a.paper.questions[0].id]}));
    assert.equal(cleaned.index,24);assert.equal(cleaned.elapsed,0);assert.deepEqual(cleaned.answers,{});assert.equal(cleaned.flags.length,1);
    assert.equal(model.restore("not json"),null);
    assert.deepEqual(model.restoreLibrary(JSON.stringify({schema:3,active:{},history:[null,{}]})),{schema:3,active:null,history:[]});
});
test("Editorial regressions: grammar comparison, valid full alternatives, anchored order and natural intention",()=>{
    const get=id=>all.find(q=>q.id===id);
    assert.equal(get("g-text-trip-21").answer,"バスは電車ほど早くありません");
    assert.ok(get("g-sequence-1").options.includes("洗う前に"));
    assert.ok(get("g-offer-1").options.includes("持ってください"));
    assert.equal(get("g-order-question-3").before,"まだ、会議に誰が");
    assert.deepEqual(get("g-order-change-3").chunks,["飲む","ことに","して","います"]);
    assert.equal(get("g-text-move-25").answer,"勉強しよう");
});
