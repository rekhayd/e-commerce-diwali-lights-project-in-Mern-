
import React, { useState } from "react";
import "../styles/Cont.css";
import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import { MdLocationOn, MdPhone, MdOutlineEmail } from "react-icons/md";
import SiteNavbar from "../components/SiteNavbar";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/contact", form);
      iziToast.success({
        title: "Success",
        message: res.data.success,
        position: "topRight",
      });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      iziToast.error({
        title: "Error",
        message: err.response?.data?.error || "Something went wrong",
        position: "topRight",
      });
    }
  };

  return (
    <>
      <div className="starfield"></div>
      <div className="fixed-navbar">
        <SiteNavbar />
      </div>

      <div className="contact-page">
        <div className="contact-card">
          <h2 className="contact-title">Contact Us</h2>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                name="name"
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                placeholder="your@gmail.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                name="message"
                rows="4"
                placeholder="Write your message..."
                value={form.message}
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>

      <div className="bottom-contact-info">
        <div className="info-item">
          <MdLocationOn className="info-icon" />
          <span>Noida, UP, India</span>
        </div>
        <div className="info-item">
          <MdPhone className="info-icon" />
          <span>+91 9876543210</span>
        </div>
        <div className="info-item">
          <MdOutlineEmail className="info-icon" />
          <span>rekha80@gmail.com</span>
        </div>
      </div>
    </>
  );
};

export default Contact;
