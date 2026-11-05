(function(root){
const round=n=>Math.round((Number(n)+Number.EPSILON)*100)/100;
const paid=o=>round((o.payments||[]).reduce((s,p)=>s+p.amount,0));
const balance=o=>o.cost===null?null:round(o.cost-paid(o));
const total=(labor,items)=>round(Number(labor)+(items||[]).reduce((s,p)=>s+p.unitPrice*p.qty,0));
function stockPlan(stock,previous,next){const counts=a=>a.reduce((s,p)=>(s[p.id]=(s[p.id]||0)+p.qty,s),{}),old=counts(previous),fresh=counts(next);return stock.map(p=>{const qty=p.qty+(old[p.id]||0)-(fresh[p.id]||0);if(qty<0)throw Error(p.name+' — ammarda ýeterlik şaý ýok.');return {...p,qty};});}
const overdue=(o,today)=>!!o.due&&o.due<today&&o.stage!==3;
const api={round,paid,balance,total,stockPlan,overdue};if(typeof module!=='undefined')module.exports=api;else root.RepairMath=api;
})(globalThis);
