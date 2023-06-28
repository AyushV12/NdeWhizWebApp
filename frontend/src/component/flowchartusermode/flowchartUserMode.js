// @flow strict
// Copyright (C) 2022 Deep Skills Inc., - All Rights Reserved
// Unauthorized copying of this file, via any medium is strictly prohibited
// Proprietary and confidential

import React, { useState, useEffect } from "react";
import styles from "./flowchartusermode.module.css";

import axios from "axios";
import { apiEndpoint, download } from "../../utils/common";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { TabConfig } from "../../config/config";

import WorkflowMode0 from "./workflowmode0";
import WorkflowMode1 from "./workflowmode1";
import WorkflowMode2 from "./workflowmode2";

type FlowchartUserModeProps = {
isAdmin : boolean,
filterTemplate: string,
filterSubItem: string,
infoURL:string
};

const color_1="#473a4f";
const color_2="#AF69EF";
const color_3="white";

export default function FlowchartUserMode(props: FlowchartUserModeProps) {
  const [reset, setReset] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [updateTemplate, setUpdateTemplate] = useState<boolean>(false);
  const [templateSelect, setTemplateSelect] = useState<string>("");
  const [storeTemplateInfo, setStoreTemplateInfo] = useState<Array<[]>>([]);

  const [componentSelect, setComponentSelect] = useState<string>("");
  const [subComponentSelect, setSubComponentSelect] = useState<string>("");
  const [isItemEmpty, setIsItemEmpty] = useState<boolean>(false);
  const [isSubItemEmpty, setIsSubItemEmpty] = useState<boolean>(false);

  const [storeComponentNode, setStoreComponentNode] = useState<Array<SheetData>>([]);
  const [storeSubComponentNode, setStoreSubComponentNode] = useState<Array<SheetData>>([]);

  const [updateFlowchart, setUpdateFlowchart] = useState<boolean>(false);
  const [flowchartSheetSelect, setFlowchartSheetSelect] = useState<string>("");
  const [flowchartSelect, setFlowchartSelect] = useState<string>("");
  const [storeFlowchartInfo, setStoreFlowchartInfo] = useState<Array<[]>>([]);
  const [updateReady, setUpdateReady] = useState<boolean>(false);

  const [spreadsheets, setSpreadsheets] = useState<Array<Project>>([]);
  const [manuals, setManuals] = useState<Array<Project>>([]);
  const [flowcharts, setFlowcharts] = useState<Array<Project>>([]);
  const [references, setReferences] = useState<Array<Project>>([]);

  const [viewWait, setViewWait] = useState<boolean>(false);
  const [testPdf, setTestPdf] = useState<boolean>(false);
  const [filterPlot, setFilterPlot] = useState<Array<boolean>>([]);
  const [technicalNotes, setTechnicalNotes] = useState<Array<[]>>([]);

  const [docState, setDocState] = useState<Array<string>>([]);
  const [imageSelect, setImageSelect] = useState<string>("");
  const [imageReady, setImageReady] = useState<Array<boolean>>(false);

  const [waitIndicatorStart, setWaitIndicatorStart] = useState<boolean>(false);
  const [percentCompleted, setPercentCompleted] = React.useState<number>(0);

  useEffect(() => {
    async function admin() {
        setReset(true);
    }
    admin();
  }, []);

  useEffect(() => {
    async function fetchMe() {
      try {
        let select = "";
        let newTemplate = [];
        setDocState(["", "", "", "", ""]);
        if (props.infoURL.db === "") {
        const resp = await axios.get(apiEndpoint() + `/api/blob/workspace/list/${"admin"}`);
        console.log("propsForFlowchartComponent",props)
        if (resp.status === 200) {
          if (props.filterTemplate === "") {
            setStoreTemplateInfo(resp.data);
            console.log("storeTemplateInfo",resp.data)
            select = resp.data[0];  //select option for workflow component
            newTemplate = resp.data;
            console.log("window.session.storage",window.sessionStorage.getItem("ndeWhiz-Template"))
            if (window.sessionStorage.getItem("ndeWhiz-Template") === null) {   //for last window Session 
              window.sessionStorage.setItem("ndeWhiz-Template", select);
            } else {
              select = window.sessionStorage.getItem("ndeWhiz-Template");
            }

          } else {
            const newFilter = props.filterTemplate.split(",");
            for (let i=0; i < resp.data.length; i++) {
              for (let j=0; j < newFilter.length; j++) {
                if (resp.data[i] === newFilter[j]) {
                   newTemplate.push(resp.data[i]);
                   break;
                }
              }
            }
            setStoreTemplateInfo(newTemplate);
            select = newTemplate[0];
            if (window.sessionStorage.getItem("ndeWhiz-Template") === null) {
              window.sessionStorage.setItem("ndeWhiz-Template", select);
            } else {
              select = window.sessionStorage.getItem("ndeWhiz-Template");
            }

          }

        }
        setTemplateSelect(select);
        setFilterPlot([true, false, false]);
        setUpdateTemplate(true);
       } else {
        setTemplateSelect(props.infoURL.db);
        setStoreTemplateInfo([props.infoURL.db]);
        setFilterPlot([true, false, false]);
        setUpdateTemplate(true);
      }


      } catch (err) {
       console.log("Error");
      }
      
    }
    fetchMe();
    
  }, [props.filterTemplate, props.infoURL.db]);

  async function updateSelectedDatabase(str: String) {
    //after database selection database info.
    setUpdateTemplate(false);
    setDocState(["", "", "", "", ""]);
     try {

    const respy = await axios.get(apiEndpoint() + `/api/blob/folder/root/read/${"admin"}/${templateSelect}/${"master.json"}`);
    if (respy.status === 200) {
      if (respy.data.length > 0) {
        if (respy.data[0].manual !== undefined) {
           setManuals(respy.data[0].manual);
         }
         if (respy.data[0].spreadsheet !== undefined) {
           setSpreadsheets(respy.data[0].spreadsheet);
         }
         if (respy.data[0].flowchart !== undefined) {
           setFlowcharts(respy.data[0].flowchart);
         }
         if (respy.data[0].reference !== undefined) {
           setReferences(respy.data[0].reference);
         }

       } else {
        console.log("Error");
     }
    }
    } catch (err) {
      setIsItemEmpty(false);
      setIsSubItemEmpty(false);

    }
    console.log("props.infoURL.db",props.infoURL.db)
    if (props.infoURL.db !== "") {
      setStoreComponentNode([{ name: props.infoURL.component }]); 
      setComponentSelect(props.infoURL.component);
      setStoreSubComponentNode([{ name: props.infoURL.flow }]);
      setSubComponentSelect(props.infoURL.flow);

      setFlowchartSheetSelect(props.infoURL.component);
      setFlowchartSelect(props.infoURL.component + "-" + props.infoURL.flow);
      setUpdateFlowchart(true);
      setLoading(true);
      setIsItemEmpty(true);
      setIsSubItemEmpty(true);
      return;
    }
    const response = await axios.get(apiEndpoint()+ `/api/blob/workspace/read/${"admin"}/${templateSelect}/${"master.json"}`);
    //here if props.db.info===""
    console.log(response,"responseTwo")
    if (response.status === 200) {
      const masterdata = response.data[0];
      const x = masterdata.component;
      if (props.filterSubItem !== "") {
        const st = props.filterSubItem.split(",");
        for (let i=0; i < st.length; i++) {
          for (let j=0; j < x.length; j++) {
            if (x[j].name === st[i]) {
              x.splice(j, 1);
              break;
            }
          }
        }
      }
      console.log("x BeforeComponent Making",x)
      const component = x;
        setStoreComponentNode([]); 
        if (component.length > 0) {
          setStoreComponentNode(component); 
          setComponentSelect(component[0].name);
          if (component[0].subcomponent.length > 0) {
            setIsItemEmpty(true);
            setStoreSubComponentNode(component[0].subcomponent);
            setSubComponentSelect(component[0].subcomponent[0].name);
            if (component[0].subcomponent[0].item.length > 0) {
              console.log("subitem",component[0].subcomponent[0].item[0].subitem)
              if (component[0].subcomponent[0].item[0].subitem.length > 0) {  
                setIsSubItemEmpty(true);
                setFlowchartSheetSelect(component[0].name);
                setFlowchartSelect( component[0].name + "-" + component[0].subcomponent[0].name);
                setUpdateFlowchart(true);
              } else {
                setIsSubItemEmpty(false);
              }
            } else {
              setIsItemEmpty(false);
            }
          } else {
            setComponentSelect("");
            setSubComponentSelect("");
          }
        } else {
          setStoreSubComponentNode([]);
          setSubComponentSelect("");
        }

      }
      setLoading(true);
  }

  async function updateSelectedFlowchart(str: String) {
     setDocState(["", "", "", "", ""]);
     setUpdateFlowchart(false);
     console.log("updateFlowchartCalled")
     let flowChartSelect=flowchartSelect
     console.log(flowChartSelect)
     flowChartSelect=flowChartSelect.replace("/","")
     console.log(flowchartSelect,flowChartSelect)
     try {
     const respy = await axios.get(apiEndpoint() + `/api/blob/workspace/read/${"admin"}/${templateSelect}/${flowchartSheetSelect}/${flowChartSelect + ".json"}`);
     console.log("respyForFlowchartAdminMode",respy.data)
     if (respy.status === 200) {
       if (respy.data.length > 0) {
         setStoreFlowchartInfo(respy.data);
       } 
     }
     setUpdateReady(true);
     } catch (err) {
      setIsItemEmpty(false);
      setIsSubItemEmpty(false);
     }
/*
    let currentSelect = "";
    let id = "";
    let rowno= "";
    let colno= "";
    let link = "";
    let filename = "";
    let ready = false;
    let t = [];
    t = flowchartSelect.split("-");
    for (let i=0; i < flowcharts.length; i++) {
       if (t[0] === flowcharts[i].name) {
          id = flowcharts[i].id;
           break;
        }
      }
      if (id !== "") {
      const sheet = "sheet_" + id.toString(); 
      const respy = await axios.get(apiEndpoint() + `/api/blob/folder/sheetfile/read/${"admin"}/${templateSelect}/${"flowchart"}/${sheet}/${"table.json"}`);
      if (respy.status === 200) {
         for (let j=0; j < respy.data.tableItem.length; j++) {
  //          if (t[1] === respy.data.tableItem[j].col[0].name && t[2] === respy.data.tableItem[j].col[1].name && t[3] === respy.data.tableItem[j].col[2].name) {
               rowno= respy.data.tableItem[1].id;
               colno= respy.data.tableItem[1].col[7].id;
               link= respy.data.tableItem[1].col[7].uploadLink;
               ready = true;
               break;
    //         }
          }
      }
    }
    if (ready === true && id !== "" && rowno !== "" && colno !== "" && link !== "") {
      const sheet = "sheet_" + id;
      const rowx = "row_" + rowno;
      const colx = "col_" + colno;
      await axios.get(apiEndpoint()+ `/api/blob/folder/sheet/read/${"admin"}/${templateSelect}/${"flowchart"}/${sheet}/${rowx}/${colx}/${link}`, { responseType: "blob" })
      .then((xresponse) => {
         const reader = new FileReader();
         reader.readAsDataURL(xresponse.data); 
         reader.onload = function () {
         const imageDataUrl = reader.result;
         setImageSelect(imageDataUrl);
         setImageReady(true);
      };
        });
    }
*/

  }

  function handleDropdown(id: number, e: SyntheticKeyboardEvent<HTMLInputElement>) {
    const trimValue = e.currentTarget.value.trim();
    const store = storeComponentNode;
    let found = false;
    let index = 0;
    let foundA = false;
    let indexA = 0;
    let foundB = false;
    let indexB = 0;
    let foundC = false;

    switch (id) {

      case 2:
        setImageSelect("");
        setImageReady(false);

     if (window.sessionStorage.getItem("ndeWhiz-Template") === null) {
       window.sessionStorage.setItem("ndeWhiz-Template", e.currentTarget.value);
      } else {
        window.sessionStorage.setItem("ndeWhiz-Template", e.currentTarget.value);
      }

        setTemplateSelect(e.currentTarget.value);
        setStoreFlowchartInfo([]);
        setStoreSubComponentNode([]);
        setSubComponentSelect("");
        setUpdateReady(false);
        setUpdateTemplate(true);
        break;

      case 3:
        setImageSelect("");
        setImageReady(false);

        setUpdateReady(false);
        setStoreFlowchartInfo([]);
        setComponentSelect(trimValue);
        for (let i = 0; i < store.length; i++) {
          if (store[i].name === trimValue) {
            found = true;
            index = i;
            foundA = true;
            foundB = true;
            indexA = 0;
            indexB = 0;
            break;
          }
        }
        break;


      case 4:
        setImageSelect("");
        setImageReady(false);
        setUpdateReady(false);
        setStoreFlowchartInfo([]);
        setSubComponentSelect(trimValue);
        for (let i = 0; i < store.length; i++) {
          if (store[i].name === componentSelect) {
            found = true;
            index = i;
            break;
          }
        }
        if (found === true) {
          if (store[index].subcomponent.length > 0) {
            foundA = false;
            for (let i = 0; i < store[index].subcomponent.length; i++) {
              if (store[index].subcomponent[i].name === trimValue) {
                foundA = true;
                indexA = i;
                foundB = true;
                indexB = 0;
                break;
              }
            }
          }
        }
        break;


     default:
       foundC = true;
       break;
    }
    if (foundC === false) {

        if (found === true) {
          if (store[index].subcomponent.length > 0 && foundA === true) {
            setStoreSubComponentNode(store[index].subcomponent);
            setSubComponentSelect(store[index].subcomponent[indexA].name);
            if (store[index].subcomponent[indexA].item.length > 0 && foundB === true) {
              setIsItemEmpty(true);
              if (store[index].subcomponent[indexA].item[indexB].subitem.length > 0) {
                setIsSubItemEmpty(true);
                setFlowchartSheetSelect(store[index].name);
                setFlowchartSelect(store[index].name + "-" + store[index].subcomponent[indexA].name);
                setUpdateFlowchart(true);
              } else {
                setIsSubItemEmpty(false);
              }
            } else {
               setIsItemEmpty(false);
            }
          } else {
            setStoreSubComponentNode([]);
            setSubComponentSelect("");
          }
        } else {
          setStoreSubComponentNode([]);
          setSubComponentSelect("");
        }
    }
    setRefresh(!refresh);
  }

 async function handleEditor(str:string, val:number, e: SyntheticKeyboardEvent<HTMLInputElement>) {
    switch (str) {

     case "CHECKBOX":
        if (val === 10) {
          setUpdateTemplate(true);
        }
        if (val === 11) {
          setFilterPlot([true, false, false]);
        }
        if (val === 12) {
          setFilterPlot([false, true, false]);
        }
        if (val === 13) {
          setFilterPlot([false, false, true]);
        }

        break;

        default:
          break;
      }
  }

  async function documentProcess(x, y, z, s) {
    let currentSelect = "";
    let id = "";
    let rowno= "";
    let colno= "";
    let link = "";
    let filename = "";
    let ready = false;
    let t = [];
    setDocState([x, y, z, "Loading Wait ...", "100%"]);
    switch (x) {
     case "FLOW":
         t = z.split("-");
         currentSelect = "flowchart";
         for (let i=0; i < flowcharts.length; i++) {
            if (y === flowcharts[i].name) {
              id = flowcharts[i].id;
              break;
            }
         }
         if (id !== "") {
            const sheet = "sheet_" + id.toString();
            const respy = await axios.get(apiEndpoint() + `/api/blob/folder/sheetfile/read/${"admin"}/${templateSelect}/${currentSelect}/${sheet}/${"table.json"}`);
            if (respy.status === 200) {
               for (let j=0; j < respy.data.tableItem.length; j++) {
                if (t[0] === respy.data.tableItem[j].col[0].name && t[1] === respy.data.tableItem[j].col[1].name && t[2] === respy.data.tableItem[j].col[2].name) {
                  rowno= respy.data.tableItem[j].id;
                  colno= respy.data.tableItem[j].col[4].id;
                  link= respy.data.tableItem[j].col[4].uploadLink;
                  ready = true;
                  break;
                }
                console.log("NDEx");
              }
            }
         }
         if (ready === true && id !== "" && rowno !== "" && colno !== "" && link !== "") {
         const sheet = "sheet_" + id;
         const rowx = "row_" + rowno;
         const colx = "col_" + colno;
         await axios.get(apiEndpoint()+ `/api/blob/folder/sheet/read/${"admin"}/${templateSelect}/${currentSelect}/${sheet}/${rowx}/${colx}/${link}`, { responseType: "blob" })
        .then((response) => {
         const reader = new FileReader();
         reader.readAsDataURL(response.data); 
         reader.onload = function () {
         const imageDataUrl = reader.result;
         setTestPdf(imageDataUrl);
         };
         setViewWait(true);
         });
        }
         break;

     case "NDE-GE":
         t = z.split("-");
         currentSelect = "flowchart";
         for (let i=0; i < flowcharts.length; i++) {
            if (y === flowcharts[i].name) {
              id = flowcharts[i].id;
              break;
            }
         }
         if (id !== "") {
            const sheet = "sheet_" + id.toString();
            const respy = await axios.get(apiEndpoint() + `/api/blob/folder/sheetfile/read/${"admin"}/${templateSelect}/${currentSelect}/${sheet}/${"table.json"}`);
            if (respy.status === 200) {
               for (let j=0; j < respy.data.tableItem.length; j++) {
                  rowno= respy.data.tableItem[1].id;
                  colno= respy.data.tableItem[1].col[5].id;
                  link= respy.data.tableItem[1].col[5].uploadLink;
                  ready = true;
                  break;
              }
            }
         }
         if (ready === true && id !== "" && rowno !== "" && colno !== "" && link !== "") {
         const sheet = "sheet_" + id;
         const rowx = "row_" + rowno;
         const colx = "col_" + colno;
         await axios.get(apiEndpoint()+ `/api/blob/folder/sheet/read/${"admin"}/${templateSelect}/${currentSelect}/${sheet}/${rowx}/${colx}/${link}`, { responseType: "blob" })
        .then((response) => {
         const reader = new FileReader();
         reader.readAsDataURL(response.data); 
         reader.onload = function () {
         const imageDataUrl = reader.result;
         setTestPdf(imageDataUrl);
         };
         setViewWait(true);
         });
        }
         break;

     case "NDE":
         currentSelect = "manual";
         for (let i=0; i < manuals.length; i++) {
            if (y === manuals[i].name) {
              id = manuals[i].id;
              break;
            }
         }
         if (id !== "") {
            const sheet = "sheet_" + id.toString();
            const respy = await axios.get(apiEndpoint() + `/api/blob/folder/sheetfile/read/${"admin"}/${templateSelect}/${currentSelect}/${sheet}/${"table.json"}`);
            if (respy.status === 200) {
               for (let j=0; j < respy.data.tableItem.length; j++) {
                if (z=== respy.data.tableItem[j].col[0].name) {
                  rowno= respy.data.tableItem[j].id;
                  colno= respy.data.tableItem[j].col[2].id;
                  link= respy.data.tableItem[j].col[2].uploadLink;
                  ready = true;
                  break;
                }
                console.log("NDEx");
              }
            }
         }
         if (ready === true && id !== "" && rowno !== "" && colno !== "" && link !== "") {
         const sheet = "sheet_" + id;
         const rowx = "row_" + rowno;
         const colx = "col_" + colno;
         await axios.get(apiEndpoint()+ `/api/blob/folder/sheet/read/${"admin"}/${templateSelect}/${currentSelect}/${sheet}/${rowx}/${colx}/${link}`, { responseType: "blob" })
        .then((response) => {
         const reader = new FileReader();
         reader.readAsDataURL(response.data); 
         reader.onload = function () {
         const imageDataUrl = reader.result;
         setTestPdf(imageDataUrl);
         };
         setViewWait(true);
         });
        }

        break;


     case "NDE-E":
         currentSelect = "manual";
         for (let i=0; i < manuals.length; i++) {
            if (y === manuals[i].name) {
              id = manuals[i].id;
              break;
            }
         }
         if (id !== "") {
            const sheet = "sheet_" + id.toString();
            const respy = await axios.get(apiEndpoint() + `/api/blob/folder/sheetfile/read/${"admin"}/${templateSelect}/${currentSelect}/${sheet}/${"table.json"}`);
            if (respy.status === 200) {
               for (let j=0; j < respy.data.tableItem.length; j++) {
                  rowno= respy.data.tableItem[1].id;
                  colno= respy.data.tableItem[1].col[3].id;
                  link= respy.data.tableItem[1].col[3].uploadLink;
                  ready = true;
                  break;
              }
            }
         }
         if (ready === true && id !== "" && rowno !== "" && colno !== "" && link !== "") {
         const sheet = "sheet_" + id;
         const rowx = "row_" + rowno;
         const colx = "col_" + colno;
         await axios.get(apiEndpoint()+ `/api/blob/folder/sheet/read/${"admin"}/${templateSelect}/${currentSelect}/${sheet}/${rowx}/${colx}/${link}`, { responseType: "blob" })
        .then((response) => {
         const reader = new FileReader();
         reader.readAsDataURL(response.data); 
         reader.onload = function () {
         const imageDataUrl = reader.result;
         setTestPdf(imageDataUrl);
         };
         setViewWait(true);
         });
        }
        break;

     case "NDE-V":
         currentSelect = "manual";
         for (let i=0; i < manuals.length; i++) {
            if (y === manuals[i].name) {
              id = manuals[i].id;
              break;
            }
         }
         if (id !== "") {
            const sheet = "sheet_" + id.toString();
            const respy = await axios.get(apiEndpoint() + `/api/blob/folder/sheetfile/read/${"admin"}/${templateSelect}/${currentSelect}/${sheet}/${"table.json"}`);
            if (respy.status === 200) {
               for (let j=0; j < respy.data.tableItem.length; j++) {
                if (z=== respy.data.tableItem[j].col[0].name) {
                  rowno= respy.data.tableItem[j].id;
                  colno= respy.data.tableItem[j].col[4].id;
                  link= respy.data.tableItem[j].col[4].uploadLink;
                  ready = true;
                  break;
                }
              }
            }
         }
         if (ready === true && id !== "" && rowno !== "" && colno !== "" && link !== "") {
         const sheet = "sheet_" + id;
         const rowx = "row_" + rowno;
         const colx = "col_" + colno;
         await axios.get(apiEndpoint()+ `/api/blob/folder/sheet/read/${"admin"}/${templateSelect}/${currentSelect}/${sheet}/${rowx}/${colx}/${link}`, { responseType: "blob" })
        .then((response) => {
         const reader = new FileReader();
         reader.readAsDataURL(response.data); 
         reader.onload = function () {
         const imageDataUrl = reader.result;
         setTestPdf(imageDataUrl);
         };
         setViewWait(true);
         });
        }

        break;

     case "NDE-S":
         currentSelect = "manual";
         for (let i=0; i < manuals.length; i++) {
            if (y === manuals[i].name) {
              id = manuals[i].id;
              break;
            }
         }
         if (id !== "") {
            const sheet = "sheet_" + id.toString();
            const respy = await axios.get(apiEndpoint() + `/api/blob/folder/sheetfile/read/${"admin"}/${templateSelect}/${currentSelect}/${sheet}/${"table.json"}`);
            if (respy.status === 200) {
               for (let j=0; j < respy.data.tableItem.length; j++) {
                if (z=== respy.data.tableItem[j].col[0].name) {
                  rowno= respy.data.tableItem[j].id;
                  colno= respy.data.tableItem[j].col[5].id;
                  link= respy.data.tableItem[j].col[5].uploadLink;
                  ready = true;
                  break;
                }
              }
            }
         }
         if (ready === true && id !== "" && rowno !== "" && colno !== "" && link !== "") {
         const sheet = "sheet_" + id;
         const rowx = "row_" + rowno;
         const colx = "col_" + colno;
         await axios.get(apiEndpoint()+ `/api/blob/folder/sheet/read/${"admin"}/${templateSelect}/${currentSelect}/${sheet}/${rowx}/${colx}/${link}`, { responseType: "blob" })
        .then((response) => {
         const reader = new FileReader();
         reader.readAsDataURL(response.data); 
         reader.onload = function () {
         const imageDataUrl = reader.result;
         setTestPdf(imageDataUrl);
         };
         setViewWait(true);
         });
        }

        break;


     case "NDE-C":
         currentSelect = "manual";
         for (let i=0; i < manuals.length; i++) {
            if (y === manuals[i].name) {
              id = manuals[i].id;
              break;
            }
         }
         if (id !== "") {
            const sheet = "sheet_" + id.toString();
            const respy = await axios.get(apiEndpoint() + `/api/blob/folder/sheetfile/read/${"admin"}/${templateSelect}/${currentSelect}/${sheet}/${"table.json"}`);
            if (respy.status === 200) {
               for (let j=0; j < respy.data.tableItem.length; j++) {
                  rowno= respy.data.tableItem[1].id;
                  colno= respy.data.tableItem[1].col[6].id;
                  link= respy.data.tableItem[1].col[6].uploadLink;
                  ready = true;
                  break;
              }
            }
         }
         if (ready === true && id !== "" && rowno !== "" && colno !== "" && link !== "") {
         const sheet = "sheet_" + id;
         const rowx = "row_" + rowno;
         const colx = "col_" + colno;
         await axios.get(apiEndpoint()+ `/api/blob/folder/sheet/read/${"admin"}/${templateSelect}/${currentSelect}/${sheet}/${rowx}/${colx}/${link}`, { responseType: "blob" })
        .then((response) => {
         const reader = new FileReader();
         reader.readAsDataURL(response.data); 
         reader.onload = function () {
         const imageDataUrl = reader.result;
         setTestPdf(imageDataUrl);
         };
         setViewWait(true);
         });
        }

        break;

     case "NDE-PM":
         t = z.split("-");
         currentSelect = "flowchart";
         for (let i=0; i < flowcharts.length; i++) {
            if (y === flowcharts[i].name) {
              id = flowcharts[i].id;
              break;
            }
         }
         if (id !== "") {
            const sheet = "sheet_" + id.toString();
            const respy = await axios.get(apiEndpoint() + `/api/blob/folder/sheetfile/read/${"admin"}/${templateSelect}/${currentSelect}/${sheet}/${"table.json"}`);
            if (respy.status === 200) {
               for (let j=0; j < respy.data.tableItem.length; j++) {
                  rowno= respy.data.tableItem[1].id;
                  colno= respy.data.tableItem[1].col[6].id;
                  link= respy.data.tableItem[1].col[6].uploadLink;
                  filename= respy.data.tableItem[1].col[6].uploadName;

                  ready = true;
                  break;
              }
            }
         }
         if (ready === true && id !== "" && rowno !== "" && colno !== "" && link !== "") {
         const sheet = "sheet_" + id;
         const rowx = "row_" + rowno;
         const colx = "col_" + colno;
         setWaitIndicatorStart(true);
         setPercentCompleted(0);
         await axios({
            method: "get",
            url: apiEndpoint()+ `/api/blob/folder/sheet/read/${"admin"}/${templateSelect}/${currentSelect}/${sheet}/${rowx}/${colx}/${link}`,
            responseType: "blob",
            onDownloadProgress: (progressEvent) => {
                      setPercentCompleted(Math.floor((progressEvent.loaded * 100) / progressEvent.total)); 
            },
            })
          // await axios.get(apiEndpoint()+ `/api/blob/folder/sheet/read/${"admin"}/${templateSelect}/${currentSelect}/${sheet}/${rowx}/${colx}/${link}`, { responseType: "blob" },{onDownloadProgress: (progressEvent) => {
             //         setPercentCompleted(Math.floor((progressEvent.loaded * 100) / progressEvent.total)); 
           // }})
         .then((response) => {
         const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
         download(filename, "", downloadUrl);
         });
         setPercentCompleted(100);
        // setWaitIndicatorStart(false);
       //  window.alert("Download Success");
         }
         break;


     case "NDE-3DMM":
         t = z.split("-");
         currentSelect = "flowchart";
         for (let i=0; i < flowcharts.length; i++) {
            if (y === flowcharts[i].name) {
              id = flowcharts[i].id;
              break;
            }
         }
         if (id !== "") {
            const sheet = "sheet_" + id.toString();
            const respy = await axios.get(apiEndpoint() + `/api/blob/folder/sheetfile/read/${"admin"}/${templateSelect}/${currentSelect}/${sheet}/${"table.json"}`);
            if (respy.status === 200) {
               for (let j=0; j < respy.data.tableItem.length; j++) {
                  rowno= respy.data.tableItem[1].id;
                  colno= respy.data.tableItem[1].col[8].id;
                  link= respy.data.tableItem[1].col[8].uploadLink;
                  link = "None"
                  filename= respy.data.tableItem[1].col[8].uploadName;
                  window.open(respy.data.tableItem[1].col[8].name, "_blank");
                  ready = true;
                  break;
              }
            }
         }
         break;

     case "NDE-P":
         currentSelect = "manual";
         for (let i=0; i < manuals.length; i++) {
            if (y === manuals[i].name) {
              id = manuals[i].id;
              break;
            }
         }
         if (id !== "") {
            const sheet = "sheet_" + id.toString();
            const respy = await axios.get(apiEndpoint() + `/api/blob/folder/sheetfile/read/${"admin"}/${templateSelect}/${currentSelect}/${sheet}/${"table.json"}`);
            if (respy.status === 200) {
               for (let j=0; j < respy.data.tableItem.length; j++) {
                  rowno= respy.data.tableItem[1].id;
                  colno= respy.data.tableItem[1].col[7].id;
                  link= respy.data.tableItem[1].col[7].uploadLink;
                  filename= respy.data.tableItem[1].col[7].uploadName;
          
                  ready = true;
                  break;
              }
            }
         }
         if (ready === true && id !== "" && rowno !== "" && colno !== "" && link !== "") {
         const sheet = "sheet_" + id;
         const rowx = "row_" + rowno;
         const colx = "col_" + colno;
         await axios.get(apiEndpoint()+ `/api/blob/folder/sheet/read/${"admin"}/${templateSelect}/${currentSelect}/${sheet}/${rowx}/${colx}/${link}`, { responseType: "blob" })
        .then((response) => {
         const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
         download(filename, "", downloadUrl);
         });
         window.alert("Download Success");
         }

        break;

     case "NDE-T":
         const notes = [];
         currentSelect = "manual";
         for (let i=0; i < manuals.length; i++) {
            if (y === manuals[i].name) {
              id = manuals[i].id;
              break;
            }
         }
         if (id !== "") {
            const sheet = "sheet_" + id.toString();
            const respy = await axios.get(apiEndpoint() + `/api/blob/folder/sheetfile/read/${"admin"}/${templateSelect}/${currentSelect}/${sheet}/${"table.json"}`);
            if (respy.status === 200) {
               for (let j=0; j < respy.data.tableItem.length; j++) {
                  rowno= respy.data.tableItem[1].id;
                  for (let k =0; k < respy.data.tableItem[1].col.length; k++) {
                    if (k >= 8) {
                     colno= respy.data.tableItem[1].col[k].id;
                     link= respy.data.tableItem[1].col[k].uploadLink;
                     filename= respy.data.tableItem[1].col[k].uploadName;
                     notes.push({ id: id, filename: filename, rowno: rowno, colno: colno, link: link });
                     ready = true;
                    }
                  }
                  break;
              }
            }
         }
         if (ready === true && id !== "" && rowno !== "" && colno !== "" && link !== "") {
             setTechnicalNotes(notes);
         }
         break;


     case "LOC":
         currentSelect = "spreadsheet";
         t = z.split("-");
         let t1 = s.split("[");
         t1 = t1[1].split("]");
         for (let i=0; i < spreadsheets.length; i++) {
            if (y === spreadsheets[i].name) {
              id = spreadsheets[i].id;
              break;
            }
         }
         if (id !== "") {
            const sheet = "sheet_" + id.toString();
            const respy = await axios.get(apiEndpoint() + `/api/blob/folder/sheetfile/read/${"admin"}/${templateSelect}/${currentSelect}/${sheet}/${"table.json"}`);
            if (respy.status === 200) {
               for (let j=0; j < respy.data.tableItem.length; j++) {
                if (t[0] === respy.data.tableItem[j].col[0].name && t[1] === respy.data.tableItem[j].col[1].name && t[2] === respy.data.tableItem[j].col[2].name && t1[0] === respy.data.tableItem[j].col[4].name) {
                  rowno= respy.data.tableItem[j].id;
                  colno= respy.data.tableItem[j].col[5].id;
                  link= respy.data.tableItem[j].col[5].uploadLink;
                  filename= respy.data.tableItem[j].col[5].uploadName;
                  ready = true;
                  break;
                }
              }
            }
         }
         if (ready === true && id !== "" && rowno !== "" && colno !== "" && link !== "") {
         const sheet = "sheet_" + id;
         const rowx = "row_" + rowno;
         const colx = "col_" + colno;
         await axios.get(apiEndpoint()+ `/api/blob/folder/sheet/read/${"admin"}/${templateSelect}/${currentSelect}/${sheet}/${rowx}/${colx}/${link}`, { responseType: "blob" })
         .then((response) => {
         const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
         download(filename, "", downloadUrl);
         });
         window.alert("Download Success");
         }
         break;

     default:
         break;
    }
    if (link === "") {
      window.alert("Document not uploaded !");
    }
    setDocState(["", "", "", "", ""]);
  }


  async function onClickOpenDoc(info) {
         const currentSelect = "manual";
         const sheet = "sheet_" + info.id;
         const rowx = "row_" + info.rowno;
         const colx = "col_" + info.colno;
         const link = info.link;
         await axios.get(apiEndpoint()+ `/api/blob/folder/sheet/read/${"admin"}/${templateSelect}/${currentSelect}/${sheet}/${rowx}/${colx}/${link}`, { responseType: "blob" })
        .then((response) => {
         const reader = new FileReader();
         reader.readAsDataURL(response.data); 
         reader.onload = function () {
         const imageDataUrl = reader.result;
         setTestPdf(imageDataUrl);
         };
         setViewWait(true);
         });

  }

  return <div className={styles.root}>
  { updateTemplate === true && updateSelectedDatabase() }
  { updateFlowchart === true && updateSelectedFlowchart() }

  { reset === true && <>
   <div style={{ fontSize: "small" }}>

   <div style={{ marginTop: "10px" }}></div>
  <div style={{ display: "flex" }}>
  <div style={{ marginLeft: "1%", marginTop: "5px", marginRight: "2%", marginBottom: "0px", width: "30%", height: "50px", backgroundColor: color_1, border: "1px solid grey" }}>
  <div style={{ marginLeft: "0%", marginTop: "0px", marginRight: "0%", marginBottom: "0px", width: "100%", height: "25px", backgroundColor: color_1, border: "1px solid grey" }}>
          <h6 style={{ fontSize: "small", marginTop: "0px", textAlign: "center", color: "white" }}> Workflow Name</h6>  
  </div>

            <select style={{ marginLeft: "0%", marginTop: "0px", marginRight: "0%", marginBottom: "0px", width: "100%", height: "25px", color: color_3, backgroundColor: color_2, border: "1px solid grey" }} id= {"Dropdown-1"} onChange={(e) => handleDropdown(2, e)}>>
            {[...storeTemplateInfo.map(d1 => d1 === templateSelect ? <option key={d1} value={d1} selected >{d1}</option>:<option key={d1} value={d1} >{d1}</option>)]}
            </select>

  </div>

  <div style={{ marginLeft: "1%", marginTop: "5px", marginRight: "2%", marginBottom: "0px", width: "30%", height: "50px", backgroundColor: color_1, border: "1px solid grey" }}>
  <div style={{ marginLeft: "0%", marginTop: "0px", marginRight: "0%", marginBottom: "0px", width: "100%", height: "25px", backgroundColor: color_1, border: "1px solid grey" }}>
          <h6 style={{ fontSize: "small", marginTop: "0px", textAlign: "center", color: "white" }}> Damage Mechanisms</h6>  
  </div>

   <select style={{ marginLeft: "0%", marginTop: "0px", marginRight: "0%", marginBottom: "0px", width: "100%", height: "25px", color: color_3, backgroundColor: color_2, border: "1px solid grey" }} id= {"Dropdown-2"} onChange={(e) => handleDropdown(3, e)}>>
            {[...storeComponentNode.map(d1 => d1.name === componentSelect ? <option key={d1.name} value={d1.name} selected >{d1.name}</option>:<option key={d1.name} value={d1.name} >{d1.name}</option>)]}

   </select>

  </div>

  <div style={{ marginLeft: "1%", marginTop: "5px", marginRight: "2%", marginBottom: "0px", width: "30%", height: "50px", backgroundColor: color_1, border: "1px solid grey" }}>
  <div style={{ marginLeft: "0%", marginTop: "0px", marginRight: "0%", marginBottom: "0px", width: "100%", height: "25px", backgroundColor: color_1, border: "1px solid grey" }}>
          <h6 style={{ fontSize: "small", marginTop: "0px", textAlign: "center", color: "white" }}> Inspect</h6>  
  </div>
   <select style={{ marginLeft: "0%", marginTop: "0px", marginRight: "0%", marginBottom: "0px", width: "100%", height: "25px", color: color_3, backgroundColor: color_2, border: "1px solid grey" }} id= {"Dropdown-3"} onChange={(e) => handleDropdown(4, e)}>>
            {[...storeSubComponentNode.map(d1 => d1.name === subComponentSelect ? <option key={d1.name} value={d1.name} selected >{d1.name}</option>:<option key={d1.name} value={d1.name} >{d1.name}</option>)]}

   </select>
  </div>


  </div>
</div>

  <div style={{ marginTop: "10px" }}></div>
  <div style={{ display: "none" }}>

    <label style={{ marginLeft: "20px" }}>
      <input type="radio" name="dropdown-group" checked = {filterPlot[0]} onChange={(e) => handleEditor("CHECKBOX", 11, e)}/>
      <span style={{ fontSize: "small", marginLeft: "10px" }}>Mode-1</span>
    </label>
    <label style={{ marginLeft: "100px" }}>
      <input type="radio" name="dropdown-group" checked = {filterPlot[1]} onChange={(e) => handleEditor("CHECKBOX", 12, e)}/>
      <span style={{ fontSize: "small", marginLeft: "10px" }}>Mode-2</span>
    </label>

    <label style={{ marginLeft: "100px" }}>
      <input type="radio" name="dropdown-group" checked = {filterPlot[2]} onChange={(e) => handleEditor("CHECKBOX", 13, e)}/>
      <span style={{ fontSize: "small", marginLeft: "10px" }}>Mode-3</span>
    </label>
  </div>

{imageReady === true && <>
  <div style={{ marginTop: "10px" }}></div>
   <div>
       <img style={{ width: "100%", height: "100px" }} src= {imageSelect} alt="image" />
  </div>
  </>}


 { loading === false && 
   <h6 style={{ fontSize: "small", marginTop: "50px", textAlign: "center", color: "red" }}>Loading .... Wait</h6>     
 }
 { loading === true && (storeSubComponentNode.length <= 0 || isItemEmpty !== true || isSubItemEmpty !== true) && 
   <h6 style={{ fontSize: "small", marginTop: "50px", textAlign: "center", color: "red" }}>Database not created for selected Component/Subcomponent</h6>     
 }
 {updateReady === true && filterPlot[0] === true && storeSubComponentNode.length > 0 && isItemEmpty === true && isSubItemEmpty === true && 
   <WorkflowMode0 workflow={templateSelect} component = {componentSelect} subcomponent={subComponentSelect} documentProcess={documentProcess} data={storeFlowchartInfo} training={manuals} reference={references} docstate={docState}/>
 }
 {updateReady === true && filterPlot[1] === true && 
   <WorkflowMode1 workflow={templateSelect} filterTemplate={""} />
 }
 {updateReady === true && filterPlot[2] === true && 
   <WorkflowMode2 workflow={templateSelect} filterTemplate={""}/>
 }
 {imageReady === true && <>
  <div style={{ marginTop: "10px" }}></div>
   <div>
       <img style={{ width: "100%", height: "100px" }} src= {imageSelect} alt="image" />
  </div>
  </>}

</>}
  {refresh === true && <> </>}
  {refresh === false && <> </>}

 {viewWait === true && <Modal show={true} backdrop="static" centered size= "xl" style={{ width: "1400px", height: "800px" }} onHide={() => setViewWait(false)}>
  <Modal.Header closeButton>  </Modal.Header>
  <iframe src={testPdf} title="NDE" id="my-frame" style={{ width: "1125px", height: "650px" }}/>

  </Modal>}


 {technicalNotes.length > 0 && <Modal show={true} backdrop="static" centered size= "lg" onHide={() => setTechnicalNotes([])}>
  <Modal.Header closeButton>  </Modal.Header>
    {technicalNotes.map(x =>
    <Button style={{ marginLeft: "10%", marginTop: "10px", marginRight: "10%", marginBottom: "10px" }} variant={TabConfig.color} size="sm" disabled={false} onClick={() => onClickOpenDoc(x)}>
                       {x.filename}
                      </Button>)}

   
  </Modal>}

  { waitIndicatorStart === true && <Modal show={true} backdrop="static" centered size= "sm" onHide={() => setWaitIndicatorStart(false)}>
     <Modal.Header closeButton>  </Modal.Header>
    <Button style={{ marginLeft: "10%", marginTop: "10px", marginRight: "10%", marginBottom: "10px" }} variant={TabConfig.color} size="sm" disabled={false}>
    {percentCompleted} % Downloaded
    </Button>
       </Modal>}

  </div>;
}

