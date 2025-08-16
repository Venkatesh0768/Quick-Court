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
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { apiService } from "../utils/UserApis";
import { motion, AnimatePresence } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// Helper functions
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const singularize = (s) => (s.endsWith("s") ? s.slice(0, -1) : s);

// Reusable Components
const StatCard = ({ title, value, icon: Icon, color, loading }) => (
  <motion.div 
    whileHover={{ scale: 1.03 }}
    className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl ${loading ? 'animate-pulse' : ''}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold text-white mt-2">
          {loading ? '--' : (typeof value === "number" ? value.toLocaleString() : value || "0")}
        </p>
      </div>
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 backdrop-blur-sm`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </motion.div>
);

const Modal = ({ isOpen, onClose, children, size = "md" }) => {
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl"
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl w-full ${sizeClasses[size]} border border-gray-700 overflow-hidden`}
      >
        <div className="p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, loading }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="sm">
    <div className="text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20 mb-4">
        <AlertCircle className="h-6 w-6 text-red-500" />
      </div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="text-sm text-gray-400 mt-2 mb-6">{message}</p>
      <div className="flex justify-center gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="px-6 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
        >
          Cancel
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onConfirm}
          disabled={loading}
          className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 flex items-center gap-2 transition-colors"
        >
          {loading && <Loader2 className="animate-spin h-4 w-4" />}
          Confirm
        </motion.button>
      </div>
    </div>
  </Modal>
);

const DynamicForm = ({ fields, formData, setFormData, onSubmit, onCancel, loading }) => {
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
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                {field.label}
              </label>
              <select
                name={field.name}
                id={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white transition-colors"
                required={field.required}
              >
                <option value="" disabled className="text-gray-500">
                  Select a {field.label}
                </option>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value} className="bg-gray-800">
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
              className="block text-sm font-medium text-gray-300 mb-1"
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
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white transition-colors"
              required={field.required}
            />
          </div>
        );
      })}
      <div className="flex justify-end gap-4 pt-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
        >
          Cancel
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 flex items-center gap-2 transition-colors"
        >
          {loading && <Loader2 className="animate-spin h-4 w-4" />}
          Save
        </motion.button>
      </div>
    </form>
  );
};

