// import Layout from "components/layout";

// const Programs: React.FC = () => {
//   return (
//     <Layout>
//       <section className="p-10 bg-green-50">
//         <h1 className="text-3xl font-bold mb-4">Our Programs</h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           <div className="p-6 bg-white rounded shadow-md">
//             <h2 className="text-2xl font-bold mb-2">Pre-School Program</h2>
//             <p>
//               Our pre-school program is designed to help children develop fundamental skills through interactive learning and play. We emphasize cognitive, social, and emotional growth.
//             </p>
//           </div>
//           <div className="p-6 bg-white rounded shadow-md">
//             <h2 className="text-2xl font-bold mb-2">Daycare Program</h2>
//             <p>
//               Our daycare program provides a safe, engaging environment where children can explore their creativity and interact with peers. Our staff ensures each child receives individual care and attention.
//             </p>
//           </div>
//           <div className="p-6 bg-white rounded shadow-md">
//             <h2 className="text-2xl font-bold mb-2">Extracurricular Activities</h2>
//             <p>
//               We offer a variety of extracurricular activities, including art, music, dance, and sports, to nurture children's creative and physical talents.
//             </p>
//           </div>
//         </div>
//       </section>
//     </Layout>
//   );
// };

// export default Programs;


import Layout from "components/layout";
import Head from 'next/head';
import Image from "next/image";

