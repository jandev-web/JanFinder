

export const logoutAfterInactivity = (logoutCallback, timeout = 600000) => { //10 minutes
    let inactivityTimeout;
    const resetTimeout = () => {
        if (inactivityTimeout) clearTimeout(inactivityTimeout);
        inactivityTimeout = setTimeout(logoutCallback, timeout);
    };

    document.addEventListener('mousemove', resetTimeout);
    document.addEventListener('keypress', resetTimeout);
    document.addEventListener('click', resetTimeout);
    document.addEventListener('scroll', resetTimeout);

    resetTimeout();
};

//export default logoutAfterInactivity;
