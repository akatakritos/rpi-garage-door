module.exports = {

    processStartTime() {
        const now = new Date().getTime();
        const started = now - process.uptime() * 1000;
        return new Date(started);
    },


};
