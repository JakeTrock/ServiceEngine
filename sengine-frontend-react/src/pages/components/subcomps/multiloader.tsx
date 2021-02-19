import * as React from "react";
import { FormButton, Holder } from "../../../data/styles";

export default (props) => {
  console.log("loaded");
  const Child = props.child[0];
  let [currentFile, setCurrentFile] = React.useState("0");

  return (
    <Holder>
      <select onChange={(e) => setCurrentFile(e.target.value)} defaultValue="0">
        <option value="0">{currentFile}</option>
        {props.files.map((val, i) => {
          return (
            <option value={i} key={i}>
              {val.name}
            </option>
          );
        })}
      </select>
      <Child
        component={props.component}
        current={currentFile}
        children={props.children.splice(1)}
        callback={(f) => {
          const tmp = props.component;
          tmp.params[Number(currentFile)] = f;
          props.callback(tmp);
        }}
      />
    </Holder>
  );
};
