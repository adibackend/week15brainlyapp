declare namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      PORT: string;
      SECRET_KEY: string;
      JWT_PASSWORD:string;
    }
  }
  