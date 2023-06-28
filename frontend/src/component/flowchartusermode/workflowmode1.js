// @flow strict
// Copyright (C) 2022 Deep Skills Inc., - All Rights Reserved
// Unauthorized copying of this file, via any medium is strictly prohibited
// Proprietary and confidential

import React, { useEffect } from "react";
import styles from "./workflowmode1.module.css";

type WorkFlowMode1Props = {
isAdmin : boolean,
filterTemplate: string,
data: Array<>,
};

export default function WorkFlowMode1(props: WorkFlowMode1Props) {
  useEffect(() => {
    async function admin() {
       
    }
    admin();
  }, []);

  useEffect(() => {
    async function fetchMe() {
    }
    fetchMe();
    
  }, []);


  return <div className={styles.root}>
   <h6 style={{ fontSize: "small", marginTop: "50px", textAlign: "center", color: "red" }}>Under Development Mode 1</h6>     

  </div>;
}

