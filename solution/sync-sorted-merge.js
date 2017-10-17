'use strict'

var PriorityQueue = require('../lib/priority-queue.js');

module.exports = (logSources, printer) => {
  var priorityDateAsc = (a, b) => a.date < b.date;
  var queue = new PriorityQueue(priorityDateAsc);

  // initial count of undrained sources
  var numSources = logSources.length;

  // populate the queue with a log from each source
  for (var sourceIndex = 0; sourceIndex < numSources; sourceIndex++) {
    var log = logSources[sourceIndex].pop();
    // a source isn't guaranteed to have logs
    var drained = log === false;

    drained ? numSources-- : queue.insert(log, sourceIndex);
  }

  while (numSources > 0) {
    var nextLogOut = queue.pop();
    printer.print(nextLogOut.value);

    // replace the popped log with one from the same source
    var replacementLogSourceIndex = nextLogOut.sourceIndex;
    var replacementLog = logSources[replacementLogSourceIndex].pop();
    var replacementLogSourceDrained = replacementLog === false;

    replacementLogSourceDrained ? numSources-- : queue.insert(replacementLog, replacementLogSourceIndex);
  }

  printer.done();
}