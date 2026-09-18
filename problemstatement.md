### Problem Statement

Problem Statement: AI-Powered Discovery Engine for Vague Photo Retrieval (Google Photos Use Case)

Over years of usage, users accumulate thousands of visual memories in Google Photos. While exact searches work well, retrieval becomes extremely difficult when a user's memory is incomplete (e.g., remembering "that small café from the Goa trip" but forgetting the date, location metadata, or exact search terms). The strategic goal is to increase the percentage of users who successfully retrieve these vaguely remembered photos. Our first task is to understand this problem deeply by analyzing public user conversations.

#### Objective
Design and implement an **AI-Powered Discovery Engine** that:
- Ingests and processes user feedback and conversations about photo retrieval at scale from various public sources.
- Takes flexible, natural-language inquiries from users and infers the exact research insight being sought.
- Uses a Large Language Model (LLM) to go beyond simple sentiment analysis to uncover how people remember old visual information and where existing retrieval experiences break down.
- Identifies, compares, and categorizes different retrieval problems and opportunity areas using concrete evidence from real users and presents the findings in a structured, evidence-backed format.

#### System Workflow

1. **Data Ingestion**
   - Scrape, load, and preprocess publicly available data from sources such as:
     - Google Play Store & App Store reviews
     - Reddit discussions and Forums
     - Google Photos community/support discussions
     - Social media conversations and YouTube comments
   - Filter the dataset to isolate conversations specifically related to searching, memory, and struggling to find old photos.

2. **Data Processing & Feature Extraction**
   - Parse the raw text to identify key components of the user's struggle:
     - What the user was looking for (e.g., a document, a vacation photo).
     - The search strategies they attempted.
     - The emotions or frustrations expressed regarding the retrieval failure.

3. **User Input & Intent Inference (Frontend)**
   - Accept flexible, natural-language prompts, topics, or direct questions from internal users. The engine must classify the query into one of several primary inquiry types and infer the specific data insight required:
     - **Cognitive Memory & Recall Inquiries:**
       - *"What do people actually remember about old travel photos?"*
       - *"Do users recall dates, visual objects, or emotions more reliably?"*
       - *"What information is forgotten first when looking for events older than two years?"*
     - **Search Formulation & Query Behavior:**
       - *"How do users formulate searches when they don't know the exact name or location?"*
       - *"What keywords or descriptors do users try when looking for utility items like prescriptions or receipts?"*
       - *"How do users attempt to describe vague colors, seasons, or vibes?"*
     - **Retrieval Breakdown & Failure Modes:**
       - *"What kinds of photos do users struggle to retrieve the most?"*
       - *"Where does the existing Google Photos search experience break down for users?"*
       - *"Why do searches fail even when the user knows the photo exists?"*
     - **Comparative & Segmented Inquiries:**
       - *"Compare retrieval pain points between utility photos (documents/medicine) and milestone memories (weddings/vacations)."*
       - *"How do retrieval complaints differ between recent photos versus multi-year-old archives?"*
     - **Workarounds & Unmet Needs:**
       - *"What do users do when search fails them (e.g., endless scrolling, giving up, manual album sorting)?"*
       - *"Is there expressed demand for interactive follow-up questions or conversational search filters?"*

4. **Integration & Retrieval Layer**
   - Map the inferred intent to the ingested vector/text database of public discourse.
   - Retrieve relevant conversation clusters and public complaint threads.
   - Structure and pass retrieved user evidence to the LLM with instructions to classify behaviors, isolate cognitive breakdown points, and aggregate quantitative patterns.

5. **Discovery, Analysis & Quantification Engine**
   - Move beyond simple sentiment analysis by categorizing user narratives into structured behavioral dimensions.
   - Aggregate and quantify evidence to compute proportional metrics like:
     - **Failure Distribution by Content Type:** (e.g., Utility/Prescriptions/Receipts: 44%, Casual Outings/Cafés: 32%, Milestone Events: 24%)
     - **Memory Retention vs. Forgetting:** (e.g., Sensory/Visual Cues Retained: 68%, People/Companions Retained: 54%, Exact Dates/Locations Forgotten: 86%)
     - **User Search Formulation Strategy:** (e.g., Single Vague Keyword: 51%, Multi-attribute Guessing: 33%, Manual Date Scrolling: 16%)
     - **Root Cause Breakdown:** (e.g., Metadata Mismatch: 46%, Vague Semantic Recognition: 34%, OCR/Text Failure: 20%)
   - Cluster these insights into distinct "retrieval problems" and "opportunity areas."

6. **Output Display**
   - Present the synthesized findings in a structured, actionable dashboard or report format for product teams:
     - Identified Opportunity Area (e.g., "Event-based memory search").
     - Key missing memory components.
     - AI-generated analysis of the friction point.
     - Direct quotes and evidence from real users to support the identified problem.