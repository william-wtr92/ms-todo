module.exports = {
  apps: [
    {
      name: "api",
      script: "./src/index.js",
      instances: "2", // or "max" for maximum instances
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
}
