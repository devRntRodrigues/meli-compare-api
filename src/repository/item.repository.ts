import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { Item, CreateItem, UpdateItem } from '@/schemas/item.schema';
import type { Logger } from '@/config/logger';
import crypto from 'crypto';

export class ItemRepository {
  private readonly dataPath: string;
  private items: Item[] = [];
  private lastModified: Date = new Date();

  constructor(private readonly logger: Logger) {
    this.dataPath = path.join(process.cwd(), 'data', 'items.json');
    this.loadItems();
    this.watchFile();
  }

  // Cleanup method to stop file watcher
  cleanup(): void {
    fs.unwatchFile(this.dataPath);
    this.logger.debug('File watcher stopped');
  }

  private loadItems(): void {
    try {
      const data = fs.readFileSync(this.dataPath, 'utf-8');
      this.items = JSON.parse(data);
      this.lastModified = fs.statSync(this.dataPath).mtime;
      this.logger.info({ count: this.items.length }, 'Items loaded');
    } catch (error) {
      this.logger.error({ error, path: this.dataPath }, 'Failed to load items');
      this.items = [];
    }
  }

  private watchFile(): void {
    // Only watch in non-test environments
    if (process.env['NODE_ENV'] === 'test') {
      return;
    }

    fs.watchFile(this.dataPath, (curr, prev) => {
      if (curr.mtime !== prev.mtime) {
        this.logger.info('Items file changed, reloading...');
        this.loadItems();
      }
    });
  }

  getAll(): Item[] {
    return [...this.items];
  }

  getById(id: string): Item | undefined {
    return this.items.find(item => item.id === id);
  }

  getByIds(ids: string[]): Item[] {
    return this.items.filter(item => ids.includes(item.id));
  }

  getLastModified(): Date {
    return this.lastModified;
  }

  generateETag(): string {
    const hash = crypto
      .createHash('md5')
      .update(JSON.stringify(this.items))
      .digest('hex');
    return `"${hash}"`;
  }

  create(data: CreateItem): Item {
    const now = new Date().toISOString();
    const newItem: Item = {
      id: uuidv4(),
      ...data,
      features: data.features || [],
      availability: data.availability ?? true,
      createdAt: now,
      updatedAt: now,
    };

    this.items.push(newItem);
    this.saveItems();
    this.logger.info({ id: newItem.id }, 'Item created');

    return newItem;
  }

  update(id: string, data: UpdateItem): Item | null {
    const index = this.items.findIndex(item => item.id === id);

    if (index === -1) {
      this.logger.debug({ id }, 'Item not found for update');
      return null;
    }

    const currentItem = this.items[index];
    if (!currentItem) {
      return null;
    }

    // Filtrar apenas campos que têm valores definidos
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    ) as Partial<Item>;

    const updatedItem: Item = {
      ...currentItem,
      ...filteredData,
      id: currentItem.id, // Garantir que o ID não seja sobrescrito
      createdAt: currentItem.createdAt, // Manter a data de criação original
      updatedAt: new Date().toISOString(),
    };

    this.items[index] = updatedItem;
    this.saveItems();
    this.logger.info({ id }, 'Item updated');

    return updatedItem;
  }

  delete(id: string): boolean {
    const index = this.items.findIndex(item => item.id === id);

    if (index === -1) {
      this.logger.debug({ id }, 'Item not found for deletion');
      return false;
    }

    this.items.splice(index, 1);
    this.saveItems();
    this.logger.info({ id }, 'Item deleted');

    return true;
  }

  private saveItems(): void {
    try {
      const data = JSON.stringify(this.items, null, 2);
      fs.writeFileSync(this.dataPath, data, 'utf-8');
      this.lastModified = new Date();
      this.logger.debug('Items saved to file');
    } catch (error) {
      this.logger.error({ error, path: this.dataPath }, 'Failed to save items');
      throw new Error('Failed to save items');
    }
  }
}
