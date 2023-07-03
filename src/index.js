import { createJSXElement } from "./create_element";
import { renderElement } from "./render";

const KReact = { createJSXElement, renderElement };

/** @jsx KReact.createJSXElement */

const sample_container = document.getElementById("root");

const updateInput = (event) => render(event.target.value);

const render = (inputValue) => {
  const sample_element = (
    <div>
      <h2>Type into the form below:</h2>
      <input onInput={updateInput} value={inputValue} />
      <h3>The content in the input is: {inputValue}</h3>
    </div>
  );
  KReact.renderElement(sample_element, sample_container);
};

render("");
