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


const NestedObjectComponent = ({ newRule, marginLeft, setNewRule, setParentString, pathArrayIndex, parentString, inArray, paths, importField, goForRules, tempNewRule, arrayIndex}) => {


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
          



          tempString = tempString === undefined ? "." + fieldName : tempString + "." + fieldName
          setParents(tempString)

            var parentChain = tempString.split(".")
        

            if(inArray){
              setIndex( _.get(newRule , Object.keys(newRule)[0] + parentString).length)
               
              setThisFieldName(fieldName)
            }else{
              setThisFieldName(fieldName)
            }

            if(inArray){
              let tempRule = {...newRule}
              let tempArray = _.get(tempRule, Object.keys(newRule)[0] + parentString)
              tempArray.push({[fieldName] : {}})

              _.set(tempRule, Object.keys(newRule)[0] + parentString, tempArray)

                  setNewRule(tempRule)
                
            }
            
            if(!inArray){
              let tempRule = {...newRule}
              _.set(tempRule, Object.keys(newRule)[0] + tempString, {})
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
          tempFields.push([5, inArray ? "[" + key[0] + "]" : "." + key[0], tempFields.length]);
        } else if (!Array.isArray(key[1]) && typeof key[1] === "object") {
          tempFields.push([4, inArray ? "[" + key[0] + "]" : "." + key[0], tempFields.length]);
        } else if (Array.isArray(key[1]) && typeof key[1][0] === "string") {
          tempFields.push([6, inArray ? "[" + key[0] + "]" : "." + key[0], tempFields.length]);
        } else if (!Array.isArray(key[1]) && typeof key[1] === "string") {
          tempFields.push([7, inArray ? "[" + key[0] + "]" : "." + key[0], tempFields.length]);
        }
        setFields([...tempFields]);
      });
    }

    if (!importSignal) {
      level = level.substring(0, level.length - 2) / 20 - 1;
      fieldType = fieldType - 1;
      console.log("we are here")
      console.log(parentString)

      if(parentString === thisFieldName){
        tempFields.push([fieldType, "", tempFields.length]);
      }else{
        tempFields.push([fieldType, "." + thisFieldName, tempFields.length]);
      }
      

      setFields([...tempFields]);
      setShowDropDown(0);
      setSignShown(0);
    }
  };


    useEffect(() => {
      let tempComponentsArray=[]
      console.log(fields)
      if(newRule != null ){
        fields.map((e, i) => {
          {
            if (e[0] == 0) {
            
              tempComponentsArray.push(<NestedObjectComponent
                  paths={paths}
                  parentString={parentString === "" ? e[1] : parentString + e[1]}
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
              tempComponentsArray.push(<ObjectArrayComponent
                  paths={paths}
                  parentString={parentString === "" ? e[1] : parentString + e[1]}
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
                  parentString={parentString === "" ? e[1] : parentString + e[1]}
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
                  parentString={parentString === "" ? e[1] : parentString + e[1]}
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
    <Typography
      variant="h6"
      style={{ marginBottom: "10px", marginLeft: `calc(${marginLeft}px + 20px)` }}
    >
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
              onKeyPress={(e) => handleRuleFieldUpdate(e, e.target.value, marginLeft, 1)}
              disabled={entered ? true : false}
            />
      }
      {" : {"}
    </Typography>

    {/* {goForRules && importedValue ? 
    <>
      {Object.entries(_.get(newRule, Object.keys(newRule)[0] + parentString)).map((key) => {
      let objArrayIndex = 0;
      console.log(newRule)
      if (Array.isArray(key[1]) && typeof key[1][0] === "object") {
        paths[arrayIndex] = paths[arrayIndex] + "." + key[0]
        return (<ObjectArrayComponent
          paths={paths}
          importField={key[0] ? key[0] : 0}
          pathArrayIndex={arrayIndex}
          parentString={parentString + "." + key[0]}
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
      } else if (!Array.isArray(key[1]) && typeof key[1] === "object") {
        paths[arrayIndex] = paths[arrayIndex] + "." + key[0]
        return (<NestedObjectComponent
          paths={paths}
          importField={key[0] != "" ? key[0] : 0}
          pathArrayIndex={arrayIndex}
          parentString={parentString + "." + key[0]}
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
      } else if (Array.isArray(key[1]) && typeof key[1][0] === "string") {
        paths[arrayIndex] = paths[arrayIndex] + "." + key[0]
        return (<StringArrayElement
          paths={paths}
          importField={key[0]}
          pathArrayIndex={arrayIndex}
          parentString={parentString + "." + key[0]}
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

      } else if (!Array.isArray(key[1]) && typeof key[1] === "string") {
        return (<FieldComponent
          paths={paths}
          importField={key[0]}
          pathArrayIndex={arrayIndex}
          parentString={parentString + "." + key[0]}
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
    } */}
    <>
    {componentsArray}
    </>
    

    {/* {[...Array(fields[0])].map((e, i) => <NestedObjectComponent  tempNewRule={tempNewRule} inArray={0} parentString={importField ? parentString : tempString === undefined ? "." +  thisFieldName : tempString + (inArray ? "[" + index + "]" + "." + thisFieldName : "." + thisFieldName)} setParentString={setParentString} newRule={newRule} marginLeft={marginLeft+20} signShown={signShown} showDropdown={showDropdown} setShowDropDown={setShowDropDown} handleShowSign={handleShowSign} setNewRule={setNewRule} setFields={setFields}/>)}
      {[...Array(fields[1])].map((e, i) => <ObjectArrayComponent inArray={0} parentString={importField ? parentString :tempString === undefined ? "." +  thisFieldName : tempString + (inArray ? "[" + index + "]" + "." + thisFieldName : "." + thisFieldName)} setParentString={setParentString} newRule={newRule} marginLeft={marginLeft+20} signShown={signShown} showDropdown={showDropdown} setShowDropDown={setShowDropDown} handleShowSign={handleShowSign} setNewRule={setNewRule} setFields={setFields}/>)}
      {[...Array(fields[2])].map((e, i) => <StringArrayElement inArray={0} parentString={importField ? parentString :tempString === undefined ? "." +  thisFieldName : tempString + (inArray ? "[" + index + "]" + "." + thisFieldName : "." + thisFieldName)} setParentString={setParentString} newRule={newRule} marginLeft={marginLeft} signShown={signShown} showDropdown={showDropdown} setShowDropDown={setShowDropDown} handleShowSign={handleShowSign} setNewRule={setNewRule} setFields={setFields}/>)}
      {[...Array(fields[3])].map((e, i) => <FieldComponent inArray={0} parentString={importField ? parentString :tempString === undefined ? "." +  thisFieldName : tempString + (inArray ? "[" + index + "]" + "." + thisFieldName : "." + thisFieldName)} setParentString={setParentString} newRule={newRule} marginLeft={marginLeft+20} signShown={signShown} showDropdown={showDropdown} setShowDropDown={setShowDropDown} handleShowSign={handleShowSign} setNewRule={setNewRule} setFields={setFields}/>)} */}

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
