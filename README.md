# StepWise AI

This is a Next.js application built in Firebase Studio that uses AI to solve STEM problems from a drawing or an image.

## Getting Started

To get started, take a look at `src/app/page.tsx`.

## Running Locally

To run this project on your local machine, follow these steps:

### 1. Install Dependencies

First, install the necessary Node.js packages:

```bash
npm install
```

### 2. Set Up Environment Variables

The project uses Google's Generative AI models. You'll need to provide an API key for the service.

1.  Create a new file in the root of the project named `.env.local`.
2.  Add your Google AI API key to this file:

    ```
    GOOGLE_API_KEY="your_google_api_key_here"
    ```

    You can obtain a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 3. Run the Development Servers

This project requires two separate processes to run concurrently during development: the Next.js app and the Genkit AI flows. You'll need to open two separate terminal windows.

**Terminal 1: Start the Genkit Developer UI**

This server runs your AI flows and provides a UI to inspect and debug them.

```bash
npm run genkit:dev
```

You can view the Genkit UI at [http://localhost:4000](http://localhost:4000).

**Terminal 2: Start the Next.js Application**

This is the main web application.

```bash
npm run dev
```

Your application will be running at [http://localhost:9002](http://localhost:9002).

Now you can open your browser to `http://localhost:9002` to use the app!
