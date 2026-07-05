// components/Footer.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ContentContainer from '@/components/common-ui/containers/ContentContainer';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Target } from "lucide-react";
import { serviceData } from "@/data/service/service";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/about", label: "About Us" },
    { href: "/servicePage", label: "Services" },
    { href: "/blogs", label: "Blogs" },
    { href: "/contact", label: "Contact" },

  ];



  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/saidentalclinic1/", label: "Facebook"},
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "https://www.instagram.com/sai.dental_clinic/", label: "Instagram" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <ContentContainer className="py-12 px-4 sm:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Clinic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <h3 className="text-2xl font-bold text-white mb-4">SAI Dental Clinic</h3>
            <p className="text-gray-300 mb-4">
              Your smile, our passion. Providing exceptional dental care for over 4 years.
            </p>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-blue-400" />
                <span>Kenikarai, Thiruvarur Main Road, Mayiladuthurai - 609001</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-blue-400" />
                <span>Needur Branch: Near Indian Overseas Bank, Main Road, Needur - 609203</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-blue-400" />
                <span>+91 8122835737 <br/>
                  +91 8903157201
                </span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-blue-400" />
                <span>support@saidentalmayiladuthurai.com</span>
              </div>
            </div>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:ml-12"
          >
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.2 }}
  className="lg:col-span-2"
>
  <h4 className="text-lg font-semibold mb-4 text-white md:pl-40">Our Services</h4>
  <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
    {serviceData.cards.map((service) => (
      <li key={service.id}>
        <Link
          href={`/servicePage/${service.id}`}
          className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
        >
          {service.title}
        </Link>
      </li>
    ))}
  </ul>
</motion.div>


          {/* Operating Hours & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-white">Operating Hours</h4>
            <div className="text-gray-300 space-y-2 mb-6">
              <p>@Mayiladuthurai</p>
              <div className="flex">
                <span>Everyday:</span>
                <span>4:30 PM - 10:00 PM</span>
              </div>
              <p>@Needur Branch</p>
              <div className="flex">
                <span>Everyday:</span>
                <span>09:00 AM - 3:00 PM</span>
              </div>
            </div>

            <h4 className="text-lg font-semibold mb-4 text-white">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                    target="_blank"
                    rel="noopener noreferrer"
                  className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </ContentContainer>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <ContentContainer className="py-6 px-4 sm:px-0">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} SAI Dental Clinic. All Rights Reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </ContentContainer>
      </div>
    </footer>
  );
};

export default Footer;