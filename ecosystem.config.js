module.exports = {
    apps: [
        {
            name   : "caloocan2025",
            script: "npx",
            args: "directus start",
            env: {
                NODE_ENV: "production",
                DB_CLIENT: "sqlite3",
                DB_FILENAME: "./data.db",
                HOST: "0.0.0.0",
                PORT: 8055,
            }
        },
        {
            name   : "caloocan2025-encoder",
            script: "npm",
            args: "start start",
            cwd: './encoder',
            env: {
                NODE_ENV: "production",
                API_HOST: "http://localhost:8055"
            }
        },
        {
            name   : "caloocan2025-dashboard",
            script: "npx",
            cwd: "./frontend",
            args: "http-server -o frontend"
        },
    ]
}