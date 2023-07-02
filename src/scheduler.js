// Code used for effective task scheduling (for rendering tasks)

import { createFiberDOM, commitFiberTreeToDom } from "./render";

var nextTaskFiber = null;
var fiberTreeRoot = null;

// window.requestIdleCallback(runRenderTasks);

function runRenderTasks(requestIdleCallbackDeadline) {
  while (nextTaskFiber) {
    nextTaskFiber = executeTaskAndScheduleNext(nextTaskFiber);
    // stop rendering if less than 2ms are left in this idle period
    if (requestIdleCallbackDeadline.timeRemaining() < 2) {
      window.requestIdleCallback(runRenderTasks);
      break;
    }
  }
  // if there is a fiber tree that has been created and there are no tasks left,
  // then we can commit this entire tree to the DOM
  if (fiberTreeRoot && !nextTaskFiber) {
    commitFiberTreeToDom();
  }
}

function executeTaskAndScheduleNext(fiber) {
  // create a DOM element for this fiber is it doesn't already exist
  if (!fiber.dom) {
    fiber.dom = createFiberDOM(fiber);
  }

  // since every child of the element associated with this fiber is also an element,
  // each of those children will have their own fibers. Creating fibers for children:
  let leftSibling = null;
  fiber.children.forEach((child) => {
    const childFiber = {
      type: child.type,
      properties: child.properties,
      children: child.children, // TODO: look into this... do I want it here???
      parent: fiber,
      dom: null,
    };
    // add the fiber for the child to the Fiber Tree
    // NOTE: while we call this the Fiber "tree", it is really a linked list: the parent
    // fiber points to its first child, which points to the next child, which points to
    // the third child, and so forth
    if (!fiber.child) {
      fiber.child = childFiber; // NOTE: this is the first child of the fiber
    } else {
      leftSibling.rightSibling = childFiber;
    }
    leftSibling = childFiber;
  });
  return scheduleNextTask(fiber);
}

function scheduleNextTask(fiber) {
  // if the fiber has a child, that child becomes the next fiber to render
  if (fiber.child) {
    return fiber.child;
  }
  // else, if the fiber has a sibling (rightSibling), that becomes the next fiber to render
  if (fiber.rightSibling) {
    return fiber.rightSibling;
  }
  // else, we recursively go up the fiber tree until we reach a fiber with a rightSibling,
  // or we reach the root, in which case the render is complete (so no future tasks are required)
  let parentFiber = fiber.parent;
  while (parentFiber) {
    if (parentFiber.rightSibling) {
      return parentFiber.rightSibling;
    }
    parentFiber = parentFiber.parent;
  }
}

export { nextTaskFiber, fiberTreeRoot, runRenderTasks };
