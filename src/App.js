import "./App.css";
import Nav from "./nav/Nav";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Login from "./form/login/Login";

function App() {
  let [activeUser, setActiveUser] = useState(0);
  async function getData() {
    let id = await JSON.parse(sessionStorage.getItem("id"));
    if (id !== null) {
      setActiveUser(id);
    } else {
      setActiveUser(0);
    }
  }
  const reload = () => {
    window.location.reload();
  };
  useEffect(() => {
    getData();
  }, [activeUser]);

  return (
    <div className="App">
      <header className="App-header">
        {activeUser > 0 ? <Nav /> : <Login triggerReload={reload} />}
      </header>
    </div>
  );
}

export default connect()(App);
