import "./globals.css";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";
import { Toaster } from "sonner";

export const metadata = {
  title: "Todo App",
  description: "A simple todo application built with Next.js",
  keywords: ["todo", "nextjs", "typescript"],
  authors: [{ name: "Yodig Nor R" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          {children}
          <Toaster position="top-center" richColors />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
