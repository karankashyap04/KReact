import { Greeting } from "./Greeting";
import { Counter } from "./Counter";
import { createJSXElement } from "../../create_element";

/** @jsx createJSXElement */
function App(properties) {
  return (
    <div style="background: black; padding: 1%">
      <Greeting username={properties.username} />
      <Counter />
    </div>
  );
}

export { App };
