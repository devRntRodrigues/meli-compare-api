import { ItemRepository } from '@/repository/item.repository';
import { ItemService } from '@/services/item.service';
import type { Logger } from './logger';
import { logger } from './logger';

export interface Container {
  logger: Logger;
  itemRepository: ItemRepository;
  itemService: ItemService;
}

export const createContainer = (): Container => {
  const itemRepository = new ItemRepository(logger);
  const itemService = new ItemService(itemRepository, logger);

  return {
    logger,
    itemRepository,
    itemService,
  };
};
