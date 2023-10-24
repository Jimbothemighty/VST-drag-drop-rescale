import PointerTracker from "./PointerTracker/PointerTracker.mjs"

type dimensionsType = {
    x : number,
    y : number
}

type extendedOptions = {
    paddingBoundary : number
}

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
    originalDimensions : dimensionsType;

    constructor(dragItem : HTMLDivElement, container : HTMLElement, options : object, extendedOptions : extendedOptions) {
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
        this.paddingBoundary = extendedOptions.paddingBoundary;

        this.originalDimensions = { 
            x : this.dragItem.clientWidth, 
            y : this.dragItem.clientHeight
        };
    }

    // scaling function - 'pinched' from PinchZoom
    getDistance(a, b) {
        if (!b)
            return 0;
        return Math.sqrt((b.clientX - a.clientX) ** 2 + (b.clientY - a.clientY) ** 2);
    }

    calculateNewSizeAgainstLimits(newWidth : number, newHeight : number) : dimensionsType {
        const maxWidthAgainstBody = document.body.clientWidth - (this.paddingBoundary * 2);
        const maxHeightAgainstBody = document.body.clientWidth - (this.paddingBoundary * 2);
        const maxWidthAgainstOrig = this.originalDimensions.x * 4;
        const maxHeightAgainstOrig = this.originalDimensions.y * 4;
        const minWidthAgainstOrig = Math.ceil(this.originalDimensions.x / 4);
        const minHeightAgainstOrig = Math.ceil(this.originalDimensions.y / 4);

        if (newWidth > maxWidthAgainstOrig) {
            newWidth = maxWidthAgainstOrig;
        }

        if (newHeight > maxHeightAgainstOrig) {
            newHeight = maxHeightAgainstOrig;
        }

        if (newWidth > maxWidthAgainstBody) {
            newWidth = maxWidthAgainstBody;
        }

        if (newHeight > maxHeightAgainstBody) {
            newHeight = maxHeightAgainstBody;
        }

        if (newWidth < minWidthAgainstOrig) {
            newWidth = minWidthAgainstOrig;
        }

        if (newHeight < minHeightAgainstOrig) {
            newHeight = minHeightAgainstOrig;
        }

        newWidth = Math.ceil(newWidth)
        newHeight = Math.ceil(newHeight)

        this.dragItem.innerHTML = `width:${newWidth}<br>height:${newHeight}`

        return {
            x : newWidth,
            y : newHeight
        }
    }

    repositionElement() {
        console.log('resize')
        var maxXPos = document.body.clientWidth - this.dragItem.clientWidth - this.paddingBoundary;
        var maxYPos = document.body.clientHeight - this.dragItem.clientHeight - this.paddingBoundary;

        if (this.xOffset > maxXPos || this.yOffset > maxYPos) {
            this.setTranslate(
                this.xOffset > maxXPos ? maxXPos : this.xOffset,
                this.yOffset > maxYPos ? maxYPos : this.yOffset,
                this.dragItem
            );
        }
    }


    addResizeListener() {
        window.addEventListener("resize", (e) => {
            this.repositionElement();
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

export function startPointerTracker(dragItem, container, options : extendedOptions) {
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

            if (changedPointers.length === 2) {
                // pinch zoom
                event.stopPropagation()

                const prevDistance = this.getDistance(previousPointers[0], previousPointers[1]);
                const newDistance = this.getDistance(pointerTracker.currentPointers[0], pointerTracker.currentPointers[1]);
                const scaleDiff = prevDistance ? newDistance / prevDistance : 1;

                let newSizes = this.calculateNewSizeAgainstLimits(
                    dragItem.clientWidth * scaleDiff,
                    dragItem.clientHeight * scaleDiff
                )

                this.dragItem.style.width = `${newSizes.x}px`; // - this.startX
                this.dragItem.style.height = `${newSizes.y}px`; // - this.startY

                this.repositionElement();
            }
            else if (changedPointers.length === 1) {
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
    }, options);

    return pointerTracker
}