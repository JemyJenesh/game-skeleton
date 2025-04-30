export interface Store<Model> {
  set(id: string, data: Model): Promise<void>;
  delete(id: string): Promise<void>;
  getOne(id: string): Promise<Model | undefined>;
  getAll(): Promise<Model[]>;
  getKeys(): Promise<string[]>;
}

class AsyncMapStoreService<Model> implements Store<Model> {
  private store: Map<string, Model> = new Map();

  async set(id: string, data: Model): Promise<void> {
    this.store.set(id, data);
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }

  async getOne(id: string) {
    const model = this.store.get(id);

    return model;
  }

  async getAll(): Promise<Model[]> {
    const models = Array.from(this.store, ([, value]) => value);

    return models;
  }

  async getKeys(): Promise<string[]> {
    const keys = Array.from(this.store, ([key]) => key);

    return keys;
  }

  set storeData(storeData: Map<string, Model>) {
    this.store = storeData;
  }
}

export default AsyncMapStoreService;
