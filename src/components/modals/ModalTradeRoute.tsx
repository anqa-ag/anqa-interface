import { Button, Image, Modal, ModalContent, Spacer } from "@nextui-org/react"
import { SOURCES } from "../../constants/source.ts"
import { GetRouteResponseDataPath } from "../../hooks/useQuote.ts"
import { useAppSelector } from "../../redux/hooks/index.ts"
import { Fraction } from "../../utils/fraction.ts"
import { ChevronRight, CloseIcon } from "../Icons.tsx"
import { BodyB2, BodyB3, TitleT1, TitleT5 } from "../Texts.tsx"

// const PATHS = [
//   [
//     {
//       poolId:
//         "0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::weighted_pool::WeightedPool\u003c0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T, 0x1::aptos_coin::AptosCoin, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::base_pool::Null, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::base_pool::Null, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::weighted_pool::Weight_50, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::weighted_pool::Weight_50, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::base_pool::Null, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::base_pool::Null\u003e",
//       source: "thala_swap_weighted",
//       sourceType: "thala_swap_weighted",
//       tokenIn: "0x1::aptos_coin::AptosCoin",
//       tokenOut: "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T",
//       amountIn: "2500000000000000",
//       amountOut: "1581518988845",
//       extra: {
//         tokenInIndex: 1,
//         tokenOutIndex: 0,
//         tokenInWeight: 50,
//         tokenOutWeight: 50,
//       },
//     },
//   ],
//   [
//     {
//       poolId:
//         "0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::TokenPairReserve\u003c0x1::aptos_coin::AptosCoin, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC\u003e",
//       source: "pancake_swap",
//       sourceType: "pancake_swap",
//       tokenIn: "0x1::aptos_coin::AptosCoin",
//       tokenOut: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
//       amountIn: "1000000000000000",
//       amountOut: "3719761851783",
//       extra: {
//         isXToY: true,
//       },
//     },
//     {
//       poolId:
//         "0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::stable_pool::StablePool\u003c0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::base_pool::Null, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::base_pool::Null\u003e",
//       source: "thala_swap_stable",
//       sourceType: "thala_swap_stable",
//       tokenIn: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
//       tokenOut: "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T",
//       amountIn: "3547206683512",
//       amountOut: "773010771651",
//       extra: {
//         tokenInIndex: 1,
//         tokenOutIndex: 0,
//       },
//     },
//   ],
//   [
//     {
//       poolId:
//         "0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::TokenPairReserve\u003c0x1::aptos_coin::AptosCoin, 0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T\u003e",
//       source: "pancake_swap",
//       sourceType: "pancake_swap",
//       tokenIn: "0x1::aptos_coin::AptosCoin",
//       tokenOut: "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T",
//       amountIn: "1000000000000000",
//       amountOut: "546324612590",
//       extra: {
//         isXToY: true,
//       },
//     },
//   ],
//   [
//     {
//       poolId:
//         "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::liquidity_pool::LiquidityPool\u003c0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC, 0x1::aptos_coin::AptosCoin, 0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::curves::Uncorrelated\u003e",
//       source: "liquid_swap_v0",
//       sourceType: "liquid_swap_v0",
//       tokenIn: "0x1::aptos_coin::AptosCoin",
//       tokenOut: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
//       amountIn: "500000000000000",
//       amountOut: "3227372791215",
//       extra: {
//         isXToY: false,
//         isStable: false,
//       },
//     },
//     {
//       poolId:
//         "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::liquidity_pool::LiquidityPool\u003c0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC, 0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::curves::Stable\u003e",
//       source: "liquid_swap_v0",
//       sourceType: "liquid_swap_v0",
//       tokenIn: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
//       tokenOut: "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T",
//       amountIn: "3227372791215",
//       amountOut: "407652631581",
//       extra: {
//         isXToY: false,
//         isStable: true,
//       },
//     },
//   ],
//   [
//     {
//       poolId:
//         "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::liquidity_pool::LiquidityPool\u003c0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT, 0x1::aptos_coin::AptosCoin, 0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::curves::Uncorrelated\u003e",
//       source: "liquid_swap_v0",
//       sourceType: "liquid_swap_v0",
//       tokenIn: "0x1::aptos_coin::AptosCoin",
//       tokenOut: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT",
//       amountIn: "500000000000000",
//       amountOut: "1582904852023",
//       extra: {
//         isXToY: false,
//         isStable: false,
//       },
//     },
//     {
//       poolId:
//         "0x163df34fccbf003ce219d3f1d9e70d140b60622cb9dd47599c25fb2f797ba6e::liquidity_pool::LiquidityPool\u003c0xa2eda21a58856fda86451436513b867c97eecb4ba099da5775520e0f7492e852::coin::T, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT, 0x163df34fccbf003ce219d3f1d9e70d140b60622cb9dd47599c25fb2f797ba6e::curves::Stable\u003e",
//       source: "liquid_swap_v0.5",
//       sourceType: "liquid_swap_v0",
//       tokenIn: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT",
//       tokenOut: "0xa2eda21a58856fda86451436513b867c97eecb4ba099da5775520e0f7492e852::coin::T",
//       amountIn: "1582904852023",
//       amountOut: "401604829253",
//       extra: {
//         isXToY: false,
//         isStable: true,
//       },
//     },
//     {
//       poolId:
//         "0x163df34fccbf003ce219d3f1d9e70d140b60622cb9dd47599c25fb2f797ba6e::liquidity_pool::LiquidityPool\u003c0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T, 0xa2eda21a58856fda86451436513b867c97eecb4ba099da5775520e0f7492e852::coin::T, 0x163df34fccbf003ce219d3f1d9e70d140b60622cb9dd47599c25fb2f797ba6e::curves::Stable\u003e",
//       source: "liquid_swap_v0.5",
//       sourceType: "liquid_swap_v0",
//       tokenIn: "0xa2eda21a58856fda86451436513b867c97eecb4ba099da5775520e0f7492e852::coin::T",
//       tokenOut: "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T",
//       amountIn: "404763834645",
//       amountOut: "400136865177",
//       extra: {
//         isXToY: false,
//         isStable: true,
//       },
//     },
//   ],
//   [
//     {
//       poolId:
//         "0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::weighted_pool::WeightedPool\u003c0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC, 0x1::aptos_coin::AptosCoin, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::base_pool::Null, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::base_pool::Null, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::weighted_pool::Weight_50, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::weighted_pool::Weight_50, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::base_pool::Null, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::base_pool::Null\u003e",
//       source: "thala_swap_weighted",
//       sourceType: "thala_swap_weighted",
//       tokenIn: "0x1::aptos_coin::AptosCoin",
//       tokenOut: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
//       amountIn: "500000000000000",
//       amountOut: "2482447895066",
//       extra: {
//         tokenInIndex: 1,
//         tokenOutIndex: 0,
//         tokenInWeight: 50,
//         tokenOutWeight: 50,
//       },
//     },
//     {
//       poolId: "0xcfaadbe8c0cc5c7cdaa3aefd7c184830d12f2991d1ae70176337550b155a1780",
//       source: "cellana_finance",
//       sourceType: "cellana_finance",
//       tokenIn: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
//       tokenOut: "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T",
//       amountIn: "2482447895066",
//       amountOut: "369815841264",
//       extra: {
//         isXToY: false,
//         isStable: true,
//       },
//     },
//   ],
//   [
//     {
//       poolId:
//         "0x31a6675cbe84365bf2b0cbce617ece6c47023ef70826533bde5203d32171dc3c::swap::TokenPairReserve\u003c0x1::aptos_coin::AptosCoin, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC\u003e",
//       source: "sushi_swap",
//       sourceType: "pancake_swap",
//       tokenIn: "0x1::aptos_coin::AptosCoin",
//       tokenOut: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
//       amountIn: "500000000000000",
//       amountOut: "2063038127154",
//       extra: {
//         isXToY: true,
//       },
//     },
//     {
//       poolId:
//         "0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::stable_pool::StablePool\u003c0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01::mod_coin::MOD, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::base_pool::Null, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::base_pool::Null\u003e",
//       source: "thala_swap_stable",
//       sourceType: "thala_swap_stable",
//       tokenIn: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
//       tokenOut: "0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01::mod_coin::MOD",
//       amountIn: "2063038127154",
//       amountOut: "205416179765684",
//       extra: {
//         tokenInIndex: 1,
//         tokenOutIndex: 0,
//       },
//     },
//     {
//       poolId:
//         "0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::weighted_pool::WeightedPool\u003c0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T, 0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01::mod_coin::MOD, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::base_pool::Null, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::base_pool::Null, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::weighted_pool::Weight_50, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::weighted_pool::Weight_50, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::base_pool::Null, 0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::base_pool::Null\u003e",
//       source: "thala_swap_weighted",
//       sourceType: "thala_swap_weighted",
//       tokenIn: "0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01::mod_coin::MOD",
//       tokenOut: "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T",
//       amountIn: "205416179765684",
//       amountOut: "120986411735",
//       extra: {
//         tokenInIndex: 1,
//         tokenOutIndex: 0,
//         tokenInWeight: 50,
//         tokenOutWeight: 50,
//       },
//     },
//   ],
//   [
//     {
//       poolId:
//         "0x31a6675cbe84365bf2b0cbce617ece6c47023ef70826533bde5203d32171dc3c::swap::TokenPairReserve\u003c0x1::aptos_coin::AptosCoin, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT\u003e",
//       source: "sushi_swap",
//       sourceType: "pancake_swap",
//       tokenIn: "0x1::aptos_coin::AptosCoin",
//       tokenOut: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT",
//       amountIn: "500000000000000",
//       amountOut: "1306053609838",
//       extra: {
//         isXToY: true,
//       },
//     },
//     {
//       poolId:
//         "0x163df34fccbf003ce219d3f1d9e70d140b60622cb9dd47599c25fb2f797ba6e::liquidity_pool::LiquidityPool\u003c0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT, 0x163df34fccbf003ce219d3f1d9e70d140b60622cb9dd47599c25fb2f797ba6e::curves::Stable\u003e",
//       source: "liquid_swap_v0.5",
//       sourceType: "liquid_swap_v0",
//       tokenIn: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT",
//       tokenOut: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
//       amountIn: "1478403307328",
//       amountOut: "1196880028517",
//       extra: {
//         isXToY: false,
//         isStable: true,
//       },
//     },
//     {
//       poolId:
//         "0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::TokenPairReserve\u003c0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC\u003e",
//       source: "pancake_swap",
//       sourceType: "pancake_swap",
//       tokenIn: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
//       tokenOut: "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T",
//       amountIn: "1017005257815",
//       amountOut: "84200079354",
//       extra: {
//         isXToY: false,
//       },
//     },
//   ],
//   [
//     {
//       poolId:
//         "0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::TokenPairReserve\u003c0x1::aptos_coin::AptosCoin, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC\u003e",
//       source: "pancake_swap",
//       sourceType: "pancake_swap",
//       tokenIn: "0x1::aptos_coin::AptosCoin",
//       tokenOut: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
//       amountIn: "500000000000000",
//       amountOut: "172349697490",
//       extra: {
//         isXToY: true,
//       },
//     },
//     {
//       poolId:
//         "0x163df34fccbf003ce219d3f1d9e70d140b60622cb9dd47599c25fb2f797ba6e::liquidity_pool::LiquidityPool\u003c0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT, 0x163df34fccbf003ce219d3f1d9e70d140b60622cb9dd47599c25fb2f797ba6e::curves::Stable\u003e",
//       source: "liquid_swap_v0.5",
//       sourceType: "liquid_swap_v0",
//       tokenIn: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
//       tokenOut: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT",
//       amountIn: "172349697490",
//       amountOut: "334440371759",
//       extra: {
//         isXToY: true,
//         isStable: false,
//       },
//     },
//     {
//       poolId: "0x33e1342ba2f5233dd8257561950d4bc0d23ee09bf49826c73160eec337dd4ea2",
//       source: "cellana_finance",
//       sourceType: "cellana_finance",
//       tokenIn: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT",
//       tokenOut: "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T",
//       amountIn: "334440371759",
//       amountOut: "45663154994",
//       extra: {
//         isXToY: false,
//         isStable: true,
//       },
//     },
//   ],
//   [
//     {
//       poolId:
//         "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::liquidity_pool::LiquidityPool\u003c0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WETH, 0x1::aptos_coin::AptosCoin, 0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::curves::Uncorrelated\u003e",
//       source: "liquid_swap_v0",
//       sourceType: "liquid_swap_v0",
//       tokenIn: "0x1::aptos_coin::AptosCoin",
//       tokenOut: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WETH",
//       amountIn: "500000000000000",
//       amountOut: "60429030",
//       extra: {
//         isXToY: false,
//         isStable: false,
//       },
//     },
//     {
//       poolId:
//         "0x163df34fccbf003ce219d3f1d9e70d140b60622cb9dd47599c25fb2f797ba6e::liquidity_pool::LiquidityPool\u003c0xcc8a89c8dce9693d354449f1f73e60e14e347417854f029db5bc8e7454008abb::coin::T, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WETH, 0x163df34fccbf003ce219d3f1d9e70d140b60622cb9dd47599c25fb2f797ba6e::curves::Stable\u003e",
//       source: "liquid_swap_v0.5",
//       sourceType: "liquid_swap_v0",
//       tokenIn: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WETH",
//       tokenOut: "0xcc8a89c8dce9693d354449f1f73e60e14e347417854f029db5bc8e7454008abb::coin::T",
//       amountIn: "60429030",
//       amountOut: "5992823101",
//       extra: {
//         isXToY: false,
//         isStable: true,
//       },
//     },
//     {
//       poolId:
//         "0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::TokenPairReserve\u003c0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T, 0xcc8a89c8dce9693d354449f1f73e60e14e347417854f029db5bc8e7454008abb::coin::T\u003e",
//       source: "pancake_swap",
//       sourceType: "pancake_swap",
//       tokenIn: "0xcc8a89c8dce9693d354449f1f73e60e14e347417854f029db5bc8e7454008abb::coin::T",
//       tokenOut: "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T",
//       amountIn: "5992823101",
//       amountOut: "36280336208",
//       extra: {
//         isXToY: false,
//       },
//     },
//   ],
//   [
//     {
//       poolId:
//         "0xa5d3ac4d429052674ed38adc62d010e52d7c24ca159194d17ddc196ddb7e480b::pool::Pool\u003c0x1::aptos_coin::AptosCoin, 0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T\u003e",
//       source: "aptoswap",
//       sourceType: "aptoswap",
//       tokenIn: "0x1::aptos_coin::AptosCoin",
//       tokenOut: "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T",
//       amountIn: "500000000000000",
//       amountOut: "12024955572",
//       extra: {
//         isXToY: true,
//       },
//     },
//   ],
//   [
//     {
//       poolId:
//         "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::liquidity_pool::LiquidityPool\u003c0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T, 0x1::aptos_coin::AptosCoin, 0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::curves::Uncorrelated\u003e",
//       source: "liquid_swap_v0",
//       sourceType: "liquid_swap_v0",
//       tokenIn: "0x1::aptos_coin::AptosCoin",
//       tokenOut: "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T",
//       amountIn: "500000000000000",
//       amountOut: "10591261937",
//       extra: {
//         isXToY: false,
//         isStable: false,
//       },
//     },
//   ],
//   [
//     {
//       poolId:
//         "0xbd35135844473187163ca197ca93b2ab014370587bb0ed3befff9e902d6bb541::amm::Pool\u003c0x1::aptos_coin::AptosCoin, 0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T\u003e",
//       source: "aux_exchange",
//       sourceType: "aux_exchange",
//       tokenIn: "0x1::aptos_coin::AptosCoin",
//       tokenOut: "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T",
//       amountIn: "500000000000000",
//       amountOut: "4352498127",
//       extra: {
//         isXToY: true,
//       },
//     },
//   ],
//   [
//     {
//       poolId:
//         "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::liquidity_pool::LiquidityPool\u003c0xa2eda21a58856fda86451436513b867c97eecb4ba099da5775520e0f7492e852::coin::T, 0x1::aptos_coin::AptosCoin, 0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::curves::Uncorrelated\u003e",
//       source: "liquid_swap_v0",
//       sourceType: "liquid_swap_v0",
//       tokenIn: "0x1::aptos_coin::AptosCoin",
//       tokenOut: "0xa2eda21a58856fda86451436513b867c97eecb4ba099da5775520e0f7492e852::coin::T",
//       amountIn: "500000000000000",
//       amountOut: "4305883245",
//       extra: {
//         isXToY: false,
//         isStable: false,
//       },
//     },
//     {
//       poolId: "0xde840ae644c74651a5000001de6fc12cc4194109a7501485cbc55960c614f139",
//       source: "cellana_finance",
//       sourceType: "cellana_finance",
//       tokenIn: "0xa2eda21a58856fda86451436513b867c97eecb4ba099da5775520e0f7492e852::coin::T",
//       tokenOut: "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T",
//       amountIn: "4305883245",
//       amountOut: "4200396189",
//       extra: {
//         isXToY: false,
//         isStable: true,
//       },
//     },
//   ],
//   [
//     {
//       poolId:
//         "0xa5d3ac4d429052674ed38adc62d010e52d7c24ca159194d17ddc196ddb7e480b::pool::Pool\u003c0x1::aptos_coin::AptosCoin, 0xa2eda21a58856fda86451436513b867c97eecb4ba099da5775520e0f7492e852::coin::T\u003e",
//       source: "aptoswap",
//       sourceType: "aptoswap",
//       tokenIn: "0x1::aptos_coin::AptosCoin",
//       tokenOut: "0xa2eda21a58856fda86451436513b867c97eecb4ba099da5775520e0f7492e852::coin::T",
//       amountIn: "500000000000000",
//       amountOut: "3159005392",
//       extra: {
//         isXToY: true,
//       },
//     },
//     {
//       poolId:
//         "0x163df34fccbf003ce219d3f1d9e70d140b60622cb9dd47599c25fb2f797ba6e::liquidity_pool::LiquidityPool\u003c0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T, 0xa2eda21a58856fda86451436513b867c97eecb4ba099da5775520e0f7492e852::coin::T, 0x163df34fccbf003ce219d3f1d9e70d140b60622cb9dd47599c25fb2f797ba6e::curves::Stable\u003e",
//       source: "liquid_swap_v0.5",
//       sourceType: "liquid_swap_v0",
//       tokenIn: "0xa2eda21a58856fda86451436513b867c97eecb4ba099da5775520e0f7492e852::coin::T",
//       tokenOut: "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T",
//       amountIn: "3159005392",
//       amountOut: "3053173368",
//       extra: {
//         isXToY: false,
//         isStable: true,
//       },
//     },
//   ],
// ]

