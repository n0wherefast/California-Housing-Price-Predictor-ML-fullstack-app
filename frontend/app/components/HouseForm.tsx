"use client";

import { useState } from "react";
import {HouseFeatures} from "../ref/types"

export type PredictionResult = {
  predicted_house_value?: number | string;
  error?: string;
};


export default function HouseForm() {
  const [form, setForm] = useState<HouseFeatures>({
    longitude: -122.23,
    latitude:  37.88,
    housing_median_age:  41.0,
    total_rooms: 8,
    total_bedrooms: 2,
    population: 322.0,
    households:  126.0,
    median_income: 8.3252,
    ocean_proximity: "NEAR BAY",
  });

const [result, setResult] = useState<PredictionResult | null>({});

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> ) => {
    const { name, value } = e.target;
    setForm({
      ...form,[name]:name === "ocean_proximity" ? value : parseFloat(value) || 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
       await new Promise((resolve) => setTimeout(resolve, 3000));
      const data = await res.json();
      setResult(data);
      console.log(data)
    } catch {
      setResult({ error: "Errore di connessione al server Flask" });
    } finally {
      setLoading(false);
    }
  };
  function formatCurrency(value: string | number | undefined) {
  const num = Number(value);
  if (isNaN(num)) return " ";
  return num.toLocaleString("it-IT", {
    style: "currency",
    currency: "USD",
  });
}

  return (
      <div className="flex flex-col md:flex-row gap-10   md:p-2 md:px-4 px-1  md:mt-4">
        <div className="w-full grid grid-cols-1 gap-2 border-2 rounded-2xl border-indigo-400 p-3">
              <div className="md:max-w-[35vw] pl-2 py-4 text-white ">
                <div className="flex p-2 gap-4">
                  <p className="bg-slate-500 p-1 md:px-2 px-1 rounded-2xl  text-xs h-6 w-full md:w-auto ">Machine Learning</p>
                  <p className="bg-slate-500 p-1 md:px-2 px-1 rounded-2xl text-xs w-full  md:w-auto ">Data Analisys</p>
                  <p className="bg-slate-500 p-1 md:px-2 px-1 rounded-2xl  text-xs md:w-auto  ">AI</p>
                </div>
                <h1 className="max-w-[80%] text-3xl md:text-4xl font-extrabold">California Housing Price Predictor</h1>
                <p className="text-xl md:text-2xl">
                  Inserisci le catteristice dell&lsquo;area e ottieni una stima del valora mediano delle abitazioni
                </p>
              </div>
        
                <form
                  onSubmit={handleSubmit}
                  className="bg-white md:w-2xl shadow-lg rounded-2xl p-6  "
                >
                  <h2 className="text-2xl font-bold text-center text-sky-500 mb-6">
                    Predizione Prezzo Casa 
                  </h2>

                  {/* 🔹 GRID mobile-first */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      ["longitude", "Longitude"],
                      ["latitude", "Latitude"],
                      ["housing_median_age", "Housing Median Age"],
                      ["total_rooms", "Total Rooms"],
                      ["total_bedrooms", "Total Bedrooms"],
                      ["population", "Population"],
                      ["households", "Households"],
                      ["median_income", "Median Income"],
                    ].map(([key, label]) => {
                      const field = key as keyof HouseFeatures;
                    return( <div key={key} className="flex flex-col">
                        <label
                          htmlFor={key}
                          className="text-sm font-semibold text-gray-700 mb-1"
                        >
                          {label}
                        </label>
                        <input
                          type="text"
                          id={key}
                          name={key}
                          value={form [field]}
                          onChange={handleChange}
                          className="border  border-gray-500 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`Inserisci ${label.toLowerCase()}`}
                          title={label}
                        />
                      </div>)
                    })}
                  </div>

                  {/* 🔹 Select - Ocean Proximity */}
                  <div className="mt-4">
                    <label
                      htmlFor="ocean_proximity"
                      className="text-sm font-semibold text-gray-700 mb-1 block"
                    >
                      Ocean Proximity
                    </label>
                    <select
                      id="ocean_proximity"
                      name="ocean_proximity"
                      value={form.ocean_proximity}
                      onChange={handleChange}
                      className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="NEAR BAY">Near Bay</option>
                      <option value="INLAND">Inland</option>
                      <option value="NEAR OCEAN">Near Ocean</option>
                      <option value="ISLAND">Island</option>
                      <option value="1H OCEAN">1H Ocean</option>
                    </select>
                  </div>

                  {/* 🔹 Submit Button */}
                  <div className="flex w-full justify-center">
                    
                <button
                    type="submit"
                    disabled={loading}
                    className={`mt-6 w-1/2 bg-slate-800 hover:bg-sky-700 text-white font-semibold py-1 rounded-lg shadow transition-colors ${
                      loading
                        ? " cursor-not-allowed flex items-center justify-center  rounded-lg  bg-linear-to-r from-green-400  via-pink-500 to-yellow-400 animate-gradient"
                        : ""
                    }`}
                  >
                    {loading ? (
                      <div className="bg-slate-600 rounded-md w-[97%] text-sm flex items-center justify-center h-6">
                          Calcolo in corso..
                      </div>
                    ) : (
                      "Predici Valore"
                    )}
                  </button></div>
                
                </form>
        </div>


            <div className="max-w-sm   text-white bg-trasparent "> 
                  <div className="bg-slate-900 mb-4 px-4 py-4 text-white border-2 rounded-lg border-indigo-400">
                  {/* <div className=" gap-4 mb-4 w-[20vw] flex flex-col p-4 py-3 justify-start  h-1/4 bg-slate-800  border-2 border-indigo-400  "> */}
                    <h1 className=" text-2xl flex justify-start  w-full ">Valore stimato</h1>
                    {result && (
                    <div className="h-12 text-center flex justify-start items-center">
                      {result.error ? (
                        <p className="text-red-500">{result.error}</p>
                      ) : (
                      <p className="text-4xl font-semibold  transition-opacity duration-700 opacity-100">
                        {result? formatCurrency(typeof result.predicted_house_value === "string" ? parseFloat(result.predicted_house_value) : result.predicted_house_value ?? 0 ) : ( <p>00.0</p>) }  
                      </p>
                      )}
                    </div>
                  )}
                  <p className=" font-light">Stima per valore mediano area</p>
                    </div>

                <div className="bg-slate-900 px-4 py-4 text-white border-2 rounded-lg border-indigo-400">
                      <h2 className="mt-2 max-w-2xl mx-auto text-md">
                      <p className="text-2xl">Questa Web App</p> utilizza un modello Machine Learning di regressione lineare allenato
                      sul dataset California Housing per stimare i prezzi medi delle case
                      in base a posizione, età, popolazione e reddito medio.
                    </h2>
                </div>
            </div>    
          </div>
          
  );
}
