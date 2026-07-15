import type {AnimatedActor,AnimatedChoice,AnimatedScenario,AnimationStep,Point} from '../types/soccer';
import {applyAnimationStep,finalFrame,type SceneFrame} from './timeline';
import {blockedBestChoicePaths} from './trajectory';

export type HardFailure={code:'PLAYER_OCCLUSION'|'RECEIVER_BLOCKED'|'OPTIONS_LOOK_SAME'|'BALL_PATH_BLOCKED';message:string};

const distance=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.y-b.y);
const isSupport=(actor:AnimatedActor)=>actor.id.startsWith('support-');
export const visuallyOccludes=(a:AnimatedActor,pa:Point,b:AnimatedActor,pb:Point)=>{
  const ax=isSupport(a)?2.5:a.id==='nolan'?5.1:3.6,ay=isSupport(a)?4.5:a.id==='nolan'?7:6;
  const bx=isSupport(b)?2.5:b.id==='nolan'?5.1:3.6,by=isSupport(b)?4.5:b.id==='nolan'?7:6;
  return Math.abs(pa.x-pb.x)<ax+bx-.5&&Math.abs(pa.y-pb.y)<ay+by-1;
};

function frameOcclusions(scene:AnimatedScenario,frame:SceneFrame,phase:string){
  const failures:HardFailure[]=[];
  for(let i=0;i<scene.actors.length;i++)for(let j=i+1;j<scene.actors.length;j++){
    const a=scene.actors[i],b=scene.actors[j];
    if(!visuallyOccludes(a,frame.actors[a.id].position,b,frame.actors[b.id].position))continue;
    // Tiny background figures are allowed to compress slightly; never allow Tom,
    // an active player, or opponents at the same point to hide one another.
    if(isSupport(a)&&isSupport(b)&&distance(frame.actors[a.id].position,frame.actors[b.id].position)>3)continue;
    failures.push({code:'PLAYER_OCCLUSION',message:`${phase}: ${a.id} hides ${b.id}`});
  }
  return failures;
}

const movement=(choice:AnimatedChoice)=>choice.previewAnimation.find((step)=>step.actorId==='nolan'&&step.to);
const angle=(step:AnimationStep|undefined)=>step?.from&&step.to?Math.atan2(step.to.y-step.from.y,step.to.x-step.from.x):0;
const angleGap=(a:number,b:number)=>Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b)))*180/Math.PI;
export function choicesLookSame(a:AnimatedChoice,b:AnimatedChoice){
  const am=movement(a),bm=movement(b),aFrom=am?.from,aTo=am?.to,bFrom=bm?.from,bTo=bm?.to;
  const aTravel=aFrom&&aTo?distance(aFrom,aTo):0,bTravel=bFrom&&bTo?distance(bFrom,bTo):0;
  const endpointGap=aTo&&bTo?distance(aTo,bTo):0;
  const routeGap=angleGap(angle(am),angle(bm));
  const ballGap=a.previewBall&&b.previewBall?distance(a.previewBall.to,b.previewBall.to):a.previewBall||b.previewBall?99:0;
  const actionDifferent=am?.action!==bm?.action;
  return endpointGap<8&&routeGap<32&&ballGap<8&&!actionDifferent&&Math.abs(aTravel-bTravel)<5;
}

function blockedReceivers(scene:AnimatedScenario,setup:SceneFrame,result:AnimatedScenario['results'][number]){
  const failures:HardFailure[]=[];let frame=setup;
  const ordered=[...result.animationSteps].sort((a,b)=>a.startTime-b.startTime);
  for(let i=0;i<ordered.length;i++){
    const step=ordered[i],actor=step.actorId?scene.actors.find((item)=>item.id===step.actorId):undefined;
    if(step.action==='receive'&&actor?.team==='blue'&&step.to){
      const kick=[...ordered.slice(0,i)].reverse().find((item)=>item.to&&['pass','cross','clear'].includes(item.action)&&distance(item.to,step.to!)<4);
      if(kick){
        const source=kick.from??frame.ball,dx=step.to.x-source.x,dy=step.to.y-source.y,length=Math.max(1,Math.hypot(dx,dy));
        const ux=dx/length,uy=dy/length;
        for(const defender of scene.actors.filter((item)=>item.team==='red'&&!item.goalkeeper)){
          const position=frame.actors[defender.id].position,near=distance(position,step.to)<11;
          const receiverProgress=(step.to.x-source.x)*ux+(step.to.y-source.y)*uy;
          const defenderProgress=(position.x-source.x)*ux+(position.y-source.y)*uy;
          if(near&&defenderProgress<=receiverProgress+.5)failures.push({code:'RECEIVER_BLOCKED',message:`${result.choiceId}: ${actor.id} receives behind ${defender.id}`});
        }
      }
    }
    frame=applyAnimationStep(frame,step);
  }
  return failures;
}

export function hardFailures(scene:AnimatedScenario):HardFailure[]{
  const setup=finalFrame(scene.actors,scene.ballStart,scene.setupAnimation),failures=frameOcclusions(scene,setup,'decision pause');
  for(let i=0;i<scene.choices.length;i++)for(let j=i+1;j<scene.choices.length;j++)if(choicesLookSame(scene.choices[i],scene.choices[j]))failures.push({code:'OPTIONS_LOOK_SAME',message:`${scene.choices[i].label} and ${scene.choices[j].label} show the same route`});
  for(const result of scene.results){
    const resultFrame=[...result.animationSteps].sort((a,b)=>a.startTime-b.startTime).reduce(applyAnimationStep,setup);
    failures.push(...frameOcclusions(scene,resultFrame,`${result.choiceId} freeze frame`));
    if(result.quality!=='poor')failures.push(...blockedReceivers(scene,setup,result));
    if(result.quality!=='poor')for(const blocked of blockedBestChoicePaths(scene,result))failures.push({code:'BALL_PATH_BLOCKED',message:`${result.choiceId}: ${blocked.step.action} crosses ${blocked.blockerIds.join(', ')}`});
  }
  return [...new Map(failures.map((failure)=>[`${failure.code}:${failure.message}`,failure])).values()];
}
