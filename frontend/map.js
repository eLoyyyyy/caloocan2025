const { div, h5, h6, hr } = van.tags;

const Popover = () => {
  return div(
    { class: "popover" },
    div(
      h5({class: "popupH6"},"Barangay ", barangayStats.barangay_name),
      p({class: "popupSubtext"}, "Registered voters: ", barangayStats.registered_voters)
    )
  );
};

// tbody(
//   [{ barangay_name: "139", registered_voters: 4556, party_color: "123" }].map(
//     (c) => tr(
//       {
//         style: `/*--background: ${shade(
//           c.party_color,
//           0.731
//         )};--width: 25%;*/--winnerPartyColor: ${c.party_color};`,
//       },
//       //td({ title: c.total_votes }, c.full_name),
//       //td(c.total_votes)
//       th({title: "Barangay" + c.barangay_name}, "Barangay " + c.barangay_name),
//     )
//   )
// )


document.getElementById("caloocan-map").addEventListener("load", function (event) {
  svgPanZoom("#caloocan-map", {
    zoomEnabled: true,
    controlIconsEnabled: true,
    fit: true,
    center: true,
    // viewportSelector: document.getElementById('demo-tiger').querySelector('#g4')
    // this option will make library to misbehave. Viewport should have no transform attribute
  });
  fetch('http://localhost:8055/total/map-turnout')
    .then(async response => {
      if (!response.ok) {
        console.error(`Response status: ${response.status}`);
        return;
      }

      const json = await response.json();
      const element = document.getElementById("caloocan-map");

      for (const data of json) {
        element.style.setProperty(`--${data.psgc}`, data.top_candidate_color);
        popupDataMap.val[data.psgc] = data;
      }

      console.log(json);
    })
});

const popupDataMap = van.state({});
const currentBrgy = van.state('');
van.add(document.getElementById("barangayStats"), Popover());

const popover = document.querySelectorAll(".popover")[0];

document.addEventListener("mousemove", fn, false);
document.addEventListener("mouseout", function (event) {
  if (event.target.classList.contains("map-brgys")) {
    popover.style.display = "none";
    currentBrgy.val = '';
  }
});
document.addEventListener("mouseenter", function (event) {
  if (event.target.classList.contains("map-brgys")) {
    popover.style.display = "block";
    currentBrgy.val = event.target.id;
  }
});

function fn(e) {
  if (e.target.classList.contains("map-brgys")) {
    popover.style.display = "block";
    popover.style.left = e.pageX + "px";
    popover.style.top = e.pageY + "px";
    currentBrgy.val = e.target.id;
  }
}
