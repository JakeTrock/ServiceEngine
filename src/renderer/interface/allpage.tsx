import * as React from 'react';
import './data/styles.css';

const AllPage = () => {
  const [items, setItems] = React.useState<Object[]>([]);
  React.useEffect(() => {
    window.electron.ipcRenderer.getAll();
    window.electron.ipcRenderer.once('getAllFiles', (arg) => {
      setItems(arg);
    });
  }, []);
  return (
    <>
      {items.map((itm) => (
        <div className="gallery items-center">
          <h2 className="font-semibold text-gray-800 md:text-2xl">
            {itm.name}
          </h2>
          <br />
          <a
            className="mx-4 px-4 py-3 bg-gray-300 text-gray-900 text-xs font-semibold rounded hover:bg-gray-400"
            href={`/runner/${itm.id}`}
            rel="noreferrer"
          >
            Run program
          </a>
          <br />
          <br />
          <a
            className="mx-4 px-4 py-3 bg-gray-300 text-gray-900 text-xs font-semibold rounded hover:bg-gray-400"
            href={`/editor/${itm.id}`}
            rel="noreferrer"
          >
            Edit program
          </a>
          <div className="desc">{itm.description}</div>
          <hr />
          <p>Tags: {itm.tags.join(', ')}</p>
        </div>
      ))}
    </>
  );
};

export default AllPage;
