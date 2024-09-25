// import Layout from "components/layout";

// const Blogs: React.FC = () => {
//   return (
//     <Layout>
//       <section className="p-10 bg-indigo-50">
//         <h1 className="text-3xl font-bold mb-4">Our Blogs</h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           <div className="p-6 bg-white rounded shadow-md">
//             <h2 className="text-2xl font-bold mb-2">The Importance of Early Childhood Education</h2>
//             <p>Learn why early childhood education is the foundation of lifelong learning and development.</p>
//           </div>
//           <div className="p-6 bg-white rounded shadow-md">
//             <h2 className="text-2xl font-bold mb-2">How to Encourage Creativity in Children</h2>
//             <p>Explore fun, engaging ways to foster creativity and imagination in young minds.</p>
//           </div>
//           <div className="p-6 bg-white rounded shadow-md">
//             <h2 className="text-2xl font-bold mb-2">Tips for Smooth Pre-School Transitions</h2>
//             <p>Helpful tips for parents to make the transition to pre-school easier for their children.</p>
//           </div>
//         </div>
//       </section>
//     </Layout>
//   );
// };

// export default Blogs;

import Layout from "components/layout";
import Head from 'next/head';
import Image from "next/image";

const Blogs: React.FC = () => {
  return (
    <>
      <Head>
        {/* Include the Caveat Brush font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat+Brush&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Layout>
        {/* Header Section */}
        <section
          className="flex items-center justify-center h-[500px] text-white"
          style={{
            fontFamily: "'Caveat Brush', cursive",
          }}
        >
          <div className="text-center">
            <h1 className="text-5xl font-bold">
              <span className="text-red-500">L</span>
              <span style={{ color: 'rgb(34, 22, 95)' }}>e</span>
              <span style={{ color: 'rgb(34, 22, 95)' }}>a</span>
              <span style={{ color: 'rgb(34, 22, 95)' }}>r</span>
              <span style={{ color: 'rgb(34, 22, 95)' }}>n</span>
              <span className="text-indigo-500"> </span>
              <span className="text-violet-500">T</span>
              <span className="text-pink-500">h</span>
              <span className="text-gray-300">e</span>
              <span className="text-gray-500"> </span>
              <span className="text-cyan-500">B</span>
              <span className="text-fuchsia-500">a</span>
              <span className="text-teal-500">s</span>
              <span className="text-maroon-500">i</span>
              <span className="text-maroon-500">c</span>
              <span className="text-maroon-500">s</span>
              <span className="text-navy-500"> </span>
              <span className="text-yellow-500">O</span>
              <span className="text-yellow-500">f</span>
            </h1>
            <h1 className="text-5xl font-bold">
              <span className="text-gray-400">P</span>
              <span className="text-coral-500">a</span>
              <span className="text-salmon-500">r</span>
              <span className="text-red-600">e</span>
              <span className="text-purple-500">n</span>
              <span className="text-amber-700">t</span>
              <span className="text-purple-300">i</span>
              <span className="text-teal-400">n</span>
              <span className="text-[#F4A500]">g</span>
            </h1>
          </div>
        </section>

        {/* Image Section */}
        <section className="flex flex-wrap justify-around items-center my-10 px-5">
          <div className="text-center w-full md:w-1/3 px-2 mb-6">
            <Image
              src="/image.png"
              alt="Image 1"
              className="w-full h-auto max-w-xs mx-auto rounded-lg"
              width={250}
              height={250}
            />
            <p className="mt-4 text-lg" style={{ fontFamily: "'Caveat Brush', cursive" }}>
              Balancing Work and Parenting: Tips for Busy Moms and Dads
            </p>
          </div>
          <div className="text-center w-full md:w-1/3 px-2 mb-6">
            <Image
              src="/image (1).png"
              alt="Image 2"
              className="w-full h-auto max-w-xs mx-auto rounded-lg"
              width={250}
              height={250}
            />
            <p className="mt-4 text-lg" style={{ fontFamily: "'Caveat Brush', cursive" }}>
              Stay Cool and Entertained: Fun Indoor Activities
            </p>
          </div>
          <div className="text-center w-full md:w-1/3 px-2 mb-6">
            <Image
              src="/image (2).png"
              alt="Image 3"
              className="w-full h-auto max-w-xs mx-auto rounded-lg"
              width={250}
              height={250}
            />
            <p className="mt-4 text-lg" style={{ fontFamily: "'Caveat Brush', cursive" }}>
              Wonder in Every Drop: Experiencing Life's First Rain with Your Child
            </p>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Blogs;