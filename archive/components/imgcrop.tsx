import * as React from "react";
import Uploader from "./subcomps/uploader";
import Cropper from "./subcomps/cropper";
import ImgViewer from "./subcomps/imgviewer";
import MultiLoader from "./subcomps/multiloader";
import MagickWiz from "./wizards/imagemagickwiz";

export default (props) => {
  const chlist = [MagickWiz, MultiLoader, Cropper, ImgViewer];
  return (
    <Uploader
      children={chlist}
      component={props.component}
      callback={props.callback}
    />
  );
};
