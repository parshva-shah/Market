import { createContext, useEffect, useState } from "react";

const GeneralContext = createContext();

export const GeneralContextProvider = ({ children }) => {
  const [files, setFiles] = useState(null);
  const [count, setCount] = useState(0);
  const [fileName, setFileName] = useState([]);
  useEffect(() => {
    console.warn(files);
  });
  return (
    <GeneralContext.Provider
      value={{ files, setFiles, count, setCount, fileName, setFileName }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
