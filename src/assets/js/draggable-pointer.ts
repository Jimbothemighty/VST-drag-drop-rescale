import PointerTracker from "./PointerTracker/PointerTracker.mjs"

class PointerTrackerDragElement extends PointerTracker {
    dragItem: HTMLDivElement;
    currentX: number;
    currentY: number;
    initialX: number;
    initialY: number;
    xOffset: number;
    yOffset: number;
    container: HTMLBodyElement;
    firstTimeSetup: boolean;

    constructor(dragItem, container, options) {
        super(container, options);
        this.dragItem = dragItem;
        this.xOffset = 0;
        this.yOffset = 0;
        this.initialX = 0;
        this.initialY = 0;
        this.currentX = 0;
        this.initialY = 0;
        this.firstTimeSetup = false;
        this.addResizeListener();
    }

    addResizeListener() {
        const thisClass = this;

        window.addEventListener("resize", (e) => {
            console.log('resize')
            var maxXPos = document.body.clientWidth - thisClass.dragItem.clientWidth;
            var maxYPos = document.body.clientHeight - thisClass.dragItem.clientHeight;

            if (thisClass.xOffset > maxXPos || thisClass.yOffset > maxYPos) {
                thisClass.setTranslate(
                    thisClass.xOffset > maxXPos ? maxXPos : thisClass.xOffset,
                    thisClass.yOffset > maxYPos ? maxYPos : thisClass.yOffset,
                    thisClass.dragItem
                );
            }
        });
    }

    setTranslate(xPos: number, yPos: number, el: HTMLElement, animate : boolean = false) {
        console.log("translating");
        console.log(el)
        let maxXPos = document.body.clientWidth - this.dragItem.clientWidth;
        let maxYPos = document.body.clientHeight - this.dragItem.clientHeight;

        xPos = xPos < 0 ? 0 : xPos;
        xPos = xPos > maxXPos ? maxXPos : xPos;
        yPos = yPos < 0 ? 0 : yPos;
        yPos = yPos > maxYPos ? maxYPos : yPos;

        xPos = xPos < 0 ? 0 : xPos;
        yPos = yPos < 0 ? 0 : yPos;

        if (animate) {
            el.classList.add("transition")
            setTimeout(() => {
                el.classList.remove("transition")
            }, 1000)
        }

        el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }

    moveToMiddle(animate : boolean = true) {
        this.xOffset = (document.body.clientWidth - this.dragItem.clientWidth) / 2;
        this.yOffset = (document.body.clientHeight - this.dragItem.clientHeight) / 2;
        this.currentX = document.body.clientWidth * 0.25;
        this.currentY = document.body.clientHeight * 0.25;

        this.setTranslate(this.xOffset, this.yOffset, this.dragItem, animate);
    }
}

export function startPointerTracker(dragItem, container) {
    const pointerTracker = new PointerTrackerDragElement(dragItem, container, {
        start(pointer, event) {
            console.log('start');
            this.initialX = pointer.clientX - this.xOffset;
            this.initialY = pointer.clientY - this.yOffset;

            if (event.target == this.dragItem) {
                return true
            }
        },
        move(previousPointers, changedPointers, event) {
            console.log('move');

            this.currentX = changedPointers[0].clientX - this.initialX;
            this.currentY = changedPointers[0].clientY - this.initialY;

            this.xOffset = this.currentX;
            this.yOffset = this.currentY;

            this.setTranslate(this.currentX, this.currentY, this.dragItem);
        },
        end(pointer, event, cancelled) {
            console.log('stop');
            this.initialX = this.currentX;
            this.initialY = this.currentY;
        },
        // Avoid pointer events in favour of touch and mouse events?
        //
        // Even if the browser supports pointer events, you may want to force the browser to use
        // mouse/touch fallbacks, to work around bugs such as
        // https://bugs.webkit.org/show_bug.cgi?id=220196.
        //
        // The default is false.
        avoidPointerEvents: false,
        // Use raw pointer updates? Pointer events are usually synchronised to requestAnimationFrame.
        // However, if you're targeting a desynchronised canvas, then faster 'raw' updates are better.
        //
        // This feature only applies to pointer events. The default is false.
        rawUpdates: false,
    });

    return pointerTracker
}