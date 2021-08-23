// @ts-nocheck
import Blockly from "blockly";
import "blockly/javascript";

//https://blockly-demo.appspot.com/static/demos/blockfactory/index.html

Blockly.JavaScript["eventtrigger"] = function (block) {
  const value_trigger = block.getFieldValue("trigger");
  console.log(value_trigger);
  const value_result = Blockly.JavaScript.valueToCode(
    block,
    "result",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const perfon = Blockly.JavaScript.valueToCode(
    block,
    "performedon",
    Blockly.JavaScript.ORDER_NONE
  );

  var code = `${
    perfon === "document"
      ? "document"
      : `document.getElementById("${perfon}")`
  }.addEventListener("${value_trigger}", (e)=>${value_result});`;
  return code;
};

Blockly.Blocks["document"] = {
  init: function () {
    this.appendDummyInput().appendField("document");
    this.setOutput(true, null);
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.JavaScript["document"] = function (block) {
  return ["document", Blockly.JavaScript.ORDER_NONE];
};
//================================
