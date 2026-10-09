import { useIsDesktop } from "../../hooks/useMediaQuery";
import { BottomDrawer } from "./BottomDrawer";
import { Sidebar } from "./Sidebar";

export function SpotPanel() {
  const isDesktop = useIsDesktop();
  return isDesktop ? <Sidebar /> : <BottomDrawer />;
}