const DataTable = ({ headers, data, onEdit, onDelete, loading, getNestedValue }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig, getNestedValue]);

  return (
    <div className="bg-gray-800/50 rounded-2xl shadow-sm border border-gray-700 overflow-hidden backdrop-blur-sm">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-green-500" />
          <span className="ml-2 text-gray-400">Loading data...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-700/50">
            <thead className="bg-gray-700/50 backdrop-blur-sm">
              <tr>
                {headers.map((header, i) => (
                  <th
                    key={i}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700 transition-colors"
                    onClick={() => requestSort(header)}
                  >
                    <div className="flex items-center">
                      {header}
                      {sortConfig.key === header && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? 
                            <ChevronUp className="w-4 h-4" /> : 
                            <ChevronDown className="w-4 h-4" />}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {sortedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-700/30 transition-colors">
                  {headers.map((header, i) => (
                    <td
                      key={i}
                      className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap"
                    >
                      {getNestedValue(item, header)}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 text-blue-400 hover:text-blue-300 rounded-lg hover:bg-blue-900/20 transition-colors"
                        aria-label="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="p-2 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-900/20 transition-colors"
                        aria-label="Delete"
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
      )}
    </div>
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
  const [actionLoading, setActionLoading] = useState(false);

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
        userId: users && users.length > 0 ? users[index % users.length].id : null,
        courtId: courts && courts.length > 0 ? courts[index % courts.length].id : null,
      }));

      const simulatedMatches = (matches || []).map((match, index) => ({
        ...match,
        courtId: courts && courts.length > 0 ? courts[index % courts.length].id : null,
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
      setError(`Failed to load data. Please try again later.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
          ? `₹${Number(item.pricePerHour).toFixed(2)}`
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
          ? `${item.startTime.substring(0, 5)} - ${item.endTime.substring(0, 5)}`
          : "N/A";
      case "players":
        return `${item.currentPlayers || 0} / ${item.maxPlayers || 0}`;
      case "rating":
        return item.rating ? `${item.rating} / 5` : "N/A";
      case "comment":
        return item.comment ? `${item.comment.substring(0, 30)}${item.comment.length > 30 ? '...' : ''}` : "N/A";
      default:
        return item[key] ?? "N/A";
    }
  };

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
    setActionLoading(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const entity = singularize(activeTab);
    try {
      if (modalMode === "add") {
        await apiService[`create${capitalize(entity)}`](formData);
      } else {
        await apiService[`update${capitalize(entity)}`](selectedItem.id, formData);
      }
      await loadData();
      handleCloseModals();
    } catch (error) {
      console.error(`Error saving ${entity}:`, error);
      setError(`Failed to save ${entity}. Please try again.`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setActionLoading(true);
    if (!selectedItem) return;
    const entity = singularize(activeTab);
    try {
      await apiService[`delete${capitalize(entity)}`](selectedItem.id);
      await loadData();
      handleCloseModals();
    } catch (error) {
      console.error(`Error deleting ${entity}:`, error);
      setError(`Failed to delete ${entity}. Please try again.`);
    } finally {
      setActionLoading(false);
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
          fields: [],
          data: currentData,
        };
      case "matches":
        return {
          headers: ["Court", "Date", "Time", "Players", "Status"],
          fields: [],
          data: currentData,
        };
      case "reviews":
        return {
          headers: ["User", "Facility", "Rating", "Comment", "Date"],
          fields: [],
          data: currentData,
        };
      default:
        return { headers: [], fields: [], data: [] };
    }
  };

  const prepareBookingDataByMonth = (bookings) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const monthlyCounts = Array(12).fill(0);
    
    bookings.forEach(booking => {
      if (booking.createdAt) {
        const month = new Date(booking.createdAt).getMonth();
        monthlyCounts[month]++;
      }
    });
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Bookings',
          data: monthlyCounts,
          borderColor: 'rgb(79, 70, 229)',
          backgroundColor: 'rgba(79, 70, 229, 0.5)',
          tension: 0.3
        }
      ]
    };
  };

  const prepareUserGrowthData = (users) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const monthlyCounts = Array(12).fill(0);
    let cumulativeCount = 0;
    
    users.forEach(user => {
      if (user.createdAt) {
        const month = new Date(user.createdAt).getMonth();
        monthlyCounts[month]++;
      }
    });
    
    const cumulativeData = monthlyCounts.map(count => {
      cumulativeCount += count;
      return cumulativeCount;
    });
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Total Users',
          data: cumulativeData,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          tension: 0.3
        }
      ]
    };
  };

  const prepareRevenueByFacility = (bookings, courts, facilities) => {
    const facilityRevenue = {};
    
    bookings.forEach(booking => {
      const court = courts.find(c => c.id === booking.courtId);
      if (court && court.facilityId && booking.duration && court.pricePerHour) {
        const revenue = (court.pricePerHour / 60) * booking.duration;
        facilityRevenue[court.facilityId] = (facilityRevenue[court.facilityId] || 0) + revenue;
      }
    });
    
    const facilityNames = [];
    const revenueData = [];
    
    Object.entries(facilityRevenue).forEach(([facilityId, revenue]) => {
      const facility = facilities.find(f => f.id === facilityId);
      if (facility) {
        facilityNames.push(facility.name);
        revenueData.push(revenue);
      }
    });
    
    return {
      labels: facilityNames,
      datasets: [
        {
          label: 'Revenue (₹)',
          data: revenueData,
          backgroundColor: 'rgba(99, 102, 241, 0.7)',
          borderColor: 'rgba(99, 102, 241, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  const prepareSportPopularity = (courts, bookings) => {
    const sportCounts = {};
    
    bookings.forEach(booking => {
      const court = courts.find(c => c.id === booking.courtId);
      if (court && court.sportType) {
        sportCounts[court.sportType] = (sportCounts[court.sportType] || 0) + 1;
      }
    });
    
    const sportTypes = Object.keys(sportCounts);
    const counts = Object.values(sportCounts);
    
    const backgroundColors = [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)'
    ];
    
    return {
      labels: sportTypes,
      datasets: [
        {
          label: 'Bookings by Sport',
          data: counts,
          backgroundColor: backgroundColors.slice(0, sportTypes.length),
          borderColor: backgroundColors.map(c => c.replace('0.7', '1')).slice(0, sportTypes.length),
          borderWidth: 1
        }
      ]
    };
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-12 w-12 text-green-500" />
          <span className="ml-2 text-gray-400">Loading dashboard...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20 mb-4">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Error Loading Data</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadData}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg mx-auto transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </motion.button>
        </div>
      );
    }

    if (activeTab === "dashboard") {
      const { users, facilities, courts, bookings, matches, reviews } = data;

      const totalRevenue = bookings.reduce((acc, booking) => {
        const court = courts.find((c) => c.id === booking.courtId);
        if (court && court.pricePerHour && booking.duration) {
          return acc + (court.pricePerHour / 60) * booking.duration;
        }
        return acc;
      }, 0);

      const bookingDataByMonth = prepareBookingDataByMonth(bookings);
      const userGrowthData = prepareUserGrowthData(users);
      const revenueByFacility = prepareRevenueByFacility(bookings, courts, facilities);
      const sportPopularity = prepareSportPopularity(courts, bookings);

      return (
        <div className="space-y-8">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value={users.length}
              icon={Users}
              color="text-blue-400"
              loading={loading}
            />
            <StatCard
              title="Total Facilities"
              value={facilities.length}
              icon={Building2}
              color="text-green-400"
              loading={loading}
            />
            <StatCard
              title="Active Courts"
              value={courts.length}
              icon={MapPin}
              color="text-purple-400"
              loading={loading}
            />
            <StatCard
              title="Total Bookings"
              value={bookings.length}
              icon={Calendar}
              color="text-orange-400"
              loading={loading}
            />
            <StatCard
              title="Total Matches"
              value={matches.length}
              icon={Trophy}
              color="text-indigo-400"
              loading={loading}
            />
            <StatCard
              title="Total Reviews"
              value={reviews.length}
              icon={Star}
              color="text-yellow-400"
              loading={loading}
            />
            <StatCard
              title="Total Revenue"
              value={`₹${(totalRevenue || 0).toLocaleString()}`}
              icon={BarChart3}
              color="text-red-400"
              loading={loading}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bookings by Month */}
            <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Bookings by Month</h3>
              <div className="h-80">
                <Line
                  data={bookingDataByMonth}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          color: '#e5e7eb'
                        }
                      },
                    },
                    scales: {
                      x: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: '#e5e7eb'
                        }
                      },
                      y: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: '#e5e7eb'
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* User Growth */}
            <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">User Growth</h3>
              <div className="h-80">
                <Line
                  data={userGrowthData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          color: '#e5e7eb'
                        }
                      },
                    },
                    scales: {
                      x: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: '#e5e7eb'
                        }
                      },
                      y: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: '#e5e7eb'
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Revenue by Facility */}
            <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Revenue by Facility</h3>
              <div className="h-80">
                <Bar
                  data={revenueByFacility}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          color: '#e5e7eb'
                        }
                      },
                    },
                    scales: {
                      x: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: '#e5e7eb'
                        }
                      },
                      y: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: '#e5e7eb'
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Sport Popularity */}
            <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Sport Popularity</h3>
              <div className="h-80">
                <Pie
                  data={sportPopularity}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: {
                          color: '#e5e7eb'
                        }
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    const tableConfig = getTableConfig(activeTab);

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {tableConfig.fields.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-colors"
            >
              <Plus className="w-5 h-5" /> Add New {singularize(capitalize(activeTab))}
            </motion.button>
          )}
        </div>
        <DataTable
          headers={tableConfig.headers}
          data={tableConfig.data}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
          loading={loading}
          getNestedValue={getNestedValue}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 shadow-lg border-r border-gray-700">
        <div className="flex items-center justify-center h-16 bg-gradient-to-r from-green-600 to-green-500">
          <h1 className="text-xl font-bold">QuickCourt Admin</h1>
        </div>
        <nav className="mt-8 px-4 space-y-1">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 5 }}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeTab === item.id
                  ? "bg-gray-700 text-green-400 font-semibold"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </motion.button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-gray-800/50 shadow-sm border-b border-gray-700 sticky top-0 z-40 backdrop-blur-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold capitalize">
              {activeTab === "dashboard" ? "Dashboard" : `${activeTab} Management`}
            </h1>
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadData}
                className="flex items-center gap-2 bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 text-sm transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </motion.button>
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="font-bold">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Modals */}
      <Modal isOpen={isFormModalOpen} onClose={handleCloseModals} size="lg">
        <h3 className="text-lg font-bold text-white mb-4">
          {modalMode === "add" ? "Add New" : "Edit"}{" "}
          {singularize(capitalize(activeTab))}
        </h3>
        <DynamicForm
          fields={getTableConfig(activeTab).fields}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModals}
          loading={actionLoading}
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
        loading={actionLoading}
      />
    </div>
  );
}

export default AdminPanel;