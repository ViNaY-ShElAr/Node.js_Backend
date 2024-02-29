class RedisOperations {

    constructor() {
        this.redisClient = global.dbConnections.redisClient;
    }

    async getKey(key) {
        const result = await this.redisClient.get(key);
        return result
    }

    async setKey(key, value) {
        const result = await this.redisClient.set(key, value);
        return result
    }

    async setKeyWithExpiry(key, value, ttl) {
        const result = await this.redisClient.setex(key, ttl, value);
        return result
    }

    async deleteKey(key) {
        const result = await this.redisClient.del(key);
        return result
    }

    async incrementKey(key) {
        const value = await this.redisClient.incr(key);
        return value
    }

    async decrementKey(key) {
        const value = await this.redisClient.decr(key);
        return value
    }

    async isKeyExist(key) {
        const value = await this.redisClient.exists(key);
        return value
    }

}

module.exports = RedisOperations