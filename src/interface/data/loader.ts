import axios from "axios";
import jszip from "jszip";
import { defaultConnect } from "./config";
import { ValidComponent } from "./interfaces";

export const sLoader = async (
  cmpID: string,
  updateForm
): Promise<ValidComponent> => {
  //https://developer.mozilla.org/en-US/docs/WebAssembly/Using_the_JavaScript_API
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory
  try {
    const item = await defaultConnect.post("/utils/load/" + cmpID);
    if (item && item.data) {
      const { jsonLoc, binLoc, permissions, _id } = JSON.parse(item.data);
      //get and set current binary backend
      const bin = await fetch(binLoc);
      //set current form to the form stored in s3
      const form = await axios.get(jsonLoc).then((d) => {
        return d.data;
      });

      let currentBin;
      //component webassembly paramaters
      let memory = new WebAssembly.Memory({ initial: 10, maximum: 800 }); //memory(in pages)
      let externs = loadExterns(permissions); //loads all external libs
      externs["js_updateForm"] = updateForm;
      const importObject = {
        js: {
          mem: memory,
        },
        imports: externs, //imported functions
      }; //TODO: how to do output?

      //load current binary
      await WebAssembly.instantiateStreaming(bin, importObject) //TODO:recast to fit template
        .then((obj) => (currentBin = obj.instance.exports.exported_func));

      //set all module values
      return {
        serviceUUID: _id,
        form,
        permissions,
        currentBin,
      };
    } else return null;
  } catch (e) {
    throw e;
  }
};

//allow using the builtin basic browser apis without permissions, they can be called from the binary using js_xyz
//for example, sin would be js_sin
const starters = () => {
  let st = {};
  [JSON, Intl, Map, Math, Number, String, Array].forEach((b) =>
    Object.getOwnPropertyNames(b).map((p) => {
      if (typeof b[p] === "function" || typeof b[p] === "number")
        st["js_" + p] = b[p];
    })
  );
  return st;
};
// []
//   .concat(
//     ...[JSON, Intl, Map, Math, Number, String, Array].map((b) =>
//       Object.getOwnPropertyNames(b).map((p) => (b["js_" + p] = b[p]))
//     )
//   )
//   .filter((f) => );

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
  //TODO:check if user is using chrome
  let captureStream = null;
  try {
    if (navigator.mediaDevices.hasOwnProperty("getDisplayMedia"))
      captureStream = await navigator.mediaDevices.getDisplayMedia(opt);
    else throw new Error("browser not supported. Try Chrome");
  } catch (err) {
    console.error("Error: " + err);
  }
  return captureStream;
};
const mkDtURL = (f: File) =>
  (window.URL || window.webkitURL).createObjectURL(f);
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
  //https://developer.mozilla.org/en-US/docs/Web/API
  //gets a webcam stream from the user(with their permission)

  getCam: (videoConstr = true) => mdFunc({ video: videoConstr }),
  //gets an audio stream from the user(with their permission)

  getAud: (audConstr = true) => mdFunc({ audio: audConstr }),
  //gets a hybrid video/audio stream from the user(with their permission)
  getVidAud: (videoConstr = true, audConstr = true) =>
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
      rqType == "DELETE"
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
  GetScreenAudio: () => {
    //gets the user's screen+audio(chrome)
    const mdp = {
      video: true,
      audio: true,
    };
    return screenCap(mdp);
  },
  DownloadFile: (f: File) => dloadFile([f]),
  MultiDownloadFile: (f: File[]) => dloadFile(f),
  getDataUrl: (f: File) => mkDtURL(f),
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
