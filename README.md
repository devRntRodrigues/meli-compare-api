# Meli-Compare-API

## 🎯 Project Overview

A robust RESTful API built with Node.js and TypeScript that provides product details for an item comparison feature. This backend service follows established best practices and provides clear, efficient endpoints to retrieve data for product comparisons without requiring a real database.

## 🚀 Tech Stack

### Core Technologies

- **Node.js 18+** - JavaScript runtime environment
- **TypeScript** - Type-safe JavaScript with advanced features
- **Express.js** - Fast, minimalist web framework
- **Zod** - TypeScript-first schema validation with static type inference
- **Pino** - High-performance structured logging

### Security & Middleware

- **Helmet** - Security middleware for setting HTTP headers
- **CORS** - Cross-Origin Resource Sharing configuration
- **Express Rate Limit** - API rate limiting to prevent abuse
- **Request ID Middleware** - Unique request tracking for debugging

### API Documentation

- **Swagger/OpenAPI 3.0** - Interactive API documentation
- **@asteasolutions/zod-to-openapi** - Automatic OpenAPI schema generation from Zod schemas
- **Swagger UI Express** - Web interface for API documentation

### Testing & Quality

- **Jest** - JavaScript testing framework with coverage reports
- **Supertest** - HTTP assertion library for API testing
- **ESLint** - Code linting with TypeScript support
- **Prettier** - Code formatting
- **Husky** - Git hooks for code quality enforcement

### Development Tools

- **pnpm** - Fast, disk space efficient package manager

## 📁 Project Architecture

```
src/
├── @types/           # TypeScript type extensions
├── config/           # Configuration files (logger, container, swagger)
├── controllers/      # Request handlers and business logic
├── docs/            # OpenAPI documentation schemas
├── middlewares/     # Express middleware functions
├── repository/      # Data access layer (JSON file operations)
├── routes/          # API route definitions
├── schemas/         # Zod validation schemas
├── services/        # Business logic and data processing
├── tests/           # Test files (integration, e2e)
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

### Architectural Patterns

- **Dependency Injection** - Container pattern for managing dependencies
- **Repository Pattern** - Abstraction layer for data access
- **Service Layer** - Business logic separation from controllers
- **Middleware** - Request processing chain
- **Schemas** - API contracts defined with Zod schemas

## 🔧 Setup Instructions

### Prerequisites

- Node.js 18.0.0 or higher
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd meli-compare-api
```

2. **Install dependencies**

```bash
pnpm install
# or
npm install
```

3. **Development mode**

```bash
pnpm dev
# or
npm run dev
```

4. **Production build**

```bash
pnpm build
pnpm start
# or
npm run build
npm start
```

### Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build TypeScript to JavaScript
- `pnpm start` - Start production server
- `pnpm test` - Run all tests
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm lint` - Check code quality
- `pnpm format` - Format code with Prettier

## 📚 API Documentation

### Base URL

```
http://localhost:3000
```

### Interactive Documentation

Visit `http://localhost:3000/api-docs` for the complete Swagger UI documentation.

### Core Endpoints

#### Health Check

```http
GET /health
```

Returns API health status and system information.

#### Items Management

**Get All Items**

```http
GET /items?category=smartphones&sortBy=price&sortOrder=asc&page=1&limit=20
```

**Get Item by ID**

```http
GET /items/:id
```

**Create New Item**

```http
POST /items
Content-Type: application/json

{
  "name": "iPhone 15 Pro",
  "price": 999.99,
  "category": "smartphones",
  "brand": "Apple",
  "description": "Latest iPhone with A17 Pro chip",
  "features": ["A17 Pro", "48MP Camera", "Titanium Design"],
  "rating": 4.8,
  "availability": true,
  "imageUrl": "https://example.com/iphone15pro.jpg"
}
```

**Update Item**

```http
PUT /items/:id
Content-Type: application/json

{
  "price": 899.99,
  "availability": false
}
```

**Delete Item**

```http
DELETE /items/:id
```

#### Product Comparison

**Compare Multiple Items**

