import inventoryMarkdown from '../../SCENARIO_INVENTORY.md?raw';
import type {AnimatedActor,AnimatedChoice,AnimatedScenario,AnimationStep,ChoiceResult,Point,SceneCategory,ScenePack,SceneStage} from '../types/soccer';

type InventoryRow={id:string;role:string;trigger:string;decision:string;good:string;poor:string;location:string;assets:string};
type Meta={title:string;goodLabel:string;poorLabel:string;icon:string};

const metadata:Record<string,Meta>=Object.fromEntries(`
WNG-01|Stay Wide|Stay wide|Crowd the ball|↔
WNG-02|Read the Fullback|Attack open side|Run at cover|🧭
WNG-03|Cross Early|Cross now|Keep dribbling|🥅
WNG-04|End-Line Cutback|Cut it back|Cross blindly|↩
WNG-05|Back-Post Run|Run back post|Watch outside|⚡
WNG-06|Short or Behind|Read defender|Choose wrong run|👀
WNG-07|Track the Overlap|Track fullback|Stay high|🏃
WNG-08|Counter With Width|Sprint wide|Run central|🪽
STR-01|Near or Far Post|Attack near post|Follow defender|🎯
STR-02|Check to the Ball|Come short|Wait high|↙
STR-03|Run Behind|Sprint behind|Come crowded|⚡
STR-04|Hold It Up|Shield and lay off|Turn blindly|🛡️
STR-05|Shoot or Square|Pass across goal|Shoot narrow|👟
STR-06|Follow the Rebound|Attack rebound|Celebrate early|💥
STR-07|Curve the Press|Block one side|Press straight|🌙
STR-08|Stay Onside|Delay the run|Go too early|🚩
CM-01|Scan First|Scan and turn|Receive blind|👀
CM-02|Turn or Play Back|Read the pressure|Force the turn|🔄
CM-03|Switch the Play|Switch sides|Stay crowded|↔
CM-04|Support Behind|Drop to help|Run away|🔻
CM-05|Third-Player Run|Run beyond|Watch the pass|3️⃣
CM-06|Control the Tempo|Slow and regroup|Rush forward|⏱️
CM-07|Cover the Fullback|Cover the channel|Join the attack|🧹
CM-08|Arrive Late|Wait then arrive|Run in early|⏳
FB-01|Show Outside|Guide outside|Open inside|➡
FB-02|Stop the Cross|Close early|Wait too long|🚫
FB-03|Overlap|Run outside|Stand behind|🏃
FB-04|Underlap|Run inside|Duplicate width|↗
FB-05|Know When to Hold|Stay and protect|Both go forward|✋
FB-06|Recover Inside|Sprint goal-side|Jog straight back|⚡
CB-01|Stay Goal-Side|Get goal-side|Follow wrong side|🛡️
CB-02|Step or Drop|Drop with runner|Step without pressure|⬇
CB-03|Cover the Partner|Slide behind|Both step|🤝
CB-04|Clear the Danger|Clear wide|Pass across goal|💨
CB-05|Track the Cross|Track striker|Watch the ball|👀
CB-06|Hold the Line|Step together|Drop alone|📏
GK-01|Set the Angle|Set and narrow|Stay on line|🧤
GK-02|Sweep the Through Ball|Come quickly|Hesitate|⚡
GK-03|Parry Safely|Push it wide|Parry central|↗
GK-04|Open-Side Distribution|Roll wide|Roll central|🎳
TW-01|Share the Space|Split the lanes|Stay together|↔
TW-02|Support Triangle|Make a triangle|Stand in a line|🔺
TW-03|Wall Pass|Pass and run|Pass and wait|🔁
TW-04|Third-Player Team Run|Third player goes|Everyone watches|3️⃣
TW-05|Team Switch|Recycle and switch|Follow the ball|🔄
TW-06|Attack a 2v1|Wait then pass|Pass too early|2️⃣
TW-07|Defend a 2v1|Delay and protect|Dive in|🛡️
TW-08|Pressure Cover Balance|Take three jobs|All chase|⚖️
TW-09|Three-Lane Counter|Fill three lanes|Bunch central|⚡
TW-10|Protect the Lead|Shield or recycle|Cross blindly|🔒`.trim().split('\n').map((line)=>{const[id,title,goodLabel,poorLabel,icon]=line.split('|');return[id,{title,goodLabel,poorLabel,icon}]}));

