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
import ArrayComponent from "./ArrayComponent.jsx"
import FieldComponent from "./FieldComponent"


const ObjectArrayComponent = ({ newRule, handleRuleUpdate, ruleTitle, maxRuleLineList, handleAddRuleLineListObject, 
                                  handleShowLineListSign, lineListSignShown, ruleLineListIndex, ruleListIndex, listCounters, marginLeft, setNewRule, parentString, setParentString}) => {


  const ref = useRef()
  const [signShown, setSignShown] = useState(false);
  const [showDropdown , setShowDropDown] = useState(0);
  const [entered , setEntered] = useState(false);
  
  const [fields , setFields] = useState([0, 0, 0, 0])

  const handleShowSign = () => {
    if (signShown) {
      setSignShown(false);
    } else {
      setSignShown(true);
    }
  };



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

      console.log(level)

      

      if(event != null){
        if (event.key === "Enter") {
          setParentString(parentString  + ".." + fieldName)
          var parentChain = parentString.split("..")
          console.log(parentChain)

          if(level == 1){
            
            setNewRule(
              produce((draft) => {
                draft[Object.keys(newRule)[0]] = {...draft[Object.keys(newRule)[0]] , [fieldName]: []}
              })
            )
          }

          if(level == 2){
            
            setNewRule(
              produce((draft) => {
                draft[Object.keys(newRule)[0]][parentChain[1]] = {...draft[Object.keys(newRule)[0]][parentChain[1]] , [fieldName]: []}
              })
            )
          }

          if(level == 3){
            
            setNewRule(
              produce((draft) => {
                draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]] = {...draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]] , [fieldName]: []}
              })
            )
          }

          if(level == 4){
            
            setNewRule(
              produce((draft) => {
                draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]] = {...draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]] , [fieldName]: []}
              })
            )
          }

          if(level == 5){
            
            setNewRule(
              produce((draft) => {
                draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]] = {...draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]] , [fieldName]: []}
              })
            )
          }

          if(level == 6){
            
            setNewRule(
              produce((draft) => {
                draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]] = {...draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]] , [fieldName]: []}
              })
            )
          }

          if(level == 7){
            
            setNewRule(
              produce((draft) => {
                draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]] = {...draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]] , [fieldName]: []}
              })
            )
          }

          if(level == 8){
            
            setNewRule(
              produce((draft) => {
                draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]][parentChain[7]] = {...draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]][parentChain[7]] , [fieldName]: []}
              })
            )
          }

          if(level == 9){
            
            setNewRule(
              produce((draft) => {
                draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]][parentChain[7]][parentChain[8]] = {...draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]][parentChain[7]][parentChain[8]] , [fieldName]: []}
              })
            )
          }

          if(level == 10){
            
            setNewRule(
              produce((draft) => {
                draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]][parentChain[7]][parentChain[8]][parentChain[9]] = {...draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]][parentChain[7]][parentChain[8]][parentChain[9]] , [fieldName]: []}
              })
            )
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
              disabled={entered ? true : false}
              onKeyPress={(e) => handleRuleFieldUpdate(e, e.target.value, marginLeft, 2)}
            />
      {" : ["}
    </Typography>

    {[...Array(fields[0])].map((e, i) => <NestedObjectComponent inArray={1} parentString={parentString} setParentString={setParentString} newRule={newRule} marginLeft={marginLeft+20} signShown={signShown} showDropdown={showDropdown} setShowDropDown={setShowDropDown} handleShowSign={handleShowSign} setNewRule={setNewRule} setFields={setFields}/>)}
      {[...Array(fields[1])].map((e, i) => <ObjectArrayComponent inArray={1} parentString={parentString} setParentString={setParentString} newRule={newRule} marginLeft={marginLeft+20} signShown={signShown} showDropdown={showDropdown} setShowDropDown={setShowDropDown} handleShowSign={handleShowSign} setNewRule={setNewRule} setFields={setFields}/>)}
      {[...Array(fields[2])].map((e, i) => <ArrayComponent inArray={1} parentString={parentString} setParentString={setParentString} newRule={newRule} marginLeft={marginLeft+20} signShown={signShown} showDropdown={showDropdown} setShowDropDown={setShowDropDown} handleShowSign={handleShowSign} setNewRule={setNewRule} setFields={setFields}/>)}
      {[...Array(fields[3])].map((e, i) => <FieldComponent inArray={1} parentString={parentString} setParentString={setParentString} newRule={newRule} marginLeft={marginLeft+20} signShown={signShown} showDropdown={showDropdown} setShowDropDown={setShowDropDown} handleShowSign={handleShowSign} setNewRule={setNewRule} setFields={setFields}/>)}

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

                    <></>


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

export default ObjectArrayComponent;
