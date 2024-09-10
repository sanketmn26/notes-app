const Note = require("../models/Note");
const mongoose = require("mongoose");

// GET dashboard

exports.dashboard = async (req, res) => {
  const locals = {
    title: "Dashboard",
    description: "Free NodeJS Notes App",
  };

  try {
    const notes = await Note.find({});

    res.render("dashboard/dashboard", {
      userName: req.user.firstName,
      locals,
      notes,
      layout: "../views/layouts/dashboard.ejs",
    });
  } catch (error) {
    console.log(error);
  }
};
