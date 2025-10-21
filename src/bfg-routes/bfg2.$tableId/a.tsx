import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/bfg2/$tableId/a')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/bfg2/$tableId/a"!</div>
}
