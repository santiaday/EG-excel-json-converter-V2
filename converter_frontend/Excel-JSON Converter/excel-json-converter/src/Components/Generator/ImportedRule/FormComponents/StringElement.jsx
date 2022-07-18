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

const StringElement = ({ newRule, handleRuleUpdate, ruleTitle, maxRuleLineList, handleAddRuleLineListObject, 
                                  handleShowLineListSign, lineListSignShown, ruleLineListIndex, ruleListIndex, listCounters, marginLeft, setNewRule, parentString, setParentString, branchParentString, inArray, importField}) => {


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

  const handleShowSign = () => {
    if (signShown) {
      setSignShown(false);
    } else {
      setSignShown(true);
    }
  };



  const handleRuleFieldUpdate = (event,fieldName, level, objectType) => {

    level = (level / 20) - 1
    console.log(parentString)

      if(event != null){
        if (event.key === "Enter") {


          if(importField){
            let tempRule = {...newRule}
            let tempArray = _.get(tempRule, Object.keys(newRule)[0] + parentString)
            tempArray[importField] = fieldName

            _.set(tempRule, Object.keys(newRule)[0] + parentString, tempArray)
            setValueEntered(true)
            console.log(tempRule)

                setNewRule(tempRule)
          }

          if(parentChain != "" && level != 1){
            var parentChain = parentString.split("..")
          }
          
          

          if(inArray && !importField){
            console.log(parentString)
            let tempRule = {...newRule}
            let tempArray = _.get(tempRule, Object.keys(newRule)[0] + parentString)
            tempArray.push(fieldName)

            _.set(tempRule, Object.keys(newRule)[0] + parentString, tempArray)
            console.log(tempRule)
            setValueEntered(true)

                setNewRule(tempRule)
              
          }

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
      <TextField
      onKeyPress={(e) => handleRuleFieldUpdate(e, e.target.value, marginLeft+20, 4, 0)}
              variant="outlined"
              size="small"
              style={{ transform: "translateY(-3px)" }}
              disabled={fieldEntered ? true : false}
              inputProps={{ style: { fontWeight: "700" , fontSize: "16px" } }}
            />
            {" , "}
    </Typography>

    <Typography
      variant="h6"
      style={{ marginBottom: "10px", marginLeft: `${marginLeft}` + "px" }}
      inputProps={{ style: { fontWeight: "700" , fontSize: "16px" } }}
    >
      {" "}
    </Typography>
    
  </>
  );
};

export default StringElement;
