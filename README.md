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

## Deploying for Free

You can deploy this application for free using several popular hosting providers.

---

### Option 1: Deploying to Firebase (Free Hosting)

You can deploy this application for free using [Firebase App Hosting](https://firebase.google.com/docs/hosting/app-hosting).

#### 1. Install Firebase CLI

If you don't have it already, install the Firebase command-line tool globally:

```bash
npm install -g firebase-tools
```

#### 2. Login to Firebase

Log in to your Google account:
```bash
firebase login
```

#### 3. Connect to a Firebase Project

From your project's root directory, connect your project to Firebase. You can create a new project from the command line if you don't have one.

```bash
firebase init apphosting
```
Follow the prompts to select or create a Firebase project.

#### 4. Set Your API Key as a Secret

For the deployed app to use Google AI, you need to securely store your API key. Replace `<your_backend_id>` with the backend ID created during `init` and `<your_google_api_key_here>` with your actual key.

```bash
firebase apphosting:backends:update <your_backend_id> --update-secrets=GOOGLE_API_KEY=<your_google_api_key_here>
```

#### 5. Deploy Your Application

Deploy your app to Firebase with a single command:
```bash
firebase apphosting:deploys:create --backend <your_backend_id>
```

After deployment finishes, the CLI will provide you with the URL to your live application. That's it!

---

### Option 2: Deploying to Netlify (Free Hosting)

Netlify provides a simple way to deploy your app directly from a Git repository.

#### 1. Push Your Code to a Git Provider

First, make sure your project is on GitHub, GitLab, or Bitbucket.

#### 2. Sign Up and Connect to Netlify

1.  Go to [Netlify](https://app.netlify.com/signup) and sign up using your Git provider account.
2.  Click "Add new site" -> "Import an existing project".
3.  Connect to your Git provider and select the repository for this project.

#### 3. Configure Build Settings

Netlify will automatically detect that this is a Next.js project and pre-fill the settings. The default settings should work correctly:
- **Build command:** `npm run build` or `next build`
- **Publish directory:** `.next`

#### 4. Add Your Environment Variable

For the deployed app to use Google AI, you need to add your API key to Netlify:
1.  In your site's dashboard, go to "Site configuration" -> "Environment variables".
2.  Click "Add a variable" and create a new variable:
    - **Key:** `GOOGLE_API_KEY`
    - **Value:** Paste `your_google_api_key_here`

#### 5. Deploy

Click the "Deploy site" button. Netlify will build and deploy your application. Once it's done, you'll get a live URL for your app! Netlify will also automatically redeploy your site whenever you push new changes to your connected Git branch.

---

### Option 3: Deploying to Vercel (Free Hosting)

Vercel is the platform created by the developers of Next.js, offering a seamless deployment experience.

#### 1. Push Your Code to a Git Provider

Ensure your project is available on a GitHub, GitLab, or Bitbucket repository.

#### 2. Sign Up and Connect to Vercel

1.  Go to [Vercel](https://vercel.com/signup) and sign up using your preferred Git provider.
2.  From your Vercel dashboard, click "Add New..." -> "Project".
3.  Select your Git provider and import the repository for this project.

#### 3. Configure Your Project

Vercel will automatically detect that you're using Next.js and configure the build settings. You just need to set up the environment variable.

1.  Expand the "Environment Variables" section during project setup.
2.  Add the following variable:
    - **Name:** `GOOGLE_API_KEY`
    - **Value:** Paste `your_google_api_key_here`

#### 4. Deploy

Click the "Deploy" button. Vercel will handle the entire build and deployment process. Once complete, you will be provided with a live URL for your application.
