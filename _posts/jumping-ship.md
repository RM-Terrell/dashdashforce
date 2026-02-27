---
title: "Jumping ship from big tech"
excerpt: "A new era of 'do it yourself'"
coverImage: "/assets/blog/jumping-ship/espresso.JPG"
date: "2026-02-27"
tags: [kagi, immich, linux]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/jumping-ship/espresso.JPG"
---

Ive been busy this year in my personal life when it comes to tech. First going from Windows to Linux, then Google Search to Kagi, some slow migration from VS Code to Zed (though I still use VS Code a lot, it's still great once you rip Co-Pilot out) and most recently Google Photos to [Immich](https://immich.app).

Immich is one of the most polished open source project I've worked with recently and the ease at which I was able to jump ship to an instance of it running on Hetzner was nothing short of amazing. Seriously big props to all the engineers working on it, the UI is slick and reliable, search works astoundingly well, album and photo organization is great, and sharing photos or albums with links Just Works. I opted for Hetzner as my cloud of choice for first of all price (well less than 10USD a month), and I wanted reliability more than I could provide myself with self hosting. Also the cost of basically all hardware is [spiralling so badly](https://aftermath.site/ram-prices-hdd-prices-ai-bubble-computer-expensive/) that cloud providers like Hetzner _FOR NOW_ offer a compelling deal. Having a fully GDPR compliant server running in an EU country made the privacy side of my happy also.

Now sadly between making the jump and this writing, Hetzner has raised their VPS prices for my instance a bit from 5 Euros a month to about 6.50 Euros a month. A sad sign of the times I worry, but still way cheaper than any of the hyper scaler VPS setups I trialed and I just can't bring myself to pay for RAM and SSD storage myself right now given current prices. The performance of upload speed and photo processing has blown Google Photos out of the water for me, even running on the near cheapest shared VPS that Hetzner offers all the way out in Helsinki. Google Photos used to chug on images from my Fujifilm XT-5, while my basic 4 core Hetzner VPS chews through them.

Heres a quick overview of how I made the jump in case you're curious.

## Phase 1: Infrastructure (Hetzner)

- SSH Key: Generated ed25519 key locally and uploaded public key to Hetzner Console before creating the server.
- Server Creation: Created Ubuntu 24.04 VPS (CPX21) and attached a 50GB Block Volume.
- Firewall: Configured Hetzner Cloud Firewall to allow Inbound ports 22, 80, and 443.
- Volume Mount:
Formatted volume: sudo mkfs.ext4 -F /dev/sdb
Created mount point: mkdir -p /mnt/immich_data
Persistence: Added UUID to /etc/fstab so it mounts on reboot.

## Phase 2: The OS Setup

- Docker: Installed official Docker Engine (removed docker.io apt packages first to avoid outdated versions).
- User Config: Created ~/immich-app directory.

## Phase 3: Immich Deployment

- Files: Downloaded official docker-compose.yml and .env.
- Storage Mapping: Edited .env to set UPLOAD_LOCATION=/mnt/immich_data (Critical step to use the big volume).
- Database: Changed default DB password in .env.
- Created a private github repo to store the server config files (NOT including the .env file which is stored in a more private location)

## Phase 4: Networking & Security (Caddy)

- DNS: Added a subdomain record in Squarespace: `photos.` -> Hetzner IP.
- Caddyfile: Created Caddyfile with reverse proxy config (reverse_proxy immich-server:2283).
- Compose Update: Added Caddy service to docker-compose.yml to handle automatic HTTPS/SSL.

## Phase 5: Quality of Life

- VS Code: configured "Remote - SSH" extension to edit server files directly from the VS Code instead of manual terminal SSH file modification.

In all it took about 1 weekend of poking at the settings, and a few extra evenings setting up the private repo storage for the server config and further optimizing my workflow of updating the server and configuring its backups.

All hail open source.
