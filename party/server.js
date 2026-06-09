export default {
  onConnect(conn, room) {
    conn.addEventListener("message", (event) => {
      room.broadcast(event.data, [conn.id]);
    });
  },
};
