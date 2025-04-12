import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold">BFHL Store</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              BFHL Store makes healthcare preventive, affordable and accessible to all.
            </p>
            <div className="mt-6 flex space-x-4">
              {/* Social media icons would go here */}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm text-muted-foreground hover:text-foreground">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Viman Nagar, Pune, Maharastra, India
                </span>
              </li>
              <li className="flex items-start">
                <Globe className="mr-2 h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                 bajajfinservhealth.in
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Note</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              This is just a assignment project as part of my internship assignment not officially affiliated with BFHL
            </p>
          </div>
        </div>

        <div className="mt-12 border-t pt-6">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Made with ❤️ By Aryan - Full Stack @BFHL
          </p>
        </div>
      </div>
    </footer>
  );
}
