import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react";
import Header from './Components/Header/Header';
import { createTheme, ThemeProvider } from '@material-ui/core'
import Body from './Components/Body/Body';
import Settings from './Components/Settings/Settings';
import Generator from './Components/Generator/Generator';
 import ImportedRulePage from './Components/Generator/ImportedRule/ImportedRulePage'
import NewRulePage from './Components/Generator/NewRulePageV2/NewRulePage'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import ApiService from "./http-common";

const theme = createTheme({
  typography: {
    fontFamily: [
      'Gothic A1', 
      'sans-serif'
    ].join(','),
  },
});



function App() {
  const[settings, setSettings] = useState([{ originFile: [""] },
                                        { targetFile: "" },
                                        { multipleFileOutput: "" }]);

  const [originFile, setOriginFile] = useState([""])
  const [targetFile, setTargetFile] = useState("");
  const [multipleFileOutput, setMultipleFileOutput] = useState("");
  const [files, setFiles] = useState([]);
  const [percentages, setPercentages] = useState([]);
  const [counters, setCounters] = useState([]);
  const [firstRender , setFirstRender] = useState(1);
  const [rules, setRules] = useState([]);
  const [ruleCount, setRuleCount] = useState([]);
  const [ruleNames , setRuleNames] = useState([]);
  const [counter , setCounter] = useState(0)
  const [ruleSignal , setRuleSignal] = useState(false);
  const [newRule, setNewRule] = useState({
    title: {},
  });
  const [rulesLoaded , setRulesLoaded] = useState(false);

  String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}



  useEffect(() => {
    
        setSettings([
        {originFile: [".xlsx", ".xls"]},
        {targetFile: ".json"},
        {multipleFileOutput: "0"}
        ]

    )
    
  }, [])
  
  useEffect(() => {
    
    setNewRule(newRule)

}, [newRule])

  useEffect(() => {
    ApiService.countRules().then((res) => {setRuleCount(res.data.length) 
                                          setRuleNames(res.data)})
  },[])

  useEffect(() => {

    let tempRules = [...rules];
    let ruleCounter = 0;

    ruleNames.map((rule) => {
      var tempRuleName
      if(rule.includes("/")){
        tempRuleName = rule.replaceAt(rule.indexOf("/"), "∕")
      }else{
        tempRuleName = rule
      }
      
      console.log(tempRuleName)
      ApiService.downloadRule(
        tempRuleName,
        {
          onDownloadProgress: (progressEvent) => {
            let completed = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
          },
        }
      ).then((res) => {
        tempRules.push((res.data))
      }).then(() => {
        setRules(tempRules);
        ruleCounter++;
      }).then(() => {
        if(ruleCounter == ruleCount){
          setRulesLoaded(true);
        }
      })
    })


    
  }, [ruleCount])

  
  
  return (
    <>
    <ThemeProvider theme={theme}>
        <BrowserRouter>
        <Header />
          <Routes>
            <Route path="/" element={<Body rules={rules} settings={settings} setSettings={setSettings} files={files} setFiles={setFiles} percentages={percentages} setPercentages={setPercentages}
                                      counters={counters} setCounters={setCounters}/>} />

            <Route path="/settings" element={<Settings settings={settings} setSettings={setSettings} originFile={originFile}
                                              setOriginFile={setOriginFile} targetFile={targetFile} setTargetFile={setTargetFile}
                                              multipleFileOutput={multipleFileOutput} setMultipleFileOutput={setMultipleFileOutput} 
                                              files={files} firstRender={firstRender} setFirstRender={setFirstRender}/>} />
            <Route path="/generator" element={<Generator ruleCount={ruleCount} ruleNames={ruleNames} rules={rules} rulesLoaded={rulesLoaded}/>} />
            <Route path="/generator/generate-rule" element={<NewRulePage newRule={newRule} setNewRule={setNewRule}/>} />
            <Route path="/generator/generate-rule/imported" element={<ImportedRulePage rules={rules} newRule={newRule} setNewRule={setNewRule} counter={counter} setCounter={setCounter} ruleSignal={ruleSignal} setRuleSignal={setRuleSignal}/>} />
          </Routes>
        </BrowserRouter>
      
    </ThemeProvider>
    </>
  );
}

export default App;
