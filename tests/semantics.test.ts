import {describe,expect,it} from 'vitest';
import {animatedScenarios} from '../src/lessons';
import {semanticIssues} from '../src/logic/optionSemantics';

describe('option and consequence semantics',()=>{
  it('matches every option label to the active role animation',()=>{const issues=animatedScenarios.flatMap(semanticIssues);expect(issues).toEqual([])});
  it('shows receive-on-half-turn and receive-without-scanning correctly',()=>{const scene=animatedScenarios.find((item)=>item.id==='AM-07')!,good=scene.choices.find((item)=>item.id==='good')!,poor=scene.choices.find((item)=>item.id==='poor')!,goodResult=scene.results.find((item)=>item.choiceId==='good')!,poorResult=scene.results.find((item)=>item.choiceId==='poor')!;expect(good.previewFacing).toBeDefined();expect(goodResult.animationSteps.some((item)=>item.actorId==='nolan'&&item.action==='scan')).toBe(true);expect(poor.previewFacing).toBeUndefined();expect(poorResult.animationSteps.some((item)=>item.actorId==='nolan'&&item.action==='scan')).toBe(false);expect(poor.previewAnimation[0].from).toEqual(poor.previewAnimation[0].to)});
});
