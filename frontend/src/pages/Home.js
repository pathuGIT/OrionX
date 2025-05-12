import React, { useEffect, useRef, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPaused(false);
    } else {
      videoRef.current.pause();
      setIsPaused(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <main className="font-sora bg-white">
      {/* Hero Section with advanced video background */}
      <section className="relative flex items-center justify-center h-screen mb-12 overflow-hidden">
        {/* Video Element */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="/background/deandra.mp4"
          autoPlay
          loop
          muted={isMuted}
        />

        {/* Intro Text Animation */}
        {showIntro && (
          <div
            className="absolute z-20 text-center px-4"
            style={{ animation: 'intro 1s ease-out forwards' }}
          >
            <h1 className="text-6xl md:text-4xl font-bold text-gray-300 uppercase drop-shadow-lg">
              Deandra Bolgoda
            </h1>
            <p className="mt-4 text-xl md:text-2xl text-gray-300">
              Experience luxury and elegance at every celebration.
            </p>
          </div>
        )}

        {/* Controls: Mute/Unmute and Play/Pause */}
        <div className="absolute bottom-8 right-8 z-30 flex space-x-4">
          {/* Mute/Unmute */}
          <button
            onClick={toggleMute}
            className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-75 transition"
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          >
            {isMuted ? (
              // <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              //   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              // </svg>
              <svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M15.5 8.43A4.985 4.985 0 0 1 17 12c0 1.126-.5 2.5-1.5 3.5m2.864-9.864A8.972 8.972 0 0 1 21 12c0 2.023-.5 4.5-2.5 6M7.8 7.5l2.56-2.133a1 1 0 0 1 1.64.768V12m0 4.5v1.365a1 1 0 0 1-1.64.768L6 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1m1-4 14 14" />
              </svg>

            ) : (
              // <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              //   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12l-7 7m0-14l7 7" />
              // </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                strokeWidth="2"
                  d="M11.25 5.25L6.75 9H3.75A.75.75 0 003 9.75v4.5c0 .414.336.75.75.75h3l4.5 3.75V5.25zM16.5 8.25a3 3 0 010 7.5M19.5 6a6 6 0 010 12"
                />
              </svg>


            )}
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-75 transition"
            aria-label={isPaused ? 'Play video' : 'Pause video'}
          >
            {isPaused ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
              </svg>
            )}
          </button>
        </div>
        {/* Keyframes for Intro Animation */}
        <style>{`@keyframes intro { 0% { transform: scale(2); opacity: 0; } 50% { transform: scale(1); opacity: 1; } 100% { opacity: 1; } }`}</style>

        <div class="col-start-1 row-start-1 bg-opacity-10 w-full h-full"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white" data-aos="fade-up">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {['Luxury Banquet', 'Fine Dining', 'Bar Services'].map((feature, index) => (
              <div key={index} className="p-8 bg-orange-50 rounded-xl hover:bg-orange-100 transition">
                <div className="text-orange-600 text-4xl mb-4">✦</div>
                <h3 className="text-2xl font-cormorant mb-2">{feature}</h3>
                <p className="text-gray-600">Premium experience tailored for your comfort</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="py-20 bg-white" data-aos="fade-up">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-4xl font-cormorant text-center mb-12">Garden Wedding Packages</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Package One(75 PACKS)', price: "575,000" },
              { name: 'Package Two(100 PACKS)', price: "560,000" },
              { name: 'Package Three(150-200 PACKS)', price: "6,500 PER HEAD" }
            ].map((room, index) => (
              <div key={index} className="group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition">
                <div className="h-64 bg-orange-100"></div>
                <div className="p-6 bg-white">
                  <h3 className="text-2xl font-cormorant">{room.name}</h3>
                  <p className="text-orange-600 text-xl mt-2">From LKR {room.price}/= ONLY.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-600 text-white" data-aos="fade-up">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-4xl font-cormorant mb-6">Ready to Plan?</h2>
          <p className="text-xl mb-8">Book now and enjoy exclusive benefits</p>
          <button className="bg-white text-orange-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition">
            Start Your Reservation
          </button>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="pt-10 bg-gray-100" data-aos="fade-up">
        <div className="w-full">
          <h2 className="text-2xl font-cormorant text-center mb-6">Destination</h2>
          <div className="relative overflow-hidden rounded-xl shadow-lg" style={{ height: '300px' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15880.898598993082!2d79.9022937!3d6.8080444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae245c6487cd84d%3A0xee20166f2d2f91c2!2sDeandra%20Bolgoda!5e0!3m2!1sen!2slk!4v1715500000000!5m2!1sen!2slk"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Deandra Bolgoda Location"
            ></iframe>
          </div>
        </div>
      </section>


    </main>
  );
};