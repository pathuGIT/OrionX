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
      <section className="relative flex items-center justify-center h-screen overflow-hidden">
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
              <svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M15.5 8.43A4.985 4.985 0 0 1 17 12c0 1.126-.5 2.5-1.5 3.5m2.864-9.864A8.972 8.972 0 0 1 21 12c0 2.023-.5 4.5-2.5 6M7.8 7.5l2.56-2.133a1 1 0 0 1 1.64.768V12m0 4.5v1.365a1 1 0 0 1-1.64.768L6 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1m1-4 14 14" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
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
      <section className="py-24 h-screen text-black animate-bg-soft" data-aos="fade-up">
        <div className="container mx-auto px-4 md:px-8">
          <h2 class="mb-16 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">What we offer</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: 'Luxury Banquet',
                description: 'Elegantly designed halls that can be tailored for weddings, corporate events, or celebrations.',
                image: '/features/banquet.jpg'
              },
              {
                title: 'Fine Dining',
                description: 'Customized gourmet menus by experienced chefs offering local and international cuisine.',
                image: '/features/dining.jpg'
              },
              {
                title: 'Exclusive Bar Services',
                description: 'Signature cocktails, curated wine lists, and an atmosphere perfect for toasting life’s moments.',
                image: '/features/bar.jpg'
              }
            ].map((item, index) => (
              <div key={index} class="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <a href="#">
                  <img class="rounded-t-lg" src={item.image} alt={item.title} />
                </a>
                <div class="p-5">
                  <a href="#">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{item.title}</h5>
                  </a>
                  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{item.description}</p>
                  <a href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Read more
                    <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Soft background color animation */}
        <style jsx>{`
        .animate-bg-soft {
          animation: bgFade 10s ease-in-out infinite alternate;
        }

        @keyframes bgFade {
          0% { background-color: #ffffff; }
          50% { background-color: #f0f3f4; }
          100% { background-color: #f9f9f9; }
        }
      `}</style>
      </section>


      {/* Wedding Packages Section */}
      <section className="py-24 bg-white h-screen" data-aos="fade-up">
        <div className="container mx-auto px-4 md:px-8">
          <h2 class="mb-16 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white text-right">
            Garden wedding packages
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                name: 'Package One',
                detail: '75 Packs | Inclusive Buffet & Decor',
                price: 'LKR 575,000',
                image: '/packages/package1.jpg'
              },
              {
                name: 'Package Two',
                detail: '100 Packs | Full Service + Bar',
                price: 'LKR 560,000',
                image: '/packages/package2.jpg'
              },
              {
                name: 'Package Three',
                detail: '150-200 Guests | Custom Per Head',
                price: 'LKR 6,500 per head',
                image: '/packages/package3.jpg'
              }
            ].map((pkg, index) => (
              // <div key={index} className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition">
              //   <img src={pkg.image} alt={pkg.name} className="h-56 w-full object-cover" />
              //   <div className="p-6">
              //     <h3 className="text-2xl font-cormorant text-orange-700">{pkg.name}</h3>
              //     <p className="text-gray-600 mt-2">{pkg.detail}</p>
              //     <p className="text-orange-500 text-xl mt-4 font-semibold">{pkg.price}</p>
              //   </div>
              // </div>
              <div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <a href="#">
                  <img class="p-8 rounded-t-lg" src="/docs/images/products/apple-watch.png" alt="product image" />
                </a>
                <div class="px-5 pb-5">
                  <a href="#">
                    <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{pkg.name}</h5>
                  </a>
                  <div class="">
                    <span class="text-3xl font-bold text-gray-900 dark:text-white">{pkg.price}</span><br/>
                    
                    <a href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                      Read more
                      <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-white text-center animate-gradient-bg" data-aos="fade-up">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-4xl font-cormorant mb-6">Let’s Make Your Event Unforgettable</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our team is ready to help you plan and deliver a luxurious and memorable experience at Deandra Bolgoda. Reserve your date today.
          </p>
          <button className="px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition">
            Start Your Reservation
          </button>
        </div>

        {/* Gradient Animation Style */}
        <style jsx>{`
          .animate-gradient-bg {
            background: linear-gradient(-45deg, #f97316, #facc15, #f43f5e, #10b981);
            background-size: 600% 600%;
            animation: gradientShift 20s ease infinite;
          }

          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            25% { background-position: 50% 50%; }
            50% { background-position: 100% 50%; }
            75% { background-position: 50% 0%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </section>


      {/* Google Maps Section */}
      <section className="pt-10 bg-white flex items-end" style={{ height: '60vh' }} data-aos="fade-up">
        <div className="w-full"><h2 class="mb-16 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white text-center">Destination</h2>
          {/* <h2 className="text-2xl font-cormorant text-center mb-6">Destination</h2> */}
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