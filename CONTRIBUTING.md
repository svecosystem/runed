## Contributing to Runed

Thanks for helping improve Runed. This repo is a pnpm workspace monorepo with the core library in
`packages/runed` and the docs site in `sites/docs`.

### Prerequisites

- Node >= 20
- pnpm >= 10.12 (repo pins `pnpm@10.17.0`)

Optional but recommended:

- Playwright browsers installed for integration tests

```bash
corepack enable
corepack prepare pnpm@10.17.0 --activate
pnpm -v
```

### Clone & install

```bash
git clone https://github.com/svecosystem/runed.git
cd runed
pnpm install
```

### Common workspace commands (from repo root)

Dev (builds/watches all packages and runs the dev server for the docs site):

```bash
pnpm dev
```

```bash
pnpm test
```

### Adding a new utility

Use the generator. It scaffolds the library files, docs page, and demo stub.

```bash
pnpm run add
# Answer the prompt with the utility name
```

The generator will:

- Create `packages/runed/src/lib/utilities/<utility-kebab>/<utility-kebab>.svelte.ts`
- Export it via `packages/runed/src/lib/utilities/<utility-kebab>/index.ts` and append to the
  utilities barrel
- Create docs at `sites/docs/src/content/utilities/<utility-kebab>.md` with frontmatter
- Create a demo at `sites/docs/src/lib/components/demos/<utility-kebab>.svelte`

Next steps after scaffolding:

- Implement the utility in the generated `.svelte.ts` file
- Add tests near the utility (Vitest and/or Svelte component tests)
- Flesh out the docs page and the demo component

### Testing guidance

- Prefer unit tests with Vitest; add component tests where UI behaviors matter
- Integration tests use Playwright; keep them minimal and fast

### Linting, formatting, and type safety

- Prettier is the source of truth for formatting. ESLint and oxlint enforce code quality
- Typecheck with `pnpm check` (root)

### Versioning & changesets

We use Changesets for versioning. Every user-visible change to the published package should include
a changeset. Changesets will be added by maintainers during the PR process.

### Pull request checklist

- [ ] Code is formatted and linted (`pnpm lint`, `pnpm format`)
- [ ] Types pass (`pnpm check`)
- [ ] Tests pass locally (`pnpm test`)
- [ ] Docs updated if applicable (content + demo)

If anything here is unclear or out of date, feel free to open a PR to improve this document.
