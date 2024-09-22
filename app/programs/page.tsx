import Layout from "components/Layout";

const Programs: React.FC = () => {
  return (
    <Layout>
      <section className="p-10 bg-green-50">
        <h1 className="text-3xl font-bold mb-4">Our Programs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold mb-2">Pre-School Program</h2>
            <p>
              Our pre-school program is designed to help children develop fundamental skills through interactive learning and play. We emphasize cognitive, social, and emotional growth.
            </p>
          </div>
          <div className="p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold mb-2">Daycare Program</h2>
            <p>
              Our daycare program provides a safe, engaging environment where children can explore their creativity and interact with peers. Our staff ensures each child receives individual care and attention.
            </p>
          </div>
          <div className="p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold mb-2">Extracurricular Activities</h2>
            <p>
              We offer a variety of extracurricular activities, including art, music, dance, and sports, to nurture children's creative and physical talents.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Programs;
