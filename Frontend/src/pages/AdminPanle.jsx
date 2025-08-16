import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Calendar,
  MapPin,
  Building2,
  Star,
  Trophy,
  BarChart3,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  AlertCircle,
  X,
  CheckCircle,
} from "lucide-react";
import { apiService } from "../utils/UserApis";


const StatCard = ({ title, value, icon: IconComponent, color }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          {typeof value === "number" ? value.toLocaleString() : value || "0"}
        </p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        {IconComponent && <IconComponent className="w-6 h-6 text-white" />}
      </div>
    </div>
  </div>
);

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="text-center">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mt-2 mb-6">{message}</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
        >
          Confirm
        </button>
      </div>
    </div>
  </Modal>
);

const DynamicForm = ({ fields, formData, setFormData, onSubmit, onCancel }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {fields.map((field) => {
        if (field.type === "select") {
          return (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {field.label}
              </label>
              <select
                name={field.name}
                id={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required={field.required}
              >
                <option value="" disabled>
                  Select a {field.label}
                </option>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          );
        }
        return (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {field.label}
            </label>
            <input
              type={field.type || "text"}
              name={field.name}
              id={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required={field.required}
            />
          </div>
        );
      })}
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
        >
          Save
        </button>
      </div>
    </form>
  );
};

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [data, setData] = useState({
    users: [],
    courts: [],
    facilities: [],
    bookings: [],
    matches: [],
    reviews: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [users, facilities, courts, bookings, matches, reviews] =
        await Promise.all([
          apiService.getUsers(),
          apiService.getFacilities(),
          apiService.getCourts(),
          apiService.getBookings(),
          apiService.getMatches(),
          apiService.getReviews(),
        ]);

      const simulatedBookings = (bookings || []).map((booking, index) => ({
        ...booking,
        userId:
          users && users.length > 0 ? users[index % users.length].id : null,
        courtId:
          courts && courts.length > 0 ? courts[index % courts.length].id : null,
      }));

      const simulatedMatches = (matches || []).map((match, index) => ({
        ...match,
        courtId:
          courts && courts.length > 0 ? courts[index % courts.length].id : null,
      }));

      setData({
        users: users || [],
        facilities: facilities || [],
        courts: courts || [],
        bookings: simulatedBookings,
        matches: simulatedMatches,
        reviews: reviews || [],
      });
    } catch (err) {
      console.error("Error loading data:", err);
      setError(`Failed to load data. Please check the console for details.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const singularize = (s) => (s.endsWith("s") ? s.slice(0, -1) : s);

  const handleOpenAddModal = () => {
    setModalMode("add");
    setSelectedItem(null);
    setFormData({});
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setModalMode("edit");
    setSelectedItem(item);
    setFormData(item);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (item) => {
    setSelectedItem(item);
    setIsConfirmModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsFormModalOpen(false);
    setIsConfirmModalOpen(false);
    setSelectedItem(null);
    setFormData({});
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const entity = singularize(activeTab);
    try {
      if (modalMode === "add") {
        await apiService[`create${capitalize(entity)}`](formData);
      } else {
        await apiService[`update${capitalize(entity)}`](
          selectedItem.id,
          formData
        );
      }
      loadData(); // Refresh all data after a change
      handleCloseModals();
    } catch (error) {
      console.error(`Error saving ${entity}:`, error);
      alert(`Failed to save. Please check console for details.`);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    const entity = singularize(activeTab);
    try {
      await apiService[`delete${capitalize(entity)}`](selectedItem.id);
      loadData(); // Refresh all data after a change
      handleCloseModals();
    } catch (error) {
      console.error(`Error deleting ${entity}:`, error);
      alert(`Failed to delete. Please check console for details.`);
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "facilities", label: "Facilities", icon: Building2 },
    { id: "courts", label: "Courts", icon: MapPin },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "matches", label: "Matches", icon: Trophy },
    { id: "reviews", label: "Reviews", icon: Star },
  ];

  const getTableConfig = (tab) => {
    const currentData = data[tab] || [];
    switch (tab) {
      case "users":
        return {
          headers: ["Name", "Email", "Phone", "Role", "Created At"],
          fields: [
            { name: "firstName", label: "First Name", required: true },
            { name: "lastName", label: "Last Name", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "phone", label: "Phone" },
            { name: "role", label: "Role" },
          ],
          data: currentData.filter(
            (item) =>
              `${item.firstName || ""} ${item.lastName || ""}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              (item.email || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
          ),
        };
      case "facilities":
        return {
          headers: ["Name", "Address", "City", "State"],
          fields: [
            { name: "name", label: "Facility Name", required: true },
            { name: "description", label: "Description" },
            { name: "address", label: "Address" },
            { name: "city", label: "City" },
            { name: "state", label: "State" },
          ],
          data: currentData.filter((item) =>
            (item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
          ),
        };
      case "courts":
        return {
          headers: ["Name", "Sport", "Price/Hour", "Facility"],
          fields: [
            { name: "name", label: "Court Name", required: true },
            { name: "sportType", label: "Sport Type" },
            { name: "pricePerHour", label: "Price Per Hour", type: "number" },
            {
              name: "facilityId",
              label: "Facility",
              type: "select",
              options: data.facilities.map((f) => ({
                value: f.id,
                label: f.name,
              })),
              required: true,
            },
          ],
          data: currentData,
        };
      case "bookings":
        return {
          headers: ["User", "Court", "Date", "Time", "Status"],
          fields: [], // Bookings are not editable/creatable from this panel
          data: currentData,
        };
      case "matches":
        return {
          headers: ["Court", "Date", "Time", "Players", "Status"],
          fields: [], // Matches are not editable/creatable from this panel
          data: currentData,
        };
      case "reviews":
        return {
          headers: ["User", "Facility", "Rating", "Comment", "Date"],
          fields: [], // Reviews cannot be created/edited
          data: currentData,
        };
      default:
        return { headers: [], fields: [], data: [] };
    }
  };

  const tableConfig = getTableConfig(activeTab);

  const getNestedValue = (item, header) => {
    const key = header.toLowerCase().replace(/ /g, "");
    switch (key) {
      case "name":
        return item.firstName
          ? `${item.firstName} ${item.lastName}`
          : item.name;
      case "createdat":
      case "date":
        return item.createdAt
          ? new Date(item.createdAt).toLocaleDateString()
          : item.date
          ? new Date(item.date).toLocaleDateString()
          : "N/A";
      case "price/hour":
        return item.pricePerHour != null
          ? `Rs ${Number(item.pricePerHour).toFixed(2)}`
          : "N/A";
      case "facility": {
        const facility = data.facilities.find((f) => f.id === item.facilityId);
        return facility?.name || item.facilityId || "N/A";
      }
      case "court": {
        const court = data.courts.find((c) => c.id === item.courtId);
        return court?.name || item.courtId || "N/A";
      }
      case "user": {
        const user = data.users.find((u) => u.id === item.userId);
        return user
          ? `${user.firstName} ${user.lastName}`
          : item.userId || "N/A";
      }
      case "time":
        return item.startTime && item.endTime
          ? `${item.startTime.substring(0, 5)} - ${item.endTime.substring(
              0,
              5
            )}`
          : "N/A";
      case "players":
        return `${item.currentPlayers || 0} / ${item.maxPlayers || 0}`;
      case "rating":
        return item.rating ? `${item.rating} / 5` : "N/A";
      default:
        return item[key] ?? "N/A";
    }
  };

  const DataTable = ({ headers, data: tableData, onEdit, onDelete }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tableData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {headers.map((header, i) => (
                  <td
                    key={i}
                    className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap"
                  >
                    {getNestedValue(item, header)}
                  </td>
                ))}
                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  <div className="flex gap-2">
                    {tableConfig.fields.length > 0 && (
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(item)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading)
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      );
    if (error)
      return (
        <div className="text-center text-red-600 p-8">
          <AlertCircle className="mx-auto w-12 h-12 mb-4" />
          {error}
        </div>
      );

    if (activeTab === "dashboard") {
      const { users, facilities, courts, bookings, matches, reviews } = data;

      const totalRevenue = bookings.reduce((acc, booking) => {
        const court = courts.find((c) => c.id === booking.courtId);
        if (court && court.pricePerHour && booking.duration) {
          return acc + (court.pricePerHour / 60) * booking.duration;
        }
        return acc;
      }, 0);

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={users.length}
            icon={Users}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Facilities"
            value={facilities.length}
            icon={Building2}
            color="bg-green-500"
          />
          <StatCard
            title="Active Courts"
            value={courts.length}
            icon={MapPin}
            color="bg-purple-500"
          />
          <StatCard
            title="Total Bookings"
            value={bookings.length}
            icon={Calendar}
            color="bg-orange-500"
          />
          <StatCard
            title="Total Matches"
            value={matches.length}
            icon={Trophy}
            color="bg-indigo-500"
          />
          <StatCard
            title="Total Reviews"
            value={reviews.length}
            icon={Star}
            color="bg-yellow-500"
          />
          <StatCard
            title="Total Revenue"
            value={`Rs ${(totalRevenue || 0).toLocaleString()}`}
            icon={BarChart3}
            color="bg-red-500"
          />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {tableConfig.fields.length > 0 && (
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Plus className="w-5 h-5" /> Add New{" "}
              {singularize(capitalize(activeTab))}
            </button>
          )}
        </div>
        <DataTable
          headers={tableConfig.headers}
          data={tableConfig.data}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex items-center justify-center h-16 bg-green-600">
          <h1 className="text-xl font-bold text-white">QuickCourt Admin</h1>
        </div>
        <nav className="mt-8 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeTab === item.id
                  ? "bg-green-50 text-green-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="ml-64">
        <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900 capitalize">
              {activeTab === "dashboard"
                ? "Dashboard"
                : `${activeTab} Management`}
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={loadData}
                className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm"
              >
                Refresh Data
              </button>
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">{renderContent()}</main>
      </div>

      <Modal isOpen={isFormModalOpen} onClose={handleCloseModals}>
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {modalMode === "add" ? "Add New" : "Edit"}{" "}
          {singularize(capitalize(activeTab))}
        </h3>
        <DynamicForm
          fields={tableConfig.fields}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModals}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this ${singularize(
          activeTab
        )}? This action cannot be undone.`}
      />
    </div>
  );
}

export default AdminPanel;
