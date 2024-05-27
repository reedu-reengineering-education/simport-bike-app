import { useSettingsStore } from '@/lib/store/useSettingsStore'
import { animated, useSpring } from '@react-spring/web'

type AnimatedNumberProps = React.HTMLAttributes<HTMLSpanElement> & {
  children: number
  decimals?: number
}

export default function AnimatedNumber({
  children,
  decimals,
  ...props
}: AnimatedNumberProps) {
  const reducedMotion = useSettingsStore(state => state.reducedMotion)

  const springProps = useSpring({ val: children, from: { val: 0 } })

  if (reducedMotion)
    return (
      <span {...props}>
        {new Intl.NumberFormat('de-DE', {
          maximumFractionDigits: decimals || 0,
        }).format(children)}
      </span>
    )

  return (
    <animated.span {...props}>
      {springProps.val.to(val =>
        new Intl.NumberFormat('de-DE', {
          maximumFractionDigits: decimals || 0,
        }).format(val),
      )}
    </animated.span>
  )
}
