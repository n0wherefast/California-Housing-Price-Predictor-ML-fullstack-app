
// HOUSEFORM
export type HouseFeatures = {
  longitude: number;
  latitude: number;
  housing_median_age: number;
  total_rooms: number;
  total_bedrooms: number;
  population: number;
  households: number;
  median_income: number;
  ocean_proximity: string;
};

export type PredictionResult = {
  predicted_house_value?: number;
  error?: string;
};