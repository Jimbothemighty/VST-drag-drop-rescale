import { setDraggable } from "./src/assets/js/draggable"

window.addEventListener("load", () => {
    let elem = document.querySelector("#dragElement")

    const thisDraggable = new setDraggable(elem)

    let btn = document.createElement("button")
    document.querySelector("body").append(btn)
    btn.innerText = "Move to middle"
    btn.addEventListener("click", () => {
        thisDraggable.moveToMiddle()
    })
})