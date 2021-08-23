import TextBlock from "../subcomponents/guiBlocks/textBlock";
import ButtonBlock from "../subcomponents/guiBlocks/buttonBlock";
import UploadButtonBlock from "../subcomponents/guiBlocks/uploadButton";
import NumBox from "../subcomponents/guiBlocks/numBox";
import DateBox from "../subcomponents/guiBlocks/dateBox";
import OneChoice from "../subcomponents/guiBlocks/oneChoice";
import MultiChoice from "../subcomponents/guiBlocks/multiChoice";
import MediaFrame from "../subcomponents/guiBlocks/mediaFrame";
import CanvasFrame from "../subcomponents/guiBlocks/canvasFrame";
import Slider from "../subcomponents/guiBlocks/slider";
import ProgressBar from "../subcomponents/guiBlocks/progressbar";
import TextBox from "../subcomponents/guiBlocks/textBox";
import ListBuilder from "../subcomponents/guiBlocks/listBuilder";

const compDict: { [key: string]: (props: any) => JSX.Element } = {
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

export default compDict;
