import * as React from "react";
import { FormButton, Holder, TimeDisp, TimeInput } from "../styles";

export default class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label1: false,
      label2: false,
      mins: 0,
      secs: 0,
      hour: 0,
      secTime:
        this.props.component.params.seconds +
        this.props.component.params.minutes * 60 +
        this.props.component.params.hours * 3600,
    };
  }
  chgCount = () => {
    if (this.state.secTime > 1) {
      if (this.state.label2)
        this.setState((state) => ({ isShow: state.secTime++ }));
      else this.setState((state) => ({ isShow: state.secTime-- }));
    }
  };
  swap = (type) => {
    if (type == 1) {
      this.setState((state) => ({ label1: !state.label1 }));
      if (this.state.label1) {
        clearInterval(this.tick);
      } else {
        this.tick = setInterval(this.chgCount, 1000);
      }
    } else if (type == 2) {
      this.setState((state) => ({ label2: !state.label2 }));
    }
  };
  ftime = (time) => {
    if (time < 10) return "0" + String(time);
    return String(time);
  };
  render() {
    return (
      <Holder>
        <TimeDisp>
          {this.ftime(Math.floor(this.state.secTime / 3600))} :{" "}
          {this.ftime(
            Math.floor(this.state.secTime / 60) -
              Math.floor(this.state.secTime / 3600) * 60
          )}{" "}
          : {this.ftime(Math.floor(this.state.secTime % 60))}
        </TimeDisp>
        <br />
        <FormButton onClick={() => this.swap(1)}>
          {this.state.label1 ? "Stop Timer" : "Start Timer"}
        </FormButton>
        <FormButton onClick={() => this.swap(2)}>
          {this.state.label2 ? "Count Down" : "Count Up"}
        </FormButton>
        <br />
        <TimeInput
          type="number"
          maxLength="2"
          defaultValue="00"
          min="0"
          onChange={(e) => {
            e.persist();
            this.setState((state) => ({
              hour: parseInt(e.target.value),
            }));
          }}
        />{" "}
        :{" "}
        <TimeInput
          type="number"
          maxLength="2"
          defaultValue="00"
          min="0"
          onChange={(e) => {
            e.persist();
            this.setState((state) => ({
              mins: parseInt(e.target.value),
            }));
          }}
        />{" "}
        :{" "}
        <TimeInput
          type="number"
          maxLength="2"
          defaultValue="00"
          min="0"
          onChange={(e) => {
            e.persist();
            this.setState((state) => ({
              secs: parseInt(e.target.value),
            }));
          }}
        />
        <FormButton
          onClick={() =>
            this.setState((state) => ({
              secTime:
                this.state.secs + this.state.mins * 60 + this.state.hour * 3600,
            }))
          }
        >
          Set New Time
        </FormButton>
      </Holder>
    );
  }
}