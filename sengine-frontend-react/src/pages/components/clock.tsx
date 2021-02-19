import * as React from "react";
import { Header, Holder } from "../../data/styles";

export default (props) => {
  let [ctm, setCtm] = React.useState("");
  const tick = (d = new Date()) => {
    setCtm(d.toLocaleDateString() + " - " + d.toLocaleTimeString());
  };
  const delay = 1000;
  React.useEffect(() => {
    setInterval(tick, delay);
  }, []);
  return (
    <Holder>
      <Header>{ctm}</Header>
    </Holder>
  );
};
