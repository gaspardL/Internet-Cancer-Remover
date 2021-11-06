getOptions().then((_options) => {

    options = _options;

    console.log('options', options);
    if  (options.keepEmojis === KeepEmojis.ALL && !options.replaceEmojis) {
        return;
    }

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
