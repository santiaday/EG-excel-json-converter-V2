import React, { useState, useCallback, useEffect, useRef } from "react";
import useStyles from "./newRulePageStyles";
import { Container, Typography, Button, TextField, MenuItem } from "@material-ui/core";
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
import ObjectArrayComponent from "./FormComponents/ObjectArrayComponent.jsx"
import StringArrayElement from "./FormComponents/StringArrayElement.jsx"
import FieldComponent from "./FormComponents/FieldComponent"
import RuleUpdateConfirmationPopup from "./RuleUpdateConfirmation/RuleUpdateConfirmationPopup";
import FileUploadPopup from "./FileUploadPopup/FileUploadPopup.jsx"
import produce from "immer";


const NewRulePage = ({ newRule , setNewRule}) => {
  const ref = React.useRef()

  const location = useLocation();
  let ruleNames = location.state.ruleNames
  let rules = location.state.rules
  const classes = useStyles();
  const [titleEntered, setTitleEntered] = useState(false);
  const [ruleTitle, setRuleTitle] = useState("title");
  const [ruleUpdatePopup , setRuleUpdatePopup] = useState(0);
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
  const [maxRuleList, setMaxRuleList] = useState(false);
  const [maxRuleLineList, setMaxRuleLineList] = useState(false);
  const [showDropdown , setShowDropDown] = useState(0);
  const [paths , setPaths] = useState([])
  const [pathArrayIndex , setPathArrayIndex] = useState(0)
  const [useFunction , setUseFunction] = useState(false)
  const [tempRule , setTempRule] = useState();
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
  
  const [fields , setFields] = useState([0, 0, 0, 0])

  const [newObjectField , setNewObjectField] = useState("");
  const [fileUploadPopup , setFileUploadPopup] = useState(0)

  const navigate = useNavigate();


  useEffect(() => {
    console.log(newRule)
    if(useFunction){
      handleGenerateRuleJSON(newRule)
    }
    
  }, [newRule, useFunction])

  useEffect(() => {
    
  }, [useFunction, newRule])

  useEffect(() => {
    console.log(paths)
    console.log(pathArrayIndex)
  }, [paths , pathArrayIndex])

  const clearNewRule = () => {
    window.location.reload()
  }

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

  function clean(object) {
    if(object != null){
    Object.entries(object).forEach(([k, v]) => {
      if (v && typeof v === "object") {
        clean(v);
      }
      if (
        (v && typeof v === "object" && !Object.keys(v).length) ||
        v === null ||
        v === undefined ||
        v === "" ||
        v === " " ||
        v.length === 0
      ) {
        if (Array.isArray(object)) {
          object.splice(k);
        } else {
          delete object[k];
        }
      }
    });
  }
    return object;
  }

  const handleChangeRuleTitle = (event, name) => {
    if (event.key === "Enter") {
      var tempRule = cloneDeep(newRule);
      tempRule[`${name}`] = tempRule[`${ruleTitle}`];
      delete tempRule[`${ruleTitle}`];
      setRuleTitle(name);
      setTitleEntered(true);
      setNewRule(tempRule);
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
    console.log(newRule)
    console.log(fields)
  }, [newRule, listCounters, fields]);

  const handleGenerateRuleJSON = (rule) => {

    console.log(rule)
    console.log(JSON.stringify(rule))
    

      if(ruleNames.indexOf(ruleTitle + ".json") > -1){
        setRuleUpdatePopup(1)
      }else{
        setRuleUpdatePopup(2);
        
      }

  };

  const handleStoreRule = () => {
    const url = window.URL.createObjectURL(
      new Blob([JSON.stringify((newRule))])
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      ruleTitle + ".json"
    ); 
    document.body.appendChild(link);
    link.click();

    const formData = new FormData();
    const rule = new Blob([JSON.stringify((newRule))]);

          formData.append("rule", rule);
          formData.append("ruleName", ruleTitle);

          ApiService.createRule(formData, {
            headers: {
              "content-type": "multipart/form-data",
            },

  }).then(setRuleUpdatePopup(0))
  }

  const handleDownloadRule = (temp) => {
    const url = window.URL.createObjectURL(
      new Blob([JSON.stringify((temp))])
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      ruleTitle + ".json"
    ); 
    document.body.appendChild(link);
    link.click();
    setRuleUpdatePopup(0)
  }

  const handleNavigateToManager = () => {
    navigate("/generator" , {
      state: { rules: rules , ruleNames: ruleNames },
    })
  }

  const handleRuleFieldUpdate = (event,fieldName, level, objectType) => {

      var tempRule = cloneDeep(newRule);

      // tempRule[`${fieldName}`] = tempRule[`${ruleTitle}`];
      // delete tempRule[`${ruleTitle}`];
      // setRuleTitle(name);
      // setTitleEntered(true);
      // setNewRule(tempRule);

      if(event != null){
        if (event.key === "Enter") {
          setNewRule(
            produce((draft) => {
              draft[ruleTitle][fieldName] = ""
            })
          )
          }
      }
      

  }

  const handleAddField = (fieldType , level) => {
    level = ((level.substring(0, level.length-2)) / 20) - 1
    fieldType = fieldType - 1;

    console.log(fieldType);
    console.log(level);

    let tempPathIndex = pathArrayIndex
    tempPathIndex++;
    setPathArrayIndex(tempPathIndex)
    
    let tempPaths = cloneDeep(paths)
    paths.push("")
    setPaths(tempPaths)

    var tempFields = cloneDeep(fields);

    tempFields[fieldType] = tempFields[fieldType] + 1

    setFields(tempFields);
    setShowDropDown(0);
    setSignShown(0);


    }

    const handleChooseImportFile = () => {
      setFileUploadPopup(1)
    }



  return (
    <Container style={{ width: "90vw", maxWidth: "85vw" }}>
      <div className={classes.toolbar} />
      <Typography inline className={classes.title} variant="h2">
        Rule Generator
      </Typography>
      <Typography
        style={{ marginTop: "15px", marginBottom: "20px" }}
        variant="h6"
      >
      </Typography>
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
          value={newRule.keyMain}
          onKeyPress={(e) => handleChangeRuleTitle(e, e.target.value)}
          variant="outlined"
          size="small"
          style={{ transform: "translateY(-3px)" }}
          disabled={titleEntered ? true : false}
          inputProps={{ style: { fontWeight: "700" , fontSize: "16px" } }}
        />
        {" : {"}
      </Typography>

      {[...Array(fields[0])].map((e, i) => <NestedObjectComponent paths={paths} parentString={paths[pathArrayIndex]} pathArrayIndex={pathArrayIndex} inArray={0} newRule={newRule} marginLeft={20} signShown={signShown} showDropdown={showDropdown} setShowDropDown={setShowDropDown} handleShowSign={handleShowSign} setNewRule={setNewRule} setFields={setFields}/>)}
      {[...Array(fields[1])].map((e, i) => <ObjectArrayComponent paths={paths} parentString={paths[pathArrayIndex]} pathArrayIndex={pathArrayIndex} inArray={0} newRule={newRule} marginLeft={20} signShown={signShown} showDropdown={showDropdown} setShowDropDown={setShowDropDown} handleShowSign={handleShowSign} setNewRule={setNewRule} setFields={setFields}/>)}
      {[...Array(fields[2])].map((e, i) => <StringArrayElement paths={paths} inArray={0} parentString={paths[pathArrayIndex]} newRule={newRule} marginLeft={0} signShown={signShown} showDropdown={showDropdown} setShowDropDown={setShowDropDown} handleShowSign={handleShowSign} setNewRule={setNewRule} setFields={setFields}/>)}
      {[...Array(fields[3])].map((e, i) => <FieldComponent paths={paths} inArray={0} parentString={paths[pathArrayIndex]} newRule={newRule} marginLeft={20} signShown={signShown} showDropdown={showDropdown} setShowDropDown={setShowDropDown} handleShowSign={handleShowSign} setNewRule={setNewRule} setFields={setFields}/>)}

        <>

        <>
                {showDropdown ? 
                <>
            <TextField
                ref={ref}
                onChange={(e) => handleAddField(e.target.value, ref.current.style.marginLeft) }
                variant="outlined"
                select
                size="small"
                label="Type Of Field"
                style={{ transform: "translateY(-3px)" , minWidth: "150px", marginLeft: "20px"}}
                inputProps={{ style: { fontWeight: "700" , fontSize: "16px" } }}
              > 
              <MenuItem value={1}>Object</MenuItem>
              <MenuItem value={2}>Object Array</MenuItem>
              <MenuItem value={3}>String Array</MenuItem>
              <MenuItem value={4}>Field</MenuItem>
              </TextField>
            </>
              
            :

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
                      <span className="addSign">
                        Add a new field?
                      </span>
                    ) : (
                      <span className="removeSign">
                        Add a new field?
                      </span>
                    )}
                    </>


            }

            </>

          
          <Typography variant="h6" style={{ marginBottom: "10px" }}>
        {" }"}
      </Typography> 
          
          {ruleUpdatePopup == 1 ? <RuleUpdateConfirmationPopup clean={clean} rules={rules} ruleTitle={ruleTitle} newRule={clean(newRule)} setRuleUpdatePopup={setRuleUpdatePopup} ruleUpdatePopup={1} handleStoreRule={handleStoreRule} ruleNames={ruleNames}  handleDownloadRule={handleDownloadRule}/> : 
          ruleUpdatePopup == 2 ? <RuleUpdateConfirmationPopup clean={clean} ruleNames={ruleNames} setRuleUpdatePopup={setRuleUpdatePopup} ruleUpdatePopup={2} rules={rules} ruleTitle={ruleTitle} newRule={clean(newRule)} handleStoreRule={handleStoreRule} handleDownloadRule={handleDownloadRule}/> : <></>}
        </>

      <Typography style={{ fontSize: "30px", marginTop: "20px" }} inline>
      <Button onClick={handleNavigateToManager} className={classes.altButton}>
              <div style={{ transform: "translateY(2px)" }}>Go Back</div>
            </Button>

            {!titleEntered ? <Button onClick={() => handleChooseImportFile()} className={classes.buttonGreen}>
              <div style={{ transform: "translateY(2px)" , textDecoration: "none !important" }}>Import</div>
            </Button> : <></>}

            {titleEntered ?  <><Button onClick={() => {clearNewRule()}} className={classes.redButton}>
              <div style={{ transform: "translateY(2px)" }}>Reset</div>
            </Button>
            <Button onClick={() => setUseFunction(true)} className={classes.button}>
              <div style={{ transform: "translateY(2px)" }}>Generate</div>
            </Button></>: <></>}
            
          </Typography>

          {fileUploadPopup ? <FileUploadPopup setFileUploadPopup={setFileUploadPopup} ruleNames={ruleNames} rules={rules}/> : <></>}
            
    </Container>
  );
};
export default NewRulePage;
