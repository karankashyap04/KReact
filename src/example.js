import { createJSXElement } from "./create_element";

const KReact = { createJSXElement };

/** @jsx KReact.createJSXElement */
const sample_element = (
  <div class="sample">
    <p>This is some text</p>
    <dummy>This is some dummy element!</dummy>
  </div>
);
