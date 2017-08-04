/*
The popup (DOM) is re-loaded every single time the user closes and re-opens
it by clicking the button. There is no expectation to "live update" the
popup while the user navigates in their browser.
*/
import Storage from '../lib/StorageProxy';

var LocalState: IState = {
    activeDomain: "",
    activeQueries: [],
    customQueries: []
}

namespace Init {
    function loadPageDomain() {
        return browser.tabs.executeScript({ code: "window.location.host"}).then((result: string) => {
            return (LocalState.activeDomain = result);
        });
    }

    function loadActiveQueries() {
        return Storage.getQueriesForDomain(LocalState.activeDomain).then((queries: Array<string>) => {
            LocalState.activeQueries = queries;
            LocalState.customQueries = queries;
        });
    }

    export function Initialize() {
        return loadPageDomain()
            .then(loadActiveQueries);
    }
}

namespace Display {
    let domain: Element;
    let queryList: Element;
    let resetButton: Element;

    export function Load() {
        domain = document.getElementById("domain");
        queryList = document.getElementsByClassName("queryList")[0];
        resetButton = document.getElementById("reset");

        domain.textContent = LocalState.activeDomain;

        resetButton.addEventListener("click", e => {
            Storage.setQueriesForDomain(LocalState.activeDomain, []).then(
            (newQueries: Array<string>) => {
                if (newQueries.length > 0)
                    throw new Error("Failed to reset queries!");

                return browser.tabs.executeScript({ code: "window.location.reload();" });
            }).then(Init.Initialize).then(Display.HardRefresh);
        });
    }

    export function HardRefresh() {
        queryList.innerHTML = "";

        for (let i = 0; i < LocalState.activeQueries.length; ++i) {
            let input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute("value", LocalState.activeQueries[i]);

            let save = document.createElement("span");
            save.textContent = "save";

            let wrapper = document.createElement("div");
            wrapper.appendChild(input);
            wrapper.appendChild(save);

            queryList.appendChild(wrapper);
        }

        (<HTMLInputElement> resetButton).disabled = LocalState.activeQueries.length === 0; 
    }
}

window.onload = () => {
    Init.Initialize().then(() => {
        Display.Load();
        Display.HardRefresh();
    }).catch(e => {
        console.error(e);
    });

    // browser.storage.onChanged.addListener((changes, areaName) => {
    //     if (changes[getPageDomain()] && changes[getPageDomain()].newValue !== undefined) {
    //         assignDisplayQuery(changes[getPageDomain()].newValue);
    //     }
    // });
};