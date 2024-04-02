interface NavbarProps {
    logoSrc: string; // Path to your logo image
  }
  
  const Navbar: React.FC<NavbarProps> = ({ logoSrc }) => {
    return (
      <nav className="fixed top-0 left-0 w-full h-20 bg-transparent flex items-center justify-between px-4 z-50">
        <a href="/">
          <img src={logoSrc} alt="Your Logo" className="h-20" />
        </a>
        <ul className="hidden md:flex space-x-4 text-lg font-medium">
          <li>
            <a href="/" className="hover:text-gray-700">
              Home
            </a>
          </li>
          <li>
            <a href="/services" className="hover:text-gray-700">
              Services
            </a>
          </li>
          <li>
            <a href="/portfolio" className="hover:text-gray-700">
              Portfolio
            </a>
          </li>
          <li>
            <a href="/about-us" className="hover:text-gray-700">
              About Us
            </a>
          </li>
          <li>
            <a href="/contact-us" className="hover:text-gray-700">
              Contact Us
            </a>
          </li>
        </ul>
        <div className="flex md:hidden items-center">
          <button className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded-md">
            Sign In
          </button>
          <button className="px-4 py-2 ml-2 text-white bg-green-500 hover:bg-green-700 rounded-md">
            Sign Up
          </button>
        </div>
      </nav>
    );
  };
  
  export default Navbar;