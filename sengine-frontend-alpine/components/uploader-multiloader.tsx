import * as React from "react";
import { FormButton, Holder } from "../../data/styles";

export default (props) => {
  console.log(props);
  const Child = props.children[0];
  console.log(Child);
  console.log(props.children);
  const filesUrl = props.files.map((f) =>
    (window.URL || window.webkitURL).createObjectURL(f)
  );
  let [params, setParams] = React.useState([]);
  let [currentFile, setCurrentFile] = React.useState("0");

  return (
    <Holder>
      <select onChange={(e) => setCurrentFile(e.target.value)}>
        <option value="0" selected>
          {currentFile}
        </option>
        {props.files.map((val, i) => {
          return (
            <option value={i} key={i}>
              {val.name}
            </option>
          );
        })}
      </select>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Child
          file={filesUrl[Number(currentFile)]}
          children={props.children.splice(1)}
          callback={(f) => {
            let tmp = params;
            params[Number(currentFile)] = f;
            setParams(tmp);
          }}
        />
      </React.Suspense>
      <FormButton onClick={props.callback(params)}>Save</FormButton>
    </Holder>
  );
};
