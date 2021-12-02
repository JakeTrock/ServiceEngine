import { IFaceBlock } from "../../../data/interfaces";

const toolbox = [
  {
    kind: "CATEGORY",
    contents: [
      {
        kind: "BLOCK",
        blockxml: '<block type="controls_if"></block>',
        type: "controls_if",
      },
      {
        kind: "BLOCK",
        blockxml: '<block type="logic_compare"></block>',
        type: "logic_compare",
      },
      {
        kind: "BLOCK",
        blockxml: '<block type="logic_operation"></block>',
        type: "logic_operation",
      },
      {
        kind: "BLOCK",
        blockxml: '<block type="logic_negate"></block>',
        type: "logic_negate",
      },
      {
        kind: "BLOCK",
        blockxml: '<block type="logic_boolean"></block>',
        type: "logic_boolean",
      },
      {
        kind: "BLOCK",
        blockxml: '<block type="logic_null"></block>',
        type: "logic_null",
      },
      {
        kind: "BLOCK",
        blockxml: '<block type="logic_ternary"></block>',
        type: "logic_ternary",
      },
    ],
    id: "catLogic",
    colour: "210",
    name: "Logic",
  },
  {
    kind: "CATEGORY",
    contents: [
      {
        kind: "BLOCK",
        blockxml:
          '<block type="controls_repeat_ext"> \
<value name="TIMES"> \
  <shadow type="math_number"> \
    <field name="NUM">10</field> \
  </shadow> \
</value> \
</block>',
        type: "controls_repeat_ext",
      },
      {
        kind: "BLOCK",
        blockxml: '<block type="controls_whileUntil"></block>',
        type: "controls_whileUntil",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="controls_for"> \
<value name="FROM"> \
  <shadow type="math_number"> \
    <field name="NUM">1</field> \
  </shadow> \
</value> \
<value name="TO"> \
  <shadow type="math_number"> \
    <field name="NUM">10</field> \
  </shadow> \
</value> \
<value name="BY"> \
  <shadow type="math_number"> \
    <field name="NUM">1</field> \
  </shadow> \
</value> \
</block>',
        type: "controls_for",
      },
      {
        kind: "BLOCK",
        blockxml: '<block type="controls_forEach"></block>',
        type: "controls_forEach",
      },
      {
        kind: "BLOCK",
        blockxml: '<block type="controls_flow_statements"></block>',
        type: "controls_flow_statements",
      },
    ],
    id: "catLoops",
    colour: "120",
    name: "Loops",
  },
  {
    kind: "CATEGORY",
    contents: [
      {
        kind: "BLOCK",
        blockxml: '<block type="math_number"></block>',
        type: "math_number",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="math_arithmetic"> \
<value name="A"> \
  <shadow type="math_number"> \
    <field name="NUM">1</field> \
  </shadow> \
</value> \
<value name="B"> \
  <shadow type="math_number"> \
    <field name="NUM">1</field> \
  </shadow> \
</value> \
</block>',
        type: "math_arithmetic",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="math_single"> \
<value name="NUM"> \
  <shadow type="math_number"> \
    <field name="NUM">9</field> \
  </shadow> \
</value> \
</block>',
        type: "math_single",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="math_trig"> \
<value name="NUM"> \
  <shadow type="math_number"> \
    <field name="NUM">45</field> \
  </shadow> \
</value> \
</block>',
        type: "math_trig",
      },
      {
        kind: "BLOCK",
        blockxml: '<block type="math_constant"></block>',
        type: "math_constant",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="math_number_property"> \
<value name="NUMBER_TO_CHECK"> \
  <shadow type="math_number"> \
    <field name="NUM">0</field> \
  </shadow> \
</value> \
</block>',
        type: "math_number_property",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="math_change"> \
<value name="DELTA"> \
  <shadow type="math_number"> \
    <field name="NUM">1</field> \
  </shadow> \
</value> \
</block>',
        type: "math_change",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="math_round"> \
<value name="NUM"> \
  <shadow type="math_number"> \
    <field name="NUM">3.1</field> \
  </shadow> \
</value> \
</block>',
        type: "math_round",
      },
      {
        kind: "BLOCK",
        blockxml: '<block type="math_on_list"></block>',
        type: "math_on_list",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="math_modulo"> \
<value name="DIVIDEND"> \
  <shadow type="math_number"> \
    <field name="NUM">64</field> \
  </shadow> \
</value> \
<value name="DIVISOR"> \
  <shadow type="math_number"> \
    <field name="NUM">10</field> \
  </shadow> \
</value> \
</block>',
        type: "math_modulo",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="math_constrain"> \
<value name="VALUE"> \
  <shadow type="math_number"> \
    <field name="NUM">50</field> \
  </shadow> \
</value> \
<value name="LOW"> \
  <shadow type="math_number"> \
    <field name="NUM">1</field> \
  </shadow> \
</value> \
<value name="HIGH"> \
  <shadow type="math_number"> \
    <field name="NUM">100</field> \
  </shadow> \
</value> \
</block>',
        type: "math_constrain",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="math_random_int"> \
<value name="FROM"> \
  <shadow type="math_number"> \
    <field name="NUM">1</field> \
  </shadow> \
</value> \
<value name="TO"> \
  <shadow type="math_number"> \
    <field name="NUM">100</field> \
  </shadow> \
</value> \
</block>',
        type: "math_random_int",
      },
      {
        kind: "BLOCK",
        blockxml: '<block type="math_random_float"></block>',
        type: "math_random_float",
      },
    ],
    id: "catMath",
    colour: "230",
    name: "Math",
  },
  {
    kind: "CATEGORY",
    contents: [
      {
        kind: "BLOCK",
        blockxml: '<block type="text"></block>',
        type: "text",
      },
      {
        kind: "BLOCK",
        blockxml: '<block type="text_join"></block>',
        type: "text_join",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="text_append"> \
<value name="TEXT"> \
  <shadow type="text"></shadow> \
</value> \
</block>',
        type: "text_append",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="text_length"> \
<value name="VALUE"> \
  <shadow type="text"> \
    <field name="TEXT">abc</field> \
  </shadow> \
</value> \
</block>',
        type: "text_length",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="text_isEmpty"> \
<value name="VALUE"> \
  <shadow type="text"> \
    <field name="TEXT"></field> \
  </shadow> \
</value> \
</block>',
        type: "text_isEmpty",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="text_indexOf"> \
<value name="VALUE"> \
  <block type="variables_get"> \
    <field name="VAR">text</field> \
  </block> \
</value> \
<value name="FIND"> \
  <shadow type="text"> \
    <field name="TEXT">abc</field> \
  </shadow> \
</value> \
</block>',
        type: "text_indexOf",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="text_charAt"> \
<value name="VALUE"> \
  <block type="variables_get"> \
    <field name="VAR">text</field> \
  </block> \
</value> \
</block>',
        type: "text_charAt",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="text_getSubstring"> \
<value name="STRING"> \
  <block type="variables_get"> \
    <field name="VAR">text</field> \
  </block> \
</value> \
</block>',
        type: "text_getSubstring",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="text_changeCase"> \
<value name="TEXT"> \
  <shadow type="text"> \
    <field name="TEXT">abc</field> \
  </shadow> \
</value> \
</block>',
        type: "text_changeCase",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="text_trim"> \
<value name="TEXT"> \
  <shadow type="text"> \
    <field name="TEXT">abc</field> \
  </shadow> \
</value> \
</block>',
        type: "text_trim",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="text_print"> \
<value name="TEXT"> \
  <shadow type="text"> \
    <field name="TEXT">abc</field> \
  </shadow> \
</value> \
</block>',
        type: "text_print",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="text_prompt_ext"> \
<value name="TEXT"> \
  <shadow type="text"> \
    <field name="TEXT">abc</field> \
  </shadow> \
</value> \
</block>',
        type: "text_prompt_ext",
      },
    ],
    id: "catText",
    colour: "160",
    name: "Text",
  },
  {
    kind: "CATEGORY",
    contents: [
      {
        kind: "BLOCK",
        blockxml:
          '<block type="lists_create_with"> \
<mutation items="0"></mutation> \
</block>',
        type: "lists_create_with",
      },
      {
        kind: "BLOCK",
        blockxml: '<block type="lists_create_with"></block>',
        type: "lists_create_with",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="lists_repeat"> \
<value name="NUM"> \
  <shadow type="math_number"> \
    <field name="NUM">5</field> \
  </shadow> \
</value> \
</block>',
        type: "lists_repeat",
      },
      {
        kind: "BLOCK",
        blockxml: '<block type="lists_length"></block>',
        type: "lists_length",
      },
      {
        kind: "BLOCK",
        blockxml: '<block type="lists_isEmpty"></block>',
        type: "lists_isEmpty",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="lists_indexOf"> \
<value name="VALUE"> \
  <block type="variables_get"> \
    <field name="VAR">list</field> \
  </block> \
</value> \
</block>',
        type: "lists_indexOf",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="lists_getIndex"> \
<value name="VALUE"> \
  <block type="variables_get"> \
    <field name="VAR">list</field> \
  </block> \
</value> \
</block>',
        type: "lists_getIndex",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="lists_setIndex"> \
<value name="LIST"> \
  <block type="variables_get"> \
    <field name="VAR">list</field> \
  </block> \
</value> \
</block>',
        type: "lists_setIndex",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="lists_getSublist"> \
<value name="LIST"> \
  <block type="variables_get"> \
    <field name="VAR">list</field> \
  </block> \
</value> \
</block>',
        type: "lists_getSublist",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="lists_split"> \
<value name="DELIM"> \
  <shadow type="text"> \
    <field name="TEXT">,</field> \
  </shadow> \
</value> \
</block>',
        type: "lists_split",
      },
      {
        kind: "BLOCK",
        blockxml: '<block type="lists_sort"></block>',
        type: "lists_sort",
      },
    ],
    id: "catLists",
    colour: "260",
    name: "Lists",
  },
  {
    kind: "CATEGORY",
    contents: [
      {
        kind: "BLOCK",
        blockxml: '<block type="colour_picker"></block>',
        type: "colour_picker",
      },
      {
        kind: "BLOCK",
        blockxml: '<block type="colour_random"></block>',
        type: "colour_random",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="colour_rgb"> \
<value name="RED"> \
  <shadow type="math_number"> \
    <field name="NUM">100</field> \
  </shadow> \
</value> \
<value name="GREEN"> \
  <shadow type="math_number"> \
    <field name="NUM">50</field> \
  </shadow> \
</value> \
<value name="BLUE"> \
  <shadow type="math_number"> \
    <field name="NUM">0</field> \
  </shadow> \
</value> \
</block>',
        type: "colour_rgb",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="colour_blend"> \
<value name="COLOUR1"> \
  <shadow type="colour_picker"> \
    <field name="COLOUR">#ff0000</field> \
  </shadow> \
</value> \
<value name="COLOUR2"> \
  <shadow type="colour_picker"> \
    <field name="COLOUR">#3333ff</field> \
  </shadow> \
</value> \
<value name="RATIO"> \
  <shadow type="math_number"> \
    <field name="NUM">0.5</field> \
  </shadow> \
</value> \
</block>',
        type: "colour_blend",
      },
    ],
    id: "catColour",
    colour: "20",
    name: "Color",
  },
  {
    kind: "CATEGORY",
    id: "catVariables",
    colour: "330",
    custom: "VARIABLE",
    name: "Variables",
  },
  {
    kind: "CATEGORY",
    id: "catFunctions",
    colour: "290",
    custom: "PROCEDURE",
    name: "Functions",
  },
];

const mkBlocks = (blk: IFaceBlock) => {
  return {
    kind: "BLOCK", //TODO: insert hooks into xml
    blockxml: `<block type="${blk.id + blk.uuid}"></block>`,
    type: "domblock",
  };
};

const genToolbox = (blkNames: IFaceBlock[], funcNames: string[]) => {
  console.log(blkNames, funcNames);
  const nct = toolbox.concat([
    {
      kind: "CATEGORY",
      contents: blkNames.map((b) => mkBlocks(b)) as any,
      id: "catEvGui",
      colour: "220",
      name: "Events and GUI",
    },
    // {
    //   kind: "CATEGORY",
    //   contents: mkBlocks(funcNames, "import_func"),
    //   id: "catImported",
    //   colour: "220",
    //   name: "Imported Functions",
    // },
  ]);
  console.log(nct);
  return {
    contents: nct,
    id: "toolbox",
    style: "display: none",
  };
};

const fallbackTB = {
  contents: toolbox,
  id: "toolbox",
  style: "display: none",
};

export { genToolbox, fallbackTB };
