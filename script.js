const excelInput = document.getElementById('excelInput');
const dateInput = document.getElementById('dateInput');
const timeInput = document.getElementById('timeInput');
const langToggle = document.getElementById('langToggle');
const pastTableBody = document.getElementById('pastTableBody');
const futureTableBody = document.getElementById('futureTableBody');

// State
let currentLang = 'en'; // 'en' or 'da'

// Translations
const translations = {
    en: {
        title: 'SerialDateConverter',
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
        title: 'SerialDateConverter',
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
    } else {
        excelInput.value = '';
    }
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
    } else {
        dateInput.value = '';
        timeInput.value = '00:00';
    }
});

dateInput.addEventListener('input', updateFromDateInputs);
timeInput.addEventListener('input', updateFromDateInputs);

langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'da' : 'en';
    updateLanguage();
});

function updateLanguage() {
    langToggle.textContent = currentLang === 'en' ? 'DA' : 'EN';

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
