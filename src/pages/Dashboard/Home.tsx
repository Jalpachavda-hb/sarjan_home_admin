import HomeCard from "../../components/HomeCard/HomeCard";

import TodayReceivedpayment from "../../components/HomeCard/TodayReceivedpayment";

// Adjust the path as necessary
export default function Home() {
  return (
    <>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <h3 className="text-lg font-semibold mb-5">Dashboard</h3>
          <HomeCard />
        </div>

        <div className="col-span-12">
          <TodayReceivedpayment />
        </div>
      </div>
    </>
  );
}
