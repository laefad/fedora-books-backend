declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT?: string;
            JWT_KEY?: string;
        }
    }
}

export {}
