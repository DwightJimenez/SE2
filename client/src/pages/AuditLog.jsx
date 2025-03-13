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

  const getBgColor = (action) => {
    if (action === "Created an event") return "bg-blue-300";
    if (action === "Restore") return "bg-green-300";
    if (action === "Archive") return "bg-yellow-300";
    if (action === "Upload") return "bg-purple-300";
    return "bg-red-300";
  };

  return (
    <div>
      <PageLoc currentPage="Audit Log" />
      <div className="flex justify-center mb-4 h-auto  bg-white rounded-lg shadow-lg dark:bg-gray-900 p-4">
        <div className="overflow-x-auto">
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
                <tr key={log.id} className={getBgColor(log.action)}>
                  <td>{log.action}</td>
                  <td>{log.title}</td>
                  <td>{log.user}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
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
