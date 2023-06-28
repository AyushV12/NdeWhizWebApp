// @flow strict
// Copyright (C) 2022 Deep Skills Inc., - All Rights Reserved
// Unauthorized copying of this file, via any medium is strictly prohibited
// Proprietary and confidential

import React, { useState, useEffect } from "react";
import styles from "./workflowmode0.module.css";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Col } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

import axios from "axios";

import ToggleButton from "react-toggle-button";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import { Check, X } from "../../utils/buttons";
import { apiEndpoint, download } from "../../utils/common";

import { TabConfig } from "../../config/config";

type WorkflowMode0Props = {
isAdmin : boolean,
filterTemplate: string,
data: Array<>,
filterSubItem: string,
subcomponent: string,
component: string,
workflow: string,
documentProcess: (m:string, s:string, t:string) => Promise<void>;
training: Array<>,
reference: Array<>,
docstate: Array<>,
};

let indexA = [];
let indexB = [];
let indexC = [];

export default function WorkflowMode0(props: WorkflowMode0Props) {
  const [checkboxSelect, setCheckboxSelect] = useState<Array<boolean>>([]);

  const [idNode, setIdNode] = useState<string>("");

  const [updateTemplate, setUpdateTemplate] = useState<boolean>(false);
  const [autoSelect, setAutoSelect] = useState<boolean>(false);
  const [initEnable, setInitEnable] = useState<boolean>(false);

  const [userStoreFlowchartInfo, setUserStoreFlowchartInfo] = useState<Array<[]>>([]);

  const [finalItem, setFinalItem] = useState<Array<[]>>([]);
  const [finalEnable, setFinalEnable] = useState<boolean>(false);
  const [endEnable, setEndEnable] = useState<boolean>(false);

  const [viewWait, setViewWait] = useState<boolean>(false);
  const [subComponentSplit, setSubComponentSplit] = useState<Array<[]>>([]);

  const [sheetItems, setSheetItems] = useState<Array<Project>>([]);
  const [selectedSheetItems, setSelectedSheetItems] = useState<Array<Project>>([]);
  const [tableItems, setTableItems] = useState<Array<Project>>([]);
  const [selectedTableItems, setSelectedTableItems] = useState<Array<Project>>([]);
  const [tableTitle, setTableTitle] = useState<string>("");
  const [edtxSxSelect, setEdtxSxSelect] = useState<boolean>(false);
  const [currentSelect, setCurrentSelect] = useState<string>("flowchart");

  useEffect(() => {
    async function admin() {
    }
    admin();
  }, []);

  useEffect(() => {
    async function fetchMe() {
      setCheckboxSelect([true, false, false]);
      setUpdateTemplate(true);
    }
    fetchMe();
  }, []);

  async function executeUpdateTemplate() {
    setSubComponentSplit(props.subcomponent.split("-"));
    setUpdateTemplate(false);
    setAutoSelect(false);
    setFinalItem([]);
    setFinalEnable(false);
    setEndEnable(false);
    indexA =[];
    indexB =[];
    indexC =[];
    setIdNode("");
    setInitEnable(true);
  }

  function onClickStartNavigation() {
    setAutoSelect(true);
  }

  async function onClickResetTree() {
    setUserStoreFlowchartInfo([]);
    setUpdateTemplate(true);
  }

  function processItemMessage(str:string) {
    let x = str.split("<=");
    if (x.length === 2) {
      return "Less Then or Equal" + x[1];
    }
    x = str.split(">=");
    if (x.length === 2) {
      return "Greater Then or Equal" + x[1];
    }
    x = str.split("<");
    if (x.length === 2) {
      return "Less then" + x[1];
    }
    x = str.split(">");
    if (x.length === 2) {
      return "Greater Then" + x[1];
    }

    return str;
  }

  function initTree() {
   setInitEnable(false);
   const storeItem = JSON.parse(JSON.stringify(props.data));
   if (storeItem.length > 0) {
     for (let i=0; i< storeItem.length; i++) {
        storeItem[i].visible = true;
     }
   }
   setUserStoreFlowchartInfo(storeItem);
  }

  function onClickNextItemTree(id:string, level, n:number) {
   resMapCheckSelect(id, level, n);
   const storeItem = userStoreFlowchartInfo;
   let found = false;
   for (let i=0; i < storeItem.length; i++) {
      for (let j=0; j < storeItem[i].subItem.length; j++) {
        if (idNode === storeItem[i].subItem[j].id) {
          if (storeItem[i].subItem[j].item.length === 0 && storeItem[i].subItem[j].link !== "") {
              const linkedItem = NextLinkedItemTree(storeItem[i].subItem[j].link);
              if (linkedItem.found === true) { 
                storeItem[i].subItem[j].item = linkedItem.xitem;
              }
           }
           if (storeItem[i].subItem[j].item.length === 0) {
              found = true;
              setEndEnable(true);
              break;
           }         
           for (let k=0; k < storeItem[i].subItem[j].item.length; k++) {
             if (storeItem[i].subItem[j].item[k].type === "") {
               storeItem[i].subItem[j].item[k].visible = true;
             } else {
               setFinalEnable(true);
               setFinalItem(storeItem[i].subItem[j].item);
               break;
             }
           }
           for (let k=0; k < storeItem[i].subItem.length; k++) {
             if (idNode !== storeItem[i].subItem[k].id) {
               storeItem[i].subItem[k].visible = false;
               setVisibleStatus(storeItem[i].subItem[k].id, level, 0, 0);
             }
           }
          found = true;
          break;
        } else {
          found = NextTreeLevel(storeItem[i].subItem[j].item, level, idNode);
          if (found === true) {
            break;
          }
        }
      }
      if (found=== true) {
       break;
      }
   }
   setUserStoreFlowchartInfo(storeItem);
  }

  function NextLinkedItemTree(id:string) {
    const storeItem = userStoreFlowchartInfo;
    let found = false;
    let xitem = {};
    for (let i=0; i < storeItem.length; i++) {
      if (id === storeItem[i].id) {
         found = true;
         xitem = storeItem[i];
         break;
      }
      for (let j=0; j < storeItem[i].subItem.length; j++) {
        const x = LinkedItemTree(storeItem[i].subItem[j].item, id);
        found = x.found;
        xitem = x.xitem;
        if (found === true) {
          break;
        }
      }
      if (found === true) {
       break;
      }
    }
    return { found: found, xitem: xitem };
  }

  function LinkedItemTree(item, id) {
    let found = false;
    let xitem = {};
    for (let i=0; i < item.length; i++) {
      if (id === item[i].id) {
        xitem = item;
        found = true;
        break;
      }
      if (found === true) {
        break;
      }
      for (let j=0; j < item[i].subItem.length; j++) {
        const x = LinkedItemTree(item[i].subItem[j].item, id);
        found = x.found;
        xitem = x.xitem;

        if (found === true) {
          break;
        }
      }
      if (found === true) {
       break;
      }
    }
    return { found: found, xitem: xitem };
  }

  function NextTreeLevel(item, level, idNode) {
    let found = false;
    for (let i=0; i < item.length; i++) {
       for (let j=0; j < item[i].subItem.length; j++) {
         if (idNode === item[i].subItem[j].id) {
           if (item[i].subItem[j].item.length === 0 && item[i].subItem[j].link !== "") {
              const linkedItem = NextLinkedItemTree(item[i].subItem[j].link);
              if (linkedItem.found === true) { 
                item[i].subItem[j].item = linkedItem.xitem;
              }
           }
           if (item[i].subItem[j].item.length === 0) {
             found = true;
             setEndEnable(true);
             break;
           }

           for (let k=0; k < item[i].subItem[j].item.length; k++) {
             if (item[i].subItem[j].item[k].type === "") {
               item[i].subItem[j].item[k].visible = true;
             } else {
               setFinalEnable(true);
               setFinalItem(item[i].subItem[j].item);
               break;
             }
           }
           for (let k=0; k < item[i].subItem.length; k++) {
             if (idNode !== item[i].subItem[k].id) {
               item[i].subItem[k].visible = false;
               setVisibleStatus(item[i].subItem[k].id, level, 0, 0);

             }
           }
           found = true;
         } else {
           found = NextTreeLevel(item[i].subItem[j].item, level, idNode);
           if (found === true) {
             break;
           }
         }
       }
       if (found === true) {
         break;
       }
    }
    return found;
  }

  function onClickNextSubItemTree(id:string, level, n:number) {
   resMapCheckSelect(id, level, n);

    const storeItem = userStoreFlowchartInfo;
    let found = false;
    for (let i=0; i < storeItem.length; i++) {
      if (idNode === storeItem[i].id) {
        if (storeItem[i].subItem.length === 0) {
          found = true;
          setEndEnable(true);
          break;
        }
        for (let j=0; j < storeItem[i].subItem.length; j++) {
          storeItem[i].subItem[j].visible = true;
        }
        for (let k=0; k < storeItem.length; k++) {
          if (idNode !== storeItem[k].id) {
             storeItem[k].visible = false;
            setVisibleStatus(storeItem[k].id, level, 0, 0);

         } 
        }
        found = true;
        break;
      }
      if (found === true) {
       break;
      }
      for (let j=0; j < storeItem[i].subItem.length; j++) {
        found = NextSubTreeLevel(storeItem[i].subItem[j].item, level, idNode);
        if (found === true) {
          break;
        }
      }
      if (found === true) {
       break;
      }
    }
    setUserStoreFlowchartInfo(storeItem);
  }

  function NextSubTreeLevel(item, level, idNode) {
    let found = false;
    for (let i=0; i < item.length; i++) {
      if (idNode === item[i].id) {
        if (item[i].subItem.length === 0) {
         found = true;
         setEndEnable(true);
         break;
        }
        for (let j=0; j < item[i].subItem.length; j++) {
          item[i].subItem[j].visible = true;
        }
        for (let k=0; k < item.length; k++) {
          if (idNode !== item[k].id) {
            item[k].visible = false;
            setVisibleStatus(item[k].id, level, 0, 0);
          } 
        }
        found = true;
        break;
      }
      if (found === true) {
        break;
      }
      for (let j=0; j < item[i].subItem.length; j++) {
        found = NextSubTreeLevel(item[i].subItem[j].item, level, idNode);
        if (found === true) {
          break;
        }
      }
      if (found === true) {
       break;
      }
    }
    return found;
  }

  function executeMapIndex(id:string, level, n:number, name:string, subItem:number) {
    let found = false;
    for (let i=0; i < indexA.length; i++) {
      if (indexA[i][0] === id && indexA[i][1] === level && indexA[i][2] === n) {
        found = true;
        break;
      }
    }
    if (found === false) {
      if (level === 2) {
        indexA.push([id, level, n, 1, 100, 0, 0, name, 0]);
        indexB = [];
        for (let i =0; i < indexA.length; i++) {
          if (indexA[(indexA.length-1)-i][6] === 2) {
           indexB.push(indexA[(indexA.length-1)-i]);
          }
        }
        indexC = [];
        for (let i =0; i < indexA.length; i++) {
          if (indexA[i][6] === 2) {
            indexC.push(indexA[i]);
          }
        }
      } else {
       indexA.push([id, level, n, 1, 100, 0, 0, name, subItem]);
      }
    }
  }


  function getMapCheckSelect(id:string, level, n:number) {
    if (indexA.length > 0) {
      for (let i=0; i < indexA.length; i++) {
       if (indexA[i][0] === id && indexA[i][1] === level && indexA[i][2] === n) {
           if (indexA[i][5] === 0) return false;
           if (indexA[i][5] === 1) {
             if (indexA[i][6] === 0) {
              indexA[i][6] = 1; 
             }
             return true;
           }
        }
      }
    }
   return false;
  }

  function autoMapCheckSelect(id:string, level, n:number) {
    if (indexA.length > 0) {
      for (let i=0; i < indexA.length; i++) {
       if (indexA[i][0] === id && indexA[i][1] === level && indexA[i][2] === n) {
           if (indexA[i][6] === 0) return false;
           if (indexA[i][6] === 1) return true;
        }
      }
    }
   return false;
  }

function resMapCheckSelect(id:string, level, n:number) {
    if (indexA.length > 0) {
      for (let i=0; i < indexA.length; i++) {
       if (indexA[i][0] === id && indexA[i][1] === level && indexA[i][2] === n) {
            indexA[i][6] = 2;
        }
      }
    }
   indexB = [];
    for (let i =0; i < indexA.length; i++) {
     if (indexA[(indexA.length-1)-i][6] === 2) {
      indexB.push(indexA[(indexA.length-1)-i]);
     }
    }
   indexC = [];
    for (let i =0; i < indexA.length; i++) {
     if (indexA[i][6] === 2) {
      indexC.push(indexA[i]);
     }
    }
   
   return false;
  }

  function onClickMapTreeCheckBox(id:string, level, n:number, name:string) {
    if (indexA.length > 0) {
      for (let i=0; i < indexA.length; i++) {
        if (indexA[i][0] === id && indexA[i][1] === level && indexA[i][2] === n) {
          if (indexA[i][4] === n) {
            indexA[i][4] = 100;
            setIdNode("");
            break;
          } else {
            indexA[i][4] = n;
            indexA[i][5] = 1;
            setIdNode(id);
            break;
          }
        } else {
       indexA[i][4] = 100;
      }

      }
    }
  }

  function getVisibleStatus(id:string, level, n:number, name:string) {
    if (indexA.length > 0) {
      for (let i=0; i < indexA.length; i++) {
       if (indexA[i][0] === id && indexA[i][1] === level && indexA[i][2] === n) {
           if (indexA[i][3] === 0) return false;
           if (indexA[i][3] === 1) return true;
       }
      }
    }
    return false;
  }


  function setVisibleStatus(id:string, level, n:number, name:string) {
    if (indexA.length > 0) {
      for (let i=0; i < indexA.length; i++) {
       if (indexA[i][0] === id && indexA[i][1] === level) {
           indexA[i][3] = 0; 
       }
      }
    }
  }


function executeTree(x1: Array[], n0, n1:number, cnt:number, check: boolean) {
  cnt = cnt + 2;
  let subItemflag = true;
  let itemflag = true;
  let itemNameList = "";
  for (let i = 0; i < x1.length; i++) {
     if (indexA.length > 0) {
        for (let j=0; j < indexA.length; j++) {
           if (indexA[j][0] === x1[i].id) {
              if (indexA[j][6] === 2) {
                itemflag = false;
                for (let k=0; k < x1[i].subItem.length; k++) {
                  for (let k1=0; k1 < indexA.length; k1++) {
                     if (indexA[k1][0] === x1[i].subItem[k].id) {
                        if (indexA[k1][6] === 2 || indexA[k1][6] === 6) {
                          subItemflag = false;
                          break;
                        }
                     }
                  }
                  if (subItemflag === false) {
                   break;
                 }

                }
                break;
              }
           }
        }
        if (itemflag === false) {
          break;
        }
      }
  }
  if (itemflag === true) {
   subItemflag = false;
   if (check === true) {
//    subItemflag = true;
   }
   itemflag = false;
   for (let i = 0; i < x1.length; i++) {
     if (x1[i].visible === true) {
       itemflag = true;
       break;
     }
   }
   
  }
  if (itemflag === true) {
    for (let k=0; k < x1.length; k++) {
        itemNameList = itemNameList + x1[k].name;
        if (k !== (x1.length-1)) {
        itemNameList = itemNameList + " , ";
        }
    }            
  }
  return (<div>
             {itemflag === true && x1.length > 0 && <div className={styles.dtNode} style={{ backgroundColor: "#FFBF00" }} > 
              <h5>Select {processItemMessage(itemNameList)} </h5>
              <ul>
                 { x1.map((x2, n2) =>
                  <>
                  {executeMapIndex(x2.id, cnt, n2, x2.name, x1.length)}
                  {getVisibleStatus(x2.id, cnt, n2, x2.name) === true && <> 
                  {getMapCheckSelect(x2.id, cnt, n2, x2.name) === false && <>
                    <li>
                    <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={false} onClick={() => onClickMapTreeCheckBox(x2.id, cnt, n2, x2.name)}>
                    {x2.name}
                    </Button>
                    </li>
                   </> }
                  { autoMapCheckSelect(x2.id, cnt, n2, x2.name) === true && onClickNextSubItemTree(x2.id, cnt, n2, x2.name)}
                  </> }
                 </>)}
               </ul> 
               </div>}

           
          { subItemflag === true && x1 !== undefined && x1.length > 0 && x1.map((x2, n2) =>
            <>
              {getVisibleStatus(x2.id, cnt, n2, x2.name) === true && <div>
                  <div className={styles.dtNode} style={{ backgroundColor: "#FFBF00" }}>
                  <h5>Click on your choice to proceed ? </h5>
                  <ul>
                { x2.subItem.length > 0 && x2.subItem.map((x3, n3) =>
                  <>
                    {executeMapIndex(x3.id, cnt+1, n3, x3.name, x2.subItem.length)}

                    {getVisibleStatus(x3.id, cnt+1, n3, x3.name) === true && 
                      <div>
                          {getMapCheckSelect(x3.id, cnt+1, n3, x3.name) === false && <>
                          <li>
                          <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={false} onClick={() => onClickMapTreeCheckBox(x3.id, cnt+1, n3, x3.name)}>
                          {x3.name}
                         </Button>
                         </li>
                     
                         </>}
                         { autoMapCheckSelect(x3.id, cnt+1, n3, x3.name) === true && onClickNextItemTree(x3.id, cnt+1, n3, x3.name)}
                     </div>
                    }
                 </>)}
                  </ul> 
                  </div>
                   </div>}
           </>)}
         
          { subItemflag === false && x1 !== undefined && x1.length > 0 && x1.map((x2, n2) =>
            <>
              {getVisibleStatus(x2.id, cnt, n2, x2.name) === true && 
                <div>
                  
                {x2.subItem.length > 0 && x2.subItem.map((x3, n3) =>
                  <>
                    {getVisibleStatus(x3.id, cnt+1, n3, x3.name) === true && 
                      <div>
                       {x3.item !== undefined && x3.item.length > 0 && executeTree(x3.item, n0, n1, cnt, false) }
                     </div>}
                  </>)}

                </div>}
           </>)}

   </div>);
 }


  async function onClickFinalStep(x, y, z) {
    switch (x) {

     case "FLOW":
           props.documentProcess(x, props.component, props.subcomponent);
           break;

     case "NDE":
           props.documentProcess(x, y, z);
          break;

     case "NDE-GE":
           props.documentProcess(x, props.component, props.subcomponent);
          break;

     case "NDE-PM":
           props.documentProcess(x, props.component, props.subcomponent);
          break;

     case "NDE-3DMM":
           props.documentProcess(x, props.component, props.subcomponent);
          break;

     case "NDE-E":
           props.documentProcess("NDE-E", y, z);
          break;

     case "NDE-V":
           props.documentProcess("NDE-V", y, z);
          break;

     case "NDE-S":
           props.documentProcess("NDE-S", y, z);
          break;

     case "NDE-C":
           props.documentProcess("NDE-C", y, z);
          break;

     case "NDE-P":
           props.documentProcess("NDE-P", y, z);
          break;

     case "NDE-T":
           props.documentProcess("NDE-T", y, z);
          break;

     case "LOC":
           props.documentProcess(x, props.component, props.subcomponent, z);
          break;

     case "PATH":
           setViewWait(true);
          break;

     default:break;
    }

  }

  async function onClickBackNavigate(x) {
   let val = 0;
   let found = false;
   for (let i=0; i < indexA.length; i++) {
     if (indexA[i][0] ===x[0] && indexA[i][5] === 1) {
        val =i;
        indexA[i][5]=0;
        indexA[i][6]=0;
        indexA[i][4]=100;
        found = true;
        break;
     }
   }
   if (found === true) {
      const n = indexA.length - val;
      if (val === 0) {
       indexA.splice(val, n);
      } else {
        indexA.splice(val, n);
      }


   indexB = [];
    for (let i =0; i < indexA.length; i++) {
     if (indexA[(indexA.length-1)-i][6] === 2) {
      indexB.push(indexA[(indexA.length-1)-i]);
     }
    }
   indexC = [];
    for (let i =0; i < indexA.length; i++) {
     if (indexA[i][6] === 2) {
      indexC.push(indexA[i]);
     }
    }

      setEndEnable(false);
      setFinalEnable(false);
      setFinalItem([]);
   }
   console.log(indexA);
   
  }

 async function handleEditor(str:string, val:number, e: SyntheticKeyboardEvent<HTMLInputElement>) {
    switch (str) {

     case "CHECKBOX":
        if (val === 10) {
          setUpdateTemplate(true);
        }
        if (val === 11) {
          setCheckboxSelect([true, false, false]);
        }
        if (val === 12) {
          setSheetItems(props.training);
          setSelectedSheetItems([]);
          setSelectedTableItems([]);
          setTableItems([]);
          setSheetItems(props.training);
          setCurrentSelect("manual");
          setEdtxSxSelect(false);
          setCheckboxSelect([false, true, false]);
        }
        if (val === 13) {
          setSheetItems(props.reference);
          setSelectedSheetItems([]);
          setSelectedTableItems([]);
          setTableItems([]);
          setSheetItems(props.reference);
          setCurrentSelect("reference");
          setEdtxSxSelect(false);
          setCheckboxSelect([false, false, true]);
        }

        break;

        default:
          break;
      }
  }

  async function onClickEditManual() {
    const sheet = "sheet_" + selectedSheetItems[0].id;
    const respy = await axios.get(apiEndpoint() + `/api/blob/folder/sheetfile/read/${"admin"}/${props.workflow}/${currentSelect}/${sheet}/${"table.json"}`);
    if (respy.status === 200) {
      setTableItems(respy.data.tableItem);
      setTableTitle(respy.data.title);
    }
      setEdtxSxSelect(true);
  }

  function onClickEdtBackManual() {
    setEdtxSxSelect(false);
  }

  function onClickOpenURL(x) {
    window.open(x.name, "_blank");
  }

   function checkTableItemCol(str:string, link:string) {
     if (selectedTableItems.length !== 0) return true;
     let x = false;
     switch (str) {

      case "Download":
      if (link === "") x = true;
      break;

      default:
      x = true;
      break;
     }
     return x;
  }


  async function onClickManualTableItemAction(str:string, link:string, rowno:string, colno:string, filename:string) {
     const sheet = "sheet_" + selectedSheetItems[0].id;
     const rowx = "row_" + rowno;
     const colx = "col_" + colno;
     switch (str) {

      case "Download":
       await axios.get(apiEndpoint()+ `/api/blob/folder/sheet/read/${"admin"}/${props.workflow}/${currentSelect}/${sheet}/${rowx}/${colx}/${link}`, { responseType: "blob" })
      .then((response) => {
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      download(filename, "", downloadUrl);
      });
      window.alert("Download Success");
      break;

      default:
      break;
         
     }
  }

function onManualSelectedChanged(info: Run) {
    const index = selectedSheetItems.indexOf(info);
    if (index >= 0) {
      setSelectedSheetItems(selectedSheetItems => [
        ...selectedSheetItems.slice(0, index),
        ...selectedSheetItems.slice(index + 1),
      ]);
    } else {
      setSelectedSheetItems([]);
      setSelectedTableItems([]);
      setSelectedSheetItems(selectedSheetItems => [...selectedSheetItems, info]);
    }
  }


  return <div className={styles.root}>
    { updateTemplate === true && executeUpdateTemplate() }
    { initEnable === true && initTree() }

    <div style={{ marginTop: "10px" }}></div>
      <div>
       <label style={{ marginLeft: "20px" }}>
        <input type="radio" name="dropdown-group-1" checked = {checkboxSelect[0]} onChange={(e) => handleEditor("CHECKBOX", 11, e)}/>
        <span style={{ fontSize: "small", marginLeft: "10px" }}>Workflow</span>
      </label>
      <label style={{ marginLeft: "100px" }}>
        <input type="radio" name="dropdown-group-2" checked = {checkboxSelect[1]} onChange={(e) => handleEditor("CHECKBOX", 12, e)}/>
        <span style={{ fontSize: "small", marginLeft: "10px" }}>Training</span>
      </label>
      <label style={{ marginLeft: "100px" }}>
        <input type="radio" name="dropdown-group-3" checked = {checkboxSelect[2]} onChange={(e) => handleEditor("CHECKBOX", 13, e)}/>
        <span style={{ fontSize: "small", marginLeft: "10px" }}>Reference</span>
      </label>
    </div>

    { checkboxSelect[0] === true && <>
    <div style={{ marginTop: "10px" }}></div>

    {autoSelect=== false && 
       <div style={{ marginLeft: "1%", marginTop: "5px", marginRight: "2%", marginBottom: "0px", textAlign: "center", width: "96%", height: "80px", backgroundColor: "#FFBF00", border: "1px solid grey" }}>
          <Button style= {{ marginTop: "25px" }} variant={TabConfig.color} size="sm" disabled={false} onClick={() => onClickStartNavigation()} > Start
          </Button>
      </div>
    }
    {autoSelect=== true && 
      <Form>
        <Form.Row>
          <Col xs="auto" md={{ span: 0, offset: 0 }}>
            <Button style={{ marginLeft: "10px", backgroundColor: "#473a4f" }} variant={TabConfig.color} size="sm" disabled={false} onClick={() => onClickResetTree()}>
            Reset
            </Button>
          </Col>
         
          <Col xs="auto" md={{ span: 0, offset: 0 }}>
            {props.docstate[0] !== "NDE-GE" &&
            <Button style={{ marginLeft: "10px", backgroundColor: "#473a4f" }} variant={TabConfig.color} size="sm" disabled={false} onClick={() => onClickFinalStep("NDE-GE", "", "")}>
            Global Effectiveness Table ( DM )
            </Button>
            }
            {props.docstate[0] === "NDE-GE" &&
             <Button variant={TabConfig.color} size="sm"><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/>
             {props.docstate[3]}
             </Button>
           }
          </Col>

        </Form.Row>

      </Form>
    }
    <div style={{ marginTop: "10px" }}></div>
    { autoSelect=== true && 
       <>
       { autoSelect=== true && endEnable === true &&
        <h6 style={{ fontSize: "small", marginTop: "50px", textAlign: "center", color: "red" }}>No Workflow Sequence,Reset to continue...</h6>     
       }


        { autoSelect=== true && finalEnable === true &&
          <>
            <h6 class="text-center" style={{ marginTop: "10px" }}>{"NDE Information"}</h6>
            {finalItem.length > 0 &&
              <table>
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Navigated Path</th>
                    {finalItem.length > 0 && finalItem.map(x => x.type === "LOC" ?<th>{x.name}</th>:<></>)}                             
                   <th>NDE Intro Session</th>
                   <th>3DMM URL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                  <td>
                    {props.docstate[0] !== "FLOW" &&
                     <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={false} onClick={() => onClickFinalStep("FLOW", "", "")}>
                     {"Flowchart"}
                     </Button>
                    }
                    {props.docstate[0] === "FLOW" &&
                      <Button variant={TabConfig.color} size="sm"><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/>
                      {props.docstate[3]}
                     </Button>
                    }
                  </td>
                  <td>
                    <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={false} onClick={() => onClickFinalStep("PATH", "", "")}>
                    {"View"}
                    </Button>
                  </td>
                    <td>
                     {finalItem.length > 0 && finalItem.map(x => x.type === "LOC" ?
                      <>
                      {x.subItem.length > 0 && <>
                      {props.docstate[0] !== x.type &&
                      <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={false} onClick={() => onClickFinalStep(x.type, x.name, x.subItem[0].name)}>
                      {x.subItem[0].name}
                      </Button>
                    }
                    {props.docstate[0] === x.type &&
                     <Button variant={TabConfig.color} size="sm"><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/>
                      {props.docstate[3]}
                      </Button>
                    }
                      </>
                      }
                      </>
                    :<></>)}
                    </td>

                  <td>
                    {props.docstate[0] !== "NDE-PM" &&
                    <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={false} onClick={() => onClickFinalStep("NDE-PM", "", "")}>
                    {"Download"}
                    </Button>
                    }
                    {props.docstate[0] === "NDE-PM" &&
                      <Button variant={TabConfig.color} size="sm"><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/>
                      {props.docstate[3]}
                     </Button>
                    }

                  </td>

                  <td>
                    {props.docstate[0] !== "NDE-3DMM" &&
                    <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={false} onClick={() => onClickFinalStep("NDE-3DMM", "", "")}>
                    {"Open"}
                    </Button>
                    }
                    {props.docstate[0] === "NDE-3DMM" &&
                      <Button variant={TabConfig.color} size="sm"><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/>
                      {props.docstate[3]}
                     </Button>
                    }

                  </td>

                    </tr>
                </tbody>
                <h6 style={{ textAlign: "right", fontSize: "small", color: "red", marginTop: "5px" }}>{"* Location Spreadsheet download and view"}</h6>
              </table>

            }
            {finalItem.length > 0 &&
              <table>
                <thead>
                  <tr>
                    <th>NDE Method</th>
                    <th>NDE Sub Method</th>
                    <th>Effectiveness Table</th>
                    <th>Manufacturer</th>
                    <th>Service Provider</th>
                    <th>Company Procedures</th>
                    <th>Training  Docs</th>
                    <th>Technical Note</th>
                  </tr>
                </thead>
                <tbody>
                    {finalItem.length > 0 && finalItem.map(x => x.type === "NDE" ? 
                     <tr>
                     <td>{x.name}</td>
                     <td>
                      {x.subItem.length > 0 && (props.docstate[0] !== x.type || (props.docstate[0] === x.type && (props.docstate[1] !== x.name || props.docstate[2] !== x.subItem[0].name))) &&
                      <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={false} onClick={() => onClickFinalStep(x.type, x.name, x.subItem[0].name)}>
                      {x.subItem[0].name}
                      </Button>
                      }
                     {props.docstate[0] === x.type && props.docstate[1] === x.name && props.docstate[2] === x.subItem[0].name &&
                        <Button variant={TabConfig.color} size="sm"><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/>
                      {props.docstate[3]}
                      </Button>
                      }
                    </td>
                     <td>
                    {(props.docstate[0] !== "NDE-E" || (props.docstate[0] === "NDE-E" && (props.docstate[1] !== x.name || props.docstate[2] !== x.subItem[0].name))) &&

                       <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={false} onClick={() => onClickFinalStep("NDE-E", x.name, x.subItem[0].name)}>
                       {"View"}
                      </Button>
                    }
                    {props.docstate[0] === "NDE-E" && props.docstate[1] === x.name && props.docstate[2] === x.subItem[0].name &&
                      <Button variant={TabConfig.color} size="sm"><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/>
                     {props.docstate[3]}
                     </Button>
                    }

                     </td>
                     <td>
                    {(props.docstate[0] !== "NDE-V" || (props.docstate[0] === "NDE-V" && (props.docstate[1] !== x.name || props.docstate[2] !== x.subItem[0].name))) &&
                       <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={false} onClick={() => onClickFinalStep("NDE-V", x.name, x.subItem[0].name)}>
                       {"View"}
                      </Button>
                    }
                    {props.docstate[0] === "NDE-V" && props.docstate[1] === x.name && props.docstate[2] === x.subItem[0].name &&
                      <Button variant={TabConfig.color} size="sm"><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/>
                      {props.docstate[3]}
                     </Button>
                    }

                     </td>
                     <td>
                    {(props.docstate[0] !== "NDE-S" || (props.docstate[0] === "NDE-S" && (props.docstate[1] !== x.name || props.docstate[2] !== x.subItem[0].name))) &&

                       <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={false} onClick={() => onClickFinalStep("NDE-S", x.name, x.subItem[0].name)}>
                       {"View"}
                      </Button>
                    }
                    {props.docstate[0] === "NDE-S" && props.docstate[1] === x.name && props.docstate[2] === x.subItem[0].name &&
                      <Button variant={TabConfig.color} size="sm"><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/>
                      {props.docstate[3]}
                     </Button>
                    }

                     </td>
                     <td>
                    {(props.docstate[0] !== "NDE-C" || (props.docstate[0] === "NDE-C" && (props.docstate[1] !== x.name || props.docstate[2] !== x.subItem[0].name))) &&

                       <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={false} onClick={() => onClickFinalStep("NDE-C", x.name, x.subItem[0].name)}>
                       {"View"}
                      </Button>
                     }
                    {props.docstate[0] === "NDE-C" && props.docstate[1] === x.name && props.docstate[2] === x.subItem[0].name &&
                      <Button variant={TabConfig.color} size="sm"><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/>
                      {props.docstate[3]}
                     </Button>
                    }

                     </td>
                     <td>
                    {(props.docstate[0] !== "NDE-P" || (props.docstate[0] === "NDE-P" && (props.docstate[1] !== x.name || props.docstate[2] !== x.subItem[0].name))) &&

                       <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={false} onClick={() => onClickFinalStep("NDE-P", x.name, x.subItem[0].name)}>
                       {"Download"}
                      </Button>
                    }
                    {props.docstate[0] === "NDE-P" && props.docstate[1] === x.name && props.docstate[2] === x.subItem[0].name &&
                      <Button variant={TabConfig.color} size="sm"><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/>
                      {props.docstate[3]}
                     </Button>
                    }

                     </td>
                 
                     <td>
                    {(props.docstate[0] !== "NDE-T" || (props.docstate[0] === "NDE-T" && (props.docstate[1] !== x.name || props.docstate[2] !== x.subItem[0].name))) &&

                       <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={false} onClick={() => onClickFinalStep("NDE-T", x.name, x.subItem[0].name)}>
                       {"View"}
                      </Button>
                    }
                    {props.docstate[0] === "NDE-T" && props.docstate[1] === x.name && props.docstate[2] === x.subItem[0].name &&
                      <Button variant={TabConfig.color} size="sm"><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/>
                      {props.docstate[3]}
                     </Button>
                    }

                     </td>

                     </tr>
                    :<></>
                    )}

                </tbody>
              </table>
            }
          </>
        }

        { autoSelect=== true && finalEnable === false && endEnable === false && userStoreFlowchartInfo.length > 0 && executeTree(userStoreFlowchartInfo, 0, 1, 0, true)}

        { autoSelect=== true && userStoreFlowchartInfo.length > 0 && indexB.length > 0 && indexB.map((x, index) =>
          <>
            {x[6] === 2 && index === 0 && ((x[1] % 2) === 0) &&
            <div className={styles.dtNode}> 
              <ul>
                <li>
                  <Button style={{ marginLeft: "10px" }} variant={"dark"} size="sm" disabled={true}>
                  {x[7]}
                  </Button>
                </li>
              </ul>
            </div>}

            {x[6] === 2 && ((x[1] % 2) === 1) &&
              <div className={styles.dtNode}> 
                <ul>
                  <li>
                    <Button style={{ marginLeft: "10px" }} variant={"dark"} size="sm" disabled={true}>
                    {x[7]}
                    </Button>
                  </li>
                  {(index+1) < indexB.length &&
                    <li>
                      <Button style={{ marginLeft: "10px" }} variant={"danger"} size="sm" disabled={false} onClick={() => onClickBackNavigate(indexB[index+1])}>
                      {indexB[index+1][7]}
                      </Button>
                    </li>}
                </ul>
              </div> }   
          </>)
        }

        { autoSelect=== true && userStoreFlowchartInfo.length > 0 &&
           <div className={styles.dtNode}> 
              <ul>
                {subComponentSplit.length > 0 && subComponentSplit.slice(0).reverse().map(x =>
                <li>
                  <Button style={{ marginLeft: "10px" }} variant={"dark"} size="sm" disabled={true}>
                  {x}
                  </Button>
                </li>
                )}
                <li>
                  <Button style={{ marginLeft: "10px" }} variant={"dark"} size="sm" disabled={true}>
                  {props.component}
                  </Button>
                </li>
                <li>
                  <Button style={{ marginLeft: "10px" }} variant={"dark"} size="sm" disabled={true}>
                  {props.workflow}
                  </Button>
                </li>

              </ul>
            </div>
        }
 </>

 }
 
 {viewWait === true && <Modal show={true} backdrop="static" centered size= "xl" onHide={() => setViewWait(false)}>
  <Modal.Header closeButton>  </Modal.Header>
    <div style={{ height: "600px", overflow: "auto" }}>
    <div class="text-center" style={{ backgroundColor: "#AF69EF", width: "30%", border: "2px solid black", padding: "15px", marginLeft: "35%", marginTop: "5px" }}> 
       {props.workflow}
    </div>
    <div style={{ fontSize: "24px", marginLeft: "50%", marginTop: "5px" }}> <i style={{ marginLeft: "0px" }} class="fa fa-arrow-down"></i></div>
    <div class="text-center" style={{ backgroundColor: "#AF69EF", width: "30%", border: "2px solid black", padding: "15px", marginLeft: "35%", marginTop: "5px" }}> 
       {props.component}
    </div>
    <div style={{ fontSize: "24px", marginLeft: "50%", marginTop: "5px" }}> <i style={{ marginLeft: "0px" }} class="fa fa-arrow-down"></i></div>
    {subComponentSplit.length > 0 && subComponentSplit.map(x =>
      <>
    <div class="text-center" style={{ backgroundColor: "#AF69EF", width: "30%", border: "2px solid black", padding: "15px", marginLeft: "35%", marginTop: "5px" }}> 
       {x}
    </div>
    <div style={{ fontSize: "24px", marginLeft: "50%", marginTop: "5px" }}> <i style={{ marginLeft: "0px" }} class="fa fa-arrow-down"></i></div>
    </>
    )}
    {autoSelect=== true && userStoreFlowchartInfo.length > 0 && indexC.length > 0 && indexC.map((x, index) =>
    <div>
    {x[6] === 2 && x[8] <= 1 && <>
    {((x[1] % 2) === 1) && <>
    <div class="text-center" style={{ backgroundColor: "#E39FF6", width: "30%", border: "2px solid black", padding: "15px", marginLeft: "35%", marginTop: "5px" }}> 
       {x[7]}
    </div>
    { index !== (indexC.length-1) && <div style={{ fontSize: "24px", marginLeft: "50%", marginTop: "30px" }}> <i style={{ marginLeft: "0px" }} class="fa fa-arrow-down"></i></div>}
    </>}

    {((x[1] % 2) === 0) && index === (indexC.length-1) && <>
    <div class="text-center" style={{ backgroundColor: "#E39FF6", width: "30%", border: "2px solid black", padding: "15px", marginLeft: "35%", marginTop: "5px" }}> 
       {x[7]}
    </div>
    { index !== (indexC.length-1) && <div style={{ fontSize: "24px", marginLeft: "50%", marginTop: "30px" }}> <i style={{ marginLeft: "0px" }} class="fa fa-arrow-down"></i></div>}
    </>}

    {((x[1] % 2) === 0) && index !== (indexC.length-1) && indexC[index+1][8] <= 1 && <>
    <div class="text-center" style={{ backgroundColor: "#E39FF6", width: "30%", border: "2px solid black", padding: "15px", marginLeft: "35%", marginTop: "5px" }}> 
       {x[7]}
    </div>
    { index !== (indexC.length-1) && <div style={{ fontSize: "24px", marginLeft: "50%", marginTop: "30px" }}> <i style={{ marginLeft: "0px" }} class="fa fa-arrow-down"></i></div>}
    </>}
 
    {((x[1] % 2) === 0) && index !== (indexC.length-1) && indexC[index+1][8] >= 2 && <>
    <div style={{ marginLeft: "43%", marginTop: "35px" }}>
    <div style={{ marginLeft: "15px", backgroundColor: "#E39FF6", width: "150px", height: "150px", border: "1px solid black", transform: "rotate(45deg)" }}>
    <div style={{ textAlign: "center", padding: "70px 0", transform: "rotate(-45deg)" }}>{x[7]}</div>
    </div>
    </div>

    { index !== (indexC.length-1) && <div style={{ fontSize: "24px", marginLeft: "50%", marginTop: "30px" }}> <i style={{ marginLeft: "0px" }} class="fa fa-arrow-down"></i></div>}
    { index !== (indexC.length-1) && indexC[index+1][8] >= 2 && <div style={{ fontSize: "24px", marginLeft: "55%", marginTop: "-40px" }}>{indexC[index+1][7]}</div>}
    </>}
    </>}

    {x[6] === 2 && x[8] >= 2 && ((x[1] % 2) === 0) && <>
    <div style={{ marginLeft: "43%", marginTop: "35px" }}>
    <div style={{ marginLeft: "15px", backgroundColor: "#E39FF6", width: "150px", height: "150px", border: "1px solid black", transform: "rotate(45deg)" }}>
    <div style={{ textAlign: "center", padding: "70px 0", transform: "rotate(-45deg)" }}>{x[7]}</div>
    </div>
   </div>
    { index !== (indexC.length-1) && <div style={{ fontSize: "24px", marginLeft: "50%", marginTop: "30px" }}> <i style={{ marginLeft: "0px" }} class="fa fa-arrow-down"></i></div>}
    { index !== (indexC.length-1) && indexC[index+1][8] >= 2 && <div style={{ fontSize: "24px", marginLeft: "55%", marginTop: "-40px" }}>{indexC[index+1][7]}</div>}
    </>}

    </div>
    )}
    <div style={{ marginLeft: "20%", marginRight: "20%" }} className={styles.root}>
            {finalItem.length > 0 &&
              <table>
                <thead>
                  <tr>
                    <th>NDE Method</th>
                    <th>NDE Sub Method</th>
                  </tr>
                </thead>
                <tbody>
                    {finalItem.length > 0 && finalItem.map(x => x.type === "NDE" ? 
                     <tr>
                     <td>{x.name}</td>
                     <td>
                      {x.subItem.length > 0 &&
                      <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={true} onClick={() => onClickFinalStep(x.type, x.name, x.subItem[0].name)}>
                      {x.subItem[0].name}
                      </Button>
                      }
                    </td>
                     </tr>
                    :<></>
                    )}

                </tbody>
              </table>
            }
  </div>
  </div>

  <div style={{ marginLeft: "43%", marginTop: "100px" }}></div>
  </Modal>}
   </>
  }
  { checkboxSelect[1] === true && 
    <>
      {edtxSxSelect === false && <>
        <div style={{ marginTop: "10px" }}>
          <h4 class="text-center">{"Documents"}</h4>
        </div>

        <Form>
         <Form.Row>
            <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={selectedSheetItems.length === 0} onClick={() => onClickEditManual()}>
            View Sheet
            </Button>
         </Form.Row>
        </Form>
        <div>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Select</th>
              <th>Id</th>
              <th>Name</th>
              <th>Sub Name</th>
            </tr>
          </thead>
          <tbody>
            { sheetItems.map((x, index) =>
              <tr key={x.id}>
                <td className={styles.cellsize}>
                  <ToggleButton
                  inactiveLabel={<X />}
                  activeLabel={<Check />}
                  value={selectedSheetItems.indexOf(x) >= 0}
                  onToggle={() => onManualSelectedChanged(x)} />  
                </td>
                <td className={styles.cellsize}>{index+1}</td>
                <td>{x.name}</td>
                <td>{x.subname}</td>
              </tr>)
            }
          </tbody>
        </Table>
       </div>
       </> }


      {edtxSxSelect === true && <>
        <div style={{ marginTop: "10px" }}>
          <h4 class="text-center">{tableTitle}</h4>
         </div>
          <Button variant={TabConfig.color} size="sm" disabled={false} onClick={() => onClickEdtBackManual()} >
          Back
          </Button>
        <div>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                {tableItems.length > 0 && 
                <>
                 <th>Id</th>
                  {tableItems[0].col.map((x, val) => <th>{x.name}</th>)}
                </>
                }
              </tr>
            </thead>
            <tbody>
            {tableItems.map((x, index) => index === 0 ? <></> :
              <tr key={x.id}>
                <td className={styles.cellsize}>{index}</td>


              {selectedTableItems.indexOf(x) < 0 && x.col.map((y, uindex) => y.val.length === 0 ?<td>{y.name}</td> :<td>
                 <Form>
                    { y.val.map(d1 => (d1 === "Download") ? 
                     <>
                     <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={checkTableItemCol(d1, y.uploadLink)} onClick={() => onClickManualTableItemAction(d1, y.uploadLink, x.id, y.id, y.uploadName)}>
                     { d1 === "Download" && <i class="fa fa-download" aria-hidden="true"></i>}
                     </Button>
                     
                     </>
                  : <></>
                   )}

                  </Form>
                </td>
                )}

               </tr>
               )
            }
            </tbody>
          </Table>
        </div>
        </>
      }


    </>
  } 
  { checkboxSelect[2] === true && 
    <>

  {edtxSxSelect === false && <>

<div style={{ marginTop: "10px" }}>
        <h4 class="text-center">{"Information Links"}</h4>
      </div>

 <Form>
 <Form.Row>

          <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={selectedSheetItems.length === 0} onClick={() => onClickEditManual()}>
          View Sheet
          </Button>
      </Form.Row>
     </Form>
        <div>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Select</th>
              <th>Id</th>
              <th>Name</th>
              <th>Sub Name</th>
            </tr>
          </thead>
          <tbody>
            { sheetItems.map((x, index) =>
              <tr key={x.id}>
                <td className={styles.cellsize}>
                  <ToggleButton
                  inactiveLabel={<X />}
                  activeLabel={<Check />}
                  value={selectedSheetItems.indexOf(x) >= 0}
                  onToggle={() => onManualSelectedChanged(x)} />  
                </td>
                <td className={styles.cellsize}>{index+1}</td>
                <td>{x.name}</td>
                <td>{x.subname}</td>
              </tr>)
            }
          </tbody>
        </Table>
       </div>
   </> }

  {edtxSxSelect === true && <>
<div style={{ marginTop: "10px" }}>
        <h4 class="text-center">{tableTitle}</h4>
      </div>

              <Button variant={TabConfig.color} size="sm" disabled={false} onClick={() => onClickEdtBackManual()} >
              Back
              </Button>

        <div>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
             {tableItems.length > 0 && 
               <>
              <th>Id</th>
              { tableItems[0].col.map((x, val) => <th>{x.name}</th>)}
              </>
             

             }

            </tr>
          </thead>
          <tbody>
            { tableItems.map((x, index) => index === 0 ? <></> :
              <tr key={x.id}>
                <td className={styles.cellsize}>{index}</td>
               {x.col.map((y, uindex) => uindex === 0 ? <td>{y.name}</td>
                :<td><Button variant={TabConfig.color} size="sm" disabled={false} onClick={() => onClickOpenURL(y)} >
                  Open
                 </Button></td>
                )}

               </tr>
               )
            }
          </tbody>
        </Table>
        </div>
</>}


    </>
  } 

  </div>;
}


