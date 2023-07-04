// This file defines functions required to render KReact elements

import { nextTaskFiber, runRenderTasks, setNextTaskFiber } from "./scheduler";

import { deletionQueue, setDeletionQueue } from "./reconciler";

let fiberTreeRoot = null;
let lastCommittedFiberTreeRoot = null;

function setFiberTreeRoot(fiber) {
  fiberTreeRoot = fiber;
}

// NOTE: might want to move this into the end of the renderElement function
window.requestIdleCallback(runRenderTasks);

function renderElement(element, parentContainer) {
  // set the next render task to be for the root of the fiber tree
  setNextTaskFiber({
    dom: parentContainer,
    properties: {},
    children: [element],
    previousFiberRootCommit: lastCommittedFiberTreeRoot,
  });

  // create a new fiber tree with the root being the outermost element we want to render
  fiberTreeRoot = nextTaskFiber;

  setDeletionQueue([]);
}

function createFiberDOM(fiber) {
  // create the DOM element for this fiber
  let fiberDOM =
    fiber.type === "text"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  // // assign properties to the elementDOM
  fiber.dom = fiberDOM;
  updateDOMPropertiesAndEventListeners(fiber);
  return fiberDOM;
}

/* NOTE: the reason we're committing the entire fiber tree to the DOM
in one go, once the fiber tree is prepared and there are no tasks
left (no fibers to add) is so that there are no browser interrupts
while the tree is being rendered. If we rendered each fiber individually,
browser interrupts would cause the UI elements to load in bits and pieces,
being interrupted in the middle by other browser tasks, causing a worsened
user experience.
*/
function commitFiberTreeToDom() {
  // Implements the COMMIT PHASE of React Fiber

  // delete any nodes that need to be removed from the previous commit
  deletionQueue.forEach((fiber) => commitFiberToDom(fiber));

  if (fiberTreeRoot.child) {
    commitFiberToDom(fiberTreeRoot.child);
  }
  lastCommittedFiberTreeRoot = fiberTreeRoot; // store last committed fiber tree for future diffing purposes (reconciliation)
  fiberTreeRoot = null; // reset fiber tree
}

function commitFiberToDom(fiber) {
  // go up the dom tree till we find an ancestor of this fiber which has a dom node
  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }
  const parentContainer = fiberParent.dom;

  if (fiber.dom && fiber.changeMade === "add") {
    parentContainer.appendChild(fiber.dom);
  } else if (fiber.changeMade === "deleted") {
    // go down the fiber tree till we find a child to be removed (child which has a dom node)
    let toDelete = fiber;
    while (!toDelete.dom) {
      toDelete = toDelete.child;
    }
    parentContainer.removeChild(toDelete.dom);
  } else if (fiber.dom && fiber.changeMade === "property-update") {
    updateDOMPropertiesAndEventListeners(fiber);
  }

  // commit in depth-first order (so each components renders completely one at a time)
  if (fiber.child) {
    commitFiberToDom(fiber.child);
  }
  if (fiber.rightSibling) {
    commitFiberToDom(fiber.rightSibling);
  }
}

function updateDOMPropertiesAndEventListeners(fiber) {
  let fiberDOM = fiber.dom;
  const prevFiberProperties = fiber.previousFiberRootCommit
    ? fiber.previousFiberRootCommit.properties
    : {};
  const newFiberProperties = fiber.properties;

  const isEventListener = (key) => key.startsWith("on");

  // finding and removing properties that are no longer present in the new fiber
  const toRemove = Object.keys(prevFiberProperties).filter(
    (key) => !(key in newFiberProperties) && !isEventListener(key)
  );
  toRemove.forEach((property) => {
    delete fiberDOM[property];
  });

  // finding and adding new properties that either weren't in the old fiber, or
  // whose values have been updated since the old fiber
  const toAdd = Object.keys(newFiberProperties).filter(
    (key) =>
      !isEventListener(key) &&
      (!(key in prevFiberProperties) ||
        prevFiberProperties[key] !== newFiberProperties[key])
  );
  toAdd.forEach((property) => {
    fiberDOM[property] = newFiberProperties[property];
  });

  const getEventType = (eventListener) =>
    eventListener.substring(2).toLowerCase();

  // finding and removing event listeners that have either been removed or changed
  // in the new fiber
  const outdatedEventListeners = Object.keys(prevFiberProperties).filter(
    (key) =>
      isEventListener(key) &&
      (!(key in newFiberProperties) ||
        prevFiberProperties[key] !== newFiberProperties[key])
  );
  outdatedEventListeners.forEach((eventListener) => {
    fiberDOM.removeEventListener(
      getEventType(eventListener),
      prevFiberProperties[eventListener]
    );
  });

  // adding new event listeners:
  const newEventListeners = Object.keys(newFiberProperties).filter(
    (key) =>
      isEventListener(key) &&
      (!(key in prevFiberProperties) ||
        prevFiberProperties[key] !== newFiberProperties[key])
  );
  newEventListeners.forEach((eventListener) => {
    fiberDOM.addEventListener(
      getEventType(eventListener),
      newFiberProperties[eventListener]
    );
  });
}

export {
  renderElement,
  createFiberDOM,
  commitFiberTreeToDom,
  fiberTreeRoot,
  setFiberTreeRoot,
  lastCommittedFiberTreeRoot,
};
