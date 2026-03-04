/* ============================================================
   Supply District — theme.js
   Global JS: sticky header via IntersectionObserver.
   ============================================================ */

(function () {
  'use strict';

  /* ── Sticky header ─────────────────────────────────────────
     Watch the announcement bar sentinel. Once it leaves the
     viewport (scrolled past), pin the header to the top and
     add a body padding offset so content doesn't jump.
  ────────────────────────────────────────────────────────── */
  function initStickyHeader () {
    var header   = document.getElementById('sd-header');
    var announce = document.getElementById('sd-announce-bar');

    if (!header) return;

    /* If there's no announcement bar, watch a 1px sentinel at
       the very top of <main> instead. */
    var sentinel = announce || document.querySelector('main');
    if (!sentinel) return;

    var observer = new IntersectionObserver(
      function (entries) {
        var entry = entries[0];
        if (!entry.isIntersecting) {
          /* Announcement bar has scrolled out → sticky */
          header.classList.add('is-sticky');
          document.body.classList.add('sd-sticky-active');
          /* Update body padding to match actual header height */
          document.body.style.paddingTop = header.offsetHeight + 'px';
        } else {
          /* Back in view → restore */
          header.classList.remove('is-sticky');
          document.body.classList.remove('sd-sticky-active');
          document.body.style.paddingTop = '';
        }
      },
      {
        threshold: 0,
        rootMargin: '0px'
      }
    );

    observer.observe(sentinel);

    /* Re-calculate padding on resize */
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (header.classList.contains('is-sticky')) {
          document.body.style.paddingTop = header.offsetHeight + 'px';
        }
      }, 100);
    });
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
