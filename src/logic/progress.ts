import type { ChoiceResult,Progress,SceneProgress } from '../types/soccer';
export const PROGRESS_KEY='nolan-animation-progress-v1';
export const emptyProgress=():Progress=>({sceneResults:{}});
export function loadProgress(storage:Pick<Storage,'getItem'>=localStorage):Progress{try{const raw=storage.getItem(PROGRESS_KEY);if(!raw)return emptyProgress();const value=JSON.parse(raw) as Partial<Progress>;return{sceneResults:value.sceneResults??{},lastSceneId:value.lastSceneId}}catch{return emptyProgress()}}
export const saveProgress=(progress:Progress,storage:Pick<Storage,'setItem'>=localStorage)=>storage.setItem(PROGRESS_KEY,JSON.stringify(progress));
export function resetProgress(storage:Pick<Storage,'removeItem'>=localStorage){storage.removeItem(PROGRESS_KEY);return emptyProgress()}
export function recordResult(progress:Progress,sceneId:string,result:ChoiceResult):Progress{const old:SceneProgress=progress.sceneResults[sceneId]??{completed:false,plays:0,best:0,good:0,poor:0};return{lastSceneId:sceneId,sceneResults:{...progress.sceneResults,[sceneId]:{...old,completed:true,plays:old.plays+1,best:old.best+(result.quality==='best'?1:0),good:old.good+(result.quality==='good'?1:0),poor:old.poor+(result.quality==='poor'?1:0),lastChoiceId:result.choiceId}}}}
