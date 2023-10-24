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
    paddingBoundary: number;

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
        this.paddingBoundary = 20;
    }

    addResizeListener() {
        const thisClass = this;

        window.addEventListener("resize", (e) => {
            console.log('resize')
            var maxXPos = document.body.clientWidth - thisClass.dragItem.clientWidth - thisClass.paddingBoundary;
            var maxYPos = document.body.clientHeight - thisClass.dragItem.clientHeight - thisClass.paddingBoundary;

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
        let maxXPos = document.body.clientWidth - this.dragItem.clientWidth - this.paddingBoundary;
        let maxYPos = document.body.clientHeight - this.dragItem.clientHeight - this.paddingBoundary;

        xPos = xPos < this.paddingBoundary ? this.paddingBoundary : xPos;
        xPos = xPos > maxXPos ? maxXPos : xPos;
        yPos = yPos < this.paddingBoundary ? this.paddingBoundary : yPos;
        yPos = yPos > maxYPos ? maxYPos : yPos;

        xPos = xPos < this.paddingBoundary ? this.paddingBoundary : xPos;
        yPos = yPos < this.paddingBoundary ? this.paddingBoundary : yPos;

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

            if (changedPointers.length === 0) {
                return;
            }

            debugger

            if (changedPointers.length > 1) {
                // pinch zoom
                event.stopPropagation()


                let startX = changedPointers[0].clientX;
                let endX = changedPointers[changedPointers.length - 1].clientX;
                let newWidth = endX - startX;

                let startY = changedPointers[0].clientY;
                let endY = changedPointers[changedPointers.length - 1].clientY;
                let newHeight = endY - startY;

                if (newWidth < newHeight) {
                    newHeight = newWidth
                }
                else if (newWidth > newHeight) {
                    newWidth = newHeight
                }



                let originalDimensions = 150;

                if (newWidth > originalDimensions * 4) {
                    newWidth = originalDimensions * 4;
                }

                if (newHeight > originalDimensions * 4) {
                    newHeight = originalDimensions * 4;
                }

                if (newWidth > document.body.clientWidth - 20) {
                    newWidth = document.body.clientWidth - 20;
                }

                if (newHeight > document.body.clientHeight - 20) {
                    newHeight = document.body.clientHeight - 20;
                }

                if (newWidth < originalDimensions / 4) {
                    newWidth = Math.ceil(originalDimensions / 4);
                }

                if (newHeight < originalDimensions / 4) {
                    newHeight = Math.ceil(originalDimensions / 4);
                }

                if (isNaN(newWidth)) {
                    alert("Error, width is NAN")
                }
                else if (isNaN(newHeight)) {
                    alert("Error, height is NAN")
                }

                if (newWidth < originalDimensions / 4) {
                    newWidth = Math.ceil(originalDimensions / 4);
                    alert("ugh it's tiny!")
                }
                else if (newHeight < originalDimensions / 4) {
                    newHeight = Math.ceil(originalDimensions / 4);
                    alert("ugh it's tiny!")
                }

                this.dragItem.style.width = `${newWidth}px`; // - this.startX
                this.dragItem.style.height = `${newHeight}px`; // - this.startY
            }
            else {
                this.currentX = changedPointers[0].clientX - this.initialX;
                this.currentY = changedPointers[0].clientY - this.initialY;
    
                this.xOffset = this.currentX;
                this.yOffset = this.currentY;
    
                this.setTranslate(this.currentX, this.currentY, this.dragItem);
            }
        },
        end(pointer, event, cancelled) {
            console.log('stop');
            this.initialX = this.currentX;
            this.initialY = this.currentY;
        },
        avoidPointerEvents: true, // edb - i am using duckduckgo browser and it doesnt like pointer events
        rawUpdates: false,
    });

    return pointerTracker
}