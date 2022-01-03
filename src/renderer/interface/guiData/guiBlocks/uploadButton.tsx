import React from 'react';
import { toast } from 'react-toastify';
import helpers from '../../data/helpers';

function UploadButtonBlock(props) {
  // TODO:make this a drag and drop
  const {
    visible,
    disabled,
    size,
    label,
    required,
    properties,
    filters,
    maxsize,
  } = props.objProps;
  const hookset = React.useRef(null);
  const [paths, setPaths] = React.useState<string[]>([]);

  const validateFiles = (e) => {
    const files = [...e.target.files];
    // if (maxsize && files.find((f: File) => f.size > maxsize)) {
    //   hookset.current.value = '';
    //   toast.error('File is too big!');
    // }//TODO: make appside calculator for filesize
  };

  const fileDialog = () => {
    window.electron.ipcRenderer.fileDialog({
      properties: properties || [
        'openFile',
        'openDirectory',
        'multiSelections',
        'showHiddenFiles',
      ],
      filters: filters || [{ name: 'All Files', extensions: ['*'] }],
      maxsize: maxsize || 0, //0 is infinity
    });
    window.electron.ipcRenderer.once('fileDialog', (arg) => {
      // eslint-disable-next-line no-console
      setPaths(arg);
    });
  };

  React.useEffect(() => {
    const ohooks = props.objHooks;
    if (ohooks && Object.getOwnPropertyNames(ohooks).includes('change')) {
      return (ohooks.change as Function)(paths);
    }
  }, [paths, props.objHooks]);

  React.useEffect(() => {
    const ohooks = props.objHooks;
    if (ohooks && ohooks !== {}) {
      // if object has hook kvp, loop thru and attach all functions from hooks to html object
      Object.entries(ohooks).forEach(([key, func]) => {
        switch (key) {
          case 'change':
            break;
          case 'clickIn':
            hookset.current.addEventListener('click', () =>
              (func as Function)({ value: [...hookset.current!.files] })
            );
            break;
          case 'doubleClickIn':
            hookset.current.addEventListener('dblclick', () =>
              (func as Function)({ value: [...hookset.current!.files] })
            );
            break;
          case 'mouseIn':
            hookset.current.addEventListener('mouseover', () =>
              (func as Function)({ value: [...hookset.current!.files] })
            );
            break;
          case 'mouseOut':
            hookset.current.addEventListener('mouseout', () =>
              (func as Function)({ value: [...hookset.current!.files] })
            );
            break;
          case 'load':
            (func as Function)({ value: [...hookset.current!.files] });
            break;
          default:
            toast('invalid event type');
        }
      });
    }
  }, []);
  const id = props.uuid;

  return (
    <button
      id={id}
      type="button"
      ref={hookset}
      disabled={disabled}
      style={{
        visibility: helpers.toggleVis(visible),
        fontSize: size || '1em',
      }}
      onClick={fileDialog}
    >
      {label}
    </button>
  );
}

export default UploadButtonBlock;
