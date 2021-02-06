import * as React from "react";
import { FileInput, FormButton, Holder } from "../../../data/styles";

export default class Uploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: "None",
    };
  }
  render() {
    return (
      <Holder>
        <p>
          Click dropdown and scroll to find codec of choice, or type first
          letter for quick find:
        </p>
        <select
          onChange={(e) => {
            const v = e.target.value;
            this.setState({
              selected: v,
            });
            if (v != "None") this.props.callback(v);
          }}
        >
          <option value="None" selected>
            {this.state.selected}
          </option>
          {this.props.info.ftypes.map((val, i) => {
            return (
              <option value={val} key={i}>
                {val}
              </option>
            );
          })}
        </select>
      </Holder>
    );
  }
}
