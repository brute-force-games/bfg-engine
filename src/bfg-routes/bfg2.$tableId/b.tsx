import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";


const paramsSchema = z.object({
  tableId: z.string(),
})


const Bfg2TableIdBRouteComponent = () => {
  const { tableId } = Route.useParams();
  return <div>Bfg2TableIdRoute: {tableId}</div>
}

export const Route = createFileRoute('/bfg2/$tableId/b')({
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ tableId: params.tableId }),
  },
  component: Bfg2TableIdBRouteComponent,
  // component: Outlet,
})

