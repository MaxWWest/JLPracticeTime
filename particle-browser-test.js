const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");
const p = require("./particle-practice.js");

async function answer(page,wrong=false) {
    const q=await page.evaluate(()=>gpState.queue[gpState.index]);
    if(q.fields){
        for(const [i,f] of q.fields.entries()){
            const field=page.locator(`[data-gp-part="${i}"]`);
            assert.equal(await field.inputValue(),"");
            assert.equal(await field.getAttribute("placeholder"),null);
            await field.selectOption(wrong?f.options.find(v=>!f.accepted.includes(v)):f.answer);
        }
        await page.locator("#gp-answer-form button[type=submit]").click();
    }else await page.locator(`[data-gp-choice="${q.options.findIndex(v=>wrong?v!==q.answer:v===q.answer)}"]`).click();
    assert.equal(await page.locator("#gp-feedback").textContent(),wrong?"Not quite.":"Correct.");
    await page.locator("#gp-next").click();
}
async function main(){
    const browser=await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL||"chrome"});
    const errors=[];
    try{
        for(const width of [1440,390]){
            const page=await browser.newPage({viewport:{width,height:1000}});
            page.on("pageerror",error=>errors.push(error.message));
            await page.goto(process.env.GRAMMAR_TEST_URL||pathToFileURL(path.join(__dirname,"main.html")).href);
            await page.locator("#grammar-tab").click();
            await page.locator("#particle-practice-tab").click();
            assert.equal(await page.locator(".particle-topic").count(),8);
            assert.doesNotMatch(await page.locator("#particle-setup").textContent(),/practise/i);
            await page.screenshot({path:`/tmp/kotoba-particles-${width}-setup.png`,fullPage:true});
            for(const topic of [...p.topics,p.mixed]){
                await page.locator("#particle-count").selectOption("10");
                await page.locator(`[data-particle-start="${topic.unit}"]`).click();
                assert.equal(await page.locator("#particle-practice-tab").getAttribute("aria-selected"),"true");
                assert.equal(await page.evaluate(()=>gpState.queue.length),10);
                for(let i=0;i<10;i++)await answer(page,i<2);
                assert.equal(await page.locator("#gp-final-correct").textContent(),"8/10");
                assert.equal(await page.locator("#gp-final-accuracy").textContent(),"80%");
                assert.equal(await page.locator("#particle-practice-panel #gp-complete").isVisible(),true);
                await page.locator('[data-subtab-target="grammar-practice-panel"]').click();
                assert.equal(await page.locator("#gp-setup").isVisible(),true);
                await page.locator("#particle-practice-tab").click();
                assert.equal(await page.locator("#gp-complete").isVisible(),true);
                await page.screenshot({path:`/tmp/kotoba-${topic.unit}-${width}-stats.png`});
                await page.locator("#gp-again").click();
                assert.equal(await page.locator("#particle-setup").isVisible(),true);
                console.log(`PASS ${topic.unit} ${width}px: completion and stats.`);
            }
            // Exit and switching back to ordinary Grammar practice retain the shared renderer.
            await page.locator('[data-particle-start="particles-de-ni"]').click();
            await page.locator("#gp-home").click();
            assert.equal(await page.locator("#particle-setup").isVisible(),true);
            await page.locator('[data-subtab-target="grammar-practice-panel"]').click();
            await page.locator('[data-gp-session-card="comparison"] select').selectOption("10");
            await page.locator('[data-gp-start="comparison"]').click();
            assert.equal(await page.locator("#grammar-practice-panel #gp-session").isVisible(),true);
            for(let i=0;i<10;i++){
                const q=await page.evaluate(()=>gpState.queue[gpState.index]);
                if(q.fields){
                    for(const [i,f]of q.fields.entries()){
                        const control=page.locator(`[data-gp-part="${i}"]`);
                        if(f.options)await control.selectOption(f.answer);else await control.fill(f.answer);
                    }
                    await page.locator("#gp-answer-form button[type=submit]").click();
                }else await page.locator(`[data-gp-choice="${q.options.indexOf(q.answer)}"]`).click();
                await page.locator("#gp-next").click();
            }
            assert.equal(await page.locator("#gp-final-correct").textContent(),"10/10");
            await page.locator("#gp-again").click();
            await page.locator("#particle-practice-tab").click();
            await page.locator("#particle-count").selectOption("20");
            await page.locator('[data-particle-start="particles-mixed"]').click();
            assert.equal(await page.evaluate(()=>gpState.queue.length),20);
            assert.equal(await page.evaluate(()=>new Set(gpState.queue.map(q=>q.meta.topic)).size),8);
            // Exercise the real retry and grading UI with controlled regression frames.
            const installFrame=async(topic,id)=>page.evaluate(({topic,id})=>{
                const q=gpState.bank.find(q=>q.fields && q.meta.facts.topic===topic && q.meta.facts.recordId===id);
                gpState.queue=[q];gpState.index=0;showGrammarPracticeQuestion();
            },{topic,id});
            for(const accepted of ["に","で"]){
                await installFrame("de-ni","manifest");
                await page.locator('[data-gp-part="0"]').selectOption(accepted);
                await page.locator("#gp-answer-form button[type=submit]").click();
                assert.equal(await page.locator("#gp-feedback").textContent(),"Correct.");
            }
            await installFrame("dake-demo","any:何");
            assert.match(await page.locator(".gp-response-row").innerHTML(),/<rt>なん<\/rt>/);
            await page.locator('[data-gp-part="0"]').selectOption("でも");
            await page.locator("#gp-answer-form button[type=submit]").click();
            assert.match(await page.locator(".gp-coaching-answer").innerHTML(),/<rt>なん<\/rt>/);
            await installFrame("mo-shika","zero:一枚");
            await page.locator('[data-gp-part="0"]').selectOption("しか");
            await page.locator("#gp-answer-form button[type=submit]").click();
            assert.equal(await page.locator("#gp-retry-pattern").isVisible(),true);
            await page.locator("#gp-retry-pattern").click();
            const retry=await page.evaluate(()=>gpState.queue[gpState.index]);
            assert.equal(retry.meta.domain,"mo-shika:zero");
            assert.notEqual(retry.meta.facts.recordId,"zero:一枚");
            await page.evaluate(()=>{
                const q=gpState.bank.find(q=>q.fields && q.meta.facts.recordId==="zero:一枚");
                gpState.queue=[q,...gpState.bank.filter(r=>r.meta.domain===q.meta.domain && r.meta.familyKey!==q.meta.familyKey)];
                gpState.index=0;showGrammarPracticeQuestion();
            });
            await page.locator('[data-gp-part="0"]').selectOption("しか");
            await page.locator("#gp-answer-form button[type=submit]").click();
            assert.equal(await page.locator("#gp-retry-pattern").count(),0);
            console.log(`PASS ${width}px: alternative answers, exact furigana, targeted retry and exhausted retry.`);
            const bank=await page.evaluate(()=>gpState.bank);
            for(const size of [width,320]){
                await page.setViewportSize({width:size,height:1000});
                for(const q of bank){
                    await page.evaluate(q=>{gpState.queue=[q];gpState.index=0;showGrammarPracticeQuestion();},q);
                    const overflow=await page.evaluate(()=>[...document.querySelectorAll("#gp-prompt,#gp-subprompt,#gp-band,.gp-field,.gp-options button")].filter(el=>{
                        const r=el.getBoundingClientRect();return r.width&&(r.left< -1||r.right>innerWidth+1||el.scrollWidth>el.clientWidth+2);
                    }).map(el=>el.id||el.className));
                    assert.deepEqual(overflow,[],`${q.meta.id} ${size}px`);
                }
                await page.screenshot({path:`/tmp/kotoba-particles-${size}-question.png`});
            }
            await page.close();
        }
        assert.deepEqual(errors,[]);
        console.log("PASS: all particle frames render without overflow; normal Grammar routing preserved.");
    }finally{await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
