const assert=require("node:assert/strict");
const path=require("node:path");
const {pathToFileURL}=require("node:url");
const {chromium}=require("playwright");
const model=require("./n4-mock-test.js");
const base=process.env.GRAMMAR_TEST_URL||pathToFileURL(path.join(__dirname,"main.html")).href;
const storageKey="kotoba-n4-mock-v1";
async function openTab(page){
    await page.locator("#grammar-tab").click();
    await page.locator("#n4-mock-tab").click();
    assert.equal(await page.locator("#n4-mock-panel").isVisible(),true);
}
async function overflow(page){
    const issues=await page.locator("#n4-mock-panel").evaluate(panel=>{
        const width=document.documentElement.clientWidth;
        return [...panel.querySelectorAll("h2,p,.n4-option,.n4-number-grid,.n4-order-blanks,table,select,button")].filter(e=>e.getClientRects().length&&e.getBoundingClientRect().width>0).filter(e=>{
            const r=e.getBoundingClientRect();
            return r.left < -1 || r.right > width+1 || e.scrollWidth>e.clientWidth+3;
        }).map(e=>({tag:e.tagName,cls:e.className,text:e.textContent.slice(0,80)}));
    });
    assert.deepEqual(issues,[]);
}
async function main(){
    const browser=await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL||"chrome"});
    const errors=[];
    try{
        for(const width of [1440,390,320]){
            const page=await browser.newPage({viewport:{width,height:1000}});
            page.on("pageerror",e=>errors.push(e.message));
            await page.goto(base);
            await openTab(page);
            assert.equal(await page.locator("#n4-paper option").count(),3);
            await overflow(page);
            await page.locator("#n4-mock-panel").screenshot({path:`/tmp/n4-${width}-setup.png`});
            for(const source of model.papers){
                await page.locator("#n4-paper").selectOption(source.id);
                await page.locator('[data-mock="start"]').click();
                assert.equal(await page.locator('input[name="n4-answer"]:checked').count(),0);
                assert.equal(await page.locator("#n4-score,.n4-explanation,[data-correct]").count(),0);
                let saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),storageKey);
                const paper=model.createPaper(source.id,saved.seed);
                // A deliberate wrong answer can be changed, cleared, flagged, and resumed.
                await page.locator('input[name="n4-answer"]').nth(0).check();
                await page.locator('input[name="n4-answer"]').nth(1).check();
                await page.locator("#n4-flag").check();
                await page.locator('[data-mock="clear"]').click();
                assert.equal(await page.locator('input[name="n4-answer"]:checked').count(),0);
                await page.locator('input[name="n4-answer"]').nth(2).check();
                await page.locator('[data-mock="exit"]').click();
                assert.equal(await page.locator('[data-mock="start"]').count(),0);
                await page.reload();
                await openTab(page);
                await page.locator('[data-mock="resume"]').click();
                assert.equal(await page.locator("#n4-flag").isChecked(),true);
                assert.equal(await page.locator('input[name="n4-answer"]:checked').getAttribute("value"),"2");
                await page.locator("#n4-flag").uncheck();
                for(const [i,q] of paper.questions.entries()){
                    await page.locator(`.n4-nav [data-jump="${i}"]`).click();
                    assert.equal(await page.locator(".n4-option").count(),4);
                    if(i<23){
                        const option=i<2?q.options.findIndex(o=>o!==q.answer):q.options.indexOf(q.answer);
                        await page.locator('input[name="n4-answer"]').nth(option).check();
                    }
                    assert.equal(await page.locator("#n4-score,.n4-explanation,[data-correct],.n4-model-gap").count(),0);
                    await overflow(page);
                    if(source.id==="a" && [0,15,20].includes(i)){
                        await page.locator("#n4-mock-panel").screenshot({path:`/tmp/n4-${width}-q${i+1}.png`});
                    }
                    if(i===20){
                        assert.equal(await page.locator(".n4-gap").count(),5);
                        await page.locator('.n4-passage [data-jump="24"]').click();
                        assert.match(await page.locator("#n4-question-title").textContent(),/Question 25/);
                        await page.locator('.n4-passage [data-jump="20"]').click();
                    }
                }
                await page.locator('[data-mock="submit"]').click();
                assert.match(await page.locator("#n4-confirm-summary").textContent(),/2 unanswered/);
                // Escape must not inherit "submit" from the preceding paper's dialog.
                await page.keyboard.press("Escape");
                assert.equal(await page.locator("#n4-score").count(),0);
                await page.locator('[data-mock="submit"]').click();
                await page.locator('#n4-mock-confirm button[value="cancel"]').click();
                assert.equal(await page.locator("#n4-score").count(),0);
                await page.locator('[data-mock="submit"]').click();
                await page.locator('#n4-mock-confirm button[value="submit"]').click();
                await page.locator("#n4-score").waitFor();
                assert.equal(await page.locator("#n4-score").textContent(),"21 / 25");
                assert.deepEqual(await page.locator(".n4-outline td").allTextContents(),["13 / 15","5 / 5","3 / 5"]);
                assert.equal(await page.locator(".n4-review-item").count(),25);
                assert.equal(await page.locator('input[name="n4-answer"]').count(),0);
                await page.locator("#n4-review-filter").selectOption("missed");
                assert.equal(await page.locator(".n4-review-item:visible").count(),4);
                await page.locator("#n4-review-filter").selectOption("all");
                await page.locator(".n4-review-item summary").nth(15).click();
                await page.locator(".n4-completed-passage summary").click();
                assert.equal(await page.locator(".n4-model-gap").count(),5);
                assert.equal(await page.locator(".n4-gap").count(),0);
                await overflow(page);
                await page.locator("#n4-mock-panel").screenshot({path:`/tmp/n4-${width}-${source.id}-results.png`});
                await page.reload();
                await openTab(page);
                await page.locator('[data-mock="resume"]').click();
                assert.equal(await page.locator("#n4-score").textContent(),"21 / 25");
                await page.locator('[data-mock="exit"]').click();
                console.log(`PASS ${source.title} ${width}px: 25 questions, no feedback leak, resume, flags, dialog, results.`);
            }
            // The shared furigana toggle applies to this independent test renderer.
            await page.locator('[data-mock="start"]').click();
            assert.ok(await page.locator(".n4-stem ruby").count()>0);
            await page.locator("#furigana-toggle").click();
            assert.equal(await page.locator(".n4-stem rt").first().evaluate(e=>getComputedStyle(e).display),"none");
            await page.locator("#furigana-toggle").click();
            await page.waitForTimeout(1100);
            await page.locator('[data-mock="exit"]').click();
            const elapsed=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).elapsed,storageKey);
            assert.ok(elapsed>=1000);
            await page.waitForTimeout(1100);
            await page.locator('[data-mock="resume"]').click();
            await page.locator('[data-subtab-target="grammar-panel"]').click();
            const paused=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).elapsed,storageKey);
            assert.ok(paused-elapsed<700,"setup time should not count");
            await page.waitForTimeout(1100);
            await openTab(page);
            await page.locator('[data-mock="exit"]').click();
            const resumed=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).elapsed,storageKey);
            assert.ok(resumed-paused<700,"time in another panel should not count");
            await page.close();
        }
        const page=await browser.newPage({viewport:{width:1280,height:900}});
        page.on("pageerror",e=>errors.push(e.message));
        await page.addInitScript(()=>{Storage.prototype.setItem=function(){throw new Error("Storage unavailable");};});
        const deep=new URL(base);deep.searchParams.set("mock","n4");
        await page.goto(deep.href);
        assert.equal(await page.locator("#n4-mock-tab").getAttribute("aria-selected"),"true");
        await page.locator('[data-mock="start"]').click();
        assert.equal(await page.locator("#n4-storage-status").isVisible(),true);
        await page.locator('[data-mock="submit"]').click();
        await page.locator('#n4-mock-confirm button[value="submit"]').click();
        await page.locator("#n4-score").waitFor();
        assert.equal(await page.locator("#n4-score").textContent(),"0 / 25");
        console.log("PASS unavailable storage, deep link and entirely unanswered submission.");
        await page.close();
        assert.deepEqual(errors,[]);
    }finally{await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
