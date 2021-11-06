const NodeType = {
    ELEMENT: 1,
    ATTRIBUTE: 2,
    TEXT: 3,
    COMMENT: 8
};

var options;

// function invisibleReplacement(rootElement) {

//     var elementStack = [];
//     elementStack.push(rootElement);

//     while(elementStack.length != 0) {
//         let currentElement = elementStack.pop();
    
//         for(let i = currentElement.childNodes.length-1; i >= 0 ; i--) {
//             if(currentElement.childNodes[i].nodeType != NodeType.COMMENT &&
//                currentElement.childNodes[i].nodeType != NodeType.ATTRIBUTE){
//                 elementStack.push(currentElement.childNodes[i]);
//             }
//         }
//         if(currentElement.nodeType != NodeType.TEXT) continue;
    
//         for(let i = 0; i < currentElement.textContent.length; i++) {
//             let character = currentElement.textContent.codePointAt(i);
//             if (character < MAX_LIMIT_NO_EMOJI) continue;
    
//             if (emojis[character] != undefined) {
//                 var toReplace = options.keepEmojis === 'none' ? '' : emojis[character] + ' ';
//                 currentElement.textContent = currentElement.textContent.replace(String.fromCodePoint(character), toReplace);
//             }
//         }
//     }
// }

function isInsertedElement(element) {
    return element.className && element.className.length > 0 && element.className.includes("internet-cancer-replacement");
}

function nextCharactersMatches(cursor, charactersArray, text) {
    if (text.length < cursor + charactersArray.length) return false;

    for (let i = 0; i < charactersArray.length; i++) {
        if (charactersArray[i] !== text.codePointAt(cursor + 1 + i)) {
            return false;
        }
    }
    return true;
}

function getReplacementText(originalString, replacementText) {
    if (options.keepEmojis === KeepEmojis.NONE && options.invisibleReplacement) {
        return '';
    }
    if (!options.replaceEmojis) {
        replacementText = originalString;
    }
    if (options.keepEmojis === KeepEmojis.NONE) {
        replacementText = '&nbsp;';
    }
    if (!options.displayOriginals) {
        originalString = replacementText;
    }
    return '<span class="internet-cancer-replacement ' + (options.invisibleReplacement ? '' : 'shadowing')
        + '"><span class="replacement-text">' + replacementText + '</span><span class="replaced-text">' + originalString + '</span></span>';
}

function replaceInnerHTML(elementObject) {
    let cursor = 0;
    let text = elementObject.innerHTML;
    while (cursor < text.length) {
        let character = text.codePointAt(cursor);

        if (character > MAX_LIMIT_NO_EMOJI && emojis[character] != undefined) {
            for (let replacementObject of emojis[character]) {

                if (nextCharactersMatches(cursor, replacementObject.characters, text)) {
                    let stringLength = replacementObject.characters.length + 1;
                    let originalString = text.substring(cursor, cursor + stringLength);

                    let toReplace = getReplacementText(originalString, replacementObject.replacementText);
                    
                    text = text.slice(0, cursor) 
                        + toReplace 
                        + text.slice(cursor + stringLength);
                    cursor = cursor + toReplace.length - stringLength;
                    break;
                }
            }
        }
        cursor++;
    }
    elementObject.innerHTML = text;
}

function replaceImage(elementObject) {
    let alt = elementObject.getAttribute('alt');

    if (!alt) return false;

    let character = alt.codePointAt(0);

    if (character > MAX_LIMIT_NO_EMOJI && emojis[character] != undefined) {
        for (let replacementObject of emojis[character]) {

            if (nextCharactersMatches(0, replacementObject.characters, alt)) {
                let originalString = elementObject.outerHTML;

                let toReplace = getReplacementText(originalString, replacementObject.replacementText);
                
                elementObject.outerHTML = toReplace;
                return true;
            }
        }
    }
    return false;
}

function iterativeProcessing(rootElement) {

    let elementStack = [];
    elementStack.push(rootElement);

    while(elementStack.length !== 0) {
        let currentElement = elementStack.pop();

        if (currentElement.nodeName === 'SCRIPT' || isInsertedElement(currentElement)) {
            continue;
        }
        
        let tmpStack = [];
        let containsRowText = false; 
        let hasInsertedElement = false;
        for(let i = currentElement.childNodes.length - 1; i >= 0 ; i--) {

            if (isInsertedElement(currentElement.childNodes[i])) {
                hasInsertedElement = true;
            }
            else if (currentElement.childNodes[i].nodeName === 'IMG') {
                if (replaceImage(currentElement.childNodes[i])) {
                    hasInsertedElement = true;
                }
            }
            else if(currentElement.childNodes[i].nodeType === NodeType.TEXT && currentElement.childNodes[i].textContent.trim().length !== 0) {
                containsRowText = true;
            } 
            else if(![NodeType.COMMENT, NodeType.ATTRIBUTE, NodeType.TEXT].includes(currentElement.childNodes[i].nodeType)) {
                tmpStack.push(currentElement.childNodes[i]);
            }
        }

        if (!containsRowText || hasInsertedElement) {
            elementStack = elementStack.concat(tmpStack);
        } else {
            replaceInnerHTML(currentElement);
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
