# Emerging Artists Music Platform

## Project Overview
### Objective
Our platform aims to **promote emerging artists**, particularly among our users. The target audience is interested in discovering new music in genres that are **uncommon**, **experimental**, or even **amateur**. Many of these users are likely to be emerging or amateur musicians themselves, seeking a platform to showcase their work. This creates opportunities for fostering **local music scenes**, such as at the scale of a city.

### Common Use Cases
1. Providing **recommendations** (regularly refreshed) of lesser-known artists or musical genres.
2. Allowing users to create playlists blending **locally stored music** with songs proposed by the platform through streaming.
3. Helping users manage recommendations by notifying them to download tracks they’ve added to playlists before the recommendations change.
4. Enabling users to submit their own tracks for monthly recommendations (requires intellectual property control and security measures).

---

## Feature Tracker
Below is a list of features, their statuses, and evaluations based on the **US (Utilité, Accessibilité, Durabilité)** framework.

| **Feature**                 | **Utility (U)** | **Accessibility (A)** | **Durability (D)** | **Status**          |
|-----------------------------|-----------------|-----------------------|--------------------|---------------------|
| **Playlist Management**     | ++              | +                     | –                | To Implement        |
| **Loop Playback**           | +               | ++                    | +                  | To Implement        |
| **Shuffle Playback**        | +               | ++                    | +                  | To Implement        |
| **Reading List**            | +               | +                     | +                  | To Implement        |
| **Recommendations**         | +               | ±                  | ++                 | To Implement        |
| **Song Search**             | ++              | +                     | –                | To Implement        |
| **Playback Bar**            | +               | +                     | +                  | To Implement        |
| **Authentication**          | ++              | +                     | –                | To Implement        |
| **Local File Integration**  | +               | +                     | ++                 | To Implement        |
| **Top Played Songs**        | +               | ++                    | +                  | To Implement        |
| **FAQ / Documentation**     | +               | +                     | ++                 | To Implement        |
| **Song Playback**           | ++              | ++                    | +                  | To Implement        |
| **Like Library**            | +               | ++                    | –                | Not Planned         |
| **Filter System**           | +               | +                     | +                  | Not Planned         |
| **Playlist Sharing**        | +               | +                     | –                | Not Planned         |

---

## Features in Development
- [ ] Playlist Management
- [ ] Loop Playback
- [ ] Shuffle Playback
- [ ] Recommendations System
- [ ] Song Search
- [ ] Playback Bar
- [ ] Authentication
- [ ] Local File Integration
- [ ] Top Played Songs
- [ ] FAQ / Documentation

## Completed Features
- [ ] None yet

## Low-Tech Framework Evaluation
Each feature has been evaluated based on:
1. **Utility:** Does the feature challenge conventional usage and bring value to the user?
2. **Accessibility:** Is the feature simple and easy to use?
3. **Durability:** Is the feature sustainable in terms of long-term use and low-tech principles?

---

## Development Setup
1. Install **Node.js** and **npm** if not already installed.
2. Navigate to the backend and frontend folders and install dependencies:
   ```bash
   cd server
   npm install
   cd ../spotifi
   npm install
   ```
3. Run both servers in parallel:
   ```bash
   npm start
   ```

---

## Contact
For any questions or suggestions, feel free to reach out to the project maintainers or open an issue!
