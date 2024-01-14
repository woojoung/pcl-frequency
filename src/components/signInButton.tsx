'use client'
import { signIn, signOut, useSession } from "next-auth/react";
import React from 'react'


export default function SignInButton() {
    const { data: session } = useSession();
    if (session && session.user) {
        return (
          <button
            className="px-12 py-4 border rounded-xl bg-red-300"
            onClick={() => signOut()}
          >
            {session.user.name} 로그아웃
          </button>
        );
      }
    
      return (
        <button
          className="px-12 py-4 border rounded-xl bg-yellow-300"
          onClick={() => signIn()}
        >
          로그인
        </button>
      );
}
