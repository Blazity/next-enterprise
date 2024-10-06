import Layout from "components/layout";
import Head from 'next/head';
import Image from "next/image";

const About: React.FC = () => {
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
        {/* First Section */}
        <section className="bg-[#F5F5DC] flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 p-5">
            <p
              className="text-left text-[20px] leading-relaxed text-[#667BC6] mb-4"
              style={{ fontFamily: "'Caveat Brush', cursive" }}
            >
              We are committed to equipping each child with a safe and engaging preschool environment to explore and thrive during these crucial years. Our preschool curriculum is designed to address the specific needs of each child given the substantial mental and cognitive growth at this stage. Little Elly’s well-structured Toddler, Pre-nursery, Nursery and Kindergarten programs enhance children's emotional, intellectual, and aesthetic capabilities that cater to their specific needs.
            </p>
            <p
              className="text-left text-[20px] leading-relaxed text-[#667BC6]"
              style={{ fontFamily: "'Caveat Brush', cursive" }}
            >
              A whole new world created for your child. Lil Pals is not your ordinary preschool mascot. She is lovable, friendly, and embodies all the qualities we want our children to embrace; kindness, curiosity, and a warm heart. Our nurturing environment creates a happy home away from home for your child where they are not just taking their first step towards school but are becoming a part of our magical world. As they explore the captivating journeys of the 'Pal World' and the enchanting 'Natterjack Forest', they are encouraged to engage in “LOOK, READ, MAKE, and DO” activities with Olly & Elly. Our offerings further enhance this immersive experience, ensuring that your child's early years are filled with joy, learning, and meaningful connections.
            </p>
          </div>
          <div className="w-full md:w-1/2 p-5 flex justify-center">
            <Image
              src="/Boy shaking hands with someone.png"
              alt=""
              className="max-w-full h-auto"
              width={400}
              height={400}
            />
          </div>
        </section>

        {/* Second Section */}
        <section className="bg-[#F5F5DC] flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 p-5 flex justify-center">
            <Image
              src="/Group 3.png"
              alt=""
              className="max-w-full h-auto"
              width={400}
              height={400}
            />
          </div>
          <div className="w-full md:w-1/2 p-5">
            <p
              className="text-left text-[20px] leading-relaxed text-[#667BC6]"
              style={{ fontFamily: "'Caveat Brush', cursive" }}
            >
              At Lil Pals, we follow a child-centered approach that recognizes the individuality of each child. We believe that children learn best through play and hands-on experiences, which is why our curriculum is designed to be engaging, interactive, and fun. Our educators are dedicated to nurturing each child's potential and supporting their growth at their own pace.
              <br />
              <br />
              <span className="text-[#F4A500] font-bold">Play-Based Learning:</span> We understand that play is the natural way through which children explore the world around them. Our play-based curriculum allows children to learn through activities that are enjoyable, meaningful, and developmentally appropriate.
              <br />
              <br />
              <span className="text-[#F4A500] font-bold">Holistic Development:</span> We focus on the holistic development of children, ensuring that they grow not only intellectually but also emotionally, socially, and physically. Our programs are designed to build confidence, social skills, and a sense of independence.
              <br />
              <br />
              <span className="text-[#F4A500] font-bold">Inclusive Environment:</span> We celebrate diversity and welcome children from all backgrounds. Our inclusive approach ensures that every child feels respected and supported.
            </p>
          </div>
        </section>

        {/* Third Section */}
        <section className="flex flex-col md:flex-row items-center justify-between bg-[#F5F5DC]">
          <div className="w-full md:w-1/2 p-5">
            <Image
              src="/Vission And Mission.png"
              alt=""
              className="w-full max-w-full h-auto"
              width={500}
              height={500}
            />
          </div>
          <div className="w-full md:w-1/2 p-5">
            <p
              className="text-left text-[20px] leading-relaxed text-[#667BC6]"
              style={{ fontFamily: "'Caveat Brush', cursive" }}
            >
              Our vision is to create a joyful and inspiring environment where children are free to explore, discover, and develop their unique talents. We aim to lay a strong foundation that not only prepares them academically but also instills values of kindness, curiosity, and resilience.
              <br />
              <br />
              Our mission is to provide high-quality early childhood education that fosters the intellectual, social, emotional, and physical development of each child. We strive to create a safe, inclusive, and stimulating environment that encourages creativity, independence, and a love for learning.
            </p>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default About;
