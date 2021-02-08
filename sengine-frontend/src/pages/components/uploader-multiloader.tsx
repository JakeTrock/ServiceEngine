import * as React from "react";
import { FileInput, FormButton, Holder } from "../../data/styles";
import fdict from "../../data/dicts/ftypedict";

export const MultiLoader = (props) => {
  const Child = props.child[0];
  let [params, setParams] = React.useState([]);
  let [currentFile, setCurrentFile] = React.useState("0");

  const changeFile = (event) => {
    const file = props.files[Number(currentFile)];
    var videoNode = document.querySelector("video");
    if (videoNode.canPlayType(file.type) === "")
      return alert("video editor dosen't support this format");
  
    var fileURL = (window.URL || window.webkitURL).createObjectURL(file);
    videoNode.src = fileURL;
  };

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
          files={props.files}
          children={props.children.shift()}
          info={{ ftypes: fdict[props.component.params.ftypeskey] }}
          callback={(f) => {
            const tmp = params;
            params[Number(currentFile)] = f;
            setParams(tmp);
          }}
        />
      </React.Suspense>
      {/* ^ above component will contain <video controls></video> */}
      <FormButton onClick={props.callback(params)}>Save</FormButton>
    </Holder>
  );
};