module.exports = {
  apps: [
    {
      name: "iantoo.dev",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/home/opc/projects/iantoo.dev",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
    {
      name: "iantoo-python",
      script: "/home/opc/projects/iantoo.dev/python/.venv/bin/uvicorn",
      args: "main:app --host 127.0.0.1 --port 4000 --workers 2",
      cwd: "/home/opc/projects/iantoo.dev/python",
      interpreter: "none",
      autorestart: true,
      watch: false,
      max_memory_restart: "256M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
