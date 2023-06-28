// @flow strict
// Copyright (C) 2022 Deep Skills Inc., - All Rights Reserved
// Unauthorized copying of this file, via any medium is strictly prohibited
// Proprietary and confidential

import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Col } from "react-bootstrap";

import { TabConfig } from "./config/config";

import logo from "./assets/img/custom.png";

import { apiEndpoint, ColoredBar, ColoredLine } from "./utils/common";

import type { User } from "./rpc/model";

import { AuthService } from "./rpc/auth";

import DatabaseView from "./component/database/databaseView";

import AdminEditor from "./component/admineditor/adminEditor";
import LoginForm from "./component/loginform/loginForm";
import FlowchartUserMode from "./component/flowchartusermode/flowchartUserMode";

export default function App() {
  const [projectTabSelect, setProjectTabSelect] = useState<boolean>(false);
  const [databaseTabSelect, setDatabaseTabSelect] = useState<boolean>(true);

  const [editFlowchartTabSelect, setEditFlowchartTabSelect] = useState<boolean>(false);
  const [userFlowchartTabSelect, setUserFlowchartTabSelect] = useState<boolean>(false);
  const [adminTabSelect, setAdminTabSelect] = useState<boolean>(false);

  const [user, setUser] = useState<?User>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAdminRights, setIsAdminRights] = useState<boolean>(false);

  const [errorLogin, setErrorLogin] = useState<string>("");

  const [isReset, setIsReset] = useState<boolean>(false);

  const [filterTemplate, setFilterTemplate] = useState<string>("");
  const [filterSubItem, setFilterSubItem] = useState<string>("");
  const [watermark, setWaterMark] = useState<string>("");
  const [infoURL, setInfoURL] = useState<?any>({ user: "", db: "", component: "", flow: "" });

  useEffect(() => {
    if (window.sessionStorage.getItem("ndeWhiz-Template") !== null) { 
        window.sessionStorage.removeItem("ndeWhiz-Template");
    }
    const obj = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
         key = decodeURIComponent(key);
         value = decodeURIComponent(value);
         obj[key] = value;
    });
    if (obj.user !== undefined && obj.db !== undefined && obj.component !== undefined && obj.flow !== undefined) {
      setInfoURL(obj);
    }
    setWaterMark("NDEWHIZ Proprietary");
    async function fetchMe() {
    try {
      if (window.sessionStorage.getItem("ndeWhiz-Template") !== null) { 
        window.sessionStorage.removeItem("ndeWhiz-Template");
      }
      const resp = await new AuthService(apiEndpoint()).me();
      setUser(resp.user);
      setIsAdmin(resp.isAdmin);
      if (!resp.isAdmin && resp.user != null) {
       if (resp.user.id !== "" && resp.user.data !== "") {
        const obj = JSON.parse(resp.user.data);
        if (obj.opt !== undefined) {
         if (obj.opt[0].P2 === "Disable") {
           setProjectTabSelect(false);
           setEditFlowchartTabSelect(false);
           setUserFlowchartTabSelect(true);
           setAdminTabSelect(false);
           setIsAdminRights(false);

         }
         if (obj.opt[0].P2 === "Enable") {
           setProjectTabSelect(false);
           setEditFlowchartTabSelect(true);
           setUserFlowchartTabSelect(false);
           setAdminTabSelect(false);
           setIsAdminRights(true);
         }
         setFilterTemplate(obj.opt[0].P4);
         setFilterSubItem(obj.opt[0].P5);
       }
       }
      }
      setIsReset(true);
    } catch (err) {
     setErrorLogin("Contact System Administrator: Database Server Down");
    }

    }
    fetchMe();
  }, []);

  function onClickProjectTab() {
    setProjectTabSelect(true);
    setDatabaseTabSelect(false);
    setEditFlowchartTabSelect(false);
    setUserFlowchartTabSelect(false);
    setAdminTabSelect(false);
  }

  function onClickDatabaseTab() {
    setProjectTabSelect(false);
    setDatabaseTabSelect(true);
    setEditFlowchartTabSelect(false);
    setUserFlowchartTabSelect(false);
    setAdminTabSelect(false);
  }


  function onClickEditFlowchartTab() {
    setProjectTabSelect(false);
    setDatabaseTabSelect(false);
    setEditFlowchartTabSelect(true);
    setUserFlowchartTabSelect(false);
    setAdminTabSelect(false);
  }

  function onClickUserFlowchartTab() {
    setProjectTabSelect(false);
    setDatabaseTabSelect(false);
    setEditFlowchartTabSelect(false);
    setUserFlowchartTabSelect(true);
    setAdminTabSelect(false);
  }


  function onClickAdminTab() {
    setProjectTabSelect(false);
    setDatabaseTabSelect(false);
    setEditFlowchartTabSelect(false);
    setUserFlowchartTabSelect(false);
    setAdminTabSelect(true);
  }

  async function LoginUpdate() {
    const obj = {};

    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
         key = decodeURIComponent(key);
         value = decodeURIComponent(value);
         obj[key] = value;
    });
    if (obj.user !== undefined && obj.db !== undefined && obj.component !== undefined && obj.flow !== undefined) {
      setInfoURL(obj);
    }
    setWaterMark("NDEWHIZ Proprietary");
    const resp = await new AuthService(apiEndpoint()).me();
    setUser(resp.user);
    setIsAdmin(resp.isAdmin);
    if (!resp.isAdmin && resp.user != null) {
       if (resp.user.id !== "" && resp.user.data !== "") {
        const obj = JSON.parse(resp.user.data);
        if (obj.opt !== undefined) {
         if (obj.opt[0].P2 === "Disable") {
           setProjectTabSelect(false);
           setEditFlowchartTabSelect(false);
           setUserFlowchartTabSelect(true);
           setAdminTabSelect(false);
           setIsAdminRights(false);

         }
         if (obj.opt[0].P2 === "Enable") {
           setProjectTabSelect(false);
           setEditFlowchartTabSelect(true);
           setUserFlowchartTabSelect(true);
           setAdminTabSelect(false);
           setIsAdminRights(true);
         }
         setFilterTemplate(obj.opt[0].P4);
         setFilterSubItem(obj.opt[0].P5);
       }
      }
    }
    setIsReset(true);
  }

 async function onClickLogout() {
    await new AuthService(apiEndpoint()).logout();
    setUser({ id: "", name: "", data: "", createdAt: "" });
    const resp = await new AuthService(apiEndpoint()).me();
    setUser(resp.user);
    setIsAdmin(resp.isAdmin);
    setIsReset(false);
    setProjectTabSelect(true);
    setEditFlowchartTabSelect(false);
    setUserFlowchartTabSelect(false);
    setAdminTabSelect(false);
  }

  function onClickUserManual() {
    const extendedURL = apiEndpoint() + "/static/UserManual.pdf"; 
    window.open(extendedURL, "_blank");
  }

  return <div className={styles.root}>

  <ColoredBar color={"grey"} height= {"20px"} />
 
   <div class="col-md-12 text-right">
      <img className= {styles.logo_img} src= {apiEndpoint() + logo} alt="logo_image" />
      <h6 className={styles.textlogospace}>{TabConfig.name} ({TabConfig.version})</h6>
      { user != null && user.id !== "" &&
        <div className={styles.textspace}>
          <h6 ><span style={{ marginLeft: "5%" }}><Button variant={TabConfig.color} size="sm" onClick={() => onClickUserManual()}>User Manual</Button></span><span style={{ marginLeft: "5%" }}><i>email : {TabConfig.email}</i></span></h6>
          <h6 style={{ marginTop: "-1%" }}> {user.name} <span><Button size="sm" variant="danger" onClick={() => onClickLogout()} >Logout</Button></span></h6>
        </div>
      }

      { user != null && user.id === "" &&
        <div className={styles.textspace}>
          <i>email : {TabConfig.email}</i>
          <h6 >{""} <span><Button size="sm" variant="danger" disabled={true} >Login</Button></span></h6>
        </div>
      }
  
   </div>
   <div >
    
     <Form style={{ marginLeft: "5%", marginRight: "5%" }}>
        <Form.Row>
         { isAdmin === true && <>
          <Col>
            <Button variant={TabConfig.color} size="sm" block disabled={databaseTabSelect} onClick={() => onClickDatabaseTab()}>
            {"Home"}
            </Button>
          </Col>
        
        
              <Col>
            <Button variant={TabConfig.color} size="sm" block disabled={userFlowchartTabSelect} onClick={() => onClickUserFlowchartTab()}>
             {"Flow Viewer"}
            </Button>
          </Col>

          <Col>
            <Button variant={TabConfig.color} size="sm" block disabled={adminTabSelect} onClick={() => onClickAdminTab()}>
            Admin
            </Button>
          </Col>
           
         </> }

         { isAdmin === false && isAdminRights === true && <>

          <Col>
            <Button variant={TabConfig.color} size="sm" block disabled={userFlowchartTabSelect} onClick={() => onClickUserFlowchartTab()}>
             {"Flow Viewer"}
            </Button>
          </Col>


         </> }

        </Form.Row>
      </Form> 
  <ColoredLine newColor={"grey"} />
  </div>

  <div className={styles.background}>
  <p className={styles.bgtext}>{watermark}</p>
  </div>
  
  <div style={{ marginLeft: "2%", marginRight: "2%" }} >
    
    { user != null && user.id === "" && <LoginForm admin = {isAdmin} onSubmit={LoginUpdate}/>}

    { user != null && user.id !== "" && <div>


    { isReset === true && databaseTabSelect === true && isAdmin === true &&
        <div style={{ marginTop: "10px" }}>
          <DatabaseView isAdmin = {isAdmin} filterTemplate={filterTemplate}/>
        </div>
    }


    { isReset === true && userFlowchartTabSelect === true && (isAdmin === true || isAdminRights === true) &&
        <div style={{ marginTop: "10px" }}>
          <FlowchartUserMode isAdmin ={isAdmin || isAdminRights} filterTemplate = {filterTemplate} filterSubItem={filterSubItem} infoURL={infoURL}/>
        <div class="text-center" style={{ color: "red", marginTop: "50px" }}> 
        </div>

        </div>

    }

    { isReset === true && adminTabSelect === true && isAdmin === true && 
        <div style={{ marginTop: "10px" }}>
          <AdminEditor />
        </div>
    }


    { isReset === true && userFlowchartTabSelect === true && (isAdmin === false && isAdminRights === false) &&
        <div style={{ marginTop: "10px" }}>
          <FlowchartUserMode isAdmin={isAdmin} filterTemplate={filterTemplate} filterSubItem={filterSubItem} infoURL={infoURL}/>
        <div class="text-center" style={{ color: "red", marginTop: "50px" }}>
        </div>

        </div>

    }
     </div>
   }
    </div>
  { errorLogin !== "" &&
       <h6 class="text-center" style={{ color: "red", marginTop: "50px" }}>{errorLogin}</h6>
  }
  </div>;
}