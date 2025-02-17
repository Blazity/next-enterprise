name: Check

on:
  push:
    branches:
      - main
      - master
      - develop
  pull_request:
  workflow_dispatch:

jobs:
  check:
    name: Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "node_version=$(cat .github/nodejs.version)" >> $GITHUB_ENV
      - name: "use node ${{ env.node_version }}"
        uses: actions/setup-node@v3
        with:
          node-version: "${{ env.node_version }}"

      - name: "Install pnpm & dependencies"
        uses: pnpm/action-setup@v4
        with:
          run_install: |
            - recursive: true
            - args: [--frozen-lockfile]

      - name: Lint check
        run: pnpm run lint
      - name: Format check
        run: pnpm run prettier
      - name: Unit & Integration tests
        run: pnpm run test
      - name: Smoke & Acceptance tests
        run: |
          pnpm run build-storybook --quiet
          pnpm playwright install
          pnpm dlx concurrently -k -s first -n "SB,TEST" -c "magenta,blue" \
            "pnpm dlx http-server storybook-static --port 6006 --silent" \
            "pnpm dlx wait-on tcp:127.0.0.1:6006 && pnpm run test-storybook"
