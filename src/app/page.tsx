// app/page.tsx
import Navbar from "../components/layout/navbar";

export default function HomePage() {
  // In a real app, this data would come from your state management or API
  const user = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  };

  const cartItems = [
    {
      id: "1",
      name: "Wireless Headphones",
      price: 129.99,
      quantity: 1,
      image: "/headphones.jpg",
    },
    {
      id: "2",
      name: "Smart Watch",
      price: 299.99,
      quantity: 1,
      image: "/watch.jpg",
    },
  ];

  const notifications = [
    {
      id: "1",
      title: "Order Shipped",
      message: "Your order #12345 has been shipped",
      read: false,
      time: "2 hours ago",
    },
    {
      id: "2",
      title: "Flash Sale",
      message: "50% off on electronics. Limited time offer!",
      read: true,
      time: "1 day ago",
    },
  ];

  const categories = [
    {
      id: "electronics",
      name: "Electronics",
      href: "/category/electronics",
      subcategories: [
        { id: "phones", name: "Phones", href: "/category/electronics/phones" },
        {
          id: "laptops",
          name: "Laptops",
          href: "/category/electronics/laptops",
        },
      ],
    },
    // Add more categories as needed
  ];

  return (
    <>
      <Navbar
        user={user}
        cartItems={cartItems}
        notifications={notifications}
        categories={categories}
      />
      <main>{/* Your page content */}</main>
    </>
  );
}
