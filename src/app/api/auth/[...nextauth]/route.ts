import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import fs from "fs/promises";
import path from "path";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        id: {
          label: "조별 번호",
          type: "text",
          placeholder: '조별 번호를 입력해주세요! "10"조',
        },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials, req) {
        const usersFilePath = path.join(process.cwd(), "data", "users.json");

        // console.log('credentials', credentials);
        // console.log('req', req);

        try {
          const usersData = await fs.readFile(usersFilePath, "utf-8");
          const users = JSON.parse(usersData);

          // console.log('users', users);

          // credentials.profile.id는 OAuth 프로바이더에서 제공하는 고유한 사용자 ID입니다.
          const user = users.find(
            (u: any) => u.password === credentials?.password
          );

          if (user) {
            console.log("login success", user);
            return Promise.resolve(user);
          } else {
            console.log("login failed", user);
            return Promise.resolve(null);
          }
        } catch (error) {
          console.error("Error reading or parsing users.json:", error);
          return Promise.resolve(null);
        }
      },
    }),
  ],
});

export { handler as GET, handler as POST };
