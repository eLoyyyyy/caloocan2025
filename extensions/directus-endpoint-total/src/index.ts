/// <reference types="@directus/extensions/api.d.ts" />
import { defineEndpoint } from "@directus/extensions-sdk";
import { ForbiddenError } from "@directus/errors";

export default defineEndpoint((router, { database, services, logger }) => {
  router.get("/", async (_req, res) => {
    const info = await database.raw(`
			SELECT
				CANDIDATES_CALOOCAN.full_name,
				SUM(total_vote) as total_votes,
				CANDIDATE_POSITION.position,
    			CANDIDATES_CALOOCAN.district,
    			party_color
			FROM (
			SELECT candidate_id, SUM(number_of_votes) as total_vote
				FROM PRECINCT_147A
				GROUP BY candidate_id
			UNION ALL
			SELECT candidate_id, SUM(number_of_votes) as total_vote
				FROM PRECINCT_147B
				GROUP BY candidate_id
			) precincts
			LEFT JOIN CANDIDATES_CALOOCAN ON precincts.candidate_id = CANDIDATES_CALOOCAN.id
			LEFT JOIN CANDIDATE_POSITION ON CANDIDATES_CALOOCAN.position = CANDIDATE_POSITION.id
			LEFT JOIN PARTY ON CANDIDATES_CALOOCAN.party_id = PARTY.id
			GROUP BY candidate_id
			ORDER BY total_votes;
		`);

    res.json(info);
  });

  router.get("/precincts", async (req, res) => {
    logger.info(req.accountability);

    const result = await database("directus_access")
      .select("collection")
      .leftJoin(
        "directus_policies",
        "directus_access.policy",
        "directus_policies.id"
      )
      .leftJoin(
        "directus_permissions",
        "directus_access.policy",
        "directus_permissions.policy"
      )
      .where("user", req.accountability.user)
      .andWhere("action", "read")
      .andWhere("collection", "LIKE", "PRECINCT%")
      .groupBy("collection");

    res.json({
      precincts: result.map((r) => r.collection),
    });
  });
});
