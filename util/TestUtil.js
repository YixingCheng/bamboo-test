
const isDebugging = () => {
    const debugging_mode = {
        headless: false,
        slowMo: 100,
        devtools: true,
    };
    if (process.env.NODE_ENV)
        return process.env.NODE_ENV.indexOf('dev') !== -1 ? debugging_mode : {}
    return {};
}

const getHost = () => {
    return process.env.NODE_ENV ? process.env.NODE_ENV : 'dev4';
}


module.exports = { isDebugging, getHost }
