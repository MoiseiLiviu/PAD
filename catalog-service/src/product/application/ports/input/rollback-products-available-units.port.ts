import { CartItemDto } from '@pad_lab/common';

export interface RollbackProductsAvailableUnitsPort {
  execute(products: CartItemDto[]): Promise<void>;
}
