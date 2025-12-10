export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#00b4db] to-[#0083b0] flex flex-col items-center justify-center safe-area-top safe-area-bottom">
      <div className="text-8xl mb-8 animate-[bounce_1s_infinite]">📝</div>
      <h1 className="text-4xl font-bold text-white mb-4 tracking-wider">BnotasWeb</h1>
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
