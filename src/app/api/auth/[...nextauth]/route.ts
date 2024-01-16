import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { collection, getFirestore, getDocs, query } from "firebase/firestore";
import firestore from "../../../firebase/firestore";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        id: {
          label: "조별 번호",
          type: "text",
          placeholder: '조별 번호를 입력해주세요! "10"조',
        },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials, req): Promise<any> {
        console.log("credentials:", credentials);
        console.log("req:", req);

        try {
          const usersRef = query(collection(firestore, "users"));
          const snapshot = await getDocs(usersRef);
          console.log(snapshot);
          // snapshot이 비어 있는지 확인
          if (snapshot.empty) {
            console.log("일치하는 사용자가 없습니다.");
          }
          const users = snapshot.docs.map((doc) => doc.data());
          console.log("users: ", users);

          const user = users.find(
            (u: any) => u.password === credentials?.password
          );

          if (user) {
            console.log("login success", user);
            return Promise.resolve({
              id: user.id,
              password: user.password,
              name: user.name,
            });
          } else {
            console.log("login failed", user);
            return Promise.resolve(null);
          }
        } catch (error) {
          console.error("데이터 가져오기 실패:", error);
        }
      },
    }),
  ],
});

export { handler as GET, handler as POST };
