import { DemoShell } from "@/shared/ui/demo-shell";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <DemoShell>{children}</DemoShell>;
}
