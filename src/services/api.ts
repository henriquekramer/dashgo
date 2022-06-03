import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies'
import { signOut } from '../contexts/AuthContext';
import { AuthTokenError } from './errors/AuthTokenErrors';

interface AxiosErrorResponse {
  code?: string;
}

export const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})

let isRefreshing = false;
let failedRequestsQueue = []

export function setupAPIClient(ctx = undefined){
  let cookies = parseCookies(ctx);

  const newApi = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['dashgo.token']}`
    }
  })

  newApi.interceptors.response.use(response => {
    return response; 
  }, (error: AxiosError<AxiosErrorResponse>) => {
    if(error.response.status === 401) {
      if(error.response.data?.code === 'token.expired'){
        cookies = parseCookies(ctx); 

        const { 'nextauth.refreshToken' : refreshToken } = cookies 

        const originalConfig = error.config

        if(!isRefreshing){
          isRefreshing = true
          newApi.post('/refresh', {
            refreshToken,
          }).then(response=> {
            const { token } = response.data;
    
            setCookie(ctx, 'nextauth.token', token, {
              maxAge: 60 * 60 * 24 * 30, 
              path: '/' 
            })
            setCookie(ctx, 'nextauth.refreshToken', response.data.refreshToken, {
              maxAge: 60 * 60 * 24 * 30,
              path: '/',
            })
    
            newApi.defaults.headers['Authorization'] = `Bearer ${token}`
            failedRequestsQueue.forEach(request => request.onSuccess(token)) 
            failedRequestsQueue = [];
          }).catch(err => {
            failedRequestsQueue.forEach(request => request.onFailure(err)) 
            failedRequestsQueue = [];

            if(typeof window!== 'undefined'){
              signOut()
            }
          }).finally(()=> {
            isRefreshing = false
          });
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token: string)=> {  
              originalConfig.headers['Authorization'] = `Bearer ${token}` 

              resolve(newApi(originalConfig)) 
            }, 
            onFailure: (err: AxiosError)=> {  
              reject(err)
            } , 
          })
        })

      } else {
        if(typeof window!== 'undefined'){
          signOut()
        } else {
          return Promise.reject(new AuthTokenError())
        }
      }
    }

    return Promise.reject(error)
  })

  return newApi;
}

