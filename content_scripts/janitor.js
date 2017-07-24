var colors = ["#66ff66", "#ff9933", "#3399ff", "#33ffff"];

document.addEventListener("contextmenu", (e) => {
    console.log("Context menu called from: " + e.clientX + ", " + e.clientY);
    var eventTarget = e.target;

    let i = 0;
    do {
        eventTarget.style.outline = colors[i++] + " solid 4px";
    } while ((eventTarget = eventTarget.parentNode) && i < colors.length);

    // var target = document.elementsFromPoint(e.clientX, e.clientY);
    // target.forEach((node) => {
    //     node.style.outline = "red solid 2px";
    // });
    //document.elementFromPoint(e.clientX, e.clientY).remove();
});
