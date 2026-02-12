function BackgroundGradient() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-full w-full overflow-hidden">
      <div className="absolute top-[-10%] left-[-20%] h-1/2 w-1/2 rounded-full bg-green-500/10 blur-[100px]" />
      <div className="absolute top-[30%] left-[65%] h-1/2 w-1/2 rounded-full bg-green-500/10 blur-[100px]" />
    </div>
  );
}

export default BackgroundGradient;
