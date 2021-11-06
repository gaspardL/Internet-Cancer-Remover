function id(idString) {
    return document.getElementById(idString);
}

function restore_options() {
    getOptions().then((options) => {
        id('keepEmojis_' + options.keepEmojis).checked = true;
        id('replaceEmojis').disabled = options.keepEmojis === KeepEmojis.NONE;
        id('replaceEmojis').checked = options.replaceEmojis;
        id('displayOriginals').checked = options.displayOriginals;
        id('invisibleReplacement').checked = options.invisibleReplacement;
        updateValidity();
    });
}

function displayStatus() {
    id('status').style.display = 'block';
    setTimeout(function() {
        id('status').style.display = 'none';
    }, 2000);
}

/** 
 * All emojis are replaced with shadow and mouseover
 */
function resetOptions() {
    id('keepEmojis_all').checked = true;
    id('replaceEmojis').checked = true;
    id('displayOriginals').checked = true;
    id('invisibleReplacement').checked = false;
    updateValidity();
}

function save() {
    chrome.storage.sync.set({
        keepEmojis: document.querySelector('input[name="keepEmojis"]:checked').value,
        replaceEmojis: id('replaceEmojis').checked,
        displayOriginals: id('displayOriginals').checked,
        invisibleReplacement: id('invisibleReplacement').checked
    }, () => {
        displayStatus();
    });
}

function updateValidity() {
    let keepEmojis = document.querySelector('input[name="keepEmojis"]:checked').value;
    id('replaceEmojis').disabled = keepEmojis === KeepEmojis.NONE;
    if (id('replaceEmojis').disabled) {
        id('replaceEmojis').checked = false;
    }
    id('displayOriginals').disabled = (keepEmojis !== KeepEmojis.NONE || id('invisibleReplacement').checked) 
        && !id('replaceEmojis').checked && keepEmojis !== KeepEmojis.FIRST;
    if (id('displayOriginals').disabled) {
        id('displayOriginals').checked = false;
    }
    id('invisibleReplacement').disabled = !id('replaceEmojis').checked && keepEmojis === KeepEmojis.ALL;
    if (id('invisibleReplacement').disabled) {
        id('invisibleReplacement').checked = false;
    }
}

document.addEventListener('DOMContentLoaded', restore_options);
id('resetOptions').addEventListener('click', resetOptions);
id('save').addEventListener('click', save);
id('keepEmojis_none').addEventListener('change', updateValidity);
id('keepEmojis_all').addEventListener('change', updateValidity);
id('keepEmojis_first').addEventListener('change', updateValidity);
id('replaceEmojis').addEventListener('change', updateValidity);
id('displayOriginals').addEventListener('change', updateValidity);
id('invisibleReplacement').addEventListener('change', updateValidity);