import { Client, Account, Databases } from "appwrite";

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
const COLLECTION_TEAMS = import.meta.env.VITE_COLLECTION_TEAMS;
const COLLECTION_PROBLEMS = import.meta.env.VITE_COLLECTION_PROBLEMS;
const COLLECTION_LEADERBOARD = import.meta.env.VITE_COLLECTION_LEADERBOARD;

export {
    client,
    account,
    databases,
    DATABASE_ID,
    COLLECTION_TEAMS,
    COLLECTION_PROBLEMS,
    COLLECTION_LEADERBOARD
};
