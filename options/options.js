// When changing this function, change also in content/config.js
function updateOptions(options) {
    if (options.version === 1) return options;

    var updatedOptions = {
        version: 1,
        deleteEmojis: options.deleteEmojis
    };
    // Versions comparisons ...

    chrome.storage.sync.set(updatedOptions);
    return updateOptions;
}

function restore_options() {
    chrome.storage.sync.get({
        version: 1,
        deleteEmojis: false
    }, function(items) {
        items = updateOptions(items);
        document.getElementById('deleteEmojis' + (items.deleteEmojis ? "1" : "0")).checked = true;
    });
}

function displayStatus(){
    document.getElementById('status').style.display = "block";
    setTimeout(function() {
        document.getElementById('status').style.display = "none";
    }, 2000);
}

function resetOptions(){
    document.getElementById('deleteEmojis0').checked = true;
}

function save(){
    chrome.storage.sync.set({
        deleteEmojis: document.querySelector('input[name="deleteEmojis"]:checked').value === "1"
    }, () => {
        displayStatus();
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('resetOptions').addEventListener('click', resetOptions);
document.getElementById('save').addEventListener('click', save);