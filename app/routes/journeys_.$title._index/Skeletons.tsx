export function FetchingHeaderSkeleton() {
  return (
    <div className="mb-8 flex items-center justify-between animate-pulse">
      <div className="w-full flex items-center gap-2">
        <div className="w-[110px] h-5 bg-neutral-grey-400 flex items-center gap-2 rounded-lg"></div>
        <div className="w-24 h-5 bg-neutral-grey-400 flex items-center gap-2 rounded-lg"></div>
      </div>
      <div className="w-24 h-5 bg-neutral-grey-400 rounded-lg"></div>
    </div>
  );
}

export function FetchingBodySkeleton() {
  return (
    <>
      <div className="space-y-4">
        <div className="space-y-3 animate-pulse">
          <div className="bg-neutral-grey-400 w-20 h-5 rounded-full"></div>
          <div className="bg-neutral-grey-400 w-60 h-8 rounded-full"></div>
        </div>

        <div className="bg-neutral-grey-400 w-full h-[200px] rounded-lg"></div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-2">
        <div className="h-10 w-full bg-neutral-grey-400 rounded-lg"></div>
        <div className="h-10 w-full bg-neutral-grey-400 rounded-lg"></div>
        <div className="h-10 w-full bg-neutral-grey-400 rounded-lg"></div>
      </div>
    </>
  );
}
