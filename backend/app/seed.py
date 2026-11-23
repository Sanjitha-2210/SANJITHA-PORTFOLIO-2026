from sqlalchemy.orm import Session
from app.models import User, Profile, Project, Skill, Experience, Certification, Education, Message, Milestone
from app.auth import get_password_hash

def seed_database(db: Session):
    # 1. Admin User
    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        admin = User(
            username="admin",
            email="admin@portfolio.local",
            hashed_password=get_password_hash("admin123456"),
            is_admin=True
        )
        db.add(admin)
        db.commit()
        print("✓ Created default admin user: admin / admin123456")

    # 2. Profile
    profile = db.query(Profile).first()
    if not profile:
        profile = Profile(
            full_name="Sanjitha E",
            title="GenAI Application Developer",
            bio="I'm passionate about building intelligent solutions using Generative AI, Machine Learning and modern web technologies.",
            location="Bengaluru, India / Remote",
            email="sanjitha.e.dev@gmail.com",
            github="https://github.com",
            linkedin="https://linkedin.com",
            twitter="https://x.com",
            website="https://sanjitha.dev",
            avatar_url="https://res.cloudinary.com/glpoxplc/image/upload/v1794729920/portfolio_cms/paclbowwbdjsisgvzeqt.jpg",
            resume_url="https://res.cloudinary.com/glpoxplc/image/upload/v1795459300/portfolio_cms/bjmpzwmjos8zad5j14nj.pdf",
            open_to_work=True
        )
        db.add(profile)
        db.commit()
        print("✓ Created default profile")

    # 3. Projects: Ensure all core portfolio projects exist in database
    projects = [
            Project(
                title="Smart Tourist Safety System — TourEzy",
                slug="smart-tourist-safety-system-tourezy",
                summary="Developed an AI-powered tourist safety platform featuring real-time safety scoring, live location tracking, and predictive risk alerts.\n\nThe platform combines AI-powered assistance, Aadhaar-based identity verification, GPS geofencing, and location intelligence to provide safer travel experiences.",
                description="""<!-- meta: 2025–2026 | Generative AI System | Team -->\n\n## Problem\nTourists frequently encounter safety challenges when travelling to unfamiliar locations.\n\n## Solution\nDeveloped an integrated AI-powered safety platform featuring Aadhaar-based KYC verification, Gemini AI conversational guidance, GPS geofencing with unsafe-zone alerts, and Google Maps API location routing.\n\n## Features\n- Real-Time Location Safety: GPS-based tracking, geo-fenced unsafe-zone detection, and instant safety alerts.\n- AI-Powered Assistant: Gemini AI multimodal integration for text and image-based queries and context-aware travel recommendations.\n- Emergency Assistance: Discovery of nearby police stations and hospitals with 1-click emergency routing.\n- Identity Verification: Aadhaar-based digital KYC verification for secure tourist onboarding.\n\n## Architecture\nThe system follows a modular, AI-integrated architecture connecting mobile clients (Kotlin/Jetpack Compose) to FastAPI backend microservices, PostGIS geospatial database, and Gemini AI.\n\n## Measurable Outcomes\n- Successfully engineered an end-to-end tourist safety prototype.\n- Sub-200ms geofence evaluation using spatial indexing in PostGIS.\n\n## Future Scope\n- Offline-first geofence caching for remote trekking zones.\n- Real-time automated tourist crowd-density anomaly detection.""",
                category="Generative AI",
                tags="Python, FastAPI, Kotlin, Jetpack Compose, PostgreSQL, PostGIS, Redis, Docker, LangChain, OpenAI API, Gemini API, Google Maps SDK, Firebase Cloud Messaging, MQTT, Elasticsearch, JWT",
                featured_image="https://res.cloudinary.com/glpoxplc/image/upload/v1795362527/portfolio_cms/aavfbhkqti8swv2pdwml.jpg",
                demo_url="",
                github_url="https://github.com/Sanjitha-2210/TourEzy",
                video_url="",
                is_featured=True,
                status="published",
                order_index=1
            ),
            Project(
                title="HireHub — Placement Management Portal",
                slug="hirehub-placement-management-portal",
                summary="Developed a full-stack web application to streamline campus placement activities, company management, job postings, student applications, interviews, and offer management.",
                description="""<!-- meta: 2026 | Full-Stack Web | Team -->\n\n## Problem\nTraditional campus placement operations rely on fragmented spreadsheets, manual email chains, and disconnected communication channels between Career Development Cells (CDC), recruiters, and students.\n\n## Solution\nEngineered HireHub as a comprehensive full-stack placement portal featuring dedicated portals for CDC administrators, company recruiters, and students.\n\n## Features\n- Dedicated Portals: Specialized dashboards tailored for CDC administrators, company recruiters, and student applicants.\n- Automated Eligibility Verification: Instant verification of candidate eligibility based on CGPA, backlogs, and departmental prerequisites.\n- Structured Job Discovery & Application: 1-click job applications with real-time status tracking across interview stages.\n\n## Measurable Outcomes\nDeveloped a centralized platform for campus placement activities.\nEstablished dedicated interfaces for CDC administrators and students.\nOrganized student, company, and recruitment information.\nSimplified job eligibility verification workflows.\nEnabled structured job discovery and application management.\nImproved visibility into placement-related activities.\nGained practical experience in full-stack development, database management, API integration, and system testing.\n\n## Future Scope\nAI-powered job recommendations based on student profiles and skills.\nAutomated resume parsing and candidate profiling.\nIntelligent placement analytics and predictive insights.\nAutomated email and notification services.\nInterview scheduling and recruitment calendar integration.\nIntegration with external applicant tracking systems.\nAdvanced placement performance dashboards.\nAutomated recruitment reports and institutional analytics.""",
                category="Full-Stack Web",
                tags="FastAPI, React.js, TypeScript, PostgreSQL, SQLAlchemy, Alembic, Redis, JWT, Docker, Tailwind CSS",
                featured_image="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1000&auto=format&fit=crop&q=80",
                demo_url="",
                github_url="https://github.com/Sanjitha-2210/HireHub",
                video_url="",
                is_featured=True,
                status="published",
                order_index=2
            ),
            Project(
                title="Personal AI Agent — Enterprise-Grade Intelligent Assistant",
                slug="personal-ai-agent-enterprise-intelligent-assistant",
                summary="Developed an AI agent platform featuring multi-agent orchestration, persistent memory, and Retrieval-Augmented Generation (RAG) for intelligent conversational assistance.",
                description="""<!-- meta: 2026 | Generative AI System | Lead -->\n\n## Problem\nStandard conversational bots operate in stateless isolation, lack long-term persistent memory across sessions, and cannot interact deterministically with external developer tools.\n\n## Solution\nArchitected an enterprise-grade agent platform using LangGraph for multi-agent state machines, ChromaDB for vector retrieval over enterprise documents, and Model Context Protocol (MCP) servers.\n\n## Features\n- Multi-Agent Orchestration: Autonomous agent workflows using LangGraph with human-in-the-loop validation.\n- Hybrid Semantic Retrieval (RAG): Dense vector search and semantic chunking powered by ChromaDB.\n- Model Context Protocol (MCP): Extensible tool integration connecting local and cloud APIs seamlessly.\n\n## Measurable Outcomes\n- Successfully deployed a production-ready agent platform supporting multi-agent collaboration.\n- Reduced document lookup and synthesis latency from minutes to under 2 seconds.\n\n## Future Scope\n- Voice-driven multimodal interface with real-time audio streaming.\n- Autonomous code generation sandbox with ephemeral container isolation.""",
                category="Generative AI",
                tags="Python, FastAPI, React, TypeScript, PostgreSQL, SQLAlchemy, Alembic, Redis, Docker, LangChain, LangGraph, OpenAI API, Ollama, ChromaDB, MCP Servers, JWT",
                featured_image="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1000&auto=format&fit=crop&q=80",
                demo_url="",
                github_url="https://github.com/Sanjitha-2210/Personal-AI-Agent",
                video_url="",
                is_featured=True,
                status="published",
                order_index=3
            ),
            Project(
                title="DeptConnect — Department Management Platform",
                slug="deptconnect-department-management-platform",
                summary="Developed a responsive department website to organize and present academic information, faculty profiles, student achievements, research activities, placements, and departmental updates.",
                description="""<!-- meta: 2026 | Full-Stack Web | Lead -->\n\n## Problem\nAcademic departments need a modern, maintainable portal to showcase faculty credentials, student achievements, research publications, and official announcements.\n\n## Solution\nEngineered DeptConnect: a high-velocity department management platform featuring a responsive Next.js frontend, Cloudinary-backed digital asset storage, and an administrative CMS.\n\n## Features\n- Faculty & Student Directories: Comprehensive profiles showcasing credentials, publications, and student milestones.\n- Research & Publication Showcase: Curated repository of departmental publications and grants.\n- Placement Highlights & Statistics: Interactive presentation of recruiter records and placement milestones.\n\n## Measurable Outcomes\n- Successfully delivered a centralized, responsive digital hub for the department.\n- Organized academic records, faculty directories, and departmental achievements in one place.\n\n## Future Scope\n- Automated student event registration and digital ticketing.\n- Alumni networking portal with career mentorship connections.""",
                category="Full-Stack Web",
                tags="Next.js, React.js, TypeScript, Tailwind CSS, Python, FastAPI, SQLite, SQLAlchemy, Alembic, Cloudinary, Git, GitHub",
                featured_image="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80",
                demo_url="",
                github_url="https://github.com/Sanjitha-2210/DeptConnect",
                video_url="",
                is_featured=True,
                status="published",
                order_index=4
            ),
            Project(
                title="Blog Platform",
                slug="blog-platform",
                summary="Developed a feature-rich blogging platform during my AI/ML Engineer Internship at PhobosQ, focusing on building a scalable and secure backend using FastAPI.",
                description="""<!-- meta: 2025 | Internship Project | Team -->\n\n## Problem\nTraditional blogging platforms face challenges with performance, content management, and asynchronous operations.\n\n## Solution\nDesigned and developed a modular backend architecture using FastAPI, JWT auth, Elasticsearch, and Celery.\n\n## Features\n- Authentication & User Management: User signup, login, OAuth2 integration, JWT authentication.\n- Advanced Search: Elasticsearch-powered full-text search with relevance ranking.\n- Background Processing: Celery and Redis for background indexing.\n\n## Measurable Outcomes\n- Successfully developed a feature-rich blogging backend using FastAPI.\n- Gained practical experience with scalable backend architecture.\n\n## Future Scope\n- AI-powered blog recommendations.\n- Automatic content categorization and tagging.""",
                category="Full-Stack Web",
                tags="Python, PostgreSQL, SQLAlchemy, Redis, Celery, Elasticsearch, JWT, OAuth2, AWS S3, Cloudinary, WebSockets, Docker",
                featured_image="https://res.cloudinary.com/glpoxplc/image/upload/v1795331508/portfolio_cms/ekp1bdwtsokhmpn87czh.jpg",
                demo_url="",
                github_url="https://github.com/PhobosQ-ai/Community-page",
                video_url="https://res.cloudinary.com/glpoxplc/video/upload/v1795332885/portfolio_cms/ic1jjjyme2ymb0irgnnb.mp4",
                is_featured=False,
                status="published",
                order_index=5
            )
    ]
    for p_seed in projects:
        existing = db.query(Project).filter(Project.slug == p_seed.slug).first()
        if not existing:
            db.add(p_seed)
    db.commit()
    print(f"✓ Ensured {len(projects)} core projects exist in database")

    # 4. Skills (Tech Radar with Core, Proficient, Exploring Tiers - 23 Focused Stack)
    if db.query(Skill).count() == 0:
        skills = [
            # 🟢 Core (Production-Ready)
            Skill(name="Python", category="Languages", tier="Core", proficiency=95, is_highlighted=True, order_index=1),
            Skill(name="Java", category="Languages", tier="Core", proficiency=90, is_highlighted=True, order_index=2),
            Skill(name="TypeScript", category="Languages", tier="Core", proficiency=92, is_highlighted=True, order_index=3),
            Skill(name="JavaScript", category="Languages", tier="Core", proficiency=94, is_highlighted=False, order_index=4),
            Skill(name="Next.js 15", category="Web & Frameworks", tier="Core", proficiency=95, is_highlighted=True, order_index=5),
            Skill(name="React", category="Web & Frameworks", tier="Core", proficiency=94, is_highlighted=True, order_index=6),
            Skill(name="FastAPI", category="Web & Frameworks", tier="Core", proficiency=92, is_highlighted=True, order_index=7),
            Skill(name="Git & GitHub", category="Infrastructure & Tools", tier="Core", proficiency=94, is_highlighted=False, order_index=8),
            Skill(name="Linux", category="Infrastructure & Tools", tier="Core", proficiency=90, is_highlighted=False, order_index=9),

            # 🟡 Proficient (Advanced Applied)
            Skill(name="Generative AI", category="AI & Machine Learning", tier="Proficient", proficiency=92, is_highlighted=True, order_index=10),
            Skill(name="Large Language Models (LLMs)", category="AI & Machine Learning", tier="Proficient", proficiency=94, is_highlighted=True, order_index=11),
            Skill(name="Retrieval-Augmented Generation (RAG)", category="AI & Machine Learning", tier="Proficient", proficiency=92, is_highlighted=True, order_index=12),
            Skill(name="Tailwind CSS", category="Web & Frameworks", tier="Proficient", proficiency=94, is_highlighted=False, order_index=13),
            Skill(name="Streamlit", category="Web & Frameworks", tier="Proficient", proficiency=88, is_highlighted=False, order_index=14),
            Skill(name="PostgreSQL", category="Infrastructure & Tools", tier="Proficient", proficiency=92, is_highlighted=False, order_index=15),
            Skill(name="SQLite", category="Infrastructure & Tools", tier="Proficient", proficiency=90, is_highlighted=False, order_index=16),
            Skill(name="Redis", category="Infrastructure & Tools", tier="Proficient", proficiency=88, is_highlighted=False, order_index=17),
            Skill(name="Celery", category="Infrastructure & Tools", tier="Proficient", proficiency=88, is_highlighted=False, order_index=18),

            # 🔵 Exploring (Emerging Tech)
            Skill(name="PyTorch", category="AI & Machine Learning", tier="Exploring", proficiency=85, is_highlighted=False, order_index=19),
            Skill(name="LangChain", category="AI & Machine Learning", tier="Exploring", proficiency=86, is_highlighted=False, order_index=20),
            Skill(name="Agentic AI", category="AI & Machine Learning", tier="Exploring", proficiency=88, is_highlighted=True, order_index=21),
            Skill(name="Docker", category="Infrastructure & Tools", tier="Exploring", proficiency=88, is_highlighted=False, order_index=22),
            Skill(name="Cloud & AI Deployment", category="Infrastructure & Tools", tier="Exploring", proficiency=85, is_highlighted=False, order_index=23),
        ]
        db.add_all(skills)
        db.commit()
        print(f"✓ Seeded {len(skills)} skills")

    # 5. Experience
    if db.query(Experience).count() == 0:
        experiences = [
            Experience(
                role="Principal Solutions Architect",
                company="Apex Distributed Labs",
                company_url="https://example.com",
                location="San Francisco, CA",
                start_date="2023",
                end_date="Present",
                is_current=True,
                description="Leading architecture for multi-tenant microservices serving 10M+ daily active developers.",
                bullet_points="Architected high-throughput ingestion pipelines handling 50k RPS with sub-30ms latency.\nSpearheaded migration to Next.js enterprise micro-frontends, improving Core Web Vitals score to 99/100.\nMentored 18 senior engineers across distributed systems and UI design token systems.",
                status="published",
                order_index=1
            ),
            Experience(
                role="Senior Full-Stack Engineer",
                company="Vortex Cloud Systems",
                company_url="https://example.com",
                location="Seattle, WA",
                start_date="2021",
                end_date="2023",
                is_current=False,
                description="Designed and delivered cloud monitoring dashboard and real-time incident automation tools.",
                bullet_points="Built real-time telemetry visualizer reducing MTTR (Mean Time to Resolution) by 35%.\nImplemented secure JWT role-based access control and OAuth2 SSO across 12 internal portals.\nCreated comprehensive CI/CD pipelines with automated end-to-end testing.",
                status="published",
                order_index=2
            ),
            Experience(
                role="Full-Stack Developer",
                company="Quantum Leap Software",
                company_url="https://example.com",
                location="Remote",
                start_date="2019",
                end_date="2021",
                is_current=False,
                description="Developed customer-facing web apps and resilient REST/GraphQL backend services.",
                bullet_points="Engineered responsive responsive SPAs with Next.js and Tailwind CSS.\nMaintained 99.98% database availability across SQLite/PostgreSQL clusters.",
                status="published",
                order_index=3
            )
        ]
        db.add_all(experiences)
        db.commit()
        print(f"✓ Seeded {len(experiences)} experience entries")

    # 6. Certifications: Ensure all 11 real certifications exist
    certs = [
            Certification(
                title="Java Problem Solving — CodeChef Certification",
                issuer="CodeChef • 4 August 2026",
                issue_date="2024",
                expiry_date="",
                credential_id="",
                credential_url="",
                certificate_image="https://res.cloudinary.com/glpoxplc/image/upload/v1795361292/portfolio_cms/ijx3hnjbjl1cv53m0jrf.jpg",
                status="published",
                order_index=1,
                description="Successfully completed all lessons and projects in the Java Problem Solving track offered by CodeChef, strengthening programming logic, analytical thinking, and problem-solving abilities through Java-based exercises.

Certificate ID: 9ca02ac
Platform: CodeChef
Category: Technical & Programming
Username: kpr24am047
Key Skills Gained: Java Programming, Problem Solving, Logical Thinking, Algorithmic Thinking.",
                duration="",
                skills="",
                category="Professional Learning & Certifications"
            ),
            Certification(
                title="DEXATHON 2026 — Certificate of Appreciation",
                issuer="Sathyabama Institute of Science and Technology, Chennai • 2026",
                issue_date="2024",
                expiry_date="",
                credential_id="",
                credential_url="",
                certificate_image="https://res.cloudinary.com/glpoxplc/image/upload/v1795359165/portfolio_cms/n5h7jj49kcvi66ui2g90.jpg",
                status="published",
                order_index=5,
                description="Recognized for outstanding performance and achievement in Round 2 of Dexathon 2026, organized by the Department of Computer Applications & Computer Science at Sathyabama Institute of Science and Technology, Chennai.

Certificate Type: Certificate of Appreciation
Event: Dexathon 2026
Achievement: Qualified / Recognized in Round 2
Organizer: Department of Computer Applications & Computer Science
Institution: Sathyabama Institute of Science and Technology
Location: Chennai, Tamil Nadu",
                duration="",
                skills="",
                category="Events & Participation"
            ),
            Certification(
                title="C++ Training — Certification",
                issuer="Spoken Tutorial Project, IIT Bombay • December 2024",
                issue_date="2024",
                expiry_date="",
                credential_id="",
                credential_url="",
                certificate_image="https://res.cloudinary.com/glpoxplc/image/upload/v1795359300/portfolio_cms/dxfsyx0jqfcnbhcbjilz.jpg",
                status="published",
                order_index=6,
                description="Certificate for the Completion of Cpp Training organized at KPR Institute of Engineering and Technology by Pandiya Rajan G with course material provided by the Spoken Tutorial Project, IIT Bombay.

Passing an online exam, conducted remotely from IIT Bombay, is a pre-requisite for completing this training.

PANDIYA RAJAN G from KPR Institute of Engineering and Technology invigilated this examination.
This training is offered by the Spoken Tutorial Project, IIT Bombay.

Credits: 2
Score: 42.50%
Date: 27 December 2024
Certificate ID: 4087059A47

Key Skills: C++ Programming, Object-Oriented Programming, Online Examination, Academic Achievement",
                duration="",
                skills="",
                category="Professional Learning & Certifications"
            ),
            Certification(
                title="Python 3.4.3 Training — Certification",
                issuer="EduPyramids, SINE, IIT Bombay • May 2025",
                issue_date="2024",
                expiry_date="",
                credential_id="",
                credential_url="",
                certificate_image="https://res.cloudinary.com/glpoxplc/image/upload/v1795359426/portfolio_cms/m3yp4uxmlmjmj2qti4vh.jpg",
                status="published",
                order_index=6,
                description="Certificate for the Completion of Python 3.4.3 Training organized at KPR Institute of Engineering and Technology by Mr.Pandiya Rajan G with course material provided by EduPyramids, SINE, IIT Bombay.

Passing an online exam, conducted remotely from IIT Bombay, is a pre-requisite for completing this training.

Examination invigilated by: NANDHAGOPAL S from KPR Institute of Engineering and Technology
Credits: 4
Score: 50.00%
Date: 05 May 2025
Certificate ID: 4087059MJJ
Key Skills: Python Programming, Online Examination, Academic Achievement",
                duration="",
                skills="",
                category="Professional Learning & Certifications"
            ),
            Certification(
                title="VYUHA TECH 2.0 — National Level Hackathon",
                issuer="CMR Institute of Technology • 2025",
                issue_date="2024",
                expiry_date="",
                credential_id="",
                credential_url="",
                certificate_image="https://res.cloudinary.com/glpoxplc/image/upload/v1795358631/portfolio_cms/n6gaydjtpvpi74lyskoj.jpg",
                status="published",
                order_index=7,
                description="Developed an AI-based tourist safety system using Geo-Fencing for real-time location tracking, unsafe-zone detection, and instant emergency alerts. Built as part of a 24-hour national level hackathon, focusing on public safety and smart surveillance solutions.

Certificate ID: V25CMRIT02
Duration: 24 Hours (8th – 9th October 2025)
Role: Team Member —Developer
Technologies Used: AI, Geo-Fencing, Real-Time Monitoring
Key Skills Gained: Problem Solving, Team Collaboration, Innovation, Rapid Prototyping",
                duration="",
                skills="",
                category="Events & Participation"
            ),
            Certification(
                title="Advanced C++ Training — Certification",
                issuer="EduPyramids, SINE, IIT Bombay • May 2025",
                issue_date="2024",
                expiry_date="",
                credential_id="",
                credential_url="",
                certificate_image="https://res.cloudinary.com/glpoxplc/image/upload/v1795359345/portfolio_cms/csj0skeytkehpvernqtm.jpg",
                status="published",
                order_index=7,
                description="Certificate for the Completion of Advanced C++ Training organized at KPR Institute of Engineering and Technology by Pandiya Rajan G with course material provided by EduPyramids, SINE, IIT Bombay.

Passing an online exam, conducted remotely from IIT Bombay, is a pre-requisite for completing this training.

Examination invigilated by: KOTHAI GANESAN from KPR Institute of Engineering and Technology
Credits: 1
Score: 65.00%
Date: 05 May 2025
Certificate ID: 40870590YM

Key Skills: Advanced C++, Object-Oriented Programming, Online Examination, Academic Achievement",
                duration="",
                skills="",
                category="Professional Learning & Certifications"
            ),
            Certification(
                title="CodHer'25 — Women in Coding Challenge",
                issuer="ACM-CEG, Anna University, Chennai • 2025",
                issue_date="2024",
                expiry_date="",
                credential_id="",
                credential_url="",
                certificate_image="https://res.cloudinary.com/glpoxplc/image/upload/v1795358526/portfolio_cms/uu2dvghs6jmcswktixnp.jpg",
                status="published",
                order_index=8,
                description="Certificate of Participation for CodHer'25 — Women in Coding Challenge. Built an AI-based voice cloning and multilingual dubbing system using Python, focused on speech recognition, translation, and natural-sounding voice generation.

Duration: 05–06 April 2025
Event: CodHer'25 — Women in Coding Challenge
Platform: Unstop
Technologies Used: Python, AI, Speech Processing
Key Skills Gained: Problem Solving, Competitive Coding, Teamwork, AI Application Development",
                duration="",
                skills="",
                category="Events & Participation"
            ),
            Certification(
                title="H2-(Hostel Hackathon) — Certificate of Participation",
                issuer="Hostels Aura Club, KPR Institute • May 2025",
                issue_date="2024",
                expiry_date="",
                credential_id="",
                credential_url="",
                certificate_image="https://res.cloudinary.com/glpoxplc/image/upload/v1795358447/portfolio_cms/ynr97rc8sk9iujjndzhh.jpg",
                status="published",
                order_index=9,
                description="",
                duration="",
                skills="",
                category="Events & Participation"
            ),
            Certification(
                title="SOLSTICE - 2024 — Math Innovations Workshop",
                issuer="SRMV College of Arts and Science, Department of Mathematics • September 2024",
                issue_date="2024",
                expiry_date="",
                credential_id="",
                credential_url="",
                certificate_image="https://res.cloudinary.com/glpoxplc/image/upload/v1795356018/portfolio_cms/xsqmc7k64ob8xeljaylu.jpg",
                status="published",
                order_index=10,
                description="Certificate of Participation for the one day workshop on 'Innovations in Learning Mathematics' - SOLSTICE - 2024 held on 24-09-2024.

Event: SOLSTICE - 2024
Topic: Innovations in Learning Mathematics
Date: 24 September 2024
Venue: Sri Ramakrishna Mission Vidyalaya College of Arts and Science, Coimbatore-641 020
Department: Department of Mathematics
Affiliated to: Bharathiar University
Authorized by:
Dr. A.K. Abdul Hakeem - Co-ordinator
Dr. K. Kanagarajan - HoD
Dr. A. Muthusamy - Principal

Key Skills: Mathematical Innovation, Learning Methodologies, Workshop Participation, Intercollegiate Meet",
                duration="",
                skills="",
                category="Events & Participation"
            ),
            Certification(
                title="Learn Java — CodeChef Certification",
                issuer="CodeChef • 4 August 2026",
                issue_date="2024",
                expiry_date="",
                credential_id="",
                credential_url="",
                certificate_image="https://res.cloudinary.com/glpoxplc/image/upload/v1795361413/portfolio_cms/ixtufblwwlu76fiqeh8w.jpg",
                status="published",
                order_index=10,
                description="Successfully completed all lessons and projects in the Learn Java track offered by CodeChef, developing foundational Java programming knowledge and practical coding skills.

Certificate ID: 9dc72d1
Platform: CodeChef
Category: Technical & Programming
Username: kpr24am047
Key Skills Gained: Java Fundamentals, Programming Concepts, Coding Skills, Logical Thinking.",
                duration="",
                skills="",
                category="Professional Learning & Certifications"
            ),
            Certification(
                title="Practice Java — CodeChef Certification",
                issuer="CodeChef • 1 August 2026",
                issue_date="2024",
                expiry_date="",
                credential_id="",
                credential_url="",
                certificate_image="https://res.cloudinary.com/glpoxplc/image/upload/v1795361510/portfolio_cms/vepyvw2kxfuw66clm85l.jpg",
                status="published",
                order_index=11,
                description="Successfully completed all practice problems in the Practice Java track offered by CodeChef, improving coding proficiency, logical reasoning, and practical problem-solving skills through hands-on Java exercises.

Certificate ID: 34e9b28
Platform: CodeChef
Category: Technical & Programming
Username: kpr24am047
Key Skills Gained: Java Programming, Coding Practice, Problem Solving, Logical Reasoning.",
                duration="",
                skills="",
                category="Professional Learning & Certifications"
            )
    ]
    for c_seed in certs:
        existing = db.query(Certification).filter(Certification.title == c_seed.title).first()
        if not existing:
            db.add(c_seed)
    db.commit()
    print(f"✓ Ensured {len(certs)} certifications exist in database")

    # 7. Education
    if db.query(Education).count() == 0:
        education_records = [
            Education(
                degree="B.E. Computer Science Engineering (AI & ML)",
                institution="KPR Institute of Engineering and Technology, Coimbatore",
                period="2024 — 2028",
                metrics="CGPA: 8.7/10",
                tags="AI & ML",
                icon="degree",
                status="published",
                order_index=1
            ),
            Education(
                degree="HSC — Mathematics with Computer Science",
                institution="Perambalur Govt Model School, Perambalur",
                period="2022 — 2024",
                metrics="88.5%",
                tags="Mathematics,Computer Science",
                icon="school",
                status="published",
                order_index=2
            )
        ]
        db.add_all(education_records)
        db.commit()
        print(f"✓ Seeded {len(education_records)} education entries")

    # 8. Milestones (Academic Progression Timeline)
    if db.query(Milestone).count() == 0:
        milestone_records = [
            Milestone(
                year=2022,
                pct=0.0,
                title="Higher Secondary (HSC) Inception",
                subtitle="Began Mathematics with Computer Science at Perambalur Govt Model School",
                period="June 2022",
                status="Completed",
                order_index=1,
            ),
            Milestone(
                year=2023,
                pct=16.67,
                title="Foundations in Computational Sciences",
                subtitle="Advanced calculus, discrete algebra, binary logic & core algorithms",
                period="2022 — 2023",
                status="Completed",
                order_index=2,
            ),
            Milestone(
                year=2024,
                pct=33.33,
                title="HSC 88.5% & B.E. College Entry",
                subtitle="Joined B.E. Computer Science Engineering (AI & ML) at KPR Institute, Coimbatore",
                period="June 2024",
                status="Completed",
                order_index=3,
            ),
            Milestone(
                year=2025,
                pct=50.0,
                title="Core AI & Scalable Systems",
                subtitle="Neural networks, data structures, and high-throughput microservices",
                period="2024 — 2025",
                status="Completed",
                order_index=4,
            ),
            Milestone(
                year=2026,
                pct=66.67,
                title="Autonomous Agentic Engineering",
                subtitle="Engineering LLM agent swarms, RAG architectures & full-stack platforms",
                period="2025 — 2026",
                status="In Progress",
                order_index=5,
            ),
            Milestone(
                year=2027,
                pct=83.33,
                title="Senior Engineering & Capstone",
                subtitle="Advanced distributed architectures, ML publications & enterprise systems",
                period="2026 — 2027",
                status="Upcoming",
                order_index=6,
            ),
            Milestone(
                year=2028,
                pct=100.0,
                title="Expected B.E. Graduation",
                subtitle="B.E. Computer Science Engineering (AI & ML) Degree Conferred",
                period="May 2028",
                status="Upcoming",
                order_index=7,
            ),
        ]
        db.add_all(milestone_records)
        db.commit()
        print(f"✓ Seeded {len(milestone_records)} milestones")

    # 9. Messages
    if db.query(Message).count() == 0:
        msg = Message(
            name="Sarah Jenkins",
            email="sarah.jenkins@techrecruiting.io",
            subject="Senior Staff Architect Opportunity",
            message="Hi Alex, I was blown away by your AuraSphere distributed systems architecture. We're looking for a lead architect for our cloud compute team. Would love to connect!",
            is_read=False
        )
        db.add(msg)
        db.commit()
        print("✓ Seeded sample message")

