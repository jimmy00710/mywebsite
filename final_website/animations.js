(function () {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    var heroSection = document.querySelector('section');

    function runHeroReveal() {
        if (!heroSection) return;
        var items = heroSection.querySelectorAll('.reveal, .reveal-item');
        if (items.length) {
            gsap.from(items, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                stagger: 0.12,
                ease: 'power2.out'
            });
        }
    }

    function initEverythingElse() {
        // Plain, purposeful scroll reveal (fade + small rise, no bounce) —
        // guides reading order down the page.
        document.querySelectorAll('section').forEach(function (section) {
            if (section === heroSection) return;

            section.querySelectorAll('.reveal').forEach(function (el) {
                gsap.from(el, {
                    opacity: 0,
                    y: 35,
                    duration: 0.7,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: el, start: 'top 85%' }
                });
            });

            section.querySelectorAll('.reveal-group').forEach(function (group) {
                var groupItems = group.querySelectorAll('.reveal-item');
                if (!groupItems.length) return;
                gsap.from(groupItems, {
                    opacity: 0,
                    y: 35,
                    duration: 0.7,
                    stagger: 0.12,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: group, start: 'top 82%' }
                });
            });
        });

        // Text mask-reveal: the inner line slides up out of its overflow-hidden
        // wrapper. Used on the single most important heading per section.
        document.querySelectorAll('.maskWrap').forEach(function (wrap) {
            var inner = wrap.querySelector('.maskInner');
            if (!inner) return;
            var inHero = heroSection && heroSection.contains(wrap);
            gsap.fromTo(inner,
                { yPercent: 110 },
                {
                    yPercent: 0,
                    duration: 0.9,
                    ease: 'power3.out',
                    scrollTrigger: inHero ? undefined : { trigger: wrap, start: 'top 85%' },
                    delay: inHero ? 0.1 : 0
                }
            );
        });

        // Section color-wipe: a curtain in the PREVIOUS section's color
        // scales away top-to-bottom as the new section scrolls into view —
        // visually marks "you've moved to a new part of the story."
        document.querySelectorAll('.sectionWipe').forEach(function (wipe) {
            gsap.set(wipe, { transformOrigin: 'bottom', scaleY: 1 });
            gsap.to(wipe, {
                scaleY: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: wipe.closest('section'),
                    start: 'top bottom',
                    end: 'top top',
                    scrub: true
                }
            });
        });

        // Nav active-section tracking — functional wayfinding, not decoration.
        var navLinks = document.querySelectorAll('.navigation a[href^="#"]');
        if (navLinks.length) {
            navLinks.forEach(function (link) {
                var id = link.getAttribute('href').slice(1);
                var target = document.getElementById(id);
                if (!target) return;
                ScrollTrigger.create({
                    trigger: target,
                    start: 'top center',
                    end: 'bottom center',
                    onToggle: function (self) {
                        if (self.isActive) {
                            navLinks.forEach(function (l) { l.classList.remove('navActive'); });
                            link.classList.add('navActive');
                        }
                    }
                });
            });
        }

        // Topbar shadow once scrolled past the hero.
        var topbar = document.querySelector('.main .topbar');
        if (topbar) {
            ScrollTrigger.create({
                start: 'top -80',
                end: 99999,
                toggleClass: { targets: topbar, className: 'scrolled' }
            });
        }

        if (!prefersReducedMotion) {
            // Card hover tilt — tactile feedback that a card is interactive.
            document.querySelectorAll('.serviceCard, .tCard, .tTestimonial').forEach(function (card) {
                card.style.transformStyle = 'preserve-3d';
                card.style.perspective = '600px';
                var bounds;
                card.addEventListener('mouseenter', function () {
                    bounds = card.getBoundingClientRect();
                });
                card.addEventListener('mousemove', function (e) {
                    if (!bounds) bounds = card.getBoundingClientRect();
                    var px = (e.clientX - bounds.left) / bounds.width - 0.5;
                    var py = (e.clientY - bounds.top) / bounds.height - 0.5;
                    gsap.to(card, {
                        rotateY: px * 8,
                        rotateX: -py * 8,
                        duration: 0.4,
                        ease: 'power2.out'
                    });
                });
                card.addEventListener('mouseleave', function () {
                    gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power2.out' });
                });
            });
        }

        // Stats count-up — represents real experience, draws attention to it.
        document.querySelectorAll('[data-count-to]').forEach(function (el) {
            var target = parseFloat(el.getAttribute('data-count-to'));
            var suffix = el.getAttribute('data-count-suffix') || '';
            var proxy = { val: 0 };
            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                once: true,
                onEnter: function () {
                    gsap.to(proxy, {
                        val: target,
                        duration: 1.6,
                        ease: 'power2.out',
                        onUpdate: function () {
                            el.textContent = Math.round(proxy.val) + suffix;
                        }
                    });
                }
            });
        });

        // Learning Journey roadmap: the connecting line draws itself in
        // sync with scroll position — the line's progress IS the content.
        document.querySelectorAll('.draw-path').forEach(function (path) {
            var length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            var trigger = path.closest('[data-draw-trigger]') || path.parentElement;
            gsap.to(path, {
                strokeDashoffset: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: trigger,
                    start: 'top 80%',
                    end: 'bottom 30%',
                    scrub: 1
                }
            });
        });

        var journey = document.querySelector('[data-journey]');
        if (journey) {
            journey.querySelectorAll('.journeyStop').forEach(function (stop) {
                gsap.from(stop, {
                    opacity: 0,
                    scale: 0.5,
                    duration: 0.5,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: stop, start: 'top 75%' }
                });
            });
        }
    }

    var introOverlay = document.getElementById('introOverlay');
    if (introOverlay && !prefersReducedMotion) {
        var introCover = introOverlay.querySelector('.introCover');
        var introLogo = introOverlay.querySelector('.introLogo');
        var introPanels = introOverlay.querySelectorAll('.introPanel');

        gsap.set(introLogo, { opacity: 0, scale: 0.7 });
        gsap.set(introPanels, { yPercent: 0 });

        var tl = gsap.timeline({
            onComplete: function () {
                introOverlay.style.display = 'none';
                ScrollTrigger.refresh();
            }
        });
        tl.to(introLogo, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' })
          .to(introLogo, { opacity: 1, duration: 0.35 })
          .to(introCover, { autoAlpha: 0, duration: 0.45, ease: 'power2.inOut' })
          .to(introPanels, { yPercent: -100, duration: 0.7, stagger: 0.08, ease: 'power3.inOut' }, '-=0.1')
          .add(runHeroReveal, '-=0.35');

        initEverythingElse();
    } else {
        if (introOverlay) introOverlay.style.display = 'none';
        if (!prefersReducedMotion) runHeroReveal();
        initEverythingElse();
    }
})();
