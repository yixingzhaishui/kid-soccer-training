import { animatedScenarios,scenePacks } from '../lessons';
import { cleanChildName,displayChildName,personalizeText } from '../logic/personalize';
import { resetProgress,totalScore } from '../logic/progress';
import type { Progress,Settings } from '../types/soccer';

type Props={progress:Progress;settings:Settings;onSettings:(settings:Settings)=>void;onProgress:(progress:Progress)=>void;onClose:()=>void};

export function ParentModeScreen({progress,settings,onSettings,onProgress,onClose}:Props){
  const complete=Object.values(progress.sceneResults).filter((item)=>item.completed).length;
  const score=totalScore(progress),best=Object.values(progress.sceneResults).reduce((sum,item)=>sum+item.best,0),poor=Object.values(progress.sceneResults).reduce((sum,item)=>sum+item.poor,0);
  const last=animatedScenarios.find((scene)=>scene.id===progress.lastSceneId),name=displayChildName(settings.childName),text=(value:string)=>personalizeText(value,name);
  return <main className="screen parent-screen">
    <header className="screen-header"><button className="icon-button" onClick={onClose}>‹</button><div><p className="eyebrow">GROWN-UP VIEW</p><h1>Parent notes</h1></div><div/></header>
    <div className="parent-summary"><article><strong>{score}/750</strong><span>strategy points</span></article><article><strong>{complete}</strong><span>stories played</span></article><article><strong>{best}</strong><span>best choices</span></article><article><strong>{poor}</strong><span>learning tries</span></article></div>
    <section className="parent-panel"><h2>Progress by story pack</h2>{scenePacks.map((pack)=>{const done=pack.scenes.filter((scene)=>progress.sceneResults[scene.id]?.completed).length;const packScore=pack.scenes.reduce((sum,scene)=>sum+(progress.sceneResults[scene.id]?.score??0),0);return <div className="parent-pack" key={pack.id}><span>{pack.icon} <strong>{pack.name}</strong><small>{done}/{pack.scenes.length} · ⭐ {packScore}</small></span><progress value={done} max={pack.scenes.length}/></div>})}</section>
    <section className="parent-panel"><h2>Latest coaching idea</h2>{last?<><h3>{last.title}</h3><p><strong>Skill:</strong> {last.skillId}</p><p><strong>Visible cue:</strong> {text(last.visibleCue)}</p><p><strong>{name}'s duty:</strong> {text(last.playerDuty)}</p><p>{text(last.results.find((item)=>item.choiceId===progress.sceneResults[last.id]?.lastChoiceId)?.explanation??'')}</p></>:<p>Play a story to see coaching notes.</p>}</section>
    <section className="parent-panel"><h2>Settings</h2><label className="name-setting"><span><strong>Player name</strong><small>Used on the field and in spoken coaching</small></span><input aria-label="Player name in parent settings" value={settings.childName} maxLength={20} onChange={(event)=>onSettings({...settings,childName:cleanChildName(event.target.value)})} onBlur={()=>onSettings({...settings,childName:name})}/></label><label className="toggle-row"><span><strong>Spoken coaching</strong><small>Use the browser’s child-friendly voice</small></span><input type="checkbox" checked={settings.speechEnabled} onChange={(event)=>onSettings({...settings,speechEnabled:event.target.checked})}/></label><label className="toggle-row"><span><strong>Reduce movement</strong><small>Use shorter, gentler animations</small></span><input type="checkbox" checked={settings.reducedMotion} onChange={(event)=>onSettings({...settings,reducedMotion:event.target.checked})}/></label></section>
    <section className="parent-panel danger-panel"><h2>Start over</h2><button className="danger-button" onClick={()=>onProgress(resetProgress())}>Reset all story progress</button></section>
  </main>;
}
