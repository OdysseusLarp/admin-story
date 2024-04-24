import "./App.css";
import { Tabs, Tab } from "react-bootstrap";
import Characters from "./components/Characters";
import Artifacts from "./components/Artifacts";
import Fleet from "./components/Fleet";
import Plots from "./components/Plots";
import Events from "./components/Events";
import Ship from "./components/Ship";
import Character from "./components/Character";
import Artifact from "./components/Artifact";
import Plot from "./components/Plot";
import Event from "./components/Event";
import Messages from "./components/Messages";
import Message from "./components/Message";
import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { LuMailPlus, LuCalendarPlus } from "react-icons/lu";
import { TbMessagePlus } from "react-icons/tb";
import CreateNewMessageModal from "./components/modals/CreateNewMessageModal";
import { Toaster } from 'react-hot-toast';

import { useLocation, useNavigate, Routes, Route } from "react-router-dom";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function App() {
  const [key, setKey] = React.useState(null);
  const [showMessageNew, setShowMessageNew] = React.useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    setKey(capitalizeFirstLetter(location.pathname.split('/')[1]));
    if (location.pathname === '/') {
      navigate("/characters")
    }
  }, [location.pathname, navigate]);

  const onSelectTab = (k) => {
    setKey(k);

    const path = k.toLowerCase();
    navigate(path);
  };

  const changeTab = (k) => {
    setKey(k);
  };

  return (
    <div className="App">
      <h1 className="Title">
        <span>Admin Story DB: </span>
        <span className={`title-tab ${key}`}>{key}</span>
        <ButtonGroup>
          <Button size="md" className="float-char-btn" title="Create New Plot" variant="outline-secondary" onClick={null}><TbMessagePlus className="plot-button" size="24px"/><span>New plot</span></Button>
          <Button size="md" className="float-char-btn" title="Create New Event" variant="outline-secondary" onClick={null}><LuCalendarPlus className="event-button" size="24px"/><span>New event</span></Button>
          <Button size="md" className="float-char-btn" title="Create New Message" variant="outline-secondary" onClick={() => setShowMessageNew(true)}><LuMailPlus className="message-button" size="24px"/><span>New message</span></Button>
        </ButtonGroup>
      </h1>
      <CreateNewMessageModal
          showMessageNew={showMessageNew}
          handleClose={() => setShowMessageNew(false)}
        />
      <Tabs id="tabs" activeKey={key} onSelect={onSelectTab} className="mb-3">
        <Tab eventKey="Characters" title="Characters" />
        <Tab eventKey="Fleet" title="Fleet" />
        <Tab eventKey="Artifacts" title="Artifacts" />
        <Tab eventKey="Plots" title="Plots" />
        <Tab eventKey="Events" title="Events" />
        <Tab eventKey="Messages" title="Messages" />
      </Tabs>
      <Routes>
        <Route path="/fleet" element={<Fleet />} />
        <Route path="/fleet/:id" element={<Ship changeTab={changeTab} />} />
        <Route path="/characters" element={<Characters changeTab={changeTab} />} />
        <Route path="/characters/:id" element={<Character changeTab={changeTab} />} />
        <Route path="/artifacts" element={<Artifacts />} />
        <Route path="/artifacts/:id" element={<Artifact changeTab={changeTab} />} />
        <Route path="/plots" element={<Plots />} />
        <Route path="/plots/:id" element={<Plot changeTab={changeTab} />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<Event changeTab={changeTab} />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/messages/:id" element={<Message changeTab={changeTab} />} />
        <Route path="*" element={<></>} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
