import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { FaRoute, FaClock, FaRuler, FaArrowUp, FaArrowDown, FaListUl } from "react-icons/fa";
import Loading from "./Loading";

const UserTripStats = ({ userId, preview }) => {
    const { t } = useTranslation();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;
    
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${import.meta.env.VITE_API_URL}/tripStats?id=${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
    
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                if (!data) {
                    setStats(null); // Explicitně nastavíme null, pokud jsou data prázdná
                } else {
                    setStats(data);
                }
            } catch (error) {
                console.error("Error fetching trip stats:", error);
                setStats(null);
            } finally {
                setLoading(false);
            }
        };
    
        fetchStats();
    }, [userId]);
    

    if (!userId || loading) return <Loading />;


    if (!stats || stats.tripCount === 0) {
        return (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow max-w-xl mx-auto">
            <p className="text-red-500 dark:text-red-400 text-center">{t("noDataFound")}</p>
          </div>
        );
      }
      
      const statOptions = [
        {
          icon: <FaRoute />,
          label: t("totalDistance"),
          value: `${stats.totalDistance || 0}`,
        },
        {
          icon: <FaClock />,
          label: t("totalTime"),
          value: stats.totalTime || "0",
        },
        {
          icon: <FaRuler />,
          label: t("averageDistancePerTrip"),
          value: `${stats.avgDistancePerTrip || 0}`,
        },
        {
          icon: <FaArrowUp />,
          label: t("longestTrip"),
          value: stats.longestTrip ? `${stats.longestTrip.distance} km (${stats.longestTrip.duration})` : "0 km (0h)",
        },
        {
          icon: <FaArrowDown />,
          label: t("shortestTrip"),
          value: stats.shortestTrip ? `${stats.shortestTrip.distance} km (${stats.shortestTrip.duration})` : "0 km (0h)",
        },
        {
          icon: <FaListUl />,
          label: t("totalTrips"),
          value: stats.tripCount || 0,
        },
      ];
      
      if (preview) {
        const randomStat = statOptions[Math.floor(Math.random() * statOptions.length)];
      
        return (
          <div className="p-4 rounded-xl mx-auto">
            <StatItem {...randomStat} />
          </div>
        );
      }
      
      return (
        <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {statOptions.map((stat, index) => (
              <StatItem key={index} {...stat} />
            ))}
          </div>
        </div>
      );
      
};

const StatItem = ({ icon, label, value }) => (
    <div className="flex flex-col items-center justify-center  rounded-lg p-5  text-center">
        <div className="text-gray-900 dark:text-gray-200 text-3xl">{icon}</div>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{label}</p>
        <p className="text-xl font-semibold text-gray-900 dark:text-white mt-1">{value}</p>
    </div>
);

StatItem.propTypes = {
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

UserTripStats.propTypes = {
    userId: PropTypes.number.isRequired,
    preview: PropTypes.bool,
};

export default UserTripStats;
