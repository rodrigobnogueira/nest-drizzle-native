import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import type { AnalyticsEvent } from '../analytics/analytics.repository';
import type { Product } from './products.repository';

interface CreateProductBody {
  sku?: string;
  name?: string;
}

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('products')
  listProducts(): Promise<Product[]> {
    return this.productsService.listProducts();
  }

  @Post('products')
  create(@Body() body: CreateProductBody): Promise<Product> {
    return this.productsService.create(body);
  }

  @Get('analytics/events')
  listEvents(): Promise<AnalyticsEvent[]> {
    return this.productsService.listEvents();
  }
}
