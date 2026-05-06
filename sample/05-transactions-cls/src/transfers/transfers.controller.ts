import { Body, Controller, Get, Post } from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service';
import type { Account } from '../accounts/accounts.repository';
import { LedgerService } from '../ledger/ledger.service';
import type { LedgerEntry } from '../ledger/ledger.repository';
import { TransfersService } from './transfers.service';

interface TransferBody {
  fromAccountId?: number;
  toAccountId?: number;
  amount?: number;
}

@Controller()
export class TransfersController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly ledgerService: LedgerService,
    private readonly transfersService: TransfersService,
  ) {}

  @Get('accounts')
  accounts(): Promise<Account[]> {
    return this.accountsService.list();
  }

  @Get('ledger')
  ledger(): Promise<LedgerEntry[]> {
    return this.ledgerService.list();
  }

  @Post('transfers/commit')
  commit(
    @Body() body: TransferBody,
  ): Promise<{ transactionActive: boolean }> {
    return this.transfersService.commit(normalizeTransfer(body));
  }

  @Post('transfers/rollback')
  rollback(@Body() body: TransferBody): Promise<void> {
    return this.transfersService.rollback(normalizeTransfer(body));
  }
}

function normalizeTransfer(body: TransferBody): {
  fromAccountId: number;
  toAccountId: number;
  amount: number;
} {
  return {
    fromAccountId: body.fromAccountId ?? 1,
    toAccountId: body.toAccountId ?? 2,
    amount: body.amount ?? 10,
  };
}
