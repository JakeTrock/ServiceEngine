import React from "react";
import './data/styles.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TabsContainer from "./subcomponents/organizers/tabsContainer";
import Tab from "./subcomponents/organizers/tab";
import { exportCollection, hookCollection, IFaceBlock, libraryHook, utility } from "./data/interfaces";
import GuiEditPanel from "./subcomponents/interface/guiEditor";
import GuiRunner from "./subcomponents/interface/guiRunner";
import GuiRender from "./subcomponents/interface/guiRender";
import { v4 as uuidv4 } from 'uuid';
import helpers from "./data/helpers";
import { hookDict } from "./guiData/compDict";
import ProgEditPanel from "./subcomponents/interface/progeditpanel";
import { Helmet } from "react-helmet";

const findEvts = (blks) => {

  let allHookAps = [];

  const hksOfBlock = (blk, legacies = "") => {
    if (blk.childNodesPossible) {
      Object.getOwnPropertyNames(blk.childNodesPossible).forEach(name => {
        hksOfBlock(legacies + "," + blk.childNodesPossible[name].uuid, blk.childNodesPossible[name]);
      });
    }
    allHookAps.push(legacies + "," + blk.childNodesPossible.uuid);//TODO:enforce uuid!!! create a seperate type!!!
  }

  return allHookAps;
}

const fileUtils = (file) => {//TODO: shim, remove
  if (file) {
    const url = window.URL.createObjectURL(file);
    const dlink = document.createElement("a");
    dlink.style.display = "none";
    dlink.href = url;
    dlink.download = file.name;
    document.body.appendChild(dlink);
    dlink.click();
    window.URL.revokeObjectURL(url);
  }
}

const getAllLibNames = () => {
  //this is a shim placeholder, replace when an established server with a text spine for libraries is implemented
  return [
    "ffmpeg",
    "fileUtils",
    "magick",
    "threedmc"
  ]
}

const prefixCB = "./programs/codeBlocks/";

//all sengine functions

//TODO:#1 make thingy to load this all in

