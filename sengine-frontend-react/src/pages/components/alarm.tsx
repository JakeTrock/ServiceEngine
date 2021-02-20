import * as React from "react";
import { FormButton, Holder, TimeInput, Header } from "../../data/styles";
import ToggleSwitch from "./microcomps/switch";

export default (props) => {
  let t;
  let h = 0 || props.component.initParams.hours;
  let m = 0 || props.component.initParams.minutes;
  let s = 0 || props.component.initParams.seconds;
  const [a, setA] = React.useState(false);
  const [ctm, setCtm] = React.useState("");
  const delay = 1000;
  const tick = (d = new Date()) => {
    const tls = d.toLocaleTimeString();
    if (tls == `${h}:${m}:${s} ${a ? "AM" : "PM"}`) {
      setCtm("time up!");
      clearInterval(t);
    } else setCtm(d.toLocaleDateString() + " - " + tls);
  };

  return (
    <Holder>
      <p>input time here:</p>
      <TimeInput
        type="text"
        step="1"
        placeholder="00"
        onBlur={(e) => (h = e.target.value.padStart(2, "0"))}
      />
      :
      <TimeInput
        type="text"
        step="1"
        placeholder="00"
        onBlur={(e) => (m = e.target.value.padStart(2, "0"))}
      />
      :
      <TimeInput
        type="text"
        step="1"
        placeholder="00"
        onBlur={(e) => (s = e.target.value.padStart(2, "0"))}
      />
      <ToggleSwitch onClick={() => setA(!a)} labelT="AM" labelF="PM" />
      <FormButton onClick={() => (t = setInterval(tick, delay))}>
        set time
      </FormButton>
      <Header>{ctm}</Header>
    </Holder>
  );
};
