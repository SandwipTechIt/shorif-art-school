import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";

const ApexChart = ({ data = [] }) => {
  // derive numeric series from incoming data
  const series = useMemo(
    () => [
      {
        name: "Money Received",
        data: data.map((d) => Number(d.totalPaidAmount ?? 0)),
      },
    ],
    [data]
  );

  const options = useMemo(
    () => ({
      chart: {
        height: 350,
        type: "area",
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      title: {
        text: "Money Received - Last 12 Months",
        align: "center",
        style: { fontSize: "18px", fontWeight: "bold", color: "#555" },
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" },
      xaxis: {
        type: "category",
        categories: data.map((d) => d.month || ""), // month labels from your data
      },
      tooltip: {
        y: {
          formatter: (val) => `৳ ${Number(val).toLocaleString()}`,
        },
      },
      yaxis: {
        labels: {
          formatter: (value) => `৳ ${Number(value).toLocaleString()}`,
        },
      },
      grid: { show: true, borderColor: "#e0e0e0", strokeDashArray: 2 },
      animations: { enabled: true },
    }),
    [data]
  );

  return (
    <div className="chart-container">
      <div id="chart">
        <ReactApexChart options={options} series={series} type="area" height={350} />
      </div>
    </div>
  );
};

export default ApexChart;
