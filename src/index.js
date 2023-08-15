import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {AxiosInterceptor} from "./util/AxiosInterceptor";
import AuthProvider from "./store/AuthProvider";
// import AuthProvider from "./store/AuthProvider";
// import {AxiosInterceptor} from "./util/AxiosInterceptor";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AxiosInterceptor>
        <AuthProvider>
            <App/>
        </AuthProvider>
    </AxiosInterceptor>
);

