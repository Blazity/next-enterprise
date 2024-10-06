// import Layout from "components/layout";

// const Curriculum: React.FC = () => {
//   return (
//     <Layout>
//       <section className="p-10 bg-yellow-50">
//         <h1 className="text-3xl font-bold mb-4">Our Curriculum</h1>
//         <p className="mt-4 text-lg">
//           At Lil Pals, our curriculum is designed to cultivate curiosity and a love for learning. We integrate academics, social-emotional development, and physical activity in a balanced, well-rounded program.
//         </p>
//         <ul className="list-disc ml-6 mt-4">
//           <li className="mb-2">Cognitive Skills: We encourage problem-solving and critical thinking through play-based learning.</li>
//           <li className="mb-2">Language Development: We foster language skills through storytelling, reading, and phonics activities.</li>
//           <li className="mb-2">Creative Arts: Children express themselves through art, music, and creative play.</li>
//           <li className="mb-2">Physical Development: Our program includes physical activities to enhance motor skills, coordination, and overall health.</li>
//         </ul>
//       </section>
//     </Layout>
//   );
// };

// export default Curriculum;


import Layout from "components/layout";
import Head from 'next/head';
import Image from "next/image";

const Curriculum: React.FC = () => {
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
        <section
          className="bg-gradient-to-b from-[#D9D9D9] via-[#AF8FBB] to-[#86469C] text-white"
          style={{ fontFamily: "'Caveat Brush', cursive" }}
        >
          {/* Main Content */}
          <div className="container mx-auto px-4 py-20">
            {/* Header Section */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold mb-6">The Curriculum</h1>
              <div className="flex justify-center">
                <Image
                  src="/Group 10.png"
                  alt="Header Image"
                  className="max-w-full h-auto"
                  width={250}
                  height={250}
                />
              </div>
            </div>

            {/* Intro Section */}
            <div className="text-center mb-16">
              <h1 className="text-3xl font-bold mb-6">The H.A.P.P.Y Dictionary</h1>
              <p className="text-lg leading-relaxed max-w-4xl mx-auto">
                The H.A.P.P.Y take a unique approach in nurturing these essentials...
              </p>
            </div>

            {/* Multi-Faceted Section */}
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-10">Our Multi-Faceted Approach</h2>
              <div className="flex flex-wrap justify-center gap-10">
                {/* Approach 1 */}
                <div className="bg-white bg-opacity-20 p-6 rounded-lg w-64 text-center">
                  <Image
                    src="/Group 11.png"
                    alt="Gardner Approach"
                    className="mx-auto mb-4"
                    width={250}
                    height={250}
                  />
                  <h3 className="text-2xl font-semibold mb-2">Gardner Approach</h3>
                  <p className="text-base leading-snug">
                    Howard Gardner proposed the theory of multiple intelligences...
                  </p>
                </div>

                {/* Approach 2 */}
                <div className="bg-white bg-opacity-20 p-6 rounded-lg w-64 text-center">
                  <Image
                    src="/Group 12.png"
                    alt="Montessori Approach"
                    className="mx-auto mb-4"
                    width={250}
                    height={250}
                  />
                  <h3 className="text-2xl font-semibold mb-2">Montessori Approach</h3>
                  <p className="text-base leading-snug">
                    Maria Montessori launched the educational model...
                  </p>
                </div>

                {/* Approach 3 */}
                <div className="bg-white bg-opacity-20 p-6 rounded-lg w-64 text-center">
                  <Image
                    src="/Group 13.png"
                    alt="Waldorf Approach"
                    className="mx-auto mb-4"
                    width={250}
                    height={250}
                  />
                  <h3 className="text-2xl font-semibold mb-2">Waldorf Approach</h3>
                  <p className="text-base leading-snug">
                    The Waldorf Approach focuses on nurturing children's overall...
                  </p>
                </div>

                {/* Approach 4 */}
                <div className="bg-white bg-opacity-20 p-6 rounded-lg w-64 text-center">
                  <Image
                    src="/Group 14.png"
                    alt="Bloom Approach"
                    className="mx-auto mb-4"
                    width={250}
                    height={250}
                  />
                  <h3 className="text-2xl font-semibold mb-2">Bloom Approach</h3>
                  <p className="text-base leading-snug">
                    Bloom's theory of mastery learning focuses on how children progress...
                  </p>
                </div>

                {/* Approach 5 */}
                <div className="bg-white bg-opacity-20 p-6 rounded-lg w-64 text-center">
                  <Image
                    src="/Group 12.png"
                    alt="Learning Style Theory"
                    className="mx-auto mb-4"
                    width={250}
                    height={250}
                  />
                  <h3 className="text-2xl font-semibold mb-2">Learning Style Theory</h3>
                  <p className="text-base leading-snug">
                    Explains that children learn differently based on individual preferences...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Curriculum;
