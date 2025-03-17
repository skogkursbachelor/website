/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_NCWMS_URL: string
    readonly VITE_PROBABLESOILMOISTURE_URL: string
    readonly VITE_SUPERFICIALDEPOSITS_URL: string
    readonly VITE_FORESTRYROADS_URL: string
    readonly VITE_FROSTDEPTH_URL: string
    readonly VITE_COPERNICUS_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}