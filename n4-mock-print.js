(function(root,factory) {
    "use strict";
    if(typeof module==="object"&&module.exports)module.exports=factory();
    else root.N4MockPrint=factory();
})(typeof globalThis==="object"?globalThis:this,function() {
    "use strict";
    const escape=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
    function paperId(paper) {
        // Fingerprint the actual content and shuffled options, not a newly generated seed.
        let hash=2166136261;
        for(const char of JSON.stringify(paper))hash=Math.imul(hash^char.charCodeAt(0),16777619);
        return `N4-${(hash>>>0).toString(16).padStart(8,"0").toUpperCase()}`;
    }
    function document(paper,{kind="test",furigana=true,jp=escape,cssHref="n4-mock-print.css",scriptHref="n4-mock-print-page.js"}={}) {
        if(!["test","key"].includes(kind))throw new Error("Unknown print document type");
        const key=kind==="key",id=paperId(paper),title=key?"Answer key":"Test";
        const heading=(name,description)=>`<h2>${escape(name)}</h2><p class="instructions">${escape(description)}</p>`;
        const passage=completed=>`<div class="passage"><h3 lang="ja">${jp(paper.passage.title)}</h3>${paper.passage.paragraphs.map(paragraph=>`<p lang="ja">${paragraph.split(/(【\d+】)/g).map(part=>{
            const match=part.match(/^【(\d+)】$/);
            if(!match)return jp(part);
            const q=paper.questions.find(q=>q.number===Number(match[1]));
            return completed?`<strong class="filled-gap">${jp(q.answer)}</strong>`:`<span class="gap">${q.number}</span>`;
        }).join("")}</p>`).join("")}</div>`;
        function stem(q,completed=false) {
            if(q.section==="form")return jp(completed?q.prompt.replace(/（\s*）/,()=>q.answer):q.prompt);
            if(q.section==="order")return jp(q.before)+(completed?q.chunks.map((chunk,i)=>i===q.star?`<strong class="star-answer">${jp(chunk)}</strong>`:jp(chunk)).join(""):
                `<span class="order-slots">${[0,1,2,3].map(i=>`<span>${i===q.star?"★":"&nbsp;"}</span>`).join("")}</span>`)+jp(q.after);
            return "";
        }
        const options=q=>`<ol class="options">${q.options.map((option,i)=>`<li><span class="option-number">${i+1}</span><span lang="ja">${jp(option)}</span></li>`).join("")}</ol>`;
        const question=q=>`<article class="question" data-question="${q.number}"><div class="question-stem"><h3>${q.number}</h3>${q.section!=="text"?`<p lang="ja">${stem(q)}</p>`:""}</div>${options(q)}</article>`;
        const answerSheet=()=>`<section class="print-section answer-sheet">${heading("Answer sheet","Choose one answer for each question.")}<div class="name-line">Name: <span></span> Date: <span></span></div><div class="answer-columns">${[paper.questions.slice(0,10),paper.questions.slice(10,20),paper.questions.slice(20)].map(group=>`<table><thead><tr><th>Question</th><th>Answer</th></tr></thead><tbody>${group.map(q=>`<tr><th scope="row">${q.number}</th><td>${[1,2,3,4].map(n=>`<span class="bubble">${n}</span>`).join("")}</td></tr>`).join("")}</tbody></table>`).join("")}</div><div class="notes"><h3>Notes</h3>${Array.from({length:5},()=>"<div></div>").join("")}</div></section>`;
        let content;
        if(!key)content=`<div class="name-line">Name: <span></span> Date: <span></span></div>
            <section class="print-section">${heading("01 / Grammar forms","Choose the best expression for each blank. Questions 1-15.")}${paper.questions.filter(q=>q.section==="form").map(question).join("")}</section>
            <section class="print-section">${heading("02 / Sentence composition","Arrange all four parts. Choose the part that belongs at ★. Questions 16-20.")}${paper.questions.filter(q=>q.section==="order").map(question).join("")}</section>
            <section class="print-section">${heading("03 / Text grammar","Choose the expression that fits each gap and the passage. Questions 21-25.")}${passage(false)}<div class="text-questions">${paper.questions.filter(q=>q.section==="text").map(question).join("")}</div></section>${answerSheet()}`;
        else content=`<section class="key-summary">${heading("Answers at a glance","Option numbers match this test's printed choices.")}<div class="key-columns">${[paper.questions.slice(0,10),paper.questions.slice(10,20),paper.questions.slice(20)].map(group=>`<table><thead><tr><th>Question</th><th>Option</th></tr></thead><tbody>${group.map(q=>`<tr data-key="${q.number}"><th scope="row">${q.number}</th><td>${q.options.indexOf(q.answer)+1}</td></tr>`).join("")}</tbody></table>`).join("")}</div></section>
            <section class="print-section explanations">${heading("Answers & explanations","Sentence-order answers include the complete sentence, with the ★ part underlined.")}${paper.questions.map(q=>`<article class="key-item"><h3>${q.number} / Option ${q.options.indexOf(q.answer)+1} <span lang="ja">${jp(q.answer)}</span></h3>${q.section!=="text"?`<p class="model-sentence" lang="ja">${stem(q,true)}</p>`:`<p class="gap-label">Passage gap ${q.number}</p>`}<p>${jp(q.explanation)}</p></article>`).join("")}</section>
            <section class="print-section">${heading("Completed passage","Answers are underlined.")}${passage(true)}</section>`;
        // Test documents never embed answers, explanations, saved responses, or model-order chunks.
        return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${id}-${key?"Answer-Key":"Test"}</title><link rel="stylesheet" href="${escape(cssHref)}"><style>@page { @bottom-left { content: "${id} / ${title}"; } @bottom-right { content: counter(page); } }</style><script src="${escape(scriptHref)}" defer></script></head>
            <body class="${furigana?"":"no-furigana"}" data-kind="${kind}"><nav class="print-controls" aria-label="PDF options"><strong>${title} PDF</strong><label><input id="print-furigana" type="checkbox" ${furigana?"checked":""}> Furigana</label>${key?'<label><input id="print-explanations" type="checkbox" checked> Explanations</label>':""}<button id="print-save" type="button">Print / Save as PDF</button><span id="print-status" role="status"></span></nav>
            <main><header class="paper-heading"><p>KOTOBA / N4 GRAMMAR</p><h1>Mock test${key?" / Answer key":""}</h1><div class="paper-meta"><span>${id}</span><span>25 questions / 3 parts</span></div><p class="unofficial">Unofficial practice. Grammar only; not an official JLPT paper.</p></header>${content}</main></body></html>`;
    }
    return Object.freeze({paperId,document});
});
