import * as React from "react";
import {
  CropBottomLeft,
  CropBottomRight,
  CropBox,
  CropParent,
  MediaHolder,
  CropTopLeft,
  CropTopRight,
  Holder,
} from "../../data/styles";
const minimum_size = 20;

export default (props) => {
  const Child = props.children[0];
  let [xywh, setXYWH] = React.useState([0, 0, 0, 0]);
  let [MXMY, setMXMY] = React.useState([0, 0]);
  const CropRef = React.useRef();
  let [vwh, setvwh] = React.useState([0, 0]);
  const clickHandle = (e, type) => {
    //calculate relative px using vwh
    e.preventDefault();
    const w = parseFloat(
      getComputedStyle(CropRef.current, null)
        .getPropertyValue("width")
        .replace("px", "")
    );
    const h = parseFloat(
      getComputedStyle(CropRef.current, null)
        .getPropertyValue("height")
        .replace("px", "")
    );
    const x = CropRef.current.getBoundingClientRect().left;
    const y = CropRef.current.getBoundingClientRect().top;
    setXYWH([x, y, w, h]);
    setMXMY([e.pageX, e.pageY]);
    window.addEventListener("mousemove", (e) => resize(e, type));
    window.addEventListener("mouseup", () =>
      window.removeEventListener("mousemove", (e) => resize(e, type))
    );
  };
  function resize(e, type) {
    const width = xywh[2] - (e.pageX - MXMY[0]);
    const height = xywh[3] - (e.pageY - MXMY[1]);

    switch (type) {
      case "bottomRight":
        if (width > minimum_size) {
          CropRef.current.style.width = width + "px";
        }
        if (height > minimum_size) {
          CropRef.current.style.height = height + "px";
        }
        break;
      case "bottomLeft":
        if (height > minimum_size) {
          CropRef.current.style.height = height + "px";
        }
        if (width > minimum_size) {
          CropRef.current.style.width = width + "px";
          CropRef.current.style.left = xywh[0] + (e.pageX - MXMY[0]) + "px";
        }
        break;
      case "topRight":
        if (width > minimum_size) {
          CropRef.current.style.width = width + "px";
        }
        if (height > minimum_size) {
          CropRef.current.style.height = height + "px";
          CropRef.current.style.top = xywh[1] + (e.pageY - MXMY[1]) + "px";
        }
        break;
      default:
        if (width > minimum_size) {
          CropRef.current.style.width = width + "px";
          CropRef.current.style.left = xywh[0] + (e.pageX - MXMY[0]) + "px";
        }
        if (height > minimum_size) {
          CropRef.current.style.height = height + "px";
          CropRef.current.style.top = xywh[1] + (e.pageY - MXMY[1]) + "px";
        }
    }
  }

  return (
    <Holder>
      <p>Drag red rectangle inwards to crop</p>
      <MediaHolder>
        <CropParent ref={CropRef}>
          <CropBox>
            <CropTopLeft onMouseDown={(r) => clickHandle(r, "topLeft")} />
            <CropTopRight onMouseDown={(r) => clickHandle(r, "topRight")} />
            <CropBottomLeft onMouseDown={(r) => clickHandle(r, "bottomLeft")} />
            <CropBottomRight
              onMouseDown={(r) => clickHandle(r, "bottomRight")}
            />
          </CropBox>
        </CropParent>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Child file={props.file} callback={(e) => setvwh(e)} />
        </React.Suspense>
      </MediaHolder>
    </Holder>
  );
};
