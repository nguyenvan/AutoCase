import { Routes, Route } from "react-router-dom";
import { DesignPage } from "./pages/DesignPage";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./layout/AppLayout";


export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/design" element={<DesignPage />} />
      </Routes>
    </AppLayout>
  );
}
