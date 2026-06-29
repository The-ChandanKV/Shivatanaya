/**
 * Shivatanaya Constructions - Node.js Server
 * This server enables dynamic loading of projects from folders
 */

const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration
const PROJECT_FOLDERS = {
    completed: 'completed_projects',
    ongoing: 'ongoing_projects',
    upcoming: 'upcoming_projects'
};
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.webm', '.ogg'];

// Serve static files
app.use(express.static(__dirname));

// Parse project.txt file
function parseProjectFile(content) {
    const lines = content.split('\n');
    const project = {
        name: '',
        owner: '',
        address: '',
        review: ''
    };

    lines.forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
            const key = line.substring(0, colonIndex).trim().toLowerCase();
            const value = line.substring(colonIndex + 1).trim();

            switch (key) {
                case 'project name':
                    project.name = value;
                    break;
                case 'owner':
                    project.owner = value;
                    break;
                case 'address':
                    project.address = value;
                    break;
                case 'review':
                    project.review = value;
                    break;
            }
        }
    });

    return project;
}

// Get all projects from a category folder
async function getProjectsFromFolder(category) {
    const folderPath = path.join(__dirname, PROJECT_FOLDERS[category]);
    const projects = [];

    try {
        // Check if folder exists
        await fs.access(folderPath);

        // Get all subdirectories (each is a project)
        const entries = await fs.readdir(folderPath, { withFileTypes: true });
        const projectFolders = entries.filter(entry => entry.isDirectory());

        for (const folder of projectFolders) {
            const projectPath = path.join(folderPath, folder.name);
            const project = {
                name: folder.name.replace(/_/g, ' '),
                owner: '',
                address: '',
                review: '',
                images: [],
                folder: folder.name
            };

            // Read project.txt if exists
            const projectFilePath = path.join(projectPath, 'project.txt');
            try {
                const content = await fs.readFile(projectFilePath, 'utf-8');
                const parsedProject = parseProjectFile(content);
                Object.assign(project, parsedProject);
            } catch (err) {
                // project.txt doesn't exist, use folder name as project name
                console.log(`No project.txt found in ${folder.name}`);
            }

            // Get all images in the project folder
            try {
                const files = await fs.readdir(projectPath);
                project.images = files
                    .filter(file => IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase()))
                    .map(file => `/${PROJECT_FOLDERS[category]}/${folder.name}/${file}`);
            } catch (err) {
                console.log(`Error reading images from ${folder.name}:`, err.message);
            }

            projects.push(project);
        }

        // Handle standalone media files in the root of the category folder
        const standaloneFiles = entries.filter(entry => 
            !entry.isDirectory() && 
            IMAGE_EXTENSIONS.includes(path.extname(entry.name).toLowerCase())
        );

        for (const file of standaloneFiles) {
            const fileName = path.basename(file.name, path.extname(file.name));
            projects.push({
                name: fileName.replace(/_/g, ' '),
                owner: 'Shivatanaya', // Default owner
                address: '',
                review: '',
                images: [`/${PROJECT_FOLDERS[category]}/${file.name}`],
                folder: ''
            });
        }
    } catch (err) {
        console.log(`Folder ${category} not found or empty:`, err.message);
    }

    return projects;
}

// API endpoint to get projects by category
app.get('/api/projects/:category', async (req, res) => {
    const { category } = req.params;

    if (!PROJECT_FOLDERS[category]) {
        return res.status(400).json({ error: 'Invalid category' });
    }

    try {
        const projects = await getProjectsFromFolder(category);
        res.json(projects);
    } catch (error) {
        console.error('Error loading projects:', error);
        res.status(500).json({ error: 'Failed to load projects' });
    }
});

// API endpoint to get all projects
app.get('/api/projects', async (req, res) => {
    try {
        const allProjects = {
            completed: await getProjectsFromFolder('completed'),
            ongoing: await getProjectsFromFolder('ongoing'),
            upcoming: await getProjectsFromFolder('upcoming')
        };
        res.json(allProjects);
    } catch (error) {
        console.error('Error loading projects:', error);
        res.status(500).json({ error: 'Failed to load projects' });
    }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🏗️  SHIVATANAYA CONSTRUCTIONS                           ║
║                                                           ║
║   Server running at: http://localhost:${PORT}               ║
║                                                           ║
║   Project folders:                                        ║
║   • completed_projects/                                   ║
║   • ongoing_projects/                                     ║
║   • upcoming_projects/                                    ║
║                                                           ║
║   API Endpoints:                                          ║
║   • GET /api/projects - All projects                      ║
║   • GET /api/projects/:category - By category             ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);
});
