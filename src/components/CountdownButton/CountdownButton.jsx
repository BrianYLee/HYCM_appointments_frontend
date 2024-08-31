import React, { useState } from 'react';
import { AtButton } from 'taro-ui';

const CountdownButton = ({ className, text='按钮', disabledText='重试', type='primary', full=false, circle=false, duration = 60, onClick=()=>{} }) => {
    const [ isDisabled, setIsDisabled ] = useState(false);
    const [ countdown, setCountdown ] = useState(0);

    const handleClick = (callback) => {
        setIsDisabled(true);
        setCountdown(duration);
        callback();
        const interval = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown === 1) {
                    clearInterval(interval);
                    setIsDisabled(false);
                }
                return prevCountdown - 1;
            });
        }, 1000);
    };

    return (
        <AtButton 
            type={type}
            full={full}
            circle={circle}
            disabled={isDisabled}
            className={className}
            onClick={() => handleClick(onClick)}
        >
            {isDisabled ? `${disabledText} (${countdown})` : `${text}`}
        </AtButton>
    )
}

export default CountdownButton;
