import { createClient } from "redis";
import { REDIS_URI } from "../config";

export const redisClient = createClient({
  url: REDIS_URI,
});

export function redisConnect() {
  redisClient
    .connect()
    .then(() => {
      console.log("redis connected successfully");
    })
    .catch((err) => {
      console.log("fail to conntect to redis", err);
    });
}
