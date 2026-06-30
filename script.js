/* LOADER */
const statuses = ['Initializing...','Loading skills...','Compiling projects...','Almost there...'];
let sIdx = 0;
const statusEl = document.getElementById('loaderStatus');
const statusTimer = setInterval(() => {
  sIdx = (sIdx + 1) % statuses.length;
  if(statusEl) statusEl.textContent = statuses[sIdx];
}, 420);

window.addEventListener('load', () => {
  setTimeout(() => {
    clearInterval(statusTimer);
    document.getElementById('loader').classList.add('hidden');
    initReveal();
    triggerSkillBars();
  }, 1700);
});

/* CUSTOM CURSOR */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx=-100,my=-100,rx=-100,ry=-100;
document.addEventListener('mousemove', e => {
  mx=e.clientX; my=e.clientY;
  if(cursor){ cursor.style.left=mx+'px'; cursor.style.top=my+'px'; }
});
function ringLoop(){
  rx += (mx-rx)*0.15; ry += (my-ry)*0.15;
  if(ring){ ring.style.left=rx+'px'; ring.style.top=ry+'px'; }
  requestAnimationFrame(ringLoop);
}
ringLoop();
document.querySelectorAll('a,button,.skill-card,.proj-card,.cic,.edu-card,.cert-card,.goal-item').forEach(el=>{
  el.addEventListener('mouseenter', () => { if(ring){ring.style.transform='translate(-50%,-50%) scale(1.6)'; ring.style.borderColor='var(--purple)';} });
  el.addEventListener('mouseleave', () => { if(ring){ring.style.transform='translate(-50%,-50%) scale(1)'; ring.style.borderColor='var(--cyan)';} });
});

/* PARTICLE CANVAS */
const canvas = document.getElementById('bgCanvas');
if(canvas){
  const ctx = canvas.getContext('2d');
  let particles = [];
  let pmx=0, pmy=0;
  function resize(){ canvas.width = canvas.parentElement.offsetWidth; canvas.height = canvas.parentElement.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('mousemove', e => { pmx=e.clientX; pmy=e.clientY; });

  class P {
    constructor(){ this.reset(); }
    reset(){
      this.x=Math.random()*canvas.width; this.y=Math.random()*canvas.height;
      this.size=Math.random()*1.4+0.3;
      this.vx=(Math.random()-0.5)*0.35; this.vy=(Math.random()-0.5)*0.35;
      this.alpha=Math.random()*0.5+0.1;
      this.color = Math.random()>0.7 ? '#7c3aed' : '#00d4ff';
    }
    update(){
      const dx=pmx-this.x, dy=pmy-this.y, dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<110){ this.vx -= dx/dist*0.3; this.vy -= dy/dist*0.3; }
      this.vx*=0.98; this.vy*=0.98;
      this.x+=this.vx; this.y+=this.vy;
      if(this.x<0||this.x>canvas.width||this.y<0||this.y>canvas.height) this.reset();
    }
    draw(){
      ctx.save(); ctx.globalAlpha=this.alpha; ctx.fillStyle=this.color;
      ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2); ctx.fill(); ctx.restore();
    }
  }
  for(let i=0;i<100;i++) particles.push(new P());

  function connections(){
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<90){
          ctx.save(); ctx.globalAlpha=(1-dist/90)*0.1; ctx.strokeStyle='#00d4ff'; ctx.lineWidth=0.5;
          ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y); ctx.stroke(); ctx.restore();
        }
      }
    }
  }
  function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{p.update();p.draw();});
    connections();
    requestAnimationFrame(animate);
  }
  animate();
}

/* TYPED TEXT */
const phrases = [
  'Software Engineer in the making.',
  'Data Science Enthusiast.',
  'Full-Stack Developer.',
  'Problem Solver on LeetCode.',
  'Always Learning, Always Building. 🚀'
];
let pIdx=0, cIdx=0, deleting=false;
const typedEl = document.getElementById('typedEl');
function typeLoop(){
  if(!typedEl) return;
  const phrase = phrases[pIdx];
  if(!deleting){
    typedEl.textContent = phrase.slice(0, cIdx+1); cIdx++;
    if(cIdx===phrase.length){ deleting=true; setTimeout(typeLoop,1700); return; }
  } else {
    typedEl.textContent = phrase.slice(0, cIdx-1); cIdx--;
    if(cIdx===0){ deleting=false; pIdx=(pIdx+1)%phrases.length; }
  }
  setTimeout(typeLoop, deleting?40:75);
}
setTimeout(typeLoop, 2200);

