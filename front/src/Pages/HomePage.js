import React, { useCallback, useContext, useEffect, useState } from "react";
import List from "./List/index";
import Search from "./Search/index";
import Todo from "./Todo/index";
import { UserContext } from "../Context/UserContext";
import "./HomePage.css";
import axios from "axios";
import { Layout, Tabs } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;
const { Header, Content } = Layout;

const Welcome = () => {
  const [todoList, setTodoList] = useState([]);
  const [userContext, setUserContext] = useContext(UserContext);

  const fetchUserDetails = useCallback(() => {
    fetch(process.env.REACT_APP_API_ENDPOINT + "users/me", {
      method: "GET",
      credentials: "include",
      // Pass authentication token as bearer token in header
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        setUserContext((oldValues) => {
          return { ...oldValues, details: data };
        });
      } else {
        if (response.status === 401) {
          // Edge case: when the token has expired.
          // This could happen if the refreshToken calls have failed due to network error or
          // User has had the tab open from previous day and tries to click on the Fetch button
          window.location.reload();
        } else {
          setUserContext((oldValues) => {
            return { ...oldValues, details: null };
          });
        }
      }
    });
  }, [setUserContext, userContext.token]);

  useEffect(() => {
    // fetch only when user details are not present
    if (!userContext.details) {
      fetchUserDetails();
    }
  }, [userContext.details, fetchUserDetails]);

  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get("http://localhost:8081/todos");
      setTodoList(data);
    }
    fetchData();
  }, []);
  const logoutHandler = () => {
    fetch(process.env.REACT_APP_API_ENDPOINT + "users/logout", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(async (response) => {
      setUserContext((oldValues) => {
        return { ...oldValues, details: undefined, token: null };
      });
      window.localStorage.setItem("logout", Date.now());
    });
  };

  return userContext.details === null ? (
    "Error Loading User details"
  ) : !userContext.details ? (
    <p>Chargement...</p>
  ) : (
    <Layout>
      <Header className="head">
        <div>
          Welcome&nbsp;
          <strong>
            {userContext.details.firstName}
            {userContext.details.lastName && " " + userContext.details.lastName}
          </strong>
          !
        </div>
        <h3 className="title">
          MyTrooperS
          <br />
        </h3>
        <div style={{ paddingBottom: "20px" }}>
          <button
            onClick={logoutHandler}
            style={{
              marginLeft: 600,
              marginTop: 20,
              height: 60,
              width: 60,
              borderRadius: 12,
            }}
          >
            <LogoutOutlined />
          </button>
        </div>
      </Header>
      <Content className="content">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Todo" key="1">
            <Todo />
          </TabPane>
          <TabPane tab="List" key="2">
            <List list={todoList} />
          </TabPane>
          <TabPane tab="Search" key="3">
            <Search />
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default Welcome;
