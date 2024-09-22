import Layout from "components/Layout";

const Home: React.FC = () => {
  return (
    <Layout>
      <section className="text-center bg-yellow-100 p-10">
        <h1 className="text-4xl font-bold mb-4">A Pre-school and Daycare</h1>
        <h2 className="text-2xl mb-6">for Free Thinkers</h2>
        <img src="/plimages/slide.png" alt="Slide" className="mx-auto" />
        <h1 className="text-xl italic mt-6">“This is a place where our child feels loved, valued, and excited to learn”</h1>
      </section>
      <section className="bg-white p-10">
        <h2 className="text-3xl font-bold text-center mb-6">Our Overview</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>Centres 130+</div>
          <div>Children 130+</div>
          <div>Faculty 600+</div>
          <div>Decades 1</div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
