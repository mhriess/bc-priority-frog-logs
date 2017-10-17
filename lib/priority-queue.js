'use strict';

class PriorityQueueNode {
	constructor(value, sourceIndex) {
		this.value = value;
		// need to keep track of the sourceIndex to know
		// where to draw the replacement of a printed log
		this.sourceIndex = sourceIndex;
	}
}

/**
 * Maintains an ordered list of items based on the output
 * of a given priority function shouldSwap, which returns
 * a boolean indicating whether the first element should be
 * promoted above the second.
 */
module.exports = class PriorityQueue {
	constructor(shouldSwap) {
		this.items = [];
		this.shouldSwap = shouldSwap;
	}

	insert(value, sourceIndex) {
		var item = new PriorityQueueNode(value, sourceIndex);

		this.items.push(item);

		var i = this.items.length - 1;

		// Move the inserted item up to the correct position
		while (i > 0) {
			// parent index depends on whether the parent has one or two children
			var parentIndex = Math.floor((i + 1) / 2) - 1;
			var parent = this.items[parentIndex];

			if (this.shouldSwap(item.value, parent.value)) {
				this.items[parentIndex] = item;
				this.items[i] = parent;

				i = parentIndex;
			} else {
				break;
			}
		}
	}

	pop() {
		var popped = this.items[0];
		var last = this.items.pop();
		var length = this.items.length;

		if (length) {
			// last item is moved up into the vacated position
			this.items[0] = last;

			var i = 0;
			var item = last;

			// queue needs to be reordered
			var ordered = false;

			while (!ordered) {
				var secondChildIndex = (i + 1) * 2;
				var firstChildIndex = secondChildIndex - 1;

				var nextIndex = null;

				if (firstChildIndex < length) {
					var firstChild = this.items[firstChildIndex];

					if (this.shouldSwap(firstChild.value, item.value)) {
						nextIndex = firstChildIndex
					}
				}

				if (secondChildIndex < length) {
					var secondChild = this.items[secondChildIndex];

					if (this.shouldSwap(secondChild.value, (nextIndex === null ? item : firstChild).value)) {
						nextIndex = secondChildIndex;
					}
				}
				
				if (nextIndex === null) {
					// no more swaps required, item is in the right place
					ordered = true;
				} else {
					this.items[i] = this.items[nextIndex];
					this.items[nextIndex] = item;

					i = nextIndex;
				}
			}
		}

		return popped;
	}
}