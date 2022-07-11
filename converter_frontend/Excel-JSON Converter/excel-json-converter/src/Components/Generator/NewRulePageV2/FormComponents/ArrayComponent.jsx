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
import StringArrayElement from "./StringArrayElement";


const ArrayComponent = ({ newRule, handleRuleUpdate, ruleTitle, maxRuleLineList, handleAddRuleLineListObject, 
                                  handleShowLineListSign, lineListSignShown, ruleLineListIndex, ruleListIndex, listCounters, marginLeft, setNewRule}) => {


  const ref = useRef()
  const [signShown, setSignShown] = useState(false);
  const [showDropdown , setShowDropDown] = useState(0);
  
  const [fields , setFields] = useState([0, 0, 0, 0])
  const [level1Fields, setLevel1Fields] = useState(fields[0]);
  const [entered , setEntered] = useState(false);
  const [parentString , setParentString] = useState("")

  const handleShowSign = () => {
    if (signShown) {
      setSignShown(false);
    } else {
      setSignShown(true);
    }
  };

  useEffect(() => {
    console.log(level1Fields)
    setLevel1Fields(fields[1])
  }, [fields]);



  const handleRuleFieldUpdate = (event,fieldName, level, objectType) => {
    //OBJECTTYPE 1 IS OBJECT
    //OBJECTYPE 2 IS OBJECT ARRAY
    //OBJECTTYPE 3 IS ARRAY
    //OBJECTYPE 4 IS FIELD

      var tempRule = cloneDeep(newRule);
      setParentString(parentString  + ".." + fieldName)

      // tempRule[`${fieldName}`] = tempRule[`${ruleTitle}`];
      // delete tempRule[`${ruleTitle}`];
      // setRuleTitle(name);
      // setTitleEntered(true);
      // setNewRule(tempRule);

      if(event != null){
        if (event.key === "Enter") {
          setNewRule(
            produce((draft) => {
              draft[ruleTitle][fieldName] = ""
            })
          )
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
      {" ["}
    </Typography>

    {[...Array(fields[0])].map((e, i) => <StringArrayElement inStringArray={1} marginLeft={marginLeft+20} signShown={signShown} showDropdown={showDropdown} setShowDropDown={setShowDropDown} handleShowSign={handleShowSign} setNewRule={setNewRule} setFields={setFields}/>)}
      
    {showDropdown ? 
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
              <MenuItem value={1}>Array Element</MenuItem>
              </TextField>
            </>
              
            :

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

export default ArrayComponent;