const Programs: React.FC = () => {
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
          <section className="bg-gradient-to-b from-[#B1AFFF] via-[#B6CCFF] to-[#F7F7F7] py-10">
            <div className="container mx-auto px-5">
              <h1 className="text-3xl font-bold mb-4">Our Programs</h1>
              {/* Program 1 */}
              <div className="flex flex-col md:flex-row items-center justify-between my-10">
                <div className="md:w-1/2 p-5">
                  <h2
                    className="text-[24px] text-[#4e54c8] mb-4"
                    style={{ fontFamily: "'Caveat Brush', cursive" }}
                  >
                    Toddler
                  </h2>
                  <p
                    className="font-bold mb-2"
                    style={{ fontFamily: "'Caveat Brush', cursive" }}
                  >
                    Age Criteria: 18 Months+
                  </p>
                  <p
                    className="text-[#555] leading-relaxed"
                    style={{ fontFamily: "'Caveat Brush', cursive" }}
                  >
                    The toddler curriculum at Lil Pals is well structured and designed to encourage the holistic development of children who are in the process of rapid physical and cognitive development. The emphasis is on creating a supportive and engaging atmosphere for toddlers' growth and development through their critical years of learning.
                  </p>
                </div>
                <div className="md:w-1/2 p-5 flex justify-center">
                  <Image
                    src="/Group 5.png"
                    alt="Toddler Program"
                    className="w-[250px] h-auto"
                    width={250}
                    height={250}
                  />
                </div>
              </div>

              {/* Program 2 */}
              <div className="flex flex-col md:flex-row items-center justify-between my-10">
                <div className="md:w-1/2 p-5">
                  <h2
                    className="text-[24px] text-[#4e54c8] mb-4"
                    style={{ fontFamily: "'Caveat Brush', cursive" }}
                  >
                    PlayGroup
                  </h2>
                  <p
                    className="font-bold mb-2"
                    style={{ fontFamily: "'Caveat Brush', cursive" }}
                  >
                    Age Criteria: 2 Years+
                  </p>
                  <p
                    className="text-[#555] leading-relaxed"
                    style={{ fontFamily: "'Caveat Brush', cursive" }}
                  >
                    The Playgroup Program at Lil Pals focuses on happy learning evolving in the school environment. We concentrate on the wholesome development of the child by conducting age–appropriate activities. Our monthly themes include an engaging package of hands-on activities blended with STEM-based learning.
                  </p>
                </div>
                <div className="md:w-1/2 p-5 flex justify-center">
                  <Image
                    src="/Group 6.png"
                    alt="PlayGroup Program"
                    className="w-[250px] h-auto"
                    width={250}
                    height={250}
                  />
                </div>
              </div>

              {/* Program 3 */}
              <div className="flex flex-col md:flex-row items-center justify-between my-10">
                <div className="md:w-1/2 p-5">
                  <h2
                    className="text-[24px] text-[#4e54c8] mb-4"
                    style={{ fontFamily: "'Caveat Brush', cursive" }}
                  >
                    Nursery
                  </h2>
                  <p
                    className="font-bold mb-2"
                    style={{ fontFamily: "'Caveat Brush', cursive" }}
                  >
                    Age Criteria: 3 Years+
                  </p>
                  <p
                    className="text-[#555] leading-relaxed"
                    style={{ fontFamily: "'Caveat Brush', cursive" }}
                  >
                    The Nursery Program at Lil Pals is well-equipped with concepts that mould our little tots as inquisitive learners. The education journey of a child is fostered through the love for learning. The focus is to strike a balance between play-based learning and structured learning.
                  </p>
                </div>
                <div className="md:w-1/2 p-5 flex justify-center">
                  <Image
                    src="/Group 7.png"
                    alt="Nursery Program"
                    className="w-[250px] h-auto"
                    width={250}
                    height={250}
                  />
                </div>
              </div>

              {/* Program 4 */}
              <div className="flex flex-col md:flex-row items-center justify-between my-10">
                <div className="md:w-1/2 p-5">
                  <h2
                    className="text-[24px] text-[#4e54c8] mb-4"
                    style={{ fontFamily: "'Caveat Brush', cursive" }}
                  >
                    LKG
                  </h2>
                  <p
                    className="font-bold mb-2"
                    style={{ fontFamily: "'Caveat Brush', cursive" }}
                  >
                    Age Criteria: 4 Years
                  </p>
                  <p
                    className="text-[#555] leading-relaxed"
                    style={{ fontFamily: "'Caveat Brush', cursive" }}
                  >
                    The LKG program at Lil Pals caters to our curious learners. Here, the focus for kids is to learn concepts through hands-on learning and to encourage them to express themselves by building a strong vocabulary. We create an environment to set up a clear and consistent routine for the children.
                  </p>
                </div>
                <div className="md:w-1/2 p-5 flex justify-center">
                  <Image
                    src="/Group 8.png"
                    alt="LKG Program"
                    className="w-[250px] h-auto"
                    width={250}
                    height={250}
                  />
                </div>
              </div>

              {/* Program 5 */}
              <div className="flex flex-col md:flex-row items-center justify-between my-10">
                <div className="md:w-1/2 p-5">
                  <h2
                    className="text-[24px] text-[#4e54c8] mb-4"
                    style={{ fontFamily: "'Caveat Brush', cursive" }}
                  >
                    UKG
                  </h2>
                  <p
                    className="font-bold mb-2"
                    style={{ fontFamily: "'Caveat Brush', cursive" }}
                  >
                    Age Criteria: 5 Years
                  </p>
                  <p
                    className="text-[#555] leading-relaxed"
                    style={{ fontFamily: "'Caveat Brush', cursive" }}
                  >
                    The UKG program at Lil Pals focuses on building foundational skills to prepare children to learn more advanced concepts and develop independent reading and writing skills. We create a supportive and stimulating learning environment to build a strong foundation for formal schooling.
                  </p>
                </div>
                <div className="md:w-1/2 p-5 flex justify-center">
                  <Image
                    src="/Group 6.png"
                    alt="UKG Program"
                    className="w-[250px] h-auto"
                    width={250}
                    height={250}
                  />
                </div>
              </div>

              {/* Program 6 */}
              <div className="flex flex-col md:flex-row items-center justify-between my-10">
                <div className="md:w-1/2 p-5">
                  <h2
                    className="text-[24px] text-[#4e54c8] mb-4"
                    style={{ fontFamily: "'Caveat Brush', cursive" }}
                  >
                    DayCare Facility
                  </h2>
                  <p
                    className="text-[#555] leading-relaxed"
                    style={{ fontFamily: "'Caveat Brush', cursive" }}
                  >
                    Our daycare facility provides a child-friendly environment with a stimulating curriculum for different age groups.
                  </p>
                </div>
                <div className="md:w-1/2 p-5 flex justify-center">
                  <Image
                    src="/brain shaped cloud.png"
                    alt="DayCare Facility"
                    className="w-[250px] h-auto"
                    width={250}
                    height={250}
                  />
                </div>
              </div>
            </div>
          </section>
        </Layout>
      </>
  );
};

export default Programs;