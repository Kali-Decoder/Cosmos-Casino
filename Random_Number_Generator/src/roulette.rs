// src/contract.rs
use cosmwasm_std::{
    entry_point, to_binary, BankMsg, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult,
    Uint128, WasmMsg, Coin,
};
use cw_storage_plus::{Item, Map};
use serde::{Deserialize, Serialize};

// House edge and limits
const HOUSE_EDGE: u8 = 2; // 2% house edge
const MAX_BET: u128 = 1_000_000; // Max bet of 1 million ucosm
const MIN_BET: u128 = 1_000; // Min bet of 1000 ucosm

// Bet structure
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct Bet {
    player: String,
    amount: Uint128,
    chosen_number: u8,
    payout: Uint128,
    resolved: bool,
}

// Config structure for VRF address and house wallet
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct Config {
    pub vrf_address: String,  // Address of VRF provider
    pub house_wallet: String, // Wallet for house funds
}

// Store bet and config data
pub const BETS: Map<u64, Bet> = Map::new("bets");
pub const CONFIG: Item<Config> = Item::new("config");

// Instantiate contract with VRF and house wallet config
#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: Config,
) -> StdResult<Response> {
    CONFIG.save(deps.storage, &msg)?;
    Ok(Response::default())
}

// Messages for placing bets, resolving bets, and withdrawing house funds
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum ExecuteMsg {
    PlaceBet { chosen_number: u8 },
    ResolveBet { bet_id: u64, random_number: u8 },
    WithdrawHouseFunds { amount: Uint128 },
}

// Place a bet
fn place_bet(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    chosen_number: u8,
) -> StdResult<Response> {
    let bet_amount = info
        .funds
        .iter()
        .find(|coin| coin.denom == "ucosm")
        .map(|coin| coin.amount)
        .unwrap_or_else(Uint128::zero);

    // Validate bet amount
    if bet_amount.u128() < MIN_BET || bet_amount.u128() > MAX_BET {
        return Err(cosmwasm_std::StdError::generic_err("Invalid bet amount"));
    }

    // Calculate payout based on chosen number
    let payout = bet_amount * Uint128::from(36u128 * (100 - HOUSE_EDGE) as u128 / 100);
    let bet_id = env.block.time.seconds(); // Use timestamp as unique ID

    // Store the bet
    let bet = Bet {
        player: info.sender.to_string(),
        amount: bet_amount,
        chosen_number,
        payout,
        resolved: false,
    };
    BETS.save(deps.storage, bet_id, &bet)?;

    // Simulate VRF request to get a random number for the bet
    let config = CONFIG.load(deps.storage)?;
    let vrf_request = WasmMsg::Execute {
        contract_addr: config.vrf_address,
        msg: to_binary(&RequestRandomness { request_id: bet_id })?,
        funds: vec![],
    };

    Ok(Response::new()
        .add_message(vrf_request)
        .add_attribute("action", "place_bet")
        .add_attribute("bet_id", bet_id.to_string())
        .add_attribute("bet_amount", bet_amount.to_string())
        .add_attribute("chosen_number", chosen_number.to_string()))
}

// Resolve a bet once the VRF returns a random number
fn resolve_bet(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    bet_id: u64,
    random_number: u8,
) -> StdResult<Response> {
    let mut bet = BETS.load(deps.storage, bet_id)?;

    // Ensure the bet has not already been resolved
    if bet.resolved {
        return Err(cosmwasm_std::StdError::generic_err("Bet already resolved"));
    }

    // Calculate the result number (0-36)
    let result_number = random_number % 37;
    let is_win = result_number == bet.chosen_number;

    // Prepare response based on outcome
    let response = if is_win {
        // Send payout if the player wins
        let payout = bet.payout;
        let send_msg = BankMsg::Send {
            to_address: bet.player.clone(),
            amount: vec![Coin {
                denom: "ucosm".to_string(),
                amount: payout,
            }],
        };
        Response::new()
            .add_message(send_msg)
            .add_attribute("status", "win")
            .add_attribute("payout", payout.to_string())
    } else {
        // Record loss if the player loses
        Response::new().add_attribute("status", "loss")
    };

    // Mark bet as resolved
    bet.resolved = true;
    BETS.save(deps.storage, bet_id, &bet)?;
    Ok(response.add_attribute("result_number", result_number.to_string()))
}

// Withdraw house funds
fn withdraw_house_funds(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    amount: Uint128,
) -> StdResult<Response> {
    let config = CONFIG.load(deps.storage)?;

    // Only the house wallet can withdraw funds
    if info.sender != config.house_wallet {
        return Err(cosmwasm_std::StdError::generic_err("Unauthorized"));
    }

    // Send funds from the contract balance
    let send_msg = BankMsg::Send {
        to_address: config.house_wallet,
        amount: vec![Coin {
            denom: "ucosm".to_string(),
            amount,
        }],
    };

    Ok(Response::new()
        .add_message(send_msg)
        .add_attribute("action", "withdraw_funds"))
}

// Define entry points for executing contract messages
#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::PlaceBet { chosen_number } => place_bet(deps, env, info, chosen_number),
        ExecuteMsg::ResolveBet { bet_id, random_number } => {
            resolve_bet(deps, env, info, bet_id, random_number)
        }
        ExecuteMsg::WithdrawHouseFunds { amount } => withdraw_house_funds(deps, env, info, amount),
    }
}

// Struct to request randomness from VRF
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct RequestRandomness {
    pub request_id: u64,
}

// Define queries (if needed)
#[entry_point]
pub fn query(_deps: Deps, _env: Env, _msg: ()) -> StdResult<Binary> {
    Ok(to_binary("Queries not implemented")?)
}