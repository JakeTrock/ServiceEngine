export interface utility {
  id: string;
  name: string;
  tags: string[];
  description: string;
  scheme: IFaceBlock[] | [];
  binariesUsed: string[];
  file: string;
}

export interface GenIFaceBlock {
  readonly id: string;
  uuid?: string;
  defaults: { [key: string]: any }; //{ [key: string]: string | boolean | string[] | number };
  hooks?: { [key: string]: { name: string; additional?: any } };
  validate?: { [key: string]: any }; //{ [key: string]: string | boolean | string[] | number };
}

//TODO: some of these properties can be optional, but need fallbacks in their comps

interface label extends GenIFaceBlock {
  readonly id: "label";
  defaults: {
    visible?: boolean;
    size?: string;
    label: string;
  };
}
interface button extends GenIFaceBlock {
  readonly id: "button";
  defaults: {
    visible?: boolean;
    disabled?: boolean;
    size?: string;
    label: string;
  };
}
interface uplButton extends GenIFaceBlock {
  readonly id: "uplButton";
  defaults: {
    visible?: boolean;
    disabled?: boolean;
    multiple?: boolean;
    size?: string;
    required?: boolean;
  };
  validate?: {
    formats?: string[];
    maxSize?: number;
  };
}

interface textbox extends GenIFaceBlock {
  readonly id: "textbox";
  defaults: {
    visible?: boolean;
    disabled?: boolean;
    size?: string;
    value?: string;
    multirow?: boolean;
    required?: boolean;
  };
  validate?: {
    validateRegex?: RegExp;
    validateMessage?: string;
    minChars?: number;
    maxChars?: number;
    useBlacklist?: boolean;
    useWhitelist?: boolean;
    wordList?: string[];
  };
}

interface numbox extends GenIFaceBlock {
  readonly id: "numbox";
  defaults: {
    visible?: boolean;
    disabled?: boolean;
    size?: string;
    value?: number;
    step?: number;
    min?: number;
    max?: number;
    required?: boolean;
  };
}

interface checkbox extends GenIFaceBlock {
  readonly id: "checkbox";
  defaults: {
    visible?: boolean;
    disabled?: boolean;
    value?: boolean;
  };
}

interface datebox extends GenIFaceBlock {
  readonly id: "datebox";
  defaults: {
    visible?: boolean;
    disabled?: boolean;
    size?: string;
    value?: string;
    min?: string;
    max?: string;
    required?: boolean;
  };
}

interface onechoice extends GenIFaceBlock {
  readonly id: "onechoice";
  defaults: {
    visible?: boolean;
    disabled?: boolean;
    size?: string;
    value?: number;
    labels: string[];
    required?: boolean;
  };
}

interface slider extends GenIFaceBlock {
  readonly id: "slider";
  defaults: {
    visible?: boolean;
    disabled?: boolean;
    width?: string;
    value?: number;
    step?: number;
    min?: number;
    max?: number;
    required?: boolean;
  };
  validate?: {
    badRange?: number[][];
  };
}

interface mediabox extends GenIFaceBlock {
  readonly id: "mediabox";
  defaults: {
    visible?: boolean;
    hasVideo: boolean;
    hasControls?: boolean;
    width?: string;
    height?: string;
  };
}

interface canvasbox extends GenIFaceBlock {
  readonly id: "canvasbox";
  defaults: {
    visible?: boolean;
    width?: string;
    height?: string;
  };
}

interface progbar extends GenIFaceBlock {
  readonly id: "progbar";
  defaults: {
    visible?: boolean;
    value?: number;
    max?: number;
  };
}

interface listbuild extends GenIFaceBlock {
  readonly id: "listbuild";
  defaults: {
    visible?: boolean;
    disabled?: boolean;
    size?: string;
    width?: string;
    childNodesCurrent: GenIFaceBlock[];
    childNodesPossible: { [key: string]: GenIFaceBlock };
  };
  validate?: {
    maxListLength?: number;
    minListLength?: number;
  };
}

interface kvpbuild extends GenIFaceBlock {
  readonly id: "kvpbuild";
  defaults: {
    visible?: boolean;
    disabled?: boolean;
    size?: string;
    width?: string;
    labelsCurrent: string[];
    childNodesCurrent: GenIFaceBlock[];
    childNodesPossible: { [key: string]: GenIFaceBlock };
  };
  validate?: {
    maxListLength?: number;
    minListLength?: number;
    keyWhitelist?:
      | string[]
      | {
          [key: string]: {
            keyRegex?: RegExp;
            keyRegexMsg?: string;
          };
        };
    allowExtendedChoice?: boolean;
  };
}

interface container extends GenIFaceBlock {
  readonly id: "container";
  defaults: {
    visible?: boolean;
    disabled?: boolean;
    collapsible?: boolean; //toggle whether or not theres a vis toggle
    width?: string;
    height?: string;
    childNodes: GenIFaceBlock[];
    label: string;
  };
}

interface horizontalalign extends GenIFaceBlock {
  readonly id: "horizontalalign";
  defaults: {
    visible?: boolean[];
    width?: string;
    height?: string;
    childNodes: GenIFaceBlock[][];
    labels: string[];
  };
}

interface tabbedview extends GenIFaceBlock {
  readonly id: "tabbedview";
  defaults: {
    visible?: boolean[];
    width?: string;
    height?: string;
    labels: string[];
    childNodes: GenIFaceBlock[][];
  };
}

export type IFaceBlock =
  | label
  | button
  | uplButton
  | checkbox
  | textbox
  | numbox
  | datebox
  | onechoice
  | listbuild
  | kvpbuild
  | slider
  | mediabox
  | canvasbox
  | progbar
  | container
  | horizontalalign
  | tabbedview;

export enum type {
  File,
  string,
  number,
}

export interface exportCollection {
  [key: string]: {
    function: any;
    names: string[];
    types: type[];
  };
}

export interface hookCollection {
  // [key: string]: {
  [key: string]: any;
  // };
}
