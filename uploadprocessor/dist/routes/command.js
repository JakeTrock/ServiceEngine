"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const multer_1 = __importDefault(require("multer"));
const app_root_path_1 = __importDefault(require("app-root-path"));
const child_process_1 = require("child_process");
const uuid_1 = require("uuid");
const assimp_1 = __importDefault(require("../CommIndexes/assimp"));
const ffmpeg_1 = __importDefault(require("../CommIndexes/ffmpeg"));
const imageMagick_1 = __importDefault(require("../CommIndexes/imageMagick"));
const tar_1 = __importDefault(require("../CommIndexes/tar"));
const uno_1 = __importDefault(require("../CommIndexes/uno"));
const helpers_1 = require("../helpers");
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination(req, file, cb) {
        cb(null, `${app_root_path_1.default}/${uuid_1.v4()}/`); // TODO: later we'll change the dirname based on accounts
    },
    filename(req, file, cb) {
        cb(null, uuid_1.v4() + file.originalname.split('.')[1]);
    },
});
const upload = multer_1.default({
    storage,
    limits: {
        // TODO:restrict via account
        files: 5,
        fieldSize: 2 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (!helpers_1.isFtype) {
            return cb(new Error('Invalid upload'), false);
        }
        return cb(null, true);
    },
});
const lengthIndexes = {
    assimp: assimp_1.default.length,
    ffmpeg: ffmpeg_1.default.length,
    imageMagick: imageMagick_1.default.length,
    tar: tar_1.default.length,
    uno: uno_1.default.length,
};
const funcIndex = {
    assimp: assimp_1.default,
    ffmpeg: ffmpeg_1.default,
    imageMagick: imageMagick_1.default,
    tar: tar_1.default,
    uno: uno_1.default,
};
const genCom = (element, acc) => {
    if (element.pipe) {
        genCom(element.pipe, `${acc} | ${funcIndex[element.type][element.index](...element.params)}`);
    }
    if (acc != '') {
        return `${acc} | ${funcIndex[element.type][element.index](...element.params)}`;
    }
    return `${funcIndex[element.type][element.index](...element.params)}`; // TODO:remove file input when piping
};
/* post command
   sample request:
   {
     [{
      "files":["teg.mp4", "s.png"],
      "type":"ffmpeg",
      "index":3,
      "params":["",""],
      "pipe":{
        "type":"tar",
        "params":["",""],
        "index":4
      }
     },]
   }
*/
router.get('/', upload.array('files'), (req, res) => {
    const cml = req.body;
    /* @ts-ignore */
    const fileData = req.files;
    cml.array.forEach((element) => {
        const { type, index, files, } = element;
        if (type && index && typeof type === 'string' && typeof index === 'number' && index > 0 && lengthIndexes[type] > index && files.some((e) => fileData.indexOf(e) > -1)) {
            // TODO: figure out blob stream processing
            child_process_1.exec(genCom(element, ''), (err, stdout, stderr) => {
                if (err) {
                    morgan_1.default.error(`Error when running command: ${err}`);
                    return res.status(500).json({ success: false, message: err.message });
                }
                if (stderr) {
                    morgan_1.default.error(`Error when running command: ${err}`);
                    return res.status(500).json({ success: false, message: err.message });
                }
                return res.status(200).sendFile(); // TODO:file management?
            });
        }
        else {
            res.status(400).json({ success: false, message: 'invalid input' });
        }
    });
});
// logger.error(`Error when running command: ${err}`);
// return res.status(500).json({ success: false, message: err.message });
// return res.status(200).json({ success: true, message: stdout });
exports.default = router;
//# sourceMappingURL=command.js.map