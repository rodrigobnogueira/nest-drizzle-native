import { Injectable, OnModuleInit } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import {
  AccountsRepository,
  type Account,
} from './accounts.repository';
import type { AppDatabase } from '../database';
import type { DrizzleTransactionalAdapter } from '../transaction.types';

@Injectable()
export class AccountsService implements OnModuleInit {
  constructor(
    private readonly accountsRepository: AccountsRepository,
    private readonly txHost: TransactionHost<DrizzleTransactionalAdapter>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.accountsRepository.migrate();
    await this.accountsRepository.createSeedAccounts();
  }

  list(): Promise<Account[]> {
    return this.accountsRepository.list();
  }

  async debit(id: number, amount: number): Promise<Account> {
    return this.accountsRepository.adjustBalance(
      this.txHost.tx as AppDatabase,
      id,
      -amount,
    );
  }

  async credit(id: number, amount: number): Promise<Account> {
    return this.accountsRepository.adjustBalance(
      this.txHost.tx as AppDatabase,
      id,
      amount,
    );
  }
}
