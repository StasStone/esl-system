import { useEffect, useRef } from 'react'
import { Position } from '../models/position'

export default function usePosition(
  openId: number,
  id: number,
  position: Position | null
) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (openId === id && ref.current && position) {
      const { x, y } = position
      ref.current.style.position = 'absolute'
      ref.current.style.top = `${y}px`
      ref.current.style.left = `${x}px`
    }
  }, [openId, id])

  return ref
}
