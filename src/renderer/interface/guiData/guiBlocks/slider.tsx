import React from 'react';
import { toast } from 'react-toastify';
import helpers from '../../data/helpers';

function Slider(props) {
  // can be optimized i reckon
  const { visible, disabled, width, value, min, max, step, required } =
    props.objProps;
  const { badRange } = props.validate || {};
  const hookset = React.useRef(null);
  const validate = (e) => {
    const cval = e.target.value;
    const rangeViolation = badRange
      ? badRange.find((r) => cval > r[0] && cval < r[1])
      : undefined; // TODO:should this be made inclusive?
    if (rangeViolation !== undefined) {
      hookset.current.value = value;
      toast.error(
        `your selection must not be between values ${rangeViolation}`
      );
    }
  };

  // attach hooks to html
  React.useEffect(() => {
    const ohooks = props.objHooks;
    if (ohooks && ohooks !== {}) {
      // if object has hook kvp, loop thru and attach all functions from hooks to html object
      Object.entries(ohooks).forEach(([key, func]) => {
        switch (key) {
          case 'change':
            hookset.current.addEventListener('change', () =>
              (func as Function)({
                value: hookset.current!.value,
              })
            );
            break;
          case 'clickIn':
            hookset.current.addEventListener('click', (e) => {
              e.preventDefault();
              const bcr = hookset.current!.getBoundingClientRect();
              const x = e.pageX - bcr.right;
              const y = e.pageY - bcr.top;
              return (func as Function)({
                x,
                y,
                value: hookset.current!.value,
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
                value: hookset.current!.value,
              });
            });
            break;
          case 'clickOut':
            hookset.current.addEventListener('blur', (e) => {
              e.preventDefault();
              const bcr = hookset.current!.getBoundingClientRect();
              const x = e.pageX - bcr.right;
              const y = e.pageY - bcr.top;
              return (func as Function)({
                x,
                y,
                value: hookset.current!.value,
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
                value: hookset.current!.value,
              });
            });
            break;
          case 'mouseOut':
            hookset.current.addEventListener('mouseout', (e) => {
              e.preventDefault();
              const bcr = hookset.current!.getBoundingClientRect();
              const x = e.pageX - bcr.right;
              const y = e.pageY - bcr.top;
              return (func as Function)({
                x,
                y,
                value: hookset.current!.value,
              });
            });
            break;
          case 'load':
            (func as Function)({ value });
            break;
          case 'keyPressed':
            hookset.current.addEventListener('click', (e) => {
              e.preventDefault();
              return (func as Function)({
                key: e.keyCode,
                shift: e.shiftKey,
                value: hookset.current!.value,
              });
            });
            break;
          case 'scroll':
            hookset.current.addEventListener('wheel', (e) => {
              e.preventDefault();
              const x = e.deltaX;
              const y = e.deltaY;
              return (func as Function)({
                x,
                y,
                value: hookset.current!.value,
              });
            });
            break;
          default:
            toast('invalid event type');
        }
      });
    }
  }, []);
  const id = props.uuid;

  return (
    <div style={{ display: 'flex' }}>
      <input
        type="range"
        id={id}
        disabled={disabled}
        required={required}
        ref={hookset}
        style={{ visibility: helpers.toggleVis(visible), width }}
        min={min}
        max={max}
        step={step}
        defaultValue={value}
        onChange={(e) => {
          validate(e);
          // @ts-ignore
          e.currentTarget.parentNode.childNodes.item(1).innerHTML =
            e.target.value;
        }}
      />
      <p>{value}</p>
    </div>
  );
}

export default Slider;
