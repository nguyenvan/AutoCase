import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, FileText,  Users } from "lucide-react";

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 w-full">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Statistics grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1 */}
        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100">
              <Users className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Test Cases</p>
              <p className="text-xl font-semibold">124</p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100">
              <FileText className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Projects</p>
              <p className="text-xl font-semibold">8</p>
            </div>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100">
              <BarChart3 className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Executed Tests</p>
              <p className="text-xl font-semibold">76</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity section */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <ul className="space-y-3">
          <li className="flex items-center justify-between border-b pb-2">
            <span>✔ Test case “Login valid user” executed successfully</span>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </li>
          <li className="flex items-center justify-between border-b pb-2">
            <span>⚠ Test case “Checkout flow – Visa” failed</span>
            <span className="text-sm text-gray-500">5 hours ago</span>
          </li>
          <li className="flex items-center justify-between">
            <span>📝 Created new test case “Reset Password UI”</span>
            <span className="text-sm text-gray-500">Yesterday</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
