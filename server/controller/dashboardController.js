// GET dashboard

exports.dashboard = async (req, res) => {
  const locals = {
    title: "Dashboard",
    description: "Free NodeJS Notes App",
  };

  res.render("dashboard/dashboard", {
    locals,
    layout: "../views/layouts/dashboard.ejs",
  });
};
