"use client";

import { useState } from "react";
import {HouseFeatures,PredictionResult} from "../ref/types"

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

  const [result, setResult] = useState<PredictionResult | null>(null);
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


  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Predizione Prezzo Casa 🏡
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 text-black">
        {Object.keys(form).map((key) =>
          key !== "ocean_proximity" ? (
          <div key={key}> 
                <p>{key}</p>
                <input
                // key={key}
                type="number"
                name={key}
                placeholder={key}
                value={(form as any)[key]}
                onChange={handleChange}
                className="border p-2 rounded"
                required
                />
            </div> 
          ) : (
            <select
              key={key}
              name={key}
              value={form.ocean_proximity}
              onChange={handleChange}
              className="border p-2 rounded col-span-2"
            >
              <option>NEAR BAY</option>
              <option>INLAND</option>
              <option>NEAR OCEAN</option>
              <option>ISLAND</option>
              <option>1H OCEAN</option>
            </select>
          )
         )
        }
        
        <button
          type="submit"
          disabled={loading}
          className={`col-span-2 text-white font-semibold py-2 rounded transition ${
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
        </button>
      </form>

      {result && (
        <div className="mt-6 text-center">
          {result.error ? (
            <p className="text-red-500">{result.error}</p>
          ) : (
           <p className="text-xl font-semibold text-green-600 transition-opacity duration-700 opacity-100">
              💰 Valore stimato: {" "}
              { formatCurrency(result.predicted_house_value?? 0)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
