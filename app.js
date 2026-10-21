/* Grammar Coach UI */
(function(){
'use strict';
let issues=[];
const TYPE_ICON={grammar:'Grammar',punctuation:'Punctuation',style:'Style',capitalization:'Capitalization'};
function check(){
  const text=$('#input').value;
  if(!text.trim()){toast('Write something first');return}
  issues=findIssues(text);
  render();
}
function render(){
  const box=$('#issues');box.innerHTML='';
  $('#issueCount').textContent=issues.length?`${issues.length} suggestion${issues.length>1?'s':''} found`:'No issues found. Clean writing!';
  const words=$('#input').value.trim().split(/\s+/).filter(Boolean).length;
  const score=Math.max(30,Math.round(100-issues.length*120/Math.max(20,words)));
  const off=232-232*score/100;
  $('#scoreArc').style.strokeDashoffset=off;
  $('#scoreArc').style.stroke=score>85?'var(--ok)':score>65?'var(--warn)':'var(--bad)';
  $('#scoreNum').textContent=score;
  $('#scoreHint').textContent=issues.length?`${issues.length} issue${issues.length>1?'s':''} across ${words} words. Fix them to raise the score.`:`${words} words, nothing flagged.`;
  issues.forEach((it,i)=>{
    const d=document.createElement('div');d.className='issue '+it.type;
    d.innerHTML=`<div class="head"><span class="type">${TYPE_ICON[it.type]||it.type}</span><span>${esc(it.msg)}</span></div>
      <div>${it.orig?`<span class="orig">${esc(it.orig)}</span> → `:''}<span class="fix">${esc(it.fix)||'(add) .'}</span></div>
      <div class="btn-row"><button class="btn btn-soft" style="padding:6px 12px;font-size:.8rem" data-a="apply">Apply fix</button>
      <button class="btn btn-ghost" style="padding:6px 12px;font-size:.8rem" data-a="dismiss">Dismiss</button></div>`;
    d.querySelector('[data-a=apply]').addEventListener('click',()=>{
      const text=$('#input').value;
      const cur=findIssues(text);
      const match=cur.find(x=>x.start===it.start&&x.orig===it.orig);
      if(!match){toast('Text changed; re-checking');check();return}
      $('#input').value=applyIssue(text,match);
      check();
    });
    d.querySelector('[data-a=dismiss]').addEventListener('click',()=>{issues.splice(i,1);render()});
    box.appendChild(d);
  });
}
$('#checkBtn').addEventListener('click',check);
$('#fixAllBtn').addEventListener('click',()=>{
  let text=$('#input').value;let applied=0;
  for(let guard=0;guard<8;guard++){
    const cur=findIssues(text);
    if(!cur.length)break;
    // apply last-to-first so positions stay valid; skip overlaps
    const taken=[];
    for(let i=cur.length-1;i>=0;i--){
      const it=cur[i];
      if(taken.some(([s,e])=>!(it.end<=s||it.start>=e)))continue;
      text=applyIssue(text,it);applied++;taken.push([it.start,it.end]);
    }
  }
  $('#input').value=text;toast(applied?`Applied ${applied} fixes`:'Nothing to fix');check();
});
$('#sampleBtn').addEventListener('click',()=>{
  $('#input').value="me and him goes to the market every sunday. we buy much vegetable their and its usually very crowded. i could of stayed home but the weather was more better then yesterday. prices are less then last month due to the fact that its off season";
  check();
});
$('#copyBtn').addEventListener('click',()=>{const t=$('#input').value;if(t)navigator.clipboard.writeText(t).then(()=>toast('Copied'))});
let deb;$('#input').addEventListener('input',()=>{clearTimeout(deb);deb=setTimeout(check,600)});
})();
