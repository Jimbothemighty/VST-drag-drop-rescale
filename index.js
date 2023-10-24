import { startPointerTracker } from "./src/assets/js/draggable-pointer"
import "./src/assets/css/style.css"

window.addEventListener("load", () => {
    let dragElement = document.querySelector("#dragElement")

    let thisPointerTracker;

    let btn = document.createElement("button")
    document.querySelector("body").append(btn)
    btn.innerText = "Move to middle"
    btn.addEventListener("click", () => {
        thisPointerTracker.moveToMiddle(true)
    })

    thisPointerTracker = startPointerTracker(dragElement, document.querySelector("body"))
    thisPointerTracker.moveToMiddle(false)
})