function injectToHead(code) {
    let styleTag = document.createElement("style");
    styleTag.innerHTML = code;
    document.head.appendChild(styleTag);
}

function CssInjector(code) {
    if (!document.head) {
        let mutationTarget = document.querySelector('html');
        let observer = new MutationObserver((mutations) => {
            if (document.head) {
                observer.disconnect();
                injectToHead(code);
            }
        });

        let config = { childList: true };
        observer.observe(mutationTarget, config);
    }

    injectToHead(code);
};

export default CssInjector;