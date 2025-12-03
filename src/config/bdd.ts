import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";
import bcrypt from "bcrypt";

const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 5,
});

const prismaBase = new PrismaClient({ adapter });

const prisma = prismaBase.$extends({
    query: {
        user: {
            async create({ args, query }) {
                if (args.data.password) {
                    args.data.password = await bcrypt.hash(
                        args.data.password,
                        10
                    );
                }
                return query(args);
            },
            async update({ args, query }) {
                if (
                    args.data.password &&
                    typeof args.data.password === "string"
                ) {
                    args.data.password = await bcrypt.hash(
                        args.data.password,
                        10
                    );
                }
                return query(args);
            },
        },
    },
});

export default prisma;
