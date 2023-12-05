import { createClient } from "redis";
import { Link } from "../domain/link";

interface RedisProxyInterface {
    set: (key: string, value: string) => Promise<string>,
    get: (key: string) => Promise<string>,
    quit: () => Promise<string>
}

// Environment variables for cache
export class LinkCache {
    private static instance: LinkCache;

    private readonly cacheClient;

    private constructor(redisClient: RedisProxyInterface) {
        if (!redisClient) {
            throw new Error("A Redis client is required.");
        }
        this.cacheClient = redisClient;
    }

    static async getInstance() {
        if (!this.instance) {
            const cacheHostName = process.env.REDIS_HOST_NAME;
            const cachePassword = process.env.REDIS_ACCESS_KEY;

            if (!cacheHostName) throw Error("REDIS_HOST_NAME is empty")
            if (!cachePassword) throw Error("REDIS_ACCESS_KEY is empty")

            const cacheConnection = createClient({
                url: `rediss://${cacheHostName}:6380`,
                password: cachePassword
            });

            await cacheConnection.connect();
            cacheConnection.get("test");

            this.instance = new LinkCache(cacheConnection);


        }
        return this.instance;
    }

    async quit() {
        await this.cacheClient.quit();
    }

    async setLinkMapping(link: Link) {
        await this.cacheClient.set(link.mapping, link.link, { EX: 600 });
    }

    async getLinkMapping(mapping: string) {
        return await this.cacheClient.get(mapping);
    }
}