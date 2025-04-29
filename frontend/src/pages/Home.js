import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // if (isLoading) {
  //   return (
  //     <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
  //       <div className="animate-pulse text-4xl font-cormorant text-orange-600">
  //         Loading...
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <main className="font-sora bg-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center bg-gradient-to-b from-orange-50 to-white" data-aos="fade-up">
        <div className="container mx-auto px-4 md:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-cormorant font-medium mb-6 text-gray-800">
              Experience Luxury Redefined
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover unparalleled comfort in the heart of the city
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button className="bg-orange-600 text-white px-8 py-4 rounded-lg hover:bg-orange-700 transition">
                Book Now
              </button>
              <button className="border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-lg hover:bg-orange-50 transition">
                Explore Banquet
              </button>
            </div>
          </div>
        </div>
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
    </main>
  );
};