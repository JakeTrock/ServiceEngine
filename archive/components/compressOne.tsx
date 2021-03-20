import * as React from "react";
import Uploader from "./subcomps/uploader";
import List from "./microcomps/textinput";
import ZipWiz from "./wizards/zipwiz";

export default (props) => {
  const chlist = [ZipWiz, List];
  return (
    <Uploader
      children={chlist}
      component={props.component}
      callback={props.callback}
    />
  );
};
