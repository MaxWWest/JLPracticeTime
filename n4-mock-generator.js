(function(root, factory) {
    if (typeof module === "object" && module.exports) module.exports = factory(require("./grammar-practice-core.js"),require("./n4-mock-test.js"),require("./n4-mock-bank.js"));
    else root.N4MockGenerator = factory(root.GrammarPracticeCore,root.N4MockTest,root.N4MockBank);
})(typeof globalThis === "object" ? globalThis : this, function(core,fixed,extra) {
    "use strict";
    const version="n4-mock-v3", bankVersion="20261029-1";
    const clone=value=>JSON.parse(JSON.stringify(value));
    const domains=Object.keys(fixed.review.domains);
    const oldFamily={a1:"destination",a3:"deadline",a4:"appearance",a5:"experience",a6:"volitional",a7:"result-state",a8:"no-obligation",a11:"offer",a13:"preparation",a14:"favor-toward-me",b1:"event-site",b2:"limited-positive",b3:"about-to",b6:"discovery",b9:"external-decision",b13:"without",b15:"concession",c3:"continuation",c9:"self-decision",c11:"possibility",c13:"purpose-prevention"};
    const originals=fixed.papers.flatMap(p=>p.questions.map(q=>({...clone(q),family:oldFamily[q.id]||q.id,review:clone(fixed.review.items[q.id])})));
    const forms=[...originals.filter(q=>q.section==="form"),...extra.forms];
    const orders=[...originals.filter(q=>q.section==="order"),...extra.orders];
    const passages=[...fixed.papers.map(p=>({id:`original-${p.id}`,...clone(p.passage),questions:originals.filter(q=>p.questions.some(x=>x.id===q.id)&&q.section==="text")})),...extra.passages];
    const bank={forms,orders,passages};
    function paperForAttempt(attempt) {
        return attempt.version===version?clone(attempt.paper):fixed.createPaper(attempt.paperId,attempt.seed,attempt.version);
    }
    function exposure(history) {
        const counts=new Map(),recent=new Set(),passageCounts=new Map(),last=new Map();
        history.forEach((attempt,i)=>{
            const p=paperForAttempt(attempt);
            const passageId=p.passage.id||`original-${attempt.paperId}`;
            passageCounts.set(passageId,(passageCounts.get(passageId)||0)+1);
            for(const q of p.questions){
                counts.set(q.id,(counts.get(q.id)||0)+1);last.set(q.id,i);
                if(i>=history.length-3)recent.add(q.family||oldFamily[q.id]||q.id);
            }
        });
        return {counts,recent,passageCounts,last};
    }
    function generate(seed,history=[]) {
        const rng=core.random(seed),seen=exposure(history),used=new Set(),totals=Object.fromEntries(domains.map(d=>[d,0]));
        const passage=core.shuffle(passages,rng).sort((a,b)=>(seen.passageCounts.get(a.id)||0)-(seen.passageCounts.get(b.id)||0))[0];
        passage.questions.forEach(q=>totals[q.review.domain]++);
        let remaining=20;
        function select(pool) {
            const deficit=domains.reduce((sum,d)=>sum+Math.max(0,2-totals[d]),0);
            const candidates=core.shuffle(pool.filter(q=>!used.has(q.family)&&totals[q.review.domain]<6
                && (remaining>deficit||totals[q.review.domain]<2)),rng);
            if(!candidates.length)throw new Error("Insufficient distinct question families");
            // Bound coverage to 2-6 per domain; inside those limits, prioritize genuinely unseen questions.
            candidates.sort((a,b)=>(seen.counts.get(a.id)||0)-(seen.counts.get(b.id)||0)
                || Number(seen.recent.has(a.family))-Number(seen.recent.has(b.family))
                || totals[a.review.domain]-totals[b.review.domain]
                || (seen.last.get(a.id)??-1)-(seen.last.get(b.id)??-1));
            const q=candidates[0];used.add(q.family);totals[q.review.domain]++;remaining--;return q;
        }
        const selectedOrders=Array.from({length:5},()=>select(orders));
        const selectedForms=Array.from({length:2},()=>select(forms.filter(q=>q.review.demand==="formation")));
        for(let i=2;i<15;i++)selectedForms.push(select(forms.filter(q=>q.review.demand!=="formation")));
        const chosen=[...core.shuffle(selectedForms,rng),...core.shuffle(selectedOrders,rng),...passage.questions];
        const extraPosition=Math.floor(rng()*4);
        const positions=core.shuffle(Array.from({length:25},(_,i)=>(i+extraPosition)%4),rng);
        const questions=chosen.map((q,i)=>{
            const options=core.shuffle(q.options.filter(v=>v!==q.answer),rng);options.splice(positions[i],0,q.answer);
            return {...clone(q),number:i+1,options};
        });
        return {id:"generated",title:"Generated test",version,bankVersion,seed,questions,
            passage:{id:passage.id,title:passage.title,paragraphs:[...passage.paragraphs]},
            exposure:{previouslySeen:questions.filter(q=>seen.counts.has(q.id)).length,passageSeen:seen.passageCounts.has(passage.id)}};
    }
    const string=value=>typeof value==="string"&&value.length>0&&value.length<=8000;
    const id=value=>typeof value==="string"&&/^[a-zA-Z0-9_-]{1,100}$/.test(value);
    function validPaper(p) {
        if(!p||p.version!==version||!string(p.title)||!string(p.bankVersion)||!Number.isSafeInteger(p.seed)||!Array.isArray(p.questions)||p.questions.length!==25)return false;
        if(!Number.isInteger(p.exposure?.previouslySeen)||p.exposure.previouslySeen<0||p.exposure.previouslySeen>25||typeof p.exposure.passageSeen!=="boolean")return false;
        if(new Set(p.questions.map(q=>q?.id)).size!==25)return false;
        if(!id(p.passage?.id)||!string(p.passage.title)||!Array.isArray(p.passage.paragraphs)||!p.passage.paragraphs.length||p.passage.paragraphs.length>10||!p.passage.paragraphs.every(string))return false;
        const gaps=p.passage.paragraphs.join("").match(/【\d+】/g)||[];
        if(gaps.length!==5||![21,22,23,24,25].every(n=>gaps.filter(g=>g===`【${n}】`).length===1))return false;
        return p.questions.every((q,i)=>{
            if(!id(q.id)||!id(q.family)||q.number!==i+1||q.section!==(i<15?"form":i<20?"order":"text")||!string(q.topic)||!string(q.explanation))return false;
            if(!Array.isArray(q.options)||q.options.length!==4||!q.options.every(string)||new Set(q.options).size!==4||!q.options.includes(q.answer))return false;
            if(!domains.includes(q.review?.domain)||!id(q.review.unit)||!string(q.review.focus))return false;
            if(q.section==="form"&&!string(q.prompt))return false;
            if(q.section==="order")return typeof q.before==="string"&&typeof q.after==="string"&&q.star===2&&Array.isArray(q.chunks)&&q.chunks.length===4&&new Set(q.chunks).size===4&&q.chunks.every(c=>q.options.includes(c))&&q.answer===q.chunks[2]&&Array.isArray(q.review.roles)&&q.review.roles.length===4;
            return q.options.filter(o=>o!==q.answer).every(o=>string(q.review.distractors?.[o]));
        });
    }
    function restore(value) {
        try {
            const s=JSON.parse(value);
            if(s?.version!==version)return fixed.restore(value);
            if(!validPaper(s.paper)||!id(s.id)||s.paper.seed!==s.seed)return null;
            const paper=clone(s.paper),timestamp=v=>Number.isSafeInteger(v)&&v>=0&&v<=8640000000000000?v:0;
            return {id:s.id,version,paperId:"generated",seed:paper.seed,paper,
                answers:Object.fromEntries(paper.questions.filter(q=>q.options.includes(s.answers?.[q.id])).map(q=>[q.id,s.answers[q.id]])),
                flags:paper.questions.filter(q=>Array.isArray(s.flags)&&s.flags.includes(q.id)).map(q=>q.id),
                index:Number.isInteger(s.index)?Math.max(0,Math.min(24,s.index)):0,
                elapsed:Number.isFinite(s.elapsed)?Math.max(0,s.elapsed):0,submitted:s.submitted===true,
                startedAt:timestamp(s.startedAt),completedAt:s.submitted===true?timestamp(s.completedAt):0};
        }catch{return null;}
    }
    function createAttempt(library,seed=Date.now(),now=Date.now()) {
        if(library.active&&!library.active.submitted)throw new Error("Finish the active test first");
        const paper=generate(seed,library.history);
        return restore(JSON.stringify({id:`generated-${seed}-${now}`,version,seed,paper,startedAt:now,answers:{},flags:[],index:0,elapsed:0,submitted:false}));
    }
    function remember(library,attempt) {
        const clean=attempt?.submitted?restore(JSON.stringify(attempt)):null;
        return clean?{...library,history:[...library.history.filter(a=>a.id!==clean.id),clean].slice(-fixed.historyLimit)}:library;
    }
    function restoreLibrary(value,previous=null,original=null) {
        for(const input of [value,previous]){
            try {
                const s=JSON.parse(input);
                if(![2,3].includes(s?.schema)||!Array.isArray(s.history))continue;
                let library={schema:3,active:restore(JSON.stringify(s.active)),history:[]};
                for(const attempt of s.history.slice(-fixed.historyLimit))library=remember(library,attempt);
                return remember(library,library.active);
            }catch{ /* Try the earlier library, retaining its original question version. */ }
        }
        const active=restore(original);
        return remember({schema:3,active,history:[]},active);
    }
    function answerFeedback(q,selected) {
        if(!selected||selected===q.answer||!q.review)return null;
        if(q.section==="order")return `${selected} is in position ${q.chunks.indexOf(selected)+1} of the model sequence. The starred position is 3. ${q.explanation}`;
        return q.review.distractors[selected]||null;
    }
    return {...fixed,version,bankVersion,bank,readings:[...fixed.readings,...extra.readings],generate,paperForAttempt,createAttempt,restore,restoreLibrary,remember,answerFeedback,validPaper};
});