```http
GET /compare?ids=uuid1,uuid2,uuid3
```

### Query Parameters

- `category` - Filter by product category
- `brand` - Filter by brand name
- `minPrice` / `maxPrice` - Price range filtering
- `search` - Text search in name/description
- `sortBy` - Sort field (name, price, rating, createdAt)
- `sortOrder` - Sort direction (asc, desc)
- `page` / `limit` - Pagination controls

## 🧪 Testing Strategy

### Test Types

1. **Unit Tests** - Individual component testing
2. **Integration Tests** - API endpoint testing
3. **End-to-End Tests** - Complete workflow testing

### Test Coverage

- Controllers - Business logic validation
- Services - Data processing verification
- Middlewares - Request/response handling
- Schemas - Input validation testing

### Running Tests

```bash
# All tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage

# Specific test suites
pnpm test:integration
pnpm test:e2e
```

## 🏗️ Key Architectural Decisions

### 1. TypeScript and Node.Js

- **Why**: I chose Node.js and TypeScript because they are the technologies I have been working with intensively over the past few months. This gives me the confidence to deliver the project within just two days, without wasting time re-learning or adapting to new tools. Moreover, the ecosystem of these technologies allows me to apply modern best practices, strong typing, and clean code organization, ensuring quality even under a tight deadline

### 2. Schemas with Zod

- **Why**: I chose Zod because it provides a straightforward and type-safe way to validate inputs in TypeScript, making it an obvious choice for ensuring data integrity and clean error handling.
- **Implementation**: Zod schemas for runtime validation and OpenAPI generation

### 3. Dependency Injection Container

- **Why**: In the project, I implemented a simple dependency injection container to keep services, repositories, and controllers loosely coupled. This made unit testing and maintenance easier, since each component can be isolated or replaced without impacting the rest of the system.

### 4. Structured Logging

- **Why**: I used structured logging with Pino, enabling request tracing, response time measurement, and error tracking. This is critical for debugging in production and monitoring overall API performance.

### 5. Comprehensive Error Handling

- **Why**: I implemented custom error classes mapped directly to HTTP status codes, returning standardized responses inspired by RFC 7807. This brought consistency across the API, improved the developer/user experience, and made debugging more straightforward.

### 6. Caching Strategy

- **Why**: I added HTTP caching with ETag and Last-Modified headers. This allows clients to reuse cached responses and receive a 304 Not Modified when data hasn’t changed, reducing unnecessary processing and improving performance.

## 🤖 GenAI Integration & Modern Development Tools

### AI-Assisted Development

For this project, I leveraged ChatGPT and Cursor IDE to speed up development and ensure best practices.

#### 1. **Code Generation & Completion**

- **ChatGPT + Cursor IDE**
- **Usage**: Helped design the project architecture, generate boilerplate code, implement middleware patterns, and draft unit/integration tests.

#### 2. **Documentation Generation**

- **Schema Documentation**
- **Usage**: Assisted in creating clear explanations and generating the OpenAPI specification for the API endpoints.

#### 3. **Testing Strategy**

- **Test Case Generation**
- **Usage**: Suggested diverse test scenarios and edge cases, improving overall coverage and robustness of the test suite.

## 🔒 Security Features

- **Helmet.js** - Security headers (XSS, HSTS, etc.)
- **CORS Configuration** - Cross-origin request control
- **Rate Limiting** - API abuse prevention
- **Input Validation** - Zod schema validation
- **Request Size Limits** - DoS attack prevention

## 📈 Performance Features

- **HTTP Caching** - ETag and Last-Modified headers
- **Efficient JSON Parsing** - Optimized Express configuration
- **Structured Logging** - High-performance Pino logger

## 🚀 Deployment

### Environment Variables

```bash
PORT=3000
NODE_ENV=production
```

### Production Considerations

- Process management (PM2 recommended)
- Reverse proxy (Nginx)
- SSL termination
- Log aggregation
- Health monitoring

## 📝 API Response Format

### Successful Responses

All successful API responses follow this consistent format:

