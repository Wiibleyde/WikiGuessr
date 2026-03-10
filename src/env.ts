import z from "zod";

const envSchema = z.object({
    DATABASE_URL: z.url(),
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_CLIENT_SECRET: z.string(),
    DISCORD_REDIRECT_URI: z.url(),
    DISCORD_AUTHORIZE_URL: z
        .url()
        .default("https://discord.com/api/oauth2/authorize"),
    JWT_SECRET: z.string(),
    GAME_TIMEZONE: z.string().default("Europe/Paris"),
});

const env = envSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    DISCORD_REDIRECT_URI: process.env.DISCORD_REDIRECT_URI,
    DISCORD_AUTHORIZE_URL: process.env.DISCORD_AUTHORIZE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    GAME_TIMEZONE: process.env.GAME_TIMEZONE,
});

export default env;
