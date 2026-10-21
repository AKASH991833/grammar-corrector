/* 40+ explainable grammar/punctuation/style rules. Each rule: {type, msg, apply} */
const GRAMMAR_RULES=[
 // repeated word
 {type:'grammar',re:/\b([A-Za-z]+)\s+\1\b/gi,msg:m=>`"${m[1]}" is repeated.`,fix:m=>m[1]},
 // a/an
 {type:'grammar',re:/\ba\s+([aeiouAEIOU])/g,msg:()=>`Use "an" before a vowel sound.`,fix:m=>'an '+m[1]},
 {type:'grammar',re:/\ban\s+([bcdfgjklmnpqrstvwxyzBCDFGJKLMNPQRSTVWXYZ])/g,msg:()=>`Use "a" before a consonant sound.`,fix:m=>'a '+m[1]},
 // i -> I
 {type:'capitalization',re:/\bi\b/g,msg:()=>`The pronoun "I" is always capitalized.`,fix:()=>'I'},
 // could/should/would of
 {type:'grammar',re:/\b(could|should|would|might|must)\s+of\b/gi,msg:m=>`"${m[1]} of" should be "${m[1]} have" (or "${m[1]}'ve").`,fix:m=>m[1]+' have'},
 // subject-verb basics
 {type:'grammar',re:/\b(he|she|it)\s+don't\b/gi,msg:m=>`With "${m[1]}", use "doesn't".`,fix:m=>m[1]+" doesn't"},
 {type:'grammar',re:/\b(he|she|it)\s+have\b/gi,msg:m=>`With "${m[1]}", use "has".`,fix:m=>m[1]+' has'},
 {type:'grammar',re:/\b(they|we|you)\s+was\b/gi,msg:m=>`With "${m[1]}", use "were".`,fix:m=>m[1]+' were'},
 {type:'grammar',re:/\b(he|she|it)\s+goes\s+not\b/gi,msg:()=>`Use "does not go".`,fix:m=>m[1]+' does not go'},
 {type:'grammar',re:/\bI\s+is\b/gi,msg:()=>`With "I", use "am".`,fix:()=>'I am'},
 {type:'grammar',re:/\b(he|she|it)\s+are\b/gi,msg:m=>`With "${m[1]}", use "is".`,fix:m=>m[1]+' is'},
 {type:'grammar',re:/\b(they|we|you)\s+is\b/gi,msg:m=>`With "${m[1]}", use "are".`,fix:m=>m[1]+' are'},
 {type:'grammar',re:/\b(he|she|it)\s+(go|do|have|say|make|take|come|run|play|eat|work|live|like|want|need|watch|teach|study|try|fly|carry|cry|buy)\b(?!\s*[-'])/gi,msg:m=>{const v3={go:'goes',do:'does',have:'has',say:'says',make:'makes',take:'takes',come:'comes',run:'runs',play:'plays',eat:'eats',work:'works',live:'lives',like:'likes',want:'wants',need:'needs',watch:'watches',teach:'teaches',study:'studies',try:'tries',fly:'flies',carry:'carries',cry:'cries',buy:'buys'};return `With "${m[1]}", the verb takes an -s: "${v3[m[2].toLowerCase()]}".`},fix:m=>{const v3={go:'goes',do:'does',have:'has',say:'says',make:'makes',take:'takes',come:'comes',run:'runs',play:'plays',eat:'eats',work:'works',live:'lives',like:'likes',want:'wants',need:'needs',watch:'watches',teach:'teaches',study:'studies',try:'tries',fly:'flies',carry:'carries',cry:'cries',buy:'buys'};return m[1]+' '+v3[m[2].toLowerCase()]}},
 // me and X
 {type:'grammar',re:/\bme and ([A-Za-z]+)\s+(go|went|are|were|have|had|will|started|decided)/gi,msg:m=>`As the subject, use "${m[1]} and I" instead of "me and ${m[1]}".`,fix:m=>m[1]+' and I '+m[2]},
 // object pronoun as subject: "Him and I went" -> "He and I went"
 {type:'grammar',re:/\b(me|him|her|us|them)\s+and\s+(i|he|she|they|we|[A-Za-z]+)(?=\s+(go|goes|went|walk|walks|eat|eats|run|runs|play|plays|work|works|come|comes|is|are|was|were|have|has|will|said|decided|started|want|wants|like|likes|need|needs)\b)/gi,msg:m=>{const subj={me:'I',him:'he',her:'she',us:'we',them:'they'};return `"${m[1]}" is an object pronoun; as the subject, use "${subj[m[1].toLowerCase()]}".`},fix:m=>{const subj={me:'I',him:'he',her:'she',us:'we',them:'they'};let a=subj[m[1].toLowerCase()];a=/^[A-Z]/.test(m[0])?a[0].toUpperCase()+a.slice(1):a;let b=m[2].toLowerCase()==='i'?'I':m[2];return a+' and '+b}},
 // compound subject takes plural verb: "Ravi and I goes" -> "Ravi and I go"
 {type:'grammar',re:/\band\s+(i|we|they)\s+(goes|does|has|is|was|wants|needs|likes|makes|takes|comes|runs|plays|eats|works|lives|says)\b/gi,msg:m=>{const pl={goes:'go',does:'do',has:'have',is:'are',was:'were',wants:'want',needs:'need',likes:'like',makes:'make',takes:'take',comes:'come',runs:'run',plays:'play',eats:'eat',works:'work',lives:'live',says:'say'};return `A compound subject ("... and ${m[1]}") is plural; use "${pl[m[2].toLowerCase()]}" instead of "${m[2]}".`},fix:m=>{const pl={goes:'go',does:'do',has:'have',is:'are',was:'were',wants:'want',needs:'need',likes:'like',makes:'make',takes:'take',comes:'come',runs:'run',plays:'play',eats:'eat',works:'work',lives:'live',says:'say'};return m[0].replace(new RegExp(m[2]+'$'),pl[m[2].toLowerCase()])}},
 // much/many
 {type:'grammar',re:/\bmuch\s+(people|things|books|students|friends|cars|days|times|questions|problems|vegetables|fruits|items|messages|emails)\b/gi,msg:m=>`"${m[1]}" is countable; use "many".`,fix:m=>'many '+m[1]},
 {type:'grammar',re:/\bmuch\s+(vegetable|person|book|student|friend|car|day|time|question|problem|item|message|email|thing|chair|table|phone|computer|house|shop|market|movie|song|game|child|man|woman|boy|girl)\b/gi,msg:m=>`"${m[1]}" is countable; use "many" + plural.`,fix:m=>{const pl={person:'people',child:'children',man:'men',woman:'women'};const w=m[1].toLowerCase();return 'many '+(pl[w]||(w+'s'))}},
 // less/fewer
 {type:'grammar',re:/\bless\s+(people|things|books|students|friends|cars|days|times|questions|problems|items|messages|emails)\b/gi,msg:m=>`For countable "${m[1]}", use "fewer".`,fix:m=>'fewer '+m[1]},
 // then/than
 {type:'grammar',re:/\b(better|worse|bigger|smaller|faster|slower|more|less|higher|lower|older|younger|easier|harder|larger|greater)\s+then\b/gi,msg:m=>`After the comparison "${m[1]}", use "than".`,fix:m=>m[1]+' than'},
 // double comparative
 {type:'grammar',re:/\bmore\s+(better|worse|bigger|smaller|faster|easier|harder)\b/gi,msg:m=>`"${m[1]}" is already comparative; drop "more".`,fix:m=>m[1]},
 {type:'grammar',re:/\bmost\s+(best|worst|biggest|fastest|easiest)\b/gi,msg:m=>`"${m[1]}" is already superlative; drop "most".`,fix:m=>m[1]},
 // its/it's quick heuristic: it's + noun (not verb/adj) -> its
 {type:'grammar',re:/\bit's\s+(a|an|the|own|color|colour|name|time|place|size|value|price|purpose|main|best|only)\b/gi,msg:()=>`Possession uses "its" (no apostrophe). "It's" means "it is".`,fix:m=>m[0].replace(/it's/i,'its')},
 // double space
 {type:'punctuation',re:/[ ]{2,}/g,msg:()=>`Double space.`,fix:()=>' '},
 // space before punctuation
 {type:'punctuation',re:/\s+([,.!?;:%])/g,msg:m=>`No space before "${m[1]}".`,fix:m=>m[1]},
 // missing space after comma/semicolon/colon
 {type:'punctuation',re:/([,;:])([A-Za-z])/g,msg:m=>`Add a space after "${m[1]}".`,fix:m=>m[1]+' '+m[2]},
 // repeated punctuation
 {type:'punctuation',re:/([,.!?]){3,}/g,msg:m=>`Repeated punctuation "${m[0]}" - one is enough (or use a single ellipsis "…").`,fix:m=>m[0][0]==='!'?'!':'.'},
 // very + absolute
 {type:'style',re:/\bvery\s+(unique|perfect|final|dead|empty|full|complete|absolute|impossible|universal)\b/gi,msg:m=>`"${m[1]}" is absolute; it can't be "very". Drop "very".`,fix:m=>m[1]},
 // intensifier stacking
 {type:'style',re:/\b(very|really)\s+\1\b/gi,msg:m=>`"${m[0]}" weakens your point; one strong word works better.`,fix:m=>m[1]},
 // in order to
 {type:'style',re:/\bin order to\b/gi,msg:()=>`"in order to" can usually be just "to".`,fix:()=>'to'},
 // due to the fact that
 {type:'style',re:/\bdue to the fact that\b/gi,msg:()=>`Wordy; "because" is cleaner.`,fix:()=>'because'},
 // alot
 {type:'grammar',re:/\balot\b/gi,msg:()=>`"a lot" is always two words.`,fix:()=>'a lot'},
 // gonna/wanna (style)
 {type:'style',re:/\bgonna\b/gi,msg:()=>`Informal; in careful writing use "going to".`,fix:()=>'going to'},
 {type:'style',re:/\bwanna\b/gi,msg:()=>`Informal; in careful writing use "want to".`,fix:()=>'want to'},
 // days & months capitalized
 {type:'capitalization',re:/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|may|june|july|august|september|october|november|december)\b/g,msg:m=>`"${m[1]}" is a proper noun; capitalize it.`,fix:m=>m[1][0].toUpperCase()+m[1].slice(1)},
 // its -> it's in common patterns
 {type:'grammar',re:/\bits\s+(off|not|time|raining|cold|hot|late|early|clear|obvious|true)\b/gi,msg:()=>`Here you mean "it is", so use "it's".`,fix:m=>"it's "+m[1]},
];
function findIssues(text){
  const issues=[];
  GRAMMAR_RULES.forEach((rule,ri)=>{
    let m;const re=new RegExp(rule.re.source,rule.re.flags.includes('g')?rule.re.flags:rule.re.flags+'g');
    while((m=re.exec(text))){
      issues.push({ri,start:m.index,end:m.index+m[0].length,orig:m[0],type:rule.type,msg:rule.msg(m),fix:rule.fix(m)});
    }
  });
  // capitalization after sentence end
  const capRe=/(^|[.!?]\s+|\n+)([a-z])/g;let c;
  while((c=capRe.exec(text))){
    issues.push({ri:-1,start:c.index+c[1].length,end:c.index+c[1].length+1,orig:c[2],type:'capitalization',msg:'Sentences start with a capital letter.',fix:c[2].toUpperCase()});
  }
  // missing terminal punctuation on final non-empty line
  const trimmed=text.replace(/\s+$/,'');
  if(trimmed.length>20&&!/[.!?"'…)]$/.test(trimmed)){
    issues.push({ri:-2,start:trimmed.length,end:trimmed.length,orig:'',type:'punctuation',msg:'The text ends without punctuation.',fix:'.'});
  }
  issues.sort((a,b)=>a.start-b.start);
  return issues;
}
function applyIssue(text,issue){
  return text.slice(0,issue.start)+issue.fix+text.slice(issue.end);
}
