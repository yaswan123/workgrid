import { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";

const TaskBar = () => {
    const [taskData, setTaskData] = useState([]);

    const userId = useSelector((state) => state.user.user._id);
    useEffect(() => {
        const fetchTaskData = async () => {
            try {
                const response = await axios.get(`https://work-grid.vercel.app/task/getDayWiseTaskCount/${userId}`);
                const { dayWiseCounts } = response.data;

                // Prepare data for the chart
                const now = new Date();
                const chartData = dayWiseCounts.map((count, index) => {
                    const date = new Date();
                    date.setDate(now.getDate() - (6 - index));
                    const day = date.toLocaleDateString("en-US", { weekday: "short" });
                    return { day, count };
                });

                setTaskData(chartData);
            } catch (error) {
                console.error("Error fetching task data:", error);
            }
        };

        fetchTaskData();
    }, [userId]);

    return (
        <div className="bg-white p-4 rounded-xl shadow-md max-w-4xl mx-auto w-full">
            <h2 className="text-xl font-semibold text-center mb-4">Tasks Created in Last 7 Days</h2>
            <div className="w-full h-72 sm:h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taskData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#4f46e5" radius={[5, 5, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TaskBar;
