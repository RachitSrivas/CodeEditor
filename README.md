# CodeSync (CodeEditor)

CodeSync is a modern, web-based in-browser code editor and development environment. Built with Next.js and powered by the WebContainer API, it provides a full Node.js runtime directly in the browser, allowing developers to write, run, and test code without any local setup.

## 🚀 Live Demo

[https://code-editor-azure-eight.vercel.app/](https://code-editor-azure-eight.vercel.app/)

## ✨ Key Features & Functionality

### 1. In-Browser Execution Environment (WebContainers)
- **Node.js in the Browser:** Thanks to the `@webcontainer/api`, the application can run a fully functional Node.js environment directly within your browser.
- **Terminal Integration:** Features a fully working in-browser terminal powered by `xterm.js` to run npm commands, start servers, and view console outputs.

### 2. Advanced Code Editing (Monaco Editor)
- **VS Code-like Experience:** Utilizes `@monaco-editor/react` to provide a rich code editing experience.
- **Syntax Highlighting & Autocomplete:** Out-of-the-box support for multiple languages including TypeScript, JavaScript, HTML, CSS, etc.
- **Quick Save & Run:** Simply press **`Ctrl + S` (or `Cmd + S` on Mac)** while editing a file. This automatically saves the file to the WebContainer virtual file system and triggers a hot-reload or reruns the necessary processes to reflect your changes immediately.

### 3. AI-Powered Assistance
- **AI Chat Sidepanel:** Integrated AI chat to help you debug code, write new features, or explain complex logic right beside your code.
- **Code Suggestions:** Smart, context-aware code suggestions to speed up your development process.

### 4. Project Templates & File System
- **Starter Templates:** Start new projects quickly with pre-configured templates (e.g., React, Node).
- **File Explorer:** A robust file tree component to manage your project files, create new folders/files, and navigate your codebase seamlessly.

### 5. Authentication & Database
- **NextAuth Integration:** Secure user authentication allowing users to sign in (e.g., via GitHub or Google) and save their projects.
- **Prisma ORM:** Database management using Prisma to store user data, projects, and templates persistently.

### 6. Modern UI/UX
- **Responsive & Sleek Design:** Built with **Tailwind CSS**, **Shadcn UI**, and **Radix UI** primitives for an accessible, beautiful, and highly responsive interface.
- **Dark Mode Support:** Integrated theming (via `next-themes`) for comfortable late-night coding sessions.

## 🛠️ Technology Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Editor:** [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Runtime:** [WebContainers](https://webcontainers.io/)
- **Terminal:** [Xterm.js](https://xtermjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **AI Integration:** OpenAI / Custom AI APIs / Ollama

## 💻 Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RachitSrivas/CodeEditor.git
   cd codeeditor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the necessary environment variables (Database URL, NextAuth secrets, AI API keys).

4. **Initialize the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

## ⌨️ Shortcuts & Tips

- **`Ctrl + S`**: Save the current file. This will write your changes to the virtual file system and instantly run/update your application preview!
- Use the **Terminal** to install any npm packages just like you would on your local machine.

---
*Built with ❤️ by Rachit Srivastava.*
