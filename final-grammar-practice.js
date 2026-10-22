(function(root,factory){
 if(typeof module==="object"&&module.exports)module.exports=factory(require('./drill-kit.js'),require('./discourse-scenes.js'),require('./voice-scenes.js'),require('./role-contrast-practice.js'));
 else root.FinalGrammarPractice=factory(root.DrillKit,root.DiscourseScenes,root.VoiceScenes,root.RoleContrastPractice);
})(typeof globalThis==='object'?globalThis:this,function(k,data,voiceData,roles){
 'use strict';
 const voice={
  '読む':['読まれる','よまれる','読ませる','よませる','読ませて','よませて','読ませられる','よませられる','読まされる','よまされる'],
  '書く':['書かれる','かかれる','書かせる','かかせる','書かせて','かかせて','書かせられる','かかせられる','書かされる','かかされる'],
  '使う':['使われる','つかわれる','使わせる','つかわせる','使わせて','つかわせて','使わせられる','つかわせられる','使わされる','つかわされる'],
  '持ってくる':['持ってこられる','もってこられる','持ってこさせる','もってこさせる','持ってこさせて','もってこさせて','持ってこさせられる','もってこさせられる'],
  '借りる':['借りられる','かりられる','借りさせる','かりさせる','借りさせて','かりさせて','借りさせられる','かりさせられる'],
  '食べる':['食べられる','たべられる','食べさせる','たべさせる','食べさせて','たべさせて','食べさせられる','たべさせられる'],
  '買う':['買われる','かわれる','買わせる','かわせる','買わせて','かわせて','買わせられる','かわせられる','買わされる','かわされる'],
  '送る':['送られる','おくられる','送らせる','おくらせる','送らせて','おくらせて','送らせられる','おくらせられる','送らされる','おくらされる'],
  '洗う':['洗われる','あらわれる','洗わせる','あらわせる','洗わせて','あらわせて','洗わせられる','あらわせられる','洗わされる','あらわされる'],
  '作る':['作られる','つくられる','作らせる','つくらせる','作らせて','つくらせて','作らせられる','つくらせられる','作らされる','つくらされる']
 };
 const actions=data.actions.map(a=>({...a,passive:voice[a.verb][0],cause:voice[a.verb][2],causeTe:voice[a.verb][4],forced:voice[a.verb][6],shortForced:voice[a.verb][8]}));
 const helpers=[
  ['clean','掃除する','そうじする','掃除して','そうじして',[['部屋','へや','clean the room'],['教室','きょうしつ','clean the classroom'],['台所','だいどころ','clean the kitchen'],['事務所','じむしょ','clean the office']]],
  ['repair','直す','なおす','直して','なおして',[['自転車','じてんしゃ','repair the bicycle'],['時計','とけい','repair the watch'],['パソコン','ぱそこん','repair the computer'],['カメラ','かめら','repair the camera']]],
  ['translate','翻訳する','ほんやくする','翻訳して','ほんやくして',[['手紙','てがみ','translate the letter'],['メール','めーる','translate the email'],['資料','しりょう','translate the materials'],['説明','せつめい','translate the explanation']]]
 ];
 const favors=[...actions.filter(a=>!['eat','buy','borrow'].includes(a.domain)),...helpers.flatMap(([domain,verb,,te,,nouns])=>nouns.map(([noun,,actionEn],i)=>({id:`${domain}:${i}`,domain,noun,verb,te,prefix:noun+'を',dict:noun+'を'+verb,actionEn,words:[noun,verb]})))];
 const readings=[...data.readings,...Object.values(voice).flatMap(f=>{const r=[];for(let i=0;i<f.length;i+=2)r.push([f[i],f[i+1]]);return r;}),...helpers.flatMap(f=>[[f[1],f[2]],[f[3],f[4]],...f[5].map(n=>[n[0],n[1]])]),['友達','ともだち'],['妹','いもうと'],['弟','おとうと'],['会議','かいぎ'],['中止','ちゅうし'],['来月','らいげつ']];
 readings.push(...voiceData.readings,...roles.readings,['次','つぎ']);
 for(const f of Object.values(voice))for(const i of [2,6,8])if(f[i])readings.push([f[i].replace(/る$/,'ました'),f[i+1].replace(/る$/,'ました')]);
 const units=['decisions','te-auxiliary','giving','passive','causative'];
 for(const f of Object.values(voice))readings.push([f[0].replace(/る$/,'ました'),f[1].replace(/る$/,'ました')]);
 readings.push(['窓','まど'],['開けて','あけて'],['閉めて','しめて']);
 function build(unit){const bank=[];
  const gap=(label,yes,options)=>k.gap(label,Array.isArray(yes)?yes:[yes],options);
  const cl=(s,task,v,prompt,segments,why,facts={})=>bank.push(k.cloze(unit,task,task,s,v,prompt,[{label:'Complete the meaning',segments}],why,facts));
  const ch=(s,task,v,prompt,options,index,why,facts={})=>bank.push(k.choice(unit,task,task,s,v,prompt,options,options[index],why,facts));
  if(unit==='decisions')for(const s of actions){
   for(const [v,own]of [true,false].entries()){
    cl(s,'decision-source',v,`${own?'You personally decided':'An arrangement has been settled'}: you will ${s.actionEn}. Present ${own?'your decision':'the settled arrangement without naming a decider'}.`,[s.dict,gap('Decision framing',own?'ことにしました':'ことになりました',['ことにしました','ことになりました']),'。'],'ことにする foregrounds making a decision; ことになる presents the outcome as settled. The latter does not prove that the speaker had no involvement.',{own});
    cl(s,'decision-polarity',v,`You decided ${own?'to':'NOT to'} ${s.actionEn}.`,[s.prefix,gap('Decision content',own?s.verb:s.nai,[s.verb,s.nai]),'ことにしました。'],'Negation before こと changes what was decided. A decision is not proof of completion.',{positive:own});
   }
   cl(s,'noun-or-action',0,`State your decision to ${s.actionEn}. The decision concerns an ACTION.`,[s.dict,gap('Action decision','ことにしました',['ことにしました','にしました'])],'A verb clause needs こと in this decision construction. A noun choice instead uses noun + にする.');
   cl(s,'choose-object',0,`Choose this item: ${s.noun}. Complete the noun-choice construction.`,[s.noun,gap('Choice','に',['に','ことに']),'します。'],'A noun takes にします directly. こと nominalizes an action clause, not this standalone object.');
   ch(s,'decision-not-completion',0,s.dict+'ことにしました。',['The speaker decided to act; completion is not established.','The action is definitely complete.','The action is impossible.','Someone forced the speaker to act.'],0,'ことにしました reports a decision. It does not itself report completion or coercion.');
   for(const [v,stage]of ['personal','arranged','completed'].entries()){
    const endings=['ことにしました','ことになりました','ました'];
    cl(s,'decision-or-event',v,({personal:`You personally decided to ${s.actionEn}; you have not reported doing it.`,arranged:`It has been arranged that you will ${s.actionEn}. Present the settled arrangement.`,completed:`You actually did this: ${s.actionEn}. Report the event itself.`})[stage],[s.prefix,gap('Action form',stage==='completed'?s.stem:s.verb,[s.stem,s.verb]),gap('What happened?',endings[v],endings),'。'],'A personal decision, a settled arrangement, and a completed event make different claims. A decision or arrangement alone does not establish completion.',{stage});
   }
  }
  if(unit==='te-auxiliary')for(const s of actions){
   const options=['みます','おきます','しまいます'];
   for(const [v,goal]of ['try','prepare','finish'].entries())if(goal!=='finish'||s.domain!=='use')cl(s,'purpose-of-helper',v,({try:`Try this to see how it goes: ${s.actionEn}.`,prepare:`Do this in advance for later: ${s.actionEn}.`,finish:`Finish this completely: ${s.actionEn}.`})[goal],[s.prefix,s.te,gap('Helper',options[v],options),'。'],'てみる tries an action; ておく prepares for later; てしまう can mark full completion. Completion need not carry regret.',{goal});
   if(s.domain!=='use')cl(s,'completed-helper',0,`You have already finished this completely: ${s.actionEn}. Keep the completion meaning.`,[s.prefix,s.te,gap('Completed action','しまいました',['しまいました','みました','おきました']),'。'],'てしまいました marks completion here. てみました instead foregrounds a trial, and ておきました preparation.');
   ch(s,'completion-not-regret',0,s.prefix+s.te+'しまいました。',['The action is complete; whether the speaker regrets it needs context.','The speaker necessarily regrets it.','The speaker has only made a future plan.','The speaker is asking permission.'],0,'しまう can express completion or an unwanted result. The form alone does not establish an unhappy emotion.');
   cl(s,'request-a-trial',0,`Ask someone to TRY this and see: ${s.actionEn}.`,[s.prefix,s.te,gap('Try it','みてください',['みてください','おいてください','しまってください']),'。'],'てみてください invites a trial; ておいてください asks for preparation or maintaining a state.');
  }
  if(unit==='giving')for(const s of favors){
   const views=[
    {actor:'Tanaka',beneficiary:'you',subject:'田中さんが',other:'',ending:'くれました'},
    {actor:'Tanaka',beneficiary:'you',subject:'私は',other:'田中さんに',ending:'もらいました'},
    {actor:'you',beneficiary:'Tanaka',subject:'私は',other:'田中さんに',ending:'あげました'},
    {actor:'you',beneficiary:'Tanaka',subject:'田中さんは',other:'私に',ending:'もらいました'}
   ];
   const why='てくれる: the subject acts for the speaker. てあげる: the subject acts for another person. てもらう: the subject receives the favor and the に phrase identifies the performer.';
   for(const [v,f]of views.entries()){
    const ending=gap('Favor ending',f.ending,['くれました','あげました','もらいました']);
    ending.optionFeedback=Object.fromEntries(ending.options.map(o=>[o,({'くれました':'This makes the subject the performer of a favor toward the speaker.','あげました':'This makes the subject the performer of a favor outward to another person.','もらいました':'This makes the subject the beneficiary; the person marked に performs the action.'})[o]+' '+why]));
    cl(s,'favor-viewpoint',v,`${f.actor==='you'?'You':f.actor} did this for ${f.beneficiary}: ${s.actionEn}. Keep the viewpoint of the supplied sentence.`,[f.subject,f.other,s.prefix,s.te,ending,'。'],why,{actor:f.actor,beneficiary:f.beneficiary,viewpoint:f.ending});
    const options=['Tanaka acted for the speaker.','The speaker acted for Tanaka.','Tanaka asks the speaker to act; completion is not stated.','The speaker asks Tanaka to act; completion is not stated.'];
    ch(s,'read-favor-roles',v,f.subject+f.other+s.prefix+s.te+f.ending+'。',options,f.actor==='Tanaka'?0:1,why,{actor:f.actor,beneficiary:f.beneficiary});
   }
   for(const [v,inward]of [true,false].entries()){
    const source=inward?'田中さんが':'私が',receiver=inward?'私':'田中さん',performer=inward?'田中さん':'私';
    cl(s,'preserve-benefit',v,`Keep who acted and who benefited. Use the receiver as the new subject.\n${source}${s.prefix}${s.te}${inward?'くれました':'あげました'}。`,[gap('Receiver',receiver,['私','田中さん']),'は',gap('Performer',performer,['私','田中さん']),'に',s.prefix,s.te,'もらいました。'],why,{inward});
    cl(s,'respectful-viewpoint',v,`Your teacher did this for you: ${s.actionEn}. Keep the supplied subject and use the appropriate respectful or humble favor expression.`,[inward?'先生が':'私は先生に',s.prefix,s.te,gap('Respectful viewpoint',inward?'くださいました':'いただきました',['くださいました','いただきました','さしあげました']),'。'],'くださる honors the teacher as performer; いただく humbly presents the speaker as receiver. Both describe the same direction of benefit.',{teacherSubject:inward});
   }
  }
  if(unit==='passive')for(const s of actions){
   cl(s,'object-passive',0,`Tanaka acts on this object: ${s.actionEn}. Make the object the passive topic, keeping Tanaka as the doer.`,[s.noun,'は田中さん',gap('Doer',['に','によって'],['に','によって','を']),gap('Passive',s.passive,[s.passive,s.verb,s.cause]),'。'],'A passive object-topic sentence foregrounds what receives the action. に or によって identifies the doer here; the original active verb would change the construction.');
   cl(s,'affected-owner',0,`Tanaka did this to your possession and it affected you: ${s.actionEn}. Complete the affected-person passive.`,['私は田中さんに',s.prefix,gap('Affected passive',s.passive.replace(/る$/,'ました'),[s.passive.replace(/る$/,'ました'),s.stem+'ました']),'。'],'The speaker is the affected subject; Tanaka performs the action on the object marked を. This is not a report that the speaker performed it.');
   cl(s,'passive-doer',0,`Keep Tanaka as the DOER in this passive sentence.`,[s.noun,'は田中さん',gap('Doer',['に','によって'],['に','によって','が']),s.passive,'。'],'に and によって can mark the agent in this object passive. が would not mark Tanaka as the passive agent in this frame.');
   ch(s,'read-owner-passive',0,'私は田中さんに'+s.prefix+s.passive.replace(/る$/,'ました')+'。',['Tanaka acted on the object, affecting the speaker.','The speaker acted on Tanaka.','The speaker made Tanaka act.','The object gave something to the speaker.'],0,'The passive subject is affected; the に phrase names the performer. The を phrase remains the affected possession.');
   ch(s,'emotion-not-fixed',0,s.noun+'は田中さんに'+s.passive+'。',['Tanaka is the performer; the passive form alone does not establish the speaker’s emotion.','The speaker must be angry.','The object performs the action.','Tanaka is forced to act.'],0,'Passive voice changes perspective. Emotion depends on the situation; passive does not always mean suffering.');
  }
  if(unit==='causative')for(const s of actions){
   cl(s,'make-someone-act',0,`You make Tanaka do this: ${s.actionEn}. Keep the object marked を.`,['私は田中さん',gap('Person caused to act','に',['に','を']),s.prefix,gap('Causative',s.cause,[s.cause,s.passive,s.verb]),'。'],'In this transitive causative, に marks the person who performs the action and を stays on the object. Causative can express making or letting, depending on context.');
   cl(s,'permission-for-me',0,`Ask Tanaka to LET YOU do this: ${s.actionEn}. You want permission to act yourself.`,[s.prefix,gap('Let me act',s.causeTe,[s.causeTe,s.te]),'ください。'],'Causative てください asks to be allowed to act. Ordinary てください asks the listener to perform the action.');
   cl(s,'forced-performer',0,`Tanaka made YOU do this against your wishes: ${s.actionEn}.`,['私は田中さんに',s.prefix,gap('Made to act',k.unique([s.forced,s.shortForced].filter(Boolean)),k.unique([s.forced,s.shortForced,s.passive,s.cause].filter(Boolean))),'。'],'Causative-passive makes the person compelled to act the subject. Both standard and established contracted forms are accepted.');
   ch(s,'read-causative',0,'私は田中さんに'+s.prefix+s.cause+'。',['Tanaka performs the action; the speaker causes or allows it.','The speaker performs the action for Tanaka.','Tanaka acts on the speaker using a passive construction.','The sentence alone proves Tanaka acted unwillingly.'],0,'Causative identifies who causes and who acts. It does not by itself settle whether the action is compelled or permitted.');
   ch(s,'read-permission',0,s.prefix+s.causeTe+'くれませんか。',['The speaker asks to be allowed to act.','The speaker asks the listener to perform the action.','The speaker reports being forced to act.','The speaker promises to do a favor.'],0,'The causative before くれませんか asks for permission for the speaker’s own action.');
   cl(s,'who-gets-permission',0,`Ask permission to act yourself, using くれませんか: ${s.actionEn}.`,[s.prefix,gap('Permission request',s.causeTe,[s.causeTe,s.te]),'くれませんか。'],'A request to let ME act needs the causative. Without it, てくれませんか asks YOU to act for me.');
  }
  if(unit==='giving')for(const a of actions.filter(a=>['buy','eat','make','read'].includes(a.domain))){
   const s={...a,id:'gift:'+a.noun};
   cl(s,'receive-object',0,`You received this item FROM Tanaka: ${a.noun}.`,['私は田中さん',gap('Source',['に','から'],['に','から','を']),a.prefix,gap('Receive','もらいました',['もらいました','あげました','くれました']),'。'],'With a received object, に or から marks the source. The subject receives the object.');
   cl(s,'give-object-toward-me',0,`Tanaka gave YOU this item: ${a.noun}. Keep Tanaka as subject.`,['田中さんは私に',a.prefix,gap('Toward speaker','くれました',['くれました','あげました','もらいました']),'。'],'くれる describes a gift toward the speaker. It is not the receiver-subject construction もらう.');
   cl(s,'give-object-outward',0,`You gave TANAKA this item: ${a.noun}. Keep yourself as subject.`,['私は田中さんに',a.prefix,gap('Give outward','あげました',['あげました','くれました','もらいました']),'。'],'あげる describes the subject giving the item outward.');
  }
  if(unit==='te-auxiliary')for(const [i,noun]of ['窓','ドア','カーテン','ふた'].entries())for(const [v,open]of [true,false].entries()){
   const s={id:`state:${i}:${v}`,domain:'maintain-state',words:[noun]},te=open?'開けて':'閉めて';
   cl(s,'leave-state',0,`Ask someone to LEAVE the ${noun} ${open?'open':'closed'} as it is.`,[noun,'は',te,gap('Keep this state','おいてください',['おいてください','みてください']),'。'],'ておく can maintain an existing state as well as prepare an action in advance. Here the request is to keep it as it is.');
  }
  if(unit==='causative')for(const s of voiceData.frames)for(const [v,forced]of [false,true].entries()){
   cl(s,'intransitive-roles',v,forced?`Tanaka makes YOU ${s.en}. Keep yourself as subject.`:`You cause or allow TANAKA to ${s.en}. Keep yourself as subject.`,['私は田中さん',gap('Other participant',forced?'に':['に','を'],['に','を']),gap('Who causes whom?',forced?[s.forced,s.short].filter(Boolean):s.cause,[s.cause,s.forced,...(s.short?[s.short]:[])]),'。'],'In the causative, the subject causes another person to act. In the causative-passive, the subject is made to act. These intransitive causatives can mark the performer with に or を; the forced-person viewpoint uses に for the causer.',{forced});
  }
  if(unit==='passive')for(const [i,[verb,pass,en]]of voiceData.people.entries())for(const [v,me]of [true,false].entries()){
   const s={id:`person:${i}:${v}`,domain:'person-passive',words:[verb]};
   cl(s,'person-passive',0,`${me?'Tanaka':'You'} ${en} ${me?'you':'Tanaka'}. Complete the passive from the affected person's viewpoint.`,[gap('Affected person',me?'私':'田中さん',['私','田中さん']),'は',gap('Performer',me?'田中さん':'私',['私','田中さん']),'に',pass,'。'],'The affected person is the passive subject. The person marked に performs the original action.',{me});
  }
  const retired=new Set(['read-owner-passive','read-causative','read-permission']);
  return [...bank.filter(q=>!retired.has(q.meta.task)),...roles.build(unit,{actions,favors})];
 }
 const modules=Object.fromEntries(units.map(unit=>[unit,{version:k.version(unit),readings,displayReadings:readings,create:({aliases=[]}={})=>k.engine(()=>build(unit),[...readings,...voiceData.aliases],aliases),selectQueue:(b,n,o)=>k.select(unit,b,n,o)}]));
 return{modules,actions,favors,readings,displayReadings:readings,units};
});
