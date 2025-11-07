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

const [result, setResult] = useState<PredictionResult | null>({
  predicted_house_value: "Valore stimato: ",
});

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
    currency: "EUR",
  });
}

  return (
        <div className="flex justify-center gap-10 md:max-h-[74vh] md:min-h-[60vh] p-6 px-4  mt-4">
        
      <form
        onSubmit={handleSubmit}
        className="bg-white w-3xl shadow-lg rounded-2xl p-6  border-2 border-indigo-400 "
      >
        <h2 className="text-2xl font-bold text-center text-sky-500 mb-6">
          Predizione Prezzo Casa 🏠
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
        <div className="flex w-full justify-center"><button
          type="submit"
          disabled={loading}
          className={`mt-6 w-1/2 bg-sky-500 hover:bg-sky-700 text-white font-semibold py-3 rounded-lg shadow transition-colors ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Calcolo in corso...
            </div>
          ) : (
            "Predici Valore"
          )}
        </button></div>
        <div className="border-2 border-slate-500 mt-3 w-full  rounded-lg ">
         {result && (
        <div className="h-12 text-center flex justify-center items-center">
          {result.error ? (
            <p className="text-red-500">{result.error}</p>
          ) : (
           <p className="text-xl font-semibold text-green-600 transition-opacity duration-700 opacity-100">
              💰 Valore stimato: {" "}
            {formatCurrency(
                typeof result.predicted_house_value === "string" ? parseFloat(result.predicted_house_value) : result.predicted_house_value ?? 0
                )
}
            </p>
          )}
        </div>
      )}
         </div>
      </form>
      {/* <div className="max-w-2xl "> Questa web app utilizza un modello Machine Learning di regressione lineare allenato
            sul dataset California Housing per stimare i prezzi medi delle case
            in base a posizione, età, popolazione e reddito medio.</div> */}
    </div>
  );
}