const rows:InventoryRow[]=inventoryMarkdown.split('## Duplicate-concept review')[0].split('\n').filter((line)=>/^\| (WNG-|STR-|CM-|FB-|CB-|GK-|TW-)\d\d /.test(line)).map((line)=>{const cells=line.split('|').slice(1,-1).map((cell)=>cell.trim());return{id:cells[0],role:cells[1],trigger:cells[2],decision:cells[3],good:cells[4],poor:cells[5],location:cells[6],assets:cells[7]}});

const categoryFor=(id:string):SceneCategory=>id.startsWith('WNG')?'winger':id.startsWith('STR')?'striker':id.startsWith('CM')?'central-midfielder':id.startsWith('FB')?'fullback':id.startsWith('CB')?'center-defender':id.startsWith('GK')?'goalkeeper':'teamwork';
const defensiveIds=new Set(['WNG-07','STR-07','CM-07','FB-01','FB-02','FB-05','FB-06','CB-01','CB-02','CB-03','CB-04','CB-05','CB-06','GK-01','GK-02','GK-03','GK-04','TW-07','TW-08']);
const crossers=new Set(['WNG-03','WNG-04','FB-03','FB-04']);
const finishers=new Set(['WNG-05','STR-01','STR-03','STR-06','CM-08']);
const passFinishers=new Set(['STR-05','TW-06']);
const goalkeeperIds=new Set(['GK-01','GK-02','GK-03','GK-04']);
const alternateLabels:Record<string,string>={'WNG-06':'Come short','STR-05':'Take a safe shot','CM-02':'Play back','FB-05':'Slide central','CB-04':'Pass wide','GK-04':'Throw wide','TW-02':'Use other corner'};
const p=(x:number,y:number):Point=>({x,y});
const step=(startTime:number,duration:number,action:AnimationStep['action'],actorId?:string,from?:Point,to?:Point,emotion?:AnimationStep['emotion']):AnimationStep=>({startTime,duration,action,actorId,from,to,emotion});
const actor=(id:string,team:'blue'|'red',role:string,start:Point,number:number,name?:string,goalkeeper=false):AnimatedActor=>({id,team,role,start,facing:team==='blue'?0:180,jerseyNumber:number,name,goalkeeper});
const result=(choiceId:string,quality:ChoiceResult['quality'],narration:string,explanation:string,teamEffect:string,animationSteps:AnimationStep[]):ChoiceResult=>({choiceId,quality,narration,explanation,teamEffect,comparisonLine:quality==='poor'?'The other choice helps the whole team.':'This choice solves the game problem.',animationSteps,freezeFrameTime:Math.max(...animationSteps.map((item)=>item.startTime+item.duration))});
const choice=(id:string,label:string,icon:string,action:AnimationStep['action'],from:Point,to:Point):AnimatedChoice=>({id,label,spokenLabel:label,icon,previewAnimation:[step(0,1100,action,'nolan',from,to)]});

