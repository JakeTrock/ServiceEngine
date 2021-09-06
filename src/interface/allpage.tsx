import * as React from "react";
import './data/styles.css';
import allutils from "./data/allutils.json";

const AllPage = () => {
  const gallery = [];
  for (let itm of allutils) {
    gallery.push(<div className="gallery">
      <a target="_blank" href={`/runner/${itm.id}`} rel="noreferrer">
        {itm.name}
      </a>
      <div className="desc">{itm.description}</div>
      <hr/>
      <p>Tags: {itm.tags.join(", ")}</p>
    </div>);
  }
  return (
    <>
      {gallery}
    </>
  );
};

export default AllPage;
