import express from "express";
import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("sites/login");
});

router.post("/", async (req, res) => {
  const client = axios.create({
    baseURL: process.env.API_HOST,
  });
  const { data } = await client.post(`/auth/login`, {
    email: req.body.email,
    password: req.body.password,
  });

  res.cookie("directus_session_token", data.data.access_token, {
    maxAge: data.data.expires,
    httpOnly: true,
  });
  res.redirect("/");
});

export default router;
