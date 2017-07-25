var colors = ["#66ff66", "#ff9933", "#3399ff", "#33ffff"];
var activeTargets = [];

document.addEventListener("contextmenu", (e) => {
    console.log("Context menu called from: " + e.clientX + ", " + e.clientY);
    activeTargets[0] = e.target;
    
    /* Save pointers to parent elements, starting with root */
    for (let i = 1; i < colors.length; ++i) {
        if (activeTargets[i - 1].parentNode == null)
            break;

        activeTargets[i] = activeTargets[i - 1].parentNode;
    }

    /* Assign an outline to each target */
    for (let i = 0; i < activeTargets.length; ++i) {
        activeTargets[i].style.outline = colors[i] + " solid 4px";
    }
});

browser.runtime.onMessage.addListener((message) => {
    console.log("New message: " + JSON.stringify(message));

    if (activeTargets[0]) {
        for (let i = 0; i < activeTargets.length; ++i) {
            activeTargets[i].style.outline = "unset";
        }

        activeTargets[message.depth].remove();
        activeTargets = [];
    }
});