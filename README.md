# Shivatanaya Construction Website

A premium construction company website for **Shivatanaya** based in Bangalore, India.

## 🏗️ Project Structure

```
Shivatanaya/
├── index.html              # Main website file
├── styles.css              # All styling
├── script.js               # JavaScript functionality
├── README.md               # This file
│
├── completed_projects/     # Folder for completed projects
│   └── [Project_Name]/     # Each subfolder = one project
│       ├── project.txt     # Project details file
│       └── *.jpg/png       # Project images
│
├── ongoing_projects/       # Folder for ongoing projects
│   └── [Project_Name]/     # Each subfolder = one project
│       ├── project.txt     # Project details file
│       └── *.jpg/png       # Project images
│
└── upcoming_projects/      # Folder for upcoming projects
    └── [Project_Name]/     # Each subfolder = one project
        ├── project.txt     # Project details file
        └── *.jpg/png       # Project images
```

## 📁 Adding a New Project

### Step 1: Create a Project Folder
Create a new folder inside the appropriate category folder:
- `completed_projects/` - For finished projects
- `ongoing_projects/` - For projects under construction
- `upcoming_projects/` - For planned future projects

**Folder naming convention:** Use underscores instead of spaces
- ✅ `Modern_Villa_Whitefield`
- ❌ `Modern Villa Whitefield`

### Step 2: Create project.txt File
Inside your project folder, create a file named `project.txt` with the following format:

```txt
Project Name: Modern 4BHK Villa
Owner: Mr. Suresh Reddy
Address: 123, HSR Layout, Bangalore - 560102
Review: Shivatanaya delivered exceptional quality work. Very satisfied with their professionalism and attention to detail. Highly recommended!
```

**Important:** Keep all information on their respective lines. Each field must start with the exact label followed by a colon.

### Step 3: Add Project Images
Add project images (JPG, PNG, WEBP, GIF) directly inside the project folder:
- The first image found will be used as the thumbnail
- All images will be displayed in the project modal gallery
- Use high-quality images (recommended: 1920x1080 or larger)

## 🖼️ Example Project Structure

```
completed_projects/
└── Luxury_Villa_Whitefield/
    ├── project.txt
    ├── front_view.jpg
    ├── living_room.jpg
    ├── bedroom.jpg
    └── garden.jpg
```

## 📞 Contact Information

- **Owner:** VinodKumar
- **Phone:** +91 9686467557
- **Location:** Bangalore, Karnataka, India

## 🚀 Deployment

### Option 1: Static Hosting (Basic)
Simply upload all files to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting

### Option 2: With Dynamic Project Loading (Advanced)
For automatic project folder scanning, you'll need a back-end server.

**Using Node.js/Express:**
1. Create a simple API endpoint that reads the project folders
2. Return project data as JSON
3. Update `script.js` to fetch from your API

## 🎨 Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-gold: #D4A855;
    --primary-blue: #1A2744;
    /* ... other colors */
}
```

### Contact Information
Update contact details in `index.html`:
- Phone numbers
- Address
- Social media links

### Services
Modify the services section in `index.html` to reflect your actual services.

## 📱 Features

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Modern animations and transitions
- ✅ Three project categories with tabs
- ✅ Dynamic project loading from folders
- ✅ Project detail modal with image gallery
- ✅ Client testimonials from project reviews
- ✅ WhatsApp integration for contact form
- ✅ Floating WhatsApp button
- ✅ Smooth scroll navigation
- ✅ Loading animations
- ✅ SEO optimized

## 📝 License

© 2024 Shivatanaya Construction. All rights reserved.
