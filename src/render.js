// This file defines functions required to render KReact elements

import { nextTaskFiber } from "./scheduler";
import { runRenderTasks } from "./scheduler";

// NOTE: might want to move this into the end of the renderElement function
window.requestIdleCallback(runRenderTasks);

function renderElement(element, parentContainer) {
  // set the next render task to be for the root of the fiber tree
  nextTaskFiber = {
    parentContainerDOM: parentContainer,
    properties: {},
    children: [element],
  };
}

function createFiberDOM(fiber) {
  // create the DOM element for this fiber
  let fiberDOM =
    fiber.type === "text-element"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  // assign properties to the elementDOM
  Object.entries(fiber.properties).forEach(([key, value]) => {
    fiberDOM[key] = value;
  });
}

export { renderElement };
