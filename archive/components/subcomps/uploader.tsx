import * as React from "react";
import { FileInput, Holder } from "../../../data/styles";
import fdict from "../../../data/dicts/ftypedict";

export default (props) => {
  const Child = props.children[0];
  const [customComp, setCustomComp] = React.useState(props.component);
  const [satisfied, setSatisfied] = React.useState(false);

  const parseFiles = (event) => {
    const data = event.target.files;
    console.log(event.target.value);
    let fileArray = [];
    if (
      props.component.numFilesIn == -1 ||
      data.length - 1 < props.component.initParams.numFilesIn ||
      data.length == props.component.initParams.numFilesIn ||
      data.length > 0
    ) {
      Array.from(data).forEach((e: any) => {
        if (e.size < 536870912) {
          const fd = fdict[props.component.initParams.ftypesin];
          const cft = e.type.split("/")[1];
          if (props.component.initParams.ftypesin=="any"||fd.some((t) => t == cft)) {
            fileArray.push(e);
          } else {
            event.target.value = null;
            alert(
              `we do not accept the filetype ${e.type.split("/")[1]
              } for this converter`
            );
          }
        } else {
          event.target.value = null;
          alert("file is over our size limit(512mb)");
        }

        if (fileArray[0]) {
          customComp.initParams.files = fileArray;
          setCustomComp(customComp);
          console.log(customComp);
          setSatisfied(true);
        }
      });
    } else {
      event.target.value = null;
      alert(
        `you are over the file limit, you can only upload ${props.component.initParams.numFilesIn} files`
      );
    }
  };

  return (
    <Holder>
      <FileInput
        type="file"
        multiple={props.component.initParams.numFilesIn != 0 || false}
        onChange={(e) => parseFiles(e)}
      />
      {props.children && satisfied && (//TODO:why wont the child reset
        <Child
          children={props.children.splice(1)}
          component={customComp}
          callback={(f) => {
            setCustomComp(f); //TODO: is state necessary
            props.callback(customComp);
          }}
        />
      )}
    </Holder>
  );
};
