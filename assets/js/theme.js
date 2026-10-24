/* Apply the theme before the first paint, independently of the page's plugins. */
(function () {
    'use strict';

    var storageKey = 'portfolio-theme';
    var root = document.documentElement;
    var systemTheme = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    var preference = null;

    function validTheme(value) {
        return value === 'light' || value === 'dark';
    }

    try {
        var storedTheme = window.localStorage.getItem(storageKey);
        if (validTheme(storedTheme)) preference = storedTheme;
    } catch (error) {
        // The toggle still works when browser storage is unavailable.
    }

    function applyTheme() {
        var theme = preference || (systemTheme && systemTheme.matches ? 'dark' : 'light');
        root.setAttribute('data-theme', theme);

        var themeColor = document.querySelector('meta[name="theme-color"]');
        if (themeColor) themeColor.setAttribute('content', theme === 'dark' ? '#161b20' : '#ffffff');

        var toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            toggle.setAttribute('aria-pressed', String(theme === 'dark'));
            toggle.setAttribute('title', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
        }
    }

    applyTheme();

    function initializeToggle() {
        var toggle = document.querySelector('.theme-toggle');
        if (!toggle) return;

        applyTheme();
        toggle.removeAttribute('hidden');
        toggle.addEventListener('click', function () {
            preference = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme();
            try {
                window.localStorage.setItem(storageKey, preference);
            } catch (error) {
                // Keep the selection for this page even if it cannot be saved.
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeToggle);
    } else {
        initializeToggle();
    }

    // Follow device changes until the visitor explicitly chooses a theme.
    if (systemTheme) {
        if (systemTheme.addEventListener) {
            systemTheme.addEventListener('change', applyTheme);
        } else if (systemTheme.addListener) {
            systemTheme.addListener(applyTheme);
        }
    }

    // Also keep other tabs and the embedded UX Process page in sync.
    window.addEventListener('storage', function (event) {
        if (event.key !== storageKey && event.key !== null) return;
        preference = validTheme(event.newValue) ? event.newValue : null;
        applyTheme();
    });
}());
