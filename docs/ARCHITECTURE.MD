# Architecture Overview

## Components
- **Desktop Client (Tauri + React/TS)** – User interface, PTT, chat, calls.
- **Gateway (Phoenix/Elixir)** – Auth, presence, chat channels, signaling.
- **Media SFU (mediasoup/Janus)** – WebRTC SFU for voice/video/screen share.
- **Infra (Docker, Postgres, Redis)** – Core infra services.

## Data Flow
User → Desktop → Gateway → SFU / DB → Other Users
