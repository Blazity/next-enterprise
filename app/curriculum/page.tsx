import Layout from "components/layout";

const Curriculum: React.FC = () => {
  return (
    <Layout>
      <section className="p-10 bg-yellow-50">
        <h1 className="text-3xl font-bold mb-4">Our Curriculum</h1>
        <p className="mt-4 text-lg">
          At Lil Pals, our curriculum is designed to cultivate curiosity and a love for learning. We integrate academics, social-emotional development, and physical activity in a balanced, well-rounded program.
        </p>
        <ul className="list-disc ml-6 mt-4">
          <li className="mb-2">Cognitive Skills: We encourage problem-solving and critical thinking through play-based learning.</li>
          <li className="mb-2">Language Development: We foster language skills through storytelling, reading, and phonics activities.</li>
          <li className="mb-2">Creative Arts: Children express themselves through art, music, and creative play.</li>
          <li className="mb-2">Physical Development: Our program includes physical activities to enhance motor skills, coordination, and overall health.</li>
        </ul>
      </section>
    </Layout>
  );
};

export default Curriculum;
