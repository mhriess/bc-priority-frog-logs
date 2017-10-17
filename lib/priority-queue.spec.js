import test from 'ava'
import PriorityQueue from './priority-queue'

var priorityIntAsc = (a, b) => a < b;

test.beforeEach(t => {
  var queue = new PriorityQueue(priorityIntAsc);
  var input = [8, 1, 6, 12, 4, 9, 15];
  var sourceIndex = 0;

  input.forEach(n => queue.insert(n, sourceIndex));

  t.context.queue = queue;
  t.context.input = input;
});

test('push inserts items in the correct order', t => {
  var queue = t.context.queue;
  var input = t.context.input;

  var expected = [1, 4, 6, 12, 8, 9, 15];

  for (var i = 0; i < input.length; i++) {
    t.true(queue.items[i].value === expected[i]);
  }
});

test('pop removes items in the correct order', t => {
  var queue = t.context.queue;
  var input = t.context.input;

  var expected = input.slice().sort(priorityIntAsc).reverse();

  for (var i = 0; i < input.length; i++) {
    t.true(queue.pop().value === expected[i]);
  }
});