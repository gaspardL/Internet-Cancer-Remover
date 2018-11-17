
emoji = [0x1F600]; // 😀
console.log(emoji);
console.log(String.fromCodePoint(emoji));

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

    currentElement.textContent = currentElement.textContent.replace(String.fromCodePoint(emoji), ':)');
    
}