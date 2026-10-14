module.exports = {
    apps: [
        // 🌐 Main Website (Next.js)
        {
            name: "metrotimes-website",
            cwd: "/var/www/rndprojects/metrotimes-website",
            script: "npm",
            args: "start",
            env: {
                NODE_ENV: "production",
                HOST: "127.0.0.1",
                PORT: 4031
            }
        },
    ]
};