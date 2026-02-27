/* ============================
   FULLSCREEN + SIDE MENU JS
   ============================ */

(function () {

    /* =========================================================
       INIT
    ========================================================= */

    function initApp() {
        console.log("JS OK");

        setupEventListeners();
        syncCharacterData();
        updateSideMenuDisplay();
        updatePlayerDisplay();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }

    /* =========================================================
       EVENT LISTENERS
    ========================================================= */

    function setupEventListeners() {

        /* ---- Duplication boutons mobile -> PC ---- */
        duplicateButton('btn-save-mobile', 'btn-save');
        duplicateButton('btn-load-mobile', 'btn-load');
        duplicateButton('btn-reset-mobile', 'btn-reset');

        /* ---- Help ---- */
        document.getElementById('btn-help-mob')
            ?.addEventListener('click', showHelp);

        /* ---- Menus ---- */
        setupClassicMenu();
        setupMobileMenu();

        /* ---- Fullscreen ---- */
        document.getElementById('fullscreen-toggle')
            ?.addEventListener('click', toggleFullscreen);

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

        /* ---- Settings ---- */
        setupSettingsListeners();

        /* ---- Resize ---- */
        window.addEventListener('resize', updateSideMenuDisplay);

        /* ---- ESC key ---- */
        document.addEventListener('keydown', handleKeyDown);
    }

    function duplicateButton(mobileId, pcId) {
        const mobileBtn = document.getElementById(mobileId);
        if (!mobileBtn) return;

        mobileBtn.addEventListener('click', () => {
            document.getElementById(pcId)?.click();
        });
    }

    /* =========================================================
       CLASSIC MENU (FULLSCREEN)
    ========================================================= */

    function setupClassicMenu() {

        document.querySelector('.fullscreen-menu-button')
            ?.addEventListener('click', toggleClassicMenu);

        document.querySelector('.side-close')
            ?.addEventListener('click', closeClassicMenu);

        document.getElementById('menu-overlay')
            ?.addEventListener('click', closeClassicMenu);
    }

    function toggleClassicMenu() {

        const menu = document.getElementById('side-menu-fullscreen');
        const overlay = document.getElementById('menu-overlay');
        const btn = document.querySelector('.fullscreen-menu-button');

        if (!menu) return;

        menu.classList.toggle('open');
        const isOpen = menu.classList.contains('open');

        overlay?.classList.toggle('visible', isOpen);
        document.body.classList.toggle('menu-open', isOpen);

        if (btn) btn.innerHTML = isOpen ? '✕ Personnage' : '☰ Personnage';
    }

    function closeClassicMenu() {
        const menu = document.getElementById('side-menu-fullscreen');
        const overlay = document.getElementById('menu-overlay');
        const btn = document.querySelector('.fullscreen-menu-button');

        if (!menu) return;

        menu.classList.remove('open');
        overlay?.classList.remove('visible');
        document.body.classList.remove('menu-open');

        if (btn) btn.innerHTML = '☰ Personnage';
    }

    /* =========================================================
       MOBILE MENU
    ========================================================= */

    function setupMobileMenu() {

        document.querySelector('.mobile-menu-button')
            ?.addEventListener('click', toggleMobileMenu);

        document.querySelector('.side-close-mobile')
            ?.addEventListener('click', closeMobileMenu);

        document.getElementById('menu-overlay-mobile')
            ?.addEventListener('click', closeMobileMenu);
    }

    function toggleMobileMenu() {

        const menu = document.getElementById('side-menu-mobile');
        const overlay = document.getElementById('menu-overlay-mobile');
        const btn = document.querySelector('.mobile-menu-button');

        if (!menu) return;

        menu.classList.toggle('open');
        const isOpen = menu.classList.contains('open');

        overlay?.classList.toggle('active', isOpen);
        document.body.classList.toggle('menu-mob-open', isOpen);

        if (btn) {
            btn.innerHTML = isOpen ? '✕ Personnage et Menu' : '☰ Personnage et Menu';
        }

        if (isOpen && typeof updatePlayerDisplay === 'function') {
            updatePlayerDisplay();
        }
    }

    function closeMobileMenu() {

        const menu = document.getElementById('side-menu-mobile');
        const overlay = document.getElementById('menu-overlay-mobile');
        const btn = document.querySelector('.mobile-menu-button-mob');

        if (!menu) return;

        menu.classList.remove('open');
        overlay?.classList.remove('active');
        document.body.classList.remove('menu-mob-open');

        if (btn) btn.innerHTML = '☰ Personnage et Menu';
    }

    /* =========================================================
       SETTINGS
    ========================================================= */

    function setupSettingsListeners() {

        document.getElementById('btn-settings-mobile')
            ?.addEventListener('click', () => {
                document.getElementById('settings-overlay-mobile')
                    ?.classList.add('visible');
            });

        document.getElementById('settings-close')
            ?.addEventListener('click', () => {
                document.getElementById('settings-overlay-mobile')
                    ?.classList.remove('visible');
            });
    }

    /* =========================================================
       FULLSCREEN
    ========================================================= */

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
                .catch(err => console.warn(err));
        } else {
            document.exitFullscreen()
                .catch(err => console.warn(err));
        }
    }

    function handleFullscreenChange() {

        const inFs = !!document.fullscreenElement;

        document.body.classList.toggle('fullscreen', inFs);

        if (!inFs) {
            closeClassicMenu();
        }

        updateSideMenuDisplay();
    }

    /* =========================================================
       RESPONSIVE LOGIC
    ========================================================= */

    function updateSideMenuDisplay() {

        const isLargeScreen = window.innerWidth > 900;

        if (isLargeScreen) {
            closeMobileMenu();
        } else {
            closeClassicMenu();
        }
    }

    /* =========================================================
       KEYBOARD
    ========================================================= */

    function handleKeyDown(e) {
        if (e.key === 'Escape') {

            if (document.getElementById('side-menu-fullscreen')?.classList.contains('open')) {
                closeClassicMenu();
                return;
            }

            if (document.getElementById('side-menu-mobile')?.classList.contains('open')) {
                closeMobileMenu();
                return;
            }
        }
    }

    /* =========================================================
       HELP
    ========================================================= */

    function showHelp() {
        alert("Commandes :\nS = Save\nC = Load\nR = Reset\nH = Help");
    }

    function syncCharacterData() {
        console.log("Sync personnage");
    }

})();
