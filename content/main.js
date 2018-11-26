var NodeType = {
    ELEMENT: 1,
    ATTRIBUTE: 2,
    TEXT: 3,
    COMMENT: 8
};



function iterativeProcessing(){

    var elementStack = [];
    elementStack.push(document.body);

    while(elementStack.length != 0){
        let currentElement = elementStack.pop();
    
        for(let i = currentElement.childNodes.length-1; i >= 0 ; i--){
            if(currentElement.childNodes[i].nodeType != NodeType.COMMENT &&
               currentElement.childNodes[i].nodeType != NodeType.ATTRIBUTE){
                elementStack.push(currentElement.childNodes[i]);
            }
        }
        if(currentElement.nodeType != NodeType.TEXT) continue;
    
        for(let i = 0; i < currentElement.textContent.length; i++){
            let character = currentElement.textContent.codePointAt(i);
            if (character < MAX_LIMIT_NO_EMOJI) continue;
    
            if (emojis[character] != undefined){
                currentElement.textContent = currentElement.textContent.replace(String.fromCodePoint(character), emojis[character]);
            }
        }
    }
}

function recursiveProcessing(currentElement){

    for(let i = 0; i < currentElement.childNodes.length; i++){
        if(currentElement.childNodes[i].nodeType != NodeType.COMMENT &&
            currentElement.childNodes[i].nodeType != NodeType.ATTRIBUTE){
            recursiveProcessing(currentElement.childNodes[i]);
        }
    }
    if(currentElement.nodeType != NodeType.TEXT) return;

    for(let i = 0; i < currentElement.textContent.length; i++){
        let character = currentElement.textContent.codePointAt(i);
        if (character < MAX_LIMIT_NO_EMOJI) continue;

        if (emojis[character] != undefined){
            currentElement.textContent = currentElement.textContent.replace(String.fromCodePoint(character), emojis[character]);
        }
    }

}

var t0 = performance.now();

iterativeProcessing();
// recursiveProcessing(document.body);

var t1 = performance.now();
console.log("Performances : ", (t1 - t0), " milliseconds.");