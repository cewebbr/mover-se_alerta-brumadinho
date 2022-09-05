import React, { useState } from "react";
import axios from "axios";
import MaskedInput from "antd-mask-input";
import { Redirect, Link } from "react-router-dom";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Upload,
  message,
  Card,
  Typography,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  SolutionOutlined,
  LoadingOutlined,
  PlusOutlined,
  LeftOutlined,
  LockOutlined,
} from "@ant-design/icons";

import "./RegisterPublicAgency.css";

import {
  successNotification,
  errorNotification,
} from "../../../services/messages";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_URL,
} from "../../../services/consts";

// const { Option } = Select;
const { Title, Text } = Typography;
const logo = require("../../../assets/images/logo.png");

const RegisterPublicAgency = (props) => {
  // const [ufs, setUfs] = useState([]);
  // const [selectedUf, setSelectedUf] = useState({ key: null, value: null });
  // const [cities, setCities] = useState([]);

  // const [ufsLoading, setUfsLoading] = useState(false);
  // const [citiesLoading, setCitiesLoading] = useState(false);

  const [nav, setNav] = useState(null);
  const [submit, setSubmit] = useState({ disabled: false, loading: false });
  const [photo, setPhoto] = useState({
    url: "",
    loading: false,
    file: null,
  });

  /* This section is commented because we decided to enable denunciations only for Brumadinho - MG at 
    the moment. In future, if the application scale to cover other cities, it's possible to uncomment this piece
    of code for user selecting UF and City.
  */

  // useEffect(() => {
  //   setUfsLoading(true);

  //   axios
  //     .get("https://servicodados.ibge.gov.br/api/v1/localidades/estados/")
  //     .then((res) => {
  //       setUfsLoading(false);
  //       setUfs(res.data.sort((a, b) => a.sigla.localeCompare(b.sigla)));
  //     })
  //     .catch((error) => {
  //       setUfsLoading(false);
  //       errorNotification(
  //         "Erro ao carregar a lista de estados do Brasil. Por favor, atualize a página!"
  //       );
  //     });
  // }, []);

  // useEffect(() => {
  //   setCitiesLoading(true);

  //   axios
  //     .get(
  //       `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf.key}/municipios`
  //     )
  //     .then((res) => {
  //       setCitiesLoading(false);
  //       setCities(res.data);
  //     })
  //     .catch((error) => {
  //       setCitiesLoading(false);
  //       errorNotification(
  //         "Erro ao carregar a lista de municípios deste estado. Por favor, atualize a página!"
  //       );
  //     });
  // }, [selectedUf]);

  const beforeUpload = (file) => {
    if (
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.type === "image/png"
    ) {
      return true;
    }

    message.error("Erro! Só é permitido extensões JPG, JPEG ou PNG.");
    return false;
  };

  const uploadImage = ({ file, onSuccess }) => {
    setPhoto({ url: "", file: null, loading: true });
    setSubmit({ disabled: true });

    const formData = new FormData();
    formData.append("api_key", CLOUDINARY_API_KEY);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("file", file);
    formData.append("folder", "institution-pictures");

    axios
      .post(CLOUDINARY_URL, formData, {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      })
      .then((res) => {
        setPhoto({ ...photo, loading: false, url: res.data.secure_url });
        setSubmit({ disabled: false });
      })
      .catch((error) => {
        errorNotification();
      });
  };

  const registerPublicAgency = (values) => {
    setSubmit({ ...submit, loading: true });

    delete values.confirmPassword;
    const cnpj = values.cnpj.replace(/[^0-9]/g, "");
    const phone = values.phone.replace(/[^0-9]/g, "");
    const finalForm = {
      ...values,
      cnpj,
      phone,
      photo: photo.url,
    };

    axios
      .post("/publicAgencies/create", finalForm)
      .then(function (res) {
        successNotification(
          "Sua solicitação foi cadastrada com sucesso! Aguarde que entraremos em contato para validá-la."
        );
        setSubmit({ ...submit, loading: false });
        setNav("/");
      })
      .catch(function (error) {
        if (error.response.status === 400) {
          errorNotification("CNPJ, E-mail ou Telefone já cadastrado.");
        } else {
          errorNotification();
        }

        setSubmit({ ...submit, loading: false });
      });
  };

  if (nav) return <Redirect to={nav} />;
  else {
    return (
      <div className="card-container">
        <Card className="card-box card-register" bordered={false}>
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
                Cadastrar
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
            O e-mail informado no momento do cadastro deve possuir o domínio de
            sua instituição. Por exemplo: contato@brumadinho.mg.gov.br. Caso
            contrário, o cadastro será invalidado.
          </Text>

          {/* Form */}
          <Row justify="center" style={{ marginTop: "24px" }}>
            <Form
              name="info"
              layout="vertical"
              style={{ width: "100%" }}
              initialValues={{ remember: true }}
              onFinish={registerPublicAgency}
            >
              {/* Name */}
              <Form.Item
                style={{ marginTop: "24px" }}
                label="Nome da Instituição:"
                name="name"
                hasFeedback
                rules={[
                  {
                    whitespace: true,
                    message: "Por favor, insira um nome válido!",
                  },
                  {
                    required: true,
                    message: "Por favor, insira o nome da instituição!",
                  },
                ]}
              >
                <Input
                  size="large"
                  maxLength={60}
                  placeholder="Secretaria do Meio Ambiente de Brumadinho"
                  prefix={<UserOutlined />}
                />
              </Form.Item>

              {/* CNPJ */}
              <Form.Item
                label="CNPJ:"
                name="cnpj"
                hasFeedback
                validateFirst
                rules={[
                  {
                    required: true,
                    message: "Por favor, insira um CNPJ!",
                  },
                  {
                    len: 14,
                    message: "Por favor, insira um CNPJ válido!",
                    transform: (value) => {
                      if (!value) {
                        return value;
                      }
                      return value.replace(/[^0-9]/g, "");
                    },
                  },
                ]}
              >
                <MaskedInput
                  mask="11.111.111/1111-11"
                  size="large"
                  maxLength={11}
                  placeholder="12.345.678/9012-34"
                  prefix={<SolutionOutlined />}
                />
              </Form.Item>

              {/* Email */}
              <Form.Item
                label="E-mail da Instituição:"
                name="email"
                hasFeedback
                validateFirst
                rules={[
                  {
                    whitespace: true,
                    message: "Por favor, insira um e-mail válido!",
                  },
                  {
                    type: "email",
                    message: "Por favor, insira um e-mail válido!",
                  },
                  {
                    required: true,
                    message: "Por favor, insira o e-mail da instituição!",
                  },
                ]}
              >
                <Input
                  size="large"
                  maxLength={40}
                  placeholder="emaildainstituicao@email.com"
                  prefix={<MailOutlined />}
                />
              </Form.Item>

              {/* Phone */}
              <Form.Item
                label="Telefone da Instituição:"
                name="phone"
                hasFeedback
                validateFirst
                rules={[
                  {
                    required: true,
                    message: "Por favor, insira o telefone da instituição!",
                  },
                  {
                    len: 11,
                    message: "Por favor, insira um telefone válido!",
                    transform: (value) => {
                      if (!value) {
                        return value;
                      }
                      return value.replace(/[^0-9]/g, "");
                    },
                  },
                ]}
              >
                <MaskedInput
                  mask="(11) 11111-1111"
                  size="large"
                  placeholder="(31) 99999-9999"
                  prefix={<PhoneOutlined />}
                />
              </Form.Item>

              {/* This section is commented because we decided to enable denunciations only for Brumadinho - MG at 
              the moment. In future, if the application scale to cover other cities, it's possible to uncomment this piece
              of code for user selecting UF and City.
              */}

              {/* UF */}
              {/* <Form.Item
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
              </Form.Item> */}

              {/* City */}
              {/* <Form.Item
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
              </Form.Item> */}

              {/* Password */}
              <Form.Item
                label="Senha:"
                name="password"
                hasFeedback
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
                  {
                    min: 8,
                    message: "A senha deve ter no mínimo 8 dígitos!",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  maxLength={20}
                  placeholder="********"
                  prefix={<LockOutlined />}
                />
              </Form.Item>

              {/* Confirm Password */}
              <Form.Item
                label="Confirmar Senha:"
                name="confirmPassword"
                dependencies={["password"]}
                hasFeedback
                validateFirst
                rules={[
                  {
                    whitespace: true,
                    message: "Sua senha não deve conter espaços!",
                  },
                  {
                    required: true,
                    message: "Por favor, confirme sua senha!",
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("As senhas não conferem!");
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  maxLength={20}
                  placeholder="********"
                  prefix={<LockOutlined />}
                />
              </Form.Item>

              {/* Photo */}
              <Form.Item
                name="photo"
                label="Adicione uma foto ou logo da instituição:"
                style={{ width: "100%" }}
              >
                <Upload
                  listType="picture-card"
                  customRequest={uploadImage}
                  beforeUpload={beforeUpload}
                  showUploadList={false}
                >
                  {photo.url ? (
                    <img src={photo.url} alt="Foto" style={{ width: "100%" }} />
                  ) : (
                    <div>
                      {photo.loading ? <LoadingOutlined /> : <PlusOutlined />}
                      <div className="ant-upload-text">
                        {photo.loading ? "Adicionando..." : "Adicionar"}
                      </div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              {/* Submit Button */}
              <Form.Item style={{ marginBottom: "0" }}>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  disabled={submit.disabled}
                  loading={submit.loading}
                  block
                >
                  Solicitar Cadastro
                </Button>
              </Form.Item>
            </Form>
          </Row>
        </Card>
      </div>
    );
  }
};

export default RegisterPublicAgency;
