import * as React from "react"
const SvgComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="hsl(228, 97%, 42%)"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M12 1a11 11 0 1 0 11 11A11 11 0 0 0 12 1Zm0 20a9 9 0 1 1 9-9 9 9 0 0 1-9 9Z" />
    <rect width={2} height={7} x={11} y={6} rx={1}>
      <animateTransform
        attributeName="transform"
        dur="9s"
        repeatCount="indefinite"
        type="rotate"
        values="0 12 12;360 12 12"
      />
    </rect>
    <rect width={2} height={9} x={11} y={11} rx={1}>
      <animateTransform
        attributeName="transform"
        dur="0.75s"
        repeatCount="indefinite"
        type="rotate"
        values="0 12 12;360 12 12"
      />
    </rect>
  </svg>
)
export default SvgComponent
