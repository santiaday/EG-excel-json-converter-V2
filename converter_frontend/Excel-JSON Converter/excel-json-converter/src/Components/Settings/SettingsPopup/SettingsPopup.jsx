import React, { useState, useCallback, useEffect } from "react";
import useStyles from "./settingsPopupStyles";
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
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import $ from 'jquery';
import Popper from 'popper.js';           

const SettingsPopup = ({
  handleSetSettings,
  setSettings,
  settings,
  originFile,
  targetFile,
  multipleFileOutput,
  setOriginFile,
  setTargetFile,
  setMultipleFileOutput,
}) => {
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

  const handleRevertChanges = () => {
    setOriginFile(settings[0].originFile);
    setTargetFile(settings[1].targetFile);
    setMultipleFileOutput(settings[2].multipleFileOutput);
    navigate("/");
  };

  const handleSaveChanges = () => {
    setSettings([
      { originFile: originFile },
      { targetFile: targetFile },
      { multipleFileOutput: multipleFileOutput },
    ]);

    navigate("/");
  };

  useEffect(() => {
    console.log(settings);
    console.log(originFile);
    console.log(targetFile);
    console.log(multipleFileOutput);
  }, []);

  const classes = useStyles();

  return (
    <Container style={{ width: "90vw", maxWidth: "85vw" }}>
      <div className={classes.toolbar} style={{ marginBottom: "30px" }} />
      <div className="popup-box">
        <div className="box">
          <br className={"unselectable"} />
          <Typography variant="h3" style={{ marginBottom: "20px" }}>
            Confirm Settings
          </Typography>
          <Typography variant="h5">
            All uploaded and downloaded files will be cleared from the queue.
          </Typography>
          <br className={"unselectable"} />
          <Typography variant="h5" style={{ textDecoration: "underline" }}>
            Summary Of Changes
          </Typography>
          <br className={"unselectable"} />
          <Typography style={{ marginBottom: "5px" }} variant="h6">
            <span style={{ fontWeight: "600", marginRight: "5px" }}>
              Origin File:
            </span>{" "}
            {intersperse(settings[0].originFile, ", ")}{" "}
            <BsArrowRight
              style={{
                transform: "translateY(4px)",
                marginLeft: "5px",
                marginRight: "5px",
              }}
            />{" "}
            {intersperse(originFile, ", ")}
          </Typography>
          <Typography style={{ marginBottom: "5px" }} variant="h6">
            <span style={{ fontWeight: "600", marginRight: "5px" }}>
              Target File:
            </span>{" "}
            {settings[1].targetFile}{" "}
            <BsArrowRight
              style={{
                transform: "translateY(4px)",
                marginLeft: "5px",
                marginRight: "5px",
              }}
            />{" "}
            {targetFile}
          </Typography>
          <Typography style={{ marginBottom: "5px" }} variant="h6">
            <span style={{ fontWeight: "600", marginRight: "5px" }}>
              Multiple File Output:
            </span>{" "}
            {settings[2].multipleFileOutput == "0" ? "No" : "Yes"}{" "}
            <BsArrowRight
              style={{
                transform: "translateY(4px)",
                marginLeft: "5px",
                marginRight: "5px",
              }}
            />{" "}
            {multipleFileOutput == "0" ? "No" : "Yes"}{" "}
          </Typography>
          <br className={"unselectable"} />

          {/* <Button onClick={handleSaveChanges} className={classes.button}>
            <span style={{ transform: "translateY(2px)" }}>Save Changes</span>
          </Button>
          <Button onClick={handleRevertChanges} className={classes.altButton}>
            <span style={{ transform: "translateY(2px)" }}>Revert Changes</span>
          </Button> */}
          <DropdownButton
            onClick={(e) => console.log(e.currentTarget)}
            drop="down"
            id="dropdown-button-drop-down"
            title="UPDATE"
            style={{
              transform: "translate(-15px , 0px)",
              minWidth: "200px",
              marginLeft: "20px",
              marginTop: "30px",
            }}
          >
            <Dropdown.Item
              as="button"
              onClick={() =>
                 handleSaveChanges()
              }
              value={1}
            >
              Save Changes
            </Dropdown.Item>
            <Dropdown.Item
              as="button"
              onClick={() =>
                handleRevertChanges()
             }
              value={2}
            >
              Revert Changes
            </Dropdown.Item>
          </DropdownButton>
        </div>
      </div>
    </Container>
  );
};

export default SettingsPopup;
