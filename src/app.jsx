import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { LoaderProvider } from './context/LoaderContext';
import './app.scss';

const App = ({ children }) => {
    return (
        <LoaderProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </LoaderProvider>
    );
};

export default App;
