import * as React from "react";
import { Holder } from "../../data/styles";

export default (props) => {
  let [selected, setSelected] = React.useState("None");
  return (
    <Holder>
      <p>
        Click dropdown and scroll to find codec of choice, or type first letter
        for quick find:
      </p>
      <select
        onChange={(e) => {
          const v = e.target.value;
          setSelected(v);
          if (v != "None") props.callback(v);
        }}
      >
        <option value="None" selected>
          {selected}
        </option>
        {props.info.ftypes.map((val, i) => {
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
