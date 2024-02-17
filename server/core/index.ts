import Server from "./Server";
import Socket from "./Socket";

class Core {
  async boot() {
    await Server.boot();
    await Socket.boot(Server.http);
  }
}

export default new Core();
