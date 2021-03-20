import styled from "styled-components";
const Slider = styled.div`
  position: relative;
  height: 14px;
  border-radius: 10px;
  text-align: left;
  margin: 45px 0 10px 0;
`;

const InvLeft = styled.div`
  position: absolute;
  left: 0;
  height: 14px;
  border-radius: 10px;
  background-color: #ccc;
  margin: 0 7px;
`;

const InvRight = styled.div`
  position: absolute;
  right: 0;
  height: 14px;
  border-radius: 10px;
  background-color: #ccc;
  margin: 0 7px;
`;

const DivRange = styled.div`
  position: absolute;
  left: 0;
  height: 14px;
  border-radius: 14px;
  background-color: #1abc9c;
`;

const HoverThumb = styled.div`
  position: absolute;
  top: -7px;
  z-index: 2;
  height: 28px;
  width: 28px;
  text-align: left;
  margin-left: -11px;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
  background-color: #fff;
  border-radius: 50%;
  outline: none;
`;

const RangeInput = styled.input`
  position: absolute;
  pointer-events: none;
  -webkit-appearance: none;
  z-index: 3;
  height: 14px;
  top: -2px;
  width: 100%;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
  filter: alpha(opacity=0);
  -moz-opacity: 0;
  -khtml-opacity: 0;
  opacity: 0;
  &::-ms-track {
    -webkit-appearance: none;
    background: transparent;
    color: transparent;
  }
  &::-moz-range-track {
    -moz-appearance: none;
    background: transparent;
    color: transparent;
  }
  &:focus::-webkit-slider-runnable-track {
    background: transparent;
    border: transparent;
  }
  &:focus {
    outline: none;
  }
  &::-ms-thumb {
    pointer-events: all;
    width: 28px;
    height: 28px;
    border-radius: 0px;
    border: 0 none;
    background: red;
  }
  &::-moz-range-thumb {
    pointer-events: all;
    width: 28px;
    height: 28px;
    border-radius: 0px;
    border: 0 none;
    background: red;
  }
  &::-webkit-slider-thumb {
    pointer-events: all;
    width: 28px;
    height: 28px;
    border-radius: 0px;
    border: 0 none;
    background: red;
    -webkit-appearance: none;
  }
  &::-ms-fill-lower {
    background: transparent;
    border: 0 none;
  }
  &::-ms-fill-upper {
    background: transparent;
    border: 0 none;
  }
  &::-ms-tooltip {
    display: none;
  }
`;
export { Slider, InvLeft, InvRight, DivRange, HoverThumb, RangeInput };
