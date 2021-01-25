import express from 'express';
import logger from 'morgan';
import multer from 'multer';
import __root from 'app-root-path';
import { exec } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import assimp from '../CommIndexes/assimp';
import ffmpeg from '../CommIndexes/ffmpeg';
import imageMagick from '../CommIndexes/imageMagick';
import tar from '../CommIndexes/tar';
import uno from '../CommIndexes/uno';
import { isFtype } from '../helpers';

const router = express.Router();
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, `${__root}/${uuidv4()}/`);// TODO: later we'll change the dirname based on accounts
    },
    // filename(req, file, cb) {
    //     cb(null, uuidv4() + file.originalname.split('.')[1]);
    // },
});
const upload = multer({
    storage,
    limits: {
        // TODO:restrict via account
        files: 5, // allow up to 5 files per request,
        fieldSize: 80 * 1024 * 1024, // 80 MB (max file size)
    },
    fileFilter: (req, file, cb) => {
        if (!isFtype) {
            return cb(new Error('Invalid upload'), false);
        }
        return cb(null, true);
    },
});

/* post command
   sample request:
   {
     [{
      files:["demo.mp4","watermark.png"],
      query:"watermark demo.mp4 with watermark.png"
     },{
      files:[""],
      query:"set a 5 minute timer"
     },]
   }
*/
router.get('/', upload.array('files'), (req, res) => { // TODO:uploading for processing?
    const cml = req.body;
    /* @ts-ignore */
    const fileData = req.files;
    cml.array.forEach((element) => {
        const {
            type, index, files,
        } = element;
        if (type && index
             && typeof type === 'string'
              && typeof index === 'number'
               && index > 0 && lengthIndexes[type] > index
                 && fileData == fileData.reduce((x, y) => (x.includes(y) ? x : [...x, y]), [])) { // check for dupe uploads
            // TODO: figure out blob stream processing
            exec(genCom(element, ''), (err, stdout, stderr) => {
                if (err) {
                    logger.error(`Error when running command: ${err}`);
                    return res.status(500).json({ success: false, message: err.message });
                }
                if (stderr) {
                    logger.error(`Error when running command: ${err}`);
                    return res.status(500).json({ success: false, message: err.message });
                }
                return res.status(200).sendFile();// TODO:file management?
                // TODO: delete working dir after conv is done
            });
        } else {
            res.status(400).json({ success: false, message: 'invalid input' });
        }
    });
});

// logger.error(`Error when running command: ${err}`);
// return res.status(500).json({ success: false, message: err.message });
// return res.status(200).json({ success: true, message: stdout });
export default router;
