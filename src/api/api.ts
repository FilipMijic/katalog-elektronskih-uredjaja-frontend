import Axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { ApiConfig } from '../config/api.config';

export default function api(
    path: string, 
    method: 'get'| 'post' | 'patch' | 'delete',
    body: any | undefined,
) {
    return new Promise<ApiResponse>((resolve) => {
        const requestData = {
            
            method: method,
            url: path,
            baseURL: ApiConfig.API_URL,
            data: JSON.stringify(body),
            headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getToken(),
                    },
                };

    Axios(requestData)
        .then(res => responseHandler(res, resolve))
        .catch(async err => {
            if(err.response.status === 401) {
                const newToken = await refreshToken();
    
               if (!newToken) {
                    const response: ApiResponse = {
                        status: 'login',
                        data: null,
                    };
                    
                    return resolve(response);
               }
    
                saveToken(newToken);
    
                requestData.headers['Authorization'] = getToken();
    
                return await repeatRequest(requestData, resolve);
            }
            const response: ApiResponse = {
                status: 'error',
                data: err,
            };
            resolve(response);
        });

    });

}

export function apiFile(
    path: string, 
    name: string,
    file: File,
    ) {
        return new Promise<ApiResponse>((resolve) => {
            const formData = new FormData();
            formData.append(name, file);

            const requestData: AxiosRequestConfig = {
                method: 'post',
                url: path,
                baseURL: ApiConfig.API_URL,
                data: formData,
                headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': getToken(),
                        },
                    };
    
        Axios(requestData)
            .then(res => responseHandler(res, resolve))
            .catch(async err => {
                if(err.response.status === 401) {
                    const newToken = await refreshToken();
        
                   if (!newToken) {
                        const response: ApiResponse = {
                            status: 'login',
                            data: null,
                        };
                        
                        return resolve(response);
                   }
        
                    saveToken(newToken);
        
                    requestData.headers['Authorization'] = getToken();
        
                    return await repeatRequest(requestData, resolve);
                }
                const response: ApiResponse = {
                    status: 'error',
                    data: err,
                };
                resolve(response);
            });
    
        });
    
    }

export interface ApiResponse {
    status: 'ok' | 'error' | 'login';
    data: any;
}

async function responseHandler(
    res: AxiosResponse<any>,
    resolve: (value?: ApiResponse) => void,
     ) {
    
    if (res.status < 200 || res.status >=300) {

        const response: ApiResponse = {
            status: 'error',
            data: res.data,
            
        };

       return resolve(response);
    }

    let response: ApiResponse;

    if (res.data.statusCode <0) {
        response = {
            status: 'login',
            data: null,
        };
    } else {
        response = {
            status: 'ok',
            data: res.data,
        };
    }

    resolve(response);

    resolve(res.data);

}

function getToken(): string {
    const token = localStorage.getItem('api_token');
    return 'Bearer ' + token;
}

export function saveToken(token: string) {
    localStorage.setItem('api_token', token);
}

export function removeTokenData() {
    localStorage.removeItem('api_token');
}

function getRefreshToken(): string {
    const token = localStorage.getItem('api_refresh_token');
    return  token + '';
}

function saveRefreshToken(token: string) {
   localStorage.setItem('api_refresh_token', token);  
}

async function refreshToken(): Promise<string | null> {
    const path = 'auth/admin/refresh';
    const data = {
        token: getRefreshToken(),
    }

    const refreshTokenRequestData: AxiosRequestConfig = {
            
        method: 'post',
        url: path,
        baseURL: ApiConfig.API_URL,
        data: JSON.stringify(data),
        headers: {
                'Content-Type': 'application/json',
            },
    };

  const refreshTokenResponse: {data: {token: string | undefined}} = await Axios(refreshTokenRequestData);

  if (!refreshTokenResponse.data.token) {
      return null;
  }

  return refreshTokenResponse.data.token;
}

async function repeatRequest(
    requestData: AxiosRequestConfig, 
    resolve: (value?: ApiResponse) => void) {
        Axios(requestData)
        .then(res => {
            let response: ApiResponse;

            if (res.status === 401) {
                response = {
                    status: 'login',
                    data: null,
                };

            }else {
                response = {
                    status: 'ok',
                    data: res,
                };

            }

            return resolve(response);

        })
        .catch(err => {
            const response: ApiResponse = {
                status: 'error',
                data: err,
                
            };
    
           return resolve(response);

        });
    }