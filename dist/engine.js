function calculate(source,degree=true,ans=0,memory=0){
 const tokens=source.replace(/×/g,'*').replace(/÷/g,'/').replace(/π/g,'pi').match(/(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?|[A-Za-z]+|[^\s]/g)||[];let p=0;
 const fact=n=>{if(n<0||n>170||!Number.isInteger(n))throw Error('Fuera de dominio');let r=1;for(let i=2;i<=n;i++)r*=i;return r};
 const angle=degree?Math.PI/180:1;const f={sin:x=>Math.sin(x*angle),cos:x=>Math.cos(x*angle),tan:x=>{if(Math.abs(Math.cos(x*angle))<1e-14)throw Error('Fuera de dominio');return Math.tan(x*angle)},asin:x=>Math.asin(x)/angle,acos:x=>Math.acos(x)/angle,atan:x=>Math.atan(x)/angle,sinh:Math.sinh,cosh:Math.cosh,tanh:Math.tanh,log:Math.log10,ln:Math.log,sqrt:Math.sqrt,cbrt:Math.cbrt,abs:Math.abs,exp:Math.exp,fact};
 function atom(){let t=tokens[p++],v;if(t==='+'||t==='-')return(t==='-'?-1:1)*power();if(t==='('){v=sum();if(tokens[p++]!==')')throw Error('Falta )')}else if(t in f){if(tokens[p++]!=='(')throw Error('Usá paréntesis');v=sum();if(tokens[p++]!==')')throw Error('Falta )');v=f[t](v)}else if(t==='pi')v=Math.PI;else if(t==='e')v=Math.E;else if(t==='Ans')v=ans;else if(t==='M')v=memory;else if(t!==undefined&&/^\d|^\./.test(t))v=Number(t);else throw Error('Expresión incompleta');while(tokens[p]==='!'||tokens[p]==='%'){v=tokens[p++]==='!'?fact(v):v/100}return v}
 function power(){let v=atom();if(tokens[p]==='^'){p++;v=v**power()}return v}
 function product(){let v=power();while(tokens[p]==='*'||tokens[p]==='/'||tokens[p]==='nCr'){let op=tokens[p++],b=power();if(op==='/'){if(b===0)throw Error('División por cero');v/=b}else if(op==='nCr'){if(!Number.isInteger(v)||!Number.isInteger(b)||b<0||b>v)throw Error('Fuera de dominio');let r=1;for(let i=1;i<=Math.min(b,v-b);i++)r=r*(v-i+1)/i;v=r}else v*=b}return v}
 function sum(){let v=product();while(tokens[p]==='+'||tokens[p]==='-'){let op=tokens[p++],b=product();v=op==='+'?v+b:v-b}return v}
 if(!tokens.length)return 0;let v=sum();if(p!==tokens.length)throw Error('Revisá la expresión');if(!Number.isFinite(v))throw Error('Fuera de dominio');return v;
}
if(typeof module!=='undefined')module.exports=calculate;
