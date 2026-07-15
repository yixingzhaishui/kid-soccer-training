import {describe,expect,it} from 'vitest';
import {animatedScenarios} from '../src/lessons';
import {displayChildName,personalizeScenario,personalizeText} from '../src/logic/personalize';

describe('child name personalization',()=>{
  it('uses Tom when no name is entered',()=>expect(displayChildName('   ')).toBe('Tom'));
  it('replaces the canonical player name and possessive form',()=>expect(personalizeText("Nolan sees Nolan’s teammate and Nolan's goal.",'Mia')).toBe("Mia sees Mia’s teammate and Mia's goal."));
  it('updates the field actor, prompt, narration, and feedback',()=>{const scene=personalizeScenario(animatedScenarios[0],'Leo');expect(scene.actors.find((actor)=>actor.id==='nolan')?.name).toBe('Leo');expect([scene.prompt,scene.introNarration,...scene.results.flatMap((result)=>[result.narration,result.explanation,result.teamEffect])].join(' ')).not.toContain('Nolan')});
});
