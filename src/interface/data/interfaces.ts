export interface utility {
  id: string;
  name: string;
  tags: string[];
  description: string;
  scheme: IFaceBlock | [];
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

/* TODO: design forms for each component in allutils
const compList: IFaceBlock[] = [
    { id: "label", defaults: { visible: true, size: "1em", label: "Explanatory text" } },
    { id: "button", defaults: { visible: true, disabled: true, size: "1em", label: "Button" } },
    { id: "uplButton", defaults: { visible: true, disabled: true, size: "1em" } },
    { id: "textbox", defaults: { visible: true, disabled: true, size: "1em", value: "default value", multirow: "false" } },
    { id: "numbox", defaults: { visible: true, disabled: true, size: "1em", value: 3, min: 0, max: 10 } },
    { id: "datebox", defaults: { visible: true, disabled: true, size: "1em", value: "1000-01-01T12:00", min: "0001-01-01T00:00", max: "2000-01-01T24:00" } },
    { id: "onechoice", defaults: { visible: true, disabled: true, size: "1em", labels: "apple,banana,melon,berry" } },
    { id: "multchoice", defaults: { visible: true, disabled: true, size: "1em", label: "topping", labels: "walnuts,peanuts,chocolate,gummy", checked: "false,true,false,true" } },
    { id: "listbuild", defaults: { visible: true, disabled: true, size: "1em", width: "20em", values: "strawberry,chocolate,vanilla,mint" } },
    { id: "mediabox", defaults: { visible: true, hasVideo: true, hasControls: true, width: "10em", height: "10em" } },
    { id: "canvasbox", defaults: { visible: true, width: "10em", height: "10em" } },
    { id: "slider", defaults: { visible: true, disabled: true, width: "10em", value: 1, min: 0, max: 10 } },
    { id: "progbar", defaults: { visible: true, value: 50, max: 100 } }
  ];
*/
