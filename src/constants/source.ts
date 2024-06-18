export const SOURCES: Record<string, { name: string; logoUrl: string }> = {
  pancake_swap: { name: "PancakeSwap", logoUrl: "/images/pancakeswap.ico" },
  sushi_swap: { name: "SushiSwap", logoUrl: "/images/sushiswap.ico" },
  liquid_swap_v0: { name: "LiquidSwap", logoUrl: "/images/liquidswap.ico" },
  "liquid_swap_v0.5": { name: "LiquidSwap", logoUrl: "/images/liquidswap.ico" },
  thala_swap_stable: { name: "ThalaSwap", logoUrl: "/images/thalaswap.ico" },
  thala_swap_weighted: { name: "ThalaSwap", logoUrl: "/images/thalaswap.ico" },
  // "bapt_swap_v1",
  // "bapt_swap_v2",
  // "bapt_swap_v2.1",
  aux_exchange: { name: "AuxExchange", logoUrl: "/images/auxexchange.svg" },
  cellana_finance: { name: "CellanaFinance", logoUrl: "/images/cellana.png" },
  cetus_amm: { name: "Cetus", logoUrl: "/images/cetus.ico" },
  aptoswap: { name: "Aptoswap", logoUrl: "/images/aptoswap.ico" },
  anime_swap: { name: "AnimeSwap", logoUrl: "/images/animeswap.ico" },
  econia: { name: "Econia", logoUrl: "/images/econia.png" },
  obric_v3_abel: { name: "Obric", logoUrl: "/images/obric.ico" },
}

export function sourceToName(source: string): string {
  if (SOURCES[source]) return SOURCES[source].name
  return source
    .split("_")
    .map((word) => {
      if (word.length) {
        word = word[0].toUpperCase() + word.slice(1)
        return word
      }
      return word
    })
    .join("")
}
