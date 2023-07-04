import { useState } from "../../useState";
import { createJSXElement } from "../../create_element";

/** @jsx createJSXElement */
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div style="color:green; padding-top: 2%">
      <h3>This is a counter (implemented with state hooks)</h3>
      <h4 onClick={() => setCount(count + 1)}>
        Click count <span style="color:lightblue">(click me!)</span>: {count}
      </h4>
    </div>
  );
}

export { Counter };
