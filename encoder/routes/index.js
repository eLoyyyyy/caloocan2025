import express from "express";
import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { COOKIE_NAME } from '../constant.js'
const router = express.Router();

function filter(data, position) {
  return data
    .filter(d => d.candidate_id.position.position === position)
    .map(d => ({
      id: d.id,
      name: d.candidate_id.surname,
      party: d.candidate_id.party_id.party_acronym,
      color: d.candidate_id.party_id.party_color,
      votes: d.number_of_votes
    }))
}

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

    const {
      data: { precincts },
    } = await client.get(`/total/precincts`)
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

    const candidateData = await client.get(`/items/PRECINCT_147A`, {
      params: {
        fields: [
          "id",
          "candidate_id.surname",
          "candidate_id.first_name",
          "candidate_id.position.position",
          "candidate_id.party_id.party_acronym",
          "candidate_id.party_id.party_color",
          "number_of_votes"
        ],
      },
    }).catch(error => {
      res.redirect('/login')
    });

    res.render("sites/index", {
      user: userData.data.data,
      precincts: [],
      mayors: filter(candidateData.data.data, 'Mayor'),
      viceMayors: filter(candidateData.data.data, 'Vice Mayor'),
      councilors: filter(candidateData.data.data, 'Councilor'),
      congressmen: filter(candidateData.data.data, 'Congressman/Congresswoman')
    });
  }
);

export default router;
