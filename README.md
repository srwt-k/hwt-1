# Food Store Calculator

Food store ordering app with discount calculator built with Next.js and MySQL.

## Stack

- **Next.js** — App
- **MySQL 8** — Database
- **Prisma 7** — ORM
- **Bun** — Runtime & Package Manager

## Run

```bash
docker compose up -d
```

Default app will be available at [http://localhost:3000](http://localhost:3000)

### Migrate & Seed (first time)

```bash
docker compose --profile tools up migrate-seed
```

## Test

```bash
bun run test
```
