import express from "express";
import axios from "axios";
import { COOKIE_NAME } from "../constant.js";
const router = express.Router();

router.get('/', function (req, res) {
    res.setHeader('set-cookie', `${COOKIE_NAME}=; max-age=0`);
    res.redirect('/login');
})

export default router;