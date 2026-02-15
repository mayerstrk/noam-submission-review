declare module "hover-tilt/web-component" { }

declare namespace JSX {
  interface IntrinsicElements {
    "hover-tilt": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      "tilt-factor"?: string
      "tilt-factor-y"?: string
      "scale-factor"?: string
      shadow?: boolean | string
      "shadow-blur"?: string
      "glare-intensity"?: string
      "glare-hue"?: string
      "blend-mode"?: string
      "enter-delay"?: string
      "exit-delay"?: string
      "spring-options"?: string
      "tilt-spring-options"?: string
      "glare-mask"?: string
      "glare-mask-mode"?: string
      "glare-mask-composite"?: string
    }
  }
}
