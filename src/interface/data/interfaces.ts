export interface utility {
  id: string;
  name: string;
  tags: string[];
  description: string;
  scheme: IFaceBlock[] | [];
  binariesUsed: string[];
  file: string;
}

export interface IFaceBlock {
  id: string;
  uuid?: string;
  defaults: { [key: string]: any }; //{ [key: string]: string | boolean | string[] | number };
  hooks?: { [key: string]: { name: string; additional?: any } };
  validate?: { [key: string]: any }; //{ [key: string]: string | boolean | string[] | number };
}

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
