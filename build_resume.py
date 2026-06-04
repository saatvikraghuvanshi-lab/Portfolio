from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.section import WD_SECTION
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


OUT = "Saatvik_Raghuvanshi_Resume_ATS.docx"


def set_cell_text(cell, text):
    cell.text = text


def set_link(paragraph, text, url):
    part = paragraph.part
    r_id = part.relate_to(
        url,
        "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink",
        is_external=True,
    )
    hyperlink = OxmlElement("w:hyperlink")
    hyperlink.set(qn("r:id"), r_id)
    run = OxmlElement("w:r")
    r_pr = OxmlElement("w:rPr")
    color = OxmlElement("w:color")
    color.set(qn("w:val"), "0563C1")
    r_pr.append(color)
    underline = OxmlElement("w:u")
    underline.set(qn("w:val"), "single")
    r_pr.append(underline)
    run.append(r_pr)
    text_node = OxmlElement("w:t")
    text_node.text = text
    run.append(text_node)
    hyperlink.append(run)
    paragraph._p.append(hyperlink)


def add_hyperlink_line(doc, items):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    for index, item in enumerate(items):
        if index:
            p.add_run(" | ")
        if isinstance(item, tuple):
            set_link(p, item[0], item[1])
        else:
            p.add_run(item)


def add_heading(doc, text):
    p = doc.add_paragraph()
    p.style = "Resume Heading"
    p.add_run(text.upper())
    p.paragraph_format.keep_with_next = True


def add_bullet(doc, text):
    p = doc.add_paragraph(style="Resume Bullet")
    p.add_run("- " + text)


def add_role_line(doc, left, right=None):
    p = doc.add_paragraph()
    p.style = "Resume Role"
    p.paragraph_format.keep_with_next = True
    p.add_run(left).bold = True
    if right:
        tab_stops = p.paragraph_format.tab_stops
        tab_stops.add_tab_stop(Inches(6.7), WD_ALIGN_PARAGRAPH.RIGHT)
        p.add_run("\t" + right)


def set_document_defaults(doc):
    section = doc.sections[0]
    section.top_margin = Inches(0.55)
    section.bottom_margin = Inches(0.55)
    section.left_margin = Inches(0.65)
    section.right_margin = Inches(0.65)

    styles = doc.styles
    normal = styles["Normal"]
    normal.font.name = "Arial"
    normal._element.rPr.rFonts.set(qn("w:eastAsia"), "Arial")
    normal.font.size = Pt(10)
    normal.font.color.rgb = RGBColor(0, 0, 0)
    normal.paragraph_format.space_after = Pt(3)
    normal.paragraph_format.line_spacing = 1.08

    heading = styles.add_style("Resume Heading", 1)
    heading.base_style = normal
    heading.font.name = "Arial"
    heading._element.rPr.rFonts.set(qn("w:eastAsia"), "Arial")
    heading.font.size = Pt(10.5)
    heading.font.bold = True
    heading.font.color.rgb = RGBColor(0, 0, 0)
    heading.paragraph_format.space_before = Pt(8)
    heading.paragraph_format.space_after = Pt(2)
    heading.paragraph_format.line_spacing = 1.0

    role = styles.add_style("Resume Role", 1)
    role.base_style = normal
    role.font.name = "Arial"
    role._element.rPr.rFonts.set(qn("w:eastAsia"), "Arial")
    role.font.size = Pt(10)
    role.paragraph_format.space_before = Pt(2)
    role.paragraph_format.space_after = Pt(1)
    role.paragraph_format.line_spacing = 1.0

    bullet = styles.add_style("Resume Bullet", 1)
    bullet.base_style = normal
    bullet.font.name = "Arial"
    bullet._element.rPr.rFonts.set(qn("w:eastAsia"), "Arial")
    bullet.font.size = Pt(9.5)
    bullet.paragraph_format.left_indent = Inches(0.18)
    bullet.paragraph_format.first_line_indent = Inches(-0.18)
    bullet.paragraph_format.space_after = Pt(2)
    bullet.paragraph_format.line_spacing = 1.04


def add_section_rule(paragraph):
    p_pr = paragraph._p.get_or_add_pPr()
    p_bdr = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), "6")
    bottom.set(qn("w:space"), "1")
    bottom.set(qn("w:color"), "000000")
    p_bdr.append(bottom)
    p_pr.append(p_bdr)


