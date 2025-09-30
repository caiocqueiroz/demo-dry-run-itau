---
mode: 'agent'
description: 'Complete Demo: Banking Frontend Dashboard with Agent Mode'
tools: ['changes', 'codebase', 'editFiles', 'fetch', 'findTestFiles', 'githubRepo', 'openSimpleBrowser', 'problems', 'runCommands', 'runTasks', 'search', 'terminalLastCommand', 'testFailure', 'usages', 'playwright', 'github']
---

# Demo: Banking Frontend Dashboard Implementation

## Context
This is a demo for GitHub Copilot Agent Mode capabilities. You are working with the Banking API Node.js System - a complete banking application with Express.js API backend and a professional frontend dashboard.

## Current State
- The application has a complete REST API running on Node.js with Express
- API endpoints for clients, accounts, and balance management are fully functional
- There is NO frontend interface implemented yet
- Users can only interact via curl commands, Postman, or Insomnia
- The API is running on http://localhost:3000

## Demo Goal
Implement a complete Banking Frontend Dashboard including:
1. A professional HTML5/JavaScript interface for banking operations
2. Client registration and management forms with CPF validation
3. Account creation interface (checking and savings accounts)
4. Real-time balance checking and account management
5. Dashboard with banking metrics and charts
6. Integration with all existing API endpoints

## Design Reference
Create a clean, professional banking interface that includes:
- A modern, responsive dashboard layout with banking industry standards
- Client management forms and data tables
- Account overview with balance information and transaction capabilities
- Real-time metrics dashboard with charts
- Consistent styling with professional banking design
- Dark/light theme support for user preference

## Technical Requirements

### Frontend Architecture and Technology Stack
- **Technology**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Styling**: CSS Grid/Flexbox with modern design principles
- **Charts**: Chart.js for banking data visualization
- **HTTP Client**: Fetch API for REST API communication
- **State Management**: LocalStorage for session persistence
- **Validation**: Client-side CPF validation with Brazilian standards

### API Integration Endpoints
Base URL: `http://localhost:3000`

**Available Endpoints:**
- `GET /health` - API health check
- `POST /api/clientes` - Create new client
- `GET /api/clientes` - List all clients
- `GET /api/clientes/:cpf` - Get client by CPF
- `PUT /api/clientes/:cpf` - Update client information
- `POST /api/contas` - Create new account
- `GET /api/contas/numero/:numero` - Get account by number
- `GET /api/contas/saldo/:numero` - Check account balance
- `GET /api/contas/cliente/:cpf` - Get all accounts for a client

### Implementation Specifications
1. **Dashboard Layout**: Create responsive main banking dashboard
2. **Client Management**: Registration forms with Brazilian CPF validation
3. **Account Management**: Interface for creating checking/savings accounts
4. **Balance Checker**: Real-time balance consultation interface
5. **Integration**: Connect with all existing API endpoints

### Key Features to Implement
- Professional banking dashboard with metrics
- Client registration with full CPF algorithm validation
- Account creation for checking ("corrente") and savings ("poupança")
- Real-time balance checking interface
- Client and account management tables
- Banking metrics charts (total clients, accounts, balances)
- Form validation with Brazilian standards (CPF, phone, email)
- Responsive design for desktop and mobile

## File Structure
Create the following frontend structure:
```
frontend/
├── index.html                 # Main banking dashboard
├── css/
│   ├── main.css              # Main dashboard styles
│   ├── components.css        # Reusable component styles
│   ├── forms.css             # Form styling
│   └── themes.css            # Light/dark theme management
├── js/
│   ├── app.js                # Main application logic
│   ├── api.js                # API communication layer
│   ├── components.js         # UI components (tables, forms)
│   ├── validation.js         # CPF and form validation
│   ├── charts.js             # Chart.js banking metrics
│   └── utils.js              # Utility functions
├── assets/
│   ├── icons/                # Banking icons
│   └── images/               # Logo and images
└── pages/
    ├── clients.html          # Client management page
    ├── accounts.html         # Account management page
    └── dashboard.html        # Analytics dashboard
```

## Success Criteria
After implementation, users should be able to:
1. Access a professional banking dashboard interface
2. Register new clients with complete CPF validation
3. Create checking and savings accounts for existing clients
4. Check account balances in real-time
5. View comprehensive lists of clients and accounts
6. See banking metrics with charts and statistics
7. Navigate between different banking sections
8. Use the interface seamlessly on desktop and mobile

## Implementation Instructions
1. Analyze the existing API structure and endpoints
2. Create base HTML layout for banking dashboard
3. Implement JavaScript API client for communication
4. Build client registration and account creation forms
5. Add CPF validation with full Brazilian algorithm
6. Create dashboard with banking metrics and charts
7. Style interface with professional banking design
8. Test complete banking workflow functionality

## Notes
- Use semantic HTML5 for accessibility compliance
- Implement comprehensive Brazilian CPF validation
- Handle edge cases (empty states, network errors, loading states)
- Ensure cross-browser compatibility
- Follow web security best practices for banking applications
- All interface text should be in Portuguese
- Use professional banking color scheme and typography

## Brazilian Banking Standards
- **CPF Validation**: Complete algorithm validation with proper formatting
- **Currency Display**: Brazilian Real (R$) with proper formatting
- **Date Format**: DD/MM/YYYY Brazilian standard format
- **Account Types**: "Conta Corrente" and "Conta Poupança"
- **Language**: All interface text in Portuguese

Begin implementation by analyzing the current API structure and endpoints, then proceed with building a modern, professional banking frontend that integrates seamlessly with the existing Node.js backend.