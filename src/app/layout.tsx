import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "do it; 할일 관리 앱",
  description:
    "할 일을 추가, 수정, 삭제할 수 있습니다. 할 일을 완료/미완료 상태로 전환할 수 있습니다. 각 할 일의 상세 정보를 확인하고 메모를 추가할 수 있습니다. 모바일과 데스크톱에서 모두 최적화된 UI를 제공합니다. 세련된 사용자 인터페이스",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        <main className="min-h-screen bg-[#F9FAFB] px-6 md:px-12">
          <div className="max-w-[1200px] mx-auto">{children}</div>
        </main>
      </body>
    </html>
  );
}