function layout(row:InventoryRow,index:number){
  const defending=defensiveIds.has(row.id),goalkeeper=goalkeeperIds.has(row.id);const lane=index%3;const y=lane===0?17:lane===1?32:47;const jitter=(index%4)*2;
  if(goalkeeper){const nolan=p(8,32),redBall=p(38+jitter,y),red2=p(28+jitter,48-y/3);return{defending:true,nolan,carrier:redBall,goodTo:p(13,30+(index%3)*3),badTo:p(7,34),target:p(25,14+(index%2)*35),actors:[actor('nolan','blue','Goalkeeper',nolan,1,'Nolan',true),actor('blue1','blue','Defender',p(22,20),4),actor('blue2','blue','Winger',p(30,51),11),actor('redBall','red','Striker',redBall,9),actor('red2','red','Forward',red2,10),actor('redGK','red','Goalkeeper',p(92,32),1,undefined,true)]};}
  if(defending){const nolan=p(27+jitter,y),redBall=p(45+jitter,Math.max(12,Math.min(52,y-5))),red2=p(34+jitter,56-y/2);return{defending:true,nolan,carrier:redBall,goodTo:p(31+jitter,y-2),badTo:p(42+jitter,y+4),target:p(18,12+(index%3)*19),actors:[actor('nolan','blue',row.role,nolan,7,'Nolan'),actor('blue1','blue','Defender',p(24,45),4),actor('blueGK','blue','Goalkeeper',p(8,32),1,undefined,true),actor('redBall','red','Attacker',redBall,10),actor('red2','red','Striker',red2,9),actor('red3','red','Support',p(52,45),8)]};}
  const nolan=p(55+jitter,y),carrier=p(31+jitter,35-(index%2)*8),target=p(75+jitter/2,52-y/3);return{defending:false,nolan,carrier,goodTo:p(67+jitter/2,Math.max(10,Math.min(53,y+(index%2?8:-6)))),badTo:p(48+jitter,y+(index%2?-3:5)),target,actors:[actor('nolan','blue',row.role,nolan,7,'Nolan'),actor('blue1','blue','Midfielder',carrier,8),actor('blue2','blue','Teammate',target,11),actor('red1','red','Defender',p(62+jitter/2,34),4),actor('red2','red','Defender',p(74,18+(index%3)*15),5),actor('redGK','red','Goalkeeper',p(92,32),1,undefined,true)]};
}

