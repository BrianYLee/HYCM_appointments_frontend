import React, { createContext, useState, useContext } from 'react';

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const showLoader = () => {
        console.log('show loader')
        setLoading(true)
    };
    const hideLoader = () => {
        console.log('hide loader')
        setLoading(false);
    }

    return (
        <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
            {children}
        </LoaderContext.Provider>
    );
};

export const useLoader = () => useContext(LoaderContext);
