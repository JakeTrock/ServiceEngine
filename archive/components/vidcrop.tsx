import * as React from "react";
import Uploader from "./subcomps/uploader";
import Cropper from "./subcomps/cropper";
import VidPlayer from "./subcomps/vidplayer";
import MultiLoader from "./subcomps/multiloader";

export default (props) => {
  const chlist = [MultiLoader, Cropper, VidPlayer];
  return (
    <Uploader
      children={chlist}
      component={props.component}
      callback={props.callback}
    />
  );
};
