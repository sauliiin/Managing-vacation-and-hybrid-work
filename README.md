# Team Schedule & Vacation Planner

A smart, centralized panel designed to take the headache out of managing team vacations, hybrid work schedules, and substitute assignments. No more conflicting spreadsheets or endless email chains!

---

## 🚀 About The Project

This project was born from the need to simplify the complex logistics of a modern, hybrid-working team. It provides a single, easy-to-use interface where team members can schedule their vacations and everyone can visualize who is working from the office on any given day.

The star of the show is the **"Crazy Roulette"** 🎡, a powerful and fair substitute assignment system. When a key team member (a Secretary) goes on vacation, the system doesn't just pick a random replacement. It runs a sophisticated algorithm based on availability, specific coverage rules, and a fairness doctrine to ensure the workload is distributed evenly and logically.

Built with Vanilla JavaScript and powered by a real-time Firebase backend, this tool is lightweight, fast, and effective.

---

## ✨ Key Features

* **Real-time Database:** Uses Firebase Firestore to keep all vacation and substitution data instantly synced for all users.
* **Intuitive Vacation Planning:** Users can select up to 3 vacation periods, with a business day counter ensuring they stay within the 25-day limit.
* **Hybrid Work Calendar:** A clear monthly calendar view showing each user's scheduled in-office days.
* **Weekly Presence Table:** See at a glance who is physically present at the office each day of the current week.
* **🤖 Smart Substitute Assignment (The "Crazy Roulette"):**
    * Automatically detects when a Secretary's meeting day falls within their vacation.
    * Uses a predefined matrix to determine who is eligible to cover whom.
    * Checks for substitute availability, ensuring they are not on vacation themselves.
    * Employs a load-balancing algorithm to assign substitutions as fairly as possible, preventing any single person from being overworked.
* **Jedi-Level Admin Controls:** A password-protected "Mestre Yoda" role with the ability to view all data and clear substitution assignments from the database.
* **Customizable Avatars:** Because a little personality goes a long way!
* **Fully Responsive:** A clean and functional layout on both desktop and mobile devices.

---

## 🛠️ Built With

This project relies on core web technologies, keeping it lean and maintainable.

* ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
* ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
* ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
* ![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase&logoColor=white)

---

## 🔧 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* A modern web browser (Chrome, Firefox, Edge, etc.).
* A Firebase project. You can create one for free at [firebase.google.com](https://firebase.google.com/).

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://your-repository-link.com/project.git](https://your-repository-link.com/project.git)
    ```

2.  **Configure Firebase**
    * Open the `app.js` file.
    * Find the `firebaseConfig` object at the top of the file.
    * Replace the placeholder values with your own Firebase project's credentials. You can find these in your Firebase project settings under "Your apps" -> "SDK setup and configuration".

    ```javascript
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };
    ```

3.  **Set up Firestore Database**
    * In your Firebase project, create a **Firestore Database**.
    * The app will automatically create two main collections as you use it:
        * `funcionarios`: Stores user-specific data like vacation periods and chosen avatar.
        * `substituicoes`: Stores the results of the "Crazy Roulette" assignments.

4.  **Run the Application**
    * That's it! Since this is a pure front-end application, you just need to open the `index.html` file in your web browser.
    * For the best experience (to avoid any potential CORS issues with local files), it's recommended to use a simple local server. If you have VS Code, the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension is perfect for this.

---

## 📖 Usage

1.  **Select a User:** Open the page and choose your name from the dropdown menu to load your data.
2.  **Admin Access:** To log in as "Mestre Yoda", select the name and enter the password (`Mestre@Yoda`) when prompted.
3.  **Schedule Vacations:** Use the "Minhas Férias" card to add or remove vacation periods. The business day count will update automatically. Click "Confirmar e Salvar Férias" to push your changes to the database.
4.  **Assign Substitutes:** If substitutions are needed, the "Roleta Maluca" button will appear.
    * Click it to run the assignment algorithm.
    * The results will be displayed below. You can manually change any assignment using the dropdowns.
    * Click **"Salvar Resultados no Banco de Dados"** to make the assignments official.

---

## 💡 TODO

1.  **Dedicated Admin Panel:** A secure dashboard where an administrator can manage users (reset passwords, delete accounts), update the pool of available avatars, and visually create or edit the vacation substitution rules.
2.  **Future Ideas:** More to come! The sky's the limit!