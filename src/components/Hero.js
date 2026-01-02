function Hero({ scrollToEvents }) {
  return (
    <section className="relative h-[60vh] flex items-center justify-center text-white">
      <img
        src="/events.jpg"
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover brightness-50"
      />
      <div className="relative text-center">
        <h1 className="text-5xl font-bold">
          "Explore" <span className="text-red-500"> Learn. Innovate.</span>
        </h1>
        <button
          onClick={scrollToEvents} // 👈 scroll function passed from parent
          className="mt-6 bg-red-500 px-6 py-3 rounded-full font-semibold"
        >
          Find your next event
        </button>
      </div>
    </section>
  );
}

export default Hero;
