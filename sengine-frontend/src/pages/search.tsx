import * as React from "react";
import axios from "axios";
import Form from "@rjsf/core";
import * as etag from 'etag';
import { ToastContainer, toast } from 'react-toastify';
import '../data/styles.css';
import 'react-toastify/dist/ReactToastify.css';
//import outputs
import canvasOutput from './outputHandlers/canvas';

import { ValidComponent, subel, util } from "../data/interfaces";
import jwtDecode from "jwt-decode";
import Collapsible from "./outputHandlers/collapsible";

//import output types
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
  const [userToken, setUserToken] = React.useState<any>();
  //state variable that contains the current program data
  const [currentComponent, setcurrentComponent] = React.useState<ValidComponent>({
    serviceUUID: "9d8f9sd8f9f8",//uuid of current service
    form: {//the current form GUI
      input: {//gui functional properties
        title: "Todo",
        type: "object",
        required: ["title"],
        properties: {
          email: { type: "string", title: "Title", default: "email" },
          done: { type: "boolean", title: "Done?", default: false }
        }
      },
      uiSchema: {//gui visual properties
        "email": {
          "inputType": "email"
        }
      },
      currentFormData: {//current gui value content
        title: "faketitle",
        done: false
      },
      output: "textarea"//the type of output field that will be rendering
    },
    permissions: [],//list of restricted browser apis that this app has access to
    currentBin: () => { }//the current binary function that serves as the backend to the gui
  });
  let cOutput;//TODO:might need to be state tied

  //variable containing the current search suggestions
  const [results, setResults] = React.useState<util[]>(
    /* [
       {
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
       }
     ]*/
  );

  React.useEffect(() => {//appends current form values to url so they can be shared
    if (currentComponent && currentComponent.form && currentComponent.form.currentFormData) {
      const vkey = Object.keys(currentComponent.form.currentFormData);
      let hobj = {};
      if (currentComponent) {
        hobj["svc"] = currentComponent.serviceUUID;//set current service uuid in url too so that the service is preserved
        if (vkey.length) {
          vkey.forEach(function (key) {
            hobj[key] = currentComponent.form.currentFormData[key];
          });
        }
        history.push(hobj);
      }
    }
  }, [currentComponent])

  const loadExterns = () => {//from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
    let ss = {};
    //allow using the builtin basic browser apis without permissions, they can be called from the binary using js_xyz
    //for example, sin would be js_sin
    [JSON, Intl, Map, Math, Number, String, Array].map(b =>
      Object.getOwnPropertyNames(b).map((p, i) => ss["js_" + p] = b[p]));
    if (currentComponent) {
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
          .then(d => { return d })
          .catch(e => { return e.message });
      };
      //function that handles screengrab api(chrome)
      const screenCap = async (opt) => {//TODO:check if user is using chrome
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
      //restricted functions that you need to petition for
      const restrictedFuncs = {//https://developer.mozilla.org/en-US/docs/Web/API
        "updateForm": (newContents) => {//updates the current form contents with new contents from program
          currentComponent.form.currentFormData = newContents;
          setcurrentComponent(currentComponent);
        },
        "getCam": (videoConstr = true) => {//gets a webcam stream from the user(with their permission)
          mdFunc({ video: videoConstr });
        },
        "getAud": (audConstr = true) => {//gets an audio stream from the user(with their permission)
          mdFunc({ audio: audConstr });
        },
        "getVidAud": (videoConstr = true, audConstr = true) => {
          //gets a hybrid video/audio stream from the user(with their permission)
          mdFunc({
            video: videoConstr,
            audio: audConstr
          });
        },
        "getNet": (url, nwkParams = {}) => {
          //network function that only allows get requests
          if (nwkParams.hasOwnProperty("headers")) delete nwkParams["headers"];
          if (nwkParams.hasOwnProperty("body")) delete nwkParams["body"];
          netFunc(url, "GET", nwkParams);
        },
        "sendNet": (url, rqType, nwkParams = {}) => {
          //network function that allows put/post/patch/delete requests
          if (rqType === "POST" || rqType === "PUT" || rqType === "PATCH" || rqType == "DELETE")
            netFunc(url, rqType, nwkParams);
        },
        "getCurrentPos": () => {
          //gets the current gps coordinates of the user with the geolocation api
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
          //gets the current clipboard contents of the user
          return navigator.clipboard.readText()
            .then(ct => { return ct })
            .catch(e => { return e.message });
        },
        "setClipboard": (t) => {
          //sets the current clipboard contents of the user
          return navigator.clipboard.writeText(t)
            .then(() => { return true })
            .catch(() => { return false });
        },
        "getScreen": () => {
          //gets the user's screen(chrome)
          const mdp = {
            video: true,
            audio: false
          };
          screenCap(mdp);
        },
        "GetScreenAudio": () => {
          //gets the user's screen+audio(chrome)
          const mdp = {
            video: true,
            audio: true
          };
          screenCap(mdp);
        }
      };
      //add all restricted functions, updateform is in there, but it is added every time to prevent errors
      currentComponent.permissions.concat(["updateForm"]).forEach(p => {
        ss["js_" + p] = restrictedFuncs[p];
      });
    }
    return ss;
  };

  const handleOutput = (o) => {//update the output component with the given data
    cOutput.update(o);//TODO:would this call work?
  };


  //component webassembly paramaters
  let memory = new WebAssembly.Memory({ initial: 10, maximum: 800 });//memory(in pages)
  const importObject = {
    js: {
      mem: memory
    },
    env: loadExterns(),//imported functions
    imports: {
      imported_func: arg => handleOutput(arg)
    }
  };//TODO: how to do output?

  const sLoader = (cmpID: string) => {
    //https://developer.mozilla.org/en-US/docs/WebAssembly/Using_the_JavaScript_API
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory
    return defaultConnect
      .post("/utils/load/" + cmpID)
      .then(async (itm) => {
        if (itm && itm.data) {
          const { jsonLoc, binLoc, permissions, _id } = JSON.parse(itm.data);
          //get and set current binary backend
          fetch(binLoc)
            .then(async response => {
              const binHash = response.headers.get('etag');
              if (etag(response) != binHash)
                throw "it seems something is wrong with this module. You may want to connect to a different network.";
              //set current form to the form stored in s3
              const form = await axios.get(jsonLoc).then(d => { return d.data });

              let currentBin;
              //load current binary
              await WebAssembly.instantiateStreaming(response, importObject)
                .then(obj => currentBin = obj.instance.exports.exported_func);

              //set all module values
              setcurrentComponent({
                serviceUUID: _id,
                form,
                permissions,
                currentBin
              });
            }).catch(e => toast(e));
        }
      })
      .catch((e) => toast(e));
  };


  //sends search query, returns list of related utilities
  const sendSearch = (term: string) => {
    if (cdt >= Date.now() - delay) return;
    cdt = Date.now();
    return defaultConnect
      .post("/utils/search/" + term)
      .then(utlist => {
        if (utlist && utlist.data) {
          setResults(utlist.data.results);
        }
      })
      .catch((e) => toast(e));
  };


  const getUtil = (sid: string) => {
    if (searchBox) searchBox.current.value = "";
    return sLoader(sid);
  };

  //dictionary of all possible output types
  const outputs = {
    "textarea": TextOutput,
    "canvas": CanvasOutput,
    "video": VideoOutput,
    "audio": AudioOutput,
    "files": FilesOutput
  };

  //logs out the current user, reloads page
  const logout = () => {
    localStorage.removeItem("tk");
    window.location.reload();
  }

  //runs when the page loads
  React.useEffect(() => {

    const tkn = JSON.parse(localStorage.getItem("tk"));
    //checks if user is logged in, if so then set the user object
    if (tkn) {
      const jwt = jwtDecode(tkn.token); //searches local storage for jwt key
      if ((jwt.exp || 0) * 1000 < Date.now()) {
        return logout();
      }
      defaultConnect
        .post(("/user/getprof"), {
          token: jwt
        })
        .then((itm) => setUserToken(itm.data))
        .catch((e) => toast(e));
    }
    //set the current util/util with custom params if the user supplies it in the url
    if (match.params.length > 0) {
      if (match.params.length > 1) {
        getUtil(match.params.svc);
      } else {
        getUtil(match.params.svc)
          .then(() => {
            let cvls = match.params;
            delete cvls["svc"];
            currentComponent.form.currentFormData = cvls;
            setcurrentComponent(currentComponent);
          });
      }
    }
  }, []);

  //handle form error
  const handleErr = (e) => toast(e);

  //handle form change
  const handleChange = (e) => {
    currentComponent.form.currentFormData = currentComponent.currentBin({ data: e, complete: false });
    setcurrentComponent(currentComponent);
  }

  //handle form submit
  const handleSubmit = (e) => {
    currentComponent.form.currentFormData = currentComponent.currentBin({ data: e, complete: true });
    setcurrentComponent(currentComponent);
  };

  //report a util if logged in
  const reportUtil = () => defaultConnect
    .post(("/utils/report"), {
      util: currentComponent.serviceUUID,
      reason: reportBox.current.value
    })
    .then((itm) => setUserToken(itm.data))
    .catch((e) => toast(e));

  return (
    <div id="holder">
      <ToastContainer />
      <div>
        <img
          alt="ServiceEngine Logo"
          src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnMiIKICAgd2lkdGg9IjY0IgogICBoZWlnaHQ9IjY0IgogICB2aWV3Qm94PSIwIDAgNjQgNjQiCiAgIHNvZGlwb2RpOmRvY25hbWU9InNlTG9nby5wbmcuc3ZnIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIxLjAuMSAoM2JjMmU4MTNmNSwgMjAyMC0wOS0wNykiPgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTgiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4KICAgICAgICA8ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+CiAgICAgICAgPGRjOnRpdGxlIC8+CiAgICAgIDwvY2M6V29yaz4KICAgIDwvcmRmOlJERj4KICA8L21ldGFkYXRhPgogIDxkZWZzCiAgICAgaWQ9ImRlZnM2IiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIGd1aWRldG9sZXJhbmNlPSIxMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDI1IgogICAgIGlkPSJuYW1lZHZpZXc0IgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBpbmtzY2FwZTp6b29tPSIzNy40MzI0NjUiCiAgICAgaW5rc2NhcGU6Y3g9IjM0LjYxNjAwOCIKICAgICBpbmtzY2FwZTpjeT0iMzMuMzg1MzkiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJnNDgiCiAgICAgaW5rc2NhcGU6c25hcC1pbnRlcnNlY3Rpb24tcGF0aHM9InRydWUiCiAgICAgaW5rc2NhcGU6b2JqZWN0LXBhdGhzPSJ0cnVlIgogICAgIGlua3NjYXBlOnNuYXAtbWlkcG9pbnRzPSJ0cnVlIgogICAgIGlua3NjYXBlOnNuYXAtc21vb3RoLW5vZGVzPSJ0cnVlIgogICAgIGlua3NjYXBlOnNuYXAtbm9kZXM9InRydWUiCiAgICAgaW5rc2NhcGU6ZG9jdW1lbnQtcm90YXRpb249IjAiCiAgICAgaW5rc2NhcGU6c25hcC1iYm94PSJmYWxzZSIKICAgICBpbmtzY2FwZTpiYm94LW5vZGVzPSJ0cnVlIgogICAgIGlua3NjYXBlOmJib3gtcGF0aHM9InRydWUiIC8+CiAgPGcKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlua3NjYXBlOmxhYmVsPSJJbWFnZSIKICAgICBpZD0iZzEwIj4KICAgIDxnCiAgICAgICBpZD0iZzUwMTEiCiAgICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3NS4wODU3OTYsMjcuMjIzOTcpIj4KICAgICAgPGcKICAgICAgICAgaWQ9Imc1MDM5Ij4KICAgICAgICA8ZwogICAgICAgICAgIGlkPSJnNDgiCiAgICAgICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC45NTY4MjE2MywwLDAsMC45ODYyNDU5NCwtMy40MTMwNTM2LC0wLjQyMjcwODI0KSI+CiAgICAgICAgICA8ZwogICAgICAgICAgICAgaWQ9Imc1MDIwIgogICAgICAgICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMCwxLDEsMCwtODEuNDU2NTI0LC0zNC4zNzIyNzEpIj4KICAgICAgICAgICAgPHBhdGgKICAgICAgICAgICAgICAgc3R5bGU9ImZpbGw6I2YzYmIxMTtzdHJva2Utd2lkdGg6MS4zMzMzMyIKICAgICAgICAgICAgICAgZD0ibSA5LjkwNDUxNjUsNDkuMTE4NDEzIDAuMDg2NDcsLTYuNDI5NjAzIDkuMjQ2ODYwNSw5LjMwMDU0OCB2IDYuNjY2NjY3IHogTSA0NS45MDQ1MTcsMTMuNzI2MzUgViA3LjA1OTY4MjUgbCA5LjMzMzMzLDkuMjE0OTgwNSAtMy4xNzE2MDgsMy4yNzYzMDggeiIKICAgICAgICAgICAgICAgaWQ9InBhdGg0Nzk4IgogICAgICAgICAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NjY2NjY2MiIC8+CiAgICAgICAgICAgIDxnCiAgICAgICAgICAgICAgIGlkPSJnNTAxNCI+CiAgICAgICAgICAgICAgPHBhdGgKICAgICAgICAgICAgICAgICBzdHlsZT0iZmlsbDojMWExYjVmO3N0cm9rZS13aWR0aDoxLjMzMzMzIgogICAgICAgICAgICAgICAgIGQ9Im0gMTkuMjM3ODQ3LDU1LjMyMjY5MSB2IC0zLjMzMzMzMyBsIDMuMzMzMzQsLTMuMTMxNTA0IDMuMzMzMzMsLTMuMTMxNTA0IHYgMy4zMzMzMzMgMy4zMzMzMzQgbCAtMy4zMzMzMywzLjEzMTUwNCAtMy4zMzMzNCwzLjEzMTUwNCB6IG0gLTkuMjQ2ODYwNSwtMTIuNjMzODg0IDcuOTU2NzcwNSwtNy44NzM3NCA3Ljk1Njc2LC03Ljg3Mzc0IHYgMy4zNDE3MTcgMy4zNDE3MTkgTCAxOS40NTcwMDcsMzkuOTc1MzI0IDEzLjIxMzUsNDUuODk3ODEgWiBNIDM5LjIzNzg0NywzNS40NDEwNDUgdiAtMy4zMzMzMzQgbCA4LC03LjkxNjUyNCA4LC03LjkxNjUyNCB2IDMuMzMzMzM0IDMuMzMzMzMzIGwgLTgsNy45MTY1MjQgLTgsNy45MTY1MjQgeiBtIDAsLTE4Ljc4NTAyIHYgLTMuMzMzMzM0IGwgMy4zMzMzNCwtMy4xMzE1MDUgMy4zMzMzMywtMy4xMzE1MDM1IHYgMy4zMzMzMzQ1IDMuMzMzMzMzIGwgLTMuMzMzMzMsMy4xMzE1MDQgLTMuMzMzMzQsMy4xMzE1MDQgeiIKICAgICAgICAgICAgICAgICBpZD0icGF0aDQ3ODgiCiAgICAgICAgICAgICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjYyIgLz4KICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8cGF0aAogICAgICAgICAgICAgICBzdHlsZT0iZmlsbDojY2NjY2NjO3N0cm9rZS13aWR0aDoxLjMzMzMzIgogICAgICAgICAgICAgICBkPSJtIDI1LjkwNDUxNywyNi45NDEzMyAxMy4zMzMzMyw1LjE2NjM4MSB2IDYuNjY2NjY3IGwgLTEzLjMzMzMzLC01LjE0OTYxMiB6IgogICAgICAgICAgICAgICBpZD0icGF0aDQ3OTQtOSIKICAgICAgICAgICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY2NjYyIgLz4KICAgICAgICAgIDwvZz4KICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICBzdHlsZT0iZmlsbDojN2RiNzVkO3N0cm9rZS13aWR0aDoxLjMzMzMzIgogICAgICAgICAgICAgZD0ibSAtNTAuODU3Nzg3LDM1LjE5MTI0MSAtOS4zNzAxMzEsLTkuMzMwNDYgNi41NjI2NzMsLTAuMDAyIDUuODg4OTE3LDYuMjY0NjE3IHoiCiAgICAgICAgICAgICBpZD0icGF0aDQ3OTQiCiAgICAgICAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NjIiAvPgogICAgICAgICAgPHBhdGgKICAgICAgICAgICAgIHN0eWxlPSJmaWxsOiNjY2NjY2M7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlLXdpZHRoOjEuMzMzMzMiCiAgICAgICAgICAgICBkPSJtIC0zOC4xMzkxMjQsMTAuNTIwNjcyIDIuMDA3ODk1LC0xLjg1NjQ2NjcgNi4xNjE3MzksNi42NjQxOTQ3IC0yLjAzNzEwNSwxLjg1NDE2NSB6IgogICAgICAgICAgICAgaWQ9InBhdGg0Nzk0LTktNiIKICAgICAgICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2MiIC8+CiAgICAgICAgICA8cGF0aAogICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzdkYjc1ZDtzdHJva2Utd2lkdGg6MS4zMzMzMyIKICAgICAgICAgICAgIGQ9Im0gLTguMjUxNzg1NCwtMC43ODgyMDY3IC05Ljc1MTI3NzYsLTkuMzIyODY1MyAtNi4wMzc5MiwtMC4wMTA3MyA5LjU3MzY4NSw5LjI1ODc0NDAxIHoiCiAgICAgICAgICAgICBpZD0icGF0aDQ3OTQtMSIKICAgICAgICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2MiIC8+CiAgICAgICAgICA8ZwogICAgICAgICAgICAgaWQ9Imc0OTk4IgogICAgICAgICAgICAgdHJhbnNmb3JtPSJyb3RhdGUoLTkzLjIyMTc1OSwtMzYuMjg1ODkxLDE3LjczNzUyMikiPgogICAgICAgICAgICA8ZwogICAgICAgICAgICAgICBpZD0iZzUwMDIiPgogICAgICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzFhMWI1ZjtmaWxsLW9wYWNpdHk6MTtzdHJva2Utd2lkdGg6MS4zMzMzMyIKICAgICAgICAgICAgICAgICBkPSJtIC01MC40MzY4MjEsMTIuMDA0NDg4IC0yLjgxNTg5LC0zLjM3MjYwODggMC4xNzk4MTgsLTMuMjEyMDY4IDAuMTc5ODIsLTMuMjEyMDY1NCAzLjI1MjE3NSwzLjYzNzkwMDQgMy4yNTIxODMsMy42Mzc5MDEgLTAuNjE2MTEyLDIuOTQ2Nzc1OCAtMC42MTYxMDMsMi45NDY3NzMgeiBtIDE0LjIzOTg4NywtMy44OTM0NzM4IC03LjIyMDYzNywtOC4xODE3OTcyOCAwLjE4MzQwOSwtMy4yNzYyMDgzMiAwLjE4MzQxMSwtMy4yNzYyMDU0IDcuNjUyNTYzLDguNTYwMTg2NiA3LjY1MjU2Myw4LjU2MDE4OTIgLTAuNjE1MzM0LDIuODk3ODE2IC0wLjYxNTMzNiwyLjg5NzgxNiB6IgogICAgICAgICAgICAgICAgIGlkPSJwYXRoNDc4OC0wIgogICAgICAgICAgICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2NjY2NjY2NjY2NjY2NjIiAvPgogICAgICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzFhMWI1ZjtzdHJva2Utd2lkdGg6MS4zMzMzMyIKICAgICAgICAgICAgICAgICBkPSJtIC0yNS41MDI3MDMsNDAuMjE3OTM4IDYuMTM3NzI1LDYuNTUwNTQgMC40MjQwNDksLTYuMjAxNDgyIC0wLjM1MjA3LC0wLjQxNDU1NiAtMy4yMjk4OCwtMy42NTc3MTggLTIuOTk4ODA2LDAuMjY1MDM2IC0yLjk5ODgwNCwwLjI2NTAyNyB6IG0gNS41NDIyNiwtMTMuNjgyNzI0IDcuMzU3OTMyLDguMTc1NDEzIDMuNDQzNzM2NSwtMy4xODE4MzggLTQuNTc2NTQ3NSwtNS4wNjAxNjYgLTcuNjAwMDk2LC04LjYwNjgwNCAtMi45NTAwOTQsMC4yNzAwMjQgLTIuOTUwMDk0LDAuMjcwMDI1IHoiCiAgICAgICAgICAgICAgICAgaWQ9InBhdGg0Nzg4LTAtMCIKICAgICAgICAgICAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NjY2NjY2NjY2NjY2MiIC8+CiAgICAgICAgICAgIDwvZz4KICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICAgIDwvZz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo="
        />
        {userToken ? <h5>{userToken.username}</h5> : <button onClick={() => history.push('/auth')}>login</button>}
        {currentComponent && (
          <div id="helper">
            <div id="serviceContainer">
              <Form schema={currentComponent.form.input}
                uiSchema={currentComponent.form.uiSchema}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onError={handleErr} />
              {cOutput && (
                <div>
                  <hr></hr>
                  {() => outputs[currentComponent.form.output]}
                </div>
              )}
            </div>

            <h6>Share utility</h6>
            <Collapsible>
              <input type="text" value={window.location.href}></input>
            </Collapsible>

            {userToken &&
              <div>
                <h6>Report utility</h6>
                <Collapsible>
                  <textarea ref={reportUtil}></textarea>
                  <button onClick={() => reportUtil()}>report</button>
                </Collapsible>
              </div>}
          </div>
        )}
        {currentComponent == null ? (
          <input id="searchInput"
            ref={searchBox}
            placeholder="ex: convert mkv to mp4"
            onChange={(event) => sendSearch(event.target.value)}
          />
        ) : (
          <div id="lgButton"
            onClick={() => setcurrentComponent(null)}
          >
            &times;
          </div>
        )}
      </div>
      {
        (results && results.length > 0) ? (
          <div id="resultsHolder">
            {results.map((result, index) => {
              return (
                <div id="suggestion" key={index} onClick={() => getUtil(result._id)}>
                  <h4>{result.title}</h4>
                  <h5>likes: {result.likes}|uses: {result.uses}|dislikes: {result.dislikes}</h5>
                  <p>{result.description}</p>
                </div>
              );
            })}
          </div>
        ) : (currentComponent == null && <div id="introHolder">Type your command to start</div>)
      }
    </div>
  );
};

export default IndexPage;
