import { createJSXElement } from "./create_element";
import { renderElement } from "./render";
import { App } from "./example/components/App";

/** @jsx createJSXElement */

const sample_container = document.getElementById("root");

const element = <App username="Karan" />;
renderElement(element, sample_container);
