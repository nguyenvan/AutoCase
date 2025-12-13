import { Routes, Route } from "react-router-dom";
import { DesignPage } from "./pages/DesignMicroPage";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./layout/AppLayout";
import MicroCaseListPage from "./pages/MicroCaseListPage";
import { DesignMacroPage } from "./pages/DesignMacroPage";
import MacroCaseListPage from "./pages/MacroCaseListPage";

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* Route 1: Tạo mới (không có ID) */}
        <Route path="/design" element={<DesignPage />} />
        {/* Route 2: Chỉnh sửa (với ID là tham số) */}
        <Route path="/design/:id" element={<DesignPage />} />
        <Route path="/micro-cases" element={<MicroCaseListPage />} />

        {/* Route 1: Tạo mới (không có ID) */}
        <Route path="/macro-design" element={<DesignMacroPage />} />
        <Route path="/macro-design/:id" element={<DesignMacroPage />} />
        <Route path="/macro-cases" element={<MacroCaseListPage />} />

      </Routes>
    </AppLayout>
  );
}
