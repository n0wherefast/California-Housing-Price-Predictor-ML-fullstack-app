'use client'
import React from "react";
import dynamic from "next/dynamic";

import { useEffect, useState } from "react";
import {EdaData} from "../ref/types";


const BarchartMedianIncome = dynamic(
  () => import("./BarChart").then(mod => mod.BarchartMedianIncome),
  { ssr: false }
);
const BarchartDistAge = dynamic(
  () => import("./BarChart").then(mod => mod.BarchartDistAge),
  { ssr: false }
);

const BarchartDistValueHouse = dynamic(
  () => import("./BarChart").then(mod => mod.BarchartDistValueHouse),
  { ssr: false }
);

const HeatMap = dynamic(
  () => import("./BarChart").then(mod => mod.HeatMap),
  { ssr: false }
);


const GeoMapLeaflet = dynamic(() => import("./GeoMapPlotly"), { ssr: false });



function EDA() {
        const [data, setData] = useState<EdaData | null>(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            console.log("🌐 Fetch EDA da:", `${process.env.NEXT_PUBLIC_API_URL}/eda`);

            fetch(`${process.env.NEXT_PUBLIC_API_URL}/eda`, {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                },
                mode: "cors",
            })
                .then(async (res) => {
                console.log("✅ Risposta ricevuta:", res.status, res.statusText);
                const text = await res.text(); // leggiamo sempre il testo grezzo
                try {
                    const json = JSON.parse(text);
                    console.log("📦 JSON ricevuto:", json);
                    setData(json);
                } catch (err) {
                    console.error("⚠️ Errore nel parse JSON:", text, err);
                    throw err;
                }
                })
                .catch((err) => console.error("❌ Errore caricamento EDA:", err))
                .finally(() => setLoading(false));
            }, []);





        const makeDist = (obj: Record<string, number>) => {
            const arr = Object.entries(obj).map(([bin, count]) => ({
                bin,
                count,
                left: parseFloat(bin.split("–")[0]),
            }));
            arr.sort((a, b) => a.left - b.left);
            return arr;
        };


        if (loading)
            return (
            <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            );

        if (!data)
            return (
            <p className="text-center text-red-600">
                Errore nel caricamento dei dati EDA
            </p>
            );

        // Preparo i dati
        const distIncome = makeDist(data.distributions.median_income);
        const distAge = makeDist(data.distributions.housing_median_age);
        const distValue = makeDist(data.distributions.median_house_value);

        return (
        <div className=" max-w-5xl mx-auto md:p-8 bg-white mt-10 rounded-2xl shadow border-2 border-indigo-400">
            
                    {/* <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
                        📊 Analisi Esplorativa dei Dati (EDA)
                    </h2> */}
                    <h2 className="text-2xl font-extrabold text-slate-700 p-2 mb-4 flex items-center justify-center gap-2">
                    Analisi Esplorativa dei Dati (EDA)
                    <span className="text-gray-400 text-lg cursor-help" title="Exploratory Data Analysis: visualizza distribuzioni e correlazioni tra variabili.">📊 </span>
                    </h2>

                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed text-justify mb-5 p-2">
                        L’analisi esplorativa (EDA) mostra la distribuzione delle principali variabili
                        numeriche e le loro relazioni. Si osserva una forte{" "}
                        <span className="font-semibold text-sky-600">
                            correlazione positiva
                        </span>{" "}
                        tra il <span className="font-semibold">reddito medio</span> e il{" "}
                        <span className="font-semibold">valore mediano delle abitazioni</span>,
                        mentre altre variabili come l’età delle case e la posizione geografica
                        hanno un’influenza minore. Queste informazioni aiutano a comprendere i
                        fattori che determinano il prezzo delle abitazioni in California.
                    </p>

                    <p className="text-gray-600 text-center mb-5 text-2xl">
                        Grafici dinamici generati dal backend Flask sul dataset California Housing.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg shadow">     {/* 🗺️ Distribuzione geografica interattiva */}
                        <GeoMapLeaflet data={data.geo_sample}/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-3">
                        
                        <div className="bg-gray-50 p-4 rounded-lg shadow">
                           <BarchartMedianIncome distIncome={distIncome}/>   {/* 📈 Distribuzione del reddito */}
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg shadow">
                             <BarchartDistAge distAge={distAge}/> {/* 🏠 Distribuzione età case */}
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg shadow">
                             <BarchartDistValueHouse distValue={distValue}/>{/* 💰 Distribuzione valore case */}   
                        </div>
                       
                       
                    </div>
                    <HeatMap data={data}/>     
        </div>
        );
}

export default EDA
