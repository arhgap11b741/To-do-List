import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white px-6 md:px-12 py-[10px] border-b border-slate-200">
      <div className="max-w-6xl mx-auto flex items-center">
        {/* 데스크탑: ic_logo,large.svg, 모바일: ic_logo,small.svg */}
        <Link
          href="/"
          className="relative w-[120px] h-[32px] md:w-[151px] md:h-[40px] cursor-pointer hover:opacity-80 transition-opacity"
          aria-label="홈으로 이동"
        >
          <Image
            src="/icons/ic_logo,large.svg"
            alt="do it;"
            fill
            className="hidden md:block object-contain"
            priority
          />
          <Image
            src="/icons/ic_logo,small.svg"
            alt="do it;"
            fill
            className="block md:hidden object-contain"
            priority
          />
        </Link>
      </div>
    </header>
  );
}
