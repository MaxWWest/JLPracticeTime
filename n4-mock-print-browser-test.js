const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const {pathToFileURL}=require("node:url");
const {chromium}=require("playwright");
const model=require("./n4-mock-generator.js");
const print=require("./n4-mock-print.js");
const storageKey="kotoba-n4-mock-v3";
const base=process.env.GRAMMAR_TEST_URL||pathToFileURL(path.join(__dirname,"main.html")).href;
const output=process.env.PDF_OUTPUT||"/tmp/n4-pdf-check";
async function openMock(page){
    await page.locator("#grammar-tab").click();await page.locator("#n4-mock-tab").click();
}
async function textWithoutRuby(locator){
    return locator.evaluateAll(elements=>elements.map(element=>{
        const copy=element.cloneNode(true);copy.querySelectorAll("rt,rp").forEach(e=>e.remove());return copy.textContent;
    }));
}
async function preview(page,kind){
    const result=page.waitForEvent("popup");
    await page.locator(`[data-mock-export="${kind}"]`).click();
    if(await page.locator("#n4-key-confirm").isVisible())await page.locator('#n4-key-confirm button[value="key"]').click();
    const popup=await result;await popup.waitForLoadState("load");
    await popup.locator("#print-save").waitFor();return popup;
}
async function verify(popup,paper,kind){
    assert.match(await popup.title(),new RegExp(print.paperId(paper)));
    if(kind==="test"){
        assert.equal(await popup.locator(".question").count(),25);
        assert.equal(await popup.locator(".gap").count(),5);
        assert.equal(await popup.locator(".bubble").count(),100);
        assert.equal(await popup.locator("[data-key],.filled-gap,.star-answer,.key-item").count(),0);
        for(const q of paper.questions){
            const options=await textWithoutRuby(popup.locator(`[data-question="${q.number}"] .options li > span:last-child`));
            assert.deepEqual(options,q.options.map(o=>o.replace(/\{([^|{}]+)\|[^{}]+\}/g,"$1")));
        }
    }else{
        assert.equal(await popup.locator(".key-item").count(),25);
        assert.equal(await popup.locator(".filled-gap").count(),5);
        assert.deepEqual(await popup.locator("[data-key] td").allTextContents(),paper.questions.map(q=>String(q.options.indexOf(q.answer)+1)));
    }
}
async function main(){
    fs.mkdirSync(output,{recursive:true});
    const browser=await chromium.launch({headless:true,channel:"chrome"});
    const errors=[];
    try{
        let page=await browser.newPage({viewport:{width:1440,height:1000}});
        page.on("pageerror",e=>errors.push(e.message));
        await page.goto(base);await openMock(page);
        await page.locator('[data-mock="start"]').click();
        await page.locator('input[name="n4-answer"]').nth(2).check();
        await page.locator("#n4-flag").check();
        const saved=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),storageKey);
        const before=await saved(),paper=before.active.paper;
        // Cancelling an answer-key warning opens no window and does not submit.
        await page.locator('[data-mock-export="key"]').click();
        await page.locator('#n4-key-confirm button[value="cancel"]').click();
        assert.equal(page.context().pages().length,1);
        const testPage=await preview(page,"test");testPage.on("pageerror",e=>errors.push(e.message));
        await verify(testPage,paper,"test");
        await testPage.evaluate(()=>{window.print=()=>{window.printCalls=(window.printCalls||0)+1;};});
        await testPage.locator("#print-save").click();
        assert.equal(await testPage.evaluate(()=>window.printCalls),1);
        await testPage.emulateMedia({media:"print"});
        assert.equal(await testPage.locator(".print-controls").isVisible(),false);
        for(const format of ["A4","Letter"])await testPage.pdf({path:path.join(output,`test-${format}.pdf`),format,printBackground:false,displayHeaderFooter:false});
        const keyPage=await preview(page,"key");keyPage.on("pageerror",e=>errors.push(e.message));
        await verify(keyPage,paper,"key");
        for(const format of ["A4","Letter"])await keyPage.pdf({path:path.join(output,`key-${format}.pdf`),format,printBackground:false,displayHeaderFooter:false});
        const after=await saved();
        for(const field of ["id","paper","answers","flags","index","submitted","completedAt"])assert.deepEqual(after.active[field],before.active[field]);
        assert.deepEqual(after.history,before.history);
        await keyPage.locator("#print-furigana").uncheck();
        assert.equal(await keyPage.locator("rt").first().evaluate(e=>getComputedStyle(e).display),"none");
        await keyPage.locator("#print-explanations").uncheck();
        assert.equal(await keyPage.locator(".explanations").isVisible(),false);
        assert.equal(await keyPage.locator(".key-summary").isVisible(),true);
        const compact=await keyPage.pdf({format:"A4",displayHeaderFooter:false});
        assert.equal((compact.toString("latin1").match(/\/Type \/Page\b/g)||[]).length,1);
        await keyPage.close();await testPage.close();
        // Reload/resume yields the same printable paper, and global furigana is respected.
        await page.reload();await openMock(page);
        await page.locator("#furigana-toggle").click();
        const reprint=await preview(page,"test");await verify(reprint,paper,"test");
        assert.equal(await reprint.locator("#print-furigana").isChecked(),false);await reprint.close();
        // Blocked popups have actionable feedback and leave the attempt intact.
        await page.evaluate(()=>{window.savedOpen=window.open;window.open=()=>null;});
        await page.locator('[data-mock-export="test"]').click();
        assert.match(await page.locator("#n4-export-status").textContent(),/Allow pop-ups/);
        await page.evaluate(()=>{window.open=window.savedOpen;});
        // History exports must not export/overwrite the different current test.
        const first=model.createAttempt(model.restoreLibrary(null),99,1000);first.submitted=true;first.completedAt=2000;
        const lib=model.remember({schema:3,active:first,history:[]},first);
        const second=model.createAttempt(lib,123,3000);lib.active=second;
        await page.close();page=await browser.newPage({viewport:{width:1440,height:1000}});
        await page.addInitScript(({storageKey,lib})=>localStorage.setItem(storageKey,JSON.stringify(lib)),{storageKey,lib});
        await page.goto(base);await openMock(page);await page.locator(`[data-history="${first.id}"]`).click();
        const historyKey=await preview(page,"key");await verify(historyKey,first.paper,"key");await historyKey.close();
        assert.equal((await saved()).active.id,second.id);
        // Both historical editions remain exportable with original option order.
        for(const version of ["n4-mock-v1","n4-mock-v2"]){
            const legacy={id:`${version}-export`,version,paperId:"b",seed:92,answers:{},flags:[],index:0,elapsed:0,submitted:true,startedAt:1000,completedAt:2000};
            await page.close();page=await browser.newPage({viewport:{width:1440,height:1000}});
            await page.addInitScript(({storageKey,legacy})=>localStorage.setItem(storageKey,JSON.stringify({schema:3,active:legacy,history:[legacy]})),{storageKey,legacy});
            await page.goto(base);await openMock(page);
            const legacyKey=await preview(page,"key");await verify(legacyKey,model.paperForAttempt(legacy),"key");await legacyKey.close();
        }
        // Screen preview and all export controls fit on a narrow phone.
        await page.setViewportSize({width:320,height:900});
        await page.locator('[data-mock="start"]').click();
        const mobile=await preview(page,"test");await mobile.setViewportSize({width:320,height:900});
        assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
        await mobile.screenshot({path:path.join(output,"mobile-preview.png")});
        await mobile.close();await page.locator("#n4-mock-panel").screenshot({path:path.join(output,"mobile-controls.png")});
        assert.deepEqual(errors,[]);
        console.log(`PDF exports verified: snapshots, all choices, both keys, no disclosure, cancel, blocked popup, reload, history, legacy editions, mobile; A4/Letter PDFs in ${output}`);
    }finally{await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