function goodAnimation(row:InventoryRow,index:number,l:ReturnType<typeof layout>):AnimationStep[]{
  const {nolan,carrier,goodTo,target}=l;
  if(row.id==='TW-09')return[step(0,1400,'run','nolan',nolan,p(67,32)),step(0,1500,'run','blue2',target,p(72,52)),step(300,900,'pass','blue1',carrier,p(67,32)),step(1300,500,'receive','nolan',p(67,32),p(68,32)),step(1900,800,'pass','nolan',p(68,32),p(72,52)),step(2600,800,'shoot','blue2',p(72,52),p(97,34)),step(3300,500,'celebrate','nolan',undefined,undefined,'happy')];
  if(row.id==='FB-03')return[step(0,1600,'run','nolan',nolan,p(76,12)),step(300,1200,'shield','blue2',target,p(67,22)),step(700,1900,'run','blue1',carrier,p(84,38)),step(1300,700,'pass','blue2',p(67,22),p(76,12)),step(2000,500,'receive','nolan',p(76,12),p(77,12)),step(2500,900,'cross','nolan',p(77,12),p(84,38)),step(3400,600,'shoot','blue1',p(84,38),p(97,32))];
  if(row.id==='TW-02')return[step(0,1200,'run','nolan',nolan,p(43,31)),step(0,1200,'run','blue2',target,p(53,48)),step(600,800,'pass','blue1',carrier,p(43,31)),step(1300,500,'receive','nolan',p(43,31),p(44,31)),step(1800,800,'pass','nolan',p(44,31),p(53,48)),step(2500,700,'pass','blue2',p(53,48),p(69,34)),step(3200,500,'celebrate','blue1',undefined,undefined,'happy')];
  if(row.id==='TW-07')return[step(0,1500,'defend','nolan',nolan,p(28,32)),step(200,1800,'dribble','redBall',carrier,p(31,30)),step(900,1800,'run','blue1',p(24,45),p(27,37)),step(1900,900,'turn','redBall',p(31,30),p(40,22)),step(2600,700,'defend','blue1',p(27,37),p(32,30)),step(3300,500,'celebrate','nolan',undefined,undefined,'happy')];
  if(row.id==='GK-01')return[step(0,900,'set','nolan',nolan,p(12,32)),step(700,900,'shoot','redBall',carrier,p(4,27)),step(1200,900,'dive','nolan',p(12,32),p(8,27)),step(1300,700,'block','nolan',p(8,27),p(19,20)),step(2500,600,'celebrate','blue1',undefined,undefined,'happy')];
  if(row.id==='GK-02')return[step(0,1600,'run','nolan',nolan,p(23,32)),step(300,1500,'dribble','redBall',carrier,p(25,34)),step(1500,800,'clear','nolan',p(23,32),p(36,10)),step(2400,900,'run','nolan',p(23,32),p(11,32)),step(3300,500,'celebrate','blue1',undefined,undefined,'happy')];
  if(row.id==='GK-03')return[step(0,900,'shoot','redBall',carrier,p(6,35)),step(500,900,'dive','nolan',nolan,p(7,36)),step(900,700,'parry','nolan',p(7,36),p(13,56)),step(1800,900,'run','blue1',p(22,20),p(16,48)),step(2800,500,'celebrate','blue1',undefined,undefined,'happy')];
  if(row.id==='GK-04')return[step(0,700,'catch','nolan',nolan,nolan),step(800,500,'scan','nolan',nolan,p(9,31)),step(1400,1000,'pass','nolan',p(9,31),target),step(2300,500,'receive','blue2',target,p(target.x+1,target.y)),step(2800,1100,'dribble','blue2',target,p(48,52))];
  if(crossers.has(row.id))return[step(0,1100,'dribble','nolan',nolan,goodTo),step(900,1000,'cross','nolan',goodTo,target),step(1800,500,'receive','blue2',target,target),step(2300,800,'shoot','blue2',target,p(97,32)),step(3000,600,'celebrate','nolan',undefined,undefined,'happy')];
  if(passFinishers.has(row.id))return[step(0,800,'run','blue2',target,p(82,38)),step(300,900,'pass','nolan',nolan,p(82,38)),step(1200,500,'receive','blue2',p(82,38),p(83,38)),step(1900,700,'shoot','blue2',p(83,38),p(97,32)),step(2800,600,'celebrate','nolan',undefined,undefined,'happy')];
  if(finishers.has(row.id))return[step(0,1200,'run','nolan',nolan,goodTo),step(600,900,'pass','blue1',carrier,goodTo),step(1400,500,'receive','nolan',goodTo,goodTo),step(2000,800,'shoot','nolan',goodTo,p(97,32)),step(2900,600,'celebrate','blue2',undefined,undefined,'happy')];
  if(l.defending)return[step(0,1200,row.assets.toLowerCase().includes('press')?'press':'run','nolan',nolan,goodTo),step(500,1400,'dribble','redBall',carrier,p(goodTo.x+3,goodTo.y)),step(1500,700,row.assets.toLowerCase().includes('block')?'block':'defend','nolan',goodTo,p(goodTo.x+2,goodTo.y)),step(2200,900,'clear','nolan',goodTo,target),step(3100,500,'celebrate','blue1',undefined,undefined,'happy')];
  const action=row.assets.toLowerCase().includes('shield')?'shield':row.assets.toLowerCase().includes('scan')?'scan':'run';return[step(0,1000,action,'nolan',nolan,goodTo),step(600,900,'pass','blue1',carrier,goodTo),step(1400,500,'receive','nolan',goodTo,goodTo),step(1900,900,'pass','nolan',goodTo,target),step(2700,500,'receive','blue2',target,target),step(3100,900,'dribble','blue2',target,p(84,target.y))];
}

