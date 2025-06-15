# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
pnpm run start:dev          # Start development server with hot reload
pnpm run start:debug        # Start with debugging enabled
pnpm start                  # Start production server

# Testing  
pnpm run test              # Run unit tests
pnpm run test:watch        # Run tests in watch mode
pnpm run test:e2e          # Run end-to-end tests
pnpm run test:cov          # Run tests with coverage report

# Code Quality
pnpm run lint              # Run ESLint with auto-fix
pnpm run format            # Format code with Prettier
pnpm run build             # Build for production

# Running single test
pnpm run test -- --testNamePattern="specific test name"
pnpm run test -- path/to/test-file.spec.ts
```

## Architecture Overview

This project implements **Hexagonal Architecture (Ports & Adapters)** with **Domain-Driven Design (DDD)** principles using NestJS and CQRS.

### Layer Structure

```
src/
├── shared/              # Shared domain utilities and base classes
├── [module]/
│   ├── domain/          # Domain layer (business logic)
│   │   ├── model/       # Entities and aggregates
│   │   ├── value-object/ # Value objects
│   │   ├── ports/       # Domain ports (interfaces)
│   │   └── errors.ts    # Domain-specific errors
│   ├── application/     # Application layer (use cases)
│   │   ├── ports/       # Application ports (interfaces)
│   │   └── adapters/    # Application service implementations
│   └── infrastructure/  # Infrastructure layer (external concerns)
│       └── adapters/    # Infrastructure implementations
```

### Key Architectural Principles

1. **Dependency Inversion**: Domain and application layers depend only on abstractions (ports), never on concrete implementations
2. **Domain Isolation**: Domain models contain business logic and are framework-agnostic
3. **Value Objects**: Encapsulate primitive values with business meaning and validation
4. **Aggregate Roots**: Domain entities that maintain consistency boundaries
5. **CQRS Integration**: Uses NestJS CQRS module for command/query separation and domain events

### Development Guidelines

- **Domain Layer**: Contains pure business logic, no framework dependencies
- **Value Objects**: Validate data at creation, ensure immutability where appropriate  
- **Repository Pattern**: Abstract data persistence behind domain ports
- **Use Cases**: Orchestrate domain operations, handle application concerns
- **Error Handling**: Use domain-specific error types for business rule violations
- **Testing**: Focus on domain logic testing, mock infrastructure adapters

### NestJS Integration

- Each architectural layer has its own NestJS module
- Use dependency injection to wire up ports with their adapters
- Infrastructure adapters are registered as providers in their respective modules
- Domain services and use cases are also registered as providers

### API Endpoints

The application exposes the following REST endpoints:

```
POST   /projects          # Create a new project
GET    /projects          # Get all projects
GET    /projects/:id      # Get project by ID
PUT    /projects/:id      # Update project
DELETE /projects/:id      # Delete project
```

### Validation

- Uses `class-validator` and `class-transformer` for request validation
- Global validation pipe automatically validates DTOs
- Custom error messages for validation failures
- Supports both creation and update validation rules

### API Documentation

- **Swagger UI**: Available at `http://localhost:3000/api`
- Interactive API documentation with request/response examples
- Built-in API testing interface
- Comprehensive schema documentation for all DTOs
- Automatic validation rule documentation