// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Alert } from 'react-native';

// // ✅ Use 10.0.2.2 for Android Emulator (localhost of your PC)
// export const BASE_URL = 'https://api_p2p.thepvhub.com/api/v1';
// export const AI_CHATBOT_URL = 'https://api_p2p.thepvhub.com/api/ai';

// // Main API instance
// const api = axios.create({
//     baseURL: BASE_URL,
//     headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//         'Cache-Control': 'no-cache',
//         Connection: 'keep-alive',
//     },
// });

// // Public API (no auth)
// export const publicApi = axios.create({
//     baseURL: BASE_URL,
// });

// // ---- Token Helpers ----
// export const getAccessToken = async () => {
//     return AsyncStorage.getItem('ACCESS_TOKEN');
// };

// export const getRefreshToken = async () => {
//     return AsyncStorage.getItem('REFRESH_TOKEN');
// };

// export const setTokens = async ({ accessToken, refreshToken }) => {
//     if (accessToken) await AsyncStorage.setItem('ACCESS_TOKEN', accessToken);
//     if (refreshToken) await AsyncStorage.setItem('REFRESH_TOKEN', refreshToken);
// };

// export const clearTokens = async () => {
//     await AsyncStorage.multiRemove(['ACCESS_TOKEN', 'REFRESH_TOKEN']);
// };

// // ---- Refresh Token ----
// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//     failedQueue.forEach((prom) => {
//         if (error) prom.reject(error);
//         else prom.resolve(token);
//     });
//     failedQueue = [];
// };

// const refreshToken = async () => {
//     try {
//         const refreshToken = await getRefreshToken();
//         if (!refreshToken) throw new Error('No refresh token');

//         const res = await publicApi.post('/user/refresh-token', {
//             refreshToken,
//         });

//         const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data;

//         await setTokens({
//             accessToken: newAccessToken,
//             refreshToken: newRefreshToken,
//         });

//         return newAccessToken;
//     } catch (err) {
//         await clearTokens();
//         Alert.alert('Session Expired', 'Please login again.');
//         throw err;
//     }
// };

// // ---- Request Interceptor (Attach Token) ----
// api.interceptors.request.use(async (config) => {
//     const token = await getAccessToken();
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// // ---- Response Interceptor (Auto Refresh Token) ----
// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         if (error?.response?.status === 401 && !originalRequest._retry) {
//             if (isRefreshing) {
//                 return new Promise((resolve, reject) => {
//                     failedQueue.push({ resolve, reject });
//                 }).then((token) => {
//                     originalRequest.headers.Authorization = `Bearer ${token}`;
//                     return api(originalRequest);
//                 });
//             }

//             originalRequest._retry = true;
//             isRefreshing = true;

//             try {
//                 const newToken = await refreshToken();
//                 processQueue(null, newToken);
//                 originalRequest.headers.Authorization = `Bearer ${newToken}`;
//                 return api(originalRequest);
//             } catch (err) {
//                 processQueue(err, null);
//                 return Promise.reject(err);
//             } finally {
//                 isRefreshing = false;
//             }
//         }

//         return Promise.reject(error);
//     }
// );

// export default api;







//ts 
import axios, {
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosResponse,
    AxiosError,
} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import Config from 'react-native-config';

/* ---------------- BASE URL ---------------- */

export const BASE_URL = Config.NATIVE_PUBLIC_API;

// export const AI_CHATBOT_URL = Config.NATIVE_CHATBOT_API;

/* ---------------- TYPES ---------------- */

type TokenPayload = {
    accessToken?: string;
    refreshToken?: string;
};

type FailedRequest = {
    resolve: (value: string | null) => void;
    reject: (reason?: any) => void;
};

type CustomAxiosRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

/* ---------------- API INSTANCES ---------------- */

const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
    },
});

export const publicApi: AxiosInstance = axios.create({
    baseURL: BASE_URL,
});

/* ---------------- TOKEN HELPERS ---------------- */

export const getAccessToken = async (): Promise<string | null> => {
    return AsyncStorage.getItem('ACCESS_TOKEN');
};

export const getRefreshToken = async (): Promise<string | null> => {
    return AsyncStorage.getItem('REFRESH_TOKEN');
};

export const setTokens = async ({
    accessToken,
    refreshToken,
}: TokenPayload): Promise<void> => {
    if (accessToken) {
        await AsyncStorage.setItem('ACCESS_TOKEN', accessToken);
    }

    if (refreshToken) {
        await AsyncStorage.setItem('REFRESH_TOKEN', refreshToken);
    }
};

export const clearTokens = async (): Promise<void> => {
    await AsyncStorage.multiRemove(['ACCESS_TOKEN', 'REFRESH_TOKEN']);
};

/* ---------------- REFRESH TOKEN LOGIC ---------------- */

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });

    failedQueue = [];
};

const refreshToken = async (): Promise<string> => {
    try {
        const refreshTokenValue = await getRefreshToken();

        if (!refreshTokenValue) {
            throw new Error('No refresh token');
        }

        const res = await publicApi.post('/user/refresh-token', {
            refreshToken: refreshTokenValue,
        });

        const {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        } = res.data;

        await setTokens({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });

        return newAccessToken;
    } catch (err) {
        await clearTokens();

        Alert.alert('Session Expired', 'Please login again.');

        
        throw err;
    }
};

/* ---------------- REQUEST INTERCEPTOR ---------------- */

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken();

    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

/* ---------------- RESPONSE INTERCEPTOR ---------------- */

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (error?.response?.status === 401 && !originalRequest?._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }

                    return api(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await refreshToken();

                processQueue(null, newToken);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }

                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;