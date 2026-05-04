# nest-drizzle-native

**The most native Drizzle ORM experience for NestJS.**

Bring Drizzle's raw performance and type safety into NestJS with a first-class, decorator-driven integration that feels right at home alongside `@nestjs/typeorm` and `@nestjs/graphql`.

### Why nest-drizzle-native?

- **True Nest-native DX** — Use decorators, dependency injection, guards, interceptors, pipes, and exception filters exactly as you expect in NestJS.
- **Elegant Transactions** — The killer `@Transactional()` decorator that works across multiple services without passing transaction objects manually (powered by AsyncLocalStorage).
- **Repository Pattern Done Right** — `@DrizzleRepository()` gives you structure and testability while keeping the full power of Drizzle’s query builder accessible.
- **Single Source of Truth** — Seamless `drizzle-zod` + `@nestjs/swagger` integration to eliminate duplicate schemas and DTOs.
- **Thin & Performant** — Zero magic that hides SQL. You’re still writing real Drizzle — just beautifully wired into NestJS.

### Core Features

- `@DrizzleModule.forRoot()` / `forRootAsync()`
- `@InjectDrizzle()` and `@DrizzleRepository()`
- `@Transactional()` and `@InjectTransaction()`
- Full support for PostgreSQL, MySQL, SQLite, and Drizzle drivers
- Request-scoped transactions and providers
- Excellent TypeScript support + OpenAPI/Swagger co-generation
- Adapter agnostic (Express & Fastify)
- Full integration with NestJS enhancers pipeline

### Philosophy

This library respects **Drizzle’s functional and explicit nature**. You define your schemas using standard Drizzle syntax — no class entities or heavy abstraction layers. We only add the missing NestJS-native ergonomics.

Perfect companion to `nest-trpc-native` for building fully type-safe, high-performance full-stack applications.

---

**Made for developers who want:**
- Drizzle’s speed and control
- NestJS’s structure and architecture
- Zero compromise on either side

---

Would you like a shorter version, a more marketing-oriented tone, or a version that emphasizes being “better than existing Drizzle NestJS solutions”? I can tweak it further.
