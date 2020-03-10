var NodeType = {
    ELEMENT: 1,
    ATTRIBUTE: 2,
    TEXT: 3,
    COMMENT: 8
};

var options;


function iterativeProcessing(rootElement){

    var elementStack = [];
    elementStack.push(rootElement);

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
                var toReplace = options.deleteEmojis ? "" : emojis[character] + " ";
                currentElement.textContent = currentElement.textContent.replace(String.fromCodePoint(character), toReplace);
            }
        }
    }
}

function mainTask(rootElement) {
    
    let t0 = performance.now();

    iterativeProcessing(rootElement);
    // recursiveProcessing(rootElement);

    let t1 = performance.now();
    console.log("Performances : ", (t1 - t0), " milliseconds.");
}

getOptions().then(_options => {
    options = _options;
    console.log("options", options);

    mainTask(document.body);

    const config = { attributes: false, childList: true, subtree: true };
    const observer = new MutationObserver(function(mutationsList) {
        for(let mutation of mutationsList) {
            for(let addedNode of mutation.addedNodes) {
                mainTask(addedNode);
            }
        }
    });
    observer.observe(document.body, config);
});
