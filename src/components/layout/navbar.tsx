// components/navbar/Navbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  Heart,
  Package,
  LogOut,
  Settings,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface Category {
  id: string;
  name: string;
  href: string;
  subcategories?: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  href: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  time: string;
}

interface NavbarProps {
  user?: UserData | null;
  cartItems?: CartItem[];
  notifications?: Notification[];
  categories?: Category[];
}

const Navbar: React.FC<NavbarProps> = ({
  user = null,
  cartItems = [],
  notifications = [],
  categories = [],
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState<string | null>(
    null,
  );
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen && !(event.target as Element).closest(".user-menu")) {
        setIsUserMenuOpen(false);
      }
      if (
        isNotificationMenuOpen &&
        !(event.target as Element).closest(".notification-menu")
      ) {
        setIsNotificationMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserMenuOpen, isNotificationMenuOpen]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  // Calculate cart total and count
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const cartItemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0,
  );
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  // Sample categories if none provided
  const defaultCategories: Category[] = [
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
        { id: "audio", name: "Audio", href: "/category/electronics/audio" },
      ],
    },
    {
      id: "fashion",
      name: "Fashion",
      href: "/category/fashion",
      subcategories: [
        { id: "mens", name: "Men's", href: "/category/fashion/mens" },
        { id: "womens", name: "Women's", href: "/category/fashion/womens" },
        {
          id: "accessories",
          name: "Accessories",
          href: "/category/fashion/accessories",
        },
      ],
    },
    {
      id: "home",
      name: "Home & Garden",
      href: "/category/home",
      subcategories: [
        {
          id: "furniture",
          name: "Furniture",
          href: "/category/home/furniture",
        },
        { id: "decor", name: "Decor", href: "/category/home/decor" },
        { id: "kitchen", name: "Kitchen", href: "/category/home/kitchen" },
      ],
    },
  ];

  const displayCategories =
    categories.length > 0 ? categories : defaultCategories;

  // Navigation links
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Deals", href: "/deals" },
    { name: "New Arrivals", href: "/new-arrivals" },
  ];

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 bg-white",
          isScrolled ? "shadow-lg backdrop-blur-sm bg-white/95" : "border-b",
        )}
      >
        {/* Top Announcement Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 py-1.5">
            <div className="flex items-center justify-between text-sm">
              <p className="text-center flex-1">
                🎉 Free shipping on orders over $50 | Shop now!
              </p>
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/track-order" className="hover:underline">
                  Track Order
                </Link>
                <Link href="/help" className="hover:underline">
                  Help Center
                </Link>
                <div className="flex items-center space-x-2">
                  <span>🇺🇸</span>
                  <span>USD</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          {/* Main Navbar */}
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                ShopEase
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-blue-600",
                    pathname === link.href ? "text-blue-600" : "text-gray-700",
                  )}
                >
                  {link.name}
                </Link>
              ))}

              {/* Categories Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setIsCategoryMenuOpen("categories")}
                onMouseLeave={() => setIsCategoryMenuOpen(null)}
              >
                <button className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                  Categories
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>

                {/* Mega Menu */}
                <div
                  className={cn(
                    "absolute left-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border transition-all duration-200 p-6",
                    isCategoryMenuOpen === "categories"
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2",
                  )}
                >
                  <div className="grid grid-cols-2 gap-6">
                    {displayCategories.map((category) => (
                      <div key={category.id}>
                        <Link
                          href={category.href}
                          className="font-semibold text-gray-900 hover:text-blue-600 mb-3 block"
                        >
                          {category.name}
                        </Link>
                        <div className="space-y-2">
                          {category.subcategories?.map((sub) => (
                            <Link
                              key={sub.id}
                              href={sub.href}
                              className="block text-sm text-gray-600 hover:text-blue-600 hover:pl-2 transition-all"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t">
                    <Link
                      href="/all-categories"
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                    >
                      Browse all categories
                      <ChevronDown className="ml-2 h-4 w-4 rotate-270" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands, and categories..."
                  className="w-full px-4 py-2.5 pl-12 pr-24 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative notification-menu">
                <button
                  onClick={() =>
                    setIsNotificationMenuOpen(!isNotificationMenuOpen)
                  }
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-700 relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications > 9 ? "9+" : unreadNotifications}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border py-2 z-50">
                    <div className="px-4 py-3 border-b">
                      <h3 className="font-semibold text-gray-900">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={cn(
                              "px-4 py-3 hover:bg-gray-50 border-b last:border-b-0",
                              !notification.read && "bg-blue-50",
                            )}
                          >
                            <p className="font-medium text-sm text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <span className="text-xs text-gray-500 mt-2 block">
                              {notification.time}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center text-gray-500">
                          No notifications
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-3 border-t">
                      <Link
                        href="/notifications"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        onClick={() => setIsNotificationMenuOpen(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="hidden sm:flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100 text-gray-700"
              >
                <Heart className="h-5 w-5" />
                <span className="text-sm font-medium">Wishlist</span>
              </Link>

              {/* Cart */}
              <div className="relative">
                <Link
                  href="/cart"
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 text-gray-700 relative"
                >
                  <div className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {cartItemCount > 99 ? "99+" : cartItemCount}
                      </span>
                    )}
                  </div>
                  <div className="hidden lg:block text-left">
                    <span className="text-sm font-medium">Cart</span>
                    {cartTotal > 0 && (
                      <span className="block text-xs text-gray-500 font-medium">
                        ${cartTotal.toFixed(2)}
                      </span>
                    )}
                  </div>
                </Link>
              </div>

              {/* User Menu */}
              <div className="relative user-menu">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100"
                >
                  {user ? (
                    <>
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-8 w-8 rounded-full border"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="hidden lg:inline text-sm font-medium text-gray-700">
                        {user.name.split(" ")[0]}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <span className="hidden lg:inline text-sm font-medium text-gray-700">
                        Account
                      </span>
                    </>
                  )}
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border py-2 z-50">
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b">
                          <p className="font-semibold text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                        <div className="py-2">
                          <Link
                            href="/account"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <User className="h-4 w-4 mr-3" />
                            My Account
                          </Link>
                          <Link
                            href="/orders"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Package className="h-4 w-4 mr-3" />
                            My Orders
                          </Link>
                          <Link
                            href="/wishlist"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Heart className="h-4 w-4 mr-3" />
                            Wishlist
                          </Link>
                          <Link
                            href="/settings"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings className="h-4 w-4 mr-3" />
                            Settings
                          </Link>
                        </div>
                        <div className="border-t py-2">
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              router.push("/logout");
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <LogOut className="h-4 w-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="py-2">
                          <Link
                            href="/login"
                            className="flex items-center justify-center px-4 py-2.5 mx-3 my-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Sign In
                          </Link>
                          <p className="text-center text-sm text-gray-500 px-4 py-2">
                            New customer?{" "}
                            <Link
                              href="/register"
                              className="text-blue-600 hover:text-blue-700 font-medium"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              Start here
                            </Link>
                          </p>
                        </div>
                        <div className="border-t pt-2">
                          <Link
                            href="/account"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            My Account
                          </Link>
                          <Link
                            href="/orders"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Orders
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto">
            <div className="p-6">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </form>

              {/* Mobile Navigation */}
              <div className="space-y-1 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 px-2">
                  Navigation
                </h3>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50",
                      pathname === link.href && "bg-blue-50 text-blue-600",
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Categories */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 px-2">
                  Categories
                </h3>
                <div className="space-y-1">
                  {displayCategories.map((category) => (
                    <div
                      key={category.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setIsCategoryMenuOpen(
                            isCategoryMenuOpen === category.id
                              ? null
                              : category.id,
                          )
                        }
                        className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-gray-50"
                      >
                        <span className="font-medium">{category.name}</span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            isCategoryMenuOpen === category.id && "rotate-180",
                          )}
                        />
                      </button>

                      {isCategoryMenuOpen === category.id &&
                        category.subcategories && (
                          <div className="bg-gray-50 px-4 py-2 space-y-2">
                            {category.subcategories.map((sub) => (
                              <Link
                                key={sub.id}
                                href={sub.href}
                                className="block py-2 text-sm text-gray-600 hover:text-blue-600 pl-4"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile User Links */}
              <div className="border-t pt-6">
                {user ? (
                  <>
                    <div className="flex items-center space-x-3 mb-4 px-2">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Link
                        href="/account"
                        className="flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-3" />
                        My Account
                      </Link>
                      <Link
                        href="/orders"
                        className="flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Package className="h-4 w-4 mr-3" />
                        My Orders
                      </Link>
                      <Link
                        href="/wishlist"
                        className="flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Heart className="h-4 w-4 mr-3" />
                        Wishlist
                      </Link>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          router.push("/logout");
                        }}
                        className="flex items-center w-full px-3 py-3 rounded-lg text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      className="block text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <p className="text-center text-sm text-gray-500">
                      Don't have an account?{" "}
                      <Link
                        href="/register"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign up
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
