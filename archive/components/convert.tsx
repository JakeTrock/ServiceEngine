import * as React from "react";
import Uploader from "./subcomps/uploader";
import ConversionSelector from "./subcomps/conversionSelector";
import Multiloader from "./subcomps/multiloader";

export default (props) => {
  const chlist = [Multiloader, ConversionSelector];
  return (
    <Uploader
      children={chlist}
      component={props.component}
      callback={props.callback}
    />
  );
};
