const { table, thead, tbody, tr, td, th, p} = van.tags;

function hex2(c) {
  c = Math.round(c);
  if (c < 0) c = 0;
  if (c > 255) c = 255;

  var s = c.toString(16);
  if (s.length < 2) s = "0" + s;

  return s;
}

function color(r, g, b) {
  return "#" + hex2(r) + hex2(g) + hex2(b);
}

function shade(col, light) {
  var r = parseInt(col.substr(1, 2), 16);
  var g = parseInt(col.substr(3, 2), 16);
  var b = parseInt(col.substr(5, 2), 16);

  if (light < 0) {
    r = (1 + light) * r;
    g = (1 + light) * g;
    b = (1 + light) * b;
  } else {
    r = (1 - light) * r + light * 255;
    g = (1 - light) * g + light * 255;
    b = (1 - light) * b + light * 255;
  }

  return color(r, g, b);
}

const Councilors = (top6Councilors) => {
  1;
  return table(
    { class: "tb-councilor" },
    thead(tr(th("CANDIDATE"), th("VOTES"))),
    tbody(
      top6Councilors.map((c) =>
        tr(
          {
            style: `/*--background: ${shade(
              c.party_color,
              0.731
            )};--width: 25%;*/--winnerPartyColor: ${c.party_color};`,
          },
          td({ title: c.total_votes }, c.surname, ', ', c.first_name),
          td(c.total_votes)
        )
      )
    )
  );
};

fetch("http://localhost:8055/total").then(async (response) => {
  timeCheck()
  if (!response.ok) {
    console.error(`Response status: ${response.status}`);
    return;
  }

  const json = await response.json();
  mayorData.val = processData(json, "Mayor");
  viceMayorData.val = processData(json, "Vice Mayor");
  congressman1.val = processData(json, "Congressman/Congresswoman");
  congressman2.val = processData(json, "Congressman/Congresswoman");
  congressman3.val = processData(json, "Congressman/Congresswoman");

  const d1Councilors = getTop6CouncilorPerDistrict(json, 1, "Councilor");
  const d2Councilors = getTop6CouncilorPerDistrict(json, 2, "Councilor");
  const d3Councilors = getTop6CouncilorPerDistrict(json, 3, "Councilor");

  const d1Congressman = getCongressmenPerDistrict(
    json,
    1,
    "Congressman/Congresswoman"
  );
  const d2Congressman = getCongressmenPerDistrict(
    json,
    2,
    "Congressman/Congresswoman"
  );
  const d3Congressman = getCongressmenPerDistrict(
    json,
    3,
    "Congressman/Congresswoman"
  );

  van.add(document.getElementById("councilorD1"), Councilors(d1Councilors));
  van.add(document.getElementById("councilorD2"), Councilors(d2Councilors));
  van.add(document.getElementById("councilorD3"), Councilors(d3Councilors));

  van.add(document.getElementById("congressman1"), Councilors(d1Congressman));
  van.add(document.getElementById("congressman2"), Councilors(d2Congressman));
  van.add(document.getElementById("congressman3"), Councilors(d3Congressman));
});

function getCongressmenPerDistrict(data, district, position) {
  const toSort = data;
  return toSort
    .filter((d) => d.district === district && d.position === position)
    .sort((a, b) => a.total_votes > b.total_votes)
    .reverse()
    .slice(0, 2);
}

function getTop6CouncilorPerDistrict(data, district, position) {
  const toSort = data;
  return toSort
    .filter((d) => d.district === district && d.position === position)
    .sort((a, b) => a.total_votes > b.total_votes)
    .reverse()
    .slice(0, 6);
}

function processData(data, position) {
  const toProcess = data;
  const [first, second, ...everyoneElse] = toProcess
    .filter((candidate) => candidate.position === position)
    .sort((a, b) => a.total_votes > b.total_votes)
    .reverse();

  return [
    {
      label: `${first.surname}, ${first.first_name}`,
      value: first.total_votes,
      color: first.party_color,
    },
    {
      label: "",
      value: everyoneElse.reduce((a, c) => {
        a = a + c.total_votes + 1;
        return a;
      }, 0),
    },
    {
      label: `${second.surname}, ${second.first_name}`,
      value: second.total_votes,
      color: second.party_color,
    },
  ];
}


function timeCheck() {
  const dateNow = new Date();
  van.add(document.getElementById("pollingTime"), p({class: "comelecDeclaration"}, "Poll as of " + dateNow.toLocaleString()))
}