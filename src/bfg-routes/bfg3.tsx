import { createFileRoute } from '@tanstack/react-router'

const Bfg3RouteComponent = () => {
  return <div>Bfg3</div>
}

export const Route = createFileRoute('/bfg3')({
  component: Bfg3RouteComponent,
})
