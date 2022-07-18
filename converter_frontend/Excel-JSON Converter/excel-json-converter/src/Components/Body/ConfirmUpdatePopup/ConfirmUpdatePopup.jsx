import React, { useState, useCallback, useEffect } from "react";
import useStyles from "./confirmUpdatePopupStyles";
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
import { AiFillCloseCircle } from "react-icons/ai";

const ConfirmUpdatePopup = ({ handleFileUpload ,  fileKey, multipleFiles, handleSingleFileUpload, setConfirmUpdatePopup}) => {

  const[existingRuleIndex , setExistingRuleIndex] = useState(-1)

  var JSONPretty = require('react-json-pretty');
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/");
  };

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

  const classes = useStyles();

  return (
    <Container style={{ width: "90vw", maxWidth: "85vw" }}>
      <div className={classes.toolbar} style={{ marginBottom: "30px" }} />
      <div className="popup-box">
        <div className="box">
        <AiFillCloseCircle onClick={() => setConfirmUpdatePopup(0)} style={{float: "right", cursor: "pointer"}}/>
        <br className={"unselectable"} />
          <Typography variant="h3" style={{ marginBottom: "20px" }}>
            Update Rule Storage?
          </Typography>
          <Typography variant="h5" style={{fontWeight: "600"}}>
            Would you like to update the rule storage system? This will override any existing rules with the same names and add any other ones to the storage system as well. 
          </Typography>
          <br className={"unselectable"} />
          <br className={"unselectable"} />

          <Button className={classes.button} onClick={() => multipleFiles ? handleFileUpload(1)  : handleSingleFileUpload(fileKey , 1)}>
            <span style={{ transform: "translateY(2px)" }}>Update Storage</span>
          </Button>
          <Button className={classes.altButton} onClick={() => multipleFiles ? handleFileUpload(0)  : handleSingleFileUpload(fileKey , 0)}>
            <span style={{ transform: "translateY(2px)" }}>Conversion Only</span>
          </Button>
        </div>
      </div>
    </Container>
  );
}

export default ConfirmUpdatePopup;
