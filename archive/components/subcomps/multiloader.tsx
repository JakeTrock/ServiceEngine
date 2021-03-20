import * as React from "react";
import { Holder } from "../../../data/styles";
import ToggleSwitch from "../microcomps/switch";

export default (props) => {
  const Child = props.children[0];
  const [currentFile, setCurrentFile] = React.useState("0");
  const [customComp, setCustomComp] = React.useState(props.component);
  const [clone, setClone] = React.useState(true);

  React.useEffect(() => {
    customComp.params = [{}];
    setCustomComp(customComp);
  }, []);

  return (
    <Holder>
      <ToggleSwitch
        onClick={() => {
          setClone(!clone);
          if (clone) {
            customComp.params = [{}];
            setCustomComp(customComp);
          } else {
            customComp.params = new Array(
              props.component.initParams.files.length
            ).fill({});
            setCustomComp(customComp);
          }
        }}
        labelF="unique settings for each"
        labelT="apply one setting to all"
      />

      {!clone && (
        <select
          onChange={(e) => setCurrentFile(e.target.value)}
          defaultValue="choose current file"
        >
          {customComp.initParams.files.map((val, i) => {
            return (
              <option value={i} key={i}>
                {val.name}
              </option>
            );
          })}
        </select>
      )}
      <Child
        component={customComp}
        current={clone ? 0 : Number(currentFile)}
        children={props.children.splice(1)}
        callback={(f) => {
          console.log(f);
          const tmp = props.component;
          tmp.params[Number(currentFile)] = f;
          props.callback(tmp);
        }}
      />
    </Holder>
  );
};
