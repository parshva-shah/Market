import React, { useContext, useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import file1 from "./client.json";
import {
  Autocomplete,
  Button,
  Checkbox,
  FormControlLabel,
  InputLabel,
  TextField,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import moment from "moment";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import GeneralContext from "./generalContext";

const Print = () => {
  const [clientCode, setClientCode] = useState(null);
  const [opt, setOpt] = useState([]);
  const [arr, setArr] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [allowed, setAllowed] = useState(false);
  const { files } = useContext(GeneralContext);
  const gridRef = useRef();

  const getClientData = (value) => {
    fetch(`http://192.168.1.102:3001/getClientData?clientCode=${value?.id}`)
      .then((response) => {
        return response.text();
      })
      .then((data) => {});
  };

  const fileUpload = (payload) => {
    // fetch(`http://localhost:3001/fileUpload`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ body: payload }),
    // }).then((res) => console.log(res));
  };

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
        fileUpload(json);
        let abc = json?.filter((x) => {
          console.log(
            x,
            x?.["Status "]?.trim() === "Entry Request",
            x?.["Client "]?.trim() === clientCode?.id
          );
          return (
            x?.["Client "]?.trim() === clientCode?.id &&
            x?.["Status "]?.trim() === "Entry Request"
          );
        });
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

  useEffect(() => {
    if (allowed) {
      if (files?.length && !clientCode && startDate && endDate) {
        setArr(
          files.filter((x) => {
            return (
              // clientCode?.id === x?.["Client "]?.trim() &&
              startDate <= x?.date &&
              endDate >= x?.date &&
              (x?.["Status "]?.trim() === "Entry Request" ||
                x?.["Status "]?.trim() === "Modify Request" ||
                x?.["Status "]?.trim() === "Cancel Request" ||
                x?.["Status "]?.trim() === "Exchange Reject")
            );
          })
        );
      } else if (files?.length && clientCode && startDate && endDate) {
        setArr(
          files.filter((x) => {
            return (
              clientCode?.id === x?.["Client "]?.trim() &&
              startDate <= x?.date &&
              endDate >= x?.date &&
              (x?.["Status "]?.trim() === "Entry Request" ||
                x?.["Status "]?.trim() === "Modify Request" ||
                x?.["Status "]?.trim() === "Cancel Request" ||
                x?.["Status "]?.trim() === "Exchange Reject")
            );
          })
        );
      }
    } else {
      if (files?.length && !clientCode && startDate) {
        setArr(
          files.filter((x) => {
            return (
              // clientCode?.id === x?.["Client "]?.trim() &&
              startDate <= x?.date &&
              endDate >= x?.date &&
              (x?.["Status "]?.trim() === "Entry Request" ||
                x?.["Status "]?.trim() === "Modify Request" ||
                x?.["Status "]?.trim() === "Cancel Request" ||
                x?.["Status "]?.trim() === "Exchange Reject")
            );
          })
        );
      } else if (files?.length && clientCode && startDate) {
        setArr(
          files.filter((x) => {
            return (
              clientCode?.id === x?.["Client "]?.trim() &&
              startDate === x?.date &&
              (x?.["Status "]?.trim() === "Entry Request" ||
                x?.["Status "]?.trim() === "Modify Request" ||
                x?.["Status "]?.trim() === "Cancel Request" ||
                x?.["Status "]?.trim() === "Exchange Reject")
            );
          })
        );
      }
    }
  }, [allowed, clientCode, endDate, files, startDate]);

  useEffect(() => {
    console.log("clientCode", clientCode);
  }, [clientCode]);
  return (
    <>
      <div style={{ display: "flex" }}>
        <Autocomplete
          options={opt}
          value={clientCode}
          onChange={(e, value) => {
            if (value) {
              setClientCode(value);
              // getClientData(value);
            } else {
              setClientCode(null);
            }
          }}
          getOptionLabel={(option) => option.value}
          sx={{ width: "300px" }}
          renderInput={(params) => (
            <TextField {...params} label="Client Code" />
          )}
        />
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <FormControlLabel
            label="Check to get range"
            control={
              <Checkbox
                onChange={(e) => {
                  setAllowed(e.target.checked);
                }}
              />
            }
          />
          <DatePicker
            label={`${allowed ? "Start " : ""}Date`}
            // value={date ? moment(`${date}`, "x").format("DD/MM/YYYY") : null}
            format={"DD/MM/YYYY"}
            onChange={(newValue) => {
              setStartDate(moment(newValue).format("x"));
            }}
          />
          {allowed ? (
            <DatePicker
              label="End Date"
              // value={date ? moment(`${date}`, "x").format("DD/MM/YYYY") : null}
              format={"DD/MM/YYYY"}
              onChange={(newValue) => {
                setEndDate(moment(newValue).format("x"));
              }}
            />
          ) : null}
        </LocalizationProvider>
        <Button
          component="label"
          variant="contained"
          onClick={(e) => {
            gridRef.current.api.exportDataAsCsv({
              // skipColumnHeaders: true,
              // prependContent: `${clientCode?.value}`,
            });
          }}
        >
          Save as CSV
        </Button>
      </div>
      <div>
        <div className="ag-theme-alpine" style={{ height: "500px" }}>
          <AgGridReact
            rowData={arr}
            ref={gridRef}
            onRowDataUpdated={(params) => {
              params.api.sizeColumnsToFit();
            }}
            columnDefs={[
              {
                headerName: "Date",
                field: "date",
                valueFormatter: (params) => {
                  return `${moment(`${params.data.date}`, "x").format(
                    "DD-MM-YYYY"
                  )}`;
                },
              },
              {
                headerName: "Order time",
                field: "TransactionTime ",
                valueFormatter: (params) => {
                  return `${params?.data?.["TransactionTime "]}`;
                },
              },
              {
                headerName: "Scrip code / Scrip Name",
                field: "ScripId/Symbol ",
              },
              {
                headerName: "Flag - Buy/Sell",
                field: "B/S ",
                // valueFormatter: (params) => {
                //   if (params?.data?.["B/S "] === "B ") {
                //     return "Buy";
                //   } else {
                //     return "Sell";
                //   }
                // },
              },
              { headerName: "Qty", field: "Quantity " },
              {
                headerName: "Rate (₹)",
                field: "Price ",
                valueFormatter: (params) => params.value.toFixed(2),
              },
              {
                headerName:
                  "Remarks (specify if any order modified/ cancelled)",
                field: "Status ",
              },
              { headerName: "Client Code", field: "Client " },
            ]}
          ></AgGridReact>
        </div>
      </div>
    </>
  );
};

export default Print;
