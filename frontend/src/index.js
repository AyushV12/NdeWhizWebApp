// @flow strict
// Copyright (C) 2022 Deep Skills Inc., - All Rights Reserved
// Unauthorized copying of this file, via any medium is strictly prohibited
// Proprietary and confidential


import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import "./assets/font-awesome-4.7.0/css/font-awesome.min.css";
import App from "./App";
import { setApiEndpoint } from "./utils/common";

setApiEndpoint(window.apiEndpoint);

const root = document.getElementById("root");

if (root !== null) {
  ReactDOM.render(<App />, root);
}

