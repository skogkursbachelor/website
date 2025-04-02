/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PROBABLESOILMOISTURE_URL: string
    readonly VITE_SUPERFICIALDEPOSITS_URL: string
    readonly VITE_FORESTRYROADS_URL: string
    readonly VITE_FROSTDEPTH_URL: string
    readonly VITE_COPERNICUS_URL: string
    readonly VITE_API_PORT: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}