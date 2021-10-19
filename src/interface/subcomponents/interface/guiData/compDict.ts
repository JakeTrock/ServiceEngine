import TextBlock from "./guiBlocks/textBlock";
import ButtonBlock from "./guiBlocks/buttonBlock";
import UploadButtonBlock from "./guiBlocks/uploadButton";
import NumBox from "./guiBlocks/numBox";
import DateBox from "./guiBlocks/dateBox";
import OneChoice from "./guiBlocks/oneChoice";
import MultiChoice from "./guiBlocks/multiChoice";
import MediaFrame from "./guiBlocks/mediaFrame";
import CanvasFrame from "./guiBlocks/canvasFrame";
import Slider from "./guiBlocks/slider";
import ProgressBar from "./guiBlocks/progressbar";
import TextBox from "./guiBlocks/textBox";
import ListBuilder from "./guiBlocks/listBuilder";
import { IFaceBlock } from "../../../data/interfaces";

//dictionary of all component names and their corresponding react element
export const compDict: { [key: string]: (props: any) => JSX.Element } = {
  label: TextBlock,
  button: ButtonBlock,
  uplButton: UploadButtonBlock,
  textbox: TextBox,
  numbox: NumBox,
  datebox: DateBox,
  onechoice: OneChoice,
  multchoice: MultiChoice,
  listbuild: ListBuilder,
  mediabox: MediaFrame,
  canvasbox: CanvasFrame,
  slider: Slider,
  progbar: ProgressBar,
};

//default values of each component, used when creating one from scratch
export const compDefaults: IFaceBlock[] = [
  {
    id: "label",
    defaults: { visible: true, size: "1em", label: "Explanatory text" },
  },
  {
    id: "button",
    defaults: { visible: true, disabled: true, size: "1em", label: "Button" },
  },
  {
    id: "uplButton",
    defaults: {
      visible: true,
      disabled: true,
      multiple: false,
      size: "1em",
      required: false,
    },
  },
  {
    id: "textbox",
    defaults: {
      visible: true,
      disabled: true,
      size: "1em",
      value: "default value",
      multirow: "false",
      required: false,
    },
  },
  {
    id: "numbox",
    defaults: {
      visible: true,
      disabled: true,
      size: "1em",
      value: 3,
      min: 0,
      max: 10,
      required: false,
    },
  },
  {
    id: "datebox",
    defaults: {
      visible: true,
      disabled: true,
      size: "1em",
      value: "1000-01-01T12:00",
      min: "0001-01-01T00:00",
      max: "2000-01-01T24:00",
      required: false,
    },
  },
  {
    id: "onechoice",
    defaults: {
      visible: true,
      disabled: true,
      size: "1em",
      labels: "apple,banana,melon,berry",
      required: false,
    },
  },
  {
    id: "multchoice",
    defaults: {
      visible: true,
      disabled: true,
      size: "1em",
      label: "topping",
      labels: "walnuts,peanuts,chocolate,gummy",
      checked: "false,true,false,true",
    },
  },
  {
    id: "listbuild",
    defaults: {
      visible: true,
      disabled: true,
      size: "1em",
      width: "20em",
      values: "strawberry,chocolate,vanilla,mint",
    },
  },
  {
    id: "mediabox",
    defaults: {
      visible: true,
      hasVideo: true,
      hasControls: true,
      width: "10em",
      height: "10em",
    },
  },
  {
    id: "canvasbox",
    defaults: { visible: true, width: "10em", height: "10em" },
  },
  {
    id: "slider",
    defaults: {
      visible: true,
      disabled: true,
      width: "10em",
      value: 1,
      step: 1,
      min: 0,
      max: 10,
    },
  },
  { id: "progbar", defaults: { visible: true, value: 50, max: 100 } },
];

//TODO: add colorpicker, component container/tab component
