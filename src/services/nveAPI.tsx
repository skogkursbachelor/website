import { useEffect, useState } from "react";

// Request body for NVE API
export interface RequestDataNVE {
  Theme: string;
  StartDate: string;
  EndDate: string;
  Format: string;
  Rings: {
    rings: number[][][];
    spatialReference: { wkid: number };
  };
}

interface CellTimeSeries {
  Altitude: number;
  CellIndex: number;
  Data: number[];
}

export interface ResponseDataNVE {
  Theme: string;
  FullName: string;
  NoDataValue: number;
  StartDate: string;
  EndDate: string;
  PrognoseStartDate: string;
  Unit: string;
  TimeResolution: string;
  CellTimeSeries: CellTimeSeries[];
}

const fetchRasterData = async (apiURL: string, requestData: RequestDataNVE) => {
  const response = await fetch(apiURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
};

export const getRasterData = (apiUrl: string, requestData: RequestDataNVE) => {
  const [data, setData] = useState<ResponseDataNVE | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchRasterData(apiUrl, requestData)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [apiUrl, requestData]);

  return { data, loading, error };
};
