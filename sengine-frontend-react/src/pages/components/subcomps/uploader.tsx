import * as React from "react";
import { FileInput, FormButton, Holder } from "../../../data/styles";
import fdict from "../../../data/dicts/ftypedict";

export default (props) => {
  const Child = props.children[0];
  const [customComp, setCustomComp] = React.useState(props.component);
  const [satisfied, setSatisfied] = React.useState(false);

  const parseFiles = (data) => {
    const fileArray = [];
    if (
      props.component.numFilesIn == -1 ||
      data.length - 1 < props.component.initParams.numFilesIn ||
      data.length == props.component.initParams.numFilesIn ||
      data.length > 0
    ) {
      Array.from(data).forEach((e: any) => {
        if (e.size < 536870912) {
          const fd = fdict[props.component.initParams.ftypeskey];
          if (fd.some((t) => t == e.type.split("/")[1])) {
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
        if (fileArray != [])
          setCustomComp((cc) => (cc.initParams.files = fileArray));
          setSatisfied(true);
      });
    } else
      alert(
        `you are over the file limit, you can only upload ${props.component.initParams.numFilesIn} files`
      );
  };

  return (
    <Holder>
      <FileInput
        type="file"
        multiple={props.component.initParams.allowMultiFile || false}
        onChange={(e) => parseFiles(e.target.files)}
      />
      {satisfied && (
        <Child
          children={
            props.component.initParams.files.length > 1
              ? props.children.splice(1)
              : props.children.splice(2)
          }
          component={
            props.component.initParams.files.length > 1
              ? new Array(props.component.initParams.files.length).fill({})
              : customComp
          }
          callback={(f) => {
            setCustomComp(f);
            console.log(f);
          }}
        />
      )}
      <FormButton onClick={() => props.callback(customComp)}>
        Upload file(s)
      </FormButton>
    </Holder>
  );
};
