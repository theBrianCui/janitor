import { Message } from '../enums';
import { select as OptimalSelect } from 'optimal-select';
import Storage from '../lib/StorageProxy';
import InjectCss from './CssInjector';

const DOMAIN = window.location.host;

var colors: Array<string> = ["rgba(36, 240, 4, 0.7)", "rgba(4, 154, 234, 0.7)", "rgba(123, 4, 234, 0.7)", "rgba(234, 93, 4, 0.7)"];

interface IBackgroundState {
    removeCount: number,
    activeTargets: Array<HTMLElement>
}

var BackgroundState: IBackgroundState = {
    removeCount: 0,
    activeTargets: []
}

namespace Background {
    export function incrRemovedCount(value: number = 1) {
        BackgroundState.removeCount += value;
        browser.runtime.sendMessage({
            activeDomain: DOMAIN,
            removedCount: BackgroundState.removeCount
        });
    }
}

namespace Highlight {
    export function highlight(elements: Array<HTMLElement>) {
        for (let i = 0; i < elements.length; ++i) {
            if (!elements[i]) continue;

            let weight = 0.5;
            elements[i].style.outline = colors[i] + " solid " + weight + "rem";
            elements[i].style.outlineOffset = (-1 * weight) + "rem";
        }
    }

    export function unhighlight(elements: Array<HTMLElement>) {
        /* Clear the outlines */
        for (let i = 0; i < elements.length; ++i) {
            if (!elements[i]) continue;

            elements[i].style.outline = "unset";
            elements[i].style.outlineOffset = "unset";
        }
    }
}

Storage.getQueriesForDomain(DOMAIN).then((queries: Array<string>) => {
    let css = "";
    for (let i = 0; i < queries.length; ++i) {
        css += "" + queries[i] + " { display: none !important; }\n";
    }

    InjectCss(css);
});

// The following code runs after the page finishes loading.
document.addEventListener("DOMContentLoaded", () => {

    // Highlight target elements when the context menu appears.
    document.addEventListener("contextmenu", (e) => {
        Highlight.unhighlight(BackgroundState.activeTargets);

        BackgroundState.activeTargets[0] = e.target as HTMLElement;

        /* Save pointers to parent elements, starting with root */
        for (let i = 1; i < colors.length; ++i) {
            if (BackgroundState.activeTargets[i - 1].parentNode == null ||
                BackgroundState.activeTargets[i - 1].parentNode === document.body ||
                BackgroundState.activeTargets[i - 1].parentNode.nodeName === "BODY" ||
                BackgroundState.activeTargets[i - 1].parentNode.nodeName === "HTML")
                break;

            BackgroundState.activeTargets[i] = BackgroundState.activeTargets[i - 1].parentNode as HTMLElement;
        }

        Highlight.highlight(BackgroundState.activeTargets);
    });

    document.addEventListener("click", (e) => {
        Highlight.unhighlight(BackgroundState.activeTargets);
    });

    // Listen for messages from the background script context menu
    browser.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
        console.log("New message: " + JSON.stringify(message));
        switch (message.messageType) {
            case Message.removeDepth:
                let target;

                if (BackgroundState.activeTargets[0] &&
                    (target = BackgroundState.activeTargets[message.depth - 1])) {

                    Highlight.unhighlight(BackgroundState.activeTargets);

                    Storage.addQueryForDomain(DOMAIN, OptimalSelect(target));
                    BackgroundState.activeTargets[message.depth - 1].remove();
                    BackgroundState.activeTargets = [];
                    Background.incrRemovedCount();
                }

                return false;

            case Message.removeCount:
                if (message.activeDomain !== DOMAIN) return false;
                sendResponse({ 
                    messageType: Message.removeCount,
                    activeDomain: DOMAIN,
                    removeCount: BackgroundState.removeCount
                });
        }
    });

    // Remove elements that match the query
    Storage.getQueriesForDomain(DOMAIN).then((queries: Array<string>) => {
        for (let i = 0; i < queries.length; ++i) {
            let targets = document.querySelectorAll(queries[i]);
            let removed = 0;

            for (let j = 0; j < targets.length; ++j) {
                if (targets[j] == null) continue;

                targets[j].remove();
                removed++;
            }

            Background.incrRemovedCount(removed);
        }
    });
});