```json
{
  "message": "Success",
  "data": {
    // Response payload
  },
  "timestamp": "2025-09-17T14:20:23.451Z"
}
```

**Example - Health Check:**

```json
{
  "status": "ok",
  "timestamp": "2025-09-17T14:20:17.529Z",
  "uptime": 1506.929593916
}
```

**Example - Get All Items (Paginated):**

```json
{
  "message": "Success",
  "data": {
    "items": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "iPhone 15 Pro",
        "price": 999.99,
        "category": "smartphones",
        "brand": "Apple",
        "description": "Latest iPhone with A17 Pro chip and titanium design",
        "features": [
          "A17 Pro chip",
          "48MP camera",
          "Titanium design",
          "USB-C",
          "5G"
        ],
        "rating": 4.8,
        "availability": true,
        "imageUrl": "https://example.com/iphone15pro.jpg",
        "createdAt": "2024-01-01T10:00:00.000Z",
        "updatedAt": "2024-01-01T10:00:00.000Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 2,
      "total": 10,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "timestamp": "2025-09-17T14:20:23.451Z"
}
```

**Example - Get Single Item:**

```json
{
  "message": "Success",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "iPhone 15 Pro",
    "price": 999.99,
    "category": "smartphones",
    "brand": "Apple",
    "description": "Latest iPhone with A17 Pro chip and titanium design",
    "features": [
      "A17 Pro chip",
      "48MP camera",
      "Titanium design",
      "USB-C",
      "5G"
    ],
    "rating": 4.8,
    "availability": true,
    "imageUrl": "https://example.com/iphone15pro.jpg",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  },
  "timestamp": "2025-09-17T14:20:32.090Z"
}
```

**Example - Compare Items:**

```json
{
  "message": "Success",
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "iPhone 15 Pro",
      "price": 999.99,
      "category": "smartphones",
      "brand": "Apple",
      "features": [
        "A17 Pro chip",
        "48MP camera",
        "Titanium design",
        "USB-C",
        "5G"
      ],
      "description": "Latest iPhone with A17 Pro chip and titanium design",
      "imageUrl": "https://example.com/iphone15pro.jpg",
      "rating": 4.8
    },
    {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "name": "Samsung Galaxy S24 Ultra",
      "price": 1199.99,
      "category": "smartphones",
      "brand": "Samsung",
      "features": [
        "Snapdragon 8 Gen 3",
        "200MP camera",
        "S Pen",
        "120Hz display",
        "5G"
      ],
      "description": "Premium Android smartphone with S Pen",
      "imageUrl": "https://example.com/galaxys24ultra.jpg",
      "rating": 4.7
    }
  ],
  "timestamp": "2025-09-17T14:20:37.316Z"
}
```

### Error Responses

Error responses include debugging information:

**Standard Error (Item Not Found):**

```json
{
  "message": "Item with id invalid-id not found",
  "code": 404,
  "timestamp": "2025-09-17T14:20:46.356Z"
}
```

**Route Not Found:**

```json
{
  "message": "Route /invalid-endpoint not found",
  "code": 404,
  "timestamp": "2025-09-17T14:20:55.779Z"
}
```

**Development Environment (includes stack trace):**

```json
{
  "message": "Item with id invalid-id not found",
  "code": 404,
  "timestamp": "2025-09-17T14:20:46.356Z",
  "stack": "Error: Item with id invalid-id not found\\n    at findById (/path/to/controller.ts:62:13)..."
}
```

**Validation Error Response:**

```json
{
  "message": "Invalid data provided",
  "code": 400,
  "timestamp": "2025-09-17T14:20:00.000Z",
  "issues": [
    {
      "code": "invalid_type",
      "message": "Expected string, received number",
      "path": ["name"]
    }
  ]
}
```

## 📊 Data Structure

Products are stored in `data/items.json` with the following structure:

```json
{
  "id": "uuid",
  "name": "string",
  "price": "number",
  "category": "string",
  "brand": "string",
  "description": "string",
  "features": ["string"],
  "rating": "number (0-5)",
  "availability": "boolean",
  "imageUrl": "string (URL)",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```
