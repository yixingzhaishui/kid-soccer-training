import type { AnimatedActor,AnimatedChoice,ChoiceResult,Point } from '../types/soccer';

type Props={choice:AnimatedChoice;result:ChoiceResult;nolan:AnimatedActor;actors:AnimatedActor[];ballStart:Point;onClick:()=>void;disabled?:boolean};
const ballActions=new Set(['pass','cross','shoot','clear']);
const distance=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.y-b.y);

export function ChoiceCard({choice,result,nolan,actors,ballStart,onClick,disabled}:Props){
  const playerMove=result.animationSteps.find((item)=>item.actorId==='nolan'&&item.to);
  const ballMove=result.animationSteps.find((item)=>ballActions.has(item.action)&&item.to);
  const from=ballMove?.from??(ballMove?actors.find((actor)=>actor.id===ballMove.actorId)?.start:undefined)??playerMove?.from??ballStart??nolan.start;
  const to=ballMove?.to??playerMove?.to??nolan.start;
  const isBall=Boolean(ballMove),pathColor=isBall?'#ffe45a':'#9ee7ff',markerId=`choice-arrow-${choice.id}`;
  const nearby=actors.filter((actor)=>actor.id!=='nolan').sort((a,b)=>distance(a.start,nolan.start)-distance(b.start,nolan.start));
  const shown=[...nearby.filter((actor)=>actor.team==='blue').slice(0,2),...nearby.filter((actor)=>actor.team==='red').slice(0,3)];
  return <button className="choice-card" onClick={onClick} disabled={disabled} aria-label={choice.label}>
    <svg className="choice-preview" viewBox="0 0 100 64" aria-hidden="true" data-testid={`choice-trajectory-${choice.id}`}>
      <defs><marker id={markerId} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L8 4L0 8Z" fill={pathColor}/></marker></defs>
      <rect width="100" height="64" rx="7" fill="#258c50"/><path d="M3 4H97V60H3ZM50 4V60M42 32a8 8 0 1 0 16 0 8 8 0 1 0-16 0" fill="none" stroke="#ffffff99" strokeWidth="1"/>
      {shown.map((actor)=><g key={actor.id} className={`preview-person ${actor.team}`} transform={`translate(${actor.start.x} ${actor.start.y})`}><circle cy="-2.3" r="2"/><path d="M0 0v5M-2 2l2 1 2-1M0 5l-2 3M0 5l2 3"/><text x="0" y="3" textAnchor="middle">{actor.jerseyNumber}</text></g>)}
      <g className="preview-person blue active" transform={`translate(${nolan.start.x} ${nolan.start.y})`}><circle cy="-2.5" r="2.4"/><path d="M0 0v6M-2.5 2l2.5 1 2.5-1M0 6l-2.2 3.4M0 6l2.2 3.4"/></g>
      <path className={`choice-trajectory ${isBall?'ball-path':'run-path'}`} d={`M${from.x} ${from.y} L${to.x} ${to.y}`} stroke={pathColor} markerEnd={`url(#${markerId})`}/>
      <circle className="choice-destination" cx={to.x} cy={to.y} r="4.5"/>
      {isBall?<g className="preview-ball"><circle cy="0" r="2.8" fill="white" stroke="#17232c" strokeWidth="1"><animate attributeName="cx" values={`${from.x};${to.x};${from.x}`} dur="2s" repeatCount="indefinite"/><animate attributeName="cy" values={`${from.y};${to.y};${from.y}`} dur="2s" repeatCount="indefinite"/></circle></g>:<circle className="preview-runner" r="3" fill="#ffe45a"><animate attributeName="cx" values={`${from.x};${to.x};${from.x}`} dur="2s" repeatCount="indefinite"/><animate attributeName="cy" values={`${from.y};${to.y};${from.y}`} dur="2s" repeatCount="indefinite"/></circle>}
      <g className="preview-key"><rect x="4" y="5" width={isBall?27:29} height="9" rx="4.5"/><text x={isBall?17.5:18.5} y="11.5" textAnchor="middle">{isBall?'BALL PATH':'PLAYER RUN'}</text></g>
    </svg>
    <span className="choice-icon">{choice.icon}</span><strong>{choice.label}</strong><small>{isBall?'Follow the yellow ball arrow':'Follow the blue run arrow'}</small>
  </button>;
}
