import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white p-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-xl font-bold mb-2">Company Name</h2>
            <p>123 Business Road, City</p>
            <p>Contact: email@example.com</p>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="mb-2 md:mb-0 md:mr-6">
              <h3 className="font-semibold">Resources</h3>
              <ul>
                <li><a href="/about">About Us</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Legal</h3>
              <ul>
                <li><a href="/terms">Terms of Service</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-4 md:mt-0">
            <p>&copy; {new Date().getFullYear()} Company Name. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;