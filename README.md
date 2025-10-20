# Uni Food

A web-based food ordering system designed to streamline the cafeteria experience at universities by allowing students to order food in advance and pick it up when ready.

## Problem

University students currently face significant challenges when trying to get food from the cafeteria:

- Long waiting times: Students must physically queue at the cafeteria to place orders, leading to extended wait times during peak hours
- Time inefficiency: The entire process of ordering and waiting wastes valuable time between classes
- Unpredictable service: Students have no visibility into order preparation time or current cafeteria load
- Poor planning: Students cannot plan their schedules effectively without knowing how long their food will take

These issues result in frustrated students, overcrowded cafeterias, and inefficient use of limited break times between classes.

## Target Users

### Primary Users: Students

University students who want to:

- Order food in advance to minimize waiting time
- Browse the cafeteria menu from anywhere on campus
- Track their order status in real-time
- Manage their meal preferences and order history

### Secondary Users: Cafeteria Staff

University cafeteria employees who need to:

- Efficiently manage incoming orders
- Update order statuses and preparation times
- Control menu availability in real-time
- Track order fulfillment and kitchen workflow

## Success Criteria

The Uni Food system will be considered successful when it achieves:

1. Reduced Waiting Time: Students can place orders remotely and only visit the cafeteria when their food is ready, eliminating queue time

2. System Adoption: A significant portion of students prefer using the web app over traditional ordering within the first month of use

3. Accurate Order Updates: Students can track their order status in real-time and know when their orders are ready for pickup

4. Order Management: Orders are correctly identified at pickup using order IDs with minimal confusion

5. Load Handling: The system remains stable and responsive during peak lunch hours without crashing or significant slowdowns

## User Stories

### For Students

1. As a student, I want to browse the cafeteria menu from my classroom or anywhere on campus, so that I can decide what to order before heading to the cafeteria.

2. As a student, I want to see estimated preparation times when I place my order, so that I can plan when to pick up my food and avoid unnecessary waiting.

3. As a student, I want to see my order status update in real-time, so that I know when my order is ready and can arrive at the cafeteria at the right time to collect my food.

4. As a student, I want to search for specific food items using keywords, so that I can quickly find what I'm craving without scrolling through the entire menu.

5. As a student, I want to view my order history and reorder previous meals, so that I can quickly order my favorite items without searching again.

6. As a student, I want to modify my cart by adjusting quantities or removing items, so that I can change my mind before finalizing the order.

7. As a student, I want to customize my order with extra ingredients on the food details page, so that I can personalize my meal to my preferences.

### For Cafeteria Staff

8. As a cafeteria staff member, I want to view all incoming orders, so that I can efficiently manage the kitchen workflow and prioritize order preparation.

9. As a cafeteria staff member, I want to mark menu items as unavailable in real-time, so that students cannot order items that are out of stock or no longer available today.

10. As a cafeteria staff member, I want to update order statuses when they're ready, so that students can see the status change and collect their food promptly.

## Non-Goals

This project explicitly does not aim to:

- Online Payment Integration: Payment is handled in cash at pickup; no digital payment processing, credit card integration, or mobile wallets
- Delivery Service: No food delivery to dorms or classrooms; all orders are pickup-only at the cafeteria
- Table Reservations: No seating management or table reservation features
- Loyalty Programs: No points, rewards, or gamification features in the initial version
- Nutrition Tracking: No calorie counting, nutritional information display, or dietary tracking features
- Social Features: No user reviews, ratings, comments, or social sharing capabilities
- Third-party Cafeterias: System is exclusive to the university's official cafeteria; no integration with external restaurants or food vendors
- Multi-language Support: English-only interface in the initial release
- Mobile Native Apps: Web-only application; no iOS or Android native applications
- Advanced Analytics: No detailed reporting, sales analytics, or business intelligence features beyond basic order tracking

---

## Tech Stack

- Backend: Python, Django, Django REST Framework, Django Channels
- Frontend: Vue.js, TypeScript, Tailwind CSS, Vite
- Database: MySQL
- Design: Figma

## Team

- Bahadin Ali
- Ali abdulkhalq
- Blnd Ismael
- Sama Murtadha
- Gona Hoshyar

Supervised by: Dr. Polla Fatah
