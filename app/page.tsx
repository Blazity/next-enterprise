// import Layout from "components/Layout";

// const Home: React.FC = () => {
//   return (
//     <Layout>
//       <section className="text-center bg-yellow-100 p-10">
//         <h1 className="text-4xl font-bold mb-4">A Pre-school and Daycare</h1>
//         <h2 className="text-2xl mb-6">for Free Thinkers</h2>
//         <img src="/slide.png" alt="Slide" className="mx-auto" />
//         <h1 className="text-xl italic mt-6">“This is a place where our child feels loved, valued, and excited to learn”</h1>
//       </section>
//       <section className="bg-white p-10">
//         <h2 className="text-3xl font-bold text-center mb-6">Our Overview</h2>
//         <div className="grid grid-cols-2 gap-4">
//           <div>Centres 130+</div>
//           <div>Children 130+</div>
//           <div>Faculty 600+</div>
//           <div>Decades 1</div>
//         </div>
//       </section>
//     </Layout>
//   );
// };

// export default Home;

import Layout from "components/Layout";
import Image from "next/image";
import Link from "next/link";

const Home: React.FC = () => {
  const line1 = 'A Pre-school and Daycare';
  const line2 = 'for Free Thinkers';

  const renderColoredText = (text: string, startIndex: number) => {
    let colorIndex = startIndex;
    return text.split('').map((char, idx) => {
      const colorClass = `text-color-${colorIndex}`;
      colorIndex += 1;

      // Replace space with non-breaking space to preserve spacing
      const displayChar = char === ' ' ? '\u00A0' : char;

      return (
        <span key={idx} className={colorClass}>
          {displayChar}
        </span>
      );
    });
  };


  return (
    <Layout>
      <section
      className="relative bg-cover bg-center bg-no-repeat h-[500px] flex flex-col items-center justify-center text-white"
      style={{ backgroundImage: "url('/image 1.png')" }}
    >
      <h1 className="text-5xl md:text-6xl font-caveat-brush flex flex-wrap justify-center">
        {renderColoredText(line1, 1)}
      </h1>
      <h1 className="text-5xl md:text-6xl font-caveat-brush flex flex-wrap justify-center mt-4">
        {renderColoredText(line2, line1.length + 1)}
      </h1>
      <nav className="absolute bottom-10">
        <ul className="flex justify-center">
          <li>
            <Link href="#" className="bg-[#a865d7cd] text-black font-caveat-brush text-2xl py-2 px-6 rounded-full shadow-lg hover:text-[#F4A500] transition-colors"> 
                ADMISSION
            </Link>
          </li>
        </ul>
      </nav>
    </section>

      <section className="bg-[#FACFCF] h-auto md:h-[500px] flex flex-col md:flex-row items-center justify-between px-[5%] py-10">
        <Image
          src="/slide.png"
          alt="Slide"
          width={300}
          height={300}
          className="w-auto h-auto mb-4 md:mb-0"
        />
        <h1 className="text-[#B54242] text-center mx-4 mb-4 md:mb-0">
          “This is a place where our child feels loved, valued, and excited to learn”
        </h1>
        <Image
          src="/kids' drawings.png"
          alt="Kids' drawings"
          width={300}
          height={300}
          className="w-auto h-auto"
        />
      </section>

      {/* Overview Section */}
      <section className="bg-white p-10 text-center">
        <h1 className="text-3xl font-bold mb-6">OUR OVERVIEW</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gray-100 p-6 rounded shadow">
            <h2 className="text-xl font-semibold">Centres 130+</h2>
          </div>
          <div className="bg-gray-100 p-6 rounded shadow">
            <h2 className="text-xl font-semibold">Children 130+</h2>
          </div>
          <div className="bg-gray-100 p-6 rounded shadow">
            <h2 className="text-xl font-semibold">Faculty 600+</h2>
          </div>
          <div className="bg-gray-100 p-6 rounded shadow">
            <h2 className="text-xl font-semibold">Decades 1</h2>
          </div>
        </div>
        <div className="mt-10">
          <Image src="/kids reading a book.png" alt="Kids reading a book" width={400} height={200} className="mx-auto" />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 p-10 text-center">
        <h4 className="text-3xl font-bold mb-8">Our Testimonials</h4>
        <div className="grid md:grid-cols-3 gap-8">
          {/* First testimonial */}
          <div className="bg-white p-6 rounded shadow">
            <Image src="/image 2.png" alt="Parent with child" width={100} height={100} className="mx-auto" />
            <p className="mt-4">
              “Lil Pals has been a wonderful experience for our daughter, Mia. From the moment we stepped into the school, we were impressed by the warm and welcoming environment..."
            </p>
            <p className="mt-2 font-semibold">— Christine & Phil, parents of Mia</p>
            <div className="mt-2 text-yellow-500">⭐️⭐️⭐️⭐️⭐️</div>
          </div>
          {/* Second testimonial */}
          <div className="bg-white p-6 rounded shadow">
            <Image src="/image 3.png" alt="Father with child" width={100} height={100} className="mx-auto" />
            <p className="mt-4">
              "Lil Pals has been a wonderful experience for our daughter, Ava. From the moment we joined, we were impressed by the warm and nurturing environment..."
            </p>
            <p className="mt-2 font-semibold">— Lena & Raj, parents of Ava</p>
            <div className="mt-2 text-yellow-500">⭐️⭐️⭐️⭐️⭐️</div>
          </div>
          {/* Third testimonial */}
          <div className="bg-white p-6 rounded shadow">
            <Image src="/image 4.png" alt="Mother with child" width={100} height={100} className="mx-auto" />
            <p className="mt-4">
              “Lil Pals has been a wonderful experience for our daughter, Mia. From the moment we stepped into the school, we were impressed by the warm and welcoming environment..."
            </p>
            <p className="mt-2 font-semibold">— Christine & Phil, parents of Mia</p>
            <div className="mt-2 text-yellow-500">⭐️⭐️⭐️⭐️⭐️</div>
          </div>
        </div>
        <div className="flex justify-center mt-6 space-x-4">
          <button className="text-2xl">&#9664;</button>
          <button className="text-2xl">&#9654;</button>
        </div>
      </section>

      {/* Admissions Section */}
      <section className="bg-blue-100 p-10 text-center">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <Image src="/Group 1.png" alt="Lil Pals Logo" width={100} height={100} className="mx-auto" />
            <h2 className="text-2xl font-bold mt-4">
              Admissions open for <span className="text-red-500">2024-25!!</span>
            </h2>
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Apply Now</button>
          </div>
          <div>
            <Image
              src="/girl and boy sitting on floor and watching tablet.png"
              alt="Kids playing"
              width={300}
              height={200}
              className="mx-auto"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
