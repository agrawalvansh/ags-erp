## Deployment of Node.js/Express + SQLite3 Backend

This document outlines the end-to-end process of deploying a full-stack application with a React frontend and a Node.js/Express + SQLite3 backend, including all challenges and their resolutions.

---

### 1. Initial Setup & Frontend Deployment

- **Frontend (React, Vite)** was deployed on Vercel:
  - GitHub repo connected, build command set to `npm run build`, publish directory `dist/`.
  - Environment variable `VITE_API_URL` configured in Vercel dashboard.
- **Backend** not supported by Vercel (static-only), requiring a separate host for the Express API.

---

### 2. Exploring Node + SQLite Hosting Options

1. **Render**
   - Free tier supports Node.js, but persistent disk mounts for SQLite are paid-only.
2. **Railway**
   - Free persistent volume, decent for SQLite.
   - **Challenge**: `better-sqlite3` required Node.js ≥ 20.x, but Railway default runtime was Node.js 18.4.0.
3. **Docker**
   - Containerizing with Node.js 20.x and SQLite file, but hosting with persistent volumes hit paid tiers on Render/Railway.

---

### 3. Moving to AWS EC2 (Free Tier)

Chosen: **t2.micro EC2 instance (Ubuntu 22.04)** on AWS Free Tier for full control.

1. **Launch EC2 instance**
2. **SSH Access**
   - Resolved `Permission denied (publickey)` by generating/importing the correct SSH key pair (`vansh-key.pem`) and setting permissions (`chmod 400`).
3. **Environment Setup**
   ```bash
   sudo apt update
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs build-essential sqlite3
   ```
4. **Clone & Install**
   ```bash
   git clone https://github.com/agrawalvansh/ags-erp.git
   cd ags-erp/backend
   npm install
   ```
5. **Database Initialization**
   - Executed all `CREATE TABLE IF NOT EXISTS` statements in `erp.db` for products, customers, suppliers, invoices, orders, accounts.
   - Verified schema with `sqlite3 erp.db ".tables"`.
6. **Express Server**
   - Updated `app.listen(4000, '0.0.0.0')`.
   - Started with `npm start` and confirmed via `curl http://localhost:4000/api/...`.
7. **Security Group**
   - Added Inbound rule: TCP port 4000 from `0.0.0.0/0`.

---

### 4. Enabling HTTPS via Cloudflare Tunnel

To avoid mixed-content errors (HTTPS frontend → HTTP API):

1. **Cloudflare DNS**
   - Pointed `agrawalvansh.me` nameservers to Cloudflare.
   - Added CNAME `api → <TUNNEL_ID>.cfargotunnel.com` (proxied).
2. **Install ****\`\`**** on EC2**
   ```bash
   curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
   sudo dpkg -i cloudflared.deb
   cloudflared tunnel login
   cloudflared tunnel create erp-api
   ```
3. **Configure Tunnel** (`~/.cloudflared/config.yml`)
   ```yaml
   tunnel: 3d167e36-75b6-4d3b-9584-1ef63c99e296
   credentials-file: /home/ubuntu/.cloudflared/3d167e36-75b6-4d3b-9584-1ef63c99e296.json

   ingress:
     - hostname: api.amitgeneralstore.software
       service: http://localhost:4000
     - service: http_status:404
   ```
4. **Daemonize Tunnel** via systemd:
   ```bash
   sudo tee /etc/systemd/system/cloudflared.service > /dev/null <<EOF
   [Unit]
   Description=Cloudflare Tunnel for ERP API
   After=network.target

   [Service]
   Type=simple
   User=ubuntu
   ExecStart=/usr/bin/cloudflared tunnel run erp-api
   Restart=on-failure
   RestartSec=5s

   [Install]
   WantedBy=multi-user.target
   EOF

   sudo systemctl daemon-reload
   sudo systemctl enable --now cloudflared.service
   ```

---

### 5. Production-Ready Services with PM2 & systemd

1. **Express via PM2**
   ```bash
   sudo npm install -g pm2
   cd ~/ags-erp/backend
   pm2 start server.js --name ags-backend
   pm2 startup systemd
   pm2 save
   ```
2. **Verify Services**
   ```bash
   pm2 ls
   sudo systemctl status cloudflared
   ```

---

### 6. Local vs. Production API URLs

- **Local Dev**: `VITE_API_URL=http://localhost:4000`
- **Production**: `VITE_API_URL=https://api.amitgeneralstore.software`

---

## Key Challenges & Resolutions

| Challenge                  | Resolution                                   |
| -------------------------- | -------------------------------------------- |
| Vercel backend unsupported | Used EC2 for full control                    |
| Paid disk mounts on Render | Switched to AWS Free Tier                    |
| Node.js version mismatch   | Upgraded to Node.js 20.x                     |
| SSH key errors             | Re-created key pair, set correct permissions |
| Mixed-content errors       | Implemented Cloudflare Tunnel for HTTPS      |
| Process uptime             | Deployed Express in PM2 & Tunnel in systemd  |

---

🎉 **Outcome:** Frontend on Vercel (`https://amitgeneralstore.software`), backend on EC2 + Cloudflare Tunnel (`https://api.amitgeneralstore.software`), with SQLite persistence and automated service management.

