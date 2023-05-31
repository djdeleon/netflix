import { PrismaClient } from "@prisma/client";

// global file is not affected by hot reloading, nextjs has hot reloading that will take affect on new PrismaClient to keep on instantiating itself resulting into error.
const client = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === 'production') global.prisma = client;

export default client;