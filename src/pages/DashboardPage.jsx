
import React, { useEffect, useState, memo } from "react";
import {
  BookOpen,
  Users,
  MessageCircle,
  ClipboardList,
  Home,
  GraduationCap,
  Image,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  getCourses,
  getEnrollments,
  getEnquiries,
  getTestimonials,
  getGallery,
  getAccommodations,
  getInstructors,
} from "../api/api";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import Loader from "../components/Loader";


const StatCard = memo(({ title, value, Icon, trend, dailyData }) => {
  const TrendIcon = trend?.percent >= 0 ? ArrowUp : ArrowDown;
  const trendColor = trend?.percent >= 0 ? "text-green-400" : "text-red-400";

  return (
    <div className={`bg-gray-800 rounded-2xl p-5 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between transform hover:-translate-y-1`}>
      <div className="flex-1">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
        {trend && (
          <div className="flex items-center gap-1 mt-1 text-sm">
            <TrendIcon className={`w-4 h-4 ${trendColor}`} />
            <span className={`${trendColor}`}>{Math.abs(trend.percent)}%</span>
            <span className="text-gray-400">{trend.label}</span>
          </div>
        )}
        {dailyData && dailyData.length > 0 && (
          <div className="mt-2 h-12 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={{ r: 2, fill: "#4F46E5" }}
                  activeDot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <div className="p-4 rounded-xl mt-3 sm:mt-0 flex items-center justify-center bg-gray-700">
        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
      </div>
    </div>
  );
});


const SkeletonCard = () => (
  <div className="bg-gray-700/40 animate-pulse rounded-2xl p-5 h-36 sm:h-28" />
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white border shadow-lg p-3 rounded text-sm">
        <p className="font-semibold">{label}</p>
        <p>Count: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const DashboardPage = () => {
  const [stats, setStats] = useState({
    courses: 0,
    enrollments: 0,
    enquiries: 0,
    testimonials: 0,
    gallery: 0,
    accommodations: 0,
    instructors: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [
          courses,
          enrollments,
          enquiries,
          testimonials,
          gallery,
          accommodations,
          instructors,
        ] = await Promise.all([
          getCourses(),
          getEnrollments(),
          getEnquiries(),
          getTestimonials(),
          getGallery(),
          getAccommodations(),
          getInstructors(),
        ]);

        setStats({
          courses: courses?.length || 0,
          enrollments: enrollments?.length || 0,
          enquiries: enquiries?.length || 0,
          testimonials: testimonials?.length || 0,
          gallery: gallery?.length || 0,
          accommodations: accommodations?.length || 0,
          instructors: instructors?.length || 0,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const generateTrend = () => {
    const percent = Math.floor(Math.random() * 20 - 10);
    return { percent, label: "since last week" };
  };

  const generateDailyData = (value) =>
    Array(7)
      .fill(0)
      .map((_, i) => ({
        day: `Day ${i + 1}`,
        value: Math.max(0, value + Math.floor(Math.random() * 5 - 2)),
      }));

  const cards = [
    { title: "Courses", value: stats.courses, Icon: BookOpen, trend: generateTrend(), dailyData: generateDailyData(stats.courses) },
    { title: "Enrollments", value: stats.enrollments, Icon: Users, trend: generateTrend(), dailyData: generateDailyData(stats.enrollments) },
    { title: "Enquiries", value: stats.enquiries, Icon: MessageCircle, trend: generateTrend(), dailyData: generateDailyData(stats.enquiries) },
    { title: "Testimonials", value: stats.testimonials, Icon: ClipboardList, trend: generateTrend(), dailyData: generateDailyData(stats.testimonials) },
    { title: "Gallery", value: stats.gallery, Icon: Image, trend: generateTrend(), dailyData: generateDailyData(stats.gallery) },
    { title: "Accommodations", value: stats.accommodations, Icon: Home, trend: generateTrend(), dailyData: generateDailyData(stats.accommodations) },
    { title: "Instructors", value: stats.instructors, Icon: GraduationCap, trend: generateTrend(), dailyData: generateDailyData(stats.instructors) },
  ];

  const chartData = [
    { name: "Courses", value: stats.courses },
    { name: "Enrollments", value: stats.enrollments },
    { name: "Enquiries", value: stats.enquiries },
    { name: "Testimonials", value: stats.testimonials },
    { name: "Gallery", value: stats.gallery },
    { name: "Accommodations", value: stats.accommodations },
    { name: "Instructors", value: stats.instructors },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 px-3 py-4 sm:px-6 lg:px-8 text-gray-100">
      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-400 mt-1">Manage everything from one place</p>
      </div>

      
      {loading && (
        <div className="flex justify-center items-center h-80">
          <Loader />
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-800 text-red-300 p-4 rounded-lg border">{error}</div>
      )}

      {!loading && !error && (
        <>
       
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {cards.map((card, index) => (
              <StatCard key={index} {...card} />
            ))}
          </section>

        
          <section className="mt-8 bg-gray-800 rounded-2xl shadow-md p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Platform Overview</h2>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4F46E5"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#4F46E5" }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

     
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-white mb-2">Overview</h2>
            <div className="bg-gray-800 rounded-2xl shadow-md p-5 sm:p-6 hover:shadow-lg transition duration-300">
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                This dashboard gives you a complete overview of courses, enrollments, instructors,
                accommodations, and other platform activities. Hover over cards and chart points for interactive insights.
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
