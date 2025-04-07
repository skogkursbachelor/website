/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PROBABLESOILMOISTURE_URL: string
    readonly VITE_SUPERFICIALDEPOSITS_URL: string
    readonly VITE_FORESTRYROADS_URL: string
    readonly VITE_SENORGEWMS_URL: string
    readonly VITE_COPERNICUS_URL: string
    readonly VITE_API_PORT: string
    readonly VITE_LEGEND_SOILSATURATION_URL: string
    readonly VITE_LEGEND_SOILMOISTURE_URL: string
    readonly VITE_LEGEND_PROBABLESOILMOISTURE_URL: string
    readonly VITE_LEGEND_SUPERFICIALDEPOSITS_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}