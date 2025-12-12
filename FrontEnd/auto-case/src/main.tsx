// import React from "react";
// import ReactDOM from "react-dom/client";
// import { DndProvider } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import { DesignPage } from "./pages/DesignPage";
// import "./index.css";

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <DndProvider backend={HTML5Backend}>
//       <DesignPage />
//     </DndProvider>
//   </React.StrictMode>

  
// );
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";  // <--- bạn nên có file App.tsx chứa Routes
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
