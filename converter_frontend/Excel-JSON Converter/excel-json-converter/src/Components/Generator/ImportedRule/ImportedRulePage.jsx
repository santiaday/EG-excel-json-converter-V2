import React, { useState, useCallback, useEffect, useRef } from "react";
import useStyles from "./newRulePageStyles";
import {
  Container,
  Typography,
  Button,
  TextField,
  MenuItem,
} from "@material-ui/core";
import { FilePicker } from "react-file-picker";
import Dropzone, { useDropzone } from "react-dropzone";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ApiService from "../../../http-common";
import RuleObject from "../RuleObject/RuleObject";
import { IoArrowDownOutline } from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io";
import cloneDeep from "lodash/cloneDeep";
import "./newRulePageStyles.css";
import NestedObjectComponent from "./FormComponents/NestedObjectComponent.jsx";
import ObjectArrayComponent from "./FormComponents/ObjectArrayComponent.jsx";
import StringArrayElement from "./FormComponents/StringArrayElement.jsx";
import FieldComponent from "./FormComponents/FieldComponent";
import RuleUpdateConfirmationPopup from "./RuleUpdateConfirmation/RuleUpdateConfirmationPopup";
import StringElement from "./FormComponents/StringElement";
import $ from 'jquery'

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update state to force render
  // An function that increment 👆🏻 the previous state like here
  // is better than directly setting `value + 1`
}

