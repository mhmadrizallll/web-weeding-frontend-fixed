// import "../app/global.css";
import "@/styles/invitation.css";

export const metadata = {
  title: "Harikita",
  description: "Website Undangan Digital Modern",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}