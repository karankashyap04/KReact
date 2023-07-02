// This file defines functions required to render KReact elements

import { nextTaskFiber, fiberTreeRoot, runRenderTasks } from "./scheduler";

// NOTE: might want to move this into the end of the renderElement function
window.requestIdleCallback(runRenderTasks);

function renderElement(element, parentContainer) {
  // set the next render task to be for the root of the fiber tree
  nextTaskFiber = {
    parentContainerDOM: parentContainer,
    properties: {},
    children: [element],
  };
  // assigning with the spread operator so that we copy over the values, rather
  // than tying the fiber tree root to the next task fiber by reference:
  fiberTreeRoot = {
    ...nextTaskFiber,
  };
}

function createFiberDOM(fiber) {
  // create the DOM element for this fiber
  let fiberDOM =
    fiber.type === "text"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  // assign properties to the elementDOM
  Object.entries(fiber.properties).forEach(([key, value]) => {
    fiberDOM[key] = value;
  });
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
  console.log("fiber tree root child: " + fiberTreeRoot.child);
  if (fiberTreeRoot.child) {
    commitFiberToDom(fiberTreeRoot.child);
  }
  fiberTreeRoot = null; // reset fiber tree
}

function commitFiberToDom(fiber) {
  const parentContainer = fiber.parent.dom;
  parentContainer.appendChild(fiber.dom);
  // render in depth-first order (so each components renders completely one at a time)
  if (fiber.child) {
    commitFiberToDom(fiber.child);
  }
  if (fiber.rightSibling) {
    commitFiberToDom(fiber.rightSibling);
  }
}

export { renderElement, createFiberDOM, commitFiberTreeToDom };
