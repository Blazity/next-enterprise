module.exports = {
  apps: [
    {
      name: "nextjs-app",
      script: "npm",
      args: "start",
      instances: "max", // or specify the number of instances you want
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
    },
    // You can add more apps as needed for other services you want to manage with PM2
  ],
}
