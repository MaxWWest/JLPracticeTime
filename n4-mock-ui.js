(function() {
    "use strict";
    const model=N4MockGenerator;
    const panel=document.querySelector("#n4-mock-panel");
    const root=document.querySelector("#n4-mock-root");
    const dialog=document.querySelector("#n4-mock-confirm");
    const storageKey="kotoba-n4-mock-v3";
    const ruby=Furigana.create([...ParticlePractice.readings,...model.readings]);
    const jp=value=>ruby.render(value);
    const esc=escapeHtml;
    let library=model.restoreLibrary(null),state=null,paper=null,view="setup",lastTick=Date.now(),saveTicks=0,timingActive=false;
    try { library=model.restoreLibrary(localStorage.getItem(storageKey),localStorage.getItem("kotoba-n4-mock-v2"),localStorage.getItem("kotoba-n4-mock-v1")); } catch { /* The test also runs without storage. */ }
    const edition=attempt=>attempt.version===model.version?"Generated edition":attempt.version==="n4-mock-v2"?"Revised fixed edition":"Original fixed edition";
    function selectAttempt(attempt) {
        state=attempt;
        paper=attempt?model.paperForAttempt(attempt):null;
    }
    selectAttempt(library.active);

    function time(ms) {
        const seconds=Math.floor(ms/1000);
        return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,"0")}`;
    }
    function tick() {
        const now=Date.now();
        if(timingActive)state.elapsed+=Math.max(0,now-lastTick);
        lastTick=now;
        timingActive=view==="test" && state && !state.submitted && !panel.hidden && !document.hidden;
        const clock=root.querySelector("#n4-clock");
        if(clock)clock.textContent=time(state.elapsed);
    }
    function save() {
        try {
            localStorage.setItem(storageKey,JSON.stringify(library));
            document.querySelector("#n4-storage-status").hidden=true;
        }catch{
            const status=document.querySelector("#n4-storage-status");
            status.hidden=false;
            status.textContent="Browser storage is unavailable. Keep this page open to retain this attempt.";
        }
    }
    function start() {
        if(library.active&&!library.active.submitted)return;
        selectAttempt(model.createAttempt(library));
        library.active=state;
        view="test";lastTick=Date.now();save();render();focusQuestion();
    }
    function focusQuestion() {
        root.querySelector("#n4-question-title, #n4-result-title")?.focus({preventScroll:true});
        root.scrollIntoView({block:"start"});
    }
    function renderSetup() {
        selectAttempt(library.active);
        root.innerHTML=`<header class="n4-heading"><div><p class="eyebrow section-eyebrow">GRAMMAR</p><h2>N4 Mock Test</h2>
            <p>25 questions · 3 parts</p></div><span class="n4-unofficial">Unofficial practice · Grammar only</span></header>
            ${state ? `<div class="n4-resume"><div><strong>${esc(paper.title)} · ${edition(state)}</strong><p>${state.submitted ? `${model.score(paper,state.answers).correct}/25 · Completed` : `${Object.keys(state.answers).length}/25 answered · ${time(state.elapsed)} elapsed`}</p></div>
                <button data-mock="resume" class="n4-primary">${state.submitted ? "View results" : "Resume test"}</button></div>` : ""}
            <table class="n4-outline"><caption>Test sections</caption><tbody>${model.sections.map((s,i)=>`<tr><th scope="row"><span>0${i+1}</span> ${esc(s.title)}</th><td>${s.count} questions</td></tr>`).join("")}</tbody></table>
            <div class="n4-start">${state&&!state.submitted ? `<span>Finish your current attempt before starting another test.</span>` : `<button data-mock="start" class="n4-primary">Generate a new test <span aria-hidden="true">→</span></button>`}</div>
            <p class="n4-disclaimer">${model.bank.forms.length} grammar questions · ${model.bank.orders.length} sentence-order questions · ${model.bank.passages.length} passages. Finite question bank; repeats are possible.</p>
            ${library.history.length?`<section class="n4-history"><h3>Attempt history</h3><p class="n4-disclaimer">Saved on this browser · Latest ${model.historyLimit} completed attempts</p>
                <ol>${[...library.history].reverse().map(a=>{
                    const p=model.paperForAttempt(a),result=model.score(p,a.answers);
                    return `<li><div><strong>${esc(p.title)} · ${result.correct}/25</strong><span>${edition(a)} · ${a.completedAt?esc(new Date(a.completedAt).toLocaleString()):"Completion date unavailable"} · ${time(a.elapsed)}</span></div><button data-history="${esc(a.id)}">Review results</button></li>`;
                }).join("")}</ol></section>`:""}`;
    }
    function renderPassage(current,completed=false) {
        return `<div class="n4-passage"><h3 lang="ja">${jp(paper.passage.title)}</h3>${paper.passage.paragraphs.map(p=>{
            const fragments=p.split(/(【\d+】)/g).map(part=>{
                const match=part.match(/^【(\d+)】$/);
                if(!match)return jp(part);
                const number=Number(match[1]);
                const q=paper.questions[number-1];
                return completed ? `<strong class="n4-model-gap">${jp(q.answer)}</strong>` : `<button type="button" class="n4-gap ${number===current?"is-current":""}" data-jump="${number-1}" aria-label="Question ${number}" ${number===current?'aria-current="true"':""}>${number}</button>`;
            }).join("");
            return `<p lang="ja">${fragments}</p>`;
        }).join("")}</div>`;
    }
    function sentence(q) {
        if(q.section==="form")return `<p class="n4-stem" lang="ja">${jp(q.prompt)}</p>`;
        if(q.section==="order")return `<p class="n4-stem" lang="ja">${jp(q.before)}<span class="n4-order-blanks" aria-label="Four positions; star in position 3">${[0,1,2,3].map(i=>`<span>${i===q.star?"★":"&nbsp;"}</span>`).join("")}</span>${jp(q.after)}</p>`;
        return renderPassage(q.number);
    }
    function nav() {
        return model.sections.map(s=>`<div class="n4-nav-group"><h3>${esc(s.title)}</h3><div class="n4-number-grid">${paper.questions.filter(q=>q.section===s.id).map(q=>{
            const answered=Boolean(state.answers[q.id]),flagged=state.flags.includes(q.id),current=state.index===q.number-1;
            return `<button type="button" data-jump="${q.number-1}" class="${answered?"is-answered":""} ${flagged?"is-flagged":""}" ${current?'aria-current="step"':""} aria-label="Question ${q.number}, ${answered?"answered":"unanswered"}${flagged?", marked for review":""}">${q.number}${flagged?'<span aria-hidden="true">*</span>':""}</button>`;
        }).join("")}</div></div>`).join("");
    }
    function renderTest() {
        const q=paper.questions[state.index],section=model.sections.find(s=>s.id===q.section);
        root.innerHTML=`<header class="n4-toolbar"><div><strong>N4 Mock Test · ${edition(state)}</strong>
            <span id="n4-answer-count" role="status">${Object.keys(state.answers).length}/25 answered</span></div>
            <div class="n4-toolbar-actions"><span>Elapsed <time id="n4-clock">${time(state.elapsed)}</time></span><button data-mock="exit">Save & exit</button></div></header>
            <div class="n4-workspace"><div class="n4-main"><div class="n4-question-heading"><h2 id="n4-question-title" tabindex="-1">Question ${q.number} <small>/ 25</small></h2>
                <label class="n4-flag"><input id="n4-flag" type="checkbox" ${state.flags.includes(q.id)?"checked":""}> Review later</label></div>
                <p class="n4-instruction"><strong>${esc(section.instruction)}</strong></p>
                ${sentence(q)}
                <fieldset class="n4-options"><legend>${q.section==="text"?`Gap ${q.number}`:"Answer"}</legend>${q.options.map((option,i)=>`<label class="n4-option"><input type="radio" name="n4-answer" value="${i}" ${state.answers[q.id]===option?"checked":""}><span class="n4-option-number">${i+1}</span><span lang="ja">${jp(option)}</span></label>`).join("")}</fieldset>
                <div class="n4-question-actions"><button data-mock="clear" ${state.answers[q.id]?"":"disabled"}>Clear answer</button><div><button data-mock="previous" ${state.index===0?"disabled":""} aria-label="Previous question" title="Previous question">←</button><button data-mock="next" ${state.index===24?"disabled":""} aria-label="Next question" title="Next question">→</button></div></div>
            </div><aside class="n4-nav" aria-label="Test navigation">${nav()}<p class="n4-nav-key">Filled: answered · *: review later</p><button data-mock="submit" class="n4-primary">Review & submit</button></aside></div>`;
    }
    function renderResults() {
        const result=model.score(paper,state.answers);
        const prior=library.history.filter(a=>a.paperId===state.paperId && a.id!==state.id && library.history.indexOf(a)<library.history.findIndex(a=>a.id===state.id)).length;
        root.innerHTML=`<header class="n4-heading"><div><p class="eyebrow section-eyebrow">${esc(paper.title)} · COMPLETE</p><h2 id="n4-result-title" tabindex="-1">Mock test results</h2></div><button data-mock="exit">All tests</button></header>
            <dl class="n4-scores"><div><dt>Correct</dt><dd id="n4-score">${result.correct} / ${result.total}</dd></div><div><dt>Accuracy</dt><dd>${result.percent}%</dd></div><div><dt>Unanswered</dt><dd>${result.unanswered}</dd></div><div><dt>Elapsed</dt><dd>${time(state.elapsed)}</dd></div></dl>
            <p class="n4-disclaimer">Raw practice score, not a JLPT scaled score or pass prediction.</p>
            <p class="n4-disclaimer">${edition(state)} · ${state.version===model.version?`${paper.exposure.previouslySeen} / 25 questions appeared in previously saved attempts when this test was created. ${paper.exposure.passageSeen?"The passage has appeared before.":"This passage had not appeared in saved attempts."}`:prior?"Repeat attempt; familiarity may affect the score.":"First recorded attempt of this fixed paper."}</p>
            <table class="n4-outline"><caption>Section results</caption><tbody>${result.sections.map(s=>`<tr><th scope="row">${esc(s.title)}</th><td>${s.correct} / ${s.count}</td></tr>`).join("")}</tbody></table>
            ${result.domains.length?`<table class="n4-breakdown"><caption>Grammar decisions in this attempt</caption><thead><tr><th scope="col">Area</th><th scope="col">Correct / tested</th></tr></thead><tbody>${result.domains.map(d=>`<tr><th scope="row">${esc(d.title)}</th><td>${d.correct} / ${d.total}</td></tr>`).join("")}</tbody></table>
            <p class="n4-disclaimer">Small samples, not mastery ratings. Review individual mistakes before drawing conclusions.</p>`:""}
            <div class="n4-review-heading"><h3>Answer review</h3><label>Show<select id="n4-review-filter"><option value="all">All questions</option><option value="missed">Incorrect and unanswered</option></select></label></div>
            <div id="n4-review-list">${result.items.map(q=>`<details class="n4-review-item" data-correct="${q.correct}"><summary>Question ${q.number} · ${q.correct?"Correct":q.selected?"Incorrect":"Unanswered"}<span>${esc(q.topic)}</span></summary><div>
                ${q.section==="text"?`<p>Gap ${q.number} · ${jp(paper.passage.title)}</p>`:sentence(q)}
                <p><strong>Your answer:</strong> <span lang="ja">${q.selected?jp(q.selected):"Unanswered"}</span></p>
                <p><strong>Correct answer:</strong> <span lang="ja">${jp(q.answer)}</span></p>
                ${q.section==="order"?`<p class="n4-solution" lang="ja">${jp(q.before)}${q.chunks.map((chunk,i)=>i===q.star?`<strong>${jp(chunk)}</strong>`:jp(chunk)).join("")}${jp(q.after)}</p>`:""}
                ${model.answerFeedback(q,q.selected)?`<p class="n4-choice-feedback"><strong>Why your choice does not fit:</strong> ${jp(model.answerFeedback(q,q.selected))}</p>`:""}
                <p class="n4-explanation"><strong>Key distinction:</strong> ${jp(q.explanation)}</p>
                ${q.review?.example?`<div class="n4-contrast"><p lang="ja">${jp(q.review.example)}</p><p>${esc(q.review.translation)}</p></div>`:""}
                ${q.review?`<button data-practice="${esc(q.review.unit)}" title="${esc(q.review.focus)}">Practice this topic <span aria-hidden="true">→</span></button>`:""}
                ${q.review?.distractors?`<details class="n4-alternatives"><summary>Other choices</summary><dl>${q.options.filter(o=>o!==q.answer&&o!==q.selected).map(o=>`<dt lang="ja">${jp(o)}</dt><dd>${jp(q.review.distractors[o])}</dd>`).join("")}</dl></details>`:""}
                </div></details>`).join("")}</div>
            <details class="n4-completed-passage"><summary>Completed passage</summary>${renderPassage(0,true)}</details>`;
    }
    function render() {
        tick();
        if(view==="setup")renderSetup();
        else if(state.submitted)renderResults();
        else renderTest();
    }
    function updateNavigation() {
        root.querySelector(".n4-nav").innerHTML=`${nav()}<p class="n4-nav-key">Filled: answered · *: review later</p><button data-mock="submit" class="n4-primary">Review & submit</button>`;
        root.querySelector("#n4-answer-count").textContent=`${Object.keys(state.answers).length}/25 answered`;
        root.querySelector('[data-mock="clear"]').disabled=!state.answers[paper.questions[state.index].id];
    }
    root.addEventListener("change",event=>{
        tick();
        if(event.target.id==="n4-review-filter"){
            root.querySelectorAll(".n4-review-item").forEach(item=>item.hidden=event.target.value==="missed"&&item.dataset.correct==="true");
            return;
        }
        if(!state || state.submitted)return;
        const q=paper.questions[state.index];
        if(event.target.name==="n4-answer")state.answers[q.id]=q.options[Number(event.target.value)];
        else if(event.target.id==="n4-flag")state.flags=event.target.checked?[...new Set([...state.flags,q.id])]:state.flags.filter(id=>id!==q.id);
        else return;
        save();updateNavigation();
    });
    root.addEventListener("click",event=>{
        const button=event.target.closest("button");
        if(!button)return;
        tick();
        if(button.dataset.history){
            const attempt=library.history.find(a=>a.id===button.dataset.history);
            if(attempt){selectAttempt(attempt);view="results";render();focusQuestion();}
            return;
        }
        if(button.dataset.practice && state?.submitted){
            if(!paper.questions.some(q=>q.review?.unit===button.dataset.practice))return;
            save();
            startGrammarPractice(button.dataset.practice,10,{focus:"review"});
            return;
        }
        if(button.dataset.mock==="start"){start();return;}
        if(button.dataset.mock==="resume"){view=state.submitted?"results":"test";lastTick=Date.now();render();focusQuestion();return;}
        if(button.dataset.mock==="exit"){save();view="setup";render();root.scrollIntoView({block:"start"});return;}
        if(!state || state.submitted)return;
        if(button.dataset.jump!==undefined)state.index=Number(button.dataset.jump);
        else if(button.dataset.mock==="next")state.index=Math.min(24,state.index+1);
        else if(button.dataset.mock==="previous")state.index=Math.max(0,state.index-1);
        else if(button.dataset.mock==="clear"){delete state.answers[paper.questions[state.index].id];save();render();return;}
        else if(button.dataset.mock==="submit"){
            const unanswered=25-Object.keys(state.answers).length;
            document.querySelector("#n4-confirm-summary").textContent=`${unanswered} unanswered · ${state.flags.length} marked for review. Submitting locks your answers and reveals the results.`;
            dialog.returnValue="";dialog.showModal();return;
        }else return;
        save();render();focusQuestion();
    });
    dialog.addEventListener("close",()=>{
        if(dialog.returnValue!=="submit" || !state || state.submitted)return;
        tick();state.submitted=true;state.completedAt=Date.now();library=model.remember(library,state);view="results";save();render();focusQuestion();
    });
    window.addEventListener("pagehide",()=>{tick();if(state)save();});
    document.addEventListener("visibilitychange",()=>{tick();if(state)save();});
    new MutationObserver(()=>{tick();if(state)save();}).observe(panel,{attributes:true,attributeFilter:["hidden"]});
    setInterval(()=>{tick();if(view==="test" && ++saveTicks%10===0)save();},1000);
    if(library.active||library.history.length)save();
    render();
    if(new URLSearchParams(location.search).get("mock")==="n4"){
        document.querySelector("#grammar-tab").click();
        document.querySelector("#n4-mock-tab").click();
    }
})();
