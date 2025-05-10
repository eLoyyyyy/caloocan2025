import express from "express";
import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { COOKIE_NAME } from '../constant.js'
const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("sites/login");
});

router.post("/", async (req, res) => {
  const client = axios.create({
    baseURL: process.env.API_HOST,
  });
  client.post(`/auth/login`, {
    email: req.body.email,
    password: req.body.password,
  })
  .then(response => {
    res.cookie(COOKIE_NAME, response.data.data.access_token, {
      maxAge: response.data.data.expires,
      httpOnly: true,
    });
    res.redirect("/");
  })
  .catch(error => {
    req.app.locals.message = error.response.data.errors[0].message;
    res.redirect('/login')
  });
});

export default router;
