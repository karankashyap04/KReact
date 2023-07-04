// Code used for effective task scheduling (for rendering tasks)

import { createFiberDOM, commitFiberTreeToDom, fiberTreeRoot } from "./render";
import { reconcileChanges } from "./reconciler";

let nextTaskFiber = null;

function setNextTaskFiber(fiber) {
  nextTaskFiber = fiber;
}

function runRenderTasks(requestIdleCallbackDeadline) {
  while (nextTaskFiber) {
    nextTaskFiber = executeTaskAndScheduleNext(nextTaskFiber);
    // stop rendering if less than 2ms are left in this idle period
    if (requestIdleCallbackDeadline.timeRemaining() < 1) {
      break;
    }
  }
  // if there is a fiber tree that has been created and there are no tasks left,
  // then we can commit this entire tree to the DOM
  if (fiberTreeRoot && !nextTaskFiber) {
    commitFiberTreeToDom();
  }
  window.requestIdleCallback(runRenderTasks);
}

function executeTaskAndScheduleNext(fiber) {
  if (isFunctionalComponent(fiber)) {
    updateFunctionalComponent(fiber);
  } else {
    updateDOMComponent(fiber);
  }
  // schedule the next appropriate task to run
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

function isFunctionalComponent(fiber) {
  return fiber.type instanceof Function;
}

function updateFunctionalComponent(fiber) {
  // create a new fiber tree for this functional component
  const functionalComponentChildren = [fiber.type(fiber.properties)]; // TODO: need to merge fiber.children into this??
  reconcileChanges(fiber, functionalComponentChildren);
}

function updateDOMComponent(fiber) {
  // create a DOM node for this fiber if it doesn't already exist
  if (!fiber.dom) {
    fiber.dom = createFiberDOM(fiber);
  }

  // reconcile changes with previous committed fiber tree
  reconcileChanges(fiber);
}

export { nextTaskFiber, runRenderTasks, setNextTaskFiber };
