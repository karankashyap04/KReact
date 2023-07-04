import { createJSXElement } from "./create_element";
import { renderElement } from "./render";

const KReact = { createJSXElement, renderElement };

/** @jsx KReact.createJSXElement */

const sample_container = document.getElementById("root");

function App(properties) {
  return (
    <div>
      <h1>Hey {properties.username}!</h1>
      <h3>Welcome to KReact!</h3>
      <h4>
        Take a tour of this sample KReact site; KReact is guaranteed to become
        your next favorite frontend framework :D
      </h4>
    </div>
  );
}

const element = <App username="Karan" />;
KReact.renderElement(element, sample_container);
