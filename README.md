# Document Upload App with Next.js

[View Live Demo Here](https://next-form-project.netlify.app/)

This project is built on the robust foundation of the Next.js Enterprise Boilerplate by Blazity, tailored for a document upload application. It demonstrates advanced usage of Next.js, Formik for form management, Tailwind CSS for styling, and includes comprehensive testing with Jest and Playwright. This README guides you through the project setup, features, and deployment.

## Features

- **Next.js**: Leveraging the latest features of Next.js for SSR and static generation.
- **Tailwind CSS**: Utilizing Tailwind for rapid and responsive UI development.
- **Formik**: Streamlined form handling with validation and custom input components.
- **Playwright**: End-to-end testing to ensure reliability and functionality.
- **Radix UI**: Utilizing Radix UI for accessible and customizable components.
- **Tailwind Merge**: Efficiently managing Tailwind CSS classes.
- **TypeScript**: Ensuring type safety and developer productivity.

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/vasquezjesus2710/next-form-project
cd next-form-project
```

2. Install Dependencies

```bash
yarn install
```
3. Start the development server

```bash
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.



## Project Structure

- **components/**: Reusable UI components, including custom Formik inputs.
- **pages/**: Application pages and the API endpoint for form submission.
- **public/**: Static assets like images and fonts.
- **styles/**: Global styles and Tailwind configuration.
- **tests/**: Jest unit tests and Playwright end-to-end tests.
- **utils/**: Utility functions and helpers.

**Testing**

This project includes both unit and integration tests with Jest and end-to-end tests with Playwright:

- Run unit and integration tests:
`yarn test`

- Run end-to-end tests:
```bash
yarn e2e:headless # For headless testing
yarn e2e:ui # For UI testing
```


## Acknowledgments

Built on the [Next.js Enterprise Boilerplate](https://github.com/Blazity/next-enterprise) by Blazity.