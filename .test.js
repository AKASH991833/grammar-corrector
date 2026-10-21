module.exports.run = async (page, base, shot) => {
  const out=[];
  await page.evaluate(()=>document.querySelector('#sampleBtn').click());
  await new Promise(r=>setTimeout(r,400));
  out.push(['issues found', await page.evaluate(()=>document.querySelector('#issueCount').textContent)]);
  const msgs=await page.evaluate(()=>[...document.querySelectorAll('.issue .msg, .issue .head span:last-child')].map(e=>e.textContent).slice(0,12));
  msgs.forEach(m=>out.push(['rule',m.slice(0,80)]));
  await page.evaluate(()=>document.querySelector('#fixAllBtn').click());
  await new Promise(r=>setTimeout(r,400));
  out.push(['after fix-all', await page.evaluate(()=>document.querySelector('#input').value)]);
  out.push(['remaining', await page.evaluate(()=>document.querySelector('#issueCount').textContent)]);
  out.push(['score', await page.evaluate(()=>document.querySelector('#scoreNum').textContent)]);
  // feedback cases (Akash): must be caught
  const fb=await page.evaluate(()=>{
    document.querySelector('#input').value='Him and I goes to school. he go daily. we buy much vegetable.';
    document.querySelector('#input').dispatchEvent(new Event('input'));
    return true;
  });
  await new Promise(r=>setTimeout(r,900));
  const msgs2=await page.evaluate(()=>[...document.querySelectorAll('.issue')].map(e=>e.textContent));
  const joined=msgs2.join(' | ');
  out.push(['feedback issues', msgs2.length]);
  if(!/object pronoun/.test(joined)) throw new Error('Him-and-I subject case not caught');
  if(!/plural/.test(joined)) throw new Error('compound-subject plural not caught');
  if(!/takes an -s/.test(joined)) throw new Error('he go not caught');
  if(!/countable/.test(joined)) throw new Error('much vegetable not caught');
  await page.screenshot({path:shot});
  return out;
};
