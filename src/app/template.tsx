import type { ReactNode } from "react";

/**
 * Re-mounts on every navigation, so each page arrives with a soft fade (see
 * .page-enter in globals.css). Header and footer live in the layout, outside
 * this wrapper, so they stay steady while the page content changes.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
