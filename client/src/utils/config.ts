
// RESTFUL API endpoints
export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const apiCustomersUrl = apiBaseUrl + '/customers';

export const apiInvoicesUrl = apiBaseUrl + '/invoices';

export const apiUsersUrl = apiBaseUrl + '/users';
export const apiUsersSignUpUrl = apiUsersUrl + '/signup';

// ========= Firebase =========
export const firebaseApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
export const firebaseAuthDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
export const firebaseProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
export const firebaseAppId = import.meta.env.VITE_FIREBASE_APP_ID;

// ========== REACT ROUTER URL ==========
export const customersPath = import.meta.env.VITE_REACT_ROUTER_CUSTOMERS_PATH;
export const invoicesPath = import.meta.env.VITE_REACT_ROUTER_INVOICES_PATH;
export const usersPath = import.meta.env.VITE_REACT_ROUTER_USERS_PATH;
export const usersRegisterPath = usersPath + "/signup";
export const loginPath = import.meta.env.VITE_REACT_ROUTER_LOGIN_PATH;
