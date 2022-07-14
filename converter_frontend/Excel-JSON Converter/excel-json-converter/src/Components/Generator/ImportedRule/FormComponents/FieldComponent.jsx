import React, { useState, useCallback, useEffect, useRef } from "react";
import useStyles from "../newRulePageStyles";
import { Container, Typography, Button, TextField, MenuItem } from "@material-ui/core";
import { FilePicker } from "react-file-picker";
import Dropzone, { useDropzone } from "react-dropzone";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ApiService from "../../../../http-common";
import { IoArrowDownOutline } from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io";
import cloneDeep from "lodash/cloneDeep";
import "../newRulePageStyles.css";
import produce from "immer";
import ObjectArrayComponent from "./ObjectArrayComponent";
import NestedObjectComponent from "./NestedObjectComponent";
import $ from 'jquery'

const FieldComponent = ({ newRule, arrayIndex, goForRules, tempNewRule, marginLeft, setNewRule, importField, parentString, setParentString, branchParentString, inArray}) => {


  const ref = useRef()
  let _ = require('lodash');
  const [signShown, setSignShown] = useState(false);
  const [showDropdown , setShowDropDown] = useState(0);
  const [entered , setEntered] = useState(false);
  const [fieldEntered , setFieldEntered] = useState(false)
  const [keyEntered , setKeyEntered] = useState(false)
  const [fieldNameEntered , setFieldNameEntered] = useState("")
  
  const [fields , setFields] = useState([0, 0, 0, 0])
  const [level1Fields, setLevel1Fields] = useState(fields[0])
  const [valueEntered , setValueEntered] = useState(false)
  const [importedValue , setImportedValue] = useState(importField ? importField : "")

  const handleShowSign = () => {
    if (signShown) {
      setSignShown(false);
    } else {
      setSignShown(true);
    }
  };

  useEffect(() => {
    if(importedValue){
      setFieldEntered(true)
    }

    console.log(importedValue)
  }, [])



  const handleRuleFieldUpdate = (event,fieldName, level, objectType, isValue) => {

    level = (level / 20) - 1

      if(event != null){
        if (event.key === "Enter") {

          console.log(parentString)

          if(parentChain != "" && level != 1){
            var parentChain = parentString.split("..")
          }
          
        

          if(!isValue){
                    setFieldNameEntered(fieldName)
              }

        if(importField && isValue){
          let tempRule = {...newRule}

            _.set(tempRule, Object.keys(newRule)[0] + parentString, fieldName)
            setValueEntered(true)
            console.log(tempRule)

                setNewRule(tempRule)
        }

         if(!importField){ if(inArray && isValue){
            let tempRule = {...newRule}
            let tempArray = _.get(tempRule, Object.keys(newRule)[0] + parentString)
            tempArray.push({[fieldNameEntered] : fieldName})

            _.set(tempRule, Object.keys(newRule)[0] + parentString, tempArray)
            setValueEntered(true)
            console.log(tempRule)

                setNewRule(tempRule)
              
          }
          
          if(!inArray && isValue){
            let tempRule = {...newRule}
            _.set(tempRule, Object.keys(newRule)[0] + parentString + "." + fieldNameEntered, fieldName)
            setValueEntered(true)
            console.log(tempRule)
            setNewRule(tempRule)
          }}

          setEntered(true)
          setFieldEntered(true)
        }
      }
}

  const handleAddField = (fieldType , level) => {
    level = ((level.substring(0, level.length-2)) / 20) - 1
    fieldType = fieldType - 1;

    var tempFields = cloneDeep(fields);

    tempFields[fieldType] = tempFields[fieldType] + 1

    setFields(tempFields);
    setShowDropDown(0);
    setSignShown(0);
    }

  return (
    <>
    <Typography
      variant="h6"
      style={{ marginBottom: "10px", marginLeft: `calc(${marginLeft}px + 20px)` }}
    >

    {importField ? 
      <TextField
      onKeyPress={(e) => handleRuleFieldUpdate(e, e.target.value, marginLeft+20, 4, 0)}
              variant="outlined"
              size="small"
              style={{ transform: "translateY(-3px)" }}
              disabled={fieldEntered ? true : false}
              value={importedValue.replace(/[^a-zA-Z0-9_ ]/g, "")}
            /> : 

            <TextField
      onKeyPress={(e) => handleRuleFieldUpdate(e, e.target.value, marginLeft+20, 4, 0)}
              variant="outlined"
              size="small"
              style={{ transform: "translateY(-3px)" }}
              disabled={fieldEntered ? true : false} 
            />}
      {" : "}
      <TextField
      onKeyPress={(e) => handleRuleFieldUpdate(e, e.target.value, marginLeft+20, 4, 1)}
              variant="outlined"
              size="small"
              style={{ transform: "translateY(-3px)" }}
              disabled={valueEntered || !fieldEntered ? true : false}
            />
            {" , "}
    </Typography>

    <Typography
      variant="h6"
      style={{ marginBottom: "10px", marginLeft: `${marginLeft}` + "px" }}
    >
      {" "}
    </Typography>
    
  </>
  );
};

export default FieldComponent;
