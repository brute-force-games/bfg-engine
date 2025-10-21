import { createRootRoute } from '@tanstack/react-router'

const RootComponent = () => {
  return <div>BFG Engine Root (should not be used)</div>
}

export const Route = createRootRoute({
  component: RootComponent,
})


