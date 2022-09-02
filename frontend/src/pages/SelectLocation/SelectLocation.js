import React, { useState, useEffect } from "react";
import axios from "axios";
import { Redirect, Link } from "react-router-dom";
import { Row, Col, Form, Button, Select, Card, Typography } from "antd";
import { LeftOutlined } from "@ant-design/icons";

import "./SelectLocation.css";

import { setToken, setLocation } from "../../services/user";
import {
  successNotification,
  errorNotification,
} from "../../services/messages";

const { Option } = Select;
const { Title, Text } = Typography;
const logo = require("../../assets/images/logo.png");

const SelectLocation = () => {
  const [ufs, setUfs] = useState([]);
  const [selectedUf, setSelectedUf] = useState({ key: null, value: null });
  const [cities, setCities] = useState([]);

  const [ufsLoading, setUfsLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);

  const [nav, setNav] = useState(null);

  useEffect(() => {
    setUfsLoading(true);

    axios
      .get("https://servicodados.ibge.gov.br/api/v1/localidades/estados/")
      .then((res) => {
        setUfsLoading(false);
        setUfs(res.data.sort((a, b) => a.sigla.localeCompare(b.sigla)));
      })
      .catch((error) => {
        setUfsLoading(false);
        errorNotification(
          "Erro ao carregar a lista de estados do Brasil. Por favor, atualize a página!"
        );
      });
  }, []);

  useEffect(() => {
    setCitiesLoading(true);

    axios
      .get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf.key}/municipios`
      )
      .then((res) => {
        setCitiesLoading(false);
        setCities(res.data);
      })
      .catch((error) => {
        setCitiesLoading(false);
        errorNotification(
          "Erro ao carregar a lista de municípios deste estado. Por favor, atualize a página!"
        );
      });
  }, [selectedUf]);

  const submitSelectedCity = (values) => {
    successNotification("Seja Bem-vindo ao Alerta Brumadinho!");
    setToken("externalUser");
    setLocation(values);
    setNav("/home");
  };

  if (nav) return <Redirect to={nav} />;
  else {
    return (
      <div className="card-container">
        <Card className="card-box" bordered={false}>
          <Row justify="center" gutter={16} style={{ paddingBottom: "16px" }}>
            <Col span={4} style={{ alignSelf: "center" }}>
              <Button shape="circle">
                <Link to="/">
                  <LeftOutlined />
                </Link>
              </Button>
            </Col>

            <Col span={6} style={{ textAlign: "right" }}>
              <img src={logo} className="logo-small" alt="Alerta Brumadinho" />
            </Col>

            <Col
              span={14}
              style={{
                borderLeft: "1px solid #f0f0f0",
                alignSelf: "center",
              }}
            >
              <Title type="secondary" level={3} style={{ margin: "0px" }}>
                Selecionar Município
              </Title>
            </Col>
          </Row>

          <Text
            type="secondary"
            style={{
              fontSize: "16px",
              textAlign: "center",
              width: "100%",
              display: "block",
            }}
          >
            Selecione o Estado e o Município que deseja acessar.
          </Text>

          {/* Form */}
          <Row justify="center" style={{ marginTop: "32px" }}>
            <Form
              name="info"
              layout="vertical"
              style={{ width: "100%" }}
              initialValues={{ remember: true }}
              onFinish={submitSelectedCity}
            >
              {/* UF */}
              <Form.Item
                label="Estado:"
                name="uf"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Por favor, selecione um estado!",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="MG - Minas Gerais"
                  getPopupContainer={(trigger) => trigger.parentElement}
                  optionFilterProp="children"
                  loading={ufsLoading}
                  size="large"
                  notFoundContent={<div> Nenhum Estado </div>}
                  filterOption={true}
                  onSelect={(value, option) => setSelectedUf(option)}
                >
                  {ufs.map((uf) => (
                    <Option key={uf.id} value={uf.sigla}>
                      {uf.sigla} - {uf.nome}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* City */}
              <Form.Item
                label="Município:"
                name="city"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Por favor, selecione um município!",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Brumadinho"
                  getPopupContainer={(trigger) => trigger.parentElement}
                  optionFilterProp="children"
                  loading={citiesLoading}
                  size="large"
                  notFoundContent={<div> Nenhum Município </div>}
                  filterOption={true}
                >
                  {cities.map((city) => (
                    <Option key={city.id} value={city.nome}>
                      {city.nome}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Submit Button */}
              <Form.Item style={{ marginBottom: "0", paddingTop: "16px" }}>
                <Button type="primary" htmlType="submit" size="large" block>
                  Selecionar
                </Button>
              </Form.Item>
            </Form>
          </Row>
        </Card>
      </div>
    );
  }
};

export default SelectLocation;
