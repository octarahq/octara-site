import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { prisma } from "@/lib/prisma";
import { parse, type UrlWithParsedQuery } from "url";

const PATH = "/websocket/v1/user/location";

interface SocketMeta { 
  userId: string; 
  role: "sharer" | "viewer" 
}

export class LocationWebsocketService {
  public wss: WebSocketServer;
  sharerSockets: Map<string, WebSocket>;
  viewersBySharer: Map<string, Set<WebSocket>>;
  socketToUser: Map<WebSocket, SocketMeta>;
  private broadcastInterval: NodeJS.Timeout;

  constructor() {
    this.wss = new WebSocketServer({ noServer: true }); 
    this.sharerSockets = new Map<string, WebSocket>();
    this.viewersBySharer = new Map<string, Set<WebSocket>>();
    this.socketToUser = new Map<WebSocket, SocketMeta>();
    
    this.wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
      void this.handleConnection(ws, req.url ?? null);
    });
    
    this.broadcastInterval = setInterval(() => {
      void this.broadcastLastPositions();
    }, 10000);
  }

  private formatLocationPayload(sharerId: string, lat: number, lng: number, battery: number | null, timestamp: number) {
    return JSON.stringify({
      type: "location_sync",
      sharerId: sharerId,
      lat: lat,
      lng: lng,
      battery: battery,
      timestamp: timestamp,
      isLive: timestamp > Date.now() - 60000,
    });
  }

  private async buildPayloadFromDB(sharerId: string) {
    const lastLoc = await prisma.userLocation.findFirst({
      where: { userId: sharerId },
      orderBy: { timestamp: 'desc' },
    });

    if (!lastLoc) return null;

    return this.formatLocationPayload(
      sharerId,
      lastLoc.latitude,
      lastLoc.longitude,
      lastLoc.battery,
      lastLoc.timestamp.getTime()
    );
  }

  private async broadcastLastPositions() {
    try {
      for (const [sharerId, viewers] of this.viewersBySharer.entries()) {
        if (viewers.size === 0) continue;

        const payload = await this.buildPayloadFromDB(sharerId);
        if (!payload) continue;

        this.sendToViewers(sharerId, payload);
      }
    } catch (err) {
      console.error("Erreur lors du broadcast périodique:", err);
    }
  }

  private sendToViewers(sharerId: string, payload: string) {
    const viewers = this.viewersBySharer.get(sharerId);
    if (!viewers) return;

    for (const viewerSocket of viewers) {
      if (viewerSocket.readyState === WebSocket.OPEN) {
        viewerSocket.send(payload);
      }
    }
  }

  async verifyToken(token: string | string[] | undefined | null) {
    if (!token || Array.isArray(token)) return null;
    const t = await prisma.accessToken.findUnique({ 
      where: { token }, 
      include: { user: true } 
    });
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
    } else {
      for (const [sharerId, set] of this.viewersBySharer.entries()) {
        if (set.has(ws)) set.delete(ws);
      }
    }
  }

  async subscribeViewerToSharers(ws: WebSocket, viewerId: string) {
    const activeShares = await prisma.locationShare.findMany({ 
      where: { targetId: viewerId, expiresAt: { gt: new Date() } } 
    });

    const sharerIds = activeShares.map(s => s.sharerId);

    for (const sId of sharerIds) {
      const set = this.viewersBySharer.get(sId) ?? new Set<WebSocket>();
      set.add(ws);
      this.viewersBySharer.set(sId, set);
    }
  }

  async handleConnection(ws: WebSocket, rawUrl?: string | null) {
    try {
      const parsed = parse(rawUrl || "", true) as UrlWithParsedQuery;
      const { token, role } = parsed.query as { token?: string; role?: string };
      
      const user = await this.verifyToken(token);
      if (!user) {
        ws.send(JSON.stringify({ error: "unauthorized" }));
        ws.close();
        return;
      }

      const userId = user.id;
      const r: SocketMeta["role"] = role === "sharer" ? "sharer" : "viewer";
      this.socketToUser.set(ws, { userId, role: r });

      if (r === "sharer") {
        this.sharerSockets.set(userId, ws);
        if (!this.viewersBySharer.has(userId)) {
          this.viewersBySharer.set(userId, new Set<WebSocket>());
        }
        console.log(`[WS] Sharer connecté: ${userId}`);
      } else {
        await this.subscribeViewerToSharers(ws, userId);
        const initialPayload = await this.buildPayloadFromDB(userId);
        if (initialPayload) ws.send(initialPayload);
        console.log(`[WS] Viewer connecté: ${userId}`);
      }

      ws.on("message", async (data: Buffer | string) => {
        try {
          const msg = JSON.parse(data.toString());
          const meta = this.socketToUser.get(ws);
          if (!meta) return;

          if (meta.role === "sharer" && msg.type === "location") {
            const { lat, lng, battery, timestamp } = msg;
            const currentTimestamp = timestamp || Date.now();

            void prisma.userLocation.upsert({
              where: { userId: meta.userId },
              update: {
                latitude: lat,
                longitude: lng,
                battery: battery,
                timestamp: new Date(currentTimestamp),
              },
              create: {
                userId: meta.userId,
                latitude: lat,
                longitude: lng,
                battery: battery,
                timestamp: new Date(currentTimestamp),
              },
            });

            const payload = this.formatLocationPayload(
              meta.userId,
              lat,
              lng,
              battery,
              currentTimestamp
            );
            this.sendToViewers(meta.userId, payload);
          }

          if (msg.type === "ping") {
            ws.send(JSON.stringify({ type: "pong" }));
          }

        } catch (err) {
          console.error("[WS] Erreur message:", err);
        }
      });

      ws.on("close", () => this.cleanupSocket(ws));
      ws.on("error", () => this.cleanupSocket(ws));

    } catch (err) {
      console.error("[WS] Erreur connexion:", err);
      try { ws.close(); } catch (e) {}
    }
  }
}