import * as React from "react";
import { FileInput, FormButton, Holder } from "../../../data/styles";
import fdict from "../../../data/dicts/ftypedict";

export default (props) => {
  let [fsl, setFsl] = React.useState(["loading failed"]);
  let [selected, setSelected] = React.useState("None");
  React.useEffect(
    () => setFsl(fdict[props.component.initParams.ftypeskey]),
    []
  );
  return (
    <Holder>
      <p>
        Click dropdown and scroll to find codec of choice, or type first letter
        for quick find:
      </p>
      <select
        defaultValue="None"
        onChange={(e) => {
          const v = e.target.value;
          setSelected(v);
          if (v != "None") {
            let tmp = props.component;
            console.log(tmp.params);
            if (props.current) tmp.params[props.current].toType = v;
            else tmp.params[0].toType = v;
            tmp.satisfied = true;
            props.callback(tmp);
          }
        }}
      >
        <option value="None">{selected}</option>
        {fsl.map((val, i) => {
          return (
            <option value={val} key={i}>
              {val}
            </option>
          );
        })}
      </select>
    </Holder>
  );
};
