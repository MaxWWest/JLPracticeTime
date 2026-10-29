const test=require("node:test");
const assert=require("node:assert/strict");
const model=require("./n4-mock-generator.js");
const print=require("./n4-mock-print.js");
const Furigana=require("./furigana.js");
const ruby=Furigana.create(model.readings);
const jp=value=>ruby.render(value);

test("exports preserve every shuffled option and derive key numbers from that same snapshot",()=>{
    for(let seed=0;seed<100;seed++){
        const paper=model.generate(seed),before=JSON.stringify(paper);
        const html=print.document(paper,{jp}),key=print.document(paper,{kind:"key",jp});
        assert.equal((html.match(/data-question=/g)||[]).length,25);
        assert.equal((html.match(/class="bubble"/g)||[]).length,100);
        assert.equal((html.match(/class="gap"/g)||[]).length,5);
        assert.equal((html.match(/class="order-slots"/g)||[]).length,5);
        assert.ok(html.includes(print.paperId(paper))&&key.includes(print.paperId(paper)));
        for(const q of paper.questions){
            const block=html.split(`data-question="${q.number}"`)[1].split("</article>")[0];
            let last=0;
            for(const option of q.options){
                const at=block.indexOf(`<span lang="ja">${jp(option)}</span>`,last);
                assert.ok(at>=last,`Option order changed: ${q.number}`);last=at+1;
            }
            assert.ok(key.includes(`<tr data-key="${q.number}"><th scope="row">${q.number}</th><td>${q.options.indexOf(q.answer)+1}</td>`));
            assert.ok(!html.includes(jp(q.explanation)));
            assert.ok(key.includes(jp(q.explanation)));
        }
        assert.equal(JSON.stringify(paper),before);
        assert.ok(!/data-key=|class="key-item"|class="filled-gap"|class="star-answer"/.test(html));
    }
});
test("fingerprints stay stable after reload and change when answer order changes",()=>{
    const a=model.createAttempt(model.restoreLibrary(null),42,1234567890);
    const restored=model.restore(JSON.stringify(a));
    assert.equal(print.paperId(model.paperForAttempt(a)),print.paperId(model.paperForAttempt(restored)));
    const changed=model.paperForAttempt(a);changed.questions[0].options.reverse();
    assert.notEqual(print.paperId(changed),print.paperId(a.paper));
});
test("original and revised fixed attempts export their own original numbering",()=>{
    for(const version of ["n4-mock-v1","n4-mock-v2"]){
        for(const id of ["a","b","c"]){
            const paper=model.paperForAttempt({version,paperId:id,seed:92});
            const html=print.document(paper,{kind:"key",jp});
            for(const q of paper.questions)assert.ok(html.includes(`<tr data-key="${q.number}"><th scope="row">${q.number}</th><td>${q.options.indexOf(q.answer)+1}</td>`));
        }
    }
});
test("documents escape authored content and asset URLs, with an independent furigana setting",()=>{
    const paper=model.generate(7);
    paper.questions[0].prompt='<script>alert("test")</script>（　）';
    paper.questions[0].explanation='<img src=x onerror="bad">';
    const html=print.document(paper,{jp,furigana:false,cssHref:'a" onload="bad',scriptHref:'b" onload="bad'});
    assert.ok(html.includes('class="no-furigana"'));
    assert.ok(html.includes('&lt;script&gt;'));
    assert.ok(!html.includes('<script>alert'));
    assert.ok(!html.includes(' onload="bad'));
    assert.throws(()=>print.document(paper,{kind:"both"}),/Unknown/);
});
