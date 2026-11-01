import * as React from "react"
const SvgComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="hsl(228, 97%, 42%)"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle cx={12} cy={12} r={0}>
      <animate
        id="a"
        fill="freeze"
        attributeName="r"
        begin="0;spinner_xBIM.end"
        calcMode="spline"
        dur="1.2s"
        keySplines=".52,.6,.25,.99"
        values="0;11"
        repeatCount="indefinite"
      />
      <animate
        fill="freeze"
        attributeName="opacity"
        begin="0;spinner_xBIM.end"
        calcMode="spline"
        dur="1.2s"
        keySplines=".52,.6,.25,.99"
        values="1;0"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx={12} cy={12} r={0}>
      <animate
        fill="freeze"
        attributeName="r"
        begin="a.begin+0.2s"
        calcMode="spline"
        dur="1.2s"
        keySplines=".52,.6,.25,.99"
        values="0;11"
        repeatCount="indefinite"
      />
      <animate
        fill="freeze"
        attributeName="opacity"
        begin="a.begin+0.2s"
        calcMode="spline"
        dur="1.2s"
        keySplines=".52,.6,.25,.99"
        values="1;0"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx={12} cy={12} r={0}>
      <animate
        fill="freeze"
        attributeName="r"
        begin="a.begin+0.4s"
        calcMode="spline"
        dur="1.2s"
        keySplines=".52,.6,.25,.99"
        values="0;11"
        repeatCount="indefinite"
      />
      <animate
        fill="freeze"
        attributeName="opacity"
        begin="a.begin+0.4s"
        calcMode="spline"
        dur="1.2s"
        keySplines=".52,.6,.25,.99"
        values="1;0"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
)
export default SvgComponent