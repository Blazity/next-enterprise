import Layout from "components/Layout";

const About: React.FC = () => {
  return (
    <Layout>
      <section className="p-10 bg-blue-50">
        <h1 className="text-3xl font-bold mb-4">About Us</h1>
        <p className="mt-4 text-lg">
          Lil Pals is a nurturing pre-school and daycare committed to providing a safe, supportive, and creative environment for early childhood development. We believe in fostering independent, curious, and empathetic young thinkers who are ready to engage with the world.
        </p>
        <p className="mt-4 text-lg">
          Our highly trained faculty and staff focus on holistic growth, offering a comprehensive curriculum that blends academics with social, emotional, and physical development.
        </p>
        <p className="mt-4 text-lg">
          We pride ourselves on being a community where children can thrive and develop their unique abilities at their own pace.
        </p>
      </section>
    </Layout>
  );
};

export default About;
