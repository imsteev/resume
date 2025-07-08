import resumeData from "./src/resume.toml" with { type: "toml" };

interface ResumeData {
  name: string;
  email: string;
  toolsAndTechnologies: string[];
  education: Array<{
    institution: string;
    date: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    date: string;
    note?: string;
    responsibilities?: string[];
    roles?: Array<{
      title: string;
      responsibilities: string[];
    }>;
  }>;
  projects: Array<{
    name: string;
    description: string[];
  }>;
}

async function buildResume() {
  
  // Read HTML template
  const htmlTemplate = await Bun.file("./src/template.html").text();
  
  // Read CSS styles
  const cssStyles = await Bun.file("./src/styles.css").text();
  
  // Generate HTML content
  const htmlContent = generateResumeHTML(resumeData as ResumeData, cssStyles);
  
  // Replace placeholder in template
  const finalHTML = htmlTemplate.replace("{{RESUME_CONTENT}}", htmlContent);
  
  // Write output file
  await Bun.write("./resume.html", finalHTML);
  
  console.log("Resume built successfully! Output: resume.html");
}

function generateResumeHTML(data: ResumeData, css: string): string {
  return `
    <style>${css}</style>
    <div class="resume">
      <header class="header">
        <h1>${data.name}</h1>
        <p class="email">${data.email}</p>
      </header>
      
      <section class="section">
        <h2>Tools & Technologies</h2>
        <div class="tech-grid">
          ${data.toolsAndTechnologies.map(tech => `<span class="tech-item">${tech}</span>`).join('')}
        </div>
      </section>
      
      <section class="section">
        <h2>Education</h2>
        ${data.education.map(edu => `
          <div class="education-item">
            <div class="institution">${edu.institution}</div>
            <div class="date">${edu.date}</div>
          </div>
        `).join('')}
      </section>
      
      <section class="section">
        <h2>Experience</h2>
        ${data.experience.map(exp => `
          <div class="experience-item">
            <div class="experience-header">
              <div class="title-company">
                <h3>${exp.title}</h3>
                <span class="company">${exp.company}</span>
              </div>
              <div class="date">${exp.date}</div>
            </div>
            ${exp.note ? `<div class="note">${exp.note}</div>` : ''}
            ${exp.roles ? exp.roles.map(role => `
              <div class="role">
                <h4>${role.title}</h4>
                <ul>
                  ${role.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                </ul>
              </div>
            `).join('') : ''}
            ${exp.responsibilities ? `
              <ul>
                ${exp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        `).join('')}
      </section>
      
      <section class="section">
        <h2>Projects</h2>
        ${data.projects.map(project => `
          <div class="project-item">
            <h3>${project.name}</h3>
            <ul>
              ${project.description.map(desc => `<li>${desc}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </section>
    </div>
  `;
}

buildResume().catch(console.error);