/*
The popup (DOM) is re-loaded every single time the user closes and re-opens
it by clicking the button. There is no expectation to "live update" the
popup while the user navigates in their browser.
*/
import Storage from '../lib/StorageProxy';

var LocalState: IState = {
    activeDomain: "",
    activeQueries: [],
    customQueries: [],
    changesPending: false
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
    let statusMessage: Element;

    export function Load() {
        domain = document.getElementsByClassName("domain")[0];
        queryList = document.getElementsByClassName("queryList")[0];
        statusMessage = document.getElementById("status");
        //resetButton = document.getElementById("reset");

        domain.textContent = LocalState.activeDomain;

        // resetButton.addEventListener("click", e => {
        //     Storage.setQueriesForDomain(LocalState.activeDomain, []).then(
        //     (newQueries: Array<string>) => {
        //         if (newQueries.length > 0)
        //             throw new Error("Failed to reset queries!");

        //         return browser.tabs.executeScript({ code: "window.location.reload();" });
        //     }).then(Init.Initialize).then(Display.HardRefresh);
        // });
    }

    export function Save(newQueries: Array<string>) {
        return Storage.setQueriesForDomain(LocalState.activeDomain, newQueries)
            .then((updatedQueries: Array<string>) => {
                LocalState.changesPending = true;
                statusMessage.textContent = "Changes pending, reload page to apply";
                statusMessage.parentElement.setAttribute("class", "green");

                LocalState.activeQueries = updatedQueries.slice();
                LocalState.customQueries = updatedQueries.slice();
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

            let wrapper = document.createElement("div");
            wrapper.appendChild(input);
            wrapper.appendChild(save);
            wrapper.appendChild(trash);

            // Update customQueries to reflect user input
            // Also update trash to undo icon
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

            // Update activeQueries, as well as what's in Storage
            save.addEventListener("click", (e) => {
                if (LocalState.activeQueries[i] === LocalState.customQueries[i])
                    return;

                let newQueries = LocalState.activeQueries;
                newQueries[i] = LocalState.customQueries[i];

                Display.Save(newQueries).then(() => {
                    input.dispatchEvent(new Event("input"));
                });
            });

            // Delete a query, or undo changes
            trash.addEventListener("click", (e) => {
                console.log("Clicked!")

                LocalState.customQueries[i] = (<HTMLInputElement> input).value;

                if (LocalState.activeQueries[i] === LocalState.customQueries[i]) {
                    LocalState.activeQueries.splice(i, 1);
                    Display.Save(LocalState.activeQueries).then(() => {
                        wrapper.remove();
                    });

                } else {
                    LocalState.customQueries[i] = LocalState.activeQueries[i];
                    (<HTMLInputElement> input).value = LocalState.activeQueries[i];
                    input.dispatchEvent(new Event("input"));
                    input.focus();
                }
            });

            queryList.appendChild(wrapper);
        }

        if (LocalState.changesPending) {
            statusMessage.textContent = "Changes pending, reload page to apply";
            statusMessage.parentElement.setAttribute("class", "green");
        } else if (LocalState.activeQueries.length > 0) {
            statusMessage.textContent = "Janitor is actively blocking content";
            statusMessage.parentElement.setAttribute("class", "blue");
        }
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