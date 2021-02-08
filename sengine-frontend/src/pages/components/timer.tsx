import * as React from "react";
import { FormButton, Holder, TimeDisp, TimeInput } from "../../data/styles";

const ftime = (time) => {
  if (time < 10) return "0" + String(time);
  return String(time);
};

export const Timer = (props) => {
  let [label1, setLabel1] = React.useState(false);
  let [label2, setLabel2] = React.useState(false);
  let mins = 0;
  let secs = 0;
  let hour = 0;
  let tick;
  let [secTime, setSecTime] = React.useState(
    (props.component.params.seconds || 0) +
      (props.component.params.minutes || 5) * 60 +
      (props.component.params.hours || 0) * 3600
  );

  const swap = (type) => {
    if (type) {
      setLabel1(!label1);
      if (label1) {
        clearInterval(tick);
      } else {
        tick = setInterval(chgCount, 1000);
      }
    } else {
      setLabel2(!label2);
    }
  };
  const chgCount = () => {
    if (secTime > 1) {
      if (label2) setSecTime(secTime++);
      else setSecTime(secTime--);
    }
  };
  return (
    <Holder>
      <TimeDisp>
        {ftime(Math.floor(secTime / 3600))} :{" "}
        {ftime(Math.floor(secTime / 60) - Math.floor(secTime / 3600) * 60)} :{" "}
        {ftime(Math.floor(secTime % 60))}
      </TimeDisp>
      <br />
      <FormButton onClick={() => swap(true)}>{label1 ? "⏸︎" : "▶︎"}</FormButton>
      <FormButton onClick={() => swap(false)}>
        {label2 ? "Count Down" : "Count Up"}
      </FormButton>
      <br />
      <TimeInput
        type="number"
        maxLength="2"
        defaultValue="00"
        min="0"
        onChange={(e) => {
          e.persist();
          hour = e.target.value;
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
          mins = e.target.value;
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
          secs = e.target.value;
        }}
      />
      <FormButton onClick={() => setSecTime(secs + mins * 60 + hour * 3600)}>
        Set New Time
      </FormButton>
    </Holder>
  );
};
