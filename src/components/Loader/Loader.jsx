import React from 'react';
import { useLoader } from '../../context/LoaderContext';
import { AtToast } from "taro-ui"
import './Loader.scss';

const Loader = () => {
    const { loading } = useLoader();

    return (
        <AtToast duration={10000} hasMask={true} status='loading' isOpened={loading} text="努力加载中~" />
    );
};

export default Loader;
