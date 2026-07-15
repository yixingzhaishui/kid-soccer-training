import {it} from 'vitest';
import {animatedScenarios} from '../src/lessons';
import {scoreCurriculum} from '../src/logic/scenarioQuality';

it('reports the honest hard-gate audit',()=>{
  const audits=scoreCurriculum(animatedScenarios);
  const byCode=audits.flatMap((audit)=>audit.hardFailures).reduce<Record<string,number>>((counts,failure)=>({...counts,[failure.code]:(counts[failure.code]??0)+1}),{});
  console.info(JSON.stringify({failedCases:audits.filter((audit)=>audit.hardFailures.length).length,totalFailures:Object.values(byCode).reduce((sum,count)=>sum+count,0),byCode,examples:audits.filter((audit)=>audit.hardFailures.length).map((audit)=>({id:audit.sceneId,failures:audit.hardFailures.map((failure)=>`${failure.code}: ${failure.message}`)}))},null,2));
});
