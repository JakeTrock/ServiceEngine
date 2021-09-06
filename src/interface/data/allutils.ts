import { utility } from "./interfaces";

const allutils: utility[] = [
  {
    id: "001",
    name: "youtube downloader",
    tags: ["youtube", "video", "audio", "download", "online", "free"],
    description:
      "Downloads a video from youtube as a requested format(mp4 or mp3)",
    scheme: [],
    binariesUsed: [],
  },
  {
    id: "002",
    name: "3d model converter",
    tags: ["3d model", "3d printing", "converter", "online"],
    description:
      "Converts models from format to format. Please open utility for a list of supported formats.",
    scheme: [],
    binariesUsed: [],
  },
  {
    id: "003",
    name: "video cutter",
    tags: ["video", "trimmer", "cutter", "online", "mp4"],
    description:
      "Trims a video to points between two times and outputs it in the input format.",
    scheme: [],
    binariesUsed: [],
  },
];

export default allutils;
