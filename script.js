/* Quantum Atom Explorer — educational visualization, not a quantum-chemistry solver. */
(() => {
  "use strict";
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const elements = [
    ["H","Hydrogen",1,1,"1s¹","1s¹"],["He","Helium",2,4,"1s²","1s²"],
    ["Li","Lithium",3,7,"1s² 2s¹","[He] 2s¹"],["Be","Beryllium",4,9,"1s² 2s²","[He] 2s²"],
    ["B","Boron",5,11,"1s² 2s² 2p¹","[He] 2s² 2p¹"],["C","Carbon",6,12,"1s² 2s² 2p²","[He] 2s² 2p²"],
    ["N","Nitrogen",7,14,"1s² 2s² 2p³","[He] 2s² 2p³"],["O","Oxygen",8,16,"1s² 2s² 2p⁴","[He] 2s² 2p⁴"],
    ["F","Fluorine",9,19,"1s² 2s² 2p⁵","[He] 2s² 2p⁵"],["Ne","Neon",10,20,"1s² 2s² 2p⁶","[He] 2s² 2p⁶"],
    ["Na","Sodium",11,23,"1s² 2s² 2p⁶ 3s¹","[Ne] 3s¹"],["Mg","Magnesium",12,24,"1s² 2s² 2p⁶ 3s²","[Ne] 3s²"],
    ["Al","Aluminium",13,27,"1s² 2s² 2p⁶ 3s² 3p¹","[Ne] 3s² 3p¹"],["Si","Silicon",14,28,"1s² 2s² 2p⁶ 3s² 3p²","[Ne] 3s² 3p²"],
    ["P","Phosphorus",15,31,"1s² 2s² 2p⁶ 3s² 3p³","[Ne] 3s² 3p³"],["S","Sulfur",16,32,"1s² 2s² 2p⁶ 3s² 3p⁴","[Ne] 3s² 3p⁴"],
    ["Cl","Chlorine",17,35,"1s² 2s² 2p⁶ 3s² 3p⁵","[Ne] 3s² 3p⁵"],["Ar","Argon",18,40,"1s² 2s² 2p⁶ 3s² 3p⁶","[Ne] 3s² 3p⁶"],
    ["K","Potassium",19,39,"[Ar] 4s¹","[Ar] 4s¹"],["Ca","Calcium",20,40,"[Ar] 4s²","[Ar] 4s²"],
    ["Fe","Iron",26,56,"[Ar] 3d⁶ 4s²","[Ar] 3d⁶ 4s²"],["Cu","Copper",29,64,"[Ar] 3d¹⁰ 4s¹","[Ar] 3d¹⁰ 4s¹"],
    ["Zn","Zinc",30,65,"[Ar] 3d¹⁰ 4s²","[Ar] 3d¹⁰ 4s²"],["Br","Bromine",35,80,"[Ar] 3d¹⁰ 4s² 4p⁵","[Ar] 3d¹⁰ 4s² 4p⁵"],
    ["Ag","Silver",47,108,"[Kr] 4d¹⁰ 5s¹","[Kr] 4d¹⁰ 5s¹"],["Au","Gold",79,197,"[Xe] 4f¹⁴ 5d¹⁰ 6s¹","[Xe] 4f¹⁴ 5d¹⁰ 6s¹"],
    ["U","Uranium",92,238,"[Rn] 5f³ 6d¹ 7s²","[Rn] 5f³ 6d¹ 7s²"]
  ];
  const orbitals = {
    "1s": {name:"1s orbital",shape:"SPHERICAL",n:1,l:0,ml:"0",capacity:2,desc:"An s orbital is spherically symmetric. The 1s state is the lowest-energy orbital in hydrogen-like atoms."},
    "2s": {name:"2s orbital",shape:"SPHERICAL · RADIAL NODE",n:2,l:0,ml:"0",capacity:2,desc:"The 2s orbital is spherical and has one radial node: a region where its wavefunction is zero."},
    "2px":{name:"2pₓ orbital",shape:"DUMBBELL · X ORIENTATION",n:2,l:1,ml:"−1 / 0 / +1 (real-orbital basis)",capacity:2,desc:"A p orbital has two main lobes. The x label describes its orientation in this real-orbital visualization."},
    "2py":{name:"2pᵧ orbital",shape:"DUMBBELL · Y ORIENTATION",n:2,l:1,ml:"−1 / 0 / +1 (real-orbital basis)",capacity:2,desc:"The 2pᵧ orbital is oriented along the y axis. The three p orbitals are mutually perpendicular in this model."},
    "2pz":{name:"2p𝓏 orbital",shape:"DUMBBELL · Z ORIENTATION",n:2,l:1,ml:"−1 / 0 / +1 (real-orbital basis)",capacity:2,desc:"The 2p𝓏 orbital is oriented along the z axis and has a nodal plane through the nucleus."},
    "3s":{name:"3s orbital",shape:"SPHERICAL · RADIAL NODES",n:3,l:0,ml:"0",capacity:2,desc:"A 3s orbital is spherical and has two radial nodes in the hydrogen-like picture."},
    "3dxy":{name:"3dₓᵧ orbital",shape:"FOUR LOBES · BETWEEN X/Y AXES",n:3,l:2,ml:"real-orbital combination",capacity:2,desc:"The dₓᵧ orbital has four lobes between the x and y axes in the xy plane."},
    "3dz2":{name:"3d𝓏² orbital",shape:"TWO LOBES + TORUS",n:3,l:2,ml:"real-orbital combination",capacity:2,desc:"The d𝓏² orbital has two lobes along z and a torus-like region around the middle."}
  };
  const concepts = {
    shell:["Shell","A shell groups states with the same principal quantum number <strong>n</strong>. In this simplified model, shell n can hold up to 2n² electrons."],
    subshell:["Subshell","A subshell is identified by <strong>ℓ</strong>: s (ℓ=0), p (ℓ=1), d (ℓ=2), and f (ℓ=3). A subshell contains 2ℓ+1 orbitals."],
    orbital:["Orbital","An orbital is a quantum state described by a wavefunction. The cloud illustrates probability density, <strong>|ψ|²</strong>, not a path followed by an electron."],
    electron:["Electron","An electron has spin quantum number <strong>mₛ = +½ or −½</strong>. Two electrons can share one orbital only if their spins are opposite."]
  };
  const rules = {
    aufbau:{title:"Build from lower energy",text:"Electrons generally occupy available lower-energy states first. Real atoms have exceptions, so this is a useful rule—not a perfect universal shortcut.",items:["1s","2s","2p","3s"]},
    hund:{title:"Spread out before pairing",text:"Within a set of equal-energy orbitals, electrons occupy separate orbitals with parallel spins before pairing up, when possible.",items:["↑","↑","↑","then pair"]},
    pauli:{title:"Opposite spins in one orbital",text:"No two electrons in an atom can have the same set of four quantum numbers. An orbital can hold up to two electrons, with opposite spin projections.",items:["↑","↓","✓ allowed"]}
  };
  const questions = [
    {q:"How many orbitals are in a p subshell?",opts:["1","3","5","7"],answer:"3",why:"A p subshell has three orbitals: often shown as pₓ, pᵧ and p𝓏."},
    {q:"Which quantity does |ψ|² represent?",opts:["Electron charge","Probability density","Nuclear mass","Spin direction"],answer:"Probability density",why:"The squared magnitude of the wavefunction gives probability density."},
    {q:"What is the maximum capacity of an s subshell?",opts:["1 electron","2 electrons","6 electrons","10 electrons"],answer:"2 electrons",why:"An s subshell has one orbital, which can contain two electrons with opposite spins."},
    {q:"Which quantum number is associated with orbital angular momentum?",opts:["n","ℓ","mₛ","Atomic number"],answer:"ℓ",why:"The azimuthal quantum number ℓ identifies the subshell type."},
    {q:"What shape is commonly associated with p orbitals?",opts:["Sphere","Dumbbell","Cube","Ring only"],answer:"Dumbbell",why:"The common real p-orbital shapes have two main lobes."},
    {q:"How many electrons can a d subshell hold?",opts:["2","6","10","14"],answer:"10",why:"A d subshell has five orbitals, each with a maximum of two electrons."}
  ];
  let currentElement = elements.find(e=>e[0]==="O"), currentOrbital="2pz", currentRule="aufbau", questionIndex=0, score=0, answered=false, demoTimer=null;
  const elementSelect=$("#elementSelect");
  elements.forEach(e=>{const o=document.createElement("option");o.value=e[0];o.textContent=`${e[2]} · ${e[0]} — ${e[1]}`;elementSelect.appendChild(o);});
  elementSelect.value="O";

  function shellCount(z){let left=z,n=0;const caps=[2,8,18,32,32,18,8];while(left>0&&n<caps.length){left-=caps[n++];}return Math.max(1,n);}
  function updateElement(){
    const e=currentElement,z=e[2];
    $("#heroElement").textContent=`${e[1]} · ${e[0]}`;$("#heroFact").textContent=`${z} protons · ${z} electrons`;
    $("#visualTitle").textContent=`${e[1]} atom`;$("#elementSymbol").textContent=e[0];$("#elementName").textContent=e[1];
    $("#elementMeta").textContent=`Atomic number ${z} · Approx. mass ${e[3]}`;
    $("#protonCount").textContent=z;$("#electronCount").textContent=z;$("#shellCount").textContent=shellCount(z);
    $("#configuration").textContent=e[4];$("#nobleConfig").textContent=e[5];
    buildAtom();
  }
  function updateOrbital(key){
    currentOrbital=orbitals[key]?key:"2pz";const o=orbitals[currentOrbital];
    $$(".orbital-buttons button").forEach(b=>b.classList.toggle("active",b.dataset.orbital===currentOrbital));
    $("#orbitalDetails").innerHTML=`<div class="detail-title"><span class="orbital-icon">✧</span><div><h3>${o.name}</h3><small>${o.shape}</small></div></div><p>${o.desc}</p><div class="quantum-values"><span>n = ${o.n}</span><span>ℓ = ${o.l}</span><span>mℓ: ${o.ml}</span><span>Max e⁻ = ${o.capacity}</span></div>`;
    if(sceneReady)buildAtom();
  }
  function updateConcept(key){
    const c=concepts[key]||concepts.shell;
    $$(".hierarchy-item").forEach(b=>b.classList.toggle("active",b.dataset.concept===key));
    $("#conceptText").innerHTML=`<h3>${c[0]}</h3><p>${c[1]}</p>`;
  }
  function updateRule(key){
    currentRule=key;const r=rules[key];
    $$(".rule-tab").forEach(b=>b.classList.toggle("active",b.dataset.rule===key));
    $("#ruleContent").innerHTML=`<div class="rule-visual" id="ruleVisual">${r.items.map((item,i)=>`<span class="${key==="aufbau"&&i<2?"filled":""}">${item}</span>`).join("")}</div><h3>${r.title}</h3><p>${r.text}</p><button id="demoRule" class="button button-primary">▶ Run mini demo</button>`;
    $("#demoRule").addEventListener("click",runRuleDemo);
  }
  function runRuleDemo(){
    const visual=$("#ruleVisual");if(!visual)return;
    clearTimeout(demoTimer);const spans=$$("span",visual);spans.forEach(s=>s.classList.remove("filled"));
    spans.forEach((s,i)=>{demoTimer=setTimeout(()=>s.classList.add("filled"),i*420);});
  }
  function showQuestion(){
    answered=false;const q=questions[questionIndex%questions.length];
    $("#quizQuestion").textContent=q.q;$("#quizFeedback").textContent="Choose an answer to check your understanding.";
    $("#quizOptions").innerHTML=q.opts.map(o=>`<button data-answer="${o.replace(/"/g,"&quot;")}">${o}</button>`).join("");
    $$("#quizOptions button").forEach(b=>b.addEventListener("click",()=>answerQuestion(b.dataset.answer,b)));
  }
  function answerQuestion(value,button){
    if(answered)return;answered=true;const q=questions[questionIndex%questions.length];
    const correct=value===q.answer;if(correct)score++;
    $("#score").textContent=score;
    $$("#quizOptions button").forEach(b=>{if(b.dataset.answer===q.answer)b.classList.add("correct");else if(b===button)b.classList.add("wrong");b.disabled=true;});
    $("#quizFeedback").textContent=(correct?"Correct! ":"Not quite. ")+q.why;
  }
  $("#nextQuestion").addEventListener("click",()=>{questionIndex++;showQuestion();});
  $("#orbitalButtons").addEventListener("click",e=>{const b=e.target.closest("button[data-orbital]");if(b)updateOrbital(b.dataset.orbital);});
  $$(".hierarchy-item").forEach(b=>b.addEventListener("click",()=>updateConcept(b.dataset.concept)));
  $$(".rule-tab").forEach(b=>b.addEventListener("click",()=>updateRule(b.dataset.rule)));
  elementSelect.addEventListener("change",()=>{currentElement=elements.find(e=>e[0]===elementSelect.value)||elements[0];updateElement();});
  $("#density").addEventListener("input",e=>{$("#densityValue").textContent=`${e.target.value}%`;if(sceneReady)updateCloudVisibility();});
  $("#viewMode").addEventListener("change",()=>{if(sceneReady)buildAtom();});
  $("#quality").addEventListener("change",()=>{if(sceneReady)buildAtom();});
  $("#resetView").addEventListener("click",()=>{if(camera){camera.position.set(0,0,8);camera.lookAt(0,0,0);}});
  $("#pauseView").addEventListener("click",()=>{paused=!paused;$("#pauseView").textContent=paused?"▶":"Ⅱ";$("#pauseView").title=paused?"Resume animation":"Pause animation";});

  let renderer,scene,camera,atomGroup,cloudPoints,cloudMaterial,controls={drag:false,x:0,y:0,rotX:0.18,rotY:0.35},sceneReady=false,paused=false,frameId;
  const sceneWrap=$("#sceneWrap");
  function init3D(){
    if(!window.THREE){$("#sceneFallback p").textContent="3D library could not load. Check your internet connection.";return;}
    try{
      scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(45,1,.1,100);camera.position.set(0,0,8);
      renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.setSize(sceneWrap.clientWidth,sceneWrap.clientHeight);renderer.setClearColor(0x000000,0);
      renderer.domElement.id="atomCanvas";renderer.domElement.setAttribute("aria-label","Interactive 3D atom. Drag to rotate and scroll to zoom.");sceneWrap.prepend(renderer.domElement);
      scene.add(new THREE.AmbientLight(0x9caed9,1.7));const light=new THREE.PointLight(0x9fffe0,25);light.position.set(3,4,5);scene.add(light);
      atomGroup=new THREE.Group();scene.add(atomGroup);
      sceneWrap.addEventListener("pointerdown",e=>{controls.drag=true;controls.x=e.clientX;controls.y=e.clientY;sceneWrap.setPointerCapture?.(e.pointerId);});
      sceneWrap.addEventListener("pointermove",e=>{if(!controls.drag)return;controls.rotY+=(e.clientX-controls.x)*.008;controls.rotX+=(e.clientY-controls.y)*.008;controls.x=e.clientX;controls.y=e.clientY;});
      const endDrag=()=>controls.drag=false;sceneWrap.addEventListener("pointerup",endDrag);sceneWrap.addEventListener("pointercancel",endDrag);
      sceneWrap.addEventListener("wheel",e=>{e.preventDefault();camera.position.z=Math.max(3.8,Math.min(13,camera.position.z+e.deltaY*.008));},{passive:false});
      $("#sceneFallback").style.display="none";sceneReady=true;buildAtom();resize();window.addEventListener("resize",resize);animate();
    }catch(err){console.error(err);$("#sceneFallback p").textContent="3D rendering is unavailable in this browser.";}
  }
  function clearGroup(group){while(group.children.length){const obj=group.children.pop();obj.geometry?.dispose?.();if(obj.material){if(Array.isArray(obj.material))obj.material.forEach(m=>m.dispose?.());else obj.material.dispose?.();}}}
  function sphere(radius,color,opacity=1,segments=16){const mesh=new THREE.Mesh(new THREE.SphereGeometry(radius,segments,Math.max(8,segments/2)),new THREE.MeshStandardMaterial({color,transparent:opacity<1,opacity,roughness:.45,metalness:.12}));return mesh;}
  function seeded(i){const x=Math.sin(i*127.1+currentElement[2]*31.7)*43758.5453;return x-Math.floor(x);}
  function buildAtom(){
    if(!sceneReady)return;clearGroup(atomGroup);const mode=$("#viewMode").value,quality=$("#quality").value,density=Number($("#density").value)/100;
    const count=quality==="low"?1100:quality==="high"?4800:2500;
    if(mode==="nucleus"){
      const z=currentElement[2],n=Math.max(0,currentElement[3]-z),total=z+n;
      for(let i=0;i<total;i++){const a=i*2.3999632297,r=.38*Math.cbrt((i+.5)/Math.max(1,total)),y=1-2*(i+.5)/Math.max(1,total),s=Math.sqrt(1-y*y);const m=sphere(.11,i<z?0xff8c98:0x91a4c5,1,12);m.position.set(Math.cos(a)*s*r,y*r,Math.sin(a)*s*r);atomGroup.add(m);}
      return;
    }
    const z=currentElement[2],n=Math.max(0,currentElement[3]-z),total=z+n;
    for(let i=0;i<Math.min(total,90);i++){const a=i*2.3999632297,r=.25*Math.cbrt((i+.5)/Math.max(1,Math.min(total,90))),y=1-2*(i+.5)/Math.max(1,Math.min(total,90)),s=Math.sqrt(1-y*y);const m=sphere(.045,i<z?0xff8c98:0x91a4c5,.95,8);m.position.set(Math.cos(a)*s*r,y*r,Math.sin(a)*s*r);atomGroup.add(m);}
    if(mode==="shells"){
      const shells=Math.min(shellCount(z),7);
      for(let i=1;i<=shells;i++){const mesh=new THREE.Mesh(new THREE.SphereGeometry(i*.72,32,20),new THREE.MeshBasicMaterial({color:i%2?0x8e83ff:0x72d9c1,wireframe:true,transparent:true,opacity:.26}));atomGroup.add(mesh);}
      for(let i=0;i<z;i++){const r=.72*(1+(i%4));const a=i*2.39996;const m=sphere(.045,0x9df3d8,.9,8);m.position.set(Math.cos(a)*r,Math.sin(a*.73)*r,Math.sin(a)*r);atomGroup.add(m);}
      return;
    }
    const pts=[],colors=[],sizes=[];
    const orb=currentOrbital;
    for(let i=0;i<count;i++){
      // Deterministic cloud sampling. Stylized orbital shapes, not numerical solutions of Schrödinger's equation.
      let x=(seeded(i+1)-.5)*4.8,y=(seeded(i+8001)-.5)*4.8,zp=(seeded(i+17001)-.5)*4.8;
      let keep=false;
      if(mode==="orbital"){
        if(orb.endsWith("px")){keep=(Math.abs(x)>.18)&&Math.abs(y)<Math.abs(x)*.48&&Math.abs(zp)<Math.abs(x)*.48;}
        else if(orb.endsWith("py")){keep=(Math.abs(y)>.18)&&Math.abs(x)<Math.abs(y)*.48&&Math.abs(zp)<Math.abs(y)*.48;}
        else if(orb.endsWith("pz")){keep=(Math.abs(zp)>.18)&&Math.abs(x)<Math.abs(zp)*.48&&Math.abs(y)<Math.abs(zp)*.48;}
        else if(orb.includes("dxy")){keep=Math.abs(x*y)>.4&&Math.abs(zp)<.65;}
        else if(orb.includes("dz2")){keep=(Math.abs(zp)>.7&&Math.abs(x)<.65&&Math.abs(y)<.65)||(Math.hypot(x,y)>.8&&Math.hypot(x,y)<1.25&&Math.abs(zp)<.3);}
        else {const r=Math.sqrt(x*x+y*y+zp*zp);keep=r<2.15&&r>.25;}
      }else{
        // Broad, atom-centered cloud whose radial density fades outward.
        const r=Math.sqrt(x*x+y*y+zp*zp);
        keep=r<2.25 && seeded(i+29000)<Math.exp(-r*.48);
      }
      if(!keep)continue;
      pts.push(x,y,zp);const c=new THREE.Color().setHSL(.69+Math.min(1,Math.sqrt(x*x+y*y+zp*zp)/5)*.12,.8,.62);colors.push(c.r,c.g,c.b);sizes.push(1);
    }
    const geo=new THREE.BufferGeometry();geo.setAttribute("position",new THREE.Float32BufferAttribute(pts,3));geo.setAttribute("color",new THREE.Float32BufferAttribute(colors,3));
    cloudMaterial=new THREE.PointsMaterial({size:quality==="low"?.025:.032,vertexColors:true,transparent:true,opacity:density*.58,depthWrite:false,blending:THREE.AdditiveBlending,sizeAttenuation:true});
    cloudPoints=new THREE.Points(geo,cloudMaterial);atomGroup.add(cloudPoints);
    // A faint spherical reference helps visitors orient themselves without implying a fixed orbit.
    const guide=new THREE.Mesh(new THREE.SphereGeometry(2.28,24,16),new THREE.MeshBasicMaterial({color:0x5c6e9d,wireframe:true,transparent:true,opacity:.055}));atomGroup.add(guide);
  }
  function updateCloudVisibility(){if(cloudMaterial)cloudMaterial.opacity=Number($("#density").value)/100*.58;}
  function resize(){if(!renderer||!camera)return;const w=Math.max(1,sceneWrap.clientWidth),h=Math.max(1,sceneWrap.clientHeight);renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}
  function animate(){frameId=requestAnimationFrame(animate);if(!renderer)return;if(!paused&&!controls.drag){controls.rotY+=.0018;}atomGroup.rotation.x=controls.rotX;atomGroup.rotation.y=controls.rotY;renderer.render(scene,camera);}
  window.addEventListener("beforeunload",()=>{cancelAnimationFrame(frameId);clearTimeout(demoTimer);renderer?.dispose();});
  $("#exhibitionBtn").addEventListener("click",()=>{document.body.classList.toggle("exhibition");const on=document.body.classList.contains("exhibition");$("#exhibitionBtn").textContent=on?"✦ Exit exhibition mode":"✦ Exhibition mode";});
  updateElement();updateOrbital("2pz");updateConcept("shell");updateRule("aufbau");showQuestion();init3D();
})();