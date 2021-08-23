import React from "react";
import '../data/splitpanel.css';
import { ReactSortable } from "react-sortablejs";
import { v4 as uuidv4 } from 'uuid';

import { IFaceBlock } from "../data/interfaces";
import compDict from "../data/compDict";
//TODO:add colorpicker
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

function GuiEditPanel(props) {
  const [ifOrder, setifOrder] = React.useState<IFaceBlock[]>([]);
  const [selection, setSelection] = React.useState<IFaceBlock>();

  React.useEffect(() => {
    let iv = props.initValues;
    if (iv && iv.length > 0) {
      setifOrder(iv);
      setSelection(ifOrder[0]);
    }
  }, []);

  const parentCallback = (e) => props.parentCallback(e);

  const setIf = (ifo) => {
    ifo = ifo.filter(i => i !== undefined);
    setifOrder(ifo);
    parentCallback(ifo);
  };

  return (
    <div className="parentDiv">
      <div className="split left">
        <ReactSortable
          animation={200}
          group={{
            name: "shared",
            pull: true,
            put: false,
            revertClone: true
          }}
          list={compList}
          setList={() => { }}
        >
          {compList.map((item, i) => (
            <>
              <div key={`${i}-${item.id}`} id={`${i}-${item.id}`} style={{ width: "100%", backgroundColor: "white", border: "1px solid black" }}>
                {React.createElement(compDict[item.id], { key: i, id: item.id, objProps: item.defaults })}
              </div><br />
            </>
          )
          )}
        </ReactSortable>
      </div>

      <div className="split center">
        <ReactSortable
          id="holder"
          style={{ width: "100%", height: "100%", backgroundColor: "rgb(168, 168, 168)" }}
          group={{
            name: "shared",
            pull: false,
            put: true
          }}
          list={ifOrder}
          setList={() => { }}
          removeOnSpill={true}
          onAdd={(e) => {
            //workaround deep copy
            //@ts-ignore
            const idv = e.item.id.split("-")[1];
            if (idv) {
              const target = JSON.parse(JSON.stringify(compList.filter((i) => i.id === idv)[0]));
              target.uuid = `${idv}-${uuidv4()}`;
              console.log(target)
              if (target.hasOwnProperty("disabled")) {
                target.disabled = false;
              }
              ifOrder.splice(e.newIndex, 0, target);
              setIf(ifOrder);
              setSelection(target);
            }
          }}
          onUpdate={(e) => {
            let ifodupe = ifOrder;
            ifodupe.splice(e.newIndex, 0, ifodupe.splice(e.oldIndex, 1)[0]);
            setIf(ifodupe);
          }}
        >
          {ifOrder.map((item, i) => (
            <div style={selection === item ? { width: "100%", border: "1px solid lightgreen" } : { width: "100%" }} onClick={() => setSelection(item)}>
              {React.createElement(compDict[item.id], { key: i, uuid: item.uuid, objProps: item.defaults })}
              <br />
            </div>
          ))}
        </ReactSortable>
      </div>

      <div className="split right">
        {selection !== undefined && selection.defaults && Object.keys(selection.defaults).map((key, i) => (
          <div key={i} style={{ paddingLeft: "1em" }}><p>{key}</p><input type="text" value={selection.defaults[key]} onChange={(e) => {
            selection.defaults[key] = e.target.value
            setIf(ifOrder.map((i) => {
              if (i.uuid === selection.uuid) {
                return selection;
              }
              return i;
            }));
          }} /></div>
        ))}
      </div>
    </div >
  );
}

export default GuiEditPanel;