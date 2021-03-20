import * as React from "react";
import { FileInput, FormButton, Holder } from "../../../data/styles";
import fdict from "../../../data/dicts/ftypedict";

export default (props) => {
  if (
    props.component &&
    props.component.initParams &&
    props.component.initParams.ftypesout &&
    props.callback
  ) {
    const [fsl, setFsl] = React.useState(["loading failed"]);
    const [selected, setSelected] = React.useState("None");
    React.useEffect(
      () => setFsl(fdict[props.component.initParams.ftypesout]),
      []
    );
    return (
      <Holder>
        <p>
          Click dropdown and scroll to find codec of choice, or type first
          letter for quick find:
        </p>
        <select
          defaultValue="None"
          onChange={(e) => {
            const v = e.target.value;
            setSelected(v);
            if (v != "None") {
              props.callback({ toType: v });
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
  } else {
    return <p>load error</p>;
  }
};
