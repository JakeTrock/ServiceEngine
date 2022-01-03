import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import './data/styles.css';
import logo from './images/logo.svg';
import AllPage from './allpage';

const Welcome = () => {
  return (
    <div>
      <h2 className="text-3xl font-semibold text-gray-800 md:text-4xl">
        Welcome back to <span className="text-indigo-600">SEngine</span>!
      </h2>
      <p className="mt-2 text-sm text-gray-500 md:text-base">
        [TODO: insert links to wiki]
      </p>
      <div className="flex justify-center lg:justify-start mt-6">
        <div className="gbox">
          <div className="gallery items-center">
            <br />
            <a
              className="text-3xl mx-4 px-4 py-3 bg-gray-300 text-gray-900 font-semibold rounded hover:bg-gray-400"
              href={`/editor/${uuidv4()}`}
              rel="noreferrer"
            >
              +
            </a>
            <br />
            <div className="desc">Create a new project from scratch</div>
          </div>
          <div className="gallery items-center">
            <br />
            <a
              className="text-3xl mx-4 px-4 py-3 bg-gray-300 text-gray-900 font-semibold rounded hover:bg-gray-400"
              href={`/editor/${uuidv4()}`}
              rel="noreferrer"
            >
              +
            </a>
            <br />
            <input
              type="text"
              value="TODO:paste uuid to clone, implement this"
            />
            <div className="desc">Create a new project from the web</div>
          </div>
          <AllPage />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
