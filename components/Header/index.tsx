import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-500 flex justify-between items-center p-4">
      <div className="left">
        <img src="/plimages/Group1.png" alt="logo" className="w-12" />
      </div>
      <nav className="right">
        <ul className="flex space-x-4">
          <li><Link href="home">HOME</Link></li>
          <li><Link href="about">ABOUT US</Link></li>
          <li><Link href="programs">PROGRAMS</Link></li>
          <li><Link href="curriculum">CURRICULUM</Link></li>
          <li><Link href="admission">ADMISSION</Link></li>
          <li><Link href="franchise">FRANCHISE</Link></li>
          <li><Link href="blogs">BLOGS</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
