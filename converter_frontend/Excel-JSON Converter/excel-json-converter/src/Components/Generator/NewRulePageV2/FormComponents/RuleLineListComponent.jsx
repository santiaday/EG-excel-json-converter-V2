import React, { useState, useCallback, useEffect } from "react";
import useStyles from "../newRulePageStyles";
import { Container, Typography, Button, TextField } from "@material-ui/core";
import { FilePicker } from "react-file-picker";
import Dropzone, { useDropzone } from "react-dropzone";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowDownOutline } from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io";
import cloneDeep from "lodash/cloneDeep";
import "../newRulePageStyles.css";


const RuleLineListComponent = ({ newRule, handleRuleUpdate, ruleTitle, maxRuleLineList, handleAddRuleLineListObject, 
                                  handleShowLineListSign, lineListSignShown, ruleLineListIndex, ruleListIndex, listCounters}) => {

  return (
    <>
    <Typography
      variant="h6"
      style={{ marginBottom: "10px", marginLeft: "80px" }}
    >
      {" {"}
    </Typography>
    <Typography
      variant="h6"
      style={{ marginBottom: "10px", marginLeft: "100px" }}
    >
      {" "}
      "monetary_classification_urn":{" "}
      <TextField
        value={
          newRule[
            "spec.properties.key.properties.monetary_classification_urn"
          ]
        }
        onChange={(e) => {
          handleRuleUpdate(
            "monetary_classification_urn",
            e.target.value,
            0,
            4,
            ruleTitle + "..rule_list..rule_line_list",
            1,
            ruleListIndex,
            ruleLineListIndex
          );
        }}
        variant="outlined"
        size="small"
        style={{ transform: "translateY(-3px)" }}
      />
    </Typography>
    <Typography
      variant="h6"
      style={{ marginBottom: "10px", marginLeft: "100px" }}
    >
      {" "}
      "localized_display_name":{" "}
      <TextField
        value={
          newRule[
            "spec.properties.key.properties.localized_display_name"
          ]
        }
        onChange={(e) => {
          handleRuleUpdate(
            "localized_display_name",
            e.target.value,
            0,
            4,
            ruleTitle + "..rule_list..rule_line_list",
            1,
            ruleListIndex,
            ruleLineListIndex
          );
        }}
        variant="outlined"
        size="small"
        style={{ transform: "translateY(-3px)" }}
      />
    </Typography>
    <Typography
      variant="h6"
      style={{ marginBottom: "10px", marginLeft: "100px" }}
    >
      {" "}
      "compensation_type":{" "}
      <TextField
        value={
          newRule["spec.properties.key.properties.compensation_type"]
        }
        onChange={(e) => {
          handleRuleUpdate(
            "compensation_type",
            e.target.value,
            0,
            4,
            ruleTitle + "..rule_list..rule_line_list",
            1,
            ruleListIndex,
            ruleLineListIndex
          );
        }}
        variant="outlined"
        size="small"
        style={{ transform: "translateY(-3px)" }}
      />
    </Typography>
    <Typography
      variant="h6"
      style={{ marginBottom: "10px", marginLeft: "100px" }}
    >
      {" "}
      "rule_line_priority":{" "}
      <TextField
        value={
          newRule["spec.properties.key.properties.rule_line_priority"]
        }
        onChange={(e) => {
          handleRuleUpdate(
            "rule_line_priority",
            e.target.value,
            0,
            4,
            ruleTitle + "..rule_list..rule_line_list",
            1,
            ruleListIndex,
            ruleLineListIndex
          );
        }}
        variant="outlined"
        size="small"
        style={{ transform: "translateY(-3px)" }}
      />
    </Typography>
    <Typography
      variant="h6"
      style={{ marginBottom: "10px", marginLeft: "100px" }}
    >
      {" "}
      "sub_product":{" "}
      <TextField
        value={newRule["spec.properties.key.properties.sub_product"]}
        onChange={(e) => {
          handleRuleUpdate(
            "sub_product",
            e.target.value,
            0,
            4,
            ruleTitle + "..rule_list..rule_line_list",
            1,
            ruleListIndex,
            ruleLineListIndex
          );
        }}
        variant="outlined"
        size="small"
        style={{ transform: "translateY(-3px)" }}
      />
    </Typography>
    <Typography
      variant="h6"
      style={{ marginBottom: "10px", marginLeft: "100px" }}
    >
      {" "}
    </Typography>
    <Typography
  variant="h6"
  style={{ marginBottom: "10px", marginLeft: "80px", userSelect: "none" }}
>
  {" }"}
  {!listCounters.rule_line_list[ruleListIndex].max ? (
    <>
      <IoMdAddCircle
        onClick={() => handleAddRuleLineListObject(ruleListIndex)}
        onMouseEnter={() => handleShowLineListSign(ruleListIndex, ruleLineListIndex)}
        onMouseLeave={() => handleShowLineListSign(ruleListIndex, ruleLineListIndex)}
        style={{
          transform: "translateY(2.5px)",
          marginLeft: "10px",
          marginRight: "10px",
          color: "#000099",
          cursor: "pointer",
        }}
      />
      {lineListSignShown[ruleListIndex][ruleLineListIndex].lineListShown ? (
        <span className="addSign">
          Add a new rule_line_list object?
        </span>
      ) : (
        <span className="removeSign">
          Add a new rule_line_list object?
        </span>
      )}
    </>
  ) : (
    <></>
  )}
</Typography>
  </>
  );
};

export default RuleLineListComponent;
