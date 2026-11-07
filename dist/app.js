const expr=document.getElementById('expr'),result=document.getElementById('result');let shift=false,degree=true,ans=0,memory=0,done=false;
const rows=[['x⁻¹','^(-1)','x!','!'],['nCr',' nCr ','',''],['π','pi','e','e'],['√','sqrt(','∛','cbrt('],['x²','^2','x³','^3'],['^','^','10ˣ','10^'],['a b/c','/','',''],['log','log(','10ˣ','10^'],['ln','ln(','eˣ','exp('],['sin','sin(','sin⁻¹','asin('],['cos','cos(','cos⁻¹','acos('],['tan','tan(','tan⁻¹','atan('],['(−)','-','abs','abs('],['° ′ ″','dms','',''],['hyp','hyp','',''],['(', '(', '', ''],[')',')','',''],['M+','mplus','M−','mminus'],['RCL','recall','MC','mclear'],['ENG','eng','',''],['%','%','',''],['Ans','Ans','',''],['x!','!','',''],['EXP','e','','']];let hyper=false;
function make(parent,label,value,alt='',av='',cls=''){let box=document.createElement('div');box.className='key';let small=document.createElement('small');small.textContent=alt;let b=document.createElement('button');b.textContent=label;b.className=cls;b.title=alt?label+' · SHIFT: '+alt:label;b.onclick=()=>{let v=shift&&av?av:value;shift=false;action(v);render()};box.append(small,b);parent.append(box)}
rows.forEach(r=>make(document.getElementById('science'),...r));['7','8','9','DEL','AC','4','5','6','×','÷','1','2','3','+','−','0','.','EXP','Ans','='].forEach(v=>make(document.getElementById('numbers'),v,({'DEL':'del','AC':'clear','×':'*','÷':'/','−':'-','EXP':'e'})[v]||v,'','',v==='DEL'||v==='AC'?'red':''));
function render(){document.getElementById('mode').textContent=degree?'DEG':'RAD';document.getElementById('flags').textContent=(shift?'SHIFT ':'')+(hyper?'HYP ':'')+(memory?'M':'')}
function evaluate(){try{ans=calculate(expr.value,degree,ans,memory);result.textContent=Number(ans.toPrecision(12)).toString();done=true;return true}catch(e){result.textContent=e.message;return false}}
// A keypad tap edits the expression without opening a phone's text keyboard.
let touchKeypad = false;
document.addEventListener('pointerdown', event => {
  touchKeypad = event.pointerType !== 'mouse' && Boolean(event.target.closest('.calc button'));
  if (touchKeypad && document.activeElement === expr) expr.blur();
}, true);

function positionCursor(start, end) {
  if (!touchKeypad) expr.focus();
  expr.setSelectionRange(start, end);
}

function insert(v){if(hyper&&/^(sin|cos|tan)\($/.test(v)){v=v.replace('(','h(');hyper=false}if(done&&!/^[+*/^!%]|^ nCr /.test(v)){expr.value=''}done=false;let a=expr.selectionStart,b=expr.selectionEnd;expr.value=expr.value.slice(0,a)+v+expr.value.slice(b);positionCursor(a+v.length,a+v.length)}
function action(v){if(v==='='){evaluate();return}if(v==='clear'){expr.value='';result.textContent='0';done=false}else if(v==='shift')shift=!shift;else if(v==='mode')degree=!degree;else if(v==='hyp')hyper=!hyper;else if(v==='store'){if(evaluate())memory=ans}else if(v==='mplus'||v==='mminus'){if(evaluate())memory+=(v==='mplus'?1:-1)*ans}else if(v==='mclear')memory=0;else if(v==='recall')insert('M');else if(v==='eng'){if(evaluate()){let e=ans===0?0:Math.floor(Math.log10(Math.abs(ans))/3)*3;result.textContent=Number((ans/10**e).toPrecision(9))+'e'+e}}else if(v==='dms'){if(evaluate()){let n=Math.abs(ans),d=Math.floor(n),m=Math.floor((n-d)*60),s=((n-d)*60-m)*60;result.textContent=(ans<0?'-':'')+d+'°'+m+'′'+Number(s.toFixed(3))+'″'}}else if(v==='del'){let a=expr.selectionStart,b=expr.selectionEnd;if(a===b)a=Math.max(0,a-1);expr.value=expr.value.slice(0,a)+expr.value.slice(b);positionCursor(a,a);done=false}else if(v==='left'||v==='right'){let p=Math.max(0,Math.min(expr.value.length,expr.selectionStart+(v==='left'?-1:1)));positionCursor(p,p);done=false}else insert(v);render()}
document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>action(b.dataset.action));
expr.addEventListener('input',()=>done=false);
function isEqualsKey(e){return e.key==='Enter'||e.key==='Return'||e.key==='='||e.code==='NumpadEnter'||e.code==='Enter'||e.keyCode===13}
window.addEventListener('keydown',e=>{
 touchKeypad = false;
 if(e.isComposing)return;
 if(isEqualsKey(e)){
  e.preventDefault();e.stopImmediatePropagation();
  if(!e.repeat){action('=');positionCursor(expr.value.length,expr.value.length)}
 }else if(e.key==='Escape'){e.preventDefault();action('clear')}
 else if(document.activeElement!==expr&&/^[0-9.+\-*/^()%!]$/.test(e.key)){e.preventDefault();insert(e.key)}
},true);
window.addEventListener('keyup',e=>{if(!e.isComposing&&isEqualsKey(e)){e.preventDefault();e.stopImmediatePropagation()}},true);
render();
