function BackgroundGradient() {
  return (
    <div className="pointer-events-none fixed top-0 left-0 -z-10 h-full w-full overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-green-500/10 blur-[120px]" />
      <div className="absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
    </div>
  );
}

export default BackgroundGradient;
