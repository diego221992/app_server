import * as React from "react"
const SvgComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="hsl(228, 97%, 42%)"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M1 4h6v14H1z">
      <animate
        id="a"
        fill="freeze"
        attributeName="y"
        begin="0;spinner_xVBj.end-0.25s"
        dur="0.75s"
        values="1;5"
      />
      <animate
        fill="freeze"
        attributeName="height"
        begin="0;spinner_xVBj.end-0.25s"
        dur="0.75s"
        values="22;14"
      />
      <animate
        fill="freeze"
        attributeName="opacity"
        begin="0;spinner_xVBj.end-0.25s"
        dur="0.75s"
        values="1;.2"
      />
    </path>
    <path d="M9 4h6v14H9z" opacity={0.4}>
      <animate
        fill="freeze"
        attributeName="y"
        begin="a.begin+0.15s"
        dur="0.75s"
        values="1;5"
      />
      <animate
        fill="freeze"
        attributeName="height"
        begin="a.begin+0.15s"
        dur="0.75s"
        values="22;14"
      />
      <animate
        fill="freeze"
        attributeName="opacity"
        begin="a.begin+0.15s"
        dur="0.75s"
        values="1;.2"
      />
    </path>
    <path d="M17 4h6v14h-6z" opacity={0.3}>
      <animate
        fill="freeze"
        attributeName="y"
        begin="a.begin+0.3s"
        dur="0.75s"
        values="1;5"
      />
      <animate
        fill="freeze"
        attributeName="height"
        begin="a.begin+0.3s"
        dur="0.75s"
        values="22;14"
      />
      <animate
        fill="freeze"
        attributeName="opacity"
        begin="a.begin+0.3s"
        dur="0.75s"
        values="1;.2"
      />
    </path>
  </svg>
)
export default SvgComponent
