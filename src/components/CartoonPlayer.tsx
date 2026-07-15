import type { AnimatedActor } from '../types/soccer';
import type { ActorFrame } from '../logic/timeline';

type Props={actor:AnimatedActor;frame:ActorFrame;mini?:boolean};
const roleLabel=(role:string)=>role.split(/\s+/).map((word)=>word[0]).join('').slice(0,3).toUpperCase();
export function CartoonPlayer({actor,frame,mini=false}:Props){const blue=actor.team==='blue',supporting=actor.id.startsWith('support-'),active=actor.id==='nolan';const jersey=actor.goalkeeper?(blue?'#ffd447':'#c4f35a'):(blue?'#1874e8':'#e43e43');return <g className={`cartoon-player ${frame.action} ${frame.emotion??''} ${active?'is-nolan':''} ${supporting?'is-supporting':''}`} data-actor-id={actor.id} style={{transform:`translate(${frame.position.x}px, ${frame.position.y}px)`,transitionDuration:`${frame.duration}ms`}} aria-label={actor.name??`${actor.team} ${actor.role}`}>
  <g className="player-scale">
  <ellipse className="player-shadow" cx="0" cy="4.7" rx={mini?2.1:2.7} ry={mini?.65:.9}/>
  {active&&!mini&&<ellipse className="nolan-glow" cx="0" cy="0" rx="5.1" ry="7"/>}
  <g className="body-bob">
    <g className="back-arm"><path d="M-1.6 -1 L-3.4 1.8"/><circle cx="-3.5" cy="2" r=".55"/></g>
    <g className="back-leg"><path d="M-1 2.4 L-2.1 5.2"/><path className="shoe" d="M-2.1 5.2 L-3.4 5.2"/></g>
    <g className="front-leg"><path d="M1 2.4 L2.1 5.2"/><path className="shoe" d="M2.1 5.2 L3.4 5.2"/></g>
    <path className="shorts" d="M-2 1.5 Q0 2.8 2 1.5 L1.6 3.2 L0 2.7 L-1.6 3.2Z" fill={blue?'#0d3d8f':'#8d1717'}/>
    <path className="jersey" d="M-2.2 -2.2 Q0 -3.2 2.2 -2.2 L2 1.8 Q0 2.5 -2 1.8Z" fill={jersey}/>
    <text className="shirt-number" x="0" y=".6" textAnchor="middle">{actor.jerseyNumber}</text>
    <g className="front-arm"><path d="M1.6 -1 L3.4 1.8"/><circle cx="3.5" cy="2" r=".55"/></g>
    <circle className="head" cx="0" cy="-4" r="2"/>
    <path className="hair" d="M-1.8 -4.4 Q0 -6.1 1.8 -4.4 Q.6 -5 -1.8 -4.4Z"/>
    {!mini&&<><circle className="eye" cx="-.65" cy="-4" r=".18"/><circle className="eye" cx=".65" cy="-4" r=".18"/><path className="mouth" d={frame.emotion==='worried'?'M-.6 -3.15 Q0 -3.65 .6 -3.15':'M-.6 -3.4 Q0 -2.9 .6 -3.4'}/></>}
  </g>
  {active&&!mini&&<text className="player-name" x="0" y="-7.2" textAnchor="middle">{actor.name}</text>}
  {!mini&&<text className={`player-role ${actor.team}`} x="0" y="8.1" textAnchor="middle">{roleLabel(actor.role)}</text>}
  </g>
  </g>}
