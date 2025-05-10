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
    const info = await database.raw(`
      WITH CandidateRegionalVotes AS (
          SELECT
              cd.surname || ', ' || cd.first_name AS candidate_name,
              pr.psgc,
              pr.barangay_name,
              pr.registered_voters,
              SUM(b.number_of_votes) AS total_votes,
              RANK() OVER (PARTITION BY pr.psgc ORDER BY SUM(b.number_of_votes) DESC) AS region_rank,
              p.position as position_name,
              prt.party_color
          FROM
              "CANDIDATES_CALOOCAN" cd
          JOIN
              ballot b ON cd.id = b.candidate_id
          JOIN
              precincts pr ON b.precinct_id = pr.precinct_id
          JOIN
              "CANDIDATE_POSITION" p ON cd.position = p.id
          JOIN
              "PARTY" prt ON cd.party_id = prt.id
          WHERE
              p.position = 'Mayor'
          GROUP BY
              cd.surname,
              pr.psgc,
              p.position
      ),
      RankedTopCandidate AS (
          SELECT
              psgc,
              barangay_name,
              registered_voters,
              candidate_name,
              party_color,
              total_votes,
              region_rank,
              MAX(CASE WHEN region_rank = 1 THEN total_votes ELSE -1 END) OVER (PARTITION BY psgc) AS top_vote_count_in_region
          FROM
              CandidateRegionalVotes
      )
      SELECT
          psgc,
          barangay_name,
          registered_voters,
          CASE
              WHEN top_vote_count_in_region > 0 THEN candidate_name
              ELSE 'No Candidate with Votes'
          END AS top_candidate_name,
          CASE
              WHEN top_vote_count_in_region > 0 THEN party_color
              ELSE '#808080'
          END AS top_candidate_color
      FROM
          RankedTopCandidate
      WHERE
          region_rank = 1
      ORDER BY
          psgc;
    `);

    res.json(info);
  });
});
