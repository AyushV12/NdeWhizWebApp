// @flow strict
// Copyright (C) 2022 Deep Skills Inc., - All Rights Reserved
// Unauthorized copying of this file, via any medium is strictly prohibited
// Proprietary and confidential

import React, { useState, useEffect, memo } from "react";
import uuid from "react-uuid";
import styles from "./databaseView.module.css";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Col, FormControl } from "react-bootstrap";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";

import ToggleButton from "react-toggle-button";
import Table from "react-bootstrap/Table";
import { Check, X } from "../../utils/buttons";
import Dropzone from "react-dropzone";

import { TabConfig } from "../../config/config";

import { apiEndpoint, download } from "../../utils/common";

import Modal from "react-bootstrap/Modal";
import * as Icon from 'react-bootstrap-icons';
import Arrow from '@elsdoerfer/react-arrow';
import Select, { StylesConfig } from "react-select";
type DatabaseViewProps = {
  isAdmin : boolean,
  filterTemplate: string
};

const userSelect = "admin";
const linkName = "master";

export default function DatabaseView(props: DatabaseViewProps) {
  const [templateSelect, setTemplateSelect] = useState<string>("");
  const [currentSelect, setCurrentSelect] = useState<string>("flowchart");

  const [createManual, setCreateManual] = useState<boolean>(false);
  const [createSpreadsheet, setCreateSpreadsheet] = useState<boolean>(false);
  const [createFlowchart, setCreateFlowchart] = useState<boolean>(true);
  const [createDataItem, setCreateDataItem] = useState<boolean>(false);
  const [createReference, setCreateReference] = useState<boolean>(false);

  const [addxSxSelect, setAddxSxSelect] = useState<boolean>(false);
  const [modxSxSelect, setModxSxSelect] = useState<boolean>(false);
  const [edtxSxSelect, setEdtxSxSelect] = useState<boolean>(false);
  const [hdrxSxSelect, setHdrxSxSelect] = useState<boolean>(false);
  const [dpdxSxSelect, setDpdxSxSelect] = useState<boolean>(false);

  const [spreadsheets, setSpreadsheets] = useState<Array<Project>>([]);
  const [manuals, setManuals] = useState<Array<Project>>([]);
  const [flowcharts, setFlowcharts] = useState<Array<Project>>([]);
  const [dataitems, setDataItems] = useState<Array<Project>>([]);
  const [references, setReferences] = useState<Array<Project>>([]);

  const [sheetItems, setSheetItems] = useState<Array<Project>>([]);
  const [selectedSheetItems, setSelectedSheetItems] = useState<Array<Project>>([]);

  const [tableItems, setTableItems] = useState<Array<Project>>([]);
  const [selectedTableItems, setSelectedTableItems] = useState<Array<Project>>([]);

  const [tableTitle, setTableTitle] = useState<string>("");

  const [placeholderName, setPlaceholderName] = useState<string>("");
  const [placeholderSubName, setPlaceholderSubName] = useState<string>("");
  const [placeholderTitle, setPlaceholderTitle] = useState<string>("");

  const [enterName, setEnterName] = useState<string>("");
  const [enterSubName, setEnterSubName] = useState<string>("");
  const [enterTitle, setEnterTitle] = useState<string>("");
  const [enterRow, setEnterRow] = useState<string>("");
  const [enterColumn, setEnterColumn] = useState<string>("");

  const [readFile, setReadFile] = useState<string>("");

  const [updateImportX, setUpdateImportX] = useState<boolean>(false);

  const [uploadWait, setUploadWait] = useState<boolean>(false);
  const [viewWait, setViewWait] = useState<boolean>(false);
  const [testPdf, setTestPdf] = useState<boolean>(false);

  const [refresh, setRefresh] = useState<boolean>(false);

  const [updateTemplate, setUpdateTemplate] = useState<boolean>(false);
  const [storeTemplateInfo, setStoreTemplateInfo] = useState<Array<[]>>([]);

  const [colSelect, setColSelect] = useState<boolean>(false);
  const [colCurrent, setColCurrent] = useState<number>(255);

  const [dbWait, setDBWait] = useState<boolean>(false);
  var [memoryComponents,setMemoryComponents]=useState({})

  var [jsonTable,setJsonTable]= useState("")
  var [jsonDownloadFileName,setJsonDownloadFileName]= useState("")
  var [flagForTableItems,setFlagForTableItems]=useState(false)
  var [flowchartSheetSelect,setFlowCartSheetSelect]=useState("")
  var [flowChartRef,setFlowChartRef]=useState({})
  var [masterDatabaseFlag,setMasterDatabaseFlag]=useState(false)
  var [assetTypeObject,setAssetTypeObject]=useState({})
  var [componentName,setComponentName]=useState({"flag":true,"answerType":""})

  // var[showQuestionnare,setShowQuestionnare]=useState(false)
  var[tempQuestionnareArray,setTempQuestionnareArray]=useState([])
  var [showQuestionnareOptions,setShowQuestionnareOptions]=useState(false)
  var [showProductAdminQuestionnare,setShowProductAdminQuestionnare]=useState(false)
  var [showAdminQuestionnare,setShowAdminQuestionnare]=useState(false)
  var [tempQuestionnareArrayIndex,setTempQuestionnareArrayIndex]=useState(false)
  var [addQuestionFlag,setAddQuestionFlag]=useState({"addQuestion":false,"answerType":""})
  var [questionDetails,setQuestionDetails]=useState([])
  var [showModalForAnslist,setShowModalForAnsList]=useState(false)
  var [showModalForUserVerification,setShowModalForUserVerification]=useState(false)
  var [tempUserId,setTempUserId]=useState("")
  var [showModalDelete,setShowModalDelete]=useState(false)
  var [tempQuestionToDelete,setTempQuestionToDelete]=useState(0)
  var [tempArrayFlowchartCreationQuestions,setTempArrayFlowchartCreationQuestions]=useState([])
  var [tempArrayNewFlowElements,setTempArrayNewFlowElements]=useState([])
  var [tempChoiceNewFlow,setTempChoiceNewFlow]=useState("")
  var [tempQuestionNewFlow,setTempQuestion]=useState("")
  var [showFlowchartCreationContainer,setShowFlowchartCreationContainer]=useState(false)
  var [showModalForAddNewQuestion,setModalForNewQuestionFlowchartCreation]=useState(false)
  var [tempQuestionNewLot,setTempQuestionNewLot]=useState("")
  useEffect(() => {
    async function admin() {
    }
    admin();
  }, []);

  useEffect(() => {
    async function fetchMe() {


        let select = "";
        let newTemplate = [];
        const resp = await axios.get(apiEndpoint() + `/api/blob/workspace/list/${userSelect}`);
        if (resp.status === 200) {
          if (props.filterTemplate === "") {
            setStoreTemplateInfo(resp.data);
            select = resp.data[0];
            newTemplate = resp.data;
            if (window.sessionStorage.getItem("ndeWhiz-Template") === null) {
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
       setUpdateTemplate(true);
    }
    fetchMe();
    
  }, []);


  async function updateSelectedDatabase(str: String) {
       setUpdateTemplate(false);

       const respy = await axios.get(apiEndpoint() + `/api/blob/folder/root/read/${userSelect}/${templateSelect}/${linkName + ".json"}`);
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
               if (respy.data[0].dataitem !== undefined) {
                 setDataItems(respy.data[0].dataitem);
               }
               if (respy.data[0].reference !== undefined) {
                 setReferences(respy.data[0].reference);
               }

              setSheetItems(respy.data[0].flowchart);
            } else {
               console.log("Error");
            }
        }


  }
  async function onClickManualSelect(str: String) {
   setSelectedSheetItems([]);
   setSelectedTableItems([]);
   setTableItems([]);
   setAddxSxSelect(false);
   setModxSxSelect(false);
   setEdtxSxSelect(false);
   setSheetItems(manuals);
   setCurrentSelect("manual");
   setCreateSpreadsheet(false);
   setCreateManual(true);
   setCreateFlowchart(false);
   setCreateDataItem(false);
   setCreateReference(false);
  }

  async function onClickSpreadsheetSelect(str: String) {
   setSelectedSheetItems([]);
   setSelectedTableItems([]);
   setTableItems([]);
   setAddxSxSelect(false);
   setModxSxSelect(false);
   setEdtxSxSelect(false);
   setSheetItems(spreadsheets);
   setCurrentSelect("spreadsheet");
   setCreateSpreadsheet(true);
   setCreateManual(false);
   setCreateFlowchart(false);
   setCreateDataItem(false);
   setCreateReference(false);
  }

  async function onClickFlowchartSelect(str: String) {
   setSelectedSheetItems([]);
   setSelectedTableItems([]);
   setTableItems([]);
   setAddxSxSelect(false);
   setModxSxSelect(false);
   setEdtxSxSelect(false);
   setSheetItems(flowcharts);
   setCurrentSelect("flowchart");
   setCreateSpreadsheet(false);
   setCreateManual(false);
   setCreateFlowchart(true);
   setCreateDataItem(false);
   setCreateReference(false);
  }

  async function onClickDataItemSelect(str: String) {
   setSelectedSheetItems([]);
   setSelectedTableItems([]);
   setTableItems([]);
   setAddxSxSelect(false);
   setModxSxSelect(false);
   setEdtxSxSelect(false);
   setSheetItems(dataitems);
   setCurrentSelect("dataitem");
   setCreateSpreadsheet(false);
   setCreateManual(false);
   setCreateFlowchart(false);
   setCreateDataItem(true);
   setCreateReference(false);
  }

  async function onClickReferenceSelect(str: String) {
   setSelectedSheetItems([]);
   setSelectedTableItems([]);
   setTableItems([]);
   setAddxSxSelect(false);
   setModxSxSelect(false);
   setEdtxSxSelect(false);
   setSheetItems(references);
   setCurrentSelect("reference");
   setCreateSpreadsheet(false);
   setCreateManual(false);
   setCreateFlowchart(false);
   setCreateDataItem(false);
   setCreateReference(true);
  }

  async function storeMasterData(store : Array<>) {
   let storeInfo = [];
   if (currentSelect === "manual") {
     storeInfo = [{ spreadsheet: spreadsheets, manual: store, flowchart: flowcharts, dataitem: dataitems, reference: references }];
   }
   if (currentSelect === "spreadsheet") {
    storeInfo = [{ spreadsheet: store, manual: manuals, flowchart: flowcharts, dataitem: dataitems, reference: references }];
   }
   if (currentSelect === "flowchart") {
    storeInfo = [{ spreadsheet: spreadsheets, manual: manuals, flowchart: store, dataitem: dataitems, reference: references }];
   }
   if (currentSelect === "dataitem") {
    storeInfo = [{ spreadsheet: spreadsheets, manual: manuals, flowchart: flowcharts, dataitem: store, reference: references }];
   }
   if (currentSelect === "reference") {
    storeInfo = [{ spreadsheet: spreadsheets, manual: manuals, flowchart: flowcharts, dataitem: dataitems, reference: store }];
   }

   const data = new FormData();
   const content = JSON.stringify(storeInfo);
   const blob = new Blob([content], { type: "application/json" });
   data.append("file", blob, "nde.json");
   await axios.post(apiEndpoint()+ `/api/blob/folder/root/write/${userSelect}/${templateSelect}/${linkName + ".json"}`, data, { headers: { "content-type": "multipart/form-data" } });
  }

  function onClickCreateManual() {
    setAddxSxSelect(true);
    setModxSxSelect(false);
    setEdtxSxSelect(false);
    setEnterName("");
    setEnterSubName("");
    setEnterTitle("");
    setEnterRow("");
    setEnterColumn("");
  }

  async function onClickModifyManual() {
    setPlaceholderName(selectedSheetItems[0].name);
    setPlaceholderSubName(selectedSheetItems[0].subname);
    setEnterName(selectedSheetItems[0].name);
    setEnterSubName(selectedSheetItems[0].subname);
    const sheet = "sheet_" + (selectedSheetItems[0].id).toString();
    const respy = await axios.get(apiEndpoint() + `/api/blob/folder/sheetfile/read/${userSelect}/${templateSelect}/${currentSelect}/${sheet}/${"table.json"}`);
    if (respy.status === 200) {
      setPlaceholderTitle(respy.data.title);
      setEnterTitle(respy.data.title);
      setTableItems(respy.data.tableItem);
    }

    setAddxSxSelect(false);
    setModxSxSelect(true);
    setEdtxSxSelect(false);
  }

  async function onClickDeleteManual() {
   if (!window.confirm("You are going to delete the selected file \nAre you sure?"))
      return;

   const sheet = "sheet_" + selectedSheetItems[0].id;
   await axios.post(apiEndpoint()+ `/api/blob/folder/directory/delete/${userSelect}/${templateSelect}/${currentSelect}/${sheet}`);

   const storeItem = sheetItems;
   const index = sheetItems.indexOf(selectedSheetItems[0]);
   storeItem.splice(index, 1);
   storeMasterData(storeItem);
   setSheetItems(storeItem);

   setSelectedSheetItems([]);
   setSelectedTableItems([]);
   setAddxSxSelect(false);
   setModxSxSelect(false);
   setEdtxSxSelect(false);
   setRefresh(!refresh);
  }

  async function updateImportManual() {
    setUpdateImportX(false);
    const storeItem = sheetItems;
    const uid = uuid();
    const storeInfo = JSON.parse(readFile);
    for (let i =0; i < storeInfo.tableItem.length; i++) {
         for (let j =0; j < storeInfo.tableItem[i].col.length; j++) {
           storeInfo.tableItem[i].col[j].uploadLink = "";
           storeInfo.tableItem[i].col[j].uploadName = "";
         }
    }

    storeItem.push({ id: uid, name: storeInfo.name, subname: storeInfo.subname, createdAt: storeInfo.createdAt, select: false });
    
    const data = new FormData();
    const content = JSON.stringify(storeInfo);
    const blob = new Blob([content], { type: "application/json" });
    data.append("file", blob, "nde.json");
    const sheet = "sheet_" + uid;
    await axios.post(apiEndpoint()+ `/api/blob/folder/sheetfile/write/${userSelect}/${templateSelect}/${currentSelect}/${sheet}/${"table.json"}`, data, { headers: { "content-type": "multipart/form-data" } });

    storeMasterData(storeItem);
    setSheetItems(storeItem);

    setRefresh(!refresh);
  }

  function onClickImportManual(acceptedFiles: Array<File>) {
    console.log("onClickImportManual")
    console.log(acceptedFiles)
    if (acceptedFiles.length === 0)
      return;
    setEnterName(acceptedFiles[0].name);

    const reader = new FileReader();
    reader.onload = function (e) {
      if (reader.result !== null) {
        setReadFile(reader.result);
        setUpdateImportX(true);
      }
    };
    reader.readAsText(acceptedFiles[0]);

    setAddxSxSelect(false);
    setModxSxSelect(false);
    setEdtxSxSelect(false);
  }

  async function onClickExportManual() {
    const sheet = "sheet_" + selectedSheetItems[0].id;
    await axios.get(apiEndpoint() + `/api/blob/folder/sheetfile/read/${userSelect}/${templateSelect}/${currentSelect}/${sheet}/${"table.json"}`, { responseType: "blob" })
    .then((response) => {
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      download(selectedSheetItems[0].name + ".json", "", downloadUrl);
    });
    setAddxSxSelect(false);
    setModxSxSelect(false);
    setEdtxSxSelect(false);
    window.alert("Download Success");
  }

  async function onClickEditManual() {
    const sheet = "sheet_" + selectedSheetItems[0].id;
    const respy = await axios.get(apiEndpoint() + `/api/blob/folder/sheetfile/read/${userSelect}/${templateSelect}/${currentSelect}/${sheet}/${"table.json"}`);
    console.log("onClickEditManual,EditSheetTableData",respy.data)
    
    // if (respy.status === 200) {
    //   setTableItems(respy.data.tableItem);
    //   setTableTitle(respy.data.title);
    //   setDpdxSxSelect(false);
    //   setHdrxSxSelect(false);
    // 
    // console.log(jsonTable)
    console.log("after Sheet Select",flowchartSheetSelect)
    console.log(memoryComponents,"dictionaryOfComponents")
    flagForTableItems=!(memoryComponents[flowchartSheetSelect]===undefined)
    if(flagForTableItems===false){
      setTableItems(respy.data.tableItem)

    }
    else{
    setTableItems(jsonTable);
    }
      // setTableTitle(respy.data.title);
      setDpdxSxSelect(false);
     setHdrxSxSelect(false);
    setAddxSxSelect(false);
    setModxSxSelect(false);
    setEdtxSxSelect(true);
  }

  async function onClickSaveSelectionManual() {
   const storeItem = sheetItems;
   for (let i=0; i<storeItem.length; i++) {
    storeItem[i].select = false;
   }
   const index = sheetItems.indexOf(selectedSheetItems[0]);
   storeItem[index].select = true;

   storeMasterData(storeItem);
   setSheetItems(storeItem);

   setRefresh(!refresh);
   window.alert("Selection Saved");
  }

  async function onClickAddSaveManual() {  // add new entry to the flowcharts
    const storeItem = sheetItems;
    const uid = uuid();
    const date = new Date();
    storeItem.push({ id: uid, name: enterName, subname: enterSubName, createdAt: date, select: false });
    const tableItem = [];
    tableItem.push({ id: uuid(), rowstr: "0", color: "", col: [] });
    for (let i=0; i < parseInt(enterRow); i++) {
      const k = i+1;
      tableItem.push({ id: uuid(), rowstr: k.toString(), name: "", color: "", col: [] });
    }
    const text = "$ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i=0; i < parseInt(enterRow)+1; i++) {
      for (let j=0; j < parseInt(enterColumn); j++) {
         if (i===0) {
           tableItem[i].col.push({ id: uuid(), colstr: text.charAt(0), name: "", color: "", type: "", value: "", val: [], uploadLink: "", uploadName: "", uploadExt: "" });
         } else {
         tableItem[i].col.push({ id: uuid(), colstr: text.charAt(j+1), name: "", color: "", type: "", value: "", val: [], uploadLink: "", uploadName: "", uploadExt: "" });
         }
      }
    }

    const storeInfo = { id: uid, name: enterName, subname: enterSubName, createdAt: date, title: enterTitle, tableItem: tableItem };
    const data = new FormData();
    const content = JSON.stringify(storeInfo);
    const blob = new Blob([content], { type: "application/json" });
    data.append("file", blob, "nde.json");
    const sheet = "sheet_" + uid;
    console.log("cyrrentSelectBeforeAPICall",currentSelect)
    console.log("sheetIdBeforeAPIcall",sheet)
    await axios.post(apiEndpoint()+ `/api/blob/folder/sheetfile/write/${userSelect}/${templateSelect}/${currentSelect}/${sheet}/${"table.json"}`, data, { headers: { "content-type": "multipart/form-data" } });

    storeMasterData(storeItem);
    setSheetItems(storeItem);

    setAddxSxSelect(false);
    setModxSxSelect(false);
    setEdtxSxSelect(false);
    setRefresh(!refresh);
  }

  function onClickAddCancelManual() {
    setAddxSxSelect(false);
    setModxSxSelect(false);
    setEdtxSxSelect(false);
  }

  async function onClickModSaveManual() {
    selectedSheetItems[0].name = enterName;
    selectedSheetItems[0].subname = enterSubName;
    const storeInfo = { id: selectedSheetItems[0].id, name: selectedSheetItems[0].name, subname: selectedSheetItems[0].subname, createdAt: selectedSheetItems[0].createdAt, title: enterTitle, tableItem: tableItems };
    const data = new FormData();
    const content = JSON.stringify(storeInfo);
    const blob = new Blob([content], { type: "application/json" });
    data.append("file", blob, "nde.json");
    const sheet = "sheet_" + selectedSheetItems[0].id;
    await axios.post(apiEndpoint()+ `/api/blob/folder/sheetfile/write/${userSelect}/${templateSelect}/${currentSelect}/${sheet}/${"table.json"}`, data, { headers: { "content-type": "multipart/form-data" } });

    const storeItem = sheetItems;
    storeMasterData(storeItem);
    setSheetItems(storeItem);

    setAddxSxSelect(false);
    setModxSxSelect(false);
    setEdtxSxSelect(false);

    setSelectedSheetItems([]);
    setSelectedTableItems([]);
  }

  function onClickModCancelManual() {
    setAddxSxSelect(false);
    setModxSxSelect(false);
    setEdtxSxSelect(false);

    setSelectedSheetItems([]);
    setSelectedTableItems([]); 
  }

  function onClickEdtBackManual() {
    setAddxSxSelect(false);
    setModxSxSelect(false);
    setEdtxSxSelect(false);

    setSelectedSheetItems([]);
    setSelectedTableItems([]);
  }

  async function onClickSaveManualTableItem() {
   const storeInfo = { id: selectedSheetItems[0].id, name: selectedSheetItems[0].name, subname: selectedSheetItems[0].subname, createdAt: selectedSheetItems[0].createdAt, title: tableTitle, tableItem: tableItems };
   const data = new FormData();
   const content = JSON.stringify(storeInfo);
   const blob = new Blob([content], { type: "application/json" });
   data.append("file", blob, "nde.json");
   const sheet = "sheet_" + selectedSheetItems[0].id;
   await axios.post(apiEndpoint()+ `/api/blob/folder/sheetfile/write/${userSelect}/${templateSelect}/${currentSelect}/${sheet}/${"table.json"}`, data, { headers: { "content-type": "multipart/form-data" } });
   window.alert("Sheet Saved");
  }


  async function onClickInsertManualTableItem() {
    const storeItems = tableItems;
    const index = tableItems.indexOf(selectedTableItems[0]);
    const totalcol = selectedTableItems[0].col.length;
    const k = 0; 
    const item = { id: uuid(), rowstr: k.toString(), name: "", color: "", col: [] };
    const text = "$ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let j=0; j < totalcol; j++) {
         item.col.push({ id: uuid(), colstr: text.charAt(j+1), name: "", color: "", type: "", value: "", val: [], uploadLink: "", uploadName: "", uploadExt: "" });
    }
    storeItems.splice(index+1, 0, item);

    const storeInfo = { id: selectedSheetItems[0].id, name: selectedSheetItems[0].name, subname: selectedSheetItems[0].subname, createdAt: selectedSheetItems[0].createdAt, title: tableTitle, tableItem: tableItems };
    const data = new FormData();
    const content = JSON.stringify(storeInfo);
    const blob = new Blob([content], { type: "application/json" });
    data.append("file", blob, "nde.json");
    const sheet = "sheet_" + selectedSheetItems[0].id;
    await axios.post(apiEndpoint()+ `/api/blob/folder/sheetfile/write/${userSelect}/${templateSelect}/${currentSelect}/${sheet}/${"table.json"}`, data, { headers: { "content-type": "multipart/form-data" } });

    setTableItems(storeItems);
    setSelectedTableItems([]);
    setRefresh(!refresh);
    window.alert("Row Inserted");
  }


  async function onClickDeleteManualTableItem() {
   if (!window.confirm("You are going to delete the selected row \nAre you sure?"))
      return;

    const sheet = "sheet_" + selectedSheetItems[0].id;
    const storeItems = tableItems;
    const index = tableItems.indexOf(selectedTableItems[0]);
    storeItems.splice(index, 1); 
    const rowx = "row_" + selectedTableItems[0].id;
    await axios.post(apiEndpoint()+ `/api/blob/folder/directory/delete/${userSelect}/${templateSelect}/${currentSelect}/${sheet}/${rowx}`);
    setTableItems(storeItems);
    setSelectedTableItems([]);
    setRefresh(!refresh);

    const storeInfo = { id: selectedSheetItems[0].id, name: selectedSheetItems[0].name, subname: selectedSheetItems[0].subname, createdAt: selectedSheetItems[0].createdAt, title: tableTitle, tableItem: tableItems };
    const data = new FormData();
    const content = JSON.stringify(storeInfo);
    const blob = new Blob([content], { type: "application/json" });
    data.append("file", blob, "nde.json");
    await axios.post(apiEndpoint()+ `/api/blob/folder/sheetfile/write/${userSelect}/${templateSelect}/${currentSelect}/${sheet}/${"table.json"}`, data, { headers: { "content-type": "multipart/form-data" } });

    window.alert("Row Deleted");
  }

  async function onClickImportManualCol(acceptedFiles: Array<File>, rejectedFiles: Array<File>, rowno:string, colno:string) {
    if (rejectedFiles.length !== 0) {
      window.alert("Incorrect Extension Selected");
      return;
    }

    if (acceptedFiles.length === 0)
      return;
    setUploadWait(true);
    setEnterName(acceptedFiles[0].name);
    const uid = uuid();
    const storeItems = tableItems;
    for (let i =0; i < storeItems.length; i++) {
       if (storeItems[i].id === rowno) {
         for (let j =0; j < storeItems[i].col.length; j++) {
            if (storeItems[i].col[j].id === colno) {
                storeItems[i].col[j].uploadLink = uid;
                storeItems[i].col[j].uploadName = acceptedFiles[0].name;
                break;
            }
         }
       }
    }
    const file = acceptedFiles[0];
    const data = new FormData();
    data.append("file", file, file.name);
    const sheet = "sheet_" + selectedSheetItems[0].id;
    const rowx = "row_" + rowno;
    const colx = "col_" + colno;
    await axios.post(apiEndpoint()+ `/api/blob/folder/sheet/write/${userSelect}/${templateSelect}/${currentSelect}/${sheet}/${rowx}/${colx}/${uid}`, data, { headers: { "content-type": "multipart/form-data" } });
    
    const storeInfo = { id: selectedSheetItems[0].id, name: selectedSheetItems[0].name, subname: selectedSheetItems[0].subname, createdAt: selectedSheetItems[0].createdAt, title: tableTitle, tableItem: tableItems };
    const xdata = new FormData();
    const content = JSON.stringify(storeInfo);
    const blob = new Blob([content], { type: "application/json" });
    xdata.append("file", blob, "nde.json");
    await axios.post(apiEndpoint()+ `/api/blob/folder/sheetfile/write/${userSelect}/${templateSelect}/${currentSelect}/${sheet}/${"table.json"}`, xdata, { headers: { "content-type": "multipart/form-data" } });


    window.alert("Upload Success");
    setUploadWait(false);
    setTableItems(storeItems);
  }


  async function onClickManualTableItemAction(str:string, link:string, rowno:string, colno:string, filename:string) {
     const sheet = "sheet_" + selectedSheetItems[0].id;
     const rowx = "row_" + rowno;
     const colx = "col_" + colno;
     switch (str) {

      case "Download":
       await axios.get(apiEndpoint()+ `/api/blob/folder/sheet/read/${userSelect}/${templateSelect}/${currentSelect}/${sheet}/${rowx}/${colx}/${link}`, { responseType: "blob" })
      .then((response) => {
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      download(filename, "", downloadUrl);
      });
      window.alert("Download Success");
      break;

      case "Delete":
 if (!window.confirm("You are going to delete the selected file \nAre you sure?"))
      return;
       await axios.post(apiEndpoint()+ `/api/blob/folder/sheet/delete/${userSelect}/${templateSelect}/${currentSelect}/${sheet}/${rowx}/${colx}/${link}`, { responseType: "blob" });
       const storeItems = tableItems;
    for (let i =0; i < storeItems.length; i++) {
       if (storeItems[i].id === rowno) {
         for (let j =0; j < storeItems[i].col.length; j++) {
            if (storeItems[i].col[j].id === colno) {
                storeItems[i].col[j].uploadLink = "";
                storeItems[i].col[j].uploadName = "";
                break;
            }
         }
       }
    }
    const storeInfo = { id: selectedSheetItems[0].id, name: selectedSheetItems[0].name, subname: selectedSheetItems[0].subname, createdAt: selectedSheetItems[0].createdAt, title: tableTitle, tableItem: tableItems };
    const data = new FormData();
    const content = JSON.stringify(storeInfo);
    const blob = new Blob([content], { type: "application/json" });
    data.append("file", blob, "nde.json");
    await axios.post(apiEndpoint()+ `/api/blob/folder/sheetfile/write/${userSelect}/${templateSelect}/${currentSelect}/${sheet}/${"table.json"}`, data, { headers: { "content-type": "multipart/form-data" } });

       setTableItems(storeItems);
       window.alert("Delete Success");
       setRefresh(!refresh);
       break;

      case "Pdf":
      await axios.get(apiEndpoint()+ `/api/blob/folder/sheet/read/${userSelect}/${templateSelect}/${currentSelect}/${sheet}/${rowx}/${colx}/${link}`, { responseType: "blob" })
      .then((response) => {

       const reader = new FileReader();
        reader.readAsDataURL(response.data); 
        reader.onload = function () {
            const imageDataUrl = reader.result;
           setTestPdf(imageDataUrl);
        };
      setViewWait(true);
      });
      break;

      case "Image":
      await axios.get(apiEndpoint()+ `/api/blob/folder/sheet/read/${userSelect}/${templateSelect}/${currentSelect}/${sheet}/${rowx}/${colx}/${link}`, { responseType: "blob" })
      .then((response) => {

       const reader = new FileReader();
        reader.readAsDataURL(response.data); 
        reader.onload = function () {
            const imageDataUrl = reader.result;
           setTestPdf(imageDataUrl);
        };

      setViewWait(true);
      });
      break;

      default:
      break;
         
     }
  }

  function onClickAssignTableItem() {
    if (dpdxSxSelect === true) {
      selectedTableItems[0].col.map(x => { 
          if (x.value !== "") {
            x.val = x.value.split(",");
          } else {
           x.val =[];
          }
          return 0;
       });
    }
    setDpdxSxSelect(!dpdxSxSelect);
  }

  function onClickHdrEditTableItem() {
    setHdrxSxSelect(!hdrxSxSelect);
  }

  async function onClickInsertColTableItem() {
    const sheet = "sheet_" + selectedSheetItems[0].id;

    const storeItems = tableItems;
    const text = "$ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let j=0; j < storeItems.length; j++) {
         storeItems[j].col.splice(colCurrent+1, 0, { id: uuid(), colstr: text.charAt(j+1), name: "", color: "", type: "", value: "", val: [], uploadLink: "", uploadName: "", uploadExt: "" });
    }
    const storeInfo = { id: selectedSheetItems[0].id, name: selectedSheetItems[0].name, subname: selectedSheetItems[0].subname, createdAt: selectedSheetItems[0].createdAt, title: tableTitle, tableItem: tableItems };
    const data = new FormData();
    const content = JSON.stringify(storeInfo);
    const blob = new Blob([content], { type: "application/json" });
    data.append("file", blob, "nde.json");
    await axios.post(apiEndpoint()+ `/api/blob/folder/sheetfile/write/${userSelect}/${templateSelect}/${currentSelect}/${sheet}/${"table.json"}`, data, { headers: { "content-type": "multipart/form-data" } });

    setTableItems(storeItems);
    setRefresh(!refresh);
    window.alert("Col Inserted");
  }

  async function onClickDelColTableItem() {
   if (!window.confirm("You are going to delete the selected row \nAre you sure?"))
      return;

    const sheet = "sheet_" + selectedSheetItems[0].id;
    const storeItems = tableItems;
    for (let i=0; i < storeItems.length; i++) {
         storeItems[i].col.splice(colCurrent, 1);
    }

    const storeInfo = { id: selectedSheetItems[0].id, name: selectedSheetItems[0].name, subname: selectedSheetItems[0].subname, createdAt: selectedSheetItems[0].createdAt, title: tableTitle, tableItem: tableItems };
    const data = new FormData();
    const content = JSON.stringify(storeInfo);
    const blob = new Blob([content], { type: "application/json" });
    data.append("file", blob, "nde.json");
    await axios.post(apiEndpoint()+ `/api/blob/folder/sheetfile/write/${userSelect}/${templateSelect}/${currentSelect}/${sheet}/${"table.json"}`, data, { headers: { "content-type": "multipart/form-data" } });

    setTableItems(storeItems);
    setRefresh(!refresh);
    window.alert("Col Deleted");
  }

  function onTableItemSelectedChanged(info: Run) {  //TEMP changed 
    console.log(info,"onSelectedTableItem")
    let tempName=""
    for (let i=0;i<info.col.length;i++){
      if(i==3){
        break
      }
      tempName+=info.col[i].name
      if(i<2){
        tempName+= "-"
      }

    }
    setJsonDownloadFileName(tempName)
    const index = selectedTableItems.indexOf(info);
    if (index >= 0) {
      setSelectedTableItems(selectedTableItems => [
        ...selectedTableItems.slice(0, index),
        ...selectedTableItems.slice(index + 1),
      ]);
    } else {
      setSelectedTableItems([]);
      setDpdxSxSelect(false);
      setHdrxSxSelect(false);
      setSelectedTableItems(selectedTableItems => [...selectedTableItems, info]);
    }
  }

  
  function onManualSelectedChanged(info: Run) {
    console.log(info,"onSelectedToggle")
    setFlowCartSheetSelect(info.name)
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


  function handleEditor(str: string, e: SyntheticKeyboardEvent<HTMLInputElement>) {
    const trimValue = e.currentTarget.value.trim();
    switch (str) {
      case "Name":
        if (trimValue === "") {
          setEnterName("");
        } else {      
          setEnterName(trimValue);
        }
        break;

      case "SubName":
        if (trimValue === "") {
          setEnterSubName("");
        } else {      
          setEnterSubName(trimValue);
        }
        break;

      case "Title":
        if (trimValue === "") {
          setEnterTitle("");
        } else {      
          setEnterTitle(trimValue);
        }
        break;

      case "Row":
        if (trimValue === "") {
          setEnterRow("");
        } else {      
          setEnterRow(trimValue);
        }
        break;

     case "Column":
      if (trimValue === "") {
        setEnterColumn("");
       } else {      
        setEnterColumn(trimValue);
       }
       break;

    default:
      break;
    }
  }


  function handleCheckboxEditor(str: string, val:number, e: SyntheticKeyboardEvent<HTMLInputElement>) {
    switch (str) {
      case "SELECT_COL_ENABLE":
        if (colSelect === false) {
          setColCurrent(255);
        }
        setColSelect(!colSelect);
        break;

      case "SELECT_COL_VALUE":
        setColCurrent(val);
        break;


    default:
      break;
    }
  }


  function handleTableItemCol(str:string, index:number, e: SyntheticKeyboardEvent<HTMLInputElement>) {
    const trimValue = e.currentTarget.value.trim();
    if (str === "HDR") {
      tableItems[0].col[index].name = trimValue;
    }
    if (str === "COL") {
      selectedTableItems[0].col[index].name = trimValue;
    }
    if (str === "DRP") {
       selectedTableItems[0].col[index].value = trimValue;
    }
    if (str === "SEL") {
      selectedTableItems[0].col[index].name = trimValue;
    }
  }


   function checkTableItemCol(str:string, link:string) {
     if (uploadWait === true) return true;
     if (selectedTableItems.length !== 0) return true;
     let x = false;
     switch (str) {
      case "Upload":
      if (link !== "") x = true;
      break;

      case "Download":
      if (link === "") x = true;
      break;

      case "Delete":
      if (link === "") x = true;
      break;

      case "Pdf":
      if (link === "") x = true;
      break;

      case "Excel":
      if (link === "") x = true;
      break;

      case "Image":
      if (link === "") x = true;
      break;
      default:
      x = true;
      break;
     }
     return x;
  }

 function onClickImportCancel() {
       setUploadWait(false);
      setViewWait(false);

 }

 function getAllowedfileExt(str:string) {
   let x = "";
     switch (str) {

      case "Json":
      x = "application/json";
      break;

      case "Pdf":
      x = "application/pdf";
      break;

      case "Excel":
      x = "application/vnd.ms-excel";
      break;

      case "Image":
       x = "image/*";
      break;

      case "Text":
       x = "text/*"; 
      break;

      case "Html":
       x = "text/html";
      break;

      default:
      x = "";
      break;
     }
     return x;
 }

 function getAllowedSelection() {
  if (createManual=== true || createSpreadsheet === true || createFlowchart === true) return true;
  return true;
 }

  function handleDropdown(id: number, e: SyntheticKeyboardEvent<HTMLInputElement>) {
    switch (id) {

     case 2:
     if (window.sessionStorage.getItem("ndeWhiz-Template") === null) {
       window.sessionStorage.setItem("ndeWhiz-Template", e.currentTarget.value);
      } else {
        window.sessionStorage.setItem("ndeWhiz-Template", e.currentTarget.value);
      }
     setTemplateSelect(e.currentTarget.value);
     setSelectedSheetItems([]);
     setSelectedTableItems([]);
     setTableItems([]);
     setAddxSxSelect(false);
     setModxSxSelect(false);
     setEdtxSxSelect(false);
     console.log(flowcharts,"flowchartsAfterDatabaseSelection")
     setSheetItems(flowcharts); 
     setCurrentSelect("flowchart");
     setCreateSpreadsheet(false);
     setCreateManual(false);
     setCreateFlowchart(true);
     setCreateDataItem(false);
     setCreateReference(false);
     setUpdateTemplate(true);
     setFlagForTableItems(false)

     break;

     default:
       break;
    }
  }

  async function onClickGenerateMasterDatabase() {  //TEMP #changed

   if (!window.confirm("You are going to overwrite file \nAre you sure?"))
    return;
    setDBWait(true);
      const response = await axios.get(apiEndpoint() + `/api/blob/folder/root/read/${"admin"}/${templateSelect}/${"master.json"}`);
      if (response.status === 200) {
        const masterdata = response.data[0];
        console.log("masterDataFetchedSuccessfully",masterdata)
        const component = [];
        for (let i=0; i < masterdata.flowchart.length; i++) {
          const flowchartName = masterdata.flowchart[i].name;
          const sheet = "sheet_" + masterdata.flowchart[i].id;
          const subcomponent = [];
          const responsex = await axios.get(apiEndpoint() + `/api/blob/folder/sheetfile/read/${"admin"}/${templateSelect}/${"flowchart"}/${sheet}/${"table.json"}`);
          //dataItem for particular flowchart
          console.log(responsex,"responseForParticlarFlowchartOption")
          if (responsex.status === 200) {
            const flowchartdata = responsex.data;
            for (let j=0; j < flowchartdata.tableItem.length; j++) {
              if (j !==0) {
                let colName = "";
                for (let k=0; k < flowchartdata.tableItem[j].col.length; k++) {
                  if(k>2){
                    break // capturing just three values 
                  }
                  if (flowchartdata.tableItem[j].col[k].name !== "" && flowchartdata.tableItem[j].col[k].value === "") {
                    if (colName === "") {
                      colName = flowchartdata.tableItem[j].col[k].name;
                    } else {
                      colName = colName + "-" + flowchartdata.tableItem[j].col[k].name;
                    }
                  }
                }
                const realname = flowchartName + "-" + colName; // creating the full name
                console.log("realNameGeneratedAfterMasterData",realname)
                const item = [];
                let refSheet = "";
                for (let m=0; m < masterdata.dataitem.length; m++) {
                 if (masterdata.dataitem[m].name === realname) {
                  const sheet = "sheet_" + masterdata.dataitem[m].id;
                  refSheet = sheet;
                  const responsey = await axios.get(apiEndpoint() + `/api/blob/folder/sheetfile/read/${"admin"}/${templateSelect}/${"dataitem"}/${sheet}/${"table.json"}`);
                  if (responsey.status === 200) {
                    const dataitem = responsey.data;
                    for (let j=0; j < dataitem.tableItem.length; j++) {
                      const subitem = [];
                      if (j !==0) {
                       for (let k1=0; k1 < dataitem.tableItem[j].col.length; k1++) {
                           if (k1 > 0 && dataitem.tableItem[j].col[k1].name !== "" && dataitem.tableItem[j].col[k1].value === "") {
                              subitem.push({ name: dataitem.tableItem[j].col[k1].name });
                           }
                       }
                       if (dataitem.tableItem[j].col[0].name !== "") {
                         item.push({ name: dataitem.tableItem[j].col[0].name, subitem: subitem });
                       } else {
                        //console.log("");
                       }
                      }
                    }
                  }
                  break;
                 }
                }
                const spreadsheet = [];
                for (let m=0; m < masterdata.spreadsheet.length; m++) {
                  if (masterdata.spreadsheet[m].name === flowchartName) {
                   const sheet = "sheet_" + masterdata.spreadsheet[m].id;
                  const responsey = await axios.get(apiEndpoint() + `/api/blob/folder/sheetfile/read/${"admin"}/${templateSelect}/${"spreadsheet"}/${sheet}/${"table.json"}`);
                  if (responsey.status === 200) {
                    const spreadsheetdata = responsey.data;
                    let locationCol =0;
                    let chartCol =0;
                    for (let j=0; j < spreadsheetdata.tableItem.length; j++) {
                      if (j === 0) {
                          for (let k1=0; k1 < spreadsheetdata.tableItem[j].col.length; k1++) {
                            if (spreadsheetdata.tableItem[j].col[k1].name === "Location") {
                              locationCol = k1;
                            }
                            if (spreadsheetdata.tableItem[j].col[k1].name === "Chart") {
                              chartCol = k1;
                            }

                          }
                      }
                      if (j !==0) {
                        let mapName = "";
                        for (let k=0; k < spreadsheetdata.tableItem[j].col.length; k++) {
                          if (locationCol !== k && chartCol !== k) {
                            if (spreadsheetdata.tableItem[j].col[k].name !== "" && spreadsheetdata.tableItem[j].col[k].value === "") {
                              if (mapName === "") {
                                mapName = spreadsheetdata.tableItem[j].col[k].name;
                              } else {
                                mapName = mapName + "-" + spreadsheetdata.tableItem[j].col[k].name;
                              }
                            }
                          }
                          if (locationCol === k && mapName === colName) {
                            spreadsheet.push({ name: "Location[" + spreadsheetdata.tableItem[j].col[k].name + "]" });
                            break;
                          } else {
                           //console.log("");
                          }

                        }
                      }
                    }
                  }
                  break;
                 }
                }
                subcomponent.push({ id: refSheet, name: colName, item: item, spreadsheet: spreadsheet });
              }
            }
          }
          component.push({ name: flowchartName, subcomponent: subcomponent, status: false });
        }
          const y = [];
          for (let i=0; i < masterdata.manual.length; i++) {
            const sheet = "sheet_" + masterdata.manual[i].id;
            const item = [];
            const responsex = await axios.get(apiEndpoint() + `/api/blob/folder/sheetfile/read/${"admin"}/${templateSelect}/${"manual"}/${sheet}/${"table.json"}`);
            if (responsex.status === 200) {
              const manualdata = responsex.data;
              for (let j=0; j < manualdata.tableItem.length; j++) {
                if (j !==0) {
                  item.push({ name: manualdata.tableItem[j].col[0].name });
                }
              }
            }
            y.push({ name: masterdata.manual[i].name, subitem: item, status: false });
          } 

         const storeInfo = [{ component: component, manual: y }];
         console.log("storeInfo",storeInfo)
         const content1 = JSON.stringify(storeInfo);
         const blob1 = new Blob([content1], { type: "application/json" });
         const data = new FormData();
         data.append("file", blob1, "flowchart-admin");
         await axios.post(apiEndpoint()+ `/api/blob/workspace/write/${"admin"}/${templateSelect}/${"master.json"}`, data, { headers: { "content-type": "multipart/form-data" } });
         setDBWait(false);
         setSelectedSheetItems([]);
         setSelectedTableItems([]);
         setTableItems([]);
         setAddxSxSelect(false);
         setModxSxSelect(false);
         setEdtxSxSelect(false);
         setSheetItems(flowcharts);
         setCurrentSelect("flowchart");
         setCreateSpreadsheet(false);
         setCreateManual(false);
         setCreateFlowchart(true);
         setCreateDataItem(false);
         setCreateReference(false);
     }


  

    }
  async function convertJSONTreeToJSON(flowchartTree){
    console.log("flowchartTreeto")

  }
  // async function onClickGetAllFlowchartsForDatabase(){
  //   var workflowName=templateSelect
  //   const response = await axios.get(apiEndpoint() + `/api/blob/folder/root/read/${"admin"}/${templateSelect}/${"master.json"}`);
  //   const componentsList=response.data[0].flowchart
  //   for (let i=0;i<componentsList;i++){
  //     var componentName= componentsList[i].name
  //     var  sheet = "sheet_" + componentsList[i].id;
  //     var  responsex = await axios.get(apiEndpoint() + `/api/blob/folder/sheetfile/read/${"admin"}/${workflowName}/${"flowchart"}/${sheet}/${"table.json"}`);
  //     var tableData = responsex.data.tableItem
  //     var tempDict={}
  //     console.log("tableDataForComponent",tableData)
  //     const responsex = await axios.get(apiEndpoint()+ `/api/blob/workspace/read/${"admin"}/${workflowName}/${"master.json"}`);
  //     let componentIndex
  //     for (let j=0;j<responsex.data.component.length;j++){
  //     if(responsex.data.component[j].name===componentName){
  //       componentIndex=j
  //       break
  //     }
  //     var componentArray=[]
  //     let subComponentlist=responsex.data.component[componentIndex].subComponent
  //     for (let j=0;j<subComponentlist.length;j++){
        
  //     }
      
  //   }
  // }

  function checkSubItemPresent(array,itemName){
    
    for(let i=0;i<array.length;i++){
      if(array[i].name===itemName){
        return({
          result:true,
          index:i
        })
      }
    }
    return({
      result:false,
      index:undefined
    })
  }
function createNewNode(){
 let newNode=
 {cond
 : 
 "false",
 edit
 : 
 false,
 icon
 : 
 "",
 id
 : 
 "66b5630-e173-a8d1-2ad0-160583d34cc",
 info
 : 
 "",
 itemMode
 : 
 "External",
 link
 : 
 "",
 name
 : 
 "Choose Brand",
 style
 : 
 [],
 
 text
 : 
 "",
 type
 : 
 "",
 visible
 : 
 false}
 return(newNode)
}



function redefineRow(rowObject,headers){
  console.log("atRedefining Row",rowObject.col,headers)
  let resultArray=[]
  let resultHeaders=[]
  for (let i=3;i<rowObject.col.length;i++){
    if(rowObject.col[i].name!=="Not Applicable"){
      resultArray.push(rowObject.col[i])
      resultHeaders.push(headers[i].name)
    }
  }
  let rowObjectCopy=JSON.parse(JSON.stringify(rowObject))
  rowObjectCopy.col=resultArray
  // console.log(resultHeaders,rowObject.col)
  return({headers:resultHeaders,row:rowObjectCopy})
}




  function ExecuteFlowchart(node,headers,row,indexOfPath,flagItem,type){
    console.log("node",node,indexOfPath,row.col,flagItem)
    if(indexOfPath===row.col.length-3 && flagItem===1){
      console.log(node,"forLastItem")
      node=createNewNode()
      node.id=uuidv4()
      node.name=row.col[indexOfPath].name
      node.item=[]
      node.item.push(ExecuteFlowchart("emptyNode",headers,row,indexOfPath+1,0,"NDE"))
      // node.item.push(ExecuteFlowchart("emptyNode",headers,row,indexOfPath+1,0,"LOC"))
      return(node)
    }
    if(indexOfPath===row.col.length-1){
      node=createNewNode()
      node.id=uuidv4()
      node.item=[]
      if(type==="NDE"){
      node.name=row.col[indexOfPath].name
        node.type="NDE"
      }
      else{
        node.type="LOC"
        node.name="Location[1,2,3]"
      }
      return(node)
    }
    if(indexOfPath===row.col.length-2){
      let node=createNewNode()
      node.id=uuidv4()
      if(type==="NDE"){
      node.name=row.col[indexOfPath].name
      node.type="NDE"
      node.subItem=[(ExecuteFlowchart("emptyNode",headers,row,indexOfPath+1,1,"NDE"))]
    }
      else if(type==="LOC"){
        node.type="LOC"
        node.name="Location"
        node.subItem=[(ExecuteFlowchart("emptyNode",headers,row,indexOfPath+1,1,"LOC"))]
      }
      return(node)
    }

    if(node==="emptyNode"){
      console.log("emptyNode")
      if(flagItem===0){
        node=createNewNode()
        node.id=uuidv4()
        node.name=headers[indexOfPath]
        node.subItem=[]
        node.subItem.push(ExecuteFlowchart("emptyNode",headers,row,indexOfPath,1,"default"))
      }
      else{
        node=createNewNode()
        node.id=uuidv4()
        node.name=row.col[indexOfPath].name
        node.item=[]
        node.item.push(ExecuteFlowchart("emptyNode",headers,row,indexOfPath+1,0,"default"))

      }
    }
    else{
      console.log("nodeItemNotEmpty",node)
      if(flagItem===0){ //presentItem
        let presentSubItemName=row.col[indexOfPath].name
        if(checkSubItemPresent(node.subItem,presentSubItemName).result===true){
          let index=checkSubItemPresent(node.subItem,presentSubItemName).index
          ExecuteFlowchart(node.subItem[index],headers,row,indexOfPath,1,"default")
        }
        else{
          node.subItem.push(ExecuteFlowchart("emptyNode",headers,row,indexOfPath,1,"default"))
        }
      }
      else{
        if(node.item.length===0){
          node.item.push(ExecuteFlowchart("emptyNode",headers,row,indexOfPath+1,0,"default"))
        }
        else{
          ExecuteFlowchart(node.item[0],headers,row,indexOfPath+1,0,"default")
        }
      }
    }
  
return(node)
  }
  async function sendFlowchart(flowchartData,flowchartselect,flowchartsheetselect){
    console.log("sendFlowchartCalledfor",flowchartselect)
    let data= new FormData()
    let tempDataJson=JSON.stringify(flowchartData)//TEMP
    let tempFile= new File([tempDataJson],flowchartselect,{type:"json"})
    data.append("file",tempFile)
    flowchartselect=flowchartselect.replace("/","")//TEMP
    let response = await axios.post(apiEndpoint() + `/api/blob/workspace/write/${"admin"}/${templateSelect}/${flowchartsheetselect}/${flowchartselect + ".json"}`, data, { headers: { "content-type": "multipart/form-data" } })
    console.log(response,"responseFromFlowchartSendForSub-Component",flowchartselect)
    return(1)
  }
  async function onClickGenerateMasterDatabase1() {

  //TEMP #changed
    console.log("masterDatabastCalled")
    setMasterDatabaseFlag(true)
       const response = await axios.get(apiEndpoint() + `/api/blob/folder/root/read/${"admin"}/${templateSelect}/${"master.json"}`);
       if (response.status === 200) {
         const masterdata = response.data[0];

         console.log("masterDataFetchedSuccessfully",masterdata)
         var  component = [];
         for (let i=0; i < masterdata.flowchart.length; i++) {
           var flowchartName = masterdata.flowchart[i].name;
           const sheet = "sheet_" + masterdata.flowchart[i].id;
           var flowchartdata={}
           if(memoryComponents[flowchartName]===undefined){
           const responsex = await axios.get(apiEndpoint() + `/api/blob/folder/sheetfile/read/${"admin"}/${templateSelect}/${"flowchart"}/${sheet}/${"table.json"}`);
           console.log(responsex,"responseForParticlarFlowchartOption")
           
           if(responsex.status===200){  // error handling
           console.log("flowChartDataFromResponse")
           flowchartdata = responsex.data;
           }  
           else{
            window.alert(`Cannot Fetch Component Data! \n Error Code ${responsex.status}`)
            return(1)
           }
              
           }
           else{
            console.log("flowchartDataFromCSV")
            flowchartdata.tableItem=memoryComponents[flowchartName]

           }
           //dataItem for particular flowchart
       
             let memory={}
             console.log(jsonTable)
             var  subcomponent = [];
             var NewFlowchart="emptyNode"
             var lastFlowchart
             var lastRealName
             for (let j=0; j < flowchartdata.tableItem.length; j++) {
              
               if (j !==0) {
                 let colName = ""
                 
                 //ExecuteFlowchart(oldflowchartObject,headers,path,level(indexOfPath),flagItemSubitem)
                 for (let k=0; k < flowchartdata.tableItem[j].col.length; k++) {
                   if(k>2){
                     break // capturing just three values 
                   }
                   if (flowchartdata.tableItem[j].col[k].name !== "") {
                     if (colName === "") {
                       colName = flowchartdata.tableItem[j].col[k].name;
                     } else {
                       colName = colName + "-" + flowchartdata.tableItem[j].col[k].name;
                     }
                   }
                 }
                 var realname = flowchartName + "-" + colName; // creating the full name
                 console.log("realNameGeneratedAfterMasterData",realname)



                 lastFlowchart=JSON.parse(JSON.stringify(NewFlowchart))
                 if(realname!==lastRealName && lastRealName!==undefined){
                 flowChartRef[lastRealName]=[NewFlowchart]
                 let responseFlowchartSend=await sendFlowchart([NewFlowchart],lastRealName,flowchartName)
                 console.log(NewFlowchart,"hereAtAddingFlowchart")
                 if(flowChartRef[realname]!==undefined){
                  NewFlowchart=flowChartRef[realname][0]
                 }
                 else{
                 NewFlowchart="emptyNode"
                 }
                 }
                 let redefinePath=redefineRow(flowchartdata.tableItem[j],flowchartdata.tableItem[0].col)
                 NewFlowchart=ExecuteFlowchart(NewFlowchart,redefinePath.headers,redefinePath.row,0,0)
                 if(memory[realname]===undefined){
                  const item = [];
                  memory[realname]=true
                  //create items list
                  let headers=flowchartdata.tableItem[0].col
                  console.log("headersBeforeAddingItems",headers)
                  console.log("colUms",flowchartdata.tableItem[j].col)
                  for(let i1=3;i1<headers.length;i1++){
                    let itemObject={"name":"","subitem":[]}
                    itemObject.name=headers[i1].name
                    let subItemValues=flowchartdata.tableItem[j].col[i1].val
                    if(subItemValues.length===0){
                     let subItemObject={"name":""}
                     subItemObject.name=flowchartdata.tableItem[j].col[i1].name
                     itemObject.subitem.push(subItemObject)
                    }
                    else{

                    
                    for(let j1=0;j1<subItemValues.length;j1++){
                      let subItemObject={"name":""}
                      subItemObject.name=subItemValues[j1]
                      itemObject.subitem.push(subItemObject)
                    }}
                    item.push(itemObject)
                  }
                 if(subcomponent.length!==0){
                  subcomponent[subcomponent.length-1].flowchart.push(lastFlowchart)
                 }
                 subcomponent.push({ id: refSheet, name: colName, item: item, spreadsheet:[],flowchart:[] });
                 
                 }
                 lastRealName=realname
                 let refSheet = "";
                //  for (let m=0; m < masterdata.dataitem.length; m++) {
                //   if (masterdata.dataitem[m].name === realname) {
                //    const sheet = "sheet_" + masterdata.dataitem[m].id;
                //    refSheet = sheet;
                //    const responsey = await axios.get(apiEndpoint() + `/api/blob/folder/sheetfile/read/${"admin"}/${templateSelect}/${"dataitem"}/${sheet}/${"table.json"}`);
                //    if (responsey.status === 200) {
                //      const dataitem = responsey.data;
                //      for (let j=0; j < dataitem.tableItem.length; j++) {
                //        const subitem = [];
                //        if (j !==0) {
                //         for (let k1=0; k1 < dataitem.tableItem[j].col.length; k1++) {
                //             if (k1 > 0 && dataitem.tableItem[j].col[k1].name !== "" && dataitem.tableItem[j].col[k1].value === "") {
                //                subitem.push({ name: dataitem.tableItem[j].col[k1].name });
                //             }
                //         }
                //         if (dataitem.tableItem[j].col[0].name !== "") {
                //           item.push({ name: dataitem.tableItem[j].col[0].name, subitem: subitem });
                //         } else {
                //          //console.log("");
                //         }
                //        }
                //      }
                //    }
                //    break;
                //   }
                //  }
                //  const spreadsheet = [];
                //  for (let m=0; m < masterdata.spreadsheet.length; m++) {
                //    if (masterdata.spreadsheet[m].name === flowchartName) {
                //     const sheet = "sheet_" + masterdata.spreadsheet[m].id;
                //    const responsey = await axios.get(apiEndpoint() + `/api/blob/folder/sheetfile/read/${"admin"}/${templateSelect}/${"spreadsheet"}/${sheet}/${"table.json"}`);
                //    if (responsey.status === 200) {
                //      const spreadsheetdata = responsey.data;
                //      let locationCol =0;
                //      let chartCol =0;
                //      for (let j=0; j < spreadsheetdata.tableItem.length; j++) {
                //        if (j === 0) {
                //            for (let k1=0; k1 < spreadsheetdata.tableItem[j].col.length; k1++) {
                //              if (spreadsheetdata.tableItem[j].col[k1].name === "Location") {
                //                locationCol = k1;
                //              }
                //              if (spreadsheetdata.tableItem[j].col[k1].name === "Chart") {
                //                chartCol = k1;
                //              }
 
                //            }
                //        }
                //        if (j !==0) {
                //          let mapName = "";
                //          for (let k=0; k < spreadsheetdata.tableItem[j].col.length; k++) {
                //            if (locationCol !== k && chartCol !== k) {
                //              if (spreadsheetdata.tableItem[j].col[k].name !== "" && spreadsheetdata.tableItem[j].col[k].value === "") {
                //                if (mapName === "") {
                //                  mapName = spreadsheetdata.tableItem[j].col[k].name;
                //                } else {
                //                  mapName = mapName + "-" + spreadsheetdata.tableItem[j].col[k].name;
                //                }
                //              }
                //            }
                //            if (locationCol === k && mapName === colName) {
                //              spreadsheet.push({ name: "Location[" + spreadsheetdata.tableItem[j].col[k].name + "]" });
                //              break;
                //            } else {
                //             //console.log("");
                //            }
 
                //          }
                //        }
                //      }
                //    }
                //    break;
                //   }
                //  }
               }
             }
             let newFlowchart=[NewFlowchart]
             subcomponent[subcomponent.length-1].flowchart=newFlowchart
             flowChartRef[realname]=newFlowchart
             let responseFlowchartSend=await sendFlowchart([NewFlowchart],realname,flowchartName)
             component.push({ name: flowchartName, subcomponent: subcomponent, status: false });
           }
           
         }
           const y = [];
          //  for (let i=0; i < masterdata.manual.length; i++) {
          //    const sheet = "sheet_" + masterdata.manual[i].id;
          //    const item = [];
          //    const responsex = await axios.get(apiEndpoint() + `/api/blob/folder/sheetfile/read/${"admin"}/${templateSelect}/${"manual"}/${sheet}/${"table.json"}`);
          //    if (responsex.status === 200) {
          //      const manualdata = responsex.data;
          //      for (let j=0; j < manualdata.tableItem.length; j++) {
          //        if (j !==0) {
          //          item.push({ name: manualdata.tableItem[j].col[0].name });
          //        }
          //      }
          //    }
          //    y.push({ name: masterdata.manual[i].name, subitem: item, status: false });
          //  } 
 
          const storeInfo = [{ component: component, manual: y }];
          console.log("storeInfo",storeInfo)
          const content1 = JSON.stringify(storeInfo);
          const blob1 = new Blob([content1], { type: "application/json" });
          const data = new FormData();
          data.append("file", blob1, "flowchart-admin");
          await axios.post(apiEndpoint()+ `/api/blob/workspace/write/${"admin"}/${templateSelect}/${"master.json"}`, data, { headers: { "content-type": "multipart/form-data" } });
          // setSelectedSheetItems([]);
          // setSelectedTableItems([]);
          // setTableItems([]);
          // setAddxSxSelect(false);
          // setModxSxSelect(false);
          // setEdtxSxSelect(false);
          // // setSheetItems(flowcharts);
          // // to not to change
          // // setCurrentSelect("flowchart");
          // setCreateSpreadsheet(false);
          // setCreateManual(false);
          // setCreateFlowchart(true);
          // setCreateDataItem(false);
          // setCreateReference(false);
          console.log("masterDataBaseFinishedBeforeDownloadJSONCalled")
          // onClickDownloadJSON() 
          
      }
 

  
  function checkForExistingComponents(componentName){
    console.log(sheetItems)
    for(let i=0;i<sheetItems.length;i++){
      console.log(sheetItems[i],"sheetItem")
      if(sheetItems[i].name==componentName){
        return(true)
      }
    }
  return(false)
  }
  function uuidv4() {    //feature
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
  function temp(string){
    let str2=""
    for(let i=0;i<string.length;i++){
      if(string[i]!=='\"'){
        str2+=string[i]
      }
    }
    console.log("stringChanged",string)
    console.log(str2)
    return(str2)
  }
  function addComponentInFlowcharts(component,tableForComponent){ 
    let  storeItem = sheetItems;
    let  uid = uuid();
    let  date = new Date();
    storeItem.push({ id: uid, name: component, subname: enterSubName, createdAt: date, select: false });
    // const tableItem = [];
    // tableItem.push({ id: uuid(), rowstr: "0", color: "", col: [] });
    // for (let i=0; i < parseInt(enterRow); i++) {
    //   const k = i+1;
    //   tableItem.push({ id: uuid(), rowstr: k.toString(), name: "", color: "", col: [] });
    // }
    // const text = "$ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    // for (let i=0; i < parseInt(enterRow)+1; i++) {
    //   for (let j=0; j < parseInt(enterColumn); j++) {
    //      if (i===0) {
    //        tableItem[i].col.push({ id: uuid(), colstr: text.charAt(0), name: "", color: "", type: "", value: "", val: [], uploadLink: "", uploadName: "", uploadExt: "" });
    //      } else {
    //      tableItem[i].col.push({ id: uuid(), colstr: text.charAt(j+1), name: "", color: "", type: "", value: "", val: [], uploadLink: "", uploadName: "", uploadExt: "" });
    //      }
    //   }
    // }
    let   tableItem=JSON.parse(JSON.stringify(tableForComponent))
    let  storeInfo = { id: uid, name:component, subname: enterSubName, createdAt: date, title: enterTitle, tableItem: tableItem };
    let  data = new FormData();
    let  content = JSON.stringify(storeInfo);
    let  blob = new Blob([content], { type: "application/json" });
    data.append("file", blob, "nde.json");
    const sheet = "sheet_" + uid;
    console.log("cyrrentSelectBeforeAPICall",currentSelect)
    console.log("sheetIdBeforeAPIcall", sheet)
    async function apiCall() {
      let response = await axios.post(apiEndpoint() + `/api/blob/folder/sheetfile/write/${userSelect}/${templateSelect}/${currentSelect}/${sheet}/${"table.json"}`, data, { headers: { "content-type": "multipart/form-data" } });
      console.log(response)
    }
    apiCall()
    storeMasterData(storeItem);
    setSheetItems(storeItem);
    setAddxSxSelect(false);
    setModxSxSelect(false);
    setEdtxSxSelect(false);
    setRefresh(!refresh);

  }
  async function removeComponent(componentName){
    let id=""
    for(let i=0;i<sheetItems.length;i++){
      if(sheetItems[i].name===componentName){
        id=sheetItems[i].id.toString()
        sheetItems.splice(i,1)
        break
      }
    }
    console.log("deleteingPreexistingComponent",id,sheetItems)
    const sheet = "sheet_" + id
    const response=await axios.post(apiEndpoint() + `/api/blob/folder/directory/delete/${userSelect}/${templateSelect}/${currentSelect}/${sheet}`);
    console.log("rowDeletedFlowchart",response)
  }
  function doNewComponent(componentName,flagNewComponent,tableForComponent){
    console.log("DoNewComponent",componentName,flagNewComponent,tableForComponent)
    if(flagNewComponent===false){
      //Add Component as it is done in creating a row
      //API call
      addComponentInFlowcharts(componentName,tableForComponent)
      window.alert("New Component Added Successfully!")
      window.alert("CSV File Uploaded Successfully.\n Open Sheet to view changes!")
     }
     else{
      if(window.confirm(`Do You Want to Overwrite the Existing Spreadsheet for "${componentName}"?`)===true){
        //API call for delete then add
        removeComponent(componentName)
        addComponentInFlowcharts(componentName,tableForComponent)
        window.alert(`Spreadsheet for component "${componentName}" overwritten Successfully`)
        window.alert("CSV File Uploaded Successfully.\n Open Sheet to view changes!")
      }
      else{
        window.alert("ABORTED[Only for testing purposes]")
      }
     }
  }
  function convertCSVtoJSON(csvText){   //feature
    console.log(csvText)
    let array2=csvText.split("\n")
    console.log(array2,"array2initially")
    let array1=[]
    for(let k=0;k<array2.length;k++){
      let flag=false
      for (let k1=0;k1<array2[k].length;k1++){
        if(array2[k][k1]!==","){
          flag=true
          break
        }
      }
      if(flag===true){
        array1.push(array2[k])
      }
    }
    console.log(array1,"array1")
     let headers= array1[0].split(",")
     let dropDownDetailsArray=array1[1].split(",")
     headers.shift()
     headers.shift()
     dropDownDetailsArray.shift()
     dropDownDetailsArray.shift()
     console.log(dropDownDetailsArray)
     for(let n=0;n<dropDownDetailsArray.length;n++){
      dropDownDetailsArray[n]=temp(dropDownDetailsArray[n])
     }
     let result=[]
     result.push(headers)
     setComponentName(array1[2][1])//component Name for Further Use
     
     for (let i=2;i<array1.length;i++){
      let tempObject={}
      let tempArray=array1[i].split(",")
      tempArray.shift()
      tempArray.shift()
      for (let j=0;j<tempArray.length;j++){
        if(dropDownDetailsArray[j]==="" || dropDownDetailsArray[j]===undefined){
        tempObject[headers[j]]=temp(tempArray[j])
        
      }
        else{
          tempObject[headers[j]]={"name":"","val":[],"valString":""}
          tempObject[headers[j]].name=temp(tempArray[j])
          console.log("dropDownItem",dropDownDetailsArray[j])
          tempObject[headers[j]].valString=temp(dropDownDetailsArray[j].split("'").join(","))
          tempObject[headers[j]].val=dropDownDetailsArray[j].split("'")// array of dropdown values
           
        }
      }
      console.log(tempObject,"tempObject")
      result.push(tempObject)
     }
     result.pop()
     return(result)
  }
  function getModifiedJSON(array){
    
    let resultArray=[]
    for (let i=0;i<array.length;i++){
      let rowObject = {
        col
          : [],
        color
          :
          "",
        id
          : "",
        rowstr
          :
          ""
      }
      rowObject.id=uuidv4()
      rowObject.rowstr=i.toString()
      var rowKeys
      if(i!=0){
        rowKeys=Object.keys(array[i])}
      else{
         rowKeys=array[i]
      }
      var count=65
      for(let j=0;j<rowKeys.length;j++){
        let colObject = {
          color
            :
            "",
  colstr
            :
            "",
  id
            :
            "",
  name
            :
            "",
  type
            :
            "",
  uploadExt
            :
            "",
  uploadLink
            :
            "",
  uploadName
            :
            "",
  val
            :
            [],
  value
            :
            ""
        }
  
  
        if(i===0){
          colObject.name=array[i][j]
          colObject.colstr="$"
        }
        else{
          // colObject.name=array[i][rowKeys[j]]
          if(typeof(array[i][rowKeys[j]])==="object"){
            colObject.name=array[i][rowKeys[j]].name
            colObject.val=array[i][rowKeys[j]].val

            colObject.value=array[i][rowKeys[j]].valString
          }
          else{
            colObject.name=array[i][rowKeys[j]]
          }
          colObject.colstr=String.fromCharCode(count)
          count+=1
        }
        colObject.id=uuidv4()
        rowObject.col.push(colObject)
      }
  
    resultArray.push(rowObject)
    }
    return(resultArray)
  }
  function getComponentName(name,array){
    let array1=[]
    for(let k=0;k<array.length;k++){
      let flag=false
      for (let k1=0;k1<array[k].length;k1++){
        if(array[k][k1]!==","){
          flag=true
          break
        }
      }
      if(flag===true){
        array1.push(array[k])
      }
    }
  console.log("componentNameCalled",array1[2][1])
  return(array1[2].split(",")[1])
  }
  function onClickUploadCSV(acceptedFiles: Array<File>){  //feature
    
    // memoryComponents[flowchartSheetSelect]=[]
    // setFlagForTableItems(true)
    console.log("onClickUploadCSVFunction")
    console.log("files",acceptedFiles)
    const reader= new FileReader()
    reader.onload= ()=>{
      let jsonData= convertCSVtoJSON(reader.result)
      let modifiedJSON = getModifiedJSON(jsonData)
      // memoryComponents[flowchartSheetSelect]=modifiedJSON
      console.log(modifiedJSON)
      setJsonTable(modifiedJSON)

      let componentname=""
      componentname=getComponentName(componentname,reader.result.split("\n"))
      memoryComponents[componentname]=modifiedJSON
      let flagComponentExists=checkForExistingComponents(componentname)
      doNewComponent(componentname,flagComponentExists,modifiedJSON)
      onClickGenerateMasterDatabase1()
      
    }
    reader.readAsText(acceptedFiles[0])
  }


  function onClickDownloadJSON()    //feature // on Click Of Generate Flowchart
  {
    let flowchartSelect=flowchartSheetSelect+"-"+jsonDownloadFileName
    let data=new FormData()
    let flowchart=flowChartRef[flowchartSelect]
    console.log(flowChartRef)
    console.log(flowChartRef[Object.keys(flowChartRef)[0]],flowchartSelect)
    console.log(flowChartRef[Object.keys(flowChartRef)[0]]===flowchartSelect)

    console.log(flowchartSelect,flowChartRef[flowchartSelect])
    console.log(flowchart)
    let tempDataJson=JSON.stringify(flowchart)//TEMP

    let tempFile= new File([tempDataJson],flowchartSelect,{type:"json"})
    console.log("tempFIle",tempFile)
    data.append("file",tempFile)
    flowchartSelect=flowchartSelect.replace("/","") //TEMP
    async function generateFlowChart(){
    try{
      let respy = await axios.get(apiEndpoint() + `/api/blob/workspace/read/${"admin"}/${templateSelect}/${flowchartSheetSelect}/${flowchartSelect + ".json"}`);
    
      if(window.confirm("Do You want to Overwrite Existing File?")===true){
        let response = await axios.post(apiEndpoint() + `/api/blob/workspace/write/${"admin"}/${templateSelect}/${flowchartSheetSelect}/${flowchartSelect + ".json"}`, data, { headers: { "content-type": "multipart/form-data" } })
        if (response.status === 200) {
          window.alert("Flowchart Added Successfully")
        }
        else {
          window.alert("Cannot Add FlowChart")
        }
        console.log(response, "responseAfterStoreFlowchart")
      }
      else{
        return(1)
      }

      }catch(error)
      {
        console.log(error)
        let response = await axios.post(apiEndpoint() + `/api/blob/workspace/write/${"admin"}/${templateSelect}/${flowchartSheetSelect}/${flowchartSelect + ".json"}`, data, { headers: { "content-type": "multipart/form-data" } })
        if (response.status === 200) {
          window.alert("Flowchart Added Successfully")
        }
        else {
          window.alert("Cannot Add FlowChart")
        }
        console.log(response, "responseAfterStoreFlowchart")

      }

    }
    
    generateFlowChart()
    download(flowchartSelect,tempDataJson,"")
    // wimdow.alert("JSON File DOW")
  }


  function createTestTreeFromParser(){  //TEMP   We have to create the original tree from the FLowchartTable Data
    let node = {
      cond
      : 
      "false",
      edit
      : 
      false,
      icon
      : 
      "",
      id
      : 
      "66b5630-e173-a8d1-2ad0-160583d34cc",
      info
      : 
      "",
      itemMode
      : 
      "External",
      link
      : 
      "",
      name
      : 
      "Choose Brand",
      style
      : 
      [],
      
      text
      : 
      "",
      type
      : 
      "",
      visible
      : 
      false}
      let parentNode=JSON.parse(JSON.stringify((node)))
      
      parentNode.name="Cricket"
      parentNode.id=uuidv4()
      parentNode.subItem=[]
      let childNode1=JSON.parse(JSON.stringify((node)))
      childNode1.item=[]
      childNode1.id=uuidv4()
      childNode1.name="batting"
      let childNode2=JSON.parse(JSON.stringify((node)))
      childNode2.item=[]
      childNode2.id=uuidv4()
      childNode2.name="bowling"

      let childNode11=JSON.parse(JSON.stringify((node)))
      childNode11.id=uuidv4()
      childNode11.name="Location"
      childNode11.type="LOC"
      childNode11.subItem=[]

      let childNode111=JSON.parse(JSON.stringify((node)))
      childNode111.id=uuidv4()
      childNode111.name="Location[1,2,3]"
      childNode111.type="LOC"
      childNode111.item=[]
      childNode11.subItem.push(childNode111)
      childNode1.item.push(childNode11)


      let childNode12=JSON.parse(JSON.stringify((node)))
      childNode12.id=uuidv4()
      childNode12.name="Third Umpire"
      childNode12.type="NDE"
      childNode12.subItem=[]
      let childNode112=JSON.parse(JSON.stringify((node)))
      childNode112.id=uuidv4()
      childNode112.name="Out1"
      childNode112.type="NDE"
      childNode112.item=[]
      childNode12.subItem.push(childNode112)
      childNode1.item.push(childNode12)




      parentNode.subItem.push(childNode1)

      console.log("testTree",[parentNode])
      return([parentNode])
  }
  var lastDiv1=""

  function onClickUserVerification(){
    console.log("userVerificaitonClicked")
  }
  function changeBorderDiv(indexOfDiv){
    if(lastDiv1!==""){
      lastDiv1.style.border="1px solid grey"
      lastDiv1.style.boxShadow=""
    }
    var div1=document.getElementsByClassName("questionContainer")[indexOfDiv]
    lastDiv1=div1
    div1.style.border==="1px solid black"?div1.style.border="1px solid grey":div1.style.border="1px solid black"
    div1.style.boxShadow="0 2px 4px 0 rgba(0, 0, 0, 0.15), 0 3px 10px 0 rgba(0, 0, 0, 0.15)"
  
  }
  function alterBackgroundQuestiondivOnMouseOut(indexOfDiv){
    var div1= document.getElementsByClassName("questionContainer")[indexOfDiv]
    div1.style.backgroundColor="white"

  }
  function alterBackgroundQuestiondivOnMouseIn(indexOfDiv){
    var div1= document.getElementsByClassName("questionContainer")[indexOfDiv]
    div1.style.backgroundColor="aliceblue"

  }
  function onClickShowProductAdminQuestionnare(){
    console.log("hereAtQuresionnareTab")
    var tempArray1=[]
    var questionObject={"name":"","inputType":"","number":"","options":[],"answer":"","flag":"display"}
    var newObject={}
    newObject=JSON.parse(JSON.stringify(questionObject))
    newObject.name="input Text for question one? (sample question)"
    newObject.number="1"
    newObject.inputType="dropdown"
    newObject.options.push("option1")
    newObject.options.push("option2")
    newObject.options.push("option3")
    newObject.options.push("option4")

    tempArray1.push(newObject)
    newObject=JSON.parse(JSON.stringify(questionObject))
    newObject.name="Age of Heat Exchanger?"
    newObject.number="2"
    newObject.inputType="text"
    tempArray1.push(newObject)



    newObject=JSON.parse(JSON.stringify(questionObject))
    newObject.name="Process fluids used in the Heat Exchanger?"
    newObject.number="3"
    newObject.inputType="text"
    tempArray1.push(newObject)

    newObject=JSON.parse(JSON.stringify(questionObject))
    newObject.name="Parameters?"
    newObject.number="4"
    newObject.inputType="dropdown"
    newObject.options.push("temperature")
    newObject.options.push("pressure")
    newObject.options.push("flow")
    tempArray1.push(newObject)

    newObject=JSON.parse(JSON.stringify(questionObject))
    newObject.name="History Of Damages?"
    newObject.number="5"
    newObject.inputType="dropdown"
    newObject.options.push("mechanism")
    newObject.options.push("location")
    newObject.options.push("extent")
    tempArray1.push(newObject)


    newObject=JSON.parse(JSON.stringify(questionObject))
    newObject.name="Inspection %?"
    newObject.number="6"
    newObject.inputType="dropdown"
    newObject.options.push("sampling")
    newObject.options.push("100%")
    newObject.options.push("past failure based")
    tempArray1.push(newObject)


    newObject=JSON.parse(JSON.stringify(questionObject))
    newObject.name="Current Periodicity of Inspection?(in years)"
    newObject.number="7"
    newObject.inputType="text"

    tempArray1.push(newObject)

    setTempQuestionnareArray(tempArray1)
    setShowProductAdminQuestionnare(true)
    setShowQuestionnareOptions(false)
    addQuestionFlag.addQuestion=false
    setAddQuestionFlag(addQuestionFlag)


    // get masterdata

    async function apiCallMasterData(){


      const response = await axios.get(apiEndpoint() + `/api/blob/folder/root/read/${"admin"}/${templateSelect}/${"master.json"}`);
      console.log(response) // we have two type responses for master database
      const response1 = await axios.get(apiEndpoint() + `/api/blob/workspace/read/${"admin"}/${templateSelect}/${"master.json"}`);
      response1.data[0].questionnaire = {}
      response1.data[0].questionnaire.questionList = JSON.parse(JSON.stringify(tempArray1))
      response1.data[0].questionnaire.usersList = []
      const content = JSON.stringify(response1.data);
      const blob = new Blob([content], { type: "application/json" });
      const data = new FormData();
      data.append("file", blob, "flowchart-admin");
      const response2 = await axios.post(apiEndpoint() + `/api/blob/workspace/write/${"admin"}/${templateSelect}/${"master.json"}`, data, { headers: { "content-type": "multipart/form-data" } })
      console.log(response2)
      const response3 = await axios.get(apiEndpoint() + `/api/blob/workspace/read/${"admin"}/${templateSelect}/${"master.json"}`);

      console.log(response3)


    }
apiCallMasterData()

}

  function onClickAddItemQuestionnare(){
    //add Item to tempArray
    // API call
    let questionObject1={"name":"","inputType":"","number":"","options":[],"answer":"","flag":"display"}
    
    var newQuestionText=document.getElementsByClassName("inputAddQuestionText")[0].value
    questionObject1.name=newQuestionText
    var newQuestionType=document.getElementsByClassName("dropdownInputTypeAnswerAddQuestion")[0].value
    questionObject1.inputType=newQuestionType
    questionObject1.number=tempQuestionnareArray.length+1

    if(newQuestionType==="dropdown"){
      questionObject1.options=document.getElementsByClassName("inputAddQuestionAnswerOptions")[0].value.split(",")
    }
    tempQuestionnareArray.push(questionObject1)
    console.log("tempQuestionArrayAfterAdding",tempQuestionnareArray)
    // let addQuestionFlag1=JSON.parse(JSON.stringify(add00))
    window.alert("A new Question has been added to the questionnaire successfully!")
    onClickAddQuestionContainerAppearDisappear()
  }
  function onClickAddQuestionContainerAppearDisappear(){
    let addQuestion1 = JSON.parse(JSON.stringify(addQuestionFlag))
    addQuestion1.addQuestion=!(addQuestion1.addQuestion)
    setAddQuestionFlag(addQuestion1)
  }
  function onClickDisplayModalForQuestionQuesitonnare(index) {
    setShowModalForAnsList(true)
    let keys1 = Object.keys(tempQuestionnareArray[index])
    let tempObject = {
      "parameter": "",
      "value": ""
    }
    let QuestionDetails1 = []
    for (let i = 0; i < keys1.length; i++) {
      QuestionDetails1.push({
        "parameter": keys1[i],
        "value": tempQuestionnareArray[index][keys1[i]]
      })
    }
    setQuestionDetails(QuestionDetails1)
  }
  function onClickShowAdminQuestionnare(){
    if(tempQuestionnareArray.length===0){
      window.alert("No data to display for questionnaire. Please visit product admin first ? [Only for test purposes]")
      return(0)
    }

    setTempQuestionnareArrayIndex(0)
    console.log("showAdmminQuestionnare")
    console.log(tempQuestionnareArray)
    setShowAdminQuestionnare(true)
    setShowQuestionnareOptions(false)
  }
  function onClickShowQuestionnareOptions(){
    setAddxSxSelect(true)
    setModxSxSelect(true)
    setEdtxSxSelect(true)
    setShowQuestionnareOptions(true)
    }

  
  function onClickHideQuestionnare(){
    setAddxSxSelect(false)
    setModxSxSelect(false)
    setEdtxSxSelect(false)
    console.log("hereAtHideQuresionnareTab")
    setShowProductAdminQuestionnare(false)
    setShowAdminQuestionnare(false)
    setShowQuestionnareOptions(false)
    // setShowQuestionnare(false)
  } 

  function onClickAppearAnswerDetailsAddQuestion(e){
    let addQuestionFlag1=JSON.parse(JSON.stringify(addQuestionFlag))
    addQuestionFlag1.answerType=e.target.value
    setAddQuestionFlag(addQuestionFlag1)
  }
  function onClickEditAnsOfQuestionQuestionnare(){
    const tempArray= JSON.parse(JSON.stringify(tempQuestionnareArray))
    tempArray[tempQuestionnareArrayIndex].answer=document.getElementsByClassName("adminAnswerInput")[0].value
    
    setTempQuestionnareArray(tempArray)

    window.alert("Your Response Has been Saved.")
  }

  function onClickIncreaseIndexQuestionnareAdmin(){
    if(tempQuestionnareArrayIndex===tempQuestionnareArray.length-1){
      return(0)
    }
    setTempQuestionnareArrayIndex(tempQuestionnareArrayIndex+1)
  }
  function onClickDecreaseIndexQuestionnareAdmin(){
    if(tempQuestionnareArrayIndex===0){
      return(0)
    }
    setTempQuestionnareArrayIndex(tempQuestionnareArrayIndex-1)
  }
  // function handleDropdownQuestionnare(e,index){
  //   if(tempQuestionnareArray[index].flag==="edit"){
  //     var newValue= e.target.value
  //     var tempArray=JSON.parse(JSON.stringify(tempQuestionnareArray))
  //     tempArray[index].inputType=newValue
  //     setTempQuestionnareArray(tempArray)
  //   }
  //   else{
  //     console.log("handleDropdownWithNoChange",tempQuestionnareArray[index])
  //   }
  //   } // this dropdown will be edited while saving the question edit
  function onClickDownloadQuestionnaire(){
    // download questionnaire as JSON
  }
  function onClickDeleteQuestionQUestionnare(index){
    index=tempQuestionToDelete
    let tempArray=JSON.parse(JSON.stringify(tempQuestionnareArray))
    tempArray.splice(index,1)
    let number=index+1
    for(let i=index;i<tempArray.length;i++){
      tempArray[i].number=number
      number+=1
    }
    setTempQuestionnareArray(tempArray)
  }
  function onClickSetEdit(index) {
    var tempArray = JSON.parse(JSON.stringify(tempQuestionnareArray))
    tempArray[index].flag = "edit"
    setTempQuestionnareArray(tempArray)
  }
  function onClickSetDisplay(index){
    var tempArray=JSON.parse(JSON.stringify(tempQuestionnareArray))
    tempArray[index].flag="display"
    setTempQuestionnareArray(tempArray)
  }
  function onClickSaveQuestionEditQuestionnare(index){
     var newValueInputType=document.getElementsByClassName("dropdownInputType")[index].value
     console.log("newValueInputType",newValueInputType)
     var newValueName=document.getElementsByClassName("inputQuestionEdit")[0].value
     console.log("newValueName",newValueName) 
    var tempArray=JSON.parse(JSON.stringify(tempQuestionnareArray))
    tempArray[index].inputType=newValueInputType
    tempArray[index].name=newValueName
    tempArray[index].flag="display"
    setTempQuestionnareArray(tempArray)
  }
  function onClickOpenFlowhcartCreationDropdown(){
    setAddxSxSelect(true)
    setModxSxSelect(true)
    setEdtxSxSelect(true)
    setShowFlowchartCreationContainer(true)
  }
  function onClickAddElementToNewFlow(){
    let newObject={
      question:"",answer:""
    }
    newObject.question=tempQuestionNewFlow
    newObject.answer=tempChoiceNewFlow
    let tempArray3=JSON.parse(JSON.stringify(tempArrayNewFlowElements))
    tempArray3.push(newObject)
    setTempArrayNewFlowElements(tempArray3)
    console.log(tempArrayNewFlowElements,"tempArrayNewFlowElements")
  }
  function onClickAddQuestionFlowchartLot(){
    let tempArray2=JSON.parse(JSON.stringify(tempArrayFlowchartCreationQuestions))
    tempArray2.push(
      {
        value:tempQuestionNewLot,
        label:tempQuestionNewLot
      }
    )
    setTempArrayFlowchartCreationQuestions(tempArray2)
    console.log(tempArray2,"arrayforQuestionsLotFlowchart")
    // api call needed for adding a question to the list of particular component // API needed
  }
  function onClickHideFlowchartCreationSection(){
    setAddxSxSelect(false)
    setEdtxSxSelect(false)
    setModxSxSelect(false)
    setShowFlowchartCreationContainer(false)
  }
  return <div className={styles.root}>

  <div style={{ marginTop: "10px" }}></div>

  { updateTemplate === true && updateSelectedDatabase() }

  { updateImportX === true && updateImportManual() }

  <div style={{ display: "flex" }}>
  <div style={{ marginLeft: "1%", marginTop: "5px", marginRight: "2%", marginBottom: "0px", width: "30%", height: "50px", backgroundColor: "#1abc9c", border: "1px solid grey" }}>
  <div style={{ marginLeft: "0%", marginTop: "0px", marginRight: "0%", marginBottom: "0px", width: "100%", height: "25px", backgroundColor: "#1abc9c", border: "1px solid grey" }}>
          <h6 style={{ fontSize: "small", marginTop: "0px", textAlign: "center", color: "white" }}> Database Name</h6>  
  </div>

            <select style={{ marginLeft: "0%", marginTop: "0px", marginRight: "0%", marginBottom: "0px", width: "100%", height: "25px", color: "white", backgroundColor: "#333", border: "1px solid grey" }} id= {"Dropdown-1"} onChange={(e) => handleDropdown(2, e)}>>
            {[...storeTemplateInfo.map(d1 => d1 === templateSelect ? <option key={d1} value={d1} selected >{d1}</option>:<option key={d1} value={d1} >{d1}</option>)]}
            </select>

  </div>
  <div>

 {dbWait === false &&
       <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={templateSelect === ""} onClick={() => {if(flagForTableItems===true){onClickGenerateMasterDatabase1()}else{onClickGenerateMasterDatabase()}}}>
          Generate Master Database
          </Button>
 }
 {dbWait === true &&
           <Button variant={TabConfig.color} size="sm"><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/>
           Generating Database Wait ...
          </Button>
 }

  </div>

  </div>

 <Form>
 <Form.Row>

  <Col xs="auto" md={{ span: 0, offset: 5 }}>
          <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={createFlowchart === true} onClick={() => onClickFlowchartSelect()}>
          Methods Flowcharts
          </Button>

          <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={createDataItem === true} onClick={() => onClickDataItemSelect()}>
          Methods Items
          </Button>

          <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={createSpreadsheet === true} onClick={() => onClickSpreadsheetSelect()}>
          Methods Spreadsheets
          </Button>

          <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={createManual === true } onClick={() => onClickManualSelect()}>
          Methods Manuals          
          </Button>

          <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={createReference === true } onClick={() => onClickReferenceSelect()}>
          Methods References         
          </Button>

        </Col>
 </Form.Row>
 </Form>
      <div style={{ marginTop: "10px" }}></div>

  {getAllowedSelection() && addxSxSelect === false && modxSxSelect === false && edtxSxSelect === false && <> 
 <Form>
 <Form.Row>
  <Col xs="auto" >
          <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={selectedSheetItems.length !== 0} onClick={() => onClickCreateManual()}>
          Create
          </Button>
 </Col>
 <Col xs="auto" >

          <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={selectedSheetItems.length === 0} onClick={() => onClickModifyManual()}>
          Rename
          </Button>
 </Col>
 <Col xs="auto" >

          <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={selectedSheetItems.length === 0} onClick={() => onClickDeleteManual()}>
          Delete
          </Button>
 </Col>
<Col xs="auto">
             <Dropzone multiple={false} onDrop={onClickImportManual}>
              {({ getRootProps, getInputProps }) => {
              const rootProps = { ...getRootProps() };
              delete rootProps.tabIndex;
              return <span {...rootProps}>
              <input {...getInputProps()} />
              <Button variant={TabConfig.color} size="sm" disabled={selectedSheetItems.length !== 0} >
               Import
              </Button>
              </span>;
              }}
              </Dropzone> 
            </Col>
 <Col xs="auto" >
          <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={selectedSheetItems.length === 0} onClick={() => onClickExportManual()}>
          Export
          </Button>
 </Col>
 <Col xs="auto" >

          <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={selectedSheetItems.length === 0} onClick={() => onClickEditManual()}>
          Edit Sheet
          </Button>
 </Col>
          <Col xs="auto" >

            <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={selectedSheetItems.length === 0} onClick={() => onClickSaveSelectionManual()}>
              Save Selection
            </Button>
          </Col>
          <Col xs="auto" >
          <Dropzone multiple={false} onDrop={onClickUploadCSV}>
              {({ getRootProps, getInputProps }) => {
              const rootProps = { ...getRootProps() };
              delete rootProps.tabIndex;
              return <span {...rootProps}>
              <input {...getInputProps()} />
              <Button variant={TabConfig.color} size="sm" disabled={selectedSheetItems.length !== 0} >
               Upload-CSV
              </Button>
              </span>;
              }}
              </Dropzone> 
          </Col>
          <Col xs="auto" >

            <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={selectedSheetItems.length === 0} onClick={() => onClickShowQuestionnareOptions()}>
            Questionnaire
            </Button>

          </Col>
          <Col xs="auto" >
            <Button  style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={selectedSheetItems.length === 0 } onClick={()=>{onClickOpenFlowhcartCreationDropdown()}}>
              Flowchart Creation 
            </Button>
          </Col>
      </Form.Row>
     </Form>
        <div className={styles.statTable}>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Select</th>
              <th>Id</th>
              <th>Name</th>
              <th>Sub Name</th>
              <th>Creation</th>
              <th>Selected</th>
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
                <td>{new Date(Date.parse(x.createdAt)).toLocaleString()}</td>
                <td>{x.select===true ? "Yes":""}</td>
              </tr>)
            }
          </tbody>
        </Table>
       </div>

</>
}
{
  showProductAdminQuestionnare===true && 
  <>
        <div className="buttonContainer">
          <Button style={{ marginLeft: "10px",marginRight:"auto" }} variant={TabConfig.color} size="sm" disabled={selectedSheetItems.length === 0} onClick={() => onClickHideQuestionnare()}>
            Back
          </Button>

        </div>
  <div className="questionnareContainer" style={{margin:"10px",border:"1px dotted black",padding:"10px",display:'flex',flexDirection:"column"}}>
    {
      tempQuestionnareArray.map((value,i)=>{
        return(
          <div className="questionContainer" style={{borderRadius:"5px", border: "1px solid gray", marginTop: "12.5px",padding:"5px" }} onMouseEnter={()=>{alterBackgroundQuestiondivOnMouseIn(i)}} onMouseLeave={()=>{alterBackgroundQuestiondivOnMouseOut(i)}} onClick={()=>{changeBorderDiv(i)}} >
            {tempQuestionnareArray[i].flag === "display" &&
              <>
              <div style={{display:"flex",flexDirection:"row"}} >
                <span> {value.number}.</span>
                <span>  {value.name}</span>
                <div className="editButtonContainer" style={{ textAlign: "right", marginLeft: "auto", width: "25%" }}> <Button className="editButton" size="sm" variant="info" style={{ marginRight: "5px" }}  onClick={() => { onClickSetEdit(i) }}> Edit</Button> <Button size="sm" variant="success" onClick={()=>{onClickDisplayModalForQuestionQuesitonnare(i)}} >See details</Button><Button variant="warning" size="sm" style={{marginLeft:"5px"}} onClick={()=>{setShowModalDelete(true);setTempQuestionToDelete(i)}}> Delete </Button></div>
              </div>
              </>
            }
            {
              tempQuestionnareArray[i].flag === "edit" &&
              <>
                <div style={{display:"flex",flexDirection:"row"}}> 
                  <span> {value.number}.</span>
                  <span>  </span>
                  <span> <input type={"text"} className="inputQuestionEdit"  onChange={()=>{console.log("inputChangeEditQuestion")}} /></span>
                  <div className="saveButtonContainer" style={{ marginLeft: "auto", width: "25%", textAlign: "right" }}> <Button variant="success" style={{ marginRight: "10px" }} size="sm" className="saveQuestionButton" onClick={() => { onClickSaveQuestionEditQuestionnare(i) }}> Save </Button> <Button variant="danger" size="sm" onClick={() => { onClickSetDisplay(i) }}>Cancel</Button></div>
                </div></>
            }
            <div className="inputTypeDropContainer">
              <label for={"dropdownInputType"}> Answer Input Type </label>
              <select id={"dropdownInputType"} className="dropdownInputType" style={{ marginLeft: "0%", marginTop: "0px", marginRight: "auto", marginBottom: "0px", width: "100%", height: "25px", color: "white", backgroundColor: "grey", border: "1px solid grey", width: "25%" }}  >>
                {[["text", "dropdown"].map(d1 => d1 === value.inputType  ? <option key={d1} value={d1} selected >{d1}</option> : <option key={d1} value={d1} >{d1}</option>)]}
              </select>
            </div>
          </div>
        )
      })
    
    }
  <>
  <div className="addQuestionQuestionnareContainer" >

              {
                addQuestionFlag.addQuestion === false && <div className="addQuestionButtonContainer">
                  <Button variant={TabConfig.color} size="sm" onClick={()=>{onClickAddQuestionContainerAppearDisappear()}} >
                    Add New Question
                  </Button>
                </div>
              }
              {
                addQuestionFlag.addQuestion === true &&
                <div className="addQuestionContainer" style={{ marginTop: "10px", padding: "10px",border:"1px solid black" }} >
                  <div className="addQuestionTextContainer" style={{padding:"5px"}}><span>Enter Question Text ..        </span>
                  <span> <input type={"text"} className="inputAddQuestionText"  /> </span></div>
                    <div className="answerTypeContainer" style={{marginTop:"5px",padding:"5px"}}>
                      <span className="answerTypeTextDisplay"> Select input Type for the question :-</span>
                      <select id={"dropdownInputTypeAnswerType"} className={"dropdownInputTypeAnswerAddQuestion"} onChange={(e)=>{onClickAppearAnswerDetailsAddQuestion(e)}} style={{ marginLeft: "0%", marginTop: "0px", marginRight: "auto", marginBottom: "0px", height: "25px", color: "white", backgroundColor: "grey", border: "1px solid grey", width: "25%" }}  >
                        {[["text", "dropdown"].map(d1 => d1 === addQuestionFlag.answerType ? <option key={d1} value={d1} selected >{d1}</option> : <option key={d1} value={d1} >{d1}</option>)]}
                      </select>
                      <span>   </span>
                      {
                        addQuestionFlag.answerType === "dropdown" &&
                        <>
                        <div className="addQuestionAnsTypeTextContainer" style={{marginTop:"5px"}}>
                          <span className="EnterOptionsDisplay">
                            Enter Options:- 
                          </span>
                          <span className="addQuestionAnswerOptions">
                            <input placeholder="Enter Options( Comma Separated Values)" className="inputAddQuestionAnswerOptions" type={"text"} />
                          </span></div>
                        </>
                      }
                      {
                        addQuestionFlag.answerType==="text" &&
                        <>
                        <div className="addQuestionAnsTypeDropdownContainer" style={{marginTop:"5px"}}>
                          <span className="EnterIdealAnswerDisplay">
                            Enter Ideal Answer For this question :-
                          </span>
                        <span>
                          <input placeholder="Enter Ideal Answer" className="inputIdealAnswerAddQuestion" type={"text"}></input>
                        </span></div>
                        </>
                      }
                      </div>
                      <div className="saveQuestionDetailsAddQuestionContainer" style={{textAlign:"center"}}>
                        <Button variant="success" size="sm" style={{marginRight:"10px"}}  className="saveNewQuestionDetails" onClick={()=>{onClickAddItemQuestionnare()}}>
                          Save Question
                        </Button>
                        <Button variant="danger" size="sm" className="exitFromNewQuestion" onClick={()=>{onClickAddQuestionContainerAppearDisappear()}}>
                          Exit
                        </Button>
                      </div>
                </div>
              }
  </div>
  </>
  </div>
  </>
}


    <Modal show={showModalForAnslist} onHide={()=>{setShowModalForAnsList(false)}}>
      <Modal.Header closeButton>
        <Modal.Title>Question Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="tableContainerQuestionDetails" style={{ padding: "10px" }}>
          <Table striped hover size="sm">

            <thead>
              <tr>
                <th>
                  Parameters
                </th>
                <th>
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {
                questionDetails.map((value, index) => { // question details is an array format of the object where every key:value becomes an object ,mistake that I was making was treating the details as an object itself with keys as of question key that's why put options insteal of value . value.value,value.options
                  console.log(questionDetails,"questionsDetails")
                  return (
                    <tr>
                      <td>
                        {value.parameter==="options"?value.value.length===0?"Ideal Answer":value.parameter:value.parameter}
                      </td>
                      <td>
                        {value.parameter==="options"?<ol>{value.value.map((valueOption,indexOption)=>{return(<li>{valueOption}</li>)})}</ol>:value.value}
                      </td>
                    </tr>
                  )
                })

              }
            </tbody>

          </Table></div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => { setShowModalForAnsList(false) }}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
    
    


    <Modal show={showModalForUserVerification} onHide={()=>{setShowModalForUserVerification(false)}}>
      <Modal.Header>
        User Redirection
      </Modal.Header>
      <Modal.Body>
        <div className="usersTypeContainer" style={{textAlign:"center",marginTop:"50px"}}>
          <input type={"text"} className="userIdInput" onChange={(e)=>{setTempUserId(e.target.value)}}/>
        </div>
      </Modal.Body>
      <Modal.Footer>
      <Button variant="primary" onClick={() => { onClickUserVerification()  }}>
          Enter
        </Button>
      <Button variant="secondary" onClick={() => { setShowModalForUserVerification(false) }}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
    


    <Modal show={showModalDelete} onHide={()=>{setShowModalDelete(false)}}>
      <Modal.Header>
        <b>Confirmation</b>
      </Modal.Header>
      <Modal.Body>
        <div className="usersTypeContainer" style={{textAlign:"center"}}>
          You are going to delete this question from the questionnaire. 
          Are you sure you want to proceed ?
        </div>
      </Modal.Body>
      <Modal.Footer>
      <Button variant="danger" onClick={() => { onClickDeleteQuestionQUestionnare(0)  }}>
          Yes,Delete
        </Button>
      <Button variant="secondary" onClick={() => { setShowModalDelete(false) }}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
    {
      // delete needs to be acitvated through modal instead of window.alert()
    }
    
    
    
    {

      showAdminQuestionnare === true &&
      <>
        <div className="buttonContainer">
          <Button style={{ marginLeft: "10px", marginRight: "auto" }} variant={TabConfig.color} size="sm" disabled={selectedSheetItems.length === 0} onClick={() => onClickHideQuestionnare()}>
            Back
          </Button>

        </div>
        {/* div.card {
  width: 250px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  text-align: center;
} */}
        <div className="adminQuestionContainer" style={{ position: "relative", marginTop: "20px", border: ".5px solid black", padding: "10px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.15), 0 6px 20px 0 rgba(0, 0, 0, 0.15)", width: "80%", borderRadius: "5px", margin: "auto", backgroundColor: "whitesmoke" }}>
          <div className="adminQuestion">
            <span> {tempQuestionnareArray[tempQuestionnareArrayIndex].number}.  </span>
            <span>  </span>
            <span>{tempQuestionnareArray[tempQuestionnareArrayIndex].name}</span>
          </div>
          <div className="answer" style={{ padding: "10px" }}>
            {
              tempQuestionnareArray[tempQuestionnareArrayIndex].inputType === "text" &&
              <>
                <div className="answerInputTypeTextContainer">
                  <input className="adminAnswerInput" type={"text"} />
                </div>
              </>

            }
            {
              tempQuestionnareArray[tempQuestionnareArrayIndex].inputType === "dropdown" &&
              <>
                <div className="answerInputTypeDropDownContainer">
                  <select className="adminAnswerInput" style={{ borderRadius: "1px" }}>
                    {
                      tempQuestionnareArray[tempQuestionnareArrayIndex].options.map((value, index) => {
                        return (
                          <>
                            {tempQuestionnareArray[tempQuestionnareArrayIndex].answer === value.name &&
                              <option key={value} value={value} selected > {value}</option>
                            }
                            {
                              tempQuestionnareArray[tempQuestionnareArrayIndex].answer !== value.name &&
                              <option key={value} value={value} >{value}</option>
                            }
                          </>
                        )
                      })
                    }
                  </select>
                </div>
              </>
            }

          </div>
          <div className="saveButtonContainer" style={{ textAlign: "right" }}>

            <Button style={{ marginLeft: "auto" }} variant="success" size="sm" onClick={() => onClickEditAnsOfQuestionQuestionnare()}>
              Save Ans
            </Button>

          </div>


          <div className="traverseButtonsContainer" style={{ textAlign: "center" }} >
            <Button style={{ margin: "5px" }} variant={TabConfig.color} size="sm" onClick={() => onClickDecreaseIndexQuestionnareAdmin()}>
              <Icon.ArrowLeft /> Prev
            </Button>
            <Button style={{ margin: "5px" }} variant={TabConfig.color} size="sm" onClick={() => onClickIncreaseIndexQuestionnareAdmin()}>
              Next <Icon.ArrowRight />
            </Button>

          </div>
        </div>



      </>



    }