const ImportedRulePage = ({
  jsonStructure,
  counter,
  setCounter,
  rules,
  ruleSignal,
  setRuleSignal,
}) => {
  const location = useLocation();
  const classes = useStyles();
  const [titleEntered, setTitleEntered] = useState(false);
  const [ruleTitle, setRuleTitle] = useState();
  const [ruleUpdatePopup, setRuleUpdatePopup] = useState(0);
  const [goForRules, setGoForRules] = useState(true);
  const [listCounters, setRuleListCounters] = useState({
    rule_list: 0,
    rule_line_list: [
      { rule_list_index: 0, rule_line_list_count: 0, max: false },
      { rule_list_index: 1, rule_line_list_count: 0, max: false },
      { rule_list_index: 2, rule_line_list_count: 0, max: false },
      { rule_list_index: 3, rule_line_list_count: 0, max: false },
    ],
  });
  const [signShown, setSignShown] = useState(false);
  const [pathArrayIndex, setPathArrayIndex] = useState(0);
  let arrayIndex = 0;
  const [maxRuleList, setMaxRuleList] = useState(false);
  const [maxRuleLineList, setMaxRuleLineList] = useState(false);
  const [lineListSignShown, setLineListSignShown] = useState([
    [
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
    ],
    [
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
    ],
    [
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
    ],
    [
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
    ],
  ]);
  const [newRule, setNewRule] = useState({});
  const [tempNewRule, setTempNewRule] = useState({});

  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [paths, setPaths] = useState([]);
  const [altPaths, setAltPaths] = useState([]);
  const [showDropdown, setShowDropDown] = useState(0);
  const [ogEntries, setOgEntries] = useState(0);
  const [componentsArray, setComponentsArray] = useState([])

  const [useFunction, setUseFunction] = useState(false);

  const ref = React.useRef();
  let tempIndex = 0;

  const forceUpdate = useForceUpdate();
  let ruleNames = location.state.ruleNames;

  useEffect(() => {
    let tempRule = _.cloneDeep(newRule);
    let jsonStruct = location.state.jsonStructure;

    jsonStruct.map((string) => {
      _.set(tempRule, string, "");
    });

    // if(paths.length == 0){
    //   let tempPaths = paths;
    //     tempPaths.push(" ");
    //     setPaths([...tempPaths]);
    // }

    setRuleTitle(Object.keys(tempRule)[0]);
    if(fields.length == 0){
      setNewRule(tempRule);
    }
    
    setOgEntries(Object.entries(tempRule[Object.keys(tempRule)[0]]).length);
  }, []);

  useEffect(() => {
    if (useFunction) {
      handleGenerateRuleJSON(newRule);
    }
  }, [newRule, useFunction]);

  useEffect(() => {
    console.log(newRule);
  }, [newRule]);

  const clearNewRule = () => {
    window.location.reload();
  };

  var _ = require("lodash");
  function checkNested(obj /*, level1, level2, ... levelN*/) {
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < args.length; i++) {
      if (!obj || !obj.hasOwnProperty(args[i])) {
        return false;
      }
      obj = obj[args[i]];
    }
    return true;
  }

  const handleChangeRuleTitle = (event, name) => {
    if (event.key === "Enter") {
      var tempRule = _.cloneDeep(newRule);
      let tempStr = Object.keys(tempRule)[0]

        let newObj = _.mapKeys(tempRule, (value, key) => {
           switch (key) {
              case tempStr:
                 return [name];
              default:
                 return;
             }
           });
      
      setRuleTitle(name);
      
      setNewRule(newObj);
      setTitleEntered(true);


    }
  };

  const handleShowSign = () => {
    if (signShown) {
      setSignShown(false);
    } else {
      setSignShown(true);
    }
  };

  useEffect(() => {
    if (
     newRule != null && Object.entries(newRule).length != 0
    ) {
      handleAddField(null, null, true);
    }
    
  }, [newRule]);

  const handleGenerateRuleJSON = () => {

    if (ruleNames.indexOf(ruleTitle + ".json") > -1) {
      setRuleUpdatePopup(1);
    } else {
      setRuleUpdatePopup(2);
    }
  };

  const handleStoreRule = () => {
    const url = window.URL.createObjectURL(new Blob([JSON.stringify(newRule)]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", ruleTitle + ".json");
    document.body.appendChild(link);
    link.click();

    const formData = new FormData();
    const rule = new Blob([JSON.stringify(newRule)]);

    formData.append("rule", rule);
    formData.append("ruleName", ruleTitle);

    ApiService.createRule(formData, {
      headers: {
        "content-type": "multipart/form-data",
      },
    }).then(setRuleUpdatePopup(0));
  };

  const handleDownloadRule = () => {
    const url = window.URL.createObjectURL(new Blob([JSON.stringify(newRule)]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", ruleTitle + ".json");
    document.body.appendChild(link);
    link.click();
    setRuleUpdatePopup(0);
  };

  const handleNavigateToManager = () => {
    navigate("/generator", {
      state: { rules: rules, ruleNames: ruleNames },
    });
  };

  const handleAddField = (fieldType, level, importSignal) => {
    let tempFields = fields;
    let tempCounter = counter;

    if (importSignal && fields.length == 0) {
      Object.entries(newRule[Object.keys(newRule)[0]]).map((key) => {
        if (Array.isArray(key[1]) && typeof key[1][0] === "object") {
          tempFields.push([5, "." + key[0], tempFields.length]);
        } else if (!Array.isArray(key[1]) && typeof key[1] === "object") {
          tempFields.push([4, "." + key[0], tempFields.length]);
        } else if (Array.isArray(key[1]) && typeof key[1][0] === "string") {
          tempFields.push([6, "." + key[0], tempFields.length]);
        } else if (!Array.isArray(key[1]) && typeof key[1] === "string") {
          tempFields.push([7, "." + key[0], tempFields.length]);
        }
        setFields([...tempFields]);
        setCounter(counter)
      });
    }

    if (!importSignal) {
      level = level.substring(0, level.length - 2) / 20 - 1;
      fieldType = fieldType - 1;

      tempFields.push([fieldType, null, tempFields.length]);

      setFields([...tempFields]);
      setCounter(tempCounter)
      setShowDropDown(0);
      setSignShown(0);
    }
  };


  

  useEffect(() => {
    let tempComponentsArray=[]
    if(titleEntered && newRule != null ){
      fields.map((e, i) => {
        {
          if (e[0] == 0) {
          
            tempComponentsArray.push(<NestedObjectComponent
                paths={paths}
                parentString={e[1]}
                pathArrayIndex={e[2]}
                inArray={0}
                newRule={newRule}
                marginLeft={20}
                signShown={signShown}
                showDropdown={showDropdown}
                setShowDropDown={setShowDropDown}
                handleShowSign={handleShowSign}
                setNewRule={setNewRule}
                setTempNewRule={setTempNewRule}
              />)
          }
        }
        {
          if (e[0] == 1) {
            tempComponentsArray.push(<ObjectArrayComponent
                paths={paths}
                parentString={e[1]}
                pathArrayIndex={e[2]}
                inArray={1}
                newRule={newRule}
                marginLeft={20}
                signShown={signShown}
                showDropdown={showDropdown}
                setShowDropDown={setShowDropDown}
                handleShowSign={handleShowSign}
                setNewRule={setNewRule}
                setTempNewRule={setTempNewRule}
              />)
          }
        }
        {
          if (e[0] == 2) {
            tempComponentsArray.push(<StringArrayElement
                paths={paths}
                parentString={e[1]}
                pathArrayIndex={e[2]}
                inArray={1}
                newRule={newRule}
                marginLeft={20}
                signShown={signShown}
                showDropdown={showDropdown}
                setShowDropDown={setShowDropDown}
                handleShowSign={handleShowSign}
                setNewRule={setNewRule}
                setTempNewRule={setTempNewRule}
              />)
          }
        }
        {
          if (e[0] == 3) {
            tempComponentsArray.push(<FieldComponent
                paths={paths}
                parentString={e[1]}
                pathArrayIndex={e[2]}
                inArray={0}
                newRule={newRule}
                marginLeft={20}
                signShown={signShown}
                showDropdown={showDropdown}
                setShowDropDown={setShowDropDown}
                handleShowSign={handleShowSign}
                setNewRule={setNewRule}
                setTempNewRule={setTempNewRule}
              />)
          }
        }
        {
          if (e[0] == 4) {
            tempComponentsArray.push(<NestedObjectComponent
                paths={paths}
                importField={e[1]}
                parentString={e[1]}
                pathArrayIndex={e[2]}
                inArray={0}
                newRule={newRule}
                marginLeft={20}
                signShown={signShown}
                showDropdown={showDropdown}
                setShowDropDown={setShowDropDown}
                handleShowSign={handleShowSign}
                setNewRule={setNewRule}
                setFields={setFields}
                setTempNewRule={setTempNewRule}
                goForRules={goForRules}
              />)
          }
        }
        {
          if (e[0] == 5) {
            tempComponentsArray.push(<ObjectArrayComponent
                paths={paths}
                importField={e[1]}
                parentString={e[1]}
                pathArrayIndex={e[2]}
                inArray={1}
                newRule={newRule}
                marginLeft={20}
                signShown={signShown}
                showDropdown={showDropdown}
                setShowDropDown={setShowDropDown}
                handleShowSign={handleShowSign}
                setNewRule={setNewRule}
                setFields={setFields}
                setTempNewRule={setTempNewRule}
                goForRules={goForRules}
              />)
          }
        }
        {
          if (e[0] == 6) {
            tempComponentsArray.push(<StringArrayElement
                paths={paths}
                importField={e[1]}
                parentString={e[1]}
                pathArrayIndex={e[2]}
                inArray={0}
                newRule={newRule}
                marginLeft={20}
                signShown={signShown}
                showDropdown={showDropdown}
                setShowDropDown={setShowDropDown}
                handleShowSign={handleShowSign}
                setNewRule={setNewRule}
                setFields={setFields}
                setTempNewRule={setTempNewRule}
                goForRules={goForRules}
              />)
          }
        }
        {
          if (e[0] == 7) {
            tempComponentsArray.push(<FieldComponent
                paths={paths}
                importField={e[1]}
                parentString={e[1]}
                pathArrayIndex={e[2]}
                inArray={0}
                newRule={newRule}
                marginLeft={20}
                signShown={signShown}
                showDropdown={showDropdown}
                setShowDropDown={setShowDropDown}
                handleShowSign={handleShowSign}
                setNewRule={setNewRule}
                setFields={setFields}
                setTempNewRule={setTempNewRule}
                goForRules={goForRules}
              />)
          }

          
        }
      })
    }
    setComponentsArray([...tempComponentsArray])

  }, [newRule, fields])



  return (
    <Container style={{ width: "90vw", maxWidth: "85vw" }}>
      <div className={classes.toolbar} />
      <Typography inline className={classes.title} variant="h2">
        Imported Rule
      </Typography>
      <Typography
        style={{ marginTop: "15px", marginBottom: "20px" }}
        variant="h6"
      ></Typography>
      <Typography
        style={{ marginTop: "15px", marginBottom: "20px" }}
        variant="h6"
      >
        Please enter the name of the rule and press "Enter".
      </Typography>
      <Typography
        style={{
          marginTop: "20px",
          marginBottom: "20px",
          textDecoration: "underline",
        }}
        variant="h4"
      >
        Schema:
      </Typography>
      <Typography variant="h6" style={{ marginBottom: "10px" }}>
        <TextField
          onKeyPress={(e) => handleChangeRuleTitle(e, e.target.value)}
          variant="outlined"
          size="small"
          style={{ transform: "translateY(-3px)" }}
          disabled={titleEntered ? true : false}
        />
        {" {"}
      </Typography>

      {/*//   <>
      //   <>
      //   {Object.entries(tempNewRule[Object.keys(tempNewRule)[0]]).map((key) => 
      //   <>{goForRules ? renderComponents(key) : <></>}
      //   </>
        

      //   )}
      //  </> */}
      {componentsArray.length > 0 ? (
        <>
         {componentsArray}

          <>
            {showDropdown ? (
              <>
                <TextField
                  ref={ref}
                  onChange={(e) =>
                    handleAddField(e.target.value, ref.current.style.marginLeft, 0)
                  }
                  variant="outlined"
                  select
                  size="small"
                  label="Type Of Field"
                  style={{
                    transform: "translateY(-3px)",
                    minWidth: "150px",
                    marginLeft: "20px",
                  }}
                >
                  <MenuItem value={1}>Object</MenuItem>
                  <MenuItem value={2}>Object Array</MenuItem>
                  <MenuItem value={3}>String Array</MenuItem>
                  <MenuItem value={4}>Field</MenuItem>
                </TextField>
              </>
            ) : (
              <>
                <IoMdAddCircle
                  onClick={() => setShowDropDown(1)}
                  onMouseEnter={handleShowSign}
                  onMouseLeave={handleShowSign}
                  style={{
                    transform: "translateY(2.5px)",
                    marginLeft: "20px",
                    marginRight: "10px",
                    color: "#000099",
                    cursor: "pointer",
                  }}
                />
                {signShown && !showDropdown ? (
                  <span className="addSign">Add a new field?</span>
                ) : (
                  <span className="removeSign">Add a new field?</span>
                )}
              </>
            )}
          </>

          {ruleUpdatePopup == 1 ? (
            <RuleUpdateConfirmationPopup
              rules={rules}
              ruleTitle={ruleTitle}
              newRule={newRule}
              setRuleUpdatePopup={setRuleUpdatePopup}
              ruleUpdatePopup={1}
              handleStoreRule={handleStoreRule}
              ruleNames={ruleNames}
              handleDownloadRule={handleDownloadRule}
            />
          ) : ruleUpdatePopup == 2 ? (
            <RuleUpdateConfirmationPopup
              ruleNames={ruleNames}
              setRuleUpdatePopup={setRuleUpdatePopup}
              ruleUpdatePopup={2}
              rules={rules}
              ruleTitle={ruleTitle}
              newRule={newRule}
              handleStoreRule={handleStoreRule}
              handleDownloadRule={handleDownloadRule}
            />
          ) : (
            <></>
          )}

          <Typography variant="h6" style={{ marginBottom: "10px" }}>
            {" }"}
          </Typography>
        </>
      ) : (
        <></>
      )}

      <Typography style={{ fontSize: "30px", marginTop: "20px" }} inline>
        <Button className={classes.altButton}>
          <div style={{ transform: "translateY(2px)" }}>Go Back</div>
        </Button>
        {titleEntered ? (
          <>
            <Button
              onClick={() => {
                clearNewRule();
              }}
              className={classes.redButton}
            >
              <div style={{ transform: "translateY(2px)" }}>Reset</div>
            </Button>
            <Button
              onClick={() => setUseFunction(true)}
              className={classes.button}
            >
              <div style={{ transform: "translateY(2px)" }}>Generate</div>
            </Button>
          </>
        ) : (
          <></>
        )}
      </Typography>
    </Container>
  );
};
export default ImportedRulePage;
