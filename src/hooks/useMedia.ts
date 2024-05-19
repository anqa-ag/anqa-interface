import { useMedia } from "react-use"

export function useIs2Xl() {
  return useMedia("(max-width: 1535px)")
}

export function useIsXl() {
  return useMedia("(max-width: 1279px)")
}

export function useIsLg() {
  return useMedia("(max-width: 1023px)")
}

export function useIsMd() {
  return useMedia("(max-width: 767px)")
}

export function useIsSm() {
  return useMedia("(max-width: 639px)")
}
