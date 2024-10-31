export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-foreground">
      <div className="loader ease-linear rounded-full border-4 border-t-4 border-t-blue-500 border-gray-200 h-12 w-12 mb-4 animate-spin"></div>
      <p className="text-lg font-semibold">Loading...</p>
    </div>
  );
}
