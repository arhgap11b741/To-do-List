export default function SkeletonLoader() {
  return (
    <div className="space-y-6 py-6 md:py-12">
      {/* 할 일 입력 스켈레톤 */}
      <div className="bg-white rounded-xl p-6 md:p-12">
        <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>

      {/* TO DO와 DONE 섹션 스켈레톤 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* TO DO 섹션 스켈레톤 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DONE 섹션 스켈레톤 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
