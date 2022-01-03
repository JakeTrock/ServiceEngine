import TextBlock from './guiBlocks/textBlock';
import ButtonBlock from './guiBlocks/buttonBlock';
import UploadButtonBlock from './guiBlocks/uploadButton';
import NumBox from './guiBlocks/numBox';
import DateBox from './guiBlocks/dateBox';
import OneChoice from './guiBlocks/oneChoice';
import CanvasFrame from './guiBlocks/canvasFrame';
import Slider from './guiBlocks/slider';
import ProgressBar from './guiBlocks/progressbar';
import TextBox from './guiBlocks/textBox';
import ListBuilder from './guiBlocks/listBuilder';
import { IFaceBlock } from '../data/interfaces';
import Container from './guiBlocks/container';
import HorizontalAlign from './guiBlocks/horizontalAlign';
import TabbedView from './guiBlocks/tabbedview';
import KvpBuilder from './guiBlocks/kvpBuilder';
import CheckBox from './guiBlocks/checkBox';

// dictionary of all component names and their corresponding react element
export const compDict: { [key: string]: (props: any) => JSX.Element } = {
  label: TextBlock,
  button: ButtonBlock,
  uplbutton: UploadButtonBlock,
  checkbox: CheckBox,
  textbox: TextBox,
  numbox: NumBox,
  datebox: DateBox,
  onechoice: OneChoice,
  listbuild: ListBuilder,
  kvpbuild: KvpBuilder,
  canvasbox: CanvasFrame,
  slider: Slider,
  progbar: ProgressBar,
  container: Container,
  horizontalalign: HorizontalAlign,
  tabbedview: TabbedView,
};

export const hookDict: { [key: string]: string[] } = {
  label: ['clickIn', 'doubleClickIn', 'mouseIn', 'load'],
  button: ['change', 'clickIn', 'doubleClickIn', 'mouseIn', 'mouseOut', 'load'],
  uplbutton: [
    'change',
    'clickIn',
    'doubleClickIn',
    'mouseIn',
    'mouseOut',
    'load',
  ],
  checkbox: [
    'change',
    'clickIn',
    'doubleClickIn',
    'clickOut',
    'mouseIn',
    'mouseOut',
    'load',
  ],
  textbox: [
    'change',
    'clickIn',
    'doubleClickIn',
    'clickOut',
    'mouseIn',
    'mouseOut',
    'load',
    'keyPressed',
    'scroll',
  ],
  numbox: [
    'change',
    'clickIn',
    'doubleClickIn',
    'clickOut',
    'mouseIn',
    'mouseOut',
    'load',
    'keyPressed',
    'scroll',
  ],
  datebox: [
    'change',
    'clickIn',
    'doubleClickIn',
    'clickOut',
    'mouseIn',
    'mouseOut',
    'load',
    'keyPressed',
    'scroll',
  ],
  onechoice: [
    'change',
    'clickIn',
    'doubleClickIn',
    'clickOut',
    'mouseIn',
    'mouseOut',
    'load',
    'keyPressed',
    'scroll',
  ],
  listbuild: [
    'change',
    'clickIn',
    'doubleClickIn',
    'clickOut',
    'mouseIn',
    'mouseOut',
    'load',
    'keyPressed',
    'scroll',
  ],
  kvpbuild: [
    'change',
    'clickIn',
    'doubleClickIn',
    'clickOut',
    'mouseIn',
    'mouseOut',
    'load',
    'keyPressed',
    'scroll',
  ],
  canvasbox: [
    'clickIn',
    'doubleClickIn',
    'clickOut',
    'mouseIn',
    'mouseOut',
    'load',
    'keyPressed',
    'scroll',
  ],
  slider: [
    'change',
    'clickIn',
    'doubleClickIn',
    'clickOut',
    'mouseIn',
    'mouseOut',
    'load',
    'keyPressed',
    'scroll',
  ],
  progbar: ['clickIn', 'doubleClickIn', 'mouseIn', 'load'],
  container: [
    'clickIn',
    'doubleClickIn',
    'clickOut',
    'mouseIn',
    'mouseOut',
    'load',
    'keyPressed',
    'scroll',
  ],
  horizontalalign: [
    'clickIn',
    'doubleClickIn',
    'clickOut',
    'mouseIn',
    'mouseOut',
    'load',
    'keyPressed',
    'scroll',
  ],
  tabbedview: [
    'change',
    'clickIn',
    'doubleClickIn',
    'clickOut',
    'mouseIn',
    'mouseOut',
    'load',
    'keyPressed',
    'scroll',
  ],
};

