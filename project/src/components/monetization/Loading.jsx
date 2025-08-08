function Loading() {
  return (
    <div className="text-2xl bg-slate-600 h-screen w-screen text-white flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
        </div>
        <h2 className="text-3xl font-bold mb-4">Loading...</h2>
        <p className="text-lg text-gray-300">Please wait while we check your access...</p>
      </div>
    </div>
  )
}

export default Loading 