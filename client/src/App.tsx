import { useState } from "react";
import "./App.css";

import { IncomingForm, DataList } from "./component";

function App() {
  const [activeTab, setActiveTab] = useState<"form" | "data">("form");

  const openDataTab = () => {
    setActiveTab("data");
  };

  return (
    <>
      <div className="main">
        <ul>
          <li>
            <button
              className={`nav-link ${activeTab === "form" ? "active" : ""}`}
              onClick={() => setActiveTab("form")}
            >
              Form
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${activeTab === "data" ? "active" : ""}`}
              onClick={openDataTab}
            >
              Data
            </button>
          </li>
        </ul>
        {activeTab === "form" && <IncomingForm />}
        {activeTab === "data" && <DataList />}
      </div>
    </>
  );
}

export default App;
