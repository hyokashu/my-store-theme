/* =============================================================
   Supply District — sd-collection.js
   Handles: filter dropdowns · mobile drawer · sort URL · Quick Add
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
  let toastEl = null;
  let toastTimer = null;

  function ensureToast() {
    if (toastEl) return toastEl;
    toastEl = document.createElement('div');
    toastEl.className = 'sd-toast';
    toastEl.setAttribute('role', 'status');
    toastEl.setAttribute('aria-live', 'polite');
    toastEl.innerHTML = `
      <span class="sd-toast__icon" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </span>
      <span class="sd-toast__msg"></span>
      <button class="sd-toast__close" aria-label="Dismiss">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>`;
    document.body.appendChild(toastEl);
    toastEl.querySelector('.sd-toast__close').addEventListener('click', hideToast);
    return toastEl;
  }

  function showToast(msg, type, duration) {
    var el = ensureToast();
    duration = duration || 3500;
    el.className = 'sd-toast sd-toast--' + (type || 'success');
    el.querySelector('.sd-toast__msg').textContent = msg;
    // update icon for error
    var icon = el.querySelector('.sd-toast__icon svg polyline, .sd-toast__icon svg path');
    requestAnimationFrame(function () {
      el.classList.add('is-visible');
    });
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

    // Multi-variant: navigate to product page
    if (hasVariants) {
      window.location.href = productUrl;
      return;
    }

    // Single variant: Ajax add
    if (!variantId) return;

    btn.disabled = true;
    var originalHtml = btn.innerHTML;
    btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round" class="sd-spin"
        style="animation:sd-spin .7s linear infinite">
        <circle cx="12" cy="12" r="10" stroke-dasharray="30 10"/>
      </svg>
      Adding…`;

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
        showToast('Added to cart — ' + item.title, 'success');
        // Update cart badge
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
        showToast('Could not add to cart — please try again.', 'error');
      })
      .finally(function () {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
      });
  }

  /* ─────────────────────────────────────────────
     Filter Dropdowns (desktop)
  ───────────────────────────────────────────── */
  function initFilterDropdowns() {
    $$('.sdcf-dropdown').forEach(function (dropdown) {
      var trigger = $('.sdcf-dropdown__trigger', dropdown);
      if (!trigger) return;

      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = dropdown.classList.contains('is-open');
        // Close all others
        $$('.sdcf-dropdown.is-open').forEach(function (d) {
          if (d !== dropdown) d.classList.remove('is-open');
        });
        dropdown.classList.toggle('is-open', !isOpen);
      });
    });

    // Close on outside click
    document.addEventListener('click', function () {
      $$('.sdcf-dropdown.is-open').forEach(function (d) {
        d.classList.remove('is-open');
      });
    });
  }

  /* ─────────────────────────────────────────────
     Mobile Filter Drawer
  ───────────────────────────────────────────── */
  function initMobileDrawer() {
    var trigger  = $('.sdcf-mobile-trigger');
    var drawer   = $('.sdcf-drawer');
    var overlay  = $('.sdcf-drawer-overlay');
    var closeBtn = $('.sdcf-drawer__close');
    if (!trigger || !drawer) return;

    function openDrawer() {
      drawer.classList.add('is-open');
      if (overlay) overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      closeBtn && closeBtn.focus();
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      trigger.focus();
    }

    trigger.addEventListener('click', openDrawer);
    closeBtn && closeBtn.addEventListener('click', closeDrawer);
    overlay && overlay.addEventListener('click', closeDrawer);

    // ESC key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
    });

    // Accordion groups in drawer
    $$('.sdcf-group', drawer).forEach(function (group) {
      var header = $('.sdcf-group__header', group);
      if (!header) return;
      // Open first group by default
      if (group === $$('.sdcf-group', drawer)[0]) group.classList.add('is-open');
      header.addEventListener('click', function () {
        group.classList.toggle('is-open');
      });
    });
  }

  /* ─────────────────────────────────────────────
     Sort — preserve filter params on change
  ───────────────────────────────────────────── */
  function initSort() {
    // Desktop sort select
    var select = $('.sdcf-sort-select');
    if (select) {
      select.addEventListener('change', function () {
        var url = new URL(window.location.href);
        url.searchParams.set('sort_by', this.value);
        window.location.href = url.toString();
      });
    }

    // Mobile sort links — mark active
    var currentSort = new URL(window.location.href).searchParams.get('sort_by') || '';
    $$('.sdcf-sort-option').forEach(function (opt) {
      if ((opt.dataset.sort || '') === currentSort) {
        opt.classList.add('is-active');
      }
    });
  }

  /* ─────────────────────────────────────────────
     Spin keyframe injection
  ───────────────────────────────────────────── */
  function injectSpinKeyframe() {
    if (document.getElementById('sd-spin-kf')) return;
    var style = document.createElement('style');
    style.id = 'sd-spin-kf';
    style.textContent = '@keyframes sd-spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }

  /* ─────────────────────────────────────────────
     Init
  ───────────────────────────────────────────── */
  function init() {
    injectSpinKeyframe();
    initFilterDropdowns();
    initMobileDrawer();
    initSort();

    // Quick Add — event delegation
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
