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
import RuleLineListComponent from "./RuleLineListComponent";


const RuleListComponent = ({ newRule, handleRuleUpdate, ruleTitle, maxRuleLineList, handleAddRuleLineListObject, 
                                  handleShowLineListSign, lineListSignShown, ruleLineListIndex, ruleListIndex,
                                listCounters, maxRuleList, handleAddRuleListObject, handleShowSign, signShown}) => {

  return (
    <>
    <Typography
            variant="h6"
            style={{ marginBottom: "10px", marginLeft: "40px" }}
          >
            {"{"}
          </Typography>
          <Typography
            variant="h6"
            style={{ marginBottom: "10px", marginLeft: "60px" }}
          >
            "rule_type":{" "}
            <TextField
              value={newRule["spec.properties.key.properties.rule_type"]}
              onChange={(e) => {
                handleRuleUpdate(
                  "rule_type",
                  e.target.value,
                  0,
                  3,
                  ruleTitle + "..rule_list",
                  1,
                  ruleListIndex
                );
              }}
              variant="outlined"
              size="small"
              style={{ transform: "translateY(-3px)" }}
            />
          </Typography>
          <Typography
            variant="h6"
            style={{ marginBottom: "10px", marginLeft: "60px" }}
          >
            "rule_description":{" "}
            <TextField
              value={newRule["spec.properties.key.properties.rule_description"]}
              onChange={(e) => {
                handleRuleUpdate(
                  "rule_description",
                  e.target.value,
                  0,
                  3,
                  ruleTitle + "..rule_list",
                  1,
                  ruleListIndex
                );
              }}
              variant="outlined"
              size="small"
              style={{ transform: "translateY(-3px)" }}
            />
          </Typography>
          <Typography
            variant="h6"
            style={{ marginBottom: "10px", marginLeft: "60px" }}
          >
            {" "}
            "country":{" "}
            <TextField
              value={newRule["spec.properties.key.properties.country"]}
              onChange={(e) => {
                handleRuleUpdate(
                  "country",
                  e.target.value,
                  0,
                  3,
                  ruleTitle + "..rule_list",
                  1,
                  ruleListIndex
                );
              }}
              variant="outlined"
              size="small"
              style={{ transform: "translateY(-3px)" }}
            />
          </Typography>
          <Typography
            variant="h6"
            style={{ marginBottom: "10px", marginLeft: "60px" }}
          >
            {" "}
            "point_of_sale":{" "}
            <TextField
              value={newRule["spec.properties.key.properties.point_of_sale"]}
              onChange={(e) => {
                handleRuleUpdate(
                  "point_of_sale",
                  e.target.value,
                  0,
                  3,
                  ruleTitle + "..rule_list",
                  1,
                  ruleListIndex
                );
              }}
              variant="outlined"
              size="small"
              style={{ transform: "translateY(-3px)" }}
            />
          </Typography>
          <Typography
            variant="h6"
            style={{ marginBottom: "10px", marginLeft: "60px" }}
          >
            {" "}
            "point_of_supply":{" "}
            <TextField
              value={newRule["spec.properties.key.properties.point_of_supply"]}
              onChange={(e) => {
                handleRuleUpdate(
                  "point_of_supply",
                  e.target.value,
                  0,
                  3,
                  ruleTitle + "..rule_list",
                  1,
                  ruleListIndex
                );
              }}
              variant="outlined"
              size="small"
              style={{ transform: "translateY(-3px)" }}
            />
          </Typography>
          <Typography
            variant="h6"
            style={{ marginBottom: "10px", marginLeft: "60px" }}
          >
            {" "}
            "business_model":{" "}
            <TextField
              value={newRule["spec.properties.key.properties.business_model"]}
              onChange={(e) => {
                handleRuleUpdate(
                  "business_model",
                  e.target.value,
                  0,
                  3,
                  ruleTitle + "..rule_list",
                  1,
                  ruleListIndex
                );
              }}
              variant="outlined"
              size="small"
              style={{ transform: "translateY(-3px)" }}
            />
          </Typography>
          <Typography
            variant="h6"
            style={{ marginBottom: "10px", marginLeft: "60px" }}
          >
            {" "}
            "product":{" "}
            <TextField
              value={newRule["spec.properties.key.properties.product"]}
              onChange={(e) => {
                handleRuleUpdate(
                  "product",
                  e.target.value,
                  0,
                  3,
                  ruleTitle + "..rule_list",
                  1,
                  ruleListIndex
                );
              }}
              variant="outlined"
              size="small"
              style={{ transform: "translateY(-3px)" }}
            />
          </Typography>
          <Typography
            variant="h6"
            style={{ marginBottom: "10px", marginLeft: "60px" }}
          >
            {" "}
            "sub_product_list":{" ["}
            <TextField
              value={newRule["spec.properties.key.properties.sub_product_list"]}
              onChange={(e) => {
                handleRuleUpdate(
                  "sub_product_list",
                  e.target.value,
                  1,
                  3,
                  ruleTitle + "..rule_list",
                  1,
                  ruleListIndex
                );
              }}
              variant="outlined"
              size="small"
              style={{ transform: "translateY(-3px)" }}
            />
            {"]"}
          </Typography>
          <Typography
            variant="h6"
            style={{ marginBottom: "10px", marginLeft: "60px" }}
          >
            {" "}
            "allocation_detail_list":{" ["}
          </Typography>
          <Typography
            variant="h6"
            style={{ marginBottom: "10px", marginLeft: "80px" }}
          >
            {" "}
            {" {"}
          </Typography>
          <Typography
            variant="h6"
            style={{ marginBottom: "10px", marginLeft: "100px" }}
          >
            {" "}
            "allocation_priority":{" "}
            <TextField
              value={
                newRule["spec.properties.key.properties.allocation_property"]
              }
              onChange={(e) => {
                handleRuleUpdate(
                  "allocation_priority",
                  e.target.value,
                  0,
                  4,
                  ruleTitle + "..rule_list..allocation_detail_list",
                  1,
                  ruleListIndex,
                  0,
                  1
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
            "allocation_type":{" "}
            <TextField
              value={newRule["spec.properties.key.properties.allocation_type"]}
              onChange={(e) => {
                handleRuleUpdate(
                  "allocation_type",
                  e.target.value,
                  0,
                  4,
                  ruleTitle + "..rule_list..allocation_detail_list",
                  1,
                  ruleListIndex,
                  0,
                  1
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
            "allocation_factor":{" "}
            <TextField
              value={
                newRule["spec.properties.key.properties.allocation_factor"]
              }
              onChange={(e) => {
                handleRuleUpdate(
                  "allocation_factor",
                  e.target.value,
                  0,
                  4,
                  ruleTitle + "..rule_list..allocation_detail_list",
                  1,
                  ruleListIndex,
                  0,
                  1
                );
              }}
              variant="outlined"
              size="small"
              style={{ transform: "translateY(-3px)" }}
            />
          </Typography>
          <Typography
            variant="h6"
            style={{ marginBottom: "10px", marginLeft: "80px" }}
          >
            {"} "}
          </Typography>
          <Typography
            variant="h6"
            style={{ marginBottom: "10px", marginLeft: "60px" }}
          >
            {"], "}
          </Typography>
          <Typography
            variant="h6"
            style={{ marginBottom: "10px", marginLeft: "60px" }}
          >
            "rule_line_list": {" ["}
          </Typography>
          
          <RuleLineListComponent listCounters={listCounters} lineListSignShown={lineListSignShown} newRule={newRule} handleRuleUpdate={handleRuleUpdate} 
          ruleTitle={ruleTitle} maxRuleLineList={maxRuleLineList} handleAddRuleLineListObject={handleAddRuleLineListObject} handleShowLineListSign={handleShowLineListSign}
           ruleLineListIndex={0} ruleListIndex={ruleListIndex} />

          {listCounters.rule_line_list[ruleListIndex].rule_line_list_count >= 1 ? (

          <RuleLineListComponent listCounters={listCounters} lineListSignShown={lineListSignShown} newRule={newRule} handleRuleUpdate={handleRuleUpdate} 
          ruleTitle={ruleTitle} maxRuleLineList={maxRuleLineList} handleAddRuleLineListObject={handleAddRuleLineListObject} handleShowLineListSign={handleShowLineListSign}
          ruleLineListIndex={1} ruleListIndex={ruleListIndex} />
          ) : (
            <></>
          )}

{listCounters.rule_line_list[ruleListIndex].rule_line_list_count >= 2 ? (
            <RuleLineListComponent listCounters={listCounters} lineListSignShown={lineListSignShown} newRule={newRule} handleRuleUpdate={handleRuleUpdate} 
            ruleTitle={ruleTitle} maxRuleLineList={maxRuleLineList} handleAddRuleLineListObject={handleAddRuleLineListObject} handleShowLineListSign={handleShowLineListSign}
            ruleLineListIndex={2} ruleListIndex={ruleListIndex} />
          ) : (
            <></>
          )}

{listCounters.rule_line_list[ruleListIndex].rule_line_list_count >= 3 ? (
            <RuleLineListComponent listCounters={listCounters} lineListSignShown={lineListSignShown} newRule={newRule} handleRuleUpdate={handleRuleUpdate} 
            ruleTitle={ruleTitle} maxRuleLineList={maxRuleLineList} handleAddRuleLineListObject={handleAddRuleLineListObject} handleShowLineListSign={handleShowLineListSign}
            ruleLineListIndex={3} ruleListIndex={ruleListIndex} />
          ) : (
            <></>
          )}

{listCounters.rule_line_list[ruleListIndex].rule_line_list_count >= 4 ? (
            <RuleLineListComponent listCounters={listCounters} lineListSignShown={lineListSignShown} newRule={newRule} handleRuleUpdate={handleRuleUpdate} 
            ruleTitle={ruleTitle} maxRuleLineList={maxRuleLineList} handleAddRuleLineListObject={handleAddRuleLineListObject} handleShowLineListSign={handleShowLineListSign}
            ruleLineListIndex={4} ruleListIndex={ruleListIndex} />
          ) : (
            <></>
          )}

{listCounters.rule_line_list[ruleListIndex].rule_line_list_count >= 5 ? (
            <RuleLineListComponent listCounters={listCounters} lineListSignShown={lineListSignShown} newRule={newRule} handleRuleUpdate={handleRuleUpdate} 
            ruleTitle={ruleTitle} maxRuleLineList={maxRuleLineList} handleAddRuleLineListObject={handleAddRuleLineListObject} handleShowLineListSign={handleShowLineListSign}
            ruleLineListIndex={5} ruleListIndex={ruleListIndex} />
          ) : (
            <></>
          )}

{listCounters.rule_line_list[ruleListIndex].rule_line_list_count >= 6 ? (
            <RuleLineListComponent listCounters={listCounters} lineListSignShown={lineListSignShown} newRule={newRule} handleRuleUpdate={handleRuleUpdate} 
            ruleTitle={ruleTitle} maxRuleLineList={maxRuleLineList} handleAddRuleLineListObject={handleAddRuleLineListObject} handleShowLineListSign={handleShowLineListSign}
            ruleLineListIndex={6} ruleListIndex={ruleListIndex} />
          ) : (
            <></>
          )}

{listCounters.rule_line_list[ruleListIndex].rule_line_list_count >= 7 ? (
            <RuleLineListComponent listCounters={listCounters} lineListSignShown={lineListSignShown} newRule={newRule} handleRuleUpdate={handleRuleUpdate} 
            ruleTitle={ruleTitle} maxRuleLineList={maxRuleLineList} handleAddRuleLineListObject={handleAddRuleLineListObject} handleShowLineListSign={handleShowLineListSign}
            ruleLineListIndex={7} ruleListIndex={ruleListIndex} />
          ) : (
            <></>
          )}

{listCounters.rule_line_list[ruleListIndex].rule_line_list_count >= 8 ? (
            <RuleLineListComponent listCounters={listCounters} lineListSignShown={lineListSignShown} newRule={newRule} handleRuleUpdate={handleRuleUpdate} 
            ruleTitle={ruleTitle} maxRuleLineList={maxRuleLineList} handleAddRuleLineListObject={handleAddRuleLineListObject} handleShowLineListSign={handleShowLineListSign}
            ruleLineListIndex={8} ruleListIndex={ruleListIndex} />
          ) : (
            <></>
          )}

{listCounters.rule_line_list[ruleListIndex].rule_line_list_count >= 9 ? (
            <RuleLineListComponent listCounters={listCounters} lineListSignShown={lineListSignShown} newRule={newRule} handleRuleUpdate={handleRuleUpdate} 
            ruleTitle={ruleTitle} maxRuleLineList={maxRuleLineList} handleAddRuleLineListObject={handleAddRuleLineListObject} handleShowLineListSign={handleShowLineListSign}
            ruleLineListIndex={9} ruleListIndex={ruleListIndex} />
          ) : (
            <></>
          )}

{listCounters.rule_line_list[ruleListIndex].rule_line_list_count >= 10 ? (
            <RuleLineListComponent listCounters={listCounters} lineListSignShown={lineListSignShown} newRule={newRule} handleRuleUpdate={handleRuleUpdate} 
            ruleTitle={ruleTitle} maxRuleLineList={maxRuleLineList} handleAddRuleLineListObject={handleAddRuleLineListObject} handleShowLineListSign={handleShowLineListSign}
            ruleLineListIndex={10} ruleListIndex={ruleListIndex} />
          ) : (
            <></>
          )}

          <Typography
            variant="h6"
            style={{ marginBottom: "10px", marginLeft: "60px" }}
          >
            {"], "}{!maxRuleList ? (
                  <>
                    <IoMdAddCircle
                      onClick={handleAddRuleListObject}
                      onMouseEnter={handleShowSign}
                      onMouseLeave={handleShowSign}
                      style={{
                        transform: "translateY(2.5px)",
                        marginLeft: "10px",
                        marginRight: "10px",
                        color: "#000099",
                        cursor: "pointer",
                      }}
                    />
                    {signShown ? (
                      <span className="addSign">
                        Add a new rule_list object?
                      </span>
                    ) : (
                      <span className="removeSign">
                        Add a new rule_list object?
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

export default RuleListComponent;
