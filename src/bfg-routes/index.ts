import { routeTree as bfgRouteTree } from './bfg-routeTree.gen'

/**
 * Gets the BFG route children, updated to attach to a given root route.
 * Automatically discovers all routes from the generated route tree.
 * @param rootRoute - The root route from the app
 * @returns Object containing all BFG child routes re-parented to the app's root
 */
export const getBfgRouteChildren = (rootRoute: any) => {
  // Extract children from the BFG generated route tree (stored as an array)
  const bfgChildrenArray = (bfgRouteTree as any).children || []
  
  // Convert array to object with proper named keys and re-parent routes to the app's root
  const updatedChildren: Record<string, any> = {}
  
  for (let i = 0; i < bfgChildrenArray.length; i++) {
    const route = bfgChildrenArray[i]
    const routeOptions = (route as any).options || {}
    const routeId = routeOptions.id || `/route${i}`
    
    // Convert route id like "/bfg1" to "Bfg1Route" to match TanStack Router's naming convention
    const pathPart = routeId.replace('/', '')
    const routeName = pathPart.charAt(0).toUpperCase() + pathPart.slice(1) + 'Route'
    
    // Re-parent the route to use the app's root route instead of BFG's internal root
    updatedChildren[routeName] = (route as any).update({
      getParentRoute: () => rootRoute,
    } as any)
  }
  
  return updatedChildren
}

/**
 * Combines BFG routes with an app's generated route tree
 * @param generatedRouteTree - The auto-generated route tree from TanStack Router
 * @param rootRoute - The root route from the app
 * @returns Combined route tree with BFG routes + app routes
 */
export const combineBfgRoutesWithAppRoutes = (generatedRouteTree: any, rootRoute: any) => {
  // Get BFG route children (re-parented to the app's root)
  const bfgChildren = getBfgRouteChildren(rootRoute)
  
  // Get existing app route children from the generated tree
  const appChildren = (generatedRouteTree as any).children || {}
  
  // Combine: BFG routes first, then app routes
  const allChildren = {
    ...bfgChildren,
    ...appChildren,
  }
  
  // Build the final tree
  return rootRoute._addFileChildren(allChildren)
}


