import Layout from "components/Layout";

const Franchise: React.FC = () => {
  return (
    <Layout>
      <section className="p-10 bg-purple-50">
        <h1 className="text-3xl font-bold mb-4">Start a Franchise</h1>
        <p className="mt-4 text-lg">
          Join the Lil Pals family and become a part of our growing network of pre-schools and daycare centers. Starting a Lil Pals franchise is an opportunity to make a meaningful impact on the lives of young children in your community.
        </p>
        <p className="mt-4 text-lg">
          As a franchise partner, you will receive comprehensive support, including training, marketing materials, and ongoing operational assistance.
        </p>
        <p className="mt-4 text-lg">
          Interested in learning more? Contact us at <a href="mailto:franchise@lilpals.com" className="text-blue-500">franchise@lilpals.com</a> for further details and to discuss available opportunities.
        </p>
      </section>
    </Layout>
  );
};

export default Franchise;
