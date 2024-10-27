# Rand – A drand client as a CosmWasm smart contract

To learn more about this project, see this article: https://medium.com/confio/when-your-blockchain-needs-to-roll-the-dice-ed9da121f590

## Development build

Some fast checks

```sh
cargo fmt && cargo unit-test && cargo check --tests && cargo schema && cargo clippy -- -D warnings
```

Integratin tests

```sh
cargo wasm && cargo integration-test
```

### Run in singlepass

In order to measure gas consumption, singlepass tests need to be used. E.g.

```sh
cargo wasm
cargo integration-test --no-default-features verify_valid -- --nocapture
```

## Production build

```
docker run --rm -v "$(pwd)":/code \
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/rust-optimizer:0.12.5
```
