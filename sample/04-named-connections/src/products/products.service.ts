import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  AnalyticsRepository,
  type AnalyticsEvent,
} from '../analytics/analytics.repository';
import {
  ProductsRepository,
  type Product,
} from './products.repository';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly analyticsRepository: AnalyticsRepository,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.productsRepository.migrate();
    await this.analyticsRepository.migrate();
  }

  async create(input: { sku?: string; name?: string }): Promise<Product> {
    const product = await this.productsRepository.create({
      sku: input.sku ?? 'sample-sku',
      name: input.name ?? 'Sample product',
    });

    await this.analyticsRepository.record({
      eventName: 'product.created',
      subject: product.sku,
    });

    return product;
  }

  listProducts(): Promise<Product[]> {
    return this.productsRepository.list();
  }

  listEvents(): Promise<AnalyticsEvent[]> {
    return this.analyticsRepository.list();
  }
}
