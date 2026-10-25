const test = require("node:test");
const assert = require("node:assert/strict");
const p = require("./particle-practice.js");
const k = require("./drill-kit.js");
const { loadGrammarRuntime } = require("./grammar-audit.js");
const runtime = loadGrammarRuntime();
const byId = (topic,id) => p.buildBank(topic).find(q=>q.fields && q.meta.facts.recordId===id);

for (const topic of [...p.topics,p.mixed]) {
    test(`${topic.unit}: checked answers, no vocabulary transcription, useful wrong-answer feedback`,()=>{
        const mod=p.modules[topic.unit], engine=mod.create(), bank=engine.buildBank();
        assert.ok(bank.length>=40);
        assert.equal(new Set(bank.map(q=>q.meta.id)).size,bank.length);
        for(const q of bank){
            assert.equal(q.meta.engine,mod.version);
            assert.ok(q.explanation.length>20);
            if(q.fields){
                assert.equal(q.fields.length,1);
                assert.equal(q.fields[0].multiline,false);
                assert.ok(q.fields[0].options.length>=2);
                assert.ok(q.fields[0].options.every(o=>o.length<=4));
                assert.equal(engine.grade(q,[q.fields[0].answer]).correct,true);
                for(const accepted of q.fields[0].accepted)assert.equal(engine.grade(q,[accepted]).correct,true);
                for(const wrong of q.fields[0].options.filter(o=>!q.fields[0].accepted.includes(o))){
                    const grade=engine.grade(q,[wrong]);
                    assert.equal(grade.correct,false);
                    assert.ok(grade.feedback.length);
                    assert.doesNotMatch(grade.feedback.join(" "),/not among the checked/);
                }
            }else{
                assert.equal(new Set(q.options).size,q.options.length);
                assert.equal(engine.grade(q,q.answer).correct,true);
                assert.ok(q.options.every(o=>o===q.answer||!engine.grade(q,o).correct));
            }
        }
    });
    test(`${topic.unit}: real routing, bounded rounds and family freshness`,()=>{
        const bank=runtime.buildGrammarPracticeBank(topic.unit),mod=p.modules[topic.unit];
        assert.equal(bank.length,mod.create().buildBank().length);
        assert.ok(bank.every(q=>q.meta.engine===mod.version));
        for(const count of [10,20])for(const seed of [1,12,87]){
            const queue=mod.selectQueue(bank,count,{seed});
            assert.equal(queue.length,count);
            assert.equal(new Set(queue.map(q=>q.meta.familyKey)).size,count);
            assert.ok(queue.filter(q=>q.fields).length>=Math.ceil(count*2/3));
            assert.ok(new Set(queue.filter(q=>q.fields).map(q=>q.answer)).size>=2,topic.id);
            assert.equal(runtime.buildFocusedGrammarQueue(topic.unit,bank,"review",count).length,count);
            if(topic.id==="mixed")assert.equal(new Set(queue.map(q=>q.meta.topic)).size,8);
        }
        const first=mod.selectQueue(bank,10,{seed:3});
        const second=mod.selectQueue(bank,10,{seed:3,recent:first.map(q=>q.meta.familyKey)});
        assert.equal(second.filter(q=>first.some(old=>old.meta.familyKey===q.meta.familyKey)).length,0);
    });
}

test("place versus existence includes the event-aru exception and writing target",()=>{
    assert.equal(k.completeResponse(byId("de-ni","action:図書館")),"図書館で本を読みます。");
    assert.equal(k.completeResponse(byId("de-ni","exist:図書館")),"図書館に友達がいます。");
    assert.equal(k.completeResponse(byId("de-ni","event")),"公園でお祭りがあります。");
    assert.equal(k.completeResponse(byId("de-ni","surface:黒板")),"黒板に名前を書きました。");
});
test("zero versus one and inclusive versus exclusive readings remain distinct",()=>{
    assert.equal(k.completeResponse(byId("mo-shika","zero:一冊")),"一冊もありません。");
    assert.equal(k.completeResponse(byId("mo-shika","only:read:本")),"本しか読みませんでした。");
    assert.equal(k.completeResponse(byId("dake-demo","only:read:本")),"本だけ読みました。");
    assert.equal(k.completeResponse(byId("dake-demo","suggest:お茶")),"お茶でも飲みませんか。");
    assert.equal(k.completeResponse(byId("mo-shika","large:百人")),"百人も来ました。");
});
test("nominalizers accept overlap while sensory and predicate constructions stay distinct",()=>{
    const q=byId("no-koto","activity:read:本");
    assert.deepEqual(q.fields[0].accepted,["の","こと"]);
    assert.equal(k.completeResponse(byId("no-koto","see:父")),"父が本を読んでいるのを見ました。");
    assert.equal(k.completeResponse(byId("no-koto","hobby:本を読む")),"趣味は本を読むことです。");
    assert.ok(p.buildBank("no-koto").filter(q=>q.mode==="choice").every(q=>q.meta.facts.recordId!=="activity:read:本"));
});
test("te links use authored conjugation and distinguish without from negative cause",()=>{
    assert.equal(k.completeResponse(byId("te-links","method:歩い")),"歩いて学校に行きます。");
    assert.equal(k.completeResponse(byId("te-links","method:大きな声で読ん")),"大きな声で読んで覚えます。");
    assert.equal(k.completeResponse(byId("te-links","without:辞書を使わ")),"辞書を使わないで、本を読みます。");
    assert.equal(k.completeResponse(byId("te-links","cause:友達に会え")),"友達に会えなくて、残念です。");
});
test("no contradictory self-contrast and no categorical wa-ga prohibition",()=>{
    const bank=p.buildBank("wa-ga");
    assert.ok(bank.every(q=>!q.prompt.includes("私は来ますが、私は来ません")));
    const q=byId("wa-ga","contrast:田中さん");
    assert.match(q.explanation,/not universally ungrammatical/);
    assert.equal(k.completeResponse(byId("wa-ga","focus:田中さん")),"A：誰が本を読みましたか。\nB：田中さんが読みました。");
});
test("until, by and from have independent gold frames",()=>{
    assert.equal(k.completeResponse(byId("boundaries","until:五時")),"五時まで待ちます。");
    assert.equal(k.completeResponse(byId("boundaries","by:五時")),"五時までに本を返してください。");
    assert.equal(k.completeResponse(byId("boundaries","origin:家")),"家から駅まで行きます。");
});
test("every authored particle sentence has readings for all kanji",()=>{
    for(const record of p.records){
        const sentence=record.before+record.answer+record.after;
        const unannotated=runtime.renderJapaneseTextWithFurigana(sentence).replace(/<ruby>.*?<\/ruby>/g,"");
        assert.doesNotMatch(unannotated,/[一-龯々]/,sentence);
    }
});
