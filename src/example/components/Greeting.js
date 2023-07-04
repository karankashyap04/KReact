import { createJSXElement } from "../../create_element";

/** @jsx createJSXElement */
function Greeting(properties) {
  return (
    <div style="text-align:center">
      <h1 style="color:white"> Hey there, {properties.username}! </h1>
      <h2 style="color:pink">
        {" "}
        Welcome to <span style="color:aqua">KReact</span>!{" "}
      </h2>
      <h3 style="color:white">
        {" "}
        KReact is your next favorite frontend framework :D
      </h3>
    </div>
  );
}

export { Greeting };
