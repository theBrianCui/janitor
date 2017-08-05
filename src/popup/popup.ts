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

// Helper namespace for commonly used DOM API functions.
// namespace Doc {
//     export function create(type: string) {
//         return document.createElement(type);
//     }

//     export function getById(id: string) {
//         return document.getElementById(id);
//     }
// }

namespace Init {
    function loadPageDomain() {
        return browser.tabs.executeScript({ code: "window.location.host"}).then((result: string) => {
            return (LocalState.activeDomain = result);
        });
    }

    function loadActiveQueries() {
        return Storage.getQueriesForDomain(LocalState.activeDomain).then((queries: Array<string>) => {
            // activeQueries and customQueries to be copies of the same array, 
            // or else modifying one will modify the other
            LocalState.activeQueries = queries.slice();
            LocalState.customQueries = queries.slice();
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

            let save = document.createElement("i");
            save.setAttribute("class", "fa fa-floppy-o fa-fw clickable");

            let trash = document.createElement("i");
            trash.setAttribute("class", "fa fa-trash-o fa-fw clickable");

            input.addEventListener("input", (e) => {
                LocalState.customQueries[i] = (<HTMLInputElement> e.target).value;
                if (LocalState.activeQueries[i] !== LocalState.customQueries[i]) {
                    trash.classList.remove("fa-trash-o");
                    trash.classList.add("fa-undo");
                } else {
                    trash.classList.remove("fa-undo");
                    trash.classList.add("fa-trash-o");
                }
            });

            save.addEventListener("click", (e) => {
                let newQueries = LocalState.activeQueries;
                newQueries[i] = LocalState.customQueries[i];

                Storage.setQueriesForDomain(LocalState.activeDomain, newQueries)
                    .then((newQueries: Array<string>) => {
                        LocalState.activeQueries = newQueries;
                        input.dispatchEvent(new Event("input"));
                });
            });


            let wrapper = document.createElement("div");
            wrapper.appendChild(input);
            wrapper.appendChild(save);
            wrapper.appendChild(trash);

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