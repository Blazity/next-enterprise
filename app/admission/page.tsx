import Layout from "components/Layout";

const Admission: React.FC = () => {
  return (
    <Layout>
      <section className="p-10 bg-red-50">
        <h1 className="text-3xl font-bold mb-4">Admission Information</h1>
        <p className="mt-4 text-lg">
          We are excited to welcome new families to Lil Pals! Our admission process is simple and straightforward. Here’s how to apply:
        </p>
        <ol className="list-decimal ml-6 mt-4">
          <li className="mb-2">Fill out the online application form.</li>
          <li className="mb-2">Submit the required documents (birth certificate, vaccination records, etc.).</li>
          <li className="mb-2">Schedule a visit or virtual tour of the school.</li>
          <li className="mb-2">Attend an interview with our admissions team.</li>
        </ol>
        <p className="mt-4 text-lg">
          We look forward to meeting you and your child. For more information, please contact us at <a href="mailto:admissions@lilpals.com" className="text-blue-500">admissions@lilpals.com</a>.
        </p>
      </section>
    </Layout>
  );
};

export default Admission;
