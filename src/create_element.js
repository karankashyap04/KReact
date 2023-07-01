// This file defines functions to help create KReact elements}

function createJSXElement(type, elementProperties, ...elementChildren) {
  let element = {
    type: type,
    properties: {
      ...elementProperties,
    },
    children: createChildren(elementChildren),
  };
  return element;
}

function createTextElement(text) {
  // here, we are wrapping some alphanumeric text into an element
  let textElement = {
    type: "TEXT_ELEMENT",
    properties: {
      // TODO: Fill out properties here as needed
      nodeValue: text,
    },
    children: [],
  };
  return textElement;
}

function createChildren(elementChildren) {
  let children = elementChildren.map((child) => {
    // if the child is already an object (element), it can remain as is.
    // if not, we need to create an element for that child.
    if (typeof child === "object") {
      return child;
    }
    return createTextElement(child);
  });
  return children;
}

export { createJSXElement };
