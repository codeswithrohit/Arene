import Link from "next/link";
import React, { Fragment } from "react";

export const Home = () => (
  <Fragment>
    <li className="menu-item">
      <Link href="/">Home </Link>
    </li>
   
  </Fragment>
);
export const About = () => (
  <Fragment>
    <li className="menu-item">
      <Link href="/about">About us</Link>
    </li>
  </Fragment>
);
export const Listing = () => (
  <Fragment>
    <li className="menu-item">
      <Link href="/listing-list">Boys</Link>
    </li>
    <li className="menu-item">
      <Link href="/listing-grid">Girls</Link>
    </li>
  
  </Fragment>
);
export const Pages = () => (
  <Fragment>
    <li className="menu-item">
      <Link href="/add-listing">Appartment</Link>
    </li>
    <li>
      <Link href="/products">Builder Floor</Link>
    </li>
    <li>
      <Link href="/product-details">Bunglow</Link>
    </li>
    <li className="menu-item">
      <Link href="/how-work">Office Space</Link>
    </li>
    <li className="menu-item">
      <Link href="/pricing">Go Down</Link>
    </li>
    <li className="menu-item">
      <Link href="/pricing">Land</Link>
    </li>
    <li className="menu-item">
      <Link href="/pricing">Villas</Link>
    </li>
  </Fragment>
);
export const Blog = () => (
  <Fragment>
     <li className="menu-item">
      <Link href="/add-listing">Appartment</Link>
    </li>
    <li>
      <Link href="/products">Builder Floor</Link>
    </li>
    <li>
      <Link href="/product-details">Bunglow</Link>
    </li>
    <li className="menu-item">
      <Link href="/how-work">Office Space</Link>
    </li>
    <li className="menu-item">
      <Link href="/pricing">Go Down</Link>
    </li>
    <li className="menu-item">
      <Link href="/pricing">Land</Link>
    </li>
    <li className="menu-item">
      <Link href="/pricing">Villas</Link>
    </li>
  </Fragment>
);
export const BanQueetHall = () => (
  <Fragment>
    <li className="menu-item">
      <Link href="/contact">Banqueet Hall</Link>
    </li>
  </Fragment>
);
export const CloudKitchen = () => (
  <Fragment>
    <li className="menu-item">
      <Link href="/contact">Cloud Kitchen</Link>
    </li>
  </Fragment>
);
export const LaundryService = () => (
  <Fragment>
    <li className="menu-item">
      <Link href="/contact">Laundry</Link>
    </li>
  </Fragment>
);
export const Contact = () => (
  <Fragment>
    <li className="menu-item">
      <Link href="/contact">Contact</Link>
    </li>
  </Fragment>
);
