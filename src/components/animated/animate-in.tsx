import { animated, useSpring } from '@react-spring/web'
import { HTMLProps } from 'react'

export function AnimateIn({
  delay,
  ref,
  ...props
}: HTMLProps<HTMLDivElement> & {
  delay?: number
}) {
  const animationProps = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay,
  })

  return <animated.div {...props} style={{ ...animationProps }} />
}