{showQuestionnareOptions===true &&
      <div style={{paddingTop:"100px"}}>
        <div className="questionnareButtonsContainer" style={{ textAlign: "center",border:"1px dotted black"}}>
          <Button style={{ margin: "10px" }} variant={TabConfig.color} size="lg" onClick={() => onClickShowProductAdminQuestionnare()}>
            Product Admin
          </Button>
          <Button style={{ margin: "10px" }} variant={TabConfig.color} size="lg" onClick={() => onClickShowAdminQuestionnare()}>
            Admin
          </Button>
        </div>


      </div>


}




    {
      showFlowchartCreationContainer === true &&
    
        <div className="FlowchartCreationcontainer" style={{ margin: "2px", border: "1px dotted black", borderRadius: "1px" }} >
          <Button variant="secondary" size="sm" onClick={onClickHideFlowchartCreationSection}  style={{marginLeft:"auto"}}>Back</Button>
          <span >
            <Button onClick={()=>{setModalForNewQuestionFlowchartCreation(true)}} size="sm" variant="info" style={{marginRight:"auto",marginTop:"10px",marginLeft:"10px"}}>
              Add New Question
            </Button>
          </span>
          <div className="flowchartCreationCenterContainer" style={{ margin: "auto", boxShadow: "0px 0px 10px rgb(0,0,0,.1)", width: "49%", borderRadius: "5px", display: "flex", flexDirection: "column" }}>
            {
              tempArrayNewFlowElements.map(
                (value, index) => {
                return (
                  <div className="NewFlowContainer" style={{ display: "flex", flexDirection: "column", textAlign: "center", }}>
                    <div className="NewFlowElementDetailContainer" style={{ borderRadius: "5px", border: "1px solid grey", boxShadow: "0px 0px 10px rgb(0,0,0,.1)" }} >
                      <span style={{ margin: "10px", backgroundColor: "rgba(26,153,208)" }}>
                        {value.question}
                      </span>
                      <span style={{ margin: "10px", backgroundColor: "rgb(18,41,157)" }}>
                        {value.choice}
                      </span>
                    </div>
                    <div className="arrowContainew" style={{ textAlign: "center" }}>
                      <span>
                        <Arrow height="150" angle="180" lineWidth="15" >

                        </Arrow>
                      </span>
                    </div>
                  </div>
                )
              })

            }

            <div className="newFlowElementContainer" style={{ margin: "auto", width: "60%", textAlign: "center",border:"1px solid black",borderRadius:"1px" }}>

              <div className="newFlowElementDetailsContainer" style={{ display: "flex", flexDirection: "column",padding:"5px",width:"70%",textAlign:"center" }}>
                <div style={{textAlign:"center"}}>
                  <span className="questionNewFlow" style={{ margin: "10px" }}>
                    <label for="questionNewFlowSelect">
                      Question
                    </label>
                    <Select id="questionNewFlowSelect" options={tempArrayFlowchartCreationQuestions} onChange={(e) => { setTempQuestion(e.value) }} >
                    </Select>
                  </span></div>
                <div style={{textAlign:"center"}}>
                  <span className="choiceNewFlow">
                    <Form>
                      <Form.Label> Enter Choice</Form.Label>
                      <Form.Control placeholder="enter Choice" onChange={(e) => { setTempChoiceNewFlow(e.target.value) }} >

                      </Form.Control>
                    </Form>
                    {/* <input type={"text"}  /> */}
                  </span>
                </div>
                <div style={{marginTop:"10px",textAlign:"center"}}>
                  <span className="addElementButtonContainer" >
                    <Button className="addElementButton" variant="primary" size="sm" onClick={() => { onClickAddElementToNewFlow() }}>
                      Add Element
                    </Button>
                  </span>
                </div>
              </div>
            </div>
          </div>
          </div>
      


}

    <Modal show={showModalForAddNewQuestion} onHide={() => { setModalForNewQuestionFlowchartCreation(false) }}  >
      <Modal.Header>
        <b>Add New Question</b>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Label>
            Enter Question Text
          </Form.Label>
          <Form.Control placeholder="enter question text" onChange={(e)=>(setTempQuestionNewLot(e.target.value))}>

          </Form.Control>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button size="sm" variant="success" onClick={() => { onClickAddQuestionFlowchartLot();setModalForNewQuestionFlowchartCreation(false) }}>
          <Icon.CheckCircleFill></Icon.CheckCircleFill>
          Add Question
        </Button>
        <Button size="sm" variant="danger" onClick={() => { setModalForNewQuestionFlowchartCreation(false) }}>
          <Icon.XCircleFill></Icon.XCircleFill>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>


          {getAllowedSelection() && addxSxSelect === true && modxSxSelect === false && edtxSxSelect === false && <>

            <div style={{ marginTop: "50px" }}>

              <Form>
                <Form.Row>
                  <Form.Group as={Col} controlId="formGrid-10">
                    <Form.Label>{"Spreadsheet"} Name</Form.Label>
                    <Form.Control autoComplete="none" placeholder="Enter Name" onChange={(e) => handleEditor("Name", e)} />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGrid-11">
                    <Form.Label>{"Table Title"}</Form.Label>
                    <Form.Control autoComplete="none" placeholder="Enter Table Title" onChange={(e) => handleEditor("Title", e)} />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGrid-12">
                    <Form.Label>{"Table Row"}</Form.Label>
                    <Form.Control autoComplete="none" placeholder="Enter number of row" onChange={(e) => handleEditor("Row", e)} />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGrid-13">
                    <Form.Label>{"Table Column"}</Form.Label>
                    <Form.Control autoComplete="none" placeholder="Enter number of column" onChange={(e) => handleEditor("Column", e)} />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Col xs="auto">
                    <Button variant={TabConfig.color} size="sm" block disabled={enterName === "" || enterTitle === "" || enterRow === "" || enterColumn === ""} onClick={() => onClickAddSaveManual()}>
                      Save
                    </Button>
                  </Col>
                  <Col xs="auto">
                    <Button variant={TabConfig.color} size="sm" block onClick={() => onClickAddCancelManual()}>
                      Cancel
                    </Button>
                  </Col>
                </Form.Row>
              </Form>
            </div>

          </>
          }

