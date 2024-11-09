// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      /** The user's unique ID */
      id: string;
      /** The user's name */
      name: string;
      /** The user's email */
      email: string;
      /** The user's image */
      image: string;
      /** The user's role */
      role: string;
    };
  }

  interface User {
    /** The user's role */
    role: string;
  }
}
