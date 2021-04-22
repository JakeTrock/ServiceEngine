import * as React from "react";
import axios from "axios";
import Form from "@rjsf/core";
import { sha512 } from 'hash-wasm';

import {
  Holder,
  ServiceContainer,
  Suggestion,
  IntroHolder,
  SearchFormHolder,
  ResultsHolder,
  SearchInput,
  LgButton,
  Error,
  FormButton
} from "../data/styles";
//import outputs
import canvasOutput from './outputHandlers/canvas';

import { ValidComponent, subel } from "../data/interfaces";
import jwtDecode from "jwt-decode";
import Collapsible from "./outputHandlers/collapsible";
import CanvasOutput from "./outputHandlers/canvas";
import TextOutput from "./outputHandlers/text";
import FilesOutput from "./outputHandlers/files";
import VideoOutput from "./outputHandlers/video";
import AudioOutput from "./outputHandlers/audio";
// consts
const delay = 800;
const defaultConnect = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-type": "application/json",
  },
});
// markup
const IndexPage = ({ match, location, history }) => {
  //https://reactrouter.com/web/api/withRouter
  //https://reactrouter.com/web/api/match
  let cdt = Date.now();
  const reportBox = React.useRef(null);
  const searchBox = React.useRef(null);
  const [userToken, setUserToken] = React.useState();
  const [showDl, setShowDl] = React.useState(false);
  const [currentComponent, setcurrentComponent] = React.useState<ValidComponent>({
    serviceUUID: "9d8f9sd8f9f8",
    form: {
      input: {
        title: "Todo",
        type: "object",
        required: ["title"],
        properties: {
          email: { type: "string", title: "Title", default: "email" },
          done: { type: "boolean", title: "Done?", default: false }
        }
      },
      uiSchema: {
        "email": {
          "inputType": "email"
        }
      },
      currentFormData: {
        title: "faketitle",
        done: false
      },
      output: "textarea"
    },
    permissions: [],
    currentBin: () => { }
  });
  const [errList, setErrList] = React.useState<[any] | []>([]);
  let cOutput;//TODO:might need to be state tied
  const results = [
    /*{
      _id:"sdfsdfsdfsdfdf",
      likes:2
      dislikes:4
      uses:8
      description:"times things"
      title:"timer"
    },{
      _id:"sdfsdfsdfsdfdf",
      likes:4
      dislikes:3
      uses:9
      description:"tells the time"
      title:"clock"
    },{
      _id:"sdfsdfsdfsdfdf",
      likes:1
      dislikes:2
      uses:7
      description:"times events"
      title:"stopwatch"
    }*/
  ];



  const sx = () => {//from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
    let ss = {};
    [JSON, Intl, Map, Math, Number, String, Array].map(b =>
      Object.getOwnPropertyNames(b).map((p, i) => ss["js_" + p] = b[p]));
    const mdFunc = (mdConstr) => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        return navigator.mediaDevices.getUserMedia(mdConstr).then((stream) => {
          return stream;
        });
      }
    };
    const netFunc = (url, mth, nwkParams) => {
      nwkParams["method"] = mth;
      return fetch(url, nwkParams)
        .then(d => { return d })
        .catch(e => { return e.message });
    };
    const screenCap = async (opt) => {
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
    const restrictedFuncs = {//https://developer.mozilla.org/en-US/docs/Web/API
      "getCam": (videoConstr = true) => {
        mdFunc({ video: videoConstr });
      },
      "getAud": (audConstr = true) => {
        mdFunc({ audio: audConstr });
      },
      "getVidAud": (videoConstr = true, audConstr = true) => {
        mdFunc({
          video: videoConstr,
          audio: audConstr
        });
      },
      "getNet": (url, nwkParams = {}) => {
        if (nwkParams.hasOwnProperty("headers")) delete nwkParams["headers"];
        if (nwkParams.hasOwnProperty("body")) delete nwkParams["body"];
        netFunc(url, "GET", nwkParams);
      },
      "sendNet": (url, rqType, nwkParams = {}) => {
        if (rqType === "POST" || rqType === "PUT" || rqType == "DELETE")
          netFunc(url, rqType, nwkParams);
      },
      "getCurrentPos": () => {
        const opt = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };
        const sfun = (pos) => {
          return pos.coords;
        };
        const efun = (e) => {
          return e.message;
        };
        return navigator.geolocation.getCurrentPosition(sfun, efun, opt);
      },
      "getClipboard": () => {
        return navigator.clipboard.readText()
          .then(ct => { return ct })
          .catch(e => { return e.message });
      },
      "setClipboard": (t) => {
        return navigator.clipboard.writeText(t)
          .then(() => { return true })
          .catch(() => { return false });
      },
      "getScreen": () => {
        const mdp = {
          video: true,
          audio: false
        };
        screenCap(mdp);
      },
      "GetScreenAudio": () => {
        const mdp = {
          video: true,
          audio: true
        };
        screenCap(mdp);
      }
    };
    currentComponent.permissions.forEach(p => {
      ss["js_" + p] = restrictedFuncs[p];
    });
    return ss;
  };

  const handleOutput = (o) => {
    const p = JSON.parse(o);
    if (p.type === "f") {//updates form
      //TODO:how to update form?
    } else if (p.type === "o") {//update output
      cOutput.update(memory);//TODO:would this call work?
    }
  };
  let memory = new WebAssembly.Memory({ initial: 10, maximum: 800 });//memory(in pages)
  const importObject = {
    js: {
      mem: memory
    },
    env: sx(),
    imports: {
      imported_func: arg => handleOutput(arg)
    }
  };//TODO: how to do output?

  const sLoader = () => {
    //https://developer.mozilla.org/en-US/docs/WebAssembly/Using_the_JavaScript_API
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory
    return defaultConnect
      .post("/load/" + currentComponent.serviceUUID)
      .then(async (itm) => {
        if (itm && itm.data) {
          const { jsonLoc, binLoc } = JSON.parse(itm.data);
          currentComponent.form = await axios.get(jsonLoc).then(d => { return d.data });
          currentComponent.permissions = itm.data.permissions;
          const bin = await fetch(binLoc);
          const hashCheck = await bin.arrayBuffer().then(ab => sha512(new Uint8Array(ab)));
          if (hashCheck === itm.data.binHash) {
            await WebAssembly.instantiateStreaming(bin, importObject)
              .then(obj => currentComponent.currentBin = obj.instance.exports.exported_func);
            setcurrentComponent(currentComponent);
            switch (currentComponent.form.output) {//TODO:add all
              case "canvas": {
                cOutput = canvasOutput
              } break;

            };
          } else {
            alert("it seems something is wrong with this module. You may want to connect to a different network.");
            throw setErrList(errList);
          }
        }
      })
      .catch((e) => setErrList(e));
  };

  const sendSearch = (term: string) => {
    if (cdt >= Date.now() - delay) return;
    cdt = Date.now();
    return defaultConnect
      .post("/utils/search/" + term)
      .catch((e) => setErrList(e));
  };

  const getUtil = (sid: string) => {
    if (searchBox) searchBox.current.value = "";
    return defaultConnect
      .post("/utils/load/" + sid)
      .then((itm) => {
        if (itm && itm.data) {
          setcurrentComponent(JSON.parse(itm.data));
          sLoader();
        }
      })
      .catch((e) => setErrList(e));
  };

  const getOutput = (otname: String) => {
    switch (otname) {
      case "textarea": {
        return TextOutput;
      } break;
      case "canvas": {
        return CanvasOutput;
      } break;
      case "video": {
        return VideoOutput;
      } break;
      case "audio": {
        return AudioOutput;
      } break;
      case "files": {
        return FilesOutput;
      } break;
    }
  }

  const logout = () => {
    localStorage.removeItem("tk");
    window.location.reload();
  }

  React.useEffect(() => {
    const jwt = jwtDecode(JSON.parse(localStorage.getItem("tk")).token); //searches local storage for jwt key
    if ((jwt.exp || 0) * 1000 < Date.now()) {
      return logout();
    }
    defaultConnect
      .post(("/user/getprof"), {
        token: jwt
      })
      .then((itm) => setUserToken(itm.data))
      .catch((error) => {
        errList.push(error);
        return setErrList(errList);
      });
    if (match.params.length > 0) {
      getUtil(match.params.svc);
      sLoader();
    }
  }, []);

  const handleErr = (e) => {
    setErrList(e);
    setShowDl(false);
  };
  const handleChange = (e) => {
    currentComponent.form.currentFormData = currentComponent.currentBin({ data: e, complete: false });
    setcurrentComponent(currentComponent);
  }
  const handleSubmit = (e) => {
    currentComponent.form.currentFormData = currentComponent.currentBin({ data: e, complete: true });
    setcurrentComponent(currentComponent);
    setShowDl(true);
  };

  const reportUtil = () => defaultConnect
    .post(("/utils/report"), {
      util: currentComponent.serviceUUID,
      reason: reportBox.current.value
    })
    .then((itm) => setUserToken(itm.data))
    .catch((error) => {
      errList.push(error);
      return setErrList(errList);
    });

  return (
    <Holder>
      <SearchFormHolder>
        <img
          alt="ServiceEngine Logo"
          src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnMiIKICAgd2lkdGg9IjY0IgogICBoZWlnaHQ9IjY0IgogICB2aWV3Qm94PSIwIDAgNjQgNjQiCiAgIHNvZGlwb2RpOmRvY25hbWU9InNlTG9nby5wbmcuc3ZnIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIxLjAuMSAoM2JjMmU4MTNmNSwgMjAyMC0wOS0wNykiPgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTgiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4KICAgICAgICA8ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+CiAgICAgICAgPGRjOnRpdGxlIC8+CiAgICAgIDwvY2M6V29yaz4KICAgIDwvcmRmOlJERj4KICA8L21ldGFkYXRhPgogIDxkZWZzCiAgICAgaWQ9ImRlZnM2IiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIGd1aWRldG9sZXJhbmNlPSIxMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDI1IgogICAgIGlkPSJuYW1lZHZpZXc0IgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBpbmtzY2FwZTp6b29tPSIzNy40MzI0NjUiCiAgICAgaW5rc2NhcGU6Y3g9IjM0LjYxNjAwOCIKICAgICBpbmtzY2FwZTpjeT0iMzMuMzg1MzkiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJnNDgiCiAgICAgaW5rc2NhcGU6c25hcC1pbnRlcnNlY3Rpb24tcGF0aHM9InRydWUiCiAgICAgaW5rc2NhcGU6b2JqZWN0LXBhdGhzPSJ0cnVlIgogICAgIGlua3NjYXBlOnNuYXAtbWlkcG9pbnRzPSJ0cnVlIgogICAgIGlua3NjYXBlOnNuYXAtc21vb3RoLW5vZGVzPSJ0cnVlIgogICAgIGlua3NjYXBlOnNuYXAtbm9kZXM9InRydWUiCiAgICAgaW5rc2NhcGU6ZG9jdW1lbnQtcm90YXRpb249IjAiCiAgICAgaW5rc2NhcGU6c25hcC1iYm94PSJmYWxzZSIKICAgICBpbmtzY2FwZTpiYm94LW5vZGVzPSJ0cnVlIgogICAgIGlua3NjYXBlOmJib3gtcGF0aHM9InRydWUiIC8+CiAgPGcKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlua3NjYXBlOmxhYmVsPSJJbWFnZSIKICAgICBpZD0iZzEwIj4KICAgIDxnCiAgICAgICBpZD0iZzUwMTEiCiAgICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3NS4wODU3OTYsMjcuMjIzOTcpIj4KICAgICAgPGcKICAgICAgICAgaWQ9Imc1MDM5Ij4KICAgICAgICA8ZwogICAgICAgICAgIGlkPSJnNDgiCiAgICAgICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC45NTY4MjE2MywwLDAsMC45ODYyNDU5NCwtMy40MTMwNTM2LC0wLjQyMjcwODI0KSI+CiAgICAgICAgICA8ZwogICAgICAgICAgICAgaWQ9Imc1MDIwIgogICAgICAgICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMCwxLDEsMCwtODEuNDU2NTI0LC0zNC4zNzIyNzEpIj4KICAgICAgICAgICAgPHBhdGgKICAgICAgICAgICAgICAgc3R5bGU9ImZpbGw6I2YzYmIxMTtzdHJva2Utd2lkdGg6MS4zMzMzMyIKICAgICAgICAgICAgICAgZD0ibSA5LjkwNDUxNjUsNDkuMTE4NDEzIDAuMDg2NDcsLTYuNDI5NjAzIDkuMjQ2ODYwNSw5LjMwMDU0OCB2IDYuNjY2NjY3IHogTSA0NS45MDQ1MTcsMTMuNzI2MzUgViA3LjA1OTY4MjUgbCA5LjMzMzMzLDkuMjE0OTgwNSAtMy4xNzE2MDgsMy4yNzYzMDggeiIKICAgICAgICAgICAgICAgaWQ9InBhdGg0Nzk4IgogICAgICAgICAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NjY2NjY2MiIC8+CiAgICAgICAgICAgIDxnCiAgICAgICAgICAgICAgIGlkPSJnNTAxNCI+CiAgICAgICAgICAgICAgPHBhdGgKICAgICAgICAgICAgICAgICBzdHlsZT0iZmlsbDojMWExYjVmO3N0cm9rZS13aWR0aDoxLjMzMzMzIgogICAgICAgICAgICAgICAgIGQ9Im0gMTkuMjM3ODQ3LDU1LjMyMjY5MSB2IC0zLjMzMzMzMyBsIDMuMzMzMzQsLTMuMTMxNTA0IDMuMzMzMzMsLTMuMTMxNTA0IHYgMy4zMzMzMzMgMy4zMzMzMzQgbCAtMy4zMzMzMywzLjEzMTUwNCAtMy4zMzMzNCwzLjEzMTUwNCB6IG0gLTkuMjQ2ODYwNSwtMTIuNjMzODg0IDcuOTU2NzcwNSwtNy44NzM3NCA3Ljk1Njc2LC03Ljg3Mzc0IHYgMy4zNDE3MTcgMy4zNDE3MTkgTCAxOS40NTcwMDcsMzkuOTc1MzI0IDEzLjIxMzUsNDUuODk3ODEgWiBNIDM5LjIzNzg0NywzNS40NDEwNDUgdiAtMy4zMzMzMzQgbCA4LC03LjkxNjUyNCA4LC03LjkxNjUyNCB2IDMuMzMzMzM0IDMuMzMzMzMzIGwgLTgsNy45MTY1MjQgLTgsNy45MTY1MjQgeiBtIDAsLTE4Ljc4NTAyIHYgLTMuMzMzMzM0IGwgMy4zMzMzNCwtMy4xMzE1MDUgMy4zMzMzMywtMy4xMzE1MDM1IHYgMy4zMzMzMzQ1IDMuMzMzMzMzIGwgLTMuMzMzMzMsMy4xMzE1MDQgLTMuMzMzMzQsMy4xMzE1MDQgeiIKICAgICAgICAgICAgICAgICBpZD0icGF0aDQ3ODgiCiAgICAgICAgICAgICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjYyIgLz4KICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8cGF0aAogICAgICAgICAgICAgICBzdHlsZT0iZmlsbDojY2NjY2NjO3N0cm9rZS13aWR0aDoxLjMzMzMzIgogICAgICAgICAgICAgICBkPSJtIDI1LjkwNDUxNywyNi45NDEzMyAxMy4zMzMzMyw1LjE2NjM4MSB2IDYuNjY2NjY3IGwgLTEzLjMzMzMzLC01LjE0OTYxMiB6IgogICAgICAgICAgICAgICBpZD0icGF0aDQ3OTQtOSIKICAgICAgICAgICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY2NjYyIgLz4KICAgICAgICAgIDwvZz4KICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICBzdHlsZT0iZmlsbDojN2RiNzVkO3N0cm9rZS13aWR0aDoxLjMzMzMzIgogICAgICAgICAgICAgZD0ibSAtNTAuODU3Nzg3LDM1LjE5MTI0MSAtOS4zNzAxMzEsLTkuMzMwNDYgNi41NjI2NzMsLTAuMDAyIDUuODg4OTE3LDYuMjY0NjE3IHoiCiAgICAgICAgICAgICBpZD0icGF0aDQ3OTQiCiAgICAgICAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NjIiAvPgogICAgICAgICAgPHBhdGgKICAgICAgICAgICAgIHN0eWxlPSJmaWxsOiNjY2NjY2M7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlLXdpZHRoOjEuMzMzMzMiCiAgICAgICAgICAgICBkPSJtIC0zOC4xMzkxMjQsMTAuNTIwNjcyIDIuMDA3ODk1LC0xLjg1NjQ2NjcgNi4xNjE3MzksNi42NjQxOTQ3IC0yLjAzNzEwNSwxLjg1NDE2NSB6IgogICAgICAgICAgICAgaWQ9InBhdGg0Nzk0LTktNiIKICAgICAgICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2MiIC8+CiAgICAgICAgICA8cGF0aAogICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzdkYjc1ZDtzdHJva2Utd2lkdGg6MS4zMzMzMyIKICAgICAgICAgICAgIGQ9Im0gLTguMjUxNzg1NCwtMC43ODgyMDY3IC05Ljc1MTI3NzYsLTkuMzIyODY1MyAtNi4wMzc5MiwtMC4wMTA3MyA5LjU3MzY4NSw5LjI1ODc0NDAxIHoiCiAgICAgICAgICAgICBpZD0icGF0aDQ3OTQtMSIKICAgICAgICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2MiIC8+CiAgICAgICAgICA8ZwogICAgICAgICAgICAgaWQ9Imc0OTk4IgogICAgICAgICAgICAgdHJhbnNmb3JtPSJyb3RhdGUoLTkzLjIyMTc1OSwtMzYuMjg1ODkxLDE3LjczNzUyMikiPgogICAgICAgICAgICA8ZwogICAgICAgICAgICAgICBpZD0iZzUwMDIiPgogICAgICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzFhMWI1ZjtmaWxsLW9wYWNpdHk6MTtzdHJva2Utd2lkdGg6MS4zMzMzMyIKICAgICAgICAgICAgICAgICBkPSJtIC01MC40MzY4MjEsMTIuMDA0NDg4IC0yLjgxNTg5LC0zLjM3MjYwODggMC4xNzk4MTgsLTMuMjEyMDY4IDAuMTc5ODIsLTMuMjEyMDY1NCAzLjI1MjE3NSwzLjYzNzkwMDQgMy4yNTIxODMsMy42Mzc5MDEgLTAuNjE2MTEyLDIuOTQ2Nzc1OCAtMC42MTYxMDMsMi45NDY3NzMgeiBtIDE0LjIzOTg4NywtMy44OTM0NzM4IC03LjIyMDYzNywtOC4xODE3OTcyOCAwLjE4MzQwOSwtMy4yNzYyMDgzMiAwLjE4MzQxMSwtMy4yNzYyMDU0IDcuNjUyNTYzLDguNTYwMTg2NiA3LjY1MjU2Myw4LjU2MDE4OTIgLTAuNjE1MzM0LDIuODk3ODE2IC0wLjYxNTMzNiwyLjg5NzgxNiB6IgogICAgICAgICAgICAgICAgIGlkPSJwYXRoNDc4OC0wIgogICAgICAgICAgICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2NjY2NjY2NjY2NjY2NjIiAvPgogICAgICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzFhMWI1ZjtzdHJva2Utd2lkdGg6MS4zMzMzMyIKICAgICAgICAgICAgICAgICBkPSJtIC0yNS41MDI3MDMsNDAuMjE3OTM4IDYuMTM3NzI1LDYuNTUwNTQgMC40MjQwNDksLTYuMjAxNDgyIC0wLjM1MjA3LC0wLjQxNDU1NiAtMy4yMjk4OCwtMy42NTc3MTggLTIuOTk4ODA2LDAuMjY1MDM2IC0yLjk5ODgwNCwwLjI2NTAyNyB6IG0gNS41NDIyNiwtMTMuNjgyNzI0IDcuMzU3OTMyLDguMTc1NDEzIDMuNDQzNzM2NSwtMy4xODE4MzggLTQuNTc2NTQ3NSwtNS4wNjAxNjYgLTcuNjAwMDk2LC04LjYwNjgwNCAtMi45NTAwOTQsMC4yNzAwMjQgLTIuOTUwMDk0LDAuMjcwMDI1IHoiCiAgICAgICAgICAgICAgICAgaWQ9InBhdGg0Nzg4LTAtMCIKICAgICAgICAgICAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NjY2NjY2NjY2NjY2MiIC8+CiAgICAgICAgICAgIDwvZz4KICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICAgIDwvZz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo="
        />
        {userToken ? <h5>{userToken.username}</h5> : <FormButton onClick={() => history.push('/auth')}>login</FormButton>}
        {currentComponent && (
          <ServiceContainer>
            <Form schema={currentComponent.form.input}
              uiSchema={currentComponent.form.uiSchema}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onError={handleErr} />
            <hr></hr>
            {() => getOutput(currentComponent.form.output)}
          </ServiceContainer>
        )}
        {errList.length > 0 && (
          <Holder>
            {errList.map((result, index) => {
              return (
                <Error key={index}>
                  {result.message}
                  {result.stack && <Error>{result.stack}</Error>}
                </Error>
              );
            })}
          </Holder>
        )}
        {currentComponent == null ? (
          <SearchInput
            ref={searchBox}
            placeholder="ex: convert mkv to mp4"
            onChange={(event) => sendSearch(event.target.value)}
          />
        ) : (
          <LgButton
            onClick={() => {
              setcurrentComponent(null);
              setShowDl(false);
            }}
          >
            &times;
          </LgButton>
        )}
        <IntroHolder>Type your command to start</IntroHolder>
      </SearchFormHolder>
      <Collapsible>
        {userToken && currentComponent && <Holder>
          <textarea ref={reportUtil}></textarea>
          <FormButton onClick={() => reportUtil()}>report</FormButton>
        </Holder>}
      </Collapsible>
      {
        showDl && { cOutput }
      }
      {
        results.length > 0 && (
          <ResultsHolder>
            {results.map((result, index) => {
              return (
                <Suggestion key={index} onClick={() => getUtil(result._id)}>
                  <h4>{result.title}</h4>
                  <h5>likes: {result.likes}|uses: {result.uses}|dislikes: {result.dislikes}</h5>
                  <p>{result.description}</p>
                </Suggestion>
              );
            })}
          </ResultsHolder>
        )
      }
    </Holder>
  );
};

export default IndexPage;
