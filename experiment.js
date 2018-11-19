
emoji = {
    0x1F601: "^^", // 😁
    0x1F606: "xD", // 😆
    0x1F923: "XD", // 🤣
    0x1F602: "x'D", // 😂
    0x1F609: ";)", // 😉
    0x1F60D: "<3", // 😍
    0x1F618: ";*", // 😘
    0x1F61C: ";D", // 😜
    0x1F61D: "XP", // 😝
    0x1F60F: ";p", // 😏
    0x1F614: ":(", // 😔
    0x1F62D: "D':", // 😭
    0x1F631: "xO", // 😱
};
var MAX_LIMIT_NO_EMOJI = 8204;


var NodeType = {
    ELEMENT: 1,
    ATTRIBUTE: 2,
    TEXT: 3,
    COMMENT: 8
};

var elementStack = [];
elementStack.push(document.body);


while(elementStack.length != 0){
    let currentElement = elementStack.pop();

    for(let i = 0; i < currentElement.childNodes.length; i++){
        if(currentElement.childNodes[i].nodeType != NodeType.COMMENT &&
           currentElement.childNodes[i].nodeType != NodeType.ATTRIBUTE){
            elementStack.push(currentElement.childNodes[i]);
        }
    }
    if(currentElement.nodeType != NodeType.TEXT) continue;

    for(let i = 0; i < currentElement.textContent.length; i++){
        let character = currentElement.textContent.codePointAt(i);
        if (character < MAX_LIMIT_NO_EMOJI) continue;

        if (emoji[character] != undefined){
            currentElement.textContent = currentElement.textContent.replace(String.fromCodePoint(character), emoji[character]);
        }
    }
}