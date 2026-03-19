import "./globals.css";

export const metadata = {
  title: "Event Management Dashboard",
  description: "Create, manage, and register for events with ease.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
