import { getApi } from "../../api";
import { useQuery } from "@tanstack/react-query";

import Loader  from "../../components/ui/loader";
import ErrorMessage from "../../components/ui/errorMessage";

import Chart from "../../components/charts/chart";
import Widget from "../../components/ui/widget";

export default function Home() {

  const { data: statics, isLoading, isError } = useQuery({
    queryKey: ["statics"],
    queryFn: () => getApi("/getStatics"),
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  if (isLoading ) {
    return <Loader />;
  }
  if (isError) {
    return <ErrorMessage />
  }
  return (
    <div className="home-container">
      {/* <h1 className="dark:text-white text-2xl font-bold mb-4">
        {theme === "dark" ? "Dark Mode Home" : "Light Mode Home"}
      </h1> */}
      {/* <div class=""></div> */}
      <Chart data={statics.last12MonthsPaidAmount} />
      <Widget courseEnrollmentCounts={statics.courseEnrollmentCounts} students={statics.totalStudents} courses={statics.totalCourses} discount={statics.totalDiscount} paidAmount={statics.totalPaidAmount} />
    </div>
  );
}
