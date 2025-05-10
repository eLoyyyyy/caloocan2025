import express from "express";
import axios from "axios";
import { COOKIE_NAME } from "../constant.js";
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

router.get(
    '/:clusterNumber',
    function (req, res, next) {
        const authCookie = req.cookies[COOKIE_NAME];

        if (!authCookie) {
            return res.redirect("/login");
        }

        next();
    },
    async (req, res) => {
        const cookie = req.cookies[COOKIE_NAME];

        const client = axios.create({
        baseURL: process.env.API_HOST,
        params: {
            access_token: cookie,
        },
        });

        const userData = await client.get(`/users/me`, {
            params: {
                "fields[]": "first_name",
            },
        }).catch(error => {
            res.redirect('/login')
        });

        const candidateData = await client.get(`/items/poll_watcher_report`, {
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
            filter: {
                cluster_number: {
                    '_eq': req.params.clusterNumber
                }
            }
        },
        }).catch(error => {
            console.log(error.response.data);
            res.redirect('/login')
        });

        res.render("sites/cluster-form", {
            user: userData.data.data,
            mayors: filter(candidateData.data.data, 'Mayor'),
            viceMayors: filter(candidateData.data.data, 'Vice Mayor'),
            councilors: filter(candidateData.data.data, 'Councilor'),
            congressmen: filter(candidateData.data.data, 'Congressman/Congresswoman')
        });
    }
)

export default router;