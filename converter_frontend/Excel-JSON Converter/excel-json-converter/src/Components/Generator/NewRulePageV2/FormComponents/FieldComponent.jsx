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

const FieldComponent = ({ newRule, handleRuleUpdate, ruleTitle, maxRuleLineList, handleAddRuleLineListObject, 
                                  handleShowLineListSign, lineListSignShown, ruleLineListIndex, ruleListIndex, listCounters, marginLeft, setNewRule, parentString, setParentString, branchParentString, inArray}) => {


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



  const handleRuleFieldUpdate = (event,fieldName, level, objectType, isValue) => {

    level = (level / 20) - 1
    console.log(parentString)

    console.log(level)

      if(event != null){
        if (event.key === "Enter") {

          if(parentChain != "" && level != 1){
            var parentChain = parentString.split("..")
          }
          
          
          console.log(parentString)

          if(!isValue){
                    setFieldNameEntered(fieldName)
              }

          if(inArray && isValue){
            let tempRule = {...newRule}
            let tempArray = _.get(tempRule, Object.keys(newRule)[0] + parentString)
            console.log(parentString)
            console.log(tempArray)
            tempArray.push({[fieldNameEntered] : fieldName})

            _.set(tempRule, Object.keys(newRule)[0] + parentString, tempArray)
            setValueEntered(true)

                setNewRule(tempRule)
              
          }
          
          if(!inArray && isValue){
            let tempRule = {...newRule}
            _.set(tempRule, Object.keys(newRule)[0] + parentString + "." + fieldNameEntered, fieldName)
            setValueEntered(true)
            setNewRule(tempRule)
          }

          setEntered(true)
          setFieldEntered(true)

          // if(level == 1){
          //   console.log("this is level 1")
          //   if(!isValue){
          //       setNewRule(
          //           produce((draft) => {
          //             draft[Object.keys(newRule)[0]] = {...draft[Object.keys(newRule)[0]] , [fieldName]: ""}
          //           })
          //         )
          //         setFieldNameEntered(fieldName)
          //   }
          //   if(isValue){
          //       setNewRule(
          //           produce((draft) => {
          //             draft[Object.keys(newRule)[0]] = {...draft[Object.keys(newRule)[0]] , [fieldNameEntered]: fieldName}
          //           })
          //         )

          //         setValueEntered(true)
          //   }
            
            
          // }

          // if(level == 2){
          //   console.log("GOT HERE " + level + inArray)
          //   if(!inArray){
          //     if(!isValue){
          //       setNewRule(
          //         produce((draft) => {
          //           draft[Object.keys(newRule)[0]][parentChain[1]] = {...draft[Object.keys(newRule)[0]][parentChain[1]] , [fieldName]: ""}
          //         })
          //       )
          //       setFieldNameEntered(fieldName)

          //   }
          //   if(isValue){
          //     setNewRule(
          //       produce((draft) => {
          //         draft[Object.keys(newRule)[0]][parentChain[1]] = {...draft[Object.keys(newRule)[0]][parentChain[1]] , [fieldNameEntered]: fieldName}
          //       })
          //     )

          //     setValueEntered(true)
          //   }
          //   }

          //   if(inArray){
          //     if(!isValue){

          //           setFieldNameEntered(fieldName)
          //     }
          //     if(isValue){
          //       let tempRule = {...newRule}
          //         console.log("here")
          //         tempRule[Object.keys(newRule)[0]][parentChain[1]].push({[`${fieldNameEntered}`] : fieldName})

          //         setNewRule(tempRule)
  
          //           setValueEntered(true)
          //     }
          //   }
            
            
          // }

          // if(level == 3){
          //   console.log("GOT HERE " + level + inArray)
          //   if(inArray){
          //     if(!isValue){
    

          //           setFieldNameEntered(fieldName)
          //     }
          //     if(isValue){
          //       let tempRule = {...newRule}
          //         console.log("here")
          //         _.set(tempRule, Object.keys(newRule)[0] + parentString + "." + fieldNameEntered, fieldName)

          //         setNewRule(tempRule)
  
          //           setValueEntered(true)
          //     }
          //   }

          //   if(!inArray){
          //     if(!isValue){
          //           setFieldNameEntered(fieldName)
          //     }
          //     if(isValue){
          //       let tempRule = {...newRule}

          //       _.set(tempRule, Object.keys(newRule)[0] + parentString + "." + fieldNameEntered, fieldName)

          //         setNewRule(tempRule)
  
          //           setValueEntered(true)
          //     }
          //   }
          // }

          // if(level == 4){
          //   console.log("GOT HERE " + level + inArray)
          //   if(!inArray){
          //     if(!isValue){
          //       setNewRule(
          //         produce((draft) => {
          //           draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]] = {...draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]] , [fieldName]: ""}
          //         })
          //       )

          //         setFieldNameEntered(fieldName)
          //   }
          //   if(isValue){
          //     setNewRule(
          //       produce((draft) => {
          //         draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]] = {...draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]] , [fieldNameEntered]: fieldName}
          //       })
          //     )

          //     setValueEntered(true)
          //   }
          //   }

          //   if(inArray){
          //     if(!isValue){
          //       console.log("here")
          //       let tempRule = {...newRule}
          //       tempRule[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][fieldName] = ""

          //       setNewRule(tempRule)

          //         setFieldNameEntered(fieldName)
          //   }
          //   if(isValue){
          //       console.log("here")
          //       let tempRule = {...newRule}
          //       tempRule[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][fieldNameEntered] = fieldName

          //       setNewRule(tempRule)

          //         setValueEntered(true)
          //   }
          //   }
            
            
          // }

          // if(level == 5){
          //   console.log("GOT HERE " + level + inArray)
          //   if(!inArray){
          //     if(!isValue){
          //       setNewRule(
          //         produce((draft) => {
          //           draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]] = {...draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]] , [fieldName]: ""}
          //         })
          //       )

          //         setFieldNameEntered(fieldName)
          //   }
          //   if(isValue){
          //     setNewRule(
          //       produce((draft) => {
          //         draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]] = {...draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]] , [fieldNameEntered]: fieldName}
          //       })
          //     )

          //     setValueEntered(true)
          //   }
          //   }

          //   if(inArray){
          //     if(!isValue){
          //       let tempRule = {...newRule}
          //       console.log("here")
          //       tempRule[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][fieldName] = ""

          //       setNewRule(tempRule)

          //         setFieldNameEntered(fieldName)
          //   }
          //   if(isValue){
          //       console.log("here")
          //       let tempRule = {...newRule}
          //       tempRule[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][fieldNameEntered] = fieldName

          //       setNewRule(tempRule)

          //         setValueEntered(true)
          //   }
          //   }
            
            
          // }

          // if(level == 6){
          //   console.log("GOT HERE " + level + inArray)
          //   if(!inArray){
          //     if(!isValue){
          //       setNewRule(
          //         produce((draft) => {
          //           draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]] = {...draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]] , [fieldName]: ""}
          //         })
          //       )
          //       setFieldNameEntered(fieldName)

          //         setFieldNameEntered(fieldName)
          //   }
          //   if(isValue){
          //     setNewRule(
          //       produce((draft) => {
          //         draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]] = {...draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]] , [fieldNameEntered]: fieldName}
          //       })
          //     )

          //     setValueEntered(true)
          //   }
          //   }

          //   if(inArray){
          //     if(!isValue){
          //       let tempRule = {...newRule}
          //       console.log("here")
          //       tempRule[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][fieldName] = ""

          //       setNewRule(tempRule)

          //         setFieldNameEntered(fieldName)
          //   }
          //   if(isValue){
          //       console.log("here")
          //       let tempRule = {...newRule}
          //       tempRule[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][fieldNameEntered] = fieldName

          //       setNewRule(tempRule)

          //         setValueEntered(true)
          //   }
          //   }
            
            
          // }

          // if(level == 7){
          //   console.log("GOT HERE " + level)
          //   if(!inArray){
          //     if(!isValue){
          //       setNewRule(
          //         produce((draft) => {
          //           draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]] = {...draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]] , [fieldName]: ""}
          //         })
          //       )
          //       setFieldNameEntered(fieldName)

          //         setFieldNameEntered(fieldName)
          //   }
          //   if(isValue){
          //     setNewRule(
          //       produce((draft) => {
          //         draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]] = {...draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]] , [fieldNameEntered]: fieldName}
          //       })
          //     )

          //     setValueEntered(true)
          //   }
          //   }

          //   if(inArray){
          //     if(!isValue){
          //       let tempRule = {...newRule}
          //       console.log("here")
          //       tempRule[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]][fieldName] = ""

          //       setNewRule(tempRule)

          //         setFieldNameEntered(fieldName)
          //   }
          //   if(isValue){
          //       console.log("here")
          //       let tempRule = {...newRule}
          //       tempRule[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]][fieldNameEntered] = fieldName

          //       setNewRule(tempRule)

          //         setValueEntered(true)
          //   }
          //   }
            
            
          // }

          // if(level == 8){
          //   console.log("GOT HERE " + level)
          //   if(!inArray){
          //     if(!isValue){
          //       setNewRule(
          //         produce((draft) => {
          //           draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]][parentChain[7]] = {...draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]][parentChain[7]] , [fieldName]: ""}
          //         })
          //       )
          //       setFieldNameEntered(fieldName)

          //         setFieldNameEntered(fieldName)
          //   }
          //   if(isValue){
          //     setNewRule(
          //       produce((draft) => {
          //         draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]][parentChain[7]] = {...draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]][parentChain[7]] , [fieldNameEntered]: fieldName}
          //       })
          //     )

          //     setValueEntered(true)
          //   }
          //   }

          //   if(inArray){
          //       if(!isValue){
          //           let tempNewRule = {...newRule}
          //           tempNewRule[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]][parentChain[7]][fieldName] = ""

          //           setNewRule(tempNewRule)

          //             setFieldNameEntered(fieldName)
          //       }
          //       if(isValue){
          //         let tempNewRule = {...newRule}
          //         tempNewRule[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]][parentChain[7]][fieldNameEntered] = fieldName

          //           setNewRule(tempNewRule)
    
          //             setValueEntered(true)
          //       }
          //   }

            
          // }

          // if(level == 9){
          //   console.log("GOT HERE " + level)
          //   if(!inArray){
          //     if(!isValue){
          //       setNewRule(
          //         produce((draft) => {
          //           draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]][parentChain[7]][parentChain[8]] = {...draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]][parentChain[7]][parentChain[8]] , [fieldName]: ""}
          //         })
          //       )
          //       setFieldNameEntered(fieldName)

          //         setFieldNameEntered(fieldName)
          //   }
          //   if(isValue){
          //     setNewRule(
          //       produce((draft) => {
          //         draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]][parentChain[7]][parentChain[8]] = {...draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]][parentChain[7]][parentChain[8]] , [fieldNameEntered]: fieldName}
          //       })
          //     )

          //     setValueEntered(true)
          //   }
          //   }

          //   if(inArray){
          //     if(!isValue){
          //       let tempNewRule = {...newRule}
          //       tempNewRule[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]][parentChain[7]][fieldName] = ""

          //       setNewRule(tempNewRule)

          //         setFieldNameEntered(fieldName)
          //   }
          //   if(isValue){
          //     let tempNewRule = {...newRule}
          //     tempNewRule[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]][parentChain[7]][fieldNameEntered] = fieldName

          //       setNewRule(tempNewRule)

          //         setValueEntered(true)
          //   }
          //   }
            
            
          // }

          // if(level == 10){
            
          //   if(!inArray){
          //     if(!isValue){
          //       setNewRule(
          //         produce((draft) => {
          //           draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]][parentChain[7]][parentChain[8]][parentChain[9]] = {...draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]][parentChain[7]][parentChain[8]][parentChain[9]] , [fieldName]: ""}
          //         })
          //       )
          //       setFieldNameEntered(fieldName)

          //         setFieldNameEntered(fieldName)
          //   }
          //   if(isValue){
          //     setNewRule(
          //       produce((draft) => {
          //         draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]][parentChain[7]][parentChain[8]][parentChain[9]] = {...draft[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]][parentChain[7]][parentChain[8]][parentChain[9]]  , [fieldNameEntered]: fieldName}
          //       })
          //     )

          //     setValueEntered(true)
          //   }
          //   }

          //   if(inArray){
          //     if(!isValue){
          //       let tempNewRule = {...newRule}
          //       tempNewRule[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]][parentChain[7]][parentChain[8]][fieldName] = ""

          //       setNewRule(tempNewRule)

          //         setFieldNameEntered(fieldName)
          //   }
          //   if(isValue){
          //     let tempNewRule = {...newRule}
          //     tempNewRule[Object.keys(newRule)[0]][parentChain[1]][parentChain[2]][parentChain[3]][parentChain[4]][parentChain[5]][parentChain[6]][parentChain[7]][parentChain[8]][fieldNameEntered] = fieldName

          //       setNewRule(tempNewRule)

          //         setValueEntered(true)
          //   }
            // }
            
            
          // }
          
          
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
      onKeyPress={(e) => handleRuleFieldUpdate(e, e.target.value, marginLeft+20, 4, 0)}
              variant="outlined"
              size="small"
              style={{ transform: "translateY(-3px)" }}
              disabled={fieldEntered ? true : false}
            />
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
  );
};

export default FieldComponent;
