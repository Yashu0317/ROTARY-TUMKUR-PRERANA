import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-blue-900 text-white mt-16 overflow-hidden">

      {/* Background Image Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://rcporvorim.org/wp-content/uploads/2020/05/wicked-bg-the7-5.svg')",
          mixBlendMode: "color-dodge",
          opacity: 0.4,
        }}
      ></div>

      {/* Content Layer */}
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">

          {/* Logo + About */}
          <div>
            <img
              src="E:\ROTARY TUMKUR PRERANA\src\images\Logo-2.png"
              alt="Rotary Tumkur Prerana Logo"
              className="w-24 mb-4 rounded-md"
            />
            <h3 className="text-xl font-bold mb-4">About Rotary ROTARY TUMKUR PRERANA</h3>
            <p className="text-blue-100 mb-4">
              Rotary is a global network of volunteer leaders dedicated to tackling the world's most pressing humanitarian challenges.
            </p>

            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/RotaryTumkurPrerana"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-400 transition"
              >
                <Facebook size={20} />
              </a>
              <Twitter size={20} className="hover:text-yellow-400 transition cursor-pointer" />
              <Linkedin size={20} className="hover:text-yellow-400 transition cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            {/* <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-blue-100">
              <li><a href="#" className="hover:text-yellow-400 transition">Rotary International</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">My Rotary</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Rotary Foundation</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">District Resources</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Contact Us</a></li>
            </ul> */}
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Information</h3>
            <div className="space-y-3 text-blue-100">
              <div className="flex items-start gap-2">
                <MapPin size={20} className="flex-shrink-0 mt-1" />
                <span>ROTARY TUMKUR PRERANA Office, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={20} className="flex-shrink-0" />
                <span>+91 99866 08878</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={20} className="flex-shrink-0" />
                <span>rotarytumkurprerana@gmail.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
          <p>&copy; {new Date().getFullYear()} ROTARY TUMKUR PRERANA. All rights reserved.</p>
          <p className="mt-2 text-sm">Service Above Self</p>
        </div>

      </div>
    </footer>
  );
}
