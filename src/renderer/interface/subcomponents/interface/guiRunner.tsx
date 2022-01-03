import * as React from 'react';
import { toast } from 'react-toastify';
import helpers from '../../data/helpers';
import {
  hookCollection,
  IFaceBlock,
  libraryHook,
  utility,
} from '../../data/interfaces';
import GuiRender from './guiRender';


const GuiRunner = (props) => {
  const currentComponent: utility = props.component; // current component data
  const [currentInterface, setCurrentInterface] = React.useState<
    IFaceBlock[] | []
  >(currentComponent.scheme); // current gui scheme

  return (
    <div>
      <div>
        <div id="helper">
          <div
            className="border-solid border-2"
            style={{ borderColor: 'rgba(221, 221, 221, 1)', outline: 'none' }}
          >
            {currentComponent.scheme && exports && (
              <GuiRender
                scheme={currentInterface}
                setScheme={setCurrentInterface}
                exports={exports}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuiRunner;
