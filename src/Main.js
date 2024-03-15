import React, { useCallback, useContext, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@mui/material";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import GeneralContext from "./generalContext";

const Main = () => {
  const [date, setDate] = useState(null);
  const { files, setFiles, count, setCount, fileName, setFileName } =
    useContext(GeneralContext);

  const readUploadFile = useCallback(
    (e) => {
      e.preventDefault();
      console.log("e.target.files", e.target.files);
      if (e.target.files) {
        let temp = [];
        let temp2 = [...fileName];
        Object.keys(e.target.files).forEach((d) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const data = ev.target.result;
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            let json = XLSX.utils.sheet_to_json(worksheet);
            console.log("json", json);
            json = json.map((data) => {
              return {
                ...data,
                date: moment(
                  e.target?.files[d]?.name.slice(0, 8),
                  "DDMMYYYY"
                ).format("x"),
                uId: e.target?.files[d]?.name,
              };
            });
            temp.push(...json);
            setCount(count + 1);
            temp2.push(e.target?.files[d]?.name);

            // fileUpload(json);
            // let abc = json?.filter(
            //   (x) => x?.["Client "]?.trim() === clientCode?.id
            // );
            // setArr(abc);
          };
          reader.readAsArrayBuffer(e.target.files[d]);
        });
        if (files) {
          setFiles([...files, ...temp]);
        } else {
          setFiles(temp);
        }
        setFileName(temp2);
      }
    },
    [setCount, count, files, fileName, setFileName, setFiles]
  );

  const handleDelete = (name) => {
    let temp = [...fileName];
    let temp2 = [];
    files.forEach((d, i) => {
      if (d.uId === name) {
      } else {
        temp2.push(d);
      }
    });
    temp = temp.filter((x) => x !== name);
    setFiles(temp2);
    setFileName(temp);
  };

  useEffect(() => {
    console.log("files", files);
  }, [files]);

  return (
    <>
      <div style={{ margin: "20px", display: "flex", flexDirection: "column" }}>
        {/* <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            label="Upload Date"
            // value={date ? moment(`${date}`, "x").format("DD/MM/YYYY") : null}
            format={"DD/MM/YYYY"}
            onChange={(newValue) => {
              console.log(newValue);
              setDate(moment(newValue).format("x"));
            }}
          />
        </LocalizationProvider> */}
        <Button component="label" variant="contained">
          {"Upload file"}
          <input
            style={{ display: "none" }}
            type="file"
            multiple
            onChange={readUploadFile}
          />
        </Button>
        {fileName?.length}
        {fileName?.length
          ? fileName.map((d, i) => {
              return (
                <div
                  style={{
                    display: "flex",
                    width: "50%",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {d} {files.filter((x) => x?.uId === d)?.length}
                  </div>
                  <div
                    onClick={(e) => {
                      handleDelete(d);
                    }}
                  >
                    x
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </>
  );
};

export default Main;
