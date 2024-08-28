import React, { useEffect } from 'react';
import { useLoader } from '../../context/LoaderContext';
import { AtToast } from "taro-ui"
import './Loader.scss';

const Loader = () => {
    const { loading } = useLoader();

    useEffect(() => {
        console.log('toggled loader');
    }, [loading]);

    return (
        <AtToast hasMask status='loading' isOpened={loading} text="努力加载中～" />
    );
};

export default Loader;
