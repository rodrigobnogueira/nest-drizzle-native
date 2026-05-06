import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseLifecycleTracker {
  factoryCalls = 0;
  shutdownCalls = 0;

  recordFactoryCall(): void {
    this.factoryCalls += 1;
  }

  recordShutdown(): void {
    this.shutdownCalls += 1;
  }
}
