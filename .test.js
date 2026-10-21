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
  await page.screenshot({path:shot});
  return out;
};
