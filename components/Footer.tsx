export default function Footer() {
  return (
    <footer className="bg-black border-t border-yellow-600/20 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 text-sm">

        {/* BRAND */}
        <div>
          <h3 className="text-yellow-400 text-lg font-semibold mb-3">
            CINENTO
          </h3>
          <p className="text-gray-400">
            From Idea to International Film Market
          </p>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="text-white mb-3">Contact</h4>
          <p className="text-gray-400">Istanbul, Turkey</p>
          <p className="text-gray-400">cinento.tv@gmail.com</p>

          <a
            href="https://wa.me/905461232134"
            target="_blank"
            className="text-green-400 block mt-2"
          >
            WhatsApp
          </a>
        </div>

        {/* SOCIAL */}
        <div>
          <h4 className="text-white mb-3">Follow</h4>

          <a
            href="https://instagram.com/cinento.films"
            target="_blank"
            className="block text-gray-400 hover:text-yellow-400"
          >
            Instagram
          </a>

          <a
            href="https://linkedin.com/in/hamid-asghari"
            target="_blank"
            className="block text-gray-400 hover:text-yellow-400"
          >
            LinkedIn
          </a>

          <a
            href="https://cinento.net"
            target="_blank"
            className="block text-gray-400 hover:text-yellow-400"
          >
            Website
          </a>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="text-center text-gray-500 text-xs pb-6">
        © 2026 CINENTO. All rights reserved.
      </div>
    </footer>
  );
}