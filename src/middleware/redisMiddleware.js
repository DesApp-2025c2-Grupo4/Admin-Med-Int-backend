const client = require("../db/config/redis.js");

const checkCache = (prefix) => async (req, res, next) => {
    const id = req.params.id ?? -1;
    const key = `${prefix}${id ?? -1}`; 
    const data = await client.get(key);

    if (data) {
        return res.status(200).json(JSON.parse(data));
    }
    next();
};

const deleteCache = (prefix) => async (req, res, next) => {
    const id = req.params.id ?? -1;
    const key = `${prefix}${id ?? -1}`;
    client.del(key);

    next();
};

module.exports = { checkCache, deleteCache };