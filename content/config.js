var emojis = {
    0x1F601: "^^", // 😁
    0x1F602: "x'D", // 😂
    0x1F605: "^^'", // 😅
    0x1F606: "xD", // 😆
    0x1F609: ";)", // 😉
    0x1F60D: "<3", // 😍
    0x1F60F: ";p", // 😏
    0x1F614: ":(", // 😔
    0x1F618: ";*", // 😘
    0x1F61C: ";D", // 😜
    0x1F61D: "XP", // 😝
    0x1F62D: "D':", // 😭
    0x1F631: "xO", // 😱
    0x1F923: "XD", // 🤣
};
var MAX_LIMIT_NO_EMOJI = 8204;

function getOptions() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get({
            version: 1,
            deleteEmojis: false
        }, function(items) {
            items = updateOptions(items);
            chrome.runtime.lastError ? reject() : resolve(items);
        });
    });
}

// When changing this function, change also in options/options.js
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