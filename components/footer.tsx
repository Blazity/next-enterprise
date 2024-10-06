const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 p-4 text-white text-center">
      <div className="newsletter">
        <input type="email" placeholder="Enter your email" className="p-2 mr-2" />
        <button className="bg-blue-500 p-2">Subscribe</button>
      </div>
      <div className="contact-info mt-4">
        <h3>Contact Us</h3>
        <p>Email: <a href="mailto:enquiry@lilpals.com" className="text-blue-300">enquiry@lilpals.com</a></p>
        <p>Phone: <a href="tel:+919972527072" className="text-blue-300">+91 99725 27072</a></p>
        <p>Address: Learning Edge India Pvt Ltd, #2, Honeydew Mansion, Next to McDonald’s</p>
      </div>
      <div className="footer-links mt-4">
        <a href="/terms-of-service" className="text-blue-300 mr-4">Terms of Service</a>
        <a href="/my-account" className="text-blue-300 mr-4">My Account</a>
        <a href="/refer-and-earn" className="text-blue-300">Refer & Earn</a>
      </div>
    </footer>
  );
};

export default Footer;