{ getAllowedSelection() && addxSxSelect === false && modxSxSelect === true && edtxSxSelect === false && <> 

      <div style={{ marginTop: "50px" }}>
      
        <Form>
          <Form.Row>
            <Form.Group as={Col} controlId="formGrid-21">
              <Form.Label>Rename {"Spreadsheet"} Name</Form.Label>
              <Form.Control autoComplete="none" placeholder= {placeholderName} onChange={(e) => handleEditor("Name", e)} />
            </Form.Group>
            <Form.Group as={Col} controlId="formGrid-22">
              <Form.Label>Rename {"Spreadsheet"} Sub Name</Form.Label>
              <Form.Control autoComplete="none" placeholder= {placeholderSubName} onChange={(e) => handleEditor("SubName", e)} />
            </Form.Group>
            <Form.Group as={Col} controlId="formGrid-32">
              <Form.Label>Rename {"Spreadsheet"} Table Title</Form.Label>
              <Form.Control autoComplete="none" placeholder= {placeholderTitle} onChange={(e) => handleEditor("Title", e)} />
            </Form.Group>

          </Form.Row>
          <Form.Row>
            <Col xs="auto">
              <Button variant={TabConfig.color} size="sm" block disabled={enterName === "" } onClick={() => onClickModSaveManual()}>
              Save
              </Button>
            </Col>
            <Col xs="auto">
              <Button variant={TabConfig.color} size="sm" block onClick={() => onClickModCancelManual()}>
              Cancel 
              </Button>
             </Col>
          </Form.Row>
        </Form>
      </div>
</>
}

