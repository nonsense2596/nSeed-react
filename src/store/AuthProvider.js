import {useEffect, useState} from 'react';
import {AuthContext} from "./auth-context";
import Cookies from 'js-cookie';
import jwt from 'jwt-decode';
import axiosInstance from "../util/AxiosInterceptor";
import {getApplicationCookies, setApplicationCookies} from "../util/cookie-util";


export default function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = () => {
        Cookies.remove('jwtToken');
        Cookies.remove('refreshToken');
        Cookies.remove('jwtTokenExp');
        Cookies.remove('refreshTokenExp');
        setUser(null);
        setRole(null);
    }


    useEffect(() => {
        const performAuthLogin = async () => {
            console.log("useffect in authprovider running");
            const {jwtToken, jwtTokenExp, refreshToken, refreshTokenExp} = getApplicationCookies();
            if((jwtToken && jwtTokenExp && new Date(jwtTokenExp) < new Date()) && refreshToken && refreshTokenExp && new Date(refreshTokenExp) > new Date()) {
                console.log("refresh token backend call");
                try {
                    const res = await axiosInstance.post('/Auth/refresh-token', {
                        accessToken: jwtToken,
                        refreshToken: refreshToken,
                    }).then( res => {
                        console.log("successfully got new tokens from refresh endpoint");
                        console.log("access token: " + res.data.accessToken);
                        console.log("refresh token: " + res.data.refreshToken);
                        setApplicationCookies(res.data.accessToken, res.data.refreshToken);
                        const userName = jwt(res.data.accessToken).userName;
                        const userRole = jwt(res.data.accessToken).userRole;
                        setUser(userName);
                        setRole(userRole);
                    }).catch(err => {
                        console.log("inner err");
                        console.log(err);
                        //logout(); // todo error toast
                    });
                } catch (err) {
                    console.log("outer err");
                    console.log(err);
                    //logout(); // todo error toast
                }
            }
            else if (jwtToken && new Date(jwtTokenExp) > new Date() && refreshToken && new Date(refreshTokenExp) > new Date()) {
                console.log("can safely restore from cookies");
                const userName = jwt(jwtToken).userName;
                const userRole = jwt(jwtToken).userRole;
                setUser(userName);
                setRole(userRole);
            }
            else if (!jwtToken || !jwtTokenExp || new Date(jwtTokenExp) < new Date() || !refreshToken || !refreshTokenExp || new Date(refreshTokenExp) < new Date()) {
                console.log("one or more cookies are missing and/or jwtToken or refreshToken expired");
                logout();
            }
            setLoading(false);
        }

        performAuthLogin();


    },[]);


    if (loading) {
        return <div>Loading...</div>; // todo render a loading spinner later on
    }


    const value = { user, setUser, role, setRole, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}