const LoadingDots = () => {
  return (
    <span className="inline-flex text-center items-center leading-7">
      <span
        className="bg-zinc-200 rounded-full h-2 w-2 mx-1"
        style={{ animation: 'blink 1.4s infinite both' }}
      />
      <span
        className="bg-zinc-200 rounded-full h-2 w-2 mx-1"
        style={{
          animation: 'blink 1.4s infinite both',
          animationDelay: '0.2s'
        }}
      />
      <span
        className="bg-zinc-200 rounded-full h-2 w-2 mx-1"
        style={{
          animation: 'blink 1.4s infinite both',
          animationDelay: '0.4s'
        }}
      />
    </span>
  );
};

export default LoadingDots;

{
  /* <style jsx>{`
  @keyframes blink {
    0% {
      opacity: 0.2;
    }
    20% {
      opacity: 1;
    }
    100% {
      opacity: 0.2;
    }
  }
`}</style> */
}
