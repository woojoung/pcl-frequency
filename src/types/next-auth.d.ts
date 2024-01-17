import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import type { Adapter, AdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      /** The user's name. */
      id?: number | undefined | null;
      name?: string | undefined | null;
      password?: string | undefined | null;
      token?: JWT;
    };
  }

  interface JWT {
    token: any;
    // 위 코드예시에서 name과 email을 보낸것들에 대한 값에 대해 타입설정을 해준다
    user?: {
      id?: number | undefined | null;
      name?: string | undefined | null;
      password?: string | undefined | null;
    };
  }

  interface AdapterUser {
    // 위 코드예시에서 name과 email을 보낸것들에 대한 값에 대해 타입설정을 해준다
    user?: {
      id?: number | undefined | null;
      name?: string | undefined | null;
      password?: string | undefined | null;
    };
  }
}
