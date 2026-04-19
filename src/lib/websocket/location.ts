import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { prisma } from "@/lib/prisma";
import { parse, type UrlWithParsedQuery } from "url";

const PATH = "/websocket/v1/user/location";

interface SocketMeta { userId: string; role: "sharer" | "viewer" }

export class LocationWebsocketService {
  public wss: WebSocketServer;
  sharerSockets: Map<string, WebSocket>;
  viewersBySharer: Map<string, Set<WebSocket>>;
  socketToUser: Map<WebSocket, SocketMeta>;
  private broadcastInterval: NodeJS.Timeout;

  constructor() {
    this.wss = new WebSocketServer({ noServer: true }); 
    this.sharerSockets = new Map<string, WebSocket>();
    this.viewersBySharer = new Map<string, Set<WebSocket>>()
    this.socketToUser = new Map<WebSocket, SocketMeta>();
    
    this.wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
      void this.handleConnection(ws, req.url ?? null);
    });
    
    this.broadcastInterval = setInterval(() => {
      void this.broadcastLastPositions();
    }, 5000);
  }

  private async buildPayloadBroadcastLastPosition(sharerId: string) {
    const lastLoc = await prisma.userLocation.findFirst({
      where: { userId: sharerId },
      orderBy: { timestamp: 'desc' },
    });

    if (!lastLoc) return null;

    return JSON.stringify({
      type: "location_sync",
      sharerId: sharerId,
      lat: lastLoc.latitude,
      lng: lastLoc.longitude,
      battery: lastLoc.battery,
      timestamp: lastLoc.timestamp.getTime(),
      isLive: lastLoc.timestamp.getTime() > Date.now() - 60000,
    });
  }

  private async broadcastLastPositions() {
    try {
      for (const [sharerId, viewers] of this.viewersBySharer.entries()) {
        if (viewers.size === 0) continue;

        const lastLoc = await prisma.userLocation.findFirst({
          where: { userId: sharerId },
          orderBy: { timestamp: 'desc' },
        });

        const payload = await this.buildPayloadBroadcastLastPosition(sharerId);
        if (!payload) continue;

        for (const viewerSocket of viewers) {
          if (viewerSocket.readyState === WebSocket.OPEN) {
            viewerSocket.send(payload);
          }
        } 
      }
    } catch (err) {
      console.error("Erreur lors du broadcast périodique:", err);
    }
  }

  async verifyToken(token: string | string[] | undefined | null) {
    if (!token || Array.isArray(token)) return null;
    const t = await prisma.accessToken.findUnique({ where: { token }, include: { user: true } });
    if (!t) return null;
    if (t.expires_at < new Date()) return null;
    return t.user;
  }

  cleanupSocket(ws: WebSocket) {
    const meta = this.socketToUser.get(ws);
    if (!meta) return;
    this.socketToUser.delete(ws);
    if (meta.role === "sharer") {
      this.sharerSockets.delete(meta.userId);
      this.viewersBySharer.delete(meta.userId);
    } else {
      for (const [sharerId, set] of this.viewersBySharer.entries()) {
        if (set.has(ws)) set.delete(ws);
        if (set.size === 0) this.viewersBySharer.delete(sharerId);
      }
    }
  }

  async subscribeViewerToSharers(ws: WebSocket, viewerId: string) {
  const active = await prisma.locationShare.findMany({ 
    where: { targetId: viewerId, expiresAt: { gt: new Date() } } 
  });

  let sharerIds = active.map(s => s.sharerId);

  for (const sId of sharerIds) {
    const set = this.viewersBySharer.get(sId) ?? new Set<WebSocket>();
    set.add(ws);
    this.viewersBySharer.set(sId, set);
  }
}

  async handleConnection(ws: WebSocket, rawUrl?: string | null) {
    try {
      const parsed = parse(rawUrl || "", true) as UrlWithParsedQuery;
      
      const { token, role } = parsed.query as { token?: string | string[]; role?: string };
      const user = await this.verifyToken(token);
      if (!user) {
        ws.send(JSON.stringify({ error: "unauthorized" }));
        ws.close();
        return;
      }

      const userId = user.id as string;
      const r: SocketMeta["role"] = role === "sharer" ? "sharer" : "viewer";
      this.socketToUser.set(ws, { userId, role: r });

      if (r === "sharer") {
        this.sharerSockets.set(userId, ws);
        this.viewersBySharer.set(userId, this.viewersBySharer.get(userId) ?? new Set<WebSocket>());
        ws.send(JSON.stringify({ ok: true, role: "sharer", userId }));
      } else {
        await this.subscribeViewerToSharers(ws, userId);
        const payload = await this.buildPayloadBroadcastLastPosition(userId);
        if (payload) ws.send(payload);
        ws.send(JSON.stringify({ ok: true, role: "viewer", userId }));
      }

      ws.on("message", async (data: Buffer | string) => {
        try {
          const raw = data.toString();
          const msg = JSON.parse(raw) as { type?: string; lat?: number; lng?: number; battery?: number | null; timestamp?: number };
          const meta = this.socketToUser.get(ws);
          if (!meta) return;

          if (meta.role === "sharer" && msg.type === "location") {
            const { lat, lng, battery, timestamp } = msg;

            const clientDate = timestamp ? new Date(timestamp) : new Date();

            await prisma.userLocation.upsert({
              where: { userId: meta.userId },
              update: {
                latitude: msg.lat,
                longitude: msg.lng,
                battery: msg.battery,
                timestamp: new Date(msg.timestamp || Date.now()),
              },
              create: {
                userId: meta.userId,
                latitude: msg.lat || 0,
                longitude: msg.lng || 0,
                battery: msg.battery,
                timestamp: new Date(msg.timestamp || Date.now()),
              },
            });
          }
        } catch (err) {
        }
      });

      ws.on("close", () => this.cleanupSocket(ws));
      ws.on("error", () => this.cleanupSocket(ws));
    } catch (err) {
      try { ws.close(); } catch (e) {}
    }
  }
}