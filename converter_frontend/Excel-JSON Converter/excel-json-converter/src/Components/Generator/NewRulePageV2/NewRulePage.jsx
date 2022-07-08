import React, { useState, useCallback, useEffect, useRef } from "react";
import useStyles from "./newRulePageStyles";
import { Container, Typography, Button, TextField, MenuItem } from "@material-ui/core";
import { FilePicker } from "react-file-picker";
import Dropzone, { useDropzone } from "react-dropzone";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ApiService from "../../../http-common";
import RuleObject from "../RuleObject/RuleObject";
import { IoArrowDownOutline } from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io";
import cloneDeep from "lodash/cloneDeep";
import "./newRulePageStyles.css";
import NestedObjectComponent from "./FormComponents/NestedObjectComponent.jsx";
import ObjectArrayComponent from "./FormComponents/ObjectArrayComponent.jsx"
import ArrayComponent from "./FormComponents/ArrayComponent.jsx"
import FieldComponent from "./FormComponents/FieldComponent"
import RuleUpdateConfirmationPopup from "./RuleUpdateConfirmation/RuleUpdateConfirmationPopup";
import produce from "immer";


const NewRulePage = ({}) => {
  const ref = React.useRef()

  const location = useLocation();
  let ruleNames = location.state.ruleNames
  let rules = location.state.rules
  const classes = useStyles();
  const [titleEntered, setTitleEntered] = useState(false);
  const [ruleTitle, setRuleTitle] = useState("title");
  const [ruleUpdatePopup , setRuleUpdatePopup] = useState(0);
  const [listCounters, setRuleListCounters] = useState({
    rule_list: 0,
    rule_line_list: [
      { rule_list_index: 0, rule_line_list_count: 0, max: false },
      { rule_list_index: 1, rule_line_list_count: 0, max: false },
      { rule_list_index: 2, rule_line_list_count: 0, max: false },
      { rule_list_index: 3, rule_line_list_count: 0, max: false },
    ],
  });
  const [signShown, setSignShown] = useState(false);
  const [maxRuleList, setMaxRuleList] = useState(false);
  const [maxRuleLineList, setMaxRuleLineList] = useState(false);
  const [showDropdown , setShowDropDown] = useState(0);
  const [parentString , setParentString] = useState("")
  const [lineListSignShown, setLineListSignShown] = useState([
    [
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
    ],
    [
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
    ],
    [
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
    ],
    [
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
      { lineListShown: false },
    ],
  ]);
  const [newRule, setNewRule] = useState({
    title: {},
  });
  const [fields , setFields] = useState([0, 0, 0, 0])

  const [newObjectField , setNewObjectField] = useState("");

  const navigate = useNavigate();

  const clearNewRule = () => {
    window.location.reload()
  }

  var _ = require("lodash");
  function checkNested(obj /*, level1, level2, ... levelN*/) {
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < args.length; i++) {
      if (!obj || !obj.hasOwnProperty(args[i])) {
        return false;
      }
      obj = obj[args[i]];
    }
    return true;
  }

  function clean(object) {
    if(object != null){
    Object.entries(object).forEach(([k, v]) => {
      if (v && typeof v === "object") {
        clean(v);
      }
      if (
        (v && typeof v === "object" && !Object.keys(v).length) ||
        v === null ||
        v === undefined ||
        v === "" ||
        v === " " ||
        v.length === 0
      ) {
        if (Array.isArray(object)) {
          object.splice(k);
        } else {
          console.log(object[k])
          delete object[k];
        }
      }
    });
  }
    return object;
  }

  const handleRuleUpdate = (
    value,
    targetValue,
    isArray,
    level,
    parentChain,
    inArrayOfObjects,
    ruleListIndex,
    ruleLineListIndex,
    allocationArray
  ) => {
    if (level == 1) {
      if (!isArray) {
        setNewRule({ ...newRule, [value]: targetValue });
      } else {
        var targetValueArray = targetValue.split(",");
        setNewRule({ ...newRule, [value]: targetValueArray });
      }
    }
    if (level == 2) {
      if (!isArray) {
        setNewRule({
          ...newRule,
          [parentChain]: { ...newRule[`${parentChain}`], [value]: targetValue },
        });
      } else {
        var targetValueArray = targetValue.split(",");
        setNewRule({
          ...newRule,
          [parentChain]: {
            ...newRule[`${parentChain}`],
            [value]: targetValueArray,
          },
        });
      }
    }
    if (level == 3) {
      var parents = parentChain.split("..");

      if (inArrayOfObjects) {
        var tempRule = cloneDeep(newRule);
        if (!isArray) {
          tempRule[`${parents[0]}`][`${parents[1]}`][ruleListIndex][
            value
          ] = targetValue;
        } else {
          var targetValueArray = targetValue.split(",");
          tempRule[`${parents[0]}`][`${parents[1]}`][ruleListIndex][
            value
          ] = targetValueArray;
        }

        setNewRule(tempRule);
      }

      if (!isArray && !inArrayOfObjects) {
        setNewRule({
          ...newRule,
          [parents[0]]: {
            ...newRule[`${parents[0]}`],
            [parents[1]]: checkNested(newRule, parents[0], parents[1])
              ? {
                  ...newRule[`${parents[0]}`][`${parents[1]}`],
                  [value]: targetValue,
                }
              : {
                  [value]: targetValue,
                },
          },
        });
      } else if (!inArrayOfObjects) {
        var targetValueArray = targetValue.split(",");
        setNewRule({
          ...newRule,
          [parents[0]]: {
            ...newRule[`${parents[0]}`],
            [parents[1]]: checkNested(newRule, parents[0], parents[1])
              ? {
                  ...newRule[`${parents[0]}`][`${parents[1]}`],
                  [value]: targetValueArray,
                }
              : {
                  [value]: targetValueArray,
                },
          },
        });
      }
    }
    if (level == 4) {
      var parents = parentChain.split("..");

      if (inArrayOfObjects && allocationArray) {
        var tempRule = cloneDeep(newRule);
        if (!isArray) {
          tempRule[`${parents[0]}`][`${parents[1]}`][ruleListIndex][
            `${parents[2]}`
          ][0][value] = targetValue;
        } else {
          var targetValueArray = targetValue.split(",");
          tempRule[`${parents[0]}`][`${parents[1]}`][ruleListIndex][
            `${parents[2]}`
          ][0][value] = targetValueArray;
        }

        setNewRule(tempRule);
      }

      if (inArrayOfObjects && !allocationArray) {
        var tempRule = cloneDeep(newRule);
        if (!isArray) {
          tempRule[`${parents[0]}`][`${parents[1]}`][ruleListIndex][
            `${parents[2]}`
          ][ruleLineListIndex][value] = targetValue;
        } else {
          var targetValueArray = targetValue.split(",");
          tempRule[`${parents[0]}`][`${parents[1]}`][ruleListIndex][
            `${parents[2]}`
          ][ruleLineListIndex][value] = targetValueArray;
        }

        setNewRule(tempRule);
      }

      if (!isArray && !inArrayOfObjects) {
        setNewRule({
          ...newRule,
          [parents[0]]: {
            ...newRule[`${parents[0]}`],
            [parents[1]]: checkNested(newRule, parents[0], parents[1])
              ? {
                  ...newRule[`${parents[0]}`][`${parents[1]}`],
                  [parents[2]]: checkNested(
                    newRule,
                    parents[0],
                    parents[1],
                    parents[2]
                  )
                    ? !inArrayOfObjects
                      ? //NOT IN ARRAY, NEST DOES EXIST
                        {
                          ...newRule[`${parents[0]}`][`${parents[1]}`][
                            `${parents[2]}`
                          ],
                          rule_list: [{ ["hey"]: "targetValue" }],
                        }
                      : //INSIDE ARRAY, NEST DOES EXIST SECOND CALL
                        {
                          ...newRule[`${parents[0]}`][`${parents[1]}`][
                            `${parents[2]}`
                          ][0][value],
                          [value]: targetValue,
                        }
                    : !inArrayOfObjects
                    ? //NOT IN ARRAY, NEST DOES NOT EXIST
                      {
                        [`${parents[2]}`]: [
                          ...newRule[`${parents[0]}`][`${parents[1]}`][
                            `${parents[2]}`
                          ],
                          { ["hy"]: targetValue },
                        ],
                      }
                    : //IN ARRAY, NEST DOES NOT EXIST
                      {},
                }
              : {
                  [parents[2]]: checkNested(
                    newRule,
                    parents[0],
                    parents[1],
                    parents[2]
                  )
                    ? {
                        ...newRule[`${parents[0]}`][`${parents[1]}`][
                          `${parents[2]}`
                        ],
                        hey: targetValue,
                      }
                    : //FIRST CALL
                      {
                        hey: targetValue,
                      },
                },
          },
        });
      } else if (!inArrayOfObjects) {
        var targetValueArray = targetValue.split(",");
        setNewRule({
          ...newRule,
          [parents[0]]: {
            ...newRule[`${parents[0]}`],
            [parents[1]]: checkNested(newRule, parents[0], parents[1])
              ? {
                  ...newRule[`${parents[0]}`][`${parents[1]}`],
                  [parents[2]]: checkNested(
                    newRule,
                    parents[0],
                    parents[1],
                    parents[2]
                  )
                    ? {
                        ...newRule[`${parents[0]}`][`${parents[1]}`][
                          `${parents[2]}`
                        ],
                        [value]: targetValueArray,
                      }
                    : {
                        [value]: targetValueArray,
                      },
                }
              : {
                  [parents[2]]: checkNested(
                    newRule,
                    parents[0],
                    parents[1],
                    parents[2]
                  )
                    ? {
                        ...newRule[`${parents[0]}`][`${parents[1]}`][
                          `${parents[2]}`
                        ],
                        [value]: targetValueArray,
                      }
                    : {
                        [value]: targetValueArray,
                      },
                },
          },
        });
      }
    }
    if (level == 5) {
      var parents = parentChain.split("..");

      if (inArrayOfObjects) {
        var tempRule = cloneDeep(newRule);
        if (!isArray) {
          tempRule[`${parents[0]}`][`${parents[1]}`][`${parents[2]}`][
            ruleListIndex
          ][`${parents[3]}`][ruleLineListIndex][value] = targetValue;
          console.log(tempRule);
        } else {
          var targetValueArray = targetValue.split(",");
          tempRule[`${parents[0]}`][`${parents[1]}`][`${parents[2]}`][
            ruleListIndex
          ][`${parents[3]}`][ruleLineListIndex][value] = targetValueArray;
        }

        setNewRule(tempRule);
      }

      if (!isArray && !inArrayOfObjects) {
        setNewRule({
          ...newRule,
          [parents[0]]: {
            ...newRule[`${parents[0]}`],
            [parents[1]]: checkNested(newRule, parents[0], parents[1])
              ? {
                  ...newRule[`${parents[0]}`][`${parents[1]}`],
                  [parents[2]]: checkNested(
                    newRule,
                    parents[0],
                    parents[1],
                    parents[2]
                  )
                    ? {
                        ...newRule[`${parents[0]}`][`${parents[1]}`][
                          `${parents[2]}`
                        ],
                        [parents[3]]: checkNested(
                          newRule,
                          parents[0],
                          parents[1],
                          parents[2],
                          parents[3]
                        )
                          ? {
                              ...newRule[`${parents[0]}`][`${parents[1]}`][
                                `${parents[2]}`
                              ][`${parents[3]}`],
                              [value]: targetValue,
                            }
                          : {
                              [value]: targetValue,
                            },
                      }
                    : {
                        [parents[3]]: checkNested(
                          newRule,
                          parents[0],
                          parents[1],
                          parents[2],
                          parents[3]
                        )
                          ? {
                              ...newRule[`${parents[0]}`][`${parents[1]}`][
                                `${parents[2]}`
                              ][`${parents[3]}`],
                              [value]: targetValue,
                            }
                          : {
                              [value]: targetValue,
                            },
                      },
                }
              : {
                  [parents[2]]: checkNested(
                    newRule,
                    parents[0],
                    parents[1],
                    parents[2]
                  )
                    ? {
                        ...newRule[`${parents[0]}`][`${parents[1]}`][
                          `${parents[2]}`
                        ],
                        [parents[3]]: checkNested(
                          newRule,
                          parents[0],
                          parents[1],
                          parents[2],
                          parents[3]
                        )
                          ? {
                              ...newRule[`${parents[0]}`][`${parents[1]}`][
                                `${parents[2]}`
                              ][`${parents[3]}`],
                              [value]: targetValue,
                            }
                          : {
                              [value]: targetValue,
                            },
                      }
                    : {
                        [parents[3]]: checkNested(
                          newRule,
                          parents[0],
                          parents[1],
                          parents[2],
                          parents[3]
                        )
                          ? {
                              ...newRule[`${parents[0]}`][`${parents[1]}`][
                                `${parents[2]}`
                              ][`${parents[3]}`],
                              [value]: targetValue,
                            }
                          : {
                              [value]: targetValue,
                            },
                      },
                },
          },
        });
      } else if (!inArrayOfObjects) {
        var targetValueArray = targetValue.split(",");
        setNewRule({
          ...newRule,
          [parents[0]]: {
            ...newRule[`${parents[0]}`],
            [parents[1]]: checkNested(newRule, parents[0], parents[1])
              ? {
                  ...newRule[`${parents[0]}`][`${parents[1]}`],
                  [parents[2]]: checkNested(
                    newRule,
                    parents[0],
                    parents[1],
                    parents[2]
                  )
                    ? {
                        ...newRule[`${parents[0]}`][`${parents[1]}`][
                          `${parents[2]}`
                        ],
                        [parents[3]]: checkNested(
                          newRule,
                          parents[0],
                          parents[1],
                          parents[2],
                          parents[3]
                        )
                          ? {
                              ...newRule[`${parents[0]}`][`${parents[1]}`][
                                `${parents[2]}`
                              ][`${parents[3]}`],
                              [value]: targetValueArray,
                            }
                          : {
                              [value]: targetValueArray,
                            },
                      }
                    : {
                        [parents[3]]: checkNested(
                          newRule,
                          parents[0],
                          parents[1],
                          parents[2],
                          parents[3]
                        )
                          ? {
                              ...newRule[`${parents[0]}`][`${parents[1]}`][
                                `${parents[2]}`
                              ][`${parents[3]}`],
                              [value]: targetValueArray,
                            }
                          : {
                              [value]: targetValueArray,
                            },
                      },
                }
              : {
                  [parents[2]]: checkNested(
                    newRule,
                    parents[0],
                    parents[1],
                    parents[2]
                  )
                    ? {
                        ...newRule[`${parents[0]}`][`${parents[1]}`][
                          `${parents[2]}`
                        ],
                        [parents[3]]: checkNested(
                          newRule,
                          parents[0],
                          parents[1],
                          parents[2],
                          parents[3]
                        )
                          ? {
                              ...newRule[`${parents[0]}`][`${parents[1]}`][
                                `${parents[2]}`
                              ][`${parents[3]}`],
                              [value]: targetValueArray,
                            }
                          : {
                              [value]: targetValueArray,
                            },
                      }
                    : {
                        [parents[3]]: checkNested(
                          newRule,
                          parents[0],
                          parents[1],
                          parents[2],
                          parents[3]
                        )
                          ? {
                              ...newRule[`${parents[0]}`][`${parents[1]}`][
                                `${parents[2]}`
                              ][`${parents[3]}`],
                              [value]: targetValueArray,
                            }
                          : {
                              [value]: targetValueArray,
                            },
                      },
                },
          },
        });
      }
    }
  };

  const handleChangeRuleTitle = (event, name) => {
    if (event.key === "Enter") {
      var tempRule = cloneDeep(newRule);
      tempRule[`${name}`] = tempRule[`${ruleTitle}`];
      delete tempRule[`${ruleTitle}`];
      setRuleTitle(name);
      setTitleEntered(true);
      setNewRule(tempRule);
    }
  };

  const handleShowLineListSign = (ruleListIndex, ruleLineListIndex) => {
    let tempLineListSignShown = cloneDeep(lineListSignShown);
    if (lineListSignShown[ruleListIndex][ruleLineListIndex].lineListShown) {
      tempLineListSignShown[ruleListIndex][
        ruleLineListIndex
      ].lineListShown = false;
    } else {
      tempLineListSignShown[ruleListIndex][
        ruleLineListIndex
      ].lineListShown = true;
    }

    setLineListSignShown(tempLineListSignShown);
  };

  const handleShowSign = () => {
    if (signShown) {
      setSignShown(false);
    } else {
      setSignShown(true);
    }
  };

  const handleAddRuleListObject = () => {
    let tempCounter = cloneDeep(listCounters);

    if (listCounters.rule_list <= 2) {
      tempCounter.rule_list++;

      setRuleListCounters(tempCounter);
    }

    if (tempCounter.rule_list == 3) {
      setMaxRuleList(true);
    }
  };

  const handleAddRuleLineListObject = (ruleListIndex) => {
    let tempCounters = cloneDeep(listCounters);

    if (listCounters.rule_line_list[ruleListIndex].rule_line_list_count <= 9) {
      tempCounters.rule_line_list[ruleListIndex].rule_line_list_count++;
      setRuleListCounters(tempCounters);
    }

    if (tempCounters.rule_line_list[ruleListIndex].rule_line_list_count == 9) {
      tempCounters.rule_line_list[ruleListIndex].max = true;
      setRuleListCounters(tempCounters);
    }
  };

  useEffect(() => {
    console.log(newRule)
    console.log(fields)
  }, [newRule, listCounters, fields]);

  const handleGenerateRuleJSON = () => {
    

      if(ruleNames.indexOf(ruleTitle + ".json") > -1){
        setRuleUpdatePopup(1)
      }else{
        setRuleUpdatePopup(2);
        
      }

  };

  const handleStoreRule = () => {
    const url = window.URL.createObjectURL(
      new Blob([JSON.stringify(clean(newRule))])
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      ruleTitle + ".json"
    ); 
    document.body.appendChild(link);
    link.click();

    const formData = new FormData();
    const rule = new Blob([JSON.stringify(clean(newRule))]);

          formData.append("rule", rule);
          formData.append("ruleName", ruleTitle);

          ApiService.createRule(formData, {
            headers: {
              "content-type": "multipart/form-data",
            },

  }).then(setRuleUpdatePopup(0))
  }

  const handleDownloadRule = () => {
    const url = window.URL.createObjectURL(
      new Blob([JSON.stringify(clean(newRule))])
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      ruleTitle + ".json"
    ); 
    document.body.appendChild(link);
    link.click();
    setRuleUpdatePopup(0)
  }

  const handleNavigateToManager = () => {
    navigate("/generator" , {
      state: { rules: rules , ruleNames: ruleNames },
    })
  }

  const handleRuleFieldUpdate = (event,fieldName, level, objectType) => {

      var tempRule = cloneDeep(newRule);

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

    var tempFields = cloneDeep(fields);

    tempFields[fieldType] = tempFields[fieldType] + 1

    setFields(tempFields);
    setShowDropDown(0);
    setSignShown(0);


    }




  return (
    <Container style={{ width: "90vw", maxWidth: "85vw" }}>
      <div className={classes.toolbar} />
      <Typography inline className={classes.title} variant="h2">
        Rule Generator
      </Typography>
      <Typography
        style={{ marginTop: "15px", marginBottom: "20px" }}
        variant="h6"
      >
        (Anything left blank will not be included in the rule) (For arrays,
        separate all items with a comma)
      </Typography>
      <Typography
        style={{ marginTop: "15px", marginBottom: "20px" }}
        variant="h6"
      >
        Please enter the name of the rule and press "Enter".
      </Typography>
      <Typography
        style={{
          marginTop: "20px",
          marginBottom: "20px",
          textDecoration: "underline",
        }}
        variant="h4"
      >
        Schema:
      </Typography>
      <Typography variant="h6" style={{ marginBottom: "10px" }}>
        <TextField
          value={newRule.keyMain}
          onKeyPress={(e) => handleChangeRuleTitle(e, e.target.value)}
          variant="outlined"
          size="small"
          style={{ transform: "translateY(-3px)" }}
          disabled={titleEntered ? true : false}
        />
        {" : {"}
      </Typography>

      {[...Array(fields[0])].map((e, i) => <NestedObjectComponent inArray={0} parentString={parentString} setParentString={setParentString} newRule={newRule} marginLeft={20} signShown={signShown} showDropdown={showDropdown} setShowDropDown={setShowDropDown} handleShowSign={handleShowSign} setNewRule={setNewRule} setFields={setFields}/>)}
      {[...Array(fields[1])].map((e, i) => <ObjectArrayComponent inArray={0} parentString={parentString} setParentString={setParentString} newRule={newRule} marginLeft={20} signShown={signShown} showDropdown={showDropdown} setShowDropDown={setShowDropDown} handleShowSign={handleShowSign} setNewRule={setNewRule} setFields={setFields}/>)}
      {[...Array(fields[2])].map((e, i) => <ArrayComponent inArray={0} parentString={parentString} setParentString={setParentString} newRule={newRule} marginLeft={0} signShown={signShown} showDropdown={showDropdown} setShowDropDown={setShowDropDown} handleShowSign={handleShowSign} setNewRule={setNewRule} setFields={setFields}/>)}
      {[...Array(fields[3])].map((e, i) => <FieldComponent inArray={0} parentString={parentString} setParentString={setParentString} newRule={newRule} marginLeft={0} signShown={signShown} showDropdown={showDropdown} setShowDropDown={setShowDropDown} handleShowSign={handleShowSign} setNewRule={setNewRule} setFields={setFields}/>)}

        <>

        <>
                {showDropdown ? 
                <>
            <TextField
                ref={ref}
                onChange={(e) => handleAddField(e.target.value, ref.current.style.marginLeft) }
                variant="outlined"
                select
                size="small"
                label="Type Of Field"
                style={{ transform: "translateY(-3px)" , minWidth: "150px", marginLeft: "20px"}}
              > 
              <MenuItem value={1}>Object</MenuItem>
              <MenuItem value={2}>Object Array</MenuItem>
              <MenuItem value={3}>String Array</MenuItem>
              <MenuItem value={4}>Field</MenuItem>
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
                        marginLeft: "20px",
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

            </>

          {/* <Typography
            variant="h6"
            style={{ marginBottom: "10px", marginLeft: "20px" }}
          >
            <TextField
              value={newRule[(e) => e.target.value]}
              onKeyPress={(e) =>
                handleRuleFieldUpdate(
                  e,
                  e.target.value,
                  2,
                  1
                )
              }
              variant="outlined"
              size="small"
              style={{ transform: "translateY(-3px)" }}
            />
          </Typography>
          <Typography
            variant="h6"
            style={{ marginBottom: "10px", marginLeft: "40px" }}
          >
             <TextField
              value={newRule["spec.props.key2.porps.ruleCategory"]}
              onChange={(e) =>
                handleRuleUpdate(
                  "rule_category",
                  e.target.value,
                  0,
                  3,
                  ruleTitle + "..key"
                )
              }
              variant="outlined"
              size="small"
              style={{ transform: "translateY(-3px)" }}
            />
            <TextField
              value={newRule["spec.props.key2.porps.ruleCategory"]}
              onChange={(e) =>
                handleRuleUpdate(
                  "rule_category",
                  e.target.value,
                  0,
                  3,
                  ruleTitle + "..key"
                )
              }
              variant="outlined"
              size="small"
              style={{ transform: "translateY(-3px)" }}
            />
          </Typography>
          */}
          <Typography variant="h6" style={{ marginBottom: "10px" }}>
        {" }"}
      </Typography> 
          
          {ruleUpdatePopup == 1 ? <RuleUpdateConfirmationPopup clean={clean} rules={rules} ruleTitle={ruleTitle} newRule={clean(newRule)} setRuleUpdatePopup={setRuleUpdatePopup} ruleUpdatePopup={1} handleStoreRule={handleStoreRule} ruleNames={ruleNames}  handleDownloadRule={handleDownloadRule}/> : 
          ruleUpdatePopup == 2 ? <RuleUpdateConfirmationPopup clean={clean} ruleNames={ruleNames} setRuleUpdatePopup={setRuleUpdatePopup} ruleUpdatePopup={2} rules={rules} ruleTitle={ruleTitle} newRule={clean(newRule)} handleStoreRule={handleStoreRule} handleDownloadRule={handleDownloadRule}/> : <></>}
        </>

      <Typography style={{ fontSize: "30px", marginTop: "20px" }} inline>
      <Button onClick={handleNavigateToManager} className={classes.altButton}>
              <div style={{ transform: "translateY(2px)" }}>Go Back</div>
            </Button>
            {titleEntered ?  <><Button onClick={() => {clearNewRule()}} className={classes.redButton}>
              <div style={{ transform: "translateY(2px)" }}>Reset</div>
            </Button>
            <Button onClick={handleGenerateRuleJSON} className={classes.button}>
              <div style={{ transform: "translateY(2px)" }}>Generate</div>
            </Button></>: <></>}
            
          </Typography>
            
    </Container>
  );
};
export default NewRulePage;
