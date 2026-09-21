import localFont from "next/font/local";
import "./globals.css";

const typewriter = localFont({
  src: "../public/fonts/typewriter-condensed.woff2",
  variable: "--font-typewriter-raw",
  display: "swap",
});

export const metadata = {
  title: "johanna nordlander",
  description: "Johanna Nordlander — makeup artist & art director",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${typewriter.variable} font-typewriter antialiased`}>
        {children}
      </body>
    </html>
  );
}
