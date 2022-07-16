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
import {GrSubtractCircle} from "react-icons/gr"

const FieldComponent = ({ newRule, goForRules, tempNewRule, marginLeft, setNewRule, importField, parentString, setParentString, branchParentString, inArray, arrayIndex, fields, setFields}) => {


  const ref = useRef()
  let _ = require('lodash');
  const [signShown, setSignShown] = useState(false);
  const [showDropdown , setShowDropDown] = useState(0);
  const [entered , setEntered] = useState(false);
  const [fieldEntered , setFieldEntered] = useState(false)
  const [keyEntered , setKeyEntered] = useState(false)
  const [fieldNameEntered , setFieldNameEntered] = useState("")
  const [valueEntered , setValueEntered] = useState(false)
  const [importedValue , setImportedValue] = useState(importField ? importField : "")
  const [hovering, setHovering] = useState(false)
  const [deleted, setDeleted] = useState(false)

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

  }, [])



  const handleRuleFieldUpdate = (event,fieldName, level, objectType, isValue) => {

    level = (level / 20) - 1
    console.log(parentString)

      if(event != null){
        if (event.key === "Enter") {


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

                setNewRule(tempRule)
        }

         if(!importField){ if(inArray && isValue){
          console.log(parentString)
            let tempRule = {...newRule}
            let tempArray = _.get(tempRule, Object.keys(newRule)[0] + parentString)
            console.log(tempArray)
            tempArray.push({[fieldNameEntered] : fieldName})
            

            _.set(tempRule, Object.keys(newRule)[0] + parentString, tempArray)
            setValueEntered(true)

                setNewRule(tempRule)
              
          }
          
          if(!inArray && isValue){
            console.log(parentString)
            let tempRule = {...newRule}
            _.set(tempRule, Object.keys(newRule)[0] + parentString + "." + fieldNameEntered, fieldName)
            setValueEntered(true)
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
    setShowDropDown(0);
    setSignShown(0);
    }

    const handleRemoveField = () => {
      

      if(inArray){
        let tempRule = {...newRule}
        let tempFields = [...fields]
        tempFields.splice(arrayIndex,1)

        let tempArray = _.get(tempRule , Object.keys(newRule)[0] + parentString)
        tempArray.splice(arrayIndex, 1)
        setDeleted(true)
        setNewRule(tempRule)
        setFields([...tempFields])
          
      }
      
      if(!inArray){
        let tempRule = {...newRule}
        _.unset(tempRule, Object.keys(newRule)[0] + parentString)
        setDeleted(true)
        setNewRule(tempRule)
      }
    }
    

  return (
    <>
    {!deleted ?
      <>
    <Typography
      variant="h6"
      style={{ marginBottom: "10px", marginLeft: `calc(${marginLeft}px + 20px)` }}
    >
      <span onMouseEnter={() => setHovering(true)} onMouseLeave={()=> setHovering(false)} onClick={() => handleRemoveField()}><svg style={{marginTop: "8px" , marginRight: "8px", cursor: "pointer"}} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" 
      xmlns="http://www.w3.org/2000/svg" >
        <path fill={hovering ? "rgba(255, 55, 92, 1)" : "rgba(255, 55, 92, 0.2)"} stroke="rgb(255, 255, 255)" strokeWidth="2" d="M12,22 C17.5228475,22 22,17.5228475 22,12 C22,6.4771525 17.5228475,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 Z M6,12 L18,12"></path></svg>
      </span>

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

       : <></>}
    </>
  );
};

export default FieldComponent;
