# Smart Waste Manager

A comprehensive waste-to-energy management system that streamlines waste collection processes with separate interfaces for workers and administrators.

## 🌟 Features

### For Workers
- **Public Waste Notification Form** - No login required
- **Site Selection** - Choose from available processing sites
- **Detailed Waste Reporting** - Type, quantity, contact information
- **Real-time Validation** - Form validation with helpful error messages
- **Success Confirmation** - Clear feedback on submission status

### For Administrators
- **Secure Authentication** - Registration and login system
- **Dashboard Overview** - View all waste reports in one place
- **Status Management** - Update waste collection status (Reported → En Route → Collected)
- **Real-time Updates** - Live status changes with confirmation modals
- **Contact Information** - Easy access to worker contact details

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive styling
- **React Router DOM** for navigation
- **Lucide React** for beautiful icons

### Backend
- **Node.js** with TypeScript
- **Express.js** for RESTful API
- **Prisma ORM** for database management
- **SQLite** for lightweight, file-based database
- **JWT** for secure authentication
- **bcrypt** for password hashing

## 📁 Project Structure

```
smart-waste-manager/
├── wte-frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   ├── utils/         # API helpers and utilities
│   │   └── ...
│   └── package.json
├── wte-backend/           # Node.js backend API
│   ├── src/
│   │   ├── middleware/    # Authentication middleware
│   │   ├── utils/         # Auth utilities
│   │   └── index.ts       # Main server file
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.ts        # Database seeding
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smart-waste-manager.git
   cd smart-waste-manager
   ```

2. **Install Backend Dependencies**
   ```bash
   cd wte-backend
   npm install
   ```

3. **Setup Database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. **Start Backend Server**
   ```bash
   npm run dev
   # Server runs on http://localhost:4000
   ```

5. **Install Frontend Dependencies** (in new terminal)
   ```bash
   cd wte-frontend
   npm install
   ```

6. **Start Frontend Development Server**
   ```bash
   npm run dev
   # App runs on http://localhost:3000
   ```

## 🎯 Usage

### Worker Flow
1. Visit the worker form at `/worker`
2. Select your site (Cassava Processing or Livestock Processing)
3. Fill in waste details (type, quantity, contact info)
4. Submit the report
5. Receive confirmation of submission

### Admin Flow
1. Register a new admin account at `/register`
2. Login at `/login`
3. Access the dashboard at `/admin`
4. View all waste reports
5. Update collection status as needed

## 🔐 Default Admin Account

After seeding the database, you can use:
- **Email**: `admin@wte.com`
- **Password**: `admin123`

## 📊 Database Schema

### Sites
- Cassava Processing Site
- Livestock Processing Site

### Waste Reports
- Site association
- Waste type and quantity
- Contact information
- Collection status tracking
- Timestamps

### Admin Users
- Email and hashed password
- Account creation tracking

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based sessions
- **Password Hashing** - bcrypt for secure password storage
- **Protected Routes** - Admin-only access to sensitive data
- **Input Validation** - Client and server-side validation
- **CORS Configuration** - Proper cross-origin resource sharing

## 🎨 UI/UX Features

- **Responsive Design** - Works on desktop and mobile
- **Loading States** - Spinners and progress indicators
- **Error Handling** - Clear error messages and validation
- **Success Feedback** - Confirmation modals and messages
- **Intuitive Navigation** - Easy movement between sections

## 🔧 Development

### Available Scripts

**Backend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npx prisma studio` - Open database GUI

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📝 API Endpoints

### Public Endpoints
- `GET /api/sites` - Get available sites
- `POST /api/waste` - Submit waste report

### Protected Endpoints (Admin Only)
- `POST /api/auth/register` - Register admin
- `POST /api/auth/login` - Admin login
- `GET /api/waste` - Get all waste reports
- `PATCH /api/waste/:id/status` - Update waste status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for scalability and maintainability
- Focused on user experience and security

---

**Smart Waste Manager** - Making waste collection smarter, one report at a time! 🗑️✨