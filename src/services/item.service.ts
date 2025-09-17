import type {
  Item,
  ItemsQuery,
  ItemComparison,
  CreateItem,
  UpdateItem,
} from '@/schemas/item.schema';
import type { PaginationMeta } from '@/schemas/response';
import type { ItemRepository } from '@/repository/item.repository';
import type { Logger } from '@/config/logger';

export class ItemService {
  constructor(
    private readonly repository: ItemRepository,
    private readonly logger: Logger
  ) {}

  findAll(query: ItemsQuery): { items: Item[]; meta: PaginationMeta } {
    let items = this.repository.getAll();

    items = this.applyFilters(items, query);
    items = this.applySorting(items, query);

    const total = items.length;
    const totalPages = Math.ceil(total / query.limit);
    const offset = (query.page - 1) * query.limit;
    const paginatedItems = items.slice(offset, offset + query.limit);

    const meta: PaginationMeta = {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      hasNext: query.page < totalPages,
      hasPrev: query.page > 1,
    };

    this.logger.debug(
      { query, total, returned: paginatedItems.length },
      'Items retrieved'
    );

    return { items: paginatedItems, meta };
  }

  findById(id: string): Item | null {
    const item = this.repository.getById(id);

    if (!item) {
      this.logger.debug({ id }, 'Item not found');
      return null;
    }

    this.logger.debug({ id }, 'Item retrieved');
    return item;
  }

  compareItems(ids: string[]): ItemComparison[] {
    const items = this.repository.getByIds(ids);
    const comparisons = items.map(this.toComparison);

    this.logger.debug(
      { requestedIds: ids, foundCount: comparisons.length },
      'Items compared'
    );

    return comparisons;
  }

  getLastModified(): Date {
    return this.repository.getLastModified();
  }

  generateETag(): string {
    return this.repository.generateETag();
  }

  create(data: CreateItem): Item {
    const item = this.repository.create(data);
    this.logger.info(
      { id: item.id, name: item.name },
      'Item created successfully'
    );
    return item;
  }

  update(id: string, data: UpdateItem): Item | null {
    const item = this.repository.update(id, data);

    if (!item) {
      this.logger.debug({ id }, 'Item not found for update');
      return null;
    }

    this.logger.info({ id, name: item.name }, 'Item updated successfully');
    return item;
  }

  delete(id: string): boolean {
    const success = this.repository.delete(id);

    if (!success) {
      this.logger.debug({ id }, 'Item not found for deletion');
      return false;
    }

    this.logger.info({ id }, 'Item deleted successfully');
    return true;
  }

  private applyFilters(items: Item[], query: ItemsQuery): Item[] {
    return items.filter(item => {
      if (query.category && item.category !== query.category) return false;
      if (query.brand && item.brand !== query.brand) return false;
      if (query.minPrice && item.price < query.minPrice) return false;
      if (query.maxPrice && item.price > query.maxPrice) return false;
      if (query.search && !this.matchesSearch(item, query.search)) return false;
      return true;
    });
  }

  private applySorting(items: Item[], query: ItemsQuery): Item[] {
    const { sortBy, sortOrder } = query;

    return items.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = (a.rating ?? 0) - (b.rating ?? 0);
          break;
        case 'createdAt':
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  private matchesSearch(item: Item, search: string): boolean {
    const searchLower = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.brand.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower) ||
      (item.description?.toLowerCase().includes(searchLower) ?? false) ||
      item.features.some(feature => feature.toLowerCase().includes(searchLower))
    );
  }

  private toComparison(item: Item): ItemComparison {
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      brand: item.brand,
      features: item.features,
      description: item.description,
      imageUrl: item.imageUrl,
      rating: item.rating,
    };
  }
}
