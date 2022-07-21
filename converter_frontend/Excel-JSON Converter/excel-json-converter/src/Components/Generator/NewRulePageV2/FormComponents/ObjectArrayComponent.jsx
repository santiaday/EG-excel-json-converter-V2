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
import NestedObjectComponent from "./NestedObjectComponent";
import FieldComponent from "./FieldComponent"
import StringArrayElement from "./StringArrayElement";
import IntegerComponent from "./IntegerComponent";
import { MdExpandMore  } from "react-icons/md"


const ObjectArrayComponent = ({ newRule, handleRuleUpdate, ruleTitle, maxRuleLineList, handleAddRuleLineListObject, 
                                  handleShowLineListSign, lineListSignShown, ruleLineListIndex, ruleListIndex, listCounters, marginLeft, setNewRule, parentString, setParentString, inArray, parentFields, arrayIndex, setParentFields}) => {


  const ref = useRef()
  const [signShown, setSignShown] = useState(false);
  const [showDropdown , setShowDropDown] = useState(0);
  const [entered , setEntered] = useState(false);
  const [parents, setParents] = useState(parentString)
  let tempString = parentString;
  const [thisFieldName, setThisFieldName] = useState("")
  const[index, setIndex] = useState(-1)
  
  const [fields , setFields] = useState([])
  const [componentsArray, setComponentsArray] = useState([])
  const [deleted, setDeleted] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [color, setColor] = useState("")
  const [collapsed, setCollapsed] = useState(false)
  
  let _ = require('lodash');

  

  const handleShowSign = () => {
    if (signShown) {
      setSignShown(false);
    } else {
      setSignShown(true);
    }
  };

  useEffect(() => {
    let tempColor = marginLeft/20;

    if(tempColor == 1 || tempColor == 6){
      setColor("rgb(255, 55, 92)")
    }else if(tempColor == 2 || tempColor == 7){
      setColor("#57deb7")
    }else if(tempColor == 3 || tempColor == 8){
      setColor("rgb(255,255,0)")
    }else if(tempColor == 4 || tempColor == 9){
      setColor("rgb(255,0,255)")
    }else if(tempColor == 5 || tempColor == 10){
      setColor("rgb(255,165,0)")
    }else{
      setColor("#000099")
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
            console.log(parentString)
            console.log(newRule)
            setIndex( _.get(newRule , Object.keys(newRule)[0] + parentString).length)
            console.log(index)
             
            setThisFieldName(fieldName)
          }else{
            setThisFieldName(fieldName)
          }

            
          
          
          console.log(tempString)
          tempString = tempString === undefined ? "." +  fieldName : tempString + "." + fieldName
          console.log(tempString)
          setParents(tempString)

            var parentChain = tempString.split("..")

            if(inArray){
              let tempRule = {...newRule}
              let tempArray = _.get(tempRule, Object.keys(newRule)[0] + parentString)
              console.log(newRule)
              console.log(parentString)
              console.log(tempArray)
              tempArray.push({[fieldName] : []})
              console.log(tempArray)

              _.set(tempRule, Object.keys(newRule)[0] + parentString, tempArray)

                  setNewRule(tempRule)
                
            }
            
            if(!inArray){
              let tempRule = {...newRule}
              _.set(tempRule, Object.keys(newRule)[0] + tempString, [])
              setNewRule(tempRule)
            }
          
          setEntered(true)
          }

          
      }

      
      

  }


  const handleRemoveField = () => {

    if(inArray){
      setDeleted(true)
      let tempRule = {...newRule}
      let tempFields = [...parentFields]
      console.log(parentString)
      console.log(thisFieldName)
      _.unset(tempRule, Object.keys(newRule)[0] + (parseInt(parentString.charAt(parentString.length-2)) === arrayIndex ? parentString : parentString + "[" + arrayIndex + "]" + "." + thisFieldName))

    
      setParentFields(tempFields)
      
      setNewRule(tempRule)
        
    }
    
    if(!inArray){
      console.log(parentString)
      console.log(thisFieldName)
      let tempRule = {...newRule}
      _.unset(tempRule, Object.keys(newRule)[0] + (parentString.substring(parentString.lastIndexOf('.'), parentString.length) === thisFieldName ? parentString : thisFieldName.length > 0 ? parentString + "." + thisFieldName : parentString))
      setDeleted(true)
      setNewRule(tempRule)
    }
  }



  const handleAddField = (fieldType, level, importSignal) => {
    let tempFields = fields;
    
    if (importSignal && fields.length == 0) {
      Object.entries(_.get(newRule, Object.keys(newRule)[0] + parentString)).map((key) => {
        if (Array.isArray(key[1]) && typeof key[1][0] === "object") {
          tempFields.push([5, inArray ? "[" + key[0] + "]" : "[" + key[0] + "]", tempFields.length]);
        } else if (!Array.isArray(key[1]) && typeof key[1] === "object") {
          tempFields.push([4, inArray ? "[" + key[0] + "]" : "[" + key[0] + "]", tempFields.length]);
        } else if (Array.isArray(key[1]) && typeof key[1][0] === "string") {
          tempFields.push([6, inArray ? "[" + key[0] + "]" : "[" + key[0] + "]", tempFields.length]);
        } else if (!Array.isArray(key[1]) && typeof key[1] === "string") {
          tempFields.push([7, inArray ? "[" + key[0] + "]" : "[" + key[0] + "]", tempFields.length]);
        }
        setFields([...tempFields]);
      });
    }

    if (!importSignal) {
      
      level = level.substring(0, level.length - 2) / 20 - 1;
      fieldType = fieldType - 1;

      if(parentString === thisFieldName){
        tempFields.push([fieldType, "", tempFields.length]);
      }else{
        tempFields.push([fieldType, inArray ? (parseInt(parentString.charAt(parentString.length-2)) != arrayIndex ? "[" + arrayIndex + "]" : "") + "." + thisFieldName : parseInt(thisFieldName.charAt(1)) === arrayIndex ? "" : "." + thisFieldName, tempFields.length]);
      }

      setFields([...tempFields]);
      setShowDropDown(0);
      setSignShown(0);
    }
  };


    useEffect(() => {


      let tempComponentsArray=[]
      

      if(newRule != null && fields.length > 0){
        fields.map((e, i) => {
          {
            if (e[0] == 0) {
              console.log(parentString)
              console.log(e[1])
              tempComponentsArray.push(<NestedObjectComponent
                  parentString={parentString === "" ? e[1] : e[1].charAt(e[1].length-1) === ']' ? parentString : parentString + (e[1].length > 1 ? e[1] : "")}
                  pathArrayIndex={e[2]}
                  inArray={1}
                  arrayName={parentString}
                  newRule={newRule}
                  marginLeft={marginLeft+20}
                  signShown={signShown}
                  showDropdown={showDropdown}
                  setShowDropDown={setShowDropDown}
                  handleShowSign={handleShowSign}
                  setNewRule={setNewRule}
                  arrayIndex={e[2]}
                  parentFields={fields}
                  setParentFields={setFields}
                />)
            }
          }
          {
            if (e[0] == 1) {
              console.log(e[1])
              console.log(parentString)
              tempComponentsArray.push(<ObjectArrayComponent
                  parentString={parentString === "" ? e[1] : e[1].charAt(e[1].length-1) === ']' ? parentString : parentString + (e[1].length > 1 ? e[1] : "")}
                  pathArrayIndex={e[2]}
                  inArray={1}
                  newRule={newRule}
                  marginLeft={marginLeft+20}
                  signShown={signShown}
                  showDropdown={showDropdown}
                  setShowDropDown={setShowDropDown}
                  handleShowSign={handleShowSign}
                  setNewRule={setNewRule}
                  arrayIndex={e[2]}
                  parentFields={fields}
                  setParentFields={setFields}
                />)
            }
          }
          {
            if (e[0] == 2) {
              tempComponentsArray.push(<StringArrayElement
                  parentString={parentString === "" ? e[1] : e[1].charAt(e[1].length-1) === ']' ? parentString : parentString + (e[1].length > 1 ? e[1] : "")}
                  pathArrayIndex={e[2]}
                  inArray={1}
                  newRule={newRule}
                  marginLeft={marginLeft+20}
                  signShown={signShown}
                  showDropdown={showDropdown}
                  setShowDropDown={setShowDropDown}
                  handleShowSign={handleShowSign}
                  setNewRule={setNewRule}
                  arrayIndex={e[2]}
                />)
            }
          }
          {
            if (e[0] == 3) {
              console.log(e[1])
              tempComponentsArray.push(<FieldComponent
                  parentString={parentString === "" ? e[1] : e[1].charAt(e[1].length-1) === ']' ? parentString : parentString + (e[1].length > 1 ? e[1] : "")}
                  pathArrayIndex={e[2]}
                  inArray={1}
                  newRule={newRule}
                  marginLeft={marginLeft+20}
                  signShown={signShown}
                  showDropdown={showDropdown}
                  setShowDropDown={setShowDropDown}
                  handleShowSign={handleShowSign}
                  setNewRule={setNewRule}
                  arrayIndex={e[2]}
                  fields={fields}
                  setFields={setFields}
                />)
            }
          }
          {
            if (e[0] == 8) {
              console.log(e[1])
              tempComponentsArray.push(<IntegerComponent
                  parentString={parentString === "" ? e[1] : e[1].charAt(e[1].length-1) === ']' ? parentString : parentString + (e[1].length > 1 ? e[1] : "")}
                  pathArrayIndex={e[2]}
                  inArray={1}
                  newRule={newRule}
                  marginLeft={marginLeft+20}
                  signShown={signShown}
                  showDropdown={showDropdown}
                  setShowDropDown={setShowDropDown}
                  handleShowSign={handleShowSign}
                  setNewRule={setNewRule}
                  arrayIndex={e[2]}
                  fields={fields}
                  setFields={setFields}
                />)
            }
          }
          
        })
      }
      setComponentsArray([...tempComponentsArray])
  
    }, [newRule, fields])

  return (
    <>
    {!deleted ?
    <>
    <span style={{position: "absolute" ,transform: "translateY(10px)", marginLeft:  `calc(${marginLeft}px)`, cursor: "pointer"}}>
        <MdExpandMore id="containerExpanded" onClick={() => setCollapsed(!collapsed)} className={collapsed ? "containerCollapsed" : "containerExpanded" } />
      </span>
    <Typography
      variant="h6"
      style={{ marginBottom: "10px", marginLeft: `calc(${marginLeft}px + 20px)` }}
    >

<span onMouseEnter={() => setHovering(true)} onMouseLeave={()=> setHovering(false)} onClick={() => handleRemoveField()}><svg style={{ marginRight: "8px", cursor: "pointer"}} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" 
      xmlns="http://www.w3.org/2000/svg" >
        <path fill={hovering ? "rgba(255, 55, 92, 1)" : "rgba(255, 55, 92, 0.2)"} stroke="rgb(255, 255, 255)" strokeWidth="2" d="M12,22 C17.5228475,22 22,17.5228475 22,12 C22,6.4771525 17.5228475,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 Z M6,12 L18,12"></path></svg>
      </span>
            
            <TextField
              variant="outlined"
              size="small"
              style={{ transform: "translateY(-3px)" }}
              disabled={entered ? true : false}
              onKeyPress={(e) => handleRuleFieldUpdate(e, e.target.value, marginLeft, 2)}
              inputProps={{ style: { fontWeight: "700" , fontSize: "16px" } }}
            />
      <span style={{fontSize: "1.5rem" , color: `${color}`, fontWeight: "600"}}>{" : ["}</span>
    </Typography>

    {!collapsed ? 
    <>
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
        <MenuItem value={9}>Integer</MenuItem>
        
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

                    <></>


            }
            </> : <></>}
    <Typography
      variant="h6"
      style={{ marginBottom: "10px", marginLeft: `${marginLeft}` + "px" }}
    >
      <span style={{fontSize: "1.5rem" , color: `${color}`, fontWeight: "600"}}>{" ]"}</span>
    </Typography>
    
  </>
  : <></>}
  </>
  );
};

export default ObjectArrayComponent;
