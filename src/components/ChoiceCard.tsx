import type { AnimatedActor,AnimatedChoice } from '../types/soccer';
import { initialFrame } from '../logic/timeline';
import { CartoonPlayer } from './CartoonPlayer';

type Props={choice:AnimatedChoice;nolan:AnimatedActor;onClick:()=>void;disabled?:boolean};
export function ChoiceCard({choice,nolan,onClick,disabled}:Props){const move=choice.previewAnimation.find((item)=>item.actorId==='nolan');const from=move?.from??nolan.start,to=move?.to??nolan.start;const frame=initialFrame([nolan],from).actors.nolan;return <button className="choice-card" onClick={onClick} disabled={disabled} aria-label={choice.label}>
  <svg className="choice-preview" viewBox="0 0 42 25" aria-hidden="true"><rect width="42" height="25" rx="5" fill="#35a45c"/><path d="M21 0V25" stroke="rgba(255,255,255,.45)" strokeWidth=".5"/><g className="preview-player" style={{'--from-x':`${from.x/2.5}px`,'--from-y':`${from.y/2.6}px`,'--to-x':`${to.x/2.5}px`,'--to-y':`${to.y/2.6}px`} as React.CSSProperties}><CartoonPlayer actor={{...nolan,start:{x:0,y:0}}} frame={{...frame,position:{x:0,y:0},action:move?.action??'run'}} mini/></g></svg>
  <span className="choice-icon">{choice.icon}</span><strong>{choice.label}</strong>
  </button>}
