import * as React from "react";
import { FormButton, Holder } from "../../../data/styles";
import {
  CropBottomLeft,
  CropBottomRight,
  CropBox,
  CropParent,
  CropTopLeft,
  CropTopRight,
  Vwrap,
} from "../../../data/styles_custom/crop_styles";
// import "../../../data/styles_custom/cropstyles.css";

const minimum_size = 20;

export default (props) => {
  const Child = props.children[0];
  const [xywh, setXYWH] = React.useState([0, 0, 0, 0]);
  const [MXMY, setMXMY] = React.useState([0, 0]);
  const CropRef = React.useRef(null);

  function initSet(ele, dim) {
    const element = ele.current;
    const resizers = document.querySelectorAll(" .resizer");
    const odim = dim;
    let original_width = dim[2];
    let original_height = dim[3];
    let original_x = dim[0];
    let original_y = dim[1];
    let original_mouse_x = 0;
    let original_mouse_y = 0;
    for (let i = 0; i < resizers.length; i++) {
      const currentResizer = resizers[i];
      currentResizer.addEventListener("mousedown", function (e) {
        e.preventDefault();
        original_width = parseFloat(
          getComputedStyle(element, null)
            .getPropertyValue("width")
            .replace("px", "")
        );
        original_height = parseFloat(
          getComputedStyle(element, null)
            .getPropertyValue("height")
            .replace("px", "")
        );
        original_x = element.getBoundingClientRect().left;
        original_y = element.getBoundingClientRect().top;
        original_mouse_x = e.pageX;
        original_mouse_y = e.pageY;
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResize);
      });

      function resize(e) {
        if (currentResizer.classList.contains("bottom-right")) {
          const width = original_width + (e.pageX - original_mouse_x);
          const height = original_height + (e.pageY - original_mouse_y);
          if (width > minimum_size && width < odim[3]) {
            element.style.width = width + "px";
          }
          if (height > minimum_size && height < odim[3]) {
            element.style.height = height + "px";
          }
        } else if (currentResizer.classList.contains("bottom-left")) {
          const width = original_width - (e.pageX - original_mouse_x);
          const height = original_height + (e.pageY - original_mouse_y);
          if (height > minimum_size && height < odim[3]) {
            element.style.height = height + "px";
          }
          if (width > minimum_size && width < odim[2]) {
            element.style.width = width + "px";
            element.style.left =
              original_x + (element.pageX - original_mouse_x) + "px";//the error is with these
          }
        } else if (currentResizer.classList.contains("top-right")) {
          const width = original_width + (e.pageX - original_mouse_x);
          const height = original_height - (e.pageY - original_mouse_y);
          if (width > minimum_size && width < odim[2]) {
            element.style.width = width + "px";
          }
          if (height > minimum_size && height < odim[3]) {
            element.style.height = height + "px";
            element.style.top =
              original_y + (element.pageY - original_mouse_y) + "px";//the error is with these
          }
        } else {
          const width = original_width - (e.pageX - original_mouse_x);
          const height = original_height - (e.pageY - original_mouse_y);
          if (width > minimum_size && width < odim[2]) {
            element.style.width = width + "px";
            element.style.left =
              original_x + (element.pageX - original_mouse_x) + "px";//the error is with these
          }
          if (height > minimum_size && height < odim[3]) {
            element.style.height = height + "px";
            element.style.top =
              original_y + (element.pageY - original_mouse_y) + "px";//the error is with these
          }
        }
      }

      const stopResize = () => {
        window.removeEventListener("mousemove", resize);
      };
    }
  }
  /*
 onMouseDown={(r) => clickHandle(r, "topLeft")}
onMouseDown={(r) => clickHandle(r, "topRight")}
onMouseDown={(r) => clickHandle(r, "bottomLeft")}
onMouseDown={(r) => clickHandle(r, "bottomRight")}
*/
  return (
    <Holder>
      <FormButton onClick={() => console.log(xywh)}>eee</FormButton>
      <p>Drag red rectangle inwards to crop</p>
      <CropParent ref={CropRef}>
        <CropBox>
          <CropTopLeft className="resizer top-left" />
          <CropTopRight className="resizer top-right" />
          <CropBottomLeft className="resizer bottom-left" />
          <CropBottomRight className="resizer bottom-right" />
        </CropBox>
      </CropParent>
      <Child
        file={props.component.initParams.files[props.current]}
        callback={(e) => initSet(CropRef, e)}
      />
    </Holder>
  );
};