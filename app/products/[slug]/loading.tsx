export default function ProductLoading() {
  return (
    <div className="min-h-screen">
      {/* Nav placeholder */}
      <div className="h-[73px] bg-white border-b border-[#E8E4DE]" />

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image skeleton */}
          <div className="aspect-[3/4] bg-[#E8E4DE] animate-pulse rounded-lg" />

          {/* Info skeleton */}
          <div className="space-y-4">
            <div className="h-4 bg-[#E8E4DE] animate-pulse rounded w-1/4" />
            <div className="h-10 bg-[#E8E4DE] animate-pulse rounded w-3/4" />
            <div className="h-5 bg-[#E8E4DE] animate-pulse rounded w-1/3" />
            <div className="h-8 bg-[#E8E4DE] animate-pulse rounded w-1/4" />
            <div className="h-24 bg-[#E8E4DE] animate-pulse rounded" />
            <div className="h-14 bg-[#E8E4DE] animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
