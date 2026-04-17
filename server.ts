import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { LocationWebsocketService } from "./src/lib/websocket/location";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "4025", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url || "", true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Erreur serveur:", err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  });

  const locationWS = new LocationWebsocketService();

  server.on("upgrade", (request, socket, head) => {
    const { pathname } = parse(request.url || "");

    // ws://localhost:3000/websocket/v1/user/location
    if (pathname === "/websocket/v1/user/location") {
      locationWS.wss.handleUpgrade(request, socket, head, (ws) => {
        locationWS.wss.emit("connection", ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  server.listen(port, () => {
    console.log(`> Serveur pret sur http://${hostname}:${port}`);
  });
});