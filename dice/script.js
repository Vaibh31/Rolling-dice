<script>
  const faceOrientations = {
    1: { rx: -20,  ry: 30  },
    2: { rx: -110, ry: 30  },
    3: { rx: -20,  ry: -60 },
    4: { rx: -20,  ry: 120 },
    5: { rx: 70,   ry: 30  },
    6: { rx: -20,  ry: 210 },
  };

  const cubes    = [document.getElementById('cube1'),   document.getElementById('cube2')];
  const results  = [document.getElementById('result1'), document.getElementById('result2')];
  const shadows  = [document.getElementById('shadow1'), document.getElementById('shadow2')];
  const scenes   = [document.getElementById('scene1'),  document.getElementById('scene2')];
  const sumEl    = document.getElementById('sumValue');

  let isRolling  = [false, false];
  let diceValues = [null, null];

  function animateDie(idx, result, onDone) {
    const cube   = cubes[idx];
    const shadow = shadows[idx];
    const resEl  = results[idx];
    const orient = faceOrientations[result];

    cube.classList.remove('idle', 'idle-b', 'idle-locked', 'idle-locked-b', 'landing');
    cube.style.setProperty('--final-rx', orient.rx + 'deg');
    cube.style.setProperty('--final-ry', orient.ry + 'deg');
    resEl.classList.remove('show', 'flash');
    shadow.style.transform = 'scale(0.6)';
    shadow.style.opacity   = '0.3';
    cube.classList.add('rolling');

    setTimeout(() => {
      cube.classList.remove('rolling');
      cube.style.transform = `rotateX(${orient.rx}deg) rotateY(${orient.ry}deg)`;
      cube.classList.add('landing');
      shadow.style.transform = 'scale(1)';
      shadow.style.opacity   = '1';
      spawnParticles(scenes[idx]);

      setTimeout(() => {
        resEl.textContent = result;
        resEl.classList.add('show');
        setTimeout(() => resEl.classList.add('flash'), 50);

        setTimeout(() => {
          cube.classList.remove('landing');
          // Keep the die showing its rolled face — lock the transform into the idle animation via CSS var
          cube.style.setProperty('--idle-rx', orient.rx + 'deg');
          cube.style.setProperty('--idle-ry', orient.ry + 'deg');
          cube.style.transform = '';
          cube.classList.add(idx === 0 ? 'idle-locked' : 'idle-locked-b');
          if (onDone) onDone();
        }, 450);
      }, 200);
    }, 650);
  }

  function rollSingle(idx) {
    if (isRolling[idx]) return;
    isRolling[idx] = true;

    const r = Math.floor(Math.random() * 6) + 1;
    diceValues[idx] = r;

    animateDie(idx, r, () => {
      isRolling[idx] = false;
      updateSum();
    });
  }

  function rollBoth() {
    if (isRolling[0] || isRolling[1]) return;
    isRolling[0] = isRolling[1] = true;

    const r0 = Math.floor(Math.random() * 6) + 1;
    const r1 = Math.floor(Math.random() * 6) + 1;
    diceValues = [r0, r1];

    let done = 0;
    const oneDone = () => { if (++done === 2) { isRolling[0] = isRolling[1] = false; updateSum(); } };

    animateDie(0, r0, oneDone);
    setTimeout(() => animateDie(1, r1, oneDone), 90);
  }

  function updateSum() {
    if (diceValues[0] === null || diceValues[1] === null) return;
    const total = diceValues[0] + diceValues[1];
    sumEl.classList.remove('show', 'flash');
    void sumEl.offsetWidth;
    sumEl.textContent = total;
    sumEl.classList.add('show');
    setTimeout(() => sumEl.classList.add('flash'), 50);
  }

  function resetAll() {
    if (isRolling[0] || isRolling[1]) return;
    diceValues = [null, null];

    [0, 1].forEach(idx => {
      const cube  = cubes[idx];
      const resEl = results[idx];
      cube.classList.remove('rolling', 'landing', 'idle', 'idle-b', 'idle-locked', 'idle-locked-b');
      cube.style.transform = '';
      cube.style.removeProperty('--idle-rx');
      cube.style.removeProperty('--idle-ry');
      void cube.offsetWidth;
      cube.classList.add(idx === 0 ? 'idle' : 'idle-b');
      resEl.classList.remove('show', 'flash');
      resEl.textContent = '—';
    });

    sumEl.classList.remove('show', 'flash');
    sumEl.textContent = '—';
  }

  function spawnParticles(sceneEl) {
    const rect = sceneEl.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    for (let i = 0; i < 10; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      document.body.appendChild(p);
      const sz = 4 + Math.random() * 5;
      p.style.cssText = `width:${sz}px;height:${sz}px;left:${cx}px;top:${cy}px;`;
      const angle = (Math.PI * 2 * i / 10) + (Math.random() - 0.5) * 0.5;
      const dist  = 50 + Math.random() * 70;
      const dx = Math.cos(angle) * dist, dy = Math.sin(angle) * dist;
      p.animate([
        { transform:'translate(-50%,-50%) scale(1)',opacity:1 },
        { transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(0)`,opacity:0 }
      ],{ duration:500+Math.random()*300, easing:'cubic-bezier(0.25,0.46,0.45,0.94)', fill:'forwards' })
      .onfinish = () => p.remove();
    }
  }

  document.addEventListener('keydown', e => {
    if (e.code === 'Space' || e.code === 'Enter') rollBoth();
    if (e.code === 'KeyR') resetAll();
  });
</script>
