import * as React from "react";
import Uploader from "./subcomps/uploader";

export default (props) => {
  return (
    <Uploader
      component={props.component}
      callback={props.callback}
    />
  );
};
