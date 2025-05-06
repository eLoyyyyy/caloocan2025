import express from "express";
import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
const router = express.Router();

/* GET home page. */
router.get(
  "/",
  function (req, res, next) {
    const authCookie = req.cookies["directus_session_token"];

    if (!authCookie) {
      return res.redirect("/login");
    }

    next();
  },
  async (req, res, next) => {
    const cookie = req.cookies["directus_session_token"];

    const client = axios.create({
      baseURL: process.env.API_HOST,
      params: {
        access_token: cookie,
      },
    });

    const {
      data: { precincts },
    } = await client.get(`/total/precincts`);

    const userData = await client.get(`/users/me`, {
      params: {
        "fields[]": "first_name",
      },
    });

    console.log(userData.data);

    const candidateData = await client.get(`/items/PRECINCT_147A`, {
      params: {
        fields: [
          "candidate_id.id",
          "candidate_id.surname",
          "candidate_id.first_name",
          "candidate_id.position.position",
          "candidate_id.party_id.party_acronym",
          "candidate_id.party_id.party_color",
        ],
      },
    });

    console.dir(candidateData.data, { depth: null });

    res.render("sites/index", {
      user: userData.data.data,
      precincts: precincts,
      mayors: [
        {
          id: "1",
          name: "CAÑETE, Richard",
          party: "IND",
          color: "#000000",
        },
        {
          id: "2",
          name: "MALAPITAN, Along",
          party: "NP",
          color: "orangered",
        },
        {
          id: "3",
          name: "TRILLANES, Antonio IV",
          party: "AKSYON",
          color: "#0000aa",
        },
        {
          id: "4",
          name: "MALUNES, Ronnie",
          party: "IND",
          color: "#000000",
        },
        {
          id: "5",
          name: "VILLANUEVA, Danny",
          party: "IND",
          color: "#000000",
        },
      ],
      viceMayors: [
        {
          id: "5",
          name: "VILLANUEVA, Danny",
          party: "IND",
          color: "#000000",
        },
        {
          id: "2",
          name: "MALAPITAN, Along",
          party: "NP",
          color: "orangered",
        },
        {
          id: "3",
          name: "TRILLANES, Antonio IV",
          party: "AKSYON",
          color: "#0000aa",
        },
      ],
      congressmen: [
        {
          id: "5",
          name: "VILLANUEVA, Danny",
          party: "IND",
          color: "#000000",
        },
        {
          id: "2",
          name: "MALAPITAN, Along",
          party: "NP",
          color: "orangered",
        },
        {
          id: "3",
          name: "TRILLANES, Antonio IV",
          party: "AKSYON",
          color: "#0000aa",
        },
      ],
      councilors: [
        {
          id: "5",
          name: "VILLANUEVA, Danny",
          party: "IND",
          color: "#000000",
        },
        {
          id: "2",
          name: "MALAPITAN, Along",
          party: "NP",
          color: "orangered",
        },
        {
          id: "3",
          name: "TRILLANES, Antonio IV",
          party: "AKSYON",
          color: "#0000aa",
        },
      ],
    });
  }
);

export default router;
