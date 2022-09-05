import { Card, Skeleton } from "antd";
import axios from "axios";
import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Denunciation from "../../components/Denunciation/Denunciation";
import Navbar from "../../components/Navbar/Navbar";

import { CheckCircleOutlined } from "@ant-design/icons";

import { errorNotification } from "../../services/messages";
import {
  isAnExternalUser,
  getLocation,
  getUserFromDb,
  getToken,
} from "../../services/user";

const MyDenunciations = (props) => {
  const [loggedUser, setLoggedUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const [denunciations, setDenunciations] = useState(null);
  const [hasMoreDenunciations, setHasMoreDenunciations] = useState(true);
  const [loadingDenunciations, setLoadingDenunciations] = useState(true);

  const fetchData = () => {
    axios
      .get(
        `/denunciations/fromEmail/${loggedUser.email}&created&-1/${
          denunciations[denunciations.length - 1].created
        }/${denunciations[denunciations.length - 1]._id}`,
        {
          headers: { token: getToken() },
        }
      )
      .then((res) => {
        console.log(res.data);
        console.log(userLocation);
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
    if (loggedUser) {
      console.log(loggedUser.email);
      axios
        .get(`/denunciations/fromEmail/${loggedUser.email}&created&-1`, {
          headers: { token: getToken() },
        })
        .then((res) => {
          console.log(res.data);
          setDenunciations(res.data);
          setLoadingDenunciations(false);
        })
        .catch((error) => {
          errorNotification();
        });
    }
  }, [loggedUser]);

  useEffect(() => {
    if (isAnExternalUser()) setUserLocation(getLocation());
    else {
      getUserFromDb().then((result) => {
        setUserLocation({ uf: result.uf, city: result.city });
        setLoggedUser(result);
      });
    }
  }, []);

  return (
    <div className="main-layout">
      <Navbar menuOption="audit" />

      <div className="main-layout-content">
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
      </div>
    </div>
  );
};

export default MyDenunciations;
