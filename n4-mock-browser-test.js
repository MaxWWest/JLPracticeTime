const assert=require("node:assert/strict");
const path=require("node:path");
const {pathToFileURL}=require("node:url");
const {chromium}=require("playwright");
const model=require("./n4-mock-generator.js");
const base=process.env.GRAMMAR_TEST_URL||pathToFileURL(path.join(__dirname,"main.html")).href;
const storageKey="kotoba-n4-mock-v3";
async function japaneseText(locator){
    return locator.evaluate(element=>{
        const copy=element.cloneNode(true);copy.querySelectorAll("rt,rp").forEach(e=>e.remove());
        return copy.textContent;
    });
}
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
        for(const width of (process.env.MOCK_WIDTHS||"1440,390,320").split(",").map(Number)){
            const page=await browser.newPage({viewport:{width,height:1000}});
            page.on("pageerror",e=>errors.push(e.message));
            await page.goto(base);
            await openTab(page);
            assert.equal(await page.locator("#n4-paper").count(),0);
            assert.match(await page.locator('[data-mock="start"]').textContent(),/Generate a new test/);
            await overflow(page);
            await page.locator("#n4-mock-panel").screenshot({path:`/tmp/n4-${width}-setup.png`});
            for(const source of model.papers){
                await page.locator('[data-mock="start"]').click();
                assert.equal(await page.locator('input[name="n4-answer"]:checked').count(),0);
                assert.equal(await page.locator("#n4-score,.n4-explanation,[data-correct]").count(),0);
                let saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).active,storageKey);
                const paper=model.paperForAttempt(saved);
                assert.equal(saved.version,model.version);
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
                assert.equal(await page.locator(".n4-choice-feedback").count(),2);
                assert.equal(await page.locator(".n4-breakdown tbody tr").count(),6);
                await page.locator(".n4-review-item summary").first().click();
                assert.match(await page.locator(".n4-choice-feedback").first().textContent(),/Why your choice/);
                assert.equal(await page.locator(".n4-review-item").first().locator("[data-practice]").count(),1);
                await page.locator(".n4-review-item").first().locator(".n4-alternatives summary").click();
                await page.locator(".n4-review-item").first().screenshot({path:`/tmp/n4-${width}-feedback.png`});
                assert.equal(await page.locator('input[name="n4-answer"]').count(),0);
                await page.locator("#n4-review-filter").selectOption("missed");
                assert.equal(await page.locator(".n4-review-item:visible").count(),4);
                await page.locator("#n4-review-filter").selectOption("all");
                await page.locator(".n4-review-item > summary").nth(15).click();
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
                const history=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).history,storageKey);
                assert.equal(history.length,model.papers.indexOf(source)+1);
                assert.equal(await page.locator(".n4-history li").count(),history.length);
                console.log(`PASS ${source.title} ${width}px: 25 questions, no feedback leak, resume, flags, dialog, results.`);
            }
            // Historical review must not replace the latest attempt or an unfinished new test.
            const latest=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).active.id,storageKey);
            await page.locator(".n4-history [data-history]").last().click();
            assert.match(await page.locator(".n4-heading").textContent(),/Generated test/);
            assert.equal(await page.locator("#n4-score").textContent(),"21 / 25");
            await page.reload();await openTab(page);
            assert.equal(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).active.id,storageKey),latest);
            // The shared furigana toggle applies to this independent test renderer.
            await page.locator('[data-mock="start"]').click();
            assert.ok(await page.locator(".n4-stem ruby").count()>0);
            await page.locator("#furigana-toggle").click();
            assert.equal(await page.locator(".n4-stem rt").first().evaluate(e=>getComputedStyle(e).display),"none");
            await page.locator("#furigana-toggle").click();
            await page.waitForTimeout(1100);
            await page.locator('[data-mock="exit"]').click();
            const elapsed=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).active.elapsed,storageKey);
            assert.ok(elapsed>=1000);
            await page.waitForTimeout(1100);
            await page.locator('[data-mock="resume"]').click();
            await page.locator('[data-subtab-target="grammar-panel"]').click();
            const paused=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).active.elapsed,storageKey);
            assert.ok(paused-elapsed<700,"setup time should not count");
            await page.waitForTimeout(1100);
            await openTab(page);
            await page.locator('[data-mock="exit"]').click();
            const resumed=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).active.elapsed,storageKey);
            assert.ok(resumed-paused<700,"time in another panel should not count");
            const activeId=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).active.id,storageKey);
            await page.locator(".n4-history [data-history]").last().click();
            await page.locator(".n4-review-item summary").first().click();
            await page.locator(".n4-review-item").first().locator("[data-practice]").click();
            assert.equal(await page.locator("#gp-home").isVisible(),true);
            await page.locator("#gp-home").click();
            await openTab(page);
            await page.locator('[data-mock="exit"]').click();
            await page.locator('[data-mock="resume"]').click();
            assert.equal(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).active.id,storageKey),activeId);
            assert.equal(await page.locator("#n4-question-title").count(),1);
            await page.close();
        }
        for(const submitted of [false,true]){
            const page=await browser.newPage({viewport:{width:390,height:1000}});
            page.on("pageerror",e=>errors.push(e.message));
            const old=model.createPaper("c",71,"n4-mock-v1");
            const saved={version:"n4-mock-v1",paperId:"c",seed:71,answers:Object.fromEntries(old.questions.map(q=>[q.id,q.answer])),flags:["c13"],index:12,elapsed:60000,submitted};
            await page.addInitScript(saved=>localStorage.setItem("kotoba-n4-mock-v1",JSON.stringify(saved)),saved);
            await page.goto(base);await openTab(page);
            await page.locator('[data-mock="resume"]').click();
            if(!submitted){
                assert.match(await japaneseText(page.locator(".n4-stem")),/話していただけませんか/);
                assert.equal(await page.locator("#n4-flag").isChecked(),true);
                await page.locator('[data-mock="submit"]').click();
                await page.locator('#n4-mock-confirm button[value="submit"]').click();
            }
            assert.equal(await page.locator("#n4-score").textContent(),"25 / 25");
            assert.equal(await page.locator(".n4-choice-feedback,.n4-breakdown").count(),0);
            await page.locator('[data-mock="exit"]').click();
            await page.locator('[data-mock="start"]').click();
            await page.locator('.n4-nav [data-jump="12"]').click();
            const newStem=await japaneseText(page.locator(".n4-stem"));
            const generated=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).active,storageKey);
            assert.equal(generated.version,model.version);
            await page.reload();await openTab(page);
            assert.equal(await page.locator(".n4-history li").count(),1);
            await page.locator('[data-mock="resume"]').click();
            assert.equal(await japaneseText(page.locator(".n4-stem")),newStem);
            await page.close();
        }
        console.log("PASS original-edition migration, unchanged scores and generated retakes.");
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
    }catch(error){
        for(const [i,page] of browser.contexts().flatMap(context=>context.pages()).entries()){
            await page.screenshot({path:`/tmp/n4-failure-${i}.png`,timeout:5000}).catch(()=>{});
        }
        throw error;
    }finally{await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
