import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import VenuCard from "../components/VenuCard";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { FiMapPin, FiArrowRight } from "react-icons/fi";
import { FaBasketballBall, FaFutbol, FaTableTennis, FaVolleyballBall } from "react-icons/fa";
import { motion } from "framer-motion";

function HomePage() {
  const [courts, setCourts] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSport, setActiveSport] = useState("all");

  useEffect(() => {
    const fetchCourtsAndFacilities = async () => {
      try {
        setLoading(true);
        const courtsResponse = await axiosInstance.get("/courts");
        const courtsData = courtsResponse.data;

        const facilityIds = [...new Set(courtsData.map((c) => c.facilityId))];
        const facilityResponses = await Promise.all(
          facilityIds.map((id) => axiosInstance.get(`/facilities/${id}`))
        );
        const facilitiesData = facilityResponses.map((res) => res.data);

        setCourts(courtsData);
        setFacilities(facilitiesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourtsAndFacilities();
  }, []);

  const sports = [
    { id: "all", name: "All Sports", icon: <FaBasketballBall /> },
    { id: "basketball", name: "Basketball", icon: <FaBasketballBall /> },
    { id: "football", name: "Football", icon: <FaFutbol /> },
    { id: "tennis", name: "Tennis", icon: <FaTableTennis /> },
    { id: "volleyball", name: "Volleyball", icon: <FaVolleyballBall /> },
  ];

  const filteredCourts = activeSport === "all" 
    ? courts 
    : courts.filter(court => court.sportType?.toLowerCase() === activeSport);

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white ">
      <NavBar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 z-10">
            <div className="inline-flex items-center bg-gray-800 border border-gray-700 px-4 py-3 rounded-xl gap-3 mb-6 shadow-lg">
              <FiMapPin className="text-green-400 text-lg" />
              <input
                type="text"
                defaultValue="Ahmedabad"
                className="bg-transparent text-white focus:outline-none w-full placeholder-gray-400"
                placeholder="Search location..."
              />
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
            >
              <span className="text-white">Find Players &</span>{' '}
              <span className="text-green-400 bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                Venues Nearby
              </span>
            </motion.h1>

            <p className="text-gray-300 text-lg mb-8 max-w-lg">
              Seamlessly explore sports venues and connect with sports enthusiasts in your area.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {sports.map((sport) => (
                <button
                  key={sport.id}
                  onClick={() => setActiveSport(sport.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeSport === sport.id ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  <span className="text-sm">{sport.icon}</span>
                  <span>{sport.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="md:w-1/2 z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1547347298-4074fc3086f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Sports illustration"
                className="rounded-2xl shadow-2xl w-full h-auto max-w-2xl border-2 border-gray-700"
              />
              <div className="absolute -bottom-4 -right-4 bg-green-500 w-24 h-24 rounded-xl shadow-lg flex items-center justify-center text-white text-4xl">
                <FaBasketballBall />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-900/10 to-transparent pointer-events-none" />
      </section>

      {/* Venues Section */}
      <section className="py-12 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Featured Venues</h2>
              <p className="text-gray-400">Top-rated sports facilities in your area</p>
            </div>
            <Link
              to="/courts"
              className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors font-medium"
            >
              View all venues <FiArrowRight className="mt-0.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-4 h-64 animate-pulse"></div>
              ))}
            </div>
          ) : filteredCourts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourts.slice(0, 8).map((court, i) => (
                <motion.div
                  key={court.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  <Link to={`/courtDetails/${court.id}`}>
                    <VenuCard court={court} facility={facilities.find(f => f.id === court.facilityId)} />
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4 text-5xl">🏟️</div>
              <h3 className="text-xl font-medium text-gray-300">No venues found</h3>
              <p className="text-gray-500">Try adjusting your filters or check back later</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;