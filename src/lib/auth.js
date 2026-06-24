import dns from "node:dns/promises";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db(process.env.AUTH_DB_NAME);

export const auth = betterAuth({
    emailAndPassword: {
    enabled: true,
  },
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),

  user:{
    additionalFields: {
      role: {
        type: "string",
        default: "donor",
      },

      status: {
        type: "string",
        default: "active",
      },

      bloodGroup: {
        type: "string",
      },

      district: {
        type: "string",
      },

      upazila: {
        type: "string",
      }
    }
  },

  plugins: [
    admin()
  ]
});