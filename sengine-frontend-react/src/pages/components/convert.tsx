import * as React from "react";
import Uploader from "./subcomps/uploader";
import ConversionSelector from "./subcomps/conversionSelector";

export default (props) => {
  const chlist = [ConversionSelector];
  return (
    <Uploader
      children={chlist}
      component={props.component}
      callback={props.callback}
    />
  );
};