// markup
const Editor = (props) => {
  const { match, location, history } = props;
  const [varblocks, setVarblocks] = React.useState<string>();//TODO:#1
  const [scripts, setScripts] = React.useState<string[]>();//TODO:#1
  //stores all GUI details of the utility being worked on
  const [ifSchema, setifSchema] = React.useState<IFaceBlock[]>();//TODO:#1
  const [resultData, setResultData] = React.useState<utility & { scheme: IFaceBlock[]; }>();
  const [exports, setExports] = React.useState<hookCollection>();//all references to functions in a dictionary so the gui can attach
  const [initVals, setInitVals] = React.useState<utility>({
    id: uuidv4(),
    name: "",
    file: "",
    tags: [],
    description: "",
    binariesUsed: [],
    scheme: ifSchema
  });

  const reloadRes = () => {//TODO: optimal insertion location for validation
    setResultData(Object.assign({}, initVals, { scheme: ifSchema }));
    //TODO: add in part to add res script
  };


  const assembleScript = () => {
    return `const init=(imports)=>{
              ${initVals.binariesUsed.map((name: string) => "const " + name + " = imports.libraries." + name + ";\n")}\n
              ${varblocks}\n
              return {
              ${findEvts(props.blocks).map((name: string, i) =>
      "{" + name + "}: (event, formAccess, additional, notify) => {" +
      scripts[i] +
      "\n}, \n`}"
    ).join("")}
            }}; (() => { window.glue = init; })(); }`
  }

  const downloadResult = async () => (fileUtils(new File([JSON.stringify(ifSchema) + "\n" + assembleScript()], "interface.txt")));

  const propform: IFaceBlock[] = [
    { "id": "label", "defaults": { "visible": true, "size": "1em", "label": "Title:" }, "uuid": "fd117200-5bd0-4f4f-aae6-5c475f050fb7" },
    { "id": "textbox", "defaults": { "visible": true, "disabled": false, "size": "1em", "multirow": false, "value": initVals.name }, hooks: { "change": { name: "set", additional: { name: "title" } } }, "uuid": "5dab4339-5b5f-4d98-8c65-8daa8cd37391" },
    { "id": "label", "defaults": { "visible": true, "size": "1em", "label": "Libraries:" }, "uuid": "1f9ad96a-4453-43e6-aff4-d9f0af0be38d" },
    {
      "id": "listbuild", "defaults": {
        "visible": true, "disabled": false, "size": "1em", "width": "20em", "value": initVals.binariesUsed, "childNodesCurrent": initVals.tags.map(x => "onechoice"), "childNodesPossible": {
          "onechoice": {
            id: "onechoice",
            defaults: {
              visible: true,
              disabled: false,
              size: "1em",
              labels: getAllLibNames(),
              required: false,
            },
            hooks: { change: { name: "returnDat" } },//TODO: allow array of names in future
          },
        }
      }, hooks: { "change": { name: "set", additional: { name: "binariesUsed" } } }, "uuid": "8df0af40-c88a-4af0-a51e-e354df6ad06e"
    },
    { "id": "label", "defaults": { "visible": true, "size": "1em", "label": "Tags:" }, "uuid": "11dd756a-4453-43e6-aff4-c4dccf0be38d" },
    { "id": "listbuild", "defaults": { "visible": true, "disabled": false, "size": "1em", "width": "20em", "value": initVals.tags, "childNodesCurrent": initVals.tags.map(x => "textbox"), "childNodesPossible": { "textbox": { "id": "textbox", "defaults": { "visible": true, "disabled": false, "size": "1em", "multirow": false, "value": initVals.name }, } } }, hooks: { "change": { name: "set", additional: { name: "tags" } } }, "uuid": "8ddf0ef0-c88a-4af0-a51e-eacf1c05c06e" },
    { "id": "label", "defaults": { "visible": true, "size": "1em", "label": "Description:" }, "uuid": "75fb57df-7379-4d32-a5a3-d030db8d88ef" },
    { "id": "textbox", "defaults": { "visible": true, "disabled": false, "size": "1em", "multirow": true, "value": initVals.description }, hooks: { "change": { name: "set", additional: { name: "description" } } }, "uuid": "a77429da-9fec-4457-9e3f-725a84b081d4" },
  ];

  const spld = '(()=>{window.glue=undefined; window.mods=[]; window.addmodule=(module)=>{window.mods=[...window.mods,module]};})();';
  const extsrc = () => initVals.binariesUsed.map(s => { return { "type": "text/javascript", src: `${prefixCB}${s}/main.js` }; });

  let handleScriptInject = ({ scriptTags }) => {
    if (scriptTags) {
      const scriptTag = scriptTags[scriptTags.length - 1];
      scriptTag.onload = () => {
        //@ts-ignore
        if (window.glue) {
          try {
            //@ts-ignore
            const coreGlue = window.glue;
            //@ts-ignore
            if (currentComponent.binariesUsed && window.mods.length === currentComponent.binariesUsed.length) {
              if (typeof SharedArrayBuffer === 'undefined') {
                const dummyMemory = new WebAssembly.Memory({ initial: 0, maximum: 0, shared: true });
                //@ts-ignore
                globalThis.SharedArrayBuffer = dummyMemory.buffer.constructor
              }
              //@ts-ignore
              const liblist = window.mods;


              helpers.asyncMap(liblist, async (correspondingFunction, index, returned) => {
                returned[initVals.binariesUsed[index]] = await correspondingFunction();
              }).then(libpreload => coreGlue({//load component into user code
                libraries: libpreload
              })).then(libsall => setExports(libsall));
            } else {
              return coreGlue({});
            }
          } catch (e) {
            toast.error(e.toString());
          }
        }
      };
    }
  }
  handleScriptInject = handleScriptInject.bind(this);

  return (
    <>
      <div className="left-0 w-1/2 border-black border-solid border h-full overflow-scroll overflow-x-hidden pt-5 fixed">
        <TabsContainer>
          <Tab label="Settings and Libraries">
            <GuiRender scheme={propform} exports={{
              "set": (e, formAccess, additional, mkdialog) => {
                if (additional!.name === "binariesUsed") {
                  if (e!.value.length > initVals.binariesUsed.length) {//greater
                    //add new value
                    const seekVal = e!.value.find(v => !initVals.binariesUsed.includes(v));
                    if (seekVal) {
                      let temp = initVals;
                      temp.binariesUsed.push(seekVal);
                      setInitVals(temp)
                    }
                  } else if (e!.value.length < initVals.binariesUsed.length) {//less
                    const seekVal = initVals.binariesUsed.find(v => !e!.value.includes(v));
                    let temp = initVals;
                    delete temp.binariesUsed[seekVal];
                    setInitVals(temp);
                    //remove removed value
                  } else {//same
                    //scan for changed value
                    const seekVal = e!.value.find(v => !initVals.binariesUsed.includes(v));
                    if (seekVal) {
                      let temp = initVals;
                      temp.binariesUsed.push(seekVal);
                      setInitVals(temp)
                    }
                  }
                }
                initVals[additional!.name] = e!.value;
                setInitVals(initVals);
              }
            }} />
          </Tab>
          <Tab label="Program">
            <ProgEditPanel imports={initVals.binariesUsed} blocks={ifSchema} initVars={varblocks} varSet={setVarblocks} initScripts={scripts} scriptSet={setScripts} />
          </Tab>
          <Tab label="Interface">
            <GuiEditPanel initValues={ifSchema} parentCallback={setifSchema} />
          </Tab>
          <Tab label="Run" onClick={reloadRes}>

          </Tab>
          <Tab label="Save" onClick={downloadResult}>

          </Tab>
        </TabsContainer>
      </div>
      <div className="right-0 w-1/2 border-black border-solid border h-full overflow-scroll overflow-x-hidden pt-5 fixed">
        {resultData ? <div id="helper">
          <Helmet>
            <title itemProp="name" lang="en">{initVals.name}</title>
            <meta name="keywords"
              content={initVals.tags.join(" ")} />
            <meta name="description"
              content={initVals.description} />
          </Helmet>
          {/* Load the myExternalLib.js library. */}
          <iframe title="runnerFrame" seamless sandbox="allow-scripts allow-same-origin">
            <Helmet
              script={[{ "type": "text/javascript", innerHTML: spld }, { "type": "text/javascript", innerHTML: assembleScript() }, ...extsrc()]}
              // Helmet doesn't support `onload` in script objects so we have to hack in our own
              onChangeClientState={(newState, addedTags) => handleScriptInject(addedTags)}
            />
            <div className="border-solid border-2" style={{ borderColor: "rgba(221, 221, 221, 1)", outline: "none" }}>
              <GuiRender scheme={ifSchema} setScheme={setifSchema} exports={exports} />
            </div>
          </iframe>
        </div> : <h1>no data yet, hit "Run"</h1>}
      </div>
    </>
  );
};

export default Editor;