/* NAVBAR SCROLL + ACTIVE LINK */
const navbar = document.getElementById('navbar');
const btt = document.getElementById('btt');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY>40);
  btt.classList.toggle('visible', window.scrollY>500);
  updateActiveNav();
});
function updateActiveNav(){
  const sections = document.querySelectorAll('section[id]');
  const y = window.scrollY + 140;
  sections.forEach(sec => {
    const top=sec.offsetTop, h=sec.offsetHeight, id=sec.id;
    const link = document.querySelector(`.nl[href="#${id}"]`);
    if(link){
      if(y>=top && y<top+h){
        document.querySelectorAll('.nl').forEach(l=>l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

/* MOBILE MENU */
const hamburger = document.getElementById('hamburger');
const mobOverlay = document.getElementById('mobOverlay');
const mobClose = document.getElementById('mobClose');
hamburger.addEventListener('click', () => mobOverlay.classList.add('open'));
mobClose.addEventListener('click', () => mobOverlay.classList.remove('open'));
document.querySelectorAll('.mob-links a').forEach(a => a.addEventListener('click', () => mobOverlay.classList.remove('open')));

/* REVEAL ON SCROLL */
function initReveal(){
  const els = document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((entry,i) => {
      if(entry.isIntersecting){
        setTimeout(() => entry.target.classList.add('revealed'), i%6*70);
        obs.unobserve(entry.target);
      }
    });
  }, {threshold:0.1});
  els.forEach(el => obs.observe(el));
}

/* SKILL BARS - trigger when skills section visible */
function triggerSkillBars(){
  const skillsSection = document.querySelector('.skills-sec');
  if(!skillsSection) return;
  new IntersectionObserver(entries => {
    if(entries[0].isIntersecting){
      document.querySelectorAll('.sk-fill').forEach(fill => {
        setTimeout(() => { fill.style.width = fill.getAttribute('data-w')+'%'; }, 300);
      });
    }
  }, {threshold:0.15}).observe(skillsSection);
}

/* SKILLS FILTER */
document.querySelectorAll('.scat').forEach(btn => {
  btn.addEventListener('click', function(){
    document.querySelectorAll('.scat').forEach(b=>b.classList.remove('active'));
    this.classList.add('active');
    const cat = this.getAttribute('data-cat');
    document.querySelectorAll('.skill-card').forEach(card => {
      if(cat==='all' || card.getAttribute('data-cat')===cat){
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
    setTimeout(() => {
      document.querySelectorAll('.skill-card:not(.hidden) .sk-fill').forEach(fill => {
        fill.style.width='0';
        setTimeout(()=>{ fill.style.width = fill.getAttribute('data-w')+'%'; }, 80);
      });
    }, 30);
  });
});

/* COUNTER ANIMATION */
function animateCounter(el){
  const target = parseInt(el.getAttribute('data-target'));
  let current = 0;
  const step = Math.max(target/50, 1);
  const timer = setInterval(() => {
    current += step;
    if(current>=target){ current=target; clearInterval(timer); }
    el.textContent = Math.floor(current) + (target>=10 && target!==2026 ? '+' : '');
  }, 28);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      animateCounter(entry.target);
      counterObs.unobserve(entry.target);
    }
  });
}, {threshold:0.5});
document.querySelectorAll('.hstat-n, .ghsc-num').forEach(el => counterObs.observe(el));

/* PHOTO DISPLAY — using <img src="images/profile.jpg"> tags directly in HTML.
   If the image is missing, the onerror attribute on each <img> falls back
   to the placeholder SVG automatically. No JS needed for this anymore. */

/* CONTACT FORM */
const contactForm = document.getElementById('contactForm');
if(contactForm){
  contactForm.addEventListener('submit', function(e){
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = 'Message Sent! 🎉';
    btn.style.background = 'linear-gradient(135deg, #10b981, #00d4ff)';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
      btn.disabled = false;
      this.reset();
    }, 3000);
  });
}

/* BACK TO TOP */
btt.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

/* SMOOTH SCROLL */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if(href.length>1){
      const target = document.querySelector(href);
      if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth', block:'start'}); }
    }
  });
});