{ getAllowedSelection() && addxSxSelect === false && modxSxSelect === false && edtxSxSelect === true && <> 
      <div style={{ marginTop: "10px" }}>
        <h4 class="text-center">{tableTitle}</h4>
      </div>

 <Form>
 <Form.Row>
            <Col xs="auto" md={{ span: 0, offset: 0 }}>
              <Button variant={TabConfig.color} size="sm" disabled={false} onClick={() => onClickEdtBackManual()} >
              Back
              </Button>
            </Col>

  <Col xs="auto" >
          <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={selectedTableItems.length === 0} onClick={() => onClickInsertManualTableItem()}>
          Insert Row
          </Button>
 </Col>
 <Col xs="auto" >

          <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={selectedTableItems.length === 0 || tableItems.length === 2} onClick={() => onClickDeleteManualTableItem()}>
          Delete
          </Button>
 </Col>
 <Col xs="auto" >

          <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={selectedTableItems.length === 0} onClick={() => onClickAssignTableItem()}>
          Assign
          </Button>
 </Col>
 <Col xs="auto" >

          <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={selectedTableItems.length !== 0} onClick={() => onClickHdrEditTableItem()}>
          Header
          </Button>
 </Col>

 <Col xs="auto" >

          <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={colSelect === false || colCurrent === 255 } onClick={() => onClickInsertColTableItem()}>
          Insert Col
          </Button>
 </Col>

 <Col xs="auto" >

          <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={colSelect === false || colCurrent === 255} onClick={() => onClickDelColTableItem()}>
          Delete Col
          </Button>
 </Col>

 <Col xs="auto" >

          <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={selectedTableItems.length !== 0} onClick={() => onClickSaveManualTableItem()}>
          Save
          </Button>
 </Col>
 <Col xs="auto" >
        <label style={{ marginLeft: "10px" }}>
         <input type="checkbox" checked = {colSelect} onChange={(e) => handleCheckboxEditor("SELECT_COL_ENABLE", 0, e)}/>{" Col Selection"}
        </label>      


 </Col>
          
 <Col xs="auto" >
 
          <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={selectedTableItems.length === 0} onClick={() => {
            if(masterDatabaseFlag===false){
              onClickGenerateMasterDatabase1()
            }
            else{
              onClickDownloadJSON()
            }}}>
          GENERATE FLOWCHARTS
          </Button>
 </Col>
 </Form.Row>
 </Form>
        <div className={styles.statTable}>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
             {tableItems.length > 0 && 
               <>
              <th>Select</th>
              <th>Id</th>
              { hdrxSxSelect === false && colSelect === true && tableItems[0].col.map((x, val) => <th> <input type="checkbox" checked = {val === colCurrent} onChange={(e) => handleCheckboxEditor("SELECT_COL_VALUE", val, e)}/>{" "}{x.name}</th>)}
              { hdrxSxSelect === false && colSelect === false && tableItems[0].col.map((x, val) => <th>{x.name}</th>)}
              { hdrxSxSelect === true && tableItems[0].col.map((y, uindex) =>
                <th>
                <Form>
                <textarea id={uindex} style={{ resize: "none" }} rows="1" cols="10" placeholder= {""} onChange={(e) => handleTableItemCol("HDR", uindex, e)} >{y.name}</textarea>
                </Form>
              </th>)}
              </>
             }

            </tr>
          </thead>
          <tbody>
            { tableItems.map((x, index) => index === 0 ? <></> :
              <tr key={x.id}>
                
                <td className={styles.cellsize}>
                  <ToggleButton
                  inactiveLabel={<X />}
                  activeLabel={<Check />}
                  value={selectedTableItems.indexOf(x) >= 0}
                  onToggle={() => onTableItemSelectedChanged(x)} />  
                </td>
                <td className={styles.cellsize}>{index}</td>
                {selectedTableItems.indexOf(x) >= 0 && x.col.map((y, uindex) => 
                 <td>
                 { dpdxSxSelect === false && y.val.length === 0 &&
                 <Form>
                        <textarea id={uindex} style={{ resize: "none" }} rows="1" cols="10" placeholder= {""} onChange={(e) => handleTableItemCol("COL", uindex, e)} >{y.name}</textarea>
                  </Form>
                 }
                { dpdxSxSelect === false && y.val.length > 0 &&
                  <Form>
                     <select id= {uindex} onChange={(e) => handleTableItemCol("SEL", uindex, e)} >
                      {[<option key="" value="" />, ...y.val.map(d1 => d1 === y.name ? <option key={uindex+10} value={d1} selected >{d1} </option> :<option key={uindex+10} value={d1} >{d1}</option>)]}</select>
                  </Form>

              
                 }

                 { dpdxSxSelect === true &&
                 <Form>
                     <textarea id={uindex} style={{ backgroundColor: "orange", resize: "none" }} rows="1" cols="10" placeholder= {""} onChange={(e) => handleTableItemCol("DRP", uindex, e)} >{y.value}</textarea>
                  </Form>
                 }
                 </td>
                )}
                {selectedTableItems.indexOf(x) < 0 && x.col.map((y, uindex) => y.val.length === 0 ?<td>{y.name}</td> :<td>
                 <Form>
                    { y.val.map(d1 => (d1 === "Upload" || d1 === "Download" || d1 === "Delete") ? 
                     <>
                     {d1 === "Upload" && 
             <Dropzone multiple={false} onFileDialogCancel={onClickImportCancel} accept= {getAllowedfileExt(y.name)} onDrop={(accepted, rejected) => onClickImportManualCol(accepted, rejected, x.id, y.id)}>
              {({ getRootProps, getInputProps }) => {
              const rootProps = { ...getRootProps() };
              delete rootProps.tabIndex;
              return <span {...rootProps}>
              <input {...getInputProps()} />
              <Button variant={TabConfig.color} size="sm" disabled={checkTableItemCol(d1, y.uploadLink)} >
              { d1 === "Upload" && <i class="fa fa-upload" aria-hidden="true"></i> }
              </Button>
              </span>;
              }}
              </Dropzone> 
                     }
                     {d1 !== "Upload" && 
                     <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={checkTableItemCol(d1, y.uploadLink)} onClick={() => onClickManualTableItemAction(d1, y.uploadLink, x.id, y.id, y.uploadName)}>
                     { d1 === "Download" && <i class="fa fa-download" aria-hidden="true"></i>}
                     { d1 === "Delete" && <i class="fa fa-trash" aria-hidden="true"></i>}
                     </Button>
                     }
                     </>
                  : <> {d1 === y.name && (d1 === "Pdf" || d1 === "Excel" || d1 === "Html" || d1 === "Image" || d1 === "Text") && 
                     <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={checkTableItemCol(d1, y.uploadLink)} onClick={() => onClickManualTableItemAction(d1, y.uploadLink, x.id, y.id, y.uploadName)}>
                     { d1 === "Pdf" && <i class="fa fa-file-pdf-o" aria-hidden="true"></i>}
                     { d1 === "Text" && <i class="fa fa-file-text-o" aria-hidden="true"></i>}
                     { d1 === "Image" && <i class="fa fa-file-image-o" aria-hidden="true"></i>}
                     { d1 === "Excel" && <i class="fa fa-file-excel-o" aria-hidden="true"></i>}
                     { d1 === "Word" && <i class="fa fa-file-word-o" aria-hidden="true"></i> }
                     { d1 === "Powerpoint" && <i class="fa fa-file-powerpoint-o"></i> }
                     { d1 === "Html" && <i class="fa fa-html5" aria-hidden="true"></i>}
                     </Button>}
                     {d1 === y.name && (d1 !== "Pdf" && d1 !== "Excel" && d1 !== "Html" && d1 !== "Image" && d1 !== "Text") && 
                     <Button style={{ marginLeft: "10px" }} variant={TabConfig.color} size="sm" disabled={true}>{d1}
                     </Button>}
                     </>
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


 {viewWait === true && <Modal show={true} backdrop="static" centered size= "xl" style={{ width: "1400px", height: "800px" }} onHide={() => setViewWait(false)}>
  <Modal.Header closeButton>  </Modal.Header>
  <iframe src={testPdf} title="NDE" id="my-frame" style={{ width: "1125px", height: "650px" }}/>

  </Modal>}

  </div>;
}

