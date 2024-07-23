import React from "react";

export async function loader() {
  return null;
}

export default function test() {
  return (
    <div className="mt-6 px-3 space-y-4">
      <div className="w-[120px] h-7 bg-neutral-grey-400 animate-pulse rounded-lg"></div>
      <div className="w-2/3 h-7 bg-neutral-grey-400 animate-pulse rounded-lg"></div>
      <div className="grid w-full h-5/6 bg-neutral-grey-400 animate-pulse rounded-lg"></div>
    </div>
  );
}
