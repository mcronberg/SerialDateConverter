const excelInput = document.getElementById('excelInput');
const dateInput = document.getElementById('dateInput');
const timeInput = document.getElementById('timeInput');
const langToggle = document.getElementById('langToggle');
const pastTableBody = document.getElementById('pastTableBody');
const futureTableBody = document.getElementById('futureTableBody');

// Version (IMPORTANT: Also update VERSION in sw.js when changing this!)
const VERSION = '1.3';

// State
let currentLang = 'en';
if (navigator.language.startsWith('da')) currentLang = 'da';
else if (navigator.language.startsWith('no') || navigator.language.startsWith('nb') || navigator.language.startsWith('nn')) currentLang = 'no';
else if (navigator.language.startsWith('sv')) currentLang = 'sv';
else if (navigator.language.startsWith('de')) currentLang = 'de';
console.log('Detected browser language:', navigator.language, '-> App language:', currentLang);

// Analytics Config
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScSDy6fpUQ6qRHeKkCBubmmWRaBYk62YSQTQgWi4OfjHip8yQ/formResponse';
const FORM_ENTRIES = {
    action: 'entry.120135522',
    userAgent: 'entry.270316851',
    language: 'entry.1449451373',
    screen: 'entry.119083653',
    appName: 'entry.98806864'
};

// Translations
const translations = {
    en: {
        title: `Serial Date Converter v${VERSION}`,
        subtitle: 'Easily convert between formats',
        labelExcel: 'Excel Serial Number',
        labelDate: 'Date & Time',
        quickReference: 'Quick Reference',
        colDescription: 'Description',
        colExcel: 'Excel',
        colDate: 'Date',
        headerPast: 'Past',
        headerFuture: 'Future',
        refToday: 'Today',
        refLastMonday: 'Last Monday',
        refWeekAgo: 'A week ago',
        refMonthAgo: 'A month ago',
        refStartOfYear: 'Start of year',
        refTomorrow: 'Tomorrow',
        refNextMonday: 'Next Monday',
        refInWeek: 'In a week',
        refInMonth: 'In a month',
        refEndOfYear: 'End of year',
        refStartOfNextYear: 'Start of next year',
        refEndOfNextYear: 'End of next year'
    },
    da: {
        title: `Serial Date Converter v${VERSION}`,
        subtitle: 'Konverter nemt mellem formater',
        labelExcel: 'Excel Serienummer',
        labelDate: 'Dato & Tid',
        quickReference: 'Hurtig Reference',
        colDescription: 'Beskrivelse',
        colExcel: 'Excel',
        colDate: 'Dato',
        headerPast: 'Fortid',
        headerFuture: 'Fremtid',
        refToday: 'I dag',
        refLastMonday: 'Sidste mandag',
        refWeekAgo: 'For en uge siden',
        refMonthAgo: 'For en måned siden',
        refStartOfYear: 'Starten af året',
        refTomorrow: 'I morgen',
        refNextMonday: 'Næste mandag',
        refInWeek: 'Om en uge',
        refInMonth: 'Om en måned',
        refEndOfYear: 'Slutningen af året',
        refStartOfNextYear: 'Starten af næste år',
        refEndOfNextYear: 'Slutningen af næste år'
    },
    sv: {
        title: `Serial Date Converter v${VERSION}`,
        subtitle: 'Konvertera enkelt mellan format',
        labelExcel: 'Excel Serienummer',
        labelDate: 'Datum & Tid',
        quickReference: 'Snabbreferens',
        colDescription: 'Beskrivning',
        colExcel: 'Excel',
        colDate: 'Datum',
        headerPast: 'Förflutet',
        headerFuture: 'Framtid',
        refToday: 'Idag',
        refLastMonday: 'Senaste måndag',
        refWeekAgo: 'För en vecka sedan',
        refMonthAgo: 'För en månad sedan',
        refStartOfYear: 'Årets början',
        refTomorrow: 'Imorgon',
        refNextMonday: 'Nästa måndag',
        refInWeek: 'Om en vecka',
        refInMonth: 'Om en månad',
        refEndOfYear: 'Årets slut',
        refStartOfNextYear: 'Nästa års början',
        refEndOfNextYear: 'Nästa års slut'
    },
    de: {
        title: `Serial Date Converter v${VERSION}`,
        subtitle: 'Einfach zwischen Formaten konvertieren',
        labelExcel: 'Excel Seriennummer',
        labelDate: 'Datum & Uhrzeit',
        quickReference: 'Schnellreferenz',
        colDescription: 'Beschreibung',
        colExcel: 'Excel',
        colDate: 'Datum',
        headerPast: 'Vergangenheit',
        headerFuture: 'Zukunft',
        refToday: 'Heute',
        refLastMonday: 'Letzter Montag',
        refWeekAgo: 'Vor einer Woche',
        refMonthAgo: 'Vor einem Monat',
        refStartOfYear: 'Jahresbeginn',
        refTomorrow: 'Morgen',
        refNextMonday: 'Nächster Montag',
        refInWeek: 'In einer Woche',
        refInMonth: 'In einem Monat',
        refEndOfYear: 'Jahresende',
        refStartOfNextYear: 'Beginn nächstes Jahr',
        refEndOfNextYear: 'Ende nächstes Jahr'
    },
    no: {
        title: `Serial Date Converter v${VERSION}`,
        subtitle: 'Konverter enkelt mellom formater',
        labelExcel: 'Excel Serienummer',
        labelDate: 'Dato & Tid',
        quickReference: 'Hurtigreferanse',
        colDescription: 'Beskrivelse',
        colExcel: 'Excel',
        colDate: 'Dato',
        headerPast: 'Fortid',
        headerFuture: 'Fremtid',
        refToday: 'I dag',
        refLastMonday: 'Siste mandag',
        refWeekAgo: 'For en uke siden',
        refMonthAgo: 'For en måned siden',
        refStartOfYear: 'Årets begynnelse',
        refTomorrow: 'I morgen',
        refNextMonday: 'Neste mandag',
        refInWeek: 'Om en uke',
        refInMonth: 'Om en måned',
        refEndOfYear: 'Årets slutt',
        refStartOfNextYear: 'Neste års begynnelse',
        refEndOfNextYear: 'Neste års slutt'
    }
};

