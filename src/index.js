import { createJSXElement } from "./create_element";
import { renderElement } from "./render";
import { useState } from "./useState";

// TODO: remove this KReact object; it seems unnecessary
const KReact = { createJSXElement, renderElement, useState };

/** @jsx KReact.createJSXElement */

const sample_container = document.getElementById("root");

function Counter() {
  const [count, setCount] = KReact.useState(0);
  return <h4 onClick={() => setCount(count + 1)}>Click count: {count}</h4>;
}

function App(properties) {
  return (
    <div>
      <h1>Hey {properties.username}!</h1>
      <h3>Welcome to KReact!</h3>
      <h4>
        Take a tour of this sample KReact site; KReact is guaranteed to become
        your next favorite frontend framework :D
      </h4>
      <br />

      <h3>Here's a counter element implemented with the useState hook:</h3>
      <Counter />
    </div>
  );
}

const element = <App username="Karan" />;
KReact.renderElement(element, sample_container);
