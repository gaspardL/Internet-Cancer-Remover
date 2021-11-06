const MAX_LIMIT_NO_EMOJI = 8204;

const OPTIONS_VERSION = 1;

const KeepEmojis = {
    NONE: 'none',
    ALL: 'all',
    FIRST: 'first'
};

function getOptions() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(["version", "keepEmojis", "replaceEmojis", "displayOriginals", "visibleAlteration"], 
        (options) => {
            options = updateOptions(options);
            chrome.runtime.lastError ? reject() : resolve(options);
        });
    });
}

function updateOptions(options) {
    if (options.version === OPTIONS_VERSION) return options;

    var updatedOptions = {
        version: OPTIONS_VERSION
    };

    if (!options.version) {
        updatedOptions.keepEmojis = KeepEmojis.ALL;
        updatedOptions.replaceEmojis = true;
        updatedOptions.displayOriginals = true;
        updatedOptions.visibleAlteration = true;
    }

    chrome.storage.sync.set(updatedOptions);
    return updatedOptions;
}

var emojis = {
    0x1F601: [{ characters: [0xDE01], replacementText: "^^" }], // 😁
    0x1F602: [{ characters: [0xDE02], replacementText: "x'D" }], // 😂
    0x1F605: [{ characters: [0xDE05], replacementText: "^^'" }], // 😅
    0x1F606: [{ characters: [0xDE06], replacementText: "xD" }], // 😆
    0x1F609: [{ characters: [0xDE09], replacementText: ";)" }], // 😉
    0x1F60D: [{ characters: [0xDE0D], replacementText: "<3" }], // 😍
    0x1F60F: [{ characters: [0xDE0F], replacementText: ";p" }], // 😏
    0x1F614: [{ characters: [0xDE14], replacementText: ":(" }], // 😔
    0x1F618: [{ characters: [0xDE18], replacementText: ";*" }], // 😘
    0x1F61C: [{ characters: [0xDE1C], replacementText: ";D" }], // 😜
    0x1F61D: [{ characters: [0xDE1D], replacementText: "XP" }], // 😝
    0x1F62D: [{ characters: [0xDE2D], replacementText: "D':" }], // 😭
    0x1F631: [{ characters: [0xDE31], replacementText: "xO" }], // 😱
    0x1F923: [{ characters: [0xDD23], replacementText: "XD" }], // 🤣
};
