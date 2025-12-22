const saveOptions = () => {
    const sheetUrl = document.getElementById('sheetUrl').value;
    
    chrome.storage.sync.set({ sheetUrl: sheetUrl }, () => {
        const status = document.getElementById('status');
        status.textContent = 'Options saved. Open a new tab to see changes.';
        setTimeout(() => {
            status.textContent = '';
        }, 3000);
    });
};

const restoreOptions = () => {
    chrome.storage.sync.get(['sheetUrl'], (result) => {
        document.getElementById('sheetUrl').value = result.sheetUrl || '';
    });
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
