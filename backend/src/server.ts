import 'reflect-metadata'; // <-- This must be first!
import app from './app';
import { createServer } from 'http';
import { Server } from 'socket.io';
import config from './config';

const server = createServer(app);
const io = new Server(server);

// You can use io for real-time features if needed

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});