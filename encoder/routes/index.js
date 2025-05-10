import express from "express";
import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { COOKIE_NAME } from '../constant.js'
const router = express.Router();

/* GET home page. */
router.get(
  "/",
  function (req, res, next) {
    const authCookie = req.cookies[COOKIE_NAME];

    if (!authCookie) {
      return res.redirect("/login");
    }

    next();
  },
  async (req, res, next) => {
    const cookie = req.cookies[COOKIE_NAME];

    const client = axios.create({
      baseURL: process.env.API_HOST,
      params: {
        access_token: cookie,
      },
    });

    const clustersData = await client.get(`/items/clusters`, {
      params: {
        fields: ['cluster_number']
      }
    })
    .catch(error => {
      res.redirect('/login')
    });

    const userData = await client.get(`/users/me`, {
      params: {
        "fields[]": "first_name",
      },
    }).catch(error => {
      res.redirect('/login')
    });

    const clusters = clustersData.data.data.map(d => d.cluster_number).sort();

    res.render("sites/index", {
      user: userData.data.data,
      clusters: clusters,
    });
  }
);

export default router;
