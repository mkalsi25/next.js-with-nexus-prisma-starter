import { ApolloServer } from "apollo-server-micro";
import type { NextApiRequest, NextApiResponse } from "next";
import { makeSchema } from "nexus";
import { PostQuery, Users, Posts, MutationUser } from "../../prisma/schema";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://studio.apollographql.com"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Methods, Access-Control-Allow-Origin, Access-Control-Allow-Credentials, Access-Control-Allow-Headers"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, PATCH, DELETE, OPTIONS, HEAD"
  );
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  // const contentType = req.headers["content-type"];
  // if (contentType && contentType.startsWith("multipart/form-data")) {
  //   req.filePayload = await processRequest(req, res);
  // }

  const schema = makeSchema({
    types: [Users, Posts, PostQuery, MutationUser],
  });

  const apolloServer = new ApolloServer({
    schema,
    context: { prisma },
    // csrfPrevention: true,
  });

  // const contentType = req.headers["content-type"];
  // if (contentType && contentType.startsWith("multipart/form-data")) {
  //   req.filePayload = await processRequest(req, res);
  // }

  const startServer = apolloServer.start();
  await startServer;
  await apolloServer.createHandler({ path: "/api/graphql" })(req, res);
}

export const config = { api: { bodyParser: false } };
