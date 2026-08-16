import useReveal from '../hooks/useReveal.js'

/**
 * Wraps children in a div that fades/slides into view on scroll.
 * Pass `as` to render a different element, and `className` for extra styling.
 */
export default function Reveal({ children, as: Tag = 'div', className = '', ...rest }) {
  const [ref, inView] = useReveal()

  return (
    <Tag ref={ref} className={`reveal${inView ? ' in' : ''} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  )
}
