import type { Response } from 'express';
import type { ItemService } from '@/services/item.service';
import type {
  ItemsQuery,
  CompareQuery,
  ItemParams,
  Item,
  ItemComparison,
  CreateItem,
  UpdateItem,
} from '@/schemas/item.schema';
import type { PaginationMeta } from '@/schemas/response';
import type { SuccessResponseBody } from '@/schemas/http.schema';
import { sendSuccess } from '@/config/response-handler';
import { httpMessages, HttpStatus } from '@/config/constants';
import { AppError } from '@/utils/app-error';
import type {
  RequestWithQuery,
  RequestWithParams,
  RequestWithBody,
  RequestWithBodyAndParams,
} from '@/types/express';

export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  create = async (
    req: RequestWithBody<CreateItem>,
    res: Response
  ): Promise<Response<SuccessResponseBody<Item>>> => {
    const item = this.itemService.create(req.body);
    return sendSuccess({
      res,
      message: httpMessages[HttpStatus._CREATED],
      data: item,
    });
  };

  findAll = async (
    req: RequestWithQuery<ItemsQuery>,
    res: Response
  ): Promise<
    Response<SuccessResponseBody<{ items: Item[]; meta: PaginationMeta }>>
  > => {
    const { items, meta } = this.itemService.findAll(req.query);

    return sendSuccess({
      res,
      message: httpMessages[HttpStatus._OK],
      data: { items, meta },
    });
  };

  findById = async (
    req: RequestWithParams<ItemParams>,
    res: Response
  ): Promise<Response<SuccessResponseBody<Item>>> => {
    const { id } = req.params;
    const item = this.itemService.findById(id);

    if (!item) {
      throw new AppError(`Item with id ${id} not found`, HttpStatus._NOT_FOUND);
    }

    return sendSuccess({
      res,
      message: httpMessages[HttpStatus._OK],
      data: item,
    });
  };

  compare = async (
    req: RequestWithQuery<CompareQuery>,
    res: Response
  ): Promise<Response<SuccessResponseBody<ItemComparison[]>>> => {
    const { ids } = req.query;

    if (ids.length === 0) {
      throw new AppError(
        'At least one item ID is required',
        HttpStatus._BAD_REQUEST
      );
    }

    if (ids.length > 10) {
      throw new AppError(
        'Maximum 10 items can be compared at once',
        HttpStatus._BAD_REQUEST
      );
    }

    const comparisons = this.itemService.compareItems(ids);

    return sendSuccess({
      res,
      message: httpMessages[HttpStatus._OK],
      data: comparisons,
    });
  };

  update = async (
    req: RequestWithBodyAndParams<UpdateItem, ItemParams>,
    res: Response
  ): Promise<Response<SuccessResponseBody<Item>>> => {
    const { id } = req.params;
    const updated = this.itemService.update(id, req.body);

    if (!updated) {
      throw new AppError(`Item with id ${id} not found`, HttpStatus._NOT_FOUND);
    }

    return sendSuccess({
      res,
      message: httpMessages[HttpStatus._OK],
      data: updated,
    });
  };

  delete = async (
    req: RequestWithParams<ItemParams>,
    res: Response
  ): Promise<Response> => {
    const { id } = req.params;
    const success = this.itemService.delete(id);

    if (!success) {
      throw new AppError(`Item with id ${id} not found`, HttpStatus._NOT_FOUND);
    }

    return res.status(HttpStatus._NO_CONTENT).send();
  };
}
