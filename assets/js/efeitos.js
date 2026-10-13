/*
  Efeitos interativos da Barbearia Martins.
  Bibliotecas servidas pelo próprio site (assets/js): GSAP 3.15 com ScrollTrigger e
  SplitText (licença padrão gratuita da GreenSock) e Lenis 1.3 (MIT).
  Tudo aqui é extra: sem este arquivo, ou com "reduzir movimento" ligado no aparelho,
  o site funciona igual, só sem as animações.
*/
(function () {
  'use strict';

  var reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var temMouse = matchMedia('(pointer: fine)').matches;

  /* Barra de progresso na barra do topo (não é animação, então fica mesmo com reduzir movimento). */
  var prog = document.getElementById('navProg');
  if (prog) {
    var quadro = 0;
    var medir = function () {
      quadro = 0;
      var max = document.documentElement.scrollHeight - innerHeight;
      prog.style.transform = 'scaleX(' + (max > 0 ? scrollY / max : 0) + ')';
    };
    addEventListener('scroll', function () { if (!quadro) quadro = requestAnimationFrame(medir); }, { passive: true });
    medir();
  }

  if (reduz || !window.gsap) return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  var animacoes = [];

  /* Rolagem suave (no celular continua a rolagem nativa). */
  if (window.Lenis) {
    var lenis = new Lenis({ duration: 1.1, syncTouch: false, anchors: { offset: -76 } });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add('com-lenis');
  }

  /* Título da capa entrando letra por letra. */
  var h1 = document.querySelector('.hero h1');
  if (h1) {
    var split = SplitText.create(h1, { type: 'chars', aria: 'auto' });
    animacoes.push(gsap.from(split.chars, {
      opacity: 0, yPercent: 70, rotateX: -60, transformOrigin: '50% 100%',
      duration: 0.8, stagger: 0.022, ease: 'expo.out', delay: 0.1
    }));
  }

  /* Cortina: a foto é revelada de baixo pra cima enquanto desfaz um zoom. */
  gsap.utils.toArray('[data-cortina]').forEach(function (caixa) {
    var foto = caixa.querySelector('img');
    var tl = gsap.timeline({
      scrollTrigger: { trigger: caixa, start: 'top 88%', once: true },
      defaults: { duration: 1.1, ease: 'expo.out' }
    });
    tl.fromTo(caixa, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)' });
    // clearProps devolve o transform pro CSS no fim (senão o zoom do hover para de funcionar).
    if (foto) tl.fromTo(foto, { scale: 1.2 }, { scale: 1, clearProps: 'transform' }, 0);
    animacoes.push(tl);
  });

  /* Linha verde que se desenha embaixo dos títulos das seções. */
  gsap.utils.toArray('.linha-sec').forEach(function (linha) {
    animacoes.push(gsap.fromTo(linha, { scaleX: 0 }, {
      scaleX: 1, duration: 0.9, ease: 'expo.out',
      scrollTrigger: { trigger: linha, start: 'top 90%', once: true }
    }));
  });

  /* Botão magnético: puxa de leve na direção do mouse (só com mouse, não no toque). */
  if (temMouse) {
    gsap.utils.toArray('[data-ima]').forEach(function (el) {
      var xPara = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'elastic.out(1, 0.45)' });
      var yPara = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'elastic.out(1, 0.45)' });
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        xPara((e.clientX - r.left - r.width / 2) * 0.3);   // força limitada: nunca sai da área de clique
        yPara((e.clientY - r.top - r.height / 2) * 0.3);
      });
      el.addEventListener('pointerleave', function () { xPara(0); yPara(0); });
    });
  }

  /* Cartão 3D do antes/depois: inclina com o mouse (ou arrastando o dedo de lado),
     com reflexo de luz que segue o ponteiro; ao rolar, ele também gira de leve. */
  gsap.utils.toArray('[data-tilt]').forEach(function (cartao) {
    var brilho = cartao.querySelector('.tilt-brilho');
    gsap.set(cartao, { transformPerspective: 900 });
    var rx = gsap.quickTo(cartao, 'rotationX', { duration: 0.6, ease: 'power3.out' });
    var ry = gsap.quickTo(cartao, 'rotationY', { duration: 0.6, ease: 'power3.out' });
    var mover = function (e) {
      var r = cartao.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      ry((px - 0.5) * 16);
      rx((0.5 - py) * 12);
      if (brilho) {
        brilho.style.setProperty('--gx', (px * 100) + '%');
        brilho.style.setProperty('--gy', (py * 100) + '%');
      }
    };
    cartao.addEventListener('pointermove', mover);
    cartao.addEventListener('pointerleave', function () { rx(0); ry(0); });
    // Ao rolar: inclina de -6° a 6° conforme passa pela tela (dá profundidade também no celular).
    animacoes.push(gsap.fromTo(cartao.parentElement, { rotationX: 7, transformPerspective: 1100 }, {
      rotationX: -5, ease: 'none',
      scrollTrigger: { trigger: cartao, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
    }));
  });

  /* Aba escondida pausa o GSAP: pula tudo pro estado final pra nada ficar invisível. */
  setTimeout(function () {
    if (document.hidden) animacoes.forEach(function (a) { a.progress(1); });
  }, 1500);
})();
