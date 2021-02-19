import * as React from "react";
import { Holder } from "../../../data/styles";
import {
  CropBottomLeft,
  CropBottomRight,
  CropBox,
  CropParent,
  CropTopLeft,
  CropTopRight,
} from "../../../data/styles_custom/crop_styles";

const minimum_size = 20;

export default (props) => {
  const Child = props.children[0];
  const [xywh, setXYWH] = React.useState([0, 0, 0, 0]);
  const [MXMY, setMXMY] = React.useState([0, 0]);
  const CropRef = React.useRef(null);
  const [vwh, setvwh] = React.useState([0, 0]);
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
      <CropParent ref={CropRef}>
        <CropBox>
          <CropTopLeft onMouseDown={(r) => clickHandle(r, "topLeft")} />
          <CropTopRight onMouseDown={(r) => clickHandle(r, "topRight")} />
          <CropBottomLeft onMouseDown={(r) => clickHandle(r, "bottomLeft")} />
          <CropBottomRight onMouseDown={(r) => clickHandle(r, "bottomRight")} />
        </CropBox>
      </CropParent>
      <Child
        file={props.component.files[props.current]}
        callback={(e) => setvwh(e)}
      />
    </Holder>
  );
};

/*

<html>
<head>
<script>

function makeResizableDiv(div) {
  const element = document.querySelector(div);
  const resizers = document.querySelectorAll(div + ' .resizer')
  const minimum_size = 20;
  let original_width = 0;
  let original_height = 0;
  let original_x = 0;
  let original_y = 0;
  let original_mouse_x = 0;
  let original_mouse_y = 0;
  for (let i = 0;i < resizers.length; i++) {
    const currentResizer = resizers[i];
    currentResizer.addEventListener('mousedown', function(e) {
      e.preventDefault()
      original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
      original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
      original_x = element.getBoundingClientRect().left;
      original_y = element.getBoundingClientRect().top;
      original_mouse_x = e.pageX;
      original_mouse_y = e.pageY;
      window.addEventListener('mousemove', resize)
      window.addEventListener('mouseup', stopResize)
    })
    
    function resize(e) {
      if (currentResizer.classList.contains('bottom-right')) {
        const width = original_width + (e.pageX - original_mouse_x);
        const height = original_height + (e.pageY - original_mouse_y)
        if (width > minimum_size) {
          element.style.width = width + 'px'
        }
        if (height > minimum_size) {
          element.style.height = height + 'px'
        }
      }
      else if (currentResizer.classList.contains('bottom-left')) {
        const height = original_height + (e.pageY - original_mouse_y)
        const width = original_width - (e.pageX - original_mouse_x)
        if (height > minimum_size) {
          element.style.height = height + 'px'
        }
        if (width > minimum_size) {
          element.style.width = width + 'px'
          element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
        }
      }
      else if (currentResizer.classList.contains('top-right')) {
        const width = original_width + (e.pageX - original_mouse_x)
        const height = original_height - (e.pageY - original_mouse_y)
        if (width > minimum_size) {
          element.style.width = width + 'px'
        }
        if (height > minimum_size) {
          element.style.height = height + 'px'
          element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
        }
      }
      else {
        const width = original_width - (e.pageX - original_mouse_x)
        const height = original_height - (e.pageY - original_mouse_y)
        if (width > minimum_size) {
          element.style.width = width + 'px'
          element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
        }
        if (height > minimum_size) {
          element.style.height = height + 'px'
          element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
        }
      }
    }
    
    function stopResize() {
      window.removeEventListener('mousemove', resize)
    }
  }
}


</script>
<style>
video {
    width: 100%;
    height: 100%;
}
.resizable {
position: absolute;
max-height: inherit;
max-width: inherit;
box-sizing:border-box;
overflow:none;
    margin: 10px;
    background-color: rgba(150, 0, 0, 0.5);
  width: 100px;
  height: 100px;
  position: absolute;
  top: 100px;
  left: 100px;
}

.resizable .resizers{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.resizable .resizers .resizer{
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: red;
  position: absolute;
}

.resizable .resizers .resizer.top-left {
  left: -5px;
  top: -5px;
  cursor: nwse-resize;
}
.resizable .resizers .resizer.top-right {
  right: -5px;
  top: -5px;
  cursor: nesw-resize;
}
.resizable .resizers .resizer.bottom-left {
  left: -5px;
  bottom: -5px;
  cursor: nesw-resize;
}
.resizable .resizers .resizer.bottom-right {
  right: -5px;
  bottom: -5px;
  cursor: nwse-resize;
}
</style>
</head>
<body onload ="makeResizableDiv('.resizable')">
        <div class='resizable'>
  <div class='resizers'>
    <div class='resizer top-left'></div>
    <div class='resizer top-right'></div>
    <div class='resizer bottom-left'></div>
    <div class='resizer bottom-right'></div>
  </div>
</div>
<video class="player" src="https://upload.wikimedia.org/wikipedia/commons/transcoded/1/18/Big_Buck_Bunny_Trailer_1080p.ogv/Big_Buck_Bunny_Trailer_1080p.ogv.360p.vp9.webm" autoplay loop muted></video>
</body>
</html>


*/
