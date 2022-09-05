import React, { useState } from "react";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import { Row, Input, Button, Typography, Divider, Form } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import "./Login.css";

import { setToken, setLocation } from "../../services/user";
import {
  successNotification,
  errorNotification,
} from "../../services/messages.js";

const logo = require("../../assets/images/logo.png");
const { Text } = Typography;

const Login = () => {
  const [nav, setNav] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = (values) => {
    setLoading(true);

    axios
      .post("/login/auth", values)
      .then((res) => {
        console.log(res.data);
        setLoading(false);
        setToken(res.data.token);
        setNav("/home");
        successNotification("Seja Bem-vindo ao Alerta Brumadinho!");
      })
      .catch((error) => {
        setLoading(false);
        errorNotification();
      });
  };

  const accessWithoutRegistration = () => {
    successNotification("Seja Bem-vindo ao Alerta Brumadinho!");
    setToken("externalUser");
    setLocation({ uf: "MG", city: "Brumadinho" });
    setNav("/home");
  };

  if (nav) {
    return <Redirect to={nav} />;
  }

  return (
    <div className="home-container">
      <div className="left-container">
        <div className="layer-background"></div>

        <div className="home-header">
          <h1>Alerta Brumadinho</h1>
          <p>
            Um sistema para denúncias de crimes ambientais! Denuncie, acompanhe,
            interaja.
          </p>
        </div>

        <div className="home-footer">
          <p>É um Órgão Público?</p>
          <Button type="primary" className="teste" size="large" block>
            <Link to="/register/publicAgency">Solicitar cadastro</Link>
          </Button>
        </div>
      </div>

      <div className="right-container">
        <div className="right-content">
          <Row justify="center">
            <img src={logo} className="logo" alt="Alerta Brumadinho" />
          </Row>

          <Divider plain>
            <Text type="secondary" style={{ fontSize: "16px" }}>
              Entrar no Alerta Brumadinho
            </Text>
          </Divider>

          <Form
            name="info"
            layout="vertical"
            style={{ width: "100%" }}
            hideRequiredMark
            initialValues={{ remember: true }}
            onFinish={login}
          >
            <Form.Item
              name="email"
              validateFirst
              rules={[
                {
                  whitespace: true,
                  message: "Por favor, insira um e-mail válido!",
                },
                {
                  required: true,
                  message: "Por favor, insira seu e-mail!",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="E-mail"
                maxLength={40}
                prefix={<UserOutlined style={{ color: "#338221" }} />}
              />
            </Form.Item>

            <Form.Item
              name="password"
              validateFirst
              rules={[
                {
                  whitespace: true,
                  message: "Sua senha não deve conter espaços!",
                },
                {
                  required: true,
                  message: "Por favor, insira sua senha!",
                },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Senha"
                prefix={<LockOutlined style={{ color: "#338221" }} />}
              />
            </Form.Item>

            <Form.Item>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                size="large"
                block
              >
                Entrar
              </Button>
            </Form.Item>
          </Form>

          <Divider plain>
            <Text type="secondary" style={{ fontSize: "16px" }}>
              Não quer se cadastrar?
            </Text>
          </Divider>

          <Button
            type="primary"
            onClick={accessWithoutRegistration}
            size="large"
            block
          >
            Acessar sem cadastro
          </Button>

          <Divider plain>
            <Text type="secondary" style={{ fontSize: "16px" }}>
              Ou cadastre-se gratuitamente!
            </Text>
          </Divider>

          <Row justify="center">
            <Button size="large" className="secondary-button" block>
              <Link to="/register/resident">Cadastrar</Link>
            </Button>
          </Row>

          <Row justify="center" style={{ margin: "30px 0" }}>
            <Link
              to="/forgot"
              style={{ textDecoration: "underline", fontSize: "16px" }}
            >
              Esqueceu sua Senha? Recuperar!
            </Link>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Login;