def main():
    doc = Document()
    set_document_defaults(doc)

    name = doc.add_paragraph()
    name.alignment = WD_ALIGN_PARAGRAPH.CENTER
    name.paragraph_format.space_after = Pt(1)
    run = name.add_run("SAATVIK RAGHUVANSHI")
    run.bold = True
    run.font.name = "Arial"
    run._element.rPr.rFonts.set(qn("w:eastAsia"), "Arial")
    run.font.size = Pt(17)

    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title.paragraph_format.space_after = Pt(3)
    title.add_run("Product Engineer | Full-Stack Engineer (Frontend-Leaning) | Supabase/PostgreSQL")

    add_hyperlink_line(
        doc,
        [
            "Jaipur, Rajasthan, India",
            "9301661150",
            "raghuvanshisaatvik@gmail.com",
            ("linkedin.com/in/saatvik-raghuvanshi-b68064399", "https://www.linkedin.com/in/saatvik-raghuvanshi-b68064399/"),
            ("github.com/saatvikraghuvanshi-lab", "https://github.com/saatvikraghuvanshi-lab"),
        ],
    )

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(4)
    add_section_rule(p)

    add_heading(doc, "Summary")
    doc.add_paragraph(
        "Product-focused Software Engineer specializing in modern frontend frameworks and Backend-as-a-Service "
        "(BaaS) architectures. Proven track record of independently architecting, securing, and deploying "
        "full-stack web applications by bridging intuitive UI design with robust PostgreSQL database engineering."
    )

    add_heading(doc, "Education")
    add_role_line(doc, "Manipal University Jaipur - B.Tech in Computer Science and Engineering", "Expected 2029")
    add_bullet(doc, "Current GPA: 7.0; completed first year coursework while building practical projects in full-stack development, APIs, UI/UX, and cloud-related tools.")
    add_role_line(doc, "Army Public School - Class 10: 86% | Resonance - Class 12: 82%")
    add_bullet(doc, "Academic background supported by early exposure to robotics, drone building, line follower systems, and technical workshops.")

    add_heading(doc, "Technical Skills")
    skills = [
        ("Languages", "C, Python, TypeScript, HTML"),
        ("Frontend", "React.js, Next.js, TypeScript, Redux, Tailwind CSS, shadcn/ui, UI/UX, responsive web development"),
        ("Backend and Database", "Node.js, PostgreSQL, Supabase, Convex, Convex Auth, Convex Storage, relational data modeling, Row Level Security (RLS), APIs"),
        ("AI, Workflows, and Tools", "Gemini API, Inngest, Git, GitHub, Vercel, Netlify, cloud computing training"),
        ("Additional", "AutoCAD, drone building, line follower robots, GIS map integration, AI prompting, analytical problem solving"),
    ]
    for label, value in skills:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(1)
        p.add_run(f"{label}: ").bold = True
        p.add_run(value)

    add_heading(doc, "Projects")
    add_role_line(doc, "S2C - AI Sketch-to-Design Learning Project")
    add_bullet(doc, "Built a full-stack AI SaaS-style design tool using Next.js, TypeScript, Convex, Inngest, Redux, Tailwind CSS, shadcn/ui, and Gemini API, covering authentication, projects, infinite canvas editing, autosave, and PNG/JSON exports.")
    add_bullet(doc, "Implemented canvas tools including frames, shapes, text, free drawing, eraser, layers, selection, zoom, pan, and generated UI rendering.")
    add_bullet(doc, "Integrated Convex, Convex Auth, Convex Storage, Inngest, and Gemini-compatible API routes for database, authentication, storage, background jobs, and AI workflow orchestration.")

    add_role_line(doc, "VibeBatch - Full-Stack Web Application", "Live: https://www.vibebatch.net/")
    add_bullet(doc, "Architected relational PostgreSQL schemas in Supabase to support user profiles, friend relationships, trait voting, messages, story cards, and premium identity flows.")
    add_bullet(doc, "Engineered data privacy and security patterns using Supabase Row Level Security (RLS) for user-owned profile, relationship, message, and trait data.")
    add_bullet(doc, "Implemented secure user authentication and full-stack product workflows with a React/Vite frontend and Supabase Auth/database services.")
    add_bullet(doc, "GitHub: https://github.com/saatvikraghuvanshi-lab/VibeBatch")

    add_role_line(doc, "ResilienceOS - Disaster Management Web Platform", "Live: https://resilienceos.vercel.app/")
    add_bullet(doc, "Built frontend and backend workflows for a unified disaster management system developed during Startup Forge Ideathon.")
    add_bullet(doc, "Modeled data flows for emergency-response coordination, user-facing reporting, and operational information access.")
    add_bullet(doc, "GitHub: https://github.com/saatvikraghuvanshi-lab/RESILIENCEOS")

    add_role_line(doc, "JanSahayak - Public Assistance Web Application", "Live: https://jansahayak1.netlify.app/")
    add_bullet(doc, "Developed and deployed a civic-help oriented web application with structured service-access flows and user-facing data presentation.")
    add_bullet(doc, "Applied frontend development, UI structuring, and web deployment practices using a Netlify-hosted workflow.")

    add_role_line(doc, "TerraPulse Pro - GIS-Oriented Web Application", "Live: https://terrapulsepro1.netlify.app/")
    add_bullet(doc, "Built and deployed a GIS-oriented web application focused on map/data presentation and geospatial product workflows.")
    add_bullet(doc, "Strengthened experience in integrating technical data views into accessible web interfaces.")

    add_heading(doc, "Experience")
    add_role_line(doc, "Freelance Full-Stack Developer - VibeBatch")
    add_bullet(doc, "Delivered a live web product for a freelance project, handling full-stack development responsibilities and deployment readiness.")
    add_role_line(doc, "Cloud Computing Training - Training Phase")
    add_bullet(doc, "Currently building foundational cloud computing knowledge aligned with a long-term cloud engineering career goal.")

    add_heading(doc, "Achievements and Certifications")
    add_bullet(doc, "Startup Forge Ideathon - 4th Place Finisher, GCEC Global Foundation; recognized for developing ResilienceOS during a 48-hour build.")
    add_bullet(doc, "Career Guidance Session: Artificial Intelligence and Prompt Engineering - GradGuru Innovations.")
    add_bullet(doc, "Technical workshops and hackathons: Rewind & Recode National Hackathon, Robotics Workshop at Techfest IIT Bombay, WRC Quadcopter Challenge, Fastest Line Follower Challenge, and Machine Learning Workshop at Times Technoxian 2019.")

    doc.save(OUT)


if __name__ == "__main__":
    main()
