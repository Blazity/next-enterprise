import Layout from "components/Layout";

const Blogs: React.FC = () => {
  return (
    <Layout>
      <section className="p-10 bg-indigo-50">
        <h1 className="text-3xl font-bold mb-4">Our Blogs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold mb-2">The Importance of Early Childhood Education</h2>
            <p>Learn why early childhood education is the foundation of lifelong learning and development.</p>
          </div>
          <div className="p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold mb-2">How to Encourage Creativity in Children</h2>
            <p>Explore fun, engaging ways to foster creativity and imagination in young minds.</p>
          </div>
          <div className="p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold mb-2">Tips for Smooth Pre-School Transitions</h2>
            <p>Helpful tips for parents to make the transition to pre-school easier for their children.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blogs;
