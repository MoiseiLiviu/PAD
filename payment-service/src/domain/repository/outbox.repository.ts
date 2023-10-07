import { SagaStatus } from '@pad_lab/common';
import { Outbox } from '../models/outbox';

export interface OutboxRepository {
  save(outbox: Outbox): Promise<Outbox>;

  update(outbox: Outbox): Promise<void>;

  findBySagaIdAndStatus(sagaId: string, status: SagaStatus): Promise<Outbox>;

  findAllStarted(): Promise<Outbox[]>;

  deleteAllCompletedOrFailed(): Promise<void>;
}
