// import * as React from "react";
// import './data/styles.css';

// const NotFoundPage = () => {
//   return (
//     <>
//       <title>Not found</title>
//       <h1>Page not found</h1>
//       <a href="/">Go home</a>
//     </>
//   );
// };

// export default NotFoundPage;


import React from "react";
import './data/styles.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TabsContainer from "./subcomponents/organizers/tabsContainer";
import Tab from "./subcomponents/organizers/tab";

import { exportCollection, IFaceBlock } from "./data/interfaces";
import './subcomponents/interface/guiData/interfaceScriptToolbox';
import { BlocklyWorkspace } from 'react-blockly';
import Blockly from "blockly";
import { genToolbox } from "./subcomponents/interface/guiData/interfaceScriptToolbox";
import GuiEditPanel from "./subcomponents/interface/guiEditor";
import GuiRender from "./subcomponents/interface/guiRender";
import eventTypes from "./subcomponents/interface/guiData/eventTypes";

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

  function genScript(workspace) {
    const code = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace));
    console.log(code)
    //@ts-ignore
    console.log(Blockly.JavaScript.workspaceToCode(workspace))
    setScripts(code);
  }

  // const propform: IFaceBlock[] = [
  //   { "id": "label", "defaults": { "visible": true, "size": "1em", "label": "Title:" }, "uuid": "fd117200-5bd0-4f4f-aae6-5c475f050fb7" },
  //   { "id": "textbox", "defaults": { "visible": true, "disabled": false, "size": "1em", "multirow": false, "value": initVals.title }, hooks: { "change": "title" }, "uuid": "5dab4339-5b5f-4d98-8c65-8daa8cd37391" },
  //   { "id": "label", "defaults": { "visible": true, "size": "1em", "label": "Tags:" }, "uuid": "11dd756a-4453-43e6-aff4-c4dccf0be38d" },
  //   { "id": "listbuild", "defaults": { "visible": true, "disabled": false, "size": "1em", "width": "20em", "values": initVals.tags }, hooks: { "change": "tags" }, "uuid": "8ddf0ef0-c88a-4af0-a51e-eacf1c05c06e" },
  //   { "id": "label", "defaults": { "visible": true, "size": "1em", "label": "Description:" }, "uuid": "75fb57df-7379-4d32-a5a3-d030db8d88ef" },
  //   { "id": "textbox", "defaults": { "visible": true, "disabled": false, "size": "1em", "multirow": true, "value": initVals.description }, hooks: { "change": "description" }, "uuid": "a77429da-9fec-4457-9e3f-725a84b081d4" },
  //   { "id": "label", "defaults": { "visible": true, "size": "1em", "label": "License" }, "uuid": "81740e0e-3876-4154-8237-ebae073b37fb" },
  //   { "id": "onechoice", "defaults": { "visible": true, "disabled": false, "size": "1em", "labels": licenses.join(","), "value": initVals.license }, hooks: { "change": "license" }, "uuid": "bacb493f-7e74-4883-9a71-862d312e8ddc" }
  // ];


  return (
    <>
      <TabsContainer>
        <Tab label="Settings and Libraries">
          {/* TODO:implement */}
          {/* <GuiRender schema={propform} controllerFunctions={(evtname, e) => {
            initVals[evtname] = e.target.value
            setInitVals(initVals);
          }} />
          <AddLib schema={initVals} setSchema={setInitVals} /> */}
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
        <Tab label="Test">
          {/* TODO:implement */}
        </Tab>
      </TabsContainer>
    </>
  );
};

export default Editor;