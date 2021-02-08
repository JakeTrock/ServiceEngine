import * as React from "react";
import { FileInput, FormButton, Holder } from "../../data/styles";
import fdict from "../../data/dicts/ftypedict";

export const Uploader = (props) => {
  const Child = props.child[0];
  let [files, setFiles] = React.useState([]);
  let [customProp, setCustomProp] = React.useState({});

  const parseFiles = (data) => {
    let fileArray = [];
    if (
      props.component.numFilesIn == -1 ||
      data.length - 1 < props.component.numFilesIn ||
      data.length == props.component.numFilesIn ||
      data.length > 0
    ) {
      Array.from(data).forEach((e: any) => {
        if (e.size < 536870912) {
          if (
            fdict[props.component.params.ftypeskey].some(
              (t) => t == e.type.split("/")[1]
            )
          ) {
            if (e.name.split(".")[1] == e.type.split("/")[1]) {
              fileArray.push(e);
            } else alert("filetype must match filename for file " + e.name);
          } else
            alert(
              `we do not accept the filetype ${
                e.type.split("/")[1]
              } for this converter`
            );
        } else alert("file is over our size limit(512mb)");
        if (fileArray != []) setFiles(fileArray);
      });
    } else
      alert(
        `you are over the file limit, you can only upload ${props.numFilesIn} files`
      );
  };

  return (
    <Holder>
      <FileInput
        type="file"
        multiple={props.component.params.allowMultiFile || false}
        onChange={(e) => parseFiles(e.target.files)}
      />
      <React.Suspense fallback={<div>Loading...</div>}>
        <Child
          files={files}
          children={props.children.shift()}
          info={{ ftypes: fdict[props.component.params.ftypeskey] }}
          callback={(f) => setCustomProp(f)}
        />
      </React.Suspense>
      <FormButton
        onClick={() => {
          let tmp = {
            files,
          };
          tmp[props.component.params.uplSubType] = customProp;
          props.callback(tmp);
        }}
      >
        Upload file(s)
      </FormButton>
    </Holder>
  );
};
