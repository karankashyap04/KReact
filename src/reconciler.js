// Code which provides functionality similar to the reconciliation phase of React Fiber

var deletionQueue = [];

function setDeletionQueue(queue) {
  deletionQueue = queue;
}

function reconcileChanges(fiber) {
  // since every child of the element associated with this fiber is also an element,
  // each of those children will have their own fibers. Creating fibers for children:
  let leftSibling = null;
  let i = 0;
  let prevCommitFiber = fiber.previousFiberRootCommit
    ? fiber.previousFiberRootCommit.child
    : null;

  while (i < fiber.children.length || prevCommitFiber != null) {
    const child = fiber.children[i];
    let reconciledFiber = null;

    // Comparing the child fiber against the fiber from the previous commit:
    const isTypeSame = isFiberSameType(child, prevCommitFiber);
    // if the type is the same, we don't need to create a new DOM node; we can simply
    // update its properties
    if (isTypeSame) {
      reconciledFiber = {
        changeMade: "property-update",
        type: prevCommitFiber.type,
        properties: child.properties,
        children: child.children,
        parent: fiber,
        dom: prevCommitFiber.dom,
        previousFiberRootCommit: prevCommitFiber,
      };
    } else {
      if (child) {
        // if there is a new child, we need to create a new DOM node
        reconciledFiber = {
          changeMade: "add",
          type: child.type,
          properties: child.properties,
          children: child.children,
          parent: fiber,
          dom: null,
          previousFiberRootCommit: null,
        };
      }
      // if there was an old fiber in the previous commit, we need to remove it
      if (prevCommitFiber) {
        prevCommitFiber.changeMade = "deleted";
        deletionQueue.push(prevCommitFiber);
      }
    }

    if (prevCommitFiber) {
      prevCommitFiber = prevCommitFiber.rightSibling;
    }

    // add the fiber for the child to the Fiber Tree
    // NOTE: while we call this the Fiber "tree", it is really a linked list: the parent
    // fiber points to its first child, which points to the next child, which points to
    // the third child, and so forth
    if (i === 0) {
      fiber.child = reconciledFiber; // NOTE: this is the first child of the fiber
    } else if (child) {
      leftSibling.rightSibling = reconciledFiber;
    }
    leftSibling = reconciledFiber;

    i++;
  }
}

function isFiberSameType(fiber1, fiber2) {
  return fiber1 && fiber2 && fiber1.type === fiber2.type;
}

export { reconcileChanges, deletionQueue, setDeletionQueue };
