import React from "react";
import './data/styles.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TabsContainer from "./subcomponents/organizers/tabsContainer";
import Tab from "./subcomponents/organizers/tab";
import "./data/splitpanel.css"
import { exportCollection, IFaceBlock, libraryHook, utility } from "./data/interfaces";
import './subcomponents/interface/guiData/interfaceScriptToolbox';
import { BlocklyWorkspace } from 'react-blockly';
import Blockly from "blockly";
import { genToolbox } from "./subcomponents/interface/guiData/interfaceScriptToolbox";
import fileUtils from "./subcomponents/interface/programs/codeBlocks/fileUtils"
import GuiEditPanel from "./subcomponents/interface/guiEditor";
import GuiRunner from "./subcomponents/interface/guiRunner";
import GuiRender from "./subcomponents/interface/guiRender";
import { v4 as uuidv4 } from 'uuid';
import helpers from "./data/helpers";
import getBlockMeta from "./subcomponents/interface/programs/codeBlocks/getBlockMeta";
import { hookDict } from "./subcomponents/interface/guiData/compDict";

const getAllLibNames = () => {
  //this is a shim placeholder, replace when an established server with a text spine for libraries is implemented
  return [
    "ffmpeg",
    "fileUtils",
    "magick",
    "threedmc"
  ]
}

const prefixCB = "./subcomponents/interface/programs/codeBlocks/";

const blocklywsconfig = {
  collapse: true,
  comments: true,
  disable: true,
  maxBlocks: Infinity,
  trashcan: true,
  horizontalLayout: false,
  toolboxPosition: 'start',
  css: true,
  media: 'https://blockly-demo.appspot.com/static/media/',
  rtl: false,
  scrollbars: true,
  sounds: true,
  oneBasedIndex: true,
  grid: {
    spacing: 20,
    length: 1,
    colour: '#888',
    snap: false
  },
  zoom: {
    controls: true,
    wheel: true,
    startScale: 1,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.2
  }
};

const glueMetaFetch = (name: string) => {
  //this is a fake to get all input/outputs of functions as a database replacement
  return getBlockMeta[name];
};

const updateExport = (newcomer: string) =>
  //updates export linkages whenever you add a new lib to initvals
  newcomer !== undefined && import(`${prefixCB}${newcomer}`)
    .then(l => [l].map(v => () => (v as libraryHook).default()))//stage init of all functions
    .then(l => (l[0] as unknown as Function)())//init all functions
    .then((l) => {
      const gmf = glueMetaFetch(newcomer);
      let newKV = {};
      newKV[newcomer] = {};
      Object.getOwnPropertyNames(l).forEach((name) => {
        const { names, types } = gmf[name];
        newKV[newcomer][name] = {
          function: l[name],
          names,
          types
        }
      });
      console.log(newKV)
      return newKV;
    });

//all sengine functions

// markup
const Editor = (props) => {
  const { match, location, history } = props;
  const [scripts, setScripts] = React.useState<string>('<xml xmlns="http://www.w3.org/1999/xhtml"></xml>');
  //stores all GUI details of the utility being worked on
  const [ifSchema, setifSchema] = React.useState<IFaceBlock[]>([]);
  const [resultData, setResultData] = React.useState<utility & { scheme: IFaceBlock[]; }>();
  const [initVals, setInitVals] = React.useState<utility>({
    id: uuidv4(),
    name: "",
    file: "",
    tags: [],
    description: "",
    binariesUsed: [],
    scheme: ifSchema
  });
  const [exports, setExports] = React.useState<exportCollection>((() => {
    const pv = {};
    initVals.binariesUsed.forEach((v) => {
      pv[v] = updateExport(v);
    });
    return pv;
  })());



  React.useEffect(() => {
    ifSchema.forEach((e) => {
      //TODO: also make blocks which allow certain defaults props to be changed
      Blockly.Blocks[e.id+e.uuid] = {
        init: function () {
          this.appendDummyInput().appendField(e.id+e.uuid);
          this.setColour(230);
          hookDict[e.id].forEach(hk=>{
            this.appendValueInput(hk).setCheck("function");
          });
          this.setTooltip("runs a function when a hook is triggered");
          this.setHelpUrl("");
        },
      };
      //@ts-ignore
      Blockly.JavaScript[e.id+e.uuid] = function (block) {
        //@ts-ignore
        return [e.id+e.uuid, Blockly.JavaScript.ORDER_NONE];
      };
    });

  }, [ifSchema]);

  React.useEffect(() => {
    Object.getOwnPropertyNames(exports).forEach((e) => {
      //TODO: also make blocks which allow certain defaults props to be changed
      Blockly.Blocks[e] = {
        init: function () {
          this.appendDummyInput().appendField(e);
          exports[e].names.forEach(n => {
            this.appendValueInput(n).setCheck("String");//TODO: typecheck
          });
          this.setOutput(true, null);
          this.setColour(230);
          this.setTooltip("");
          this.setHelpUrl("");
        },
      };
      //@ts-ignore
      Blockly.JavaScript[e] = function (block) {
        //@ts-ignore
        const inputs = exports[e].names.map(n => Blockly.JavaScript.valueToCode(
          block,
          n,
          //@ts-ignore
          Blockly.JavaScript.ORDER_NONE
        ));

        return `${e}(${inputs.join(",")})`;
      };
    });
  }, [exports]);

  const reloadRes = () => {//TODO: optimal insertion location for validation
    setResultData(Object.assign({}, initVals, { scheme: ifSchema }));
  };

  const downloadResult = async () => (await fileUtils()).downloadOne(new File([JSON.stringify(ifSchema)], "interface.txt"))

  function genScript(workspace) {
    const code = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace));
    console.log(code)
    //@ts-ignore
    console.log(Blockly.JavaScript.workspaceToCode(workspace))
    setScripts(code);
  }

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


  return (
    <>
      <div className="split leftHnH">
        <TabsContainer>
          <Tab label="Settings and Libraries">
            <GuiRender scheme={propform} exports={{
              "set": (e, formAccess, additional, mkdialog) => {
                if (additional!.name === "binariesUsed") {
                  if (e!.value.length > initVals.binariesUsed.length) {//greater
                    //add new value
                    const seekVal = e!.value.find(v => !initVals.binariesUsed.includes(v));
                    if (seekVal) updateExport(seekVal).then(v => setExports(Object.assign({}, exports, v)));
                  } else if (e!.value.length < initVals.binariesUsed.length) {//less
                    const seekVal = initVals.binariesUsed.find(v => !e!.value.includes(v));
                    delete exports[seekVal];
                    setExports(exports);
                    //remove removed value
                  } else {//same
                    //scan for changed value
                    const seekVal = e!.value.find(v => !initVals.binariesUsed.includes(v));
                    if (seekVal) updateExport(seekVal).then(v => setExports(Object.assign({}, exports, v)));
                  }
                }
                initVals[additional!.name] = e!.value;
                setInitVals(initVals);
              }
            }} />
          </Tab>
          <Tab label="Program">
            {scripts && <BlocklyWorkspace
              toolboxConfiguration={genToolbox(
                ifSchema,
                initVals.binariesUsed
              )}
              initialXml={scripts}
              className="fill-height"
              workspaceConfiguration={blocklywsconfig}
              onWorkspaceChange={genScript}
            />}
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
      <div className="split rightHnH">
        {resultData ? <div id="serviceContainer">
          <GuiRender scheme={ifSchema} setScheme={setifSchema} exports={exports} />
        </div> : <h1>no data yet, hit "Run"</h1>}
      </div>
    </>
  );
};

export default Editor;