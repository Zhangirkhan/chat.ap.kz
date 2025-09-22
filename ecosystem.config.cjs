module.exports = {
  apps: [
    {
      name: 'chat-ap-kz',
      script: 'npm',
      args: 'run build',
      cwd: '/var/www/user/data/www/erp.ap.kz',
      env: {
        NODE_ENV: 'production'
      },
      watch: false,
      instances: 1,
      autorestart: false,
      max_memory_restart: '1G',
      error_file: '/var/log/pm2/chat-ap-kz-error.log',
      out_file: '/var/log/pm2/chat-ap-kz-out.log',
      log_file: '/var/log/pm2/chat-ap-kz.log'
    }
  ]
}
