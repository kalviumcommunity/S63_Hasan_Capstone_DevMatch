import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear(); // Dynamically get the current year

  return (
    <div className="bg-white text-gray-900 font-sans w-full">
      {/* Header */}
      <header className="w-full border-b py-6 px-8">
        <div className="flex justify-between items-center w-full max-w-full">
          <h1 className="text-2xl font-bold">DevMatch</h1>
          <nav className="space-x-8 flex items-center text-lg">
            <a href="#how-it-works" className="hover:text-blue-600 transition hidden sm:inline-block">
              How It Works
            </a>
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-6 py-3 text-base rounded-lg hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 px-8">
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-16 max-w-full">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
              Find Your Perfect <br /> Coding Partner
            </h2>
            <p className="text-2xl md:text-3xl text-gray-700 mb-10 max-w-3xl">
              Connect with developers who share your passion and complement your skills. Build amazing projects together.
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="bg-blue-600 text-white px-10 py-5 text-lg rounded-lg hover:bg-blue-700 transition"
            >
              Find Your Match
            </button>
            <div className="flex justify-center md:justify-start gap-10 mt-8 text-xl text-gray-600">
              <span className="flex items-center">✅ Free to join</span>
              <span className="flex items-center">✅ Verified developers</span>
            </div>
          </div>

          <div className="flex-1 max-w-xl md:max-w-3xl">
            <img
              src="https://next-cdn.codementor.io/images/pair-programming/pair-programming-hero.png"
              alt="Coding Partner"
              className="rounded-2xl shadow-xl w-full"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full bg-gray-100 py-28 px-8">
        <div className="text-center w-full">
          <h3 className="text-4xl md:text-5xl font-bold mb-20">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
            {[
              {
                title: 'Create Your Profile',
                desc: 'Build your developer profile with your skills, experience, and project preferences.',
              },
              {
                title: 'Get Matched',
                desc: 'Our algorithm finds developers who mirror your skillset and project interests.',
              },
              {
                title: 'Start Collaborating',
                desc: 'Connect with your matches and begin building amazing projects together.',
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="bg-white p-10 rounded-2xl shadow-2xl text-left text-lg w-full h-full transform transition duration-300 hover:scale-105 hover:shadow-3xl"
              >
                <div className="text-4xl mb-6">📌</div>
                <h4 className="text-2xl font-semibold mb-4">{card.title}</h4>
                <p className="text-gray-600">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-8">
        <div className="max-w-screen-xl mx-auto flex flex-col items-center text-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-14 w-full">
            <div>
              <h5 className="text-white font-semibold mb-4">Platform</h5>
              <ul className="space-y-2">
                <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
                <li><a href="#" className="hover:text-white">Browse Projects</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Company</h5>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Resources</h5>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Connect</h5>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-gray-500 mt-12">
            © {currentYear} DevMatch. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;