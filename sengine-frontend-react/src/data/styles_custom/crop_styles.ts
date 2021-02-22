import styled from "styled-components";
const CropParent = styled.div`
  position:absolute;
  max-height: inherit;
  max-width: inherit;
  box-sizing: border-box;
  overflow: none;
  background-color: rgba(150, 0, 0, 0.5);
  width: 100px;
  height: 100px;
`;
const CropBox = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`;
const CropTopLeft = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: red;
  position: absolute;
  left: -5px;
  top: -5px;
  cursor: nwse-resize;
`;
const CropTopRight = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: red;
  position: absolute;
  right: -5px;
  top: -5px;
  cursor: nesw-resize;
`;
const CropBottomLeft = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: red;
  position: absolute;
  left: -5px;
  bottom: -5px;
  cursor: nesw-resize;
`;
const CropBottomRight = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: red;
  position: absolute;
  right: -5px;
  bottom: -5px;
  cursor: nwse-resize;
`;

const Vwrap = styled.div`
  border: 1px dotted black;
`;

export {
  CropBottomLeft,
  CropBottomRight,
  CropBox,
  CropParent,
  CropTopLeft,
  CropTopRight,
  Vwrap
};
