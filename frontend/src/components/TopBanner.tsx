import React from "react";

export default function TopBanner() {
  return (
    <div className="bg-blue-700 text-white text-sm py-2 px-4 flex justify-center items-center gap-2 cursor-pointer hover:bg-blue-800 transition">
      <span className="bg-orange-500 text-xs font-bold px-1.5 py-0.5 rounded">
        HOT
      </span>
      <span>Khám phá việc làm Cloud & Infrastructure nổi bật.</span>
      <span className="font-semibold underline decoration-solid underline-offset-2">
        Xem ngay &rarr;
      </span>
    </div>
  );
}
