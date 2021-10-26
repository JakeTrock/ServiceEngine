import { utility } from "./interfaces";
//fake database, used for testing/mvp
const allutils: utility[] = [
  {
    id: "001",
    name: "video converter",
    file: "001",
    tags: ["video", "converter", "mp4", "wmv", "mpv"],
    description: "Converts a format of video to another format of video.",
    scheme: [
      {
        id: "label",
        uuid: "label1",
        defaults: { visible: true, size: "1em", label: "Input files:" },
      },
      {
        id: "uplButton",
        uuid: "uplButton1",
        defaults: {
          visible: true,
          multiple: true,
          disabled: false,
          size: "1em",
        },
        hooks: { change: { name: "chooser" } },
      },
      {
        id: "label",
        uuid: "label2",
        defaults: { visible: true, size: "1em", label: "Output format" },
      },
      {
        id: "onechoice",
        uuid: "onechoice1",
        defaults: {
          visible: true,
          disabled: false,
          size: "1em",
          labels: "mp4,webm,wmv,mp3,ogg,wav,aac,opus,webp",
        },
        hooks: { change: { name: "dropdown" } },
      },
      {
        id: "button",
        uuid: "button1",
        defaults: {
          visible: true,
          disabled: false,
          size: "1em",
          label: "Convert file(s)",
        },
        hooks: { click: { name: "convert" } },
      },
    ],
    binariesUsed: ["ffmpeg", "fileUtils"],
  },
  {
    id: "003",
    name: "video optimizer",
    file: "003",
    tags: ["video", "converter", "mp4", "wmv", "mpv"],
    description: "Converts a format of video to another format of video.",
    scheme: [
      {
        id: "label",
        uuid: "label1",
        defaults: { visible: true, size: "1em", label: "Input files:" },
      },
      {
        id: "uplButton",
        uuid: "uplButton1",
        defaults: {
          visible: true,
          multiple: true,
          disabled: false,
          size: "1em",
        },
        hooks: { change: { name: "chooser" } },
      },
      {
        id: "label",
        uuid: "label2",
        defaults: { visible: true, size: "1em", label: "Quality rate:" },
      },
      {
        id: "slider",
        defaults: {
          visible: true,
          disabled: false,
          width: "10em",
          value: 28,
          step: 1,
          min: 1,
          max: 40,
        },
        hooks: { change: { name: "setqual" } },
      },
      {
        id: "label",
        uuid: "label3",
        defaults: { visible: true, size: "1em", label: "Encoding speed:" },
      },
      {
        id: "onechoice",
        uuid: "onechoice1",
        defaults: {
          visible: true,
          disabled: false,
          size: "1em",
          labels:
            "ultrafast,superfast,veryfast,faster,fast,medium,slow,slower,veryslow",
        },
        hooks: { change: { name: "dropdown" } },
      },
      {
        id: "label",
        uuid: "label4",
        defaults: { visible: true, size: "1em", label: "Crop to 4x3" },
      },
      {
        id: "onechoice",
        defaults: {
          visible: true,
          disabled: false,
          size: "1em",
          labels: "yes,no",
          required: false,
        },
        hooks: { change: { name: "setfourthree" } },
      },
      {
        id: "button",
        uuid: "button1",
        defaults: {
          visible: true,
          disabled: false,
          size: "1em",
          label: "Run process",
        },
        hooks: { click: { name: "convert" } },
      },
    ],
    binariesUsed: ["ffmpeg", "fileUtils"],
  },
  {
    id: "formtest",
    name: "form component tester",
    file: "formtest",
    tags: ["test"],
    description: "test",
    scheme: [
      {
        id: "label",
        defaults: { visible: true, size: "1em", label: "Explanatory text" },
      },
      {
        id: "button",
        defaults: {
          visible: true,
          disabled: false,
          size: "1em",
          label: "Button",
        },
        hooks: { change: { name: "returnDat" } },
      },
      {
        id: "uplButton",
        defaults: {
          visible: true,
          disabled: false,
          multiple: false,
          size: "1em",
          required: false,
        },
        validate: {
          formats: ["image/jpg", "image/png", "image/gif"],
          maxSize: 4294967296,
        },
        hooks: { change: { name: "returnDat" } },
      },
      {
        id: "textbox",
        defaults: {
          visible: true,
          disabled: false,
          size: "1em",
          value: "default value",
          multirow: false,
          required: false,
        },
        validate: {
          minChars: 0,
          maxChars: 144,
          useBlacklist: true,
          useWhitelist: false,
          wordList: ["badword", "worseword", "terribleword"],
        },
        hooks: { change: { name: "returnDat" } },
      },
      {
        id: "numbox",
        defaults: {
          visible: true,
          disabled: false,
          size: "1em",
          value: 3,
          step: 1,
          min: 0,
          max: 10,
          required: false,
        },
        hooks: { change: { name: "returnDat" } },
      },
      {
        id: "datebox",
        defaults: {
          visible: true,
          disabled: false,
          size: "1em",
          value: "1000-01-01T12:00",
          min: "0001-01-01T00:00",
          max: "2000-01-01T24:00",
          required: false,
        },
        hooks: { change: { name: "returnDat" } },
      },
      {
        id: "onechoice",
        defaults: {
          visible: true,
          disabled: false,
          size: "1em",
          labels: ["apple", "banana", "melon", "berry"],
          required: false,
        },
        hooks: { change: { name: "returnDat" } },
      },
      {
        id: "multchoice",
        defaults: {
          visible: true,
          disabled: false,
          size: "1em",
          label: "topping",
          labels: ["walnuts", "peanuts", "chocolate", "gummy"],
          checked: [false, true, false, true],
        },
        validate: {
          maxSelections: 3,
          exclusiveChoices: [
            ["walnuts", "peanuts"],
            ["chocolate", "gummy"],
          ],
        },
        hooks: { change: { name: "returnDat" } },
      },
      {
        id: "listbuild",
        defaults: {
          visible: true,
          disabled: false,
          size: "1em",
          width: "20em",
          values: ["strawberry", "chocolate", "vanilla", "mint"],
        },
        validate: {
          useBlacklist: true,
          useWhitelist: false,
          wordList: ["badword", "worseword", "terribleword"],
          minChars: 0,
          maxChars: 144,
          maxListLength: 10,
          minListLength: 0,
        },
        hooks: { click: { name: "returnDat" } },
      },
      {
        id: "slider",
        defaults: {
          visible: true,
          disabled: false,
          width: "10em",
          value: 1,
          step: 1,
          min: 0,
          max: 10,
        },
        validate: {
          badRange: [
            [2, 3],
            [7, 9],
          ],
        },
        hooks: { change: { name: "returnDat" } },
      },
      {
        id: "mediabox",
        defaults: {
          visible: true,
          hasVideo: true,
          hasControls: true,
          width: "10em",
          height: "10em",
        },
      },
      {
        id: "canvasbox",
        defaults: { visible: true, width: "10em", height: "10em" },
      },
      { id: "progbar", defaults: { visible: true, value: 50, max: 100 } },
    ],
    binariesUsed: [],
  },
];

export default allutils;
