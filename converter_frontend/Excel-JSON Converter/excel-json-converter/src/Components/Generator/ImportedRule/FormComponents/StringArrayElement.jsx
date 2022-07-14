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
import FieldComponent from "./FieldComponent"
import NestedObjectComponent from "./NestedObjectComponent";
import StringElement from "./StringElement";


const StringArrayElement = ({ newRule, marginLeft, setNewRule, parentString, setParentString, inArray, importField, goForRules, tempNewRule, paths, arrayIndex}) => {


const ref = useRef()
const [signShown, setSignShown] = useState(false);
const [showDropdown , setShowDropDown] = useState(0);
const [entered , setEntered] = useState(false);
const [parents, setParents] = useState(parentString)
let tempString = parentString;
const [thisFieldName, setThisFieldName] = useState("")
const[index, setIndex] = useState(-1)
const [importedValue , setImportedValue] = useState(importField ? importField : "")

const [fields , setFields] = useState([0, 0, 0, 0])
let _ = require('lodash');



const handleShowSign = () => {
if (signShown) {
setSignShown(false);
} else {
setSignShown(true);
}
};

useEffect(() => {
  if(importedValue){
    setEntered(true)
  }

}, [])



const handleRuleFieldUpdate = (event,fieldName, level, objectType) => {
//OBJECTTYPE 1 IS OBJECT
//OBJECTYPE 2 IS OBJECT ARRAY
//OBJECTTYPE 3 IS ARRAY
//OBJECTYPE 4 IS FIELD

level = (level / 20)

var tempRule = cloneDeep(newRule);

// tempRule[`${fieldName}`] = tempRule[`${ruleTitle}`];
// delete tempRule[`${ruleTitle}`];
// setRuleTitle(name);
// setTitleEntered(true);
// setNewRule(tempRule);




if(event != null){
if (event.key === "Enter") {

if(inArray){
setIndex( _.get(newRule , Object.keys(newRule)[0] + parentString).length)

setThisFieldName(fieldName)
}else{
setThisFieldName(fieldName)
}




tempString = tempString === undefined ? "." +  fieldName : tempString + "." + fieldName
setParents(tempString)

var parentChain = tempString.split("..")

if(inArray){
let tempRule = {...newRule}
let tempArray = _.get(tempRule, Object.keys(newRule)[0] + parentString)
tempArray.push({[fieldName] : []})

_.set(tempRule, Object.keys(newRule)[0] + parentString, tempArray)
console.log(tempRule)

setNewRule(tempRule)

}

if(!inArray){
let tempRule = {...newRule}
_.set(tempRule, Object.keys(newRule)[0] + tempString, [])
console.log(tempRule)
setNewRule(tempRule)
}

setEntered(true)
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
              variant="outlined"
              size="small"
              style={{ transform: "translateY(-3px)" }}
              onKeyPress={(e) => handleRuleFieldUpdate(e, e.target.value, marginLeft, 1)}
              disabled={entered ? true : false}
              value={Number.isInteger(parseInt(importedValue)) ? importedValue: importedValue.charAt(0) == '.' ? importedValue.substring(1) : importedValue}

            />
      {" : ["}
    </Typography>

    {goForRules ? <>
      {Object.entries(_.get(newRule, Object.keys(newRule)[0] + parentString)).map((key) => {
      let objArrayIndex = 0;
      if (!Array.isArray(key[1]) && typeof key[0] === "string") {
        return (<StringElement
          paths={paths}
          importField={key[0]}
          pathArrayIndex={arrayIndex}
          parentString={parentString}
          inArray={1}
          newRule={newRule}
          marginLeft={marginLeft + 20}
          signShown={signShown}
          showDropdown={showDropdown}
          setShowDropDown={setShowDropDown}
          handleShowSign={handleShowSign}
          setNewRule={setNewRule}
          setFields={setFields}
          goForRules={goForRules}
        />)
      } 
      objArrayIndex++
    })
    }</>

    :

    <></>}

    {console.log(parentString)}
    {console.log(thisFieldName)}

    {[...Array(fields[0])].map((e, i) => <StringElement inArray={1} parentString={parentString}  newRule={newRule} marginLeft={marginLeft+20} signShown={signShown} showDropdown={showDropdown} setShowDropDown={setShowDropDown} handleShowSign={handleShowSign} setNewRule={setNewRule} setFields={setFields}/>)}

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
              <MenuItem value={1}>String Element</MenuItem>
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
      {" ]"}
    </Typography>

    

    
      

    
  </>
  );
};

export default StringArrayElement;
