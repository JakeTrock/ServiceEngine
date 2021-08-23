import jszip from "jszip";
import { exportCollection } from "./interfaces";

const mkDtURL = (f: File) =>
  (window.URL || window.webkitURL).createObjectURL(f);

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
const ARGUMENT_NAMES = /([^\s,]+)/g;
const getParamNames = (func) => {
  const fnStr = func.toString().replace(STRIP_COMMENTS, "");
  const params = fnStr
    .slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")"))
    .match(ARGUMENT_NAMES);

  return params === null ? [] : params;
};
//Thanks, stackoverflow! https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically?page=1&tab=votes#tab-top

export const wasmLoader = async (permissions, libraries): Promise<exportCollection> => {
  //https://developer.mozilla.org/en-US/docs/WebAssembly/Using_the_JavaScript_API
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory
  try {
    let exports: exportCollection = {};
    //component webassembly paramaters
    let memory = new WebAssembly.Memory({ initial: 10 }); //memory(in pages), might want to cap it
    let externs = loadExterns(permissions); //loads all external libs
    let importObject = {
      js: {
        mem: memory,
      },
      imports: externs, //imported functions
    };
    libraries.childDeps.forEach((element) =>
      //load in dependency
      WebAssembly.instantiateStreaming(
        fetch(`${element.libprefix}/index.wasm`),
        importObject
      ).then((obj) =>
        element.functionsUsed.forEach(
          (func) =>
            (externs[`${element.libname}_${func}`] = obj.instance.exports[func])
        )
      )
    );

    libraries.parentDeps.forEach((element) =>
      WebAssembly.instantiateStreaming(
        fetch(`${element.libprefix}/index.wasm`),
        importObject
      ).then((obj) =>
        element.functionsUsed.forEach(
          (func) =>
            (exports[`${element.libname}_${func}`] = {
              function: obj.instance.exports[func],
              names: getParamNames(obj.instance.exports[func]),
              // types: //TODO: add typings
            })
        )
      )
    );

    // let files = [];
    // depends.filesPulled.forEach((element, index) =>
    //   fetch(`${element.prefix}/index.wasm`)
    //     .then((obj) => obj.blob())
    //     .then((blob) => {
    //       var b: any = blob;
    //       b.lastModifiedDate = new Date();
    //       b.name = element.name;
    //       files[index] = b;
    //     })
    // );

    //set all module values
    return exports;
  } catch (e) {
    throw e;
  }
};

//allow using the builtin basic browser apis without permissions, they can be called from the binary using js_xyz
//for example, sin would be js_sin
const starters = () => {
  let st = {};
  [
    JSON,
    Intl,
    Map,
    Math,
    Number,
    String,
    Array,
    { makeDataUrl: mkDtURL },
  ].forEach((b) =>
    Object.getOwnPropertyNames(b).forEach((p) => {
      if (typeof b[p] === "function" || typeof b[p] === "number")
        st["js_" + p] = b[p];
    })
  );
  return st;
};

const mdFunc = (mdConstr) => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    return navigator.mediaDevices.getUserMedia(mdConstr).then((stream) => {
      return stream;
    });
  }
};
//function which handles network api
const netFunc = (url, mth, nwkParams) => {
  nwkParams["method"] = mth;
  return fetch(url, nwkParams)
    .then((d) => {
      return d;
    })
    .catch((e) => {
      return e.message;
    });
};
//function that handles screengrab api(chrome)
const screenCap = async (opt) => {
  let captureStream = null;
  try {
    if (navigator.mediaDevices.hasOwnProperty("getDisplayMedia")) {
      // @ts-ignore
      captureStream = await navigator.mediaDevices.getDisplayMedia(opt);
    } else throw new Error("browser not supported. Try Chrome");
  } catch (err) {
    console.error("Error: " + err);
  }
  return captureStream;
};

//function that handles downloads
const dloadFile = async (inputs: File[]) => {
  if (inputs.length > 0) {
    let url;
    const downloadLink = document.createElement("a");
    if (inputs.length > 1) {
      let zip = new jszip();
      await inputs.map(async (f) => zip.file(f.name, f.arrayBuffer()));
      const file = await zip.generateAsync({ type: "base64" });
      url = `data:application/zip;base64,${file}`;
      downloadLink.download = `sengine-${+new Date()}.zip`;
    } else {
      url = mkDtURL(inputs[0]);
      downloadLink.download = inputs[0].name;
    }
    downloadLink.href = url;
    downloadLink.click();
  }
};

//restricted functions that you need to petition for
const restrictedFuncs = {
  //TODO:rtc functions
  //https://developer.mozilla.org/en-US/docs/Web/API
  //gets a webcam stream from the user(with their permission)
  getCam:
    () =>
    (videoConstr = true) =>
      mdFunc({ video: videoConstr }),
  //gets an audio stream from the user(with their permission)

  getAud:
    () =>
    (audConstr = true) =>
      mdFunc({ audio: audConstr }),
  //gets a hybrid video/audio stream from the user(with their permission)
  getVidAud:
    () =>
    (videoConstr = true, audConstr = true) =>
      mdFunc({
        video: videoConstr,
        audio: audConstr,
      }),
  getNet: (url, nwkParams = {}) => {
    //network function that only allows get requests
    if (nwkParams.hasOwnProperty("headers")) delete nwkParams["headers"];
    if (nwkParams.hasOwnProperty("body")) delete nwkParams["body"];
    return netFunc(url, "GET", nwkParams);
  },
  sendNet: (url, rqType, nwkParams = {}) => {
    //network function that allows put/post/patch/delete requests
    if (
      rqType === "POST" ||
      rqType === "PUT" ||
      rqType === "PATCH" ||
      rqType === "DELETE"
    )
      return netFunc(url, rqType, nwkParams);
  },
  getCurrentPos: () => {
    //gets the current gps coordinates of the user with the geolocation api
    const opt = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    const sfun = (pos) => {
      return pos.coords;
    };
    const efun = (e) => {
      return e.message;
    };
    return navigator.geolocation.getCurrentPosition(sfun, efun, opt);
  },
  getClipboard: () => {
    //gets the current clipboard contents of the user
    return navigator.clipboard
      .readText()
      .then((ct) => {
        return ct;
      })
      .catch((e) => {
        return e.message;
      });
  },
  setClipboard: (t) => {
    //sets the current clipboard contents of the user
    return navigator.clipboard
      .writeText(t)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  },
  getScreen: () => {
    //gets the user's screen(chrome)
    const mdp = {
      video: true,
      audio: false,
    };
    return screenCap(mdp);
  },
  getScreenAudio: () => {
    //gets the user's screen+audio(chrome)
    const mdp = {
      video: true,
      audio: true,
    };
    return screenCap(mdp);
  },
  downloadFile: (f: File) => dloadFile([f]),
  multiDownloadFile: (f: File[]) => dloadFile(f),
};

const loadExterns = (permissions: string[]) => {
  //from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
  let ss = starters();

  //add all restricted functions, updateform is in there, but it is added every time to prevent errors
  permissions.forEach((p) => {
    ss["js_" + p] = restrictedFuncs[p];
  });
  return ss;
};
