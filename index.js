import { setDraggable } from "./src/assets/js/draggable"
import { startPointerTracker, startPointerTrackerBase } from "./src/assets/js/draggable-pointer"

window.addEventListener("load", () => {
    let elem = document.querySelector("#dragElement")

    //const thisPointerTracker = new setDraggable(elem)
    let thisPointerTracker;

    let btn = document.createElement("button")
    document.querySelector("body").append(btn)
    btn.innerText = "Move to middle"
    btn.addEventListener("click", () => {
        thisPointerTracker.moveToMiddle()
    })

    thisPointerTracker = startPointerTracker(elem, document.querySelector("body"))
})