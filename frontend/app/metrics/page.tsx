"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {Metrics} from "../ref/types"


export default function MetricsPage() {
  
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/metrics`);
        const data = await res.json();
        setMetrics(data);
      } catch {
        setMetrics({
          R2_train: 0,
          R2_test: 0,
          MAE: 0,
          RMSE: 0,
          error: "Errore nel recupero metriche",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);


   const formatCurrency = (v: number) =>
    `$${v.toLocaleString("it-IT", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
  // Dati per i grafici

  const r2Data =
  metrics && metrics.R2_train !== undefined && metrics.R2_test !== undefined
    ? [
        { name: "Train", value: metrics.R2_train },
        { name: "Test", value: metrics.R2_test },
      ]
    : [];

const errorData =
  metrics && metrics.MAE !== undefined && metrics.RMSE !== undefined
    ? [
        { name: "MAE", value: metrics.MAE },
        { name: "RMSE", value: metrics.RMSE },
      ]
    : [];


 // 🔍 Calcolo differenza R2 per interpretazione
  const spread =  metrics?.R2_train && metrics.R2_test !== undefined ?   (metrics.R2_train - metrics.R2_test) : 0;
  const modelStatus =
    spread > 0.1
      ? "⚠️ Overfitting"
      : spread < -0.05
      ? "📉 Underfitting"
      : "✅ Modello Bilanciato";

  return (

    <div className="max-w-5xl mx-auto bg-white p-8 mt-10 rounded-2xl shadow-md border-2 border-indigo-400">
          
      <h2 className="text-3xl font-bold text-sky-500 mb-6 text-center">
        📊 Model Performance Metrics
      </h2>

      {loading ? (
                <div className="flex justify-center items-center h-32">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : metrics?.error ? (
                <p className="text-red-600 text-center">{metrics.error}</p>
            ) : (
            <>
                
                {/* 🔹 R² Metriche numeriche */}
                <div className="grid grid-cols-2 gap-6 text-center mb-8">
                    <div className="bg-gray-100 p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-700">R² Train</h3>
                        <p className="text-2xl font-bold text-blue-700 mt-2">
                            {metrics!.R2_train.toFixed(3)}
                        </p>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-700">R² Test</h3>
                        <p className="text-2xl font-bold text-blue-700 mt-2">
                            {metrics!.R2_test.toFixed(3)}
                        </p>
                    </div>
                </div>



                    {/* 🧠 Stato modello */}
                <p className="text-center mb-8 font-semibold text-gray-700">
                    Stato del modello:{" "}
                    <span
                    className={
                        spread > 0.1
                        ? "text-yellow-600"
                        : spread < -0.05
                        ? "text-red-600"
                        : "text-green-600"
                    }
                    >
                    {modelStatus}
                    </span>
                </p>


                {/* 📈 Grafico R² */}
            <div className="bg-gray-50 p-6 rounded-lg shadow mb-10">
                <h3 className="text-xl font-semibold mb-4 text-center text-sky-700">
                R² Train vs Test
                </h3>
                <p className="text-gray-600 text-center mt-6">
                    <strong>R²</strong> indica quanto il modello spiega la varianza dei dati.  
                </p>
                <ResponsiveContainer width="100%" height={300}>
                <BarChart data={r2Data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 1]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            </div>
            <div>
            {/* 📋 Riassunto numerico */}
                <div className="grid grid-cols-2 gap-6 text-center mb-8">
                    <div className="bg-gray-100 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700">MAE</h3>
                    <p className="text-2xl font-bold text-blue-700 mt-2">
                       ${metrics?.MAE.toLocaleString()}
                    </p>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700">RMSE</h3>
                    <p className="text-2xl font-bold text-blue-700 mt-2">
                        ${metrics?.RMSE.toLocaleString()}
                    </p>
                    </div>
                </div>
            </div>


           {/* 💰 Grafico MAE e RMSE */}
            <div className="bg-gray-50 p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4 text-center text-sky-700">
                MAE e RMSE (Errori in $)
                </h3>
                <p className="text-gray-600 text-center mt-6"> 
                <strong>MAE</strong> e <strong>RMSE</strong> sono in dollari, arrotondati a un decimale.
            </p>
                <ResponsiveContainer width="100%" height={300}>
                <BarChart data={errorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                    <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            </div>
        </>
      )}

      <p className="text-gray-600 text-center mt-6">
        Le metriche vengono calcolate durante l’addestramento del modello e
        aggiornate automaticamente nel backend.
      </p>
    </div>
  );
}
