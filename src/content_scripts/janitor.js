var colors = ["rgba(36, 240, 4, 0.7)", "rgba(4, 154, 234, 0.7)", "rgba(123, 4, 234, 0.7)", "rgba(234, 93, 4, 0.7)"];
var activeTargets = [];

function highlight(elements) {
    /* Assign an outline to each target */
    for (let i = 0; i < elements.length; ++i) {
        //let weight = (elements.length - i) * 2;

        let weight = 0.5;
        if (elements[i])
            elements[i].style.outline = colors[i] + " solid " + weight + "rem";
    }
}

function unhighlight(elements) {
    /* Clear the outlines */
    for (let i = 0; i < elements.length; ++i) {
        let weight = (elements.length - i) * 2;

        if (elements[i])
            elements[i].style.outline = "unset";
    }
}

document.addEventListener("contextmenu", (e) => {
    console.log("Context menu called from: " + e.clientX + ", " + e.clientY);
    unhighlight(activeTargets);

    activeTargets[0] = e.target;
    
    /* Save pointers to parent elements, starting with root */
    for (let i = 1; i < colors.length; ++i) {
        if (activeTargets[i - 1].parentNode == null)
            break;

        activeTargets[i] = activeTargets[i - 1].parentNode;
    }

    highlight(activeTargets);
});

document.addEventListener("click", (e) => {
    unhighlight(activeTargets);
});

// Listen for messages from the background script context menu
browser.runtime.onMessage.addListener((message) => {
    console.log("New message: " + JSON.stringify(message));

    if (activeTargets[0]) {
        unhighlight(activeTargets);

        activeTargets[message.depth - 1].remove();
        activeTargets = [];
    }
});