/* ============================================================
   Supply District — theme.js
   Global JS: sticky header shadow + cart badge live update.
   ============================================================ */

(function () {
  'use strict';

  /* ── Sticky header ─────────────────────────────────────────
     The header is position:sticky in CSS — it never leaves
     document flow, so there is NO layout shift and no
     scroll-based class toggling instead.

     All this function does is toggle .is-sticky (for the
     drop-shadow) and body.sd-sticky-active (for child-page
     offsets like the collection sidebar) based on scrollY.
  ────────────────────────────────────────────────────────── */
  function initStickyHeader () {
    var header = document.getElementById('sd-header');
    if (!header) return;

    function onScroll () {
      var scrolled = window.scrollY > 0;
      header.classList.toggle('is-sticky', scrolled);
      document.body.classList.toggle('sd-sticky-active', scrolled);
    }

    /* passive:true → browser can scroll without waiting for JS */
    window.addEventListener('scroll', onScroll, { passive: true });

    /* Evaluate immediately so state is correct on load/refresh */
    onScroll();
  }

  /* ── Cart badge live update ────────────────────────────────
     Shopify fires a custom event `cart:updated` (Dawn theme).
     This is a lightweight fallback that fetches /cart.js
     whenever the document becomes active again, so the badge
     stays accurate without a full page reload.
  ────────────────────────────────────────────────────────── */
  function updateCartBadge (count) {
    var badge = document.querySelector('.sd-cart-badge');
    var btn   = document.querySelector('.sd-cart-btn');
    if (!btn) return;

    if (count > 0) {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'sd-cart-badge';
        badge.setAttribute('aria-hidden', 'true');
        btn.appendChild(badge);
      }
      badge.textContent = count > 99 ? '99+' : String(count);
      btn.setAttribute('aria-label', 'Cart (' + count + ' items)');
    } else {
      if (badge) badge.remove();
      btn.setAttribute('aria-label', 'Cart');
    }
  }

  function fetchCartCount () {
    fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (data) { updateCartBadge(data.item_count); })
      .catch(function () {});
  }

  /* Poll on visibility change (tab re-focus, return from checkout) */
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') fetchCartCount();
  });

  /* Listen for Dawn-compatible cart events */
  document.addEventListener('cart:updated', function (e) {
    if (e.detail && typeof e.detail.itemCount !== 'undefined') {
      updateCartBadge(e.detail.itemCount);
    }
  });

  /* ── Boot ──────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStickyHeader);
  } else {
    initStickyHeader();
  }
}());
