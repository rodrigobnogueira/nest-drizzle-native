import { Injectable, OnModuleInit } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import {
  LedgerRepository,
  type LedgerEntry,
} from './ledger.repository';
import type { AppDatabase } from '../database';
import type { DrizzleTransactionalAdapter } from '../transaction.types';

@Injectable()
export class LedgerService implements OnModuleInit {
  constructor(
    private readonly ledgerRepository: LedgerRepository,
    private readonly txHost: TransactionHost<DrizzleTransactionalAdapter>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.ledgerRepository.migrate();
  }

  record(input: {
    fromAccountId: number;
    toAccountId: number;
    amount: number;
    note: string;
  }): Promise<LedgerEntry> {
    return this.ledgerRepository.record(this.txHost.tx as AppDatabase, input);
  }

  list(): Promise<LedgerEntry[]> {
    return this.ledgerRepository.list();
  }
}
