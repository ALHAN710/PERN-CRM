/// <reference types="vite/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
    // ========== RESTFUL API BASE URL ==========
    readonly VITE_API_BASE_URL: string;
    

    // ========== REACT ROUTER PATH ==========
    readonly VITE_REACT_ROUTER_CUSTOMERS_URL: string;
    readonly VITE_REACT_ROUTER_INVOICES: string;
    readonly VITE_REACT_ROUTER_USERS: string;
    readonly VITE_REACT_ROUTER_LOGIN: string;

    // ========== FIREBASE PARAMETERS ==========
    readonly VITE_FIREBASE_API_KEY: string;
    readonly VITE_FIREBASE_AUTH_DOMAIN: string;
    readonly VITE_FIREBASE_PROJECT_ID: string;
    readonly VITE_FIREBASE_APP_ID: string;
    
    // more env variables
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}