(function(){
  "use strict";

  /* ---------- language toggle (persisted) ---------- */
  var stored = null;
  try{ stored = localStorage.getItem('mb-lang'); }catch(e){}
  if(stored === 'fr' || stored === 'en'){
    document.body.setAttribute('data-lang', stored);
  }
  function syncLangButtons(){
    var lang = document.body.getAttribute('data-lang') || 'fr';
    document.querySelectorAll('.langswitch button').forEach(function(b){
      b.classList.toggle('active', b.getAttribute('data-setlang') === lang);
    });
  }
  syncLangButtons();
  document.querySelectorAll('.langswitch button').forEach(function(btn){
    btn.addEventListener('click', function(){
      var lang = btn.getAttribute('data-setlang');
      document.body.setAttribute('data-lang', lang);
      try{ localStorage.setItem('mb-lang', lang); }catch(e){}
      syncLangButtons();
    });
  });

  /* ---------- scroll reveal ---------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');
  if(reduceMotion || !('IntersectionObserver' in window)){
    revealTargets.forEach(function(el){ el.classList.add('visible'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -4% 0px' });
    revealTargets.forEach(function(el){ io.observe(el); });
  }

  /* ---------- hover preview (index page) ---------- */
  var preview = document.getElementById('hoverPreview');
  if(preview){
    var previewImg = document.getElementById('hoverPreviewImg');
    var rows = document.querySelectorAll('.index-row[data-preview]');
    var isFinePointer = window.matchMedia('(pointer:fine)').matches;
    if(isFinePointer){
      rows.forEach(function(row){
        row.addEventListener('mouseenter', function(){
          previewImg.src = row.getAttribute('data-preview');
          preview.classList.add('visible');
        });
        row.addEventListener('mousemove', function(e){
          preview.style.left = (e.clientX + 24) + 'px';
          preview.style.top = (e.clientY - 95) + 'px';
        });
        row.addEventListener('mouseleave', function(){
          preview.classList.remove('visible');
        });
      });
    }
  }

  /* ---------- lightbox for .gallery-grid and .ai-gallery ---------- */
  var galleryImgs = Array.prototype.slice.call(document.querySelectorAll('.gallery-grid img, .ai-gallery img'));
  if(galleryImgs.length){
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML =
      '<button class="lb-close" aria-label="Fermer">' +
        '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M2 2L20 20M20 2L2 20" stroke="currentColor" stroke-width="1.4"/></svg>' +
      '</button>' +
      '<button class="lb-prev" aria-label="Précédent">' +
        '<svg width="14" height="24" viewBox="0 0 14 24" fill="none"><path d="M12 2L2 12L12 22" stroke="currentColor" stroke-width="1.4"/></svg>' +
      '</button>' +
      '<img alt="">' +
      '<button class="lb-next" aria-label="Suivant">' +
        '<svg width="14" height="24" viewBox="0 0 14 24" fill="none"><path d="M2 2L12 12L2 22" stroke="currentColor" stroke-width="1.4"/></svg>' +
      '</button>' +
      '<div class="lb-count"></div>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector('img');
    var lbCount = lb.querySelector('.lb-count');
    var current = 0;

    function openAt(i){
      current = (i + galleryImgs.length) % galleryImgs.length;
      var src = galleryImgs[current].getAttribute('data-full') || galleryImgs[current].src;
      lbImg.src = src;
      lbImg.alt = galleryImgs[current].alt || '';
      lbCount.textContent = (current+1) + ' / ' + galleryImgs.length;
      lb.classList.add('open');
      document.body.classList.add('lightbox-open');
      document.documentElement.style.overflow = 'hidden';
    }
    function closeLb(){
      lb.classList.remove('open');
      document.body.classList.remove('lightbox-open');
      document.documentElement.style.overflow = '';
    }
    galleryImgs.forEach(function(img, i){
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function(){ openAt(i); });
    });
    lb.querySelector('.lb-close').addEventListener('click', closeLb);
    lb.querySelector('.lb-prev').addEventListener('click', function(){ openAt(current-1); });
    lb.querySelector('.lb-next').addEventListener('click', function(){ openAt(current+1); });
    lb.addEventListener('click', function(e){ if(e.target === lb){ closeLb(); } });
    document.addEventListener('keydown', function(e){
      if(!lb.classList.contains('open')) return;
      if(e.key === 'Escape') closeLb();
      if(e.key === 'ArrowRight') openAt(current+1);
      if(e.key === 'ArrowLeft') openAt(current-1);
    });
  }
})();
