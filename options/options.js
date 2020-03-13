function restore_options() {
    getOptions().then((options) => {
        document.getElementById('deleteEmojis' + (options.deleteEmojis ? "1" : "0")).checked = true;
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