import React, { useState } from "react";
import Main from "./Main";
import Print from "./Print";

const Tabs = () => {
  const [tab, setTab] = useState(0);

  return (
    <>
      <div
        style={{
          margin: "10px",
          display: "flex",
          cursor: "pointer",
          gap: "50px",
        }}
      >
        <div
          //   style={{ marginRight: "50px" }}
          onClick={(e) => {
            setTab(0);
          }}
        >
          Upload
        </div>
        <div
          onClick={(e) => {
            setTab(1);
          }}
        >
          Print
        </div>
      </div>
      <div>{tab === 0 ? <Main /> : <Print />}</div>
    </>
  );
};

export default Tabs;
