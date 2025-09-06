import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Trash2, MapPin, Clock, CheckCircle, RefreshCw, AlertCircle } from "lucide-react";
import { fetchWithAuth, buildUrl, API_ENDPOINTS } from "../utils/api";
import Spinner from "../components/Spinner";
import ConfirmModal from "../components/ConfirmModal";

interface WasteReport {
  id: number;
  wasteType: string;
  quantity: number;
  unit: string;
  status: string;
  contactName: string;
  contactPhone: string;
  notes?: string;
  createdAt: string;
  site: { id: number; name: string };
}

export default function AdminDashboard() {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    reportId: number;
    newStatus: string;
    message: string;
  }>({
    isOpen: false,
    reportId: 0,
    newStatus: "",
    message: "",
  });
  const navigate = useNavigate();

  // Fetch waste reports
  async function fetchReports() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchWithAuth(buildUrl(API_ENDPOINTS.WASTE_REPORTS));
      setReports(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
  }, []);

  // Handle status update with confirmation
  function handleStatusUpdate(id: number, newStatus: string) {
    const report = reports.find(r => r.id === id);
    const statusText = newStatus.replace("_", " ").toLowerCase();
    const siteName = report?.site.name || "Unknown Site";
    
    setConfirmModal({
      isOpen: true,
      reportId: id,
      newStatus,
      message: `Are you sure you want to mark the waste report from ${siteName} as "${statusText}"?`,
    });
  }

  // Confirm status update
  async function confirmStatusUpdate() {
    const { reportId, newStatus } = confirmModal;
    setUpdating(reportId);
    
    try {
      await fetchWithAuth(buildUrl(API_ENDPOINTS.UPDATE_WASTE_STATUS(reportId)), {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchReports(); // refresh list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(null);
      setConfirmModal({ isOpen: false, reportId: 0, newStatus: "", message: "" });
    }
  }

  // Cancel status update
  function cancelStatusUpdate() {
    setConfirmModal({ isOpen: false, reportId: 0, newStatus: "", message: "" });
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  // Calculate stats
  const totalReports = reports.length;
  const pendingReports = reports.filter(r => r.status === "REPORTED").length;
  const enRouteReports = reports.filter(r => r.status === "EN_ROUTE").length;
  const collectedReports = reports.filter(r => r.status === "COLLECTED").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Trash2 className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Waste Management Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchReports}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button 
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Trash2 className="h-6 w-6 text-gray-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Reports
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">{totalReports}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pending
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">{pendingReports}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <MapPin className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        En Route
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">{enRouteReports}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Collected
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">{collectedReports}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <div className="text-sm text-red-700">{error}</div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <Spinner size="lg" />
              <p className="mt-2 text-gray-600">Loading waste reports...</p>
            </div>
          )}

          {/* Reports List */}
          {!loading && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Waste Reports
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Manage waste collection from all sites
                </p>
              </div>
              
              {reports.length === 0 ? (
                <div className="text-center py-12">
                  <Trash2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">No waste reports yet</p>
                  <p className="text-sm text-gray-400">Reports will appear here when workers submit them</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {reports.map((report) => (
                    <div key={report.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-lg font-medium text-gray-900">
                              {report.site.name}
                            </h4>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                report.status === "REPORTED"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : report.status === "EN_ROUTE"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {report.status.replace("_", " ")}
                            </span>
                          </div>
                          
                          <div className="mt-2">
                            <p className="text-sm text-gray-900">
                              <span className="font-medium">{report.wasteType}</span> – {report.quantity} {report.unit}
                            </p>
                            <p className="text-sm text-gray-500">
                              Contact: {report.contactName} • {report.contactPhone}
                            </p>
                            {report.notes && (
                              <p className="text-sm text-gray-600 italic mt-1">
                                Notes: {report.notes}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              Submitted: {new Date(report.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-2">
                          {report.status === "REPORTED" && (
                            <button
                              onClick={() => handleStatusUpdate(report.id, "EN_ROUTE")}
                              disabled={updating === report.id}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
                            >
                              {updating === report.id ? (
                                <Spinner size="sm" className="mr-1" />
                              ) : null}
                              Mark En Route
                            </button>
                          )}
                          {report.status === "EN_ROUTE" && (
                            <button
                              onClick={() => handleStatusUpdate(report.id, "COLLECTED")}
                              disabled={updating === report.id}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors duration-200"
                            >
                              {updating === report.id ? (
                                <Spinner size="sm" className="mr-1" />
                              ) : null}
                              Mark Collected
                            </button>
                          )}
                          {report.status === "COLLECTED" && (
                            <span className="text-sm text-green-600 font-medium">
                              ✓ Completed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        message={confirmModal.message}
        confirmText="Update Status"
        cancelText="Cancel"
        onConfirm={confirmStatusUpdate}
        onCancel={cancelStatusUpdate}
        type="info"
      />
    </div>
  );
}
