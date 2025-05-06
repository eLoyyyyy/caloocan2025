import express from "express";
import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
const router = express.Router();

router.post('/',
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
  
      const data = Object.keys(req.body).map(k => ({
        id: k,
        number_of_votes: Number(req.body[k]),
      }))

      console.log(data);
  
      const response = await client.patch('/items/PRECINCT_147A', data)
      .catch(error => {
        res.redirect('/login')
      });
      console.log({data: response.data});
      res.redirect(303, '/');
    }
);

export default router;