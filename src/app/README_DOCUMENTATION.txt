================================================================================
                    PUFFN E-COMMERCE WEBSITE DOCUMENTATION
                              QUICK START GUIDE
================================================================================

Welcome to the comprehensive documentation for the Puffn E-Commerce Website!

This guide will help you navigate all the documentation files and quickly find
the information you need.

================================================================================
DOCUMENTATION INDEX
================================================================================

📄 **WEBSITE_MASTER_DOCUMENTATION.txt**
   - Complete overview of the entire website
   - Architecture and technology stack
   - Directory structure
   - Core features summary
   - Integration points
   - Pending tasks and improvements
   - Quick reference to all other docs
   ⭐ START HERE for a high-level overview

📄 **HOME_PAGE_DOCUMENTATION.txt**
   - Homepage structure and components
   - Hero carousel, categories, featured products
   - Data flow and API integration
   - Brand story and marketing sections
   - User interactions and loading states

📄 **AUTHENTICATION_DOCUMENTATION.txt**
   - Complete OTP-based authentication system
   - Login flow (Phone & Email)
   - Registration process
   - AuthContext and token management
   - API endpoints and security features
   - Protected routes

📄 **PRODUCTS_DOCUMENTATION.txt**
   - Product listing page with filters
   - Product detail page components
   - Variant handling (colors, sizes)
   - Review system integration
   - Product data structure
   - Category mapping
   - Search and pagination

📄 **CART_CHECKOUT_DOCUMENTATION.txt**
   - 3-step checkout process
   - Shopping cart management
   - Coupon system
   - Address management
   - Payment options
   - Order creation flow
   - CartContext usage

📄 **USER_ACCOUNT_DOCUMENTATION.txt**
   - Profile page and account management
   - Order history and tracking
   - Wishlist functionality
   - Address book management
   - API endpoints for user features

📄 **SHARED_COMPONENTS_DOCUMENTATION.txt**
   - Layout and providers (AuthContext, CartContext, WishlistContext)
   - Header and Footer components
   - API services (authService, productService, cartService, etc.)
   - Utility functions
   - Animation components
   - Type definitions
   - Error handling standards
   - Performance and security best practices

📄 **STATIC_PAGES_DOCUMENTATION.txt**
   - About Us page
   - Contact Us page
   - FAQ page
   - Privacy Policy page
   - Terms of Service page
   - Collections page
   - Content management strategy

================================================================================
QUICK NAVIGATION BY TASK
================================================================================

🔍 **I want to understand...**

...how authentication works
   → AUTHENTICATION_DOCUMENTATION.txt

...how products are displayed and filtered
   → PRODUCTS_DOCUMENTATION.txt

...how the shopping cart works
   → CART_CHECKOUT_DOCUMENTATION.txt

...how global state is managed
   → SHARED_COMPONENTS_DOCUMENTATION.txt (Contexts section)

...how API calls are made
   → SHARED_COMPONENTS_DOCUMENTATION.txt (API Services section)

...the overall structure
   → WEBSITE_MASTER_DOCUMENTATION.txt

...user profile features
   → USER_ACCOUNT_DOCUMENTATION.txt

...static pages (About, Contact, FAQ)
   → STATIC_PAGES_DOCUMENTATION.txt

================================================================================
QUICK NAVIGATION BY FILE
================================================================================

📁 **If you're working on a specific file...**

layout.tsx
   → SHARED_COMPONENTS_DOCUMENTATION.txt (Layout section)

page.tsx (homepage)
   → HOME_PAGE_DOCUMENTATION.txt

auth/login-new/
   → AUTHENTICATION_DOCUMENTATION.txt

products/page.tsx or products/[id]/page.tsx
   → PRODUCTS_DOCUMENTATION.txt

cart/page.tsx
   → CART_CHECKOUT_DOCUMENTATION.txt

profile/page.tsx, orders/page.tsx, wishlist/page.tsx
   → USER_ACCOUNT_DOCUMENTATION.txt

