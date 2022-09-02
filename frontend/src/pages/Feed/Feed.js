import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import { Button, Select, Skeleton, Card } from "antd";
import { PlusOutlined, CheckCircleOutlined } from "@ant-design/icons";

import axios from "axios";

import Navbar from "../../components/Navbar/Navbar";
import Denunciation from "../../components/Denunciation/Denunciation";

import { errorNotification } from "../../services/messages";
import {
  isAnExternalUser,
  getLocation,
  getUserFromDb,
} from "../../services/user";

import "./Feed.css";

const { Option } = Select;

const Feed = (props) => {
  const [nav, setNav] = useState(null);
  const [denunciations, setDenunciations] = useState(null);
  const [hasMoreDenunciations, setHasMoreDenunciations] = useState(true);
  const [loadingDenunciations, setLoadingDenunciations] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [loggedUser, setLoggedUser] = useState(null);
  const [orderBy, setOrderBy] = useState("created"); // Default denunciations order: by date / recent first

  const createDenunciation = () => {
    setNav("/createDenunciation");
  };

  const fetchData = () => {
    axios
      .get(
        `/denunciations/fromCity/${userLocation.uf}&${
          userLocation.city
        }&${orderBy}&-1/${denunciations[denunciations.length - 1].created}/${
          denunciations[denunciations.length - 1]._id
        }`
      )
      .then((res) => {
        console.log(res.data);
        setDenunciations(denunciations.concat(res.data));

        if (!res.data.length) {
          setHasMoreDenunciations(false);
        }
      })
      .catch((error) => {
        errorNotification();
      });
  };

  useEffect(() => {
    if (userLocation) {
      axios
        .get(
          `/denunciations/fromCity/${userLocation.uf}&${userLocation.city}&${orderBy}&-1`
        )
        .then((res) => {
          console.log(res.data);
          setDenunciations(res.data);
          setLoadingDenunciations(false);
        })
        .catch((error) => {
          errorNotification();
        });
    }
  }, [userLocation, orderBy]);

  useEffect(() => {
    if (isAnExternalUser()) setUserLocation(getLocation());
    else {
      getUserFromDb().then((result) => {
        setUserLocation({ uf: result.uf, city: result.city });
        setLoggedUser(result);
      });
    }
  }, []);

  if (nav) return <Redirect to={nav} />;
  else {
    return (
      <div className="main-layout">
        <Navbar menuOption="feed" />
        <div className="main-layout-content">
          <div className="order-by-container">
            <div>Ordenar por: </div>
            <Select
              defaultValue="created"
              bordered={false}
              style={{ fontWeight: "bold" }}
              onChange={() => {
                setOrderBy(orderBy === "created" ? "relevance" : "created");
              }}
            >
              <Option value="created">Mais recentes</Option>
              <Option value="relevance">Mais relevantes</Option>
            </Select>
          </div>

          {loadingDenunciations ? (
            <div>
              <Skeleton
                className="skeleton-container"
                active={true}
                avatar={true}
                paragraph={{ rows: 8 }}
                round={true}
                title={true}
              />

              <Skeleton
                className="skeleton-container"
                active={true}
                avatar={true}
                paragraph={{ rows: 8 }}
                round={true}
                title={true}
              />

              <Skeleton
                className="skeleton-container"
                active={true}
                avatar={true}
                paragraph={{ rows: 8 }}
                round={true}
                title={true}
              />
            </div>
          ) : (
            <InfiniteScroll
              dataLength={denunciations.length}
              next={fetchData}
              hasMore={hasMoreDenunciations}
              loader={
                <Skeleton
                  className="skeleton-container"
                  active={true}
                  avatar={true}
                  paragraph={{ rows: 8 }}
                  round={true}
                  title={true}
                />
              }
              endMessage={
                <Card className="that-is-call-card">
                  Isso é tudo! &nbsp;
                  <CheckCircleOutlined style={{ color: "#338221" }} />
                </Card>
              }
            >
              {denunciations?.map((d) => {
                return (
                  <Denunciation
                    key={d._id}
                    denunciation={d}
                    loggedUser={loggedUser}
                    showLikesSection={true}
                    showResidentsCommentsSection={true}
                    showPublicAgenciesCommentsSection={true}
                  />
                );
              })}
            </InfiniteScroll>
          )}

          <Button
            type="primary"
            size="large"
            onClick={createDenunciation}
            className="create-denunciation-button"
          >
            <PlusOutlined /> Registrar Denúncia
          </Button>
        </div>
      </div>
    );
  }
};

export default Feed;
