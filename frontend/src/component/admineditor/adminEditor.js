// @flow strict
// Copyright (C) 2022 Deep Skills Inc., - All Rights Reserved
// Unauthorized copying of this file, via any medium is strictly prohibited
// Proprietary and confidential

import React, { useState, useEffect } from "react";
import styles from "./adminEditor.module.css";

import Button from "react-bootstrap/Button";
import ToggleButton from "react-toggle-button";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { Col } from "react-bootstrap";
import axios from "axios";

import { TabConfig } from "../../config/config";

import { Check, X } from "../../utils/buttons";
import { apiEndpoint, download } from "../../utils/common";

import type { User, Login } from "../../rpc/model";

import { UserService } from "../../rpc/user";

type UserOption = {
  type: string,
  name: string,
  col: string,
  value: string,
  val:string[]
};

type AdminEditorProps = {
};

export default function AdminEditor(props: AdminEditorProps) {
  const [userManageSelect, setUserManageSelect] = useState<boolean>(true);
  const [downloadManageSelect, setDownloadManageSelect] = useState<boolean>(false);

  const [users, setUsers] = useState<Array<User>>([]);
  const [selectedUsers, setSelectedUsers] = useState<Array<User>>([]);
  const [userLogins, setUserLogins] = useState<Array<Login>>([]);

  const [addUserSelect, setAddUserSelect] = useState<boolean>(false);
  const [modUserSelect, setModUserSelect] = useState<boolean>(false);
  const [historyUserSelect, setHistoryUserSelect] = useState<boolean>(false);

  const [nameJSON, setNameJSON] = useState<string>("");
  const [passwordJSON, setPasswordJSON] = useState<string>("");

  const [userDataProcess, setUserDataProcess] = useState<boolean>(false);
  const [userOptions, setUserOptions] = useState<Array<UserOption>>([]);
  const [dataJSON, setDataJSON] = useState<string>("");

  const [storeTemplateInfo, setStoreTemplateInfo] = useState<Array<[]>>([]);
  const [templateSelect, setTemplateSelect] = useState<string>("");


  useEffect(() => {
    async function fetchUsers() {
      const resp = await new UserService(apiEndpoint()).users();
      setUsers(resp.users);
      const response = await axios.get(apiEndpoint() + `/api/blob/workspace/list/${"admin"}`);
      if (response.status === 200) {
        setStoreTemplateInfo(response.data);
        setTemplateSelect(response.data[0]);

      }
      setUserDataProcess(true);
    }  
    fetchUsers();
  }, []);


  async function updateUserData() {
    let attrdb = "";
    for (let i=0; i<users.length; i++) {
      const attrSel = [];
      const attrOpt = [];
      if (users[i].data === "") {
        attrdb = "0";
        attrSel.push({ S1: "", S2: "", S3: "", S4: "", S5: "", S6: "", S7: "", S8: "" }); 
        attrOpt.push({ P1: "Disable", P2: "Disable", P3: "Disable", P4: "", P5: "Empty", P6: "Disable", P7: "Disable", P8: "Disable" }); 
        const dataJsON = JSON.stringify({ db: attrdb, sel: attrSel, opt: attrOpt });
        await new UserService(apiEndpoint()).editUser({ userId: users[i].id, delta: dataJsON });
      }
    }
    if (attrdb !== "") {
      const resp = await new UserService(apiEndpoint()).users();
      setUsers(resp.users);
    }

    const attrChoice = [];
    attrChoice.push({ type: "M", name: "P1", col: "Col1", value: "Enable,Disable", val: [] }); 
    attrChoice.push({ type: "M", name: "P2", col: "Col2", value: "Enable,Disable", val: [] }); 
    attrChoice.push({ type: "M", name: "P3", col: "Col3", value: "Enable,Disable", val: [] }); 
    let str = "";
    for (let i=0; i < storeTemplateInfo.length; i++) {
     str = str + storeTemplateInfo[i];
     if (i !== (storeTemplateInfo.length-1)) {
      str = str + ",";
     }
    } 
    attrChoice.push({ type: "M", name: "P4", col: "Col4", value: str, val: [] }); 
    attrChoice.push({ type: "M", name: "P5", col: "Col5", value: "", val: [] }); 

    if (attrChoice.length > 0) {
      attrChoice.map(x => x.val = x.value.split(","));
    }  

    setUserOptions(attrChoice);
    setUserDataProcess(false);
  }

  function onClickUserManage() {
    setUserManageSelect(true);
    setDownloadManageSelect(false);
  }

  function onClickDownloadManage() {
    setUserManageSelect(false);
    setDownloadManageSelect(true);
  }

  async function onClickUserSave() {
    const attrdb = "0";
    const attrSel = [];
    const attrOpt = [];
    attrSel.push({ S1: "", S2: "", S3: "", S4: "", S5: "", S6: "", S7: "", S8: "" }); 
    attrOpt.push({ P1: "Disable", P2: "Disable", P3: "Disable", P4: "", P5: "Empty", P6: "Disable", P7: "Disable", P8: "Disable" }); 
    const dataJsON = JSON.stringify({ db: attrdb, sel: attrSel, opt: attrOpt });
    const response = await new UserService(apiEndpoint()).addUser({ name: nameJSON, password: passwordJSON, data: dataJsON });
    if (response != null) {
       console.log(response);
    }
    const resp = await new UserService(apiEndpoint()).users();
    setUsers(resp.users);
    setAddUserSelect(false);
    setModUserSelect(false);
    setHistoryUserSelect(false);
  }

  function onClickUserCancel() {
    setAddUserSelect(false);
    setModUserSelect(false);
    setHistoryUserSelect(false);
    setSelectedUsers([]);
  }

  async function onClickUserModifySave() {
    const response = await new UserService(apiEndpoint()).setUserPassword({ userId: selectedUsers[0].id, password: passwordJSON });
    if (response != null) {
       console.log(response);
    }
    setAddUserSelect(false);
    setModUserSelect(false);
    setHistoryUserSelect(false);
    setSelectedUsers([]);
  }

  function onClickAddUser() {
    setAddUserSelect(true);
    setModUserSelect(false);
    setHistoryUserSelect(false);

  }

  function onClickModifyUser() {
    setAddUserSelect(false);
    setModUserSelect(true);
    setHistoryUserSelect(false);
  }

  async function onClickDeleteUser() {
    console.log(selectedUsers)
    console.log("userId",selectedUsers[0].id)
    if (!window.confirm("You are going to delete the user \nAre you sure?"))
         return;
    
    await new UserService(apiEndpoint()).deleteUser({ userId: selectedUsers[0].id });
    const resp = await new UserService(apiEndpoint()).users();
    setUsers(resp.users);
    setSelectedUsers([]);
  }

  async function onClickHistoryUser() {
    if (selectedUsers.length !== 0) {
      const response = await new UserService(apiEndpoint()).loginsForUser({ userId: selectedUsers[0].id });
      setUserLogins(response.logins);
    }
    if (selectedUsers.length === 0) {
      const response = await new UserService(apiEndpoint()).logins();
      setUserLogins(response.logins);
    }
    setAddUserSelect(false);
    setModUserSelect(false);
    setHistoryUserSelect(true);
  }

  function onUserSelectedChanged(info: User) {
    const index = selectedUsers.indexOf(info);
    if (index >= 0) {
      setSelectedUsers(selectedUsers => [
        ...selectedUsers.slice(0, index),
        ...selectedUsers.slice(index + 1),
      ]);
    } else {
      setSelectedUsers([]);
   
      setSelectedUsers(selectedUsers => [...selectedUsers, info]);
    }
  }

  async function handleUserName(e: SyntheticKeyboardEvent<HTMLInputElement>) {
    const trimValue = e.currentTarget.value.trim();
    if (trimValue === "") {
      setNameJSON("");
    } else {
      setNameJSON(trimValue);
    }
  }

  async function handleUserPassword(e: SyntheticKeyboardEvent<HTMLInputElement>) {
    const trimValue = e.currentTarget.value.trim();
    if (trimValue === "") {
      setPasswordJSON("");
    } else {
      setPasswordJSON(trimValue);
    }
  }

  async function handleUserSettings(info:User, colStr:string, e: SyntheticKeyboardEvent<HTMLInputElement>) {
    const trimValue = e.currentTarget.value.trim();
    const obj = JSON.parse(info.data);
    if (obj.opt !== undefined) {
      switch (colStr) {

        case "Col1":
          obj.opt[0].P1 = trimValue;
          break;

        case "Col2":
          obj.opt[0].P2 = trimValue;
          break;

        case "Col3":
          obj.opt[0].P3 = trimValue;
          break;

        case "Col4":
         const sel = [];
         for (let t =0; t < e.currentTarget.options.length; t++) {
           if (e.currentTarget.options[t].selected) {
             sel.push(e.currentTarget.options[t].value);
            }  
          }
          let str = "";
          for (let i=0; i < sel.length; i++) {
            str = str + sel[i];
           if (i !== (storeTemplateInfo.length-1)) {
            str = str + ",";
           }
          } 
          obj.opt[0].P4 = str;
          break;

        case "Col5":
          obj.opt[0].P5 = trimValue;
          break;

        case "Col6":
          obj.opt[0].P6 = trimValue;
          break;

        case "Col7":
          obj.opt[0].P7 = trimValue;
          break;

        case "Col8":
          obj.opt[0].P8 = trimValue;
          break;
        default: break;
      }
      setDataJSON(JSON.stringify({ db: obj.db, sel: obj.sel, opt: obj.opt }));
    }
  }

  async function onClickSaveUser() {
    await new UserService(apiEndpoint()).editUser({ userId: selectedUsers[0].id, delta: dataJSON });
    setSelectedUsers([]);
    setDataJSON("");
 
  }

  function GetUserColInfo(info:User, colStr:string, str1: string, index:number) {
    let str = "";
    const obj = JSON.parse(info.data);
    if (obj.opt !== undefined) {
      switch (colStr) {

     case "Col1":
          str = obj.opt[0].P1;
          break;

     case "Col2":
          str = obj.opt[0].P2;
          break;

     case "Col3":
          str = obj.opt[0].P3;
          break;

     case "Col4":
          console.log(index, str1);
          const val = obj.opt[0].P4.split(",");
          for (let i =0; i < val.length; i++) {
            if (str1 === val[i]) {
              str = str1;
              break;
            }
          }
          break;

     case "Col5":
          str = obj.opt[0].P5;
          break;

     case "Col6":
          str = obj.opt[0].P6;
          break;

     case "Col7":
          str = obj.opt[0].P7;
          break;

     case "Col8":
          str = obj.opt[0].P8;
          break;

     default: break;
    }
   }
   return str;
  }

  const handleUserData = () => {
     updateUserData();
  };

  function handleDropdown(id: number, e: SyntheticKeyboardEvent<HTMLInputElement>) {
    switch (id) {

     case 2:
     setTemplateSelect(e.currentTarget.value);
     break;

     default:
       break;
    }
  }

  function GetUserLogInfo(colStr:string, str1: string, index:number) {
     let str = []
     switch(index){
        case 1:
         str = colStr.split("&&");
         return str[0]
         break;

        case 2:
         str = colStr.split("&&");
         if (str.length === 1){
           return str1
         }
         break;

        case 3:
         str = colStr.split("&&");
         if (str.length !== 1){
           return str1
         }
         break;

     default:
       break;
    }
    return ""
    
  }

  async function onClickDownloadDatabase(x:number) {
    let filename = "";
    if (x == 1) {
       filename = "floweditordatabase.zip";
    }
    if (x == 2) {
       filename = "usecasedatabase.zip";
    }

    await axios.get(apiEndpoint() + `/api/blob/workspace/download/db/${x}`, { responseType: "blob" })
    .then((response) => {
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      download(filename, "", downloadUrl);
    });

  }

  async function onClickDownloadLogs(x:number) {
    let filename = "";
    if (x == 1) {
       filename = "adminportlog.txt";
    }
    if (x == 2) {
       filename = "userportlog.txt";
    }

    await axios.get(apiEndpoint() + `/api/blob/workspace/download/logs/${x}`, { responseType: "blob" })
    .then((response) => {
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      download(filename, "", downloadUrl);
    });

  }


  return <div className={styles.root}>
   {userDataProcess === true && handleUserData()}
     <Form>
      <Form.Row>
        <Col xs="auto" md={{ span: 0, offset: 10 }}>
          <Button variant={TabConfig.color} size="sm" disabled= {userManageSelect} onClick={() => onClickUserManage()} >
          Manage
          </Button>
        </Col>
        <Col xs="auto">
          <Button variant={TabConfig.color} size="sm" disabled= {downloadManageSelect} onClick={() => onClickDownloadManage()} >
          Download
          </Button>
        </Col>

      </Form.Row>
    </Form>

    { userManageSelect === true && addUserSelect === false && modUserSelect === false && historyUserSelect === false &&
    
      <div style={{ marginTop: "50px" }}>
          <Form>
      <Form.Row>
        <Col xs="auto" >
          <Button variant={TabConfig.color} size="sm" disabled={ selectedUsers.length !== 0 } onClick={() => onClickAddUser()} >
          Add
          </Button>
        </Col>
        <Col xs="auto" >
          <Button variant={TabConfig.color} size="sm" disabled={selectedUsers.length === 0} onClick={() => onClickModifyUser()} >
          Modify
         </Button>
        </Col>
        <Col xs="auto" >
          <Button variant={TabConfig.color} size="sm" disabled={selectedUsers.length === 0} onClick={() => onClickDeleteUser()} >
          Delete
          </Button>
        </Col>
        <Col xs="auto" >
          <Button variant={TabConfig.color} size="sm" disabled={selectedUsers.length === 0 || dataJSON === ""} onClick={() => onClickSaveUser()} >
          Save
          </Button>
        </Col>
        <Col xs="auto" >
          <Button variant={TabConfig.color} size="sm" disabled={selectedUsers.length === 0} onClick={() => onClickHistoryUser()} >
          History
          </Button>
        </Col>
        <Col xs="auto" >
          <Button variant={TabConfig.color} size="sm" disabled={selectedUsers.length !== 0} onClick={() => onClickHistoryUser()} >
          History-All
          </Button>
        </Col>

      </Form.Row>
    </Form>

  
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Select</th>
              <th>User Name</th>
              <th>Creation</th>
              <th>Remote-O</th>
              <th>Admin Rights</th>
              <th>FlowChart</th>
              <th>Template</th>
              <th>Filter Item</th>
            </tr>
          </thead>
          <tbody>
            { users.length > 0 && users.map(x =>
              <tr key={x.id}>
                <td className={styles.cellsize}>
                  <ToggleButton
                  inactiveLabel={<X />}
                  activeLabel={<Check />}
                  value={selectedUsers.indexOf(x) >= 0}
                  onToggle={() => onUserSelectedChanged(x)} />  
                </td>
                <td>{x.name}</td>
                <td>{new Date(Date.parse(x.createdAt)).toLocaleString()}</td>
                {userOptions.length > 0 && userOptions.map(z => (z.type === "M" && z.name !== "P4" && z.name !== "P5") ?
                <td>
                    <Form> 
                    <select id= {x.id + z.col} disabled={selectedUsers.length !== 0 ? selectedUsers[0].id === x.id ? false : true : true} onChange={(e) => handleUserSettings(x, z.col, e)}>
                     {[...z.val.map((d1, index) => d1 === GetUserColInfo(x, z.col, d1, index) ? <option key={z.col} value={d1} selected >{d1} </option> :<option key={z.col} value={d1} >{d1}</option>)]}
                    </select>
                    </Form>
                </td>
                : <> 
                 {z.name === "P4" &&             
                <td>
                    <Form> 
                    <select id= {x.id + z.col} disabled={selectedUsers.length !== 0 ? selectedUsers[0].id === x.id ? false : true : true} size="4" multiple onChange={(e) => handleUserSettings(x, z.col, e)}>
                     {[...z.val.map((d1, index) => d1 === GetUserColInfo(x, z.col, d1, index) ? <option key={z.col} value={d1} selected >{d1} </option> :<option key={z.col} value={d1} >{d1}</option>)]}
                    </select>
                    </Form>
                </td> }
                 {z.name === "P5" &&             
                <td>
                    <Form> 
                    <textarea style={{ resize: "none" }} rows="2" cols="10" disabled={selectedUsers.length !== 0 ? selectedUsers[0].id === x.id ? false : true : true} placeholder= {GetUserColInfo(x, z.col)} onChange={(e) => handleUserSettings(x, z.col, e)} >{GetUserColInfo(x, z.col)}</textarea>
                    </Form>
                </td>}
                </>

                )}

                {userOptions.length > 0 && userOptions.map(z => z.type === "E" ?
                <td>
                    <Form> 
                       <textarea style={{ resize: "none" }} rows="2" cols="10" disabled={selectedUsers.length !== 0 ? selectedUsers[0].id === x.id ? false : true : true} placeholder= {GetUserColInfo(x, z.col)} onChange={(e) => handleUserSettings(x, z.col, e)} >{GetUserColInfo(x, z.col)}</textarea>
                      </Form>

                </td>
                :<></>
                )}
              </tr>)
            }
          </tbody>
        </Table>

    </div>
  }

  { userManageSelect === true && addUserSelect === true && modUserSelect === false && historyUserSelect === false &&

      <div style={{ marginTop: "50px" }}>
      
        <Form>
          <Form.Row>
            <Form.Group as={Col} controlId="formGrid-1">
              <Form.Label>New User Name</Form.Label>
              <Form.Control autoComplete="none" placeholder="Enter Name" onChange={handleUserName} />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} controlId="formGrid-2">
              <Form.Label>New User Password</Form.Label>
              <Form.Control autoComplete="none" placeholder="Enter Password" onChange={handleUserPassword} />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Col xs="auto">
              <Button variant={TabConfig.color} size="sm" block disabled={nameJSON === "" || passwordJSON === ""} onClick={() => onClickUserSave()}>
              Save
              </Button>
            </Col>
            <Col xs="auto">
              <Button variant={TabConfig.color} size="sm" block onClick={() => onClickUserCancel()}>
              Cancel 
              </Button>
             </Col>
          </Form.Row>
        </Form>
      </div>
    }

  { userManageSelect === true && addUserSelect === false && modUserSelect === true && historyUserSelect === false &&

      <div style={{ marginTop: "50px" }}>
      
        <Form>
          <Form.Row>
            <Form.Group as={Col} controlId="formGrid-1">
              <Form.Label>New User Password - {selectedUsers[0].name} </Form.Label>
              <Form.Control autoComplete="none" placeholder="Enter Password" onChange={handleUserPassword} />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Col xs="auto">
              <Button variant={TabConfig.color} size="sm" block disabled={passwordJSON === ""} onClick={() => onClickUserModifySave()}>
              Save
              </Button>
            </Col>
            <Col xs="auto">
              <Button variant={TabConfig.color} size="sm" block onClick={() => onClickUserCancel()}>
              Cancel 
              </Button>
             </Col>
          </Form.Row>
        </Form>
      </div>
    }

    { userManageSelect === true && addUserSelect === false && modUserSelect === false && historyUserSelect === true &&
    
      <div style={{ marginTop: "50px" }}>
          <Form>
      <Form.Row>
        <Col xs="auto" >
          <Button variant={TabConfig.color} size="sm" disabled={ false } onClick={() => onClickUserCancel()} >
          Back
          </Button>
        </Col>
      </Form.Row>
    </Form>

  
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Login Time</th>
              <th>Logout Time</th>
            </tr>
          </thead>
          <tbody>
            { userLogins.length > 0 && userLogins.map(x =>
              <tr key={x.userId}>
                <td>{GetUserLogInfo(x.userName,new Date(Date.parse(x.loginAt)).toLocaleString(),1)}</td>
                <td>{GetUserLogInfo(x.userName,new Date(Date.parse(x.loginAt)).toLocaleString(),2)}</td>
                <td>{GetUserLogInfo(x.userName,new Date(Date.parse(x.loginAt)).toLocaleString(),3)}</td>
              </tr>)
            }
          </tbody>
        </Table>

    </div>
  }
  { downloadManageSelect === true && <> 


       <Button style={{ marginLeft: "10px", marginTop: "50px" }} variant={TabConfig.color} size="sm" disabled={templateSelect === ""} onClick={() => onClickDownloadDatabase(1)}>
          Download Flow Editor Database
       </Button>

       <Button style={{ marginLeft: "10px", marginTop: "50px" }} variant={TabConfig.color} size="sm" disabled={templateSelect === ""} onClick={() => onClickDownloadDatabase(2)}>
          Download Use case Database
       </Button>

  <Button style={{ marginLeft: "10px", marginTop: "50px" }} variant={TabConfig.color} size="sm" disabled={templateSelect === ""} onClick={() => onClickDownloadLogs(1)}>
  Backend Logs (Port:8095)
 </Button>

  <Button style={{ marginLeft: "10px", marginTop: "50px" }} variant={TabConfig.color} size="sm" disabled={templateSelect === ""} onClick={() => onClickDownloadLogs(2)}>
 Backend Logs (Port:8096)
 </Button>

  </>}
  </div>;
}

