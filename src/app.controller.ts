import express, { NextFunction, Request, Response } from "express";
import { authRouter } from "./modules";
import { BadRequestException } from "./common";
import { connectDB } from "./DB/connection";
import { redisConnect } from "./DB/redis.connect";

// main function
export function bootstrap() {
  const app = express();
  const port = 3000;

  // connect to database
  connectDB();
  // connect to redis
  redisConnect();

  
  app.use(express.json());

  // routing
  app.use("/auth", authRouter);

  // global error handler
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    return res.status((error.cause as number) || 500).json({
      message: error.message,
      success: false,
      details: error instanceof BadRequestException ? error.details : undefined,
    });
  });

  app.listen(port, () => {
    console.log(`Server started on port http://localhost:${port}`);
  });
}
