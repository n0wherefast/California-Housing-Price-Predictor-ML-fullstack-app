'use client'
import HouseForm from "./components/HouseForm";
import AboutPage from "./about/page";
import MetricsPage from "./metrics/page";
import dynamic from "next/dynamic";

const EDA = dynamic(() => import("./components/EDA"), { ssr: false });


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
