import { createJSXElement } from "./create_element";
import { renderElement } from "./render";

const KReact = { createJSXElement, renderElement };

/** @jsx KReact.createJSXElement */
const sample_element = (
  <div style="background: aqua">
    <h1 style="text-align: center">Welcome to KReact!</h1>
    <h4 style="text-align: center">Your next favorite frontend framework!</h4>
  </div>
);

const sample_container = document.getElementById("root");
KReact.renderElement(sample_element, sample_container);
