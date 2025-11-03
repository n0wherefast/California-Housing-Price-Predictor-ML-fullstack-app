
// HOUSEFORM
export type HouseFeatures = {
  longitude: number| string;
  latitude: number| string;
  housing_median_age: number| string;
  total_rooms: number | string;
  total_bedrooms: number| string;
  population: number| string;
  households: number| string;
  median_income: number| string;
  ocean_proximity: string| string;
};

export type PredictionResult = {
  predicted_house_value?: number | string;
  error?: string;
};



// CHART

export interface BarchartProps {
  distIncome: [Record<string, number>];
  distAge: [Record<string, number>];
  distValue: [Record<string, number>];
}

export interface SummaryStats {
  [variable: string]: {
    mean: number;
    median: number;
    std: number;
    min: number;
    max: number;
    count?: number; // opzionale
  };
}

export interface Distributions {
  [variable: string]: Record<string, number>;
}

export interface GeoSample {
  latitude: number;
  longitude: number;
  median_house_value: number;
  median_income?: number;
  housing_median_age?: number;
}

export interface Props {
  data: GeoSample[];
}
 export interface Correlations {
  [key: string]: { [key: string]: number };
}
export type EdaData = {
    summary_stats: SummaryStats;
    distributions:Distributions
    correlations: Correlations;
    geo_sample: GeoSample[];
};



export interface HeatMapProps {
  data: { correlations: Correlations };

}

  // METRICS
  
export type Metrics = {
  R2_train: number;
  R2_test: number;
  MAE: number;
  RMSE: number;
  error?: string;
};