function poorAnimation(row:InventoryRow,index:number,l:ReturnType<typeof layout>):AnimationStep[]{
  const {nolan,carrier,badTo,target}=l;const text=row.poor.toLowerCase();
  if(row.id==='GK-01'||row.id==='GK-02')return[step(0,1100,'walk','nolan',nolan,badTo),step(400,1300,'dribble','redBall',carrier,p(18,36)),step(1700,800,'shoot','redBall',p(18,36),p(3,32)),step(2300,600,'react','nolan',undefined,undefined,'worried')];
  if(row.id==='GK-03')return[step(0,800,'shoot','redBall',carrier,p(8,32)),step(500,900,'dive','nolan',nolan,p(8,32)),step(1000,600,'parry','nolan',p(8,32),p(20,32)),step(1700,700,'shoot','red2',p(20,32),p(3,32)),step(2500,600,'react','nolan',undefined,undefined,'worried')];
  if(row.id==='GK-04')return[step(0,700,'catch','nolan',nolan,nolan),step(900,900,'pass','nolan',nolan,p(29,32)),step(1500,500,'receive','red2',p(29,32),p(28,32)),step(2100,800,'shoot','red2',p(28,32),p(3,32)),step(2700,600,'react','nolan',undefined,undefined,'worried')];
  if(text.includes('offside'))return[step(0,1500,'run','nolan',nolan,p(86,nolan.y)),step(800,900,'pass','blue1',carrier,p(86,nolan.y)),step(1700,700,'walk','red1',undefined,p(81,34)),step(2400,600,'react','nolan',undefined,undefined,'surprised')];
  if(text.includes('goalkeeper')||text.includes('hands')||text.includes('held'))return[step(0,1000,'run','nolan',nolan,badTo),step(900,1100,'cross','nolan',badTo,p(91,32)),step(1900,700,'catch','redGK',p(92,32),p(91,32)),step(2700,600,'react','nolan',undefined,undefined,'worried')];
  if(l.defending&&(text.includes('shot')||text.includes('scores')||text.includes('goal')||text.includes('finish')))return[step(0,1100,'run','nolan',nolan,badTo),step(300,1300,'dribble','redBall',carrier,p(22,35)),step(1300,700,'pass','redBall',p(22,35),p(17,42)),step(2000,500,'receive','red2',p(17,42),p(16,40)),step(2500,800,'shoot','red2',p(16,40),p(3,32)),step(3000,500,'react','nolan',undefined,undefined,'worried')];
  if(l.defending)return[step(0,1200,'run','nolan',nolan,badTo),step(300,1700,'dribble','redBall',carrier,p(25,22+(index%2)*20)),step(1700,900,'pass','redBall',p(25,32),p(16,45)),step(2500,900,'dribble','red2',p(16,45),p(7,40)),step(3100,500,'react','nolan',undefined,undefined,'worried')];
  if(text.includes('counter'))return[step(0,1100,'run','nolan',nolan,badTo),step(700,700,'pass','blue1',carrier,badTo),step(1400,700,'defend','red1',p(62,34),badTo),step(2100,1200,'dribble','red1',badTo,p(28,36)),step(2900,500,'react','nolan',undefined,undefined,'worried')];
  return[step(0,1100,'run','nolan',nolan,badTo),step(700,800,'pass','blue1',carrier,badTo),step(1400,700,'defend','red1',p(62,34),badTo),step(2100,900,'turn','blue1',carrier,p(25,40)),step(2900,600,'react','nolan',undefined,undefined,'worried')];
}

function alternateAnimation(row:InventoryRow,l:ReturnType<typeof layout>):AnimationStep[]{const alt=p(Math.min(88,l.goodTo.x+5),Math.max(9,58-l.goodTo.y));if(row.id==='GK-04')return[step(0,700,'catch','nolan',l.nolan,l.nolan),step(800,600,'scan','nolan',l.nolan,p(9,34)),step(1500,1100,'pass','nolan',p(9,34),p(34,14)),step(2500,500,'receive','blue1',p(34,14),p(35,14)),step(3000,900,'dribble','blue1',p(35,14),p(48,17))];if(l.defending)return[step(0,1100,'run','nolan',l.nolan,alt),step(500,1200,'defend','blue1',p(24,40),p(29,34)),step(1500,800,'pass','blue1',p(29,34),alt),step(2300,800,'clear','nolan',alt,p(46,54)),step(3100,500,'celebrate','blue1',undefined,undefined,'happy')];return[step(0,1000,'run','nolan',l.nolan,alt),step(600,900,'pass','blue1',l.carrier,alt),step(1400,500,'receive','nolan',alt,alt),step(1900,900,'pass','nolan',alt,l.target),step(2700,500,'receive','blue2',l.target,l.target),step(3100,700,'celebrate','blue1',undefined,undefined,'happy')];}

