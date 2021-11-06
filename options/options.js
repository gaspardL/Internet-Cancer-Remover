function id(idString) {
    return document.getElementById(idString);
}

function restore_options() {
    getOptions().then((options) => {
        id('keepEmojis_' + options.keepEmojis).checked = true;
        id('replaceEmojis').disabled = options.keepEmojis === KeepEmojis.NONE;
        id('replaceEmojis').checked = options.replaceEmojis;
        id('displayOriginals').checked = options.displayOriginals;
        id('visibleAlteration').checked = options.visibleAlteration;
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
    id('visibleAlteration').checked = true;
    updateValidity();
}

function getOptionValues() {
    return {
        keepEmojis: document.querySelector('input[name="keepEmojis"]:checked').value,
        replaceEmojis: id('replaceEmojis').checked,
        displayOriginals: id('displayOriginals').checked,
        visibleAlteration: id('visibleAlteration').checked
    };
}

function save() {
    chrome.storage.sync.set(getOptionValues(), () => {
        displayStatus();
    });
}

function updateValidity() {
    let keepEmojis = document.querySelector('input[name="keepEmojis"]:checked').value;
    id('replaceEmojis').disabled = keepEmojis === KeepEmojis.NONE;
    if (id('replaceEmojis').disabled) {
        id('replaceEmojis').checked = false;
    }
    id('displayOriginals').disabled = (keepEmojis !== KeepEmojis.NONE || !id('visibleAlteration').checked) 
        && !id('replaceEmojis').checked && keepEmojis !== KeepEmojis.FIRST;
    if (id('displayOriginals').disabled) {
        id('displayOriginals').checked = false;
    }
    id('visibleAlteration').disabled = !id('replaceEmojis').checked && keepEmojis === KeepEmojis.ALL;
    if (id('visibleAlteration').disabled) {
        id('visibleAlteration').checked = false;
    }
    updateExample();
}

function updateExample() {
    id('exampleDisplayBody').innerHTML = `
    <p>
        OMG 😱 You're killing me 😂😂😂🤣🤣<br />
        I'm so dead 😭😭😭😂
    <p/>
    <p>
        Twitterrrr <img style="height: 1rem;" class="emoji" draggable="false" alt="😉" src="https://abs.twimg.com/emoji/v2/72x72/1f609.png"/><br />
        Facebook <img style="height: 1rem;" class="emoji" draggable="false" alt="😉" src="https://abs.twimg.com/emoji/v2/72x72/1f609.png"/>
    <p/>
    `;
    options = getOptionValues();
    mainTask(id('exampleDisplayBody'));
}

document.addEventListener('DOMContentLoaded', restore_options);
id('resetOptions').addEventListener('click', resetOptions);
id('save').addEventListener('click', save);
id('keepEmojis_none').addEventListener('change', updateValidity);
id('keepEmojis_all').addEventListener('change', updateValidity);
id('keepEmojis_first').addEventListener('change', updateValidity);
id('replaceEmojis').addEventListener('change', updateValidity);
id('displayOriginals').addEventListener('change', updateValidity);
id('visibleAlteration').addEventListener('change', updateValidity);