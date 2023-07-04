// Code which implements the useState hook

import {
  currentFunctionalFiber,
  setCurrentFunctionalFiber,
  setNextTaskFiber,
} from "./scheduler";
import {
  fiberTreeRoot,
  setFiberTreeRoot,
  lastCommittedFiberTreeRoot,
} from "./render";
import { setDeletionQueue } from "./reconciler";

function useState(initialValue) {
  const prevHook =
    currentFunctionalFiber.fiber.previousFiberRootCommit &&
    currentFunctionalFiber.fiber.previousFiberRootCommit.hooks
      ? currentFunctionalFiber.fiber.previousFiberRootCommit.hooks[
          currentFunctionalFiber.hookPos
        ]
      : undefined;

  // define the new (or updated) hook
  const hook = {
    state: prevHook ? prevHook.state : initialValue,
    taskQueue: [], // maintain a queue of values to be assigned to the state variable
  };

  if (prevHook) {
    prevHook.taskQueue.forEach((stateValue) => {
      hook.state = stateValue;
    });
  }

  // update the fiber and hook position for the current functional fiber based on the hook
  // updates made here
  if (currentFunctionalFiber.fiber && currentFunctionalFiber.fiber.hooks) {
    let updatedFiber = currentFunctionalFiber.fiber;
    updatedFiber.hooks.push(hook);
    setCurrentFunctionalFiber(updatedFiber, currentFunctionalFiber.hookPos + 1);
  }

  // create the setState function to enable state value changes
  const setState = (newState) => {
    // push a task which will assign the new state value to the stateful variable
    hook.taskQueue.push(newState);

    // set a new fiber tree root (since we're starting a new rendering phase)
    setFiberTreeRoot({
      dom: lastCommittedFiberTreeRoot.dom,
      properties: lastCommittedFiberTreeRoot.properties,
      children: lastCommittedFiberTreeRoot.children,
      previousFiberRootCommit: lastCommittedFiberTreeRoot,
    });
    // set the fiber for the next task to be the new fiber tree root we have created
    setNextTaskFiber(fiberTreeRoot);
    setDeletionQueue([]); // reset deletion queue -> should be empty for the start of
    // the new rendering phase
  };

  return [hook.state, setState];
}

export { useState };
