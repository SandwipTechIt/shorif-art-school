import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const ApexChart = () => {
  const [state, setState] = useState({
    series: [{ name: "Money Received", data: [] }],
    options: {
      chart: {
        height: 350,
        type: "area",
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      title: {
        text: "Money Received - Last 12 Months",
        align: "center",
        style: {
          fontSize: "18px",
          fontWeight: "bold",
          color: "#555",
        },
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" },
      xaxis: {
        type: "category",
        categories: [],
      },
      tooltip: {
        x: {
          formatter: (value) => value,
        },
      },
      yaxis: {
        labels: {
          formatter: (value) => `৳ ${value.toLocaleString()}`,
        },
      },
      grid: {
        show: true,
        borderColor: "#e0e0e0",
        strokeDashArray: 2,
      },
      interactions: {
        hover: {
          enabled: false,
        },
      },
      animations: {
        enabled: true,
      },
      // fill: {
      //   type: "gradient",
      //   gradient: {
      //     shadeIntensity: 1,
      //     opacityFrom: 0.7,
      //     opacityTo: 0.3,
      //     stops: [0, 200],
      //   },
      // },
    },
  });

  useEffect(() => {
    // Generate last 12 months labels
    const today = new Date();
    const months = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const formattedMonth = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      months.push(formattedMonth);
    }

    // Dummy data for the last 12 months
    const dummyData = [
      3200, 1600, 3200, 1600, 3200, 1600, 3200, 1600, 3200, 1600, 3200, 1600,
    ];

    setState((prev) => ({
      ...prev,
      series: [{ ...prev.series[0], data: dummyData }],
      options: {
        ...prev.options,
        xaxis: {
          ...prev.options.xaxis,
          categories: months,
        },
      },
    }));
  }, []);

  return (
    <div className="chart-container">
      <div id="chart">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
};

export default ApexChart;
