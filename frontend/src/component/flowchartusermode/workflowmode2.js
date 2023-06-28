// @flow strict
// Copyright (C) 2022 Deep Skills Inc., - All Rights Reserved
// Unauthorized copying of this file, via any medium is strictly prohibited
// Proprietary and confidential

import React, { useEffect } from "react";
import styles from "./workflowmode2.module.css";

type WorkFlowMode2Props = {
isAdmin : boolean,
filterTemplate: string,
data: Array<>,
};

export default function WorkFlowMode2(props: WorkFlowMode2Props) {
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
   <h6 style={{ fontSize: "small", marginTop: "50px", textAlign: "center", color: "red" }}>Under Development Mode 2</h6>     

  </div>;
}

