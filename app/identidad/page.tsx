"use client";

import { DemoProvider } from "@/domain/demo/provider";
import { IdentityDemo } from "@/features/identity-demo/identity-demo";
import "./identity.css";

export default function IdentityPage() {
  return (
    <DemoProvider>
      <IdentityDemo />
    </DemoProvider>
  );
}
