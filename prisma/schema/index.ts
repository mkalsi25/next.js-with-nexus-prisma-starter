import { objectType, extendType, nonNull, stringArg } from "nexus";
import { User, Post } from "nexus-prisma";

export const Users = objectType({
  name: User.$name,
  description: User.$description,
  definition(t) {
    t.field(User.id);
    t.field(User.email);
    t.field(User.name);
  },
});

export const Posts = objectType({
  name: Post.$name,
  description: Post.$description,
  definition(t) {
    t.field(Post.id);
    t.field(Post.title);
    t.field(Post.content);
    t.field(Post.published);
    t.field(Post.author);
  },
});

export const PostQuery = extendType({
  type: "Query", // 2
  definition(t) {
    t.list.field("posts", {
      type: Post.$name,
      resolve(_, args, { prisma }) {
        const posts = prisma.post.findMany();
        return posts;
      },
    });
    t.list.field("users", {
      type: User.$name,
      resolve(_, args, { prisma }) {
        const users = prisma.user.findMany();
        return users;
      },
    });
    t.list.field("userByEmail", {
      type: User.$name,
      args: {
        email: nonNull(stringArg()),
      },
      resolve(_, { email }, { prisma }) {
        console.log(email);

        const singleUserByEmail = prisma.user.findUnique({
          where: {
            email,
          },
        });
        return [singleUserByEmail];
      },
    });
  },
});

export const MutationUser = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("registerUser", {
      type: User.$name,
      args: {
        name: nonNull(stringArg()),
        email: nonNull(stringArg()),
      },
      resolve(_, args, { prisma }) {
        const users = prisma.user.create({
          data: args,
        });
        console.log(args);
        return users;
      },
    });
  },
});
