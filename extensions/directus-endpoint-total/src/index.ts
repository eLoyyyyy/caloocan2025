/// <reference types="@directus/extensions/api.d.ts" />
import { defineEndpoint } from "@directus/extensions-sdk";
import { ForbiddenError } from "@directus/errors";

export default defineEndpoint((router, { database, services, logger }) => {
  router.get("/", async (_req, res) => {
    const info = await database.raw(`
			SELECT
          CANDIDATES_CALOOCAN.surname,
          CANDIDATES_CALOOCAN.first_name,
          "CANDIDATE_POSITION".position,
          "CANDIDATES_CALOOCAN".district,
          party_color,
          SUM(number_of_votes) as total_votes
      FROM ballot
      LEFT JOIN CANDIDATES_CALOOCAN ON ballot.candidate_id = CANDIDATES_CALOOCAN.id
      LEFT JOIN CANDIDATE_POSITION ON CANDIDATES_CALOOCAN.position = CANDIDATE_POSITION.id
      LEFT JOIN PARTY ON CANDIDATES_CALOOCAN.party_id = PARTY.id
      GROUP BY candidate_id
      ORDER BY total_votes;
		`);

    res.json(info);
  });

  router.get("/map-turnout", async (req, res) => {
    
  });
});
