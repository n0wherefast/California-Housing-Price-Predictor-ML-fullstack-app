import HouseForm from "./components/HouseForm";
import EDA from "./components/EDA";
import AboutPage from "./about/page";
import MetricsPage from "./metrics/page";

export default function Home() {
  return (
    <div className=" p-2 grid grid-cols-1 md:grid-cols-2   ">
        <div className="flex-col md:flex w-full gap-2">
          <HouseForm />
          <div id="AB"/>
          <AboutPage/>
          <div id="MT"/>
          <MetricsPage/>
          
        </div>
        <div>
          <div id="EDA"/>
            <EDA/>
        </div>
    </div>
  );
}
