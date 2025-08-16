import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../utils/axios";
import { Link } from "react-router-dom";
import { FaStar, FaMapMarkerAlt, FaFilter, FaSearch } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import NavBar from "../components/NavBar";

function Courts() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const courtsPerPage = 8;

  // Filter state
  const [filters, setFilters] = useState({
    searchQuery: '',
    sportType: 'All Sports',
    minPrice: '',
    maxPrice: '',
    venueType: [],
    minRating: 0
  });

  // Fetch data
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/courts");
        const courtsData = res.data || [];

        if (!isMounted) return;

        const facilityIds = [...new Set(courtsData.map((c) => c.facilityId))];
        const facilityResponses = await Promise.all(
          facilityIds.map((id) => axiosInstance.get(`/facilities/${id}`))
        );
        const facilitiesData = facilityResponses.map((res) => res.data);

        if (isMounted) {
          setCourts(courtsData);
          setFacilities(facilitiesData);
        }
      } catch (err) {
        console.error("Error fetching courts:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Get facility for a court
  const getFacilityForCourt = useCallback((court) => {
    return facilities.find(f => f.id === court.facilityId) || {};
  }, [facilities]);

  // Filter courts based on filter criteria
  const filteredCourts = courts.filter(court => {
    // Search query
    if (filters.searchQuery && 
        !court.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
        !getFacilityForCourt(court).address?.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
      return false;
    }
    
    // Sport type
    if (filters.sportType !== 'All Sports' && 
        court.sportType !== filters.sportType) {
      return false;
    }
    
    // Price range
    if (filters.minPrice && court.pricePerHour < Number(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && court.pricePerHour > Number(filters.maxPrice)) {
      return false;
    }
    
    // Venue type
    if (filters.venueType.length > 0 && 
        !filters.venueType.includes(court.courtType)) {
      return false;
    }
    
    // Rating
    if (filters.minRating && (court.rating || 0) < filters.minRating) {
      return false;
    }
    
    return true;
  });

  // Pagination
  const indexOfLastCourt = currentPage * courtsPerPage;
  const indexOfFirstCourt = indexOfLastCourt - courtsPerPage;
  const currentCourts = filteredCourts.slice(indexOfFirstCourt, indexOfLastCourt);
  const totalPages = Math.ceil(filteredCourts.length / courtsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFilters(prev => ({
        ...prev,
        venueType: checked 
          ? [...prev.venueType, value]
          : prev.venueType.filter(item => item !== value)
      }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle rating filter
  const handleRatingChange = (rating) => {
    setFilters(prev => ({
      ...prev,
      minRating: prev.minRating === rating ? 0 : rating
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-900 text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-red-600 rounded-full mb-4"></div>
          <p>Loading courts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-zinc-900">
      <NavBar />
      <div className="flex flex-col md:flex-row bg-black text-white min-h-screen">
        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center justify-center gap-2 bg-gray-800 p-3"
        >
          <FaFilter />
          <span>Filters</span>
        </button>

        {/* Sidebar Filters */}
        <aside
          className={`${
            showFilters ? "block" : "hidden"
          } md:block w-full md:w-64 bg-gray-900 p-6 space-y-6`}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Filters</h2>
            {showFilters && (
              <button
                onClick={() => setShowFilters(false)}
                className="md:hidden text-red-500"
              >
                ×
              </button>
            )}
          </div>

          <div>
            <h2 className="text-lg font-bold mb-2">Search</h2>
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="searchQuery"
                placeholder="Search venues..."
                className="w-full pl-10 p-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={filters.searchQuery}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-2">Sport Type</h2>
            <select 
              name="sportType"
              className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={filters.sportType}
              onChange={handleFilterChange}
            >
              <option>All Sports</option>
              <option>Basketball</option>
              <option>Football</option>
              <option>Tennis</option>
              <option>Badminton</option>
              <option>Volleyball</option>
              <option>Squash</option>
              <option>Table Tennis</option>
            </select>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-2">Price Range (₹/hr)</h2>
            <div className="flex space-x-2">
              <input
                type="number"
                name="minPrice"
                placeholder="Min"
                className="w-1/2 p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max"
                className="w-1/2 p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-2">Venue Type</h2>
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="venueType"
                  value="Outdoor"
                  checked={filters.venueType.includes("Outdoor")}
                  onChange={handleFilterChange}
                  className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-green-600 focus:ring-green-500"
                />
                <span>Outdoor</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="venueType"
                  value="Indoor"
                  checked={filters.venueType.includes("Indoor")}
                  onChange={handleFilterChange}
                  className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-green-600 focus:ring-green-500"
                />
                <span>Indoor</span>
              </label>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-2">Ratings</h2>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <label key={star} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={filters.minRating === star}
                    onChange={() => handleRatingChange(star)}
                    className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-red-600 focus:ring-red-500"
                  />
                  <div className="flex items-center">
                    {[...Array(star)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" />
                    ))}
                    <span className="ml-1">& up</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setCurrentPage(1)} // Reset to first page when applying filters
            className="bg-green-600 hover:bg-green-700 w-full py-2 rounded-lg font-bold transition duration-200"
          >
            Apply Filters
          </button>
        </aside>

        {/* Courts Grid */}
        <main className="flex-1 p-4 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Sports Venues Near You
              </h1>
              <p className="text-gray-400">
                {filteredCourts.length} venues found
              </p>
            </div>
            <div className="hidden md:block">
              <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition duration-200">
                <span>View all venues</span>
                <IoIosArrowForward />
              </button>
            </div>
          </div>

          {currentCourts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <h3 className="text-xl font-semibold mb-2">No venues found</h3>
              <p className="text-gray-400 mb-4">Try adjusting your filters</p>
              <button 
                onClick={() => setFilters({
                  searchQuery: '',
                  sportType: 'All Sports',
                  minPrice: '',
                  maxPrice: '',
                  venueType: [],
                  minRating: 0
                })}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentCourts.map((court) => (
                  <div
                    key={court.id}
                    className="bg-gray-900 rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl hover:translate-y-[-4px] transition duration-300"
                  >
                    <div className="h-48 bg-gray-700 relative">
                      <img
                        className="w-full h-full object-cover"
                        src={
                          court.photoUrl ||
                          "https://via.placeholder.com/300x200?text=Venue"
                        }
                        alt={court.name}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/300x200?text=Venue";
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded flex items-center">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span className="text-white">{court.rating || "4.5"}</span>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <h2 className="text-lg font-bold line-clamp-1">
                          {court.name}
                        </h2>
                        <span className="bg-green-600 text-xs px-2 py-1 rounded">
                          {court.sportType}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 flex items-center mt-1">
                        <FaMapMarkerAlt className="mr-2" />
                        <span className="line-clamp-1">
                          {getFacilityForCourt(court).address || "N/A"}
                        </span>
                      </p>
                      <p className="mt-2 text-sm text-gray-300">
                        ₹{court.pricePerHour}{" "}
                        <span className="text-gray-500">/ hour</span>
                      </p>
                      <Link
                        to={`/courtDetails/${court.id}`}
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold text-center py-2 px-4 rounded-lg transition duration-200"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  <button 
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition duration-200 disabled:opacity-50"
                  >
                    {"<"}
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-4 py-2 rounded-lg transition duration-200 ${
                        number === currentPage 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  
                  <button 
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition duration-200 disabled:opacity-50"
                  >
                    {">"}
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Courts;