export default function ModalTradeRoute({
  isOpen,
  onClose,
  onOpenChange,
  tokenIn,
  tokenOut,
  readableAmountIn,
  readableAmountOut,
  rawAmountIn,
  paths,
}: {
  isOpen: boolean
  onClose: () => void
  onOpenChange: () => void
  tokenIn: string
  tokenOut: string
  readableAmountIn: string
  readableAmountOut: string
  rawAmountIn: string | undefined
  paths: GetRouteResponseDataPath[][] | undefined
}) {
  const followingTokenData = useAppSelector((state) => state.token.followingTokenData)
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
        hideCloseButton
        onClose={onClose}
      >
        <ModalContent className="max-w-[800px] bg-buttonDisabled p-4 text-foreground dark">
          <>
            <div className="flex items-center justify-between">
              <TitleT1>Your Trade Route</TitleT1>
              <Button isIconOnly variant="light" className="h-[20px] w-[20px] min-w-fit p-0" onPress={onClose}>
                <CloseIcon size={20} />
              </Button>
            </div>

            <Spacer y={4} />

            <div className="h-full w-full rounded bg-background p-4">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-1">
                  <Image
                    width={20}
                    height={20}
                    className="min-h-[20px] min-w-[20px]"
                    src={followingTokenData?.[tokenIn]?.logoUrl}
                  />
                  <TitleT5>
                    {readableAmountIn} {followingTokenData?.[tokenIn]?.symbol || "--"}
                  </TitleT5>
                </div>
                <div className="flex items-center gap-1">
                  <TitleT5>
                    {readableAmountOut} {followingTokenData?.[tokenOut]?.symbol || "--"}
                  </TitleT5>
                  <Image
                    width={20}
                    height={20}
                    className="min-h-[20px] min-w-[20px]"
                    src={followingTokenData?.[tokenOut]?.logoUrl}
                  />
                </div>
              </div>
              <div className="relative flex max-h-[50vh] w-full px-[10px] py-1">
                <div className="absolute left-[10px] z-20 h-full w-px bg-buttonSecondary before:absolute before:left-0 before:top-1 before:h-2 before:w-2 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-primary"></div>
                <div className="absolute right-[10px] z-20 h-full w-px bg-buttonSecondary before:absolute before:left-0 before:top-1 before:h-2 before:w-2 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-primary"></div>
                <div className="flex w-full flex-col gap-3 overflow-auto">
                  {/* ROW */}
                  {(paths || []).map((path, index) => (
                    <div className="relative flex items-center py-4" key={index}>
                      <div className="absolute left-[24px] top-1/2 h-px w-[calc(100%-48px)] bg-tooltipBg"></div>
                      <ChevronRight size={24} className="min-h-[24px] min-w-[24px]" />
                      <BodyB2 className="z-10 w-[52px] min-w-[52px] rounded border-1 border-tooltipBg bg-background px-2 py-1 text-center text-tooltipBg">
                        {rawAmountIn
                          ? new Fraction(path[0].amountIn, rawAmountIn).multiply(100).toSignificant(4) + "%"
                          : "--"}
                      </BodyB2>
                      <div className="z-10 mx-4 flex flex-1 justify-center">
                        <div className="flex gap-[36px]">
                          {path.map((hop, index) => (
                            <div className="rounded border-1 border-buttonDisabled" key={index}>
                              <div className="flex w-[160px] items-center gap-1 bg-buttonDisabled p-2">
                                <Image
                                  width={20}
                                  height={20}
                                  className="min-h-[20px] min-w-[20px]"
                                  src={followingTokenData?.[hop.tokenOut]?.logoUrl}
                                />
                                <TitleT5>{followingTokenData?.[hop.tokenOut]?.symbol || "--"}</TitleT5>
                              </div>
                              <div className="flex w-[160px] items-center gap-1 bg-background p-2">
                                <Image
                                  width={20}
                                  height={20}
                                  className="min-h-[20px] min-w-[20px]"
                                  src={SOURCES[hop.source]?.logoUrl}
                                />
                                <BodyB3 className="text-buttonSecondary">
                                  {SOURCES[hop.source]?.name || "--"}: 100%
                                </BodyB3>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <ChevronRight size={24} className="min-h-[24px] min-w-[24px]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        </ModalContent>
      </Modal>
    </>
  )
}
