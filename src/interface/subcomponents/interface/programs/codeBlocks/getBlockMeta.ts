import { type } from "../../../../data/interfaces";

interface exportCollection {
  [key: string]: {
    [key: string]: {
      names: string[];
      types: type[];
    };
  };
}
//this is a fake database of all input/outputs of functions as a database replacement
const db: exportCollection = {
  ffmpeg: {
    basicProcess: {
      names: [],
      types: [],
    },
  },
  fileUtils: {
    downloadOne: {
      names: [],
      types: [],
    },
    downloadMany: {
      names: [],
      types: [],
    },
  },
  magick: {
    formatToFormat: {
      names: [],
      types: [],
    },
  },
  threedmc: {},
};

export default db;
