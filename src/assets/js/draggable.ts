/**
 * EDB - I actually wrote this years ago :)
 * I guess I'll be using it for inspiration
 * No pinch resize in here but there is some bounds 
 * limitations and onresize adjustments
 */

class setDraggable {
	dragItem : HTMLDivElement;
	active : boolean;
	currentX : number;
	currentY : number;
	initialX : number;
	initialY : number;
	xOffset : number;
	yOffset : number;
	container : HTMLBodyElement;
	firstTimeSetup : boolean;

	constructor(element : HTMLDivElement) {
		this.dragItem;
		this.active = false;
		this.currentX;
		this.currentY;
		this.initialX;
		this.initialY;
		this.xOffset = 0;
		this.yOffset = 0;
		this.firstTimeSetup = false;

        this.dragItem = element;

		this.container = document.querySelector("body");

		this.init();
	}

	dragStart(e : MouseEvent | TouchEvent) {
		if (e.type === "touchstart") {
			e = e as TouchEvent
			this.initialX = e.touches[0].clientX - this.xOffset;
			this.initialY = e.touches[0].clientY - this.yOffset;
		} else {
			e = e as DragEvent
			this.initialX = e.clientX - this.xOffset;
			this.initialY = e.clientY - this.yOffset;
		}

		if (e.target == this.dragItem) {
			this.active = true;
		}
	}

	dragEnd(e: MouseEvent | TouchEvent) {
		this.initialX = this.currentX;
		this.initialY = this.currentY;

		this.active = false;
	}

	drag(e : MouseEvent | TouchEvent) {
		if (this.active) {

			e.preventDefault();

			if (e.type === "touchmove") {
				e = e as TouchEvent
				this.currentX = e.touches[0].clientX - this.initialX;
				this.currentY = e.touches[0].clientY - this.initialY;
			} else {
				e = e as MouseEvent
				this.currentX = e.clientX - this.initialX;
				this.currentY = e.clientY - this.initialY;
			}

			this.xOffset = this.currentX;
			this.yOffset = this.currentY;

			this.setTranslate(this.currentX, this.currentY, this.dragItem);
		}
	}

	setTranslate(xPos : number, yPos : number, el : HTMLDivElement) {
		let maxXPos = document.body.clientWidth - this.dragItem.clientWidth;
		let maxYPos = document.body.clientHeight - this.dragItem.clientHeight;

		xPos = xPos < 0 ? 0 : xPos;
		xPos = xPos > maxXPos ? maxXPos : xPos;
		yPos = yPos < 0 ? 0 : yPos;
		yPos = yPos > maxYPos ? maxYPos : yPos;

		xPos = xPos < 0 ? 0 : xPos;
		yPos = yPos < 0 ? 0 : yPos;
        
		el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
	}

	moveToMiddle() {
		this.xOffset = (document.body.clientWidth - this.dragItem.clientWidth) / 2;
		this.yOffset = (document.body.clientHeight - this.dragItem.clientHeight) / 2;
		this.currentX = document.body.clientWidth * 0.25;
		this.currentY = document.body.clientHeight * 0.25;
		
		this.setTranslate(this.xOffset, this.yOffset, this.dragItem);
	}

	init() {
		let thisClass = this;

		this.container.addEventListener("touchstart", function(e) { 
			thisClass.dragStart(e);
		}, false);
		this.container.addEventListener("touchend", function(e) { 
			thisClass.dragEnd(e);
		}, false);
		this.container.addEventListener("touchmove", function(e) { 
			thisClass.drag(e); 
		}, false);

		this.container.addEventListener("mousedown", function(e) { 
			thisClass.dragStart(e); 
		}, false);
		this.container.addEventListener("mouseup", function(e) { 
			thisClass.dragEnd(e); 
		}, false);
		this.container.addEventListener("mousemove", function(e) { 
			thisClass.drag(e); 
		}, false);

		if (!this.firstTimeSetup) {
			this.firstTimeSetup = true;

			this.moveToMiddle();

			window.addEventListener("resize", (e) => {
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
	}
}

export { setDraggable };
