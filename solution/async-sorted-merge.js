'use strict'

var PriorityQueue = require('../lib/priority-queue.js');

module.exports = (logSources, printer) => {
	var priorityDateAsc = (a, b) => a.date < b.date;
	var queue = new PriorityQueue(priorityDateAsc);

	// initial count of undrained sources
	var numSources = logSources.length;

	/**
	 * The initial inserts can happen in any order since the queue will
	 * prioritize the items, but have to wait until all initial inserts
	 * are finished to start popping and printing.
	 */
	var populateQueue = Promise.all(logSources.map((source, sourceIndex) => {
		return source.popAsync().then(log => {
			var drained = log === false;

			drained ? numSources-- : queue.insert(log, sourceIndex);
		})
	}));

	/**
	 * Chain a new promise to the lastPromise with the next pop/insert
	 * operation until no undrained sources remain.
	 */
	function popAndInsertAsync(lastPromise) {
		lastPromise.then(() => {
			if (numSources > 0) {
				var nextLogOut = queue.pop();

				printer.print(nextLogOut.value);

				var replacementLogIndex = nextLogOut.sourceIndex;

				var nextPromise = logSources[replacementLogIndex].popAsync().then(replacementLog => {
					var drained = replacementLog === false;

					drained ? numSources-- : queue.insert(replacementLog, replacementLogIndex);
				});

				popAndInsertAsync(nextPromise);
			} else {
				printer.done();
			}
		});
	}

	popAndInsertAsync(populateQueue);
}