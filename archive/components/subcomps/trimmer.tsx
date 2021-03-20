import * as React from "react";
import { Holder } from "../../../data/styles";
import {
  Slider,
  InvLeft,
  InvRight,
  DivRange,
  HoverThumb,
  RangeInput,
} from "../../../data/styles_custom/trim_styles";

export default (props) => {
  const Child = props.children[0];

  // const CropRef = React.useRef(null);

  // const updateSt = () => {
  //   const vals = [
  //     pxInt(element.style.left) || 10,
  //     pxInt(element.style.top) || 10,
  //     pxInt(element.style.width) || 100,
  //     pxInt(element.style.height) || 100,
  //   ];
  //   props.callback({ cropDim: vals });
  // };
  return (
    <Holder>
      <Child
        file={props.component.initParams.files[props.current]}
        callback={(e) => initSet(CropRef, e)}
      />
      <Slider id="slider-distance">
        <div>
          <InvLeft style="width:70%;" />
          <InvRight style="width:70%;" />
          <DivRange style="left:30%;right:40%;" />
        </div>
        <RangeInput
          type="range"
          tabIndex={0}
          value="30"
          max="100"
          min="0"
          step="1"
          onInput={() => {
            this.value = Math.min(
              this.value,
              this.parentNode.childNodes[5].value - 1
            );
            const value =
              (100 / (parseInt(this.max) - parseInt(this.min))) *
                parseInt(this.value) -
              (100 / (parseInt(this.max) - parseInt(this.min))) *
                parseInt(this.min);
            const children = this.parentNode.childNodes[1].childNodes;
            children[1].style.width = value + "%";
            children[5].style.left = value + "%";
          }}
        />

        <RangeInput
          type="range"
          tabIndex={0}
          value="60"
          max="100"
          min="0"
          step="1"
          onInput={() => {
            this.value = Math.max(
              this.value,
              this.parentNode.childNodes[3].value - -1
            );
            const value =
              (100 / (parseInt(this.max) - parseInt(this.min))) *
                parseInt(this.value) -
              (100 / (parseInt(this.max) - parseInt(this.min))) *
                parseInt(this.min);
            const children = this.parentNode.childNodes[1].childNodes;
            children[3].style.width = 100 - value + "%";
            children[5].style.right = 100 - value + "%";
          }}
        />
      </Slider>
    </Holder>
  );
};
