import axios from 'axios';
import {AuthContext} from "../store/auth-context";
import {useContext, useEffect} from "react";
import jwt from "jwt-decode";
import {getApplicationCookies, setApplicationCookies} from "./cookie-util";
import {toast} from "react-toastify";
import { v4 as uuidv4 } from 'uuid';

const axiosInstance = axios.create({
    baseURL: 'https://localhost:7058',
    withCredentials: true, // this ensures that the cookies are sent with the request all the time
});

const AxiosInterceptor = ({children}) => {
    const authContext = useContext(AuthContext);
    const uuid = uuidv4();
    useEffect(() => {
        const setupInterceptors =  () => {
            const requestInterceptor = axiosInstance.interceptors.request.use(
                async (config) => {
                    console.log("in request interceptor");

                    if(!config.AUTHACTION) {

                        const {jwtToken, jwtTokenExp, refreshToken, refreshTokenExp} = getApplicationCookies();

                        if((jwtToken && jwtTokenExp && new Date(jwtTokenExp) < new Date()) && refreshToken && refreshTokenExp && new Date(refreshTokenExp) > new Date()) {
                            // temporary axios instance, to not get infinite recursion with interceptors
                            const API = axios.create({
                                baseURL: 'https://localhost:7058',
                            });
                            try {
                                const res = await API.post('/Auth/refresh-token', {
                                    accessToken: jwtToken,
                                    refreshToken: refreshToken,
                                }).then( res => {
                                    console.log("successfully got new tokens from refresh endpoint");
                                    setApplicationCookies(res.data.accessToken, res.data.refreshToken);
                                    const userName = jwt(res.data.accessToken).userName;
                                    const userRole = jwt(res.data.accessToken).userRole;
                                    authContext.setUser(userName);
                                    authContext.setRole(userRole);
                                }).catch(err => {
                                    console.log(err);
                                    authContext.logout(); // todo error toast
                                });
                            } catch (err) {
                                console.log(err);
                                authContext.logout(); // todo error toast
                            }
                        }

                    } else {
                        // this is when we are making an auth call, nothing should in theory be done
                        console.log("should not do anything special here, or...?");
                    }
                    return config;
                },
                (error) => {
                    console.log(error);
                    return Promise.reject(error);
                }
            );



            const responseInterceptor = axiosInstance.interceptors.response.use(
                (response) => {
                    return response;
                },
                (error) => {
                    toast(uuid + " " + error.response.status + " " + error.response.statusText);
                    return Promise.reject(error);
                }
            );
            return () => {
                // Clean up the interceptors when the component unmounts
                axiosInstance.interceptors.request.eject(requestInterceptor);
                axiosInstance.interceptors.response.eject(responseInterceptor);
            };
        };

        setupInterceptors();

    }, [authContext.user, authContext.setUser, authContext.logout, authContext, uuid]);


    return children;
};

export default axiosInstance;
export {AxiosInterceptor};