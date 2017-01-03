
let entries = [];

module.exports.add = function add(door, eventName) {
    const log = {
        id: door.id,
        name: door.name,
        eventName,
        timestamp: new Date(),
    };

    entries.push(log);

    return log;
};

module.exports.recent = function recent(num = 5, filter) {

    // could do this with slice and filter, but that
    // allocates a bunch of arrays. This log file could get quite large
    // after running for a long time

    const f = filter || (() => true);
    const result = [];

    for (let i = entries.length - 1; i >= 0; i--) {
        const e = entries[i];
        if (f(e)) {
            result.push(e);
        }

        if (result.length === num) {
            return result;
        }
    }

    return result;
};

module.exports.clear = function clear() {
    entries = [];
};
