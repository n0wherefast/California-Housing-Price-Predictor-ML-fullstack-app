import React from 'react'
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), {ssr: false,});
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {HeatMapProps ,HouseFeatures} from "../ref/types"


function BarchartMedianIncome({distIncome}:any) {
  return (
    <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Distribuzione del reddito medio
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={distIncome} margin={{ top: 10, right: 5, bottom: 20, left: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />

                    {/* <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} /> */}
                    {/* <Tooltip
                    formatter={(value: number) =>
                        `${value.toLocaleString("it-IT")} case`
                    }
                    /> */}
                <XAxis
                    dataKey="bin"
                    tick={{ fontSize: 11 }}
                    interval={0}           // mostra tutte le etichette
                    angle={-45}            // ruota le etichette
                    textAnchor="end"
                    height={70}            // spazio per evitare sovrapposizioni
/>
                  <YAxis
                    tick={{ fontSize: 12 }}
                    label={{
                        value: "Numero di case",
                        angle: -90,
                        position: "insideLeft",
                        offset: 0,
                        style: { textAnchor: "middle" },
                    }}
                    />
        
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>      
    </div>
  )
}





function BarchartDistAge({distAge}:any) {
  return (
    <div>
       <h3 className="text-xl font-semibold mt-10 mb-3 text-gray-800">
        Distribuzione dell’età mediana delle abitazioni
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={distAge}>
          <CartesianGrid strokeDasharray="3 3" />
        <XAxis
                    dataKey="bin"
                    tick={{ fontSize: 11 }}
                    interval={0}           // mostra tutte le etichette
                    angle={-45}            // ruota le etichette
                    textAnchor="end"
                    height={70}            // spazio per evitare sovrapposizioni
/>
                  <YAxis
                    tick={{ fontSize: 12 }}
                    label={{
                        value: "Numero di case",
                        angle: -90,
                        position: "insideLeft",
                        offset: 0,
                        style: { textAnchor: "middle" },
                    }}
                    />

          <Tooltip />
          <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    
    </div>
  )
}
function BarchartDistValueHouse({distValue}:any) {
  return (
    <div>
        <h3 className="text-xl font-semibold mt-10 mb-3 text-gray-800">
               Distribuzione del valore mediano delle abitazioni
             </h3>
               <ResponsiveContainer width="100%" height={300}>
                   <BarChart data={distValue}>
                   <CartesianGrid strokeDasharray="3 3" />
                 <XAxis
                    dataKey="bin"
                    tick={{ fontSize: 11 }}
                    interval={0}           // mostra tutte le etichette
                    angle={-30}            // ruota le etichette
                    textAnchor="end"
                    height={70}            // spazio per evitare sovrapposizioni
/>
                  <YAxis
                    tick={{ fontSize: 12 }}
                    label={{
                        value: "Numero di case",
                        angle: -90,
                        position: "insideLeft",
                        offset: 0,
                        style: { textAnchor: "middle" },
                    }}
                    />
                   <Tooltip
                       formatter={(value: number, name: string) =>
                           [`${value.toLocaleString("it-IT")} case`, "Conteggio"]
                       }
                       />
       
                   <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
                   </BarChart>
               </ResponsiveContainer>
    
    </div>
  )
}




function HeatMap({data}:HeatMapProps) {
  return (
    <div>
        <h3 className="text-xl font-semibold mt-10 mb-3 text-gray-800">
                Matrice di correlazione tra le variabili numeriche
            </h3>
            <div className="bg-gray-50  rounded-lg shadow  min-w-[300px] sm:min-w-[700px] md:min-w-[900px]">
            {data.correlations ? (
                <Plot
                data={[
                    {
                    z: Object.values(data.correlations).map((row) =>Object.values(row)),
                    x: Object.keys(data.correlations),
                    y: Object.keys(data.correlations),
                    type: "heatmap",
                    colorscale: "RdBu",
                    reversescale: true,
                    zmin: -1,
                    zmax: 1,
                    showscale: true,
                    colorbar: {
                        title: {
                            text: "Correlazione",
                            side: "right",
                            font: { size: 12, color: "#333" },
                        },
                        tickfont: { size: 10 },
                    },
                    },
                ]}
                layout={{
            autosize: true,
            height: 600,
            margin: { l: 0, r: 0, b: 100, t: 40 },
            xaxis: {
                tickangle: 45,
                side: "bottom",
                automargin: true,
            },
            yaxis: {
                autorange: "reversed",
                automargin: true,
                tickangle: 45,
            },
            font: { family: "Inter, sans-serif", size: 10 },

            // ✅ Aggiungi annotazioni dinamiche
            annotations: (() => {
                const keys = Object.keys(data.correlations);
                const z = Object.values(data.correlations).map((row) =>
                Object.values(row)
                );

                const annotations: any[] = [];
                for (let i = 0; i < keys.length; i++) {
                for (let j = 0; j < keys.length; j++) {
                    const value = z[i][j];
                    if (value !== null && value !== undefined) {
                    annotations.push({
                        x: keys[j],
                        y: keys[i],
                        text: value.toFixed(2),
                        showarrow: false,
                        font: {
                        color:
                            Math.abs(value) > 0.5
                            ? "white" // testo chiaro su colore intenso
                            : "black",
                        size: 10,
                        family: "Inter, sans-serif",
                        },
                    });
                    }
                }
                }
                return annotations;
            })(),
            }}
                 style={{ width: "100%", height: "100%" }}
                useResizeHandler={true}
                config={{ responsive: true, displayModeBar: false }}
                />
            ) : (
                <p className="text-center text-gray-500">Nessun dato di correlazione disponibile</p>
            )}
            </div>
    
    </div>
  )
}


export {BarchartMedianIncome, BarchartDistAge,BarchartDistValueHouse,HeatMap};