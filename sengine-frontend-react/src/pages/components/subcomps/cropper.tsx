import * as React from "react";
import { FormButton, Holder } from "../../../data/styles";
import {
  CropBottomLeft,
  CropBottomRight,
  CropBox,
  CropParent,
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
    const vid = document.getElementsByClassName("videoBox")[0];
    const odim = dim;
    let original_width = 100;
    let original_height = 100;
    let original_x = dim[0];
    let original_y = dim[1];
    let original_mouse_x = 0;
    let original_mouse_y = 0;

    function dragElement(elmnt) {
      let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

      elmnt.childNodes[0].onmousedown = dragMouseDown;

      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        const offset = vid.getBoundingClientRect();
        const y = elmnt.offsetTop - pos2;
        const x = elmnt.offsetLeft - pos1;
        const h = original_height || 100;
        const w = original_width || 100;
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        if (
          y > offset.top + document.documentElement.scrollTop &&
          y + h < vid.clientHeight + offset.top
        ) {
          elmnt.style.top = y + "px";
        }
        if (x > offset.left && x + w < vid.clientWidth + offset.left) {
          elmnt.style.left = x + "px";
        }
      }

      function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }
    dragElement(element);
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
          if (width > minimum_size && width < odim[2]) {
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
          }
        } else if (currentResizer.classList.contains("top-right")) {
          const width = original_width + (e.pageX - original_mouse_x);
          const height = original_height - (e.pageY - original_mouse_y);
          if (width > minimum_size && width < odim[2]) {
            element.style.width = width + "px";
          }
          if (height > minimum_size && height < odim[3]) {
            element.style.height = height + "px";
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
      <p>Drag red rectangle inwards to crop</p>
      <CropParent ref={CropRef}>
        <CropBox />
        <CropTopRight className="resizer top-right" />
        <CropBottomLeft className="resizer bottom-left" />
        <CropBottomRight className="resizer bottom-right" />
      </CropParent>
      <Vwrap className="videoBox">
        <Child
          file={props.component.initParams.files[props.current]}
          callback={(e) => initSet(CropRef, e)}
        />
      </Vwrap>
    </Holder>
  );
};
