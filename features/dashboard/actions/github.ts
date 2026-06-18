"use server";

import { currentUser } from "@/features/auth/actions";
import { db } from "@/lib/db";
import { Templates } from "@prisma/client";
import { TemplateFolder, TemplateItem, TemplateFile } from "@/features/playground/lib/path-to-json";

const IGNORED_FOLDERS = ["node_modules", ".git", ".vscode", ".idea", "dist", "build", "coverage", ".next"];
const IGNORED_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "svg", "ico", "woff", "woff2", "ttf", "eot", "mp4", "mp3", "pdf", "zip", "tar", "gz"];

interface GithubTreeItem {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
  url: string;
}

export const importGithubRepo = async (url: string, template: Templates, title: string) => {
  const user = await currentUser();
  if (!user) {
    throw new Error("You must be logged in to import a repository");
  }

  // 1. Parse GitHub URL
  // Example: https://github.com/facebook/react or facebook/react
  let owner = "";
  let repo = "";
  
  try {
    const cleanUrl = url.replace("https://github.com/", "").replace("http://github.com/", "");
    const parts = cleanUrl.split("/");
    if (parts.length >= 2) {
      owner = parts[0];
      repo = parts[1].replace(".git", "");
    } else {
      throw new Error("Invalid GitHub URL format");
    }
  } catch (error) {
    throw new Error("Invalid GitHub URL format");
  }

  // 2. Fetch repository details to get default branch
  let defaultBranch = "main";
  try {
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!repoRes.ok) throw new Error("Repository not found or access denied");
    const repoData = await repoRes.json();
    defaultBranch = repoData.default_branch || "main";
  } catch (error) {
    console.error("Failed to fetch repo details:", error);
    throw new Error("Failed to access repository. It might be private or invalid.");
  }

  // 3. Fetch the file tree recursively
  let tree: GithubTreeItem[] = [];
  try {
    const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`);
    if (!treeRes.ok) throw new Error("Failed to fetch repository tree");
    const treeData = await treeRes.json();
    tree = treeData.tree || [];
  } catch (error) {
    console.error("Failed to fetch repo tree:", error);
    throw new Error("Failed to fetch repository structure.");
  }

  // 4. Filter out ignored files and folders
  const filesToFetch = tree.filter(item => {
    if (item.type !== "blob") return false;
    
    const parts = item.path.split("/");
    const filename = parts[parts.length - 1];
    
    // Check if it's in an ignored folder
    const inIgnoredFolder = parts.some(part => IGNORED_FOLDERS.includes(part));
    if (inIgnoredFolder) return false;

    // Check extension
    const extMatch = filename.match(/\.([^.]+)$/);
    if (extMatch) {
      const ext = extMatch[1].toLowerCase();
      if (IGNORED_EXTENSIONS.includes(ext)) return false;
    }

    return true;
  });

  // Limit number of files to prevent abuse or extreme wait times
  if (filesToFetch.length > 500) {
    throw new Error(`Repository is too large (${filesToFetch.length} files). Max 500 files supported.`);
  }

  // 5. Fetch contents in parallel (chunked to avoid rate limits / connection issues)
  const fileContents = new Map<string, string>();
  
  const chunkSize = 20;
  for (let i = 0; i < filesToFetch.length; i += chunkSize) {
    const chunk = filesToFetch.slice(i, i + chunkSize);
    await Promise.all(
      chunk.map(async (file) => {
        try {
          const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${file.path}`;
          const res = await fetch(rawUrl);
          if (res.ok) {
            const content = await res.text();
            fileContents.set(file.path, content);
          }
        } catch (err) {
          console.error(`Failed to fetch ${file.path}`, err);
          fileContents.set(file.path, `// Failed to load file from GitHub\n`);
        }
      })
    );
  }

  // 6. Build the TemplateFolder structure
  const rootFolder: TemplateFolder = {
    folderName: repo,
    items: [],
  };

  for (const [filePath, content] of fileContents.entries()) {
    const parts = filePath.split("/");
    const filename = parts.pop()!;
    
    let currentLevel = rootFolder.items;
    
    // Create necessary folders
    for (const folderName of parts) {
      let existingFolder = currentLevel.find(
        item => "folderName" in item && item.folderName === folderName
      ) as TemplateFolder | undefined;
      
      if (!existingFolder) {
        existingFolder = {
          folderName,
          items: [],
        };
        currentLevel.push(existingFolder);
      }
      currentLevel = existingFolder.items;
    }

    // Add file
    const extMatch = filename.match(/\.([^.]+)$/);
    const fileExtension = extMatch ? extMatch[1] : "";
    const nameWithoutExt = extMatch ? filename.replace(new RegExp(`\\.${fileExtension}$`), "") : filename;

    currentLevel.push({
      filename: nameWithoutExt,
      fileExtension,
      content,
    });
  }

  // 7. Create Playground in DB
  try {
    const playground = await db.playground.create({
      data: {
        title: title || `${owner}/${repo}`,
        description: `Imported from https://github.com/${owner}/${repo}`,
        template,
        userId: user.id,
      },
    });

    // 8. Save Files
    await db.templateFile.create({
      data: {
        playgroundId: playground.id,
        content: JSON.stringify(rootFolder),
      },
    });

    return { success: true, playgroundId: playground.id };
  } catch (error) {
    console.error("Database error while creating playground:", error);
    throw new Error("Failed to save the imported repository to the database.");
  }
};
