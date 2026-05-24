const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const env = require("./config/env");
const { connectDb } = require("./config/db");
const { setIo } = require("./sockets/io");
const { registerChatSocket } = require("./sockets/chat.socket");

const start = async () => {
  try {
    await connectDb();
    console.log("MongoDB connected");

    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: env.ALLOWED_ORIGIN,
        methods: ["GET", "POST", "PUT", "DELETE"]
      }
    });

    setIo(io);
    registerChatSocket(io);

    server.listen(env.PORT, () => {
      console.log(`Server listening on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

start();
