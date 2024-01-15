import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { collection, getFirestore, getDocs } from "firebase/firestore";

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
      async authorize(credentials, req) {
        const db = getFirestore();
        const usersCollection = collection(db, 'users');
        console.log('credentials:', credentials);
        console.log('req:', req);
        console.log('db:', db);
        console.log('usersCollection:', usersCollection);
        try {
          const querySnapshot = await getDocs(usersCollection);
          const data = querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
          console.log('데이터:', data);

          const user = data.find(
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
          console.error('데이터 가져오기 실패:', error);
        }
      },
    }),
  ],
});

export { handler as GET, handler as POST };
