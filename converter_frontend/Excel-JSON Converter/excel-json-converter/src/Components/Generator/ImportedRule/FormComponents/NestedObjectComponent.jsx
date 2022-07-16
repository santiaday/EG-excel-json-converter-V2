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
import StringElement from "./StringElement";


const NestedObjectComponent = ({ newRule, marginLeft, setNewRule, setParentString, pathArrayIndex, parentString, inArray, paths, importField, goForRules, tempNewRule, arrayIndex, parentFields, setParentFields, arrayName}) => {


  const ref = useRef()
  let _ = require('lodash');
  const [signShown, setSignShown] = useState(false);
  const [showDropdown , setShowDropDown] = useState(0);
  const [entered , setEntered] = useState(false);
  const [parents, setParents] = useState(parentString)
  let tempString = parentString;
  const [thisFieldName, setThisFieldName] = useState(importField ? importField : "")
  const[index, setIndex] = useState(-1)
  const [importedValue , setImportedValue] = useState(importField ? importField : "")
  const [componentsArray, setComponentsArray] = useState([])
  const [fields , setFields] = useState([])
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
    if(importField && importField.length > 0){
      setEntered(true)
      handleAddField(null, null, true)
    }

    
  }, [])


  const handleRuleFieldUpdate = (event,fieldName, level, objectType) => {
    //OBJECTTYPE 1 IS OBJECT
    //OBJECTYPE 2 IS OBJECT ARRAY
    //OBJECTTYPE 3 IS ARRAY
    //OBJECTYPE 4 IS FIELD

    level = (level / 20)   

      if(event != null){
        if (event.key === "Enter") {
          


            var parentChain = tempString.split(".")
            console.log(parentString)
        

            if(inArray){
              setIndex( _.get(newRule , Object.keys(newRule)[0] + parentString).length)
               
              setThisFieldName(fieldName)
              console.log(fieldName)
            }else{
              setThisFieldName(fieldName)
              console.log(fieldName)
            }

            if(inArray){
              console.log(parentString)
              console.log(fieldName)
              let tempRule = {...newRule}
              let tempArray = _.get(tempRule, Object.keys(newRule)[0] + parentString)
              tempArray.push({[fieldName] : {}})

              _.set(tempRule, Object.keys(newRule)[0] + parentString, tempArray)

                  setNewRule(tempRule)
                
            }
            
            if(!inArray){
              console.log(tempString)
              let tempRule = {...newRule}
              _.set(tempRule, Object.keys(newRule)[0] + parentString + "." +  fieldName, {})
              setNewRule(tempRule)
            }
            
          
          setEntered(true)
          }

          
      }

  }

  const handleAddField = (fieldType, level, importSignal) => {

    let tempFields = fields;

    if (importSignal && fields.length == 0) {
      Object.entries(_.get(newRule, Object.keys(newRule)[0] + parentString)).map((key) => {

        if (Array.isArray(key[1]) && typeof key[1][0] === "object") {
          tempFields.push([5, inArray && /^\d+$/.test(key[0]) ? "[" + key[0] + "]" : "." + key[0], tempFields.length]);
        } else if (!Array.isArray(key[1]) && typeof key[1] === "object") {
          tempFields.push([4, inArray && /^\d+$/.test(key[0]) ? "[" + key[0] + "]" : "." + key[0], tempFields.length]);
        } else if (Array.isArray(key[1]) && typeof key[1][0] === "string") {
          tempFields.push([6, inArray && /^\d+$/.test(key[0])? "[" + key[0] + "]" : "." + key[0], tempFields.length]);
        } else if (!Array.isArray(key[1]) && typeof key[1] === "string") {
          tempFields.push([7, inArray && /^\d+$/.test(key[0])? "[" + key[0] + "]" : "." + key[0], tempFields.length]);
        }
        setFields([...tempFields]);
      });
    }

    if (!importSignal) {
      level = level.substring(0, level.length - 2) / 20 - 1;
      fieldType = fieldType - 1;
      console.log(thisFieldName + parentString)

      if(parentString.substring(parentString.lastIndexOf('.'), parentString.length) === thisFieldName){
        tempFields.push([fieldType, "", tempFields.length]);
      }else{
        console.log(thisFieldName)
        console.log(parentString)
        tempFields.push([fieldType, inArray ? (parseInt(parentString.charAt(parentString.length-2)) != arrayIndex ? "[" + arrayIndex + "]" : "") + "." + thisFieldName : parseInt(thisFieldName.charAt(1)) === arrayIndex ? "" : "." + thisFieldName, tempFields.length]);
      }
      
      console.log(tempFields)
      setFields([...tempFields]);
      setShowDropDown(0);
      setSignShown(0);
    }
  };

  const handleRemoveField = () => {

    if(inArray){
      setDeleted(true)
      let tempRule = {...newRule}
      _.unset(tempRule, Object.keys(newRule)[0] + (parseInt(parentString.charAt(parentString.length-2)) === arrayIndex ? parentString : parentString + "[" + arrayIndex + "]" + "." + thisFieldName))
      
      setNewRule(tempRule)
        
    }
    
    if(!inArray){

      let tempRule = {...newRule}
      _.unset(tempRule, Object.keys(newRule)[0] + (parentString.substring(parentString.lastIndexOf('.'), parentString.length) === thisFieldName ? parentString : parentString + "." + thisFieldName))
      setDeleted(true)
      setNewRule(tempRule)
    }
  }


    useEffect(() => {
      let tempComponentsArray=[]
      if(newRule != null ){
        fields.map((e, i) => {
          {
            if (e[0] == 0) {
            
              tempComponentsArray.push(<NestedObjectComponent
                  paths={paths}
                  parentString={parentString === "" ? e[1] : e[1].charAt(e[1].length-1) === ']' ? parentString : parentString + (e[1].length > 1 ? e[1] : "")}
                  pathArrayIndex={e[2]}
                  inArray={0}
                  newRule={newRule}
                  marginLeft={marginLeft+20}
                  signShown={signShown}
                  showDropdown={showDropdown}
                  setShowDropDown={setShowDropDown}
                  handleShowSign={handleShowSign}
                  setNewRule={setNewRule}
                />)
            }
          }
          {
            if (e[0] == 1) {
              console.log(parentString)
              console.log(parentString.charAt(parentString.length-1))
              tempComponentsArray.push(<ObjectArrayComponent
                  paths={paths}
                  parentString={parentString === "" ? e[1] : e[1].charAt(e[1].length-1) === ']' ? parentString : parentString + (e[1].length > 1 ? e[1] : "")}
                  pathArrayIndex={e[2]}
                  inArray={0}
                  newRule={newRule}
                  marginLeft={marginLeft+20}
                  signShown={signShown}
                  showDropdown={showDropdown}
                  setShowDropDown={setShowDropDown}
                  handleShowSign={handleShowSign}
                  setNewRule={setNewRule}
                />)
            }
          }
          {
            if (e[0] == 2) {
              tempComponentsArray.push(<StringArrayElement
                  paths={paths}
                  parentString={parentString === "" ? e[1] : e[1].charAt(e[1].length-1) === ']' ? parentString : parentString + (e[1].length > 1 ? e[1] : "")}
                  pathArrayIndex={e[2]}
                  inArray={0}
                  newRule={newRule}
                  marginLeft={marginLeft+20}
                  signShown={signShown}
                  showDropdown={showDropdown}
                  setShowDropDown={setShowDropDown}
                  handleShowSign={handleShowSign}
                  setNewRule={setNewRule}
                />)
            }
          }
          {
            if (e[0] == 3) {
              tempComponentsArray.push(<FieldComponent
                  paths={paths}
                  parentString={parentString === "" ? e[1] : e[1].charAt(e[1].length-1) === ']' ? parentString : parentString + (e[1].length > 1 ? e[1] : "")}
                  pathArrayIndex={e[2]}
                  inArray={0}
                  newRule={newRule}
                  marginLeft={marginLeft+20}
                  signShown={signShown}
                  showDropdown={showDropdown}
                  setShowDropDown={setShowDropDown}
                  handleShowSign={handleShowSign}
                  setNewRule={setNewRule}
                />)
            }
          }
          {
            if (e[0] == 4) {
              tempComponentsArray.push(<NestedObjectComponent
                  paths={paths}
                  importField={e[1]}
                  parentString={parentString + e[1]}
                  pathArrayIndex={e[2]}
                  inArray={0}
                  newRule={newRule}
                  marginLeft={marginLeft+20}
                  signShown={signShown}
                  showDropdown={showDropdown}
                  setShowDropDown={setShowDropDown}
                  handleShowSign={handleShowSign}
                  setNewRule={setNewRule}
                  setFields={setFields}
                  goForRules={goForRules}
                />)
            }
          }
          {
            if (e[0] == 5) {
              tempComponentsArray.push(<ObjectArrayComponent
                  paths={paths}
                  importField={e[1]}
                  parentString={parentString + e[1]}
                  pathArrayIndex={e[2]}
                  inArray={0}
                  newRule={newRule}
                  marginLeft={marginLeft+20}
                  signShown={signShown}
                  showDropdown={showDropdown}
                  setShowDropDown={setShowDropDown}
                  handleShowSign={handleShowSign}
                  setNewRule={setNewRule}
                  setFields={setFields}
                  goForRules={goForRules}
                />)
            }
          }
          {
            if (e[0] == 6) {
              tempComponentsArray.push(<StringArrayElement
                  paths={paths}
                  importField={e[1]}
                  parentString={parentString + e[1]}
                  pathArrayIndex={e[2]}
                  inArray={0}
                  newRule={newRule}
                  marginLeft={marginLeft+20}
                  signShown={signShown}
                  showDropdown={showDropdown}
                  setShowDropDown={setShowDropDown}
                  handleShowSign={handleShowSign}
                  setNewRule={setNewRule}
                  setFields={setFields}
                  goForRules={goForRules}
                />)
            }
          }
          {
            if (e[0] == 7) {
              tempComponentsArray.push(<FieldComponent
                  paths={paths}
                  importField={e[1]}
                  parentString={parentString + e[1]}
                  pathArrayIndex={e[2]}
                  inArray={0}
                  newRule={newRule}
                  marginLeft={marginLeft+20}
                  signShown={signShown}
                  showDropdown={showDropdown}
                  setShowDropDown={setShowDropDown}
                  handleShowSign={handleShowSign}
                  setNewRule={setNewRule}
                  setFields={setFields}
                  goForRules={goForRules}
                />)
            }
  
            
          }
        })
      }

      setComponentsArray([...tempComponentsArray])

    }, [newRule, fields])

  return (
    <>
    {!deleted ? <>
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
              variant="outlined"
              size="small"
              style={{ transform: "translateY(-3px)" }}
              onKeyPress={(e) => handleRuleFieldUpdate(e, e.target.value, marginLeft, 1)}
              disabled={entered ? true : false}
              value={importedValue.replace(/[^a-zA-Z0-9_ ]/g, "")}
            />

            :

            <TextField
              variant="outlined"
              size="small"
              style={{ transform: "translateY(-3px)" }}
              onKeyPress={(e) => handleRuleFieldUpdate(e, e.target.value, marginLeft, importField ? 1 : 0)}
              disabled={entered ? true : false}
            />
      }
      {" : {"}
    </Typography>
    <>
    {componentsArray}
    </>
    


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
     : <></>}
  
  
  </>
  );
};

export default NestedObjectComponent;
