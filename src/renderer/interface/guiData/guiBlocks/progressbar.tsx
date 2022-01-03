import React from 'react';
import { toast } from 'react-toastify';
import helpers from '../../data/helpers';

function ProgressBar(props) {
  const { visible, value, max } = props.objProps;
  const hookset = React.useRef(null);

  // attach hooks to html
  React.useEffect(() => {
    const ohooks = props.objHooks;
    if (ohooks && ohooks !== {}) {
      // if object has hook kvp, loop thru and attach all functions from hooks to html object
      Object.entries(ohooks).forEach(([key, func]) => {
        switch (key) {
          case 'clickIn':
            hookset.current.addEventListener('click', (e) => {
              e.preventDefault();
              const bcr = hookset.current!.getBoundingClientRect();
              const x = e.pageX - bcr.right;
              const y = e.pageY - bcr.top;
              return (func as Function)({
                x,
                y,
                value,
              });
            });
            break;
          case 'doubleClickIn':
            hookset.current.addEventListener('dblclick', (e) => {
              e.preventDefault();
              const bcr = hookset.current!.getBoundingClientRect();
              const x = e.pageX - bcr.right;
              const y = e.pageY - bcr.top;
              return (func as Function)({
                x,
                y,
                value,
              });
            });
            break;
          case 'mouseIn':
            hookset.current.addEventListener('mouseover', (e) => {
              e.preventDefault();
              const bcr = hookset.current!.getBoundingClientRect();
              const x = e.pageX - bcr.right;
              const y = e.pageY - bcr.top;
              return (func as Function)({
                x,
                y,
                value,
              });
            });
            break;
          case 'load':
            (func as Function)({ value });
            break;
          default:
            toast('invalid event type');
        }
      });
    }
  }, []);
  const id = props.uuid;

  return (
    <progress
      id={id}
      ref={hookset}
      style={{ visibility: helpers.toggleVis(visible) }}
      value={value}
      max={max}
    />
  );
}

export default ProgressBar;
