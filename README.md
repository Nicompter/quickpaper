# ⚡ Quickpaper

The easiest way to start a Minecraft server. One command, done.

## 🚀 Quick Start

```bash
curl -fsSL https://quickpaper.nicompter.de/install | bash
```

## ✨ Features

- **One Command** – No complicated setup. Just one command and your server is running.
- **Interactive Mode** – Choose version, memory and settings in a guided setup process.
- **Lightning Fast** – Your server starts in less than 60 seconds.
- **PaperMC Integration** – Automatic download of the latest Paper version.
- **Cross-Platform** – Works on Linux, macOS and Windows.

## 📦 Installation Options

### Interactive Mode (Recommended)
Perfect for beginners. Get guided through all options.
```bash
curl -fsSL https://quickpaper.nicompter.de/install | bash
```

### Quick Start
For pros. Default settings with automatic updates.
```bash
curl -fsSL https://quickpaper.nicompter.de/install | bash -s -- --non-interactive --yes --accept-eula --auto-update
```

### Custom Configuration
Full control over all parameters.
```bash
curl -fsSL https://quickpaper.nicompter.de/install | bash -s -- --version 1.21.4 --min-ram 2G --max-ram 4G --port 25565 --accept-eula --auto-update
```

## 🛠️ Development (Landing Page)

This repository contains the landing page for Quickpaper, built with Next.js.

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build
```

## 📄 License

Open Source – MIT License

