/* =============================================================
   Supply District — sd-collection.js  v2
   ─────────────────────────────────────────────────────────────
   Handles:
     initSidebarAccordions()  — desktop sidebar filter group toggle
     initMobilePanel()        — slide-in mobile filter panel
     initMobileGroupAccordions()  — accordion groups inside the panel
     initSort()               — sort select URL update (preserves filters)
     handleQuickAdd()         — AJAX add-to-cart + toast
     Toast notification system
   ============================================================= */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     Utility helpers
  ───────────────────────────────────────────── */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  /* ─────────────────────────────────────────────
     Toast notification
  ───────────────────────────────────────────── */
  var toastEl = null;
  var toastTimer = null;

  function ensureToast() {
    if (toastEl) return toastEl;
    toastEl = document.createElement('div');
    toastEl.className = 'sd-toast';
    toastEl.setAttribute('role', 'status');
    toastEl.setAttribute('aria-live', 'polite');
    toastEl.innerHTML = [
      '<span class="sd-toast__icon" aria-hidden="true">',
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"',
          ' stroke="currentColor" stroke-width="2.5"',
          ' stroke-linecap="round" stroke-linejoin="round">',
          '<polyline points="20 6 9 17 4 12"/>',
        '</svg>',
      '</span>',
      '<span class="sd-toast__msg"></span>',
      '<button class="sd-toast__close" aria-label="Dismiss">',
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"',
          ' stroke="currentColor" stroke-width="2.5"',
          ' stroke-linecap="round" stroke-linejoin="round">',
          '<line x1="18" y1="6" x2="6" y2="18"/>',
          '<line x1="6" y1="6" x2="18" y2="18"/>',
        '</svg>',
      '</button>'
    ].join('');
    document.body.appendChild(toastEl);
    toastEl.querySelector('.sd-toast__close').addEventListener('click', hideToast);
    return toastEl;
  }

  function showToast(msg, type, duration) {
    var el = ensureToast();
    duration = duration || 3500;
    el.className = 'sd-toast sd-toast--' + (type || 'success');
    el.querySelector('.sd-toast__msg').textContent = msg;
    requestAnimationFrame(function () { el.classList.add('is-visible'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, duration);
  }

  function hideToast() {
    if (toastEl) toastEl.classList.remove('is-visible');
  }

  /* ─────────────────────────────────────────────
     Quick Add to Cart
  ───────────────────────────────────────────── */
  function handleQuickAdd(btn) {
    var variantId   = btn.dataset.variantId;
    var hasVariants = btn.dataset.hasVariants === 'true';
    var productUrl  = btn.dataset.productUrl;

    /* Multi-variant → navigate to PDP, preserving collection context */
    if (hasVariants) {
      sessionStorage.setItem('cv_return_scroll_' + window.location.pathname, window.scrollY);
      window.location.href = productUrl + '?return_to=' + encodeURIComponent(window.location.href);
      return;
    }

    if (!variantId) return;

    btn.disabled = true;
    var originalHtml = btn.innerHTML;
    btn.innerHTML = [
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"',
        ' stroke="currentColor" stroke-width="2.5" stroke-linecap="round"',
        ' stroke-linejoin="round"',
        ' style="animation:sd-spin .7s linear infinite">',
        '<circle cx="12" cy="12" r="10" stroke-dasharray="30 10"/>',
      '</svg>',
      ' Adding\u2026'
    ].join('');

    fetch('/cart/add.js', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body:    JSON.stringify({ id: parseInt(variantId, 10), quantity: 1 })
    })
      .then(function (r) {
        if (!r.ok) throw new Error('Cart error ' + r.status);
        return r.json();
      })
      .then(function (item) {
        showToast('Added to cart \u2014 ' + item.title, 'success');
        return fetch('/cart.js');
      })
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        document.querySelectorAll('[data-cart-count]').forEach(function (el) {
          el.textContent = cart.item_count;
          el.hidden = cart.item_count === 0;
        });
        document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
      })
      .catch(function (err) {
        console.error('Quick Add failed:', err);
        showToast('Could not add to cart \u2014 please try again.', 'error');
      })
      .finally(function () {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
      });
  }

  /* ─────────────────────────────────────────────
     Sidebar Accordion (desktop)
     Toggles .is-open on .sdcl-accordion elements
  ───────────────────────────────────────────── */
  function initSidebarAccordions() {
    $$('.sdcl-accordion').forEach(function (acc) {
      var header = acc.querySelector('.sdcl-accordion__header');
      if (!header) return;

      header.addEventListener('click', function () {
        var isOpen = acc.classList.contains('is-open');
        acc.classList.toggle('is-open', !isOpen);
        header.setAttribute('aria-expanded', !isOpen);
      });
    });
  }

  /* ─────────────────────────────────────────────
     Mobile Panel — open / close
  ───────────────────────────────────────────── */
  function initMobilePanel() {
    var trigger  = document.getElementById('sdcf-mobile-trigger');
    var panel    = document.getElementById('sdcf-mobile-panel');
    var overlay  = document.getElementById('sdcl-mobile-overlay');
    var closeBtn = document.getElementById('sdcl-panel-close');
    var cancelBtn = document.getElementById('sdcl-panel-cancel');
    var applyBtn  = document.getElementById('sdcl-panel-apply');

    if (!panel) return;

    function openPanel() {
      if (overlay) overlay.classList.add('is-open');
      panel.classList.add('is-open');
      panel.setAttribute('aria-hidden', 'false');
      document.body.classList.add('overflow-hidden');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
      if (closeBtn) closeBtn.focus();
    }

    function closePanel() {
      if (overlay) overlay.classList.remove('is-open');
      panel.classList.remove('is-open');
      panel.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('overflow-hidden');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    }

    trigger   && trigger.addEventListener('click', openPanel);
    closeBtn  && closeBtn.addEventListener('click', closePanel);
    cancelBtn && cancelBtn.addEventListener('click', closePanel);
    applyBtn  && applyBtn.addEventListener('click', closePanel);
    overlay   && overlay.addEventListener('click', closePanel);

    /* ESC key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) closePanel();
    });
  }

  /* ─────────────────────────────────────────────
     Mobile Group Accordions (inside the panel)
  ───────────────────────────────────────────── */
  function initMobileGroupAccordions() {
    $$('.sdcl-mobile-group').forEach(function (group) {
      var header = group.querySelector('.sdcl-mobile-group__header');
      if (!header) return;

      header.addEventListener('click', function () {
        var isOpen = group.classList.contains('is-open');
        group.classList.toggle('is-open', !isOpen);
        header.setAttribute('aria-expanded', !isOpen);
      });
    });
  }

  /* ─────────────────────────────────────────────
     Sort — preserve existing filter params on change
  ───────────────────────────────────────────── */
  function initSort() {
    /* Desktop sort select (sidebar or topbar) */
    $$('.sdcf-sort-select').forEach(function (select) {
      select.addEventListener('change', function () {
        var url = new URL(window.location.href);
        url.searchParams.set('sort_by', this.value);
        window.location.href = url.toString();
      });
    });

    /* Mobile sort links — mark active based on current URL */
    var currentSort = new URL(window.location.href).searchParams.get('sort_by') || '';
    $$('.sdcf-sort-option').forEach(function (opt) {
      if ((opt.dataset.sort || '') === currentSort) {
        opt.classList.add('is-active');
        var radio = opt.querySelector('.sdcf-sort-radio');
        if (radio) {
          radio.style.borderColor = 'var(--color-cta-primary)';
          radio.style.background  = 'var(--color-cta-primary)';
          radio.style.boxShadow   = 'inset 0 0 0 3px var(--cv-card)';
        }
      }
    });
  }

  /* ─────────────────────────────────────────────
     Price Range — submit on Enter key in inputs
  ───────────────────────────────────────────── */
  function initPriceRange() {
    $$('.sdcl-price-range__input').forEach(function (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          var form = input.closest('form');
          if (form) form.submit();
        }
      });
    });
  }

  /* ─────────────────────────────────────────────
     Mobile Title Prefix Strip  (max-width: 768px)
     ─────────────────────────────────────────────
     Many TCG product titles start with the game name followed by a colon,
     e.g. "One Piece Card Game: Kingdoms of Intrigue". On mobile the 2-col
     grid is narrow, so we strip the common prefix and show only the unique
     set name. Desktop titles are untouched.
     Add/remove entries in PREFIXES to match your catalogue.
  ───────────────────────────────────────────── */
  function initTitleStrip() {
    if (window.innerWidth >= 769) return; /* desktop — do nothing */

    var PREFIXES = [
      'One Piece Card Game: ',
      'One Piece: ',
      'Pokemon TCG: ',
      'Pokémon TCG: ',
      'Magic: The Gathering: ',
      'MTG: ',
      'Flesh and Blood: ',
      'Dragon Ball Super Card Game: ',
      'Dragon Ball Super: ',
      'Digimon Card Game: ',
      'Digimon: ',
      'Yu-Gi-Oh!: ',
      'Lorcana: ',
      'Star Wars: Unlimited: ',
      'Star Wars Unlimited: ',
    ];

    var links = document.querySelectorAll('.sdpc__title a[data-raw-title]');
    for (var i = 0; i < links.length; i++) {
      var link  = links[i];
      var title = link.getAttribute('data-raw-title') || '';
      var stripped = title;

      for (var p = 0; p < PREFIXES.length; p++) {
        if (stripped.indexOf(PREFIXES[p]) === 0) {
          stripped = stripped.slice(PREFIXES[p].length);
          break;
        }
      }

      if (stripped && stripped !== title) {
        link.textContent = stripped;
      }
    }
  }

  /* ─────────────────────────────────────────────
     Spin keyframe injection (for Quick Add loading)
  ───────────────────────────────────────────── */
  function injectSpinKeyframe() {
    if (document.getElementById('sd-spin-kf')) return;
    var style = document.createElement('style');
    style.id  = 'sd-spin-kf';
    style.textContent = '@keyframes sd-spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }

  /* ─────────────────────────────────────────────
     Init
  ───────────────────────────────────────────── */
  function init() {
    injectSpinKeyframe();
    initSidebarAccordions();
    initMobilePanel();
    initMobileGroupAccordions();
    initSort();
    initPriceRange();
    initTitleStrip();

    /* Quick Add — event delegation on entire document */
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.sdpc__quick-add');
      if (btn) handleQuickAdd(btn);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
