// config-overrides.js

module.exports = function override(config) {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        "os": require.resolve("os-browserify/browser")
    };

    return config;
};