function makeScene(row:InventoryRow,index:number):AnimatedScenario{const meta=metadata[row.id];if(!meta)throw new Error(`Missing scene metadata for ${row.id}`);const l=layout(row,index);const setup:AnimationStep[]=l.defending?[step(200,2200,'dribble','redBall',p(l.carrier.x+10,l.carrier.y),l.carrier),step(700,1800,'run','red2',p(l.carrier.x+8,50),p(l.carrier.x-8,42)),step(1100,1700,'defend','blue1',p(21,45),p(24,40)),step(2800,500,'react','nolan',undefined,undefined,'surprised')]:[step(200,2200,'dribble','blue1',p(l.carrier.x-10,l.carrier.y+2),l.carrier),step(700,1800,'defend','red1',p(70,34),p(62,34)),step(1100,1700,'run','blue2',p(l.target.x-8,l.target.y),l.target),step(2800,500,'scan','nolan',l.nolan,l.nolan)];const goodSteps=goodAnimation(row,index,l),poorSteps=poorAnimation(row,index,l),alternateLabel=alternateLabels[row.id],alternateSteps=alternateLabel?alternateAnimation(row,l):undefined;const choices=[choice('good',meta.goodLabel,meta.icon,goodSteps[0]?.action??'run',l.nolan,l.goodTo),...(alternateSteps?[choice('alternate',alternateLabel,'✅',alternateSteps[0]?.action??'run',l.nolan,alternateSteps[0]?.to??l.goodTo)]:[]),choice('poor',meta.poorLabel,'🤔',poorSteps[0]?.action??'walk',l.nolan,l.badTo)];const results=[result('good','best',row.good,row.decision,row.good,goodSteps),...(alternateSteps?[result('alternate','good',`Good option. ${row.good}`,row.decision,`The team also stays safe with this choice.`,alternateSteps)]:[]),result('poor','poor',row.poor,`Try this instead: ${row.decision}`,row.poor,poorSteps)];return{id:row.id,title:meta.title,category:categoryFor(row.id),role:row.role,stage:(1+Math.floor((index%8)/3)) as SceneStage,formalConcept:row.decision,introNarration:`Watch. ${row.trigger}`,prompt:'What should Nolan do?',pauseTime:3800,ballStart:l.carrier,actors:l.actors,setupAnimation:setup,choices,results};}

export const animatedScenarios=rows.map(makeScene);
const packInfo:Record<SceneCategory,Omit<ScenePack,'id'|'scenes'>>={
  winger:{name:'Winger Games',icon:'🪽',color:'#11a968',description:'Width, crossing, back-post runs, and tracking.'},
  striker:{name:'Striker Games',icon:'🎯',color:'#f97316',description:'Finishing, movement, hold-up play, rebounds, and pressing.'},
  'central-midfielder':{name:'Midfielder Games',icon:'🧭',color:'#8b5cf6',description:'Scan, switch, control tempo, support, and cover.'},
  fullback:{name:'Fullback Games',icon:'🏃',color:'#0ea5a0',description:'Defend wide, overlap, underlap, and recover.'},
  'center-defender':{name:'Center Defender Games',icon:'🛡️',color:'#2583da',description:'Position, cover, control the line, and manage danger.'},
  goalkeeper:{name:'Goalkeeper Games',icon:'🧤',color:'#e2a600',description:'Set angles, sweep, parry, and distribute.'},
  teamwork:{name:'Teamwork Games',icon:'🤝',color:'#db4c8b',description:'Use space, combine, transition, and protect together.'},
};
export const scenePacks:ScenePack[]=(Object.keys(packInfo) as SceneCategory[]).map((id)=>({id,...packInfo[id],scenes:animatedScenarios.filter((scene)=>scene.category===id)}));
export const sceneById=(id:string)=>animatedScenarios.find((scene)=>scene.id===id);
export const packById=(id:string)=>scenePacks.find((pack)=>pack.id===id);
