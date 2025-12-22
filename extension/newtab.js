document.addEventListener('DOMContentLoaded', () => {
    initTimer();
    initMonthVisuals();
    loadSheet();
    
    document.getElementById('settings-btn').addEventListener('click', () => {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('options.html'));
        }
    });
});

function initTimer() {
    const countdownEl = document.getElementById('countdown');
    const progressLine = document.getElementById('year-progress-line');
    const percentLeftEl = document.getElementById('percentage-left');
    
    function updateTimer() {
        const now = new Date();
        const currentYear = now.getFullYear();
        const startOfYear = new Date(currentYear, 0, 1);
        // Target: Dec 31st, 23:59:59 of current year
        const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);
        
        const totalDuration = endOfYear - startOfYear;
        const elapsed = now - startOfYear;
        const diff = endOfYear - now;

        // Update Progress Bar
        const percentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
        if (progressLine) {
            progressLine.style.width = `${percentage}%`;
            progressLine.title = `${percentage.toFixed(5)}% of ${currentYear} has passed`;
        }

        // Update Percentage Left Text
        if (percentLeftEl) {
            percentLeftEl.innerText = `${(100 - percentage).toFixed(6)}% LEFT TO HUSTLE`;
        }

        if (diff <= 0) {
            countdownEl.innerText = "YEAR ENDED";
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        const milliseconds = Math.floor(diff % 1000);

        countdownEl.innerHTML = `
            <div class="time-unit"><span class="num">${days}</span><span class="label">days</span></div>
            <div class="time-unit"><span class="num">${hours}</span><span class="label">hrs</span></div>
            <div class="time-unit"><span class="num">${minutes}</span><span class="label">min</span></div>
            <div class="time-unit"><span class="num">${seconds}</span><span class="label">sec</span></div>
            <div class="time-unit ms-unit"><span class="num">${milliseconds.toString().padStart(3, '0')}</span><span class="label">ms</span></div>
        `;
    }

    updateTimer();
    setInterval(updateTimer, 20);
}

function initMonthVisuals() {
    const container = document.getElementById('month-grid');
    const currentMonth = new Date().getMonth(); // 0-11
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    container.innerHTML = ''; // Clear existing content

    for (let i = 0; i < 12; i++) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('month-wrapper');

        const label = document.createElement('span');
        label.classList.add('month-label');
        label.innerText = monthNames[i];

        const box = document.createElement('div');
        box.classList.add('month-box');
        
        // Add tooltip
        box.title = new Date(0, i).toLocaleString('default', { month: 'long' });

        if (i < currentMonth) {
            box.classList.add('past');
        } else if (i === currentMonth) {
            box.classList.add('current');
        } else {
            box.classList.add('future');
        }
        
        wrapper.appendChild(label);
        wrapper.appendChild(box);
        container.appendChild(wrapper);
    }
}

function loadSheet() {
    chrome.storage.sync.get(['sheetUrl'], (result) => {
        const iframe = document.getElementById('task-frame');
        const placeholder = document.getElementById('placeholder-text');

        if (result.sheetUrl) {
            iframe.src = result.sheetUrl;
            iframe.style.display = 'block';
            placeholder.style.display = 'none';
        } else {
            iframe.style.display = 'none';
            placeholder.style.display = 'block';
        }
    });
}
