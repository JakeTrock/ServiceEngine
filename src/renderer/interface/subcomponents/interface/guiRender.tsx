import React, { Fragment } from 'react';
import { toast } from 'react-toastify';
import { IFaceBlock } from '../../data/interfaces';
import { compDict, compDefaults } from '../../guiData/compDict';
import FailComponent from '../../guiData/guiBlocks/failComponent';

const processHooks = (schema, makeEvent) => {
  return schema.map((prp) => {
    if (
      prp.defaults &&
      prp.defaults.childNodes &&
      prp.defaults.childNodes !== []
    ) {
      if (prp.defaults.childNodes[0].length)
        prp.defaults.childNodes.map((n) => processHooks(n, makeEvent));
      else
        prp.defaults.childNodes = processHooks(
          prp.defaults.childNodes,
          makeEvent
        );
    }
    if (prp.hooks && prp.hooks !== {}) {
      Object.getOwnPropertyNames(prp.hooks).forEach((key) => {
        if (prp.hooks[key].name && prp.hooks[key].name !== 'evfunction') {
          prp.hooks[key] = makeEvent(prp.hooks[key], prp.uuid);
        }
      });
    }
    return prp;
  });
};

export default function GuiRender(props) {
  const currentInterface = props.scheme;
  const setCurrentInterface = props.setScheme;
  // function which attaches the event function from the imported function based on the name string provided
  const makeEvent = (evv, uuid) => {
    const evfunction = (e) =>
      props.exports![evv.name](//TODO:alter to run command on container
        e,
        formAccess,
        { ...(evv.additional || {}), id: uuid },
        toast
      );
    return evfunction;
  };

  // function which allows the form to be manipulated from the program which it runs.
  const formAccess = (
    action: 'get' | 'set' | 'add' | 'del',
    key: string | number,
    kvpset
  ) => {
    console.log(action, key, kvpset);
    if (action && currentInterface.length) {
      switch (action) {
        case 'del':
          if (key) {
            // delete form element, provide a uuid in the key slot and any match will be deleted
            if (
              key &&
              (typeof key !== 'number' ||
                key > currentInterface.length ||
                key < 0)
            )
              return; // if key, must be (valid) number
            setCurrentInterface((ci) => {
              const cface = ci || currentInterface;
              const v =
                typeof key === 'number'
                  ? cface.splice(key, 1)
                  : cface.filter((e: IFaceBlock) => e.uuid !== key);
              return v;
            });
          }
          break; // TODO insertion index key is not yet tested, may not work/properly
        case 'add':
          if (kvpset && kvpset !== {}) {
            // add form element, provide the component as json, or a key of a default element to clone and it will be inserted
            // if no uuid is provided, one will be generated
            if (
              key &&
              (typeof key !== 'number' ||
                key > currentInterface.length ||
                key < 0)
            )
              return; // if key, must be (valid) number
            setCurrentInterface((ci) => {
              const nci = ci || currentInterface;

              if (
                !kvpset.uuid ||
                !nci.find((e: IFaceBlock) => e.uuid && e.uuid === kvpset.uuid)
              ) {
                if (!kvpset.uuid) kvpset.uuid = Math.random().toString(34);
                const ncurr: IFaceBlock[] = [...nci, kvpset];
                // const ncurr: IFaceBlock[] = nci.splice(key || nci.length, 0, kvpset);
                return ncurr;
              }
              return nci;
            }); // TODO insertion index key is not yet tested, may not work/properly
          }
          break;
        case 'set':
          if (key && kvpset) {
            // set value of a form element, provide a uuid in the key slot and the component that matches it will have any keys which are specified changed to new values
            if (
              kvpset.uuid &&
              currentInterface.find(
                (e: IFaceBlock) => e.uuid && e.uuid === kvpset.uuid
              )
            )
              return;
            setCurrentInterface((ci) => {
              // TODO:use lower version when state problem fixed, not mem efficient
              const cface = ci || currentInterface;
              return cface.map((e: IFaceBlock) => {
                if (e.uuid === key) {
                  Object.getOwnPropertyNames(kvpset).forEach((k) => {
                    // TODO: add setter for children
                    if (k === 'defaults') {
                      Object.getOwnPropertyNames(kvpset.defaults).forEach(
                        (dk) => (e.defaults[dk] = kvpset.defaults[dk])
                      );
                    } else if (k === 'hooks') {
                      Object.getOwnPropertyNames(kvpset.hooks).forEach(
                        (dk) => (e.hooks[dk] = kvpset.hooks[dk])
                      );
                    } else if (k === 'validate') {
                      Object.getOwnPropertyNames(kvpset.validate).forEach(
                        (dk) => (e.validate[dk] = kvpset.validate[dk])
                      );
                    } else {
                      e[k] = kvpset[k];
                    }
                  });
                  return e;
                }
                return e;
              });
            });
            return currentInterface;
          }
          break;
        case 'get': // get function, returns the whole interface, or just one element who has its uuid specified
          if (!key || key === '') return currentInterface;
          return currentInterface.find((e: IFaceBlock) => e.uuid === key);
          break;

        default:
          break;
      }
    }
  };

  // build current form from provided component list
  return (
    <div>
      {currentInterface &&
        processHooks(currentInterface, makeEvent).map((item, i) => (
          <Fragment key={props.key}>
            {React.createElement(compDict[item.id] || FailComponent, {
              key: item.id + i,
              uuid: item.uuid || Math.random().toString(34),
              objProps: item.defaults,
              objHooks: item.hooks,
              validate: item.validate,
            })}
            <br />
          </Fragment>
        ))}
    </div>
  );
}
