// This file defines functions required to render KReact elements

function renderElement(element, parentContainer) {
  // create the element in the DOM
  let domElement =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  // assign properties to the domElement
  console.log(element.properties);
  Object.entries(element.properties).forEach(([key, value]) => {
    domElement[key] = value;
  });

  // render all the children as well
  element.children.forEach((child) => renderElement(child, domElement));

  // append the created domElement to the parentContainer
  parentContainer.appendChild(domElement);
}

export { renderElement };
