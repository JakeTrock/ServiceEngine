export interface utility {
  id: string;
  name: string;
  tags: string[];
  description: string;
  scheme: any;
  binariesUsed: string[];
}

export interface IFaceBlock {
  id: string;
  uuid?: string;
  defaults: { [key: string]: any }; //{ [key: string]: string | boolean | string[] | number };
  hooks?: { [key: string]: any }; //https://www.w3schools.com/jsref/dom_obj_event.asp
}

export interface exportCollection {
  [key: string]: {
    function: any;
    names: string[];
  };
}