// Constants
const MS_PER_DAY = 86400000;

// Utils
function getExcelSerial(dateObj) {
    const utcDate = Date.UTC(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        dateObj.getHours(),
        dateObj.getMinutes(),
        dateObj.getSeconds()
    );

    const baseDate = Date.UTC(1899, 11, 30);
    const diffTime = utcDate - baseDate;
    const serial = diffTime / MS_PER_DAY;

    return serial;
}

function getDateFromExcel(serial) {
    const baseDate = Date.UTC(1899, 11, 30);
    const targetTime = baseDate + (serial * MS_PER_DAY);
    return new Date(targetTime);
}

function updateFromDateInputs() {
    const dateVal = dateInput.value;
    const timeVal = timeInput.value || '00:00';

    if (dateVal) {
        const fullDateStr = `${dateVal}T${timeVal}`;
        const date = new Date(fullDateStr);
        excelInput.value = getExcelSerial(date);
        debouncedLog('DateToExcel');
    } else {
        excelInput.value = '';
    }
}

// Analytics Logger
function logToGoogle(action) {
    const data = new FormData();
    data.append(FORM_ENTRIES.action, action);
    data.append(FORM_ENTRIES.userAgent, navigator.userAgent);
    data.append(FORM_ENTRIES.language, navigator.language);
    data.append(FORM_ENTRIES.screen, `${window.screen.width}x${window.screen.height}`);
    data.append(FORM_ENTRIES.appName, 'SerialDateConverter');

    fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        mode: 'no-cors', // Important to avoid CORS errors
        body: data
    }).catch(err => console.error('Logging failed', err));
}

// Debounce function to prevent spamming logs
let debounceTimer;
function debouncedLog(action) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        logToGoogle(action);
    }, 2000); // Log after 2 seconds of inactivity
}

