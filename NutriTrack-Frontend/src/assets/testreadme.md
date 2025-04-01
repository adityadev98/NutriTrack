# NutriTrack: A Meal Plan and Nutrition Website

## Table of Contents
1. Introduction
2. Features
3. Technology Stack
4. Installation & Setup
5. Usage Guide
6. API Integration
7. Team Members
8. Contribution Guidelines
9. License
10. Contact Information

## 1. Introduction
NutriTrack is a web-based application designed to help users track their nutritional intake and make informed dietary decisions. With a growing interest in fitness and health, NutriTrack aims to provide a platform where users can log their meals, receive personalized feedback, and gain insights into their diet.

The application integrates with APIs such as OpenFoodFacts to extract nutritional data and suggest healthy meal options. Unlike traditional calorie-counting apps, NutriTrack provides holistic nutritional insights, catering to individuals with specific dietary needs or fitness goals.

## 2. Features
- **Meal Logging**: Users can log their meals and receive real-time nutritional feedback.
- **Nutritional Analysis**: Breakdown of macronutrients (proteins, fats, carbohydrates) and micronutrients (vitamins, minerals) per meal.
- **Personalized Recommendations**: Suggests healthier alternatives based on dietary goals.
- **Recipe Suggestions**: Provides recipes tailored to user-specific nutritional deficiencies.
- **Progress Tracking**: Weekly and monthly reports summarizing dietary habits and nutritional intake.
- **User-Friendly Interface**: Clean and intuitive UI built using Chakra UI and React.
- **Cloud-Based Storage**: Data securely stored using MongoDB Atlas.

## 3. Technology Stack
- **Frontend**: React.js, Chakra UI, TypeScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **APIs Used**: OpenFoodFacts for nutritional data
- **Version Control**: Git & GitHub
- **Deployment**: Vercel/Netlify (Frontend), Render/Heroku (Backend)

## 4. Installation & Setup
### Prerequisites
Ensure you have the following installed:
- Node.js (v16 or later)
- MongoDB Atlas account
- Git

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/nutritrack.git
   cd nutritrack
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```env
   MONGO_URI=your_mongodb_uri
   OPENFOODFACTS_API_KEY=your_api_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000` in your browser.

## 5. Usage Guide
- **Register/Login**: Create an account or log in using credentials.
- **Log Meals**: Enter food items manually or search using the database.
- **View Nutritional Info**: Analyze the breakdown of macronutrients and micronutrients.
- **Receive Suggestions**: Get personalized recommendations for better meal planning.
- **Check Progress**: View weekly and monthly nutrition summaries.

## 6. API Integration
### OpenFoodFacts API
NutriTrack fetches real-time food nutritional data using OpenFoodFacts API. Sample API call:
```javascript
fetch('https://world.openfoodfacts.org/api/v0/product/737628064502.json')
  .then(response => response.json())
  .then(data => console.log(data));
```

## 7. Team Members
- **Gayathri Balasundaram**
- **Karan Arora**
- **Azadan Bhagwagar**
- **Anik Chakraborti**
- **Aditya Dev**

## 8. Contribution Guidelines
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Added new feature"`
4. Push to the branch: `git push origin feature-name`
5. Open a Pull Request.

## 9. License
This project is licensed under the MIT License. See `LICENSE` for more details.

## 10. Contact Information
For queries, reach out to:
- **Email**: nutritrack-support@example.com
- **GitHub Issues**: [GitHub Issues](https://github.com/your-repo/nutritrack/issues)

