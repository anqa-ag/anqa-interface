import { PartialRecord } from '../types'

export const SUPPORTED_POOLS: PartialRecord<string, { name: string; shortName: string; logoUrl: string }> = {
  pancake_swap: {
    name: 'PancakeSwap',
    shortName: 'Pancake',
    logoUrl: '/images/pancakeswap.ico',
  },
  sushi_swap: {
    name: 'SushiSwap',
    shortName: 'Sushi',
    logoUrl: '/images/sushiswap.ico',
  },
  liquid_swap_v0: {
    name: 'LiquidSwap',
    shortName: 'Liquid',
    logoUrl: '/images/liquidswap.ico',
  },
  'liquid_swap_v0.5': {
    name: 'LiquidSwap',
    shortName: 'Liquid',
    logoUrl: '/images/liquidswap.ico',
  },
  thala_swap_stable: {
    name: 'ThalaSwap',
    shortName: 'Thala',
    logoUrl: '/images/thalaswap.ico',
  },
  thala_swap_weighted: {
    name: 'ThalaSwap',
    shortName: 'Thala',
    logoUrl: '/images/thalaswap.ico',
  },
  // "bapt_swap_v1",
  // "bapt_swap_v2",
  // "bapt_swap_v2.1",
  aux_exchange: {
    name: 'AuxExchange',
    shortName: 'Aux',
    logoUrl: '/images/auxexchange.svg',
  },
  cellana_finance: {
    name: 'CellanaFinance',
    shortName: 'Cellana',
    logoUrl: '/images/cellana.png',
  },
  cetus_amm: {
    name: 'Cetus',
    shortName: 'Cetus',
    logoUrl: '/images/cetus.ico',
  },
  aptoswap: {
    name: 'Aptoswap',
    shortName: 'Aptos',
    logoUrl: '/images/aptoswap.ico',
  },
  anime_swap: {
    name: 'AnimeSwap',
    shortName: 'Anime',
    logoUrl: '/images/animeswap.ico',
  },
  econia: {
    name: 'Econia',
    shortName: 'Econia',
    logoUrl: '/images/econia.png',
  },
  obric_v3_abel: {
    name: 'Obric',
    shortName: 'Obric',
    logoUrl: '/images/obric.ico',
  },
  movepump_swap: {
    name: 'Movepump',
    shortName: 'Movepump',
    logoUrl: 'https://movepump.com/images/icons/movepump-logo.svg',
  },
}
