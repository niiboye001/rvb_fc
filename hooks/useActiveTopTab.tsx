import { useNavigationState } from "@react-navigation/native";

/**
 * Returns the active tab name of a nested navigator.
 *
 * @param parentName - The name of the parent navigator (e.g., bottom tabs)
 * @param childName - The name of the nested navigator (e.g., top tabs)
 * @returns The active route name, or null if not found
 */
export function useActiveNestedTab(parentName: string, childName: string) {
  return useNavigationState((state) => {
    // Find parent navigator
    const parentRoute = state.routes.find((r) => r.name === parentName);
    const parentState = parentRoute?.state;
    if (!parentState) return null;

    // Find child navigator
    const childRoute = parentState.routes.find((r) => r.name === childName);
    const childState = childRoute?.state as any; // safely cast to any
    if (!childState || typeof childState.index !== "number") return null;

    // Return active route name
    return childState.routes[childState.index]?.name ?? null;
  });
}
