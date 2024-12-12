# Frontend for ESL Management System

This repository contains the frontend and backend of the **Electronic Shelf
Label (ESL) Management System**, designed to help retail managers efficiently
manage ESLs across their stores. Built with React and React Query, the frontend
provides an intuitive interface for viewing, editing, and updating product
information while seamlessly integrating with the backend server and message
broker architecture.

---

## **Purpose**

The frontend serves as the primary user interface for the ESL Management System.
Its purpose is to allow retail managers to:

1. **View Products**: Browse a list of all products, with features like
   filtering by category, searching by title, and sorting by attributes such as
   price and quantity.
2. **Manage Data**: Update product details like name, category, description, and
   price with immediate feedback via optimistic updates.
3. **Track ESL Updates**: Monitor the status of electronic shelf labels to
   ensure they display the latest information.
4. **Real-Time Feedback**: Provide responsive notifications, such as success
   messages, in response to user actions like updates or deletions.

The frontend acts as the user-friendly layer for interacting with the backend
services, ensuring an efficient and seamless experience for users.

---

## **Features**

### **Product Management**

- **Dynamic Table View**: Display all product details in a responsive table.
- **Search & Filter**: Quickly locate products by using advanced search and
  category filters.
- **Edit & Update**: Edit product attributes directly from the UI with
  optimistic updates for instant feedback.

### **Notifications**

- **Toast Alerts**: Notify users of successful operations like updates,
  deletions, and errors.
- **Real-Time Updates**: Inform users about the status of ESL updates via
  asynchronous server communication.

### **Integration with Backend**

- **React Query for Data Fetching**: Manage data fetching and caching with
  automatic synchronization to ensure data is always up-to-date.
- **API Communication**: Interact with the backend server to send and receive
  product and label data.

---

## **Technologies Used**

### **Frontend Stack**

- **React**: For building the user interface.
- **React Query**: For managing server state and caching API requests.
- **CSS**: For designing the responsive and modern user interface.
- **Fetch API**: For communicating with the backend.
- **Toastify**: For displaying notifications.

---

## **Installation and Setup**

### **Prerequisites**

- Node.js (version 14 or higher)
- npm or yarn
