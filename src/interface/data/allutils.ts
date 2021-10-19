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
        defaults: { visible: true, disabled: false, size: "1em" },
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
  // {
  //   id: "002",
  //   name: "3d model converter",
  //   tags: ["3d model", "3d printing", "converter", "online"],
  //   description:
  //     "Converts models from format to format. Please open utility for a list of supported formats.",
  //   scheme: [],
  //   binariesUsed: ["threedmc"],
  // },
  // {
  //   id: "003",
  //   name: "video cutter",
  //   tags: ["video", "trimmer", "cutter", "online", "mp4"],
  //   description:
  //     "Trims a video to points between two times and outputs it in the input format.",
  //   scheme: [],
  //   binariesUsed: ["ffmpeg"],
  // },
];

export default allutils;
