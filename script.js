let chars = [];
let tempSkills = {};
let points = 200;

const skills = [
 "Luta Corpo a Corpo","Armas Brancas","Armas de Fogo","Esquiva",
 "Percepção","Investigação","Ocultismo","Intuição",
 "Atletismo","Furtividade","Resistência","Acrobacia",
 "Conhecimento","Diplomacia",
 "Persuasão","Enganação","Intimidação","Empatia"
];

function enterApp() {
  show("menu");
}

function show(id) {
  document.querySelectorAll(".screen").forEach(s=>s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function go(id){ show(id); }

function goSkills() {
  tempSkills = {};
  points = 200 - skills.length * 20;
  document.getElementById("points").innerText = points;

  const div = document.getElementById("skills");
  div.innerHTML = "";

  skills.forEach(s=>{
    tempSkills[s] = 20;
    const d = document.createElement("div");
    d.className="skill";
    d.innerHTML = `
      <span>${s}</span>
      <input type="number" value="20" min="0"
        onchange="changeSkill('${s}', this)">
    `;
    div.appendChild(d);
  });

  show("skillsScreen");
}

function changeSkill(s, el) {
  const v = parseInt(el.value);
  const diff = v - tempSkills[s];
  if (points - diff < 0) {
    el.value = tempSkills[s];
    return;
  }
  tempSkills[s] = v;
  points -= diff;
  document.getElementById("points").innerText = points;
}

function finish() {
  chars.push({
    name: charName.value,
    skills: {...tempSkills},
    vida: 15, san: 15, inc: 0,
    aura: null, race: null
  });
  renderChars();
  renderDiceChars();
  show("menu");
}

function renderChars() {
  const l = document.getElementById("charList");
  l.innerHTML="";
  chars.forEach((c,i)=>{
    const d=document.createElement("div");
    d.innerHTML=`
      <b>${c.name}</b><br>
      Vida: ${c.vida} | San: ${c.san} | Inc: ${c.inc}<br>
      ${c.race ? "Raça: "+c.race+" | Aura: "+c.aura :
      `<button onclick="awakening(${i})">Despertar</button>`}
    `;
    l.appendChild(d);
  });
}

function awakening(i) {
  const r = Math.floor(Math.random()*100)+1;
  let race, aura = Math.floor(Math.random()*51)+50;
  if (r === 1) race="Nephilim";
  else if (r <= 10) race="Vigilante";
  else race="Aureado";

  chars[i].race=race;
  chars[i].aura=aura;
  renderChars();
}

function renderDiceChars() {
  const s=document.getElementById("diceChar");
  s.innerHTML="";
  chars.forEach((c,i)=>{
    const o=document.createElement("option");
    o.value=i; o.textContent=c.name;
    s.appendChild(o);
  });
}

function renderDice() {
  const i=diceChar.value;
  const d=document.getElementById("diceSkills");
  d.innerHTML="";
  Object.keys(chars[i].skills).forEach(s=>{
    const b=document.createElement("button");
    b.textContent=s;
    b.onclick=()=>roll(i,s);
    d.appendChild(b);
  });
}

function roll(i,s) {
  const val=chars[i].skills[s];
  const r=Math.floor(Math.random()*100)+1;
  let res="Fracasso";
  if (r<=val) res="Sucesso";
  document.getElementById("dice").innerText="🎲";
  document.getElementById("diceResult").innerText =
    `${s}: ${r}/${val} → ${res}`;
}
