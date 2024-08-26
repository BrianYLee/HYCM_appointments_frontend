import React from 'react';
import { AuthProvider } from './context/AuthContext';

const App = ({ children }) => {
    console.log("app loaded");
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
};

export default App;
