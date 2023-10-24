import { setDraggable } from "./src/assets/js/draggable"
import { startPointerTracker } from "./src/assets/js/draggable-pointer"
import "./src/assets/css/style.css"

window.addEventListener("load", () => {
    let elem = document.querySelector("#dragElement")

    //const thisPointerTracker = new setDraggable(elem)
    let thisPointerTracker;

    let btn = document.createElement("button")
    document.querySelector("body").append(btn)
    btn.innerText = "Move to middle"
    btn.addEventListener("click", () => {
        thisPointerTracker.moveToMiddle(true)
    })

    thisPointerTracker = startPointerTracker(elem, document.querySelector("body"))
    thisPointerTracker.moveToMiddle(false)
})