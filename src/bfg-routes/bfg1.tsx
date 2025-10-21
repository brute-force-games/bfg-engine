import { createFileRoute } from '@tanstack/react-router'

const Bfg1RouteComponent = () => {
  return <div>Bfg1</div>
}

export const Route = createFileRoute('/bfg1')({
  component: Bfg1RouteComponent,
})