// Event Listeners
excelInput.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
        const dateObj = getDateFromExcel(val);

        const year = dateObj.getUTCFullYear();
        const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getUTCDate()).padStart(2, '0');
        const hours = String(dateObj.getUTCHours()).padStart(2, '0');
        const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');

        dateInput.value = `${year}-${month}-${day}`;
        timeInput.value = `${hours}:${minutes}`;
        debouncedLog('ExcelToDate');
    } else {
        dateInput.value = '';
        timeInput.value = '00:00';
    }
});

dateInput.addEventListener('input', updateFromDateInputs);
timeInput.addEventListener('input', updateFromDateInputs);

const langToggleBtn = document.getElementById('langToggle');
const langMenu = document.getElementById('langMenu');
const currentLangSpan = document.getElementById('currentLang');

langToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    langMenu.classList.toggle('hidden');
});

document.addEventListener('click', () => {
    langMenu.classList.add('hidden');
});

document.querySelectorAll('.lang-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentLang = e.target.getAttribute('data-lang');
        updateLanguage();
        logToGoogle(`LanguageSwitch:${currentLang}`);
        langMenu.classList.add('hidden');
    });
});

function updateLanguage() {
    const langMap = {
        'en': '<span class="fi fi-gb"></span> EN',
        'da': '<span class="fi fi-dk"></span> DA',
        'no': '<span class="fi fi-no"></span> NO',
        'sv': '<span class="fi fi-se"></span> SV',
        'de': '<span class="fi fi-de"></span> DE'
    };
    currentLangSpan.innerHTML = langMap[currentLang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });

    renderTables();
}

function getRelativeDate(type) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(today);

    switch (type) {
        case 'refToday': return d;
        case 'refLastMonday': d.setDate(today.getDate() - (today.getDay() + 6) % 7); return d;
        case 'refWeekAgo': d.setDate(today.getDate() - 7); return d;
        case 'refMonthAgo': d.setMonth(today.getMonth() - 1); return d;
        case 'refStartOfYear': return new Date(today.getFullYear(), 0, 1);
        case 'refTomorrow':
            d.setDate(today.getDate() + 1);
            return d;
        case 'refNextMonday':
            d.setDate(today.getDate() + (1 + 7 - today.getDay()) % 7);
            if (today.getDay() === 1) d.setDate(today.getDate() + 7);
            return d;
        case 'refInWeek': d.setDate(today.getDate() + 7); return d;
        case 'refInMonth': d.setMonth(today.getMonth() + 1); return d;
        case 'refEndOfYear': return new Date(today.getFullYear(), 11, 31);
        case 'refStartOfNextYear': return new Date(today.getFullYear() + 1, 0, 1);
        case 'refEndOfNextYear': return new Date(today.getFullYear() + 1, 11, 31);
        default: return d;
    }
}

function createRow(key) {
    const date = getRelativeDate(key);
    const excel = getExcelSerial(date);
    const dateStr = date.toLocaleDateString(currentLang === 'da' ? 'da-DK' : 'en-GB');

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-white/5 transition-colors';
    tr.innerHTML = `
        <td class="px-4 py-3 text-slate-300">${translations[currentLang][key]}</td>
        <td class="px-4 py-3 text-right font-mono text-teal-400">${excel}</td>
        <td class="px-4 py-3 text-right text-slate-400">${dateStr}</td>
    `;
    return tr;
}

function renderTables() {
    pastTableBody.innerHTML = '';
    futureTableBody.innerHTML = '';

    const pastRows = [
        'refToday',
        'refLastMonday',
        'refWeekAgo',
        'refMonthAgo',
        'refStartOfYear',
        'refEndOfYear'
    ];

    const futureRows = [
        'refTomorrow',
        'refNextMonday',
        'refInWeek',
        'refInMonth',
        'refStartOfNextYear',
        'refEndOfNextYear'
    ];

    pastRows.forEach(key => pastTableBody.appendChild(createRow(key)));
    futureRows.forEach(key => futureTableBody.appendChild(createRow(key)));
}

// Init
updateLanguage();
dateInput.focus();
logToGoogle('AppLoad');
