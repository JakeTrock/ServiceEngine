import * as React from "react";
import { Holder } from "../../../data/styles";
import {
  CropBottomLeft,
  CropBottomRight,
  CropBox,
  CropParent,
  CropTopRight,
  Vwrap,
} from "../../../data/styles_custom/crop_styles";

const minimum_size = 20;
const pxInt = (r) => parseFloat(r.replace("px", ""));
export default (props) => {
  const Child = props.children[0];

  const CropRef = React.useRef(null);

  function initSet(ele, dim) {
    console.log(dim)
    const element = ele.current;
    const resizers = element.querySelectorAll(" .rhndl");
    const vid = document.getElementsByClassName("videoBox")[0];
    const vidOffset = vid.getBoundingClientRect();
    const odim = dim;
    let original_mouse_x = 0;
    let original_mouse_y = 0;

    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let pos4 = 0;

    element.childNodes[0].onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = stopDrg;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      const y = element.offsetTop - pos2;
      const x = element.offsetLeft - pos1;
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      if (
        y > vidOffset.top &&
        y + (pxInt(element.style.height) || 100) <
          vid.clientHeight + vidOffset.top
      ) {
        element.style.top = y + "px";
      }
      if (
        x > vidOffset.left &&
        x + (pxInt(element.style.width) || 100) <
          vid.clientWidth + vidOffset.left
      ) {
        element.style.left = x + "px";
      }
    }

    const handleListen = (e) => {
      e.preventDefault();
      original_mouse_x = e.pageX;
      original_mouse_y = e.pageY;
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResize);
    };
    Array.from(resizers).map((r) =>
      r.addEventListener("mousedown", handleListen)
    );
    const resize = (e) => {
      const sumv = (v1, v2, op) => {
        if (op) return v1 + v2;
        else return v1 - v2;
      };
      const setDim = (p1, p2) => {
        const width = sumv(
          pxInt(element.style.width) || 100,
          e.pageX - original_mouse_x,
          p1
        );
        const height = sumv(
          pxInt(element.style.height) || 100,
          e.pageY - original_mouse_y,
          p2
        );
        if (p1 && width > minimum_size && width < odim[2]) {
          element.style.width = width + "px";
        }
        if (p2 && height > minimum_size && height < odim[3]) {
          element.style.height = height + "px";
        }
      };
      switch (e.target.classList[e.target.classList.length - 1]) {
        case "b-r":
          setDim(true, true);
          break;
        case "b-l":
          setDim(false, true);
          break;
        case "t-r":
          setDim(true, false);
          break;
        default:
          break;
      }
    };

    const updateSt = () => {
      const vals = [
        pxInt(element.style.left) || 10,
        pxInt(element.style.top) || 10,
        pxInt(element.style.width) || 100,
        pxInt(element.style.height) || 100,
      ];
      props.callback({ cropDim: vals });
    };
    const stopResize = () => {
      window.removeEventListener("mousemove", resize);
      updateSt();
    };
    const stopDrg = () => {
      document.onmousemove = document.onmouseup = null;
      updateSt();
    };
  }
  return (
    <Holder>
      <p>Drag red rectangle inwards to crop</p>
      <CropParent ref={CropRef}>
        <CropBox />
        <CropTopRight className="rhndl t-r" />
        <CropBottomLeft className="rhndl b-l" />
        <CropBottomRight className="rhndl b-r" />
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
