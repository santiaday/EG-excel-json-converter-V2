import React, { useState, useCallback, useEffect, useRef } from "react";
import useStyles from "../newRulePageStyles";
import { Container, Typography, Button, TextField, MenuItem } from "@material-ui/core";
import { FilePicker } from "react-file-picker";
import Dropzone, { useDropzone } from "react-dropzone";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ApiService from "../../../../http-common";
import { IoArrowDownOutline } from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io";
import "../newRulePageStyles.css";
import produce from "immer";
import ObjectArrayComponent from "./ObjectArrayComponent";
import StringArrayElement from "./StringArrayElement";
import FieldComponent from "./FieldComponent"


const NestedObjectComponent = ({ newRule, marginLeft, setNewRule, setParentString, pathArrayIndex, parentString, inArray, paths}) => {


  const ref = useRef()
  let _ = require('lodash');
  const [signShown, setSignShown] = useState(false);
  const [showDropdown , setShowDropDown] = useState(0);
  const [entered , setEntered] = useState(false);
  const [parents, setParents] = useState(parentString)
  let tempString = parentString;
  const [thisFieldName, setThisFieldName] = useState("")
  const[index, setIndex] = useState(-1)
  
  const [fields , setFields] = useState([0, 0, 0, 0])
  

  const handleShowSign = () => {
    if (signShown) {
      setSignShown(false);
    } else {
      setSignShown(true);
    }
  };

  useEffect(() => {
    console.log(parentString)
  }, [])


  const handleRuleFieldUpdate = (event,fieldName, level, objectType) => {
    //OBJECTTYPE 1 IS OBJECT
    //OBJECTYPE 2 IS OBJECT ARRAY
    //OBJECTTYPE 3 IS ARRAY
    //OBJECTYPE 4 IS FIELD

    level = (level / 20)   

      if(event != null){
        if (event.key === "Enter") {

          console.log(parents)

          tempString = tempString === undefined ? "." + fieldName : tempString + "." + fieldName
          console.log(tempString)
          setParents(tempString)

            var parentChain = tempString.split(".")
        

            if(inArray){
              console.log(parentString)
              console.log(newRule)
              setIndex( _.get(newRule , Object.keys(newRule)[0] + parentString).length)
               
              setThisFieldName(fieldName)
            }else{
              setThisFieldName(fieldName)
            }

            if(inArray){
              let tempRule = {...newRule}
              let tempArray = _.get(tempRule, Object.keys(newRule)[0] + parentString)
              console.log(newRule)
              console.log(parentString)
              console.log(tempArray)
              tempArray.push({[fieldName] : {}})
              console.log(tempArray)

              _.set(tempRule, Object.keys(newRule)[0] + parentString, tempArray)

                  setNewRule(tempRule)
                
            }
            
            if(!inArray){
              let tempRule = {...newRule}
              console.log(tempString)
              _.set(tempRule, Object.keys(newRule)[0] + tempString, {})
              setNewRule(tempRule)
            }
            
          
          setEntered(true)
          }

          
      }

  }

  const handleAddField = (fieldType , level) => {
    level = ((level.substring(0, level.length-2)) / 20) - 1
    fieldType = fieldType - 1;

    console.log(fieldType);
    console.log(level);
    console.log("UP HGEREEEEEEEEEEEEEEE")

    var tempFields = _.cloneDeep(fields);

    tempFields[fieldType] = tempFields[fieldType] + 1

    setParents(tempString)
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
              variant="outlined"
              size="small"
              style={{ transform: "translateY(-3px)" }}
              onKeyPress={(e) => handleRuleFieldUpdate(e, e.target.value, marginLeft, 1)}
              disabled={entered ? true : false}

            />
      {" : {"}
    </Typography>

    {[...Array(fields[0])].map((e, i) => <NestedObjectComponent  inArray={0} parentString={tempString === undefined ? "." +  thisFieldName : tempString + (inArray ? "[" + index + "]" + "." + thisFieldName : "." + thisFieldName)} setParentString={setParentString} newRule={newRule} marginLeft={marginLeft+20} signShown={signShown} showDropdown={showDropdown} setShowDropDown={setShowDropDown} handleShowSign={handleShowSign} setNewRule={setNewRule} setFields={setFields}/>)}
      {[...Array(fields[1])].map((e, i) => <ObjectArrayComponent inArray={0} parentString={tempString === undefined ? "." +  thisFieldName : tempString + (inArray ? "[" + index + "]" + "." + thisFieldName : "." + thisFieldName)} setParentString={setParentString} newRule={newRule} marginLeft={marginLeft+20} signShown={signShown} showDropdown={showDropdown} setShowDropDown={setShowDropDown} handleShowSign={handleShowSign} setNewRule={setNewRule} setFields={setFields}/>)}
      {[...Array(fields[2])].map((e, i) => <StringArrayElement inArray={0} parentString={tempString === undefined ? "." +  thisFieldName : tempString + (inArray ? "[" + index + "]" + "." + thisFieldName : "." + thisFieldName)} setParentString={setParentString} newRule={newRule} marginLeft={marginLeft} signShown={signShown} showDropdown={showDropdown} setShowDropDown={setShowDropDown} handleShowSign={handleShowSign} setNewRule={setNewRule} setFields={setFields}/>)}
      {[...Array(fields[3])].map((e, i) => <FieldComponent inArray={0} parentString={tempString === undefined ? "." +  thisFieldName : tempString + (inArray ? "[" + index + "]" + "." + thisFieldName : "." + thisFieldName)} setParentString={setParentString} newRule={newRule} marginLeft={marginLeft+20} signShown={signShown} showDropdown={showDropdown} setShowDropDown={setShowDropDown} handleShowSign={handleShowSign} setNewRule={setNewRule} setFields={setFields}/>)}

    {showDropdown && entered ? 
                <>
            <TextField
                ref={ref}
                onChange={(e) => handleAddField(e.target.value, ref.current.style.marginLeft) }
                variant="outlined"
                select
                size="small"
                label="Type Of Field"
                style={{ transform: "translateY(-3px)" , minWidth: "150px", marginLeft: `calc(${marginLeft}px + 20px)`}}
              > 
              <MenuItem value={1}>Object</MenuItem>
              <MenuItem value={2}>Object Array</MenuItem>
              <MenuItem value={3}>String Array</MenuItem>
              <MenuItem value={4}>Field</MenuItem>
              </TextField>
            </>
              
            :

            entered ? 

            <>
            <IoMdAddCircle
                      onClick={() => setShowDropDown(1)}
                      onMouseEnter={handleShowSign}
                      onMouseLeave={handleShowSign}
                      style={{
                        transform: "translateY(2.5px)",
                        marginLeft: `calc(${marginLeft}px + 20px)`,
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

                    :

                    <>
                    </>


            }
    <Typography
      variant="h6"
      style={{ marginBottom: "10px", marginLeft: `${marginLeft}` + "px" }}
    >
      {" }"}
    </Typography>
    
  </>
  );
};

export default NestedObjectComponent;
