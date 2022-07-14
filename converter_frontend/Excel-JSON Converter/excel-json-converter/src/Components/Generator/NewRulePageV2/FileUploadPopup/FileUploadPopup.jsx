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
} from "@material-ui/core";
import "./styles.css";
import { BsArrowRight } from "react-icons/bs";
import Divider from '@mui/material/Divider';
import Dropzone, { useDropzone } from "react-dropzone";

const FileUploadPopup = ({ ruleNames }) => {

  const[existingRuleIndex , setExistingRuleIndex] = useState(-1)
  const [file , setFile] = useState()
  const [jsonText , setJsonText] = useState()
  const [fileRejected, setFilesRejected] = useState(0);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
  } = useDropzone({ onDrop });


  useEffect(() => {
    if(jsonText){
      console.log(keyify(jsonText, []))
      let jsonStruct = keyify(jsonText, [])
      navigate("imported" , {state: {jsonStructure: jsonStruct , ruleNames: ruleNames}})
    }
    
  }, [jsonText])

  

  var JSONPretty = require('react-json-pretty');
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/");
  };

  const keyify = (obj, prefix = '') => 
  Object.keys(obj).reduce((res, el) => {
    if( typeof obj[el] === 'object' && obj[el] !== null ) {
      return [...res, ...keyify(obj[el], prefix + el + '.')];
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
    console.log(acceptedFiles)

    let counter = 0;

    if(acceptedFiles.length > 1){
      setFilesRejected(3)
    }
    
    console.log(acceptedFiles[0].name.substr(acceptedFiles[0].name.lastIndexOf(".")))

    if(acceptedFiles[0].name.substr(acceptedFiles[0].name.lastIndexOf(".")) != ".json"){
      
      setFilesRejected(2)
    }

    if(fileRejected == 0){
      setFile(acceptedFiles[0])
    }
  }

  const handleImportFile = () => {
    console.log(file.name)

    const fileReader = new FileReader();
    fileReader.readAsText(file, "UTF-8");

    fileReader.onload = e => {
      console.log(JSON.parse(e.target.result));
      setJsonText(JSON.parse(e.target.result))
    }
  }


  const classes = useStyles();

  return (
    <Container style={{ width: "90vw", maxWidth: "85vw" }}>
      <div className={classes.toolbar} style={{ marginBottom: "30px" }} />
      <div className="popup-box">
        <div className="box">
        <br className={"unselectable"} />
          <Typography variant="h3" style={{ marginBottom: "20px" }}>
            Update Rule Storage?
          </Typography>
          <Typography variant="h5" style={{fontWeight: "600"}}>
            Would you like to update the rule storage system? This will override any existing rules with the same names and add any other ones to the storage system as well. 
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
                      <div className={classes.text}>Upload Your Files Here</div>
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
            ) : fileRejected == 0 && file ? <div className={classes.normalMessage}>
                Uploaded: {file.name}
              </div> : fileRejected == 2 ? <div className={classes.warningMessage}>
                No files have been uploaded.
              </div> : <></>}
            <br />
          </form>
        )}
      </Dropzone>
      <br />



          <Button className={classes.button} onClick={() => file ? handleImportFile() : setFilesRejected(1)}>
            <span style={{ transform: "translateY(2px)" }}>Import</span>
          </Button>
        </div>
      </div>
    </Container>
  );
}

export default FileUploadPopup;
