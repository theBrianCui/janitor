const OptimalSelect = require('optimal-select');
import Storage from '../lib/StorageProxy';
import InjectCss from './CssInjector';

const DOMAIN = window.location.host;

var colors = ["rgba(36, 240, 4, 0.7)", "rgba(4, 154, 234, 0.7)", "rgba(123, 4, 234, 0.7)", "rgba(234, 93, 4, 0.7)"];
var activeTargets: Array<HTMLElement> = [];

function highlight(elements: Array<HTMLElement>) {
    console.log("Highlighting:");
    console.log(elements);

    /* Assign an outline to each target */
    for (let i = 0; i < elements.length; ++i) {
        //let weight = (elements.length - i) * 2;

        let weight = 0.5;
        if (elements[i]) {
            elements[i].style.outline = colors[i] + " solid " + weight + "rem";
            elements[i].style.outlineOffset = (-1 * weight) + "rem";
        }
    }
}

function unhighlight(elements: Array<HTMLElement>) {
    console.log("Unhighlighting:");
    console.log(elements);

    /* Clear the outlines */
    for (let i = 0; i < elements.length; ++i) {
        if (elements[i]) {
            elements[i].style.outline = "unset";
            elements[i].style.outlineOffset = "unset";
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Document is loaded!");

    document.addEventListener("contextmenu", (e) => {
        console.log("Context menu called from: " + e.clientX + ", " + e.clientY);
        unhighlight(activeTargets);

        activeTargets[0] = e.target as HTMLElement;
        
        /* Save pointers to parent elements, starting with root */
        for (let i = 1; i < colors.length; ++i) {
            if (activeTargets[i - 1].parentNode == null ||
                activeTargets[i - 1].parentNode === document.body ||
                activeTargets[i - 1].parentNode.nodeName === "BODY" ||
                activeTargets[i - 1].parentNode.nodeName === "HTML")
                break;

            activeTargets[i] = activeTargets[i - 1].parentNode as HTMLElement;
        }

        highlight(activeTargets);
    });

    document.addEventListener("click", (e) => {
        unhighlight(activeTargets);
    });

    // Listen for messages from the background script context menu
    browser.runtime.onMessage.addListener((message: any) => {
        console.log("New message: " + JSON.stringify(message));
        let target;

        if (activeTargets[0] && (target = activeTargets[message.depth - 1])) {
            unhighlight(activeTargets);

            Storage.addQueryForDomain(DOMAIN, OptimalSelect.select(target));
            activeTargets[message.depth - 1].remove();
            activeTargets = [];
        }

        return false;
    });

    // Remove elements that match the query
    Storage.getQueriesForDomain(DOMAIN).then((queries: Array<string>) => {
        queries.forEach((query: string) => {
            let target = document.querySelector(query);
            if (target == null) return;
            target.remove();
        });
    });
});

Storage.getQueriesForDomain(DOMAIN).then((queries: Array<string>) => {
    let css = "";
    for (let i = 0; i < queries.length; ++i) {
        css += "" + queries[i] + " { display: none !important; }\n";
    }

    InjectCss(css);
});