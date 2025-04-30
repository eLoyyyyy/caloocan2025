import { defineEndpoint } from '@directus/extensions-sdk';

export default defineEndpoint((router, { database }) => {
	router.get('/', async (_req, res) => {
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
		`)

		res.json(info);
	});
});
