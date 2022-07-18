import React, { useState, useCallback, useEffect , Component} from "react";
import useStyles from "./generatorStyles";
import { Container, Typography, Button } from "@material-ui/core";
import { FilePicker } from "react-file-picker";
import Dropzone, { useDropzone } from "react-dropzone";
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../../http-common";
import RuleObject from "./RuleObject/RuleObject";
import { IoArrowDownOutline } from "react-icons/io5"
import { IoMdAddCircle } from "react-icons/io"
import DownloadRulesPopup from "./DownloadRulesPopup/DownloadRulesPopup"
import * as JSZip from "jszip";
import { saveAs } from "file-saver";



const Generator = ({ rules, ruleNames, rulesLoaded, ruleCount
}) => {

  const navigate = useNavigate();
  const [downloadRulesPopup , setDownloadRulesPopup] = useState(0);
  const [rulesReady , setRulesReady] = useState(0)

  String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}



  const classes = useStyles();

  console.log(rules);

  const handleNavigateToGenerator = () => {
    navigate("/generator/generate-rule" , {state:{ruleNames:ruleNames , rules: rules}})
  }

  function clean(object) {
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
          delete object[k];
        }
      }
    });
    return object;
  }

  const handleDownloadRule = (ruleKey) => {

    rules.map((rule) => {
      console.log(Object.keys(rule)[0])
      console.log(ruleKey)


      if(Object.keys(rule)[0] === ruleKey){

        let blob = new Blob([JSON.stringify(rule)]);
        const url = window.URL.createObjectURL(
            new Blob([JSON.stringify(clean(rule))])
          );
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            ruleKey.replaceAt(Object.keys(rule)[0].indexOf("/"), "∕") + ".json"
          ); 
          document.body.appendChild(link);
          link.click();

      }
    
});
  }

  const handleDownloadAllRules = (multipleJson) => {
    if(multipleJson){
      var zip = new JSZip();
      console.log(zip)
      let counter = 0;

      rules.map((rule) => {
            let blob = new Blob([JSON.stringify(rule)]);
            zip.file(
              Object.keys(rule)[0].replaceAt(Object.keys(rule)[0].indexOf("/"), "∕") + ".json",
              blob
            );
            
              counter++;

            if (counter == rules.length) {
              
              zip.generateAsync({ type: "blob" }).then(function(content) {
                saveAs(content, "rules.zip");
              });
              setDownloadRulesPopup(0)
            }

          
      });
      }

      if(!multipleJson){
        console.log(zip)
        let counter = 0;
        var mergedObj = {};
  
        rules.map((rule) => {
              mergedObj = {...mergedObj , ...rule}
              console.log(mergedObj)
              
                counter++;
  
              if (counter == rules.length) {
                
                var blob = new Blob([JSON.stringify(clean(mergedObj))])
                const url = window.URL.createObjectURL(
                  blob
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute(
                  "download", "rules_storage.json"
                ); 
                document.body.appendChild(link);
                link.click();
                setDownloadRulesPopup(0)
              }
            });
    }
  }
  


  const handleDownloadExcel = () => {
    const headers = {'Content-Type': 'blob'};
    const config = {method: 'GET', url: URL, responseType: 'arraybuffer', headers};


    ApiService.downloadMasterSpreadsheet(config).then((res) => {
      const url = window.URL.createObjectURL(
        new Blob([(res.data)])
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        "master_rules.xlsx"
      ); 
      document.body.appendChild(link);
      link.click();
    })
  }

  const handleDownloadRulesPopup = () => {
    setDownloadRulesPopup(1)
  }

  return (
    <Container style={{ width: "90vw", maxWidth: "85vw" }}>
      <div className={classes.toolbar} />
      <Typography inline className={classes.title} variant="h2">
        Rule Manager 
      </Typography>
      <Typography inline variant="h5">
        Don't see your recently added rule? Try refreshing the page.
      </Typography>
      <br/>
      <Typography style={{fontSize: "30px"}} inline><Button className={classes.button} onClick={handleNavigateToGenerator}><div style={{ transform: "translateY(2px)" }}>Create New Rule</div></Button>
      <Button className={classes.altButton} onClick={handleDownloadRulesPopup}><div style={{ transform: "translateY(2px)" }}>Download All Rules</div></Button>
      <Button className={classes.buttonGreen} onClick={handleDownloadExcel}><div style={{ transform: "translateY(2px)" }}>Edit In Excel</div></Button></Typography>
      <br />
      <br />

     { rulesLoaded ? 
     <>
      {rules.map((rule) => (
        <RuleObject rule={rule} handleDownloadRule={handleDownloadRule}/>
      ))}
      
      </>

      

      :

      <></>}

{downloadRulesPopup == 1 ? <><DownloadRulesPopup setDownloadRulesPopup={setDownloadRulesPopup} handleDownloadAllRules={handleDownloadAllRules}/></> : <></>} 

    </Container>
    
  );
};

export default Generator;
