# Meli Compare API

API de comparação de produtos construída com Node.js, TypeScript e Express.

## Características

- **Stack**: Node.js LTS, TypeScript, Express
- **Validação**: Zod para entrada e saída
- **Logs**: Pino com correlação de request
- **Documentação**: Swagger UI
- **Testes**: Jest + Supertest
- **Qualidade**: ESLint + Prettier
- **Segurança**: Helmet, CORS, Rate Limiting
- **Cache**: ETag/Last-Modified
- **Erros**: Padrão RFC7807 (application/problem+json)

## Endpoints

- `GET /health` - Health check
- `GET /items` - Lista items com filtros, ordenação e paginação
- `GET /items/:id` - Busca item por ID
- `GET /compare?ids=a,b,c` - Compara items (retorna apenas campos de comparação)

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Executar testes
npm test

# Executar testes com watch
npm run test:watch

# Executar testes com coverage
npm run test:coverage

# Lint
npm run lint

# Formatar código
npm run format

# Build
npm run build

# Executar produção
npm start
```

## Documentação

A documentação da API está disponível em `/api-docs` quando o servidor estiver rodando.

## Estrutura

```
src/
├── config/          # Configurações (env, logger, container, swagger)
├── controllers/     # Controllers (camada de apresentação)
├── middlewares/     # Middlewares (error handling, request ID)
├── repository/      # Camada de dados (com hot-reload)
├── routes/          # Definição de rotas
├── schemas/         # Schemas Zod e tipos TypeScript
└── services/        # Lógica de negócio
```

## Dados

Os dados são carregados do arquivo `data/items.json` com hot-reload automático.
