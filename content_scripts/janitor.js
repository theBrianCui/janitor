var colors = ["#66ff66", "#ff9933", "#3399ff", "#33ffff"];
var activeTarget = null;

document.addEventListener("contextmenu", (e) => {
    console.log("Context menu called from: " + e.clientX + ", " + e.clientY);
    activeTarget = e.target;

    let node = activeTarget;
    let i = 0;
    do {
        node.style.outline = colors[i] + " solid 4px";
    } while ((node = node.parentNode) && i++ < colors.length);
});

browser.runtime.onMessage.addListener((message) => {
    console.log("New message: " + JSON.stringify(message));

    if (activeTarget) {
        console.log(activeTarget);

        for (let i = 0; i < message.depth; ++i) {
            activeTarget = activeTarget.parentNode;
            console.log(activeTarget);
        }

        activeTarget.remove();
        activeTarget = null;
    }
});