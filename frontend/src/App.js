import React from "react";
import axios from "axios";
import { Switch, Route, Redirect } from "react-router-dom";
import { getToken } from "./services/user";
import { BACKEND_URL } from "./services/consts";

import "./App.less";

import Login from "./pages/Login/Login";
import Feed from "./pages/Feed/Feed";
import Audit from "./pages/Audit/Audit";
import Search from "./pages/Search/Search";
import RegisterResident from "./pages/Register/RegisterResident/RegisterResident";
import RegisterPublicAgency from "./pages/Register/RegisterPublicAgency/RegisterPublicAgency";
import ForgotPassword from "./pages/Password/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/Password/ResetPassword/ResetPassword";
import CreateDenunciation from "./pages/CreateDenunciation/CreateDenunciation";
import MyDenunciations from "./pages/MyDenunciations/MyDenunciations";

axios.defaults.baseURL = BACKEND_URL;

function App() {
  return (
    <Switch>
      <Route
        path="/"
        exact
        render={() => (getToken() ? <Redirect to="/feed" /> : <Login />)}
      />

      <Route
        path="/feed"
        exact
        render={(props) =>
          getToken() ? <Feed {...props} /> : <Redirect to="/" />
        }
      />

      <Route
        path="/search"
        exact
        render={(props) =>
          getToken() ? <Search {...props} /> : <Redirect to="/" />
        }
      />

      <Route
        path="/createDenunciation"
        exact
        render={(props) =>
          getToken() ? <CreateDenunciation {...props} /> : <Redirect to="/" />
        }
      />

      <Route
        path="/my-denunciations"
        exact
        render={(props) =>
          getToken() ? <MyDenunciations {...props} /> : <Redirect to="/" />
        }
      />

      <Route
        path="/audit"
        exact
        render={(props) =>
          getToken() ? <Audit {...props} /> : <Redirect to="/" />
        }
      />

      <Route
        path="/register/resident"
        exact
        render={() =>
          getToken() ? <Redirect to="/feed" /> : <RegisterResident />
        }
      />

      <Route
        path="/register/publicAgency"
        exact
        render={() =>
          getToken() ? <Redirect to="/feed" /> : <RegisterPublicAgency />
        }
      />

      {/* This section is commented because we decided to enable denunciations only for Brumadinho - MG at 
      the moment. In future, if the application scale to cover other cities, it's possible to uncomment this piece
      of code that redirects to the page for user selecting UF and City (to access without registration).
      */}

      {/* <Route
        path="/selectLocation"
        render={() =>
          getToken() ? <Redirect to="/feed" /> : <SelectLocation />
        }
      /> */}

      <Route
        path="/forgot"
        exact
        render={() =>
          getToken() ? <Redirect to="/feed" /> : <ForgotPassword />
        }
      />

      <Route
        path="/reset/:token"
        render={(props) =>
          getToken() ? <Redirect to="/feed" /> : <ResetPassword {...props} />
        }
      />

      <Route path="/*">
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}

export default App;
