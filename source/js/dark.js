(function() {
    /**
    * Icarus dark mode by smileorigin
    * https://smileorigin.site/
    * Thanks:
    *   - https://github.com/imaegoo/hexo-theme-icarus
    *   - https://github.com/removeif/hexo-theme-amazing
    */ 
    const DARK_KEY = 'dark-mode';
    const DARK_CLASS = 'dark';

    let darkSwitchBtn;
    let darkSwitchIcon;
    let darkConf = JSON.parse(localStorage.getItem(DARK_KEY)) || { isDark: false, modifyDate: new Date('1976-04-01').toString() };
    let isDark = darkConf.isDark;

    function init() {
        // expiration time judgment
        // 1. the dark mode is not reset after 8am that day
        // 2. the day mode will not be reset after 10pm that day
        const modifyDate = new Date(darkConf.modifyDate);

        const nowDate = new Date();
        const hour = nowDate.getHours();

        const nowDateString = nowDate.toString();
        const todayDate = nowDateString.substr(0, 16);
        const timeZone = nowDateString.substr(24);
        // Morning
        const todayMorning = new Date(todayDate + '07:00:00' + timeZone);
        // Evening
        const todayEvening = new Date(todayDate + '19:00:00' + timeZone);
        // Yesterday
        const yesterdayEvening = new Date(todayDate + '00:00:00' + timeZone) - 5 * 60 * 60 * 1000;

        if (hour < 7 || hour >= 19) {
            // dark
            if (isDark) {
                switchMode();
            } else {
                if (!(modifyDate >= todayEvening || (hour < 7 && modifyDate >= yesterdayEvening))) {
                    // invalid, dark
                    isDark = true;
                    switchMode();
                    saveConf();
                }
            }
        } else {
            // day
            if (isDark && modifyDate >= todayMorning) {
                // valid
                switchMode();
            } else {
                // invalid
                isDark = false;
                saveConf();
            }
        }
    }

    function initEvent() {
        darkSwitchBtn = document.getElementById('dark-switch');
        darkSwitchIcon = document.getElementById('dark-icon');
        if (!darkSwitchBtn || !darkSwitchIcon) {
            setTimeout(initEvent, 100);
        } else {
            darkSwitchIcon.classList = getIconClass(isDark);
            darkSwitchBtn.addEventListener('click', () => {
                isDark = !isDark;
                switchMode();
                saveConf();
            });
        }
    }

    function saveConf() {
        darkConf.isDark = isDark;
        darkConf.modifyDate = new Date();
        localStorage.setItem(DARK_KEY, JSON.stringify(darkConf));
    }

    function switchMode() {
        let iconClassList;

        if (isDark) {
            document.body.classList.add(DARK_CLASS);
        } else {
            document.body.classList.remove(DARK_CLASS);
        }

        if (darkSwitchIcon) {
            darkSwitchIcon.classList = getIconClass(isDark);
        }
    }

    function getIconClass(isDark) {
        return isDark ? 'fas fa-sun' : 'fas fa-moon';
    }

    init();
    initEvent();
}())
