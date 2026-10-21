const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
const units=['permission','desire','appearance','reason','purpose','boss-06-10'];
async function main(){
 const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHANNEL?{channel:process.env.PLAYWRIGHT_CHANNEL}:{})});
 const errors=[];
 try{
  for(const width of [1440,390]){
   const page=await browser.newPage({viewport:{width,height:1000}});
   page.on('pageerror',error=>errors.push(error.message));
   await page.goto(process.env.GRAMMAR_TEST_URL||pathToFileURL(path.join(__dirname,'main.html')).href);
   await page.locator('#grammar-tab').click();
   await page.locator('[data-subtab-target="grammar-practice-panel"]').click();
   for(const unit of units){
    await page.locator(`[data-gp-filter="${unit.startsWith('boss')?'boss':'review'}"]`).click();
    await page.locator(`[data-gp-session-card="${unit}"] select`).selectOption('10');
    await page.locator(`[data-gp-start="${unit}"]`).click();
    assert.equal(await page.evaluate(()=>gpState.queue.length),10);
    for(let i=0;i<10;i++){
     const q=await page.evaluate(()=>gpState.queue[gpState.index]),wrong=i<2;
     assert.equal(q.meta.engine,unit.startsWith('boss')?'boss-06-10-v1':`${unit}-meaning-v1`);
     if(unit.startsWith('boss'))assert.equal(Boolean(q.fields),i>=8);
     if(q.fields){
      for(const [part,f] of q.fields.entries()){
       const control=page.locator(`[data-gp-part="${part}"]`);
       assert.equal(await control.inputValue(),'');
       const value=wrong&&part===0?(f.options?.find(o=>!f.accepted.includes(o))||'wrong'):f.answer;
       if(f.options)await control.selectOption(value);else await control.fill(value);
      }
      await page.locator('#gp-answer-form button[type="submit"]').click();
     }else await page.locator(`[data-gp-choice="${q.options.findIndex(o=>wrong?o!==q.answer:o===q.answer)}"]`).click();
     assert.equal(await page.locator('#gp-feedback').textContent(),wrong?'Not quite.':'Correct.',`${unit} ${i}`);
     await page.locator('#gp-next').click();
    }
    assert.equal(await page.locator('#gp-final-correct').textContent(),'8/10');
    assert.equal(await page.locator('#gp-final-accuracy').textContent(),'80%');
    assert.equal(await page.locator('#gp-session').isVisible(),false);
    const rect=await page.locator('#gp-final-correct').boundingBox();
    assert.ok(rect.y>=0&&rect.y+rect.height<=1000);
    await page.screenshot({path:`/tmp/kotoba-six-ten-${unit}-${width}-stats.png`});
    await page.locator('#gp-again').click();
    console.log(`PASS: ${unit} at ${width}px, completed round and 8/10 stats.`);
   }
   await page.close();
  }
  const page=await browser.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(process.env.GRAMMAR_TEST_URL||pathToFileURL(path.join(__dirname,'main.html')).href);
  await page.locator('#grammar-tab').click();
  await page.locator('[data-subtab-target="grammar-practice-panel"]').click();
  for(const unit of units){
   await page.evaluate(unit=>startGrammarPractice(unit,10,{focus:unit.startsWith('boss')?'boss':'review'}),unit);
   const ids=await page.evaluate(()=>{
    const byTask=new Map();
    for(const q of gpState.bank){
     const length=JSON.stringify(q).length;
     if(!byTask.has(q.meta.task)||length>byTask.get(q.meta.task).length)byTask.set(q.meta.task,{id:q.meta.id,length});
    }
    return [...byTask.values()].map(x=>x.id);
   });
   for(const width of [1440,390,320]){
    await page.setViewportSize({width,height:1000});
    for(const id of ids){
     await page.evaluate(id=>{
      let q=gpState.bank.find(q=>q.meta.id===id);
      if(q.writing)q={...q,...q.writing,meta:{...q.meta,answerMode:'full'}};
      gpState.queue=[q];gpState.index=0;showGrammarPracticeQuestion();
     },id);
     const overflow=await page.evaluate(()=>[...document.querySelectorAll('#gp-prompt,#gp-subprompt,#gp-band,.gp-field,.gp-cloze-row,.gp-options button')].filter(el=>{
      const r=el.getBoundingClientRect();return r.width&&(r.left< -1||r.right>innerWidth+1||el.scrollWidth>el.clientWidth+2);
     }).map(el=>el.id||el.className));
     assert.deepEqual(overflow,[],`${unit} ${id} ${width}px`);
    }
    await page.screenshot({path:`/tmp/kotoba-six-ten-${unit}-${width}-question.png`});
   }
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: every new task type rendered at desktop, 390px and 320px without overflow or page errors.');
 }finally{await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
