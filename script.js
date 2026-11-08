(function () {
    'use strict';

    // Avisa al CSS de que JavaScript está activo (para las animaciones de scroll)
    document.documentElement.classList.add('js');

    /* ===== MODO OSCURO ===== */
    var body = document.body;
    var toggleBtn = document.getElementById('themeToggle');
    var toggleText = document.getElementById('themeToggleText');
    var toggleIcon = toggleBtn.querySelector('i');
    var themeMeta = document.getElementById('themeColorMeta');
    var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function getSavedTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (e) {
            return null;
        }
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            /* localStorage no disponible: se ignora */
        }
    }

    function applyTheme(theme) {
        var isDark = theme === 'dark';
        body.classList.toggle('dark', isDark);
        toggleBtn.setAttribute('aria-pressed', String(isDark));
        toggleIcon.classList.toggle('fa-moon', !isDark);
        toggleIcon.classList.toggle('fa-sun', isDark);
        toggleText.textContent = isDark ? 'Modo claro' : 'Modo oscuro';
        if (themeMeta) {
            themeMeta.setAttribute('content', isDark ? '#292522' : '#FAF7F2');
        }
    }

    // Tema inicial: preferencia guardada o preferencia del sistema
    var savedTheme = getSavedTheme();
    applyTheme(savedTheme ? savedTheme : (mediaQuery.matches ? 'dark' : 'light'));

    toggleBtn.addEventListener('click', function () {
        var newTheme = body.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(newTheme);
        saveTheme(newTheme);
    });

    // Si la persona no ha elegido tema, sigue los cambios del sistema
    var onSystemChange = function (e) {
        if (!getSavedTheme()) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    };
    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', onSystemChange);
    } else if (mediaQuery.addListener) {
        mediaQuery.addListener(onSystemChange);
    }

    /* ===== MENÚ MÓVIL: se cierra al elegir un enlace ===== */
    var menu = document.getElementById('menuPrincipal');
    document.querySelectorAll('#menuPrincipal .nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            if (menu.classList.contains('show')) {
                bootstrap.Collapse.getOrCreateInstance(menu).hide();
            }
        });
    });

    /* ===== ANIMACIONES AL HACER SCROLL ===== */
    var revealItems = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealItems.forEach(function (item) { revealObserver.observe(item); });
    } else {
        revealItems.forEach(function (item) { item.classList.add('visible'); });
    }

    /* ===== ENLACE ACTIVO SEGÚN LA SECCIÓN ===== */
    var sections = document.querySelectorAll('header[id], section[id]');
    var navLinks = document.querySelectorAll('.navbar .nav-link');

    if ('IntersectionObserver' in window) {
        var navObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    navLinks.forEach(function (link) {
                        var active = link.getAttribute('href') === '#' + entry.target.id;
                        link.classList.toggle('active', active);
                        if (active) {
                            link.setAttribute('aria-current', 'page');
                        } else {
                            link.removeAttribute('aria-current');
                        }
                    });
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach(function (section) { navObserver.observe(section); });
    }

    /* ===== FORMULARIO DE CONTACTO (solo demostración) ===== */
    var form = document.getElementById('contactForm');
    var formMessage = document.getElementById('formMessage');
    var hideTimer = null;

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            var firstInvalid = form.querySelector(':invalid');
            if (firstInvalid) { firstInvalid.focus(); }
            return;
        }

        // No se envía nada: es solo una demostración
        formMessage.textContent = 'Formulario de demostración: tu mensaje no se envió realmente. ' +
            'Si quieres escribirme, usa mi correo o mi teléfono.';
        formMessage.classList.remove('d-none');
        form.reset();
        form.classList.remove('was-validated');

        clearTimeout(hideTimer);
        hideTimer = setTimeout(function () {
            formMessage.classList.add('d-none');
        }, 8000);
    });

    /* ===== IMÁGENES: respaldo si alguna no carga ===== */
    var fallbackSvg = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750">' +
        '<rect width="600" height="750" fill="#E8D5C4"/>' +
        '<text x="50%" y="50%" fill="#6F5145" font-family="Arial" font-size="24" ' +
        'text-anchor="middle" dominant-baseline="middle">Imagen no disponible</text></svg>'
    );

    document.querySelectorAll('img').forEach(function (img) {
        img.addEventListener('error', function handler() {
            img.removeEventListener('error', handler);
            img.src = fallbackSvg;
        });
    });
})();