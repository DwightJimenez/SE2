import React from "react";
import PageLoc from "../components/PageLoc";
import { useEffect, useState } from "react";
import axios from "axios";

const AuditLog = () => {
  const [logs, setLogs] = useState([]);

  const fetchDocuments = async () => {
    const response = await axios.get(`http://localhost:4001/audit`);
    setLogs(response.data);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const legendItems = [
    { color: "#93c5fd", label: "Created an event" },
    { color: "#86efac", label: "Restore" },
    { color: "#fde047", label: "Archive" },
    { color: "#d8b4fe", label: "Upload" },
    { color: "#fca5a5", label: "Delete" },
  ];

  const getBgColor = (action) => {
    if (action === "Created an event") return "bg-blue-300";
    if (action === "Restore") return "bg-green-300";
    if (action === "Archive") return "bg-yellow-300";
    if (action === "Upload") return "bg-purple-300";
    return "bg-red-300";
  };

  return (
    <div className="p-4 dark:bg-gray-800">
      <PageLoc currentPage="Audit Log" />
      <div className="flex flex-col justify-center mb-4 h-auto bg-white rounded-lg shadow-2xl dark:bg-gray-900 p-4  border border-gray-300">
        <div className="flex items-center justify-evenly space-x-4 p-4">
          {legendItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-700">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-box border border-gray-200 bg-base-100">
          <table className="table table-lg">
            {/* head */}
            <thead>
              <tr>
                <th>Action</th>
                <th>Title</th>
                <th>Name</th>
                <th>Date/Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={log.id}>
                  <td className="text-sm flex">
                    <div
                      className={`w-4 h-4 rounded-full mr-4 ${getBgColor(
                        log.action
                      )}`}
                    ></div>
                    {log.action}
                  </td>
                  <td className="text-sm">{log.title}</td>
                  <td className="text-sm">{log.User.username}</td>
                  <td className="text-sm">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLog;
