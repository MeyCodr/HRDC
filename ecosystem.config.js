module.exports = {
  apps: [
    {
      name: 'hrdc-api',
      script: 'server/server.js',
      cwd: '/var/www/app/hrdc',
      instances: 1,
      autorestart: true,
      watch: false,
      env_production: {
        NODE_ENV: 'production',
        PORT: 3002,
      },
    },
  ],
};
