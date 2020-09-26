module.exports = {
  apps : [{
    name: 'API',
    script: 'app.js',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    args: '',
    instances: 2,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }],
};