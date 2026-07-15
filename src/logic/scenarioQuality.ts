import type { AnimatedScenario,Point } from '../types/soccer';
import { blockedBestChoicePaths } from './trajectory';
import { semanticIssues } from './optionSemantics';
import { timelineDuration } from './timeline';

export type QualityCriterion={id:string;label:string;maximum:number;earned:number;detail:string};
export type ScenarioQuality={sceneId:string;score:number;criteria:QualityCriterion[]};

const inBounds=(point:Point)=>point.x>=0&&point.x<=100&&point.y>=0&&point.y<=64;
const award=(id:string,label:string,checks:boolean[],maximum:number,detail:string):QualityCriterion=>({id,label,maximum,earned:Math.round(maximum*checks.filter(Boolean).length/checks.length),detail});
const movers=(scene:AnimatedScenario,steps:AnimatedScenario['setupAnimation'],team:'blue'|'red')=>new Set(steps.filter((step)=>step.actorId&&step.to&&scene.actors.find((actor)=>actor.id===step.actorId)?.team===team).map((step)=>step.actorId)).size;

export function scoreScenario(scene:AnimatedScenario):ScenarioQuality{
  const blue=scene.actors.filter((actor)=>actor.team==='blue'),red=scene.actors.filter((actor)=>actor.team==='red'),nolan=scene.actors.find((actor)=>actor.id==='nolan');
  const points=[scene.ballStart,...scene.actors.map((actor)=>actor.start),...scene.setupAnimation.flatMap((step)=>[step.from,step.to].filter(Boolean) as Point[]),...scene.results.flatMap((result)=>result.animationSteps.flatMap((step)=>[step.from,step.to].filter(Boolean) as Point[]))];
  const shotsCorrect=scene.results.every((result)=>result.animationSteps.filter((step)=>step.action==='shoot'&&step.actorId&&step.to).every((shot)=>{const shooter=scene.actors.find((actor)=>actor.id===shot.actorId),keeper=scene.actors.find((actor)=>actor.goalkeeper&&actor.team!==shooter?.team);return Boolean(shooter&&keeper&&Math.abs(shot.to!.x-keeper.start.x)<=8)}));
  const previewSignatures=scene.choices.map((choice)=>{const move=choice.previewAnimation.find((step)=>step.actorId==='nolan'&&step.to),ball=choice.previewBall,facing=choice.previewFacing;return `${move?.action}:${Math.round((move?.from?.x??nolan?.start.x??0)/3)},${Math.round((move?.from?.y??nolan?.start.y??0)/3)}>${Math.round((move?.to?.x??0)/3)},${Math.round((move?.to?.y??0)/3)}|f:${facing?.from??''}>${facing?.to??''}|b:${ball?`${Math.round(ball.from.x/3)},${Math.round(ball.from.y/3)}>${Math.round(ball.to.x/3)},${Math.round(ball.to.y/3)}`:''}`});
  const resultSignatures=scene.results.map((result)=>JSON.stringify(result.animationSteps.filter((step)=>!step.actorId?.startsWith('support-')).map((step)=>[step.actorId,step.action,step.to&&Math.round(step.to.x/3),step.to&&Math.round(step.to.y/3)])));
  const everyResult=(test:(result:AnimatedScenario['results'][number])=>boolean)=>scene.results.every(test);
  const criteria:QualityCriterion[]=[
    award('match','7v7 match integrity',[blue.length===7&&red.length===7,blue.filter((actor)=>actor.goalkeeper).length===1&&red.filter((actor)=>actor.goalkeeper).length===1,points.every(inBounds),shotsCorrect],14,'Complete teams, legal coordinates, and attacks toward the opponent goal.'),
    award('role','Role-specific teaching',[/^([ADTG])\d\d$/.test(scene.skillId),scene.visibleCue.length>20,scene.playerDuty.length>4,Boolean(nolan&&nolan.start.x>=scene.activeArea.x-2&&nolan.start.x<=scene.activeArea.x+scene.activeArea.width+2&&nolan.start.y>=scene.activeArea.y-2&&nolan.start.y<=scene.activeArea.y+scene.activeArea.height+2)],14,'Observable skill, visible cue, explicit duty, and relevant active area.'),
    award('setup','Readable match setup',[timelineDuration(scene.setupAnimation)>=3000,movers(scene,scene.setupAnimation,'blue')>=2,movers(scene,scene.setupAnimation,'red')>=2,scene.setupAnimation.some((step)=>['pass','dribble','cross','shoot'].includes(step.action))],12,'The problem develops for several seconds with both teams and the ball active.'),
    award('options','Distinct role-motion options',[scene.choices.length>=2&&scene.choices.length<=3,scene.choices.every((choice)=>choice.previewAnimation.some((step)=>step.actorId==='nolan'&&step.to)),new Set(previewSignatures).size===scene.choices.length,new Set(scene.choices.map((choice)=>choice.label)).size===scene.choices.length],16,'Every tile uses a different, labeled movement path for the active role.'),
    award('consequences','Causal animated consequences',[scene.results.length===scene.choices.length,everyResult((result)=>timelineDuration(result.animationSteps)>=2500),new Set(resultSignatures).size===scene.results.length,scene.results.some((result)=>result.quality==='best')&&scene.results.some((result)=>result.quality==='poor')],16,'Each option creates a different multi-second team outcome.'),
    award('opponents','Active teammates and opponents',[everyResult((result)=>movers(scene,result.animationSteps,'red')>=2),everyResult((result)=>movers(scene,result.animationSteps,'blue')>=2)],14,'Both teams react during every consequence instead of freezing.'),
    award('trajectory','Safe ball geometry',[scene.results.filter((result)=>result.quality!=='poor').every((result)=>blockedBestChoicePaths(scene,result).length===0),shotsCorrect],10,'Helpful kicks avoid opponent bodies and every shot attacks the correct goal.'),
    award('feedback','Child-readable feedback',[everyResult((result)=>result.narration.length>15),everyResult((result)=>result.explanation.length>8),everyResult((result)=>result.teamEffect.length>15),new Set(scene.results.map((result)=>result.narration)).size===scene.results.length],4,'Feedback identifies what happened and how it affected the team.'),
  ];
  const rawScore=criteria.reduce((sum,item)=>sum+item.earned,0),semantic=semanticIssues(scene);return{sceneId:scene.id,score:semantic.length?Math.min(96,rawScore):rawScore,criteria};
}

export const scoreCurriculum=(scenes:AnimatedScenario[])=>scenes.map(scoreScenario);
