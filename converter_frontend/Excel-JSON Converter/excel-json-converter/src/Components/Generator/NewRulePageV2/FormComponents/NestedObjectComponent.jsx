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
import IntegerComponent from "./IntegerComponent";
import { MdExpandMore  } from "react-icons/md"
import "./styles.css"


const NestedObjectComponent = ({ newRule, marginLeft, setNewRule, setParentString, pathArrayIndex, parentString, inArray, arrayIndex, paths}) => {


  const ref = useRef()
  let _ = require('lodash');
  const [signShown, setSignShown] = useState(false);
  const [showDropdown , setShowDropDown] = useState(0);
  const [entered , setEntered] = useState(false);
  const [parents, setParents] = useState(parentString)
  let tempString = parentString;
  const [thisFieldName, setThisFieldName] = useState("")
  const[index, setIndex] = useState(-1)
  
  const [componentsArray, setComponentsArray] = useState([])
  const [fields , setFields] = useState([])
  const [hovering, setHovering] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [color, setColor] = useState("")
  const [collapsed, setCollapsed] = useState(false)
  

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
              {console.log(parentString)}
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
            if (e[0] == 8) {
              tempComponentsArray.push(<IntegerComponent
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
        })
      }

      setComponentsArray([...tempComponentsArray])

    }, [newRule, fields])

  return (
    <>
    {!deleted ? <>
      <span style={{position: "absolute" ,transform: "translateY(10px)", marginLeft:  `calc(${marginLeft}px)`, cursor: "pointer"}}>
        <MdExpandMore id="containerExpanded" onClick={() => setCollapsed(!collapsed)} className={collapsed ? "containerCollapsed" : "containerExpanded" } />
      </span>
    <Typography
      variant="h6"
      style={{ marginBottom: "10px", marginLeft: `calc(${marginLeft}px + 20px)` }}
    >
       <span onMouseEnter={() => setHovering(true)} onMouseLeave={()=> setHovering(false)} onClick={() => handleRemoveField()}><svg style={{marginRight: "8px", cursor: "pointer"}} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" 
      xmlns="http://www.w3.org/2000/svg" >
        <path fill={hovering ? "rgba(255, 55, 92, 1)" : "rgba(255, 55, 92, 0.2)"} stroke="rgb(255, 255, 255)" strokeWidth="2" d="M12,22 C17.5228475,22 22,17.5228475 22,12 C22,6.4771525 17.5228475,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 Z M6,12 L18,12"></path></svg>
      </span>
            <TextField
              variant="outlined"
              size="small"
              style={{ transform: "translateY(-3px)" }}
              onKeyPress={(e) => handleRuleFieldUpdate(e, e.target.value, marginLeft, 0)}
              disabled={entered ? true : false}
              inputProps={{ style: { fontWeight: "700" , fontSize: "16px" } }}
            />
      <span style={{fontSize: "1.5rem",color: `${color}`, fontWeight: "600"}}>{" : {"}</span>
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

                    <>
                    </>


            }
            </> : <></>}
    <Typography
      variant="h6"
      style={{ marginBottom: "10px", marginLeft: `${marginLeft}` + "px" }} >
        
        

        
      <span style={{fontSize: "1.5rem" , color: `${color}`, fontWeight: "600"}}>{" }"}</span>
    </Typography>
    
  </>
     : <></>}
  
  
  </>
  );
};

export default NestedObjectComponent;
