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
            avatar_url="/sanjitha-portrait.png",
            resume_url="https://example.com/resume.pdf",
            open_to_work=True
        )
        db.add(profile)
        db.commit()
        print("✓ Created default profile")

    # 3. Projects
    if db.query(Project).count() == 0:
        projects = [
            Project(
                title="AuraSphere: AI-Powered Autonomous Cloud Orchestrator",
                slug="aurasphere-autonomous-orchestrator",
                summary="A next-gen cluster management and dynamic autoscaling system leveraging predictive ML models to slash cloud costs by 42%.",
                description="""## Overview
AuraSphere is an autonomous cluster management and dynamic autoscaling system leveraging predictive ML models to slash cloud costs by 42%.

## Problem
Modern Kubernetes workloads experience severe over-provisioning due to unpredictable burst traffic. Traditional reactive autoscalers lag behind spikes by 3 to 5 minutes, resulting in dropped requests and expensive unutilized head-room.

## Solution
Architected an intelligent predictive autoscaler using GRU neural networks to pre-provision compute instances 90 seconds prior to anticipated traffic spikes, coupled with automated spot-instance arbitrage.

## Features
- Real-Time Stream Ingestion: Ingests cluster telemetry over gRPC and Kafka at 150k events/sec.
- Predictive Autoscaling: Pre-allocates spot instances based on RNN traffic forecasts.
- Zero-Downtime Canary Rollouts: Automated health checks, circuit breaking, and progressive traffic shifting.
- Dynamic Cost Arbitrage: Continuously rebalances workloads between on-demand and spot nodes.

## Tech Stack
Rust, Go, Python (FastAPI), Kubernetes, Next.js 15, TimescaleDB, Tailwind CSS

## Architecture
Telemetry metrics flow from DaemonSets to an asynchronous Kafka pipeline, evaluated in real time by the Rust-based inference scheduler, which commands Kubernetes API controllers to right-size node pools.

## My Contributions
- Designed and authored the Rust metrics ingestion daemon processing 150k events/sec with zero allocations.
- Implemented the FastAPI control plane with JWT authentication and RBAC cluster access.
- Built the interactive Next.js dashboard visualizer for live node health and cost savings.

## Screenshots
![AuraSphere Main Dashboard](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000)

## Challenges
- Challenge: Telemetry ingestion backpressure during cluster-wide bursts. -> Solved by: Implemented zero-copy circular ring buffers and partitioned Kafka consumer groups.
- Challenge: Spot instance termination notices (2-minute deadline). -> Solved by: Built automated fast-drain canary handlers that migrate pods within 18 seconds.

## Outcomes & Future Scope
- Slashed production cloud infrastructure expenditures by 42%.
- Maintained 99.99% service uptime during synthetic 10x traffic spikes.
- Future Scope: Multi-cloud federation across AWS, GCP, and bare-metal nodes.""",
                category="Distributed Systems",
                tags="Rust,FastAPI,Kubernetes,Next.js,Kafka,Docker",
                featured_image="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80",
                demo_url="https://demo.aurasphere.example.com",
                github_url="https://github.com/example/aurasphere",
                video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                is_featured=True,
                status="published",
                order_index=1
            ),
            Project(
                title="HyperPulse: Ultra Low-Latency Financial Visualizer",
                slug="hyperpulse-low-latency-visualizer",
                summary="Sub-millisecond order-book visualizer and algorithmic trading dashboard with WebGL canvas rendering.",
                description="""## Overview
Sub-millisecond order-book visualizer and algorithmic trading dashboard with hardware-accelerated WebGL canvas rendering.

## Problem
Standard DOM and SVG-based charting libraries bottleneck at 60 FPS when handling high-frequency market depth with 10,000+ price ticks per second, causing browser freezes and missed execution windows.

## Solution
Engineered a custom GPU-accelerated WebGL rendering pipeline connected to low-latency WebSocket feeds with binary protocol unpacking and off-screen canvas workers.

## Features
- High-Frequency Visualization: Renders 10,000+ real-time bid/ask tick updates per second using custom WebGL shaders.
- Reactive State Architecture: Built on zero-allocation circular buffer data structures in TypeScript.
- Cross-Exchange Aggregation: Real-time WebSocket multiplexing across 6 major global financial hubs.
- Microsecond Timestamping: High-precision order-book event replay with latency heatmaps.

## Tech Stack
Next.js, TypeScript, WebGL, WebSockets, High-Frequency

## Architecture
Incoming WebSocket market ticks are decoded in a Web Worker via ArrayBuffers, queued in circular buffers, and drawn to canvas through custom instanced WebGL shaders.

## My Contributions
- Authored custom GLSL shaders for real-time order-book depth and volume profile rendering.
- Engineered memory-efficient ring buffer queues eliminating garbage collection pauses during live trading.
- Implemented responsive dark-mode UI with floating HUD widgets and configurable layout grids.

## Screenshots
![HyperPulse Order Book](https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=1000)

## Challenges
- Challenge: Garbage collection pauses caused stuttering frame rates. -> Solved by: Replaced all dynamic object allocations in hot loops with fixed-size TypedArrays.
- Challenge: Network jitter across global financial feeds. -> Solved by: Implemented client-side tick interpolation and adaptive reconnect fallbacks.

## Outcomes & Future Scope
- Sustained locked 60 FPS rendering under 15,000 tick/sec throughput.
- Reduced client-side memory footprint by 68%.
- Future Scope: Integration with WebGPU compute shaders for predictive volatility indicators.""",
                category="FinTech & WebGL",
                tags="Next.js,TypeScript,WebGL,WebSockets,High-Frequency",
                featured_image="https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=1000&auto=format&fit=crop&q=80",
                demo_url="https://hyperpulse.example.com",
                github_url="https://github.com/example/hyperpulse",
                is_featured=True,
                status="published",
                order_index=2
            ),
            Project(
                title="CogniFlow: Multimodal Agentic Workflow Engine",
                slug="cogniflow-agentic-workflow-engine",
                summary="Enterprise agentic system allowing teams to deploy autonomous AI swarms with human-in-the-loop guardrails.",
                description="""## Overview
Enterprise agentic system allowing teams to deploy autonomous AI swarms with human-in-the-loop guardrails, multimodal reasoning, and persistent vector memory.

## Problem
Autonomous LLM agents frequently suffer from hallucinations, infinite loops, and uncoordinated task execution when collaborating in multi-step enterprise workflows.

## Solution
Developed a hierarchical agent orchestration engine using directed acyclic graphs (DAGs), dynamic tool evaluation, and consensus voting mechanisms with human review checkpoints.

## Features
- Hierarchical Agent Planning: Multi-agent consensus mechanism with dynamic tool evaluation.
- Vector Memory Core: Hybrid dense and sparse lexical search over 20M+ enterprise documents.
- Sandboxed Execution: Ephemeral containerized runners for generated Python, SQL, and Bash code.
- Interactive Debugger: Real-time trace visualizer for agent tool calls and reasoning chains.

## Tech Stack
FastAPI, Python, PyTorch, Next.js, PostgreSQL, LangChain

## Architecture
User instructions pass to a Supervisor Planner agent that breaks tasks into DAG sub-tasks, delegates to specialized Worker agents with isolated memory, and verifies outputs before final synthesis.

## My Contributions
- Designed the supervisor planner agent architecture with dynamic reflection and retry logic.
- Implemented asynchronous vector embeddings and hybrid search over PostgreSQL pgvector.
- Built the real-time agent trace visualization panel in Next.js.

## Screenshots
![CogniFlow Orchestration](https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1000)

## Challenges
- Challenge: Agent execution loops during complex recursive tasks. -> Solved by: Added strict max-depth recursion limits and dynamic timeout circuit breakers.
- Challenge: Token budget explosion across multi-agent turns. -> Solved by: Implemented automatic context compression and semantic deduplication.

## Outcomes & Future Scope
- Achieved 94% task completion rate on complex multi-step reasoning benchmarks.
- Lowered token consumption by 35% through semantic memory retrieval.
- Future Scope: Multi-modal vision and audio reasoning agents with local on-premise model execution.""",
                category="AI / Machine Learning",
                tags="FastAPI,Python,PyTorch,Next.js,PostgreSQL,LangChain",
                featured_image="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1000&auto=format&fit=crop&q=80",
                demo_url="https://cogniflow.example.com",
                github_url="https://github.com/example/cogniflow",
                is_featured=True,
                status="published",
                order_index=3
            ),
            Project(
                title="VeloceDB: Embedded In-Memory LSM-Tree Storage Engine",
                slug="velocedb-lsm-storage-engine",
                summary="Lightweight, crash-safe, write-optimized key-value store crafted for edge computing and local caching.",
                description="""## Overview
Lightweight, crash-safe, write-optimized key-value storage engine crafted for edge computing and local caching.

## Problem
Traditional B-Tree databases suffer from severe write amplification on random write workloads, making them suboptimal for high-throughput edge event logging.

## Solution
Implemented a log-structured merge-tree (LSM-Tree) engine with Write-Ahead Logging (WAL), in-memory MemTables, bloom filters, and tiered background SSTable compaction.

## Features
- LSM-Tree Architecture: Sequential append-only disk writes providing high write throughput.
- Fast Negative Lookups: Counting bloom filters reducing disk seeks by 85%.
- Crash Durability: Configurable WAL flush policies ensuring zero data loss upon abrupt termination.
- Zero External Dependencies: Pure embedded library design suitable for edge runtimes.

## Tech Stack
C++, Go, Systems Programming, LSM-Tree, Benchmarking

## Architecture
Writes hit an append-only WAL and an in-memory red-black MemTable. Once full, the MemTable freezes into an immutable SSTable and flushes to disk, maintained via leveled compaction.

## My Contributions
- Implemented the concurrency-safe MemTable and Leveled SSTable compaction algorithms.
- Authored crash-recovery test harnesses simulating power loss during active compaction cycles.
- Benchmarked performance against RocksDB and LevelDB under synthetic write workloads.

## Screenshots
![VeloceDB Architecture](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000)

## Challenges
- Challenge: Read amplification during SSTable point lookups across multiple levels. -> Solved by: Built block-level bloom filters and an LRU block cache.
- Challenge: Compaction latency spikes degrading write throughput. -> Solved by: Moved compaction routines into dedicated background worker threads with rate limiting.

## Outcomes & Future Scope
- Reached 180,000 writes/second on standard NVMe SSDs.
- Reduced write amplification factor from 18x to 3.2x.
- Future Scope: Persistent memory (PMEM) support and Raft-based distributed replication.""",
                category="Systems & Databases",
                tags="C++,Go,Systems Programming,LSM-Tree,Benchmarking",
                featured_image="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&auto=format&fit=crop&q=80",
                github_url="https://github.com/example/velocedb",
                is_featured=False,
                status="published",
                order_index=4
            ),
            Project(
                title="Draft Project: Next-Gen Quantum Simulator",
                slug="quantum-circuit-simulator-draft",
                summary="Simulating 32-qubit quantum state vectors on commodity GPUs using CUDA kernels.",
                description="Work in progress draft project that must remain invisible to public visitors.",
                category="Research",
                tags="CUDA,Python,Quantum",
                status="draft",
                order_index=5
            )
        ]
        db.add_all(projects)
        db.commit()
        print(f"✓ Seeded {len(projects)} projects (including draft)")

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

    # 6. Certifications
    if db.query(Certification).count() == 0:
        certs = [
            Certification(
                title="AWS Certified Solutions Architect – Professional",
                issuer="Amazon Web Services",
                issue_date="Nov 2024",
                expiry_date="Nov 2027",
                credential_id="AWS-PSA-994821",
                credential_url="https://aws.amazon.com/verification",
                certificate_image="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80",
                status="published",
                order_index=1
            ),
            Certification(
                title="Google Cloud Certified Professional Cloud Architect",
                issuer="Google Cloud",
                issue_date="Aug 2024",
                expiry_date="Aug 2026",
                credential_id="GCP-PCA-731940",
                credential_url="https://cloud.google.com/certification",
                certificate_image="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
                status="published",
                order_index=2
            ),
            Certification(
                title="Certified Kubernetes Administrator (CKA)",
                issuer="Linux Foundation & CNCF",
                issue_date="Jan 2024",
                expiry_date="Jan 2027",
                credential_id="CKA-240182",
                credential_url="https://www.cncf.io/certification/cka",
                certificate_image="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
                status="published",
                order_index=3
            )
        ]
        db.add_all(certs)
        db.commit()
        print(f"✓ Seeded {len(certs)} certifications")

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