// default values of each component, used when creating one from scratch
export const compDefaults: IFaceBlock[] = [
  {
    id: 'label',
    defaults: { visible: true, size: '1em', label: 'Explanatory text' },
  },
  {
    id: 'button',
    defaults: {
      visible: true,
      disabled: false,
      size: '1em',
      label: 'Button',
    },
  },
  {
    id: 'uplbutton',
    defaults: {
      visible: true,
      disabled: false,
      multiple: false,
      size: '1em',
      required: false,
      properties: [
        'openFile',
        'openDirectory',
        'multiSelections',
        'showHiddenFiles',
      ],
      filters: [
        { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
        { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
        { name: 'Sounds', extensions: ['ogg', 'wav', 'mp3'] },
      ],
      maxsize: 4294967296,
    },
  },
  {
    id: 'checkbox',
    defaults: {
      visible: true,
      disabled: false,
      value: false,
    },
  },
  {
    id: 'textbox',
    defaults: {
      visible: true,
      disabled: false,
      size: '1em',
      value: 'default value',
      multirow: false,
      required: false,
    },
    validate: {
      validateRegex: /\d/,
      validateMessage: 'must not contain any numbers!',
      minChars: 0,
      maxChars: 144,
      useBlacklist: true,
      useWhitelist: false,
      wordList: ['badword', 'worseword', 'terribleword'],
    },
  },
  {
    id: 'numbox',
    defaults: {
      visible: true,
      disabled: false,
      size: '1em',
      value: 3,
      step: 1,
      min: 0,
      max: 10,
      required: false,
    },
  },
  {
    id: 'datebox',
    defaults: {
      visible: true,
      disabled: false,
      size: '1em',
      value: '1000-01-01T12:00',
      min: '0001-01-01T00:00',
      max: '2000-01-01T24:00',
      required: false,
    },
  },
  {
    id: 'onechoice',
    defaults: {
      visible: true,
      disabled: false,
      value: 'apple',
      size: '1em',
      labels: ['apple', 'banana', 'melon', 'berry'],
      required: false,
    },
  },
  {
    id: 'slider',
    defaults: {
      visible: true,
      disabled: false,
      required: false,
      width: '10em',
      value: 1,
      step: 1,
      min: 0,
      max: 10,
    },
    validate: {
      badRange: [
        [2, 3],
        [7, 9],
      ],
    },
  },
  {
    id: 'canvasbox',
    defaults: { visible: true, width: '10em', height: '10em' },
  },
  { id: 'progbar', defaults: { visible: true, value: 50, max: 100 } },
  {
    id: 'listbuild',
    defaults: {
      visible: true,
      disabled: false,
      size: '1em',
      width: '20em',
      value: [],
      childNodesCurrent: [],
      childNodesPossible: {},
    },
    validate: {
      maxListLength: 10,
      minListLength: 0,
    },
  },
  {
    id: 'kvpbuild',
    defaults: {
      visible: true,
      disabled: false,
      size: '1em',
      width: '20em',
      value: {},
      childNodesCurrent: [],
      childNodesPossible: {},
    },
    validate: {
      maxListLength: 10,
      minListLength: 0,
      keyWhitelist: {},
      allowExtendedChoice: true,
    },
  },
  {
    id: 'container',
    defaults: {
      visible: true,
      disabled: false,
      collapsible: false, // toggle whether or not theres a vis toggle
      width: '10em',
      height: '10em',
      childNodes: [],
      label: 'container label',
    },
  },
  {
    id: 'horizontalalign',
    defaults: {
      visible: [true, true],
      width: '10em',
      height: '10em',
      childNodes: [[], []],
      labels: ['lbl1', 'lbl2'],
    },
  },
  {
    id: 'tabbedview',
    defaults: {
      visible: [true, true],
      labels: ['tabone', 'tabtwo'],
      width: '10em',
      height: '10em',
      childNodes: [[], []],
    },
  },
];
