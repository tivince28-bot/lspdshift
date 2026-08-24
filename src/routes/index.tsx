import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { Desk } from "@/components/desk";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <>
      <Desk />
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          className: "ls-toast",
        }}
      />
    </>
  );
}
