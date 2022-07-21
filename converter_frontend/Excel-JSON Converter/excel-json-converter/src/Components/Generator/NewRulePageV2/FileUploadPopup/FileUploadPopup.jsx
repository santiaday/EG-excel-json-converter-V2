import React, { useState, useCallback, useEffect } from "react";
import useStyles from "./fileUploadPopupStyles";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  FormControl,
  Typography,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  TextField,
} from "@material-ui/core";
import "./styles.css";
import { BsArrowRight } from "react-icons/bs";
import Divider from "@mui/material/Divider";
import Dropzone, { useDropzone } from "react-dropzone";
import { AiFillCloseCircle } from "react-icons/ai";
import { AiOutlineCloudUpload } from "react-icons/ai";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import $ from 'jquery';
import Popper from 'popper.js';

const FileUploadPopup = ({ ruleNames, setFileUploadPopup }) => {
  const [existingRuleIndex, setExistingRuleIndex] = useState(-1);
  const [file, setFile] = useState();
  const [jsonText, setJsonText] = useState();
  const [fileRejected, setFilesRejected] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [signal, setSignal] = useState(0);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
  } = useDropzone({ onDrop });

  useEffect(() => {
    console.log(jsonText)
    console.log(signal)



    if (jsonText) {
      let jsonStruct;

      if (parseInt(signal) === 1) {
        jsonStruct = keyify(jsonText, []);
      } else if (parseInt(signal) === 2) {
        jsonStruct = keyify(jsonText, []);
      }

      console.log(keyify(jsonText, []))

      navigate("imported", {
        state: {
          jsonText: jsonText,
          jsonStructure: jsonStruct,
          ruleNames: ruleNames,
          signal: signal,
        },
      });
    }
  }, [jsonText])

  var JSONPretty = require("react-json-pretty");
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/");
  };

  const keyify = (obj, prefix = "") =>
    Object.keys(obj).reduce((res, el) => {
      if (typeof obj[el] === "object" && obj[el] !== null) {
        return [...res, ...keyify(obj[el], prefix + el + ".")];
      }
      return [...res, prefix + el];
    }, []);

  function intersperse(arr, sep) {
    if (arr.length === 0) {
      return [];
    }

    return arr.slice(1).reduce(
      function(xs, x, i) {
        return xs.concat([sep, x]);
      },
      [arr[0]]
    );
  }

  function onDrop(acceptedFiles) {
    setFilesRejected(0);
    let tempFilesRejected = 0;
    console.log(acceptedFiles);

    let counter = 0;

    if (acceptedFiles.length > 1) {
      setFilesRejected(3);
      tempFilesRejected = 3;
    }

    console.log(
      acceptedFiles[0].name.substr(acceptedFiles[0].name.lastIndexOf("."))
    );

    if (
      acceptedFiles[0].name.substr(acceptedFiles[0].name.lastIndexOf(".")) !=
      ".json"
    ) {
      setFilesRejected(2);
      tempFilesRejected = 2;
    }

    if (tempFilesRejected == 0) {
      setFile(acceptedFiles[0]);
      setShowButton(true);
    }

    console.log(file);
    console.log(fileRejected);
  }

  const handleImportFile = (signal) => {

    const fileReader = new FileReader();
    fileReader.readAsText(file, "UTF-8");

    fileReader.onload = (e) => {
      console.log(JSON.parse(e.target.result));
      setFilesRejected(0);
      setJsonText(JSON.parse(e.target.result));
      setSignal(signal);
    };
  };

  const classes = useStyles();

  return (
    <Container style={{ width: "90vw", maxWidth: "85vw" }}>
      <div className={classes.toolbar} style={{ marginBottom: "30px" }} />
      <div className="popup-box">
        <div className="box">
          <AiFillCloseCircle
            onClick={() => setFileUploadPopup(0)}
            style={{ float: "right", cursor: "pointer" }}
          />
          <br className={"unselectable"} />
          <Typography variant="h3" style={{ marginBottom: "20px" }}>
            JSON File Import
          </Typography>
          <Typography variant="h5" style={{ fontWeight: "600" }}>
            Importing a .json file will autofill all of the keys to make filling
            it out faster and easier. Please make sure the .json file does not
            have any comments as it will not import properly.
          </Typography>
          <br className={"unselectable"} />
          <br className={"unselectable"} />

          <Dropzone onDrop={onDrop}>
            {({ getRootProps, getInputProps, isDragActive }) => (
              <form
                method="get"
                type="file"
                action="#"
                multiple
                id="#"
                onChange={onDrop}
              >
                <div className={classes.dropzone} {...getRootProps()}>
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <div
                      className="onDragOver"
                      style={{ height: "100%", pointerEvents: "none" }}
                    >
                      <div
                        className={classes.text}
                        style={{ transform: "translateY(100px)" }}
                      >
                        Drop Your Files Here
                      </div>
                      <div
                        className={classes.subText}
                        style={{ transform: "translateY(120px)" }}
                      >
                        Dropped Files Will Be<br></br>Automatically Uploaded
                      </div>
                    </div>
                  ) : (
                    <div className="onDragOut">
                      <div
                        style={{
                          top: "50%",
                          height: "50%",
                          transform: "translateY(63%)",
                          pointerEvents: "none",
                        }}
                      >
                        <label style={{ textAlign: "center" }} for="files">
                          <AiOutlineCloudUpload style={{ fontSize: "50px" }} />
                          <br />

                          <div className={classes.subText}>
                            Click To Browse Or <br></br>Drag And Drop
                          </div>
                        </label>
                        <input
                          type="file"
                          id="files"
                          style={{ display: "none" }}
                          multiple
                        />
                      </div>
                    </div>
                  )}
                </div>
                <br />

                {fileRejected == 2 ? (
                  <div className={classes.warningMessage}>
                    Please make sure all files are of ".json" format
                  </div>
                ) : fileRejected == 0 && file ? (
                  <div className={classes.normalMessage}>
                    Uploaded: {file.name}
                  </div>
                ) : fileRejected == 1 ? (
                  <div className={classes.warningMessage}>
                    No files have been uploaded.
                  </div>
                ) : (
                  <></>
                )}
                <br />
              </form>
            )}
          </Dropzone>
          <br />

          {/* <TextField
                onChange={(e) => file ? handleImportFile(e.target.value) : setFilesRejected(1) }
                variant="outlined"
                select
                disabled={!showButton ? true : false}
                size="large"
                label="Import Values"
                style={{ transform: "translate(-15px , -10px)" , minWidth: "150px", marginLeft: "20px"}}
                inputProps={{ style: { fontWeight: "700" , fontSize: "16px" } }}
              > 
              <MenuItem value={2}>All Values</MenuItem>
              <MenuItem value={1}>Keys Only</MenuItem>
              </TextField>
              {console.log(jsonText)}
              {jsonText && JSON.stringify(jsonText).length > 0 ? <Button style={{ transform: "translateY(-7px)" }} className={classes.button} onClick={() => handleImportClick()}>
            <span >Import</span>
          </Button> : <></>} */}

          <DropdownButton  onClick={(e) => console.log(e.currentTarget) } drop="down" id="dropdown-button-drop-down" title="IMPORT" style={{ transform: "translate(-15px , -45px)" , minWidth: "200px", marginLeft: "20px", marginTop: "30px"}}>
            <Dropdown.Item as="button" onClick={(e) => file ? handleImportFile(e.target.value) : setFilesRejected(1) } value={1}>Keys Only</Dropdown.Item>
            <Dropdown.Item as="button" onClick={(e) => file ? handleImportFile(e.target.value) : setFilesRejected(1) } value={2}>Keys With Values</Dropdown.Item>
          </DropdownButton>
        </div>
      </div>
    </Container>
  );
};

export default FileUploadPopup;
