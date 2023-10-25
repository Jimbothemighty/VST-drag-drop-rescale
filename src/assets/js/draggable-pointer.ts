import PointerTracker from "./PointerTracker/PointerTracker.mjs"

type dimensionsType = {
    x : number,
    y : number
}

type extendedOptions = {
    paddingBoundary : number
}

/**
 * Extension class of PointerTracker to manage my extra state
 */
class PointerTrackerDragElement extends PointerTracker {

    /**
     * The container element, which I insist is the body element
     */
    container: HTMLBodyElement;

    /**
     * The element being dragged
     */
    dragItem: HTMLDivElement;

    // // REFACTORED OUT!
	// currentX : number;
	// currentY : number;

    // // REFACTORED OUT!
    // initialX: number;
    // initialY: number;

    /**
     * The current X position of the dragItem (centre point of element)
     */
    xOffset: number;

    /**
     * The current Y position of the dragItem (centre point of element)
     */
    yOffset: number;
    
    /**
     * The closest the dragItem can move to the edge
     */
    paddingBoundary: number;

    /**
     * The dimensions of the element when it was passed in (for calculating against min/max sizes)
     */
    originalDimensions : dimensionsType;

    constructor(dragItem : HTMLDivElement, container : HTMLBodyElement, options : object, extendedOptions : extendedOptions) {
        super(container, options);
        this.container = container;
        this.dragItem = dragItem;
        this.xOffset = 0;
        this.yOffset = 0;
        this.addResizeListener();
        this.paddingBoundary = extendedOptions.paddingBoundary;

        this.originalDimensions = { 
            x : this.dragItem.clientWidth, 
            y : this.dragItem.clientHeight
        };
    }

    /**
     * scaling function - 'pinched' from PinchZoom
     * @param a 
     * @param b 
     * @returns number
     */
    getDistance(a, b) : number {
        if (!b)
            return 0;
        return Math.sqrt((b.clientX - a.clientX) ** 2 + (b.clientY - a.clientY) ** 2);
    }

    /**
     * Called when resizing element to ensure it is neither 
     * too small or large against set limits and also against body inc. paddingBoundary 
     * @param newWidth number
     * @param newHeight number
     * @returns dimensionsType
     */
    calculateNewSizeAgainstLimits(newWidth : number, newHeight : number) : dimensionsType {
        const maxWidthAgainstBody = this.container.clientWidth - (this.paddingBoundary * 2);
        const maxHeightAgainstBody = this.container.clientWidth - (this.paddingBoundary * 2);
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

    /**
     * Called when element is resized or on window resize to ensure it is within bounds
     * The max positions are calculated here AND ALSO in setTranslate. They only need to be
     * done here to establish WHETHER to call setTranslate.
     * I am sure this can be refactored
     */
    repositionElement() {
        console.log('resize')
        var maxXPos = this.container.clientWidth - this.dragItem.clientWidth - this.paddingBoundary;
        var maxYPos = this.container.clientHeight - this.dragItem.clientHeight - this.paddingBoundary;

        /** 
         * if the element is outside the bounds (inc. paddingBoundary), then adjust it on resize
         */
        if (this.xOffset > maxXPos || this.yOffset > maxYPos) {
            this.setTranslate(
                this.xOffset > maxXPos ? maxXPos : this.xOffset,
                this.yOffset > maxYPos ? maxYPos : this.yOffset,
                this.dragItem
            );
        }
    }

    /**
     * Resize listener on window to check element position against bounds
     */
    addResizeListener() {
        window.addEventListener("resize", (e) => {
            this.repositionElement();
        });
    }

    /**
     * Called on move of dragItem to set the new coords
     * Also does some additional checking of boundary positions
     * Observation: Set translate does NOT change any class properties.
     * All changes to the state are done beforehand. But this might 
     * not be right any more since the xPos and yPos may be changed here??
     * @param xPos number
     * @param yPos number
     * @param el HTMLElement
     * @param animate boolean
     */
    setTranslate(xPos: number, yPos: number, el: HTMLElement, animate : boolean = false) {
        console.log("translating");
        console.log(el)
        let maxXPos = this.container.clientWidth - this.dragItem.clientWidth - this.paddingBoundary;
        let maxYPos = this.container.clientHeight - this.dragItem.clientHeight - this.paddingBoundary;

        xPos = xPos < this.paddingBoundary ? this.paddingBoundary : xPos;
        xPos = xPos > maxXPos ? maxXPos : xPos;
        yPos = yPos < this.paddingBoundary ? this.paddingBoundary : yPos;
        yPos = yPos > maxYPos ? maxYPos : yPos;

        xPos = xPos < this.paddingBoundary ? this.paddingBoundary : xPos;
        yPos = yPos < this.paddingBoundary ? this.paddingBoundary : yPos;

        this.xOffset = xPos; // set the xOffset property so we can reference it for checking on window resize etc
        this.yOffset = yPos; // set the xOffset property so we can reference it for checking on window resize etc

        if (animate) {
            el.classList.add("transition")
            setTimeout(() => {
                el.classList.remove("transition")
            }, 1000)
        }

        el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }

    /**
     * Moves the dragItem to the centre of the body (or rather, the container, 
     * which I store store in a property on the extension class.)
     * @param animate boolean
     */
    moveToMiddle(animate : boolean = true) {
        let newX = (this.container.clientWidth - this.dragItem.clientWidth) / 2;
        let newY = (this.container.clientHeight - this.dragItem.clientHeight) / 2;

        this.setTranslate(newX, newY, this.dragItem, animate);
    }
}

export function startPointerTracker(dragItem, container, options : extendedOptions) {
    const pointerTracker = new PointerTrackerDragElement(dragItem, container, {
        /**
         * pointer.client[X/Y] is the coordinates of where we clicked in the container (body in this case)
         * this.[x/y]Offset is the current center point of the dragItem
         * @param pointer 
         * @param event 
         * @returns 
         */
        start(pointer, event) {
            console.log('start');

            if (event.target == this.dragItem) {
                return true
            }
        },
        /** 
         * scales or moves element
         */ 
        move(previousPointers, changedPointers, event) {
            console.log('move');

            if (changedPointers.length === 0) {
                return;
            }

            if (changedPointers.length === 2) {
                // pinch zoom
                event.stopPropagation()

                const prevDistance = this.getDistance(previousPointers[0], previousPointers[1]);
                const newDistance = this.getDistance(changedPointers[0], changedPointers[1]);
                const scaleDiff = prevDistance ? newDistance / prevDistance : 1;

                let newSizes = this.calculateNewSizeAgainstLimits(
                    dragItem.clientWidth * scaleDiff,
                    dragItem.clientHeight * scaleDiff
                )

                this.dragItem.style.width = `${newSizes.x}px`;
                this.dragItem.style.height = `${newSizes.y}px`;

                this.repositionElement();
            }
            else if (changedPointers.length === 1) {
                let newX = this.xOffset + (changedPointers[0].clientX - previousPointers[0].clientX); // set new center point x coord for element
                let newY = this.yOffset + (changedPointers[0].clientY - previousPointers[0].clientY); // set center point y coord for element

                this.setTranslate(newX, newY, this.dragItem);
            }
        },
        /**
         * Nothing needs to be done. We were setting state here, 
         * but it can be done away since the point events manage it better
         */
        end(pointer, event, cancelled) {
            console.log('stop');
        },
        avoidPointerEvents: true, // edb - i am using duckduckgo browser and it doesnt like pointer events
        rawUpdates: false,
    }, options);

    return pointerTracker
}