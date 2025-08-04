import { useTheme } from "../../context/ThemeContext";
import Chart from "../../components/charts/chart";
import Widget from "../../components/ui/widget";

export default function Home() {
  const { theme } = useTheme();

  return (
    <div className="home-container">
      {/* <h1 className="dark:text-white text-2xl font-bold mb-4">
        {theme === "dark" ? "Dark Mode Home" : "Light Mode Home"}
      </h1> */}
      {/* <div class=""></div> */}
      <Chart />
      <Widget />
    </div>
  );
}
