import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

/*
 * Thin wrapper around Ionic Storage, following the pattern in the
 * ionic-storage README (https://github.com/ionic-team/ionic-storage).
 * In the browser it uses IndexedDB, so data survives a page reload.
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private ready: Promise<void>;

  constructor(private storage: Storage) {
    this.ready = this.init();
  }

  async init() {
    // If using a custom driver, it must be defined before calling create()
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public async set(key: string, value: any) {
    await this.ready;
    await this._storage?.set(key, value);
  }

  public async get(key: string): Promise<any> {
    await this.ready;
    return this._storage?.get(key);
  }

  public async remove(key: string) {
    await this.ready;
    await this._storage?.remove(key);
  }
}
