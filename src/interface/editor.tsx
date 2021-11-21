import React from "react";
import './data/styles.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TabsContainer from "./subcomponents/organizers/tabsContainer";
import Tab from "./subcomponents/organizers/tab";
import "./data/splitpanel.css"
import { exportCollection, IFaceBlock, utility } from "./data/interfaces";
import './subcomponents/interface/guiData/interfaceScriptToolbox';
import { BlocklyWorkspace } from 'react-blockly';
import Blockly from "blockly";
import { genToolbox } from "./subcomponents/interface/guiData/interfaceScriptToolbox";
import fileUtils from "./subcomponents/interface/programs/codeBlocks/fileUtils"
import GuiEditPanel from "./subcomponents/interface/guiEditor";
import eventTypes from "./subcomponents/interface/guiData/eventTypes";
import GuiRunner from "./subcomponents/interface/guiRunner";
import GuiRender from "./subcomponents/interface/guiRender";
import { v4 as uuidv4 } from 'uuid';

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

//TODO: allow user to test their app in the builder

//all sengine functions

// markup
const Editor = (props) => {
  const { match, location, history } = props;
  const [scripts, setScripts] = React.useState<string>('<xml xmlns="http://www.w3.org/1999/xhtml"></xml>');
  //stores all GUI details of the utility being worked on
  const [ifSchema, setifSchema] = React.useState<IFaceBlock[]>([]);
  const [exports, setExports] = React.useState<exportCollection>({});
  const [initVals, setInitVals] = React.useState<utility>({
    id: uuidv4(),
    name: "",
    file: "",
    tags: [],
    description: "",
    binariesUsed: Object.getOwnPropertyNames(exports),
    scheme: ifSchema
  });
  const [libraries, setLibraries] = React.useState<string[]>([]);

  React.useEffect(() => {
    const allevts = (() => {
      return eventTypes.map((e) => [e, e]);
    })();

    ifSchema.forEach((e) => {
      //TODO: also make blocks which allow certain defaults props to be changed
      Blockly.Blocks[e.uuid] = {
        init: function () {
          this.appendDummyInput().appendField(e.uuid);
          this.setOutput(true, null);
          this.setColour(230);
          this.setTooltip("");
          this.setHelpUrl("");
        },
      };
      //@ts-ignore
      Blockly.JavaScript[e.uuid] = function (block) {
        //@ts-ignore
        return [e.uuid, Blockly.JavaScript.ORDER_NONE];
      };
    });

    Blockly.Blocks["eventtrigger"] = {
      init: function () {
        this.appendDummyInput().appendField("Event Trigger");
        this.appendValueInput("performedon").setCheck("domobject");
        this.appendDummyInput().appendField(
          new Blockly.FieldDropdown(allevts),
          "trigger"
        );
        this.appendValueInput("result").setCheck("function");
        this.setColour(315);
        this.setTooltip("runs a function when a hook is triggered");
        this.setHelpUrl("");
      },
    };
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

  const handleErr = (e) => toast.error(e.toString());

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
                initVals[additional!.name] = e!.value;
                console.log(initVals)
                setInitVals(initVals);
              }
            }} />
            {/* <AddLib schema={initVals} setSchema={setInitVals} /> */}
          </Tab>
          <Tab label="Program">
            {scripts && <BlocklyWorkspace
              toolboxConfiguration={genToolbox(
                ifSchema.map((iface) => iface.uuid),
                Object.getOwnPropertyNames(exports)
              )}
              initialXml={scripts}
              className="fill-height"
              workspaceConfiguration={blocklywsconfig}
              onWorkspaceChange={genScript}
            />}
          </Tab>
          <Tab label="Interface">
            <GuiEditPanel initValues={ifSchema} parentCallback={(e) => { console.log(JSON.stringify(e)); setifSchema(e) }} />
          </Tab>
          <Tab label="Save" onClick={downloadResult}>

          </Tab>
        </TabsContainer>
      </div>
      <div className="split rightHnH">
        <GuiRunner component={{
          id: "001",
          name: "video converter",
          file: "001",
          tags: ["video", "converter", "mp4", "wmv", "mpv"],
          description: "Converts a format of video to another format of video.",
          scheme: ifSchema
        }} />
      </div>
    </>
  );
};

export default Editor;