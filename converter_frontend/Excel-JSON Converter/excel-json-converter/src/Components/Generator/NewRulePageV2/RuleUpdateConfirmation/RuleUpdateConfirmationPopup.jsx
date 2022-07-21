import React, { useState, useCallback, useEffect } from "react";
import useStyles from "./ruleUpdateConfirmationPopupStyles";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  FormControl,
  Typography,
  Select,
  MenuItem,
  FormHelperText,
  Button,
} from "@material-ui/core";
import "./styles.css";
import { BsArrowRight } from "react-icons/bs";
import Divider from '@mui/material/Divider';
import {AiFillCloseCircle} from "react-icons/ai"
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import $ from 'jquery';
import Popper from 'popper.js';

const RuleUpdateConfirmationPopup = ({
rules, ruleTitle, newRule , ruleUpdatePopup, handleStoreRule, setRuleUpdatePopup ,ruleNames , handleDownloadRule, clean, setUseFunction}) => {

  const[existingRuleIndex , setExistingRuleIndex] = useState(-1)

  useEffect(() => {
    rules.map((rule) => {
      console.log(Object.keys(rule)[0])
      console.log(ruleTitle)
      let counter = 0;
  
      if(Object.keys(rule)[0] === ruleTitle){
        setExistingRuleIndex(counter)
      }else{
        counter++
      }
    })
  }, [])

  

  var JSONPretty = require('react-json-pretty');
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/");
  };

  function intersperse(arr, sep) {
    if (arr.length === 0) {
      return [];
    }

    return arr.slice(1).reduce(
      function(xs, x, i) {
        return xs.concat([sep, x]);
      },
      [arr[0]]
    );
  }

  const handleNavigateToNewRule = () => {
    navigate("/generator" , {
      state: { rules: rules , ruleNames: ruleNames },
    })

    setRuleUpdatePopup(0)
  }

  const handleNavigateRuleManager = () => {
    navigate("/generator" , {
      state: { rules: rules , ruleNames: ruleNames },
    })

    setRuleUpdatePopup(0)
  }

  const classes = useStyles();

  return (
    <Container style={{ width: "90vw", maxWidth: "85vw" }}>
      <div className={classes.toolbar} style={{ marginBottom: "30px" }} />
      <div className="popup-box">
        <div className="box">
        <br className={"unselectable"} />
        {ruleUpdatePopup == 1 ? 
        
        <>
                  <AiFillCloseCircle
            onClick={() => {setRuleUpdatePopup(0)
                            setUseFunction(0)}}
            style={{ float: "right", cursor: "pointer" }}
          />
          <Typography variant="h3" style={{ marginBottom: "20px" }}>
            Confirm Rule Update?
          </Typography>
          <Typography variant="h5" style={{fontWeight: "500"}}>
            A rule with the name "{ruleTitle}" already exists. Would you like to update the rule storage system or just <br />download the created rule (no changes to rule storage system)?
          </Typography>
          <br className={"unselectable"} />
          <div style={{width: "100%" , minHeight: "1300px"}}>
          <div style={{float: "left"}} >
          <Typography variant="h5" style={{ textDecoration: "underline" , textAlign: "left"}}>
            Existing Rule:
          </Typography>
          <JSONPretty style={{textAlign: "left", width: "50%"}} id="json-pretty" data={(JSON.stringify(rules[existingRuleIndex]))}></JSONPretty>
          </div>
          <div>
          <Typography variant="h5" style={{ textDecoration: "underline" , textAlign: "left"}}>
            Updated Rule:
          </Typography>
          <JSONPretty style={{textAlign: "left", width: "50%"}} id="json-pretty" data={JSON.stringify(newRule)}></JSONPretty>
          </div>
          </div>
          <br className={"unselectable"} />

          {/* <Button className={classes.button} onClick={handleStoreRule} >
            <span style={{ transform: "translateY(2px)" }}>Update Storage</span>
          </Button>
          <Button className={classes.altButton} onClick={handleDownloadRule}>
            <span style={{ transform: "translateY(2px)" }}>Download Only</span>
          </Button> */}
                    <DropdownButton  drop="down" id="dropdown-button-drop-down" title="IMPORT" style={{ transform: "translate(-15px , -45px)" , minWidth: "200px", marginLeft: "20px", marginTop: "30px"}}>
            <Dropdown.Item as="button" onClick={() => handleStoreRule() } value={1}>Download And Update Storage</Dropdown.Item>
            <Dropdown.Item as="button" onClick={() => handleDownloadRule() } value={2}>Just Download</Dropdown.Item>
          </DropdownButton>
          </>
        
        : ruleUpdatePopup == 2 ? 
        
        <>
                  <AiFillCloseCircle
            onClick={() => {setRuleUpdatePopup(0)
                            setUseFunction(0)}}
            style={{ float: "right", cursor: "pointer" }}
          />
          <Typography variant="h3" style={{ marginBottom: "20px" }}>
            Confirm Rule Storage Update?
          </Typography>
          <Typography variant="h5" style={{fontWeight: "500"}}>
            Would you like to add the rule "{ruleTitle}" to the rule storage system? 
          </Typography>
          <br className={"unselectable"} />
          <Typography variant="h5" style={{ textDecoration: "underline"}}>
            Rule Content: 
          </Typography>
          <br/>
          <div style={{textAlign: "left", width: "50%", marginLeft: "42%"}}>
          <JSONPretty id="json-pretty" data={JSON.stringify(newRule)}></JSONPretty>
          </div>
          <br className={"unselectable"} />

          {/* <Button className={classes.button} onClick={() => {handleStoreRule();
                                                            handleNavigateRuleManager();}}>
            <span style={{ transform: "translateY(2px)" }}>Yes</span>
          </Button>
          <Button className={classes.altButton} onClick={() => {handleNavigateToNewRule();
                                                                handleDownloadRule(newRule);}}>
            <span style={{ transform: "translateY(2px)" }}>No</span>
          </Button> */}

<DropdownButton  drop="down" id="dropdown-button-drop-down" title="UPDATE" style={{ transform: "translate(-15px)" , minWidth: "200px", marginLeft: "20px", marginTop: "30px"}}>
            <Dropdown.Item as="button" onClick={() => handleStoreRule() } value={1}>Download And Update Storage</Dropdown.Item>
            <Dropdown.Item as="button" onClick={() => handleDownloadRule() } value={2}>Just Download</Dropdown.Item>
          </DropdownButton>
          </>

          : 

          <></>
        
        }
          
          
        </div>

      </div>
    </Container>
  );
}

export default RuleUpdateConfirmationPopup;
