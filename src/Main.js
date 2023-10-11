import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import file1 from "./client.json";
import { Autocomplete, Button, TextField } from "@mui/material";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const Main = () => {
  const [clientCode, setClientCode] = useState(null);
  const [opt, setOpt] = useState([]);
  const [arr, setArr] = useState([]);
  const gridRef = useRef();

  const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        console.log(json);
        let abc = json?.filter(
          (x) => x?.["Client "]?.trim() === clientCode?.id
        );
        abc.map()
        setArr(abc);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  useEffect(() => {
    setOpt(
      file1.map((cl) => {
        return {
          id: cl.CLIENTADDCODE,
          value: `${cl.CLIENTADDCODE} - ${cl?.CLIENTNAME}`,
        };
      })
    );
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <Autocomplete
        options={opt}
        value={clientCode}
        onChange={(e, value) => {
          setClientCode(value);
        }}
        getOptionLabel={(option) => option.value}
        sx={{ width: "300px" }}
        renderInput={(params) => <TextField {...params} label="Client Code" />}
      />
      <Button
        component="label"
        variant="contained"
        // startIcon={<CloudUploadIcon />}
      >
        {"Upload file"}
        <input
          style={{ display: "none" }}
          type="file"
          onChange={readUploadFile}
        />
      </Button>
      <div className="ag-theme-alpine" style={{ height: "500px" }}>
        <AgGridReact
          rowData={arr}
          columnDefs={[
            { headerName: "Client Code", field: "Client " },
            { headerName: "abc", field: "Client " },
            { headerName: "1abc", field: "ScripId/Symbol " },
            { headerName: "a2bc", field: "Status " },
            { headerName: "ab3c", field: "Quantity " },
          ]}
        ></AgGridReact>
      </div>
    </div>
  );
};

export default Main;
