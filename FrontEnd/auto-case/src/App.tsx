import { Routes, Route } from "react-router-dom";
import { DesignPage } from "./pages/DesignPage";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./layout/AppLayout";
import MicroCaseListPage from "./pages/MicroCaseListPage";
import MacroFlowListPage from "./pages/MacroFlowListPage";

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
        <Route path="/macro-flows" element={<MacroFlowListPage />} />
      </Routes>
    </AppLayout>
  );
}
