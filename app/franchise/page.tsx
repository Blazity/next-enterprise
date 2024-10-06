// import Layout from "components/layout";

// const Franchise: React.FC = () => {
//   return (
//     <Layout>
//       <section className="p-10 bg-purple-50">
//         <h1 className="text-3xl font-bold mb-4">Start a Franchise</h1>
//         <p className="mt-4 text-lg">
//           Join the Lil Pals family and become a part of our growing network of pre-schools and daycare centers. Starting a Lil Pals franchise is an opportunity to make a meaningful impact on the lives of young children in your community.
//         </p>
//         <p className="mt-4 text-lg">
//           As a franchise partner, you will receive comprehensive support, including training, marketing materials, and ongoing operational assistance.
//         </p>
//         <p className="mt-4 text-lg">
//           Interested in learning more? Contact us at <a href="mailto:franchise@lilpals.com" className="text-blue-500">franchise@lilpals.com</a> for further details and to discuss available opportunities.
//         </p>
//       </section>
//     </Layout>
//   );
// };

// export default Franchise;


import Layout from "components/layout";
import Head from 'next/head';
import Image from "next/image";


const Franchise: React.FC = () => {
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
        {/* Background Section */}
        <section
          className="bg-cover bg-center h-[650px] flex items-center justify-center"
          style={{
            backgroundImage: "url('/image 13.png')",
            fontFamily: "'Caveat Brush', cursive",
          }}
        >
          {/* Registration Form */}
          <div className="bg-white p-6 rounded-lg shadow-lg w-[300px] mt-10">
            <h2
              className="text-[#e84946] text-2xl mb-4 flex items-center gap-2"
              style={{ fontFamily: "'Caveat Brush', cursive" }}
            >
              Register Now
            </h2>
            <form action="#">
              <input
                type="text"
                placeholder="Student Name"
                required
                className="w-full p-2 mb-3 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Parent Name"
                required
                className="w-full p-2 mb-3 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Area you're Located"
                required
                className="w-full p-2 mb-3 border border-gray-300 rounded"
              />
              <input
                type="tel"
                placeholder="Phone No."
                required
                className="w-full p-2 mb-3 border border-gray-300 rounded"
              />
              <input
                type="email"
                placeholder="Email Id"
                required
                className="w-full p-2 mb-3 border border-gray-300 rounded"
              />
              <select
                required
                className="w-full p-2 mb-3 border border-gray-300 rounded"
              >
                <option value="" disabled selected>
                  Select Program
                </option>
                <option value="program1">Program 1</option>
                <option value="program2">Program 2</option>
              </select>
              <button
                type="submit"
                className="bg-[#f4a5a1] text-white p-2 w-full rounded flex justify-center items-center hover:bg-[#e84946]"
              >
                Enquire Now
              </button>
            </form>
          </div>
        </section>

        {/* Franchise Section */}
        <section
          className="text-center py-10 px-5"
          style={{
            background: "linear-gradient(#d8d1ad, #b7b6b9, #6c6f98)",
            fontFamily: "'Caveat Brush', cursive",
          }}
        >
          <h2 className="text-3xl mb-6">Why you should Partner with us!?</h2>
          <p className="text-lg leading-relaxed mb-6">
            Join a growing network of educational institutions committed to excellence. By franchising with Lil Pals, you will be part of a brand that is recognized for its innovative approach to education, strong community fit, and proven success in student outcomes.
          </p>
          <p className="text-lg leading-relaxed mb-10">
            Here's why over 130+ franchisees across the country covering over 100 cities would vouch for the immense opportunities partnering with Lil Pals can bring your way.
          </p>
          <h3 className="text-2xl mb-6">How to start a Lil Pals Preschool franchise</h3>

          {/* Steps */}
          <div className="flex flex-wrap justify-between items-center">
            {/* Step 1 */}
            <div className="text-center p-5 border border-gray-300 m-2 w-full md:w-1/4">
              <h4 className="text-xl mb-4">Step 1</h4>
              <Image
                src="/multicolored smartphone notifications.png"
                alt="Preliminary Meeting & Sign Agreement"
                className="w-24 h-24 mx-auto mb-4"
                width={250}
                height={250}
              />
              <p className="text-base">Preliminary Meeting & Sign Agreement</p>
            </div>

            {/* Step 2 */}
            <div className="text-center p-5 border border-gray-300 m-2 w-full md:w-1/4">
              <h4 className="text-xl mb-4">Step 2</h4>
              <Image
                src="/Searching the web on tablet.png"
                alt="Building Infrastructure"
                className="w-24 h-24 mx-auto mb-4"
                width={250}
                height={250}
              />
              <p className="text-base">Building Infrastructure</p>
            </div>

            {/* Step 3 */}
            <div className="text-center p-5 border border-gray-300 m-2 w-full md:w-1/4">
              <h4 className="text-xl mb-4">Step 3</h4>
              <Image
                src="/Loudspeaker and social media marketing.png"
                alt="Training & Marketing"
                className="w-24 h-24 mx-auto mb-4"
                width={250}
                height={250}
              />
              <p className="text-base">Training & Marketing</p>
            </div>

            {/* Step 4 */}
            <div className="text-center p-5 border border-gray-300 m-2 w-full md:w-1/4">
              <h4 className="text-xl mb-4">Step 4</h4>
              <Image
                src="/Three-quarter view of a blue round check mark icon.png"
                alt="Ready To Start"
                className="w-24 h-24 mx-auto mb-4"
                width={250}
                height={250}
              />
              <p className="text-base">Ready To Start</p>
            </div>
          </div>

          {/* FAQs */}
          <div
            className="mt-10 bg-[#aa6261] max-w-4xl mx-auto p-6 rounded"
            style={{ fontFamily: "'Caveat Brush', cursive" }}
          >
            <h2 className="text-3xl mb-6">FAQs</h2>
            <div className="text-left">
              <div className="mb-4">
                <p className="font-bold text-xl">
                  Are you involved in the recruitment of teachers?
                </p>
              </div>
              <div className="mb-4">
                <p className="font-bold text-xl">
                  Is there ongoing support after the franchise is launched?
                </p>
              </div>
              <div className="mb-4">
                <p className="font-bold text-xl">
                  How do you assist with site selection and build-out?
                </p>
              </div>
              <div className="mb-4">
                <p className="font-bold text-xl">
                  Do you offer transportation services for children?
                </p>
              </div>
              <div className="mb-4">
                <p className="font-bold text-xl">
                  How much time does it take to set up a Lil Pals?
                </p>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Franchise;
