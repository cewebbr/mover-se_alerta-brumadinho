import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Input, Modal, Select } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { getUserFromDb, getToken } from "../../services/user";
import {
  errorNotification,
  successNotification,
} from "../../services/messages";

import Navbar from "../../components/Navbar/Navbar";
import Denunciation from "../../components/Denunciation/Denunciation";

import "./Audit.css";

const { Option } = Select;

const Audit = (props) => {
  const [nav, setNav] = useState(null);
  const [user, setUser] = useState(null);
  const [unverifiedDenunciations, setUnverifiedDenunciations] = useState(null);
  const [isDiscardModalVisible, setIsDiscardModalVisible] = useState(false);
  const [discardReason, setDiscardReason] = useState("Xingamento");
  const [otherReason, setOtherReason] = useState("");

  const handleOtherReasonInput = (e) => {
    setOtherReason(e.target.value);
  };

  const showDiscardModal = () => {
    setIsDiscardModalVisible(true);
  };

  const closeDiscardModal = () => {
    setIsDiscardModalVisible(false);
    setDiscardReason("Xingamento");
  };

  const handleDiscardReason = (value) => {
    setDiscardReason(value);
  };

  const getUnverifiedDenunciations = () => {
    axios
      .get(
        `/denunciations/fromStatusAndCity/unverified&MG&Brumadinho&created&-1`,
        {
          headers: { token: getToken() },
        }
      )
      .then((res) => {
        setUnverifiedDenunciations(res.data);
      })
      .catch((error) => {
        errorNotification();
      });
  };

  const approveDenunciation = (denunciation) => {
    axios
      .put(
        `/denunciations/auditor/${denunciation._id}`,
        { status: "accepted" },
        {
          headers: { token: getToken() },
        }
      )
      .then((res) => {
        getUnverifiedDenunciations();
        successNotification("Denúncia aprovada com sucesso!");
      })
      .catch((error) => {
        errorNotification();
      });
  };

  const discardDenunciation = (denunciation) => {
    console.log(discardReason);
    axios
      .put(
        `/denunciations/auditor/${denunciation._id}`,
        {
          status: "rejected",
          rejection_reason:
            discardReason === "Outro" ? otherReason : discardReason,
        },
        {
          headers: { token: getToken() },
        }
      )
      .then((res) => {
        getUnverifiedDenunciations();
        closeDiscardModal();
        successNotification("Denúncia descartada com sucesso!");
      })
      .catch((error) => {
        errorNotification();
      });
  };

  useEffect(() => {
    getUserFromDb().then((result) => {
      if (result.type !== "auditor") {
        setNav("/feed");
      } else {
        setUser(result);
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      getUnverifiedDenunciations();
    }
  }, [user]);

  if (nav) return <Redirect to={nav} />;
  else {
    return (
      <div className="main-layout">
        <Navbar menuOption="audit" />

        <div className="main-layout-content">
          {unverifiedDenunciations?.map((d) => (
            <div key={d._id}>
              <Denunciation
                denunciation={d}
                showAuditButtons={true}
                showLikesSection={false}
                showCommentsSection={false}
                approveDenunciationFunction={() => approveDenunciation(d)}
                discardDenunciationFunction={() => showDiscardModal(d)}
              />

              <Modal
                title={
                  <b>
                    <DeleteOutlined style={{ color: "#ff4d4d" }} /> {d.title}
                  </b>
                }
                visible={isDiscardModalVisible}
                onOk={() => discardDenunciation(d)}
                onCancel={() => closeDiscardModal()}
                cancelText="Cancelar"
                okButtonProps={{ disabled: discardReason ? false : true }}
                okText="Confirmar"
              >
                <div style={{ marginBottom: "6px" }}>
                  Selecione o motivo do descarte desta denúncia:
                </div>

                <Select
                  style={{ width: "80%" }}
                  onChange={handleDiscardReason}
                  value={discardReason}
                  defaultValue={1}
                >
                  <Option value="Xingamento">Xingamento</Option>
                  <Option value="Discurso de ódio">Discurso de ódio</Option>
                  <Option value="Conteúdo inapropriado">
                    Conteúdo inapropriado
                  </Option>
                  <Option value="Outro">Outro</Option>
                </Select>

                {discardReason === "Outro" ? (
                  <Input
                    className="other-reason-field"
                    placeholder="Especifique o motivo..."
                    value={otherReason}
                    onChange={(e) => handleOtherReasonInput(e)}
                  />
                ) : null}
              </Modal>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default Audit;
