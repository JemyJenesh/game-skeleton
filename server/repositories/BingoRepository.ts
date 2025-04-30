import AsyncMapStoreService, {
  Store,
} from "server/services/AsyncMapStoreService";
import { Bingo } from "typings/Bingo";

class BingoRepository {
  private static bingos: Store<Bingo> = new AsyncMapStoreService();

  static async set(id: string, bingo: Bingo): Promise<void> {
    await this.bingos.set(id, bingo);
  }

  static async findById(id: string): Promise<Bingo | undefined> {
    const bingo = await this.bingos.getOne(id);

    return bingo;
  }

  static async getAll(): Promise<Bingo[]> {
    const bingos: Bingo[] = await this.bingos.getAll();

    return bingos;
  }
}

export default BingoRepository;
