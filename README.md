# BUTTER THEORY 🍪

### Premium Online Bakery & Cloud Kitchen Storefront

**BUTTER THEORY** is a modern, frontend-driven online bakery storefront designed to bring the experience of discovering, customizing, and shopping for handcrafted bakery treats to a digital platform.

The project focuses on combining an engaging user experience with practical e-commerce functionality. Customers can explore a curated catalogue of bakery products, discover different categories, customize their own treat boxes, manage their shopping cart, and complete a guest checkout experience.

The platform features a distinctive visual identity with warm butter-inspired colours, playful typography, expressive product imagery, and a responsive interface designed to make online bakery shopping feel enjoyable and intuitive.

---

## About the Project

BUTTER THEORY was developed as a customer-facing digital storefront for a fictional premium bakery and cloud kitchen.

The idea behind the project was to build more than a static product website. It was designed to demonstrate how a modern e-commerce storefront works from the customer's perspective, including product discovery, dynamic cart management, custom product selection, pricing calculations, checkout validation, and order confirmation.

A key feature of the application is **Build Your Own Box**, which allows customers to create personalized treat boxes by selecting products according to different box sizes and selection limits.

The application handles its core interactions and business logic directly in the browser, using React state and Local Storage for persistence.

## Key Features & Functionality

### 1. Product Catalogue

- Explore a collection of bakery products across 8 categories.
- Browse 38 individual products.
- View product information, pricing, ingredients, and relevant details.
- Discover products through category-based navigation.
- Search and filter products.
- Sort products for easier browsing.

### 2. Product Details

- Individual product information and presentation.
- Product pricing and descriptions.
- Ingredient and allergen information where available.
- Interactive quantity selection.
- Add products directly to the shopping bag.

### 3. Build Your Own Box

An interactive customization feature that allows customers to create their own assortment of bakery treats.

- Choose between Little, Happy, and Party box sizes.
- Select individual treats to customize the box.
- View the number of selected items.
- Apply box capacity and product selection restrictions.
- Automatically calculate box pricing and applicable discounts.

### 4. Shopping Cart

- Add products to the shopping bag.
- Increase or decrease product quantities.
- Remove products from the cart.
- Automatically update subtotal and total amounts.
- Calculate applicable discounts and delivery charges.
- Apply free-delivery eligibility based on the cart value.
- Persist cart information using Local Storage.

### 5. Checkout & Order Confirmation

- Guest checkout without requiring customer registration.
- Customer and delivery information collection.
- Form validation.
- Order summary and price calculations.
- Generate a unique order reference.
- Display an order confirmation after successful checkout.
- Store locally recorded order information in the browser.

### 6. Responsive User Interface

- Responsive layouts for desktop and mobile screens.
- Interactive navigation and interface elements.
- Consistent visual styling across the application.
- Product-focused layouts and animations.
- Smooth interactions and transitions.

---

## Technology Stack

The project is built using modern frontend technologies and libraries.

| Technology              | Usage                                           |
| ----------------------- | ----------------------------------------------- |
| React 19                | Component-based user interface development      |
| JavaScript / TypeScript | Application logic and configuration             |
| Vite 8                  | Development server and production build tooling |
| Tailwind CSS 4          | Utility-first styling and responsive layouts    |
| React Router 7          | Client-side routing and navigation              |
| Lucide React            | Icons and interface elements                    |
| Motion                  | Animations and interactive transitions          |
| HTML5                   | Application structure                           |
| CSS3                    | Styling and visual presentation                 |
| Local Storage API       | Client-side cart and order persistence          |
| npm                     | Package and dependency management               |
| Git & GitHub            | Version control and project hosting             |

## ⚙️ Technical Implementation

### Component-Based Architecture

The application uses React to organize the interface into reusable components. This makes it easier to maintain the storefront, manage individual sections, and build interactive customer experiences.

### State Management

React state is used to manage interactive application behaviour, including:

- Product selection.
- Shopping cart updates.
- Quantity changes.
- Custom box selections.
- Checkout information.
- Order confirmation states.

### Dynamic Pricing & Business Logic

The application includes client-side calculations for:

- Product quantities and pricing.
- Custom box pricing.
- Applicable discounts.
- Cart subtotals.
- Delivery charges.
- Free-delivery eligibility.
- Final checkout totals.

### Browser-Based Persistence

Local Storage is used to retain shopping cart information and locally recorded orders across browser sessions.

### Routing

React Router handles navigation between the customer-facing pages and storefront sections.

### Responsive Styling

Tailwind CSS is used to create responsive layouts and maintain consistent styling throughout the application.

---

## Tools & Development Environment

- **Visual Studio Code** – Code editing and local development.
- **Node.js** – JavaScript runtime environment.
- **npm** – Dependency installation and package management.
- **GitHub** – Source code hosting and version control.
- **Vercel** – Intended deployment platform.

---

## Design Philosophy & Brand Identity

The visual direction of BUTTER THEORY combines a premium bakery aesthetic with a playful, contemporary editorial style.

**Design characteristics:**

- Butter-inspired warm colour palette.
- Butter cream, butter yellow, cherry red, cobalt blue, soft pink, and chocolate brown.
- Expressive typography and carefully arranged product imagery.
- Playful graphic elements and subtle animations.
- Clean layouts with a strong emphasis on product presentation.
- Responsive and intuitive customer interactions.

The objective is to create a recognizable bakery brand identity while keeping the shopping experience simple, engaging, and accessible.

---

## Live Demo

Explore BUTTER THEORY: https://butter-theory.netlify.app/

---

## Author
**Madiha S.**

Aspiring AI/ML Engineer | Interested in Frontend Development, Python Backend Development, and Software Development.

---

## License

This project is developed for portfolio and educational purposes. Please check the repository's licensing and third-party asset attributions before reusing any part of the project.

---

**BUTTER THEORY** 🍪

A digital bakery experience built with creativity, thoughtful design, and modern frontend technologies.
