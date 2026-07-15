import {describe,expect,it} from 'vitest';
import {animatedScenarios,sceneById} from '../src/lessons';
import {applyAnimationStep,finalFrame} from '../src/logic/timeline';
import {hardFailures,visuallyOccludes} from '../src/logic/spatialQuality';

describe('readable player geometry',()=>{
  it('passes the child-visible phone audit for every option in all 250 cases',()=>{
    const failures=animatedScenarios.flatMap((scene)=>hardFailures(scene).map((failure)=>`${scene.id}: ${failure.code}: ${failure.message}`));
    expect(failures).toEqual([]);
  });

  it('keeps player bodies separate at the decision pause and consequence freeze frames',()=>{
    const failures=animatedScenarios.flatMap((scene)=>hardFailures(scene).filter((failure)=>failure.code==='PLAYER_OCCLUSION').map((failure)=>`${scene.id}: ${failure.message}`));
    expect(failures).toEqual([]);
  });

  it('keeps the CM-02 receiver visible and ball-side of the marker',()=>{
    const scene=sceneById('CM-02')!;
    const setup=finalFrame(scene.actors,scene.ballStart,scene.setupAnimation);
    const result=scene.results.find((item)=>item.choiceId==='good')!;
    const frame=[...result.animationSteps].sort((a,b)=>a.startTime-b.startTime).reduce(applyAnimationStep,setup);
    const tom=frame.actors.nolan.position,marker=frame.actors.red1.position;
    expect(visuallyOccludes(scene.actors.find((actor)=>actor.id==='nolan')!,tom,scene.actors.find((actor)=>actor.id==='red1')!,marker)).toBe(false);
    expect(tom.x).toBeLessThan(marker.x);
  });

  it('shows opposite tactical routes for CM-04 drop support and run away',()=>{
    const scene=sceneById('CM-04')!,tom=scene.actors.find((actor)=>actor.id==='nolan')!.start;
    const drop=scene.choices.find((choice)=>choice.label==='Drop to help')!.previewAnimation.find((step)=>step.actorId==='nolan')!;
    const away=scene.choices.find((choice)=>choice.label==='Run away')!.previewAnimation.find((step)=>step.actorId==='nolan')!;
    expect(drop.to!.x).toBeLessThan(tom.x);
    expect(away.to!.x).toBeGreaterThan(tom.x);
    expect(Math.hypot(drop.to!.x-away.to!.x,drop.to!.y-away.to!.y)).toBeGreaterThanOrEqual(8);
  });

  it('shows Tom reaching the end line before the WNG-04 cutback',()=>{
    const scene=sceneById('WNG-04')!,tom=scene.actors.find((actor)=>actor.id==='nolan')!.start;
    const cutback=scene.choices.find((choice)=>choice.label==='Cut it back')!,blind=scene.choices.find((choice)=>choice.label==='Cross blindly')!;
    const cutMove=cutback.previewAnimation.find((step)=>step.actorId==='nolan')!,blindMove=blind.previewAnimation.find((step)=>step.actorId==='nolan')!;
    expect(cutMove.to!.x-tom.x).toBeGreaterThanOrEqual(12);
    expect(Math.hypot(cutMove.to!.x-blindMove.to!.x,cutMove.to!.y-blindMove.to!.y)).toBeGreaterThanOrEqual(8);
    expect(cutback.previewBall!.to.y).not.toBe(blind.previewBall!.to.y);
  });
});
