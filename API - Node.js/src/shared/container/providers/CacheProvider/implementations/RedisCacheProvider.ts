import Redis, { Redis as RedisClient } from 'ioredis';
import ICasheProvider from "../models/ICacheProvider";
import cacheConfig from '@config/cache';

export default class RedisCacheProvider implements ICasheProvider {
  private client: RedisClient;

  constructor(){
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: any): Promise<void> {
    this.client.set(key, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) return null;

    return JSON.parse(data) as T;
  }

  public async invalidate(key: string): Promise<void> {
    this.client.del(key);
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`);

    const pipeline = this.client.pipeline(); // Pipeline = coisa do redis. Mais performático

    keys.forEach(key => {
      pipeline.del(key);
    });

    await pipeline.exec();
  }
}
