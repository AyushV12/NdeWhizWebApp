// @flow strict
// Copyright (C) 2022 Deep Skills Inc., - All Rights Reserved
// Unauthorized copying of this file, via any medium is strictly prohibited
// Proprietary and confidential

import React, { useState } from "react";
import styles from "./loginForm.module.css";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { TabConfig } from "../../config/config";

import { apiEndpoint } from "../../utils/common";

import { AuthService } from "../../rpc/auth";

type LoginProps = {
 admin:bool,
 onSubmit: () => Promise<void>;
};

export default function LoginForm(props: LoginProps) {
  const [login, setLogin] = useState<string>(""); 
  const [password, setPassword] = useState<string>("");
  const [errorLogin, setErrorLogin] = useState<string>("");

  async function onClickAdminLogin() {
    await new AuthService(apiEndpoint()).addAdmin({ password: password });
    props.onSubmit();
  }

  async function onClickLogin() {
    try {
     await new AuthService(apiEndpoint()).login({ name: login, password: password });
     props.onSubmit();
    } catch (err) {
     setPassword("");
     setErrorLogin("Login failed,try Re-login with correct User Name and Password");
    }
  }

  async function handleLoginChange(e: SyntheticKeyboardEvent<HTMLInputElement>) {
    if (errorLogin !== "") {
      setErrorLogin("");
    }
    setLogin(e.currentTarget.value);
  }

  async function handlePasswordChange(e: SyntheticKeyboardEvent<HTMLInputElement>) {
   if (errorLogin !== "") {
      setErrorLogin("");
    }
    setPassword(e.currentTarget.value);
  }

  return <div className={styles.root}>

    { props.admin === true &&
    <Form>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Login Name</Form.Label>
        <Form.Control autoComplete="none" type="text" placeholder="admin" disabled />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control autoComplete="none" type="password" placeholder="Password" onChange={handlePasswordChange} />
      </Form.Group>
      <Button variant={TabConfig.color} disabled={password === "" } onClick={() => onClickAdminLogin()}>
      Submit
      </Button> 
    </Form>
    }

    { props.admin === false &&
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Login Name</Form.Label>
          <Form.Control autoComplete="none" value= {login} type="text" placeholder="Enter Login Name" onChange={handleLoginChange}/>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control autoComplete="none" value={password } type="password" placeholder="Password" onChange={handlePasswordChange} />
        </Form.Group>
        <Button variant={TabConfig.color} disabled={login === "" || password === "" } onClick={() => onClickLogin()}>
        Submit 
        </Button>
      </Form>
    }
     { errorLogin !== "" &&
       <h6 class="text-center" style={{ color: "red" }}>{errorLogin}</h6>
     }

  </div>;
}

