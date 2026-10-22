(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory(require('./drill-kit.js'));
 else root.RoleContrastPractice=factory(root.DrillKit);
})(typeof globalThis==='object'?globalThis:this,function(k){
 'use strict';
 const readings=[['佐藤','さとう'],['相手','あいて']];
 function build(unit,{actions,favors}){
  const bank=[];
  const cl=(s,task,v,prompt,rows,explanation,facts)=>bank.push(k.cloze(unit,task,task,s,v,prompt,rows,explanation,facts));
  if(unit==='giving')for(const s of favors)for(const [n,name]of ['田中さん','佐藤さん'].entries())for(const [v,inward]of [true,false].entries()){
   const actor=inward?name:'私',beneficiary=inward?'私':name;
   const speakerView=`私は${name}に${s.prefix}${s.te}${inward?'もらいました':'あげました'}。`;
   cl(s,'identify-favor-participants',n*2+v,speakerView,[
    {label:'Who performed the action?',segments:[k.gap('Performer',[actor],['私',name])]},
    {label:'Who benefited?',segments:[k.gap('Beneficiary',[beneficiary],['私',name])]}
   ],'The subject of てもらう receives the favor; the person marked に acts. With てあげる, the subject acts for the person marked に.',{actor,beneficiary});
  }
  if(['passive','causative'].includes(unit))for(const s of actions.filter(s=>['read','use','eat','wash'].includes(s.domain))){
   const interpretations=[
    {id:'affected',actor:'田中さん',controller:'Not stated',form:s.passive.replace(/る$/,'ました'),prompt:`Tanaka acted on your item without asking: ${s.actionEn}. Describe how you were affected.`,meaning:'The speaker is affected by Tanaka acting on the item; who caused the action is not stated.'},
    {id:'causer',actor:'田中さん',controller:'私',form:s.cause.replace(/る$/,'ました'),prompt:`You required Tanaka to ${s.actionEn}. Describe your role in making that happen.`,meaning:'The speaker causes Tanaka to act. Tanaka performs the action.'},
    {id:'compelled',actor:'私',controller:'田中さん',form:s.forced.replace(/る$/,'ました'),prompt:`Tanaka required you to ${s.actionEn} against your wishes. Describe what happened to you.`,meaning:'Tanaka makes the speaker act. The speaker performs the action.'}
   ];
   const options=interpretations.map(f=>f.form);
   for(const [v,f]of interpretations.entries()){
    const accepted=[f.form,...(f.id==='compelled'&&s.shortForced?[s.shortForced.replace(/る$/,'ました')]:[])];
    const field=k.gap('What happened?',accepted,options);
    field.optionFeedback=Object.fromEntries(interpretations.map(other=>[other.form,other.meaning]));
    cl(s,'same-frame-different-event',v,f.prompt,[{label:'Describe the event',segments:['私は田中さんに',s.prefix,field,'。']}],f.meaning,{event:f.id,actor:f.actor,controller:f.controller});
    cl(s,'identify-voice-participants',v,`私は田中さんに${s.prefix}${f.form}。`,[
     {label:'Who performed the action?',segments:[k.gap('Performer',[f.actor],['私','田中さん'])]},
     {label:'Who caused or required it?',segments:[k.gap('Controller',[f.controller],['私','田中さん','Not stated'])]}
    ],f.meaning+' A passive report alone does not identify a causer.',{event:f.id,actor:f.actor,controller:f.controller});
   }
  }
  if(unit==='causative')for(const s of actions)for(const [v,self]of [true,false].entries()){
   cl(s,'request-performer',v,s.prefix+(self?s.causeTe:s.te)+'くれませんか。',[{label:'Who would do the action if this request is accepted?',segments:[k.gap('Requested performer',[self?'私':'相手'],['私','相手'])]}],self?'The speaker requests permission to act personally.':'The speaker asks the listener to perform the action.',{self});
  }
  return bank;
 }
 return{build,readings};
});
