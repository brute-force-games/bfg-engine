import { createFileRoute, Outlet } from '@tanstack/react-router'

const Bfg2RouteComponent = () => {
  return <div>Bfg2</div>
}

export const Route = createFileRoute('/bfg2/$tableId')({
  // component: Bfg2RouteComponent,
  component: Outlet,
})
