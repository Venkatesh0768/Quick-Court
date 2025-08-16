import NavBar from "../components/NavBar";
import VenuCard from "../components/VenuCard";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="w-full min-h-screen bg-zinc-900">
      <NavBar />

      <div className="bg-zinc-900 min-h-[400px] flex justify-center items-center px-4 md:px-0">
        <div className="w-full md:w-[50%] flex justify-center items-start flex-col px-4 md:px-10">
          <div className="inline-flex items-center bg-gray-800 border border-gray-700 p-2 rounded-lg gap-2">
            <i className="text-white ri-map-pin-2-line"></i>
            <input
              type="text"
              defaultValue="Ahmedabad"
              className="bg-transparent text-white focus:outline-none min-w-0"
              placeholder="Enter location"
            />
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mt-4">
            FIND PLAYERS & VENUES
          </h2>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-green-400">
            NEARBY
          </h2>
          <p className="text-gray-400 mt-4 max-w-md">
            Seamlessly explore sports venues and play with sports enthusiasts
            just like you!
          </p>
        </div>

        <div className="hidden md:block">
          <img
            src="https://placehold.co/600x400/1e293b/4ade80?text=Explore+Sports"
            alt="Sports illustration"
            className="rounded-xl shadow-2xl shadow-green-900/20 w-full h-full max-w-lg"
          />
        </div>
      </div>

      {/* Venues Section */}
      <div className="w-full min-h-[400px] px-4 md:px-20 py-8">
        <div className="h-auto w-full text-white flex flex-col md:flex-row justify-between items-start md:items-center px-0 md:px-[55px] mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-0">
            Booking Venues
          </h1>
          <Link
            to="/facility"
            className="text-xl md:text-2xl font-semibold flex items-center gap-2 hover:text-zinc-300 transition-colors"
          >
            See all venues
            <i className="ri-arrow-right-line text-xl"></i>
          </Link>
        </div>

        <div className="w-full bg-zinc-900 p-4 md:p-10 flex gap-5 overflow-hidden scrollbar-thin scrollbar-thumb-zinc-600">
          {Array.from({ length: 9 }, (_, index) => (
            <VenuCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