contexts/*.tsx
   → SHARED_COMPONENTS_DOCUMENTATION.txt (Contexts section)

services/*.ts
   → SHARED_COMPONENTS_DOCUMENTATION.txt (API Services section)

components/NewHeader.tsx or NewFooter.tsx
   → SHARED_COMPONENTS_DOCUMENTATION.txt (Components section)

aboutus/, contactus/, faq/, privacy/, terms-of-services/
   → STATIC_PAGES_DOCUMENTATION.txt

================================================================================
WEBSITE STRUCTURE AT A GLANCE
================================================================================

/website
├── page.tsx                    → HOME_PAGE_DOCUMENTATION.txt
├── layout.tsx                  → SHARED_COMPONENTS_DOCUMENTATION.txt
│
├── auth/                       → AUTHENTICATION_DOCUMENTATION.txt
│   ├── login-new/
│   ├── register/
│   └── otp/
│
├── products/                   → PRODUCTS_DOCUMENTATION.txt
│   ├── page.tsx
│   └── [id]/page.tsx
│
├── cart/                       → CART_CHECKOUT_DOCUMENTATION.txt
│
├── profile/                    → USER_ACCOUNT_DOCUMENTATION.txt
├── orders/                     → USER_ACCOUNT_DOCUMENTATION.txt
├── wishlist/                   → USER_ACCOUNT_DOCUMENTATION.txt
│
├── collections/                → STATIC_PAGES_DOCUMENTATION.txt
├── aboutus/                    → STATIC_PAGES_DOCUMENTATION.txt
├── contactus/                  → STATIC_PAGES_DOCUMENTATION.txt
├── faq/                        → STATIC_PAGES_DOCUMENTATION.txt
├── privacy/                    → STATIC_PAGES_DOCUMENTATION.txt
├── terms-of-services/          → STATIC_PAGES_DOCUMENTATION.txt
│
├── components/                 → SHARED_COMPONENTS_DOCUMENTATION.txt
├── contexts/                   → SHARED_COMPONENTS_DOCUMENTATION.txt
├── services/                   → SHARED_COMPONENTS_DOCUMENTATION.txt
├── utils/                      → SHARED_COMPONENTS_DOCUMENTATION.txt
├── constants/                  → SHARED_COMPONENTS_DOCUMENTATION.txt
└── styles/                     → SHARED_COMPONENTS_DOCUMENTATION.txt

================================================================================
KEY CONCEPTS TO UNDERSTAND
================================================================================

1. **AUTHENTICATION FLOW:**
   - OTP-based (Phone/Email)
   - JWT token storage
   - AuthContext for global state
   → See: AUTHENTICATION_DOCUMENTATION.txt

2. **GLOBAL STATE MANAGEMENT:**
   - AuthContext (user session)
   - CartContext (shopping cart)
   - WishlistContext (saved items)
   → See: SHARED_COMPONENTS_DOCUMENTATION.txt

3. **API INTEGRATION:**
   - Centralized in services/ folder
   - Each service handles specific domain
   - Uses apiRequest helper
   → See: SHARED_COMPONENTS_DOCUMENTATION.txt

4. **COMPONENT HIERARCHY:**
   - layout.tsx wraps all pages
   - Providers at root level
   - Header/Footer on all pages
   → See: SHARED_COMPONENTS_DOCUMENTATION.txt

5. **CHECKOUT PROCESS:**
   - 3 steps: Bag → Address → Payment
   - Coupon application
   - Address management
   → See: CART_CHECKOUT_DOCUMENTATION.txt

6. **PRODUCT VARIANTS:**
   - Color-based variants
   - Size selection per variant
   - Stock management
   → See: PRODUCTS_DOCUMENTATION.txt

================================================================================
COMMON TASKS & WHERE TO FIND INFO
================================================================================

**Adding a new page:**
   1. Create page.tsx in appropriate folder
   2. Check layout.tsx wraps it (automatic in /website)
   3. Add navigation link in Header
   → See: SHARED_COMPONENTS_DOCUMENTATION.txt

**Making an API call:**
   1. Check if service exists in services/ folder
   2. If not, create new service file
   3. Use apiRequest helper
   4. Handle auth with createAuthHeaders
   → See: SHARED_COMPONENTS_DOCUMENTATION.txt (API Services)

**Adding to cart:**
   1. Use useCart() hook
   2. Call addToCart({ productId, quantity, size, color })
   3. Context handles API call and state update
   → See: CART_CHECKOUT_DOCUMENTATION.txt

**Protecting a route:**
   1. Use useAuth() hook
   2. Check isAuthenticated
   3. Redirect to login if false
   → See: AUTHENTICATION_DOCUMENTATION.txt

**Displaying product data:**
   1. Fetch from productService
   2. Normalize with normalizeProductData
   3. Fetch review stats if needed
   → See: PRODUCTS_DOCUMENTATION.txt

**Styling a component:**
   1. Create [component].module.scss
   2. Import styles in component
   3. Use Bootstrap utilities where possible
   → See: SHARED_COMPONENTS_DOCUMENTATION.txt (Styling)

================================================================================
PENDING FEATURES & IMPROVEMENTS
================================================================================

For a complete list of pending tasks and improvements, see each documentation
file's "PENDING FEATURES" or "PENDING TASKS" section.

Major areas needing work:
- Payment gateway integration
- Shiprocket order tracking
- Profile update API
- Product search functionality
- Advanced filtering
- Write reviews feature
- Email notifications
- Performance optimizations
- Testing (unit, integration, E2E)

See WEBSITE_MASTER_DOCUMENTATION.txt for comprehensive list.

================================================================================
GETTING HELP
================================================================================

**Documentation not clear?**
- Each doc file has detailed explanations
- Check "Related Files" section for cross-references
- Look at actual code alongside documentation

**Need to understand a specific feature?**
- Use "Quick Navigation by Task" above
- Each doc has detailed function descriptions
- API endpoints are documented with examples

**Want to add a new feature?**
- Check existing similar features first
- Follow established patterns in codebase
- Update documentation after implementation

================================================================================
DOCUMENTATION MAINTENANCE
================================================================================

**When to update documentation:**
- After adding new features
- After refactoring major components
- When API endpoints change
- When fixing bugs that clarify behavior
- When adding new pages or routes

**How to update:**
- Edit the relevant .txt file
- Keep formatting consistent
- Add to "Pending Features" if incomplete
- Update WEBSITE_MASTER_DOCUMENTATION.txt if structure changes

================================================================================
TECHNOLOGY STACK QUICK REFERENCE
================================================================================

Frontend:
  - Next.js 14 (App Router)
  - React 18
  - TypeScript
  - React Bootstrap
  - SCSS Modules

State Management:
  - React Context API
  - Custom hooks

API:
  - RESTful API
  - JWT authentication
  - Fetch API

Utilities:
  - React Toastify (notifications)
  - React Icons (Feather Icons)

Backend:
  - Node.js + Express
  - MongoDB
  - See server/ folder for backend docs

================================================================================
FILE LOCATIONS
================================================================================

All documentation files are located in:
  /frontend/src/app/website/

Main files:
  - README_DOCUMENTATION.txt (this file)
  - WEBSITE_MASTER_DOCUMENTATION.txt
  - HOME_PAGE_DOCUMENTATION.txt
  - AUTHENTICATION_DOCUMENTATION.txt
  - PRODUCTS_DOCUMENTATION.txt
  - CART_CHECKOUT_DOCUMENTATION.txt
  - USER_ACCOUNT_DOCUMENTATION.txt
  - SHARED_COMPONENTS_DOCUMENTATION.txt
  - STATIC_PAGES_DOCUMENTATION.txt

================================================================================
SUPPORT & CONTACT
================================================================================

For questions or clarifications about this documentation, please:
1. Review the relevant documentation file thoroughly
2. Check the actual code implementation
3. Consult with the development team

Happy coding! 🚀

================================================================================
END OF README DOCUMENTATION
================================================================================
