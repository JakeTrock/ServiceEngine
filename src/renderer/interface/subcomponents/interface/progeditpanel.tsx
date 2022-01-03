import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IFaceBlock } from '../../data/interfaces';
import { compDict, compDefaults } from '../../guiData/compDict';
import '../../data/ctxmenu.css';
import { toast } from 'react-toastify';
import KvpBuilder from '../../guiData/guiBlocks/kvpBuilder';

// const findEvts = (blks) => {
//   const allHookAps = [];

//   const hksOfBlock = (blk, legacies = '') => {
//     if (blk.childNodesPossible) {
//       Object.getOwnPropertyNames(blk.childNodesPossible).forEach((name) => {
//         hksOfBlock(
//           legacies + ',' + blk.childNodesPossible[name].uuid,
//           blk.childNodesPossible[name]
//         );
//       });
//     }
//     allHookAps.push(legacies + ',' + blk.childNodesPossible.uuid); // TODO:enforce uuid!!! create a seperate type!!!
//   };

//   return allHookAps;
// };

function ProgEditPanel(props) {
  // TODO: this may not work properly/lack featurez
  return <>TODO: implement a form(or blockly)-style builder here</>;
}

export default ProgEditPanel;
